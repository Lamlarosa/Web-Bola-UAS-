import axios from 'axios';

const API_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = '78c60d9ad3c4d3ce283376f0e22c50f9';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Types
export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round?: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  update: string;
}

export interface ApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

// API Functions
export const footballApi = {
  // Get all leagues
  getLeagues: async (): Promise<League[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>('/leagues');
      const leagues = response.data.response.map((item) => ({
        id: item.league.id,
        name: item.league.name,
        country: item.country.name,
        logo: item.league.logo,
        flag: item.country.flag,
        season:
          item.seasons?.find((s: any) => s.current && s.year <= 2023)?.year ||
          item.seasons?.filter((s: any) => s.year <= 2023).sort((a: any, b: any) => b.year - a.year)[0]?.year ||
          2023,
      }));
      return leagues;
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw new Error('Failed to fetch leagues');
    }
  },

  // Get leagues by country
  getLeaguesByCountry: async (country: string): Promise<League[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/leagues?country=${country}`);
      const leagues = response.data.response.map((item) => ({
        id: item.league.id,
        name: item.league.name,
        country: item.country.name,
        logo: item.league.logo,
        flag: item.country.flag,
        season: item.seasons?.find((s: any) => s.current)?.year || 2023,
      }));
      return leagues;
    } catch (error) {
      console.error('Error fetching leagues by country:', error);
      throw new Error('Failed to fetch leagues by country');
    }
  },

  // Get standings
  getStandings: async (leagueId: number, season: number = 2023): Promise<Standing[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/standings?league=${leagueId}&season=${season}`
      );

      const res = response.data.response;

      // Validate response structure
      if (
        Array.isArray(res) &&
        res.length > 0 &&
        res[0]?.league?.standings &&
        Array.isArray(res[0].league.standings[0])
      ) {
        return res[0].league.standings[0]; // type: Standing[]
      } else {
        console.warn('Standings not found or invalid structure', res);
        return [];
      }
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw new Error('Failed to fetch standings');
    }
  },

  // Get team by ID
  getTeam: async (teamId: number): Promise<Team | null> => {
    try {
      const response = await api.get<ApiResponse<{ team: Team }[]>>(`/teams?id=${teamId}`);
      const teamData = response.data.response?.[0]?.team;
      return teamData || null;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw new Error('Failed to fetch team');
    }
  },
};

export default footballApi;
