<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Submit Leave Request</h1>
      <p class="text-gray-600 dark:text-gray-400">Request leave for your child</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <form @submit.prevent="submitLeave" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Child *</label>
          <select v-model="form.child_id" required 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white">
            <option value="">Select a child</option>
            <option v-for="child in children" :key="child.id" :value="child.id">
              {{ child.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Date *</label>
            <input type="date" v-model="form.from_date" required 
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To Date *</label>
            <input type="date" v-model="form.to_date" required 
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason *</label>
          <textarea v-model="form.reason" rows="4" required placeholder="Please provide reason for leave..." 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"></textarea>
        </div>

        <div class="flex space-x-3 pt-4">
          <button type="submit" :disabled="submitting" 
                  class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {{ submitting ? 'Submitting...' : 'Submit Request' }}
          </button>
          <button type="button" @click="resetForm" 
                  class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors">
            Reset
          </button>
        </div>
      </form>

      <div v-if="message" :class="message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'" class="mt-4 p-3 rounded border">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import familyApi from '../../services/familyApi'

const router = useRouter()
const submitting = ref(false)
const children = ref([])
const message = ref(null)

const form = ref({
  child_id: '',
  from_date: '',
  to_date: '',
  reason: ''
})

const fetchChildren = async () => {
  try {
    const response = await familyApi.getChildren()
    if (response.data.success) {
      children.value = response.data.data.children || []
    }
  } catch (error) {
    console.error('Error fetching children:', error)
  }
}

const submitLeave = async () => {
  // Validate dates
  if (new Date(form.value.from_date) > new Date(form.value.to_date)) {
    message.value = { text: 'From date cannot be after to date', type: 'error' }
    return
  }
  
  submitting.value = true
  message.value = null
  
  try {
    const response = await familyApi.submitLeave(form.value)
    if (response.data.success) {
      message.value = { text: 'Leave request submitted successfully!', type: 'success' }
      resetForm()
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/family/dashboard')
      }, 2000)
    }
  } catch (error) {
    console.error('Error submitting leave:', error)
    message.value = { text: error.response?.data?.message || 'Failed to submit leave request', type: 'error' }
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    child_id: '',
    from_date: '',
    to_date: '',
    reason: ''
  }
}

onMounted(() => {
  fetchChildren()
})
</script>