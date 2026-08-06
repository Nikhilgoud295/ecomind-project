import React from 'react';
import { Leaf } from 'lucide-react';

export default function LeafWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Top Right Large Light Green Leaf Watermark */}
      <div className="absolute -top-16 -right-16 text-emerald-500/10 dark:text-emerald-400/08 transform -rotate-12 scale-125 animate-pulse" style={{ animationDuration: '12s' }}>
        <Leaf className="w-[450px] h-[450px]" />
      </div>

      {/* Bottom Left Medium Light Green Leaf Watermark */}
      <div className="absolute -bottom-20 -left-20 text-teal-500/10 dark:text-teal-400/08 transform rotate-45 scale-110 animate-pulse" style={{ animationDuration: '16s' }}>
        <Leaf className="w-[400px] h-[400px]" />
      </div>

      {/* Center Right Subtle Ambient Leaf Watermark */}
      <div className="absolute top-1/3 -right-24 text-eco-400/06 transform -rotate-45 scale-90">
        <Leaf className="w-[320px] h-[320px]" />
      </div>

      {/* Center Left Subtle Ambient Leaf Watermark */}
      <div className="absolute top-2/3 -left-24 text-emerald-400/05 transform rotate-12 scale-90">
        <Leaf className="w-[300px] h-[300px]" />
      </div>
    </div>
  );
}
