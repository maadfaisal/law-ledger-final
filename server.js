import express from 'express';
import Parser from 'rss-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'; // <-- MONGODB DRIVER

// --- SETUP ---
const app = express();
const parser = new Parser();

// Aisa kuch likha hoga upar:


// Current Directory Fix (ES Modules ke liye)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: "*", // Frontend ka URL
    methods: ["GET", "POST", "PUT", "DELETE"], // 🔥 Yahan humne DELETE allow kiya
    credentials: true
}));
app.use(express.json());

// --- 1. MONGODB CONNECTION 🔗 ---
// Agar Atlas use kar rahe ho to wahan ka URL daalna. 
// Abhi Localhost set hai.
const MONGO_URI = "mongodb+srv://FAISAL:MAAD@cluster0.ftl5jci.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
    useNewUrlParser: true;
    useUnifiedTopology: true;

// --- 2. DATABASE MODELS (SCHEMAS) 📝 ---

// A. Admin User Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});
const User = mongoose.model('User', userSchema);

// B. Notes Model (Ab files ka record yahan save hoga)
const noteSchema = new mongoose.Schema({
    subject: String,
    topic: String,
    date: String,
    fileName: String,
    author: String, // <--- 🔥 NEW: Ye batayega kisne upload kiya
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const blogSchema = new mongoose.Schema({
    title: String,
    category: String,
    content: String,
    author: String, // <--- Ye ab User ka naam store karega
    date: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogSchema);


// --- 3. MULTER CONFIG (File Upload) 📂 ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));


// --- ROUTES ---

// ➤ ROUTE 1: Admin Registration (Sign Up)
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check duplicate user
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username already exists" });

        // Save New User
        const newUser = new User({ username, password });
        await newUser.save();

        console.log("👤 New Admin Created:", username);
        res.json({ success: true, message: "Account created!" });

    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ➤ ROUTE 2: Admin Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Simple Password Check (Production me bcrypt use karna chahiye)
        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        res.json({ success: true, message: "Login Successful" });

    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.post('/api/blogs', async (req, res) => {
    try {
        // Frontend se 'author' bhi aayega ab
        const { title, category, content, author } = req.body; 
        
        const newBlog = new Blog({ 
            title, 
            category, 
            content, 
            author: author || "Anonymous" // Agar naam nahi aaya to Anonymous
        });
        
        await newBlog.save();
        res.json({ success: true, message: "Blog published!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to publish blog" });
    }
});
// ➤ ROUTE 3: Upload Note (Save to MongoDB)
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const newNote = new Note({
            subject: req.body.subject,
            topic: req.body.topic,
            author: req.body.author || "Anonymous", // <--- 🔥 Backend ab Author save karega
            date: new Date().toLocaleDateString(),
            fileName: req.file.filename
        });

        await newNote.save();
        res.json({ success: true, file: req.file });
    } catch (error) {
        res.status(500).json({ error: "Upload failed" });
    }
});

// ➤ ROUTE 4: Get All Notes (Fetch from MongoDB)
app.get('/api/notes', async (req, res) => {
    try {
        // Database se saare notes maango (Latest pehle)
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

// ➤ ROUTE 5: Google News (Live Feed)
app.get('/api/news', async (req, res) => {
    try {
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=Supreme+Court+of+India+Legal+News&hl=en-IN&gl=IN&ceid=IN:en');
        const news = feed.items.slice(0, 6).map(item => ({
            title: item.title,
            link: item.link,
            date: item.pubDate,
            source: item.contentSnippet || "Google News"
        }));
        res.json(news);
    } catch (error) {
        res.json([{ title: "Server Error: Backend Check Karo", link: "#" }]);
    }
});
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }); // Latest first
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});


// ... (Upar ka saara code waisa hi rehne do)

// ➤ DELETE ROUTES (Inhein sabse neeche rakho, app.listen se pehle)

// 1. Delete Blog
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting Blog ID:", id); // Terminal mein ID dikhegi

        // Pehle check karo model defined hai ya nahi
        if (!Blog) throw new Error("Blog Model is not defined");

        const deletedBlog = await Blog.findByIdAndDelete(id);
        
        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found (Already deleted?)" });
        }

        res.json({ success: true, message: "Blog Deleted Successfully" });
    } catch (error) {
        console.error("🔥 DELETE ERROR:", error.message); // Asli error yahan chap jayega
        res.status(500).json({ error: error.message });
    }
});

// 2. Delete Note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting Note ID:", id);

        if (!Note) throw new Error("Note Model is not defined");

        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.json({ success: true, message: "Note Deleted Successfully" });
    } catch (error) {
        console.error("🔥 DELETE ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Start Server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`🚀 Server running`));