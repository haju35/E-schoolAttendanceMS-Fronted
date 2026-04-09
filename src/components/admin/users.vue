<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        <i class="fas fa-plus mr-2"></i> Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select v-model="filters.role" class="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="family">Family</option>
        </select>
        
        <select v-model="filters.status" class="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <input type="text" v-model="filters.search" placeholder="Search by name or email..." 
               class="px-3 py-2 border border-gray-300 rounded-lg">
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                <div class="text-sm text-gray-500">{{ user.phone || 'No phone' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleClass(user.role)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-3">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="resetPassword(user.id)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                  <i class="fas fa-key"></i>
                </button>
                <button @click="toggleStatus(user)" class="text-green-600 hover:text-green-900 mr-3">
                  <i :class="user.is_active ? 'fas fa-ban' : 'fas fa-check-circle'"></i>
                </button>
                <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing {{ users.length }} users
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add New User</h3>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createUser">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" v-model="newUser.name" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" v-model="newUser.email" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" v-model="newUser.password" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select v-model="newUser.role" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="teacher">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="family">Family</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" v-model="newUser.phone" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea v-model="newUser.address" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Reset Password</h3>
          <button @click="showResetModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitResetPassword">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
            <input type="password" v-model="resetPasswordData.password" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <input type="password" v-model="resetPasswordData.password_confirmation" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showResetModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" :disabled="resetLoading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ resetLoading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loading = ref(false);
const resetLoading = ref(false);
const showAddModal = ref(false);
const showResetModal = ref(false);
const users = ref([]);
const currentUserId = ref<number | null>(null);

const filters = ref({
  role: '',
  status: '',
  search: ''
});

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'teacher',
  phone: '',
  address: ''
});

const resetPasswordData = ref({
  password: '',
  password_confirmation: ''
});

const fetchUsers = async () => {
  try {
    const params = new URLSearchParams();
    if (filters.value.role) params.append('role', filters.value.role);
    if (filters.value.status) params.append('status', filters.value.status);
    if (filters.value.search) params.append('search', filters.value.search);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    if (response.data.success) {
      users.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    toast.error('Failed to load users');
  }
};

const createUser = async () => {
  loading.value = true;
  try {
    const response = await api.post('/admin/users', newUser.value);
    if (response.data.success) {
      toast.success('User created successfully');
      showAddModal.value = false;
      fetchUsers();
      resetForm();
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to create user');
  } finally {
    loading.value = false;
  }
};

const editUser = (user: any) => {
  toast.info('Edit functionality coming soon');
};

const resetPassword = (userId: number) => {
  currentUserId.value = userId;
  showResetModal.value = true;
};

const submitResetPassword = async () => {
  if (resetPasswordData.value.password !== resetPasswordData.value.password_confirmation) {
    toast.error('Passwords do not match');
    return;
  }
  
  resetLoading.value = true;
  try {
    const response = await api.post(`/admin/users/${currentUserId.value}/reset-password`, {
      password: resetPasswordData.value.password,
      password_confirmation: resetPasswordData.value.password_confirmation
    });
    if (response.data.success) {
      toast.success('Password reset successfully');
      showResetModal.value = false;
      resetPasswordData.value = { password: '', password_confirmation: '' };
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to reset password');
  } finally {
    resetLoading.value = false;
  }
};

const toggleStatus = async (user: any) => {
  try {
    const response = await api.post(`/admin/users/${user.id}/toggle-status`);
    if (response.data.success) {
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    }
  } catch (error) {
    toast.error('Failed to update user status');
  }
};

const deleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  }
};

const getRoleClass = (role: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    teacher: 'bg-blue-100 text-blue-800',
    student: 'bg-green-100 text-green-800',
    family: 'bg-purple-100 text-purple-800'
  };
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const resetForm = () => {
  newUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    phone: '',
    address: ''
  };
};

watch(filters, () => {
  fetchUsers();
}, { deep: true });

onMounted(() => {
  fetchUsers();
});
</script>