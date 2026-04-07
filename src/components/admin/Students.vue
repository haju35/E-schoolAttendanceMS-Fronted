<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Students</h2>

      <button
        @click="showModal = true"
        class="mt-3 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        + Add Student
      </button>
    </div>

    <!-- Import Section -->
    <div class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 class="font-semibold mb-2">Bulk Import Students</h3>
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex-1">
          <label class="block text-sm mb-1">Upload Excel/CSV File</label>
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept=".xlsx,.csv,.xls"
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="flex gap-2 items-end">
          <button 
            @click="downloadTemplate" 
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Download Template
          </button>
          <button 
            @click="importStudents" 
            :disabled="importing || !file"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {{ importing ? 'Importing...' : 'Import Students' }}
          </button>
        </div>
      </div>
      
      <!-- Import Results -->
      <div v-if="importResult" class="mt-3 p-3 rounded" 
           :class="importResult.failed > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'">
        <p class="font-semibold">Import Results:</p>
        <p><strong>Total:</strong> {{ importResult.total || 0 }}</p>
        <p><strong>Success:</strong> {{ importResult.success || 0 }}</p>
        <p><strong>Failed:</strong> {{ importResult.failed || 0 }}</p>
        
        <!-- Show errors if any -->
        <div v-if="importResult.errors && importResult.errors.length > 0" class="mt-2">
          <details>
            <summary class="cursor-pointer text-red-600 font-semibold">
              View Errors ({{ importResult.errors.length }})
            </summary>
            <div class="mt-2 max-h-60 overflow-y-auto text-sm bg-white p-2 rounded border">
              <div v-for="(error, idx) in importResult.errors" :key="idx" class="text-red-600 mb-2 pb-2 border-b">
                <strong>Row {{ error.row }}:</strong>
                <div v-if="error.errors">
                  {{ Array.isArray(error.errors) ? error.errors.join(', ') : error.errors }}
                </div>
                <div v-else-if="error.error">
                  {{ error.error }}
                </div>
                <div v-else>
                  {{ JSON.stringify(error) }}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        @input="fetchStudents"
        type="text"
        placeholder="Search student..."
        class="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">#</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Email</th>
            <th class="p-3 text-left">Admission No</th>
            <th class="p-3 text-left">Class</th>
            <th class="p-3 text-left">Section</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(student, index) in students.data"
            :key="student.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ student.user?.name }}</td>
            <td class="p-3">{{ student.user?.email }}</td>
            <td class="p-3">{{ student.admission_number }}</td>
            <td class="p-3">{{ student.currentClass?.name }}</td>
            <td class="p-3">{{ student.currentSection?.name }}</td>
            <td class="p-3 text-right space-x-2">
              <button
                @click="editStudent(student)"
                class="text-yellow-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="deleteStudent(student.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!students.data || students.data.length === 0">
            <td colspan="7" class="text-center p-4 text-gray-500">
              No students found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        class="mt-4 flex justify-center items-center space-x-2 p-4"
        v-if="students.meta"
      >
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="!students.links?.prev"
          @click="fetchStudents(students.meta.current_page - 1)"
        >
          Prev
        </button>

        <span class="px-3 py-1">
          {{ students.meta.current_page }} / {{ students.meta.last_page }}
        </span>

        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="!students.links?.next"
          @click="fetchStudents(students.meta.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
      >
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Add Student</h3>

        <form @submit.prevent="createStudent" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1">Name *</label>
              <input
                v-model="form.name"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Email *</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Phone</label>
              <input
                v-model="form.phone"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Address</label>
              <input
                v-model="form.address"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Admission Number *</label>
              <input
                v-model="form.admission_number"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Roll Number</label>
              <input
                v-model="form.roll_number"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Date of Birth</label>
              <input
                v-model="form.date_of_birth"
                type="date"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Gender</label>
              <select
                v-model="form.gender"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1">Class *</label>
              <select
                v-model="form.current_class_id"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select Class</option>
                <option v-for="c in classes" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1">Section *</label>
              <select
                v-model="form.current_section_id"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select Section</option>
                <option v-for="s in sections" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1">Admission Date</label>
              <input
                v-model="form.admission_date"
                type="date"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State variables
const file = ref(null);
const students = ref({ data: [], meta: null, links: {} });
const classes = ref([]);
const sections = ref([]);
const search = ref("");
const showModal = ref(false);
const importing = ref(false);
const importResult = ref(null);

// Get token and setup API
const token = localStorage.getItem("access_token");
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  admission_number: "",
  roll_number: "",
  date_of_birth: "",
  gender: "female",
  current_class_id: "",
  current_section_id: "",
  admission_date: "",
});

