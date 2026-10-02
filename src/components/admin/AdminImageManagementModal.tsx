import React, { useState, useEffect } from 'react';
import * as adminImageService from '../../services/adminImageService';
import type { ProductImage } from '../../services/adminImageService';

interface AdminImageManagementModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onImageUpdate: () => void;
}

export const AdminImageManagementModal: React.FC<AdminImageManagementModalProps> = ({
  productId,
  productName,
  onClose,
  onImageUpdate,
}) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedImages, setReorderedImages] = useState<ProductImage[]>([]);

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, [productId]);

  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminImageService.getProductImages(productId);
      setImages(response.images);
      setReorderedImages(response.images);
    } catch (err) {
      console.error('Failed to load images:', err);
      setError(`Failed to load images: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setIsUploading(true);
    setUploadError(null);

    try {
      await adminImageService.uploadProductImages(productId, fileArray);
      // Reload images after successful upload
      await loadImages();
      // Reset file input
      e.currentTarget.value = '';
      onImageUpdate();
    } catch (err) {
      console.error('Failed to upload images:', err);
      setUploadError(`Failed to upload images: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    setDeletingImageId(imageId);
    try {
      await adminImageService.deleteProductImage(productId, imageId);
      setImages(images.filter(img => img.id !== imageId));
      setReorderedImages(reorderedImages.filter(img => img.id !== imageId));
      onImageUpdate();
    } catch (err) {
      console.error('Failed to delete image:', err);
      setError(`Failed to delete image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleReorderStart = () => {
    setReorderMode(true);
  };

  const handleReorderCancel = () => {
    setReorderMode(false);
    setReorderedImages(images);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...reorderedImages];
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    setReorderedImages(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === reorderedImages.length - 1) return;
    const newImages = [...reorderedImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setReorderedImages(newImages);
  };

  const handleReorderSave = async () => {
    try {
      const reorderData = reorderedImages.map((img, index) => ({
        imageId: img.id,
        position: index,
      }));
      await adminImageService.reorderProductImages(productId, reorderData);
      setImages(reorderedImages);
      setReorderMode(false);
      onImageUpdate();
    } catch (err) {
      console.error('Failed to reorder images:', err);
      setError(`Failed to reorder images: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">
          Manage Images - {productName}
        </h2>

        {error && <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-700 text-sm">{error}</div>}

        {uploadError && <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 text-orange-700 text-sm">{uploadError}</div>}

        {/* Upload Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <label className="block text-sm font-semibold text-chocolate mb-2">Upload New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading || isLoading || reorderMode}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-chocolate file:text-cream
              hover:file:bg-chocolate/90
              disabled:opacity-50"
          />
          <p className="text-xs text-gray-600 mt-2">Supported: JPEG, PNG, WebP (max 5 images at a time)</p>
          {isUploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
        </div>

        {/* Images Grid */}
        {isLoading ? (
          <p className="text-gray-600 text-center py-8">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No images yet. Upload some to get started!</p>
        ) : (
          <div>
            {reorderMode ? (
              // Reorder View
              <div className="space-y-3 mb-6">
                {reorderedImages.map((img, index) => (
                  <div key={img.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={img.secureUrl}
                      alt={`Product ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-chocolate">Position {index + 1}</p>
                      <p className="text-xs text-gray-600">{img.width}x{img.height}px • {(img.bytes / 1024).toFixed(1)}KB</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === reorderedImages.length - 1}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // View/Delete Mode
              <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.secureUrl}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                      <p className="text-white text-xs font-semibold">#{index + 1}</p>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingImageId === img.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!reorderMode ? (
                <button
                  onClick={handleReorderStart}
                  disabled={images.length <= 1 || isLoading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  Reorder Images
                </button>
              ) : (
                <>
                  <button
                    onClick={handleReorderSave}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
                  >
                    Save Order
                  </button>
                  <button
                    onClick={handleReorderCancel}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            disabled={isLoading || isUploading || reorderMode}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400 disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
