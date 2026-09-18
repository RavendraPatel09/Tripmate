"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function HeroSearch() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("");
  const [style, setStyle] = useState("");

  const handleSearch = () => {
    // In a real app, this would build a query string or store in state
    router.push("/planner");
  };

  return (
    <div className="bg-background/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border w-full max-w-5xl mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Where are you?" 
              className="pl-9 bg-muted/50 border-transparent focus-visible:ring-primary" 
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
            <Input 
              placeholder="Where to?" 
              className="pl-9 bg-muted/50 border-transparent focus-visible:ring-primary"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Travelers</label>
          <Select value={travelers} onValueChange={(val) => setTravelers(val || "1")}>
            <SelectTrigger className="bg-muted/50 border-transparent">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Add guests" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 People</SelectItem>
              <SelectItem value="3-5">3-5 People</SelectItem>
              <SelectItem value="6+">6+ People</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Travel Style</label>
          <Select value={style} onValueChange={(val) => setStyle(val || "any")}>
            <SelectTrigger className="bg-muted/50 border-transparent">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSearch} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-primary/25 transition-all">
          <Search className="mr-2 h-4 w-4" />
          Plan Trip
        </Button>
      </div>
    </div>
  );
}
