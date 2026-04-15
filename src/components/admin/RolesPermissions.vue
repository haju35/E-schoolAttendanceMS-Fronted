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
    <div v-for="role in roles" :key="role.id" class="mb-6 p-4 border rounded">
      <h3 class="font-bold text-lg mb-2">{{ role.name }}</h3>

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
            @change="updateRole(role)"
          />
          {{ perm.name }}
        </label>
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

// fetch roles + permissions
const fetchData = async () => {
  try {
    const res = await api.get('/admin/roles-permissions')
    roles.value = res.data.roles.map(role => ({id: role.id,
      name: role.name,
      permission_ids: role.permissions.map(p=>p.id)
    }))
    permissions.value = res.data.permissions
  } catch (error) {
    console.error('Fetch error:', error)
    toast.error('Failed to load roles')
  }
}

// create role (FIXED)
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

// update permissions (FIXED)
const updateRole = async (role) => {
  console.log('ROLE DATA:', role)
  console.log('Sending permissions:', role.permission_ids)
  console.log('TYPE:', typeof role.permission_ids)
  try {
    await api.post(`/admin/roles/${role.id}/permissions`, {
      permissions: role.permission_ids
    })

    toast.success('Permissions updated')
  } catch (error) {
    console.error(error)
    toast.error('Update failed')
  }
}

onMounted(() => {
  fetchData()
})
</script>