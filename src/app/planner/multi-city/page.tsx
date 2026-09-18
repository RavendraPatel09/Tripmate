"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, GripVertical, Plus, Trash2, ArrowRight, Clock, Banknote, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_DESTINATIONS } from '@/data/mockData';
import { Destination } from '@/types';

export default function MultiCityPlanner() {
  const [itinerary, setItinerary] = useState<Destination[]>([
    MOCK_DESTINATIONS[0],
    MOCK_DESTINATIONS[1],
  ]);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItinerary = [...itinerary];
    const draggedItem = newItinerary[draggedIndex];
    newItinerary.splice(draggedIndex, 1);
    newItinerary.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setItinerary(newItinerary);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
  };
  
  const removeCity = (index: number) => {
    if (itinerary.length <= 2) return; // Keep at least 2
    setItinerary(itinerary.filter((_, i) => i !== index));
  };
  
  const addCity = () => {
    const available = MOCK_DESTINATIONS.filter(d => !itinerary.find(i => i.id === d.id));
    if (available.length > 0) {
      setItinerary([...itinerary, available[0]]);
    }
  };

  // Mock calculations
  const totalDistance = itinerary.length * 540; // Mock calculation
  const totalBudget = itinerary.reduce((acc, city) => acc + (city.budget === 'luxury' ? 10000 : city.budget === 'mid-range' ? 5000 : 2000), 0);
  const totalDays = itinerary.length * 3;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Multi-City Trip Planner</h1>
        <p className="text-muted-foreground">Plan epic journeys across multiple destinations.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Itinerary</h2>
            <Button onClick={addCity} size="sm" variant="outline" disabled={itinerary.length >= MOCK_DESTINATIONS.length}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stop
            </Button>
          </div>
          
          <div className="relative border-l-2 border-primary/20 ml-4 space-y-6">
            {itinerary.map((city, index) => (
              <motion.div
                key={city.id + index}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                draggable
                onDragStart={(e) => handleDragStart(e as any, index)}
                onDragOver={(e) => handleDragOver(e as any, index)}
                onDrop={(e) => handleDrop(e as any)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`relative pl-8 ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-background border-2 border-primary z-10" />
                
                <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4 border-l-primary">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="hidden sm:flex text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    <div className="h-16 w-24 rounded-md overflow-hidden shrink-0">
                      <img src={city.image} alt={city.name} className="h-full w-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">Stop {index + 1}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{city.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {city.categories.join(', ')}
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeCity(index)}
                      disabled={itinerary.length <= 2}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Visual connector line info */}
                {index < itinerary.length - 1 && (
                  <div className="absolute left-10 -bottom-5 text-xs text-muted-foreground flex items-center gap-1 bg-background px-2 py-0.5 rounded-full border">
                    <ArrowRight className="h-3 w-3" /> 
                    ~{Math.floor(Math.random() * 400 + 100)} km
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Trip Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="font-semibold">{totalDistance} km</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Duration</p>
                    <p className="font-semibold">{totalDays} Days</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Budget</p>
                    <p className="font-semibold">₹{totalBudget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Button className="w-full text-lg h-12">
                  Save Itinerary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
