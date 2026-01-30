import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// --- DUMMY DATA FOR SIDEBARS ---
const importantArticles = [
    { id: 14, title: "Article 14", desc: "Equality before law." },
    { id: 19, title: "Article 19", desc: "Protection of certain rights regarding freedom of speech, etc." },
    { id: 21, title: "Article 21", desc: "Protection of life and personal liberty." },
    { id: 32, title: "Article 32", desc: "Remedies for enforcement of rights conferred by this Part (Heart & Soul)." },
    { id: 44, title: "Article 44", desc: "Uniform civil code for the citizens." },
];

const constitutionFacts = [
    "📜 It is the longest written constitution of any sovereign country in the world.",
    "📅 Adopted on 26 November 1949, and came into effect on 26 January 1950.",
    "👨‍⚖️ Dr. B. R. Ambedkar is regarded as the chief architect (Father of the Constitution).",
    "🎨 The original Constitution is hand-written, with each page decorated by artists from Shantiniketan.",
];

const ConstitutionBook = () => {
  const [bookWidth, setBookWidth] = useState(400);
  const [numPages, setNumPages] = useState(null);
  // New state to check if screen is wide enough for sidebars
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1100);

  useEffect(() => {
    const handleResize = () => {
        const width = window.innerWidth;
        setBookWidth(width < 500 ? 300 : 400);
        // Agar screen 1100px se badi hai, tabhi sidebars side me dikhenge
        setIsWideScreen(width > 1100);
    };
    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // --- SIDEBAR COMPONENT (Internal helper) ---
  const Sidebar = ({ title, children, alignLeft }) => (
      <div style={{
          flex: 1,
          maxWidth: isWideScreen ? '300px' : '100%', // Desktop pe limit, mobile pe full
          background: 'rgba(17, 34, 64, 0.6)', // Thoda transparent dark background
          border: '1px solid #64ffda', // Neon border color
          borderRadius: '12px',
          padding: '25px',
          color: '#e6f1ff',
          height: 'fit-content',
          // Desktop par margin dena taaki book se chipke nahi
          marginRight: isWideScreen && alignLeft ? '40px' : 0,
          marginLeft: isWideScreen && !alignLeft ? '40px' : 0,
          // Mobile par upar margin dena
          marginTop: !isWideScreen ? '30px' : 0,
          boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)'
      }}>
          <h3 style={{ color: '#ffc107', fontFamily: 'serif', borderBottom: '1px solid rgba(255, 193, 7, 0.3)', paddingBottom: '10px', marginBottom: '20px' }}>
              {title}
          </h3>
          {children}
      </div>
  );

  return (
    <div style={mainContainerStyle}>
      
      {/* Main Heading stays at top */}
      <h2 style={{ color: '#ffc107', marginBottom: '40px', fontFamily: 'serif', fontSize: isWideScreen ? '3rem' : '2rem', textAlign: 'center' }}>
        📜 The Constitution of India
      </h2>

      {/* Content Container: Desktop=Row, Mobile=Column */}
      <div style={{ 
          display: 'flex', 
          flexDirection: isWideScreen ? 'row' : 'column', // 🔥 MAGIC LINE: Screen size ke hisaab se layout badlega
          alignItems: isWideScreen ? 'flex-start' : 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1400px', // Zyada failne se roko
          padding: isWideScreen ? '0 20px' : '0 10px'
      }}>

        {/* --- LEFT SIDEBAR: Important Articles --- */}
        <Sidebar title="⚖️ Key Articles" alignLeft={true}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {importantArticles.map(art => (
                    <li key={art.id} style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#64ffda' }}>{art.title}:</strong> 
                        <span style={{ color: '#a8b2d1', display: 'block', fontSize: '0.9rem' }}>{art.desc}</span>
                    </li>
                ))}
            </ul>
        </Sidebar>

        {/* --- CENTER: THE BOOK --- */}
        <div style={{ flexShrink: 0, zIndex: 10 }}> {/* flexShrink: 0 taaki book pichke nahi */}
            <div style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', borderRadius: '5px' }}>
                <Document
                    file="/constitution.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div style={{color:'white', padding: '20px'}}>Loading Book...</div>}
                >
                    <HTMLFlipBook 
                        width={bookWidth} 
                        height={570} 
                        showCover={true}
                        mobileScrollSupport={true}
                        className="flip-book"
                        style={{ margin: '0 auto' }}
                    >
                        {Array.from(new Array(15), (el, index) => (
                            <div key={index} style={pageStyle}>
                                <Page 
                                    pageNumber={index + 1} 
                                    width={bookWidth} 
                                    renderTextLayer={false} 
                                    renderAnnotationLayer={false} 
                                    loading={<div style={{textAlign:'center', marginTop:'50%'}}>Loading Page...</div>}
                                />
                                <div style={footerStyle}>{index + 1}</div>
                            </div>
                        ))}
                    </HTMLFlipBook>
                </Document>
            </div>
             <p style={{ color: '#8892b0', marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                *Drag page corners or click to flip.*
            </p>
        </div>

        {/* --- RIGHT SIDEBAR: Facts --- */}
        <Sidebar title="🧐 Did You Know?" alignLeft={false}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {constitutionFacts.map((fact, index) => (
                    <li key={index} style={{ marginBottom: '15px', color: '#a8b2d1', fontSize: '0.95rem', lineHeight: '1.5', display: 'flex' }}>
                        <span style={{ marginRight: '10px' }}>👉</span> {fact.substring(2)}
                    </li>
                ))}
            </ul>
        </Sidebar>

      </div>
    </div>
  );
};

// --- STYLES ---
const mainContainerStyle = {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    background: '#0a192f', // Deep dark background
    background: 'linear-gradient(to bottom, #0a192f 0%, #020c1b 100%)', // Subtle gradient
    padding: '60px 0',
    flexDirection: 'column',
    minHeight: '100vh'
};

const pageStyle = {
    background: '#fffaf0', // Thoda purana kagaz jaisa off-white
    border: '1px solid #c4b49c',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05)' // Inner shadow for depth
};

const footerStyle = {
    position: 'absolute',
    bottom: '10px',
    width: '100%',
    textAlign: 'center',
    fontSize: '12px',
    color: '#555',
    fontFamily: 'serif'
};

export default ConstitutionBook;