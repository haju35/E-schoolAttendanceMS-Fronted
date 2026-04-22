<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Classes</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
    </div>

    <div v-else-if="errorMessage" class="bg-white dark:bg-gray-800 p-10 text-center rounded shadow">
      <p class="text-red-500 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <div v-else-if="assignedClasses.length === 0" class="bg-white dark:bg-gray-800 p-10 text-center rounded shadow">
      <p class="text-gray-500 dark:text-gray-400">No classes assigned yet</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Class</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Section</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Students</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Today's Attendance</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Subjects</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="classItem in assignedClasses" :key="classItem.id + '-' + classItem.section_id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="p-3 font-medium text-gray-900 dark:text-white">{{ classItem.class_name }}</td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ classItem.section_name }}</td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ classItem.total_students }}</td>
              <td class="p-3">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="getAttendanceColor(classItem.today_attendance)"
                >
                  {{ classItem.today_attendance || 0 }}%
                </span>
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                <span :title="classItem.subjects?.join(', ')">
                  {{ classItem.subjects?.slice(0, 2).join(', ') || 'No subjects' }}
                  <span v-if="classItem.subjects?.length > 2" class="text-gray-500"> +{{ classItem.subjects.length - 2 }}</span>
                </span>
              </td>
              <td class="p-3">
                <button 
                  @click="viewStudents(classItem)" 
                  class="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                >
                  View Students
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
const errorMessage = ref<string>('')

const fetchAssignedClasses = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/teacher/classes')

    if (response.data.success) {
      const classes = response.data.data || []

      assignedClasses.value = classes.flatMap((cls: any) => {
        return (cls.sections || []).map((sec: any) => ({
          id: cls.class.id,
          class_name: cls.class.name,
          section_id: sec.section.id,
          section_name: sec.section.name,
          total_students: sec.total_students || 0,
          today_attendance: sec.today_attendance || 0,
          subjects: sec.subjects?.map((s: any) => s.name) || []
        }))
      })
      
      if (assignedClasses.value.length === 0) {
        errorMessage.value = 'No classes assigned yet'
      }
    } else {
      errorMessage.value = response.data.message || 'Failed to load classes'
    }

  } catch (err: any) {
    console.error('Error fetching classes:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to load classes'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

const viewStudents = (classItem: any) => {
  router.push(`/teacher/students/${classItem.id}?section_id=${classItem.section_id}`)
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
  if (percentage >= 75) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
}

onMounted(() => {
  fetchAssignedClasses()
})
</script>