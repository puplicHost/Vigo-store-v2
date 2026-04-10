<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Orders</h1>

    <div v-if="pending" class="text-center py-12">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Order #</th>
            <th class="px-4 py-3 text-left">Customer</th>
            <th class="px-4 py-3 text-left">Items</th>
            <th class="px-4 py-3 text-left">Total</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Date</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-t">
            <td class="px-4 py-3">#{{ order.id }}</td>
            <td class="px-4 py-3">{{ order.user?.name || order.user?.email }}</td>
            <td class="px-4 py-3">{{ order.items?.length || 0 }} items</td>
            <td class="px-4 py-3">${{ order.total.toFixed(2) }}</td>
            <td class="px-4 py-3">
              <span :class="statusClass(order.status)">{{ order.status }}</span>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(order.createdAt) }}</td>
            <td class="px-4 py-3">
              <select 
                v-model="order.status" 
                @change="updateStatus(order.id, order.status)"
                class="border rounded px-2 py-1 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
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

const { data: ordersData, pending, refresh } = useFetch('/api/admin/orders', {
  lazy: true,
  server: false,
  default: () => []
})
const orders = computed(() => ordersData.value || [])

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

async function updateStatus(id, status) {
  await $fetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: { status }
  })
  refresh()
}
</script>
