<template>
  <div class="student-form">
    <h2>Student Form</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="firstName">First Name:</label>
        <input v-model="form.firstName" id="firstName" type="text" required />
      </div>

      <div>
        <label for="lastName">Last Name:</label>
        <input v-model="form.lastName" id="lastName" type="text" required />
      </div>

      <div>
        <label for="studentID">ID:</label>
        <input v-model="form.studentID" id="studentID" type="text" required />
      </div>

      <div>
        <label for="course">Course:</label>
        <input v-model="form.course" id="course" type="text" required />
      </div>

      <button type="submit">Submit</button>
    </form>

    <p v-if="message">{{ message }}</p>

    <!-- Optional: Show all students -->
    <div v-if="students.length" style="margin-top:20px;">
      <h3>All Students:</h3>
      <ul>
        <li v-for="(s, index) in students" :key="index">
          {{ s.firstName }} {{ s.lastName }} - {{ s.studentID }} - {{ s.course }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  firstName: '',
  lastName: '',
  studentID: '',
  course: ''
})

const message = ref('')
const students = ref([])

async function submitForm() {
  try {
    const res = await fetch('http://localhost:5000/poststudentForm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    // Check for errors
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'Server error')
    }

    const data = await res.json()
    message.value = `Form submitted! Welcome, ${data.firstName} ${data.lastName}`

    // Reset the form
    form.value = {
      firstName: '',
      lastName: '',
      studentID: '',
      course: ''
    }

    // Optional: fetch all students to display
    await fetchStudents()
  } catch (err) {
    console.error(err)
    message.value = `Error submitting form: ${err.message}`
  }
}

// Optional: fetch all students from backend
async function fetchStudents() {
  try {
    const res = await fetch('http://localhost:5000/getstudentForm')
    students.value = await res.json()
  } catch (err) {
    console.error('Error fetching students:', err)
  }
}

// Fetch students on load
fetchStudents()
</script>

<style scoped>
.student-form {
  max-width: 400px;
  margin: auto;
}
</style>
