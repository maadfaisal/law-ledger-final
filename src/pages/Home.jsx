import Background from '../components/Background';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import NewsTicker from '../components/NewsTicker';
import CaseLibrary from '../components/CaseLibrary';
import Blogs from '../components/Blogs';  
import Notes from '../components/Notes';  
import JudgeRobot from '../components/JudgeRobot';
import LegalLiveSection from '../components/LegalLiveSection';
import ConstitutionBook from '../components/ConstitutionBook';
const Home = () => {
  return (
    <>
      <CustomCursor /> 
      <Background />
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      <LegalLiveSection />
      
      {/* News Ticker Section */}
      <div style={{ padding: '0 10%' }}>
        <NewsTicker />
      </div>
     <JudgeRobot /> 
      <section id="constitution" style={{ minHeight: '80vh', background: '#020c1b' }}>
          <ConstitutionBook />
      </section>
      <CaseLibrary />
      <Notes />
      <Blogs />

      {/* Blogs & Notes (Placeholder for now) */}
      <section id="blogs" style={{ padding: '100px 10%', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className="font-head" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Latest Perspectives</h2>
        <div style={{ padding: '40px', background: 'rgba(17,34,64,0.5)', borderRadius: '8px' }}>
          <p style={{ color: '#8892b0' }}>More blogs loading soon...</p>
        </div>
      </section>
    </>
  );
};

export default Home;