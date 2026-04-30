<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="ml-3 text-gray-600">Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-red-800">Error Loading Dashboard</h3>
      <p class="mt-1 text-sm text-red-600">{{ error }}</p>
      <button @click="fetchDashboardData" class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">
        Try Again
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Total Students</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_students || 0 }}</p>
              <p class="text-xs text-green-600">Active: {{ stats.active_students || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Total Teachers</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_teachers || 0 }}</p>
              <p class="text-xs text-green-600">Active: {{ stats.active_teachers || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Total Families</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_families || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="p-2 md:p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 md:ml-4">
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-300">Today's Attendance</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ attendancePercentage }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-300">{{ stats.present_today || 0 }} / {{ stats.total_students || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Attendance Trend Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Attendance Trend (Last 7 Days)</h3>
            <button @click="refreshChart" class="text-indigo-600 hover:text-indigo-800 text-sm">
              Refresh
            </button>
          </div>
          <div class="h-64">
            <canvas ref="attendanceChartCanvas"></canvas>
          </div>
        </div>

<!-- Student Distribution Chart with Dropdowns -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Student Distribution</h3>
          
          <!-- Dropdown Filters -->
          <div class="flex gap-3">
            <select 
              v-model="distributionType" 
              @change="onDistributionTypeChange"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="class">By Class</option>
              <option value="section">By Section</option>
              <option value="gender">By Gender</option>
            </select>
            
            <select 
              v-model="classFilter"
              @change="fetchStudentDistribution"
              v-if="distributionType === 'section'"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              <option v-for="classItem in availableClasses" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="h-64">
          <canvas ref="studentDistributionCanvas"></canvas>
        </div>
      </div>

      <!-- Monthly Attendance Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Attendance Overview</h3>
        <div class="h-80">
          <canvas ref="monthlyAttendanceCanvas"></canvas>
        </div>
      </div>

      <!-- Quick Actions & Attendance Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <button @click="$router.push('/admin/students')" class="bg-blue-50 text-blue-600 p-3 md:p-4 rounded-lg hover:bg-blue-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="text-xs md:text-sm">Manage Students</span>
            </button>
            
            <button @click="$router.push('/admin/teachers')" class="bg-green-50 text-green-600 p-3 md:p-4 rounded-lg hover:bg-green-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-xs md:text-sm">Manage Teachers</span>
            </button>
            
            <button @click="$router.push('/admin/classes')" class="bg-purple-50 text-purple-600 p-3 md:p-4 rounded-lg hover:bg-purple-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-xs md:text-sm">Manage Classes</span>
            </button>
            
            <button @click="$router.push('/admin/subjects')" class="bg-yellow-50 text-yellow-600 p-3 md:p-4 rounded-lg hover:bg-yellow-100 transition text-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-xs md:text-sm">Manage Subjects</span>
            </button>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Attendance Summary</h3>
          <div v-if="stats.total_students > 0" class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Present</span>
                <span class="font-medium">{{ stats.present_today || 0 }} students</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: presentPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Absent</span>
                <span class="font-medium">{{ stats.absent_today || 0 }} students</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full transition-all" :style="{ width: absentPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Late</span>
                <span class="font-medium">{{ stats.late_today || 0 }} students</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full transition-all" :style="{ width: latePercentage + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-300">
            No attendance data available
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import Chart from 'chart.js/auto';

const toast = useToast();
const loading = ref(true);
const error = ref('');

// Chart references
const attendanceChartCanvas = ref<HTMLCanvasElement | null>(null);
const studentDistributionCanvas = ref<HTMLCanvasElement | null>(null);
const monthlyAttendanceCanvas = ref<HTMLCanvasElement | null>(null);

// Chart instances
let attendanceChart: Chart | null = null;
let studentDistributionChart: Chart | null = null;
let monthlyAttendanceChart: Chart | null = null;

// Distribution filters
const distributionType = ref('class');
const classFilter = ref('');
const availableClasses = ref<Array<{id: number, name: string}>>([]);

// Dashboard stats
const stats = ref({
  total_students: 0,
  active_students: 0,
  total_teachers: 0,
  active_teachers: 0,
  total_families: 0,
  attendance_percentage: 0,
  present_today: 0,
  absent_today: 0,
  late_today: 0
});

// Chart data
const attendanceData = ref<number[]>([]);
const classData = ref<{ labels: string[]; counts: number[] }>({
  labels: [],
  counts: []
});
const monthlyData = ref<{ labels: string[]; present: number[]; absent: number[]; late: number[] }>({
  labels: [],
  present: [],
  absent: [],
  late: []
});

// Computed percentages
const attendancePercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return Math.round((stats.value.present_today / stats.value.total_students) * 100);
});

const presentPercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return (stats.value.present_today / stats.value.total_students) * 100;
});

const absentPercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return (stats.value.absent_today / stats.value.total_students) * 100;
});

