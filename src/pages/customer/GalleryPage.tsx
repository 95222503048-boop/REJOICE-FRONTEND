import React, { useState } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { GALLERY_IMAGES } from '../../data/mockData';

type GalleryFilter = 'all' | 'cakes' | 'biscuits' | 'sweets' | 'special';

export const GalleryPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<GalleryFilter>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filters: { id: GalleryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'biscuits', label: 'Biscuits' },
    { id: 'sweets', label: 'Sweets' },
    { id: 'special', label: 'Special' },
  ];

  const filteredImages =
    selectedFilter === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === selectedFilter);

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section data-reveal="up" className="bg-gradient-to-br from-chocolate to-chocolate/80 text-cream py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="bg-gold/30 text-gold px-4 py-2 rounded-full text-sm font-semibold">
              📸 Photo Gallery
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Artistry in Every Frame
          </h1>
          <p className="text-cream/90 max-w-2xl mx-auto mb-4">
            Explore our visual journey of handcrafted delights, each creation a work of
            edible art.
          </p>
          <div className="flex justify-center items-center gap-4 text-sm flex-wrap">
            <span>🎨 Artisan Designs</span>
            <span>•</span>
            <span>📸 Professional Photography</span>
            <span>•</span>
            <span>💫 Customer Moments</span>
          </div>
        </div>
      </section>

      {/* Decorative Ribbon */}
      <div className="bg-gold/20 h-1 w-24 mx-auto"></div>

      {/* Filter Pills */}
      <section data-reveal="up" className="bg-cream py-6 px-4 border-b border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-chocolate text-cream'
                    : 'bg-white text-chocolate border border-gold/30 hover:border-gold'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section data-reveal="up" className="py-12 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          {/* Masonry Grid using CSS Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max stagger-children">
            {filteredImages.map((image, idx) => {
              // Alternate sizing for visual interest
              const isLarge = idx === 0 || idx === 6;
              return (
                <div
                  key={image.id}
                  className={`relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group ${
                    isLarge ? 'lg:col-span-2 lg:row-span-2' : ''
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  {/* Placeholder with gradient */}
                  <div className="bg-gradient-to-br from-gold/20 to-chocolate/20 w-full h-full min-h-[250px] flex items-center justify-center group-hover:from-gold/30 group-hover:to-chocolate/30 transition-all">
                    <div className="text-center">
                      <div className="text-5xl mb-2">🍰</div>
                      <p className="text-sm font-semibold text-chocolate">
                        {image.title}
                      </p>
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-white text-center">
                      <p className="font-semibold mb-2">{image.title}</p>
                      <p className="text-xs">Click to view</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-all">
                    <div className="flex flex-wrap gap-1">
                      {image.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gold/80 text-chocolate px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instagram Community Banner */}
      <section data-reveal="up" className="bg-gradient-to-r from-chocolate to-chocolate/80 text-cream py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-playfair text-2xl font-bold mb-4">
            Share Your Rejoice Moments
          </h3>
          <p className="mb-6">
            Tag us on Instagram @rejoice_cakes_sweets to be featured in our gallery!
          </p>
          <a
            href="https://instagram.com/rejoice_cakes_sweets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-chocolate px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
          >
            Follow on Instagram
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section data-reveal="up" className="bg-cream py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-playfair text-2xl font-bold text-chocolate mb-4">
            Order Your Masterpiece
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Inspired by our gallery? Browse our menu and place your order today!
          </p>
          <a
            href="/menu"
            className="inline-block bg-chocolate text-cream px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
          >
            View Menu
          </a>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="modal-backdrop fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-panel bg-white rounded-lg max-w-2xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="text-2xl text-chocolate hover:text-gold"
              >
                ×
              </button>
            </div>
            <div className="bg-gradient-to-br from-gold/20 to-chocolate/20 rounded-lg aspect-square flex items-center justify-center">
              <div className="text-6xl">🍰</div>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};
