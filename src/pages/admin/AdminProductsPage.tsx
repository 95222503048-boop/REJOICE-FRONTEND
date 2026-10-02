import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import * as adminProductService from '../../services/adminProductService';
import { AdminImageManagementModal } from '../../components/admin/AdminImageManagementModal';
import { Product } from '../../types';
import { formatPrice, getProductId } from '../../utils/productHelper';

interface EditingProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

export const AdminProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isManagingImages, setIsManagingImages] = useState(false);
  const [imageManagementProductId, setImageManagementProductId] = useState<string | null>(null);
  const [imageManagementProductName, setImageManagementProductName] = useState<string>('');

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminProductService.getAllProductsAdmin();
        setProducts(response.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user?.role]);

  const handleEditClick = (product: Product) => {
    setEditingProduct({
      id: product._id,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
    });
    setIsEditing(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updatedProduct = await adminProductService.updateProduct(editingProduct.id, {
        name: editingProduct.name,
        description: editingProduct.description,
        basePrice: editingProduct.basePrice,
        category: editingProduct.category,
      });

      setProducts(products.map(p => p._id === editingProduct.id ? updatedProduct.product : p));
      setIsEditing(false);
      setEditingProduct(null);
      setError(null);
    } catch (err) {
      setError(`Failed to update product: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteClick = (productId: string) => {
    setDeletingProductId(productId);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return;

    try {
      await adminProductService.deactivateProduct(deletingProductId);
      setProducts(products.filter(p => p._id !== deletingProductId));
      setIsDeleting(false);
      setDeletingProductId(null);
      setError(null);
    } catch (err) {
      setError(`Failed to delete product: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsDeleting(false);
    }
  };

  const handleImagesClick = (product: Product) => {
    setImageManagementProductId(product._id);
    setImageManagementProductName(product.name);
    setIsManagingImages(true);
  };

  const handleImageManagementClose = () => {
    setIsManagingImages(false);
    setImageManagementProductId(null);
    setImageManagementProductName('');
  };

  const handleImageUpdate = () => {
    // Optionally refresh products if backend updates product images on the product object
    // For now, we just close the modal as images are managed separately
  };

  if (user?.role !== 'admin') {
    return (
      <CustomerLayout>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <p className="text-red-600">Admin access required</p>
        </section>
      </CustomerLayout>
    );
  }

  if (isLoading) {
    return (
      <CustomerLayout>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">Products</h1>
          <p className="text-chocolate/60">Loading...</p>
        </section>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">Product Management</h1>

        {error && <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">{error}</div>}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-chocolate text-cream">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-center">Available</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/20">
              {products.map((product) => (
                <tr key={getProductId(product)} className="hover:bg-cream/50">
                  <td className="px-6 py-4 font-semibold text-chocolate">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-right font-semibold text-chocolate">
                    {formatPrice(product.basePrice)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="text-chocolate hover:underline mr-3"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleImagesClick(product)}
                      className="text-blue-600 hover:underline mr-3"
                      disabled={isLoading}
                    >
                      Images
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(getProductId(product))}
                      className="text-red-600 hover:underline disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 mt-4">Total: {products.length} products</p>

        {/* Edit Modal */}
        {isEditing && editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">Edit Product</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-chocolate mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gold rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-chocolate mb-1">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gold rounded"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-chocolate mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gold rounded"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-chocolate mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="100"
                    value={Math.floor(editingProduct.basePrice / 100)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseInt(e.target.value) * 100 })}
                    className="w-full px-3 py-2 border border-gold rounded"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-chocolate text-cream px-4 py-2 rounded font-semibold hover:bg-chocolate/90"
                    disabled={isLoading}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleting && deletingProductId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">Delete Product</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Management Modal */}
        {isManagingImages && imageManagementProductId && (
          <AdminImageManagementModal
            productId={imageManagementProductId}
            productName={imageManagementProductName}
            onClose={handleImageManagementClose}
            onImageUpdate={handleImageUpdate}
          />
        )}
      </section>
    </CustomerLayout>
  );
};
