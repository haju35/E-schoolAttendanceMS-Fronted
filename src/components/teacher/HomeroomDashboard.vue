<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Homeroom Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back, {{ teacherName }}! Manage your homeroom class daily attendance.</p>
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Homeroom Class</p>
          <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ classInfo?.class_name }}</p>
          <p class="text-sm text-gray-500 mt-1">Section {{ classInfo?.section_name }}</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Total Students</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.total_students }}</p>
          <p class="text-sm text-gray-500 mt-1">Enrolled in your class</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Today's Status</p>
          <p class="text-2xl font-bold" :class="stats.today_marked ? 'text-green-600' : 'text-yellow-600'">
            {{ stats.today_marked ? '✓ Attendance Marked' : '⚠ Pending' }}
          </p>
          <p class="text-sm text-gray-500 mt-1">{{ todayDate }}</p>
        </div>
      </div>

      <!-- Quick Actions - Only Daily Attendance -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Daily Attendance Actions</h2>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="goToMarkAttendance" 
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ stats.today_marked ? 'Edit Today\'s Attendance' : 'Mark Today\'s Attendance' }}
          </button>
          
          <button 
            @click="viewAttendanceHistory" 
            class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Attendance History
          </button>
        </div>
      </div>

      <!-- Student List with Attendance Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Student Attendance Summary</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Click on any student to view detailed attendance</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Roll No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Present</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Absent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Late</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Attendance %</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ student.roll_number || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">{{ student.present || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{{ student.absent || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{{ student.late || 0 }}</td>
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
                  <button @click="viewStudentDetail(student.id)" class="text-indigo-600 hover:text-indigo-800 text-sm">
                    View Details →
                  </button>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const toast = useToast()
const { user } = useAuth()

const teacherName = computed(() => user.value?.name || 'Teacher')
const loading = ref(true)
const isClassTeacher = ref(false)
const classInfo = ref<any>(null)
const students = ref<any[]>([])
const stats = ref({
  total_students: 0,
  today_marked: false,
  monthly_rate: 0
})

const todayDate = computed(() => new Date().toISOString().split('T')[0])

const fetchDashboardData = async () => {
  loading.value = true
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
        
        if (data.class_teacher_info.students && data.class_teacher_info.students.length > 0) {
          students.value = data.class_teacher_info.students.map((s: any) => ({
            id: s.id,
            name: s.user?.name || s.name || 'Unknown',
            roll_number: s.roll_number || '-',
            present: s.present_count || 0,
            absent: s.absent_count || 0,
            late: s.late_count || 0,
            attendance_percentage: s.attendance_percentage || 0
          }))
        }
        
        if (students.value.length > 0) {
          const total = students.value.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0)
          stats.value.monthly_rate = Math.round(total / students.value.length)
        }
      }
    }
  } catch (error: any) {
    console.error('Failed to load dashboard:', error)
    toast.error(error.response?.data?.message || 'Failed to load dashboard')
  } finally {
    loading.value = false
  }
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 75) return 'text-blue-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-600'
  if (percentage >= 75) return 'bg-blue-600'
  if (percentage >= 60) return 'bg-yellow-600'
  return 'bg-red-600'
}

const goToMarkAttendance = () => {
  router.push('/homeroom/attendance')
}

const viewAttendanceHistory = () => {
  router.push('/homeroom/view-attendance')
}

const viewStudentDetail = (studentId: number) => {
  router.push(`/homeroom/students/${studentId}?view=attendance`)
}

onMounted(() => {
  fetchDashboardData()
})
</script>