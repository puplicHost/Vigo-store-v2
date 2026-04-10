<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard Overview</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Products</h3>
        <p class="text-3xl font-bold text-blue-600">{{ stats?.products || 0 }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Orders</h3>
        <p class="text-3xl font-bold text-green-600">{{ stats?.orders || 0 }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
        <p class="text-3xl font-bold text-purple-600">{{ stats?.users || 0 }}</p>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Recent Orders</h2>
      <div v-if="pending" class="text-center py-8">Loading...</div>
      <div v-else-if="recentOrders?.length" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Customer</th>
              <th class="px-4 py-2 text-left">Total</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="border-t">
              <td class="px-4 py-2">#{{ order.id }}</td>
              <td class="px-4 py-2">{{ order.user?.name || order.user?.email }}</td>
              <td class="px-4 py-2">${{ order.total.toFixed(2) }}</td>
              <td class="px-4 py-2">
                <span :class="statusClass(order.status)">{{ order.status }}</span>
              </td>
              <td class="px-4 py-2 text-gray-500">{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-500">No orders yet</div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { data: stats, pending } = await useFetch('/api/admin/stats')
const { data: recentOrders } = await useFetch('/api/admin/orders')

function statusClass(status) {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm',
    PROCESSING: 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm',
    SHIPPED: 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm',
    DELIVERED: 'bg-green-100 text-green-800 px-2 py-1 rounded text-sm',
    CANCELLED: 'bg-red-100 text-red-800 px-2 py-1 rounded text-sm'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
</script>
