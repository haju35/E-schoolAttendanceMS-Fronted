<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">My Profile</h1>

    <!-- Profile Photo Section -->
    <div class="flex flex-col items-center mb-4">
      <img 
        :src="getPhotoUrl()" 
        alt="Profile Photo"
        class="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
      />

      <input type="file" @change="handleFileUpload" class="mt-2" accept="image/*"/>
      <button 
        @click="uploadPhoto" 
        class="bg-green-600 text-white px-4 py-2 rounded mt-2"
        :disabled="!selectedFile"
      >
        Upload Photo
      </button>
    </div>
    
    <!-- Profile Form -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-gray-700">Full Name</label>
          <input 
            :value="studentInfo.user?.name || 'N/A'" 
            disabled 
            class="w-full border px-3 py-2 rounded bg-gray-50"
          />
        </div>

        <div>
          <label class="text-gray-700">Email</label>
          <input 
            :value="studentInfo.user?.email || 'N/A'" 
            disabled 
            class="w-full border px-3 py-2 rounded bg-gray-50"
          />
        </div>

        <div>
          <label class="text-gray-700">Phone</label>
          <input 
            v-model="studentInfo.user.phone" 
            class="w-full border px-3 py-2 rounded"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label class="text-gray-700">Roll Number</label>
          <input 
            :value="studentInfo.roll_number || 'Not Assigned'" 
            disabled 
            class="w-full border px-3 py-2 rounded bg-gray-50"
          />
        </div>

        <div>
          <label class="text-gray-700">Address</label>
          <input 
            :value="studentInfo.address || 'Not Provided'" 
            disabled 
            class="w-full border px-3 py-2 rounded bg-gray-50"
          />
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button @click="saveProfile" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Save Changes
        </button>
        <button @click="showPasswordModal = true" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Change Password
        </button>
      </div>
    </div>

    <!-- Academic Info -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="font-semibold mb-2">Class & Section</h2>
      <p>{{ studentInfo.current_class?.name || 'Not Assigned' }} - {{ studentInfo.current_section?.name || 'Not Assigned' }}</p>
      <h2 class="font-semibold mt-4 mb-2">Parent Info</h2>
      <p>Father: {{ studentInfo.family?.father?.user?.name || '-' }}</p>
      <p>Mother: {{ studentInfo.family?.mother?.user?.name || '-' }}</p>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-xl font-semibold mb-4">Change Password</h2>

        <div class="space-y-3">
          <div>
            <label class="text-gray-700">Current Password</label>
            <input 
              type="password" 
              v-model="passwordForm.current_password" 
              class="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label class="text-gray-700">New Password</label>
            <input 
              type="password" 
              v-model="passwordForm.new_password" 
              class="w-full border px-3 py-2 rounded"
              required
              minlength="8"
            />
          </div>
          <div>
            <label class="text-gray-700">Confirm New Password</label>
            <input 
              type="password" 
              v-model="passwordForm.new_password_confirmation" 
              class="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showPasswordModal = false" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Cancel
          </button>
          <button @click="changePassword" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import studentApi from '../../services/studentApi'

const studentInfo = ref({ 
  user: {},
  current_class: null,
  current_section: null,
  family: null,
  roll_number: '',
  address: ''
})
const showPasswordModal = ref(false)
const selectedFile = ref(null)
const baseURL = 'http://localhost:8000'

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const getPhotoUrl = () => {
  if (studentInfo.value.user?.photo) {
    return baseURL + '/storage/' + studentInfo.value.user.photo
  }
  return '/favicon.ico'
}

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const fetchProfile = async () => {
  try {
    const res = await studentApi.getProfile()
    console.log('Profile response:', res.data)
    
    if (res.data.success && res.data.data) {
      studentInfo.value = res.data.data
    } else {
      console.error('Invalid profile data structure')
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    if (err.response?.status === 404) {
      alert('Student profile not found. Please contact administrator.')
    }
  }
}

const saveProfile = async () => {
  try {
    const payload = {
      phone: studentInfo.value.user?.phone,
    }

    const res = await studentApi.updateProfile(payload)
    console.log('Update response:', res.data)

    alert('Profile updated successfully!')
    await fetchProfile()
  } catch (err) {
    console.error('Error updating profile:', err)
    alert(err.response?.data?.message || 'Failed to update profile')
  }
}

const changePassword = async () => {
  // Validate passwords match
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    alert('New passwords do not match')
    return
  }
  
  // Validate password length
  if (passwordForm.value.new_password.length < 8) {
    alert('New password must be at least 8 characters')
    return
  }
  
  try {
    const token = localStorage.getItem('access_token')
    
    const response = await fetch('http://localhost:8000/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password,
        new_password_confirmation: passwordForm.value.new_password_confirmation
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      alert('Password updated successfully!')
      showPasswordModal.value = false
      passwordForm.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }
    } else {
      alert(data.message || 'Failed to update password')
    }
  } catch (err) {
    console.error('Error updating password:', err)
    alert('Failed to update password. Please try again.')
  }
}

const uploadPhoto = async () => {
  if (!selectedFile.value) {
    alert('Please select a file first')
    return
  }
  
  try {
    const formData = new FormData()
    formData.append('photo', selectedFile.value)

    const token = localStorage.getItem('access_token')
    
    const response = await fetch('http://localhost:8000/api/student/photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()
    
    if (data.success) {
      alert('Photo updated successfully!')
      selectedFile.value = null
      await fetchProfile()
    } else {
      alert(data.message || 'Failed to upload photo')
    }
  } catch (err) {
    console.error('Error uploading photo:', err)
    alert('Failed to upload photo')
  }
}

onMounted(fetchProfile)
</script>