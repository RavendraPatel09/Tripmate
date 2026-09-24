import type { Destination } from '@prisma/client';

// Maps the DB shape (BudgetTier enum can't contain a hyphen: `mid_range`) back
// onto the frontend's exact `Destination` type (`budget: 'budget' | 'mid-range' | 'luxury'`).
// Used everywhere a Destination is returned to the client — public catalog
// reads, wishlist/saved-trips, and admin CRUD responses — so the shape never drifts.
export function toPublicDestination(destination: Destination) {
  return {
    id: destination.id,
    name: destination.name,
    description: destination.description,
    image: destination.image,
    rating: destination.rating,
    weather: destination.weather,
    budget: destination.budgetTier === 'mid_range' ? 'mid-range' : destination.budgetTier,
    distance: destination.distance,
    categories: destination.categories,
    travelTime: destination.travelTime,
    popularityScore: destination.popularityScore,
  };
}
