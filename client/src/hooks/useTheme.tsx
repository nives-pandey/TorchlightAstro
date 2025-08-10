import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'sanctuary' | 'cosmic' | 'ethereal' | 'mystic' | 'aurora' | 'ocean';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, ThemeConfig>;
}

interface ThemeConfig {
  name: string;
  description: string;
  icon: string;
  colors: {
    background: string;
    primaryAccent: string;
    secondaryAccent: string;
    textPrimary: string;
    borderMuted: string;
    cardBg: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

const themes: Record<Theme, ThemeConfig> = {
  sanctuary: {
    name: 'Sanctuary',
    description: 'Warm charcoal with brushed gold',
    icon: '🕯️',
    colors: {
      background: '#36312E',
      primaryAccent: '#D4B35B',
      secondaryAccent: '#208B8B',
      textPrimary: '#F5F5DC',
      borderMuted: '#B0A9A4',
      cardBg: 'rgba(54, 49, 46, 0.85)',
      gradientFrom: '#1a1814',
      gradientTo: '#2d2620'
    }
  },
  cosmic: {
    name: 'Cosmic Purple',
    description: 'Deep space with amethyst accents',
    icon: '🌌',
    colors: {
      background: '#1a0f2e',
      primaryAccent: '#9d4edd',
      secondaryAccent: '#7209b7',
      textPrimary: '#e0aaff',
      borderMuted: '#6a4c93',
      cardBg: 'rgba(26, 15, 46, 0.85)',
      gradientFrom: '#0f0820',
      gradientTo: '#240046'
    }
  },
  ethereal: {
    name: 'Ethereal Pink',
    description: 'Soft pastels with rose gold',
    icon: '🌸',
    colors: {
      background: '#2d1b2e',
      primaryAccent: '#ff6b9d',
      secondaryAccent: '#ffeaa7',
      textPrimary: '#fdcb6e',
      borderMuted: '#a29bfe',
      cardBg: 'rgba(45, 27, 46, 0.85)',
      gradientFrom: '#1a0e1a',
      gradientTo: '#3d2a3d'
    }
  },
  mystic: {
    name: 'Mystic Emerald',
    description: 'Forest greens with golden highlights',
    icon: '🌿',
    colors: {
      background: '#0d2818',
      primaryAccent: '#52b788',
      secondaryAccent: '#f7dc6f',
      textPrimary: '#d8f3dc',
      borderMuted: '#74c69d',
      cardBg: 'rgba(13, 40, 24, 0.85)',
      gradientFrom: '#081c0f',
      gradientTo: '#1b4332'
    }
  },
  aurora: {
    name: 'Aurora Borealis',
    description: 'Nordic blues with electric accents',
    icon: '❄️',
    colors: {
      background: '#0f1624',
      primaryAccent: '#00d4ff',
      secondaryAccent: '#7b2cbf',
      textPrimary: '#caf0f8',
      borderMuted: '#48cae4',
      cardBg: 'rgba(15, 22, 36, 0.85)',
      gradientFrom: '#03045e',
      gradientTo: '#023e8a'
    }
  },
  ocean: {
    name: 'Ocean Depths',
    description: 'Deep sea with coral highlights',
    icon: '🌊',
    colors: {
      background: '#1e3a5f',
      primaryAccent: '#ff6b35',
      secondaryAccent: '#4ecdc4',
      textPrimary: '#f1faee',
      borderMuted: '#457b9d',
      cardBg: 'rgba(30, 58, 95, 0.85)',
      gradientFrom: '#0a1a2e',
      gradientTo: '#16213e'
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('sanctuary');

  useEffect(() => {
    const savedTheme = localStorage.getItem('torchlight-theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const themeConfig = themes[theme];
    const root = document.documentElement;
    
    // Apply theme colors to CSS variables
    root.style.setProperty('--background', themeConfig.colors.background);
    root.style.setProperty('--primary-accent', themeConfig.colors.primaryAccent);
    root.style.setProperty('--secondary-accent', themeConfig.colors.secondaryAccent);
    root.style.setProperty('--text-primary', themeConfig.colors.textPrimary);
    root.style.setProperty('--border-muted', themeConfig.colors.borderMuted);
    root.style.setProperty('--card-bg', themeConfig.colors.cardBg);
    root.style.setProperty('--gradient-from', themeConfig.colors.gradientFrom);
    root.style.setProperty('--gradient-to', themeConfig.colors.gradientTo);
    
    // Save to localStorage
    localStorage.setItem('torchlight-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}