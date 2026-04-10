<template>
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold text-blue-600">Vigo Store</NuxtLink>
      
      <nav class="flex items-center gap-6">
        <NuxtLink to="/" class="text-gray-700 hover:text-blue-600">Products</NuxtLink>
        <NuxtLink to="/cart" class="relative text-gray-700 hover:text-blue-600">
          Cart
          <span v-if="cartCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ cartCount }}
          </span>
        </NuxtLink>
        <NuxtLink to="/dashboard" class="text-gray-700 hover:text-blue-600">Admin</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
const cart = useCartStore()
const cartCount = computed(() => cart.count)
</script>
