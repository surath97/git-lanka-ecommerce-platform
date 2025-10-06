'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import AdminLayout from '@/components/layout/AdminLayout';
import axiosInstance from '@/lib/axios';
import { Product } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    product_name: '',
    product_image: null as File | null,
    quantity: '',
    cost_price: '',
    sell_price: '',
    description: '',
    rating: '1',
  });
  const [errors, setErrors] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const canAddProduct = user?.role === 'admin' || user?.privileges?.can_add_product;
  const canUpdateProduct = user?.role === 'admin' || user?.privileges?.can_update_product;
  const canDeleteProduct = user?.role === 'admin' || user?.privileges?.can_delete_product;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const response = await axiosInstance.get(`/products${params}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      if (!canUpdateProduct) {
        showToast('You do not have permission to edit products', 'error');
        return;
      }
      setEditingProduct(product);
      setFormData({
        brand: product.brand,
        product_name: product.product_name,
        product_image: null,
        quantity: product.quantity.toString(),
        cost_price: product.cost_price.toString(),
        sell_price: product.sell_price.toString(),
        description: product.description || '',
        rating: product.rating.toString(),
      });
      if (product.product_image) {
        setImagePreview(`http://backend.test/storage/${product.product_image}`);
      }
    } else {
      if (!canAddProduct) {
        showToast('You do not have permission to add products', 'error');
        return;
      }
      setEditingProduct(null);
      setFormData({
        brand: '',
        product_name: '',
        product_image: null,
        quantity: '',
        cost_price: '',
        sell_price: '',
        description: '',
        rating: '1',
      });
      setImagePreview('');
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      brand: '',
      product_name: '',
      product_image: null,
      quantity: '',
      cost_price: '',
      sell_price: '',
      description: '',
      rating: '1',
    });
    setImagePreview('');
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, product_image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, product_image: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = new FormData();
    data.append('brand', formData.brand);
    data.append('product_name', formData.product_name);
    data.append('quantity', formData.quantity);
    data.append('cost_price', formData.cost_price);
    data.append('sell_price', formData.sell_price);
    data.append('description', formData.description);
    data.append('rating', formData.rating);

    if (formData.product_image) {
      data.append('product_image', formData.product_image);
    }

    try {
      if (editingProduct) {
        await axiosInstance.post(`/admin/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { _method: 'PUT' },
        });
        showToast('Product updated successfully', 'success');
      } else {
        await axiosInstance.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Product created successfully', 'success');
      }
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(error.response?.data?.message || 'Operation failed', 'error');
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (!canUpdateProduct) {
      showToast('You do not have permission to update products', 'error');
      return;
    }

    try {
      await axiosInstance.patch(`/admin/products/${id}/toggle-status`);
      showToast('Product status updated', 'success');
      fetchProducts();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!canDeleteProduct) {
      showToast('You do not have permission to delete products', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosInstance.delete(`/admin/products/${id}`);
      showToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
          {canAddProduct && (
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          )}
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={fetchProducts}>
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </Card>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No products found</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <Card>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Image
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Brand
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Rating
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                          {product.product_image ? (
                            <img
                              src={`http://backend.test/storage/${product.product_image}`}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        {product.product_name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {product.brand}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        ${product.sell_price}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {product.quantity}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {product.rating}/5
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {canUpdateProduct && (
                            <>
                              <button
                                onClick={() => handleOpenModal(product)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(product.id)}
                                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                                title="Toggle Status"
                              >
                                {product.is_active ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          {canDeleteProduct && (
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={errors.brand?.[0]}
                required
              />
              <Input
                label="Product Name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                error={errors.product_name?.[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
              />
              {errors.product_image && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.product_image[0]}
                </p>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity?.[0]}
                required
              />
              <Input
                label="Cost Price"
                name="cost_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={handleChange}
                error={errors.cost_price?.[0]}
                required
              />
              <Input
                label="Sell Price"
                name="sell_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.sell_price}
                onChange={handleChange}
                error={errors.sell_price?.[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Rating (1-5)
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange as any}
                className="input-field"
                required
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rating[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description[0]}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}