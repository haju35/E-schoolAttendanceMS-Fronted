<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Attendance Reports</h1>
      <p class="text-gray-600 dark:text-gray-400">View attendance reports for your homeroom class</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- No Class Assigned -->
    <div v-else-if="!classInfo" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-yellow-400 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">No Homeroom Class Assigned</h3>
      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">You are not assigned as a homeroom teacher for any class.</p>
    </div>

    <div v-else>
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
            <select v-model="reportType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Summary</option>
              <option value="student">Student-wise Report</option>
            </select>
          </div>

          <div v-if="reportType === 'daily'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
            <input type="date" v-model="selectedDate" :max="today" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div v-if="reportType === 'monthly'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Month</label>
            <input type="month" v-model="selectedMonth" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div v-if="reportType === 'student'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student</label>
            <select v-model="selectedStudentId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
              <option value="">Choose a student</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} (Roll: {{ student.roll_number }})
              </option>
            </select>
          </div>

          <div class="flex items-end gap-2">
            <button @click="generateReport" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition" :disabled="loadingReport">
              {{ loadingReport ? 'Generating...' : 'Generate Report' }}
            </button>
            <button 
              v-if="reportData && reportData.length > 0"
              @click="exportToPDF" 
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Daily Report Results -->
      <div v-if="reportType === 'daily' && reportData && reportData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Attendance Report - {{ formatDate(selectedDate) }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Class: {{ classInfo?.class_name }} | Section: {{ classInfo?.section_name }}</p>
        </div>
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
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ record.roll_number || '-' }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{{ record.name }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(record.status)">
                    {{ getStatusText(record.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ record.remarks || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-700">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Summary:</span>
            <span class="text-green-600 dark:text-green-400"> Present: {{ summaryStats.present }}</span> |
            <span class="text-red-600 dark:text-red-400"> Absent: {{ summaryStats.absent }}</span> |
            <span class="text-yellow-600 dark:text-yellow-400"> Late: {{ summaryStats.late }}</span>
          </div>
        </div>
      </div>

      <!-- Monthly Report Results -->
      <div v-if="reportType === 'monthly' && reportData && reportData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Attendance Summary - {{ selectedMonth }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Present</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Absent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Late</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Days</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="summary in reportData" :key="summary.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{{ summary.name }}</td>
                <td class="px-6 py-4 text-sm text-green-600 dark:text-green-400">{{ summary.present }}</td>
                <td class="px-6 py-4 text-sm text-red-600 dark:text-red-400">{{ summary.absent }}</td>
                <td class="px-6 py-4 text-sm text-yellow-600 dark:text-yellow-400">{{ summary.late }}</td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ summary.total_days }}</td>
                <td class="px-6 py-4">
                  <span :class="getAttendanceColor(summary.percentage)">{{ summary.percentage }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Student Report Results -->
      <div v-if="reportType === 'student' && reportData && reportData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance Report</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedStudent?.name }} (Roll No: {{ selectedStudent?.roll_number }})</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ formatDate(record.date) }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(record.status)">
                    {{ getStatusText(record.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ record.remarks || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="hasSearched && (!reportData || reportData.length === 0)" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No report data found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try selecting different filters or date range.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const loading = ref(true)
const loadingReport = ref(false)
const reportType = ref('daily')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const selectedStudentId = ref<number | null>(null)
const students = ref<any[]>([])
const classInfo = ref<any>(null)
const reportData = ref<any>(null)
const hasSearched = ref(false)
const today = new Date().toISOString().split('T')[0]

const selectedStudent = computed(() => {
  return students.value.find(s => s.id === selectedStudentId.value)
})

const summaryStats = computed(() => {
  if (!reportData.value) return { present: 0, absent: 0, late: 0 }
  
  let present = 0, absent = 0, late = 0
  reportData.value.forEach((record: any) => {
    if (record.status === 'present') present++
    else if (record.status === 'absent') absent++
    else if (record.status === 'late') late++
  })
  return { present, absent, late }
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const formatDateForFile = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getStatusText = (status: string) => {
  switch(status) {
    case 'present': return 'PRESENT'
    case 'absent': return 'ABSENT'
    case 'late': return 'LATE'
    default: return 'NOT MARKED'
  }
}

const getStatusClass = (status: string) => {
  switch(status) {
    case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const fetchInitialData = async () => {
  loading.value = true
  try {
    const response = await api.get('/teacher/class-teacher/dashboard')
    console.log('Dashboard response:', response.data)
    
    if (response.data.success && response.data.data.is_class_teacher) {
      classInfo.value = response.data.data.class_teacher_info
      
      if (classInfo.value.students && classInfo.value.students.length > 0) {
        students.value = classInfo.value.students.map((s: any) => ({
          id: s.id,
          name: s.user?.name || s.name || 'Unknown',
          roll_number: s.roll_number
        }))
      }
    } else {
      classInfo.value = null
    }
  } catch (error: any) {
    console.error('Failed to fetch initial data:', error)
    toast.error(error.response?.data?.message || 'Failed to load data')
  } finally {
    loading.value = false
  }
}

const generateReport = async () => {
  if (reportType.value === 'student' && !selectedStudentId.value) {
    toast.error('Please select a student')
    return
  }
  
  loadingReport.value = true
  hasSearched.value = true
  
  try {
    let response
    
    if (reportType.value === 'daily') {
      response = await api.get('/teacher/class-attendance/students', {
        params: {
          class_room_id: classInfo.value.class_id,
          section_id: classInfo.value.section_id,
          date: selectedDate.value
        }
      })
      reportData.value = response.data.data?.students || []
    } 
    else if (reportType.value === 'monthly') {
      const [year, month] = selectedMonth.value.split('-')
      const monthInt = parseInt(month, 10)
      
      response = await api.get('/teacher/attendance/monthly-summary', {
        params: { 
          class_id: classInfo.value.class_id,
          section_id: classInfo.value.section_id,
          year: parseInt(year, 10),
          month: monthInt
        }
      })
      reportData.value = response.data.data || []
    }
    else if (reportType.value === 'student' && selectedStudentId.value) {
      response = await api.get(`/teacher/students/${selectedStudentId.value}/attendance`)
      reportData.value = response.data.data?.attendance_records || response.data.data?.attendances || []
    }
    
    if (reportData.value?.length === 0) {
      toast.info('No attendance records found')
    } else {
      toast.success(`Found ${reportData.value.length} records`)
    }
  } catch (error: any) {
    console.error('Failed to generate report:', error)
    
    if (error.response?.status === 404) {
      toast.error('API endpoint not found. Please contact administrator.')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Failed to generate report')
    }
    reportData.value = []
  } finally {
    loadingReport.value = false
  }
}

// PDF Export Function
const exportToPDF = () => {
  if (!reportData.value || reportData.value.length === 0) {
    toast.error('No data to export. Please generate report first.')
    return
  }

  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const currentDate = new Date()
    
    doc.setFontSize(18)
    doc.setTextColor(79, 70, 229)
    doc.text('E-School Attendance System', 14, 15)
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Attendance Report', 14, 30)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    
    let yPosition = 40
    
    if (reportType.value === 'daily') {
      doc.text(`Class: ${classInfo.value?.class_name || 'N/A'}`, 14, yPosition)
      doc.text(`Section: ${classInfo.value?.section_name || 'N/A'}`, 80, yPosition)
      doc.text(`Report Type: DAILY`, 140, yPosition)
      doc.text(`Date: ${formatDate(selectedDate.value)}`, 200, yPosition)
      
      yPosition += 7
      doc.text(`Generated: ${formatDate(currentDate)}`, 14, yPosition)
      
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('Summary', 14, yPosition)
      
      yPosition += 7
      doc.setFontSize(10)
      doc.text(`Total Students: ${reportData.value.length}`, 14, yPosition)
      doc.text(`Present: ${summaryStats.value.present}`, 80, yPosition)
      doc.text(`Absent: ${summaryStats.value.absent}`, 140, yPosition)
      doc.text(`Late: ${summaryStats.value.late}`, 200, yPosition)
      
      yPosition += 10
      
      const tableData = reportData.value.map(record => [
        record.roll_number || '-',
        record.name,
        getStatusText(record.status),
        record.remarks || '-'
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Roll No', 'Student Name', 'Status', 'Remarks']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { cellWidth: 25, halign: 'center' }, 1: { cellWidth: 50, halign: 'left' }, 2: { cellWidth: 30, halign: 'center' }, 3: { cellWidth: 40, halign: 'left' } },
        margin: { left: 14, right: 14 }
      })
    }
    else if (reportType.value === 'monthly') {
      doc.text(`Class: ${classInfo.value?.class_name || 'N/A'}`, 14, yPosition)
      doc.text(`Section: ${classInfo.value?.section_name || 'N/A'}`, 80, yPosition)
      doc.text(`Report Type: MONTHLY`, 140, yPosition)
      doc.text(`Month: ${selectedMonth.value}`, 200, yPosition)
      
      yPosition += 7
      doc.text(`Generated: ${formatDate(currentDate)}`, 14, yPosition)
      
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('Monthly Summary', 14, yPosition)
      
      yPosition += 7
      doc.setFontSize(10)
      doc.text(`Total Students: ${reportData.value.length}`, 14, yPosition)
      
      yPosition += 10
      
      const tableData = reportData.value.map(summary => [
        summary.name,
        summary.present,
        summary.absent,
        summary.late,
        summary.total_days,
        `${summary.percentage}%`
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Student Name', 'Present', 'Absent', 'Late', 'Total Days', 'Attendance %']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { cellWidth: 50, halign: 'left' }, 1: { cellWidth: 25, halign: 'center' }, 2: { cellWidth: 25, halign: 'center' }, 3: { cellWidth: 25, halign: 'center' }, 4: { cellWidth: 25, halign: 'center' }, 5: { cellWidth: 30, halign: 'center' } },
        margin: { left: 14, right: 14 }
      })
    }
    else if (reportType.value === 'student') {
      doc.text(`Student: ${selectedStudent.value?.name || 'N/A'}`, 14, yPosition)
      doc.text(`Roll No: ${selectedStudent.value?.roll_number || 'N/A'}`, 80, yPosition)
      doc.text(`Class: ${classInfo.value?.class_name || 'N/A'}`, 140, yPosition)
      doc.text(`Section: ${classInfo.value?.section_name || 'N/A'}`, 200, yPosition)
      
      yPosition += 7
      doc.text(`Generated: ${formatDate(currentDate)}`, 14, yPosition)
      
      yPosition += 10
      
      const tableData = reportData.value.map(record => [
        formatDate(record.date),
        getStatusText(record.status),
        record.remarks || '-'
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Date', 'Status', 'Remarks']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { cellWidth: 40, halign: 'center' }, 1: { cellWidth: 35, halign: 'center' }, 2: { cellWidth: 70, halign: 'left' } },
        margin: { left: 14, right: 14 }
      })
    }
    
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }
    
    const fileName = `Attendance_Report_${reportType.value}_${formatDateForFile(currentDate)}.pdf`
    doc.save(fileName)
    
    toast.success('PDF downloaded successfully!')
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Failed to generate PDF. Please try again.')
  }
}

onMounted(() => {
  fetchInitialData()
})
</script>