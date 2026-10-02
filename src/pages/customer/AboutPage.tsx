import React from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { BUSINESS_INFO } from '../../data/mockData';

export const AboutPage: React.FC = () => {
  return (
    <CustomerLayout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-4">
            About {BUSINESS_INFO.name}
          </h1>
          <p className="text-xl text-gold italic mb-6">
            {BUSINESS_INFO.tagline}
          </p>
          <div className="h-1 w-24 bg-gold rounded mx-auto"></div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">
            Our Story
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {BUSINESS_INFO.name} was born from a passion for creating not just cakes, but
            memories. Every creation is handcrafted with love, using the finest local
            ingredients and time-honored techniques.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Based in {BUSINESS_INFO.city}, we've been serving the community for over 3
            years, crafting celebrations one cake at a time. Our commitment to quality,
            freshness, and artistry makes every order special.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether it's a birthday, anniversary, wedding, or just because—we believe
            every moment deserves a little piece of happiness. That's our promise:
            {' '}
            <span className="font-semibold">{BUSINESS_INFO.description}</span>
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'Quality',
              description:
                'Only the finest ingredients, carefully sourced locally. No shortcuts, no compromises.',
            },
            {
              title: 'Craftsmanship',
              description:
                'Every cake is handmade with artistic touch and attention to detail. A true work of edible art.',
            },
            {
              title: 'Love',
              description:
                'We bake with our hearts, infusing every creation with passion and care for our customers.',
            },
          ].map((value, idx) => (
            <div key={idx} className="bg-cream rounded-lg p-6 text-center">
              <h3 className="font-bold text-chocolate text-lg mb-2">
                {value.title}
              </h3>
              <p className="text-gray-700 text-sm">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-chocolate text-cream rounded-lg p-8 text-center">
          <h3 className="font-playfair text-2xl font-bold mb-4">
            Certified & Trusted
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold mb-1">FSSAI Registration</p>
              <p className="text-cream/80">{BUSINESS_INFO.fssai}</p>
            </div>
            <div>
              <p className="font-bold mb-1">Health & Safety</p>
              <p className="text-cream/80">100% Compliant & Certified</p>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
