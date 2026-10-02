import React, { useState } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { BUSINESS_INFO } from '../../data/mockData';

export const HelpPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer:
        'Browse our menu, add items to cart, proceed to checkout, and submit your order request. Our baker will review and contact you for confirmation.',
    },
    {
      question: 'What is the minimum preparation time?',
      answer:
        'Most items require 24-48 hours preparation. Custom cakes may need 3-7 days. You can select your preferred delivery date during checkout.',
    },
    {
      question: 'Do you offer custom cake designs?',
      answer:
        'Yes! We love custom orders. Contact us directly via phone or Instagram to discuss your specific requirements, and we\'ll create something special.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept cash on delivery, bank transfers, and UPI payments. Payment details will be confirmed when we call you after your order request.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer:
        'Orders can be modified before the baker starts preparation. Contact us immediately if you need changes. Cancellation charges may apply based on preparation stage.',
    },
    {
      question: 'Do you deliver outside Thoothukudi?',
      answer:
        'We currently deliver within Thoothukudi with varying delivery fees based on distance. For orders outside the city, please contact us directly.',
    },
    {
      question: 'Are your products suitable for allergies?',
      answer:
        'We use common ingredients and handle multiple products in our kitchen. Please mention any allergies in special requests so we can advise appropriately.',
    },
    {
      question: 'How do I write a review?',
      answer:
        'Visit our Reviews page, and look for the "Write a Review" button. You can share your experience with our products and service there.',
    },
  ];

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-chocolate to-chocolate/80 text-cream py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-cream/90 max-w-2xl mx-auto">
            We're here to help! Find answers to common questions or reach out to our team.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="bg-cream py-12 px-4 border-b border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-bold text-chocolate mb-2">Call Us</h3>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="text-gold hover:text-chocolate font-semibold text-lg"
              >
                {BUSINESS_INFO.phone}
              </a>
              <p className="text-xs text-gray-600 mt-3">
                Mon-Sun, 9 AM - 9 PM IST
              </p>
            </div>

            {/* Instagram */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">📷</div>
              <h3 className="font-bold text-chocolate mb-2">Message on Instagram</h3>
              <a
                href={`https://instagram.com/${BUSINESS_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-chocolate font-semibold"
              >
                @{BUSINESS_INFO.instagram}
              </a>
              <p className="text-xs text-gray-600 mt-3">
                Quick response typically within 2 hours
              </p>
            </div>

            {/* Visit */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="font-bold text-chocolate mb-2">Visit Our Kitchen</h3>
              <p className="text-sm text-chocolate">
                {BUSINESS_INFO.address}
                <br />
                {BUSINESS_INFO.city} - {BUSINESS_INFO.postalCode}
              </p>
              <p className="text-xs text-gray-600 mt-3">
                By appointment preferred
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-chocolate text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === idx ? null : idx)
                  }
                  className="w-full p-6 flex justify-between items-center hover:bg-cream/30 transition-colors"
                >
                  <h3 className="font-semibold text-chocolate text-left">
                    {faq.question}
                  </h3>
                  <span
                    className={`text-2xl transition-transform ${
                      expandedFaq === idx ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6 bg-cream/30 border-t border-gold/20">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Assurance */}
      <section className="bg-chocolate text-cream py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-center mb-8">
            Why Trust Rejoice?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: '✓',
                title: 'FSSAI Certified',
                detail: `Registration: ${BUSINESS_INFO.fssai}`,
              },
              {
                icon: '🎯',
                title: '100% Fresh',
                detail: 'Made fresh daily with quality ingredients',
              },
              {
                icon: '💝',
                title: 'Handcrafted',
                detail: 'Every creation is personally made with care',
              },
              {
                icon: '⭐',
                title: '5-Star Rated',
                detail: 'Trusted by hundreds of happy customers',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-cream/80">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Baker Contact Banner */}
      <section className="bg-cream py-12 px-4">
        <div className="max-w-4xl mx-auto bg-chocolate text-cream rounded-lg p-8 text-center">
          <h3 className="font-playfair text-2xl font-bold mb-4">
            🧑‍🍳 Want to Speak with the Baker?
          </h3>
          <p className="mb-6">
            For custom orders, special requests, or detailed discussions about your cake,
            please call us directly.
          </p>
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="inline-block bg-gold text-chocolate px-8 py-3 rounded font-bold hover:bg-opacity-90 transition-all"
          >
            Call the Baker
          </a>
        </div>
      </section>
    </CustomerLayout>
  );
};
