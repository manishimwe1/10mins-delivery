// API utility functions for client-side data fetching

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_quantity: number
  is_active: boolean
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  total_amount: number
  status: "pending" | "in_progress" | "delivered" | "cancelled"
  payment_method: string
  delivery_address: string
  notes?: string
  rider_id?: number
  rider_name?: string
  created_at: string
  updated_at?: string
  items: Array<{
    product_id: number
    name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export interface Rider {
  id: number
  name: string
  phone: string
  vehicle_type: string
  is_available: boolean
  total_deliveries: number
  rating: number
}

// Products API
export const productsApi = {
  getAll: async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)

    const response = await fetch(`/api/products?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch products")
    const data = await response.json()
    return data.products
  },

  create: async (product: Omit<Product, "id" | "image_url" | "is_active">): Promise<Product> => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error("Failed to create product")
    const data = await response.json()
    return data.product
  },
}

// Orders API
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch("/api/orders")
    if (!response.ok) throw new Error("Failed to fetch orders")
    const data = await response.json()
    return data.orders
  },

  getById: async (id: string): Promise<Order> => {
    const response = await fetch(`/api/orders/${id}`)
    if (!response.ok) throw new Error("Failed to fetch order")
    const data = await response.json()
    return data.order
  },

  create: async (orderData: {
    customer_name: string
    customer_phone: string
    delivery_address: string
    payment_method: string
    items: Array<{
      id: number
      name: string
      price: number
      quantity: number
    }>
    notes?: string
  }): Promise<Order> => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) throw new Error("Failed to create order")
    const data = await response.json()
    return data.order
  },

  update: async (
    id: string,
    updates: {
      status?: string
      rider_id?: number
      rider_name?: string
    },
  ): Promise<Order> => {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update order")
    const data = await response.json()
    return data.order
  },
}

// Riders API
export const ridersApi = {
  getAll: async (availableOnly = false): Promise<Rider[]> => {
    const params = availableOnly ? "?available_only=true" : ""
    const response = await fetch(`/api/riders${params}`)
    if (!response.ok) throw new Error("Failed to fetch riders")
    const data = await response.json()
    return data.riders
  },

  updateAvailability: async (riderId: number, isAvailable: boolean): Promise<Rider> => {
    const response = await fetch("/api/riders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rider_id: riderId, is_available: isAvailable }),
    })
    if (!response.ok) throw new Error("Failed to update rider")
    const data = await response.json()
    return data.rider
  },
}
