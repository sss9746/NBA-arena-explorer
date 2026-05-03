import { teams } from "./teams";

export type Game = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  arenaId: string;
  date: string;
  time: string;
  matchup: string;
  ticketUrl: string;
};

const awayOffsets = [7, 13];
const timeSlots = [
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
];

export const games: Game[] = teams.flatMap((homeTeam, index) =>
  awayOffsets.map((offset, gameIndex) => {
    const awayTeam = teams[(index + offset) % teams.length];
    const month = gameIndex === 0 ? "11" : "12";
    const dayBase = gameIndex === 0 ? 10 : 1;
    const day = String(dayBase + (index % 20)).padStart(2, "0");

    return {
      id: `${homeTeam.id}-${awayTeam.id}-${month}-${day}`,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      arenaId: homeTeam.arenaId,
      date: `2026-${month}-${day}`,
      time: timeSlots[(index + gameIndex) % timeSlots.length],
      matchup: `${awayTeam.name} at ${homeTeam.name}`,
      ticketUrl: `https://www.nba.com/${homeTeam.id}/tickets`,
    };
  })
);
