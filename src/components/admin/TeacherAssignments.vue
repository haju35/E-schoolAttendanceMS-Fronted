<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Teacher Assignments</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Assign teachers to subjects, classes, and sections</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Assignment
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Assignments</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ assignments.length }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Teachers Assigned</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ uniqueTeachersCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Subjects Covered</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ uniqueSubjectsCount }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <input
        type="text"
        v-model="filters.search"
        @input="fetchAssignments"
        placeholder="Search by teacher, subject..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <!-- Assignments Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Teacher</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">Section</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Academic Year</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="assignment in filteredAssignments" :key="assignment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-indigo-600 dark:text-indigo-300 font-semibold">{{ getInitials(assignment.teacher?.user?.name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ assignment.teacher?.user?.name || 'N/A' }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ assignment.teacher?.user?.email || '' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {{ assignment.subject?.name || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                  {{ assignment.class_room?.name || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                  {{ assignment.section?.name || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                  {{ assignment.academic_year }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end space-x-3">
                  <button @click="editAssignment(assignment)" class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteAssignment(assignment.id)" class="text-red-600 hover:text-red-800 dark:text-red-400" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="loading && filteredAssignments.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">Loading...</td>
            </tr>
            <tr v-if="!loading && filteredAssignments.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No assignments found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Assignment Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingAssignment ? 'Edit Assignment' : 'Add Assignment' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveAssignment" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teacher *</label>
            <select v-model="form.teacher_id" required class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select teacher</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.user?.name }} - {{ teacher.user?.email }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
            <select v-model="form.subject_id" required class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select subject</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class *</label>
            <select v-model="form.class_room_id" required class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section *</label>
            <select v-model="form.section_id" required class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select section</option>
              <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Year *</label>
            <input type="text" v-model="form.academic_year" required placeholder="e.g., 2024" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                Assign teachers to specific subjects for each class and section for the academic year.
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {{ submitting ? 'Saving...' : (editingAssignment ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
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
const submitting = ref(false);
const showModal = ref(false);
const editingAssignment = ref(false);

const assignments = ref<any[]>([]);
const teachers = ref<any[]>([]);
const subjects = ref<any[]>([]);
const classes = ref<any[]>([]);
const sections = ref<any[]>([]);
const filters = ref({ search: '' });

const form = ref({
  id: null,
  teacher_id: '',
  subject_id: '',
  class_room_id: '',
  section_id: '',
  academic_year: new Date().getFullYear().toString()
});

// Computed
const filteredAssignments = computed(() => {
  if (!filters.value.search) return assignments.value;
  const searchLower = filters.value.search.toLowerCase();
  return assignments.value.filter(a => 
    a.teacher?.user?.name?.toLowerCase().includes(searchLower) ||
    a.subject?.name?.toLowerCase().includes(searchLower) ||
    a.class_room?.name?.toLowerCase().includes(searchLower) ||
    a.section?.name?.toLowerCase().includes(searchLower)
  );
});

const uniqueTeachersCount = computed(() => {
  return new Set(assignments.value.map(a => a.teacher_id)).size;
});

const uniqueSubjectsCount = computed(() => {
  return new Set(assignments.value.map(a => a.subject_id)).size;
});

const getInitials = (name: string) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

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

// Fetch options
const fetchOptions = async () => {
  try {
    const [teacherRes, subjectRes, classRes, sectionRes] = await Promise.all([
      api.get('/admin/teachers?limit=all'),
      api.get('/admin/subjects?limit=all'),
      api.get('/admin/classes?limit=all'),
      api.get('/admin/sections?limit=all')
    ]);

    teachers.value = teacherRes.data.data.data || teacherRes.data.data || [];
    subjects.value = subjectRes.data.data.data || subjectRes.data.data || [];
    classes.value = classRes.data.data.data || classRes.data.data || [];
    sections.value = sectionRes.data.data.data || sectionRes.data.data || [];
  } catch (error) {
    console.error('Failed to load options', error);
  }
};

// Save assignment
const saveAssignment = async () => {
  submitting.value = true;
  try {
    let response;
    if (editingAssignment.value) {
      const updateData = {
        teacher_id: form.value.teacher_id,
        subject_id: form.value.subject_id,
        class_room_id: form.value.class_room_id,
        section_id: form.value.section_id,
        academic_year: form.value.academic_year
      };
      response = await api.put(`/admin/teacher-assignments/${form.value.id}`, updateData);
    } else {
      response = await api.post('/admin/teacher-assignments', form.value);
    }
    if (response.data.success) {
      toast.success(editingAssignment.value ? 'Assignment updated' : 'Assignment created');
      closeModal();
      fetchAssignments();
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error: any) {
    console.error('Save error:', error);
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
  if (!confirm('Delete this assignment? This action cannot be undone.')) return;
  
  try {
    const response = await api.delete(`/admin/teacher-assignments/${id}`);
    if (response.data.success) {
      toast.success('Assignment deleted successfully');
      fetchAssignments();
    } else {
      toast.error(response.data.message || 'Delete failed');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Delete failed');
  }
};

const closeModal = () => {
  showModal.value = false;
  editingAssignment.value = false;
  form.value = {
    id: null,
    teacher_id: '',
    subject_id: '',
    class_room_id: '',
    section_id: '',
    academic_year: new Date().getFullYear().toString()
  };
};

const openAddModal = () => {
  showModal.value = true;
};

onMounted(() => {
  fetchAssignments();
  fetchOptions();
});
</script>