// Deterministic, synthetic route generation — there is no third-party
// transit/flight API wired up (would require API keys this repo doesn't
// have). See API_CONTRACT.md Assumption 4. The output shape matches the
// frontend's `RouteOption`/`RouteStep` types exactly.

function seedFromString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pseudoRandom(seed: number, salt: number): number {
  const x = Math.sin(seed + salt) * 10000;
  return x - Math.floor(x);
}

interface RouteStep {
  id: string;
  type: 'auto' | 'train' | 'bus' | 'flight' | 'taxi' | 'walk';
  description: string;
  cost: number;
  duration: string;
  durationMinutes: number;
}

interface RouteOption {
  id: string;
  type: 'cheapest' | 'fastest' | 'recommended' | 'scenic';
  steps: RouteStep[];
  totalCost: number;
  totalDuration: string;
  totalDurationMinutes: number;
  comfortScore: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function buildOption(
  seed: number,
  type: RouteOption['type'],
  origin: string,
  destination: string,
): RouteOption {
  const baseCost = 500 + Math.round(pseudoRandom(seed, 1) * 6000);
  const baseMinutes = 120 + Math.round(pseudoRandom(seed, 2) * 900);

  const costMultiplier = type === 'cheapest' ? 0.55 : type === 'fastest' ? 1.8 : type === 'scenic' ? 0.9 : 1;
  const durationMultiplier = type === 'fastest' ? 0.4 : type === 'cheapest' ? 1.6 : type === 'scenic' ? 1.3 : 1;

  const legTypes: RouteStep['type'][] =
    type === 'fastest'
      ? ['taxi', 'flight', 'taxi']
      : type === 'cheapest'
        ? ['walk', 'bus', 'auto']
        : type === 'scenic'
          ? ['auto', 'train', 'bus', 'taxi']
          : ['auto', 'train', 'bus', 'taxi'];

  let remainingCost = Math.round(baseCost * costMultiplier);
  let remainingMinutes = Math.round(baseMinutes * durationMultiplier);

  const steps: RouteStep[] = legTypes.map((legType, index) => {
    const isLast = index === legTypes.length - 1;
    const share = isLast ? 1 : 0.2 + pseudoRandom(seed, 10 + index) * 0.3;
    const cost = isLast ? remainingCost : Math.max(0, Math.round(remainingCost * share));
    const minutes = isLast ? remainingMinutes : Math.max(5, Math.round(remainingMinutes * share));
    remainingCost -= cost;
    remainingMinutes -= minutes;

    const descriptions: Record<RouteStep['type'], string> = {
      auto: `Auto from ${origin} to the nearest transit hub`,
      train: `Train toward ${destination}`,
      bus: `Bus connection toward ${destination}`,
      flight: `Direct flight to ${destination}`,
      taxi: `Taxi to final drop-off in ${destination}`,
      walk: `Walk to the nearest stop`,
    };

    return {
      id: `s${index + 1}`,
      type: legType,
      description: descriptions[legType],
      cost: Math.max(0, cost),
      duration: formatDuration(Math.max(5, minutes)),
      durationMinutes: Math.max(5, minutes),
    };
  });

  const totalCost = steps.reduce((sum, s) => sum + s.cost, 0);
  const totalDurationMinutes = steps.reduce((sum, s) => sum + s.durationMinutes, 0);
  const comfortScore =
    type === 'fastest' ? 90 + Math.round(pseudoRandom(seed, 20) * 10) : type === 'cheapest' ? 55 + Math.round(pseudoRandom(seed, 21) * 15) : 75 + Math.round(pseudoRandom(seed, 22) * 15);

  return {
    id: `r-${type}`,
    type,
    steps,
    totalCost,
    totalDuration: formatDuration(totalDurationMinutes),
    totalDurationMinutes,
    comfortScore: Math.min(100, comfortScore),
  };
}

export function generateRouteOptions(origin: string, destination: string): RouteOption[] {
  const seed = seedFromString(`${origin.toLowerCase()}->${destination.toLowerCase()}`);
  return [
    buildOption(seed, 'recommended', origin, destination),
    buildOption(seed, 'cheapest', origin, destination),
    buildOption(seed, 'fastest', origin, destination),
  ];
}
