"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Truck, MapPin, Phone, Home } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { DELIVERY_FEE } from "@/constant";
import { useCartStore } from "@/lib/store";

export default function OrderConfirmationPage() {
  const [orderStatus, setOrderStatus] = useState("pending");
  const [estimatedTime, setEstimatedTime] = useState(10);
   const { clearCart } = useCartStore()
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") as Id<"orders">;
  
  
  // Fetch order data from the database
  const orderData = useQuery(api.orders.getOrderById, { orderId: orderId });

  // Simulate order status updates
  useEffect(() => {
    if (!orderData) return;

    const timer1 = setTimeout(() => {
      setOrderStatus("in_progress");
      setEstimatedTime(8);
    }, 3000);

    const timer2 = setTimeout(() => {
      setOrderStatus("delivered");
      setEstimatedTime(0);
      clearCart()
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [orderData]);

  const getStatusInfo = () => {
    switch (orderStatus) {
      case "pending":
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          title: "Order Confirmed",
          description: "We're preparing your order and finding a rider",
          color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        };
      case "in_progress":
        return {
          icon: <Truck className="h-6 w-6 text-blue-500" />,
          title: "Out for Delivery",
          description: "Your rider is on the way with your order",
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        };
      case "delivered":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          title: "Delivered",
          description: "Your order has been delivered successfully",
          color: "bg-green-500/10 text-green-500 border-green-500/20",
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-gray-500" />,
          title: "Processing",
          description: "Processing your order",
          color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  const order = orderData;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Order Tracking</h1>
            </div>
            <Link href="/customer">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Order Status */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">{statusInfo.icon}</div>
              <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
              <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`p-4 rounded-lg border ${statusInfo.color} text-center`}
              >
                <div className="font-medium">Order #{order._id}</div>
                {estimatedTime > 0 && (
                  <div className="text-sm mt-1">
                    Estimated delivery: {estimatedTime} minutes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Progress */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Delivery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      orderStatus === "pending" ||
                      orderStatus === "in_progress" ||
                      orderStatus === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Order Confirmed</div>
                    <div className="text-sm text-muted-foreground">
                      Your order has been received
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      orderStatus === "in_progress" ||
                      orderStatus === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Out for Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Rider is on the way
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      orderStatus === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Delivered</div>
                    <div className="text-sm text-muted-foreground">
                      Order delivered to your address
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.productId}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    $
                    {order.items
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${DELIVERY_FEE.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">Delivery Address</div>
                    <div className="text-sm text-muted-foreground">
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.zipCode}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Contact Number</div>
                    <div className="text-sm text-muted-foreground">
                      00000000
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{order.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/customer" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="outline" className="flex-1 bg-transparent">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
