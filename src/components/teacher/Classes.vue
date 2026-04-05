<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Classes</h1>
      <p class="text-gray-600">View and manage your assigned classes</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="classItem in assignedClasses" 
        :key="classItem.id + '-' + classItem.section_id"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white">
          <h3 class="text-xl font-bold">
            {{ classItem.class_name }} - {{ classItem.section_name }}
          </h3>
          <p class="text-sm opacity-90">
            Room: {{ classItem.room_number || 'Not assigned' }}
          </p>
        </div>
        
        <div class="p-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Students:</span>
              <span class="font-semibold">{{ classItem.total_students }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">Subjects:</span>
              <span class="font-semibold">
                {{ classItem.subjects?.join(', ') || 'No subjects' }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">Today's Attendance:</span>
              <span 
                class="font-semibold"
                :class="getAttendanceColor(classItem.today_attendance)"
              >
                {{ classItem.today_attendance || 0 }}%
              </span>
            </div>
          </div>
          
          <div class="mt-4 flex space-x-2">
            <button 
              @click="viewStudents(classItem)" 
              class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm"
            >
              View Students
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div 
        v-if="assignedClasses.length === 0 && !loading" 
        class="col-span-full text-center py-12 bg-white rounded-lg shadow"
      >
        <p class="text-gray-500">No classes assigned yet</p>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="col-span-full flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const assignedClasses = ref<any[]>([])
const loading = ref(false)

const fetchAssignedClasses = async () => {
  loading.value = true

  try {
    const response = await api.get('/teacher/classes')

    if (response.data.success) {
      const classes = response.data.data || []

      assignedClasses.value = classes.flatMap((cls: any) => {
        return cls.sections.map((sec: any) => ({
          id: cls.class.id,
          class_name: cls.class.name,
          section_id: sec.section.id,
          section_name: sec.section.name,
          room_number: sec.room_number || null,
          total_students: sec.total_students || 0,
          today_attendance: sec.today_attendance || 0,
          subjects: sec.subjects?.map((s: any) => s.name) || []
        }))
      })
    }

  } catch (error) {
    console.error('Error fetching classes:', error)
    toast.error('Failed to load classes')
  } finally {
    loading.value = false
  }
}

const viewStudents = (classItem: any) => {
  // Navigate to Students page with class_id & section_id
  router.push(`/teacher/students/${classItem.id}?section_id=${classItem.section_id}`)
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 75) return 'text-yellow-600'
  return 'text-red-600'
}

onMounted(() => {
  fetchAssignedClasses()
})
</script>