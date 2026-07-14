"use client";

import { motion } from 'framer-motion';
import { Bell, Map, Wallet, CloudRain, Users, CalendarDays, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExtensionStore } from '@/store/useExtensionStore';
import { NotificationItem } from '@/types';

const ICONS = {
  trip: Map,
  budget: Wallet,
  weather: CloudRain,
  community: Users,
  event: CalendarDays,
};

const COLORS = {
  trip: 'text-blue-500 bg-blue-500/10',
  budget: 'text-destructive bg-destructive/10',
  weather: 'text-cyan-500 bg-cyan-500/10',
  community: 'text-primary bg-primary/10',
  event: 'text-yellow-500 bg-yellow-500/10',
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, unreadCount } = useExtensionStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full relative">
            <Bell className="h-6 w-6 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-destructive border-2 border-background" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground text-sm">You have {unreadCount} unread alerts.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => notifications.forEach(n => markNotificationRead(n.id))}>
          <CheckCircle2 className="h-4 w-4 mr-2" /> Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            You're all caught up!
          </div>
        ) : (
          notifications.map((notification, i) => {
            const Icon = ICONS[notification.type as keyof typeof ICONS] || Bell;
            const colorClass = COLORS[notification.type as keyof typeof COLORS] || 'text-primary bg-primary/10';

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${!notification.isRead ? 'border-primary/50 shadow-sm' : 'opacity-70'}`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <CardContent className="p-4 sm:p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
