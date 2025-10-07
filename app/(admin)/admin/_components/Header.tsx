import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
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
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
