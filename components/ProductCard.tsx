import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCartStore } from "@/lib/store";

const ProductCard = ({ product }: { product: Doc<"products"> }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const plugin = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false }) // 10sec interval
  );
  return (
    <Card
      key={product._id}
      className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
    >
      <CardHeader className="pb-3">
        <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
          >
            <CarouselContent>
              {product.image_url.map((url, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    width={300}
                    height={300}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="text-pretty">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary">
            {product.price.toLocaleString()} Rwf
          </div>
          <Badge variant="secondary">{product.stock_quantity} in stock</Badge>
        </div>
        <Button
          onClick={() => addToCart(product)}
          className="w-full"
          disabled={product.stock_quantity === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
