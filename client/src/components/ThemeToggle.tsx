import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Theme {
  id: string;
  name: string;
  description: string;
}

const themes: Theme[] = [
  { id: 'theme-atelier', name: 'Atelier', description: 'Classic elegance with alabaster and gold' },
  { id: 'theme-sanctuary', name: 'Sanctuary', description: 'Warm parchment with muted rose accents' },
  { id: 'theme-midnight-bloom', name: 'Midnight Bloom', description: 'Dark charcoal with vibrant pink highlights' }
];

export const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState('theme-atelier');

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('torchlight-theme') || 'theme-atelier';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    // Clear all theme classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    // Add the new theme class
    document.body.classList.add(themeId);
    // Save to localStorage
    localStorage.setItem('torchlight-theme', themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Theme:</span>
      <Select value={currentTheme} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-40 bg-card text-card-foreground border-border">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div>
                <div className="font-medium">{theme.name}</div>
                <div className="text-xs text-muted-foreground">{theme.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};