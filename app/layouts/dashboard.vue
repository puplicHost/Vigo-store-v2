<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">Vigo Admin</h2>
      </div>
      <nav class="p-4 space-y-2">
        <NuxtLink to="/dashboard" class="sidebar-link">Dashboard</NuxtLink>
        <NuxtLink to="/dashboard/products" class="sidebar-link">Products</NuxtLink>
        <NuxtLink to="/dashboard/orders" class="sidebar-link">Orders</NuxtLink>
        <NuxtLink to="/dashboard/users" class="sidebar-link">Users</NuxtLink>
        <NuxtLink to="/" class="sidebar-link text-blue-600">Back to Store</NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 class="text-lg font-semibold text-gray-700">Admin Panel</h1>
        <button @click="logout" class="text-red-500 hover:underline">Logout</button>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

function logout() {
  // Clear auth and redirect
  router.push('/auth/login')
}
</script>

<style scoped>
.sidebar-link {
  @apply block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition;
}
.sidebar-link.router-link-active {
  @apply bg-blue-50 text-blue-600 font-medium;
}
</style>
