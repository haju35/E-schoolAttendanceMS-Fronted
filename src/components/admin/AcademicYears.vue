<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Academic Years</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage school academic years and sessions</p>
    </div>

    <!-- Add Button -->
    <div class="mb-6">
      <button @click="openAddModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Academic Year
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="year in academicYears" :key="year.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ year.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ formatDate(year.start_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ formatDate(year.end_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="year.is_current ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
                    {{ year.is_current ? 'Active' : 'Inactive' }}
                  </span>
                  <button 
                    v-if="!year.is_current"
                    @click="setAsCurrent(year.id)"
                    class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Set Active
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <!-- View Button -->
                  <button @click="viewYear(year)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition" 
                    title="View">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  
                  <!-- Edit Button -->
                  <button @click="editYear(year)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition" 
                    title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  
                  <!-- Delete Button -->
                  <button @click="deleteYear(year.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition" 
                    title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="academicYears.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p>No academic years found</p>
                <p class="text-sm mt-1">Click the "Add Academic Year" button to create one.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Academic Year' : 'Add Academic Year' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveYear" class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" 
              placeholder="e.g., 2024-2025"
              required 
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date *</label>
            <input 
              type="date" 
              v-model="form.start_date" 
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" 
              required 
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date *</label>
            <input 
              type="date" 
              v-model="form.end_date" 
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" 
              required 
            />
          </div>

          <div class="mb-6">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="form.is_current"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Set as current academic year
              </span>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              If checked, all other academic years will be set to inactive.
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Academic Year Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6" v-if="selectedYear">
          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Name</label>
            <p class="text-gray-900 dark:text-white text-lg font-semibold">{{ selectedYear.name }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Start Date</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(selectedYear.start_date) }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">End Date</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(selectedYear.end_date) }}</p>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Duration</label>
            <p class="text-gray-900 dark:text-white">{{ calculateDuration(selectedYear.start_date, selectedYear.end_date) }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Status</label>
            <span class="inline-block px-2 py-1 text-xs font-medium rounded-full"
              :class="selectedYear.is_current ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
              {{ selectedYear.is_current ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Created At</label>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ formatDateTime(selectedYear.created_at) }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Last Updated</label>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ formatDateTime(selectedYear.updated_at) }}</p>
          </div>
        </div>

        <div class="flex justify-end p-6 border-t dark:border-gray-700">
          <button 
            @click="showViewModal = false"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const academicYears = ref<any[]>([]);
const showModal = ref(false);
const showViewModal = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const selectedYear = ref<any>(null);

const form = ref({
  id: null,
  name: '',
  start_date: '',
  end_date: '',
  is_current: false,
});

// Get token
const token = localStorage.getItem('access_token');

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Format date for display
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format date and time
const formatDateTime = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate duration between dates
const calculateDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} (${diffDays} days)`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} (${diffDays} days)`;
  } else {
    return `${diffDays} days`;
  }
};

// Fetch data
const fetchYears = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/admin/academic-years', { headers });
    academicYears.value = res.data.data || res.data;
    console.log('Fetched academic years:', academicYears.value);
  } catch (err: any) {
    console.error('Failed to fetch academic years:', err);
    toast.error(err.response?.data?.message || 'Failed to load academic years');
  }
};

// Open add modal
const openAddModal = () => {
  isEditing.value = false;
  form.value = {
    id: null,
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
  };
  showModal.value = true;
};

// Edit year
const editYear = (year: any) => {
  isEditing.value = true;
  form.value = {
    id: year.id,
    name: year.name,
    start_date: year.start_date,
    end_date: year.end_date,
    is_current: year.is_current,
  };
  showModal.value = true;
};

// View year
const viewYear = (year: any) => {
  selectedYear.value = year;
  showViewModal.value = true;
};

// Save year (Create or Update)
const saveYear = async () => {
  // Validate dates
  if (!form.value.start_date || !form.value.end_date) {
    toast.error('Please select both start and end dates');
    return;
  }

  const startDate = new Date(form.value.start_date);
  const endDate = new Date(form.value.end_date);
  
  if (endDate <= startDate) {
    toast.error('End date must be after start date');
    return;
  }

  loading.value = true;
  try {
    const payload = {
      name: form.value.name.trim(),
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      is_current: form.value.is_current
    };
    
    let response;
    
    if (isEditing.value) {
      // Update existing year
      response = await axios.put(`http://localhost:8000/api/admin/academic-years/${form.value.id}`, payload, { headers });
      if (response.data.success) {
        toast.success('Academic year updated successfully');
      }
    } else {
      // Create new year
      response = await axios.post('http://localhost:8000/api/admin/academic-years', payload, { headers });
      if (response.data.success) {
        toast.success('Academic year created successfully');
      }
    }
    
    closeModal();
    await fetchYears();
  } catch (err: any) {
    console.error('Error details:', err.response?.data);
    
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      Object.keys(errors).forEach(key => {
        toast.error(`${key}: ${errors[key].join(', ')}`);
      });
    } else if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error(isEditing.value ? 'Failed to update academic year' : 'Failed to save academic year');
    }
  } finally {
    loading.value = false;
  }
};

// Set as current year
const setAsCurrent = async (id: number) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/admin/academic-years/${id}`, {
      is_current: true
    }, { headers });
    
    if (response.data.success) {
      toast.success('Academic year set as active');
      await fetchYears();
    }
  } catch (err: any) {
    console.error('Failed to set current year:', err);
    toast.error(err.response?.data?.message || 'Failed to set current year');
  }
};

// Delete year
const deleteYear = async (id: number) => {
  if (!confirm('Are you sure you want to delete this academic year? This action cannot be undone.')) return;
  
  try {
    await axios.delete(`http://localhost:8000/api/admin/academic-years/${id}`, { headers });
    toast.success('Academic year deleted successfully');
    await fetchYears();
  } catch (err: any) {
    console.error('Failed to delete academic year:', err);
    toast.error(err.response?.data?.message || 'Failed to delete academic year');
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  form.value = {
    id: null,
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
  };
};

onMounted(() => {
  fetchYears();
});
</script>