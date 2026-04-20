<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Roles & Permissions</h2>
        <p class="text-gray-600 mt-1">Manage user roles and their permissions</p>
      </div>
      <button
        @click="refreshData"
        :disabled="isLoading"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <!-- Create Role Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Create New Role</h3>
      <div class="flex gap-3">
        <input
          v-model="newRoleName"
          type="text"
          placeholder="Enter role name (e.g., librarian, counselor)"
          class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="createRole"
        />
        <button
          @click="createRole"
          :disabled="isCreatingRole"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ isCreatingRole ? 'Creating...' : 'Create Role' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading roles and permissions...</p>
    </div>

    <!-- Roles List -->
    <div v-else-if="roles.length > 0" class="grid gap-6">
      <div
        v-for="role in roles"
        :key="role.id"
        class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Role Header -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">
              {{ formatRoleName(role.name) }}
              <span class="text-sm font-normal text-gray-500 ml-2">(ID: {{ role.id }})</span>
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ role.permissions?.length || 0 }} permission(s) assigned
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="toggleDropdown(role.id)"
              class="px-4 py-2 rounded-lg transition-colors"
              :class="openRoleId === role.id ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              {{ openRoleId === role.id ? 'Close' : 'Manage Permissions' }}
            </button>
            <button
              v-if="role.name !== 'admin'"
              @click="deleteRole(role)"
              class="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Permissions Panel -->
        <div v-if="openRoleId === role.id" class="p-6">
          <!-- Search & Filter -->
          <div class="mb-4 flex gap-3">
            <div class="flex-1">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search permissions..."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex gap-2">
              <button
                @click="selectAllPermissions(role)"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select All
              </button>
              <button
                @click="deselectAllPermissions(role)"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          <!-- Permissions Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            <label
              v-for="perm in filteredPermissions"
              :key="perm.id"
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white transition-colors"
            >
              <input
                type="checkbox"
                :value="perm.id"
                v-model="selectedPermissions[role.id]"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span class="text-gray-700 text-sm">{{ formatPermissionName(perm.name) }}</span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              @click="updateRolePermissions(role)"
              :disabled="isUpdating"
              class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {{ isUpdating ? 'Saving...' : 'Save Changes' }}
            </button>
            <button
              v-if="selectedPermissions[role.id]?.length > 0"
              @click="removeAllPermissions(role)"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="mt-4 text-gray-600">No roles found. Create your first role above!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

// State
const newRoleName = ref('')
const roles = ref([])
const permissions = ref([])
const openRoleId = ref(null)
const selectedPermissions = ref({})
const isLoading = ref(false)
const isCreatingRole = ref(false)
const isUpdating = ref(false)
const searchTerm = ref('')

// Computed
const filteredPermissions = computed(() => {
  if (!searchTerm.value) return permissions.value
  const term = searchTerm.value.toLowerCase()
  return permissions.value.filter(perm => 
    perm.name.toLowerCase().includes(term)
  )
})

// Methods
const formatRoleName = (name) => {
  return name.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatPermissionName = (name) => {
  return name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const toggleDropdown = (roleId) => {
  if (openRoleId.value === roleId) {
    openRoleId.value = null
    searchTerm.value = ''
  } else {
    openRoleId.value = roleId
    // Load current permissions for this role
    const role = roles.value.find(r => r.id === roleId)
    if (role) {
      selectedPermissions.value[roleId] = role.permissions.map(p => p.id)
    }
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/admin/roles-permissions')
    roles.value = response.data.roles
    permissions.value = response.data.permissions
    
    console.log('Loaded:', { 
      roles: roles.value.length, 
      permissions: permissions.value.length 
    })
    
    toast.success('Data loaded successfully')
  } catch (error) {
    console.error('Fetch error:', error)
    toast.error(error.response?.data?.message || 'Failed to load roles and permissions')
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

const createRole = async () => {
  if (!newRoleName.value.trim()) {
    toast.error('Role name is required')
    return
  }

  isCreatingRole.value = true
  try {
    const roleNameFormatted = newRoleName.value.toLowerCase().replace(/\s+/g, '_')
    await api.post('/admin/roles', { name: roleNameFormatted })
    
    toast.success(`Role "${newRoleName.value}" created successfully`)
    newRoleName.value = ''
    await fetchData()
  } catch (error) {
    console.error('Create role error:', error)
    toast.error(error.response?.data?.message || 'Failed to create role')
  } finally {
    isCreatingRole.value = false
  }
}

const deleteRole = async (role) => {
  if (!confirm(`Are you sure you want to delete role "${formatRoleName(role.name)}"? This action cannot be undone.`)) {
    return
  }
  
  try {
    await api.delete(`/admin/roles/${role.id}`)
    toast.success(`Role "${formatRoleName(role.name)}" deleted successfully`)
    await fetchData()
    
    // Close dropdown if open
    if (openRoleId.value === role.id) {
      openRoleId.value = null
    }
  } catch (error) {
    console.error('Delete role error:', error)
    toast.error(error.response?.data?.message || 'Failed to delete role')
  }
}

const updateRolePermissions = async (role) => {
  isUpdating.value = true
  try {
    const permissionIds = selectedPermissions.value[role.id] || []
    
    await api.post(`/admin/roles/${role.id}/permissions`, {
      permissions: permissionIds
    })

    toast.success(`Permissions updated for "${formatRoleName(role.name)}"`)
    
    // Update local data
    const updatedRole = roles.value.find(r => r.id === role.id)
    if (updatedRole) {
      const updatedPermissions = permissions.value.filter(p => 
        permissionIds.includes(p.id)
      )
      updatedRole.permissions = updatedPermissions
    }
    
    // Close dropdown after save
    openRoleId.value = null
    searchTerm.value = ''
  } catch (error) {
    console.error('Update error:', error)
    toast.error(error.response?.data?.message || 'Failed to update permissions')
  } finally {
    isUpdating.value = false
  }
}

const removeAllPermissions = async (role) => {
  if (!confirm(`Remove ALL permissions from "${formatRoleName(role.name)}"? This action cannot be undone.`)) {
    return
  }
  
  try {
    await api.post(`/admin/roles/${role.id}/permissions`, {
      permissions: []
    })

    toast.success(`All permissions removed from "${formatRoleName(role.name)}"`)
    selectedPermissions.value[role.id] = []
    
    // Update local data
    const updatedRole = roles.value.find(r => r.id === role.id)
    if (updatedRole) {
      updatedRole.permissions = []
    }
  } catch (error) {
    console.error('Remove permissions error:', error)
    toast.error(error.response?.data?.message || 'Failed to remove permissions')
  }
}

const selectAllPermissions = (role) => {
  selectedPermissions.value[role.id] = permissions.value.map(p => p.id)
}

const deselectAllPermissions = (role) => {
  selectedPermissions.value[role.id] = []
}

onMounted(() => {
  fetchData()
})
</script>