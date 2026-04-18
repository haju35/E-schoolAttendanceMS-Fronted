<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">View Attendance History</h1>
      <p class="text-gray-600 dark:text-gray-400">View daily attendance records for your homeroom class</p>
    </div>

    <!-- No Assignments Warning -->
    <div v-if="!loading && hasNoAssignments" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-center flex-col text-center">
        <svg class="w-16 h-16 text-yellow-600 dark:text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">No Classes Assigned</h3>
        <p class="text-yellow-700 dark:text-yellow-400 mb-4">
          You have not been assigned as a homeroom teacher for any class yet.
        </p>
        <p class="text-sm text-yellow-600 dark:text-yellow-500">
          Please contact the administrator to get class assignments.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class *</label>
            <select 
              v-model="selectedClassId" 
              @change="onClassChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Choose a class</option>
              <option v-for="cls in classTeacherClasses" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Section *</label>
            <select 
              v-model="selectedSectionId" 
              @change="onSectionChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              :disabled="!selectedClassId"
            >
              <option value="">Choose section</option>
              <option v-for="section in availableSections" :key="section.id" :value="section.id">
                {{ section.name }} ({{ section.student_count || 0 }} students)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
            <input 
              type="date" 
              v-model="selectedDate" 
              :max="today"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div class="mt-4">
          <button 
            @click="loadReport" 
            class="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            :disabled="!selectedClassId || !selectedSectionId || loadingReport"
          >
            {{ loadingReport ? 'Loading...' : 'View Attendance' }}
          </button>
        </div>
      </div>

      <!-- Attendance Table -->
      <div v-if="attendanceData && attendanceData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Attendance for {{ formatDate(selectedDate) }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Roll No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="student in attendanceData" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ student.roll_number || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium dark:text-white">{{ getInitials(student.name) }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Admission: {{ student.admission_number }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': student.status === 'present',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': student.status === 'absent',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': student.status === 'late'
                    }"
                  >
                    {{ student.status ? student.status.toUpperCase() : 'NOT MARKED' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ student.remarks || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Summary -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <div class="flex flex-wrap justify-between items-center gap-4">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">Summary:</span>
              Present: {{ summary.present }} | 
              Absent: {{ summary.absent }} | 
              Late: {{ summary.late }} | 
              Total: {{ summary.total }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="selectedClassId && !loadingReport && hasSearched" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No attendance records found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No attendance has been marked for {{ formatDate(selectedDate) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const loading = ref(true)
const loadingReport = ref(false)
const selectedClassId = ref<number | null>(null)
const selectedSectionId = ref<number | null>(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const today = new Date().toISOString().split('T')[0]
const classTeacherClasses = ref<any[]>([])
const availableSections = ref<any[]>([])
const attendanceData = ref<any[]>([])
const hasSearched = ref(false)

const hasNoAssignments = computed(() => {
  return classTeacherClasses.value.length === 0
})

const summary = computed(() => {
  const present = attendanceData.value.filter(s => s.status === 'present').length
  const absent = attendanceData.value.filter(s => s.status === 'absent').length
  const late = attendanceData.value.filter(s => s.status === 'late').length
  const total = attendanceData.value.length
  return { present, absent, late, total }
})

const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchClassTeacherClasses = async () => {
  try {
    const response = await api.get('/teacher/class-teacher/classes')
    if (response.data.success) {
      if (response.data.data && response.data.data.length > 0) {
        classTeacherClasses.value = response.data.data.map((classItem: any) => ({
          id: classItem.id,
          name: classItem.name,
          sections: classItem.sections || []
        }))
      } else {
        classTeacherClasses.value = []
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch class teacher classes:', error)
    classTeacherClasses.value = []
  } finally {
    loading.value = false
  }
}

const onClassChange = () => {
  const selectedClass = classTeacherClasses.value.find(c => c.id === selectedClassId.value)
  availableSections.value = selectedClass ? selectedClass.sections : []
  selectedSectionId.value = null
  attendanceData.value = []
  hasSearched.value = false
}

const onSectionChange = () => {
  attendanceData.value = []
  hasSearched.value = false
}

const loadReport = async () => {
  if (!selectedClassId.value || !selectedSectionId.value) {
    toast.error('Please select class and section')
    return
  }
  
  if (!selectedDate.value) {
    toast.error('Please select a date')
    return
  }
  
  loadingReport.value = true
  hasSearched.value = true
  
  try {
    const response = await api.get('/teacher/class-attendance/students', {
      params: {
        class_id: selectedClassId.value,
        section_id: selectedSectionId.value,
        date: selectedDate.value
      }
    })
    
    console.log('Attendance API Response:', response.data)
    
    if (response.data.success) {
      const studentsData = response.data.data.students || []
      const existingAttendance = response.data.data.existing_attendance || []
      
      if (studentsData.length > 0) {
        attendanceData.value = studentsData.map((s: any) => {
          const existingRecord = existingAttendance.find((a: any) => a.student_id === s.id)
          return {
            id: s.id,
            roll_number: s.roll_number || '-',
            admission_number: s.admission_number || '',
            name: s.name || s.user?.name || 'Unknown',
            status: existingRecord ? existingRecord.status : 'not_marked',
            remarks: existingRecord ? (existingRecord.remarks || '') : ''
          }
        })
        
        if (existingAttendance.length === 0) {
          toast.info('No attendance marked for this date')
        } else {
          toast.success(`Loaded attendance for ${formatDate(selectedDate.value)}`)
        }
      } else {
        attendanceData.value = []
        toast.info('No students found in this class/section')
      }
    } else {
      toast.error(response.data.message || 'Failed to load attendance')
    }
  } catch (error: any) {
    console.error('Error loading attendance:', error)
    toast.error(error.response?.data?.message || 'Failed to load attendance records')
    attendanceData.value = []
  } finally {
    loadingReport.value = false
  }
}

onMounted(() => {
  fetchClassTeacherClasses()
})
</script>