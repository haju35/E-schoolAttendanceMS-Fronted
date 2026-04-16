<template>
  <div class="p-6 max-w-3xl mx-auto">

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
      <p class="text-gray-600">View and update your personal information</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
    </div>

    <div v-else-if="profile">

      <!-- Profile Header (clean like family) -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center space-x-4">

          <!-- Only circle is purple -->
          <div class="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow">
            <span class="text-3xl text-white font-bold">
              {{ getInitials(profile.name) }}
            </span>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              {{ profile.name || 'Teacher' }}
            </h2>
            <p class="text-gray-600">{{ profile.email }}</p>
            <p class="text-sm text-gray-400 mt-1">Teacher Account</p>
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
              <input v-model="profile.name"
                     class="w-full px-3 py-2 border rounded-md"
                     type="text" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="profile.email"
                     class="w-full px-3 py-2 border rounded-md bg-gray-50"
                     disabled />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="profile.phone"
                     class="w-full px-3 py-2 border rounded-md"
                     type="text" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input v-model="profile.qualification"
                     class="w-full px-3 py-2 border rounded-md"
                     type="text" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input v-model="profile.address"
                     class="w-full px-3 py-2 border rounded-md"
                     type="text" disabled/>
            </div>

          </div>

          <div class="mt-4">
            <button type="submit"
                    class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Update Profile
            </button>
          </div>

        </form>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Change Password</h2>

        <form @submit.prevent="changePassword">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input v-model="password.current_password"
                   type="password"
                   placeholder="Current Password"
                   class="px-3 py-2 border rounded-md" />

            <input v-model="password.new_password"
                   type="password"
                   placeholder="New Password"
                   class="px-3 py-2 border rounded-md" />

            <input v-model="password.new_password_confirmation"
                   type="password"
                   placeholder="Confirm Password"
                   class="px-3 py-2 border rounded-md" />

          </div>

          <button class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Change Password
          </button>

        </form>
      </div>

    </div>

    <!-- Error -->
    <div v-else class="text-center text-red-600">
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

const fetchProfile = async () => {
  try {
    const res = await teacherApi.getProfile()

    if (res.data.success) {
      const data = res.data.data

      profile.value = {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        qualification: data.qualification,
        address: data.user.address
      }
    }
  } catch (err) {
    toast.error('Failed to load profile')
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    const res = await teacherApi.updateProfile(profile.value)
    if (res.data.success) {
      toast.success('Profile updated successfully')
    }
  } catch (err) {
    toast.error('Update failed')
  }
}

const changePassword = async () => {
  try {
    const res = await teacherApi.changePassword(password.value)
    if (res.data.success) {
      toast.success('Password changed')
      password.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }
    }
  } catch (err) {
    toast.error('Password change failed')
  }
}

onMounted(fetchProfile)
</script>