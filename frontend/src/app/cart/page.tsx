'use client';

import React, { useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';
import Navbar from '@/components/layout/Navbar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, userType } = useAuthStore();
  const { items, total, loading, fetchCart, updateCartItem, removeFromCart, clearCart } =
    useCartStore();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'customer') {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, userType]);

  const handleUpdateQuantity = async (id: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await updateCartItem(id, newQty);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await removeFromCart(id);
      showToast('Item removed from cart', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to remove item', 'error');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
      await clearCart();
      showToast('Cart cleared', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to clear cart', 'error');
    }
  };

  if (!isAuthenticated || userType !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
          {items.length > 0 && (
            <Button variant="danger" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
              <Button onClick={() => router.push('/')}>Continue Shopping</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.product_image ? (
                        <img
                          src={`http://backend.test/storage/${item.product.product_image}`}
                          alt={item.product.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {item.product.product_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.product.brand}
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 font-bold mt-2">
                        ${item.product.sell_price}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          disabled={item.quantity >= item.product.quantity}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ${(item.product.sell_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => showToast('Checkout feature coming soon!', 'info')}>
                  Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}