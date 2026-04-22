<template>
  <div class="p-6 max-w-3xl mx-auto">

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h1>
      <p class="text-gray-600 dark:text-gray-400">View and update your personal information</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
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
              <span v-else class="text-3xl text-white font-bold">
                {{ getInitials(profile.name) }}
              </span>
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
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ profile.name || 'Teacher' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">{{ profile.email }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Teacher Account</p>
          </div>

        </div>
        
        <!-- Upload Progress -->
        <div v-if="uploading" class="mt-4">
          <div class="flex items-center gap-2">
            <div class="animate-spin h-4 w-4 border-b-2 border-indigo-600 rounded-full"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Uploading photo...</span>
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div class="bg-indigo-600 h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
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
              <input v-model="profile.name"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                     type="text" disabled />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input v-model="profile.email"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                     disabled />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input v-model="profile.phone"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                     type="text" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qualification</label>
              <input v-model="profile.qualification"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                     type="text" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea v-model="profile.address"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white" disabled></textarea>
            </div>

          </div>

          <div class="mt-4">
            <button type="submit"
                    :disabled="updating"
                    class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition">
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

            <input v-model="password.current_password"
                   type="password"
                   placeholder="Current Password"
                   class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white" />

            <input v-model="password.new_password"
                   type="password"
                   placeholder="New Password"
                   class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white" />

            <input v-model="password.new_password_confirmation"
                   type="password"
                   placeholder="Confirm Password"
                   class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white" />

          </div>

          <button type="submit"
                  :disabled="changingPassword"
                  class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition">
            {{ changingPassword ? 'Changing...' : 'Change Password' }}
          </button>

        </form>
      </div>

    </div>

    <!-- Error -->
    <div v-else class="text-center text-red-600 dark:text-red-400">
      Failed to load profile
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import teacherApi from '../../services/teacherApi'

const toast = useToast()
const loading = ref(true)
const updating = ref(false)
const changingPassword = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const profilePhotoUrl = ref<string | null>(null)

const profile = ref<any>({
  name: '',
  email: '',
  phone: '',
  qualification: '',
  address: ''
})

const password = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const getInitials = (name: string) => {
  if (!name) return 'T'
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
    
    const response = await teacherApi.uploadPhoto(formData)
    
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
    const res = await teacherApi.getProfile()
    console.log('Full API Response:', res.data)
    
    if (res.data.success) {
      const data = res.data.data
      console.log('Teacher Data:', data)
      console.log('User Data:', data.user)
      
      // Map the data correctly - handle different possible structures
      profile.value = {
        name: data.user?.name || data.name || '',
        email: data.user?.email || data.email || '',
        phone: data.user?.phone || data.phone || '',
        qualification: data.qualification || '',
        address: data.user?.address || data.address || ''
      }
      
      console.log('Mapped Profile:', profile.value)
      
      // Set profile photo URL if exists
      if (data.user?.photo) {
        const photo = data.user.photo
        if (photo.startsWith('http')) {
          profilePhotoUrl.value = photo
        } else {
          profilePhotoUrl.value = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${photo}`
        }
      }
    } else {
      console.error('API returned success: false', res.data)
      toast.error(res.data.message || 'Failed to load profile')
    }
  } catch (err: any) {
    console.error('Fetch error details:', err)
    console.error('Error response:', err.response?.data)
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
      address: profile.value.address,
      qualification: profile.value.qualification
    })
    if (res.data.success) {
      toast.success('Profile updated successfully')
      await fetchProfile()
    } else {
      toast.error(res.data.message || 'Update failed')
    }
  } catch (err: any) {
    console.error('Update error:', err)
    toast.error(err.response?.data?.message || 'Update failed')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (password.value.new_password !== password.value.new_password_confirmation) {
    toast.error('New passwords do not match')
    return
  }
  
  if (password.value.new_password.length < 6) {
    toast.error('New password must be at least 6 characters')
    return
  }
  
  changingPassword.value = true
  try {
    const res = await teacherApi.changePassword({
      current_password: password.value.current_password,
      new_password: password.value.new_password,
      new_password_confirmation: password.value.new_password_confirmation
    })
    if (res.data.success) {
      toast.success('Password changed successfully')
      password.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }
    } else {
      toast.error(res.data.message || 'Password change failed')
    }
  } catch (err: any) {
    console.error('Password error:', err)
    toast.error(err.response?.data?.message || 'Password change failed')
  } finally {
    changingPassword.value = false
  }
}

onMounted(fetchProfile)
</script>