import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real app this would use actual database
const riders = [
  {
    id: 1,
    user_id: 2,
    name: "John Rider",
    email: "rider1@quickdelivery.com",
    phone: "+1 (555) 111-2222",
    vehicle_type: "Motorcycle",
    license_plate: "ABC-123",
    is_available: true,
    total_deliveries: 127,
    rating: 4.8,
    current_location: "Downtown Area",
  },
  {
    id: 2,
    user_id: 3,
    name: "Sarah Delivery",
    email: "rider2@quickdelivery.com",
    phone: "+1 (555) 333-4444",
    vehicle_type: "Bicycle",
    license_plate: "XYZ-789",
    is_available: false,
    total_deliveries: 89,
    rating: 4.9,
    current_location: "Midtown Area",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const available_only = searchParams.get("available_only")

    let filteredRiders = riders

    if (available_only === "true") {
      filteredRiders = riders.filter((r) => r.is_available)
    }

    return NextResponse.json({ riders: filteredRiders })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch riders" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { rider_id, is_available } = body

    const riderIndex = riders.findIndex((r) => r.id === rider_id)

    if (riderIndex === -1) {
      return NextResponse.json({ error: "Rider not found" }, { status: 404 })
    }

    // Update rider availability
    riders[riderIndex] = {
      ...riders[riderIndex],
      is_available: is_available,
    }

    return NextResponse.json({ rider: riders[riderIndex] })
  } catch (error) {
    console.error("Error updating rider:", error)
    return NextResponse.json({ error: "Failed to update rider" }, { status: 500 })
  }
}
