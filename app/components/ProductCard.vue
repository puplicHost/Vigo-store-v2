<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
    <NuxtLink :to="`/products/${product.id}`">
      <div class="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
        <span v-if="!product.image" class="text-gray-400">No Image</span>
        <img v-else :src="product.image" :alt="product.name" class="h-full w-full object-cover rounded-t-lg">
      </div>
    </NuxtLink>
    
    <div class="p-4">
      <div class="text-sm text-gray-500 mb-1">{{ product.category?.name }}</div>
      <NuxtLink :to="`/products/${product.id}`">
        <h3 class="font-semibold text-lg mb-2 hover:text-blue-600">{{ product.name }}</h3>
      </NuxtLink>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description || 'No description' }}</p>
      
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</span>
        <button 
          @click="addToCart" 
          :disabled="product.stock === 0"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()
const toast = useToast()

function addToCart() {
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: props.product.image
  })
  toast.show('Added to cart!', 'success')
}
</script>
