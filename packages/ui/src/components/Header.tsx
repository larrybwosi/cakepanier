"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  ShoppingCart,
  User,
  LogOut,
  Wheat,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBrand } from "@repo/ui/lib/brand-context";

interface HeaderProps {
  user?: any;
  itemCount?: number;
  signInAction?: (formData: FormData) => void;
  signOutAction?: (formData: FormData) => void;
}

const Header = ({ user, itemCount = 0, signInAction, signOutAction }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const brand = useBrand();

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlHeader, { passive: true });
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`bg-background/95 backdrop-blur-xs sticky top-0 z-50 border-b border-border shadow-soft transition-transform duration-300 ease-in-out ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {brand.logo || <Wheat className="h-8 w-8 text-primary" />}
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground whitespace-nowrap">
                {brand.name}
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium">Products</Link>
            <Link href="/catering" className="text-foreground hover:text-primary transition-colors font-medium">Catering</Link>
            <Link href="/special-orders" className="text-foreground hover:text-primary transition-colors font-medium">Special Orders</Link>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">Contact</a>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  Hi, {user.name || user.username || "Guest"}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                {signOutAction && (
                  <form action={signOutAction}>
                    <Button type="submit" variant="ghost" size="sm" className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </form>
                )}
              </>
            ) : (
              signInAction && (
                <form action={signInAction}>
                  <Button type="submit" variant="outline" size="sm">Sign In</Button>
                </form>
              )
            )}

            <Button variant="ghost" size="sm" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
                {itemCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 flex items-center justify-center text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {brand.phone && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{brand.phone}</span>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <Button variant="ghost" size="sm" asChild className="p-2">
                <Link href="/profile"><User className="h-5 w-5" /></Link>
              </Button>
            ) : (
              signInAction && (
                <form action={signInAction}>
                  <Button type="submit" variant="ghost" size="sm" className="text-sm">Sign In</Button>
                </form>
              )
            )}

            <Button variant="ghost" size="sm" asChild className="relative p-2">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <button onClick={toggleMenu} className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors" aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link href="/" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors font-medium py-2">Home</Link>
              <Link href="/products" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors font-medium py-2">Products</Link>
              <Link href="/catering" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors font-medium py-2">Catering</Link>
              <Link href="/special-orders" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors font-medium py-2">Special Orders</Link>
              <a href="#about" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors font-medium py-2">About</a>
              <a href="#contact" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors font-medium py-2">Contact</a>

              {brand.phone && (
                <div className="flex items-center space-x-2 text-muted-foreground pt-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{brand.phone}</span>
                </div>
              )}

              {user ? (
                <div className="flex flex-col space-y-2 pt-2">
                  <span className="px-2 text-sm text-muted-foreground">Logged in as {user.name || user.username || "Guest"}</span>
                  <Button variant="ghost" asChild className="justify-start p-2">
                    <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  {signOutAction && (
                    <form action={signOutAction}>
                      <Button type="submit" variant="ghost" onClick={toggleMenu} className="w-full justify-start p-2 flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                signInAction && (
                  <form action={signInAction} className="w-fit mt-2">
                    <Button type="submit" variant="outline" size="sm" onClick={toggleMenu}>Sign In</Button>
                  </form>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
