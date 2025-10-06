'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function ThemeInitializer() {
  const { setTheme } = useThemeStore();
  const { setAuth } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Initialize auth
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType') as 'admin' | 'customer' | null;

    if (token && userType) {
      const userData = localStorage.getItem(userType === 'admin' ? 'user' : 'customer');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setAuth(user, token, userType);

          // Fetch cart for customers
          if (userType === 'customer') {
            fetchCart();
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.clear();
        }
      }
    }
  }, []);

  return null;
}