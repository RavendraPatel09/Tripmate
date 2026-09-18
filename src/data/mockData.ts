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

export const MOCK_PACKING_ITEMS = [
  { id: 'p1', name: 'T-Shirts', category: 'Clothes', isPacked: false },
  { id: 'p2', name: 'Power Bank', category: 'Electronics', isPacked: true },
  { id: 'p3', name: 'Paracetamol', category: 'Medicines', isPacked: false },
  { id: 'p4', name: 'ID Card', category: 'Documents', isPacked: true },
  { id: 'p5', name: 'Sunglasses', category: 'Accessories', isPacked: false },
];

export const MOCK_EXPENSES = [
  { id: 'e1', amount: 450, category: 'Food', description: 'Lunch at Cafe', date: '2023-10-12' },
  { id: 'e2', amount: 1200, category: 'Transport', description: 'Cab to Hotel', date: '2023-10-12' },
  { id: 'e3', amount: 3500, category: 'Hotel', description: '2 Nights Stay', date: '2023-10-11' },
];

export const MOCK_GROUP_MEMBERS = [
  { id: 'u1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', balance: 500 },
  { id: 'u2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', balance: -200 },
  { id: 'u3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c', balance: -300 },
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'a1', title: 'Mountain Explorer', description: 'Visit 5 mountain destinations.', icon: 'Mountain', progress: 3, maxProgress: 5, isUnlocked: false },
  { id: 'a2', title: 'Food Hunter', description: 'Try 10 local delicacies.', icon: 'Utensils', progress: 10, maxProgress: 10, isUnlocked: true },
  { id: 'a3', title: 'Weekend Traveler', description: 'Take 3 weekend trips.', icon: 'Calendar', progress: 1, maxProgress: 3, isUnlocked: false },
];

export const MOCK_EVENTS = [
  { id: 'ev1', name: 'Sunburn Goa', date: 'Dec 28-30', location: 'Vagator Beach, Goa', description: 'Asia\'s biggest electronic dance music festival.', popularity: 99, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000' },
  { id: 'ev2', name: 'Pushkar Camel Fair', date: 'November', location: 'Pushkar, Rajasthan', description: 'Annual multi-day cultural fete and camel fair.', popularity: 95, image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=1000' },
];

export const MOCK_EMERGENCIES = [
  { id: 'em1', name: 'City Hospital', type: 'Hospital', phone: '102', distance: '2.5 km', address: 'Main Road, City Center' },
  { id: 'em2', name: 'Central Police Station', type: 'Police', phone: '100', distance: '1.2 km', address: 'Market Square' },
  { id: 'em3', name: '24/7 Pharmacy', type: 'Pharmacy', phone: '9876543210', distance: '0.5 km', address: 'Near Bus Stand' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Upcoming Trip', message: 'Your trip to Manali is in 3 days!', type: 'trip', isRead: false, date: '2 hours ago' },
  { id: 'n2', title: 'Budget Alert', message: 'You have used 80% of your food budget.', type: 'budget', isRead: true, date: '1 day ago' },
  { id: 'n3', title: 'Weather Update', message: 'Heavy rain expected in Goa tomorrow.', type: 'weather', isRead: false, date: '5 hours ago' },
];
