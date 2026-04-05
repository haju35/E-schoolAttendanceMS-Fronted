<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Students</h2>

      <button
        @click="showModal = true"
        class="mt-3 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        + Add Student
      </button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        @input="fetchStudents"
        type="text"
        placeholder="Search student..."
        class="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">#</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Email</th>
            <th class="p-3 text-left">Admission No</th>
            <th class="p-3 text-left">Class</th>
            <th class="p-3 text-left">Section</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(student, index) in students.data"
            :key="student.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ student.user?.name }}</td>
            <td class="p-3">{{ student.user?.email }}</td>
            <td class="p-3">{{ student.admission_number }}</td>
            <td class="p-3">{{ student.currentClass?.name }}</td>
            <td class="p-3">{{ student.currentSection?.name }}</td>

            <td class="p-3 text-right space-x-2">
              <button
                @click="editStudent(student)"
                class="text-yellow-600 hover:underline"
              >
                Edit
              </button>

              <button
                @click="deleteStudent(student.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!students.data || students.data.length === 0">
            <td colspan="7" class="text-center p-4 text-gray-500">
              No students found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        class="mt-4 flex justify-center items-center space-x-2"
        v-if="students.meta"
      >
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="!students.links.prev"
          @click="fetchStudents(students.meta.current_page - 1)"
        >
          Prev
        </button>

        <span class="px-3 py-1">
          {{ students.meta.current_page }} / {{ students.meta.last_page }}
        </span>

        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="!students.links.next"
          @click="fetchStudents(students.meta.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] animate-fade-in"
      >
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Add Student</h3>

        <form @submit.prevent="createStudent" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1">Name</label>
              <input
                v-model="form.name"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Confirm Password</label>
              <input
                v-model="form.password_confirmation"
                type="password"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Phone</label>
              <input
                v-model="form.phone"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Address</label>
              <input
                v-model="form.address"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Admission Number</label>
              <input
                v-model="form.admission_number"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Roll Number</label>
              <input
                v-model="form.roll_number"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Date of Birth</label>
              <input
                v-model="form.date_of_birth"
                type="date"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Gender</label>
              <select
                v-model="form.gender"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1">Class</label>
              <select
                v-model="form.current_class_id"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select Class</option>
                <option v-for="c in classes" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1">Section</label>
              <select
                v-model="form.current_section_id"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select Section</option>
                <option v-for="s in sections" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1">Admission Date</label>
              <input
                v-model="form.admission_date"
                type="date"
                class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";


const students = ref({});
const classes = ref([]);
const sections = ref([]);
const search = ref("");
const showModal = ref(false);

const token = localStorage.getItem("access_token");
const headers = { Authorization: `Bearer ${token}` };

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone: "",
  address: "",
  admission_number: "",
  roll_number: "",
  date_of_birth: "",
  gender: "female",
  current_class_id: "",
  current_section_id: "",
  admission_date: "",
});

// Fetch students
const fetchStudents = async (page = 1) => {
  try {
    const res = await api.get('admin/students');

    // Map backend snake_case to camelCase
    students.value = res.data.data.data.map((s) => ({
      ...s,
      currentClass: s.current_class,
      currentSection: s.current_section,
    }));

    // Pagination meta and links
    students.value = {
      data: students.value,
      meta: res.data.data.meta,
      links: res.data.data.links,
    };
  } catch (err) {
    console.error(err);
  }
};

// Fetch classes
const fetchClasses = async () => {
  const res = await api.get('admin/classes');
  classes.value = res.data.data.data || res.data.data;
};

// Fetch sections
const fetchSections = async () => {
  const res = await api.get('admin/sections');
  sections.value = res.data.data.data || res.data.data;
};

// Create student
const createStudent = async () => {
  try {
    await api.post('/admin/sections/bulk', payload);
    alert("Student created successfully");
    showModal.value = false;
    form.value = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      address: "",
      admission_number: "",
      roll_number: "",
      date_of_birth: "",
      gender: "female",
      current_class_id: "",
      current_section_id: "",
      admission_date: "",
    };
    fetchStudents();
  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || "Error creating student");
  }
};

// Delete student
const deleteStudent = async (id) => {
  if (!confirm("Delete this student?")) return;
  try {
    await axios.delete(`${API}/${id}`, { headers });
    fetchStudents();
  } catch (err) {
    console.error(err);
  }
};

const editStudent = (student) => {
  console.log("Edit student", student);
};

onMounted(() => {
  fetchStudents();
  fetchClasses();
  fetchSections();
});
</script>