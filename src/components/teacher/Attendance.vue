<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Attendance Management</h1>
      <p class="text-gray-600 dark:text-gray-400">Record student attendance for your classes</p>
    </div>

    <!-- Tabs for Subject vs Class Attendance -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex space-x-4">
        <!-- Subject Attendance Tab (Existing) -->
        <button 
          @click="activeTab = 'subject'"
          class="py-3 px-4 font-medium transition-all duration-200 relative"
          :class="activeTab === 'subject' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Subject Attendance
          </div>
        </button>
        
        <!-- Class Attendance Tab (New - Only shows if teacher is class teacher) -->
        <!-- Class Attendance Tab (New - Only shows if teacher is class teacher) -->
        <button 
          v-if="isClassTeacher"
          @click="activeTab = 'class'; loadClassTeacherData()"
          class="py-3 px-4 font-medium transition-all duration-200 relative"
          :class="activeTab === 'class' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Class Attendance (Daily)
          </div>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- ==================== SUBJECT ATTENDANCE (EXISTING) ==================== -->
    <div v-if="activeTab === 'subject' && !loading">
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

    <!-- ==================== CLASS ATTENDANCE (NEW) ==================== -->
<div v-if="activeTab === 'class' && isClassTeacher && !loading">
  <!-- Class and Date Selection -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Class Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class *</label>
        <select 
          v-model="selectedClassIdForClass" 
          @change="onClassChangeForClass"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Choose a class</option>
          <option v-for="cls in classTeacherClasses" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>
      </div>

      <!-- Section Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Section *</label>
        <select 
          v-model="selectedSectionIdForClass" 
          @change="onSectionChangeForClass"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          :disabled="!selectedClassIdForClass"
        >
          <option value="">Choose section</option>
          <option v-for="section in availableClassSections" :key="section.id" :value="section.id">
            {{ section.name }} ({{ section.student_count || 0 }} students)
          </option>
        </select>
      </div>

      <!-- Date Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
        <input 
          type="date" 
          v-model="classAttendanceDate" 
          :max="today"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>

    <div class="mt-4">
      <button 
        @click="loadClassStudents" 
        class="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        :disabled="!selectedClassIdForClass || !selectedSectionIdForClass || loadingClassStudents"
      >
        {{ loadingClassStudents ? 'Loading...' : 'Load Students' }}
      </button>
    </div>
  </div>

  <!-- Warning if already marked -->
  <div v-if="classAttendanceMarked && !isEditingClassAttendance && classStudents.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-yellow-800 dark:text-yellow-300">Attendance has already been marked for {{ classAttendanceDate }}</p>
      </div>
      <button @click="enableEditClassAttendance" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Edit Attendance
      </button>
    </div>
  </div>

  <!-- Quick Actions -->
  <div v-if="classStudents.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
    <div class="flex flex-wrap gap-2">
      <button @click="markAllClass('present')" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
        Mark All Present
      </button>
      <button @click="markAllClass('absent')" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Mark All Absent
      </button>
      <button @click="markAllClass('late')" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
        Mark All Late
      </button>
    </div>
  </div>

  <!-- Class Attendance Table -->
  <div v-if="classStudents.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="student in classStudents" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ student.roll_number || '-' }}</td>
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
                <button @click="updateClassStatus(student.id, 'present')"
                  class="px-3 py-1 rounded text-sm font-medium transition"
                  :class="getClassStatusButtonClass(student.status, 'present')"
                  :disabled="submittingClass">
                  Present
                </button>
                <button @click="updateClassStatus(student.id, 'absent')"
                  class="px-3 py-1 rounded text-sm font-medium transition"
                  :class="getClassStatusButtonClass(student.status, 'absent')"
                  :disabled="submittingClass">
                  Absent
                </button>
                <button @click="updateClassStatus(student.id, 'late')"
                  class="px-3 py-1 rounded text-sm font-medium transition"
                  :class="getClassStatusButtonClass(student.status, 'late')"
                  :disabled="submittingClass">
                  Late
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
              <input 
                v-model="student.remarks" 
                type="text"
                :disabled="submittingClass || student.status === 'present'"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Add remarks (optional)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Submit Button for Class Attendance -->
    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Present: {{ classAttendanceStats.present }} | Absent: {{ classAttendanceStats.absent }} | Late: {{ classAttendanceStats.late }}
        </div>
        <button 
          @click="submitClassAttendance" 
          class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          :disabled="submittingClass || (classAttendanceMarked && !isEditingClassAttendance)"
        >
          {{ submittingClass ? 'Submitting...' : (classAttendanceMarked && !isEditingClassAttendance ? 'Already Submitted' : 'Submit Attendance') }}
        </button>
      </div>
    </div>
  </div>

  <!-- No Data Message -->
  <div v-else-if="selectedClassIdForClass && !loadingClassStudents" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a class and section to load students.</p>
  </div>
</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import teacherApi from '../../services/teacherApi'
import api from '../../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

