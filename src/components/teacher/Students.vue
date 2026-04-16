<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Students</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
    </div>

    <div v-else-if="errorMessage" class="bg-white p-10 text-center rounded shadow">
      <p class="text-red-500">{{ errorMessage }}</p>
    </div>

    <div v-else-if="students.length === 0" class="bg-white p-10 text-center rounded shadow">
      <p class="text-gray-500">No students found</p>
    </div>

    <div v-else class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-3 text-left">Roll</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Admission</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in students" :key="s.id" class="border-t">
            <td class="p-3">{{ s.roll_number }}</td>
            <td class="p-3">{{ s.name }}</td>
            <td class="p-3">{{ s.admission_number }}</td>
            <td class="p-3">
              <span :class="getStatusClass(s.today_status)" class="px-2 py-1 rounded text-xs">
                {{ s.today_status || 'not_marked' }}
              </span>
            </td>
            <td class="p-3">
              <button @click="viewStudentDetails(s.id)" class="text-indigo-600 hover:underline">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
  return {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    not_marked: 'bg-gray-100 text-gray-600'
  }[status] || 'bg-gray-100'
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