<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Users Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage all system users</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input 
            type="text" 
            v-model="filters.search"
            @input="debouncedSearch"
            placeholder="Search by name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
          <select 
            v-model="filters.role" 
            @change="fetchUsers"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Roles</option>
            <option v-for="role in roles" :key="role.id" :value="role.name">
              {{ capitalize(role.name) }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select 
            v-model="filters.status" 
            @change="fetchUsers"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="clearFilters"
            class="px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span class="text-indigo-600 dark:text-indigo-300 font-semibold">
                        {{ getUserInitial(user.name) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleBadgeClass(user.role)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ capitalize(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  @click="toggleStatus(user)" 
                  :class="user.is_active ? 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200' : 'bg-red-100 text-red-800 cursor-pointer hover:bg-red-200'" 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors"
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">

                <button @click="toggleMenu(user.id)" class="p-1">
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

                <div v-if="activeMenu === user.id"
                  class="absolute right-0 mt-2 w-30 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                >

                <button 
                  @click="toggleStatus(user)" 
                  class="mr-3"
                  :title="user.is_active ? 'Deactivate User' : 'Activate User'"
                >

                  <!-- ACTIVE (Check Icon) -->
                  <svg v-if="user.is_active"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5 transition-colors" :class="user.is_active ? 'text-green-600 hover:text-green-800' 
                      : 'text-red-600 hover:text-red-800'">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>

                  <!-- INACTIVE (Your Icon) -->
                  <svg v-else
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5 transition-colors" :class="user.is_active ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>

                </button>
                <!-- View Button -->
                <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-900 mr-3" title="View">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <!-- Edit Button -->
                <button @click="editUser(user)" class="text-yellow-600 hover:text-yellow-900 mr-3" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <!-- Delete Button -->
                <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900" title="Delete">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No users found
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                Loading users...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination with Ellipsis -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total }} users
          </div>
          
          <div class="flex items-center gap-1">
            <!-- Previous Button -->
            <button 
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <!-- First Page -->
              <button
                v-if="pagination.current_page > 3"
                @click="changePage(1)"
                class="px-3 py-1 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                1
              </button>
              
              <!-- Ellipsis (Left) -->
              <span v-if="pagination.current_page > 3" class="px-2 text-gray-500">...</span>
              
              <!-- Pages around current page -->
              <template v-for="page in getVisiblePages()" :key="page">
                <button
                  @click="changePage(page)"
                  :class="[
                    'px-3 py-1 border rounded-md transition-colors',
                    page === pagination.current_page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
              
              <!-- Ellipsis (Right) -->
              <span v-if="pagination.current_page < pagination.last_page - 2" class="px-2 text-gray-500">...</span>
              
              <!-- Last Page -->
              <button
                v-if="pagination.current_page < pagination.last_page - 2"
                @click="changePage(pagination.last_page)"
                class="px-3 py-1 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ pagination.last_page }}
              </button>
            </div>
            
            <!-- Next Button -->
            <button 
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

    <!-- View User Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="closeViewModal">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">User Details</h3>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- User Avatar and Basic Info -->
          <div class="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span class="text-2xl text-indigo-600 dark:text-indigo-300 font-semibold">
                {{ getUserInitial(viewUserData.name) }}
              </span>
            </div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ viewUserData.name }}</h4>
              <p class="text-gray-600 dark:text-gray-400">{{ viewUserData.email }}</p>
              <span :class="getRoleBadgeClass(viewUserData.role)" class="mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full">
                {{ capitalize(viewUserData.role) }}
              </span>
            </div>
          </div>

          <!-- User Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ viewUserData.id }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
              <p class="mt-1">
                <span :class="viewUserData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ viewUserData.is_active ? 'Active' : 'Inactive' }}
                </span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ viewUserData.phone || 'Not provided' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ formatDate(viewUserData.created_at) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ formatDate(viewUserData.updated_at) }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ viewUserData.address || 'Not provided' }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              @click="closeViewModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>

          </div>
        </div>
      </div>
    </div>

    <!-- User Form Modal (Create/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
      </div>
       
        
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input 
              type="text" 
              v-model="form.name" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
            <input 
              type="email" 
              v-model="form.email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
            <select 
              v-model="form.role" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.name">
                {{ capitalize(role.name) }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input 
              type="text" 
              v-model="form.phone" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <textarea 
              v-model="form.address" 
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>
          
          <div class="flex justify-end gap-2">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import userApi from '@/services/userApi'


const toast = useToast()
const users = ref([])
const roles = ref([])
const loading = ref(false)
const activeMenu = ref(null)
const showModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentUserId = ref(null)
const viewUserData = ref({})

const filters = ref({
  search: '',
  role: '',
  status: ''
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  from: null,
  to: null,
  prev_page_url: null,
  next_page_url: null
})

const form = ref({
  name: '',
  email: '',
  role: '',
  phone: '',
  address: ''
})

let searchTimeout = null

// Fetch roles from API
const fetchRoles = async () => {
  try {
    const response = await userApi.getRoles()
    if (response.data.success) {
      roles.value = response.data.data
      console.log('Roles loaded:', roles.value)
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

// Add this function to your script setup
const getVisiblePages = () => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2
  
  let pages = []
  
  let start = Math.max(2, current - delta)
  let end = Math.min(last - 1, current + delta)
  
  if (current - delta <= 2) {
    start = 2
    end = Math.min(last - 1, start + (delta * 2))
  }
  
  if (current + delta >= last - 1) {
    end = last - 1
    start = Math.max(2, end - (delta * 2))
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    fetchUsers()
  }, 500)
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.current_page,
      search: filters.value.search,
      role: filters.value.role,
      ...(filters.value.status !== '' ? { status: filters.value.status } : {})
    }
    const response = await userApi.getUsers(params)
    if (response.data.success) {
      users.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to,
        prev_page_url: response.data.data.prev_page_url,
        next_page_url: response.data.data.next_page_url
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.error('Failed to fetch users')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    fetchUsers()
  }
}

const clearFilters = () => {
  filters.value = { search: '', role: '', status: '' }
  pagination.value.current_page = 1
  fetchUsers()
}

// View user details
const viewUser = (user) => {
  viewUserData.value = { ...user }
  showViewModal.value = true
}

// Close view modal
const closeViewModal = () => {
  showViewModal.value = false
  viewUserData.value = {}
}

// Edit from view modal
const editFromView = () => {
  closeViewModal()
  editUser(viewUserData.value)
}

const openCreateModal = () => {
  isEditing.value = false
  currentUserId.value = null
  form.value = { name: '', email: '', password: '', role: '', phone: '', address: '' }
  showModal.value = true
}

const editUser = (user) => {
  isEditing.value = true
  currentUserId.value = user.id
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    phone: user.phone || '',
    address: user.address || ''
  }
  showModal.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await userApi.updateUser(currentUserId.value, form.value)
      toast.success('User updated successfully')
    } else {
      await userApi.createUser(form.value)
      toast.success('User created successfully! Password has been sent to their email.')
    }
    closeModal()
    await fetchUsers()
  } catch (error) {
    console.error('Error saving user:', error)
    toast.error(error.response?.data?.message || 'Failed to save user')
  } finally {
    saving.value = false
  }
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    try {
      await userApi.deleteUser(user.id)
      toast.success('User deleted successfully')
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }
}

const toggleStatus = async (user) => {
  try {
    await userApi.toggleUserStatus(user.id)
    toast.success('User status updated')
    await fetchUsers()
  } catch (error) {
    console.error('Error toggling status:', error)
    toast.error(error.response?.data?.message || 'Failed to update status')
  }
}

const toggleMenu = (id) => {
  activeMenu.value = activeMenu.value === id ? null : id
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  currentUserId.value = null
}

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U'
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    teacher: 'bg-blue-100 text-blue-800',
    student: 'bg-green-100 text-green-800',
    family: 'bg-yellow-100 text-yellow-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const capitalize = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      activeMenu.value = null
    }
  })
  fetchRoles()  
  fetchUsers()  
})
</script>