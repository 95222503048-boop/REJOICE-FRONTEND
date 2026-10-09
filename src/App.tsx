import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { MenuPage } from './pages/customer/MenuPage';
import { GalleryPage } from './pages/customer/GalleryPage';
import { ReviewsPage } from './pages/customer/ReviewsPage';
import { CartPage } from './pages/customer/CartPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { SignInPage } from './pages/customer/SignInPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { OrderRequestPage } from './pages/customer/OrderRequestPage';
import { OrderRequestSuccessPage } from './pages/customer/OrderRequestSuccessPage';
import { HelpPage } from './pages/customer/HelpPage';
import { AboutPage } from './pages/customer/AboutPage';

// Admin Pages
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

import {
  TermsPage,
  CookiePolicyPage,
  PrivacyPolicyPage,
} from './pages/customer/LegalPages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/order-request" element={<OrderRequestPage />} />
            <Route
              path="/order-request/success"
              element={<OrderRequestSuccessPage />}
            />

            {/* Admin Routes */}
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />

            <Route path="/terms" element={<TermsPage />} />
<Route path="/cookie-policy" element={<CookiePolicyPage />} />
<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
