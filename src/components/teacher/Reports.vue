<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Attendance Reports</h1>
      <p class="text-gray-600">Generate and download attendance reports</p>
    </div>

    <!-- Report Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Class Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select v-model.number="filters.class_room_id" class="input-field">
            <option value="">Select Class</option>
            <option v-for="item in classes" :key="item.class.id" :value="item.class.id">
              {{ item.class.name }}
            </option>
          </select>
        </div>

        <!-- Section Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
          <select v-model.number="filters.section_id" class="input-field" :disabled="!filters.class_room_id">
            <option value="">Select Section</option>
            <option 
              v-for="sectionItem in classes.find(c => c.class.id === filters.class_room_id)?.sections || []" 
              :key="sectionItem.section.id" 
              :value="sectionItem.section.id"
            >
              {{ sectionItem.section.name }}
            </option>
          </select>
        </div>

        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select v-model="filters.report_type" class="input-field">
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input type="date" v-model="filters.start_date" class="input-field">
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input type="date" v-model="filters.end_date" class="input-field">
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex space-x-3">
        <button @click="generateReport" class="btn-primary" :disabled="loading">
          {{ loading ? 'Generating...' : 'Generate Report' }}
        </button>
        <button @click="exportToPDF" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" :disabled="!reportData">
          Download PDF
        </button>
        <button @click="printReport" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition" :disabled="!reportData">
          Print
        </button>
      </div>
    </div>

    <!-- Report Summary -->
    <div v-if="reportSummary" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Total Students</p>
        <p class="text-2xl font-bold">{{ reportSummary.total_students }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Average Attendance</p>
        <p class="text-2xl font-bold text-green-600">{{ reportSummary.avg_attendance.toFixed(2) }}%</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-500">Perfect Attendance</p>
        <p class="text-2xl font-bold text-blue-600">{{ reportSummary.perfect_attendance_count }}</p>
      </div>
    </div>

    <!-- Report Table -->
    <div v-if="reportData" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200" id="report-table">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in reportData" :key="student.student_id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ student.roll_number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">{{ student.present }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{{ student.absent }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{{ student.late }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-1 mr-2">
                    <div class="bg-gray-200 rounded-full h-2">
                      <div class="bg-green-500 rounded-full h-2" :style="{ width: student.percentage + '%' }"></div>
                    </div>
                  </div>
                  <span class="text-sm">{{ student.percentage }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import teacherApi from '../../services/teacherApi'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useToast } from 'vue-toastification'

const toast = useToast()
const loading = ref(false)
const classes = ref([])
const reportData = ref(null)
const reportSummary = ref(null)

const filters = ref({
  class_room_id: null,
  section_id: null,
  report_type: 'daily',
  start_date: '',
  end_date: ''
})

const fetchClasses = async () => {
  try {
    const response = await teacherApi.getClasses()
    classes.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching classes:', error)
  }
}

const generateReport = async () => {
  if (!filters.value.class_room_id || !filters.value.section_id) {
    toast.error('Please select class and section')
    return
  }

  loading.value = true
  try {
    const payload = {
      class_room_id: filters.value.class_room_id,
      section_id: filters.value.section_id,
      from_date: filters.value.start_date,
      to_date: filters.value.end_date
    }

    const response = await teacherApi.getAttendanceReport(payload)

    reportData.value = response.data.data.student_wise
    const students = reportData.value
    reportSummary.value = {
      total_students: students.length,
      avg_attendance: students.reduce((acc, s) => acc + s.percentage, 0) / (students.length || 1),
      most_absent_name: students.sort((a, b) => b.absent - a.absent)[0]?.name || '-',
      perfect_attendance_count: students.filter(s => s.percentage === 100).length
    }
    toast.success('Report generated successfully!')
  } catch (error) {
    console.error('Error generating report:', error.response?.data || error)
    toast.error('Failed to generate report. Make sure your dates and filters are correct')
  } finally {
    loading.value = false
  }
}

// PDF Export Function
const exportToPDF = () => {
  if (!reportData.value || reportData.value.length === 0) {
    toast.error('No data to export. Please generate report first.')
    return
  }

  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const currentDate = new Date()
    
    // Add Header
    doc.setFontSize(18)
    doc.setTextColor(79, 70, 229)
    doc.text('E-School Attendance System', 14, 15)
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Attendance Report', 14, 30)
    
    // Add Report Details
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    
    let yPosition = 40
    
    doc.text(`Class: ${getSelectedClass()}`, 14, yPosition)
    doc.text(`Section: ${getSelectedSection()}`, 80, yPosition)
    doc.text(`Report Type: ${filters.value.report_type.toUpperCase()}`, 140, yPosition)
    doc.text(`Generated: ${formatDate(currentDate)}`, 200, yPosition)
    
    yPosition += 7
    doc.text(`Period: ${formatDate(filters.value.start_date)} to ${formatDate(filters.value.end_date)}`, 14, yPosition)
    
    yPosition += 10
    
    // Add Summary
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Summary', 14, yPosition)
    
    yPosition += 7
    doc.setFontSize(10)
    doc.text(`Total Students: ${reportSummary.value.total_students}`, 14, yPosition)
    doc.text(`Average Attendance: ${reportSummary.value.avg_attendance.toFixed(2)}%`, 80, yPosition)
    doc.text(`Perfect Attendance: ${reportSummary.value.perfect_attendance_count} students`, 150, yPosition)
    
    yPosition += 10
    
    // Prepare table data
    const tableData = reportData.value.map(student => [
      student.name,
      student.roll_number,
      student.present,
      student.absent,
      student.late,
      `${student.percentage}%`
    ])

    // Add table using autoTable
    autoTable(doc, {
      startY: yPosition,
      head: [['Student Name', 'Roll No', 'Present', 'Absent', 'Late', 'Attendance %']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 45, halign: 'left' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 25, halign: 'center' }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        )
      }
    })

    // Add signature (if space available)
    const finalY = doc.lastAutoTable.finalY + 10
    if (finalY < doc.internal.pageSize.getHeight() - 20) {
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text('_________________________', 40, finalY)
      doc.text('_________________________', 140, finalY)
      doc.text('Teacher\'s Signature', 45, finalY + 5)
      doc.text('Principal\'s Signature', 145, finalY + 5)
    }
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('This is a system generated report.', 14, doc.internal.pageSize.getHeight() - 20)

    // Save PDF
    const fileName = `Attendance_Report_${getSelectedClass()}_${getSelectedSection()}_${formatDateForFile(currentDate)}.pdf`
    doc.save(fileName)
    
    toast.success('PDF downloaded successfully!')
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Failed to generate PDF. Please try again.')
  }
}

// Print Report
const printReport = () => {
  if (!reportData.value || reportData.value.length === 0) {
    toast.error('No data to print. Please generate report first.')
    return
  }

  const printWindow = window.open('', '_blank')
  
  const tableHtml = document.getElementById('report-table').outerHTML
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Attendance Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h1 {
          color: #4f46e5;
          text-align: center;
        }
        h2 {
          text-align: center;
        }
        .report-header {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #f5f5f5;
        }
        .summary {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #e8f4e8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #4f46e5;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <h1>E-School Attendance System</h1>
      <h2>Attendance Report</h2>
      
      <div class="report-header">
        <p><strong>Class:</strong> ${getSelectedClass()}</p>
        <p><strong>Section:</strong> ${getSelectedSection()}</p>
        <p><strong>Report Type:</strong> ${filters.value.report_type.toUpperCase()}</p>
        <p><strong>Period:</strong> ${formatDate(filters.value.start_date)} to ${formatDate(filters.value.end_date)}</p>
        <p><strong>Generated on:</strong> ${formatDate(new Date())}</p>
      </div>
      
      <div class="summary">
        <h3>Summary</h3>
        <p><strong>Total Students:</strong> ${reportSummary.value.total_students}</p>
        <p><strong>Average Attendance:</strong> ${reportSummary.value.avg_attendance.toFixed(2)}%</p>
        <p><strong>Perfect Attendance:</strong> ${reportSummary.value.perfect_attendance_count} students</p>
      </div>
      
      ${tableHtml}
      
      <div class="footer">
        <p>*** This is a system generated report ***</p>
        <p>_________________________</p>
        <p>Teacher's Signature</p>
      </div>
    </body>
    </html>
  `
  
  printWindow.document.write(printContent)
  printWindow.document.close()
  
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}

// Helper Functions
const getSelectedClass = () => {
  const classItem = classes.value.find(c => c.class.id === filters.value.class_room_id)
  return classItem ? classItem.class.name : 'N/A'
}

const getSelectedSection = () => {
  const classItem = classes.value.find(c => c.class.id === filters.value.class_room_id)
  if (classItem && filters.value.section_id) {
    const section = classItem.sections.find(s => s.section.id === filters.value.section_id)
    return section ? section.section.name : 'N/A'
  }
  return 'N/A'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDateForFile = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(() => {
  fetchClasses()

  const today = new Date()
  filters.value.end_date = today.toISOString().split('T')[0]

  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)
  filters.value.start_date = weekAgo.toISOString().split('T')[0]
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.input-field:focus {
  outline: none;
  ring: 2px solid #4f46e5;
  border-color: #4f46e5;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>