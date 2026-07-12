"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plane, Calendar, MapPin, Settings, Heart, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/store/useUserStore";
import { useTripStore } from "@/store/useTripStore";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useUserStore();
  const { wishlist } = useTripStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground mt-1">Manage your trips, wishlist, and preferences.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
          <Button variant="destructive" onClick={logout}>Sign Out</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2"><Plane className="h-4 w-4" /> Upcoming Trips</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Places Visited</span>
                <span className="font-bold">14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2"><Heart className="h-4 w-4" /> Wishlist</span>
                <span className="font-bold">{wishlist.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist ({wishlist.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="h-24 w-full md:w-32 rounded-xl bg-muted overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Goa" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>Upcoming</Badge>
                      <span className="text-sm flex items-center text-muted-foreground"><Calendar className="h-3.5 w-3.5 mr-1" /> Next Week</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Weekend Getaway to Goa</h3>
                    <p className="text-muted-foreground text-sm">3 Days • ₹15,000 Budget • Flight + Hotel booked</p>
                  </div>
                  <Button variant="outline">View Details</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">Start exploring and save your favorite destinations here.</p>
                  <Button onClick={() => router.push('/explore')}>Explore Destinations</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden flex">
                      <div className="w-1/3 h-full min-h[120px]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 w-2/3">
                        <h4 className="font-bold mb-1 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{item.budget}</p>
                        <Button variant="outline" size="sm" className="w-full text-xs">Plan this trip</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
