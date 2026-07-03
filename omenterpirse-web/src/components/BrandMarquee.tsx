"use client";

import React from "react";

const BRAND_LOGOS: Record<string, React.ReactNode> = {
  Polycab: (
    <svg className="h-7 w-auto" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 5)">
        <circle cx="15" cy="15" r="14" fill="#E53935" />
        <path d="M 11.2,8.8 A 7.5,7.5 0 1,0 18.8,8.8" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <line x1="15" y1="4" x2="15" y2="14" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      </g>
      <text x="45" y="26" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="18" fill="#E53935" letterSpacing="0.5">POLYCAB</text>
    </svg>
  ),
  Finolex: (
    <svg className="h-6 w-auto" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="26" fontFamily="'Playfair Display', 'Georgia', serif" fontWeight="800" fontStyle="italic" fontSize="22" fill="#2E7D32">Finolex</text>
      <path d="M5 32 Q 40 28, 95 31" stroke="#E65100" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  ),
  KEI: (
    <svg className="h-6 w-auto" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="26" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#0D47A1" letterSpacing="1">KEI</text>
      <path d="M5 30 H 45" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" />
      <text x="52" y="24" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="9" fill="#D32F2F">WIRES &amp; CABLES</text>
    </svg>
  ),
  "RR Kabel": (
    <svg className="h-7 w-auto" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="30" height="30" rx="4" fill="#D32F2F" />
      <text x="10" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="white">R</text>
      <text x="21" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="white">R</text>
      <text x="45" y="26" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#1A1A1A" letterSpacing="2">KABEL</text>
    </svg>
  ),
  Legrand: (
    <svg className="h-6 w-auto" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 8)">
        <rect x="0" y="0" width="8" height="24" fill="#E53935" />
        <rect x="12" y="0" width="8" height="24" fill="#E53935" />
        <rect x="0" y="8" width="20" height="8" fill="#E53935" />
      </g>
      <text x="35" y="27" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="21" fill="#1A1A1A" letterSpacing="-0.5">legrand</text>
    </svg>
  ),
  Anchor: (
    <svg className="h-7 w-auto" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 5)" stroke="#D32F2F" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="15" cy="8" r="4" />
        <line x1="15" y1="12" x2="15" y2="28" />
        <line x1="9" y1="17" x2="21" y2="17" />
        <path d="M7 22 C 7 28, 23 28, 23 22" />
        <path d="M5 21 L8 23 M25 21 L22 23" />
      </g>
      <text x="42" y="26" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="16" fill="#D32F2F" letterSpacing="1.5">ANCHOR</text>
    </svg>
  ),
  Havells: (
    <svg className="h-6 w-auto" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 10)">
        <path d="M0 0 H 15 V 10 H 0 Z" fill="#D32F2F" />
        <path d="M15 10 H 30 V 20 H 15 Z" fill="#1A1A1A" />
        <path d="M0 10 L 15 20 H 0 Z" fill="#D32F2F" />
      </g>
      <text x="42" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="18" fill="#1A1A1A" letterSpacing="0.5">HAVELLS</text>
    </svg>
  ),
  "Schneider Electric": (
    <svg className="h-7 w-auto" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 8)">
        <path d="M5 10 C 10 5, 20 5, 20 12 C 20 20, 10 20, 5 22 Z" fill="#4CAF50" />
        <line x1="5" y1="5" x2="20" y2="20" stroke="white" strokeWidth="2.5" />
      </g>
      <text x="32" y="21" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="13" fill="#3E2723">Schneider</text>
      <text x="32" y="32" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="11" fill="#4CAF50">Electric</text>
    </svg>
  ),
  ABB: (
    <svg className="h-8 w-auto" viewBox="0 0 90 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="28" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="30" fill="#FF0000" letterSpacing="-1.5">ABB</text>
      <rect x="6" y="4" width="68" height="3" fill="#FF0000" />
    </svg>
  ),
  Siemens: (
    <svg className="h-6 w-auto" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="22" fill="#008B8B" letterSpacing="0.5">SIEMENS</text>
    </svg>
  ),
  Philips: (
    <svg className="h-6 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="21" fill="#0F52BA" letterSpacing="1">PHILIPS</text>
    </svg>
  ),
  Surya: (
    <svg className="h-7 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="20" r="10" fill="#FF9800" />
      <circle cx="15" cy="20" r="7" fill="white" />
      <circle cx="15" cy="20" r="5" fill="#E53935" />
      <text x="32" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="#E53935" letterSpacing="0.5">SURYA</text>
    </svg>
  ),
  Crompton: (
    <svg className="h-6 w-auto" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="20" fill="#0D47A1" letterSpacing="0.5">Crompton</text>
    </svg>
  ),
  Orient: (
    <svg className="h-9 w-auto" viewBox="0 0 170 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 5)">
        <path d="M10,4 C5,4 2,7 2,16 C2,25 5,28 10,28 L22,28 C26,28 29,25 29,22 L29,21 L23,21 L23,22 C23,23 21,24 19,24 L10,24 C8,24 6,22 6,16 C6,10 8,8 10,8 L19,8 C21,8 23,9 23,10 L23,13 L29,13 L29,10 C29,5 26,4 22,4 Z" fill="#FF5E00" />
      </g>
      <text x="42" y="22" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="18" fill="#FF5E00">orient</text>
      <text x="42" y="34" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="12" fill="#FF5E00" letterSpacing="0.5">electric</text>
    </svg>
  ),
  Usha: (
    <svg className="h-6 w-auto" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="27" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="22" fill="#D32F2F" letterSpacing="2">USHA</text>
    </svg>
  ),
};

const BRANDS = Object.keys(BRAND_LOGOS);

function BrandLogo({ name }: { name: string }) {
  const logo = BRAND_LOGOS[name];

  return (
    <div className="group flex items-center justify-center px-8 py-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all text-center h-16 min-w-[200px] select-none mx-4 hover:border-brand/20 hover:shadow-md">
      <div className="opacity-95 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center w-full h-full">
        {logo}
      </div>
    </div>
  );
}

export default function BrandMarquee() {
  // Duplicate the array to ensure a seamless looping effect
  const marqueeItems = [...BRANDS, ...BRANDS];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Gradient Fades for Left and Right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-light to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-light to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee">
        {marqueeItems.map((brand, index) => (
          <BrandLogo key={`${brand}-${index}`} name={brand} />
        ))}
      </div>
    </div>
  );
}
