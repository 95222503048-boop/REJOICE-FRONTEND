import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { BUSINESS_INFO } from '../../data/mockData';

interface HeaderProps {
  variant?: 'customer' | 'admin';
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Our Story' },
  { href: '/menu', label: 'Menu' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/help', label: 'Help' },
  { href: '/my-orders', label: 'My Orders' },
];

export const Header: React.FC<HeaderProps> = ({ variant = 'customer' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header data-variant={variant} className="site-header bg-chocolate text-cream sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="brand-link flex items-center gap-3 min-w-0" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="min-w-0">
            <span className="block brand-name font-playfair font-bold truncate">{BUSINESS_INFO.name}</span>
            <span className="brand-caption hidden sm:block">Baked with love in {BUSINESS_INFO.city}</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) => `desktop-nav-link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/cart" className="header-cart" aria-label={`Shopping cart${totalItems ? `, ${totalItems} items` : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="max-w-36 truncate text-xs text-cream/75">{user.email}</span>
              <button onClick={handleSignOut} className="header-cta">Sign Out</button>
            </div>
          ) : (
            <>
              <Link to="/sign-in" className="hidden sm:inline-flex header-signin">Sign In</Link>
              <Link to="/menu" className="hidden sm:inline-flex header-cta">Order Now</Link>
            </>
          )}

          <button
            type="button"
            className="mobile-menu-toggle lg:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12M18 6 6 18" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation lg:hidden">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={handleSignOut} className="mobile-nav-link text-left">Sign Out</button>
            ) : (
              <Link to="/sign-in" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Sign In</Link>
            )}
            <Link to="/menu" onClick={() => setMenuOpen(false)} className="mobile-nav-order">Explore the menu <span aria-hidden="true">→</span></Link>
          </div>
        </nav>
      )}
    </header>
  );
};
