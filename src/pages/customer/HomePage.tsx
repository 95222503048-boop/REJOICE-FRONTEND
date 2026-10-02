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
      <section className="bg-gradient-to-br from-chocolate via-chocolate to-chocolate/90 text-cream py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4 leading-tight">
              {BUSINESS_INFO.name}
            </h1>
            <p className="text-2xl text-gold mb-6 font-playfair italic">
              {BUSINESS_INFO.tagline}
            </p>
            <p className="text-lg text-cream/90 max-w-2xl mx-auto mb-8">
              {BUSINESS_INFO.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/menu"
              className="bg-gold text-chocolate px-8 py-4 rounded font-bold text-lg hover:bg-opacity-90 transition-all"
            >
              Browse Menu
            </Link>
            <Link
              to="/reviews"
              className="bg-cream text-chocolate px-8 py-4 rounded font-bold text-lg hover:bg-opacity-90 transition-all"
            >
              Read Reviews
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex justify-center gap-8 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Artisan Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span>Local Ingredients</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-chocolate mb-3">
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl font-bold text-chocolate text-center mb-12">
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
      <section className="py-16 px-4 bg-gold/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-chocolate mb-3">
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

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded text-chocolate focus:outline-none"
            />
            <button className="bg-gold text-chocolate px-6 py-3 rounded font-bold hover:bg-opacity-90 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
