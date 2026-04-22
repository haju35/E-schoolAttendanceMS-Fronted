<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h1>
      <p class="text-gray-600 dark:text-gray-400">View and update your profile information</p>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="profile">
      <!-- Profile Header with Photo Upload -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-center space-x-4">
          <!-- Profile Photo with Upload -->
          <div class="relative group">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center shadow">
              <img 
                v-if="profilePhotoUrl" 
                :src="profilePhotoUrl" 
                alt="Profile Photo"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-3xl text-white font-bold">{{ getInitials(profile.name) }}</span>
            </div>
            
            <!-- Upload Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                 @click="triggerFileInput">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <!-- Hidden File Input -->
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden" 
              accept="image/jpeg,image/png,image/jpg,image/gif"
              @change="handlePhotoUpload"
            />
          </div>
          
          <div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ profile.name || 'Admin' }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ profile.email || 'No email' }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Administrator Account</p>
          </div>
        </div>
        
        <!-- Upload Progress -->
        <div v-if="uploading" class="mt-4">
          <div class="flex items-center gap-2">
            <div class="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
            <span class="text-sm text-white">Uploading photo...</span>
          </div>
          <div class="mt-2 w-full bg-white/30 rounded-full h-2">
            <div class="bg-white h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Profile Information</h2>
        
        <form @submit.prevent="updateProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" v-model="form.name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" disabled />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" v-model="profile.email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white" disabled />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input type="text" v-model="form.phone" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input type="text" v-model="form.address" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input type="text" :value="profile.role || 'Administrator'" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-400" disabled />
            </div>
          </div>

          <div class="mt-4 flex space-x-3">
            <button type="submit" :disabled="updating" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition">
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Change Password</h2>
        
        <form @submit.prevent="changePassword">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input type="password" v-model="passwords.current" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input type="password" v-model="passwords.new" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input type="password" v-model="passwords.confirm" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" :disabled="changingPassword" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition">
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message.text" :class="message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'" class="mt-4 p-3 rounded">
        {{ message.text }}
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <p class="text-red-600 dark:text-red-400">Failed to load profile data. Please try again.</p>
      <button @click="fetchProfile" class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Retry</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const loading = ref(true)
const updating = ref(false)
const changingPassword = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

const profile = ref<any>(null)
const profilePhotoUrl = ref<string | null>(null)
const message = ref({ text: '', type: 'success' })

const form = ref({
  name: '',
  phone: '',
  address: ''
})

const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

const getInitials = (name: string) => {
  if (!name) return 'A'
  return name.charAt(0).toUpperCase()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF)')
    return
  }
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File size must be less than 2MB')
    return
  }
  
  uploading.value = true
  uploadProgress.value = 0
  
  // Simulate progress
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10
    }
  }, 100)
  
  try {
    const formData = new FormData()
    formData.append('photo', file)
    
    const response = await api.post('/admin/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    clearInterval(interval)
    uploadProgress.value = 100
    
    if (response.data.success) {
      profilePhotoUrl.value = response.data.data.photo
      toast.success('Photo uploaded successfully!')
      
      // Update user data in localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        user.photo = response.data.data.photo
        localStorage.setItem('user', JSON.stringify(user))
      }
    } else {
      toast.error(response.data.message || 'Failed to upload photo')
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    toast.error(error.response?.data?.message || 'Failed to upload photo')
  } finally {
    clearInterval(interval)
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)
  }
}

const fetchProfile = async () => {
  loading.value = true
  try {
    const response = await api.get('/admin/profile')
    console.log('Profile response:', response.data)
    
    if (response.data.success) {
      profile.value = response.data.data
      // Populate form
      form.value = {
        name: profile.value.name || '',
        phone: profile.value.phone || '',
        address: profile.value.address || ''
      }
      
      // Set profile photo URL if exists
      if (profile.value.photo) {
        if (profile.value.photo.startsWith('http')) {
          profilePhotoUrl.value = profile.value.photo
        } else {
          profilePhotoUrl.value = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${profile.value.photo}`
        }
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
  updating.value = true
  try {
    const response = await api.put('/admin/profile', form.value)
    if (response.data.success) {
      message.value = { text: 'Profile updated successfully', type: 'success' }
      toast.success('Profile updated successfully')
      await fetchProfile() // Refresh profile data
      setTimeout(() => { message.value = { text: '', type: 'success' } }, 3000)
    } else {
      toast.error(response.data.message || 'Failed to update profile')
    }
  } catch (error: any) {
    console.error('Error updating profile:', error)
    toast.error(error.response?.data?.message || 'Failed to update profile')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (passwords.value.new !== passwords.value.confirm) {
    toast.error('New password and confirmation do not match')
    return
  }
  
  if (passwords.value.new.length < 6) {
    toast.error('New password must be at least 6 characters')
    return
  }
  
  changingPassword.value = true
  try {
    const response = await api.post('/admin/profile/change-password', {
      current_password: passwords.value.current,
      new_password: passwords.value.new,
      new_password_confirmation: passwords.value.confirm
    })
    
    if (response.data.success) {
      message.value = { text: 'Password changed successfully', type: 'success' }
      toast.success('Password changed successfully')
      passwords.value = { current: '', new: '', confirm: '' }
      setTimeout(() => { message.value = { text: '', type: 'success' } }, 3000)
    } else {
      toast.error(response.data.message || 'Failed to change password')
    }
  } catch (error: any) {
    console.error('Error changing password:', error)
    toast.error(error.response?.data?.message || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>