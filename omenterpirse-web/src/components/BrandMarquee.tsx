"use client";

import React from "react";

const BRAND_LOGOS: Record<string, React.ReactNode> = {
  Polycab: (
    <svg className="h-10 w-auto" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="polyO" x1="1" y1="0" x2="0.2" y2="0.8">
          <stop offset="0%" stopColor="#9C27B0" />
          <stop offset="50%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#E31B23" />
        </linearGradient>
      </defs>
      <text x="5" y="29.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="27" fill="#E31B23" letterSpacing="-0.5">P</text>
      <path d="M 45.8 13.4 A 9.5 9.5 0 1 0 45.8 25.6" stroke="url(#polyO)" strokeWidth="4.8" strokeLinecap="round" fill="none" />
      <text x="55" y="29.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="27" fill="#E31B23" letterSpacing="-0.5">LYCAB</text>
    </svg>
  ),
  Finolex: (
    <svg className="h-9 w-auto" viewBox="0 0 140 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="21" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#0096D6" letterSpacing="-0.5">Finolex</text>
      <line x1="5" y1="26" x2="135" y2="26" stroke="#4B4B4B" strokeWidth="1" />
      <text x="5" y="37" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="10" fill="#333333" letterSpacing="0.2">Cables Limited</text>
    </svg>
  ),
  KEI: (
    <svg className="h-10 w-auto" viewBox="0 0 140 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="keiGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A5B9C" />
          <stop offset="50%" stopColor="#43C1F2" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
      </defs>
      <g transform="translate(14, 0)">
        <text x="0" y="24" fontFamily="'Inter', sans-serif" fontWeight="950" fontStyle="italic" fontSize="26" fill="url(#keiGrad)" stroke="#001830" strokeWidth="0.8" transform="skewX(-15)" letterSpacing="-0.5">KEI</text>
      </g>
      <text x="6" y="38" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="12" fill="#1E1E1E" letterSpacing="0.2">Wires &amp; Cables</text>
    </svg>
  ),
  Legrand: (
    <svg className="h-9 w-auto" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 4)">
        {/* Top-right L-bracket */}
        <path d="M 12 0 H 24 V 12 H 19.5 V 4.5 H 12 Z" fill="#000000" />
        {/* Bottom-left L-bracket */}
        <path d="M 0 12 H 4.5 V 19.5 H 12 V 24 H 0 Z" fill="#000000" />
        {/* Two vertical lines */}
        <rect x="8" y="-2" width="2" height="20" fill="#000000" />
        <rect x="14" y="6" width="2" height="20" fill="#000000" />
      </g>
      {/* legrand text */}
      <text x="35" y="24" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#E21A22" letterSpacing="-1">legrand</text>
    </svg>
  ),
  Anchor: (
    <svg className="h-10 w-auto" viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 2)">
        {/* Red background square */}
        <rect x="0" y="0" width="28" height="28" rx="2" fill="#E21A22" />
        {/* White Anchor */}
        <circle cx="14" cy="6.5" r="2.2" stroke="white" strokeWidth="1.8" fill="none" />
        <rect x="13" y="8.5" width="2" height="12" fill="white" />
        <rect x="9" y="11.5" width="10" height="2" fill="white" />
        <path d="M 6.5 15.5 C 6.5 22.5, 21.5 22.5, 21.5 15.5 C 20.3 18, 17.5 19.2, 14 19.2 C 10.5 19.2, 7.7 18, 6.5 15.5 Z" fill="white" />
      </g>
      {/* ANCHOR text */}
      <text x="40" y="26.5" fontFamily="'Inter', sans-serif" fontWeight="950" fontSize="25" fill="#E21A22" letterSpacing="-0.5">ANCHOR</text>
    </svg>
  ),
  Havells: (
    <svg className="h-9 w-auto" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 10)">
        <path d="M0 0 H 15 V 10 H 0 Z" fill="#D32F2F" />
        <path d="M15 10 H 30 V 20 H 15 Z" fill="#1A1A1A" />
        <path d="M0 10 L 15 20 H 0 Z" fill="#D32F2F" />
      </g>
      <text x="42" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="18" fill="#1A1A1A" letterSpacing="0.5">HAVELLS</text>
    </svg>
  ),
  Siemens: (
    <svg className="h-9 w-auto" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="22" fill="#008B8B" letterSpacing="0.5">SIEMENS</text>
    </svg>
  ),
  Philips: (
    <svg className="h-9 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="21" fill="#0F52BA" letterSpacing="1">PHILIPS</text>
    </svg>
  ),
  Surya: (
    <svg className="h-11 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="20" r="10" fill="#FF9800" />
      <circle cx="15" cy="20" r="7" fill="white" />
      <circle cx="15" cy="20" r="5" fill="#E53935" />
      <text x="32" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="#E53935" letterSpacing="0.5">SURYA</text>
    </svg>
  ),
  Crompton: (
    <svg className="h-9 w-auto" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="20" fill="#0D47A1" letterSpacing="0.5">Crompton</text>
    </svg>
  ),
  Orient: (
    <svg className="h-14 w-auto" viewBox="0 0 170 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 5)">
        <path d="M10,4 C5,4 2,7 2,16 C2,25 5,28 10,28 L22,28 C26,28 29,25 29,22 L29,21 L23,21 L23,22 C23,23 21,24 19,24 L10,24 C8,24 6,22 6,16 C6,10 8,8 10,8 L19,8 C21,8 23,9 23,10 L23,13 L29,13 L29,10 C29,5 26,4 22,4 Z" fill="#FF5E00" />
      </g>
      <text x="42" y="22" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="18" fill="#FF5E00">orient</text>
      <text x="42" y="34" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="12" fill="#FF5E00" letterSpacing="0.5">electric</text>
    </svg>
  ),
  Usha: (
    <svg className="h-9 w-auto" viewBox="0 0 128 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="1" width="28" height="28" rx="5" fill="#E11B22" />
      <text x="14" y="21.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="19" fill="white" textAnchor="middle">U</text>
      
      <rect x="31" y="1" width="28" height="28" rx="5" fill="#E11B22" />
      <text x="45" y="21.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="19" fill="white" textAnchor="middle">S</text>
      
      <rect x="62" y="1" width="28" height="28" rx="5" fill="#E11B22" />
      <text x="76" y="21.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="19" fill="white" textAnchor="middle">H</text>
      
      <rect x="93" y="1" width="28" height="28" rx="5" fill="#E11B22" />
      <text x="107" y="21.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="19" fill="white" textAnchor="middle">A</text>
      
      <text x="122" y="7" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="6" fill="#777777">®</text>
    </svg>
  ),
};

const BRANDS = Object.keys(BRAND_LOGOS);

function BrandLogo({ name }: { name: string }) {
  const logo = BRAND_LOGOS[name];

  return (
    <div className="group flex items-center justify-center px-10 py-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all text-center h-24 min-w-[260px] select-none mx-4 hover:border-brand/20 hover:shadow-md">
      <div className="opacity-95 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center w-full h-full">
        {logo}
      </div>
    </div>
  );
}

export default function BrandMarquee() {
  // Duplicate the array to ensure a seamless looping effect
  const marqueeItems = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div className="relative w-full overflow-hidden py-4">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-local {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-local:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Gradient Fades for Left and Right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-light to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-light to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee-local">
        {marqueeItems.map((brand, index) => (
          <BrandLogo key={`${brand}-${index}`} name={brand} />
        ))}
      </div>
    </div>
  );
}
