<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-6">Admin Settings</h2>

    <!-- Profile Section -->
    <div class="bg-white shadow rounded p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Profile Information</h3>

      <form @submit.prevent="updateProfile">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.name" type="text" placeholder="Name" class="input" />
          <input v-model="form.email" type="email" placeholder="Email" class="input" />
          <input v-model="form.phone" type="text" placeholder="Phone" class="input" />
          <input v-model="form.address" type="text" placeholder="Address" class="input" />
        </div>

        <button class="btn mt-4">Update Profile</button>
      </form>
    </div>

    <!-- Password Section -->
    <div class="bg-white shadow rounded p-6">
      <h3 class="text-lg font-semibold mb-4">Change Password</h3>

      <form @submit.prevent="changePassword">
        <input v-model="password.current" type="password" placeholder="Current Password" class="input mb-3" />
        <input v-model="password.new" type="password" placeholder="New Password" class="input mb-3" />
        <input v-model="password.confirm" type="password" placeholder="Confirm Password" class="input mb-3" />

        <button class="btn">Update Password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from '@/services/api';

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: ""
});

const password = ref({
  current: "",
  new: "",
  confirm: ""
});

// Fetch profile
const fetchProfile = async () => {
  try {
    const res = await api.get("/auth/profile");
    form.value = res.data;
  } catch (err) {
    console.error("Error loading profile", err);
  }
};

// Update profile
const updateProfile = async () => {
  try {
    await api.put("/auth/profile", form.value);
    alert("Profile updated!");
  } catch (err) {
    console.error(err);
  }
};

// Change password
const changePassword = async () => {
  try {
    await api.post("/auth/change-password", {
      current_password: password.value.current,
      password: password.value.new,
      password_confirmation: password.value.confirm
    });
    alert("Password updated!");
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchProfile);
</script>

<style>
.input {
  @apply w-full border p-2 rounded;
}
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>