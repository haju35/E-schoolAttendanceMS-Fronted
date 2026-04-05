<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Teacher Management</h1>
      <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Teacher
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" v-model="filters.search" @input="fetchTeachers" placeholder="Search by name, employee ID, email..." 
               class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        <select v-model="filters.status" @change="fetchTeachers" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Teachers Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Qualification</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="teacher in teachers" :key="teacher.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ teacher.employee_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span class="text-green-600 font-medium">{{ getInitials(teacher.user?.name) }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ teacher.user?.name }}</div>
                    <div class="text-sm text-gray-500">{{ teacher.user?.email }}</div>
                  </div>
                </div>
               </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{{ teacher.qualification || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="teacher.user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ teacher.user?.is_active ? 'Active' : 'Inactive' }}
                </span>
                </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-3">
                  <button @click="viewTeacher(teacher)" class="text-blue-600 hover:text-blue-900" title="View">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="editTeacher(teacher)" class="text-yellow-600 hover:text-yellow-900" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="toggleTeacherStatus(teacher)" class="text-green-600 hover:text-green-900" :title="teacher.user?.is_active ? 'Deactivate' : 'Activate'">
                    <svg v-if="teacher.user?.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button @click="deleteTeacher(teacher.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                </td>
              </tr>
            <tr v-if="loading && teachers.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">Loading...</td>
            </tr>
            <tr v-if="!loading && teachers.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">No teachers found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t flex justify-between items-center">
        <div class="text-sm text-gray-500">Total: {{ total }} teachers</div>
      </div>
    </div>

    <!-- Add/Edit Teacher Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="closeModal">
      <div class="relative top-20 mx-auto p-5 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="text-xl font-semibold">{{ editingTeacher ? 'Edit Teacher' : 'Add New Teacher' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Display validation errors -->
        <div v-if="validationErrors.length > 0" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Please fix the following errors:</strong>
          <ul class="mt-2 list-disc list-inside">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
        
        <form @submit.prevent="saveTeacher" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" v-model="form.name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" v-model="form.email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div v-if="!editingTeacher">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" v-model="form.password" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div v-if="!editingTeacher">
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input type="password" v-model="form.password_confirmation" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <p v-if="form.password && form.password_confirmation && form.password !== form.password_confirmation" class="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input type="text" v-model="form.employee_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input type="text" v-model="form.qualification" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input type="date" v-model="form.joining_date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" v-model="form.phone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea v-model="form.address" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">Cancel</button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50">
              {{ submitting ? 'Saving...' : (editingTeacher ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Teacher Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="showViewModal = false">
      <div class="relative top-20 mx-auto p-5 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="text-xl font-semibold">Teacher Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedTeacher" class="space-y-4">
          <div class="flex items-center space-x-4 pb-4 border-b">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-2xl text-green-600 font-bold">{{ getInitials(selectedTeacher.user?.name) }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold">{{ selectedTeacher.user?.name }}</h4>
              <p class="text-gray-500">{{ selectedTeacher.user?.email }}</p>
              <p class="text-sm text-gray-400">Employee ID: {{ selectedTeacher.employee_id }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span class="font-medium">Qualification:</span> {{ selectedTeacher.qualification || 'N/A' }}</div>
            <div><span class="font-medium">Joining Date:</span> {{ formatDate(selectedTeacher.joining_date) }}</div>
            <div><span class="font-medium">Phone:</span> {{ selectedTeacher.user?.phone || 'N/A' }}</div>
            <div><span class="font-medium">Status:</span> 
              <span :class="selectedTeacher.user?.is_active ? 'text-green-600' : 'text-red-600'">
                {{ selectedTeacher.user?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="md:col-span-2"><span class="font-medium">Address:</span> {{ selectedTeacher.user?.address || 'N/A' }}</div>
          </div>
        </div>
        
        <div class="flex justify-end pt-4 border-t">
          <button @click="showViewModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const showViewModal = ref(false);
const editingTeacher = ref(false);
const teachers = ref<any[]>([]);
const selectedTeacher = ref<any>(null);
const total = ref(0);
const validationErrors = ref<string[]>([]);

const filters = ref({
  search: '',
  status: ''
});

const form = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  employee_id: '',
  qualification: '',
  joining_date: new Date().toISOString().split('T')[0],
  phone: '',
  address: ''
});

const getInitials = (name: string) => {
  if (!name) return 'T';
  return name.charAt(0).toUpperCase();
};

const openAddModal = () => {
  editingTeacher.value = false;
  validationErrors.value = [];
  showModal.value = true;
  // Reset form
  form.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    employee_id: '',
    qualification: '',
    joining_date: new Date().toISOString().split('T')[0],
    phone: '',
    address: ''
  };
};

const fetchTeachers = async () => {
  loading.value = true;
  try {
    const params: any = {};
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.status) params.status = filters.value.status;
    
    const response = await api.get('/admin/teachers', { params });
    if (response.data.success) {
      teachers.value = response.data.data.data || response.data.data || [];
      total.value = response.data.data.total || teachers.value.length;
    } else {
      teachers.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    console.error('Error fetching teachers:', error);
    toast.error(error.response?.data?.message || 'Failed to load teachers');
    teachers.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const saveTeacher = async () => {
  // Clear previous validation errors
  validationErrors.value = [];
  
  // Client-side validation
  if (!editingTeacher.value && form.value.password !== form.value.password_confirmation) {
    validationErrors.value.push('Password and confirmation password do not match');
    toast.error('Passwords do not match');
    return;
  }
  
  if (!editingTeacher.value && form.value.password && form.value.password.length < 8) {
    validationErrors.value.push('Password must be at least 8 characters');
    toast.error('Password must be at least 8 characters');
    return;
  }

  submitting.value = true;
  
  // Log the data being sent for debugging
  console.log('Sending teacher data:', {
    name: form.value.name,
    email: form.value.email,
    employee_id: form.value.employee_id,
    password: form.value.password ? '***' : '(empty)',
    password_confirmation: form.value.password_confirmation ? '***' : '(empty)',
    qualification: form.value.qualification,
    joining_date: form.value.joining_date,
    phone: form.value.phone,
    address: form.value.address
  });
  
  try {
    let response;
    
    if (editingTeacher.value) {
      // For edit, only send fields that have values
      const updateData: any = {
        name: form.value.name,
        email: form.value.email,
        employee_id: form.value.employee_id,
        qualification: form.value.qualification,
        joining_date: form.value.joining_date,
        phone: form.value.phone,
        address: form.value.address
      };
      
      // Only include password if it's provided
      if (form.value.password) {
        updateData.password = form.value.password;
        updateData.password_confirmation = form.value.password_confirmation;
      }
      
      response = await api.put(`/admin/teachers/${form.value.id}`, updateData);
    } else {
      // For create, send all required fields
      const createData = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        password_confirmation: form.value.password_confirmation,
        employee_id: form.value.employee_id,
        qualification: form.value.qualification,
        joining_date: form.value.joining_date,
        phone: form.value.phone,
        address: form.value.address
      };
      response = await api.post('/admin/teachers', createData);
    }
    
    console.log('Response:', response.data);
    
    if (response.data.success) {
      toast.success(editingTeacher.value ? 'Teacher updated successfully' : 'Teacher created successfully');
      closeModal();
      fetchTeachers();
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error: any) {
    console.error('Error saving teacher - Full error:', error);
    
    // Check if there's a response with validation errors
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (errors) {
          // Extract all error messages
          const errorMessages: string[] = [];
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              errors[key].forEach((msg: string) => {
                errorMessages.push(`${key}: ${msg}`);
              });
            } else {
              errorMessages.push(`${key}: ${errors[key]}`);
            }
          });
          validationErrors.value = errorMessages;
          errorMessages.forEach(msg => toast.error(msg));
        } else if (error.response.data.message) {
          validationErrors.value = [error.response.data.message];
          toast.error(error.response.data.message);
        }
      } else {
        const errorMsg = error.response.data?.message || 'Operation failed';
        validationErrors.value = [errorMsg];
        toast.error(errorMsg);
      }
    } else {
      toast.error('Network error. Please try again.');
    }
  } finally {
    submitting.value = false;
  }
};

const viewTeacher = (teacher: any) => {
  selectedTeacher.value = teacher;
  showViewModal.value = true;
};

const editTeacher = (teacher: any) => {
  editingTeacher.value = true;
  validationErrors.value = [];
  form.value = {
    id: teacher.id,
    name: teacher.user?.name || '',
    email: teacher.user?.email || '',
    password: '',
    password_confirmation: '',
    employee_id: teacher.employee_id || '',
    qualification: teacher.qualification || '',
    joining_date: teacher.joining_date || new Date().toISOString().split('T')[0],
    phone: teacher.user?.phone || '',
    address: teacher.user?.address || ''
  };
  showModal.value = true;
};

const toggleTeacherStatus = async (teacher: any) => {
  try {
    const response = await api.post(`/admin/teachers/${teacher.id}/toggle-status`);
    if (response.data.success) {
      toast.success(`Teacher ${teacher.user?.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchTeachers();
    } else {
      toast.error(response.data.message || 'Failed to update status');
    }
  } catch (error: any) {
    console.error('Error toggling status:', error);
    toast.error(error.response?.data?.message || 'Failed to update status');
  }
};

const deleteTeacher = async (id: number) => {
  if (confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
    try {
      const response = await api.delete(`/admin/teachers/${id}`);
      if (response.data.success) {
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } else {
        toast.error(response.data.message || 'Failed to delete teacher');
      }
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to delete teacher');
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editingTeacher.value = false;
  validationErrors.value = [];
  form.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    employee_id: '',
    qualification: '',
    joining_date: new Date().toISOString().split('T')[0],
    phone: '',
    address: ''
  };
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  fetchTeachers();
});
</script>