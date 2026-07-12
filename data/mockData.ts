import { Destination, RouteOption, FoodItem, HiddenGem } from '@/types';

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'd1',
    name: 'Manali, Himachal Pradesh',
    description: 'A high-altitude Himalayan resort town known for its backpacking center and honeymoon destination.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000',
    rating: 4.8,
    weather: '15°C',
    budget: 'mid-range',
    distance: '540 km',
    categories: ['Mountains', 'Adventure', 'Romantic'],
    travelTime: '12 hours',
    popularityScore: 98,
  },
  {
    id: 'd2',
    name: 'Goa',
    description: 'A state in western India with coastlines stretching along the Arabian Sea, known for its beaches.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
    rating: 4.6,
    weather: '30°C',
    budget: 'luxury',
    distance: '1800 km',
    categories: ['Beaches', 'Party', 'Relaxation'],
    travelTime: '2.5 hours (Flight)',
    popularityScore: 95,
  },
  {
    id: 'd3',
    name: 'Varanasi, Uttar Pradesh',
    description: 'A major religious hub in India, known for its ghats and the sacred Ganges river.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000',
    rating: 4.7,
    weather: '35°C',
    budget: 'budget',
    distance: '800 km',
    categories: ['Spiritual', 'Historical'],
    travelTime: '15 hours',
    popularityScore: 90,
  }
];

export const MOCK_FOODS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Chole Bhature',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=1000',
    price: 150,
    rating: 4.9,
    location: 'Sita Ram Diwan Chand, Delhi',
    description: 'Spicy chickpea curry served with fried bread.',
    category: 'street food'
  },
  {
    id: 'f2',
    name: 'Masala Dosa',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=1000',
    price: 120,
    rating: 4.8,
    location: 'Vidyarthi Bhavan, Bangalore',
    description: 'Crispy rice crepe filled with spiced potato curry.',
    category: 'vegetarian'
  }
];

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: 'r1',
    type: 'recommended',
    totalCost: 2430,
    totalDuration: '18h 35m',
    totalDurationMinutes: 1115,
    comfortScore: 85,
    steps: [
      {
        id: 's1',
        type: 'auto',
        description: 'Auto from home to Railway Station',
        cost: 80,
        duration: '20 mins',
        durationMinutes: 20
      },
      {
        id: 's2',
        type: 'train',
        description: 'Express Train to Destination City',
        cost: 900,
        duration: '8 hours',
        durationMinutes: 480
      },
      {
        id: 's3',
        type: 'bus',
        description: 'Volvo Bus to Mountain Base',
        cost: 1200,
        duration: '10 hours',
        durationMinutes: 600
      },
      {
        id: 's4',
        type: 'taxi',
        description: 'Taxi to Hotel',
        cost: 250,
        duration: '15 mins',
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'r2',
    type: 'fastest',
    totalCost: 6500,
    totalDuration: '5h 30m',
    totalDurationMinutes: 330,
    comfortScore: 95,
    steps: [
      {
        id: 's1',
        type: 'taxi',
        description: 'Cab to Airport',
        cost: 800,
        duration: '1 hour',
        durationMinutes: 60
      },
      {
        id: 's2',
        type: 'flight',
        description: 'Direct Flight',
        cost: 4500,
        duration: '2 hours',
        durationMinutes: 120
      },
      {
        id: 's3',
        type: 'taxi',
        description: 'Cab to Hotel',
        cost: 1200,
        duration: '2h 30m',
        durationMinutes: 150
      }
    ]
  }
];

export const MOCK_HIDDEN_GEMS: HiddenGem[] = [
  {
    id: 'hg1',
    name: 'Sethan Village',
    photos: ['https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1000'],
    description: 'A tiny Buddhist village near Manali, famous for igloo stays in winter and serene apple orchards.',
    crowdLevel: 'low',
    difficultyLevel: 'moderate',
    localTips: 'Carry heavy woolens. Only accessible via 4x4 vehicles during peak winter.',
    bestSeason: 'Jan - March for Snow, May - June for Summer',
    estimatedBudget: 3000
  }
];
