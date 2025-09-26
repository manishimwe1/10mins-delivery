import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real app this would use actual database
const products = [
  {
    id: 1,
    name: "Fresh Bananas",
    description: "Organic bananas from local farms",
    price: 2.99,
    category: "Fruits",
    image_url: "/fresh-bananas.jpg",
    stock_quantity: 50,
    is_active: true,
  },
  {
    id: 2,
    name: "Whole Milk",
    description: "Fresh whole milk 1L",
    price: 3.49,
    category: "Dairy",
    image_url: "/milk-carton.png",
    stock_quantity: 30,
    is_active: true,
  },
  {
    id: 3,
    name: "Bread Loaf",
    description: "Freshly baked white bread",
    price: 2.79,
    category: "Bakery",
    image_url: "/rustic-bread-loaf.png",
    stock_quantity: 25,
    is_active: true,
  },
  {
    id: 4,
    name: "Chicken Breast",
    description: "Fresh chicken breast 1kg",
    price: 8.99,
    category: "Meat",
    image_url: "/grilled-chicken-breast.png",
    stock_quantity: 20,
    is_active: true,
  },
  {
    id: 5,
    name: "Tomatoes",
    description: "Fresh red tomatoes 500g",
    price: 3.99,
    category: "Vegetables",
    image_url: "/red-tomatoes.jpg",
    stock_quantity: 40,
    is_active: true,
  },
  {
    id: 6,
    name: "Orange Juice",
    description: "Fresh orange juice 1L",
    price: 4.99,
    category: "Beverages",
    image_url: "/glass-of-orange-juice.png",
    stock_quantity: 35,
    is_active: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let filteredProducts = products.filter((p) => p.is_active)

    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    if (search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({ products: filteredProducts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, stock_quantity } = body

    // Validate required fields
    if (!name || !price || !category || stock_quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newProduct = {
      id: products.length + 1,
      name,
      description: description || "",
      price: Number.parseFloat(price),
      category,
      image_url: "/placeholder.svg",
      stock_quantity: Number.parseInt(stock_quantity),
      is_active: true,
    }

    products.push(newProduct)

    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
