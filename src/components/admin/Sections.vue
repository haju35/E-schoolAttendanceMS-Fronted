<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sections</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage school sections and their capacities</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Section
      </button>
    </div>

    <!-- Sections Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Section Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Capacity</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="section in sections" :key="section.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ section.class_room?.name || '-' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">
                  {{ section.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ section.capacity ? section.capacity + ' students' : 'Unlimited' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="relative">
                  <button @click.stop="toggleMenu(section.id)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM17.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>

                  <div v-if="activeMenu === section.id"
                    class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                    <div class="flex justify-around p-2">
                      <!-- View Button -->
                      <button 
                        @click="viewSection(section)" 
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition"
                        title="View Details"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      <!-- Edit Button -->
                      <button 
                        @click="editSection(section)" 
                        class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <!-- Delete Button -->
                      <button 
                        @click="deleteSection(section.id)" 
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition"
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
            <tr v-if="sections.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No sections found. Click "Add Section" to create one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Section Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editing ? 'Edit Section' : 'Add New Section' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveSection" class="p-6 space-y-4">
          <!-- Single Section Mode (Edit) -->
          <div v-if="editing">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class *</label>
              <select 
                v-model="form.class_room_id" 
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>Select a class</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Name *</label>
              <input 
                type="text" 
                v-model="form.name" 
                required
                placeholder="e.g., A, B, C"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity</label>
              <input 
                type="number" 
                v-model="form.capacity" 
                placeholder="Optional: Leave empty for unlimited"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <p class="text-xs text-gray-500 mt-1">Optional: Leave empty for unlimited capacity</p>
            </div>
          </div>

          <!-- Bulk Add Mode -->
          <div v-else>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class *</label>
              <select 
                v-model="bulkForm.class_room_id" 
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>Select a class</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Names *</label>
              <div v-for="(section, index) in bulkForm.sections" :key="index" class="flex gap-2 mb-2">
                <input 
                  type="text" 
                  v-model="section.name" 
                  required
                  placeholder="e.g., A"
                  class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button 
                  v-if="bulkForm.sections.length > 1" 
                  type="button"
                  @click="removeSectionField(index)"
                  class="text-red-600 hover:text-red-800 p-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button 
                type="button"
                @click="addSectionField"
                class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 mt-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                + Add another section
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity (Optional)</label>
              <input 
                type="number" 
                v-model="bulkForm.capacity" 
                placeholder="Leave empty for unlimited"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <p class="text-xs text-gray-500 mt-1">Optional: Leave empty for unlimited capacity (applies to all sections)</p>
            </div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                Sections represent different groups within a class (e.g., Grade 10 - Section A, Section B).
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : (editing ? 'Update Section' : 'Create Sections') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Section Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Section Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6" v-if="selectedSection">
          <!-- Header with Section Name -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-700">
            <div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedSection.name }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Section Information</p>
            </div>
            <span class="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              Section
            </span>
          </div>

          <!-- Class Information -->
          <div class="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Class</span>
            </div>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedSection.class_room?.name || 'Not Assigned' }}</p>
          </div>

          <!-- Capacity Information -->
          <div class="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Capacity</span>
            </div>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedSection.capacity ? selectedSection.capacity + ' students' : 'Unlimited' }}
            </p>
            <p v-if="selectedSection.capacity" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Maximum number of students allowed in this section
            </p>
          </div>

          <!-- System Information -->
          <div class="space-y-3 pt-4 border-t dark:border-gray-700">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Created At</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(selectedSection.created_at) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(selectedSection.updated_at) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">ID</span>
              <span class="text-sm text-gray-900 dark:text-white">#{{ selectedSection.id }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
          <button 
            @click="editSection(selectedSection); showViewModal = false"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
            Edit Section
          </button>
          <button 
            @click="showViewModal = false"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();

// State
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const activeMenu = ref<number | null>(null);
const showViewModal = ref(false);
const editing = ref(false);
const sections = ref<any[]>([]);
const classes = ref<any[]>([]);
const selectedSection = ref<any>(null);

// Single section form (for editing)
const form = ref({
  id: null,
  class_room_id: '',
  name: '',
  capacity: ''
});

// Bulk section form (for adding multiple sections)
const bulkForm = ref({
  class_room_id: '',
  sections: [{ name: '' }],
  capacity: ''
});

