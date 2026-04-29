<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage student information, enrollments, and records</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Student
      </button>
    </div>

    <!-- Import Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <h3 class="font-semibold mb-3 text-gray-800 dark:text-white">Bulk Import Students</h3>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Excel/CSV File</label>
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept=".xlsx,.csv,.xls"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex gap-3 items-end">
          <button 
            @click="downloadTemplate" 
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Template
          </button>
          <button 
            @click="importStudents" 
            :disabled="importing || !file"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            {{ importing ? 'Importing...' : 'Import Students' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Delete Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Students</label>
          <input
            v-model="search"
            @input="fetchStudents"
            type="text"
            placeholder="Search by name, email, admission number..."
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="deleteSelected"
            :disabled="selectedStudents.length === 0"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected ({{ selectedStudents.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">
                <input 
                  type="checkbox" 
                  @change="toggleAll" 
                  :checked="isAllSelected"
                  class="rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admission No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Section</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(student, index) in students.data"
              :key="student.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  :value="student.id"
                  v-model="selectedStudents"
                  class="rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ ((students.meta?.current_page || 1) - 1) * (students.meta?.per_page || 10) + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-300">{{ getInitials(student.user?.name) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ student.user?.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ student.user?.phone || 'No phone' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {{ student.admission_number }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ student.currentClass?.name || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ student.currentSection?.name || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ student.user?.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    @click="toggleStudentStatus(student)"
                    class="px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 transition"
                    :class="student.user?.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
                  >
                    {{ student.user?.is_active ? 'Active' : 'Inactive' }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right relative">
                <div class="flex justify-end space-x-3">
                  <button @click="toggleMenu(student.id)" class="p-1">
                  <svg xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5 text-gray-600 hover:text-gray-900">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM17.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  </button>

                      <div v-if="activeMenu === student.id"
                      class="absolute right-0 mt-2 w-30 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                    >
                  <div class="flex justify-around p-2">
                  <button
                    @click="viewStudent(student)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="editStudent(student)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteStudent(student.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="!students.data || students.data.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <p>No students found</p>
                <p class="text-sm mt-1">Click the "Add Student" button to create one.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="students.meta && students.meta.last_page > 1" class="px-6 py-4 border-t dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ ((students.meta.current_page - 1) * (students.meta.per_page || 10)) + 1 }} to 
            {{ Math.min(students.meta.current_page * (students.meta.per_page || 10), students.meta.total) }} of 
            {{ students.meta.total }} results
          </div>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              :disabled="students.meta.current_page === 1"
              @click="fetchStudents(students.meta.current_page - 1)"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {{ students.meta.current_page }} of {{ students.meta.last_page }}
            </span>
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              :disabled="students.meta.current_page === students.meta.last_page"
              @click="fetchStudents(students.meta.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Student Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50"
      @click.self="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingStudent ? 'Edit Student' : 'Add New Student' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:text-gray-400">
            ✕
          </button>
        </div>

        <form @submit.prevent="saveStudent" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admission Number *</label>
              <input
                v-model="form.admission_number"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roll Number</label>
              <input
                v-model="form.roll_number"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
              <input
                v-model="form.date_of_birth"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select
                v-model="form.gender"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class *</label>
              <select
                v-model="form.current_class_id"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Class</option>
                <option v-for="c in classes" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section *</label>
              <select
                v-model="form.current_section_id"
                :disabled="!form.current_class_id"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Section</option>
                <option v-for="s in sections" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admission Date</label>
              <input
                v-model="form.admission_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {{ editingStudent ? 'Update Student' : 'Create Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Student Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50" @click.self="showViewModal = false">
      <div class="relative top-20 mx-auto p-5 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4 pb-2 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Student Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedStudent" class="space-y-4">
          <div class="flex items-center space-x-4 pb-4 border-b dark:border-gray-700">
            <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span class="text-2xl text-blue-600 dark:text-blue-300 font-bold">{{ getInitials(selectedStudent.user?.name) }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedStudent.user?.name }}</h4>
              <p class="text-gray-500 dark:text-gray-400">{{ selectedStudent.user?.email }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Admission: {{ selectedStudent.admission_number }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Roll Number:</span> {{ selectedStudent.roll_number || 'N/A' }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Gender:</span> {{ selectedStudent.gender || 'N/A' }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Date of Birth:</span> {{ formatDate(selectedStudent.date_of_birth) }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Phone:</span> {{ selectedStudent.user?.phone || 'N/A' }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Class:</span> {{ selectedStudent.currentClass?.name || 'N/A' }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Section:</span> {{ selectedStudent.currentSection?.name || 'N/A' }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Admission Date:</span> {{ formatDate(selectedStudent.admission_date) }}
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Status:</span>
              <span 
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                :class="selectedStudent.user?.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
              >
                {{ selectedStudent.user?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <div class="md:col-span-2 text-gray-700 dark:text-gray-300">
              <span class="font-medium">Address:</span> {{ selectedStudent.user?.address || 'N/A' }}
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button @click="showViewModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useToast } from 'vue-toastification';

const toast = useToast();

// State variables
const file = ref(null);
const students = ref({ data: [], meta: null, links: {} });
const classes = ref([]);
const sections = ref([]);
const search = ref("");
const activeMenu = ref(null);
const showModal = ref(false);
const showViewModal = ref(false);
const importing = ref(false);
const selectedStudents = ref([]);
const editingStudent = ref(null);
const selectedStudent = ref(null);

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

// Computed property for "select all" state
const isAllSelected = computed(() => {
  return students.value.data.length > 0 && 
         selectedStudents.value.length === students.value.data.length;
});

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

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

// Open add modal
const openAddModal = () => {
  resetForm();
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

// View student
const viewStudent = (student) => {
  selectedStudent.value = student;
  showViewModal.value = true;
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
      toast.success(response.data.message);
      file.value = null;
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      await fetchStudents();
    } else {
      toast.error('Import failed: ' + response.data.message);
    }
  } catch (err) {
    console.error('Import error:', err);
    toast.error(err.response?.data?.message || 'Failed to import students');
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
    
    selectedStudents.value = [];
  } catch (err) {
    console.error('Error fetching students:', err);
    students.value = { data: [], meta: null, links: {} };
  }
};

// Fetch classes
const fetchClasses = async () => {
  try {
    const res = await api.get('/admin/classes?limit=all');
    classes.value = res.data.data?.data || res.data.data || [];
  } catch (err) {
    console.error('Error fetching classes:', err);
    classes.value = [];
  }
};

// Fetch sections
const fetchSections = async (classId = null) => {
  try {
    let url = '/admin/sections?limit=all';
    if(classId){
      url += `&class_room_id=${classId}`;
    }
    const res = await api.get(url);
    sections.value = res.data.data?.data || res.data.data || [];
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
      response = await api.put(`/admin/students/${editingStudent.value.id}`, form.value);
      toast.success("Student updated successfully");
    } else {
      response = await api.post('/admin/students', form.value);
      toast.success("Student created successfully. Credentials sent to email.");
    }
    
    closeModal();
    await fetchStudents();
  } catch (err) {
    console.error('Error saving student:', err.response?.data || err);
    toast.error(err.response?.data?.message || "Error saving student");
  }
};

// Delete single student
const deleteStudent = async (id) => {
  if (!confirm ("Delete this student? This action cannot be undone.")) return;
  
  try {
    await api.delete(`/admin/students/${id}`);
    toast.success("Student deleted successfully");
    selectedStudents.value = selectedStudents.value.filter(selectedId => selectedId !== id);
    await fetchStudents();
  } catch (err) {
    console.error('Error deleting student:', err);
    toast.error(err.response?.data?.message || "Failed to delete student");
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
    const response = await api.post('/admin/students/bulk-delete', {
      ids: selectedStudents.value
    });
    
    if (response.data.success || response.status === 200) {
      toast.success(response.data.message || `${selectedStudents.value.length} student(s) deleted successfully`);
      selectedStudents.value = [];
      await fetchStudents();
    } else {
      toast.error('Failed to delete students: ' + (response.data.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Bulk delete error:', err);
    toast.error(err.response?.data?.message || 'Failed to delete students');
  }
};

// Edit student
const editStudent = (student) => {
  editingStudent.value = student;
  form.value = {
    name: student.user?.name || "",
    email: student.user?.email || "",
    phone: student.user?.phone || "",
    address: student.user?.address || "",
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

const toggleMenu = (studentId) => {
  if (activeMenu.value === studentId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = studentId;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      activeMenu.value = null
    }
  });
  fetchStudents();
  fetchClasses();
});
</script>