<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center">Register</h1>

    <form @submit.prevent="handleRegister" class="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input 
          v-model="name" 
          type="text" 
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          v-model="email" 
          type="email" 
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          v-model="password" 
          type="password" 
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>

      <p class="text-center text-gray-600">
        Already have an account? 
        <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">Login</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { 
        name: name.value, 
        email: email.value, 
        password: password.value 
      }
    })
    
    // Store token
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    router.push('/')
  } catch (error) {
    alert('Registration failed. Email may already exist.')
  } finally {
    loading.value = false
  }
}
</script>
