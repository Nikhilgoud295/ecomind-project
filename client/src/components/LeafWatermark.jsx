import React, { useEffect, useRef } from 'react';

export default function LeafWatermark() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create 35 floating, moving light green leaves
    const leafCount = 35;
    const leaves = [];
    const leafColors = [
      'rgba(16, 185, 129, 0.22)', // Light Emerald
      'rgba(52, 211, 153, 0.25)', // Fresh Mint Green
      'rgba(110, 231, 183, 0.20)', // Light Lime Green
      'rgba(20, 184, 166, 0.22)',  // Light Teal Green
      'rgba(74, 222, 128, 0.18)'   // Soft Eco Green
    ];

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 16 + 12, // 12px to 28px
        speedY: Math.random() * 0.8 + 0.3, // Falling speed
        speedX: Math.random() * 0.4 - 0.2, // Horizontal drift
        swaySpeed: Math.random() * 0.02 + 0.005,
        swayAmplitude: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        time: Math.random() * 100
      });
    }

    // Draw single leaf shape path onto Canvas 2D
    const drawLeafShape = (ctx, size) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.8, -size * 0.3, size * 0.6, size * 0.6);
      ctx.quadraticCurveTo(0, size * 0.9, 0, size);
      ctx.quadraticCurveTo(0, size * 0.9, -size * 0.6, size * 0.6);
      ctx.quadraticCurveTo(-size * 0.8, -size * 0.3, 0, -size);
      ctx.closePath();
      ctx.fill();

      // Leaf middle vein
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(0, size * 0.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Render Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach((leaf) => {
        leaf.time += leaf.swaySpeed;
        leaf.y += leaf.speedY;
        leaf.x += Math.sin(leaf.time) * leaf.swayAmplitude + leaf.speedX;
        leaf.rotation += leaf.rotationSpeed;

        // Reset positions when leaf drifts off bottom screen
        if (leaf.y > canvas.height + 40) {
          leaf.y = -40;
          leaf.x = Math.random() * canvas.width;
        }

        if (leaf.x > canvas.width + 40) {
          leaf.x = -40;
        } else if (leaf.x < -40) {
          leaf.x = canvas.width + 40;
        }

        // Render Leaf
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.fillStyle = leaf.color;
        ctx.globalAlpha = leaf.opacity;

        drawLeafShape(ctx, leaf.size);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Lush Green Radial Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-500/05 rounded-full blur-[180px]" />

      {/* Moving Light Green Leaves Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
