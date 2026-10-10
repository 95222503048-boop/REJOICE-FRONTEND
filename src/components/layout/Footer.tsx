import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer data-reveal="up" className="bg-chocolate text-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4">
              {BUSINESS_INFO.name}
            </h3>
            <p className="text-sm mb-2">Handcrafted Patisserie</p>
            <p className="text-xs text-gold font-semibold">
              FSSAI: {BUSINESS_INFO.fssai}
            </p>
            <div className="mt-4">
              <p className="text-xs italic">{BUSINESS_INFO.tagline}</p>
            </div>
          </div>

          {/* Visit Our Kitchen */}
          <div>
            <h4 className="font-semibold mb-4">Visit Our Kitchen</h4>
            <ul className="text-sm space-y-2">
              <li>{BUSINESS_INFO.address}</li>
              <li className="text-gold">📞 {BUSINESS_INFO.phone}</li>
              {BUSINESS_INFO.instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${BUSINESS_INFO.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    📷 {BUSINESS_INFO.instagram}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/menu" className="hover:text-gold transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-gold transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <div className="space-y-2 text-sm mb-4">
              <p>Have questions? We're here to help!</p>
              <Link to="/help" className="text-gold hover:underline">
                Get Help →
              </Link>
            </div>
            <div className="border-t border-gold/30 pt-4">
              <p className="text-xs font-semibold text-gold">COASTAL FRESH GUARANTEE</p>
              <p className="text-xs mt-2">
                Every creation uses the freshest local ingredients.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold/20 pt-6 text-center text-xs text-gold/70">
          <p>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </p>
          <p className="mt-2">Baked with Love. Made to Rejoice.</p>
        </div>
      </div>
    </footer>
  );
};
