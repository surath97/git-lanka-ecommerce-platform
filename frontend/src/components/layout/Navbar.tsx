'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Moon, Sun, Menu, X, LogOut, ShieldUser } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';
import axiosInstance from '@/lib/axios';
import { useToast } from '../ui/Toast';

export default function Navbar() {
  const router = useRouter();
  const { showToast } = useToast();
  const { customer, isAuthenticated, userType, logout } = useAuthStore();
  const { items } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/customer/logout');
      logout();
      showToast('Logged out successfully', 'success');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Home
            </Link>

            {isAuthenticated && userType === 'customer' && (
              <>
                <Link
                  href="/cart"
                  className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <User className="w-6 h-6" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
                <Link href="/admin/login" className="btn-primary">
                  <div className="flex items-center">
                    <ShieldUser className="mr-1" /> Login
                  </div>
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {isAuthenticated && userType === 'customer' && (
                <>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart {items.length > 0 && `(${items.length})`}
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link href="/login" className="btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                  <Link href="/admin/login" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center">
                      <ShieldUser className="mr-1" /> Login
                    </div>
                  </Link>
                </>
              )}

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}