// Format date and time
const formatDateTime = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fetch sections
const fetchSections = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/sections?limit=all');
    console.log('Sections response:', response.data);
    
    if (response.data.success) {
      sections.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error('Failed to fetch sections:', error);
    toast.error(error.response?.data?.message || 'Failed to load sections');
  } finally {
    loading.value = false;
  }
};

// Fetch classes for dropdown
const fetchClasses = async () => {
  try {
    const response = await api.get('/admin/classes?limit=all');
    if (response.data.success) {
      classes.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error('Failed to fetch classes:', error);
  }
};

// Add section field in bulk form
const addSectionField = () => {
  bulkForm.value.sections.push({ name: '' });
};

// Remove section field in bulk form
const removeSectionField = (index: number) => {
  bulkForm.value.sections.splice(index, 1);
};

// Open add modal
const openAddModal = () => {
  editing.value = false;
  form.value = { id: null, class_room_id: '', name: '', capacity: '' };
  bulkForm.value = {
    class_room_id: '',
    sections: [{ name: '' }],
    capacity: ''
  };
  showModal.value = true;
};

// View section details
const viewSection = (section: any) => {
  selectedSection.value = section;
  showViewModal.value = true;
  activeMenu.value = null; // Close menu after action
};

// Edit section
const editSection = (section: any) => {
  editing.value = true;
  form.value = {
    id: section.id,
    class_room_id: section.class_room_id,
    name: section.name,
    capacity: section.capacity || ''
  };
  showModal.value = true;
  activeMenu.value = null; // Close menu after action
};

// Save section (create or update)
const saveSection = async () => {
  submitting.value = true;
  
  try {
    if (editing.value) {
      // Update single section
      const response = await api.put(`/admin/sections/${form.value.id}`, {
        class_room_id: parseInt(form.value.class_room_id),
        name: form.value.name,
        capacity: form.value.capacity ? parseInt(form.value.capacity) : null
      });
      
      if (response.data.success) {
        toast.success('Section updated successfully');
        closeModal();
        await fetchSections();
      } else {
        toast.error(response.data.message || 'Update failed');
      }
    } else {
      // Create multiple sections
      if (!bulkForm.value.class_room_id) {
        toast.error('Please select a class');
        return;
      }
      
      const validSections = bulkForm.value.sections.filter(s => s.name.trim());
      
      if (validSections.length === 0) {
        toast.error('Please enter at least one section name');
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      // Create each section individually
      for (const section of validSections) {
        try {
          const response = await api.post('/admin/sections', {
            class_room_id: parseInt(bulkForm.value.class_room_id),
            name: section.name.trim(),
            capacity: bulkForm.value.capacity ? parseInt(bulkForm.value.capacity) : null
          });
          
          if (response.data.success) {
            successCount++;
          } else {
            errorCount++;
            console.error(`Failed to create section ${section.name}:`, response.data.message);
          }
        } catch (err: any) {
          errorCount++;
          console.error(`Error creating section ${section.name}:`, err.response?.data?.message);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Created ${successCount} section(s) successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        closeModal();
        await fetchSections();
      } else {
        toast.error('Failed to create sections');
      }
    }
  } catch (error: any) {
    console.error('Save error:', error);
    toast.error(error.response?.data?.message || 'Operation failed');
  } finally {
    submitting.value = false;
  }
};

// Delete section
const deleteSection = async (id: number) => {
  if (!confirm('Are you sure you want to delete this section? This may affect student records.')) return;
  
  try {
    const response = await api.delete(`/admin/sections/${id}`);
    if (response.data.success) {
      toast.success('Section deleted successfully');
      activeMenu.value = null; // Close menu after action
      await fetchSections();
    } else {
      toast.error(response.data.message || 'Delete failed');
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    toast.error(error.response?.data?.message || 'Failed to delete section');
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editing.value = false;
  form.value = { id: null, class_room_id: '', name: '', capacity: '' };
  bulkForm.value = {
    class_room_id: '',
    sections: [{ name: '' }],
    capacity: ''
  };
};

// Toggle dropdown menu
const toggleMenu = (id: number) => {
  activeMenu.value = activeMenu.value === id ? null : id;
};

// Handle click outside to close menu
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    activeMenu.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchSections();
  fetchClasses();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>