// Tab state
const activeTab = ref('subject') // 'subject' or 'class'
const loading = ref(true)
const isClassTeacher = ref(false)

// Subject Attendance State (Existing)
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

// Class Attendance State (New)
const submittingClass = ref(false)
const classAttendanceDate = ref(new Date().toISOString().split('T')[0])
const classInfo = ref<any>(null)
const classStudents = ref<any[]>([])
const classAttendanceMarked = ref(false)
const isEditingClassAttendance = ref(false)
const selectedClassIdForClass = ref<number | null>(null)
const selectedSectionIdForClass = ref<number | null>(null)
const classTeacherClasses = ref<any[]>([]) // Classes where teacher is class teacher
const availableClassSections = ref<any[]>([])
const loadingClassStudents = ref(false)

// Computed for Subject Attendance
const attendanceStats = computed(() => {
  const stats = { present: 0, absent: 0, late: 0 }
  students.value.forEach(s => {
    if (s.status === 'present') stats.present++
    else if (s.status === 'absent') stats.absent++
    else if (s.status === 'late') stats.late++
  })
  return stats
})

// Computed for Class Attendance
const classAttendanceStats = computed(() => {
  const stats = { present: 0, absent: 0, late: 0 }
  classStudents.value.forEach(s => {
    if (s.status === 'present') stats.present++
    else if (s.status === 'absent') stats.absent++
    else if (s.status === 'late') stats.late++
  })
  return stats
})

// ==================== SUBJECT ATTENDANCE METHODS (EXISTING) ====================

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

const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'

const getStatusButtonClass = (current: string, btn: string) => {
  if (current === btn) {
    if (btn === 'present') return 'bg-green-500 text-white'
    if (btn === 'absent') return 'bg-red-500 text-white'
    if (btn === 'late') return 'bg-yellow-500 text-white'
  }
  return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
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

// ==================== CLASS ATTENDANCE METHODS (NEW) ====================

// ==================== CLASS ATTENDANCE METHODS (NEW) ====================

const checkClassTeacherStatus = async () => {
  try {
    const response = await api.get('/teacher/class-teacher/dashboard')
    console.log('Class Teacher Dashboard Response:', response.data)
    
    if (response.data.success) {
      const data = response.data.data
      isClassTeacher.value = data.is_class_teacher
      
      console.log('Is Class Teacher:', isClassTeacher.value)
      console.log('Class Teacher Info:', data.class_teacher_info)
      
      if (isClassTeacher.value && data.class_teacher_info) {
        classInfo.value = {
          class_name: data.class_teacher_info.class_name,
          section_name: data.class_teacher_info.section_name,
          total_students: data.class_teacher_info.total_students
        }
        
        // Map students from the response
        if (data.class_teacher_info.students && data.class_teacher_info.students.length > 0) {
          classStudents.value = data.class_teacher_info.students.map((s: any) => ({
            id: s.id,
            roll_number: s.roll_number,
            admission_number: s.admission_number,
            user: s.user,
            name: s.user?.name || 'Unknown',
            status: 'present',
            remarks: ''
          }))
        } else {
          classStudents.value = []
        }
        
        console.log('Class Students Loaded:', classStudents.value.length)
        
        // Check if attendance already marked for today
        if (data.class_teacher_info.today_attendance_marked) {
          classAttendanceMarked.value = true
          await loadClassAttendance()
        }
      } else {
        console.warn('No class teacher info found in response')
      }
    } else {
      console.error('API returned success=false:', response.data)
    }
  } catch (error: any) {
    console.error('Failed to check class teacher status:', error)
    console.error('Error details:', error.response?.data)
    toast.error(error.response?.data?.message || 'Failed to load class teacher data')
  }
}

const loadClassAttendance = async () => {
  if (!isClassTeacher.value) return
  
  try {
    const response = await api.get(`/teacher/class-attendance?date=${classAttendanceDate.value}`)
    console.log('Class Attendance Response:', response.data)
    
    if (response.data.success) {
      const attendanceData = response.data.data
      const existingAttendance = attendanceData.attendance || []
      
      // Check if any attendance was marked
      const hasAttendance = existingAttendance.length > 0
      classAttendanceMarked.value = hasAttendance
      
      if (hasAttendance && !isEditingClassAttendance.value) {
        // Update students with existing attendance
        classStudents.value = classStudents.value.map(student => {
          const existing = existingAttendance.find((a: any) => a.student_id === student.id)
          if (existing) {
            return {
              ...student,
              status: existing.status,
              remarks: existing.remarks || ''
            }
          }
          return student
        })
      }
    }
  } catch (error: any) {
    console.error('Failed to load class attendance:', error)
  }
}

const fetchClassTeacherClasses = async () => {
  try {
    const response = await api.get('/teacher/class-teacher/classes')
    if (response.data.success) {
      classTeacherClasses.value = response.data.data
    }
  } catch (error: any) {
    console.error('Failed to fetch class teacher classes:', error)
  }
}

const onClassChangeForClass = () => {
  const selectedClass = classTeacherClasses.value.find(c => c.id === selectedClassIdForClass.value)
  availableClassSections.value = selectedClass ? selectedClass.sections : []
  selectedSectionIdForClass.value = null
  classStudents.value = []
  classAttendanceMarked.value = false
}

const onSectionChangeForClass = () => {
  classStudents.value = []
  classAttendanceMarked.value = false
}

const loadClassStudents = async () => {
  if (!selectedClassIdForClass.value || !selectedSectionIdForClass.value) {
    toast.error('Please select class and section')
    return
  }
  
  loadingClassStudents.value = true
  try {
    const response = await api.get(`/teacher/class-attendance/students`, {
      params: {
        class_id: selectedClassIdForClass.value,
        section_id: selectedSectionIdForClass.value,
        date: classAttendanceDate.value
      }
    })
    
    if (response.data.success) {
      classStudents.value = response.data.data.students.map((s: any) => ({
        id: s.id,
        roll_number: s.roll_number,
        admission_number: s.admission_number,
        name: s.user?.name || s.name,
        status: s.status || 'present',
        remarks: s.remarks || ''
      }))
      
      // Check if attendance already marked
      classAttendanceMarked.value = response.data.data.attendance_marked || false
    }
  } catch (error: any) {
    console.error('Failed to load students:', error)
    toast.error(error.response?.data?.message || 'Failed to load students')
  } finally {
    loadingClassStudents.value = false
  }
}

// Mark all students in class attendance
const markAllClass = (status: string) => {
  classStudents.value.forEach(s => {
    s.status = status
    if (status === 'present') s.remarks = ''
  })
}




const updateClassStatus = (studentId: number, status: string) => {
  const student = classStudents.value.find(s => s.id === studentId)
  if (student) {
    student.status = status
    if (status === 'present') student.remarks = ''
  }
}

const getClassStatusButtonClass = (current: string, btn: string) => {
  if (current === btn) {
    if (btn === 'present') return 'bg-green-500 text-white'
    if (btn === 'absent') return 'bg-red-500 text-white'
    if (btn === 'late') return 'bg-yellow-500 text-white'
  }
  return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
}

const enableEditClassAttendance = () => {
  isEditingClassAttendance.value = true
  classAttendanceMarked.value = false
}

const submitClassAttendance = async () => {
  if (classStudents.value.length === 0) {
    toast.error('No students to submit')
    return
  }
  
  submittingClass.value = true
  try {
    const attendanceData = {
      date: classAttendanceDate.value,
      attendance: classStudents.value.map(s => ({
        student_id: s.id,
        status: s.status,
        remarks: s.remarks
      }))
    }
    
    const response = await api.post('/teacher/attendance/class', attendanceData)
    if (response.data.success) {
      toast.success('Class attendance submitted successfully!')
      classAttendanceMarked.value = true
      isEditingClassAttendance.value = false
      await loadClassAttendance()
    }
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || 'Failed to submit class attendance')
  } finally {
    submittingClass.value = false
  }
}

