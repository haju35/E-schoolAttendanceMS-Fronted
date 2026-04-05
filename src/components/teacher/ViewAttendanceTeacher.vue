<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">View Attendance</h1>
      <p class="text-gray-600">View attendance records for your classes</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select v-model="filters.class_room_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" @change="onClassChange">
              <option value="">Select Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select v-model="filters.section_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" :disabled="!filters.class_room_id" @change="onSectionChange">
              <option value="">Select Section</option>
              <option v-for="section in availableSections" :key="section.section.id" :value="section.section.id">
                Section {{ section.section.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select v-model="filters.subject_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" :disabled="!filters.section_id">
              <option value="">All Subjects</option>
              <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="flex space-x-2">
              <input type="date" v-model="filters.from_date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <input type="date" v-model="filters.to_date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <button 
            @click="loadReport" 
            class="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            :disabled="!filters.class_room_id || !filters.section_id || loadingReport"
          >
            {{ loadingReport ? 'Loading...' : 'Generate Report' }}
          </button>
        </div>
      </div>

      <!-- Report Summary -->
      <div v-if="reportData" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Total Records</p>
          <p class="text-2xl font-bold">{{ reportData.summary?.total_records || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Present</p>
          <p class="text-2xl font-bold text-green-600">{{ reportData.summary?.present || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Absent</p>
          <p class="text-2xl font-bold text-red-600">{{ reportData.summary?.absent || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Late</p>
          <p class="text-2xl font-bold text-yellow-600">{{ reportData.summary?.late || 0 }}</p>
        </div>
      </div>

      <!-- Student Wise Table -->
      <div v-if="reportData?.student_wise?.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">Student Attendance Summary</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in reportData.student_wise" :key="student.student_id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ student.roll_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">{{ student.present }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{{ student.absent }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{{ student.late }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-1 mr-2">
                      <div class="bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 rounded-full h-2" :style="{ width: student.percentage + '%' }"></div>
                      </div>
                    </div>
                    <span class="text-sm">{{ student.percentage }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button @click="viewStudentDetails(student.student_id)" class="text-indigo-600 hover:text-indigo-900">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="filters.class_room_id && !loadingReport" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
        <p class="mt-1 text-sm text-gray-500">Select a class and section to generate report.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import teacherApi from '../../services/teacherApi'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const loadingReport = ref(false)
const classes = ref<any[]>([])
const availableSections = ref<any[]>([])
const availableSubjects = ref<any[]>([])
const filters = ref({
  class_room_id: null as number | null,
  section_id: null as number | null,
  subject_id: null as number | null,
  from_date: '',
  to_date: ''
})
const reportData = ref<any>(null)

const fetchClasses = async () => {
  try {
    const response = await teacherApi.getClasses()
    if (response.data.success) {
      classes.value = response.data.data.map((item: any) => item.class) || []
    }
  } catch (error) {
    console.error('Error fetching classes:', error)
    toast.error('Failed to load classes')
  } finally {
    loading.value = false
  }
}

const onClassChange = async () => {
  const classData = (await teacherApi.getClasses()).data.data.find((c: any) => c.class.id === filters.value.class_room_id)
  availableSections.value = classData?.sections || []
  filters.value.section_id = null
  filters.value.subject_id = null
  reportData.value = null
}

const onSectionChange = () => {
  const selectedSection = availableSections.value.find(s => s.section.id === filters.value.section_id)
  availableSubjects.value = selectedSection?.subjects || []
  filters.value.subject_id = null
  reportData.value = null
}

const loadReport = async () => {
  if (!filters.value.class_room_id || !filters.value.section_id) {
    toast.error('Please select class and section')
    return
  }
  
  if (!filters.value.from_date || !filters.value.to_date) {
    // Set default dates (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    filters.value.from_date = startDate.toISOString().split('T')[0]
    filters.value.to_date = endDate.toISOString().split('T')[0]
  }
  
  loadingReport.value = true
  try {
    const params: any = {
      class_room_id: filters.value.class_room_id,
      section_id: filters.value.section_id,
      from_date: filters.value.from_date,
      to_date: filters.value.to_date
    }
    
    if (filters.value.subject_id) {
      params.subject_id = filters.value.subject_id
    }
    
    const response = await teacherApi.getAttendanceReport(params)
    if (response.data.success) {
      reportData.value = response.data.data
      toast.success('Report generated successfully')
    }
  } catch (error: any) {
    console.error('Error loading report:', error)
    toast.error(error.response?.data?.message || 'Failed to generate report')
  } finally {
    loadingReport.value = false
  }
}

const viewStudentDetails = (studentId: number) => {
  router.push(`/teacher/students/${studentId}`)
}

// Set default dates
const setDefaultDates = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  filters.value.from_date = startDate.toISOString().split('T')[0]
  filters.value.to_date = endDate.toISOString().split('T')[0]
}

onMounted(() => {
  setDefaultDates()
  fetchClasses()
})
</script>