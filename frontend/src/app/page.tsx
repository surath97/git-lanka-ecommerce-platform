'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, ShoppingCart } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import axiosInstance from '@/lib/axios';
import { Product } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export default function HomePage() {

  const { showToast } = useToast();
  const { isAuthenticated, userType } = useAuthStore();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    min_price: '',
    max_price: '',
    rating: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axiosInstance.get(`/products?${params.toString()}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated || userType !== 'customer') {
      showToast('Please login as customer to add items to cart', 'error');
      return;
    }

    try {
      await addToCart(productId, 1);
      showToast('Product added to cart', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to ShopHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing products at great prices
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Search & Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search products..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Brand"
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Min Price"
              name="min_price"
              type="number"
              value={filters.min_price}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Max Price"
              name="max_price"
              type="number"
              value={filters.max_price}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Min Rating (1-5)"
              name="rating"
              type="number"
              min="1"
              max="5"
              value={filters.rating}
              onChange={handleFilterChange}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setFilters({
                  search: '',
                  brand: '',
                  min_price: '',
                  max_price: '',
                  rating: '',
                });
                fetchProducts();
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col h-full">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  {product.product_image ? (
                    <img
                      src={`http://backend.test/storage/${product.product_image}`}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {product.product_name}
                  </h3>

                  {renderStars(product.rating)}

                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2 flex-1">
                    {product.description || 'No description available'}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${product.sell_price}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.quantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}