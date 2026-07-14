"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, Menu, User, Map, Wallet, Compass, MoreHorizontal, Bell, Luggage, MapPin, PlayCircle, ShieldAlert, WifiOff, CalendarDays, Calculator, DivideSquare, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useExtensionStore } from "@/store/useExtensionStore";

const NAV_LINKS = [
  { href: "/planner", label: "Plan Trip", icon: Map },
  { href: "/ai-generator", label: "AI Generator", icon: Plane },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/budget", label: "Budget", icon: Wallet },
];

const MORE_LINKS = [
  { href: "/planner/multi-city", label: "Multi-City Planner", icon: MapPin },
  { href: "/packing", label: "Smart Packing", icon: Luggage },
  { href: "/expenses", label: "Expense Tracker", icon: Calculator },
  { href: "/expenses/split", label: "Group Splitter", icon: DivideSquare },
  { href: "/events", label: "Events & Festivals", icon: CalendarDays },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/travel-map", label: "Personal Map", icon: Map },
  { href: "/replay", label: "Journey Replay", icon: PlayCircle },
  { href: "/offline", label: "Offline Maps", icon: WifiOff },
  { href: "/emergency", label: "Emergency", icon: ShieldAlert, danger: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { unreadCount } = useExtensionStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-transform hover:scale-105">
          <img src="/logo_transparent.png" alt="TripMate Logo" className="h-12 w-auto object-contain dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
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
          
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary gap-1 px-2" />}>
              More <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="grid grid-cols-1 gap-1 p-2">
                {MORE_LINKS.map((link, idx) => (
                  <div key={link.href}>
                    {idx === 8 && <DropdownMenuSeparator className="my-1" />}
                    <DropdownMenuItem render={
                      <Link 
                        href={link.href} 
                        className={`w-full flex items-center gap-2 cursor-pointer ${link.danger ? 'text-destructive focus:text-destructive' : ''}`}
                      />
                    }>
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </DropdownMenuItem>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          
          <Link href="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </Link>

          <div className="hidden md:block">
            <Link href="/login">
              <Button variant="default" size="sm" className="rounded-full px-5">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
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
                
                <div className="my-2 border-t border-border/50 pt-4">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">More Features</p>
                  <div className="grid grid-cols-2 gap-2">
                    {MORE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-colors text-center border ${
                          pathname === link.href ? "bg-primary/10 text-primary border-primary/20" : "hover:bg-muted bg-card"
                        } ${link.danger ? 'text-destructive border-destructive/20 hover:bg-destructive/10' : ''}`}
                      >
                        <link.icon className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium leading-tight">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-2 px-4 pb-8">
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
