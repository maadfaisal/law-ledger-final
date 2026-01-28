import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Upload, PenTool, LogOut, Trash2, FolderOpen } from 'lucide-react'; // Trash2 icon import kiya
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor'; 

const Admin = () => {
  // --- STATE VARIABLES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(""); 
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // Tabs: 'notes', 'blog', 'manage'

  // Manage Data State (Delete karne ke liye)
  const [allNotes, setAllNotes] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // List refresh karne ke liye

  // Auth Inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Upload Inputs
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Blog Inputs
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("General");
  const [blogContent, setBlogContent] = useState("");

  // --- AUTO-LOGIN ---
  useEffect(() => {
    const savedUser = localStorage.getItem("lawUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // --- FETCH DATA FOR MANAGE TAB ---
  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage') {
        // Blogs lao
        fetch('http://localhost:5000/api/blogs')
            .then(res => res.json())
            .then(data => setAllBlogs(data));
        
        // Notes lao (Assuming /api/notes endpoint exists for fetching all)
        fetch('http://localhost:5000/api/notes')
            .then(res => res.json())
            .then(data => setAllNotes(data))
            .catch(err => console.log("Notes fetch error, maybe route missing?"));
    }
  }, [isAuthenticated, activeTab, refreshKey]);

  // --- HANDLERS ---
  const handleAuth = async () => {
    if (!username || !password) return alert("Please fill all fields");
    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        if (isLoginMode) {
          localStorage.setItem("lawUser", username); 
          setCurrentUser(username);
          setIsAuthenticated(true);
        } else {
          alert("Account Created! Please Login.");
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
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (type, id) => {
    if(!window.confirm("Are you sure you want to delete this?")) return;

    const endpoint = type === 'blog' ? `/api/blogs/${id}` : `/api/notes/${id}`;
    
    try {
        const res = await fetch(`http://localhost:5000${endpoint}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            alert(type === 'blog' ? "Blog Deleted!" : "Note Deleted!");
            setRefreshKey(prev => prev + 1); // List refresh karo
        } else {
            alert("Failed to delete.");
        }
    } catch (error) {
        alert("Server Error during deletion.");
    }
  };

  // --- UPLOAD HANDLER ---
  const handleUpload = async () => {
    if (!file || !subject || !topic) return alert("Select file & details");
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('topic', topic);
    formData.append('author', currentUser);
    try {
      const response = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        alert("✅ Uploaded!");
        setSubject(""); setTopic(""); setFile(null);
        document.getElementById('fileInput').value = "";
      } else alert("Fail: " + data.error);
    } catch (e) { alert("Error"); } finally { setUploading(false); }
  };

  // --- BLOG HANDLER ---
  const handleBlogSubmit = async () => {
    if (!blogTitle || !blogContent) return alert("Required fields missing");
    try {
        const response = await fetch('http://localhost:5000/api/blogs', {
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

  // --- RENDER 1: LOGIN ---
  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020c1b', position: 'relative', zIndex: 1000 }}>
        <div style={{ background: 'rgba(17, 34, 64, 0.8)', padding: '40px', borderRadius: '12px', border: '1px solid #64ffda', width: '350px', textAlign: 'center' }}>
          <h2 style={{ color: '#e6f1ff', marginBottom: '20px' }}>{isLoginMode ? "Login" : "Join Us"}</h2>
          <input type="text" placeholder="Username" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleAuth} style={{ ...btnStyle, width: '100%', marginTop: '20px', background: isLoginMode ? '#64ffda' : '#ffc107', color: '#000' }}>{isLoginMode ? "Login" : "Sign Up"}</button>
          <p style={{ marginTop: '15px', color: '#8892b0', cursor:'pointer' }} onClick={() => setIsLoginMode(!isLoginMode)}>{isLoginMode ? "New? Create Account" : "Login Here"}</p>
        </div>
      </div>
    );
  }

  // --- RENDER 2: DASHBOARD ---
  return (
    <>
     <CustomCursor />
      <Navbar />
      <div style={{ width: '100%', minHeight: '100vh', background: '#020c1b', paddingTop: '120px', paddingBottom: '50px', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1000 }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: '#e6f1ff', margin: 0, fontWeight: 'bold' }}>Welcome, <span style={{ color: '#64ffda' }}>{currentUser}</span></h1>
                    <p style={{color: '#8892b0', marginTop: '5px'}}>Dashboard & Control Panel</p>
                </div>
                <button onClick={handleLogout} style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', color: '#ff4d4d', padding: '10px 20px', borderRadius: '8px', cursor:'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<Upload size={18}/>}>Upload Notes</TabButton>
                <TabButton active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon={<PenTool size={18}/>}>Write Blog</TabButton>
                <TabButton active={activeTab === 'manage'} onClick={() => setActiveTab('manage')} icon={<FolderOpen size={18}/>}>Manage Content</TabButton>
            </div>

            {/* --- UPLOAD SECTION --- */}
            {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h3 style={{ color: '#64ffda', marginBottom: '25px', display:'flex', alignItems:'center', gap:'10px' }}><span style={{fontSize:'2rem'}}>📂</span> Upload New Notes</h3>
                <label style={labelStyle}>Subject Name</label>
                <input type="text" placeholder="Ex: Constitutional Law" style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} />
                <label style={labelStyle}>Topic Description</label>
                <input type="text" placeholder="Ex: Fundamental Rights Notes" style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} />
                <div style={{ margin: '25px 0', border: '2px dashed #233554', padding: '30px', borderRadius: '12px', textAlign: 'center', background: 'rgba(2, 12, 27, 0.5)' }}>
                    <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ color: '#e6f1ff' }} />
                </div>
                <button onClick={handleUpload} disabled={uploading} style={btnStyle}>{uploading ? "Uploading..." : "Upload File 🚀"}</button>
            </motion.div>
            )}

            {/* --- BLOG SECTION --- */}
            {activeTab === 'blog' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h3 style={{ color: '#ffc107', marginBottom: '25px', display:'flex', alignItems:'center', gap:'10px' }}><span style={{fontSize:'2rem'}}>✍️</span> Write Article</h3>
                <label style={labelStyle}>Headline</label>
                <input type="text" placeholder="Ex: AI Laws in India" style={inputStyle} value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}>
                    <option>General</option><option>Criminal Law</option><option>Corporate</option><option>Tech & AI</option>
                </select>
                <label style={labelStyle}>Content</label>
                <textarea rows="10" placeholder="Start typing..." style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }} value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
                <button onClick={handleBlogSubmit} style={{ ...btnStyle, background: '#ffc107', color: '#000' }}>Publish Article 🔥</button>
            </motion.div>
            )}

            {/* --- MANAGE CONTENT SECTION (DELETE) --- */}
           {/* --- MANAGE CONTENT SECTION (FILTERED) --- */}
            {activeTab === 'manage' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h3 style={{ color: '#e6f1ff', marginBottom: '10px' }}>🗑️ Manage Your Content</h3>
                <p style={{ color: '#8892b0', marginBottom: '30px', fontSize: '0.9rem' }}>
                    You can only delete items uploaded by <strong>{currentUser}</strong>.
                </p>
                
                {/* 1. FILTERED BLOGS LIST */}
                <h4 style={{ color: '#ffc107', marginTop: '20px' }}>Your Blogs</h4>
                {/* 👇 MAGIC FILTER: Sirf wahi dikhao jahan author == currentUser */}
                {allBlogs.filter(blog => blog.author === currentUser).length === 0 ? (
                    <p style={{color:'#8892b0', fontStyle:'italic'}}>You haven't posted any blogs yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {allBlogs
                            .filter(blog => blog.author === currentUser) // <--- FILTER HERE
                            .map((blog) => (
                            <div key={blog._id} style={itemStyle}>
                                <div>
                                    <span style={{ color: '#e6f1ff', fontWeight: 'bold' }}>{blog.title}</span>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#8892b0' }}>{new Date(blog.date).toLocaleDateString()}</span>
                                </div>
                                <button onClick={() => handleDelete('blog', blog._id)} style={deleteBtnStyle}><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. FILTERED NOTES LIST */}
                <h4 style={{ color: '#64ffda', marginTop: '40px' }}>Your Uploaded Notes</h4>
                {/* 👇 MAGIC FILTER: Sirf wahi dikhao jahan author == currentUser */}
                {allNotes.filter(note => note.author === currentUser).length === 0 ? (
                    <p style={{color:'#8892b0', fontStyle:'italic'}}>You haven't uploaded any notes yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {allNotes
                            .filter(note => note.author === currentUser) // <--- FILTER HERE
                            .map((note) => (
                            <div key={note._id} style={itemStyle}>
                                <div>
                                    <span style={{ color: '#e6f1ff', fontWeight: 'bold' }}>{note.subject}</span>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#8892b0' }}>{note.topic}</span>
                                </div>
                                <button onClick={() => handleDelete('note', note._id)} style={deleteBtnStyle}><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
            )}
        
        </div>
      </div>
    </>
  );
};

// --- STYLES ---
const inputStyle = { width: '100%', padding: '15px', background: '#0a192f', border: '1px solid #233554', color: 'white', borderRadius: '8px', marginBottom: '20px', fontFamily: 'Space Mono, monospace', boxSizing: 'border-box' };
const labelStyle = { display: 'block', color: '#8892b0', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' };
const btnStyle = { padding: '15px 30px', background: '#64ffda', color: '#020c1b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '1rem', width: '100%' };
const cardStyle = { background: 'rgba(17, 34, 64, 0.6)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(100,255,218,0.1)', backdropFilter: 'blur(10px)' };
// New Styles for Manage Tab
const itemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 12, 27, 0.8)', padding: '15px', borderRadius: '8px', border: '1px solid #233554' };
const deleteBtnStyle = { background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '5px' };

const TabButton = ({ active, onClick, children, icon }) => (
  <button onClick={onClick} style={{ display: 'flex', gap: '10px', padding: '12px 25px', background: active ? 'rgba(100, 255, 218, 0.1)' : 'transparent', border: active ? '1px solid #64ffda' : '1px solid #233554', color: active ? '#64ffda' : '#8892b0', cursor: 'pointer', borderRadius: '8px', alignItems:'center', fontWeight: 'bold' }}>{icon} {children}</button>
);

export default Admin;