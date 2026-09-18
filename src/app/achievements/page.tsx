"use client";

import { motion } from 'framer-motion';
import { Trophy, Medal, Mountain, Utensils, Calendar, Star, Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MOCK_ACHIEVEMENTS } from '@/data/mockData';

const ICONS = {
  Mountain,
  Utensils,
  Calendar,
};

export default function AchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Travel Achievements
          </h1>
          <p className="text-muted-foreground">Unlock badges and level up your traveler profile.</p>
        </div>
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 shadow-none">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-yellow-500 p-3 rounded-full">
              <Medal className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Level</p>
              <p className="text-xl font-bold text-foreground">Globetrotter (Lv 4)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ACHIEVEMENTS.map((achievement, index) => {
          const Icon = ICONS[achievement.icon as keyof typeof ICONS] || Compass;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full border-2 transition-all ${achievement.isUnlocked ? 'border-primary shadow-lg shadow-primary/5 bg-primary/5' : 'border-border/50 opacity-80'}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${achievement.isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    {achievement.isUnlocked && (
                      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">
                        <Star className="h-3 w-3 fill-current" />
                        UNLOCKED
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${!achievement.isUnlocked && 'text-muted-foreground'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 h-10">
                    {achievement.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className={achievement.isUnlocked ? 'text-primary' : 'text-muted-foreground'}>
                        {achievement.progress} / {achievement.maxProgress}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className={`h-2 ${!achievement.isUnlocked ? 'bg-muted' : ''}`} 
                    />
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
