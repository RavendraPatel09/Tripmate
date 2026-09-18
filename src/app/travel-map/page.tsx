"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Map as MapIcon, Heart, Navigation2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import map to prevent SSR issues
const JourneyMap = dynamic(
  () => import('@/components/planner/map').then((mod) => mod.JourneyMap),
  { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-full min-h-[400px] rounded-2xl" />
  }
);

export default function TravelMapPage() {
  const stats = [
    { label: 'Visited Cities', value: 12, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Countries', value: 3, icon: MapIcon, color: 'text-blue-500' },
    { label: 'Wishlist', value: 8, icon: Heart, color: 'text-pink-500' },
    { label: 'Upcoming', value: 1, icon: Navigation2, color: 'text-primary' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Personal Travel Map</h1>
          <p className="text-muted-foreground">Your global footprint and saved destinations.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-muted/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-full bg-background shadow-sm ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border shadow-sm relative min-h-[400px]">
        <JourneyMap />
        
        {/* Floating legend */}
        <Card className="absolute bottom-6 right-6 z-[400] shadow-xl border-none">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" /> Visited
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-pink-500" /> Wishlist
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" /> Upcoming
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
