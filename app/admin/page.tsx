"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Clock,
  DollarSign,
  Eye,
  UserCheck,
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock_quantity: number
  is_active: boolean
}

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  total_amount: number
  status: "pending" | "in_progress" | "delivered" | "cancelled"
  payment_method: string
  delivery_address: string
  created_at: string
  rider_name?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

interface Rider {
  id: number
  name: string
  phone: string
  vehicle_type: string
  is_available: boolean
  total_deliveries: number
  rating: number
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Fresh Bananas",
        description: "Organic bananas from local farms",
        price: 2.99,
        category: "Fruits",
        stock_quantity: 50,
        is_active: true,
      },
      {
        id: 2,
        name: "Whole Milk",
        description: "Fresh whole milk 1L",
        price: 3.49,
        category: "Dairy",
        stock_quantity: 30,
        is_active: true,
      },
      {
        id: 3,
        name: "Bread Loaf",
        description: "Freshly baked white bread",
        price: 2.79,
        category: "Bakery",
        stock_quantity: 25,
        is_active: true,
      },
    ]

    const mockOrders: Order[] = [
      {
        id: "ORD-2024-001",
        customer_name: "Jane Customer",
        customer_phone: "+1 (555) 123-4567",
        total_amount: 14.25,
        status: "pending",
        payment_method: "Cash on Delivery",
        delivery_address: "123 Main Street, Apt 4B, Downtown",
        created_at: "2024-01-15T10:30:00Z",
        items: [
          { name: "Fresh Bananas", quantity: 2, price: 2.99 },
          { name: "Whole Milk", quantity: 1, price: 3.49 },
          { name: "Bread Loaf", quantity: 1, price: 2.79 },
        ],
      },
      {
        id: "ORD-2024-002",
        customer_name: "Mike Johnson",
        customer_phone: "+1 (555) 987-6543",
        total_amount: 14.97,
        status: "in_progress",
        payment_method: "Mobile Money",
        delivery_address: "456 Oak Avenue, Suite 12, Midtown",
        created_at: "2024-01-15T10:45:00Z",
        rider_name: "John Rider",
        items: [
          { name: "Chicken Breast", quantity: 1, price: 8.99 },
          { name: "Tomatoes", quantity: 1, price: 3.99 },
        ],
      },
      {
        id: "ORD-2024-003",
        customer_name: "Sarah Wilson",
        customer_phone: "+1 (555) 456-7890",
        total_amount: 16.46,
        status: "delivered",
        payment_method: "Cash on Delivery",
        delivery_address: "789 Pine Street, Floor 3, Uptown",
        created_at: "2024-01-15T09:15:00Z",
        rider_name: "Sarah Delivery",
        items: [
          { name: "Orange Juice", quantity: 2, price: 4.99 },
          { name: "Greek Yogurt", quantity: 1, price: 4.49 },
        ],
      },
    ]

    const mockRiders: Rider[] = [
      {
        id: 1,
        name: "John Rider",
        phone: "+1 (555) 111-2222",
        vehicle_type: "Motorcycle",
        is_available: true,
        total_deliveries: 127,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Sarah Delivery",
        phone: "+1 (555) 333-4444",
        vehicle_type: "Bicycle",
        is_available: false,
        total_deliveries: 89,
        rating: 4.9,
      },
    ]

    setProducts(mockProducts)
    setOrders(mockOrders)
    setRiders(mockRiders)
  }, [])

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
    activeRiders: riders.filter((r) => r.is_available).length,
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const assignRider = (orderId: string, riderId: number) => {
    const rider = riders.find((r) => r.id === riderId)
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "in_progress" as const, rider_name: rider?.name } : order,
      ),
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>
            </div>
            <Badge variant="outline">Administrator</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Riders</p>
                  <p className="text-2xl font-bold">{stats.activeRiders}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="riders">Riders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage all customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rider</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{order.customer_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(order.status)}>{order.status.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.rider_name ? (
                            <span className="text-sm">{order.rider_name}</span>
                          ) : (
                            <Select onValueChange={(value) => assignRider(order.id, Number.parseInt(value))}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {riders
                                  .filter((r) => r.is_available)
                                  .map((rider) => (
                                    <SelectItem key={rider.id} value={rider.id.toString()}>
                                      {rider.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                                <DialogDescription>Complete order information</DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Customer</Label>
                                      <p className="text-sm">{selectedOrder.customer_name}</p>
                                      <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                                    </div>
                                    <div>
                                      <Label>Payment Method</Label>
                                      <p className="text-sm">{selectedOrder.payment_method}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Delivery Address</Label>
                                    <p className="text-sm text-pretty">{selectedOrder.delivery_address}</p>
                                  </div>
                                  <div>
                                    <Label>Items</Label>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span>
                                            {item.quantity}x {item.name}
                                          </span>
                                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                      ))}
                                      <div className="border-t pt-2 font-medium">
                                        Total: ${selectedOrder.total_amount.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your product catalog and inventory</CardDescription>
                  </div>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Create a new product in your catalog</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input id="name" placeholder="Enter product name" />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" placeholder="Product description" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" step="0.01" placeholder="0.00" />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input id="stock" type="number" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fruits">Fruits</SelectItem>
                              <SelectItem value="vegetables">Vegetables</SelectItem>
                              <SelectItem value="dairy">Dairy</SelectItem>
                              <SelectItem value="meat">Meat</SelectItem>
                              <SelectItem value="bakery">Bakery</SelectItem>
                              <SelectItem value="beverages">Beverages</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsAddProductOpen(false)}>Add Product</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground text-pretty">{product.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock_quantity > 10 ? "default" : "destructive"}>
                            {product.stock_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riders Tab */}
          <TabsContent value="riders">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Rider Management</CardTitle>
                <CardDescription>Manage delivery riders and their availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rider</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riders.map((rider) => (
                      <TableRow key={rider.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rider.name}</div>
                            <div className="text-sm text-muted-foreground">{rider.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{rider.vehicle_type}</TableCell>
                        <TableCell>{rider.total_deliveries}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{rider.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rider.is_available ? "default" : "secondary"}>
                            {rider.is_available ? "Available" : "Offline"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Order Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Today&apos;s Orders</span>
                      <span className="font-medium">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value</span>
                      <span className="font-medium">${(stats.totalRevenue / stats.totalOrders).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-medium">
                        {((orders.filter((o) => o.status === "delivered").length / orders.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{product.stock_quantity} sold</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
