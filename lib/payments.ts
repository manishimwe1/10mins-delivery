// Payment processing utilities

export interface PaymentRequest {
  orderId: string
  paymentMethod: "cash" | "mobile_money"
  amount: number
  customerPhone?: string
  mobileMoneyProvider?: "mtn" | "airtel" | "vodafone"
}

export interface PaymentResult {
  paymentId: string
  status: "pending" | "completed" | "failed"
  method: "cash" | "mobile_money"
  provider?: string
  transactionId?: string
  amount: number
  currency: string
  processedAt: string
}

export const paymentsApi = {
  // Process payment
  processPayment: async (paymentData: PaymentRequest): Promise<PaymentResult> => {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Payment processing failed")
    }

    const data = await response.json()
    return data.payment
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<PaymentResult> => {
    const response = await fetch(`/api/payments?paymentId=${paymentId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to get payment status")
    }

    const data = await response.json()
    return data.payment
  },
}

// Mobile money providers
export const mobileMoneyProviders = [
  { id: "mtn", name: "MTN Mobile Money", color: "bg-yellow-500" },
  { id: "airtel", name: "Airtel Money", color: "bg-red-500" },
] as const
