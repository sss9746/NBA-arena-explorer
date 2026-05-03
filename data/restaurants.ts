import { arenas } from "./arenas";

export type Restaurant = {
  id: string;
  arenaId: string;
  name: string;
  cuisine: string;
  distance: string;
  price: "$" | "$$" | "$$$";
  rating: number;
  notes: string;
};

const restaurantTemplates = [
  {
    suffix: "Tip-Off Tavern",
    cuisine: "American",
    distance: "0.2 mi",
    price: "$$" as const,
    rating: 4.4,
    notes:
      "Popular pregame spot with quick service, TVs at the bar, and a crowd that turns over before tip-off.",
  },
  {
    suffix: "Slice House",
    cuisine: "Pizza",
    distance: "0.4 mi",
    price: "$" as const,
    rating: 4.2,
    notes:
      "Fast casual option that works well for a quick bite before the game or a late postgame stop.",
  },
  {
    suffix: "Market Table",
    cuisine: "Contemporary",
    distance: "0.6 mi",
    price: "$$$" as const,
    rating: 4.6,
    notes:
      "Stronger sit-down choice for date-night or premium plans, with reservations recommended on busy weekends.",
  },
];

export const restaurants: Restaurant[] = arenas.flatMap((arena) =>
  restaurantTemplates.map((template, index) => ({
    id: `${arena.id}-${template.suffix
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`,
    arenaId: arena.id,
    name:
      index === 1
        ? `${arena.arenaName.split(" ")[0]} ${template.suffix}`
        : `${arena.city} ${template.suffix}`,
    cuisine: template.cuisine,
    distance: template.distance,
    price: template.price,
    rating: Number((template.rating + ((arenas.indexOf(arena) % 3) * 0.1)).toFixed(1)),
    notes:
      index === 0
        ? `${template.notes} Best for fans who want to stay close to ${arena.arenaName}.`
        : index === 1
          ? `${template.notes} Usually one of the easier walk-up options near ${arena.teamName} games.`
          : `${template.notes} Good pick when you want a longer meal around a ${arena.teamName} home date.`,
  }))
);
