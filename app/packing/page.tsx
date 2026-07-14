"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Luggage, Shirt, Smartphone, Pill, FileText, Glasses } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExtensionStore } from '@/store/useExtensionStore';

const ICONS = {
  Clothes: Shirt,
  Electronics: Smartphone,
  Medicines: Pill,
  Documents: FileText,
  Accessories: Glasses,
};

export default function SmartPacking() {
  const { packingItems, togglePackingItem } = useExtensionStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', 'Clothes', 'Electronics', 'Medicines', 'Documents', 'Accessories'];
  
  const filteredItems = activeCategory === 'All' 
    ? packingItems 
    : packingItems.filter(item => item.category === activeCategory);
    
  const totalItems = packingItems.length;
  const packedItems = packingItems.filter(i => i.isPacked).length;
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Luggage className="h-8 w-8 text-primary" />
            Smart Packing Assistant
          </h1>
          <p className="text-muted-foreground">Tailored for: 3 Days, Summer, Mountain Trekking</p>
        </div>
      </div>
      
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="font-medium">Packing Progress</p>
              <p className="text-sm text-muted-foreground">{packedItems} of {totalItems} packed</p>
            </div>
            <p className="text-2xl font-bold text-primary">{progress}%</p>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <Badge 
            key={cat} 
            variant={activeCategory === cat ? 'default' : 'secondary'}
            className="cursor-pointer text-sm py-1.5 px-4"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>
      
      <div className="grid gap-3">
        {filteredItems.map(item => {
          const Icon = ICONS[item.category as keyof typeof ICONS] || Luggage;
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`transition-colors cursor-pointer hover:bg-muted/50 ${item.isPacked ? 'opacity-60' : ''}`}
                onClick={() => togglePackingItem(item.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`text-${item.isPacked ? 'primary' : 'muted-foreground'}`}>
                    {item.isPacked ? <CheckSquare className="h-6 w-6" /> : <Square className="h-6 w-6" />}
                  </div>
                  
                  <div className="flex items-center justify-center p-2 bg-muted rounded-md text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium text-lg ${item.isPacked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
