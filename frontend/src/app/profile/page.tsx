'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import axiosInstance from '@/lib/axios';

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { customer, isAuthenticated, userType, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    contact: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated || userType !== 'customer') {
      router.push('/login');
      return;
    }

    if (customer) {
      setFormData({
        fname: customer.fname,
        lname: customer.lname,
        email: customer.email,
        contact: customer.contact,
      });
    }
  }, [isAuthenticated, userType, customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axiosInstance.put('/customer/profile', formData);
      updateUser(response.data.customer);
      showToast('Profile updated successfully', 'success');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(error.response?.data?.message || 'Update failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || userType !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  error={errors.fname?.[0]}
                  required
                />
                <Input
                  label="Last Name"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  error={errors.lname?.[0]}
                  required
                />
              </div>

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
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={errors.contact?.[0]}
                required
              />

              <Button type="submit" loading={loading}>
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}