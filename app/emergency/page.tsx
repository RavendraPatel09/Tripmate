"use client";

import { motion } from 'framer-motion';
import { PhoneCall, ShieldAlert, Building2, Cross, Flame, Shield, MapPin, Pill, Fuel, CreditCard } from 'lucide-react';
import { MOCK_EMERGENCIES } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ICONS = {
  Hospital: Cross,
  Police: Shield,
  'Petrol Pump': Fuel,
  ATM: CreditCard,
  Pharmacy: Pill,
};

export default function EmergencyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="h-8 w-8 text-destructive" />
        <h1 className="text-3xl font-bold tracking-tight">Emergency Assistance</h1>
      </div>
      <p className="text-muted-foreground mb-8">Quick access to nearby critical services and emergency contacts.</p>

      {/* Quick Action SOS */}
      <Card className="mb-10 border-destructive/50 bg-destructive/5 overflow-hidden">
        <CardContent className="p-0 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="p-6 sm:p-0">
            <h2 className="text-2xl font-bold text-destructive mb-2">National Emergency</h2>
            <p className="text-muted-foreground">Tap the button to dial the universal emergency number instantly.</p>
          </div>
          <a href="tel:112" className="w-full sm:w-auto">
            <Button size="lg" variant="destructive" className="w-full sm:w-auto rounded-none sm:rounded-xl h-16 sm:h-auto text-lg gap-2 shadow-lg hover:shadow-destructive/25">
              <PhoneCall className="h-6 w-6" />
              Call 112
            </Button>
          </a>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EMERGENCIES.map((facility, index) => {
          const Icon = ICONS[facility.type as keyof typeof ICONS] || Building2;
          return (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold bg-secondary px-2 py-1 rounded-md">
                      {facility.distance}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl">{facility.name}</CardTitle>
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">{facility.type}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-start gap-2 text-muted-foreground mb-6">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="text-sm">{facility.address}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t">
                    <a href={`tel:${facility.phone}`} className="w-full">
                      <Button className="w-full gap-2" variant="outline">
                        <PhoneCall className="h-4 w-4" />
                        {facility.phone}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
