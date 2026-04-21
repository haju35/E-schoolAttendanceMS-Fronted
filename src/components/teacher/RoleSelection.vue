<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
    <div class="max-w-4xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {{ teacherName }}!</h1>
        <p class="text-gray-600 dark:text-gray-400">You have multiple roles. Please select which dashboard you want to access.</p>
        <p class="text-sm text-gray-500 mt-2">You can switch between dashboards later from your profile menu.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Homeroom Teacher Card -->
        <div 
          v-if="hasHomeroomRole"
          @click="selectDashboard('homeroom')"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
        >
          <div class="flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mx-auto mb-4">
            <svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">Homeroom Teacher</h2>
          <p class="text-gray-600 dark:text-gray-400 text-center text-sm">
            Manage your homeroom class, mark daily attendance, view class reports, and manage student records.
          </p>
          <div class="mt-4 text-center">
            <span class="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
              Class: {{ homeroomInfo?.class_name }} - Section {{ homeroomInfo?.section_name }}
            </span>
          </div>
        </div>

        <!-- Subject Teacher Card -->
        <div 
          v-if="hasSubjectRole"
          @click="selectDashboard('subject')"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
        >
          <div class="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">Subject Teacher</h2>
          <p class="text-gray-600 dark:text-gray-400 text-center text-sm">
            Manage your subject classes, mark subject-wise attendance, view your teaching schedule.
          </p>
          <div class="mt-4 text-center">
            <span class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
              {{ subjectCount }} Subject(s) Assigned
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <button 
          @click="logout"
          class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const router = useRouter();
const { user, logout: authLogout } = useAuth();
const toast = useToast();

const teacherName = ref('');
const hasHomeroomRole = ref(false);
const hasSubjectRole = ref(false);
const homeroomInfo = ref<any>(null);
const subjectCount = ref(0);
const loading = ref(true);

const selectDashboard = (type: string) => {
  localStorage.setItem('dashboard_type', type);
  
  if (type === 'homeroom') {
    router.push('/homeroom/dashboard');
  } else {
    router.push('/teacher/dashboard');
  }
};

const logout = () => {
  localStorage.clear();
  authLogout();
  router.push('/login');
};

const checkRoles = async () => {
  loading.value = true;
  try {
    teacherName.value = user.value?.name || 'Teacher';
    
    // Check localStorage first
    const storedSubjectCount = localStorage.getItem('subject_count');
    const storedIsClassTeacher = localStorage.getItem('is_class_teacher');
    
    console.log('=== RoleSelection Debug ===');
    console.log('Stored subject_count:', storedSubjectCount);
    console.log('Stored is_class_teacher:', storedIsClassTeacher);
    
    // Check homeroom role from localStorage
    if (storedIsClassTeacher === 'true') {
      hasHomeroomRole.value = true;
      // Get homeroom info from localStorage or API
      try {
        const homeroomRes = await api.get('/teacher/class-teacher/dashboard');
        if (homeroomRes.data.success && homeroomRes.data.data.class_teacher_info) {
          homeroomInfo.value = homeroomRes.data.data.class_teacher_info;
        }
      } catch (err) {
        console.error('Failed to get homeroom info:', err);
        homeroomInfo.value = { class_name: 'Class', section_name: 'A' };
      }
    }
    
    // Check subject role from localStorage
    if (storedSubjectCount && parseInt(storedSubjectCount) > 0) {
      hasSubjectRole.value = true;
      subjectCount.value = parseInt(storedSubjectCount);
      console.log('Subject role detected! Count:', subjectCount.value);
    } else {
      // If not in localStorage, try API
      try {
        const subjectsRes = await api.get('/teacher/assignments/count');
        console.log('Subject count API response:', subjectsRes.data);
        
        if (subjectsRes.data.success && subjectsRes.data.count > 0) {
          hasSubjectRole.value = true;
          subjectCount.value = subjectsRes.data.count;
          localStorage.setItem('subject_count', String(subjectCount.value));
          console.log('Subject role detected from API! Count:', subjectCount.value);
        }
      } catch (err) {
        console.error('Failed to get subject count:', err);
      }
    }
    
    console.log('Final roles:', { 
      hasHomeroom: hasHomeroomRole.value, 
      hasSubject: hasSubjectRole.value,
      subjectCount: subjectCount.value
    });
    
    // Auto-redirect if only one role
    if (hasHomeroomRole.value && !hasSubjectRole.value) {
      console.log('Only homeroom teacher - redirecting to homeroom dashboard');
      localStorage.setItem('dashboard_type', 'homeroom');
      router.push('/homeroom/dashboard');
    } else if (!hasHomeroomRole.value && hasSubjectRole.value) {
      console.log('Only subject teacher - redirecting to subject dashboard');
      localStorage.setItem('dashboard_type', 'subject');
      router.push('/teacher/dashboard');
    }
    // If both roles, stay on this page for user to choose
    
  } catch (error) {
    console.error('Error checking roles:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkRoles();
});
</script>