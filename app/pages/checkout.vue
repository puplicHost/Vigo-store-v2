<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div v-if="cart.items.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
      <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Shop Now
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Order Summary</h2>
        <div v-for="item in cart.items" :key="item.id" class="flex justify-between py-2 border-b">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
          <span>Total</span>
          <span>${{ cart.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Auth Warning -->
      <div v-if="!isAuthenticated" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-yellow-800">
          Please <NuxtLink to="/auth/login" class="underline font-medium">login</NuxtLink> 
          or <NuxtLink to="/auth/register" class="underline font-medium">register</NuxtLink> 
          to complete your order.
        </p>
      </div>

      <!-- Place Order Button -->
      <button 
        @click="placeOrder" 
        :disabled="loading || cart.items.length === 0 || !isAuthenticated"
        class="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Placing Order...' : 'Place Order' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const cart = useCartStore()
const router = useRouter()
const loading = ref(false)

// Simple auth check - in real app, use proper auth store
const isAuthenticated = ref(false)

onMounted(() => {
  // Check for token in localStorage
  isAuthenticated.value = !!localStorage.getItem('token')
})

async function placeOrder() {
  if (!isAuthenticated.value) return
  
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    await $fetch('/api/orders', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { 
        items: cart.items.map(i => ({ productId: i.id, quantity: i.quantity })) 
      }
    })
    cart.clearCart()
    router.push('/order-success')
  } catch (error) {
    alert('Failed to place order. Please try again.')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
