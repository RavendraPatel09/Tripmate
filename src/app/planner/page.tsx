"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline } from "@/components/planner/timeline";
import { JourneyMap } from "@/components/planner/map";
import { MOCK_ROUTES } from "@/data/mockData";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("recommended");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Journey Planner</h1>
          <p className="text-muted-foreground mt-1">Plan your optimal route from door to door.</p>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-muted/30 p-4 rounded-xl border mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Origin (e.g., Bhopal)" defaultValue="Bhopal" className="pl-9 bg-background" />
        </div>
        <div className="flex-1 w-full relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
          <Input placeholder="Destination (e.g., Manali)" defaultValue="Manali" className="pl-9 bg-background" />
        </div>
        <div className="w-full lg:w-auto flex gap-2">
          <Button variant="outline" className="w-full lg:w-auto bg-background">
            <Calendar className="mr-2 h-4 w-4" />
            Dates
          </Button>
          <Button className="w-full lg:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Update
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Map (Takes up more space on desktop) */}
        <div className="lg:col-span-7 h-[50vh] lg:h-[70vh] rounded-xl overflow-hidden shadow-sm border order-2 lg:order-1">
          <JourneyMap />
        </div>

        {/* Right Column - Routes */}
        <div className="lg:col-span-5 flex flex-col order-1 lg:order-2">
          <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="cheapest">Cheapest</TabsTrigger>
              <TabsTrigger value="fastest">Fastest</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 bg-muted/10 border rounded-xl p-6">
              <TabsContent value="recommended" className="m-0">
                <Timeline route={MOCK_ROUTES[0]} />
              </TabsContent>
              <TabsContent value="cheapest" className="m-0">
                {/* Fallback to MOCK_ROUTES[0] if MOCK_ROUTES doesn't have a cheapest explicit in our mock */}
                <Timeline route={MOCK_ROUTES.find(r => r.type === 'cheapest') || MOCK_ROUTES[0]} />
              </TabsContent>
              <TabsContent value="fastest" className="m-0">
                <Timeline route={MOCK_ROUTES.find(r => r.type === 'fastest') || MOCK_ROUTES[1]} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
