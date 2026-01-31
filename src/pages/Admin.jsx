import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, PenTool, LogOut, Trash2, FolderOpen, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor'; 
import { useLocation, useNavigate } from 'react-router-dom'; // 🔥 NEW IMPORTS

const Admin = () => {
  // --- STATE VARIABLES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(""); 
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); 

  // Manage Data State
  const [allNotes, setAllNotes] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Auth Inputs (Updated for Email & Strong Pass)
  const [username, setUsername] = useState(""); // Full Name (Only for Signup)
  const [email, setEmail] = useState("");       // 🔥 NEW: Email for Login
  const [password, setPassword] = useState("");

  // Upload & Blog Inputs
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("General");
  const [blogContent, setBlogContent] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Router Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // --- RESPONSIVE CHECK ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 1. AUTO-LOGIN & GOOGLE CALLBACK HANDLE ---
  useEffect(() => {
    // A. Check Local Storage
    const savedUser = localStorage.getItem("lawUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
    }

    // B. Check URL Query (Google se wapas aane par)
    const query = new URLSearchParams(location.search);
    const loginStatus = query.get('login');
    const googleUser = query.get('user');

    if (loginStatus === 'success' && googleUser) {
        const decodedUser = decodeURIComponent(googleUser);
        localStorage.setItem("lawUser", decodedUser);
        setCurrentUser(decodedUser);
        setIsAuthenticated(true);
        // URL saaf karo taaki refresh pe dikkat na ho
        navigate('/admin', { replace: true });
    }
  }, [location, navigate]);

  // --- FETCH DATA ---
  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage') {
        fetch('https://musab-law-ledger.onrender.com/api/blogs')
            .then(res => res.json())
            .then(data => setAllBlogs(data));
        
        fetch('https://musab-law-ledger.onrender.com/api/notes')
            .then(res => res.json())
            .then(data => setAllNotes(data))
            .catch(err => console.log("Notes fetch error"));
    }
  }, [isAuthenticated, activeTab, refreshKey]);

  // --- HANDLERS ---

  // 🔥 GOOGLE LOGIN BUTTON HANDLER
  const handleGoogleLogin = () => {
    // Live Backend URL
    window.open("https://musab-law-ledger.onrender.com/auth/google", "_self");
  };

  const handleAuth = async () => {
    // Basic Fields Check
    if (!email || !password || (!isLoginMode && !username)) return alert("Please fill all fields");

    // 🔥 STRONG PASSWORD LOGIC
    if (!isLoginMode) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return alert("⚠️ Password too weak! Must have at least 6 chars, including letters & numbers.");
        }
    }

    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    
    // Login ke liye 'email' ko username field me bhej rahe hain (Backend logic ke hisaab se)
    // Signup ke liye teeno bhej rahe hain
    const payload = isLoginMode 
        ? { username: email, password } 
        : { username, email, password };

    try {
      const response = await fetch(`https://musab-law-ledger.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        if (isLoginMode) {
          // Login Success
          const userDisplayName = data.user || email; // Backend se user name mile to wo, nahi to email
          localStorage.setItem("lawUser", userDisplayName); 
          setCurrentUser(userDisplayName);
          setIsAuthenticated(true);
        } else {
          // Signup Success
          alert("✅ Account Created! Please Login.");
          setIsLoginMode(true);
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Server Error.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lawUser");
    setIsAuthenticated(false);
    setCurrentUser("");
    // Optional: Backend logout endpoint hit karna ho to
    // fetch('https://musab-law-ledger.onrender.com/api/logout');
  };

  const handleDelete = async (type, id) => {
    if(!window.confirm("Are you sure you want to delete this?")) return;
    const endpoint = type === 'blog' ? `/api/blogs/${id}` : `/api/notes/${id}`;
    
    try {
        const res = await fetch(`https://musab-law-ledger.onrender.com${endpoint}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            alert(type === 'blog' ? "Blog Deleted!" : "Note Deleted!");
            setRefreshKey(prev => prev + 1);
        } else {
            alert("Failed to delete.");
        }
    } catch (error) {
        alert("Server Error during deletion.");
    }
  };

  const handleUpload = async () => {
    if (!file || !subject || !topic) return alert("Select file & details");
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('topic', topic);
    formData.append('author', currentUser);
    try {
      const response = await fetch('https://musab-law-ledger.onrender.com/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        alert("✅ Uploaded!");
        setSubject(""); setTopic(""); setFile(null);
        document.getElementById('fileInput').value = "";
      } else alert("Fail: " + data.error);
    } catch (e) { alert("Error"); } finally { setUploading(false); }
  };

  const handleBlogSubmit = async () => {
    if (!blogTitle || !blogContent) return alert("Required fields missing");
    try {
        const response = await fetch('https://musab-law-ledger.onrender.com/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: blogTitle, category: blogCategory, content: blogContent, author: currentUser })
        });
        const data = await response.json();
        if (data.success) {
            alert("🔥 Blog Published!");
            setBlogTitle(""); setBlogContent("");
        }
    } catch (e) { alert("Error"); }
  };

  // --- RENDER 1: LOGIN SCREEN (Updated UI) ---
  if (!isAuthenticated) {
    return (
      <div style={{ 
          minHeight: '100vh', 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#020c1b', 
          position: 'relative', 
          zIndex: 1000,
          padding: '20px'
      }}>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
                background: 'rgba(17, 34, 64, 0.9)', 
                padding: isMobile ? '30px 20px' : '50px', 
                borderRadius: '16px', 
                border: '1px solid #64ffda', 
                width: '100%', 
                maxWidth: '400px', 
                textAlign: 'center',
                boxShadow: '0 0 30px rgba(100, 255, 218, 0.1)'
            }}>
          <div style={{ marginBottom: '20px', color: '#64ffda' }}>
            <User size={48} />
          </div>
          <h2 style={{ color: '#e6f1ff', marginBottom: '10px' }}>{isLoginMode ? "Welcome Back" : "Join LawLedger"}</h2>
          <p style={{ color: '#8892b0', marginBottom: '30px', fontSize: '0.9rem' }}>Access your dashboard</p>
          
          {/* Sign Up Mode: Ask for Name */}
          {!isLoginMode && (
              <input type="text" placeholder="Full Name" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
          )}

          {/* Email Input (Login/Signup) */}
          <input type="email" placeholder="Email Address" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
          
          {/* Password Input (Strong Validation) */}
          <input type="password" placeholder="Password (Chars + Digits)" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <button onClick={handleAuth} style={{ ...btnStyle, width: '100%', marginTop: '10px', background: isLoginMode ? '#64ffda' : '#ffc107', color: '#000' }}>
              {isLoginMode ? "Login" : "Sign Up"}
          </button>

          {/* GOOGLE SIGN IN BUTTON */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#8892b0' }}>
              <div style={{ flex: 1, height: '1px', background: '#233554' }}></div>
              <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#233554' }}></div>
          </div>

          <button onClick={handleGoogleLogin} style={{ 
              ...btnStyle, 
              background: '#fff', 
              color: '#333', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              width: '100%'
          }}>
              {/* Google G Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
          </button>
          
          <p style={{ marginTop: '20px', color: '#8892b0', cursor:'pointer', fontSize: '0.9rem', textDecoration: 'underline' }} onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? "New here? Create Account" : "Already have an account? Login"}
          </p>
        </motion.div>
      </div>
    );
  }

  // --- RENDER 2: DASHBOARD (Full Responsive) ---
  return (
    <>
      <CustomCursor />
      <Navbar />
      <div style={{ 
          width: '100%', 
          minHeight: '100vh', 
          background: '#020c1b', 
          paddingTop: isMobile ? '100px' : '140px', 
          paddingBottom: '50px', 
          paddingLeft: isMobile ? '15px' : '20px',
          paddingRight: isMobile ? '15px' : '20px',
          boxSizing: 'border-box'
      }}>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            
            {/* Header Area */}
            <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                marginBottom: '40px',
                gap: '20px'
            }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#e6f1ff', margin: 0, fontWeight: 'bold' }}>
                        Hello, <span style={{ color: '#64ffda' }}>{currentUser}</span>
                    </h1>
                    <p style={{color: '#8892b0', marginTop: '5px'}}>Dashboard & Control Panel</p>
                </div>
                <button onClick={handleLogout} style={{ 
                    background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', color: '#ff4d4d', 
                    padding: '10px 20px', borderRadius: '8px', cursor:'pointer', 
                    display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold',
                    width: isMobile ? '100%' : 'auto', justifyContent: 'center'
                }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Navigation Tabs (Grid Layout for Mobile) */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                gap: '15px', 
                marginBottom: '30px' 
            }}>
                <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<Upload size={18}/>}>Upload Notes</TabButton>
                <TabButton active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon={<PenTool size={18}/>}>Write Blog</TabButton>
                <TabButton active={activeTab === 'manage'} onClick={() => setActiveTab('manage')} icon={<FolderOpen size={18}/>}>Manage Content</TabButton>
            </div>

            {/* --- UPLOAD SECTION --- */}
            {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h3 style={sectionHeadStyle}>📂 Upload New Notes</h3>
                
                <label style={labelStyle}>Subject Name</label>
                <input type="text" placeholder="Ex: Constitutional Law" style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} />
                
                <label style={labelStyle}>Topic Description</label>
                <input type="text" placeholder="Ex: Fundamental Rights Notes" style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} />
                
                <div style={fileUploadBoxStyle}>
                    <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ color: '#e6f1ff', width: '100%' }} />
                </div>
                
                <button onClick={handleUpload} disabled={uploading} style={btnStyle}>
                    {uploading ? "Uploading..." : "Upload File 🚀"}
                </button>
            </motion.div>
            )}

            {/* --- BLOG SECTION --- */}
            {activeTab === 'blog' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h3 style={{...sectionHeadStyle, color: '#ffc107'}}>✍️ Write Article</h3>
                
                <label style={labelStyle}>Headline</label>
                <input type="text" placeholder="Ex: AI Laws in India" style={inputStyle} value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}>
                    <option>General</option><option>Criminal Law</option><option>Corporate</option><option>Tech & AI</option>
                </select>
                
                <label style={labelStyle}>Content</label>
                <textarea 
                    rows="10" 
                    placeholder="Start typing your legal insights..." 
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '150px', lineHeight: '1.6' }} 
                    value={blogContent} 
                    onChange={(e) => setBlogContent(e.target.value)} 
                />
                
                <button onClick={handleBlogSubmit} style={{ ...btnStyle, background: '#ffc107', color: '#000' }}>Publish Article 🔥</button>
            </motion.div>
            )}

            {/* --- MANAGE CONTENT SECTION --- */}
            {activeTab === 'manage' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h3 style={sectionHeadStyle}>🗑️ Manage Your Content</h3>
                <p style={{ color: '#8892b0', marginBottom: '30px', fontSize: '0.9rem' }}>
                    You can only delete items uploaded by <strong>{currentUser}</strong>.
                </p>
                
                {/* 1. FILTERED BLOGS LIST */}
                <h4 style={{ color: '#ffc107', marginTop: '20px', borderBottom: '1px solid #233554', paddingBottom: '10px' }}>Your Blogs</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    {allBlogs.filter(blog => blog.author === currentUser).length === 0 ? (
                        <p style={{color:'#8892b0', fontStyle:'italic'}}>No blogs found.</p>
                    ) : (
                        allBlogs.filter(blog => blog.author === currentUser).map((blog) => (
                            <div key={blog._id} style={itemStyle}>
                                <div style={{ overflow: 'hidden', marginRight: '10px' }}>
                                    <span style={{ color: '#e6f1ff', fontWeight: 'bold', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {blog.title}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#8892b0' }}>{new Date(blog.date).toLocaleDateString()}</span>
                                </div>
                                <button onClick={() => handleDelete('blog', blog._id)} style={deleteBtnStyle}><Trash2 size={20}/></button>
                            </div>
                        ))
                    )}
                </div>

                {/* 2. FILTERED NOTES LIST */}
                <h4 style={{ color: '#64ffda', marginTop: '40px', borderBottom: '1px solid #233554', paddingBottom: '10px' }}>Your Uploaded Notes</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    {allNotes.filter(note => note.author === currentUser).length === 0 ? (
                        <p style={{color:'#8892b0', fontStyle:'italic'}}>No notes found.</p>
                    ) : (
                        allNotes.filter(note => note.author === currentUser).map((note) => (
                            <div key={note._id} style={itemStyle}>
                                <div style={{ overflow: 'hidden', marginRight: '10px' }}>
                                    <span style={{ color: '#e6f1ff', fontWeight: 'bold', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {note.subject}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#8892b0' }}>{note.topic}</span>
                                </div>
                                <button onClick={() => handleDelete('note', note._id)} style={deleteBtnStyle}><Trash2 size={20}/></button>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
            )}
        
        </div>
      </div>
    </>
  );
};

// --- STYLES (Refined for Responsiveness & z-index) ---

const inputStyle = { 
    width: '100%', padding: '15px', background: '#0a192f', border: '1px solid #233554', 
    color: 'white', borderRadius: '8px', marginBottom: '20px', 
    fontFamily: 'Space Mono, monospace', boxSizing: 'border-box',
    fontSize: '16px', 
    position: 'relative', zIndex: 2000, cursor: 'text' 
};

const labelStyle = { display: 'block', color: '#8892b0', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' };

const btnStyle = { 
    padding: '15px 30px', background: '#64ffda', color: '#020c1b', 
    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', 
    fontFamily: 'Space Mono, monospace', fontSize: '1rem', width: '100%',
    position: 'relative', zIndex: 2000 
};

const cardStyle = { 
    background: 'rgba(17, 34, 64, 0.6)', padding: '30px', borderRadius: '16px', 
    border: '1px solid rgba(100,255,218,0.1)', backdropFilter: 'blur(10px)',
    width: '100%', boxSizing: 'border-box'
};

const sectionHeadStyle = {
    color: '#64ffda', marginBottom: '25px', display:'flex', alignItems:'center', gap:'10px', fontSize: '1.5rem'
};

const fileUploadBoxStyle = {
    margin: '25px 0', border: '2px dashed #233554', padding: '30px', 
    borderRadius: '12px', textAlign: 'center', background: 'rgba(2, 12, 27, 0.5)',
    position: 'relative', zIndex: 2000
};

const itemStyle = { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    background: 'rgba(2, 12, 27, 0.8)', padding: '15px', borderRadius: '8px', 
    border: '1px solid #233554' 
};

const deleteBtnStyle = { 
    background: 'rgba(255, 77, 77, 0.1)', border: 'none', color: '#ff4d4d', 
    cursor: 'pointer', padding: '8px', borderRadius: '5px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 2000 
};

const TabButton = ({ active, onClick, children, icon }) => (
  <button onClick={onClick} style={{ 
      display: 'flex', gap: '10px', padding: '15px', 
      background: active ? 'rgba(100, 255, 218, 0.1)' : 'transparent', 
      border: active ? '1px solid #64ffda' : '1px solid #233554', 
      color: active ? '#64ffda' : '#8892b0', 
      cursor: 'pointer', borderRadius: '8px', alignItems:'center', 
      fontWeight: 'bold', justifyContent: 'center',
      position: 'relative', zIndex: 2000,
      width: '100%'
  }}>
      {icon} {children}
  </button>
);

export default Admin;