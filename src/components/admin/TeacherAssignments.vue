<template>
  <div class="p-4 md:p-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Teacher Assignments</h1>
      <button
        @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Assignment
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <input
        type="text"
        v-model="filters.search"
        @input="fetchAssignments"
        placeholder="Search by teacher, subject..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Assignments Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Section</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assignment in assignments" :key="assignment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ assignment.teacher?.user?.name || 'N/A' }}</td>
              <td class="px-6 py-4">{{ assignment.subject?.name || 'N/A' }}</td>
              <td class="px-6 py-4 hidden md:table-cell">{{ assignment.class_room?.name || 'N/A' }}</td>
              <td class="px-6 py-4 hidden md:table-cell">{{ assignment.section?.name || 'N/A' }}</td>
              <td class="px-6 py-4">{{ assignment.academic_year }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-3">
                  <button @click="editAssignment(assignment)" class="text-yellow-600 hover:text-yellow-900" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteAssignment(assignment.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="loading && assignments.length === 0">
              <td colspan="6" class="px-6 py-8 text-center">Loading...</td>
            </tr>
            <tr v-if="!loading && assignments.length === 0">
              <td colspan="6" class="px-6 py-8 text-center">No assignments found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Assignment Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto" @click.self="closeModal">
      <div class="relative top-20 w-full max-w-xl p-5 bg-white rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="text-xl font-semibold">{{ editingAssignment ? 'Edit Assignment' : 'Add Assignment' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form @submit.prevent="saveAssignment" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Teacher *</label>
              <select v-model="form.teacher_id" required class="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select teacher</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.user?.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Subject *</label>
              <select v-model="form.subject_id" required class="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select subject</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Class *</label>
              <select v-model="form.class_room_id" required class="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select class</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Section *</label>
              <select v-model="form.section_id" required class="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select section</option>
                <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.name }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Academic Year *</label>
              <input type="text" v-model="form.academic_year" required class="w-full px-3 py-2 border rounded-md" placeholder="e.g., 2024">
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {{ submitting ? 'Saving...' : (editingAssignment ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
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
const editingAssignment = ref(false);

const assignments = ref([]);
const teachers = ref([]);
const subjects = ref([]);
const classes = ref([]);
const sections = ref([]);
const filters = ref({ search: '' });

const form = ref({
  id: null,
  teacher_id: '',
  subject_id: '',
  class_room_id: '',
  section_id: '',
  academic_year: ''
});

// Fetch assignments
const fetchAssignments = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/admin/teacher-assignments?search=${filters.value.search}`);
    if (response.data.success) assignments.value = response.data.data.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to load assignments');
  } finally {
    loading.value = false;
  }
};

// Fetch options (teachers, subjects, classes, sections)
const fetchOptions = async () => {
  try {
    const [teacherRes, subjectRes, classRes, sectionRes] = await Promise.all([
      api.get('/admin/teachers?limit=1000'),
      api.get('/admin/subjects?limit=1000'),
      api.get('/admin/classes?limit=1000'),
      api.get('/admin/sections?limit=1000')
    ]);

    // Adjust according to API response
    teachers.value = teacherRes.data.data.data || teacherRes.data.data;
    subjects.value = subjectRes.data.data.data || subjectRes.data.data;
    classes.value = classRes.data.data.data || classRes.data.data;
    sections.value = sectionRes.data.data.data || sectionRes.data.data;
  } catch (error) {
    console.error('Failed to load options', error);
  }
};

// Save assignment (create/update)
const saveAssignment = async () => {
  submitting.value = true;
  try {
    let response;
    if (editingAssignment.value) {
      response = await api.put(`/admin/teacher-assignments/${form.value.id}`, form.value);
    } else {
      response = await api.post('/admin/teacher-assignments', form.value);
    }
    if (response.data.success) {
      toast.success(editingAssignment.value ? 'Assignment updated' : 'Assignment created');
      closeModal();
      fetchAssignments();
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Operation failed');
  } finally {
    submitting.value = false;
  }
};

const editAssignment = (assignment: any) => {
  editingAssignment.value = true;
  form.value = { ...assignment };
  showModal.value = true;
};

const deleteAssignment = async (id: number) => {
  if (confirm('Delete this assignment?')) {
    try {
      await api.delete(`/admin/teacher-assignments/${id}`);
      toast.success('Assignment deleted');
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editingAssignment.value = false;
  form.value = { id: null, teacher_id: '', subject_id: '', class_room_id: '', section_id: '', academic_year: '' };
};

const openAddModal = () => { showModal.value = true; };

onMounted(() => {
  fetchAssignments();
  fetchOptions();
});
</script>