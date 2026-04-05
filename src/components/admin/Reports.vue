<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select v-model="reportType" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="attendance-daily">Daily Attendance</option>
            <option value="attendance-monthly">Monthly Attendance</option>
          </select>
        </div>

        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input type="date" v-model="fromDate" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>

        <!-- To Date: only for daily reports -->
        <div v-if="reportType === 'attendance-daily'">
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input type="date" v-model="toDate" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
      </div>

      <!-- Button -->
      <div class="flex justify-end">
        <button 
          @click="generateReport"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Report
        </button>
      </div>
    </div>

    <!-- Report Table -->
    <div v-if="reportData.length" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Report Results</h2>

      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border">#</th>
            <th v-for="(key, index) in tableHeaders" :key="index" class="px-4 py-2 border">
              {{ key }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in reportData" :key="index">
            <td class="px-4 py-2 border">{{ index + 1 }}</td>
            <td v-for="(key, i) in tableHeaders" :key="i" class="px-4 py-2 border">
              {{ item[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Data -->
    <div v-else-if="loaded" class="text-center text-gray-500">
      No report data found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import api from '@/services/api'; // your Axios instance
import { useToast } from 'vue-toastification';

const toast = useToast();

const reportType = ref('attendance-daily');
const fromDate = ref('');
const toDate = ref('');
const reportData = ref<any[]>([]);
const loaded = ref(false);

// Compute table headers dynamically
const tableHeaders = computed(() => {
  if (!reportData.value.length) return [];
  return Object.keys(reportData.value[0]);
});

const generateReport = async () => {
  if (!fromDate.value || (reportType.value === 'attendance-daily' && !toDate.value)) {
    toast.error('Please select required dates');
    return;
  }

  let endpoint = '';
  let params: any = {};

  if (reportType.value === 'attendance-daily') {
    endpoint = '/admin/reports/attendance/daily';
    params.from_date = fromDate.value;
    params.to_date = toDate.value;
  } else if (reportType.value === 'attendance-monthly') {
    endpoint = '/admin/reports/attendance/monthly';
    const date = new Date(fromDate.value);
    params.month = date.getMonth() + 1; // JS months 0-indexed
    params.year = date.getFullYear();
  } else {
    toast.error('Unsupported report type');
    return;
  }

  try {
    const response = await api.get(endpoint, { params });

    const data = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.data || [];

    reportData.value = [...data];
    loaded.value = true;

    if (reportData.value.length) {
      toast.success('Report generated successfully');
    } else {
      toast.warning('No data found for selected range');
    }
  } catch (error: any) {
    console.error('ERROR:', error.response?.data || error);
    toast.error(error.response?.data?.message || 'Failed to generate report');
  }
};
</script>