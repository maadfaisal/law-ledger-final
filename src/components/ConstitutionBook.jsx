import React, { useState, useEffect } from 'react'; // ✅ Import Fixed
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ConstitutionBook = () => {
  // Logic: Screen size ke hisaab se book ki chaurai set karna
  const [bookWidth, setBookWidth] = useState(window.innerWidth < 500 ? 300 : 400);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const handleResize = () => setBookWidth(window.innerWidth < 500 ? 300 : 400);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
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
            file="/constitution.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div style={{color:'white'}}>Loading Constitution...</div>}
        >
            <HTMLFlipBook 
                width={bookWidth} 
                height={570} 
                showCover={true}
                mobileScrollSupport={true}
                className="flip-book"
            >
                {Array.from(new Array(15), (el, index) => (
                    <div key={index} style={pageStyle}>
                        <Page 
                            pageNumber={index + 1} 
                            width={bookWidth} 
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