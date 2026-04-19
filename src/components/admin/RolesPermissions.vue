<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Roles & Permissions</h2>

    <!-- Create Role -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="roleName"
        placeholder="Role name"
        class="border p-2 rounded w-64"
      />
      <button
        @click="createRole"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Role
      </button>
    </div>

    <!-- Roles List -->
    <div
      v-for="role in roles"
      :key="role.id"
      class="mb-6 p-4 border rounded"
    >
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg">{{ role.name }}</h3>

        <!-- Toggle Dropdown -->
        <button
          @click="toggleDropdown(role.id)"
          class="bg-gray-200 px-3 py-1 rounded"
        >
          Manage Permissions
        </button>
      </div>

      <!-- Dropdown -->
      <div
        v-if="openRoleId === role.id"
        class="mt-4 border p-4 rounded bg-gray-50"
      >
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="perm in permissions"
            :key="perm.id"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="perm.id"
              v-model="role.permission_ids"
            />
            {{ perm.name }}
          </label>
        </div>

        <!-- Save Button -->
        <button
          @click="updateRole(role)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

// state
const roleName = ref('')
const roles = ref([])
const permissions = ref([])
const openRoleId = ref(null)

// toggle dropdown
const toggleDropdown = (roleId) => {
  openRoleId.value = openRoleId.value === roleId ? null : roleId
}

// fetch roles + permissions
const fetchData = async () => {
  try {
    const res = await api.get('/admin/roles-permissions')

    roles.value = res.data.roles.map(role => ({
      id: role.id,
      name: role.name,
      permission_ids: role.permissions.map(p => p.id)
    }))

    permissions.value = res.data.permissions
  } catch (error) {
    console.error('Fetch error:', error)
    toast.error('Failed to load roles')
  }
}

// create role
const createRole = async () => {
  if (!roleName.value.trim()) {
    toast.error('Role name is required')
    return
  }

  try {
    await api.post('/admin/roles', {
      name: roleName.value
    })

    toast.success('Role created successfully')
    roleName.value = ''
    fetchData()
  } catch (error) {
    console.error(error)
    toast.error('Failed to create role')
  }
}

// update permissions
const updateRole = async (role) => {
  try {
    await api.post(`/admin/roles/${role.id}/permissions`, {
      permissions: role.permission_ids
    })

    toast.success('Permissions updated')
    openRoleId.value = null // close dropdown after save
  } catch (error) {
    console.error(error)
    toast.error('Update failed')
  }
}

onMounted(() => {
  fetchData()
})
</script>