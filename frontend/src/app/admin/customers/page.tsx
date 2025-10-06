'use client';

import React, { useEffect, useState } from 'react';
import { Search, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import AdminLayout from '@/components/layout/AdminLayout';
import axiosInstance from '@/lib/axios';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const response = await axiosInstance.get(`/admin/customers${params}`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await axiosInstance.patch(`/admin/customers/${id}/toggle-status`);
      showToast('Customer status updated', 'success');
      fetchCustomers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axiosInstance.delete(`/admin/customers/${id}`);
      showToast('Customer deleted successfully', 'success');
      fetchCustomers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete customer', 'error');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Customers</h1>

        {/* Search */}
        <Card className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={fetchCustomers}>
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </Card>

        {/* Customers Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No customers found</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <Card>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        {customer.fname} {customer.lname}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {customer.email}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {customer.contact}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleStatus(customer.id)}
                            className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                            title="Toggle Status"
                          >
                            {customer.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}