const loadClassTeacherData = async () => {
  console.log('Loading class teacher data...')
  loading.value = true
  try {
    const response = await api.get('/teacher/class-teacher/dashboard')
    console.log('Manual load response:', response.data)
    
    if (response.data.success) {
      const data = response.data.data
      isClassTeacher.value = data.is_class_teacher
      
      if (isClassTeacher.value && data.class_teacher_info) {
        classInfo.value = {
          class_name: data.class_teacher_info.class_name,
          section_name: data.class_teacher_info.section_name,
          total_students: data.class_teacher_info.total_students
        }
        
        // Check if students exist in the response
        if (data.class_teacher_info.students && data.class_teacher_info.students.length > 0) {
          classStudents.value = data.class_teacher_info.students.map((s: any) => ({
            id: s.id,
            roll_number: s.roll_number || '-',
            admission_number: s.admission_number || '',
            user: s.user,
            name: s.user?.name || 'Unknown',
            status: 'present',
            remarks: ''
          }))
        } else {
          // If no students in class_teacher_info, try to load from class_info
          console.warn('No students found in class_teacher_info, trying alternative method')
          classStudents.value = []
        }
        
        console.log('Class Students after load:', classStudents.value.length)
        
        if (data.class_teacher_info.today_attendance_marked) {
          classAttendanceMarked.value = true
          await loadClassAttendance()
        }
      }
    }
  } catch (error: any) {
    console.error('Failed to load class teacher data:', error)
    toast.error(error.response?.data?.message || 'Failed to load class data')
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  await fetchClasses()
  await checkClassTeacherStatus()

  const testResponse = await api.get('/teacher/class-teacher/dashboard')
  console.log('FULL API RESPONSE:', JSON.stringify(testResponse.data, null, 2))
  
  if (route.query.class_id && isClassTeacher.value) {
    activeTab.value = 'class'
    await loadClassTeacherData()
  }
})
</script>