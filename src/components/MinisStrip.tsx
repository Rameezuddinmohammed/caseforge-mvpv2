'use client';

export default function MinisStrip() {
  return (
    <div className="relative w-full h-0">
      <div className="absolute top-0 right-0 w-1/5 h-12 bg-gray-800 text-white flex items-center justify-center font-medium text-sm z-10"
           style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
        <span>Minis</span>
      </div>
    </div>
  );
}