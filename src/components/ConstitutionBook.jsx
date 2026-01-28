import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

// Styles imports
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 🔥 IMPORTANT: Worker Setup for Vite
// Ye line sabse zaroori hai. Ye local worker file use karegi.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ConstitutionBook = () => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Error pakadne ke liye function
  function onDocumentLoadError(error) {
    console.error("❌ PDF Load Error:", error);
    alert("PDF load nahi hui! Console check karo detail ke liye.");
  }

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#0a192f', 
        padding: '50px 0',
        flexDirection: 'column'
    }}>
      
      <h2 style={{ color: '#ffc107', marginBottom: '30px', fontFamily: 'serif', fontSize: '2.5rem' }}>
        📜 The Constitution of India
      </h2>

      <div style={{ boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)' }}>
        <Document
            file="/constitution.pdf" // 👈 Check karo ye file Public folder me hai na?
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError} // Error dikhayega
            loading={<div style={{color:'white'}}>Loading Constitution...</div>}
            error={<div style={{color:'red'}}>Failed to load PDF! Check file path.</div>}
        >
            <HTMLFlipBook 
                width={400} 
                height={570} 
                showCover={true}
                mobileScrollSupport={true}
                className="flip-book"
            >
                {/* Pages Loop (First 15 pages) */}
                {Array.from(new Array(15), (el, index) => (
                    <div key={index} style={pageStyle}>
                        <Page 
                            pageNumber={index + 1} 
                            width={400} 
                            renderTextLayer={false} 
                            renderAnnotationLayer={false} 
                        />
                        <div style={footerStyle}>{index + 1}</div>
                    </div>
                ))}
            </HTMLFlipBook>
        </Document>
      </div>

      <p style={{ color: '#8892b0', marginTop: '20px' }}>
        *Drag page corners or click to flip.*
      </p>
    </div>
  );
};

const pageStyle = {
    background: 'white',
    border: '1px solid #ccc',
    overflow: 'hidden'
};

const footerStyle = {
    position: 'absolute',
    bottom: '10px',
    width: '100%',
    textAlign: 'center',
    fontSize: '12px',
    color: 'black'
};

export default ConstitutionBook;