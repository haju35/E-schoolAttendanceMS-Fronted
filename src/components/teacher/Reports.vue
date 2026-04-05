<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Attendance Reports</h1>
      <p class="text-gray-600">Generate and download attendance reports</p>
    </div>

    <!-- Report Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Class Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select v-model.number="filters.class_room_id" class="input-field">
            <option value="">Select Class</option>
            <option v-for="item in classes" :key="item.class.id" :value="item.class.id">
              {{ item.class.name }}
            </option>
          </select>
        </div>

        <!-- Section Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
          <select v-model.number="filters.section_id" class="input-field" :disabled="!filters.class_room_id">
            <option value="">Select Section</option>
            <option 
              v-for="sectionItem in classes.find(c => c.class.id === filters.class_room_id)?.sections || []" 
              :key="sectionItem.section.id" 
              :value="sectionItem.section.id"
            >
              {{ sectionItem.section.name }}
            </option>
          </select>
        </div>

        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select v-model="filters.report_type" class="input-field">
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input type="date" v-model="filters.start_date" class="input-field">
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input type="date" v-model="filters.end_date" class="input-field">
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex space-x-3">
        <button @click="generateReport" class="btn-primary" :disabled="loading">
          {{ loading ? 'Generating...' : 'Generate Report' }}
        </button>
        <button @click="exportReport('pdf')" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" :disabled="!reportData">
          Export PDF
        </button>
        <button @click="exportReport('excel')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" :disabled="!reportData">
          Export Excel
        </button>
        <button @click="printReport" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" :disabled="!reportData">
          Print
        </button>
      </div>
    </div>

    <!-- Report Summary -->
    <div v-if="reportSummary" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Total Students</p>
        <p class="text-2xl font-bold">{{ reportSummary.total_students }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Average Attendance</p>
        <p class="text-2xl font-bold text-green-600">{{ reportSummary.avg_attendance.toFixed(2) }}%</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Most Absent Student</p>
        <p class="text-lg font-semibold text-red-600">{{ reportSummary.most_absent_name }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Perfect Attendance</p>
        <p class="text-2xl font-bold text-blue-600">{{ reportSummary.perfect_attendance_count }}</p>
      </div>
    </div>

    <!-- Report Table -->
    <div v-if="reportData" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in reportData" :key="student.student_id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ student.roll_number }}</td>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import teacherApi from '../../services/teacherApi'

const loading = ref(false)
const classes = ref([])
const reportData = ref(null)
const reportSummary = ref(null)

const filters = ref({
  class_room_id: null,
  section_id: null,
  report_type: 'daily',
  start_date: '',
  end_date: ''
})

const fetchClasses = async () => {
  try {
    const response = await teacherApi.getClasses()
    classes.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching classes:', error)
  }
}

const generateReport = async () => {
  if (!filters.value.class_room_id || !filters.value.section_id) {
    alert('Please select class and section')
    return
  }

  loading.value = true
  try {
    const payload = {
      class_room_id: filters.value.class_room_id,
      section_id: filters.value.section_id,
      from_date: filters.value.start_date,
      to_date: filters.value.end_date
    }

    const response = await teacherApi.getAttendanceReport(payload)

    reportData.value = response.data.data.student_wise
    const students = reportData.value
    reportSummary.value = {
      total_students: students.length,
      avg_attendance: students.reduce((acc, s) => acc + s.percentage, 0) / (students.length || 1),
      most_absent_name: students.sort((a, b) => b.absent - a.absent)[0]?.name || '-',
      perfect_attendance_count: students.filter(s => s.percentage === 100).length
    }
  } catch (error) {
    console.error('Error generating report:', error.response?.data || error)
    alert('Failed to generate report. Make sure your dates and filters are correct')
  } finally {
    loading.value = false
  }
}

const exportReport = async (format) => {
  // Optional: implement your export logic
}

const printReport = () => {
  window.print()
}

onMounted(() => {
  fetchClasses()

  const today = new Date()
  filters.value.end_date = today.toISOString().split('T')[0]

  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)
  filters.value.start_date = weekAgo.toISOString().split('T')[0]
})
</script>