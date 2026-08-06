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

    // Track mouse movement for interactive Neural Network Synapses
    const mouse = {
      x: null,
      y: null,
      radius: 180
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ==========================================
    // 1. AI NEURAL NETWORK CONSTELLATION SETUP
    // ==========================================
    const nodeCount = Math.min(Math.floor(window.innerWidth / 30), 55);
    const nodes = [];
    const maxDistance = 145;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: i % 3 === 0 ? 'rgba(52, 211, 153, 0.7)' : i % 3 === 1 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(20, 184, 166, 0.7)'
      });
    }

    // ==========================================
    // 2. UNCHANGED FLOATING LEAVES SETUP
    // ==========================================
    const leafCount = 35;
    const leaves = [];
    const leafColors = [
      'rgba(16, 185, 129, 0.24)', // Light Emerald
      'rgba(52, 211, 153, 0.28)', // Fresh Mint Green
      'rgba(110, 231, 183, 0.22)', // Light Lime Green
      'rgba(20, 184, 166, 0.24)',  // Light Teal Green
      'rgba(74, 222, 128, 0.20)'   // Soft Eco Green
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

    // Helper: Draw single leaf shape
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // ==========================================
    // RENDER ANIMATION LOOP
    // ==========================================
    let frameCounter = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCounter++;

      // ------------------------------------------
      // LAYER A: AI NEURAL NETWORK CONSTELLATION
      // ------------------------------------------
      // Update Node Positions & Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;
        nodeA.pulse += nodeA.pulseSpeed;

        // Bounce off canvas boundaries
        if (nodeA.x < 0 || nodeA.x > canvas.width) nodeA.vx *= -1;
        if (nodeA.y < 0 || nodeA.y > canvas.height) nodeA.vy *= -1;

        // Draw Synaptic Connection Lines to neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Draw Synaptic Impulses traveling along connections
            if ((i + j + frameCounter) % 180 === 0) {
              const impulsePos = (frameCounter % 60) / 60;
              const ix = nodeA.x + (nodeB.x - nodeA.x) * impulsePos;
              const iy = nodeA.y + (nodeB.y - nodeA.y) * impulsePos;

              ctx.beginPath();
              ctx.arc(ix, iy, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
              ctx.fill();
            }
          }
        }

        // Draw Synaptic Connections to Cursor Position
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = nodeA.x - mouse.x;
          const mdy = nodeA.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const malpha = (1 - mdist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${malpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Draw Neural Node Dot with Soft Pulsing Glow
        const pulseRadius = nodeA.radius + Math.sin(nodeA.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, Math.max(pulseRadius, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = nodeA.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur
      }

      // ------------------------------------------
      // LAYER B: UNCHANGED FLOATING LIGHT GREEN LEAVES
      // ------------------------------------------
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Lush Green Radial Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-500/05 rounded-full blur-[180px]" />

      {/* Combined AI Neural Network Constellation + Light Green Falling Leaves Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
