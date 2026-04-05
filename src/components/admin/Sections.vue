<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Sections</h1>
      <p class="text-gray-600">Manage school sections and their capacities</p>
    </div>

    <!-- Add Button -->
    <div class="mb-6">
      <button 
        @click="openModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Section
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="ml-3 text-gray-600">Loading sections...</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="s in sections" :key="s.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="s.class_room" class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {{ s.class_room.name }}
                </span>
                <span v-else class="text-red-500 text-sm">No class assigned</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {{ s.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {{ s.capacity || 'Unlimited' }} students
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  @click="openMoveModal(s.id)"
                  class="text-red-600 hover:text-red-900 transition font-medium">
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="sections.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <p>No sections found</p>
                <p class="text-sm mt-1">Click the "Add Section" button to create one.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Section Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Add New Section</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="createSection" class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Class *</label>
            <select 
              v-model="form.class_room_id" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              required>
              <option value="" disabled>Select a class</option>
              <option v-for="c in classes" :key="c.id" :value="c.id">
                {{ c.name }} (Class {{ c.numeric_value }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Section Names *</label>
            <div v-for="(name, index) in form.name" :key="index" class="flex gap-2 mb-2">
            <input 
              v-model="form.name[index]" 
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              placeholder="e.g., A, B, C, Science, Arts"
              required 
            />
            <button type="button" @click="removeField(index)" class="text-red-500"></button>
            </div>
          </div>

          <button type="button" @click="addField" class="text-indigo-600 text-sm">+ Add another section</button>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
            <input 
              type="number" 
              min="1" 
              v-model.number="form.capacity" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              placeholder="Maximum number of students"
            />
            <p class="text-xs text-gray-500 mt-1">Optional: Leave empty for unlimited capacity</p>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? 'Creating...' : 'Create Section' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Move Students Modal -->
    <div v-if="showMoveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">Move Students Before Deleting</h3>
        <p class="text-sm text-gray-600 mb-4">
          This section has students. Please select another section to move them.
        </p>

        <select v-model="targetSectionId" class="w-full border rounded-lg px-3 py-2 mb-4">
          <option value="" disabled>Select target section</option>
          <option v-for="s in sections.filter(sec => sec.id !== selectedSectionId)" :key="s.id" :value="s.id">
            {{ s.name }} ({{ s.students?.length || 0 }} students)
          </option>
        </select>

        <div class="flex justify-end gap-2">
          <button @click="showMoveModal = false" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button @click="confirmDeleteWithMove" class="px-4 py-2 bg-red-600 text-white rounded-lg">
            Move & Delete
          </button>
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

const sections = ref<any[]>([]);
const classes = ref<any[]>([]);
const showModal = ref(false);
const loading = ref(false);
const submitting = ref(false);

// Move students modal
const showMoveModal = ref(false);
const selectedSectionId = ref<number | null>(null);
const targetSectionId = ref<number | null>(null);

const form = ref({
  class_room_id: '',
  name: [''],
  capacity: null
});


// Fetch sections
const fetchSections = async () => {
  loading.value = true;
  try {
    const res = await api.get('admin/sections');
    if (res.data.success) sections.value = res.data.data;
  } catch (err: any) {
    toast.error('Failed to load sections');
  } finally {
    loading.value = false;
  }
};

const addField = () => {
  form.value.name.push('');
};

const removeField = (index: number) => {
  form.value.name.splice(index, 1);
};

// Fetch classes
const fetchClasses = async () => {
  try {
    const res = await api.get('admin/classes');
    if (res.data.success) {
      if (res.data.data && Array.isArray(res.data.data)) classes.value = res.data.data;
      else if (res.data.data.data) classes.value = res.data.data.data;
    }
  } catch (err) {
    classes.value = [];
  }
};

// Open/Close modal
const openModal = () => { form.value = { class_room_id:'', name:[''], capacity:null }; showModal.value = true; };
const closeModal = () => { showModal.value = false; form.value = { class_room_id:'', name:[''], capacity:null }; };

// Create section
const createSection = async () => {
  if (!form.value.class_room_id || form.value.name.length === 0) { toast.error('Fill all required fields'); return; }
  submitting.value = true;
  try {
    const payload = form.value.name.map(name => ({
      class_room_id: form.value.class_room_id,
      name: name,
      capacity: form.value.capacity
    }));
    const res = await api.post('/admin/sections/bulk', payload);
    if (res.data.success) { toast.success(res.data.message); closeModal(); fetchSections(); }
    else toast.error(res.data.message);
  } catch(err:any) { toast.error(err.response?.data?.message || 'Failed'); }
  finally { submitting.value = false; }
};

// Open move students modal
const openMoveModal = (id:number) => { selectedSectionId.value = id; targetSectionId.value = null; showMoveModal.value = true; };

// Confirm delete with student move
const confirmDeleteWithMove = async () => {
  if (!targetSectionId.value) { toast.error('Select a target section'); return; }
  try {
    const res = await api.delete(`/admin/sections/${selectedSectionId.value}`, {
      data: {  new_section_id: targetSectionId.value }});
    if (res.data.success) { 
      toast.success(res.data.message); 
    showMoveModal.value = false; 
    fetchSections(); 
    }else{
      toast.error(res.data.message);
    }
  } catch(err:any) { 
    toast.error(err.response?.data?.message || 'Failed to delete'); }
};

onMounted(() => { 
  fetchSections(); 
  fetchClasses(); 
  });
</script>