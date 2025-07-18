import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team } from '@/services/api';

export interface FavoriteTeam extends Team {
  notes?: string;
  dateAdded: string;
}

interface FavoritesContextType {
  favorites: FavoriteTeam[];
  addFavorite: (team: Team, notes?: string) => void;
  removeFavorite: (teamId: number) => void;
  updateFavorite: (teamId: number, notes: string) => void;
  isFavorite: (teamId: number) => boolean;
  getFavorite: (teamId: number) => FavoriteTeam | undefined;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on mount
    const storedFavorites = localStorage.getItem('footballApp_favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        localStorage.removeItem('footballApp_favorites');
      }
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteTeam[]) => {
    localStorage.setItem('footballApp_favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addFavorite = (team: Team, notes?: string) => {
    const existingIndex = favorites.findIndex(fav => fav.id === team.id);
    
    if (existingIndex >= 0) {
      // Update existing favorite
      const updatedFavorites = [...favorites];
      updatedFavorites[existingIndex] = {
        ...updatedFavorites[existingIndex],
        notes: notes || updatedFavorites[existingIndex].notes,
      };
      saveFavorites(updatedFavorites);
    } else {
      // Add new favorite
      const newFavorite: FavoriteTeam = {
        ...team,
        notes,
        dateAdded: new Date().toISOString(),
      };
      saveFavorites([...favorites, newFavorite]);
    }
  };

  const removeFavorite = (teamId: number) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== teamId);
    saveFavorites(updatedFavorites);
  };

  const updateFavorite = (teamId: number, notes: string) => {
    const updatedFavorites = favorites.map(fav =>
      fav.id === teamId ? { ...fav, notes } : fav
    );
    saveFavorites(updatedFavorites);
  };

  const isFavorite = (teamId: number): boolean => {
    return favorites.some(fav => fav.id === teamId);
  };

  const getFavorite = (teamId: number): FavoriteTeam | undefined => {
    return favorites.find(fav => fav.id === teamId);
  };

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavorite,
    isFavorite,
    getFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};