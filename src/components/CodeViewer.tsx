import React, { useState } from 'react';
import { X, Code, Check, Copy } from 'lucide-react';

interface CodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ZUSTAND_CODE = `// src/store/favoritesStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/product';

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product: Product) => {
        const { favorites } = get();
        if (!favorites.some((item) => item.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },

      removeFavorite: (productId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId)
        }));
      },

      toggleFavorite: (product: Product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);
        if (exists) {
          set({ favorites: favorites.filter((item) => item.id !== product.id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },

      clearFavorites: () => set({ favorites: [] }),

      isFavorite: (productId: string) => {
        return get().favorites.some((item) => item.id === productId);
      }
    }),
    {
      name: 'favorites-zustand-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);`;

const CONTEXT_CODE = `// src/context/FavoritesContext.tsx
import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { Product } from '../types/product';

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: Product }
  | { type: 'CLEAR_FAVORITES' };

const favoritesReducer = (state: { favorites: Product[] }, action: FavoritesAction) => {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      const exists = state.favorites.some(item => item.id === action.payload.id);
      return {
        favorites: exists
          ? state.favorites.filter(item => item.id !== action.payload.id)
          : [...state.favorites, action.payload]
      };
    case 'REMOVE_FAVORITE':
      return { favorites: state.favorites.filter(item => item.id !== action.payload) };
    case 'CLEAR_FAVORITES':
      return { favorites: [] };
    default:
      return state;
  }
};

const FavoritesContext = createContext<any>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { favorites: [] });

  const value = useMemo(() => ({
    favorites: state.favorites,
    toggleFavorite: (product: Product) => dispatch({ type: 'TOGGLE_FAVORITE', payload: product }),
    removeFavorite: (id: string) => dispatch({ type: 'REMOVE_FAVORITE', payload: id }),
    clearFavorites: () => dispatch({ type: 'CLEAR_FAVORITES' }),
    isFavorite: (id: string) => state.favorites.some(item => item.id === id)
  }), [state.favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};`;

export const CodeViewer: React.FC<CodeViewerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'zustand' | 'context'>('zustand');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = activeTab === 'zustand' ? ZUSTAND_CODE : CONTEXT_CODE;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="drawer-overlay" onClick={onClose} style={{ justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <Code size={22} className="text-indigo-400" />
            <span>Mã nguồn Cài đặt (Source Code)</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs & Copy Button */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mode-switch-container">
            <button
              className={`mode-btn ${activeTab === 'zustand' ? 'active' : ''}`}
              onClick={() => setActiveTab('zustand')}
            >
              Cách 1: Zustand Store (favoritesStore.ts)
            </button>
            <button
              className={`mode-btn ${activeTab === 'context' ? 'active' : ''}`}
              onClick={() => setActiveTab('context')}
            >
              Cách 2: Context + useMemo (FavoritesContext.tsx)
            </button>
          </div>

          <button className="code-inspector-btn" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Đã sao chép!' : 'Sao chép code'}
          </button>
        </div>

        {/* Modal Code Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <pre className="code-block">{currentCode}</pre>
        </div>
      </div>
    </div>
  );
};
