<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Attendance History</h1>
      <p class="text-gray-600">View detailed attendance records for your children</p>
    </div>

    <!-- Child Selector -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button v-for="child in children" :key="child.id"
                @click="selectChild(child)"
                class="px-6 py-2 rounded-lg font-medium transition"
                :class="selectedChild?.id === child.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          {{ child.name }}
        </button>
      </div>
    </div>

    <div v-if="selectedChild">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Attendance Rate</p>
          <p class="text-2xl font-bold text-green-600">{{ selectedChild.attendance_rate }}%</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Present Days</p>
          <p class="text-2xl font-bold text-green-600">{{ selectedChild.present_days }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Absent Days</p>
          <p class="text-2xl font-bold text-red-600">{{ selectedChild.absent_days }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Late Days</p>
          <p class="text-2xl font-bold text-yellow-600">{{ selectedChild.late_days }}</p>
        </div>
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

      <!-- Detailed Records -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">Detailed Records</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in attendanceRecords" :key="record.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select v-model="record.status" @change="updateAttendance(record)"
                          class="px-2 py-1 rounded border text-sm"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ record.subject_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ record.check_in_time || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.remarks || '-' }}</td>
              </tr>
              <tr v-if="attendanceRecords.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">No attendance records found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import familyApi from '../../services/familyApi'

const route = useRoute()
const { token } = useAuth()
const children = ref<any[]>([])
const selectedChild = ref<any>(null)
const filters = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear()
})
const attendanceRecords = ref<any[]>([])

const months = [
  { value: 1, name: 'January' }, { value: 2, name: 'February' },
  { value: 3, name: 'March' }, { value: 4, name: 'April' },
  { value: 5, name: 'May' }, { value: 6, name: 'June' },
  { value: 7, name: 'July' }, { value: 8, name: 'August' },
  { value: 9, name: 'September' }, { value: 10, name: 'October' },
  { value: 11, name: 'November' }, { value: 12, name: 'December' }
]

const years = ref<number[]>([])
const generateYears = () => {
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.value.push(i)
  }
}

const fetchChildren = async () => {
  try {
    const response = await familyApi.getChildren()
    children.value = response.data.children
    
    // Select child from route or default to first
    const childId = route.params.id
    if (childId) {
      selectedChild.value = children.value.find(c => c.id == childId)
    } else if (children.value.length > 0) {
      selectedChild.value = children.value[0]
    }
    
    if (selectedChild.value) {
      await loadAttendance()
    }
  } catch (error) {
    console.error('Error fetching children:', error)
  }
}

const selectChild = async (child: any) => {
  selectedChild.value = child
  await loadAttendance()
}

const loadAttendance = async () => {
  if (!selectedChild.value) return
  try {
    const response = await familyApi.getChildAttendance(selectedChild.value.id, filters.value)
    attendanceRecords.value = response.data.records
    selectedChild.value = { ...selectedChild.value, ...response.data.stats }
  } catch (error) {
    console.error('Error loading attendance:', error)
  }
}

const updateAttendance = async (record: any) => {
  try {
    await familyApi.updateAttendance(record.id, { status: record.status })
    await loadAttendance() // refresh stats after update
  } catch (error) {
    console.error('Error updating attendance:', error)
  }
}

onMounted(() => {
  generateYears()
  fetchChildren()
})
</script>