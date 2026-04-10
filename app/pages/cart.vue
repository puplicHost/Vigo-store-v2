<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cart.items.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
      <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <!-- Cart Items -->
      <div class="bg-white rounded-lg shadow">
        <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 p-4 border-b last:border-b-0">
          <div class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
            <span v-if="!item.image" class="text-xs text-gray-400">No Image</span>
            <img v-else :src="item.image" class="w-full h-full object-cover rounded">
          </div>
          
          <div class="flex-1">
            <NuxtLink :to="`/products/${item.id}`" class="font-semibold hover:text-blue-600">
              {{ item.name }}
            </NuxtLink>
            <p class="text-gray-600">${{ item.price.toFixed(2) }}</p>
          </div>

          <div class="flex items-center border rounded-lg">
            <button @click="updateQuantity(item.id, item.quantity - 1)" class="px-3 py-1 hover:bg-gray-100">-</button>
            <span class="px-3 py-1">{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)" class="px-3 py-1 hover:bg-gray-100">+</button>
          </div>

          <div class="text-right min-w-[100px]">
            <p class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>

          <button @click="cart.removeItem(item.id)" class="text-red-500 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg">Subtotal ({{ cart.count }} items)</span>
          <span class="text-2xl font-bold">${{ cart.total.toFixed(2) }}</span>
        </div>
        <NuxtLink 
          to="/checkout" 
          class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
        >
          Proceed to Checkout
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const cart = useCartStore()

function updateQuantity(id, quantity) {
  cart.updateQuantity(id, quantity)
}
</script>
