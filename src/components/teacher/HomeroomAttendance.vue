<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Daily Attendance Management</h1>
      <p class="text-gray-600 dark:text-gray-400">Record daily attendance for your homeroom class</p>
    </div>

    <!-- No Assignments Warning -->
    <div v-if="!loading && hasNoAssignments" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-center flex-col text-center">
        <svg class="w-16 h-16 text-yellow-600 dark:text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">No Classes Assigned</h3>
        <p class="text-yellow-700 dark:text-yellow-400 mb-4">
          You have not been assigned as a homeroom teacher for any class yet.
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

    <!-- Main Content -->
    <div v-else>
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
            <p v-if="selectedClassIdForClass && availableClassSections.length === 0" class="text-xs text-red-500 mt-1">
              No sections assigned to you for this class
            </p>
          </div>

          <!-- Date Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input 
              type="date" 
              v-model="classAttendanceDate" 
              :max="today"
              @change="onDateChange"
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
      <div v-if="hasExistingAttendance && !isEditingClassAttendance && classStudents.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
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
      <div v-if="classStudents.length > 0 && (!hasExistingAttendance || isEditingClassAttendance)" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
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
                      :disabled="submittingClass || (hasExistingAttendance && !isEditingClassAttendance)">
                      Present
                    </button>
                    <button @click="updateClassStatus(student.id, 'absent')"
                      class="px-3 py-1 rounded text-sm font-medium transition"
                      :class="getClassStatusButtonClass(student.status, 'absent')"
                      :disabled="submittingClass || (hasExistingAttendance && !isEditingClassAttendance)">
                      Absent
                    </button>
                    <button @click="updateClassStatus(student.id, 'late')"
                      class="px-3 py-1 rounded text-sm font-medium transition"
                      :class="getClassStatusButtonClass(student.status, 'late')"
                      :disabled="submittingClass || (hasExistingAttendance && !isEditingClassAttendance)">
                      Late
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <input 
                    v-model="student.remarks" 
                    type="text"
                    :disabled="submittingClass || student.status === 'present' || (hasExistingAttendance && !isEditingClassAttendance)"
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
              :disabled="submittingClass || (hasExistingAttendance && !isEditingClassAttendance)"
            >
              {{ submittingClass ? 'Submitting...' : (hasExistingAttendance && !isEditingClassAttendance ? 'Already Submitted' : 'Submit Attendance') }}
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
import { useRouter } from 'vue-router'  // ← IMPORT ROUTER
import api from '../../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()  // ← INITIALIZE ROUTER

// State
const loading = ref(true)
const submittingClass = ref(false)
const classAttendanceDate = ref(new Date().toISOString().split('T')[0])
const today = new Date().toISOString().split('T')[0]
const classStudents = ref<any[]>([])
const isEditingClassAttendance = ref(false)
const selectedClassIdForClass = ref<number | null>(null)
const selectedSectionIdForClass = ref<number | null>(null)
const classTeacherClasses = ref<any[]>([])
const availableClassSections = ref<any[]>([])
const loadingClassStudents = ref(false)
const hasExistingAttendance = ref(false)

// Computed
const hasNoAssignments = computed(() => {
  return classTeacherClasses.value.length === 0
})

const classAttendanceStats = computed(() => {
  const stats = { present: 0, absent: 0, late: 0 }
  classStudents.value.forEach(s => {
    if (s.status === 'present') stats.present++
    else if (s.status === 'absent') stats.absent++
    else if (s.status === 'late') stats.late++
  })
  return stats
})

const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'

const getClassStatusButtonClass = (current: string, btn: string) => {
  if (current === btn) {
    if (btn === 'present') return 'bg-green-500 text-white'
    if (btn === 'absent') return 'bg-red-500 text-white'
    if (btn === 'late') return 'bg-yellow-500 text-white'
  }
  return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
}

