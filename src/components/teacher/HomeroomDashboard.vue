<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Homeroom Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back, {{ teacherName }}! Manage your homeroom class daily attendance.</p>
    </div>

    <!-- Auto-refresh notification -->
    <div v-if="autoRefreshNotification" class="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center animate-pulse">
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="text-green-700 dark:text-green-300 text-sm">Refreshing dashboard...</span>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="!isClassTeacher" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">Not a Homeroom Teacher</h3>
      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">You are not assigned as a homeroom teacher. Only homeroom teachers can access this dashboard.</p>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Homeroom Class</p>
          <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ classInfo?.class_name || '-' }}</p>
          <p class="text-sm text-gray-500 mt-1">Section {{ classInfo?.section_name || '-' }}</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Total Students</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.total_students }}</p>
          <p class="text-sm text-gray-500 mt-1">Enrolled in your class</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Today's Attendance</p>
          <p class="text-2xl font-bold" :class="stats.today_marked ? 'text-green-600' : 'text-yellow-600'">
            {{ stats.today_marked ? '✓ Marked' : 'Pending' }}
          </p>
          <p class="text-sm text-gray-500 mt-1">{{ todayDate }}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Monthly Rate</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.monthly_rate }}%</p>
          <p class="text-sm text-gray-500 mt-1">Average attendance</p>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="flex justify-end mb-4">
        <button 
          @click="refreshDashboard" 
          :disabled="refreshing"
          class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" :class="{'animate-spin': refreshing}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ refreshing ? 'Refreshing...' : 'Refresh Dashboard' }}
        </button>
      </div>

      <!-- Student List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">My Students</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Click on any student to view detailed attendance</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roll No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Present</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Absent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Late</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendance %</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ student.roll_number || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{{ student.present || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{{ student.absent || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">{{ student.late || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold" :class="getAttendanceColor(student.attendance_percentage)">
                      {{ student.attendance_percentage || 0 }}%
                    </span>
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full" :class="getProgressBarColor(student.attendance_percentage)" :style="{ width: `${student.attendance_percentage || 0}%` }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button @click="viewStudentDetail(student.id)" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">
                    View Details →
                  </button>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No students found in this class
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const toast = useToast()
const { user } = useAuth()

const teacherName = computed(() => user.value?.name || 'Teacher')
const loading = ref(true)
const refreshing = ref(false)
const autoRefreshNotification = ref(false)
const isClassTeacher = ref(false)
const classInfo = ref<any>(null)
const students = ref<any[]>([])
const stats = ref({
  total_students: 0,
  today_marked: false,
  monthly_rate: 0
})

let refreshInterval: number | null = null

const todayDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/teacher/class-teacher/dashboard')
    console.log('Dashboard Data:', response.data)
    
    if (response.data.success) {
      const data = response.data.data
      isClassTeacher.value = data.is_class_teacher === true || data.is_class_teacher === 1 || data.is_class_teacher === '1'
      
      if (isClassTeacher.value && data.class_teacher_info) {
        classInfo.value = data.class_teacher_info
        stats.value.total_students = data.class_teacher_info.total_students || 0
        stats.value.today_marked = data.class_teacher_info.today_attendance_marked || false
        
        // Get students from dashboard
        const basicStudents = data.class_teacher_info.students || []
        
        if (basicStudents.length > 0) {
          // Calculate attendance counts from the dashboard data
          // The dashboard should already have present_count, absent_count, etc.
          students.value = basicStudents.map((s: any) => ({
            id: s.id,
            name: s.user?.name || s.name || 'Unknown',
            roll_number: s.roll_number || '-',
            present: s.present_count || 0,
            absent: s.absent_count || 0,
            late: s.late_count || 0,
            attendance_percentage: s.attendance_percentage || 0
          }))
          
          // Calculate monthly rate
          if (students.value.length > 0) {
            const total = students.value.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0)
            stats.value.monthly_rate = Math.round(total / students.value.length)
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Failed to load dashboard:', error)
    toast.error(error.response?.data?.message || 'Failed to load dashboard')
  }
}

const loadDashboardData = async () => {
  loading.value = true
  await fetchDashboardData()
  loading.value = false
}

const refreshDashboard = async () => {
  refreshing.value = true
  autoRefreshNotification.value = true
  await fetchDashboardData()
  refreshing.value = false
  toast.success('Dashboard refreshed')
  setTimeout(() => {
    autoRefreshNotification.value = false
  }, 2000)
}

// Auto-refresh every 30 seconds
const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval)
  refreshInterval = window.setInterval(async () => {
    if (!loading.value && !refreshing.value) {
      console.log('Auto-refreshing dashboard...')
      await fetchDashboardData()
    }
  }, 30000)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Refresh when page becomes visible
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    console.log('Page became visible, refreshing...')
    fetchDashboardData()
  }
}

// Refresh on window focus
const handleWindowFocus = () => {
  console.log('Window focused, refreshing...')
  fetchDashboardData()
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-600'
  if (percentage >= 75) return 'bg-blue-600'
  if (percentage >= 60) return 'bg-yellow-600'
  return 'bg-red-600'
}

const viewStudentDetail = (studentId: number) => {
  router.push(`/homeroom/students/${studentId}?view=attendance`)
}

onMounted(() => {
  loadDashboardData()
  startAutoRefresh()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleWindowFocus)
})

onActivated(() => {
  console.log('Component activated, refreshing...')
  fetchDashboardData()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleWindowFocus)
})
</script>