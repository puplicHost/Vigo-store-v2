<template>
  <div v-if="product" class="max-w-4xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span v-if="!product.image" class="text-gray-400">No Image</span>
        <img v-else :src="product.image" :alt="product.name" class="h-full w-full object-cover rounded-lg">
      </div>

      <!-- Product Details -->
      <div>
        <div class="text-sm text-gray-500 mb-2">{{ product.category?.name }}</div>
        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
        <p class="text-gray-600 mb-6">{{ product.description || 'No description available' }}</p>

        <div class="text-3xl font-bold text-blue-600 mb-6">${{ product.price.toFixed(2) }}</div>

        <div class="mb-6">
          <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
            {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
          </span>
        </div>

        <div class="flex gap-4">
          <div class="flex items-center border rounded-lg">
            <button @click="quantity = Math.max(1, quantity - 1)" class="px-4 py-2 hover:bg-gray-100">-</button>
            <span class="px-4 py-2">{{ quantity }}</span>
            <button @click="quantity = Math.min(product.stock, quantity + 1)" class="px-4 py-2 hover:bg-gray-100">+</button>
          </div>
          <button 
            @click="addToCart"
            :disabled="product.stock === 0"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="pending" class="text-center py-12">Loading...</div>
  <div v-else class="text-center py-12 text-gray-500">Product not found</div>
</template>

<script setup>
const route = useRoute()
const cart = useCartStore()
const toast = useToast()

const quantity = ref(1)

const { data: product, pending } = await useFetch(`/api/products/${route.params.id}`)

function addToCart() {
  for (let i = 0; i < quantity.value; i++) {
    cart.addItem({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image
    })
  }
  toast.show(`Added ${quantity.value} to cart!`, 'success')
}
</script>
