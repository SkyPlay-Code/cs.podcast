
import React, { useRef, useEffect } from 'react';

interface CerebralFieldProps {
  theme: 'light' | 'dark';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

const CerebralField: React.FC<CerebralFieldProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const numParticles = 50; // Fewer, more subtle particles for dust motes

    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2, // Very slow movement
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1 + 0.5, // Tiny radius
      alpha: Math.random() * 0.3 + 0.1, // Very faint
    });

    if (theme === 'light' && particlesRef.current.length === 0) {
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push(createParticle());
      }
    } else if (theme === 'dark') {
      particlesRef.current = []; // Clear particles for dark mode
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (theme === 'light') {
        particlesRef.current.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          // Boundary check (wrap around)
          if (p.x < -p.radius) p.x = window.innerWidth + p.radius;
          if (p.x > window.innerWidth + p.radius) p.x = -p.radius;
          if (p.y < -p.radius) p.y = window.innerHeight + p.radius;
          if (p.y > window.innerHeight + p.radius) p.y = -p.radius;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`; // White, faint dust motes
          ctx.fill();
        });
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        if (!canvasRef.current || !ctx) return;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        // Re-initialize particles on resize if in light mode for proper distribution
        if (theme === 'light') {
            particlesRef.current = [];
            for (let i = 0; i < numParticles; i++) {
                particlesRef.current.push(createParticle());
            }
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      particlesRef.current = []; // Clear particles on component unmount or theme change effect re-run
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 0  // Ensure it's behind all interactive content
      }} 
      aria-hidden="true"
    />
  );
};

export default CerebralField;
