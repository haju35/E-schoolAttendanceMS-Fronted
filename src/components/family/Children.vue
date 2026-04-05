<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Children</h1>
      <p class="text-gray-600">Manage and monitor all your children</p>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div v-for="child in children" :key="child.id" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span class="text-2xl text-white font-bold">{{ getInitials(child.name) }}</span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800">{{ child.name }}</h3>
                <p class="text-gray-600">{{ child.class_name }} - {{ child.section }} | Roll No: {{ child.roll_no }}</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{{ child.status }}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-indigo-600">{{ child.attendance_rate }}%</p>
              <p class="text-xs text-gray-600">Attendance Rate</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-green-600">{{ child.present_days }}</p>
              <p class="text-xs text-gray-600">Present Days</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-red-600">{{ child.absent_days }}</p>
              <p class="text-xs text-gray-600">Absent Days</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-yellow-600">{{ child.late_days }}</p>
              <p class="text-xs text-gray-600">Late Days</p>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button @click="viewAttendance(child)" class="btn-primary text-sm px-4 py-2">View Attendance</button>
            <button @click="submitLeave(child)" class="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700">Submit Leave</button>
            <button @click="contactTeacher(child)" class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">Contact Teacher</button>
          </div>
        </div>
      </div>
      
      <div v-if="children.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <p class="text-gray-500">No children linked to your account</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth} from '../../stores/useAuth'
import familyApi from '../../services/familyApi'


const router = useRouter()
const user = useAuth()
const children = ref([])

const fetchChildren = async () => {
  try {
    const response = await familyApi.getChildren()
    children.value = response.data.children

    // Now select child
    const childId = route.params.id
    if (childId) {
      selectedChild.value = children.value.find(c => String(c.id) === String(childId))
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

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const viewAttendance = (child) => {
  router.push(`/family/attendance/${child.id}`)
}

const submitLeave = (child) => {
  router.push({
    path: '/family/leave',
    query: { child_id: child.id, child_name: child.name }
  })
}

const contactTeacher = async (child) => {
  // Implement contact teacher functionality
  alert(`Contact teacher for ${child.name}`)
}

onMounted(() => {
  fetchChildren()
})
</script>