import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    addItem(product: Omit<CartItem, 'quantity'>) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter(i => i.id !== id)
    },
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          this.items = this.items.filter(i => i.id !== id)
        }
      }
    },
    clearCart() {
      this.items = []
    }
  }
})
