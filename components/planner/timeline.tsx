"use client";

import { motion } from "framer-motion";
import { Train, Car, Plane, Bus, Navigation, Footprints } from "lucide-react";
import { RouteOption } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getIcon = (type: string) => {
  switch (type) {
    case 'train': return <Train className="h-5 w-5" />;
    case 'auto': return <Car className="h-5 w-5" />;
    case 'taxi': return <Car className="h-5 w-5" />;
    case 'bus': return <Bus className="h-5 w-5" />;
    case 'flight': return <Plane className="h-5 w-5" />;
    case 'walk': return <Footprints className="h-5 w-5" />;
    default: return <Navigation className="h-5 w-5" />;
  }
};

export function Timeline({ route }: { route: RouteOption }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight capitalize">{route.type} Route</h2>
          <p className="text-muted-foreground">Optimal path based on your preferences</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm py-1 font-medium bg-background">
            ₹{route.totalCost.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="text-sm py-1 font-medium bg-background">
            {route.totalDuration}
          </Badge>
        </div>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-primary/50 before:to-transparent">
        {route.steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            className="relative"
          >
            <div className="absolute -left-6 bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center shadow-lg border-4 border-background z-10">
              {getIcon(step.type)}
            </div>
            
            <Card className="ml-10 p-4 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-lg">{step.description}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{step.type}</p>
                </div>
                <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 text-right">
                  <span className="font-medium text-primary">₹{step.cost}</span>
                  <span className="text-sm text-muted-foreground">{step.duration}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
