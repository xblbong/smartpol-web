import React, { useState, useMemo, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  UsersIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { Transition, Dialog } from '@headlessui/react'; // For a more modern modal

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Number of users per page
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch users from database using MySQL API
  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedUsers = data.map(user => ({
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone || '-',
          role: user.role,
          status: user.is_active ? 'active' : 'inactive',
          joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          avatar: null,
        }));
        setUsers(formattedUsers);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch users');
        // Fallback to empty array if API fails
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to empty array if error occurs
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'konsituen', // Default role
      status: 'active', // Default status
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          alert('User deleted successfully!');
          fetchUsers(); // Refresh the user list
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            is_active: formData.status === 'active'
          })
        });

        if (response.ok) {
          alert('User updated successfully!');
          fetchUsers(); // Refresh the user list
        } else {
          alert('Failed to update user');
        }
      } else {
        // Create new user
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            is_active: formData.status === 'active',
            password: formData.password || 'defaultpassword123'
          })
        });

        if (response.ok) {
          alert('User created successfully!');
          fetchUsers(); // Refresh the user list
        } else {
          alert('Failed to create user');
        }
      }

      setIsModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error submitting user:', error);
      alert('An error occurred while saving user');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(searchText.toLowerCase());

      const matchesRole = filterRole ? user.role === filterRole : true;

      return matchesSearch && matchesRole;
    });
  }, [users, searchText, filterRole]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      admins: users.filter((u) => u.role === 'admin').length,
      konsituen: users.filter((u) => u.role === 'konsituen').length,
    };
  }, [users]);

  // Utility to get Tailwind color for tags
  const getRoleTagColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'konsituen':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <UsersIcon className="w-8 h-8 mr-3 text-indigo-600" />
                Manajemen Pengguna
              </h1>
              <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span>{refreshing ? 'Memperbarui...' : 'Terhubung'}</span>
              </div>
              {lastUpdated && (
                <div className="text-xs text-gray-400 mt-1">
                  Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Pengguna"
            value={userStats.total}
            icon={<UsersIcon className="w-6 h-6 text-indigo-600" />}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
          <StatCard
            title="Pengguna Aktif"
            value={userStats.active}
            icon={<CheckCircleIcon className="w-6 h-6 text-green-600" />}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            title="Administrator"
            value={userStats.admins}
            icon={<ComputerDesktopIcon className="w-6 h-6 text-purple-600" />}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Konstituen"
            value={userStats.konsituen}
            icon={<UserCircleIcon className="w-6 h-6 text-blue-600" />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h2>
              <p className="text-sm text-gray-600">Cari dan filter pengguna berdasarkan kriteria</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Tambah Pengguna Baru
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, email, atau username..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Peran</label>
              <select
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-all duration-200"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Semua Peran</option>
                <option value="admin">Administrator</option>
                <option value="konsituen">Konsituen</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h3>
            <p className="text-sm text-gray-600 mt-1">Total {filteredUsers.length} pengguna ditemukan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pengguna
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kontak
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Peran
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bergabung Sejak
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                              user.role === 'admin'
                                ? 'bg-purple-600'
                                : 'bg-indigo-500'
                            }`}
                          >
                            {user.fullName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center mb-1">
                          <EnvelopeIcon className="w-4 h-4 mr-2 text-indigo-500" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-900 flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-2 text-green-500" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleTagColor(
                            user.role
                          )}`}
                        >
                          {user.role === 'admin' ? 'Administrator' : 'Konsituen'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusTagColor(
                            user.status
                          )}`}
                        >
                          {user.status === 'active' ? 'AKTIF' : 'TIDAK AKTIF'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-200"
                            title="Edit Pengguna"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
                            title="Hapus Pengguna"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada pengguna yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Menampilkan{' '}
                <span className="font-medium">
                  {indexOfFirstUser + 1}
                </span>{' '}
                sampai{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{' '}
                dari{' '}
                <span className="font-medium">
                  {filteredUsers.length}
                </span>{' '}
                pengguna
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.01 1.06L9.61 10l3.17 3.71a.75.75 0 11-1.12 1.04l-3.5-4a.75.75 0 010-1.04l3.5-4a.75.75 0 011.06.01z" clipRule="evenodd" />
                  </svg>
                </button>
                {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.39 10 7.23 6.29a.75.75 0 111.12-1.04l3.5 4a.75.75 0 010 1.04l-3.5 4a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Add/Edit User Modal */}
        <Transition.Root show={isModalOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsModalOpen(false)}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-6 pt-6 pb-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                    <div>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200">
                        <UserCircleIcon
                          className="h-8 w-8 text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-4 text-center sm:mt-6">
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-semibold leading-6 text-gray-900"
                        >
                          {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            {editingUser ? 'Perbarui informasi pengguna' : 'Lengkapi detail pengguna baru'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                            required
                            min="3"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Masukkan username"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={formData.fullName || ''}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="contoh@email.com"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Nomor Telepon
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="+62812345678"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="role"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Peran
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role || 'konsituen'}
                            onChange={(e) => handleSelectChange('role', e.target.value)}
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                          >
                            <option value="konsituen">Konsituen</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="status"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={formData.status || 'active'}
                            onChange={(e) => handleSelectChange('status', e.target.value)}
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                          </select>
                        </div>
                      </div>

                      {!editingUser && (
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            required
                            minLength="6"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Minimal 6 karakter"
                          />
                        </div>
                      )}

                      <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {submitLoading ? (
                            <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          ) : null}
                          {editingUser ? 'Perbarui Pengguna' : 'Buat Pengguna'}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgColor} border border-gray-100`}>
        {icon}
      </div>
    </div>
  </div>
);

export default UserManagement;