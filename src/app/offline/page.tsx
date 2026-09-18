"use client";

import { motion } from 'framer-motion';
import { WifiOff, Download, Map, Ticket, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function OfflineModePage() {
  const offlineItems = [
    { title: 'Manali Map Area', size: '45 MB', type: 'Map', status: 'downloaded', icon: Map },
    { title: 'Hotel Booking PDF', size: '2 MB', type: 'Document', status: 'downloaded', icon: FileText },
    { title: 'Flight Tickets', size: '1.5 MB', type: 'Ticket', status: 'downloaded', icon: Ticket },
    { title: 'Goa Travel Guide', size: '12 MB', type: 'Guide', status: 'pending', icon: FileText },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-4 rounded-full shadow-lg shadow-primary/20">
            <WifiOff className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Offline Mode Available</h1>
            <p className="text-muted-foreground">Access your essential travel documents without internet.</p>
          </div>
        </div>
        <Button size="lg" className="shrink-0 gap-2 w-full md:w-auto">
          <Download className="h-5 w-5" />
          Download All Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Downloaded Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {offlineItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${item.status === 'downloaded' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                
                {item.status === 'downloaded' ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </Badge>
                ) : (
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" /> Offline Maps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-xl p-6 text-center space-y-4">
              <Map className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="font-semibold">Select Region to Download</p>
                <p className="text-sm text-muted-foreground">Navigate locally without roaming charges.</p>
              </div>
              <Button variant="outline" className="w-full">Select Region</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">TripMate Data</span>
                <span className="text-muted-foreground">58.5 MB</span>
              </div>
              <Progress value={15} className="h-3" />
              <p className="text-xs text-muted-foreground pt-2">
                Your device has 45 GB of free space available. You can safely download more maps and high-res photos.
              </p>
              <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 mt-4">
                Clear Offline Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
