import { create } from 'zustand';
import { Destination } from '@/types';

interface TripState {
  savedTrips: Destination[];
  wishlist: Destination[];
  addSavedTrip: (trip: Destination) => void;
  removeSavedTrip: (tripId: string) => void;
  addWishlist: (trip: Destination) => void;
  removeWishlist: (tripId: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
  savedTrips: [],
  wishlist: [],
  addSavedTrip: (trip) => set((state) => ({ savedTrips: [...state.savedTrips, trip] })),
  removeSavedTrip: (tripId) => set((state) => ({ savedTrips: state.savedTrips.filter(t => t.id !== tripId) })),
  addWishlist: (trip) => set((state) => ({ wishlist: [...state.wishlist, trip] })),
  removeWishlist: (tripId) => set((state) => ({ wishlist: state.wishlist.filter(t => t.id !== tripId) })),
}));
