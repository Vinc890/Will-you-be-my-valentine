import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Firework particle class for canvas animation
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
    this.radius = Math.random() * 3 + 1;
  }

  update() {
    this.velocity.x *= 0.98;
    this.velocity.y *= 0.98;
    this.velocity.y += 0.1;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

const ValentineProposal = () => {
  const [params, setParams] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [yesCount, setYesCount] = useState(0);
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const noButtonRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('d');
    
    if (encodedData) {
      try {
        const decoded = atob(encodedData);
        const data = JSON.parse(decoded);
        setParams(data);
      } catch (error) {
        setShowForm(true);
      }
    } else {
      setShowForm(true);
    }
  }, []);

  // Canvas fireworks animation
  useEffect(() => {
    if (!showCelebration || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff0080', '#ff4da6', '#ff80bf', '#ffd4eb', '#ff1493', '#ff69b4'];
    
    const createFirework = (x, y) => {
      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return particle.alpha > 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Create fireworks at intervals
    const fireworkInterval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.6);
      createFirework(x, y);
    }, 400);

    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * (canvas.height * 0.6)
        );
      }, i * 200);
    }

    animate();

    return () => {
      clearInterval(fireworkInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showCelebration]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get('name'),
      image1: formData.get('image1'),
      image2: formData.get('image2'),
      message: formData.get('message')
    };
    
    const encoded = btoa(JSON.stringify(data));
    const newUrl = `${window.location.pathname}?d=${encoded}`;
    window.history.pushState({}, '', newUrl);
    setParams(data);
    setShowForm(false);
  };

  const moveNoButton = (e) => {
    if (yesCount > 0 || showCelebration) return;

    const button = noButtonRef.current;
    if (!button) return;

    const buttonRect = button.getBoundingClientRect();
    
    const maxMove = 150;
    const minMove = 80;
    
    const angle = Math.random() * 2 * Math.PI;
    const distance = minMove + Math.random() * (maxMove - minMove);
    
    let newX = noButtonPos.x + Math.cos(angle) * distance;
    let newY = noButtonPos.y + Math.sin(angle) * distance;
    
    const padding = 20;
    const maxX = window.innerWidth - buttonRect.width - padding;
    const maxY = window.innerHeight - buttonRect.height - padding;
    
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));
    
    setNoButtonPos({ x: newX, y: newY });
    setYesButtonSize(prev => Math.min(prev + 0.1, 2.2));
  };

  const handleYesClick = () => {
    if (yesCount < 3) {
      setYesCount(prev => prev + 1);
    } else {
      setShowCelebration(true);
      createFloatingHearts();
    }
  };

  const createFloatingHearts = () => {
    const hearts = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      size: Math.random() * 20 + 20
    }));
    setFloatingHearts(hearts);
  };

  const getYesButtonText = () => {
    switch (yesCount) {
      case 0: return "Yes! 💕";
      case 1: return "Really Sure?";
      case 2: return "Really Really Sure?";
      case 3: return "Really³ Sure?";
      default: return "Yes! 💕";
    }
  };

  if (showForm) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 50%, #1a1625 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,20,147,0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        }} />
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,20,147,0.3), 0 0 40px rgba(255,20,147,0.2); }
            50% { box-shadow: 0 0 30px rgba(255,20,147,0.5), 0 0 60px rgba(255,20,147,0.3); }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(30, 20, 40, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px 40px',
            maxWidth: '560px',
            width: '100%',
            border: '1px solid rgba(255,105,180,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            textAlign: 'center',
            fontWeight: '700',
            fontFamily: '"Inter", -apple-system, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            Create Your Link 💌
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '32px',
            textAlign: 'center',
            fontFamily: '"Inter", -apple-system, sans-serif'
          }}>
            Fill in the details to create a personalized Valentine's proposal
          </p>
          
          <form onSubmit={handleFormSubmit}>
            <FormField label="Their Name" name="name" placeholder="e.g., Sarah" />
            <FormField 
              label="First Image URL" 
              name="image1" 
              placeholder="https://example.com/cute-image.gif"
              hint="Square images (500x500px) work best"
            />
            <FormField 
              label="Success Image URL" 
              name="image2" 
              placeholder="https://example.com/celebration.gif"
            />
            <FormField 
              label="Success Message" 
              name="message" 
              placeholder="Yay! Can't wait for our Valentine's date! 💕"
              textarea
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: '"Inter", -apple-system, sans-serif',
                boxShadow: '0 10px 30px rgba(255,20,147,0.3)',
                transition: 'all 0.3s'
              }}
            >
              Generate Valentine Link 💝
            </motion.button>
          </form>

          <p style={{
            marginTop: '24px',
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            fontFamily: '"Inter", -apple-system, sans-serif'
          }}>
            💡 Use Tenor, Giphy, or Imgur for best results
          </p>
        </motion.div>
      </div>
    );
  }

  if (!params) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1f1729 50%, #111827 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
      {/* Animated gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,20,147,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 15s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(255,105,180,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 18s ease-in-out infinite reverse'
      }} />

      {/* Fireworks canvas */}
      {showCelebration && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      )}

      {/* Floating hearts celebration */}
      <AnimatePresence>
        {showCelebration && floatingHearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ y: '100vh', opacity: 0, scale: 0, rotate: 0 }}
            animate={{ 
              y: '-20vh', 
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200]
            }}
            transition={{ 
              duration: heart.duration, 
              delay: heart.delay,
              ease: 'easeOut'
            }}
            style={{
              position: 'fixed',
              left: `${heart.x}%`,
              fontSize: `${heart.size}px`,
              pointerEvents: 'none',
              zIndex: 1001,
              filter: 'drop-shadow(0 0 10px rgba(255,20,147,0.5))'
            }}
          >
            💖
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        ref={cardRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        style={{
          background: 'rgba(30, 20, 40, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: 'clamp(32px, 5vw, 56px)',
          maxWidth: '560px',
          width: '100%',
          border: '1px solid rgba(255,105,180,0.2)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,20,147,0.1)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {!showCelebration ? (
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: '100%',
                aspectRatio: '1',
                maxWidth: '320px',
                margin: '0 auto 32px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(255,20,147,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)',
                position: 'relative'
              }}
            >
              <img 
                src={params.image1} 
                alt="Valentine"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </motion.div>

            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: '40px',
              fontWeight: '700',
              lineHeight: '1.3',
              letterSpacing: '-0.02em'
            }}>
              {params.name}, Will you be my Valentine?
            </h1>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              minHeight: '80px'
            }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                animate={{ scale: yesButtonSize }}
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: '"Inter", -apple-system, sans-serif',
                  boxShadow: '0 10px 30px rgba(255,20,147,0.4)',
                  transition: 'all 0.3s',
                  zIndex: 100,
                  whiteSpace: 'nowrap'
                }}
              >
                {getYesButtonText()}
              </motion.button>

              <motion.button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                whileHover={{ scale: 1.05 }}
                style={{
                  position: noButtonPos.x === 0 && noButtonPos.y === 0 ? 'relative' : 'fixed',
                  left: noButtonPos.x === 0 && noButtonPos.y === 0 ? 'auto' : `${noButtonPos.x}px`,
                  top: noButtonPos.x === 0 && noButtonPos.y === 0 ? 'auto' : `${noButtonPos.y}px`,
                  padding: '14px 32px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: '"Inter", -apple-system, sans-serif',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                  zIndex: 99
                }}
              >
                No
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.03, 1],
                rotateY: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                aspectRatio: '1',
                maxWidth: '320px',
                margin: '0 auto 32px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(255,20,147,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)',
              }}
            >
              <img 
                src={params.image2} 
                alt="Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </motion.div>

            <motion.h1
              animate={{ 
                scale: [1, 1.02, 1],
                textShadow: [
                  '0 0 20px rgba(255,20,147,0.3)',
                  '0 0 30px rgba(255,20,147,0.5)',
                  '0 0 20px rgba(255,20,147,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
                fontWeight: '700',
                lineHeight: '1.4',
                letterSpacing: '-0.01em'
              }}
            >
              {params.message}
            </motion.h1>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Reusable form field component
const FormField = ({ label, name, placeholder, hint, textarea = false }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={{
      display: 'block',
      fontSize: '0.875rem',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '8px',
      fontWeight: '500',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
      {label}
    </label>
    {textarea ? (
      <textarea
        name={name}
        required
        placeholder={placeholder}
        rows="3"
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '0.9375rem',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.9)',
          outline: 'none',
          fontFamily: '"Inter", -apple-system, sans-serif',
          resize: 'vertical',
          transition: 'all 0.3s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(255,105,180,0.5)';
          e.target.style.background = 'rgba(255,255,255,0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
          e.target.style.background = 'rgba(255,255,255,0.05)';
        }}
      />
    ) : (
      <input
        type={name.includes('image') ? 'url' : 'text'}
        name={name}
        required
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '0.9375rem',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.9)',
          outline: 'none',
          fontFamily: '"Inter", -apple-system, sans-serif',
          transition: 'all 0.3s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(255,105,180,0.5)';
          e.target.style.background = 'rgba(255,255,255,0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
          e.target.style.background = 'rgba(255,255,255,0.05)';
        }}
      />
    )}
    {hint && (
      <small style={{ 
        color: 'rgba(255,255,255,0.4)', 
        fontSize: '0.8125rem', 
        marginTop: '6px', 
        display: 'block',
        fontFamily: '"Inter", -apple-system, sans-serif'
      }}>
        {hint}
      </small>
    )}
  </div>
);

export default ValentineProposal;