import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { BUSINESS_INFO } from '../../data/mockData';

interface HeaderProps {
  variant?: 'customer' | 'admin';
}

export const Header: React.FC<HeaderProps> = ({ variant = 'customer' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/menu', label: 'Menu' },
    { href: '/help', label: 'Help' },
    { href: '/my-orders', label: 'My Orders' },
  ];

  return (
    <header className="bg-chocolate text-cream sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="brand-link flex items-center gap-3">
          <div className="text-2xl font-playfair font-bold">{BUSINESS_INFO.name}</div>
        </Link>

        {/* Nav Links - Hidden on mobile */}
        <nav className="hidden md:flex gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="nav-link hover:text-gold transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-gold transition-colors"
            title="Shopping Cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span key={totalItems} className="cart-count absolute -top-2 -right-2 bg-gold text-chocolate rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-gold text-chocolate px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-sm hover:text-gold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/cart"
                className="bg-gold text-chocolate px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Order Now
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="menu-toggle md:hidden rounded p-1"
            type="button"
            title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="mobile-menu-panel md:hidden border-t border-gold/20 px-4 py-3" aria-label="Mobile navigation">
          <div className="max-w-7xl mx-auto space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <span aria-hidden="true" className="text-gold">›</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
