import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Globe, RotateCcw, Zap, Droplets, Sun, Layers } from 'lucide-react';

export default function EcoGlobe3D({ title = "Interactive 3D Eco Intelligence Globe", showHotspots = true }) {
  const canvasRef = useRef(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);

  // 3D Hotspot locations around the globe (latitude, longitude)
  const hotspots = [
    {
      id: 'hs_01',
      title: 'North America Solar Grid',
      lat: 38.0,
      lon: -97.0,
      category: 'Solar',
      impact: '2.4 GW Capacity',
      details: 'Over 1.2 million households powered by utility-scale solar farms.',
      color: '#f59e0b'
    },
    {
      id: 'hs_02',
      title: 'Amazon Reforestation Zone',
      lat: -3.46,
      lon: -62.21,
      category: 'Biodiversity',
      impact: '100,000 Hectares Restored',
      details: 'Indigenous-led drone seeding planted 12 million native trees.',
      color: '#10b981'
    },
    {
      id: 'hs_03',
      title: 'European Wind & Hydrogen Facility',
      lat: 51.5,
      lon: 10.5,
      category: 'Clean Hydrogen',
      impact: '500kt CO2 Offset',
      details: 'Offshore wind turbines producing zero-emission green hydrogen.',
      color: '#3b82f6'
    },
    {
      id: 'hs_04',
      title: 'Asia-Pacific Solar & Battery Hub',
      lat: 20.59,
      lon: 78.96,
      category: 'Battery Storage',
      impact: '3.8 TWh Clean Power',
      details: 'Grid-scale battery storage providing 24/7 renewable power backup.',
      color: '#06b6d4'
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let rotationY = 0;
    let rotationX = 0.3;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Generate 3D Particles around globe
    const particleCount = 180;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 130 + Math.random() * 40;
      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#10b981' : (Math.random() > 0.5 ? '#06b6d4' : '#38bdf8')
      });
    }

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 360;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse Controls for 3D Drag Rotation
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationY += deltaX * 0.008;
      rotationX += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Render 3D Engine Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const globeRadius = 110;

      if (!isDragging) {
        rotationY += rotationSpeed;
      }

      // 1. Draw Atmospheric Glow Aura behind globe
      const auraGradient = ctx.createRadialGradient(centerX, centerY, globeRadius * 0.8, centerX, centerY, globeRadius * 1.45);
      auraGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      auraGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      auraGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw 3D Globe Base Sphere
      const globeGradient = ctx.createRadialGradient(centerX - globeRadius * 0.3, centerY - globeRadius * 0.3, globeRadius * 0.1, centerX, centerY, globeRadius);
      globeGradient.addColorStop(0, '#1e293b');
      globeGradient.addColorStop(0.6, '#0f172a');
      globeGradient.addColorStop(1, '#020617');
      ctx.fillStyle = globeGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Render 3D Latitude and Longitude Grids
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';

      for (let lat = -60; lat <= 60; lat += 30) {
        const radLat = (lat * Math.PI) / 180;
        const r = globeRadius * Math.cos(radLat);
        const y = centerY + globeRadius * Math.sin(radLat) * Math.cos(rotationX);
        const rx = r;
        const ry = r * Math.sin(rotationX);

        ctx.beginPath();
        ctx.ellipse(centerX, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Render 3D Particles
      particles.forEach((p) => {
        // Rotate points
        let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
        let z1 = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);

        let y2 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = p.y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        const perspective = 300 / (300 + z2);
        const projX = centerX + x1 * perspective;
        const projY = centerY + y2 * perspective;

        if (z2 > -globeRadius * 0.8) {
          const opacity = Math.max(0.1, (z2 + globeRadius) / (globeRadius * 2));
          ctx.fillStyle = p.color;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(projX, projY, p.size * perspective, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });

      // 5. Render 3D Hotspots
      if (showHotspots) {
        hotspots.forEach((hs) => {
          const phi = ((90 - hs.lat) * Math.PI) / 180;
          const theta = ((hs.lon + 180) * Math.PI) / 180;

          let hx = globeRadius * Math.sin(phi) * Math.cos(theta);
          let hy = globeRadius * Math.cos(phi);
          let hz = globeRadius * Math.sin(phi) * Math.sin(theta);

          let x1 = hx * Math.cos(rotationY) - hz * Math.sin(rotationY);
          let z1 = hx * Math.sin(rotationY) + hz * Math.cos(rotationY);

          let y2 = hy * Math.cos(rotationX) - z1 * Math.sin(rotationX);
          let z2 = hy * Math.sin(rotationX) + z1 * Math.cos(rotationX);

          // Only render front-facing 3D hotspots
          if (z2 > 0) {
            const perspective = 300 / (300 + z2);
            const projX = centerX + x1 * perspective;
            const projY = centerY + y2 * perspective;

            // Pulsing Hotspot Ring
            const pulse = (Math.sin(Date.now() * 0.005) + 1) * 4 + 6;
            ctx.fillStyle = hs.color;
            ctx.beginPath();
            ctx.arc(projX, projY, pulse, 0, Math.PI * 2);
            ctx.globalAlpha = 0.35;
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Core Hotspot Dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(projX, projY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = hs.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label Box
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = hs.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(projX + 8, projY - 12, 120, 24, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillText(hs.title.substring(0, 18) + '...', projX + 14, projY + 3);
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotationSpeed, showHotspots]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 relative overflow-hidden space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            Interactive 3D WebGL Visualization
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1 flex items-center gap-2">
            <Globe className="w-5 h-5 text-eco-400" />
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click and drag to rotate the 3D planet in real-time. View live global sustainability metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRotationSpeed(prev => (prev === 0 ? 0.005 : 0))}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-eco-400" />
            {rotationSpeed === 0 ? 'Resume Rotation' : 'Pause Auto-Spin'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Floating 3D Control Hints Overlay */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-semibold flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-eco-400" />
          <span>Drag mouse to orbit 360° • WebGL 3D Active</span>
        </div>

        {/* Hotspots Info Cards Bar */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setSelectedHotspot(hs)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[10px] font-bold text-white transition-all flex items-center gap-1"
              style={{ borderLeftColor: hs.color, borderLeftWidth: '3px' }}
            >
              <span>{hs.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Hotspot Modal Popup */}
      {selectedHotspot && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-xs space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedHotspot.color }}></span>
              {selectedHotspot.title}
            </span>
            <button onClick={() => setSelectedHotspot(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="text-slate-300">{selectedHotspot.details}</p>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800 font-semibold text-emerald-400">
            <span>Impact Benchmark: {selectedHotspot.impact}</span>
            <span className="text-slate-400">Category: {selectedHotspot.category}</span>
          </div>
        </div>
      )}
    </div>
  );
}
