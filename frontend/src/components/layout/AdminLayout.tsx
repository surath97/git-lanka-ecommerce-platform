'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, userType } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || userType !== 'admin') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, userType, router]);

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white dark:bg-gray-800 shadow-sm p-4">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}