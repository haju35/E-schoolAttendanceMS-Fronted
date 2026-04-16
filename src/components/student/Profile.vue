<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
      <p class="text-gray-600">View and update your personal information</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="student">

      <!-- HEADER -->
      <div class="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-5">

        <!-- PHOTO -->
        <div class="flex flex-col items-center">
          <img
            :src="getPhotoUrl()"
            class="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
          />

          <input type="file" class="mt-2 text-xs" @change="handleFileUpload" />
          <button
            class="mt-2 bg-green-600 text-white px-3 py-1 text-xs rounded"
            :disabled="!selectedFile"
            @click="uploadPhoto"
          >
            Upload
          </button>
        </div>

        <!-- INFO -->
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            {{ student.user?.name }}
          </h2>

          <p class="text-gray-600">
            {{ student.user?.email }}
          </p>

          <p class="text-sm text-gray-500 mt-1">
            Student Profile
          </p>
        </div>
      </div>

      <!-- PROFILE FORM -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="font-semibold mb-4">Profile Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label class="text-gray-700">Full Name</label>
            <input
              :value="student.user?.name"
              disabled
              class="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div>
            <label class="text-gray-700">Email</label>
            <input
              :value="student.user?.email"
              disabled
              class="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div>
            <label class="text-gray-700">Phone</label>
            <input
              v-model="student.user.phone"
              class="w-full border px-3 py-2 rounded"
              placeholder="Enter phone"
            />
          </div>

          <div>
            <label class="text-gray-700">Roll Number</label>
            <input
              :value="student.roll_number"
              disabled
              class="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

        </div>

        <div class="mt-4">
          <button
            @click="saveProfile"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- ACADEMIC + PARENT INFO -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="font-semibold mb-2">Academic Info</h2>

        <p>
          Class: {{ student.current_class?.name || '-' }}
          -
          Section: {{ student.current_section?.name || '-' }}
        </p>

        <h2 class="font-semibold mt-4 mb-2">Parent Information</h2>

        <p>
          Father: {{ student.family?.father?.user?.name || '-' }}
        </p>

        <p>
          Mother: {{ student.family?.mother?.user?.name || '-' }}
        </p>
      </div>

    </div>

    <!-- ERROR -->
    <div v-else class="text-center text-red-600">
      Failed to load profile
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import studentApi from '../../services/studentApi'

const loading = ref(true)
const student = ref(null)
const selectedFile = ref(null)

const baseURL = 'http://localhost:8000'

/* ================= PHOTO ================= */
const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0]
}

const getPhotoUrl = () => {
  if (student.value?.user?.photo) {
    return baseURL + '/storage/' + student.value.user.photo
  }
  return '/favicon.ico'
}

const uploadPhoto = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('photo', selectedFile.value)

  const token = localStorage.getItem('access_token')

  await fetch(baseURL + '/api/student/photo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })

  selectedFile.value = null
  await fetchProfile()
}

/* ================= PROFILE ================= */
const fetchProfile = async () => {
  loading.value = true

  try {
    const res = await studentApi.getProfile()

    if (res.data.success) {
      student.value = res.data.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  try {
    await studentApi.updateProfile({
      phone: student.value.user.phone
    })

    alert('Profile updated')
  } catch (err) {
    console.error(err)
    alert('Update failed')
  }
}

onMounted(fetchProfile)
</script>