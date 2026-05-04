<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance Reports</h1>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        
        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
          <select v-model="reportType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="daily">Daily Attendance Report</option>
            <option value="monthly">Monthly Attendance Report</option>
            <option value="student">Student Attendance Report</option>
          </select>
        </div>

        <!-- Date (for daily report) -->
        <div v-if="reportType === 'daily'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input type="date" v-model="dailyDate" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <!-- Month/Year (for monthly report) -->
        <div v-if="reportType === 'monthly'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
          <select v-model="month" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.name }}</option>
          </select>
        </div>

        <div v-if="reportType === 'monthly'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <select v-model="year" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Class Filter -->
        <div v-if="reportType !== 'student'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
          <select v-model="classId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Classes</option>
            <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
              {{ classItem.name }}
            </option>
          </select>
        </div>

        <!-- Student Filter (for student report) -->
        <div v-if="reportType === 'student'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Student</label>
          <select v-model="studentId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Select a student</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.user?.name || student.name }}
            </option>
          </select>
        </div>

        <!-- Attendance Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attendance Type</label>
          <select v-model="attendanceType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="both">Both (Homeroom & Subject)</option>
            <option value="homeroom">Homeroom Attendance Only</option>
            <option value="subject">Subject Attendance Only</option>
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
    <div v-else-if="reportType === 'daily' && dailyReport" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Daily Attendance Report - {{ dailyReport.date }}</h2>
        <span v-if="dailyReport.type === 'homeroom'" class="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm">
          Homeroom Attendance Only
        </span>
        <span v-else-if="dailyReport.type === 'subject'" class="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
          Subject Attendance Only
        </span>
        <span v-else class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
          Both Attendance Types
        </span>
      </div>
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Total Records</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ dailyReport.total_records }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <p class="text-green-500 dark:text-green-400 text-sm">Present</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ dailyReport.by_status?.present || 0 }}</p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
          <p class="text-red-500 dark:text-red-400 text-sm">Absent</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ dailyReport.by_status?.absent || 0 }}</p>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
          <p class="text-yellow-500 dark:text-yellow-400 text-sm">Late</p>
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ dailyReport.by_status?.late || 0 }}</p>
        </div>
      </div>

      <!-- Attendance Type Breakdown -->
      <div v-if="dailyReport.by_type" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <p class="text-purple-500 dark:text-purple-400 text-sm">Homeroom Attendance</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ dailyReport.by_type.homeroom || 0 }}</p>
        </div>
        <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
          <p class="text-indigo-500 dark:text-indigo-400 text-sm">Subject Attendance</p>
          <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ dailyReport.by_type.subject || 0 }}</p>
        </div>
      </div>

      <!-- Records Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Student</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Class</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subject</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Attendance Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="record in dailyReport.records" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ record.student?.user?.name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ record.classRoom?.name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ record.subject?.name || 'N/A' }}</td>
              <td class="px-4 py-3">
                <span :class="record.type === 'homeroom' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'" class="px-2 py-1 text-xs rounded-full">
                  {{ record.type === 'homeroom' ? 'Homeroom' : 'Subject' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status?.toUpperCase() }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ record.remarks || '-' }}</td>
            </tr>
            <tr v-if="!dailyReport.records?.length">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No attendance records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Monthly Report Results -->
    <div v-else-if="reportType === 'monthly' && monthlyReport" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Monthly Attendance Report - {{ getMonthName(month) }} {{ year }}</h2>
          <span v-if="monthlyReport.type === 'homeroom'" class="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm">
            Homeroom Attendance Only
          </span>
          <span v-else-if="monthlyReport.type === 'subject'" class="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
            Subject Attendance Only
          </span>
          <span v-else class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
            Both Attendance Types
          </span>
        </div>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm">Total Records</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ monthlyReport.total_records }}</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <p class="text-green-500 dark:text-green-400 text-sm">Present</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ monthlyReport.overall?.present || 0 }}</p>
          </div>
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
            <p class="text-red-500 dark:text-red-400 text-sm">Absent</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ monthlyReport.overall?.absent || 0 }}</p>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
            <p class="text-yellow-500 dark:text-yellow-400 text-sm">Late</p>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ monthlyReport.overall?.late || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Daily Breakdown Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Daily Breakdown</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Present</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Absent</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Late</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="day in monthlyReport.daily_breakdown" :key="day.date" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ day.date }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ day.total }}</td>
                <td class="px-4 py-3 text-sm text-green-600 dark:text-green-400">{{ day.present }}</td>
                <td class="px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ day.absent }}</td>
                <td class="px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">{{ day.late }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student Report Results -->
    <div v-else-if="reportType === 'student' && studentReport" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance Report</h2>
        <span v-if="studentReport.filter_type === 'homeroom'" class="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm">
          Homeroom Attendance Only
        </span>
        <span v-else-if="studentReport.filter_type === 'subject'" class="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
          Subject Attendance Only
        </span>
        <span v-else class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
          Both Attendance Types
        </span>
      </div>
      
      <div class="mb-6 text-gray-700 dark:text-gray-300">
        <p><strong>Student:</strong> {{ studentReport.student?.user?.name }}</p>
        <p><strong>Class:</strong> {{ studentReport.student?.currentClass?.name }}</p>
        <p><strong>Section:</strong> {{ studentReport.student?.currentSection?.name }}</p>
        <p><strong>Roll Number:</strong> {{ studentReport.student?.roll_number }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Total Days</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ studentReport.statistics?.total_days }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <p class="text-green-500 dark:text-green-400 text-sm">Present</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ studentReport.statistics?.present }}</p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
          <p class="text-red-500 dark:text-red-400 text-sm">Absent</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ studentReport.statistics?.absent }}</p>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
          <p class="text-yellow-500 dark:text-yellow-400 text-sm">Late</p>
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ studentReport.statistics?.late }}</p>
        </div>
      </div>

      <div class="mb-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p class="text-center">
            <span class="text-lg font-semibold">Overall Attendance: </span>
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ studentReport.statistics?.attendance_percentage }}%</span>
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Attendance Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subject</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="record in studentReport.recent_attendances" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ record.date }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(record.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status?.toUpperCase() }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="record.type === 'homeroom' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'" class="px-2 py-1 text-xs rounded-full">
                  {{ record.type === 'homeroom' ? 'Homeroom' : 'Subject' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ record.subject?.name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ record.remarks || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Subject-wise Breakdown -->
      <div v-if="studentReport.subject_wise && studentReport.subject_wise.length" class="mt-6">
        <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Subject-wise Breakdown</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subject</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Classes</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Present</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Absent</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Late</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Percentage</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="subject in studentReport.subject_wise" :key="subject.subject" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ subject.subject }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ subject.total_classes }}</td>
                <td class="px-4 py-3 text-sm text-green-600 dark:text-green-400">{{ subject.present }}</td>
                <td class="px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ subject.absent }}</td>
                <td class="px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">{{ subject.late }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-1 mr-2">
                      <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-green-500 rounded-full h-2" :style="{ width: subject.percentage + '%' }"></div>
                      </div>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ subject.percentage }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- No Data -->
    <div v-else-if="loaded && !dailyReport && !monthlyReport && !studentReport" class="text-center text-gray-500 dark:text-gray-400 py-12">
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
const attendanceType = ref('both');
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
    present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getMonthName = (monthValue: number) => {
  const monthObj = months.find(m => m.value === monthValue);
  return monthObj ? monthObj.name : '';
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
        params: { 
          date: dailyDate.value, 
          class_room_id: classId.value || undefined,
          type: attendanceType.value === 'both' ? undefined : attendanceType.value
        }
      });
      dailyReport.value = response.data.data;
      monthlyReport.value = null;
      studentReport.value = null;
    } 
    else if (reportType.value === 'monthly') {
      response = await api.get('/admin/reports/attendance/monthly', {
        params: { 
          month: month.value, 
          year: year.value, 
          class_room_id: classId.value || undefined,
          type: attendanceType.value === 'both' ? undefined : attendanceType.value
        }
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
      response = await api.get(`/admin/reports/attendance/student/${studentId.value}`, {
        params: {
          type: attendanceType.value === 'both' ? undefined : attendanceType.value
        }
      });
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