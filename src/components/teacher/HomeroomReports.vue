<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Attendance Reports</h1>
      <p class="text-gray-600 dark:text-gray-400">View attendance reports for your homeroom class</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- No Class Assigned -->
    <div v-else-if="!classInfo" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">No Homeroom Class Assigned</h3>
      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">You are not assigned as a homeroom teacher for any class.</p>
    </div>

    <div v-else>
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
            <select v-model="reportType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Summary</option>
              <option value="student">Student-wise Report</option>
            </select>
          </div>

          <div v-if="reportType === 'daily'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
            <input type="date" v-model="selectedDate" :max="today" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div v-if="reportType === 'monthly'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Month</label>
            <input type="month" v-model="selectedMonth" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div v-if="reportType === 'student'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student</label>
            <select v-model="selectedStudentId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="">Choose a student</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} (Roll: {{ student.roll_number }})
              </option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="generateReport" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition" :disabled="loadingReport">
              {{ loadingReport ? 'Generating...' : 'Generate Report' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Report Results -->
      <div v-if="reportData && reportData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <!-- Daily Report Table -->
        <div v-if="reportType === 'daily'">
          <div class="px-6 py-4 border-b dark:border-gray-700">
            <h2 class="text-lg font-semibold">Daily Attendance Report - {{ formatDate(selectedDate) }}</h2>
            <p class="text-sm text-gray-500">Class: {{ classInfo?.class_name }} | Section: {{ classInfo?.section_name }}</p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in reportData" :key="record.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm">{{ record.roll_number || '-' }}</td>
                  <td class="px-6 py-4 text-sm font-medium">{{ record.name }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(record.status)">
                      {{ getStatusText(record.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">{{ record.remarks || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Monthly Report Table -->
        <div v-if="reportType === 'monthly'">
          <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-semibold">Monthly Attendance Summary - {{ selectedMonth }}</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="summary in reportData" :key="summary.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium">{{ summary.name }}</td>
                  <td class="px-6 py-4 text-sm text-green-600">{{ summary.present }}</td>
                  <td class="px-6 py-4 text-sm text-red-600">{{ summary.absent }}</td>
                  <td class="px-6 py-4 text-sm text-yellow-600">{{ summary.late }}</td>
                  <td class="px-6 py-4 text-sm">{{ summary.total_days }}</td>
                  <td class="px-6 py-4">
                    <span :class="getAttendanceColor(summary.percentage)">{{ summary.percentage }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Student Report Table -->
        <div v-if="reportType === 'student' && reportData">
          <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-semibold">Student Attendance Report</h2>
            <p class="text-sm text-gray-500">{{ selectedStudent?.name }} (Roll No: {{ selectedStudent?.roll_number }})</p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in reportData" :key="record.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm">{{ formatDate(record.date) }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(record.status)">
                      {{ getStatusText(record.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">{{ record.remarks || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="px-6 py-4 bg-gray-50 border-t">
          <div class="flex justify-between">
            <div class="text-sm text-gray-600">
              <span class="font-semibold">Summary:</span>
              <span class="text-green-600"> Present: {{ summaryStats.present }}</span> |
              <span class="text-red-600"> Absent: {{ summaryStats.absent }}</span> |
              <span class="text-yellow-600"> Late: {{ summaryStats.late }}</span>
            </div>
            <div class="text-sm text-gray-500">
              Total Records: {{ reportData.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="hasSearched" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium">No report data found</h3>
        <p class="mt-1 text-sm text-gray-500">Try selecting different filters or date range.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const loading = ref(true)
const loadingReport = ref(false)
const reportType = ref('daily')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const selectedStudentId = ref<number | null>(null)
const students = ref<any[]>([])
const classInfo = ref<any>(null)
const reportData = ref<any>(null)
const hasSearched = ref(false)
const today = new Date().toISOString().split('T')[0]

const selectedStudent = computed(() => {
  return students.value.find(s => s.id === selectedStudentId.value)
})

const summaryStats = computed(() => {
  if (!reportData.value) return { present: 0, absent: 0, late: 0 }
  
  let present = 0, absent = 0, late = 0
  reportData.value.forEach((record: any) => {
    if (record.status === 'present') present++
    else if (record.status === 'absent') absent++
    else if (record.status === 'late') late++
  })
  return { present, absent, late }
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const getStatusText = (status: string) => {
  switch(status) {
    case 'present': return 'PRESENT'
    case 'absent': return 'ABSENT'
    case 'late': return 'LATE'
    default: return 'NOT MARKED'
  }
}

const getStatusClass = (status: string) => {
  switch(status) {
    case 'present': return 'bg-green-100 text-green-800'
    case 'absent': return 'bg-red-100 text-red-800'
    case 'late': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 75) return 'text-blue-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const fetchInitialData = async () => {
  loading.value = true
  try {
    // Get class info from dashboard
    const response = await api.get('/teacher/class-teacher/dashboard')
    console.log('Dashboard response:', response.data)
    
    if (response.data.success && response.data.data.is_class_teacher) {
      classInfo.value = response.data.data.class_teacher_info
      
      // Get students from the dashboard data
      if (classInfo.value.students && classInfo.value.students.length > 0) {
        students.value = classInfo.value.students.map((s: any) => ({
          id: s.id,
          name: s.user?.name || s.name || 'Unknown',
          roll_number: s.roll_number
        }))
      }
    } else {
      classInfo.value = null
    }
  } catch (error: any) {
    console.error('Failed to fetch initial data:', error)
    toast.error(error.response?.data?.message || 'Failed to load data')
  } finally {
    loading.value = false
  }
}

const generateReport = async () => {
  if (reportType.value === 'student' && !selectedStudentId.value) {
    toast.error('Please select a student')
    return
  }
  
  loadingReport.value = true
  hasSearched.value = true
  
  try {
    let response
    
    if (reportType.value === 'daily') {
      // For daily report, we can use the class-attendance endpoint with all required params
      response = await api.get('/teacher/class-attendance/students', {
        params: {
          class_room_id: classInfo.value.class_id,
          section_id: classInfo.value.section_id,
          date: selectedDate.value
        }
      })
      reportData.value = response.data.data?.students || []
    } 
    else if (reportType.value === 'monthly') {
      const [year, month] = selectedMonth.value.split('-')
      response = await api.get('/teacher/attendance/monthly', {
        params: { 
          class_id: classInfo.value.class_id,
          section_id: classInfo.value.section_id,
          year, 
          month 
        }
      })
      reportData.value = response.data.data || []
    }
    else if (reportType.value === 'student' && selectedStudentId.value) {
      response = await api.get(`/teacher/students/${selectedStudentId.value}/attendance`)
      reportData.value = response.data.data || []
    }
    
    if (reportData.value?.length === 0) {
      toast.info('No attendance records found')
    } else {
      toast.success(`Found ${reportData.value.length} records`)
    }
  } catch (error: any) {
    console.error('Failed to generate report:', error)
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      toast.error(`Validation error: ${errorMessages}`)
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Failed to generate report')
    }
    reportData.value = []
  } finally {
    loadingReport.value = false
  }
}

onMounted(() => {
  fetchInitialData()
})
</script>