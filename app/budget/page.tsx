"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { IndianRupee, MapPin, Users, Calendar, ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BudgetEstimate } from "@/types";

const MOCK_BUDGET: BudgetEstimate = {
  hotel: 15000,
  food: 8000,
  localTransport: 3000,
  activities: 5000,
  shopping: 4000,
  emergencyFund: 5000,
  total: 40000,
};

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function BudgetPage() {
  const [isCalculated, setIsCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const data = [
    { name: 'Hotel', value: MOCK_BUDGET.hotel },
    { name: 'Food', value: MOCK_BUDGET.food },
    { name: 'Transport', value: MOCK_BUDGET.localTransport },
    { name: 'Activities', value: MOCK_BUDGET.activities },
    { name: 'Shopping', value: MOCK_BUDGET.shopping },
    { name: 'Emergency', value: MOCK_BUDGET.emergencyFund },
  ];

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsCalculated(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Smart Budget Estimator</h1>
        <p className="text-muted-foreground">Get a highly accurate, AI-powered estimate for your upcoming trip based on real-time data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Enter details to get an estimate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="E.g., Goa" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Budget</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="E.g., 40000" type="number" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="2" type="number" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="5" type="number" className="pl-9" />
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCalculate}
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate Budget"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          {isCalculated ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary text-primary-foreground border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Estimated Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{MOCK_BUDGET.total.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Per Person Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{(MOCK_BUDGET.total / 2).toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{(MOCK_BUDGET.total / 5).toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-8">
                  <div className="h-[300px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `₹${value.toLocaleString()}`}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-4">
                    {data.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold">₹{item.value.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {((item.value / MOCK_BUDGET.total) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/20 border border-dashed rounded-xl">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Awaiting Details</h3>
              <p className="text-muted-foreground max-w-sm">
                Enter your trip details on the left to generate a comprehensive budget estimate and interactive charts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
