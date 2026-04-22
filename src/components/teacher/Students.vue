<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Students</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
    </div>

    <div v-else-if="errorMessage" class="bg-white dark:bg-gray-800 p-10 text-center rounded shadow">
      <p class="text-red-500 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <div v-else-if="students.length === 0" class="bg-white dark:bg-gray-800 p-10 text-center rounded shadow">
      <p class="text-gray-500 dark:text-gray-400">No students found</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Roll</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Name</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Admission</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Status</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in students" :key="s.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ s.roll_number }}</td>
              <td class="p-3 font-medium text-gray-900 dark:text-white">{{ s.name }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">{{ s.admission_number }}</td>
              <td class="p-3">
                <span :class="getStatusClass(s.today_status)" class="px-2 py-1 rounded text-xs font-medium">
                  {{ formatStatus(s.today_status) }}
                </span>
              </td>
              <td class="p-3">
                <button @click="viewStudentDetails(s.id)" class="text-indigo-600 dark:text-indigo-400 hover:underline">
                  View Details
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
import { useRoute, useRouter } from 'vue-router'
import teacherApi from '../../services/teacherApi'
import { useToast } from 'vue-toastification'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const students = ref<any[]>([])
const errorMessage = ref<string>('')

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    present: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    late: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    not_marked: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
  }
  return classes[status] || classes.not_marked
}

const formatStatus = (status: string) => {
  if (!status || status === 'not_marked') return 'Not Marked'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const fetchStudents = async () => {
  loading.value = true
  errorMessage.value = ''

  const classId = Number(route.params.id)
  const sectionId = Number(route.query.section_id)

  if (!classId || !sectionId) {
    errorMessage.value = 'You are not assigned to any class yet'
    loading.value = false
    return
  }

  try {
    const res = await teacherApi.getClassStudents(classId, sectionId)
    if (res.data.success) {
      students.value = res.data.data.students || []
    } else {
      errorMessage.value = res.data.message || 'Failed to load students'
    }
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.response?.data?.message || 'Failed to load students'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

const viewStudentDetails = (id: number) => {
  router.push(`/teacher/student/${id}`)
}

onMounted(() => fetchStudents())

watch(
  () => [route.params.id, route.query.section_id],
  () => {
    fetchStudents()
  }
)
</script>