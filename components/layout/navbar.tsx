"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, Menu, User, Map, Wallet, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/planner", label: "Plan Trip", icon: Map },
  { href: "/ai-generator", label: "AI Generator", icon: Plane },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/budget", label: "Budget", icon: Wallet },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="bg-primary p-1.5 rounded-xl">
            <Plane className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            TripMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:block">
            <Link href="/login">
              <Button variant="default" size="sm" className="rounded-full px-5">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                <div className="mt-4 px-4">
                  <Link href="/login" className="w-full">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
