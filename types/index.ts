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
