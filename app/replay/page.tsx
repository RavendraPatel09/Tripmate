"use client";

import { motion } from 'framer-motion';
import { PlayCircle, Image as ImageIcon, MapPin, Calendar, Clock, DollarSign, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function JourneyReplayPage() {
  const tripData = {
    title: "Summer in the Himalayas",
    location: "Manali, Himachal Pradesh",
    date: "June 2023",
    duration: "5 Days",
    photos: 142,
    expense: "₹24,500",
    cover: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=2000"
  };

  const timeline = [
    { day: "Day 1", title: "Arrival & Local Sightseeing", time: "10:00 AM", desc: "Checked into the resort and explored Mall Road.", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=500" },
    { day: "Day 2", title: "Solang Valley Adventure", time: "09:30 AM", desc: "Paragliding and ATV rides in the beautiful valley.", img: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=500" },
    { day: "Day 3", title: "Rohtang Pass Snow Trek", time: "06:00 AM", desc: "Early morning drive to the snow point. Unforgettable views.", img: "https://images.unsplash.com/photo-1542317148-8b4bdccb33ea?auto=format&fit=crop&q=80&w=500" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <div className="absolute inset-0">
          <img src={tripData.cover} alt="Trip Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 w-full p-8 md:p-12">
          <div className="container mx-auto max-w-5xl">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-4 backdrop-blur-md">
              Trip Completed
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 drop-shadow-lg">
              {tripData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
              <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> {tripData.location}</span>
              <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> {tripData.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        {/* Action Bar */}
        <Card className="mb-12 shadow-lg border-primary/10 bg-card/80 backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap justify-center sm:justify-start gap-8">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4" /> Duration</p>
                <p className="text-xl font-bold">{tripData.duration}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Camera className="h-4 w-4" /> Memories</p>
                <p className="text-xl font-bold">{tripData.photos} Photos</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground flex items-center gap-1"><DollarSign className="h-4 w-4" /> Spent</p>
                <p className="text-xl font-bold">{tripData.expense}</p>
              </div>
            </div>
            
            <Button size="lg" className="w-full sm:w-auto rounded-full gap-2 text-lg px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <PlayCircle className="h-6 w-6" /> Play Montage
            </Button>
          </CardContent>
        </Card>

        {/* Timeline Story */}
        <div className="space-y-12 pl-4 md:pl-0">
          <div className="text-2xl font-bold mb-8 text-center">The Journey Story</div>
          
          <div className="relative border-l-2 border-primary/20 md:ml-[50%] md:-translate-x-[1px] space-y-12">
            {timeline.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Center Node */}
                <div className="absolute -left-[9px] md:left-0 md:-translate-x-[7px] h-4 w-4 rounded-full bg-background border-2 border-primary ring-4 ring-background z-10" />
                
                {/* Spacer for desktop alternation */}
                <div className="hidden md:block md:w-1/2" />
                
                {/* Content */}
                <div className="w-full md:w-1/2 pl-6 md:pl-0">
                  <div className={`flex flex-col ${i % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start'} gap-4`}>
                    <div>
                      <Badge variant="outline" className="mb-2 bg-background">{item.day} • {item.time}</Badge>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                    
                    <Card className="overflow-hidden border-none shadow-xl w-full max-w-sm group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/40">
                            <ImageIcon className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
