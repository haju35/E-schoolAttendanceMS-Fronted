<template>
  <div class="container mt-4">
    <h3>Users Management</h3>

    <!-- USERS TABLE -->
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>

          <td>
            <span class="badge bg-primary">
              {{ user.roles[0]?.name || 'No Role' }}
            </span>
          </td>

          <td>
            <button class="btn btn-warning btn-sm" @click="openModal(user)">
              Assign
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-box">

        <h4>Assign Role & Permissions</h4>

        <!-- ROLE -->
        <label>Role</label>
        <select v-model="form.role" class="form-control mb-3" @change="autoAssignPermissions">
          <option v-for="role in roles" :key="role.id" :value="role.name">
            {{ role.name }}
          </option>
        </select>

        <!-- PERMISSIONS -->
        <label>Permissions</label>
        <div class="row">
          <div class="col-md-6" v-for="perm in permissions" :key="perm.id">
            <input type="checkbox" :value="perm.name" v-model="form.permissions" />
            {{ perm.name }}
          </div>
        </div>

        <!-- BUTTONS -->
        <div class="mt-3">
          <button class="btn btn-success" @click="save">Save</button>
          <button class="btn btn-secondary ms-2" @click="closeModal">Cancel</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

/* =======================
   STATE
======================= */
const users = ref([])
const roles = ref([])
const permissions = ref([])

const showModal = ref(false)
const selectedUser = ref(null)

const form = ref({
  role: '',
  permissions: []
})

/* =======================
   AUTO ROLE PERMISSIONS MAP
======================= */
const rolePermissions = {
  admin: [
    'manage_users',
    'manage_students',
    'manage_teachers',
    'manage_classes',
    'view_reports',
    'system_config'
  ],
  teacher: [
    'mark_attendance',
    'edit_attendance',
    'view_class_attendance'
  ],
  student: [
    'view_own_attendance'
  ],
  family: [
    'view_child_attendance',
    'receive_notifications'
  ]
}

/* =======================
   LOAD USERS
======================= */
const loadUsers = async () => {
  const res = await axios.get('/api/admin/users')
  users.value = res.data.data.data
}

/* =======================
   LOAD ROLES + PERMISSIONS
======================= */
const loadRolesPermissions = async () => {
  const res = await axios.get('/api/admin/roles-permissions')
  roles.value = res.data.roles
  permissions.value = res.data.permissions
}

/* =======================
   OPEN MODAL
======================= */
const openModal = (user) => {
  selectedUser.value = user

  form.value.role = user.roles[0]?.name || ''
  form.value.permissions = user.permissions?.map(p => p.name) || []

  showModal.value = true
}

/* =======================
   AUTO ASSIGN PERMISSIONS
======================= */
const autoAssignPermissions = () => {
  form.value.permissions = rolePermissions[form.value.role] || []
}

/* =======================
   CLOSE MODAL
======================= */
const closeModal = () => {
  showModal.value = false
}

/* =======================
   SAVE
======================= */
const save = async () => {
  await axios.put(`/api/admin/users/${selectedUser.value.id}/assign`, form.value)

  alert('Updated successfully')
  closeModal()
  loadUsers()
}

/* =======================
   INIT
======================= */
onMounted(() => {
  loadUsers()
  loadRolesPermissions()
})
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: white;
  padding: 20px;
  width: 600px;
  border-radius: 10px;
}
</style>