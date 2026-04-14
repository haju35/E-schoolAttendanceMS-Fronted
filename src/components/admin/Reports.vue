<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Attendance Reports</h1>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select v-model="reportType" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="daily">Daily Attendance Report</option>
            <option value="monthly">Monthly Attendance Report</option>
            <option value="student">Student Attendance Report</option>
          </select>
        </div>

        <!-- Date (for daily report) -->
        <div v-if="reportType === 'daily'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" v-model="dailyDate" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>

        <!-- Month/Year (for monthly report) -->
        <div v-if="reportType === 'monthly'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select v-model="month" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.name }}</option>
          </select>
        </div>

        <div v-if="reportType === 'monthly'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select v-model="year" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Class Filter -->
        <div v-if="reportType !== 'student'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select v-model="classId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">All Classes</option>
            <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
              {{ classItem.name }}
            </option>
          </select>
        </div>

        <!-- Student Filter (for student report) -->
        <div v-if="reportType === 'student'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
          <select v-model="studentId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Select a student</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.user?.name || student.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Button -->
      <div class="flex justify-end">
        <button 
          @click="generateReport"
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Generating...' : 'Generate Report' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Daily Report Results -->
    <div v-else-if="reportType === 'daily' && dailyReport" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Daily Attendance Report - {{ dailyReport.date }}</h2>
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <p class="text-gray-500 text-sm">Total Records</p>
          <p class="text-2xl font-bold text-gray-800">{{ dailyReport.total_records }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <p class="text-green-500 text-sm">Present</p>
          <p class="text-2xl font-bold text-green-600">{{ dailyReport.by_status?.present || 0 }}</p>
        </div>
        <div class="bg-red-50 rounded-lg p-4 text-center">
          <p class="text-red-500 text-sm">Absent</p>
          <p class="text-2xl font-bold text-red-600">{{ dailyReport.by_status?.absent || 0 }}</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 text-center">
          <p class="text-yellow-500 text-sm">Late</p>
          <p class="text-2xl font-bold text-yellow-600">{{ dailyReport.by_status?.late || 0 }}</p>
        </div>
      </div>

      <!-- Records Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in dailyReport.records" :key="record.id">
              <td class="px-4 py-3 text-sm text-gray-900">{{ record.student?.user?.name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ record.classRoom?.name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ record.subject?.name || 'N/A' }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status?.toUpperCase() }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ record.check_in_time || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ record.remarks || '-' }}</td>
            </tr>
            <tr v-if="!dailyReport.records?.length">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">No attendance records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Monthly Report Results -->
    <div v-else-if="reportType === 'monthly' && monthlyReport" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Total Records</p>
          <p class="text-2xl font-bold text-gray-800">{{ monthlyReport.total_records }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Present</p>
          <p class="text-2xl font-bold text-green-600">{{ monthlyReport.overall?.present || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Absent</p>
          <p class="text-2xl font-bold text-red-600">{{ monthlyReport.overall?.absent || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Late</p>
          <p class="text-2xl font-bold text-yellow-600">{{ monthlyReport.overall?.late || 0 }}</p>
        </div>
      </div>

      <!-- Daily Breakdown Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">Daily Breakdown</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="day in monthlyReport.daily_breakdown" :key="day.date">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ day.date }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ day.total }}</td>
                  <td class="px-4 py-3 text-sm text-green-600">{{ day.present }}</td>
                  <td class="px-4 py-3 text-sm text-red-600">{{ day.absent }}</td>
                  <td class="px-4 py-3 text-sm text-yellow-600">{{ day.late }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Student Report Results -->
      <div v-else-if="reportType === 'student' && studentReport" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Student Attendance Report</h2>
        
        <div class="mb-6">
          <p><strong>Student:</strong> {{ studentReport.student?.user?.name }}</p>
          <p><strong>Class:</strong> {{ studentReport.student?.currentClass?.name }}</p>
          <p><strong>Roll Number:</strong> {{ studentReport.student?.roll_number }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <p class="text-gray-500 text-sm">Total Days</p>
            <p class="text-2xl font-bold">{{ studentReport.statistics?.total_days }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-green-500 text-sm">Present</p>
            <p class="text-2xl font-bold text-green-600">{{ studentReport.statistics?.present }}</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 text-center">
            <p class="text-red-500 text-sm">Absent</p>
            <p class="text-2xl font-bold text-red-600">{{ studentReport.statistics?.absent }}</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 text-center">
            <p class="text-yellow-500 text-sm">Late</p>
            <p class="text-2xl font-bold text-yellow-600">{{ studentReport.statistics?.late }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="record in studentReport.recent_attendances" :key="record.id">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ record.date }}</td>
                  <td class="px-4 py-3">
                    <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                      {{ record.status?.toUpperCase() }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ record.subject?.name || 'N/A' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ record.remarks || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- No Data -->
        <div v-else-if="loaded && !dailyReport && !monthlyReport && !studentReport" class="text-center text-gray-500 py-12">
          No report data found
        </div>
      </div>
    </template>

    <script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import api from '@/services/api';
    import { useToast } from 'vue-toastification';

    const toast = useToast();
    const loading = ref(false);
    const loaded = ref(false);

    const reportType = ref('daily');
    const dailyDate = ref(new Date().toISOString().split('T')[0]);
    const month = ref(new Date().getMonth() + 1);
    const year = ref(new Date().getFullYear());
    const classId = ref('');
    const studentId = ref('');

    const dailyReport = ref<any>(null);
    const monthlyReport = ref<any>(null);
    const studentReport = ref<any>(null);
    const classes = ref<any[]>([]);
    const students = ref<any[]>([]);

    const months = [
      { value: 1, name: 'January' }, { value: 2, name: 'February' },
      { value: 3, name: 'March' }, { value: 4, name: 'April' },
      { value: 5, name: 'May' }, { value: 6, name: 'June' },
      { value: 7, name: 'July' }, { value: 8, name: 'August' },
      { value: 9, name: 'September' }, { value: 10, name: 'October' },
      { value: 11, name: 'November' }, { value: 12, name: 'December' }
    ];

    const years = ref<number[]>([]);

    const getStatusClass = (status: string) => {
      const classes: Record<string, string> = {
        present: 'bg-green-100 text-green-800',
        absent: 'bg-red-100 text-red-800',
        late: 'bg-yellow-100 text-yellow-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const generateYears = () => {
      const currentYear = new Date().getFullYear();
      for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        years.value.push(i);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await api.get('/admin/classes?limit=all');
        if (response.data.success) {
          classes.value = response.data.data.data || response.data.data || [];
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await api.get('/admin/students?limit=all');
        if (response.data.success) {
          students.value = response.data.data.data || response.data.data || [];
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const generateReport = async () => {
      loading.value = true;
      loaded.value = false;
      
      try {
        let response;
        
        if (reportType.value === 'daily') {
          response = await api.get('/admin/reports/attendance/daily', {
            params: { date: dailyDate.value, class_room_id: classId.value || undefined }
          });
          dailyReport.value = response.data.data;
          monthlyReport.value = null;
          studentReport.value = null;
        } 
        else if (reportType.value === 'monthly') {
          response = await api.get('/admin/reports/attendance/monthly', {
            params: { month: month.value, year: year.value, class_room_id: classId.value || undefined }
          });
          monthlyReport.value = response.data.data;
          dailyReport.value = null;
          studentReport.value = null;
        }
        else if (reportType.value === 'student') {
          if (!studentId.value) {
            toast.error('Please select a student');
            return;
          }
          response = await api.get(`/admin/reports/attendance/student/${studentId.value}`);
          studentReport.value = response.data.data;
          dailyReport.value = null;
          monthlyReport.value = null;
        }
        
        loaded.value = true;
        toast.success('Report generated successfully');
        
      } catch (error: any) {
        console.error('Error generating report:', error);
        toast.error(error.response?.data?.message || 'Failed to generate report');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      generateYears();
      fetchClasses();
      fetchStudents();
    });
    </script>