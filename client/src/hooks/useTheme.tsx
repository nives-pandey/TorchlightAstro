import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'sanctuary' | 'satin-elegance' | 'rose-mauve' | 'feminine-serenity';

interface CustomTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  gradient: string;
}

interface ThemeContextType {
  theme: Theme | 'custom';
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, ThemeConfig>;
  customTheme?: CustomTheme;
  setCustomTheme: (theme: CustomTheme) => void;
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
    name: 'Sanctuary (Default)',
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
  'satin-elegance': {
    name: 'Satin Elegance',
    description: 'Alabaster white with satin sheen accents',
    icon: '✨',
    colors: {
      background: '#F7F7F2', // Alabaster White
      primaryAccent: '#CEB78A', // Satin Sheen
      secondaryAccent: '#2F2F2F', // Satin Black
      textPrimary: '#2C2C2C', // Dark text for contrast
      borderMuted: '#E8E8E0',
      cardBg: 'rgba(255, 255, 255, 0.9)', // Silky White
      gradientFrom: '#F7F7F2',
      gradientTo: '#EFEFEA'
    }
  },
  'rose-mauve': {
    name: 'Rose Mauve',
    description: 'Mauve sophistication with rose gold elegance',
    icon: '🌹',
    colors: {
      background: '#F5F0F5', // Light mauve background
      primaryAccent: '#E8B4B8', // Rose Gold
      secondaryAccent: '#C49CA3', // Mauve
      textPrimary: '#4A3C4A', // Dark mauve text
      borderMuted: '#D4BAC0',
      cardBg: 'rgba(248, 245, 248, 0.95)', // Almost white with mauve tint
      gradientFrom: '#F5F0F5',
      gradientTo: '#F0E8F0'
    }
  },
  'feminine-serenity': {
    name: 'Feminine Serenity',
    description: 'Light feminine blue with pleasant exotic green',
    icon: '🌺',
    colors: {
      background: '#F0F8FF', // Light feminine blue background
      primaryAccent: '#7FB3D3', // Light feminine blue
      secondaryAccent: '#81C784', // Pleasant exotic green
      textPrimary: '#2E4A62', // Deep blue-gray text
      borderMuted: '#B8D4E3',
      cardBg: 'rgba(255, 255, 255, 0.92)', // Silky white
      gradientFrom: '#F0F8FF',
      gradientTo: '#E8F4F8'
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme | 'custom'>('sanctuary');
  const [customTheme, setCustomThemeState] = useState<CustomTheme | undefined>();

  useEffect(() => {
    const savedTheme = localStorage.getItem('torchlight-theme') as Theme | 'custom';
    if (savedTheme && (themes[savedTheme as Theme] || savedTheme === 'custom')) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'custom' && customTheme) {
      // Apply custom theme colors
      root.style.setProperty('--background', customTheme.colors.background);
      root.style.setProperty('--primary-accent', customTheme.colors.primary);
      root.style.setProperty('--secondary-accent', customTheme.colors.secondary);
      root.style.setProperty('--text-primary', customTheme.colors.text);
      root.style.setProperty('--border-muted', customTheme.colors.border);
      root.style.setProperty('--card-bg', customTheme.colors.background + 'CC');
      root.style.setProperty('--gradient-from', customTheme.colors.background);
      root.style.setProperty('--gradient-to', customTheme.colors.accent + '20');
      root.style.setProperty('--nav-bg', 'rgba(0, 0, 0, 0.85)');
      root.style.setProperty('--nav-text', 'white');
    } else if (themes[theme as keyof typeof themes]) {
      // Apply predefined theme colors
      const themeConfig = themes[theme as keyof typeof themes];
      root.style.setProperty('--background', themeConfig.colors.background);
      root.style.setProperty('--primary-accent', themeConfig.colors.primaryAccent);
      root.style.setProperty('--secondary-accent', themeConfig.colors.secondaryAccent);
      root.style.setProperty('--text-primary', themeConfig.colors.textPrimary);
      root.style.setProperty('--border-muted', themeConfig.colors.borderMuted);
      root.style.setProperty('--card-bg', themeConfig.colors.cardBg);
      root.style.setProperty('--gradient-from', themeConfig.colors.gradientFrom);
      root.style.setProperty('--gradient-to', themeConfig.colors.gradientTo);
      
      // Set navigation colors based on theme brightness
      const isLightTheme = ['satin-elegance', 'rose-mauve', 'feminine-serenity'].includes(theme);
      if (isLightTheme) {
        root.style.setProperty('--nav-bg', 'rgba(255, 255, 255, 0.95)');
        root.style.setProperty('--nav-text', '#2C2C2C');
      } else {
        root.style.setProperty('--nav-bg', 'rgba(0, 0, 0, 0.85)');
        root.style.setProperty('--nav-text', 'white');
      }
    }
    
    // Save to localStorage
    localStorage.setItem('torchlight-theme', theme);
  }, [theme, customTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setCustomTheme = (newCustomTheme: CustomTheme) => {
    setCustomThemeState(newCustomTheme);
    setThemeState('custom');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes, customTheme, setCustomTheme }}>
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