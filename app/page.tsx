import Hearder from "@/components/Hearder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ShoppingCart, Truck, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Hearder/>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 text-balance">
              The complete platform to deliver groceries in <span className="text-primary">10 minutes</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Your team&apos;s toolkit to stop waiting and start delivering. Securely order, track, and deliver the best
              grocery experiences with QuickDelivery.
            </p>
            <div className="flex md:flex-row px-4 md:px-0 flex-col items-center justify-center gap-4 w-full">
              <Link href="/customer" className="w-full">
                <Button size="lg" className="text-lg px-8 cursor-pointer w-full">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/admin" className="w-full" >
                <Button variant="outline" size="lg" className="w-full text-lg px-8 bg-transparent cursor-pointer">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Customer App</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Browse products, add to cart, and checkout with cash or mobile money payments.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/customer">
                    <Button variant="outline" size="sm">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Rider Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Receive delivery requests, accept orders, and mark deliveries as complete.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/rider">
                    <Button variant="outline" size="sm">
                      Start Delivering
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Admin Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Manage products, inventory, orders, and assign riders to deliveries.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Manage Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>10 Min Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Lightning-fast delivery with real-time order tracking and status updates.
                </CardDescription>
                <div className="mt-4">
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10</div>
              <div className="text-muted-foreground">Minutes Average Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Service Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
