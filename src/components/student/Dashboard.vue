<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Welcome -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Welcome back, {{ name }}!</h1>
      <p class="text-gray-600">Your attendance summary</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-sm">Attendance Rate</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.attendance_rate || 0 }}%</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-sm">Days Present</p>
        <p class="text-2xl font-bold text-blue-600">{{ stats.present_days || 0 }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-sm">Days Absent</p>
        <p class="text-2xl font-bold text-red-600">{{ stats.absent_days }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-sm">Late Arrivals</p>
        <p class="text-2xl font-bold text-yellow-600">{{ stats.late_days }}</p>
      </div>
    </div>

    <!-- Recent Attendance Records -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-semibold">Recent Attendance Records</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in recentAttendance" :key="record.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ record.subject?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ record.remarks || '-' }}
              </td>
            </tr>
            <tr v-if="recentAttendance.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">No attendance records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import studentApi from '../../services/studentApi'

const studentName = ref('')
const stats = ref({
  attendance_rate: 0,
  present_days: 0,
  absent_days: 0,
  late_days: 0
})
const recentAttendance = ref([])

const fetchDashboard = async () => {
  try {
    const res = await studentApi.getDashboard()
    const data = res.data.data

    studentName.value = data.student_name
    stats.value = data.stats
    recentAttendance.value = data.recent_attendance
  } catch (error) {
    console.error('Error fetching dashboard:', error)
  }
}

const getStatusClass = (status) => {
  return {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800'
  }[status] || 'bg-gray-100 text-gray-800'
}

onMounted(fetchDashboard)
</script>