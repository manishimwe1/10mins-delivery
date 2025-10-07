"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, MapPin, Phone, Package, CheckCircle, X, ArrowLeft, Truck, User, Navigation } from "lucide-react"
import Link from "next/link"

interface DeliveryRequest {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  paymentMethod: string
  estimatedTime: number
  distance: string
  status: "pending" | "accepted" | "in_progress" | "delivered"
  createdAt: string
}

export default function RiderDashboard() {
  const [isAvailable, setIsAvailable] = useState(true)
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryRequest[]>([])
  const [completedDeliveries, setCompletedDeliveries] = useState<DeliveryRequest[]>([])

  // Mock rider stats
  const riderStats = {
    name: "John Rider",
    rating: 4.8,
    totalDeliveries: 127,
    todayDeliveries: 8,
    earnings: 156.5,
  }

  // Mock delivery requests
  useEffect(() => {
    const mockRequests: DeliveryRequest[] = [
      {
        id: "REQ-001",
        orderId: "ORD-2024-001",
        customerName: "Jane Customer",
        customerPhone: "+1 (555) 123-4567",
        deliveryAddress: "123 Main Street, Apt 4B, Downtown",
        items: [
          { name: "Fresh Bananas", quantity: 2, price: 2.99 },
          { name: "Whole Milk", quantity: 1, price: 3.49 },
          { name: "Bread Loaf", quantity: 1, price: 2.79 },
        ],
        totalAmount: 14.25,
        paymentMethod: "Cash on Delivery",
        estimatedTime: 10,
        distance: "1.2 km",
        status: "pending",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "REQ-002",
        orderId: "ORD-2024-002",
        customerName: "Mike Johnson",
        customerPhone: "+1 (555) 987-6543",
        deliveryAddress: "456 Oak Avenue, Suite 12, Midtown",
        items: [
          { name: "Chicken Breast", quantity: 1, price: 8.99 },
          { name: "Tomatoes", quantity: 1, price: 3.99 },
        ],
        totalAmount: 14.97,
        paymentMethod: "Mobile Money",
        estimatedTime: 8,
        distance: "0.8 km",
        status: "pending",
        createdAt: "2024-01-15T10:45:00Z",
      },
    ]

    const mockActive: DeliveryRequest[] = [
      {
        id: "REQ-003",
        orderId: "ORD-2024-003",
        customerName: "Sarah Wilson",
        customerPhone: "+1 (555) 456-7890",
        deliveryAddress: "789 Pine Street, Floor 3, Uptown",
        items: [
          { name: "Orange Juice", quantity: 2, price: 4.99 },
          { name: "Greek Yogurt", quantity: 1, price: 4.49 },
        ],
        totalAmount: 16.46,
        paymentMethod: "Cash on Delivery",
        estimatedTime: 5,
        distance: "0.5 km",
        status: "in_progress",
        createdAt: "2024-01-15T09:15:00Z",
      },
    ]

    setDeliveryRequests(mockRequests)
    setActiveDeliveries(mockActive)
  }, [])

  const acceptDelivery = (requestId: string) => {
    const request = deliveryRequests.find((r) => r.id === requestId)
    if (request) {
      const updatedRequest = { ...request, status: "accepted" as const }
      setDeliveryRequests((prev) => prev.filter((r) => r.id !== requestId))
      setActiveDeliveries((prev) => [...prev, updatedRequest])
    }
  }

  const rejectDelivery = (requestId: string) => {
    setDeliveryRequests((prev) => prev.filter((r) => r.id !== requestId))
  }

  const markAsDelivered = (requestId: string) => {
    const delivery = activeDeliveries.find((d) => d.id === requestId)
    if (delivery) {
      const completedDelivery = { ...delivery, status: "delivered" as const }
      setActiveDeliveries((prev) => prev.filter((d) => d.id !== requestId))
      setCompletedDeliveries((prev) => [completedDelivery, ...prev])
    }
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
                <Truck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Rider Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
                <Label htmlFor="availability" className="text-sm">
                  {isAvailable ? "Available" : "Offline"}
                </Label>
              </div>
              <Badge variant={isAvailable ? "default" : "secondary"}>{isAvailable ? "Online" : "Offline"}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Rider Stats */}
          <div className="lg:col-span-1">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Rider Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">{riderStats.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <span>⭐ {riderStats.rating}</span>
                    <span>•</span>
                    <span>{riderStats.totalDeliveries} deliveries</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today's Deliveries</span>
                    <span className="font-medium">{riderStats.todayDeliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today's Earnings</span>
                    <span className="font-medium text-primary">${riderStats.earnings.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  View Map
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* New Delivery Requests */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">New Delivery Requests</h2>
                <Badge variant="outline">{deliveryRequests.length} pending</Badge>
              </div>

              {!isAvailable && (
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm mb-6">
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>You're currently offline. Turn on availability to receive delivery requests.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deliveryRequests.map((request) => (
                  <Card key={request.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Order #{request.orderId}</CardTitle>
                        <Badge variant="outline">{request.paymentMethod}</Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {request.estimatedTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {request.distance}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{request.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{request.customerPhone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm text-pretty">{request.deliveryAddress}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Package className="h-4 w-4" />
                          Items ({request.items.length})
                        </div>
                        <div className="space-y-1">
                          {request.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total</span>
                          <span className="text-primary">${request.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => acceptDelivery(request.id)} className="flex-1" disabled={!isAvailable}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button onClick={() => rejectDelivery(request.id)} variant="outline" className="flex-1">
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {deliveryRequests.length === 0 && isAvailable && (
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No new delivery requests at the moment.</p>
                      <p className="text-sm">New orders will appear here when available.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Active Deliveries */}
            {activeDeliveries.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Active Deliveries</h2>
                  <Badge variant="default">{activeDeliveries.length} in progress</Badge>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {activeDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Order #{delivery.orderId}</CardTitle>
                          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{delivery.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{delivery.customerPhone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-pretty">{delivery.deliveryAddress}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Total Amount</span>
                              <span className="font-medium">${delivery.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Payment</span>
                              <span className="text-sm">{delivery.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">ETA</span>
                              <span className="text-sm">{delivery.estimatedTime} min</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => markAsDelivered(delivery.id)} className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </Button>
                          <Button variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Customer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Completed Deliveries */}
            {completedDeliveries.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Completed Today</h2>
                  <Badge variant="outline">{completedDeliveries.length} completed</Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {completedDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <div className="font-medium">Order #{delivery.orderId}</div>
                              <div className="text-sm text-muted-foreground">{delivery.customerName}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-primary">${delivery.totalAmount.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">Delivered</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
