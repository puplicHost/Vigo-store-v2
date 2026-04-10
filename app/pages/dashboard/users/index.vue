<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Users</h1>

    <div v-if="pending" class="text-center py-12">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Name</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Role</th>
            <th class="px-4 py-3 text-left">Orders</th>
            <th class="px-4 py-3 text-left">Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t">
            <td class="px-4 py-3">{{ user.id }}</td>
            <td class="px-4 py-3">{{ user.name }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span :class="user.role === 'ADMIN' ? 'text-purple-600 font-medium' : 'text-gray-600'">
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-3">{{ user._count?.orders || 0 }}</td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(user.createdAt) }}</td>
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

const { data: users, pending } = await useFetch('/api/admin/users')

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
</script>
