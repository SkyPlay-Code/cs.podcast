
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CerebralFieldProps {
  mousePosition: { x: number; y: number };
  playerYPosition: number | null; // For the pressure wave effect from CommandDeck
}

const CerebralField: React.FC<CerebralFieldProps> = ({ mousePosition, playerYPosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d'); // Using 2D context as a simpler placeholder for WebGL
    if (!ctx) return;

    let animationFrameId: number;
    const particles: any[] = []; // Placeholder for particle objects

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize conceptual particles
    if (particles.length === 0) { // Simple init
        for (let i = 0; i < 100; i++) { // Reduced number for 2D placeholder
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3, // Slow drift
                vy: (Math.random() - 0.5) * 0.3,
                radius: theme === 'light' ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1,
            });
        }
    }


    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Theme-based particle appearance (conceptual for 2D)
      const particleColor = theme === 'light' ? 'rgba(74, 108, 250, 0.4)' : 'rgba(0, 242, 254, 0.5)'; // Simplified
      const particleRadiusBase = theme === 'light' ? 1.5 : 2;

      particles.forEach(p => {
        // Conceptual mouse repulsion
        const dx = p.x - mousePosition.x;
        const dy = p.y - mousePosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 150;
        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          p.x += (dx / dist) * force * 0.5; // Reduced force for 2D
          p.y += (dy / dist) * force * 0.5;
        }

        // Conceptual player pressure wave
        if (playerYPosition !== null && canvas.height - p.y < 100) { // If particle is near bottom
             const pressureStrength = (1 - ( (canvas.height - playerYPosition)/canvas.height ) ) * 0.5 ; // Example calc
             if (canvas.height - p.y < (canvas.height - playerYPosition + 50)) { // rough area of effect
                p.y -= pressureStrength * (Math.random() * 0.5); // move particle up a bit
             }
        }


        // Update position (drift)
        p.x += p.vx;
        p.y += p.vy;

        // Boundary conditions (wrap around)
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * particleRadiusBase, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme, mousePosition, playerYPosition]); // Redraw on theme change or mouse move

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none', // Allows clicks to pass through
      }}
    />
  );
};

export default CerebralField;
