"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { mobileMoneyProviders } from "@/lib/payments"
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  Smartphone,
} from "lucide-react"
import { useState } from "react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  amount: number
  paymentMethod: "cash" | "mobile_money"
  customerPhone: string
  onPaymentComplete: (paymentId: string) => void
}

export function PaymentModal({
  isOpen,
  onClose,
  orderId,
  amount,
  paymentMethod,
  customerPhone,
  onPaymentComplete,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle")
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState("")
  const [phoneNumber, setPhoneNumber] = useState(customerPhone)
  const [errorMessage, setErrorMessage] = useState("")

  // 🔹 Poll payment status until it's final
  const pollPaymentStatus = async (referenceId: string) => {
    let attempts = 0
    const maxAttempts = 8 // ~40 seconds max
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(`/api/momo/pay/status/${referenceId}`)
        const data = await res.json()

        if (data.status === "SUCCESSFUL") {
          setPaymentStatus("success")
          setTimeout(() => {
            onPaymentComplete(referenceId)
            onClose()
          }, 2000)
          return
        }

        if (data.status === "FAILED") {
          setPaymentStatus("error")
          setErrorMessage("Payment failed. Please try again.")
          return
        }
      } catch (err) {
        console.error("Error checking status", err)
      }

      attempts++
      await delay(5000) // poll every 5s
    }

    setPaymentStatus("error")
    setErrorMessage("Payment timeout. Please try again.")
  }

  const handlePayment = async () => {
    if (
      paymentMethod === "mobile_money" &&
      (!phoneNumber || !mobileMoneyProvider)
    ) {
      setErrorMessage("Please select provider and enter phone number")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      if (paymentMethod === "cash") {
        setPaymentStatus("success")
        setTimeout(() => {
          onPaymentComplete(orderId)
          onClose()
        }, 2000)
        return
      }

      // 🔹 Mobile Money payment
      const res = await fetch("/api/momo/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          currency: "EUR",
          phone: phoneNumber,
          externalId: orderId,
          payerMessage: "Payment for order " + orderId,
          payeeNote: "Thank you for your order",
        }),
      })

      if (!res.ok) throw new Error("Payment request failed")
      const { referenceId } = await res.json()

      // 🔹 Start polling
      await pollPaymentStatus(referenceId)
    } catch (error) {
      console.error("Payment failed:", error)
      setPaymentStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Payment failed"
      )
    } finally {
      setIsProcessing(false)
    }
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {paymentMethod === "mobile_money" ? (
              <Smartphone className="h-5 w-5" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            {paymentMethod === "mobile_money"
              ? "Mobile Money Payment"
              : "Cash Payment"}
          </DialogTitle>
          <DialogDescription>
            {paymentMethod === "mobile_money"
              ? "Complete your payment using mobile money"
              : "Confirm cash on delivery payment"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Amount */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                {amount.toLocaleString()} RWF
              </span>
            </div>
          </div>

          {/* Mobile Money Form */}
          {paymentMethod === "mobile_money" && paymentStatus === "idle" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="provider">Mobile Money Provider</Label>
                <Select
                  value={mobileMoneyProvider}
                  onValueChange={setMobileMoneyProvider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileMoneyProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${provider.color}`}
                          />
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your mobile money number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {mobileMoneyProvider && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    <span>
                      You will receive a prompt on your phone to complete the
                      payment
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cash Payment Info */}
          {paymentMethod === "cash" && paymentStatus === "idle" && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                <span>
                  You will pay {amount.toLocaleString()} RWF in cash when your
                  order is delivered
                </span>
              </div>
            </div>
          )}

          {/* Processing State */}
          {paymentStatus === "processing" && (
            <div className="text-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="font-medium">Processing Payment...</p>
              <p className="text-sm text-muted-foreground">
                {paymentMethod === "mobile_money"
                  ? "Please check your phone and complete the payment"
                  : "Confirming your cash payment..."}
              </p>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === "success" && (
            <div className="text-center py-6">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <p className="font-medium text-green-500">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">
                Your order has been confirmed and will be prepared shortly
              </p>
            </div>
          )}

          {/* Error State */}
          {paymentStatus === "error" && (
            <div className="text-center py-6">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="font-medium text-red-500">Payment Failed</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            {paymentStatus === "idle" && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {paymentMethod === "mobile_money"
                    ? "Pay Now"
                    : "Confirm Order"}
                </Button>
              </>
            )}

            {paymentStatus === "error" && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setPaymentStatus("idle")}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
