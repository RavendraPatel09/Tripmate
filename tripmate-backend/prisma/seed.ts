import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

// Never hardcode a real admin password in seed data. If ADMIN_SEED_PASSWORD
// isn't set, generate a random one and print it once so it can be captured —
// it is not stored anywhere in the repo or logs after this run.
async function getOrGenerateAdminPassword(): Promise<string> {
  if (process.env.ADMIN_SEED_PASSWORD) return process.env.ADMIN_SEED_PASSWORD;
  const generated = crypto.randomBytes(12).toString('base64url');
  // eslint-disable-next-line no-console
  console.log(`\nNo ADMIN_SEED_PASSWORD set — generated one-time admin password: ${generated}\n`);
  return generated;
}

async function main() {
  const adminPassword = await getOrGenerateAdminPassword();
  const adminPasswordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });

  await prisma.user.upsert({
    where: { email: 'admin@tripmate.dev' },
    update: {},
    create: {
      name: 'TripMate Admin',
      email: 'admin@tripmate.dev',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  await prisma.destination.createMany({
    data: [
      {
        name: 'Manali, Himachal Pradesh',
        description:
          'A high-altitude Himalayan resort town known for its backpacking center and honeymoon destination.',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000',
        rating: 4.8,
        weather: '15°C',
        budgetTier: 'mid_range',
        distance: '540 km',
        categories: ['Mountains', 'Adventure', 'Romantic'],
        travelTime: '12 hours',
        popularityScore: 98,
      },
      {
        name: 'Goa',
        description: 'A state in western India with coastlines stretching along the Arabian Sea, known for its beaches.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
        rating: 4.6,
        weather: '30°C',
        budgetTier: 'luxury',
        distance: '1800 km',
        categories: ['Beaches', 'Party', 'Relaxation'],
        travelTime: '2.5 hours (Flight)',
        popularityScore: 95,
      },
      {
        name: 'Varanasi, Uttar Pradesh',
        description: 'A major religious hub in India, known for its ghats and the sacred Ganges river.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000',
        rating: 4.7,
        weather: '35°C',
        budgetTier: 'budget',
        distance: '800 km',
        categories: ['Spiritual', 'Historical'],
        travelTime: '15 hours',
        popularityScore: 90,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.foodItem.createMany({
    data: [
      {
        name: 'Chole Bhature',
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=1000',
        price: 150,
        rating: 4.9,
        location: 'Sita Ram Diwan Chand, Delhi',
        description: 'Spicy chickpea curry served with fried bread.',
        category: 'street food',
      },
      {
        name: 'Masala Dosa',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=1000',
        price: 120,
        rating: 4.8,
        location: 'Vidyarthi Bhavan, Bangalore',
        description: 'Crispy rice crepe filled with spiced potato curry.',
        category: 'vegetarian',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.hiddenGem.createMany({
    data: [
      {
        name: 'Sethan Village',
        photos: ['https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1000'],
        description: 'A tiny Buddhist village near Manali, famous for igloo stays in winter and serene apple orchards.',
        crowdLevel: 'low',
        difficultyLevel: 'moderate',
        localTips: 'Carry heavy woolens. Only accessible via 4x4 vehicles during peak winter.',
        bestSeason: 'Jan - March for Snow, May - June for Summer',
        estimatedBudget: 3000,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.eventItem.createMany({
    data: [
      {
        name: 'Sunburn Goa',
        date: 'Dec 28-30',
        location: 'Vagator Beach, Goa',
        description: "Asia's biggest electronic dance music festival.",
        popularity: 99,
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000',
      },
      {
        name: 'Pushkar Camel Fair',
        date: 'November',
        location: 'Pushkar, Rajasthan',
        description: 'Annual multi-day cultural fete and camel fair.',
        popularity: 95,
        image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=1000',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.emergencyContact.createMany({
    data: [
      { name: 'City Hospital', type: 'Hospital', phone: '102', distance: '2.5 km', address: 'Main Road, City Center' },
      { name: 'Central Police Station', type: 'Police', phone: '100', distance: '1.2 km', address: 'Market Square' },
      { name: '24/7 Pharmacy', type: 'Pharmacy', phone: '9876543210', distance: '0.5 km', address: 'Near Bus Stand' },
    ],
    skipDuplicates: true,
  });

  await prisma.achievement.createMany({
    data: [
      { title: 'Mountain Explorer', description: 'Visit 5 mountain destinations.', icon: 'Mountain', maxProgress: 5 },
      { title: 'Food Hunter', description: 'Try 10 local delicacies.', icon: 'Utensils', maxProgress: 10 },
      { title: 'Weekend Traveler', description: 'Take 3 weekend trips.', icon: 'Calendar', maxProgress: 3 },
    ],
    skipDuplicates: true,
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete.');
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
