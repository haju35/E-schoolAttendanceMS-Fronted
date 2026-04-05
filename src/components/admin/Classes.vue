<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Classes</h2>
      <button 
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Add Class
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white shadow rounded overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Numeric Value</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in classes.data || classes" :key="c.id" class="border-t">
            <td class="p-3">{{ c.name }}</td>
            <td class="p-3">{{ c.numeric_value }}</td>
            <td class="p-3 text-right">
              <button 
                @click="deleteClass(c.id)"
                class="text-red-600 hover:underline">
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="(classes.data || classes).length === 0">
            <td colspan="3" class="text-center p-4 text-gray-500">
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
    alert(res.data.message || 'Class created successfully');

    showModal.value = false;
    form.value = { name: '', numeric_value: 1 };

    fetchClasses();
  } catch (err: any) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || 'Failed to create class');
  }
};

// Delete class
const deleteClass = async (id: number) => {
  if (!confirm('Delete this class?')) return;

  try {
    const res = await axios.delete(`${API}/${id}`, { headers });
    alert(res.data.message || 'Class deleted successfully');

    // Reload current page after deletion
    fetchClasses(currentPage.value);
  } catch (err: any) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || 'Cannot delete class');
  }
};

onMounted(() => fetchClasses());
</script>