// File handling
const handleFileUpload = (event) => {
  file.value = event.target.files[0];
  importResult.value = null; // Clear previous results
};

// Download template
const downloadTemplate = async () => {
  try {
    const response = await api.get('/admin/students/export/template', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_import_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading template:', err);
    alert('Failed to download template. Please try again.');
  }
};

// Import students
const importStudents = async () => {
  if (!file.value) {
    alert('Please select a file');
    return;
  }
  
  importing.value = true;
  const formData = new FormData();
  formData.append('file', file.value);
  
  try {
    const response = await api.post('/admin/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
      // Set import results with correct mapping
      importResult.value = {
        total: response.data.data?.total || 0,
        success: response.data.data?.success || 0,
        failed: response.data.data?.failed || 0,
        errors: response.data.data?.errors || []
      };
      
      // Show success message
      alert(response.data.message);
      
      // Reset file input
      file.value = null;
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Refresh the student table
      await fetchStudents();
    } else {
      alert('Import failed: ' + response.data.message);
    }
  } catch (err) {
    console.error('Import error:', err);
    const errorMessage = err.response?.data?.message || 'Failed to import students';
    alert(errorMessage);
    
    // Show error details if available
    if (err.response?.data?.errors) {
      importResult.value = {
        total: 0,
        success: 0,
        failed: 1,
        errors: [{ row: 0, errors: [err.response.data.errors] }]
      };
    }
  } finally {
    importing.value = false;
  }
};

// Fetch students with search and pagination
const fetchStudents = async (page = 1) => {
  try {
    let url = `/admin/students?page=${page}`;
    if (search.value) {
      url += `&search=${search.value}`;
    }
    
    const res = await api.get(url);
    
    // Handle different response structures
    let studentsData = [];
    let meta = null;
    let links = {};
    
    if (res.data.data.data) {
      // Paginated response
      studentsData = res.data.data.data;
      meta = res.data.data.meta;
      links = res.data.data.links;
    } else if (Array.isArray(res.data.data)) {
      // Non-paginated response
      studentsData = res.data.data;
    } else {
      studentsData = [];
    }
    
    // Map backend snake_case to camelCase for display
    students.value = {
      data: studentsData.map((s) => ({
        ...s,
        currentClass: s.current_class,
        currentSection: s.current_section,
      })),
      meta: meta,
      links: links,
    };
  } catch (err) {
    console.error('Error fetching students:', err);
    students.value = { data: [], meta: null, links: {} };
  }
};

// Fetch classes
const fetchClasses = async () => {
  try {
    const res = await api.get('/admin/classes');
    classes.value = res.data.data.data || res.data.data || [];
  } catch (err) {
    console.error('Error fetching classes:', err);
    classes.value = [];
  }
};

// Fetch sections
const fetchSections = async () => {
  try {
    const res = await api.get('/admin/sections');
    sections.value = res.data.data.data || res.data.data || [];
  } catch (err) {
    console.error('Error fetching sections:', err);
    sections.value = [];
  }
};

// Create single student
const createStudent = async () => {
  try {
    const response = await api.post('/admin/students', form.value);
    alert(response.data.message || "Student created successfully. Credentials sent to email.");
    showModal.value = false;
    
    // Reset form
    form.value = {
      name: "",
      email: "",
      phone: "",
      address: "",
      admission_number: "",
      roll_number: "",
      date_of_birth: "",
      gender: "female",
      current_class_id: "",
      current_section_id: "",
      admission_date: "",
    };
    
    fetchStudents();
  } catch (err) {
    console.error('Error creating student:', err.response?.data || err);
    const errorMessage = err.response?.data?.message || "Error creating student";
    alert(errorMessage);
  }
};

// Delete student
const deleteStudent = async (id) => {
  if (!confirm("Delete this student? This action cannot be undone.")) return;
  
  try {
    await api.delete(`/admin/students/${id}`);
    alert("Student deleted successfully");
    fetchStudents();
  } catch (err) {
    console.error('Error deleting student:', err);
    alert("Failed to delete student");
  }
};

// Edit student (placeholder)
const editStudent = (student) => {
  console.log("Edit student", student);
  alert("Edit functionality coming soon");
};

// Lifecycle hooks
onMounted(() => {
  fetchStudents();
  fetchClasses();
  fetchSections();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>