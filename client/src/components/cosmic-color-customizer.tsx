import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Save, Eye, Palette, RefreshCw, Star, Download } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// Define the CustomTheme interface locally to match what we're using
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

const cosmicColorPresets = [
  { name: "Solar Flare", color: "#FF6B35", description: "Energetic orange-red" },
  { name: "Nebula Purple", color: "#8B5CF6", description: "Deep cosmic purple" },
  { name: "Starlight Blue", color: "#3B82F6", description: "Brilliant blue" },
  { name: "Galaxy Green", color: "#10B981", description: "Vibrant emerald" },
  { name: "Meteor Gold", color: "#F59E0B", description: "Radiant golden" },
  { name: "Lunar Silver", color: "#64748B", description: "Mystical silver" },
  { name: "Mars Red", color: "#EF4444", description: "Bold crimson" },
  { name: "Venus Pink", color: "#EC4899", description: "Ethereal rose" },
];

export default function CosmicColorCustomizer() {
  const { setCustomTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [themeName, setThemeName] = useState('My Cosmic Theme');
  const [themeDescription, setThemeDescription] = useState('A personalized cosmic experience');
  
  const [customColors, setCustomColors] = useState({
    primary: '#F59E0B',
    secondary: '#8B5CF6', 
    accent: '#10B981',
    background: '#1E293B',
    text: '#F8FAFC',
    border: '#64748B',
  });

  const [savedThemes, setSavedThemes] = useState<CustomTheme[]>([]);

  const handleColorChange = (colorKey: keyof typeof customColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const generateRandomTheme = () => {
    const getRandomColor = () => cosmicColorPresets[Math.floor(Math.random() * cosmicColorPresets.length)].color;
    
    setCustomColors({
      primary: getRandomColor(),
      secondary: getRandomColor(),
      accent: getRandomColor(),
      background: '#1E293B',
      text: '#F8FAFC',
      border: '#64748B',
    });
    
    setThemeName(`Cosmic Theme ${Date.now().toString().slice(-4)}`);
    setThemeDescription('A randomly generated cosmic palette');
  };

  const previewTheme = () => {
    const gradient = `linear-gradient(135deg, ${customColors.primary}20, ${customColors.secondary}20, ${customColors.accent}10)`;
    
    const tempTheme: CustomTheme = {
      id: 'preview',
      name: themeName,
      description: themeDescription,
      colors: customColors,
      gradient
    };
    
    setCustomTheme(tempTheme);
  };

  const saveTheme = () => {
    const gradient = `linear-gradient(135deg, ${customColors.primary}20, ${customColors.secondary}20, ${customColors.accent}10)`;
    
    const newTheme: CustomTheme = {
      id: `custom-${Date.now()}`,
      name: themeName,
      description: themeDescription,
      colors: customColors,
      gradient
    };
    
    setSavedThemes(prev => [...prev, newTheme]);
    setCustomTheme(newTheme);
    setOpen(false);
  };

  const applyTheme = (theme: CustomTheme) => {
    setCustomTheme(theme);
    setOpen(false);
  };

  const exportTheme = (theme: CustomTheme) => {
    const themeData = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 text-gray-900 border-purple-300 hover:border-purple-200 transition-all duration-200 hover:scale-105 font-semibold shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Customize</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-white/20 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Cosmic Color Palette Customizer
          </DialogTitle>
          <p className="text-white/70 text-sm">
            Create your own personalized cosmic color experience
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="create" className="text-white data-[state=active]:bg-purple-600">
              Create Theme
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-white data-[state=active]:bg-purple-600">
              Saved Themes ({savedThemes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {/* Theme Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm font-medium">Theme Name</Label>
                <Input
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-1"
                  placeholder="Enter theme name..."
                />
              </div>
              <div>
                <Label className="text-white text-sm font-medium">Description</Label>
                <Input
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-1"
                  placeholder="Describe your theme..."
                />
              </div>
            </div>

            {/* Color Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-white text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border-2 border-white/30 cursor-pointer"
                      style={{ backgroundColor: value }}
                      onClick={() => document.getElementById(`color-${key}`)?.click()}
                    />
                    <input
                      id={`color-${key}`}
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                      className="opacity-0 absolute pointer-events-none"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                      className="bg-white/10 border-white/20 text-white text-xs font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Preset Colors */}
            <div>
              <Label className="text-white text-sm font-medium mb-3 block">Cosmic Color Presets</Label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {cosmicColorPresets.map((preset) => (
                  <div
                    key={preset.name}
                    className="cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-center group"
                    onClick={() => handleColorChange('primary', preset.color)}
                  >
                    <div 
                      className="w-8 h-8 rounded mx-auto mb-1 border border-white/30 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-xs text-white/70">{preset.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <Card 
              className="border border-white/20 transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${customColors.primary}20, ${customColors.secondary}20, ${customColors.accent}10)`,
                borderColor: customColors.border + '50'
              }}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star style={{ color: customColors.primary }} className="h-5 w-5" />
                  Live Preview: {themeName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Badge style={{ backgroundColor: customColors.primary + '30', color: customColors.primary, borderColor: customColors.primary }}>
                      Primary
                    </Badge>
                    <Badge style={{ backgroundColor: customColors.secondary + '30', color: customColors.secondary, borderColor: customColors.secondary }}>
                      Secondary  
                    </Badge>
                    <Badge style={{ backgroundColor: customColors.accent + '30', color: customColors.accent, borderColor: customColors.accent }}>
                      Accent
                    </Badge>
                  </div>
                  <p className="text-white/80 text-sm">{themeDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={generateRandomTheme}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Random
              </Button>
              <Button 
                onClick={previewTheme}
                variant="outline" 
                className="border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={saveTheme}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Theme
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedThemes.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No saved themes yet</p>
                <p className="text-sm">Create your first custom theme to see it here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedThemes.map((theme) => (
                  <Card 
                    key={theme.id}
                    className="border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ 
                      background: theme.gradient,
                      borderColor: theme.colors.border + '50'
                    }}
                    onClick={() => applyTheme(theme)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center justify-between">
                        <span>{theme.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportTheme(theme);
                          }}
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 text-sm mb-3">{theme.description}</p>
                      <div className="flex gap-1">
                        {Object.entries(theme.colors).slice(0, 3).map(([key, color]) => (
                          <div
                            key={key}
                            className="w-6 h-6 rounded border border-white/30"
                            style={{ backgroundColor: color }}
                            title={key}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}