<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Student Details</h1>
      <p class="text-gray-600 dark:text-gray-400">View student information and attendance</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="studentData" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Student Info Card -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <span class="text-3xl text-indigo-600 dark:text-indigo-300 font-bold">{{ getInitials(studentData.name) }}</span>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ studentData.name }}</h2>
            <p class="text-gray-500 dark:text-gray-400">{{ studentData.email }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Roll No: {{ studentData.roll_number }}</p>
          </div>
          
          <div class="mt-4 pt-4 border-t dark:border-gray-700">
            <div class="flex justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">Admission No:</span>
              <span class="text-gray-800 dark:text-white font-medium">{{ studentData.admission_number }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">Class:</span>
              <span class="text-gray-800 dark:text-white font-medium">{{ studentData.class_name }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">Section:</span>
              <span class="text-gray-800 dark:text-white font-medium">{{ studentData.section_name }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">Phone:</span>
              <span class="text-gray-800 dark:text-white font-medium">{{ studentData.phone || 'N/A' }}</span>
            </div>
          </div>

          <!-- Attendance Statistics -->
          <div class="mt-4 pt-4 border-t dark:border-gray-700">
            <h3 class="text-md font-semibold text-gray-800 dark:text-white mb-3">Attendance Summary</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total Classes:</span>
                <span class="text-gray-800 dark:text-white font-medium">{{ attendanceStats.total_classes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Present:</span>
                <span class="text-green-600 dark:text-green-400 font-medium">{{ attendanceStats.present }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Absent:</span>
                <span class="text-red-600 dark:text-red-400 font-medium">{{ attendanceStats.absent }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Late:</span>
                <span class="text-yellow-600 dark:text-yellow-400 font-medium">{{ attendanceStats.late }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-400 font-semibold">Attendance %:</span>
                <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ attendanceStats.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance History -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Attendance History</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="p-3 text-left text-gray-600 dark:text-gray-300">Date</th>
                  <th class="p-3 text-left text-gray-600 dark:text-gray-300">Status</th>
                  <th class="p-3 text-left text-gray-600 dark:text-gray-300">Subject</th>
                  <th class="p-3 text-left text-gray-600 dark:text-gray-300">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in attendanceRecords" :key="record.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td class="p-3 text-gray-700 dark:text-gray-300">{{ formatDate(record.date) }}</td>
                  <td class="p-3">
                    <span :class="getStatusClass(record.status)" class="px-2 py-1 rounded text-xs font-medium">
                      {{ formatStatus(record.status) }}
                    </span>
                  </td>
                  <td class="p-3 text-gray-700 dark:text-gray-300">{{ record.subject?.name || 'N/A' }}</td>
                  <td class="p-3 text-gray-500 dark:text-gray-400">{{ record.remarks || '-' }}</td>
                </tr>
                <tr v-if="attendanceRecords.length === 0">
                  <td colspan="4" class="p-3 text-center text-gray-500 dark:text-gray-400">No attendance records found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Subject-wise Breakdown -->
        <div v-if="subjectWiseStats.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Subject-wise Attendance</h3>
          <div class="space-y-3">
            <div v-for="subject in subjectWiseStats" :key="subject.subject" class="border-b dark:border-gray-700 pb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-800 dark:text-white">{{ subject.subject }}</span>
                <span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ subject.percentage }}%</span>
              </div>
              <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Present: {{ subject.present }}/{{ subject.total }}</span>
                <span>Absent: {{ subject.total - subject.present }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div class="bg-green-600 h-2 rounded-full" :style="{ width: subject.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-red-600 dark:text-red-400">
      Student not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import teacherApi from '../../services/teacherApi'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const studentData = ref<any>(null)
const attendanceRecords = ref<any[]>([])
const attendanceStats = ref({
  total_classes: 0,
  present: 0,
  absent: 0,
  late: 0,
  percentage: 0
})
const subjectWiseStats = ref<any[]>([])

const getInitials = (name: string) => {
  if (!name) return 'S'
  return name.charAt(0).toUpperCase()
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const formatStatus = (status: string) => {
  if (!status) return 'Not Marked'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    present: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    late: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

const fetchStudentDetails = async () => {
  const studentId = Number(route.params.id)
  if (!studentId) {
    toast.error('Invalid student ID')
    router.back()
    return
  }

  loading.value = true
  try {
    const res = await teacherApi.getStudentDetails(studentId)
    console.log('Student details response:', res.data)
    
    if (res.data.success) {
      const data = res.data.data
      
      // Extract student info (adjust based on your API response)
      studentData.value = data.student || data
      
      // Get attendance records
      if (data.student?.attendances) {
        attendanceRecords.value = data.student.attendances
      } else if (data.attendances) {
        attendanceRecords.value = data.attendances
      }
      
      // Get statistics
      if (data.attendance_statistics) {
        attendanceStats.value = data.attendance_statistics
        subjectWiseStats.value = data.attendance_statistics.subject_wise || []
      }
      
    } else {
      toast.error(res.data.message || 'Failed to load student details')
      router.back()
    }
  } catch (err: any) {
    console.error('Error fetching student details:', err)
    toast.error(err.response?.data?.message || 'Failed to load student details')
    router.back()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStudentDetails()
})
</script>