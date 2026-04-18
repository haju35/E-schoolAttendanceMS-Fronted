<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Subject Attendance Management</h1>
      <p class="text-gray-600 dark:text-gray-400">Record subject-wise attendance for your classes</p>
    </div>

    <!-- No Assignments Warning -->
    <div v-if="!loading && hasNoAssignments" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-center flex-col text-center">
        <svg class="w-16 h-16 text-yellow-600 dark:text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">No Classes Assigned</h3>
        <p class="text-yellow-700 dark:text-yellow-400 mb-4">
          You have not been assigned to teach any subjects or sections yet.
        </p>
        <p class="text-sm text-yellow-600 dark:text-yellow-500">
          Please contact the administrator to get class assignments.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Subject Attendance Content -->
    <div v-else>
      <!-- Class and Date Selection -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Class -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
            <select v-model="selectedClassId" @change="onClassChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="">Choose a class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>

          <!-- Section -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Section</label>
            <select v-model="selectedSectionId" @change="onSectionChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              :disabled="!selectedClassId">
              <option value="">Choose section</option>
              <option v-for="section in availableSections" :key="section.id" :value="section.id">
                {{ section.name }}
              </option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
            <select v-model="selectedSubjectId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              :disabled="!selectedSectionId">
              <option value="">Choose subject</option>
              <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input type="date" v-model="attendanceDate"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              :max="today">
          </div>
        </div>

        <div class="mt-4">
          <button @click="loadStudents"
            class="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            :disabled="!selectedClassId || !selectedSectionId || !selectedSubjectId || loadingStudents">
            {{ loadingStudents ? 'Loading...' : 'Load Students' }}
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="students.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button @click="markAll('present')" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Mark All Present
          </button>
          <button @click="markAll('absent')" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Mark All Absent
          </button>
          <button @click="markAll('late')" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
            Mark All Late
          </button>
        </div>
      </div>

      <!-- Students Table -->
      <div v-if="students.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Roll No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ student.roll_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium dark:text-white">{{ getInitials(student.name) }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Admission: {{ student.admission_number }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-2">
                    <button @click="updateStatus(student.id, 'present')"
                      class="px-3 py-1 rounded text-sm font-medium transition"
                      :class="getStatusButtonClass(student.status, 'present')">
                      Present
                    </button>
                    <button @click="updateStatus(student.id, 'absent')"
                      class="px-3 py-1 rounded text-sm font-medium transition"
                      :class="getStatusButtonClass(student.status, 'absent')">
                      Absent
                    </button>
                    <button @click="updateStatus(student.id, 'late')"
                      class="px-3 py-1 rounded text-sm font-medium transition"
                      :class="getStatusButtonClass(student.status, 'late')">
                      Late
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <input v-model="student.reason" type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Add remarks (optional)" :disabled="student.status === 'present'">
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Submit Button -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <div class="flex flex-wrap justify-between items-center gap-4">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Present: {{ attendanceStats.present }} | Absent: {{ attendanceStats.absent }} | Late: {{ attendanceStats.late }}
            </div>
            <button @click="submitAttendance" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              :disabled="submitting">
              {{ submitting ? 'Submitting...' : 'Submit Attendance' }}
            </button>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="selectedClassId && !loadingStudents" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a class, section, and subject to load students.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import teacherApi from '../../services/teacherApi'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

// State
const loading = ref(true)
const loadingStudents = ref(false)
const submitting = ref(false)
const selectedClassId = ref<number | null>(null)
const selectedSectionId = ref<number | null>(null)
const selectedSubjectId = ref<number | null>(null)
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const today = new Date().toISOString().split('T')[0]
const classes = ref<any[]>([])
const availableSections = ref<any[]>([])
const availableSubjects = ref<any[]>([])
const students = ref<any[]>([])

// Computed
const hasNoAssignments = computed(() => {
  return classes.value.length === 0
})

const attendanceStats = computed(() => {
  const stats = { present: 0, absent: 0, late: 0 }
  students.value.forEach(s => {
    if (s.status === 'present') stats.present++
    else if (s.status === 'absent') stats.absent++
    else if (s.status === 'late') stats.late++
  })
  return stats
})

const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'

const getStatusButtonClass = (current: string, btn: string) => {
  if (current === btn) {
    if (btn === 'present') return 'bg-green-500 text-white'
    if (btn === 'absent') return 'bg-red-500 text-white'
    if (btn === 'late') return 'bg-yellow-500 text-white'
  }
  return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
}

const fetchClasses = async () => {
  try {
    const response = await teacherApi.getClasses()
    if (response.data.success) {
      if (response.data.data && response.data.data.length > 0) {
        classes.value = response.data.data.map((item: any) => ({
          id: item.class.id,
          name: item.class.name,
          sections: item.sections.map((s: any) => ({
            id: s.section.id,
            name: s.section.name,
            subjects: s.subjects || []
          }))
        }))
      } else {
        classes.value = []
      }

      if (route.query.class_id) {
        selectedClassId.value = Number(route.query.class_id)
        onClassChange()
      }
    }
  } catch (error) {
    console.error('Error fetching classes:', error)
    classes.value = []
  } finally {
    loading.value = false
  }
}

const onClassChange = () => {
  const selectedClass = classes.value.find(c => c.id === selectedClassId.value)
  availableSections.value = selectedClass ? selectedClass.sections : []
  selectedSectionId.value = null
  selectedSubjectId.value = null
  availableSubjects.value = []
  students.value = []
}

const onSectionChange = () => {
  const selectedSection = availableSections.value.find(s => s.id === selectedSectionId.value)
  availableSubjects.value = selectedSection ? selectedSection.subjects : []
  selectedSubjectId.value = null
  students.value = []
}

const loadStudents = async () => {
  if (classes.value.length === 0) {
    toast.error('You have no classes assigned. Please contact administrator.')
    return
  }

  if (!selectedClassId.value || !selectedSectionId.value || !selectedSubjectId.value) {
    toast.error('Please select class, section, and subject')
    return
  }
  
  loadingStudents.value = true
  try {
    const response = await teacherApi.getAttendanceForm(selectedClassId.value, selectedSectionId.value, attendanceDate.value, selectedSubjectId.value)
    if (response.data.success) {
      students.value = response.data.data.students.map((s: any) => ({
        id: s.id,
        name: s.name,
        roll_number: s.roll_number,
        admission_number: s.admission_number,
        status: s.status || 'present',
        reason: s.reason || ''
      }))
    }
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || 'Failed to load students')
  } finally {
    loadingStudents.value = false
  }
}

const updateStatus = (studentId: number, status: string) => {
  const student = students.value.find(s => s.id === studentId)
  if (student) {
    student.status = status
    if (status === 'present') student.reason = ''
  }
}

const markAll = (status: string) => {
  students.value.forEach(s => {
    s.status = status
    if (status === 'present') s.reason = ''
  })
}

const submitAttendance = async () => {
  if (students.value.length === 0) return toast.error('No students to submit')
  submitting.value = true
  try {
    const attendanceData: any = {
      class_room_id: selectedClassId.value,
      section_id: selectedSectionId.value,
      date: attendanceDate.value,
      attendance: {}
    }
    students.value.forEach(s => {
      attendanceData.attendance[s.id] = { subject_id: selectedSubjectId.value, status: s.status, reason: s.reason }
    })
    const response = await teacherApi.submitAttendance(attendanceData)
    if (response.data.success) {
      toast.success('Attendance submitted successfully!')
      loadStudents()
    }
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || 'Failed to submit attendance')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchClasses()
})
</script>