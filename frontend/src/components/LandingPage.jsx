<<<<<<< HEAD
import React from 'react';
import '../assets/Landingpage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source src="landingpagebg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <Link to='/auth'>
        <button className='btn'>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TypeAnimation } from 'react-type-animation';
import { IoGameController, IoPeople, IoTrophy, IoChatbubbles, IoExtensionPuzzle, IoDiamond, IoFlash } from 'react-icons/io5';
import './../assets/LandingPage-final.css';

const featureList = [
    {
        icon: <IoTrophy />,
        title: "Compete in Tournaments",
        description: "Prove your skills and climb the leaderboards. Join daily, weekly, and monthly tournaments for fame and glory."
    },
    {
        icon: <IoPeople />,
        title: "Build Your Community",
        description: "Create or join guilds, make new friends, and find teammates who share your passion and play style."
    },
    {
        icon: <IoChatbubbles />,
        title: "Engage & Connect",
        description: "A central hub for all your gaming chats, strategies, and shared moments. Never miss a beat with real-time messaging."
    }
];

const backgroundIcons = [
    { icon: <IoGameController /> }, { icon: <IoTrophy /> }, 
    { icon: <IoExtensionPuzzle /> }, { icon: <IoDiamond /> },
    { icon: <IoFlash /> }, { icon: <IoPeople /> }
];

// Component for the initial "falling" animation, now with an exit animation
const FallingIcons = () => {
    const icons = [...Array(80)].map((_, i) => ({
        id: i,
        icon: backgroundIcons[i % backgroundIcons.length].icon,
        x: `${Math.random() * 100}vw`,
        size: `${Math.random() * 40 + 20}px`,
    }));

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: { transition: { staggerChildren: 0.01 } },
        exit: { opacity: 0, transition: { duration: 1.5, ease: 'easeOut' } }
    };

    const iconVariants = {
        hidden: { y: "-20vh", opacity: 0 },
        visible: {
            y: "120vh",
            opacity: 1,
            transition: {
                duration: 0.5 + Math.random() * 1.5,
                ease: "linear"
            }
        }
    };

    return (
        <motion.div
            key="falling-icons"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="floating-icons-bg" // Use the same container for positioning
        >
            {icons.map(item => (
                <motion.div key={item.id} className="falling-icon" style={{ left: item.x, fontSize: item.size }} variants={iconVariants}>
                    {item.icon}
                </motion.div>
            ))}
        </motion.div>
    );
};

// Component for the continuous "floating" animation
const FloatingIcons = () => {
    return (
        <div className="floating-icons-bg">
            {[...Array(80)].map((_, i) => {
                const Icon = backgroundIcons[i % backgroundIcons.length];
                return (
                    <div key={i} className="floating-icon" style={{
                        left: `${Math.random() * 100}vw`,
                        fontSize: `${Math.random() * 30 + 20}px`,
                        animationDelay: `${Math.random() * 25}s`,
                        animationDuration: `${15 + Math.random() * 20}s`,
                    }}>
                        {Icon.icon}
                    </div>
                );
            })}
        </div>
    );
};

// Animation Variants
const sectionVariant = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hidden: { opacity: 0, y: 50 }
};

const cardVariant = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0, scale: 0.9 }
};

const Section = ({ children, id, setActiveLink }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.5 });
  
    useEffect(() => {
      if (inView) {
        controls.start("visible");
        setActiveLink(id);
      }
    }, [controls, inView, setActiveLink, id]);
  
    return (
      <motion.section
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={sectionVariant}
        className="page-section"
      >
        {children}
      </motion.section>
    );
};

function LandingPage() {
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    // Take control of scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
        setInitialAnimationComplete(true);
    }, 2500);

    return () => {
        clearTimeout(timer);
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'auto';
        }
    };
  }, []);

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.5 });
  useEffect(() => {
    if(heroInView) {
        setActiveLink('home');
    }
  }, [heroInView]);


  return (
    <div className="landing-page-final">
        {/* The permanent background, which will be revealed */}
        <FloatingIcons />

        {/* The falling icons, which will gracefully fade out */}
        <AnimatePresence>
            {!initialAnimationComplete && <FallingIcons />}
        </AnimatePresence>

      <motion.header 
        className="main-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <nav className="main-nav">
            <a href="#home" className="logo">
              <IoGameController size={30} />
              <span>Game<span className="logo-accent">Verse</span></span>
            </a>
            <ul className="nav-links">
              <li><a href="#features" className={activeLink === 'features' ? 'active' : ''}>Features</a></li>
              <li><Link to="/login" className={activeLink === 'login' ? 'active' : ''}>Login</Link></li>
              <li>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/signup" className="btn btn-primary">Register</Link>
                </motion.div>
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>

      <main>
        <section className="hero-section" id="home" ref={heroRef}>
          <div className="container">
            <motion.div>
                <TypeAnimation
                  sequence={['Welcome to the Next Level of Gaming']}
                  wrapper="h1"
                  speed={50}
                  cursor={true}
                  style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}
                />
            </motion.div>
            <motion.h1 className="hero-gamename" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 2.5 }}>
                Game<span className="logo-accent">Verse</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.8 }}>
                The ultimate social platform to connect with gamers, compete in tournaments, and conquer new worlds together.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 3.0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a href="#features" className="btn btn-primary">Explore Features</a>
            </motion.div>
          </div>
        </section>
        
        <Section id="features" setActiveLink={setActiveLink}>
            <div className="container" id="features">
                <h2 className="section-title">Everything a Gamer Needs</h2>
                <p className="section-subtitle">GameVerse provides all the tools for you to thrive in the gaming ecosystem.</p>
                <motion.div 
                    className="features-grid"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                >
                    {featureList.map((feature, index) => (
                        <motion.div 
                            className="feature-card" 
                            key={index}
                            variants={cardVariant}
                            whileHover={{ y: -10, boxShadow: "0px 10px 30px rgba(0,0,0,0.5)" }}
                        >
                            <div className="feature-card-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </Section>
        
        <Section id="cta" setActiveLink={setActiveLink}>
            <div className="container">
                <div className="cta-section">
                    <h2>Ready to Join the Verse?</h2>
                    <p>Create your account today and start your journey to the top.</p>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link to="/signup" className="btn btn-primary">Get Started Now</Link>
                    </motion.div>
                </div>
            </div>
        </Section>

      </main>
      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} GameVerse. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

>>>>>>> d997b8b (Initial commit: project ready for deployment)
export default LandingPage;