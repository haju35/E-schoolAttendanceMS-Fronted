<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm fixed w-full z-20 top-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Hamburger + Title -->
          <div class="flex items-center">
            <button @click="toggleSidebar" class="md:hidden mr-4 text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span class="text-xl font-bold text-indigo-600">E-School Attendance</span>
          </div>

          <!-- Profile menu -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="toggleProfileMenu"
                class="flex items-center space-x-2 focus:outline-none">
                <div
                  class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-600 font-semibold">{{ studentInitials }}</span>
                </div>
                <span class="text-gray-700 hidden md:block">{{ studentName }}</span>
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <router-link to="/student/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showProfileMenu = false">My Profile</router-link>
                <router-link to="/student/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showProfileMenu = false">Change Password</router-link>
                <hr class="my-1">
                <a href="#" @click="logout"
                  class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <div :class="[
        'fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg mt-16 transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">
      <div class="h-full overflow-y-auto">
        <div class="px-4 py-6 border-b">
          <div class="flex items-start space-x-3">
          
            
          </div>
        </div>

        <nav class="mt-5 px-2 space-y-1">
          <router-link to="/student/dashboard"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/student/dashboard' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6"
              :class="[$route.path === '/student/dashboard' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            Dashboard
          </router-link>

          <router-link to="/student/attendance"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path.includes('/student/attendance') ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6"
              :class="[$route.path.includes('/student/attendance') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            My Attendance
          </router-link>

          <router-link to="/student/profile"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/student/profile' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6"
              :class="[$route.path === '/student/profile' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            My Profile
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main :class="['pt-16 transition-all duration-200','md:pl-64', sidebarOpen ? 'md:pl-64' : 'md:pl-0']">
      <router-view />
    </main>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
      @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import studentApi from '../../services/studentApi'

const router = useRouter()
const user = useAuth()
const sidebarOpen = ref(false)
const showProfileMenu = ref(false)
const studentName = ref('')
const studentClass = ref('')
const rollNumber = ref('')

const studentInitials = computed(() => {
  return studentName.value ? studentName.value.charAt(0).toUpperCase() : 'S'
})

const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const toggleProfileMenu = () => showProfileMenu.value = !showProfileMenu.value

const fetchStudentInfo = async () => {
  try {
    const res = await studentApi.getProfile()
    const data = res.data.data

    studentName.value = data.user.name
    studentClass.value = `${data.current_class?.name || ''} - ${data.current_section?.name || ''}`
    rollNumber.value = data.roll_number || '-'
  } catch (error) {
    console.error(error)
  }
}

const logout = () => {
  user.logout()
  router.push('/login')
}

onMounted(() => fetchStudentInfo())
</script>