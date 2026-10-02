import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header variant="customer" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
