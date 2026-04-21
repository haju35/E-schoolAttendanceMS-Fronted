<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Class Teacher Management</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Assign teachers as homeroom/class teachers for daily attendance</p>
      </div>
      <button
        @click="openAssignModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Assign Class Teacher
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Class Teachers</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ classTeachers.length }}</p>
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
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Classes Covered</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ uniqueClassesCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalStudentsCount }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <input
        type="text"
        v-model="search"
        @input="filterTeachers"
        placeholder="Search by teacher name, class, or section..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <!-- Class Teachers Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Teacher</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Section</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Students</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Academic Year</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in filteredTeachers" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-indigo-600 dark:text-indigo-300 font-semibold">{{ getInitials(item.teacher_name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ item.teacher_name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.teacher_email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {{ item.class_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                  {{ item.section_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                  {{ item.students_count || 0 }} students
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
                  {{ item.academic_year || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="removeClassTeacher(item.id)" 
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove as Class Teacher"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>

            <tr v-if="filteredTeachers.length === 0 && !loading">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No class teachers assigned yet
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assign Class Teacher Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Assign Class Teacher</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="assignClassTeacher" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Teacher *</label>
            <select 
              v-model="form.teacher_id" 
              required
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>Select a teacher</option>
              <option 
                v-for="teacher in availableTeachers" 
                :key="teacher.id" 
                :value="teacher.id"
              >
                {{ teacher.user?.name || teacher.name }} - {{ teacher.user?.email || teacher.email }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class *</label>
            <select 
              v-model="form.class_id" 
              required
              @change="onClassChange"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>Select a class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Section *</label>
            <select 
              v-model="form.section_id" 
              required
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>Select a section</option>
              <option v-for="section in filteredSections" :key="section.id" :value="section.id">
                {{ section.name }} (Capacity: {{ section.capacity || 'Unlimited' }})
              </option>
            </select>
          </div>

          <!-- Academic Year input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Year *</label>
            <input 
              type="text" 
              v-model="form.academic_year" 
              required
              placeholder="e.g., 2024"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                Class teachers can mark daily attendance for their assigned class. Each class/section can have only one class teacher per academic year.
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
              {{ submitting ? 'Assigning...' : 'Assign Class Teacher' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();

// State
const loading = ref(false);
const submitting = ref(false);
const showAssignModal = ref(false);
const search = ref('');
const classTeachers = ref<any[]>([]);
const teachers = ref<any[]>([]);
const classes = ref<any[]>([]);
const sections = ref<any[]>([]);

const form = ref({
  teacher_id: '',
  class_id: '',
  section_id: '',
  academic_year: new Date().getFullYear().toString()
});

// Computed
const filteredTeachers = computed(() => {
  if (!search.value) return classTeachers.value;
  const searchLower = search.value.toLowerCase();
  return classTeachers.value.filter(item => 
    item.teacher_name?.toLowerCase().includes(searchLower) ||
    item.teacher_email?.toLowerCase().includes(searchLower) ||
    item.class_name?.toLowerCase().includes(searchLower) ||
    item.section_name?.toLowerCase().includes(searchLower)
  );
});

const availableTeachers = computed(() => {
  const assignedTeacherIds = classTeachers.value.map(ct => ct.teacher_id);
  return teachers.value.filter(t => !assignedTeacherIds.includes(t.id));
});

const filteredSections = computed(() => {
  if (!form.value.class_id) return [];
  return sections.value.filter(s => s.class_room_id === form.value.class_id);
});

const uniqueClassesCount = computed(() => {
  return new Set(classTeachers.value.map(ct => ct.class_name)).size;
});

const totalStudentsCount = computed(() => {
  return classTeachers.value.reduce((sum, ct) => sum + (ct.students_count || 0), 0);
});

const getInitials = (name: string) => {
  if (!name) return 'T';
  return name.charAt(0).toUpperCase();
};

// Methods
const fetchClassTeachers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/class-teachers/list');
    console.log('Class Teachers Response:', response.data);
    
    if (response.data.success) {
      classTeachers.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error('Failed to load class teachers:', error);
    toast.error(error.response?.data?.message || 'Failed to load class teachers');
  } finally {
    loading.value = false;
  }
};

const fetchTeachers = async () => {
  try {
    const response = await api.get('/admin/teachers?limit=all');
    if (response.data.success) {
      teachers.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error('Failed to load teachers', error);
  }
};

const fetchClasses = async () => {
  try {
    const response = await api.get('/admin/classes?limit=all');
    if (response.data.success) {
      classes.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error('Failed to load classes', error);
  }
};

const fetchSections = async () => {
  try {
    const response = await api.get('/admin/sections?limit=all');
    if (response.data.success) {
      sections.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error('Failed to load sections', error);
  }
};

const onClassChange = () => {
  form.value.section_id = '';
};

const assignClassTeacher = async () => {
  if (!form.value.teacher_id || !form.value.class_id || !form.value.section_id || !form.value.academic_year) {
    toast.error('Please fill all fields');
    return;
  }

  submitting.value = true;
  try {
    const response = await api.post('/admin/class-teachers', {
      teacher_id: parseInt(form.value.teacher_id),
      class_id: parseInt(form.value.class_id),
      section_id: parseInt(form.value.section_id),
      academic_year: form.value.academic_year
    });
    
    if (response.data.success) {
      toast.success(response.data.message || 'Class teacher assigned successfully');
      closeModal();
      await fetchClassTeachers();
      await fetchTeachers();
    } else {
      toast.error(response.data.message || 'Assignment failed');
    }
  } catch (error: any) {
    console.error('Assignment error:', error);
    toast.error(error.response?.data?.message || 'Failed to assign class teacher');
  } finally {
    submitting.value = false;
  }
};

const removeClassTeacher = async (assignmentId: number) => {
  if (!confirm('Are you sure you want to remove this teacher as class teacher?')) return;
  
  try {
    const response = await api.delete(`/admin/class-teachers/${assignmentId}`);
    if (response.data.success) {
      toast.success('Class teacher removed successfully');
      await fetchClassTeachers();
      await fetchTeachers();
    } else {
      toast.error(response.data.message || 'Failed to remove');
    }
  } catch (error: any) {
    console.error('Remove error:', error);
    toast.error(error.response?.data?.message || 'Failed to remove class teacher');
  }
};

const openAssignModal = () => {
  form.value = { 
    teacher_id: '', 
    class_id: '', 
    section_id: '', 
    academic_year: new Date().getFullYear().toString() 
  };
  showAssignModal.value = true;
};

const closeModal = () => {
  showAssignModal.value = false;
  form.value = { 
    teacher_id: '', 
    class_id: '', 
    section_id: '', 
    academic_year: new Date().getFullYear().toString() 
  };
};

const filterTeachers = () => {
  // Handled by computed property
};

// Lifecycle
onMounted(() => {
  fetchClassTeachers();
  fetchTeachers();
  fetchClasses();
  fetchSections();
});
</script>