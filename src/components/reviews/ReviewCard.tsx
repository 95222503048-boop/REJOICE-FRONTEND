import React from 'react';
import { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-gold text-lg' : 'text-gray-300 text-lg'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gold hover:shadow-lg transition-shadow">
      {/* Rating */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-chocolate">
            {review.userName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-chocolate">{review.userName}</h4>
            {review.productName && (
              <p className="text-xs text-gray-600">{review.productName}</p>
            )}
          </div>
        </div>
        {renderStars(review.rating)}
      </div>

      {/* Title */}
      <h5 className="font-playfair font-bold text-chocolate mb-2 text-lg">
        {review.title}
      </h5>

      {/* Content */}
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{review.content}</p>

      {/* Baker Reply */}
      {review.bakerReply && (
        <div className="bg-cream/50 border-l-2 border-gold rounded p-3 mt-4">
          <p className="text-xs font-semibold text-chocolate mb-1">🧑‍🍳 Baker's Reply:</p>
          <p className="text-sm text-gray-700">{review.bakerReply}</p>
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-gray-500 mt-4">
        {new Date(review.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </div>
  );
};
