<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
      <p class="text-gray-600">View and update your personal information</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-semibold">Personal Information</h2>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" v-model="profile.name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" v-model="profile.email" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" v-model="profile.phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <input type="text" v-model="profile.employee_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                <input type="text" v-model="profile.qualification" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea v-model="profile.address" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition" :disabled="updating">
                {{ updating ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="w-32 h-32 mx-auto bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <span class="text-4xl text-white font-bold">{{ profileInitials }}</span>
          </div>
          <h3 class="text-lg font-semibold">{{ profile.name }}</h3>
          <p class="text-gray-600">{{ profile.qualification || 'Teacher' }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-gray-800 mb-3">Assigned Information</h3>
          <div v-if="assignedInfoLoaded" class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Classes:</span>
              <span class="font-medium">{{ assignedInfo.classes }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Subjects:</span>
              <span class="font-medium">{{ assignedInfo.subjects }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Students:</span>
              <span class="font-medium">{{ assignedInfo.total_students }}</span>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center">Loading assigned info...</div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <button @click="showChangePasswordModal = true" class="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
            Change Password
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Change Password</h2>
        <form @submit.prevent="changePassword">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input type="password" v-model="passwordData.current_password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input type="password" v-model="passwordData.new_password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input type="password" v-model="passwordData.new_password_confirmation" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showChangePasswordModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" :disabled="changingPassword">
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import teacherApi from '../../services/teacherApi'

const toast = useToast()
const loading = ref(true)
const updating = ref(false)
const changingPassword = ref(false)
const showChangePasswordModal = ref(false)

const profile = ref({
  name: '',
  email: '',
  phone: '',
  employee_id: '',
  qualification: '',
  address: ''
})

const assignedInfo = ref({
  classes: 0,
  subjects: 0,
  total_students: 0
})
const assignedInfoLoaded = ref(false)

const passwordData = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const profileInitials = computed(() => {
  if (!profile.value.name) return ''
  return profile.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const fetchProfile = async () => {
  loading.value = true
  try {
    const res = await teacherApi.getProfile()
    if (res.data.success) {
      const data = res.data.data
      profile.value = {
        name: data.user?.name || '',
        email: data.user?.email || '',
        phone: data.user?.phone || '',
        employee_id: data.employee_id || '',
        qualification: data.qualification || '',
        address: data.user?.address || ''
      }
      if (data.assigned_info) {
        assignedInfo.value = {
          classes: data.assigned_info.classes || 0,
          subjects: data.assigned_info.subjects || 0,
          total_students: data.assigned_info.total_students || 0
        }
      }
      assignedInfoLoaded.value = true
    } else {
      toast.error(res.data.message || 'Failed to load profile')
    }
  } catch (err: any) {
    console.error(err)
    toast.error(err.response?.data?.message || 'Failed to load profile')
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  updating.value = true
  try {
    const res = await teacherApi.updateProfile({
      name: profile.value.name,
      phone: profile.value.phone,
      qualification: profile.value.qualification,
      address: profile.value.address
    })
    if (res.data.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(res.data.message || 'Failed to update profile')
    }
  } catch (err: any) {
    console.error(err)
    toast.error(err.response?.data?.message || 'Failed to update profile')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (passwordData.value.new_password !== passwordData.value.new_password_confirmation) {
    toast.error('Passwords do not match')
    return
  }
  changingPassword.value = true
  try {
    const res = await teacherApi.changePassword(passwordData.value)
    if (res.data.success) {
      toast.success('Password changed successfully')
      showChangePasswordModal.value = false
      passwordData.value = { current_password: '', new_password: '', new_password_confirmation: '' }
    } else {
      toast.error(res.data.message || 'Failed to change password')
    }
  } catch (err: any) {
    console.error(err)
    toast.error(err.response?.data?.message || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

onMounted(fetchProfile)
</script>