<template>
  <div class="max-w-md mx-auto text-center py-12">
    <div class="text-green-500 mb-4">
      <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h1 class="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
    <p class="text-gray-600 mb-8">Thank you for your purchase. Your order is being processed.</p>
    <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
      Continue Shopping
    </NuxtLink>
  </div>
</template>
