<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">family Dashboard</h1>
      <p class="text-gray-600">Welcome back, {{ parentName }}!</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">My Children</p>
              <p class="text-2xl font-bold text-indigo-600">{{ stats.total_children }}</p>
            </div>
            <div class="p-3 bg-indigo-100 rounded-full">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Avg. Attendance</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.avg_attendance }}%</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Present Days</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.total_present }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Pending Leaves</p>
              <p class="text-2xl font-bold text-purple-600">{{ stats.pending_leaves }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- My Children Section -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">My Children</h2>
        </div>
        <div v-if="children.length === 0" class="p-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <p>No children linked to your account</p>
          <p class="text-xs mt-2">Please contact the school administrator to link your children</p>
        </div>
        <div v-else class="divide-y">
          <div v-for="child in children" :key="child.id" class="p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-gray-800 text-lg">{{ child.name }}</h3>
                <p class="text-sm text-gray-500">{{ child.class_name }} - {{ child.section }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-indigo-600">{{ child.attendance_rate }}%</p>
                <p class="text-xs text-gray-500">Attendance Rate</p>
              </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center p-2 bg-green-50 rounded-lg">
                <p class="text-xl font-bold text-green-600">{{ child.present_days }}</p>
                <p class="text-xs text-gray-600">Present</p>
              </div>
              <div class="text-center p-2 bg-red-50 rounded-lg">
                <p class="text-xl font-bold text-red-600">{{ child.absent_days }}</p>
                <p class="text-xs text-gray-600">Absent</p>
              </div>
              <div class="text-center p-2 bg-yellow-50 rounded-lg">
                <p class="text-xl font-bold text-yellow-600">{{ child.late_days }}</p>
                <p class="text-xs text-gray-600">Late</p>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 rounded-full h-2 transition-all duration-500" :style="{ width: child.attendance_rate + '%' }"></div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button 
                @click="viewDetails(child)" 
                class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                View Details
              </button>
              <button 
                @click="submitLeave(child)" 
                class="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
              >
                Submit Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Alerts Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">Recent Alerts</h2>
        </div>
        <div v-if="recentAlerts.length === 0" class="p-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <p>No recent alerts</p>
          <p class="text-xs mt-2">All your children have perfect attendance!</p>
        </div>
        <div v-else class="divide-y">
          <div v-for="alert in recentAlerts" :key="alert.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-start space-x-3">
              <div :class="alert.type === 'absent' ? 'bg-red-100' : 'bg-yellow-100'" class="p-2 rounded-full">
                <svg v-if="alert.type === 'absent'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ alert.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(alert.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import familyApi from '../../services/familyApi'

const router = useRouter()
const { user } = useAuth()

const loading = ref(true)
const children = ref<any[]>([])
const recentAlerts = ref<any[]>([])
const stats = ref({
  total_children: 0,
  avg_attendance: 0,
  total_present: 0,
  pending_leaves: 0
})

const parentName = computed(() => user.value?.name || 'family')

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return d.toLocaleDateString()
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const response = await familyApi.getDashboard()
    console.log('Dashboard API Response:', response.data)
    
    children.value = response.data.children || []
    recentAlerts.value = response.data.recent_alerts || []
    
    // Calculate stats
    stats.value.total_children = children.value.length
    
    if (children.value.length > 0) {
      let totalAttendance = 0
      let totalPresent = 0
      
      for (const child of children.value) {
        totalAttendance += child.attendance_rate || 0
        totalPresent += child.present_days || 0
      }
      
      stats.value.avg_attendance = Math.round(totalAttendance / children.value.length)
      stats.value.total_present = totalPresent
    }
    
    stats.value.pending_leaves = response.data.pending_leaves || 0
    
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const viewDetails = (child: any) => {
  router.push(`/family/attendance/${child.id}`)
}

const submitLeave = (child: any) => {
  router.push({
    path: '/family/leave',
    query: { child_id: child.id, child_name: child.name }
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>