import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { ProductCard } from '../../components/products/ProductCard';
import { BUSINESS_INFO, REVIEWS } from '../../data/mockData';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import * as productService from '../../services/productService';
import { Product } from '../../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const topReviews = REVIEWS.slice(0, 3);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getProducts();
        setFeaturedProducts(response.products.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="home-hero relative overflow-hidden bg-chocolate text-cream px-4 py-14 sm:py-20 lg:py-24">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-16 items-center">
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <p className="hero-eyebrow mb-5"><span aria-hidden="true">✦</span> Freshly baked, made for your moment</p>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-5 leading-[1.08]">
              A little joy,<br className="hidden sm:block" /> baked fresh.
            </h1>
            <p className="text-lg sm:text-xl text-gold mb-4 font-playfair italic">
              {BUSINESS_INFO.tagline}
            </p>
            <p className="text-base sm:text-lg text-cream/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {BUSINESS_INFO.description} Handcrafted cakes and sweets for the moments worth celebrating.
            </p>

            <div className="flex gap-3 justify-center lg:justify-start flex-col sm:flex-row">
            <Link
              to="/menu"
              className="hero-primary-cta"
            >
              Explore the menu <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/help"
              className="hero-secondary-cta"
            >
              Plan a celebration
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center lg:justify-start gap-x-5 gap-y-3 text-xs sm:text-sm text-cream/75 flex-wrap">
            <div className="flex items-center gap-2"><span className="text-gold" aria-hidden="true">✦</span><span>Small-batch baking</span></div>
            <div className="flex items-center gap-2"><span className="text-gold" aria-hidden="true">✦</span><span>Made to order</span></div>
            <div className="flex items-center gap-2"><span className="text-gold" aria-hidden="true">✦</span><span>Local ingredients</span></div>
          </div>
        </div>

        <div className="hero-showcase relative hidden sm:flex items-center justify-center" aria-label="A taste of our handcrafted cakes">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-cake-art" aria-hidden="true"><span>🍰</span></div>
          <div className="hero-note"><span className="text-gold">Made with care</span><span>for your sweetest days</span></div>
          <div className="hero-stamp" aria-hidden="true">BAKED<br />FRESH<br /><span>✦</span></div>
        </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-14 sm:py-20 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-chocolate mb-3">
              Featured Creations
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover our most beloved artisanal creations
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-block bg-chocolate text-cream px-8 py-4 rounded font-bold hover:bg-opacity-90 transition-all"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-chocolate text-center mb-10 sm:mb-12">
            Why Rejoice Cakes?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="font-playfair text-2xl font-bold text-chocolate mb-2">
                Artisanal Crafted
              </h3>
              <p className="text-gray-700">
                Each creation is handcrafted with precision and passion
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="font-playfair text-2xl font-bold text-chocolate mb-2">
                Premium Ingredients
              </h3>
              <p className="text-gray-700">
                We source only the finest local and international ingredients
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="font-playfair text-2xl font-bold text-chocolate mb-2">
                Made with Love
              </h3>
              <p className="text-gray-700">
                Every order is prepared with care and attention to detail
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-14 sm:py-20 px-4 bg-gold/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-chocolate mb-3">
              Customer Love
            </h2>
            <p className="text-gray-700">
              Trusted by hundreds of happy customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/reviews"
              className="inline-block bg-chocolate text-cream px-8 py-4 rounded font-bold hover:bg-opacity-90 transition-all"
            >
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-chocolate text-cream">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4">
            Get Special Offers
          </h2>
          <p className="mb-8 text-cream/90">
            Subscribe to receive updates on new creations and special discounts
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              aria-label="Email address"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl text-chocolate focus:outline-none"
            />
            <button type="button" className="bg-gold text-chocolate px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </CustomerLayout>
  );
};
