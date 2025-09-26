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
    payment_status: "pending",
    delivery_address: "123 Main Street, Apt 4B, Downtown",
    notes: "",
    created_at: new Date().toISOString(),
    items: [
      { product_id: 1, name: "Fresh Bananas", quantity: 2, unit_price: 2.99, total_price: 5.98 },
      { product_id: 2, name: "Whole Milk", quantity: 1, unit_price: 3.49, total_price: 3.49 },
      { product_id: 3, name: "Bread Loaf", quantity: 1, unit_price: 2.79, total_price: 2.79 },
    ],
  },
]

export async function GET() {
  try {
    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, customer_phone, delivery_address, payment_method, items, notes } = body

    // Validate required fields
    if (!customer_name || !customer_phone || !delivery_address || !payment_method || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) + 1.99 // Add delivery fee

    // Generate order ID
    const orderId = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`

    const newOrder = {
      id: orderId,
      customer_id: 1, // Mock customer ID
      customer_name,
      customer_phone,
      total_amount,
      status: "pending",
      payment_method,
      payment_status: payment_method === "cash" ? "pending" : "processing", // added payment status tracking
      delivery_address,
      notes: notes || "",
      created_at: new Date().toISOString(),
      items: items.map((item: any) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      })),
    }

    orders.push(newOrder)

    return NextResponse.json({ order: newOrder }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
