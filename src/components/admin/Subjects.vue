<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Subjects Management</h1>
        <p class="text-gray-600 mt-1">Manage school subjects and their class assignments</p>
      </div>
      <button 
        @click="showModal = true"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Subject
      </button>
    </div>

    <!-- Subjects Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-4 text-left font-semibold text-gray-700">Name</th>
              <th class="p-4 text-left font-semibold text-gray-700">Code</th>
              <th class="p-4 text-left font-semibold text-gray-700">Created At</th>
              <th class="p-4 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in subjects" :key="s.id" class="border-t hover:bg-gray-50 transition">
              <td class="p-4 font-medium text-gray-900">{{ s.name ?? '-' }}</td>
              <td class="p-4">
                <span class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{{ s.code ?? '-' }}</span>
              </td>
              <td class="p-4 text-sm text-gray-500">{{ formatDate(s.created_at) }}</td>
              <td class="p-4 text-right">
                <button 
                  @click="deleteSubject(s.id)"
                  class="text-red-600 hover:text-red-800 hover:underline text-sm transition">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="subjects.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                No subjects found. Click "Add Subject" to create one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Subject</h3>

        <form @submit.prevent="createSubject">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input 
              v-model="form.name" 
              type="text"
              class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
            <input 
              v-model="form.code" 
              type="text"
              class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
            <p class="text-xs text-gray-500 mt-1">Example: MATH101, SCI202, ENG101</p>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              @click="showModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? 'Saving...' : 'Save Subject' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const subjects = ref<any[]>([]);
const showModal = ref(false);
const submitting = ref(false);

const form = ref({
  name: '',
  code: ''
});

const API = 'http://127.0.0.1:8000/api/admin/subjects';
const token = localStorage.getItem('access_token');
const headers = { Authorization: `Bearer ${token}` };

// Fetch subjects
const fetchSubjects = async () => {
  try {
    const res = await axios.get(API, { headers });
    if (Array.isArray(res.data.data.data)) {
      subjects.value = res.data.data.data;
    } else {
      subjects.value = [];
    }
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message || 'Failed to fetch subjects');
    subjects.value = [];
  }
};

// Create subject
const createSubject = async () => {
  if (!form.value.name || !form.value.code) {
    toast.error('Please fill in all fields');
    return;
  }
  
  submitting.value = true;
  
  try {
    const res = await axios.post(API, form.value, { headers });
    toast.success(res.data.message ?? 'Subject created successfully');

    form.value = { name: '', code: '' };
    await fetchSubjects();

    showModal.value = false;
  
    
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message ?? 'Failed to create subject');
  } finally {
    submitting.value = false;
  }
};

// Delete subject
const deleteSubject = async (id: number) => {
  if (!confirm('Delete this subject?')) return;

  try {
    const res = await axios.delete(`${API}/${id}`, { headers });
    toast.success(res.data.message ?? 'Subject deleted successfully');
    await fetchSubjects();
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message ?? 'Cannot delete subject');
  }
};

// Computed dashboard stats
const subjectsWithClasses = computed(() => subjects.value.filter(s => s.classes?.length > 0).length);
const subjectsWithoutClasses = computed(() => subjects.value.filter(s => !s.classes || s.classes.length === 0).length);

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString();
};

onMounted(() => {
  fetchSubjects();
});
</script>

<style scoped>
[v-cloak] > * {
  display: none;
}
[v-cloak]::before {
  content: "loading...";
}
</style>