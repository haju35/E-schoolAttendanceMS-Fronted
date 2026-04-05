<template>
  <div class="p-4 md:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Subject Assignments</h1>
    </div>

    <!-- Class Selection -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
      <select v-model="selectedClassId" @change="loadClassSubjects" class="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        <option value="">Select a class</option>
        <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
          {{ classItem.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedClassId" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Available Subjects -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Available Subjects</h3>
        </div>
        <div class="p-4">
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div v-for="subject in availableSubjects" :key="subject.id" 
                 class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p class="font-medium text-gray-900">{{ subject.name }}</p>
                <p class="text-sm text-gray-500">Code: {{ subject.code }}</p>
              </div>
              <button @click="assignSubject(subject)" 
                      class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                Assign
              </button>
            </div>
            <div v-if="loadingSubjects" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <div v-else-if="availableSubjects.length === 0" class="text-center text-gray-500 py-8">
              No subjects available to assign
            </div>
          </div>
        </div>
      </div>

      <!-- Assigned Subjects -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Assigned Subjects</h3>
        </div>
        <div class="p-4">
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div v-for="subject in assignedSubjects" :key="subject.id" 
                 class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ subject.name }}</p>
                    <p class="text-sm text-gray-500">Code: {{ subject.code }}</p>
                  </div>
                  <button @click="removeSubject(subject)" 
                          class="text-red-600 hover:text-red-800 ml-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                <label class="inline-flex items-center mt-2">
                  <input type="checkbox" v-model="subject.pivot.is_compulsory" 
                         @change="updateCompulsory(subject)"
                         class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  <span class="ml-2 text-sm text-gray-600">Compulsory Subject</span>
                </label>
              </div>
            </div>
            <div v-if="loadingAssigned" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <div v-else-if="assignedSubjects.length === 0" class="text-center text-gray-500 py-8">
              No subjects assigned to this class
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <p>Select a class to manage subject assignments</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loadingSubjects = ref(false);
const loadingAssigned = ref(false);
const classes = ref([]);
const selectedClassId = ref('');
const availableSubjects = ref([]);
const assignedSubjects = ref([]);
const allSubjects = ref([]);

const fetchClasses = async () => {
  try {
    const response = await api.get('/admin/classes');
    if (response.data.success) {
      classes.value = response.data.data;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to load classes');
  }
};

const fetchAllSubjects = async () => {
  try {
    const response = await api.get('/admin/subjects');
    if (response.data.success) {
      allSubjects.value = response.data.data;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to load subjects');
  }
};

const loadClassSubjects = async () => {
  if (!selectedClassId.value) return;
  
  loadingAssigned.value = true;
  try {
    const response = await api.get(`/admin/classes/${selectedClassId.value}/subjects`);
    if (response.data.success) {
      assignedSubjects.value = response.data.data;
      
      // Update available subjects
      const assignedIds = assignedSubjects.value.map(s => s.id);
      availableSubjects.value = allSubjects.value.filter(s => !assignedIds.includes(s.id));
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to load assigned subjects');
  } finally {
    loadingAssigned.value = false;
  }
};

const assignSubject = async (subject: any) => {
  try {
    const response = await api.post(`/admin/classes/${selectedClassId.value}/subjects`, {
      subject_id: subject.id,
      is_compulsory: true
    });
    
    if (response.data.success) {
      toast.success('Subject assigned successfully');
      // Move subject from available to assigned
      assignedSubjects.value.push({ ...subject, pivot: { is_compulsory: true } });
      availableSubjects.value = availableSubjects.value.filter(s => s.id !== subject.id);
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to assign subject');
  }
};

const removeSubject = async (subject: any) => {
  if (confirm(`Remove ${subject.name} from this class?`)) {
    try {
      await api.delete(`/admin/classes/${selectedClassId.value}/subjects/${subject.id}`);
      toast.success('Subject removed successfully');
      // Move subject from assigned to available
      availableSubjects.value.push(subject);
      assignedSubjects.value = assignedSubjects.value.filter(s => s.id !== subject.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove subject');
    }
  }
};

const updateCompulsory = async (subject: any) => {
  try {
    await api.put(`/admin/classes/${selectedClassId.value}/subjects/${subject.id}`, {
      is_compulsory: subject.pivot.is_compulsory
    });
    toast.success('Updated successfully');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to update');
    // Revert the checkbox if API fails
    subject.pivot.is_compulsory = !subject.pivot.is_compulsory;
  }
};

onMounted(() => {
  fetchClasses();
  fetchAllSubjects();
});
</script>