<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Welcome -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {{ name }}!</h1>
      <p class="text-gray-600 dark:text-gray-400">Your attendance summary</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Attendance Rate</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.attendance_rate || 0 }}%</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Days Present</p>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.present_days || 0 }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Days Absent</p>
        <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.absent_days }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Late Arrivals</p>
        <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.late_days }}</p>
      </div>
    </div>

    <!-- Recent Attendance Records -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Recent Attendance Records</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="record in recentAttendance" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ record.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ record.subject?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ record.remarks || '-' }}
              </td>
            </tr>
            <tr v-if="recentAttendance.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No attendance records found</td>
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

const name = ref('')
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

    name.value = data.student_name
    stats.value = data.stats
    recentAttendance.value = data.recent_attendance
  } catch (error) {
    console.error('Error fetching dashboard:', error)
  }
}

const getStatusClass = (status) => {
  return {
    present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

onMounted(fetchDashboard)
</script>