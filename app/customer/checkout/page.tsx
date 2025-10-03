"use client";

import EmptyState from "@/components/EmptyState";
import { PaymentModal } from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_FEE } from "@/constant";
import { ordersApi } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock, CreditCard, MapPin, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const createOrder = useMutation(api.orders.createOrder);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + DELIVERY_FEE;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid || cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // Placeholder for customerId - replace with actual user ID from auth context
      // const customerId = "667a4e21-3b1e-4b0a-8b0a-3b1e4b0a8b0a"; // Example placeholder ID

      const orderId = await createOrder({
        // customerId: customerId as Id<'users'>,
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: {
          street: formData.address,
          city: "Unknown", // Placeholder
          zipCode: "00000", // Placeholder
          coordinates: { lat: 0, lng: 0 }, // Placeholder
        },
      });

      setCurrentOrderId(orderId);

      // Show payment modal for processing
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = (paymentId: string) => {
    // Redirect to order confirmation
    if (currentOrderId) {
      router.push(
        `/customer/order-confirmation?orderId=${currentOrderId}&paymentId=${paymentId}`
      );
    }
  };

  const isFormValid = formData.fullName && formData.phone && formData.address;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shopping
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Checkout</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-8",
            cart.length === 0 ? "lg:grid-cols-1" : ""
          )}
        >
          {/* Order Form */}
          {cart.length === 0 ? (
            <EmptyState/>
          ) : (
            <>
              <div className="space-y-6">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Information
                    </CardTitle>
                    <CardDescription>
                      Where should we deliver your order?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete delivery address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">
                        Special Instructions (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special delivery instructions..."
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                    <CardDescription>
                      Choose how you&apos;d like to pay
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-2 p-4 border border-border/40 rounded-lg">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label
                          htmlFor="cash"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <CreditCard className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">\
                              Pay when your order arrives
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-border/40 rounded-lg">
                        <RadioGroupItem
                          value="mobile_money"
                          id="mobile_money"
                        />
                        <Label
                          htmlFor="mobile_money"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Smartphone className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Mobile Money</div>
                            <div className="text-sm text-muted-foreground">\
                              Pay via MTN, Airtel, or Vodafone
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      Review your items before placing the order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-2 mt-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => decreaseQuantity(item._id)}
                                  disabled={item.quantity === 1}
                                >
                                  -
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => increaseQuantity(item._id)}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-red-500 hover:bg-red-500/10"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="font-medium">
                            {(item.price * item.quantity).toLocaleString()} Rwf
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString()} Rwf</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{DELIVERY_FEE.toLocaleString()} Rwf</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          ${total.toLocaleString()} Rwf
                        </span>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          Estimated delivery: 8-12 minutes
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={
                        !isFormValid || isSubmitting || cart.length === 0
                      }
                      className="w-full text-lg py-6"
                      size="lg"
                    >
                      {isSubmitting
                        ? "Placing Order..."
                        : `Place Order - ${total.toLocaleString()} Rwf`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center text-pretty">
                      By placing this order, you agree to our terms of service
                      and privacy policy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && currentOrderId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderId={currentOrderId}
          amount={total}
          paymentMethod={paymentMethod as "cash" | "mobile_money"}
          customerPhone={formData.phone}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
