<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Attendance History</h1>
      <p class="text-gray-600 dark:text-gray-400">View detailed attendance records for your children</p>
    </div>

    <!-- Child Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button v-for="child in children" :key="child.id"
                @click="selectChild(child)"
                class="px-6 py-2 rounded-lg font-medium transition"
                :class="selectedChild?.id === child.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'">
          {{ child.name }}
        </button>
      </div>
    </div>

    <div v-if="selectedChild">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition">
          <p class="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ selectedChild.attendance_rate || 0 }}%</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition">
          <p class="text-sm text-gray-500 dark:text-gray-400">Present Days</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ selectedChild.present_days || 0 }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition">
          <p class="text-sm text-gray-500 dark:text-gray-400">Absent Days</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ selectedChild.absent_days || 0 }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition">
          <p class="text-sm text-gray-500 dark:text-gray-400">Late Days</p>
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ selectedChild.late_days || 0 }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
            <select v-model="filters.month" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" @change="loadAttendance">
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
            <select v-model="filters.year" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" @change="loadAttendance">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Detailed Records -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Detailed Records</h2>
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
              <tr v-for="record in attendanceRecords" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ record.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ record.status?.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ record.subject_name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ record.remarks || '-' }}</td>
              </tr>
              <tr v-if="attendanceRecords.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No attendance records found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import familyApi from '../../services/familyApi'

const route = useRoute()
const children = ref([])
const selectedChild = ref(null)
const attendanceRecords = ref([])
const loading = ref(false)

const filters = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear()
})

const months = [
  { value: 1, name: 'January' }, { value: 2, name: 'February' },
  { value: 3, name: 'March' }, { value: 4, name: 'April' },
  { value: 5, name: 'May' }, { value: 6, name: 'June' },
  { value: 7, name: 'July' }, { value: 8, name: 'August' },
  { value: 9, name: 'September' }, { value: 10, name: 'October' },
  { value: 11, name: 'November' }, { value: 12, name: 'December' }
]

const years = ref([])

const generateYears = () => {
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.value.push(i)
  }
}

const getStatusClass = (status) => {
  const classes = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const fetchChildren = async () => {
  try {
    const response = await familyApi.getChildren()
    if (response.data.success) {
      children.value = response.data.data.children || []
      
      // Select child from route param or default to first
      const childId = route.params.id
      if (childId) {
        selectedChild.value = children.value.find(c => c.id == childId)
      } else if (children.value.length > 0) {
        selectedChild.value = children.value[0]
      }
      
      if (selectedChild.value) {
        await loadAttendance()
      }
    }
  } catch (error) {
    console.error('Error fetching children:', error)
  }
}

const selectChild = async (child) => {
  selectedChild.value = child
  await loadAttendance()
}

const loadAttendance = async () => {
  if (!selectedChild.value) return
  
  loading.value = true
  try {
    const response = await familyApi.getChildAttendance(selectedChild.value.id, filters.value)
    if (response.data.success) {
      attendanceRecords.value = response.data.data.records || []
      selectedChild.value = { ...selectedChild.value, ...response.data.data.stats }
    }
  } catch (error) {
    console.error('Error loading attendance:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  generateYears()
  fetchChildren()
})
</script>