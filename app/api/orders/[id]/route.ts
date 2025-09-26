import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real app this would use actual database
const orders: any[] = [
  {
    id: "ORD-2024-001",
    customer_id: 1,
    customer_name: "Jane Customer",
    customer_phone: "+1 (555) 123-4567",
    total_amount: 14.25,
    status: "pending",
    payment_method: "cash",
    delivery_address: "123 Main Street, Apt 4B, Downtown",
    notes: "",
    rider_id: null,
    rider_name: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      { product_id: 1, name: "Fresh Bananas", quantity: 2, unit_price: 2.99, total_price: 5.98 },
      { product_id: 2, name: "Whole Milk", quantity: 1, unit_price: 3.49, total_price: 3.49 },
      { product_id: 3, name: "Bread Loaf", quantity: 1, unit_price: 2.79, total_price: 2.79 },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = orders.find((o) => o.id === params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, rider_id, rider_name } = body

    const orderIndex = orders.findIndex((o) => o.id === params.id)

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...(status && { status }),
      ...(rider_id && { rider_id }),
      ...(rider_name && { rider_name }),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ order: orders[orderIndex] })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
