<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Students</h2>

      <button
        @click="showModal = true"
        class="mt-3 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        + Add Student
      </button>
    </div>

    <!-- Import Section -->
    <div class="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <h3 class="font-semibold mb-2 text-gray-800 dark:text-white">Bulk Import Students</h3>
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex-1">
          <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">Upload Excel/CSV File</label>
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept=".xlsx,.csv,.xls"
            class="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
    </div>

    <!-- Search and Delete Section -->
    <div class="mb-4 flex flex-col md:flex-row gap-3">
      <input
        v-model="search"
        @input="fetchStudents"
        type="text"
        placeholder="Search student..."
        class="flex-1 md:w-1/3 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
      />
      <button
        @click="deleteSelected"
        :disabled="selectedStudents.length === 0"
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
      >
        Delete Selected ({{ selectedStudents.length }})
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="p-3 w-12">
                <input 
                  type="checkbox" 
                  @change="toggleAll" 
                  :checked="isAllSelected"
                  class="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">#</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Name</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Email</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Admission No</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Class</th>
              <th class="p-3 text-left text-gray-600 dark:text-gray-300">Section</th>
              <th class="p-3 text-right text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(student, index) in students.data"
              :key="student.id"
              class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="p-3">
                <input 
                  type="checkbox" 
                  :value="student.id"
                  v-model="selectedStudents"
                  class="rounded border-gray-300 dark:border-gray-600"
                />
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="p-3 text-gray-800 dark:text-white">{{ student.user?.name }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">{{ student.user?.email }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">{{ student.admission_number }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">{{ student.currentClass?.name }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">{{ student.currentSection?.name }}</td>
              <td class="p-3 text-right space-x-2 whitespace-nowrap">
                <button
                  @click="editStudent(student)"
                  class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition" title="edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="deleteStudent(student.id)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition" title="delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>

            <tr v-if="!students.data || students.data.length === 0">
              <td colspan="8" class="text-center p-4 text-gray-500 dark:text-gray-400">
                No students found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="students.meta && students.meta.last_page > 1"
        class="mt-4 flex justify-center items-center space-x-2 p-4 border-t dark:border-gray-700"
      >
        <button
          class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 transition"
          :disabled="students.meta.current_page === 1"
          @click="fetchStudents(students.meta.current_page - 1)"
        >
          Previous
        </button>

        <span class="px-3 py-1 text-gray-700 dark:text-gray-300">
          Page {{ students.meta.current_page }} of {{ students.meta.last_page }}
        </span>

        <button
          class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 transition"
          :disabled="students.meta.current_page === students.meta.last_page"
          @click="fetchStudents(students.meta.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Student Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
      >
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {{ editingStudent ? 'Edit Student' : 'Add Student' }}
        </h3>

        <form @submit.prevent="saveStudent" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Email *</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Address</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Admission Number *</label>
              <input
                v-model="form.admission_number"
                type="text"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Roll Number</label>
              <input
                v-model="form.roll_number"
                type="text"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
              <input
                v-model="form.date_of_birth"
                type="date"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <select
                v-model="form.gender"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Class *</label>
              <select
                v-model="form.current_class_id"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Class</option>
                <option v-for="c in classes" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Section *</label>
              <select
                v-model="form.current_section_id"
                :disabled="!form.current_class_id"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                required
              >
                <option value="">Select Section</option>
                <option v-for="s in sections" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Admission Date</label>
              <input
                v-model="form.admission_date"
                type="date"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {{ editingStudent ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { watch } from 'vue';

// State variables
const file = ref(null);
const students = ref({ data: [], meta: null, links: {} });
const classes = ref([]);
const sections = ref([]);
const search = ref("");
const showModal = ref(false);
const importing = ref(false);
const importResult = ref(null);
const selectedStudents = ref([]);
const editingStudent = ref(null);
import { useToast } from 'vue-toastification';

const toast = useToast();

// Computed property for "select all" state
const isAllSelected = computed(() => {
  return students.value.data.length > 0 && 
         selectedStudents.value.length === students.value.data.length;
});

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

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

// Reset form
const resetForm = () => {
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
  editingStudent.value = null;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

// Toggle select all
const toggleAll = (event) => {
  if (event.target.checked) {
    selectedStudents.value = students.value.data.map(s => s.id);
  } else {
    selectedStudents.value = [];
  }
};

// File handling
const handleFileUpload = (event) => {
  file.value = event.target.files[0];
  importResult.value = null;
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
    toast.error('Failed to download template. Please try again.');
  }
};

// Import students
const importStudents = async () => {
  if (!file.value) {
    toast.error('Please select a file');
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
      importResult.value = {
        total: response.data.data?.total || 0,
        success: response.data.data?.success || 0,
        failed: response.data.data?.failed || 0,
        errors: response.data.data?.errors || []
      };
      
      toast.success(response.data.message);
      
      // Reset file input
      file.value = null;
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      await fetchStudents();
    } else {
      toast.error('Import failed: ' + response.data.message);
    }
  } catch (err) {
    console.error('Import error:', err);
    const errorMessage = err.response?.data?.message || 'Failed to import students';
    toast.error(errorMessage);
    
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
    
    let studentsData = [];
    let meta = null;
    let links = {};
    
    if (res.data.data?.data) {
      studentsData = res.data.data.data;
      meta = res.data.data.meta;
      links = res.data.data.links;
    } else if (Array.isArray(res.data.data)) {
      studentsData = res.data.data;
    } else {
      studentsData = [];
    }
    
    students.value = {
      data: studentsData.map((s) => ({
        ...s,
        currentClass: s.current_class,
        currentSection: s.current_section,
      })),
      meta: meta,
      links: links,
    };
    
    // Clear selected students when changing pages or searching
    selectedStudents.value = [];
  } catch (err) {
    console.error('Error fetching students:', err);
    students.value = { data: [], meta: null, links: {} };
  }
};

// Fetch classes
const fetchClasses = async () => {
  try {
    const res = await api.get('/admin/classes');
    classes.value = res.data.data?.data || res.data.data || [];
  } catch (err) {
    console.error('Error fetching classes:', err);
    classes.value = [];
  }
};

// Fetch sections
const fetchSections = async (classId = null) => {
  try {
    let url = '/admin/sections';

    if(classId){
      url += `?class_room_id=${classId}`;
    }
    const res = await api.get(url);
    sections.value = res.data.data || [];
  } catch (err) {
    console.error('Error fetching sections:', err);
    sections.value = [];
  }
  
};

watch(() => form.value.current_class_id, (newClassId) => {
  if (newClassId) {
    fetchSections(newClassId);        
    form.value.current_section_id = "";
  } else {
    sections.value = [];
    form.value.current_section_id = "";
  }
});

// Create or update student
const saveStudent = async () => {
  try {
    let response;
    if (editingStudent.value) {
      // Update existing student
      response = await api.put(`/admin/students/${editingStudent.value.id}`, form.value);
      toast.success(response.data.message || "Student updated successfully");
    } else {
      // Create new student
      response = await api.post('/admin/students', form.value);
      toast.success(response.data.message || "Student created successfully. Credentials sent to email.");
    }
    
    closeModal();
    await fetchStudents();
  } catch (err) {
    console.error('Error saving student:', err.response?.data || err);
    const errorMessage = err.response?.data?.message || "Error saving student";
    toast.error(errorMessage);
  }
};

// Delete single student
const deleteStudent = async (id) => {
  if (!confirm("Delete this student? This action cannot be undone.")) return;
  
  try {
    await api.delete(`/admin/students/${id}`);
    toast.success("Student deleted successfully");
    
    // Remove from selectedStudents if present
    selectedStudents.value = selectedStudents.value.filter(selectedId => selectedId !== id);
    
    await fetchStudents();
  } catch (err) {
    console.error('Error deleting student:', err);
    const errorMessage = err.response?.data?.message || "Failed to delete student";
    toast.error(errorMessage);
  }
};

// Bulk delete students
const deleteSelected = async () => {
  if (selectedStudents.value.length === 0) {
    toast.info("No students selected");
    return;
  }

  if (!confirm(`Delete ${selectedStudents.value.length} student(s)?`)) {
    return;
  }

  try {
    const idsParam = selectedStudents.value.join(',');
    const response = await api.post('/admin/students/bulk-delete', {
      ids: selectedStudents.value
    });
    
    if (response.data.success || response.status === 200) {
      toast.success(response.data.message || `${selectedStudents.value.length} student(s) deleted successfully`);
      
      // Clear selection
      selectedStudents.value = [];
      
      // Refresh the list
      await fetchStudents();
    } else {
      toast.error('Failed to delete students: ' + (response.data.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Bulk delete error:', err);
    
    // More detailed error handling
    if (err.response) {
      const errorMsg = err.response.data?.message || err.response.data?.error || 'Server error';
      toast.error(`Failed to delete students: ${errorMsg}`);
      
      // Log the full error for debugging
      console.error('Error details:', err.response.data);
    } else if (err.request) {
      toast.error('No response from server. Please check your connection.');
    } else {
      toast.error(`Error: ${err.message}`);
    }
  }
};

// Edit student
const editStudent = (student) => {
  editingStudent.value = student;
  form.value = {
    name: student.user?.name || "",
    email: student.user?.email || "",
    phone: student.phone || "",
    address: student.address || "",
    admission_number: student.admission_number || "",
    roll_number: student.roll_number || "",
    date_of_birth: student.date_of_birth || "",
    gender: student.gender || "female",
    current_class_id: student.current_class?.id || "",
    current_section_id: student.current_section?.id || "",
    admission_date: student.admission_date || "",
  };
  showModal.value = true;
};

// Lifecycle hooks
onMounted(() => {
  fetchStudents();
  fetchClasses();

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

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}
</style>