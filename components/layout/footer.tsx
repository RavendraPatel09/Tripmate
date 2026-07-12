import Link from "next/link";
import { Plane, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="TripMate Logo" className="h-8 w-auto object-contain mb-2" />
            </Link>
            <p className="text-muted-foreground text-sm">
              Your intelligent travel companion for seamless journeys, budget planning, and unforgettable experiences.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link href="/hidden-gems" className="hover:text-primary transition-colors">Hidden Gems</Link></li>
              <li><Link href="/food" className="hover:text-primary transition-colors">Food Explorer</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Plan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/planner" className="hover:text-primary transition-colors">Journey Guide</Link></li>
              <li><Link href="/ai-generator" className="hover:text-primary transition-colors">AI Trip Builder</Link></li>
              <li><Link href="/budget" className="hover:text-primary transition-colors">Budget Estimator</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Saved Trips</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TripMate. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Made with ❤️ for Travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
