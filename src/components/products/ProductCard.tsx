import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { getProductId, formatPrice, getProductImage } from '../../utils/productHelper';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'featured' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const productId = getProductId(product);
  const productImage = getProductImage(product);

  const handleAddToCart = () => {
    addToCart(productId, quantity);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  if (variant === 'featured') {
    return (
      <article className="product-card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
        <div className="product-image bg-gradient-to-br from-gold/10 to-chocolate/10 aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl" aria-hidden="true">🍰</div>
          )}
        </div>
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h3 className="font-playfair text-xl font-bold text-chocolate mb-2">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="font-playfair text-2xl font-bold text-chocolate">
              {formatPrice(product.basePrice)}
            </span>
            {!product.available && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                Unavailable
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags && product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gold/20 text-gold px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className={`w-full min-h-11 py-2 rounded-full font-semibold transition-all mt-auto ${
              product.available
                ? 'bg-chocolate text-cream hover:bg-opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.available ? 'Add to Cart' : 'Out of Stock'}
          </button>
          {showAddedMessage && (
            <p className="text-xs text-green-600 mt-2 text-center">✓ Added to cart!</p>
          )}
        </div>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className="product-card bg-white rounded-2xl shadow p-4 flex gap-4 items-start hover:shadow-lg transition-shadow">
        <div className="bg-gradient-to-br from-gold/10 to-chocolate/10 w-24 h-24 rounded flex items-center justify-center flex-shrink-0">
          <div className="text-4xl">🍰</div>
        </div>
        <div className="flex-1">
          <h4 className="font-playfair font-bold text-chocolate text-lg">
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-chocolate">₹{product.basePrice}</span>
            {!product.available && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                Unavailable
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-gold rounded text-center"
            />
            <button
              onClick={handleAddToCart}
              className="bg-chocolate text-cream px-4 py-1 rounded text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Grid variant (default)
  return (
    <article className="product-card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="product-image bg-gradient-to-br from-gold/10 to-chocolate/10 aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden">
        {productImage ? <img src={productImage} alt={product.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="text-5xl" aria-hidden="true">🍰</div>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-playfair font-bold text-chocolate mb-1 text-sm">
          {product.name}
        </h4>
        <p className="text-xs text-gray-600 mb-2 flex-1">{product.description}</p>
        <div className="mb-2">
          <span className="font-bold text-chocolate">₹{product.basePrice}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-chocolate text-cream py-2 rounded text-sm font-semibold hover:bg-opacity-90 transition-all mt-auto"
        >
          Add to Cart
        </button>
        {showAddedMessage && (
          <p className="text-xs text-green-600 mt-1 text-center">✓ Added!</p>
        )}
      </div>
    </article>
  );
};
