import { useFavoritesStore } from '../store/favoritesStore';
import { useFavoritesContext } from '../context/FavoritesContext';
import type { StoreMode } from '../types/product';

export const useFavorites = (mode: StoreMode) => {
  const zustandStore = useFavoritesStore();
  
  // Safe wrapper for context in case caller is outside provider when mode is zustand
  let contextStore;
  try {
    contextStore = useFavoritesContext();
  } catch {
    contextStore = null;
  }

  if (mode === 'context' && contextStore) {
    return contextStore;
  }

  return zustandStore;
};
