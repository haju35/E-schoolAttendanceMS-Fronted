<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Family Management</h1>
      <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
        Add Family
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <input type="text" v-model="filters.search" @input="fetchFamilies" placeholder="Search by name, email, phone..." 
             class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400">
    </div>

    <!-- Families Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Family</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">Occupation</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Children</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="family in families" :key="family.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ family.user?.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ family.user?.email }}</div>
                  <div class="text-sm text-gray-400 dark:text-gray-500">{{ family.user?.phone }}</div>
                </div>
              </td>
              <td class="px-6 py-4 hidden md:table-cell text-gray-600 dark:text-gray-400">{{ family.occupation || 'N/A' }}</td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div v-for="student in family.students" :key="student.id" class="text-sm text-gray-600 dark:text-gray-400">
                    {{ student.user?.name }} ({{ student.admission_number }})
                  </div>
                  <div v-if="!family.students?.length" class="text-sm text-gray-400 dark:text-gray-500">No children linked</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-3">
                  <button @click="viewFamily(family)" class="text-blue-600 hover:text-blue-900" title="View">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="editFamily(family)" class="text-yellow-600 hover:text-yellow-900" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="deleteFamily(family.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="loading && families.length === 0"><td colspan="4" class="px-6 py-8 text-center">Loading...</td></tr>
            <tr v-if="!loading && families.length === 0"><td colspan="4" class="px-6 py-8 text-center">No families found</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Family Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="closeModal">
      <div class="relative top-20 mx-auto p-5 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="text-xl font-semibold">{{ editingFamily ? 'Edit Family' : 'Add New Family' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:text-gray-400">✕</button>
        </div>
        
        <form @submit.prevent="saveFamily" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium mb-1">Name *</label><input type="text" v-model="form.name" required class="w-full px-3 py-2 border rounded-md"></div>
            <div><label class="block text-sm font-medium mb-1">Email *</label><input type="email" v-model="form.email" required class="w-full px-3 py-2 border rounded-md"></div>

            <div><label class="block text-sm font-medium mb-1">Phone</label><input type="tel" v-model="form.phone" class="w-full px-3 py-2 border rounded-md"></div>
            <div><label class="block text-sm font-medium mb-1">Occupation</label><input type="text" v-model="form.occupation" class="w-full px-3 py-2 border rounded-md"></div>
            <div><label class="block text-sm font-medium mb-1">Emergency Contact</label><input type="tel" v-model="form.emergency_contact" class="w-full px-3 py-2 border rounded-md"></div>
            <div class="md:col-span-2"><label class="block text-sm font-medium mb-1">Address</label><textarea v-model="form.address" rows="2" class="w-full px-3 py-2 border rounded-md"></textarea></div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Link Children (Select students)</label>
              <select v-model="form.student_ids" multiple class="w-full px-3 py-2 border rounded-md" size="4">
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.user?.name }} ({{ student.admission_number }})
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Hold Ctrl to select multiple</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md">Cancel</button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {{ submitting ? (editingFamily ? 'Updating...' : 'Saving...') : (editingFamily ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- View Family Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="showViewModal = false">
      <div class="relative top-20 mx-auto p-5 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Family Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedFamily" class="space-y-4">
          <div class="flex items-center space-x-4 pb-4 border-b dark:border-gray-700">
            <div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span class="text-2xl text-green-600 dark:text-green-300 font-bold">{{ getInitials(selectedFamily.user?.name) }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedFamily.user?.name }}</h4>
              <p class="text-gray-500 dark:text-gray-400">{{ selectedFamily.user?.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-gray-700 dark:text-gray-300"><span class="font-medium">Occupation:</span> {{ selectedFamily.occupation || 'N/A' }}</div>
            <div class="text-gray-700 dark:text-gray-300"><span class="font-medium">Joining Date:</span> {{ formatDate(selectedFamily.joining_date) }}</div>
            <div class="text-gray-700 dark:text-gray-300"><span class="font-medium">Phone:</span> {{ selectedFamily.user?.phone || 'N/A' }}</div>
            <div class="text-gray-700 dark:text-gray-300"><span class="font-medium">Emergency Contact:</span> {{ selectedFamily.emergency_contact || 'N/A' }}</div>
            <div class="text-gray-700 dark:text-gray-300"><span class="font-medium">Status:</span> 
              <span :class="selectedFamily.user?.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ selectedFamily.user?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="md:col-span-2 text-gray-700 dark:text-gray-300"><span class="font-medium">Address:</span> {{ selectedFamily.user?.address || 'N/A' }}</div>
          </div>
          
          <!-- Linked Children Section -->
          <div class="mt-4 pt-4 border-t dark:border-gray-700">
            <h5 class="font-medium text-gray-900 dark:text-white mb-2">Linked Children</h5>
            <div class="space-y-2">
              <div v-for="student in selectedFamily?.students" :key="student.id" 
                   class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div class="font-medium text-gray-900 dark:text-white">{{ student.user?.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Admission: {{ student.admission_number }} | Class: {{ student.class?.name || 'N/A' }}
                </div>
              </div>
              <div v-if="!selectedFamily?.students?.length" class="text-gray-500 dark:text-gray-400 text-sm">
                No children linked to this family
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end pt-4 border-t dark:border-gray-700">
          <button @click="showViewModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition">Close</button>
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
const editingFamily = ref(false);
const selectedFamily = ref<any>(null);
const showViewModal = ref(false);
const families = ref([]);
const students = ref([]);
const form = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  address: '',
  occupation: '',
  emergency_contact: '',
  student_ids: [] as number[]
});
const filters = ref({ search: '' });

const fetchFamilies = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/admin/families?search=${filters.value.search}`);
    if (response.data.success) families.value = response.data.data.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to load families');
  } finally {
    loading.value = false;
  }
};

const fetchStudents = async () => {
  try {
    const response = await api.get('/admin/students?limit=1000');
    if (response.data.success) students.value = response.data.data.data || response.data.data;
  } catch (error) {
    toast.error('Failed to fetch students');
  }
};

const openAddModal = () => {
  editingFamily.value = false;
  form.value = { id: null, name: '', email: '', phone: '', address: '', occupation: '', emergency_contact: '', student_ids: [] };
  showModal.value = true;
};

const saveFamily = async () => {
  submitting.value = true;
  try {
    let payload = { ...form.value };

    let response;
    if (editingFamily.value) {
      response = await api.put(`/admin/families/${form.value.id}`, payload);
    } else {
      response = await api.post('/admin/families', payload);
    }

    if (response.data.success) {
      toast.success(editingFamily.value ? 'Family updated' : 'Family created');
      closeModal();
      fetchFamilies();
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Operation failed');
  } finally {
    submitting.value = false;
  }
};

const editFamily = (family: any) => {
  editingFamily.value = true;
  form.value = {
    id: family.id,
    name: family.user?.name || '',
    email: family.user?.email || '',
    phone: family.user?.phone || '',
    address: family.user?.address || '',
    occupation: family.occupation || '',
    emergency_contact: family.emergency_contact || '',
    student_ids: family.students?.map((s: any) => s.id) || []
  };
  showModal.value = true;
};

const deleteFamily = async (id: number) => {
  if (confirm('Delete this family?')) {
    try { 
      await api.delete(`/admin/families/${id}`); 
      toast.success('Family deleted'); 
      fetchFamilies(); 
    } 
    catch (error: any) { 
      toast.error(error.response?.data?.message || 'Delete failed'); 
    }
  }
};

const viewFamily = (family: any) => {
  selectedFamily.value = family;
  showViewModal.value = true;
};

const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const closeModal = () => {
  showModal.value = false;
  editingFamily.value = false;
  form.value = { id: null, name: '', email: '', phone: '', address: '', occupation: '', emergency_contact: '', student_ids: [] };
};

onMounted(() => { 
  fetchFamilies(); 
  fetchStudents(); 
});
</script>