const latePercentage = computed(() => {
  if (stats.value.total_students === 0) return 0;
  return (stats.value.late_today / stats.value.total_students) * 100;
});

// Helper functions for chart labels
const getDistributionLabel = () => {
  const labels: Record<string, string> = {
    class: 'by Class',
    section: 'by Section',
    gender: 'by Gender',
    grade: 'by Grade Level',
    house: 'by House'
  };
  return labels[distributionType.value] || 'Distribution';
};

const getXAxisLabel = () => {
  const labels: Record<string, string> = {
    class: 'Classes',
    section: 'Sections',
    gender: 'Gender',
    grade: 'Grade Levels',
    house: 'Houses'
  };
  return labels[distributionType.value] || 'Categories';
};

const generateColors = (count: number) => {
  const baseColors = [
    'rgba(99, 102, 241, 0.7)',
    'rgba(34, 197, 94, 0.7)',
    'rgba(234, 179, 8, 0.7)',
    'rgba(239, 68, 68, 0.7)',
    'rgba(168, 85, 247, 0.7)',
    'rgba(236, 72, 153, 0.7)',
    'rgba(6, 182, 212, 0.7)',
    'rgba(245, 158, 11, 0.7)',
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

// Fetch available classes for filter dropdown
const fetchAvailableClasses = async () => {
  try {
    const response = await api.get('/admin/classes/list');
    if (response.data && response.data.success) {
      availableClasses.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching classes:', err);
  }
};

// Fetch student distribution based on selected type and filter
const fetchStudentDistribution = async () => {
  if (!studentDistributionCanvas.value) return;
  
  try {
    let endpoint = '/admin/analytics/student-distribution';
    let params: any = { type: distributionType.value };
    
    if (distributionType.value === 'section' && classFilter.value) {
      params.class_id = classFilter.value;
    }
    
    const response = await api.get(endpoint, { params });
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      classData.value = {
        labels: data.map((item: any) => item.label),
        counts: data.map((item: any) => item.count)
      };
      initStudentDistributionChart();
    }
  } catch (err) {
    console.error('Error fetching distribution:', err);
    toast.error('Failed to load distribution data');
  }
};

// Handle distribution type change
const onDistributionTypeChange = () => {
  // Reset class filter when switching from section
  if (distributionType.value !== 'section') {
    classFilter.value = '';
  }
  fetchStudentDistribution();
};

// Initialize Attendance Trend Chart
const initAttendanceTrendChart = () => {
  if (!attendanceChartCanvas.value || attendanceData.value.length === 0) return;
  
  const ctx = attendanceChartCanvas.value.getContext('2d');
  if (!ctx) return;
  
  if (attendanceChart) attendanceChart.destroy();
  
  attendanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      datasets: [{
        label: 'Present Students',
        data: attendanceData.value,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw} students`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Students', font: { size: 12 } },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          title: { display: true, text: 'Day', font: { size: 12 } },
          grid: { display: false }
        }
      }
    }
  });
};

// Initialize Student Distribution Chart (UPDATED to handle different chart types)
const initStudentDistributionChart = () => {
  if (!studentDistributionCanvas.value) return;
  
  const ctx = studentDistributionCanvas.value.getContext('2d');
  if (!ctx) return;
  
  if (studentDistributionChart) studentDistributionChart.destroy();
  
  const hasData = classData.value.labels.length > 0 && classData.value.counts.length > 0;
  
  if (!hasData) {
    // Show empty chart or message
    studentDistributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['No Data'],
        datasets: [{
          label: 'Number of Students',
          data: [0],
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: { enabled: false }
        }
      }
    });
    return;
  }
  
  // Choose chart type based on number of items
  const chartType = classData.value.labels.length > 6 ? 'bar' : 'pie';
  
  if (chartType === 'pie') {
    studentDistributionChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: classData.value.labels,
        datasets: [{
          label: `Student Distribution ${getDistributionLabel()}`,
          data: classData.value.counts,
          backgroundColor: generateColors(classData.value.labels.length),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.raw;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} students (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } else {
    studentDistributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: classData.value.labels,
        datasets: [{
          label: `Student Distribution ${getDistributionLabel()}`,
          data: classData.value.counts,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const value = context.raw;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.dataset.label}: ${value} students (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Students', font: { size: 12 } },
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 }
          },
          x: {
            title: { display: true, text: getXAxisLabel(), font: { size: 12 } },
            grid: { display: false }
          }
        }
      }
    });
  }
};

// Initialize Monthly Attendance Chart
const initMonthlyAttendanceChart = () => {
  if (!monthlyAttendanceCanvas.value || monthlyData.value.labels.length === 0) return;
  
  const ctx = monthlyAttendanceCanvas.value.getContext('2d');
  if (!ctx) return;
  
  if (monthlyAttendanceChart) monthlyAttendanceChart.destroy();
  
  monthlyAttendanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthlyData.value.labels,
      datasets: [
        {
          label: 'Present',
          data: monthlyData.value.present,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Absent',
          data: monthlyData.value.absent,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Late',
          data: monthlyData.value.late,
          backgroundColor: 'rgba(234, 179, 8, 0.7)',
          borderColor: 'rgb(234, 179, 8)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw} students`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Students', font: { size: 12 } },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          title: { display: true, text: 'Month', font: { size: 12 } },
          grid: { display: false }
        }
      }
    }
  });
};

