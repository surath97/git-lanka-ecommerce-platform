'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import AdminLayout from '@/components/layout/AdminLayout';
import axiosInstance from '@/lib/axios';
import { User } from '@/types';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivilegeModalOpen, setIsPrivilegeModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    contact: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });
  const [privilegeData, setPrivilegeData] = useState({
    can_add_product: false,
    can_update_product: false,
    can_delete_product: false,
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const response = await axiosInstance.get(`/admin/users${params}`);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        contact: user.contact,
        password: '',
        password_confirmation: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        fname: '',
        lname: '',
        email: '',
        contact: '',
        password: '',
        password_confirmation: '',
        role: 'user',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      fname: '',
      lname: '',
      email: '',
      contact: '',
      password: '',
      password_confirmation: '',
      role: 'user',
    });
    setErrors({});
  };

  const handleOpenPrivilegeModal = (user: User) => {
    setEditingUser(user);
    setPrivilegeData({
      can_add_product: user.privileges?.can_add_product || false,
      can_update_product: user.privileges?.can_update_product || false,
      can_delete_product: user.privileges?.can_delete_product || false,
    });
    setIsPrivilegeModalOpen(true);
  };

  const handleClosePrivilegeModal = () => {
    setIsPrivilegeModalOpen(false);
    setEditingUser(null);
    setPrivilegeData({
      can_add_product: false,
      can_update_product: false,
      can_delete_product: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePrivilegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivilegeData({ ...privilegeData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (editingUser) {
        await axiosInstance.put(`/admin/users/${editingUser.id}`, formData);
        showToast('User updated successfully', 'success');
      } else {
        await axiosInstance.post('/admin/users', formData);
        showToast('User created successfully', 'success');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(error.response?.data?.message || 'Operation failed', 'error');
      }
    }
  };

  const handlePrivilegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      await axiosInstance.put(`/admin/users/${editingUser.id}/privileges`, privilegeData);
      showToast('Privileges updated successfully', 'success');
      handleClosePrivilegeModal();
      fetchUsers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update privileges', 'error');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/toggle-status`);
      showToast('User status updated', 'success');
      fetchUsers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      showToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={fetchUsers}>
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
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
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        {user.fname} {user.lname}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {user.contact}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.role === 'user' && (
                            <button
                              onClick={() => handleOpenPrivilegeModal(user)}
                              className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                              title="Manage Privileges"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                            title="Toggle Status"
                          >
                            {user.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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

        {/* User Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? 'Edit User' : 'Add User'}
          size="lg"
        >
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
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              error={errors.contact?.[0]}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role[0]}</p>
              )}
            </div>

            {!editingUser && (
              <>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password?.[0]}
                  required
                />

                <Input
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {editingUser && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Leave password fields empty to keep current password
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">{editingUser ? 'Update User' : 'Create User'}</Button>
            </div>
          </form>
        </Modal>

        {/* Privilege Modal */}
        <Modal
          isOpen={isPrivilegeModalOpen}
          onClose={handleClosePrivilegeModal}
          title="Manage User Privileges"
          size="md"
        >
          <form onSubmit={handlePrivilegeSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Configure what this user can do with products
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  name="can_add_product"
                  checked={privilegeData.can_add_product}
                  onChange={handlePrivilegeChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Add Products</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow user to create new products
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  name="can_update_product"
                  checked={privilegeData.can_update_product}
                  onChange={handlePrivilegeChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Update Products</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow user to edit existing products
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  name="can_delete_product"
                  checked={privilegeData.can_delete_product}
                  onChange={handlePrivilegeChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Delete Products</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow user to remove products
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="secondary" onClick={handleClosePrivilegeModal}>
                Cancel
              </Button>
              <Button type="submit">Update Privileges</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}