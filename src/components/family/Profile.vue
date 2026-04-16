<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
      <p class="text-gray-600">View and update your profile information</p>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="profile">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow">
            <span class="text-3xl text-white font-bold">{{ getInitials(profile.name) }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ profile.name || 'Family Member' }}</h2>
            <p class="text-gray-600">{{ profile.email || 'No email' }}</p>
            <p class="text-sm text-gray-400 mt-1">Parent/Guardian Account</p>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Profile Information</h2>
        
        <form @submit.prevent="updateProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" v-model="form.name" class="w-full px-3 py-2 border rounded-md" required disabled/>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" v-model="profile.email" class="w-full px-3 py-2 border rounded-md bg-gray-50" disabled />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" v-model="form.phone" class="w-full px-3 py-2 border rounded-md" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" v-model="form.address" class="w-full px-3 py-2 border rounded-md" disabled/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input type="text" v-model="form.occupation" class="w-full px-3 py-2 border rounded-md" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <input type="text" v-model="form.emergency_contact" class="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div class="mt-4 flex space-x-3">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <!-- My Children Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">My Children</h2>
        <div v-if="profile.students && profile.students.length === 0" class="text-gray-500 text-center py-4">
          No children linked to your account.
        </div>
        <div v-else class="space-y-3">
          <div v-for="student in profile.students" :key="student.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-800">{{ student.name }}</p>
              <p class="text-sm text-gray-500">{{ student.class_name }} - {{ student.section_name }} | Roll No: {{ student.roll_number }}</p>
            </div>
            <router-link :to="`/family/attendance/${student.id}`" class="text-indigo-600 hover:text-indigo-800 text-sm">
              View Attendance →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Change Password</h2>
        
        <form @submit.prevent="changePassword">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" v-model="passwords.current" class="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" v-model="passwords.new" class="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" v-model="passwords.confirm" class="w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Change Password
            </button>
          </div>
        </form>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message.text" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="mt-4 p-3 rounded">
        {{ message.text }}
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600">Failed to load profile data. Please try again.</p>
      <button @click="fetchProfile" class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded">Retry</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import familyApi from '../../services/familyApi'

const loading = ref(true)
const profile = ref<any>(null)
const message = ref({ text: '', type: 'success' })

const form = ref({
  name: '',
  phone: '',
  address: '',
  occupation: '',
  emergency_contact: ''
})

const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

const getInitials = (name: string) => {
  if (!name) return 'F'
  return name.charAt(0).toUpperCase()
}

const fetchProfile = async () => {
  loading.value = true
  try {
    const response = await familyApi.getProfile()
    console.log('Profile response:', response.data)
    
    if (response.data.success) {
      profile.value = response.data.data
      // Populate form
      form.value = {
        name: profile.value.name || '',
        phone: profile.value.phone || '',
        address: profile.value.address || '',
        occupation: profile.value.occupation || '',
        emergency_contact: profile.value.emergency_contact || ''
      }
    } else {
      message.value = { text: response.data.message || 'Failed to load profile', type: 'error' }
    }
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    message.value = { text: error.response?.data?.message || 'Failed to load profile', type: 'error' }
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    const response = await familyApi.updateProfile(form.value)
    if (response.data.success) {
      message.value = { text: 'Profile updated successfully', type: 'success' }
      await fetchProfile() // Refresh profile data
      setTimeout(() => { message.value = { text: '', type: 'success' } }, 3000)
    }
  } catch (error: any) {
    console.error('Error updating profile:', error)
    message.value = { text: error.response?.data?.message || 'Failed to update profile', type: 'error' }
  }
}

const changePassword = async () => {
  if (passwords.value.new !== passwords.value.confirm) {
    message.value = { text: 'New password and confirmation do not match', type: 'error' }
    return
  }
  
  try {
    const response = await familyApi.changePassword({
      current_password: passwords.value.current,
      new_password: passwords.value.new,
      new_password_confirmation: passwords.value.confirm
    })
    
    if (response.data.success) {
      message.value = { text: 'Password changed successfully', type: 'success' }
      passwords.value = { current: '', new: '', confirm: '' }
      setTimeout(() => { message.value = { text: '', type: 'success' } }, 3000)
    }
  } catch (error: any) {
    console.error('Error changing password:', error)
    message.value = { text: error.response?.data?.message || 'Failed to change password', type: 'error' }
  }
}

onMounted(() => {
  fetchProfile()
})
</script>