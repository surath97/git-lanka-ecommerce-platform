'use client';

import React, { useEffect, useState } from 'react';
import { Package, Users, UserCog } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import AdminLayout from '@/components/layout/AdminLayout';
import axiosInstance from '@/lib/axios';
import { DashboardStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-full ${color.replace('text', 'bg')}/10`}>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Package}
            title="Total Products"
            value={stats?.total_products || 0}
            subtitle={`${stats?.active_products || 0} active products`}
            color="text-blue-600"
          />
          <StatCard
            icon={Users}
            title="Total Customers"
            value={stats?.total_customers || 0}
            subtitle={`${stats?.active_customers || 0} active customers`}
            color="text-green-600"
          />
          <StatCard
            icon={UserCog}
            title="Total Users"
            value={stats?.total_users || 0}
            subtitle={`${stats?.active_users || 0} active users`}
            color="text-purple-600"
          />
        </div>
      </div>
    </AdminLayout>
  );
}