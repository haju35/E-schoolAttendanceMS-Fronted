<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Homeroom Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your homeroom class attendance</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="!isClassTeacher" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">Not a Class Teacher</h3>
      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">You are not assigned as a homeroom teacher. Only homeroom teachers can access this dashboard.</p>
    </div>

    <div v-else>
      <!-- Class Info Card -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-sm font-semibold uppercase tracking-wide">Homeroom Class</span>
            </div>
            <h2 class="text-3xl font-bold">{{ classInfo?.class_name }} - {{ classInfo?.section_name }}</h2>
            <p class="text-indigo-100 mt-2">{{ classInfo?.total_students }} Students Enrolled</p>
          </div>
          <div class="text-right">
            <div class="text-sm opacity-80">Today's Date</div>
            <div class="text-xl font-bold">{{ todayDate }}</div>
          </div>
        </div>
      </div>

      <!-- Today's Attendance Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Today's Status</p>
              <p class="text-xl font-bold" :class="todayAttendanceMarked ? 'text-green-600' : 'text-yellow-600'">
                {{ todayAttendanceMarked ? '✓ Marked' : '⚠ Pending' }}
              </p>
            </div>
            <div :class="todayAttendanceMarked ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'" class="w-12 h-12 rounded-full flex items-center justify-center">
              <svg v-if="todayAttendanceMarked" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Attendance Rate (This Month)</p>
          <p class="text-2xl font-bold text-indigo-600">{{ monthlyAttendanceRate }}%</p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: `${monthlyAttendanceRate}%` }"></div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Most Absent Student</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ mostAbsentStudent || 'No data' }}</p>
          <p class="text-xs text-gray-500 mt-1">Absent days this month</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button 
          @click="goToMarkAttendance" 
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ todayAttendanceMarked ? 'Edit Today\'s Attendance' : 'Mark Today\'s Attendance' }}
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
        
        <button 
          @click="generateReport" 
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Report
        </button>
      </div>

      <!-- Student List with Attendance Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance Summary</h3>
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-sm font-medium dark:text-white">{{ student.name?.charAt(0) || 'S' }}</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                  </div>
                </td>
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

const router = useRouter()
const toast = useToast()

// State
const loading = ref(true)
const isClassTeacher = ref(false)
const classInfo = ref<any>(null)
const students = ref<any[]>([])
const todayAttendanceMarked = ref(false)
const monthlyAttendanceRate = ref(0)
const mostAbsentStudent = ref('')

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('/teacher/class-teacher/dashboard')
    console.log('Class Teacher Dashboard:', response.data)
    
    if (response.data.success) {
      const data = response.data.data
      isClassTeacher.value = data.is_class_teacher
      
      if (isClassTeacher.value && data.class_teacher_info) {
        classInfo.value = data.class_teacher_info
        todayAttendanceMarked.value = data.class_teacher_info.today_attendance_marked || false
        
        // Load students with their attendance summary
        students.value = data.class_teacher_info.students.map((s: any) => ({
          id: s.id,
          name: s.user?.name || 'Unknown',
          roll_number: s.roll_number,
          present: s.present_count || 0,
          absent: s.absent_count || 0,
          late: s.late_count || 0,
          attendance_percentage: s.attendance_percentage || 0
        }))
        
        // Calculate monthly average
        if (students.value.length > 0) {
          const total = students.value.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0)
          monthlyAttendanceRate.value = Math.round(total / students.value.length)
          
          // Find most absent student
          const mostAbsent = [...students.value].sort((a, b) => (b.absent || 0) - (a.absent || 0))[0]
          if (mostAbsent && mostAbsent.absent > 0) {
            mostAbsentStudent.value = mostAbsent.name
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Error fetching class teacher dashboard:', error)
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
  router.push('/teacher/attendance?tab=class')
}

const viewAttendanceHistory = () => {
  router.push('/teacher/view-attendance?type=class')
}

const generateReport = () => {
  router.push('/teacher/reports?type=class')
}

const viewStudentDetail = (studentId: number) => {
  router.push(`/teacher/students/${studentId}?view=attendance`)
}

onMounted(() => {
  fetchData()
})
</script>