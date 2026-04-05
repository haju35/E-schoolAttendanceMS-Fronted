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

    <div v-else>
      <!-- Profile Form -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Profile Information</h2>
        
        <form @submit.prevent="updateProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" v-model="profile.name" class="input-field w-full" required />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" v-model="profile.email" class="input-field w-full" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" v-model="profile.phone" class="input-field w-full" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" v-model="profile.address" class="input-field w-full" />
            </div>
          </div>

          <div class="mt-4 flex space-x-3">
            <button type="submit" class="btn-primary px-4 py-2">Update Profile</button>
          </div>
        </form>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Change Password</h2>
        
        <form @submit.prevent="changePassword">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" v-model="passwords.current" class="input-field w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" v-model="passwords.new" class="input-field w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" v-model="passwords.confirm" class="input-field w-full" required />
            </div>
          </div>

          <div class="mt-4 flex space-x-3">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
              Change Password
            </button>
          </div>
        </form>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message.text" :class="message.type === 'success' ? 'text-green-600' : 'text-red-600'" class="mt-4">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import familyApi from '../../services/familyApi'

interface Profile {
  name: string
  email: string
  phone?: string
  address?: string
}

const loading = ref(true)
const profile = ref<Profile>({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

const message = ref({ text: '', type: 'success' })

const fetchProfile = async () => {
  loading.value = true
  try {
    const response = await familyApi.getProfile()
    profile.value = response.data.profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    message.value = { text: 'Failed to load profile', type: 'error' }
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    await familyApi.updateProfile(profile.value)
    message.value = { text: 'Profile updated successfully', type: 'success' }
  } catch (error) {
    console.error('Error updating profile:', error)
    message.value = { text: 'Failed to update profile', type: 'error' }
  }
}

const changePassword = async () => {
  if (passwords.value.new !== passwords.value.confirm) {
    message.value = { text: 'New password and confirmation do not match', type: 'error' }
    return
  }
  try {
    await familyApi.changePassword({
      current_password: passwords.value.current,
      new_password: passwords.value.new
    })
    message.value = { text: 'Password changed successfully', type: 'success' }
    passwords.value.current = ''
    passwords.value.new = ''
    passwords.value.confirm = ''
  } catch (error) {
    console.error('Error changing password:', error)
    message.value = { text: 'Failed to change password', type: 'error' }
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.input-field {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  outline: none;
}

.input-field:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #4f46e5;
}
</style>