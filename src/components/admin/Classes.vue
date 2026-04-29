<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage school classes and their numeric values</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Class
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Classes</label>
      <input 
        type="text" 
        v-model="filters.search" 
        @input="fetchClasses" 
        placeholder="Search by class name..." 
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />
    </div>

    <!-- Classes Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Numeric Value</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sections</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="cls in classes.data || classes" :key="cls.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-indigo-600 dark:text-indigo-300">{{ getInitials(cls.name) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ cls.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Class</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {{ cls.numeric_value }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ cls.sections_count || 0 }} sections
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right relative">
                <div class="flex justify-end space-x-3">
                  <button @click="toggleMenu(cls.id)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 text-gray-600 hover:text-gray-900">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM17.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                  <div v-if="activeMenu === cls.id"
                    class="absolute right-0 mt-8 w-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50"
                  >
                  <div class="flex gap-3 p-2">
                  <button 
                    @click="viewClass(cls)" 
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="editClass(cls)" 
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="deleteClass(cls.id)" 
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                </div>
                </div>
              </td>
            </tr>
            <tr v-if="!classes.data || classes.data.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <p>No classes found</p>
                <p class="text-sm mt-1">Click the "Add Class" button to create one.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="classes.meta && classes.meta.last_page > 1" class="px-6 py-4 border-t dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ ((classes.meta.current_page - 1) * (classes.meta.per_page || 10)) + 1 }} to 
            {{ Math.min(classes.meta.current_page * (classes.meta.per_page || 10), classes.meta.total) }} of 
            {{ classes.meta.total }} results
          </div>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              :disabled="classes.meta.current_page === 1"
              @click="fetchClasses(classes.meta.current_page - 1)"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {{ classes.meta.current_page }} of {{ classes.meta.last_page }}
            </span>
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              :disabled="classes.meta.current_page === classes.meta.last_page"
              @click="fetchClasses(classes.meta.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Class Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="closeModal">
      <div class="relative top-20 mx-auto p-5 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingClass ? 'Edit Class' : 'Add New Class' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:text-gray-400">
            ✕
          </button>
        </div>

        <form @submit.prevent="saveClass" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class Name *</label>
            <input 
              v-model="form.name" 
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Grade 1, Grade 2, Grade 10"
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numeric Value *</label>
            <input 
              v-model.number="form.numeric_value" 
              type="number"
              min="1" 
              max="12"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 1, 2, 3"
              required 
            />
            <p class="text-xs text-gray-500 mt-1">Numeric value for sorting (1-12)</p>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                Classes are used to organize students and assign sections. Numeric values help with ordering.
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {{ submitting ? 'Saving...' : (editingClass ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Class Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="showViewModal = false">
      <div class="relative top-20 mx-auto p-5 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Class Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedClass" class="space-y-4">
          <div class="flex items-center space-x-4 pb-4 border-b dark:border-gray-700">
            <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span class="text-2xl text-indigo-600 dark:text-indigo-300 font-bold">{{ getInitials(selectedClass.name) }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedClass.name }}</h4>
              <p class="text-gray-500 dark:text-gray-400">Class Information</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Class Name</label>
              <p class="text-gray-900 dark:text-white">{{ selectedClass.name }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Numeric Value</label>
              <p class="text-gray-900 dark:text-white">{{ selectedClass.numeric_value }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Total Sections</label>
              <p class="text-gray-900 dark:text-white">{{ selectedClass.sections_count || 0 }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Class ID</label>
              <p class="text-gray-900 dark:text-white">#{{ selectedClass.id }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t dark:border-gray-700" v-if="selectedClass.sections && selectedClass.sections.length">
            <h5 class="font-medium text-gray-900 dark:text-white mb-3">Sections in this Class</h5>
            <div class="flex flex-wrap gap-2">
              <span v-for="section in selectedClass.sections" :key="section.id" 
                    class="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Section {{ section.name }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button @click="showViewModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loading = ref(false);
const classes = ref<any>({ data: [], meta: null });
const showModal = ref(false);
const activeMenu = ref<number | null>(null);
const showViewModal = ref(false);
const submitting = ref(false);
const editingClass = ref(false);
const selectedClass = ref<any>(null);
const filters = ref({ search: '' });

const form = ref({
  id: null as number | null,
  name: '',
  numeric_value: 1
});

// Computed property to safely get classes data
const classesData = computed(() => {
  if (classes.value.data && Array.isArray(classes.value.data)) {
    return classes.value.data;
  }
  if (Array.isArray(classes.value)) {
    return classes.value;
  }
  return [];
});

// Debounce timer
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Debounced search
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchClasses(1);
  }, 500);
};

// Get initials
const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Fetch classes with search and pagination
const fetchClasses = async (page = 1) => {
  loading.value = true;
  try {
    // FIXED: Use the correct endpoint path
    let url = `/admin/classes?page=${page}`;
    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}`;
    }
    
    console.log('Fetching classes from:', url); // Debug log
    
    const res = await api.get(url);
    
    console.log('Response:', res.data); // Debug log
    
    // Handle different response structures
    if (res.data.data?.data) {
      classes.value = res.data.data;
    } else if (res.data.data) {
      classes.value = res.data;
    } else {
      classes.value = { data: res.data || [], meta: null };
    }
  } catch (err: any) {
    console.error('Fetch error:', err.response?.data || err);
    console.error('Status:', err.response?.status);
    console.error('URL:', err.config?.url);
    toast.error(err.response?.data?.message || 'Failed to load classes');
    classes.value = { data: [], meta: null };
  } finally {
    loading.value = false;
  }
};

// Open add modal
const openAddModal = () => {
  editingClass.value = false;
  form.value = { id: null, name: '', numeric_value: 1 };
  showModal.value = true;
};

// View class
const viewClass = (cls: any) => {
  selectedClass.value = cls;
  showViewModal.value = true;
};

// Edit class
const editClass = (cls: any) => {
  editingClass.value = true;
  form.value = {
    id: cls.id,
    name: cls.name,
    numeric_value: cls.numeric_value
  };
  showModal.value = true;
};

// Save class (create or update)
const saveClass = async () => {
  // Validation
  if (!form.value.name.trim()) {
    toast.error('Class name is required');
    return;
  }
  
  if (!form.value.numeric_value || form.value.numeric_value < 1 || form.value.numeric_value > 12) {
    toast.error('Numeric value must be between 1 and 12');
    return;
  }
  
  submitting.value = true;
  
  try {
    let response;
    if (editingClass.value) {
      // FIXED: Use correct endpoint for update
      response = await api.put(`/admin/classes/${form.value.id}`, form.value);
      toast.success(response.data.message || 'Class updated successfully');
    } else {
      // FIXED: Use correct endpoint for create
      response = await api.post('/admin/classes', form.value);
      toast.success(response.data.message || 'Class created successfully');
    }
    
    closeModal();
    fetchClasses();
  } catch (err: any) {
    console.error('Save error:', err.response?.data || err);
    const errorMsg = err.response?.data?.message || err.response?.data?.errors || 'Failed to save class';
    toast.error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
  } finally {
    submitting.value = false;
  }
};

// Delete class
const deleteClass = async (id: number) => {
  if (!confirm('Delete this class? This action cannot be undone. All sections in this class will also be deleted.')) return;

  try {
    // FIXED: Use correct endpoint for delete
    const res = await api.delete(`/admin/classes/${id}`);
    toast.success(res.data.message || 'Class deleted successfully');
    fetchClasses();
  } catch (err: any) {
    console.error('Delete error:', err.response?.data || err);
    toast.error(err.response?.data?.message || 'Cannot delete class. It may have students or sections assigned.');
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editingClass.value = false;
  form.value = { id: null, name: '', numeric_value: 1 };
};

const toggleMenu = (id: number) => {
  activeMenu.value = activeMenu.value === id ? null : id;
};

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      activeMenu.value = null;
    }
  });
  fetchClasses();
});
</script>