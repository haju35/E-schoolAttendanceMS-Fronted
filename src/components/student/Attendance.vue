<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Attendance Record</h1>
      <p class="text-gray-600">View your complete attendance history</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <select v-model="filters.month" class="input-field" @change="loadAttendance">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select v-model="filters.year" class="input-field" @change="loadAttendance">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
    </div>


      


    <!-- Detailed Records Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-semibold">Detailed Records</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in attendanceRecords" :key="record.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ record.day }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ record.subject_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.remarks || '-' }}</td>
            </tr>
            <tr v-if="attendanceRecords.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">No attendance records found</td>
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
import { useAuth } from '../../composables/useAuth'


const user = useAuth()
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
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthlyStats = ref({ present: 0, absent: 0, late: 0 })
const calendarDays = ref([])
const attendanceRecords = ref([])

const generateYears = () => {
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.value.push(i)
  }
}

const loadAttendance = async () => {
  try {
    const response = await studentApi.getAttendance(filters.value)
       console.log(response.data)
    monthlyStats.value = response.data.monthly_stats
    calendarDays.value = response.data.calendar_days
    attendanceRecords.value = response.data.records
  } catch (error) {
    console.error('Error loading attendance:', error)
  }
}

const getStatusClass = (status) => {
  const classes = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-400'
}

const getDayClass = (day) => {
  if (!day.status) return 'bg-gray-50 text-gray-400'
  const classes = {
    present: 'bg-green-100 text-green-800 font-semibold hover:bg-green-200',
    absent: 'bg-red-100 text-red-800 font-semibold hover:bg-red-200',
    late: 'bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200'
  }
  return classes[day.status] || 'bg-gray-50'
}

const showDayDetails = (day) => {
  if (day.status) {
    // Scroll to detailed records or show modal
    console.log('Show details for:', day.date)
  }
}

onMounted(() => {
  generateYears()
  loadAttendance()
})
</script>