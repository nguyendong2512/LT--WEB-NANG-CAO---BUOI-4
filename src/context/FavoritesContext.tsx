import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import type { Product } from '../types/product';

// Action Types for mini-Redux reducer
type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: Product }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'SET_FAVORITES'; payload: Product[] };

interface FavoritesState {
  favorites: Product[];
}

interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
}

const STORAGE_KEY = 'favorites-context-storage';

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.favorites.some(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, favorites: [...state.favorites, action.payload] };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload)
      };

    case 'TOGGLE_FAVORITE':
      const exists = state.favorites.some(item => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          favorites: state.favorites.filter(item => item.id !== action.payload.id)
        };
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };

    case 'CLEAR_FAVORITES':
      return { ...state, favorites: [] };

    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };

    default:
      return state;
  }
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { favorites: [] }, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { favorites: JSON.parse(saved) } : { favorites: [] };
    } catch {
      return { favorites: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [state.favorites]);

  const value = useMemo(() => {
    return {
      favorites: state.favorites,
      addFavorite: (product: Product) => dispatch({ type: 'ADD_FAVORITE', payload: product }),
      removeFavorite: (productId: string) => dispatch({ type: 'REMOVE_FAVORITE', payload: productId }),
      toggleFavorite: (product: Product) => dispatch({ type: 'TOGGLE_FAVORITE', payload: product }),
      clearFavorites: () => dispatch({ type: 'CLEAR_FAVORITES' }),
      isFavorite: (productId: string) => state.favorites.some((item: Product) => item.id === productId)
    };
  }, [state.favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};
