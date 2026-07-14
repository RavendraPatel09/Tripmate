"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Receipt, ArrowRightLeft, UserPlus, DivideSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_GROUP_MEMBERS } from '@/data/mockData';

export default function GroupSplitter() {
  const totalGroupExpense = 4500; // Mock

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <DivideSquare className="h-8 w-8 text-primary" />
            Group Splitter
          </h1>
          <p className="text-muted-foreground">Split bills and settle up with your travel buddies easily.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Friend
          </Button>
          <Button className="gap-2">
            <Receipt className="h-4 w-4" />
            New Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_GROUP_MEMBERS.map((member, i) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {member.balance > 0 ? 'Gets back' : member.balance < 0 ? 'Owes' : 'Settled up'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${member.balance > 0 ? 'text-emerald-500' : member.balance < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      ₹{Math.abs(member.balance).toLocaleString()}
                    </p>
                    {member.balance !== 0 && (
                      <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                        Settle Up
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 border-l-2 border-muted ml-3 pl-6 relative">
                {/* Mock Activity */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-semibold">Alice added "Hotel Booking"</p>
                  <p className="text-sm text-muted-foreground mb-1">₹3,500 • Split equally</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-muted ring-4 ring-background" />
                  <p className="font-semibold">Bob paid Alice</p>
                  <p className="text-sm text-emerald-500 mb-1">₹500</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6">
              <h3 className="text-primary-foreground/80 font-medium mb-1">Total Group Expense</h3>
              <p className="text-4xl font-bold mb-6">₹{totalGroupExpense.toLocaleString()}</p>
              
              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-primary-foreground/80 mb-1">Suggested Transfer</p>
                  <div className="flex items-center justify-between font-medium">
                    <span>Charlie</span>
                    <ArrowRightLeft className="h-4 w-4 mx-2 text-primary-foreground/50" />
                    <span>Alice</span>
                  </div>
                  <p className="text-xl font-bold mt-2">₹300</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-primary-foreground/80 mb-1">Suggested Transfer</p>
                  <div className="flex items-center justify-between font-medium">
                    <span>Bob</span>
                    <ArrowRightLeft className="h-4 w-4 mx-2 text-primary-foreground/50" />
                    <span>Alice</span>
                  </div>
                  <p className="text-xl font-bold mt-2">₹200</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
