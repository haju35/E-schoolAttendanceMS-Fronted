<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">My Profile</h1>

    <!-- Editable Profile Form -->
     <div class="flex flex-col items-center mb-4">
        <img :src="user.photo ? baseURL + '/storage/' + user.photo : '/favicon.ico'" />

        <input type="file" @change="handleFileUpload" class="mt-2"/>
        <button 
          @click="uploadPhoto" 
          class="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          Upload Photo
        </button>
      </div>
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-gray-700">Full Name</label>
          <input :value="studentInfo.user.name" disabled class="w-full border px-3 py-2 rounded"/>
        </div>

        <div>
          <label class="text-gray-700">Phone</label>
          <input v-model="studentInfo.user.phone" class="w-full border px-3 py-2 rounded"/>
        </div>

        <div>
          <label class="text-gray-700">Address</label>
          <input :value="studentInfo.address" disabled class="w-full border px-3 py-2 rounded"/>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button @click="saveProfile" class="bg-indigo-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
        <button @click="showPasswordModal = true" class="bg-gray-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </div>
    </div>

    <!-- Academic Info -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="font-semibold mb-2">Class & Section</h2>
      <p>{{ studentInfo.current_class?.name }} - {{ studentInfo.current_section?.name }}</p>
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
            <input type="password" v-model="passwordForm.current_password" class="w-full border px-3 py-2 rounded"/>
          </div>
          <div>
            <label class="text-gray-700">New Password</label>
            <input type="password" v-model="passwordForm.new_password" class="w-full border px-3 py-2 rounded"/>
          </div>
          <div>
            <label class="text-gray-700">Confirm New Password</label>
            <input type="password" v-model="passwordForm.new_password_confirmation" class="w-full border px-3 py-2 rounded"/>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showPasswordModal = false" class="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button @click="changePassword" class="bg-green-600 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import studentApi from '../../services/studentApi'

const studentInfo = ref({ user: {} })
const showPasswordModal = ref(false)
const selectedFile = ref(null)
const previewImage = ref(null)

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  selectedFile.value = file
  previewImage.value = URL.createObjectURL(file)
}

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const fetchProfile = async () => {
  try {
    const res = await studentApi.getProfile()
    studentInfo.value = res.data.data
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
}

const saveProfile = async () => {
  try {
    console.log('Sending:', studentInfo.value.user.phone)

    const payload = {
      phone: studentInfo.value.user.phone,
    }

    const res = await studentApi.updateProfile(payload)

    console.log('Response:', res.data)

    alert('Profile updated successfully!')
    await fetchProfile()
  } catch (err) {
    console.error('FULL ERROR:', err.response || err)
    alert('Failed to update profile')
  }
}

const changePassword = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/student/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` // or your auth token
      },
      body: JSON.stringify(passwordForm.value)
    })
    const data = await res.json()
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
    alert('Failed to update password')
  }
}

const uploadPhoto = async () => {
  try {
    const formData = new FormData()
    formData.append('photo', selectedFile.value)

    await fetch('http://localhost:8000/api/student/photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    })

    alert('Photo updated!')
    await fetchProfile()
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchProfile)
</script>