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

// Types for API responses
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
      const response = await api.get<ApiResponse<League[]>>('/leagues');
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw new Error('Failed to fetch leagues');
    }
  },

  // Get leagues by country
  getLeaguesByCountry: async (country: string): Promise<League[]> => {
    try {
      const response = await api.get<ApiResponse<League[]>>(`/leagues?country=${country}`);
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching leagues by country:', error);
      throw new Error('Failed to fetch leagues by country');
    }
  },

  // Get standings by league and season
  getStandings: async (leagueId: number, season: number = 2023): Promise<Standing[]> => {
    try {
      const response = await api.get<ApiResponse<{ league: any; standings: Standing[][] }[]>>(
        `/standings?league=${leagueId}&season=${season}`
      );
      
      if (response.data.response && response.data.response.length > 0) {
        return response.data.response[0].standings[0] || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw new Error('Failed to fetch standings');
    }
  },

  // Get team information
  getTeam: async (teamId: number): Promise<Team | null> => {
    try {
      const response = await api.get<ApiResponse<Team[]>>(`/teams?id=${teamId}`);
      return response.data.response?.[0] || null;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw new Error('Failed to fetch team');
    }
  },
};

export default footballApi;