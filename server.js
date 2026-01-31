import express from 'express';
import Parser from 'rss-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// --- SETUP ---
dotenv.config();
const app = express();
const parser = new Parser();

// Current Directory Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇👇👇 IMPORTANT: YAHAN APNA LIVE FRONTEND LINK DALO (Jaise Vercel/Netlify) 👇👇👇
// Agar link nahi pata, to filhal '*' rakh sakte ho, par production ke liye link best hai.
const FRONTEND_URL = "https://law-ledger-final.vercel.app/"; // ⚠️ ISSE EDIT KARKE APNA SAHI LINK DALO

// --- 1. MIDDLEWARE & SESSION ---
app.use(cors({
    origin: [FRONTEND_URL], // Live aur Local dono allow kiye taaki error na aaye
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'lawledger_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Note: Production me agar HTTPS hai to ise true kar dena chahiye
}));

app.use(passport.initialize());
app.use(passport.session());

// --- 2. MONGODB CONNECTION 🔗 ---
const MONGO_URI = "mongodb+srv://FAISAL:MAAD@cluster0.ftl5jci.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- 3. DATABASE MODELS ---

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    googleId: { type: String },
    authType: { type: String, default: 'local' },
    createdAt: { type: Date, default: Date.now }
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

// --- 4. PASSPORT GOOGLE STRATEGY ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // 👇 Backend URL (Render Wala)
    callbackURL: "https://musab-law-ledger.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                authType: 'google'
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});

// --- 5. MULTER CONFIG ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));


// --- ROUTES ---

// ➤ AUTH ROUTES (Google)

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔥 FIXED: Callback Redirect
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    // 👇 AB YE LOCALHOST PAR NAHI, LIVE SITE PAR BHEJEGA
    res.redirect(`${FRONTEND_URL}/admin?login=success&user=${encodeURIComponent(req.user.username)}`);
  }
);

app.get('/api/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(FRONTEND_URL); // Logout ke baad bhi Live Site par bhejo
    });
});

app.get('/api/current_user', (req, res) => {
    res.send(req.user);
});


// ➤ API ROUTES

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must have 6+ chars, numbers & letters." });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const newUser = new User({ username, email, password, authType: 'local' });
        await newUser.save();
        res.json({ success: true, message: "Account created!" });
    } catch (error) { res.status(500).json({ error: "Server Error" }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ 
            $or: [{ email: username }, { username: username }] 
        });

        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        res.json({ success: true, message: "Login Successful", user: user.username });
    } catch (error) { res.status(500).json({ error: "Server Error" }); }
});

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

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        const updatedNotes = notes.map(note => ({
            ...note._doc,
            // Live Backend URL for Download
            downloadLink: `${req.protocol}://${req.get('host')}/uploads/${note.fileName}`
        }));
        res.json(updatedNotes);
    } catch (error) { res.status(500).json({ error: "Failed to fetch notes" }); }
});

app.post('/api/blogs', async (req, res) => {
    try {
        const { title, category, content, author } = req.body; 
        const newBlog = new Blog({ title, category, content, author: author || "Anonymous" });
        await newBlog.save();
        res.json({ success: true, message: "Blog published!" });
    } catch (error) { res.status(500).json({ error: "Failed to publish blog" }); }
});

app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (error) { res.status(500).json({ error: "Failed to fetch blogs" }); }
});

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
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
        res.json({ success: true, message: "Blog Deleted Successfully" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const noteToDelete = await Note.findById(id);
        if (!noteToDelete) return res.status(404).json({ error: "Note not found" });

        const filePath = path.join(uploadDir, noteToDelete.fileName);
        if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }

        await Note.findByIdAndDelete(id);
        res.json({ success: true, message: "Note & File Deleted Successfully" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Start Server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));