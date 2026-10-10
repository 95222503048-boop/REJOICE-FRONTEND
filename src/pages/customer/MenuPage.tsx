import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { ProductCard } from '../../components/products/ProductCard';
import { BUSINESS_INFO } from '../../data/mockData';
import * as productService from '../../services/productService';
import { Product } from '../../types';

export const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response =
          selectedCategory === 'all'
            ? await productService.getProducts()
            : await productService.getProductsByCategory(selectedCategory);
        setProducts(response.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const categoryList = [
    { id: 'all', label: 'All' },
    ...categories.map((cat) => ({ id: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) })),
  ];

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section data-reveal="up" className="bg-gradient-to-br from-chocolate to-chocolate/80 text-cream py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="bg-gold/30 text-gold px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Artisanal Collections
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Our Menu
          </h1>
          <p className="text-cream/90 max-w-2xl mx-auto mb-4">
            Handcrafted with love and the finest local ingredients. Every creation is a
            celebration of tradition and innovation.
          </p>
          <div className="flex justify-center items-center gap-2 text-sm">
            <span>🌾</span>
            <span>Local Ingredients</span>
            <span>•</span>
            <span>🎨</span>
            <span>Artisanal Crafted</span>
            <span>•</span>
            <span>💫</span>
            <span>Fresh Daily</span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section data-reveal="up" className="bg-cream border-b border-gold/20 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-chocolate text-cream'
                    : 'bg-white text-chocolate border border-gold/30 hover:border-gold'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section data-reveal="up" className="py-12 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-chocolate/60">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-chocolate/60">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section data-reveal="up" className="bg-chocolate text-cream rounded-lg p-8 m-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="font-playfair text-2xl font-bold mb-2">Custom Orders</h4>
            <p className="text-sm text-cream/80">
              Design your dream cake. Contact us for custom creations.
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-playfair text-2xl font-bold mb-2">Delivery</h4>
            <p className="text-sm text-cream/80">
              Free delivery on orders above ₹1500. Same-day delivery available.
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-playfair text-2xl font-bold mb-2">Bulk Orders</h4>
            <p className="text-sm text-cream/80">
              Corporate orders and bulk catering available.
            </p>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
