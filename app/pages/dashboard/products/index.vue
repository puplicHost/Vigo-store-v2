<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Product
      </button>
    </div>

    <div v-if="pending" class="text-center py-12">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Name</th>
            <th class="px-4 py-3 text-left">Category</th>
            <th class="px-4 py-3 text-left">Price</th>
            <th class="px-4 py-3 text-left">Stock</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-t">
            <td class="px-4 py-3">{{ product.id }}</td>
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">{{ product.category?.name }}</td>
            <td class="px-4 py-3">${{ product.price.toFixed(2) }}</td>
            <td class="px-4 py-3">{{ product.stock }}</td>
            <td class="px-4 py-3">
              <span :class="product.isActive ? 'text-green-600' : 'text-red-600'">
                {{ product.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-3 space-x-2">
              <button @click="editProduct(product)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="deleteProduct(product.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { data: products, pending, refresh } = await useFetch('/api/admin/products')
const showAddModal = ref(false)
const editingProduct = ref(null)

function editProduct(product) {
  editingProduct.value = { ...product }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return
  await $fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
  refresh()
}
</script>
