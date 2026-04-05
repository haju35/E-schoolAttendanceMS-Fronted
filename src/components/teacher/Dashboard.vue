<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
      <p class="text-gray-600">Welcome back, {{ teacherName }}!</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">My Classes</p>
          <p class="text-2xl font-bold text-indigo-600">{{ stats.my_classes }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Total Students</p>
          <p class="text-2xl font-bold text-green-600">{{ stats.total_students }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Today's Attendance</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats.today_attendance }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Subjects</p>
          <p class="text-2xl font-bold text-purple-600">{{ stats.subjects_count }}</p>
        </div>
      </div>

      <!-- My Classes -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">My Classes</h2>
        <div v-if="myClasses.length === 0" class="text-center text-gray-500">
          <p>No classes assigned yet</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="classItem in myClasses" :key="classItem.class.id" class="border p-3 rounded">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold">{{ classItem.class.name }}</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div v-for="section in classItem.sections" :key="section.section.id" class="border-l-2 pl-3 border-indigo-200">
                <div class="font-medium">Section {{ section.section.name }}</div>
                <div class="text-xs text-gray-500">Capacity: {{ section.section.capacity }}</div>
                <div class="mt-1 flex items-center space-x-2">
                  <span class="text-green-600">{{ section.subjects.length }} subjects</span>
                  <button 
                    v-if="section.section.id"
                    @click="viewStudents(classItem.class.id, section.section.id)" 
                    class="text-indigo-600 hover:underline text-xs"
                  >
                    View Students →
                  </button>
                </div>
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
import teacherApi from '../../services/teacherApi'
import { useToast } from 'vue-toastification'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const toast = useToast()
const { user } = useAuth()

const teacherName = computed(() => user.value?.name || 'Teacher')
const loading = ref(true)
const stats = ref({
  my_classes: 0,
  total_students: 0,
  today_attendance: 0,
  subjects_count: 0
})
const myClasses = ref<any[]>([])

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const classesRes = await teacherApi.getClasses()
    if (classesRes.data.success) {
      myClasses.value = classesRes.data.data || []
      stats.value.my_classes = myClasses.value.length

      // Compute total students and subjects
      let totalStudents = 0
      let totalSubjects = 0

      for (const cls of myClasses.value) {
        for (const section of cls.sections || []) {
          totalSubjects += section.subjects?.length || 0
          try {
            const studentsRes = await teacherApi.getClassStudents(cls.class.id, section.section.id)
            if (studentsRes.data.success) {
              totalStudents += studentsRes.data.data.students?.length || 0
            }
          } catch (err) { console.error(err) }
        }
      }

      stats.value.total_students = totalStudents
      stats.value.subjects_count = totalSubjects

      // Today's attendance
      const dashboardRes = await teacherApi.getDashboard()
      if (dashboardRes.data.success) {
        stats.value.today_attendance = dashboardRes.data.data.today_attendance || 0
      }
    }
  } catch (err: any) {
    console.error(err)
    toast.error(err.response?.data?.message || 'Failed to load dashboard')
  } finally {
    loading.value = false
  }
}

const viewStudents = (classId: number, sectionId: number) => {
  if (!classId || !sectionId) {
    toast.error('Cannot view students: missing class or section')
    return
  }
  router.push({ path: `/teacher/students/${classId}`, query: { section_id: sectionId.toString() } })
}

onMounted(() => fetchDashboardData())
</script>