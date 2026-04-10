<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center">Login</h1>

    <form @submit.prevent="handleLogin" class="bg-white rounded-lg shadow p-6 space-y-4">
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
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p class="text-center text-gray-600">
        Don't have an account? 
        <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">Register</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    
    // Store token
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    // Redirect to checkout if coming from there, otherwise home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    alert('Invalid credentials')
  } finally {
    loading.value = false
  }
}
</script>
