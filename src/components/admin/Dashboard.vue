<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="ml-3 text-gray-600">Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-red-800">Error Loading Dashboard</h3>
      <p class="mt-1 text-sm text-red-600">{{ error }}</p>
      <button @click="fetchDashboardData" class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">
        Try Again
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Total Students</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_students || 0 }}</p>
              <p class="text-xs text-green-600">Active: {{ stats.active_students || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Total Teachers</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_teachers || 0 }}</p>
              <p class="text-xs text-green-600">Active: {{ stats.active_teachers || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Total Families</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_families || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Today's Attendance</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ attendancePercentage }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-300">{{ stats.present_today || 0 }} / {{ stats.total_students || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Attendance Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <button @click="$router.push('/admin/students')" class="bg-blue-50 text-blue-600 p-3 md:p-4 rounded-lg hover:bg-blue-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="text-xs md:text-sm">Manage Students</span>
            </button>
            
            <button @click="$router.push('/admin/teachers')" class="bg-green-50 text-green-600 p-3 md:p-4 rounded-lg hover:bg-green-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-xs md:text-sm">Manage Teachers</span>
            </button>
            
            <button @click="$router.push('/admin/classes')" class="bg-purple-50 text-purple-600 p-3 md:p-4 rounded-lg hover:bg-purple-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-xs md:text-sm">Manage Classes</span>
            </button>
            
            <button @click="$router.push('/admin/subjects')" class="bg-yellow-50 text-yellow-600 p-3 md:p-4 rounded-lg hover:bg-yellow-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-xs md:text-sm">Manage Subjects</span>
            </button>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Attendance Summary</h3>
          <div v-if="stats.total_students > 0" class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Present</span>
                <span class="font-medium">{{ stats.present_today || 0 }} students</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: presentPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Absent</span>
                <span class="font-medium">{{ stats.absent_today || 0 }} students</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full transition-all" :style="{ width: absentPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Late</span>
                <span class="font-medium">{{ stats.late_today || 0 }} students</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full transition-all" :style="{ width: latePercentage + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-300">
            No attendance data available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loading = ref(true);
const error = ref('');

// Dashboard stats
const stats = ref({
  total_students: 0,
  active_students: 0,
  total_teachers: 0,
  active_teachers: 0,
  total_families: 0,
  attendance_percentage: 0,
  present_today: 0,
  absent_today: 0,
  late_today: 0
});

const recentStudents = ref([]);
const recentTeachers = ref([]);

// Subjects data
const subjects = ref([]);
const showSubjectModal = ref(false);
const subjectSubmitting = ref(false);
const subjectForm = ref({
  name: '',
  code: ''
});

// Computed percentages
const attendancePercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return Math.round((stats.value.present_today / stats.value.total_students) * 100);
});

const presentPercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return (stats.value.present_today / stats.value.total_students) * 100;
});

const absentPercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return (stats.value.absent_today / stats.value.total_students) * 100;
});

const latePercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return (stats.value.late_today / stats.value.total_students) * 100;
});

const getInitials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('Fetching dashboard data...');
    const response = await api.get('/admin/dashboard');
    console.log('Dashboard response:', response.data);
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      
      stats.value = {
        total_students: data.total_students || 0,
        active_students: data.active_students || 0,
        total_teachers: data.total_teachers || 0,
        active_teachers: data.active_teachers || 0,
        total_families: data.total_families || 0,
        attendance_percentage: data.attendance_percentage || 0,
        present_today: data.present_today || 0,
        absent_today: data.absent_today || 0,
        late_today: data.late_today || 0
      };
      
      recentStudents.value = data.recent_students || [];
      recentTeachers.value = data.recent_teachers || [];
      subjects.value = data.subjects || [];
      loading.value = false;
      
      console.log('Dashboard loaded:', stats.value);
    } else {
      throw new Error(response.data?.message || 'Failed to load dashboard data');
    }
  } catch (err: any) {
    console.error('Error loading dashboard:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load dashboard data';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Fetch subjects
const fetchSubjects = async () => {
  try {
    const response = await api.get('/admin/subjects', {params: {limit: 'all'}});
    console.log('Subjects response:', response.data);
    
    if (response.data && response.data.data) {
      subjects.value = Array.isArray(response.data.data) ? response.data.data : [];
      console.log('Subjects loaded:', subjects.value.length);
    } else {
      subjects.value = [];
    }
  } catch (err: any) {
    console.error('Error fetching subjects:', err);
    toast.error(err.response?.data?.message || 'Failed to fetch subjects');
    subjects.value = [];
  }
};

// Create subject
const createSubject = async () => {
  if (!subjectForm.value.name || !subjectForm.value.code) {
    toast.error('Please fill in all fields');
    return;
  }
  
  subjectSubmitting.value = true;
  
  try {
    const response = await api.post('/admin/subjects', subjectForm.value);
    console.log('Create subject response:', response.data);
    
    toast.success(response.data.message || 'Subject created successfully');
    showSubjectModal.value = false;
    subjectForm.value = { name: '', code: '' };
    
    // Refresh subjects list
    await fetchSubjects();
    
  } catch (err: any) {
    console.error('Error creating subject:', err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create subject';
    toast.error(errorMessage);
  } finally {
    subjectSubmitting.value = false;
  }
};

// Delete subject
const deleteSubject = async (id: number) => {
  if (!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await api.delete(`/admin/subjects/${id}`);
    console.log('Delete subject response:', response.data);
    
    toast.success(response.data.message || 'Subject deleted successfully');
    
    // Refresh subjects list
    await fetchSubjects();
    
  } catch (err: any) {
    console.error('Error deleting subject:', err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Cannot delete subject';
    toast.error(errorMessage);
  }
};

onMounted(async () => {
  await fetchDashboardData();
  await fetchSubjects();
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