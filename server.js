import express from 'express';
import Parser from 'rss-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Agar .env use karna ho to

// --- SETUP ---
const app = express();
const parser = new Parser();
dotenv.config();

// Current Directory Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// --- 1. MONGODB CONNECTION 🔗 ---
const MONGO_URI = "mongodb+srv://FAISAL:MAAD@cluster0.ftl5jci.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- 2. DATABASE MODELS ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});
const User = mongoose.model('User', userSchema);

const noteSchema = new mongoose.Schema({
    subject: String,
    topic: String,
    date: String,
    fileName: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const blogSchema = new mongoose.Schema({
    title: String,
    category: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogSchema);

// --- 3. MULTER CONFIG ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-')) // Spaces hata diye filename se
});
const upload = multer({ storage });

// Serve Uploads Folder Publicly (Zaroori hai download ke liye)
app.use('/uploads', express.static(uploadDir));


// --- ROUTES ---

// Admin Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username already exists" });
        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ success: true, message: "Account created!" });
    } catch (error) { res.status(500).json({ error: "Server Error" }); }
});

// Admin Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        res.json({ success: true, message: "Login Successful" });
    } catch (error) { res.status(500).json({ error: "Server Error" }); }
});

// Upload Note
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const newNote = new Note({
            subject: req.body.subject,
            topic: req.body.topic,
            author: req.body.author || "Anonymous",
            date: new Date().toLocaleDateString(),
            fileName: req.file.filename
        });

        await newNote.save();
        res.json({ success: true, file: req.file });
    } catch (error) { res.status(500).json({ error: "Upload failed" }); }
});

// ➤ 🔥 UPDATED: Get All Notes (With Download Link)

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        
        // Notes ke saath Full URL jod kar bhejo
        const updatedNotes = notes.map(note => {
            return {
                ...note._doc, // Purana data
                // URL banao: https://your-site.onrender.com/uploads/filename.pdf
                downloadLink: `${req.protocol}://${req.get('host')}/uploads/${note.fileName}`
            };
        });

        res.json(updatedNotes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});
// Post Blog
app.post('/api/blogs', async (req, res) => {
    try {
        const { title, category, content, author } = req.body; 
        const newBlog = new Blog({ title, category, content, author: author || "Anonymous" });
        await newBlog.save();
        res.json({ success: true, message: "Blog published!" });
    } catch (error) { res.status(500).json({ error: "Failed to publish blog" }); }
});

// Get Blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (error) { res.status(500).json({ error: "Failed to fetch blogs" }); }
});

// Google News
app.get('/api/news', async (req, res) => {
    try {
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=Supreme+Court+of+India+Legal+News&hl=en-IN&gl=IN&ceid=IN:en');
        const news = feed.items.slice(0, 6).map(item => ({
            title: item.title,
            link: item.link,
            date: item.pubDate,
        }));
        res.json(news);
    } catch (error) { res.json([{ title: "Check Backend Console", link: "#" }]); }
});


// ➤ DELETE ROUTES

// Delete Blog
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
        res.json({ success: true, message: "Blog Deleted Successfully" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ➤ 🔥 UPDATED: Delete Note (Also deletes file from folder)
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Database se note dhundo
        const noteToDelete = await Note.findById(id);
        if (!noteToDelete) return res.status(404).json({ error: "Note not found" });

        // 2. Uploads folder se file uda do
        const filePath = path.join(uploadDir, noteToDelete.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // File delete
        }

        // 3. Database se entry uda do
        await Note.findByIdAndDelete(id);

        res.json({ success: true, message: "Note & File Deleted Successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));