// Refresh all charts
const refreshChart = () => {
  initAttendanceTrendChart();
  initStudentDistributionChart();
  initMonthlyAttendanceChart();
};

// Initialize all charts after DOM is ready
const initCharts = async () => {
  await nextTick();
  setTimeout(() => {
    initAttendanceTrendChart();
    initStudentDistributionChart();
    initMonthlyAttendanceChart();
  }, 100);
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('Fetching dashboard data...');
    const response = await api.get('/admin/dashboard');
    console.log('Dashboard response:', response.data);
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      
      // Update stats
      stats.value = {
        total_students: data.total_students || 0,
        active_students: data.active_students || 0,
        total_teachers: data.total_teachers || 0,
        active_teachers: data.active_teachers || 0,
        total_families: data.total_families || 0,
        attendance_percentage: data.attendance_percentage || 0,
        present_today: data.present_today || 0,
        absent_today: data.absent_today || 0,
        late_today: data.late_today || 0
      };
      
      // Update chart data from API
      if (data.attendance_trend && data.attendance_trend.length > 0) {
        attendanceData.value = data.attendance_trend;
      }
      
      // Only set initial class distribution if we're on class view
      if (distributionType.value === 'class' && data.class_distribution && data.class_distribution.length > 0) {
        classData.value = {
          labels: data.class_distribution.map((c: any) => c.class_name),
          counts: data.class_distribution.map((c: any) => c.count)
        };
      }
      
      if (data.monthly_attendance && data.monthly_attendance.length > 0) {
        monthlyData.value = {
          labels: data.monthly_attendance.map((m: any) => m.month),
          present: data.monthly_attendance.map((m: any) => m.present),
          absent: data.monthly_attendance.map((m: any) => m.absent),
          late: data.monthly_attendance.map((m: any) => m.late)
        };
      }
      
      // Re-initialize charts with real data
      await initCharts();
      loading.value = false;
    } else {
      throw new Error(response.data?.message || 'Failed to load dashboard data');
    }
  } catch (err: any) {
    console.error('Error loading dashboard:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load dashboard data';
    toast.error(error.value);
    loading.value = false;
  }
};

// Cleanup charts on component unmount
onBeforeUnmount(() => {
  if (attendanceChart) attendanceChart.destroy();
  if (studentDistributionChart) studentDistributionChart.destroy();
  if (monthlyAttendanceChart) monthlyAttendanceChart.destroy();
});

// Watch for distribution type changes
watch(distributionType, () => {
  fetchStudentDistribution();
});

onMounted(() => {
  fetchDashboardData();
  fetchAvailableClasses(); 
});
</script>