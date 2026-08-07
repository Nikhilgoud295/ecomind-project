import React, { useEffect, useRef } from 'react';

/**
 * WaterFlowBackground
 * Real-time HTML5 Canvas Water Flowing & Interactive Ripple Physics Background
 */
export default function WaterFlowBackground({ theme = 'aqua', interactive = true, particleDensity = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Canvas Sizing
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color Palettes based on Theme
    const getThemeColors = () => {
      switch (theme) {
        case 'bioluminescent':
          return ['#7b2cbf', '#00f5d4', '#f72585', '#00c6ff'];
        case 'emerald':
          return ['#38ef7d', '#11998e', '#57cc99', '#00f2fe'];
        case 'gold':
          return ['#ffb703', '#fb8500', '#ffe6a7', '#00c6ff'];
        case 'aqua':
        default:
          return ['#00f2fe', '#4facfe', '#00c6ff', '#0284c7', '#38bdf8'];
      }
    };

    let colors = getThemeColors();

    // 1. Water Wave Parameters
    const waves = [
      { y: height * 0.5, length: 0.008, amplitude: 25, speed: 0.02, color: 'rgba(0, 242, 254, 0.08)' },
      { y: height * 0.6, length: 0.005, amplitude: 35, speed: 0.015, color: 'rgba(79, 172, 254, 0.06)' },
      { y: height * 0.7, length: 0.003, amplitude: 45, speed: 0.01, color: 'rgba(0, 198, 255, 0.05)' }
    ];

    // 2. Liquid Particles (Flowing Stream)
    const particles = [];
    for (let i = 0; i < particleDensity; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.8 + 0.4, // Downward stream drift
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // 3. Interactive Ripples
    const ripples = [];

    const handlePointerMove = (e) => {
      if (!interactive) return;
      if (Math.random() < 0.25) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 2,
          maxRadius: 80 + Math.random() * 40,
          alpha: 0.8,
          speed: 2.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const handlePointerDown = (e) => {
      if (!interactive) return;
      for (let i = 0; i < 3; i++) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 4 + i * 8,
          maxRadius: 120 + i * 30,
          alpha: 0.9 - i * 0.2,
          speed: 3 + i * 0.5,
          color: colors[i % colors.length]
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mousedown', handlePointerDown);

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Draw Background Fluid Ambient Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#030d1a');
      grad.addColorStop(0.5, '#05182e');
      grad.addColorStop(1, '#08213d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Sine Waves
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, w.y);
        for (let x = 0; x <= width; x += 10) {
          const waveY = w.y + Math.sin(x * w.length + time * w.speed * 20) * w.amplitude;
          ctx.lineTo(x, waveY);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      // Update & Draw Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.015;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.stroke();
        ctx.restore();

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update & Draw Flowing Water Stream Particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.4;
        p.y += p.vy;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, [theme, interactive, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-1000"
      style={{ opacity: 0.9 }}
    />
  );
}
