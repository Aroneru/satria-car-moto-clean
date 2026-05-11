'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Footer({ activePage, setActivePage }: FooterProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1D1D1D] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image 
                src="/images/logo.png" 
                alt="Satria Logo" 
                width={40} 
                height={40} 
                className="h-10 w-10" 
              />
              <div>
                <h3 className="font-bold text-lg text-[#FCDE04]">Satria</h3>
                <p className="text-xs text-gray-400">Car & Moto Clean</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Profesional cleaning service untuk kendaraan Anda dengan hasil maksimal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#FCDE04]">Navigation</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="text-gray-400 hover:text-[#FCDE04] transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#FCDE04]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#FCDE04] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+62 878-8628-4658</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#FCDE04] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@satriaclean.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#FCDE04] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Jl. Raya Laladon, Laladon, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610</span>
              </li>
            </ul>
          </div>

          {/* Admin & Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#FCDE04]">Admin</h4>
            <Link
              href="/dashboard"
              className="inline-block w-full px-4 py-2 bg-[#FCDE04] text-[#1D1D1D] font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-center text-sm mb-6"
            >
              Login Admin
            </Link>
            <h4 className="font-semibold text-lg mb-3 text-[#FCDE04]">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#FCDE04] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/satriacarandmotoclean/"
                className="text-gray-400 hover:text-[#FCDE04] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FCDE04] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; 2026 Satria Car & Moto Clean. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#FCDE04] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-[#FCDE04] text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
