<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Vigo Store</h1>

    <!-- Search & Filter -->
    <div class="flex gap-4 mb-8">
      <input 
        v-model="search" 
        placeholder="Search products..." 
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select 
        v-model="selectedCategory" 
        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
      </select>
    </div>

    <!-- Products Grid -->
    <div v-if="pending" class="text-center py-12">Loading...</div>
    <div v-else-if="data?.products?.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="product in data.products" :key="product.id" :product="product" />
    </div>
    <div v-else class="text-center py-12 text-gray-500">No products found</div>

    <!-- Pagination -->
    <div v-if="data?.pagination?.totalPages > 1" class="flex justify-center gap-2 mt-8">
      <button 
        v-for="p in data.pagination.totalPages" 
        :key="p"
        @click="page = p"
        :class="['px-4 py-2 rounded border', page === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>

<script setup>
const page = ref(1)
const search = ref('')
const selectedCategory = ref('')

const { data, pending } = useFetch('/api/products', {
  query: computed(() => ({
    page: page.value,
    search: search.value,
    category: selectedCategory.value,
    limit: 12
  })),
  watch: [page, search, selectedCategory]
})

const { data: categories } = await useFetch('/api/categories')
</script>
