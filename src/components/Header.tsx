import React from 'react';
import { Heart, Search, Code, Zap, Layers } from 'lucide-react';
import type { StoreMode } from '../types/product';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  storeMode: StoreMode;
  onStoreModeChange: (mode: StoreMode) => void;
  onToggleCodeInspector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  storeMode,
  onStoreModeChange,
  onToggleCodeInspector
}) => {
  return (
    <header className="glass-nav">
      <div className="container header-wrapper">
        {/* Logo */}
        <div className="logo-group">
          <div className="logo-icon">
            <Heart className="w-6 h-6 text-white fill-white" size={24} />
          </div>
          <div className="logo-text">
            <h1>LTWNC - Tuần 4</h1>
            <span>Zustand Favorites Store</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm yêu thích..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Store Mode Switcher & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mode Switcher */}
          <div className="mode-switch-container">
            <button
              className={`mode-btn ${storeMode === 'zustand' ? 'active' : ''}`}
              onClick={() => onStoreModeChange('zustand')}
              title="Cài đặt dùng Zustand store riêng (favoritesStore)"
            >
              <Zap size={14} />
              Zustand Store
            </button>
            <button
              className={`mode-btn ${storeMode === 'context' ? 'active' : ''}`}
              onClick={() => onStoreModeChange('context')}
              title="Cài đặt dùng FavoritesContext + useMemo (Context nâng cao)"
            >
              <Layers size={14} />
              Context + useMemo
            </button>
          </div>

          {/* View Code Button */}
          <button className="code-inspector-btn" onClick={onToggleCodeInspector}>
            <Code size={16} />
            Xem Code
          </button>

          {/* Favorites Button */}
          <button className="fav-trigger-btn" onClick={onOpenFavorites}>
            <Heart size={18} className="fill-rose-500 text-rose-500" />
            <span>Yêu thích</span>
            <span className="fav-badge">{favoritesCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
