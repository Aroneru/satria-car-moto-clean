'use client';
"use client"; 

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface NavigationProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Navigation({ activePage, setActivePage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-[#1D1D1D] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <Image 
              src="/images/logo.png" 
              alt="Satria Logo" 
              width={48} 
              height={48} 
              className="h-12 w-12" 
            />
            <div>
              <h1 className="font-bold text-xl text-[#FCDE04]">Satria</h1>
              <p className="text-xs text-gray-300">Car & Moto Clean</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors relative pb-1 ${
                  activePage === item.id
                    ? 'text-[#FCDE04]'
                    : 'text-white hover:text-[#FCDE04]'
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCDE04]" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left py-3 px-4 text-sm font-medium transition-colors ${
                  activePage === item.id
                    ? 'text-[#FCDE04] bg-[#2D2D2D]'
                    : 'text-white hover:bg-[#2D2D2D]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}