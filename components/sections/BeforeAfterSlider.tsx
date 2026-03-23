'use client';
import { useState } from 'react';
const dirtyCarImage = '/images/mobil-kotor.png';
const cleanCarImage = '/images/mobil-bersih.png';

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div className="relative w-full aspect-video bg-white rounded-xl overflow-hidden shadow-2xl border-4 border-[#FCDE04]">
      <div
        className="relative w-full h-full select-none cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        {/* Dirty Car Image (Before) - Base layer */}
        <img
          src={dirtyCarImage}
          alt="Dirty Car - Before"
          className="absolute inset-0 w-full h-full object-contain bg-white"
          draggable={false}
        />

        {/* Clean Car Image (After) - Revealed by slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={cleanCarImage}
            alt="Clean Car - After"
            className="absolute inset-0 w-full h-full object-contain bg-white"
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold text-sm">
          BEFORE - DIRTY
        </div>
        <div className="absolute top-4 right-4 bg-[#FCDE04] text-[#1D1D1D] px-4 py-2 rounded-lg font-semibold text-sm">
          AFTER - CLEAN
        </div>

        {/* Slider Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-[#FCDE04]">
            <div className="flex gap-1">
              <div className="w-1 h-6 bg-[#1D1D1D] rounded"></div>
              <div className="w-1 h-6 bg-[#1D1D1D] rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-xs">
        ← Drag to compare →
      </div>
    </div>
  );
}