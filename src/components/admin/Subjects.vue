<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subjects Management</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage school subjects and their class assignments</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Subject
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Subjects</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          v-model="filters.search" 
          @input="fetchSubjects" 
          placeholder="Search by subject name or code..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
      </div>
    </div>

    <!-- Subjects Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="subject in subjects" :key="subject.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-indigo-600 dark:text-indigo-300">{{ getInitials(subject.name) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ subject.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Subject</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-mono">
                  {{ subject.code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(subject.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right relative">
                <div class="flex justify-end">
                  <button @click.stop="toggleMenu(subject.id)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
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
                  <div v-if="activeMenu === subject.id"
                    class="absolute right-0 mt-8 w-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50"
                  >
                  <div class="py-1">
                  <button 
                    @click="viewSubject(subject)" 
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editSubject(subject)" 
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteSubject(subject.id)" 
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                </div>
                </div>
              </td>
            </tr>

            <tr v-if="subjects.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No subjects found</p>
                <p class="text-sm mt-1">Click the "Add Subject" button to create one.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Subject Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="closeModal">
      <div class="relative top-20 mx-auto p-5 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingSubject ? 'Edit Subject' : 'Add New Subject' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:text-gray-400">
            ✕
          </button>
        </div>

        <form @submit.prevent="saveSubject" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name *</label>
            <input 
              v-model="form.name" 
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Mathematics, Physics, English"
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Code *</label>
            <input 
              v-model="form.code" 
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., MATH101, SCI202, ENG101"
              required 
            />
            <p class="text-xs text-gray-500 mt-1">Unique code used to identify the subject</p>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                Subjects can be assigned to classes in the "Teacher Assignments" section.
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
              {{ submitting ? 'Saving...' : (editingSubject ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Subject Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="showViewModal = false">
      <div class="relative top-20 mx-auto p-5 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Subject Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedSubject" class="space-y-4">
          <div class="flex items-center space-x-4 pb-4 border-b dark:border-gray-700">
            <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span class="text-2xl text-indigo-600 dark:text-indigo-300 font-bold">{{ getInitials(selectedSubject.name) }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedSubject.name }}</h4>
              <p class="text-gray-500 dark:text-gray-400">Subject Information</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Subject Name</label>
              <p class="text-gray-900 dark:text-white">{{ selectedSubject.name }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Subject Code</label>
              <p class="text-gray-900 dark:text-white font-mono">{{ selectedSubject.code }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Subject ID</label>
              <p class="text-gray-900 dark:text-white">#{{ selectedSubject.id }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Created At</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(selectedSubject.created_at) }}</p>
            </div>
            <div class="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Last Updated</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(selectedSubject.updated_at) }}</p>
            </div>
          </div>

          <!-- Assigned Classes Section -->
          <div class="mt-4 pt-4 border-t dark:border-gray-700" v-if="selectedSubject.classes && selectedSubject.classes.length">
            <h5 class="font-medium text-gray-900 dark:text-white mb-3">Assigned to Classes</h5>
            <div class="flex flex-wrap gap-2">
              <span v-for="cls in selectedSubject.classes" :key="cls.id" 
                    class="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {{ cls.name }}
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
import { ref, onMounted } from 'vue';
import api from '@/services/api';

import { useToast } from 'vue-toastification';

const toast = useToast();
const subjects = ref<any[]>([]);
const showModal = ref(false);
const showViewModal = ref(false);
const submitting = ref(false);
const editingSubject = ref(false);
const activeMenu = ref<number | null>(null);
const selectedSubject = ref<any>(null);
const filters = ref({ search: '' });
const API = 'admin/subjects';


const form = ref({
  id: null,
  name: '',
  code: ''
});

// Get initials for avatar
const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Fetch subjects
const fetchSubjects = async () => {
  try {
    let url = API;
    if (filters.value.search) {
      url += `?search=${filters.value.search}`;
    }
    const res = await api.get(url);
    if (res.data.data?.data) {
      subjects.value = res.data.data.data;
    } else if (Array.isArray(res.data.data)) {
      subjects.value = res.data.data;
    } else {
      subjects.value = [];
    }
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message || 'Failed to fetch subjects');
    subjects.value = [];
  }
};

// Open add modal
const openAddModal = () => {
  editingSubject.value = false;
  form.value = { id: null, name: '', code: '' };
  showModal.value = true;
};

// View subject
const viewSubject = (subject: any) => {
  selectedSubject.value = subject;
  showViewModal.value = true;
};

// Edit subject
const editSubject = (subject: any) => {
  editingSubject.value = true;
  form.value = {
    id: subject.id,
    name: subject.name,
    code: subject.code
  };
  showModal.value = true;
};

// Save subject (create or update)
const saveSubject = async () => {
  if (!form.value.name || !form.value.code) {
    toast.error('Please fill in all fields');
    return;
  }
  
  submitting.value = true;
  
  try {
    let response;
    if (editingSubject.value) {
      response = await api.put(`${API}/${form.value.id}`, form.value);
      toast.success(response.data.message || 'Subject updated successfully');
    } else {
      response = await api.post(API, form.value);
      toast.success(response.data.message || 'Subject created successfully');
    }

    closeModal();
    await fetchSubjects();
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message || 'Failed to save subject');
  } finally {
    submitting.value = false;
  }
};

// Delete subject
const deleteSubject = async (id: number) => {
  if (!confirm('Delete this subject? This action cannot be undone.')) return;

  try {
    const res = await api.delete(`${API}/${id}`);
    toast.success(res.data.message || 'Subject deleted successfully');
    await fetchSubjects();
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message || 'Cannot delete subject. It may be assigned to classes.');
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editingSubject.value = false;
  form.value = { id: null, name: '', code: '' };
};

const toggleMenu = (id: number) => {
  activeMenu.value = activeMenu.value === id ? null : id;
};

onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      activeMenu.value = null;
    }
  });
  fetchSubjects();
});
</script>