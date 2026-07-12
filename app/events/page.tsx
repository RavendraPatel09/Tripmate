"use client";

import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Users } from 'lucide-react';
import { MOCK_EVENTS } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function EventsExplorer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Events & Festivals</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover cultural events, concerts, and seasonal celebrations happening around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden h-full flex flex-col group border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl dark:bg-card/50">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 flex items-center gap-1 font-semibold">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {event.popularity}%
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="default" className="bg-primary shadow-lg flex items-center gap-1 text-sm py-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.name}</h3>
                
                <div className="flex items-center text-sm text-muted-foreground mb-3 gap-1">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                  {event.description}
                </p>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    Trending
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
