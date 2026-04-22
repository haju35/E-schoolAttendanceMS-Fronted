<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Classes</h2>
      <button 
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        + Add Class
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 text-left text-gray-700 dark:text-gray-300">Name</th>
            <th class="p-3 text-left text-gray-700 dark:text-gray-300">Numeric Value</th>
            <th class="p-3 text-right text-gray-700 dark:text-gray-300  ">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in classes.data || classes" :key="c.id" class="border-t">
            <td class="p-3 text-gray-900 dark:text-white">{{ c.name }}</td>
            <td class="p-3 text-gray-600 dark:text-gray-400">{{ c.numeric_value }}</td>
            <td class="p-3 text-right">
              <button 
                @click="deleteClass(c.id)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition" title="delete">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
              </button>
            </td>
          </tr>

          <tr v-if="(classes.data || classes).length === 0">
            <td colspan="3" class="text-center p-4 text-gray-500 dark:text-gray-400">
              No classes found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center" v-if="classes.meta">
        <button 
          class="px-3 py-1 border rounded mx-1"
          :disabled="!classes.links.prev"
          @click="fetchClasses(classes.meta.current_page - 1)">
          Prev
        </button>

        <span class="px-3 py-1 mx-1">{{ classes.meta.current_page }} / {{ classes.meta.last_page }}</span>

        <button 
          class="px-3 py-1 border rounded mx-1"
          :disabled="!classes.links.next"
          @click="fetchClasses(classes.meta.current_page + 1)">
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white w-full max-w-md p-6 rounded shadow">
        <h3 class="text-lg font-semibold mb-4">Add Class</h3>

        <form @submit.prevent="createClass">
          <div class="mb-3">
            <label class="block text-sm mb-1">Class Name</label>
            <input 
              v-model="form.name" 
              class="w-full border px-3 py-2 rounded" 
              required 
            />
          </div>

          <div class="mb-3">
            <label class="block text-sm mb-1">Numeric Value</label>
            <input 
              v-model.number="form.numeric_value" 
              type="number"
              min="1" max="12"
              class="w-full border px-3 py-2 rounded" 
              required 
            />
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button 
              type="button" 
              @click="showModal = false"
              class="px-4 py-2 border rounded">
              Cancel
            </button>

            <button 
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const classes = ref<any[]>([]);
const showModal = ref(false);


const form = ref({
  name: '',
  numeric_value: 1
});

const API = 'http://127.0.0.1:8000/api/admin/classes';
const token = localStorage.getItem('access_token');
const headers = { Authorization: `Bearer ${token}` };

// Fetch classes with optional page
const fetchClasses = async (page = 1) => {
  try {
    const res = await axios.get(API + `?page=${page}`, { headers });
    classes.value = res.data.data;
  } catch (err: any) {
    console.error('Fetch error:', err.response?.data || err);
  }
};

// Create class
const createClass = async () => {
  try {
    const res = await axios.post(API, form.value, { headers });
    toast.success(res.data.message || 'Class created successfully');

    showModal.value = false;
    form.value = { name: '', numeric_value: 1 };

    fetchClasses();
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message || 'Failed to create class');
  }
};

// Delete class
const deleteClass = async (id: number) => {
  if (!confirm('Delete this class?')) return;

  try {
    const res = await axios.delete(`${API}/${id}`, { headers });
    toast.success(res.data.message || 'Class deleted successfully');

    // Reload current page after deletion
    fetchClasses(currentPage.value);
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error(err.response?.data?.message || 'Cannot delete class');
  }
};

onMounted(() => fetchClasses());
</script>