const fetchClassTeacherClasses = async () => {
  try {
    const response = await api.get('/teacher/class-teacher/classes')
    console.log('Raw API Response:', response.data)
    
    if (response.data.success) {
      if (response.data.data && response.data.data.length > 0) {
        classTeacherClasses.value = response.data.data
          .map((classItem: any) => {
            const assignedSections = (classItem.sections || []).filter((section: any) => {
              return section.student_count !== undefined && section.student_count > 0
            })
            
            if (assignedSections.length > 0) {
              return {
                id: classItem.id,
                name: classItem.name,
                sections: assignedSections
              }
            }
            return null
          })
          .filter((classItem: any) => classItem !== null)
        
        console.log('Filtered classes:', classTeacherClasses.value)
        
        if (classTeacherClasses.value.length === 0) {
          toast.warning('No class sections assigned to you')
        }
      } else {
        classTeacherClasses.value = []
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch class teacher classes:', error)
    classTeacherClasses.value = []
  } finally {
    loading.value = false
  }
}

const onClassChangeForClass = () => {
  const selectedClass = classTeacherClasses.value.find(c => c.id === selectedClassIdForClass.value)
  availableClassSections.value = selectedClass ? selectedClass.sections : []
  selectedSectionIdForClass.value = null
  classStudents.value = []
  hasExistingAttendance.value = false
  isEditingClassAttendance.value = false
}

const onSectionChangeForClass = () => {
  classStudents.value = []
  hasExistingAttendance.value = false
  isEditingClassAttendance.value = false
}

const onDateChange = () => {
  classStudents.value = []
  hasExistingAttendance.value = false
  isEditingClassAttendance.value = false
}

const loadClassStudents = async () => {
  if (classTeacherClasses.value.length === 0) {
    toast.error('You have no homeroom classes assigned. Please contact administrator.')
    return
  }
  
  if (!selectedClassIdForClass.value || !selectedSectionIdForClass.value) {
    toast.error('Please select class and section')
    return
  }
  
  loadingClassStudents.value = true
  try {
    const response = await api.get('/teacher/class-attendance/students', {
      params: {
        class_room_id: selectedClassIdForClass.value,
        section_id: selectedSectionIdForClass.value,
        date: classAttendanceDate.value
      }
    })
    
    console.log('Attendance API Response:', response.data)
    
    if (response.data.success) {
      const studentsData = response.data.data.students || []
      const existingAttendanceData = response.data.data.existing_attendance || []
      
      const validAttendanceRecords = existingAttendanceData.filter((record: any) => {
        return record.status && record.status !== 'pending' && record.status !== ''
      })
      
      hasExistingAttendance.value = validAttendanceRecords.length > 0
      
      console.log('Valid attendance records:', validAttendanceRecords.length)
      console.log('Has existing attendance:', hasExistingAttendance.value)
      
      if (studentsData.length > 0) {
        classStudents.value = studentsData.map((s: any) => {
          const existingRecord = validAttendanceRecords.find((a: any) => a.student_id === s.id)
          
          return {
            id: s.id,
            roll_number: s.roll_number || '-',
            admission_number: s.admission_number || '',
            name: s.name || s.user?.name || 'Unknown',
            status: existingRecord ? existingRecord.status : 'present',
            remarks: existingRecord ? (existingRecord.remarks || '') : ''
          }
        })
        
        toast.success(`Loaded ${classStudents.value.length} students`)
      } else {
        classStudents.value = []
        toast.info('No students found in this class/section')
      }
    } else {
      toast.error(response.data.message || 'Failed to load students')
    }
  } catch (error: any) {
    console.error('Failed to load students:', error)
    toast.error(error.response?.data?.message || 'Failed to load students')
  } finally {
    loadingClassStudents.value = false
  }
}

const markAllClass = (status: string) => {
  if (hasExistingAttendance.value && !isEditingClassAttendance.value) {
    toast.error('Cannot modify attendance. Please click Edit Attendance first.')
    return
  }
  
  classStudents.value.forEach(s => {
    s.status = status
    if (status === 'present') s.remarks = ''
  })
}

const updateClassStatus = (studentId: number, status: string) => {
  if (hasExistingAttendance.value && !isEditingClassAttendance.value) {
    toast.error('Cannot modify attendance. Please click Edit Attendance first.')
    return
  }
  
  const student = classStudents.value.find(s => s.id === studentId)
  if (student) {
    student.status = status
    if (status === 'present') student.remarks = ''
  }
}

const enableEditClassAttendance = () => {
  isEditingClassAttendance.value = true
  toast.info('Edit mode enabled. You can now modify attendance.')
}

const submitClassAttendance = async () => {
  if (classStudents.value.length === 0) {
    toast.error('No students to submit')
    return
  }
  
  if (!selectedClassIdForClass.value || !selectedSectionIdForClass.value) {
    toast.error('Please select class and section')
    return
  }
  
  submittingClass.value = true
  try {
    const attendanceArray = classStudents.value.map(student => ({
      student_id: student.id,
      status: student.status,
      remarks: student.remarks || ''
    }))
    
    const payload = {
      date: classAttendanceDate.value,
      class_room_id: selectedClassIdForClass.value,
      section_id: selectedSectionIdForClass.value,
      attendance: attendanceArray
    }
    
    console.log('Submitting payload:', JSON.stringify(payload, null, 2))
    
    const response = await api.post('/teacher/attendance/class', payload)
    
    if (response.data.success) {
      toast.success(`Successfully saved attendance for ${attendanceArray.length} students!`)
      hasExistingAttendance.value = true
      isEditingClassAttendance.value = false
      
      await loadClassStudents()
      
      const viewHistory = confirm('Attendance saved! Do you want to view the attendance history?')
      if (viewHistory) {
        router.push('/homeroom/view-attendance')
      }
    } else {
      toast.error(response.data.message || 'Failed to submit attendance')
    }
  } catch (error: any) {
    console.error('Submit error:', error)
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join('\n')
      toast.error(errorMessages)
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Failed to submit class attendance')
    }
  } finally {
    submittingClass.value = false
  }
}

onMounted(() => {
  fetchClassTeacherClasses()
})
</script>