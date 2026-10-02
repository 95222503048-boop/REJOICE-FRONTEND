import React, { useState } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { REVIEWS, REVIEW_STATS } from '../../data/mockData';

type SortOption = 'recent' | 'rating-high' | 'rating-low';
type FilterOption = 'all' | '5star' | '4star' | '3star';

export const ReviewsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showWriteForm, setShowWriteForm] = useState(false);

  // Filter and sort reviews
  let filteredReviews = [...REVIEWS];

  if (filterBy !== 'all') {
    const ratingMap: { [key: string]: number } = {
      '5star': 5,
      '4star': 4,
      '3star': 3,
    };
    filteredReviews = filteredReviews.filter((r) => r.rating === ratingMap[filterBy]);
  }

  if (sortBy === 'rating-high') {
    filteredReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating-low') {
    filteredReviews.sort((a, b) => a.rating - b.rating);
  } else {
    filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = (count / REVIEW_STATS.totalReviews) * 100;
    return (
      <div key={rating} className="flex items-center gap-2">
        <span className="text-sm font-semibold text-chocolate w-8">{rating}★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-gold rounded-full h-2 transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600 w-12 text-right">{count}</span>
      </div>
    );
  };

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-chocolate to-chocolate/80 text-cream py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-gold/30 text-gold px-4 py-2 rounded-full text-sm font-semibold">
                💬 Customer Testimonials
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </h1>
            <p className="text-cream/90 max-w-2xl mx-auto">
              Read genuine reviews from delighted customers who have experienced the magic
              of Rejoice Cakes & Sweets.
            </p>
          </div>

          {/* Rating Aggregate Card */}
          <div className="bg-white text-chocolate rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Overall Score */}
              <div className="text-center py-4 border-r border-gray-200">
                <div className="font-playfair text-5xl font-bold text-gold mb-2">
                  {REVIEW_STATS.averageRating.toFixed(1)}
                </div>
                <div className="text-lg font-semibold text-chocolate mb-2">
                  out of 5 stars
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl text-gold">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {REVIEW_STATS.totalReviews} verified reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) =>
                  renderRatingBar(rating, REVIEW_STATS.ratingDistribution[rating] || 0)
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <span className="text-2xl mb-1 block">✓</span>
                <p className="text-xs text-gray-600">Verified Orders</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-1 block">💝</span>
                <p className="text-xs text-gray-600">100% Genuine</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-1 block">🎯</span>
                <p className="text-xs text-gray-600">Baker Approved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Sort */}
      <section className="bg-cream border-b border-gold/20 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {(['all', '5star', '4star', '3star'] as FilterOption[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filterBy === filter
                    ? 'bg-chocolate text-cream'
                    : 'bg-white text-chocolate border border-gold/30 hover:border-gold'
                }`}
              >
                {filter === 'all'
                  ? 'All Reviews'
                  : `${filter.replace('star', '')} ★`}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="text-sm text-chocolate font-semibold">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 border border-gold/30 rounded text-sm text-chocolate bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Customer Photos Mosaic */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h3 className="font-playfair text-2xl font-bold text-chocolate mb-6 text-center">
              Customer Creations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Pistachio Slice', emoji: '🥜' },
                { title: 'Vintage Hatbox', emoji: '📦' },
                { title: 'Gold Leaf Cake', emoji: '✨' },
              ].map((photo, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gold/10 to-chocolate/10 rounded-lg aspect-square flex flex-col items-center justify-center"
                >
                  <div className="text-6xl mb-2">{photo.emoji}</div>
                  <p className="text-sm font-semibold text-chocolate text-center">
                    {photo.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Section */}
          <div className="bg-chocolate text-cream rounded-lg shadow-lg p-8">
            <h3 className="font-playfair text-2xl font-bold mb-4">Share Your Experience</h3>
            <p className="mb-6">
              Have you ordered from us? We'd love to hear about your experience!
            </p>

            {!showWriteForm ? (
              <button
                onClick={() => setShowWriteForm(true)}
                className="bg-gold text-chocolate px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
              >
                Write a Review
              </button>
            ) : (
              <form className="bg-chocolate/50 p-6 rounded space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded bg-cream text-chocolate"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-3xl hover:scale-125 transition-transform"
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Review Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded bg-cream text-chocolate"
                    placeholder="What was your favorite?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Review</label>
                  <textarea
                    className="w-full px-4 py-2 rounded bg-cream text-chocolate h-32"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-gold text-chocolate px-6 py-2 rounded font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWriteForm(false)}
                    className="bg-cream/20 text-cream px-6 py-2 rounded font-semibold hover:bg-opacity-30 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
