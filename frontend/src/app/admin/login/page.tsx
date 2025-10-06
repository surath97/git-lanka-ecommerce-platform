'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axiosInstance.post('/admin/login', formData);
      setAuth(response.data.user, response.data.token, 'admin');
      showToast('Login successful!', 'success');
      router.push('/admin/dashboard');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(error.response?.data?.message || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6 card" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password?.[0]}
              required
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Customer Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}