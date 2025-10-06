'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCog,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import axiosInstance from '@/lib/axios';
import { useToast } from '../ui/Toast';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/admin/logout');
      logout();
      showToast('Logged out successfully', 'success');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/users', label: 'Users', icon: UserCog },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Admin Panel</h2>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {user?.fname} {user?.lname}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}