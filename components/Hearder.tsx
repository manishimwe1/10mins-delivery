import { Clock, MenuIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { UserMenu } from "./user-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAVLINKS } from "@/constant";

const Hearder = () => {
  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-balance">QuickDelivery</h1>
          </div>
          <nav className=" items-center gap-4 hidden md:flex">
            {NAVLINKS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary cursor-pointer">
                <Button variant="ghost">{item.label}</Button>
              </Link>
            ))}
            
            <UserMenu />
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <MenuIcon className="h-8 w-8 text-primary cursor-pointer" />
              </SheetTrigger>
              <SheetContent className="border border-primary/20 rounded-l-md">
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription>
                    
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col items-start px-6 gap-4 w-full">
                  {NAVLINKS.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-primary cursor-pointer w-full">
                      <SheetClose asChild>
                        <Button variant="ghost" className="w-full hover:text-primary cursor-pointer">{item.label}</Button>
                      </SheetClose>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hearder;
