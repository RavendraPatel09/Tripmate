export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  weather: string;
  budget: 'budget' | 'mid-range' | 'luxury';
  distance: string;
  categories: string[];
  travelTime: string;
  popularityScore: number;
}

export interface RouteStep {
  id: string;
  type: 'auto' | 'train' | 'bus' | 'flight' | 'taxi' | 'walk';
  description: string;
  cost: number;
  duration: string;
  durationMinutes: number;
}

export interface RouteOption {
  id: string;
  type: 'cheapest' | 'fastest' | 'recommended' | 'scenic';
  steps: RouteStep[];
  totalCost: number;
  totalDuration: string;
  totalDurationMinutes: number;
  comfortScore: number;
}

export interface FoodItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  location: string;
  description: string;
  category: 'vegetarian' | 'non-vegetarian' | 'dessert' | 'street food' | 'local specialty';
}

export interface HiddenGem {
  id: string;
  name: string;
  photos: string[];
  description: string;
  crowdLevel: 'low' | 'medium' | 'high';
  difficultyLevel: 'easy' | 'moderate' | 'hard';
  localTips: string;
  bestSeason: string;
  estimatedBudget: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface BudgetEstimate {
  hotel: number;
  food: number;
  localTransport: number;
  activities: number;
  shopping: number;
  emergencyFund: number;
  total: number;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Clothes' | 'Electronics' | 'Medicines' | 'Documents' | 'Accessories';
  isPacked: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Hotel' | 'Shopping' | 'Activities';
  description: string;
  date: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  balance: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  popularity: number;
  image: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  type: 'Hospital' | 'Police' | 'Petrol Pump' | 'ATM' | 'Pharmacy';
  phone: string;
  distance: string;
  address: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'trip' | 'budget' | 'weather' | 'community' | 'event';
  isRead: boolean;
  date: string;
}
