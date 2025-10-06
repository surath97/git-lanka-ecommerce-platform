import { create } from 'zustand';
import { CartItem } from '@/types';
import axiosInstance from '@/lib/axios';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  
  fetchCart: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get('/cart');
      set({ 
        items: response.data.cart_items, 
        total: response.data.total,
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ loading: false });
    }
  },
  
  addToCart: async (productId: number, quantity: number) => {
    try {
      await axiosInstance.post('/cart', { product_id: productId, quantity });
      await get().fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
  
  updateCartItem: async (id: number, quantity: number) => {
    try {
      await axiosInstance.put(`/cart/${id}`, { quantity });
      await get().fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },
  
  removeFromCart: async (id: number) => {
    try {
      await axiosInstance.delete(`/cart/${id}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },
  
  clearCart: async () => {
    try {
      await axiosInstance.delete('/cart');
      set({ items: [], total: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
}));