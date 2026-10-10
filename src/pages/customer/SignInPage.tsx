import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';

interface LocationState {
  from?: string;
}

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as LocationState)?.from || '/my-orders';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <section data-reveal="up" className="max-w-md mx-auto px-4 py-16">
        <div className="motion-card bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-playfair text-3xl font-bold text-chocolate text-center mb-2">
            Sign In
          </h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            Access your orders and account
          </p>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-gold/30 rounded focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gold/30 rounded focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-chocolate text-cream py-3 rounded font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gold/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">
                New to Rejoice?
              </span>
            </div>
          </div>

          <Link
            to="/register"
            className="block w-full bg-cream text-chocolate py-3 rounded font-bold text-center hover:bg-gray-100 transition-all border border-gold/30"
          >
            Create Account
          </Link>

          <p className="text-center text-xs text-gray-600 mt-6">
            Demo: Use any email/password to sign in
          </p>

          <Link
            to="/"
            className="block text-center text-chocolate hover:text-gold text-sm mt-4"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </CustomerLayout>
  );
};
