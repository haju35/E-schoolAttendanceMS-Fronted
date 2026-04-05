<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Mark Attendance</h1>
      <p class="text-gray-600">Record student attendance for your classes</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <!-- Class and Date Selection -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Class -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select v-model="selectedClassId" @change="onClassChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Choose a class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>

          <!-- Section -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
            <select v-model="selectedSectionId" @change="onSectionChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :disabled="!selectedClassId">
              <option value="">Choose section</option>
              <option v-for="section in availableSections" :key="section.id" :value="section.id">
                {{ section.name }}
              </option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
            <select v-model="selectedSubjectId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :disabled="!selectedSectionId">
              <option value="">Choose subject</option>
              <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" v-model="attendanceDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      <div v-if="students.length > 0" class="bg-white rounded-lg shadow p-4 mb-6">
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
      <div v-if="students.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in students" :key="student.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ student.roll_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium">{{ getInitials(student.name) }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                      <div class="text-xs text-gray-500">Admission: {{ student.admission_number }}</div>
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Add remarks (optional)" :disabled="student.status === 'present'">
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Submit Button -->
        <div class="px-6 py-4 bg-gray-50 border-t">
          <div class="flex flex-wrap justify-between items-center gap-4">
            <div class="text-sm text-gray-600">
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
      <div v-else-if="selectedClassId && !loadingStudents" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No students found</h3>
        <p class="mt-1 text-sm text-gray-500">Select a class, section, and subject to load students.</p>
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

const attendanceStats = computed(() => {
  const stats = { present: 0, absent: 0, late: 0 }
  students.value.forEach(s => {
    if (s.status === 'present') stats.present++
    else if (s.status === 'absent') stats.absent++
    else if (s.status === 'late') stats.late++
  })
  return stats
})

// Fetch classes and sections
const fetchClasses = async () => {
  loading.value = true
  try {
    const response = await teacherApi.getClasses()
    if (response.data.success) {
      classes.value = response.data.data.map((item: any) => ({
        id: item.class.id,
        name: item.class.name,
        sections: item.sections.map((s: any) => ({
          id: s.section.id,
          name: s.section.name,
          subjects: s.subjects || []
        }))
      }))

      if (route.query.class_id) {
        selectedClassId.value = Number(route.query.class_id)
        onClassChange()
      }
    }
  } catch (error) {
    console.error('Error fetching classes:', error)
    toast.error('Failed to load classes')
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

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

const getStatusButtonClass = (current: string, btn: string) => {
  if (current === btn) {
    if (btn === 'present') return 'bg-green-500 text-white'
    if (btn === 'absent') return 'bg-red-500 text-white'
    if (btn === 'late') return 'bg-yellow-500 text-white'
  }
  return 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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

onMounted(() => fetchClasses())
</script>