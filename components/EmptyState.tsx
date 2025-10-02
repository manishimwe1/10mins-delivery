import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const EmptyState = () => {
  return (
    <div className="text-center py-16 flex flex-col gap-4 items-center justify-center">
      <div className="bg-gray-950 h-full w-full md:w-[400px] flex items-center justify-center">
        <Image
          src="/appImages/empty_cart.svg"
          alt="Empty cart"
          className="mx-auto w-48 h-48 mb-8"
          priority
          width={48}
          height={48}
        />
      </div>
      <div className="flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty!</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/customer">
          <Button size="lg" className="cursor-pointer">
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
