import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gem, Shield, Heart, DollarSign, Star, Calendar, Clock } from "lucide-react";

interface GemstoneSuggestion {
  name: string;
  color: string;
  purpose: "healing" | "protection" | "prosperity" | "love" | "wisdom";
  planet: string;
  chakra: string;
  benefits: string[];
  wearingInstructions: string;
  bestDays: string[];
  timeToWear: string;
}

interface BirthDetails {
  date: string;
  time: string;
  location: string;
  zodiacSign: string;
  moonSign: string;
  ascendant: string;
  birthNumber: number;
  lifePathNumber: number;
}

export default function GemstoneGuidance() {
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all");

  // Awatef's birth details: October 18, 1980, 10:30 AM, Paris
  const birthDetails: BirthDetails = {
    date: "1980-10-18",
    time: "10:30",
    location: "Paris, France",
    zodiacSign: "Libra", // Oct 18 is Libra
    moonSign: "Aquarius", // Calculated for Oct 18, 1980
    ascendant: "Sagittarius", // 10:30 AM birth time in Paris
    birthNumber: 9, // 1+8 = 9
    lifePathNumber: 1 // 1+8+1+0+1+9+8+0 = 28 = 2+8 = 10 = 1+0 = 1
  };

  function getPurposeIcon(purpose: string) {
    switch(purpose) {
      case "healing": return <Heart className="w-4 h-4" />;
      case "protection": return <Shield className="w-4 h-4" />;
      case "prosperity": return <DollarSign className="w-4 h-4" />;
      case "wisdom": return <Star className="w-4 h-4" />;
      default: return <Gem className="w-4 h-4" />;
    }
  }

  // Generate recommendations based on birth details
  const generateGemstoneRecommendations = (): GemstoneSuggestion[] => {
    const recommendations: GemstoneSuggestion[] = [];

    // Based on zodiac sign (Libra)
    if (birthDetails.zodiacSign === "Libra") {
      recommendations.push({
        name: "Opal",
        color: "Multicolor",
        purpose: "love",
        planet: "Venus", 
        chakra: "Heart",
        benefits: [
          "Enhances love and emotional healing",
          "Brings harmony in relationships",
          "Amplifies artistic and creative abilities",
          "Supports reproductive health"
        ],
        wearingInstructions: "Wear as ring on ring finger or necklace",
        bestDays: ["Monday"],
        timeToWear: "Monday evening or during waxing moon"
      });

      recommendations.push({
        name: "Pearl",
        color: "White",
        purpose: "protection",
        planet: "Moon",
        chakra: "Heart",
        benefits: [
          "Provides emotional stability",
          "Enhances maternal instincts",
          "Brings peace and tranquility",
          "Improves mental clarity"
        ],
        wearingInstructions: "Wear as ring on little finger or pearl necklace",
        bestDays: ["Monday"],
        timeToWear: "Monday morning after sunrise"
      });
    }

    return recommendations.slice(0, 8);
  };

  const gemstoneRecommendations = generateGemstoneRecommendations();
  const filteredGemstones = selectedPurpose === "all" 
    ? gemstoneRecommendations 
    : gemstoneRecommendations.filter(gem => gem.purpose === selectedPurpose);

  return (
    <div 
      className="min-h-screen p-6"
      style={{background: 'var(--cosmic-gradient-1)'}}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - NO ANIMATIONS */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--cosmic-lavender)'}}>
            <Gem className="w-8 h-8 inline-block mr-3" style={{color: 'var(--cosmic-gold)'}} />
            Gemstone & Crystal Guidance
          </h1>
          <p className="text-lg max-w-3xl mx-auto" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
            Discover your personalized gemstone recommendations based on your complete astrological profile
          </p>
        </div>

        {/* Birth Details Summary - NO ANIMATIONS */}
        <div className="mb-8">
          <Card className="border-2" style={{borderColor: 'var(--cosmic-purple)', background: 'var(--cosmic-indigo)'}}>
            <CardHeader>
              <CardTitle style={{color: 'var(--cosmic-lavender)'}}>Your Astrological Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm opacity-70" style={{color: 'var(--cosmic-lavender)'}}>Zodiac Sign</p>
                  <p className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>{birthDetails.zodiacSign}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{color: 'var(--cosmic-lavender)'}}>Moon Sign</p>
                  <p className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>{birthDetails.moonSign}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{color: 'var(--cosmic-lavender)'}}>Ascendant</p>
                  <p className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>{birthDetails.ascendant}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{color: 'var(--cosmic-lavender)'}}>Life Path</p>
                  <p className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>{birthDetails.lifePathNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purpose Filter - NO ANIMATIONS */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {["all", "healing", "protection", "prosperity", "wisdom"].map((purpose) => (
              <Button
                key={purpose}
                variant={selectedPurpose === purpose ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPurpose(purpose)}
                className="capitalize"
                style={{
                  background: selectedPurpose === purpose ? 'var(--cosmic-gradient-2)' : 'transparent',
                  borderColor: 'var(--cosmic-purple)',
                  color: 'var(--cosmic-lavender)'
                }}
              >
                {getPurposeIcon(purpose)}
                <span className="ml-2">{purpose}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Gemstone Cards - NO ANIMATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGemstones.map((gemstone, index) => (
            <Card 
              key={index} 
              className="border-2 hover:shadow-lg transition-shadow duration-300" 
              style={{borderColor: 'var(--cosmic-purple)', background: 'var(--cosmic-indigo)'}}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2" style={{color: 'var(--cosmic-lavender)'}}>
                    <Gem className="w-5 h-5" style={{color: 'var(--cosmic-gold)'}} />
                    {gemstone.name}
                  </CardTitle>
                  <Badge 
                    className="capitalize"
                    style={{background: 'var(--cosmic-purple)', color: 'var(--cosmic-lavender)'}}
                  >
                    {gemstone.purpose}
                  </Badge>
                </div>
                <CardDescription style={{color: 'var(--cosmic-lavender)', opacity: 0.7}}>
                  {gemstone.color} • {gemstone.planet} • {gemstone.chakra} Chakra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="benefits" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4" style={{background: 'var(--cosmic-navy)'}}>
                    <TabsTrigger value="benefits" style={{color: 'var(--cosmic-lavender)'}}>Benefits</TabsTrigger>
                    <TabsTrigger value="wearing" style={{color: 'var(--cosmic-lavender)'}}>Wearing</TabsTrigger>
                    <TabsTrigger value="timing" style={{color: 'var(--cosmic-lavender)'}}>Timing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="benefits">
                    <div className="space-y-2">
                      {gemstone.benefits.slice(0, 3).map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 rounded" style={{background: 'var(--cosmic-navy)'}}>
                          <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: 'var(--cosmic-gold)'}} />
                          <span className="text-sm" style={{color: 'var(--cosmic-lavender)'}}>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wearing">
                    <div className="space-y-3 p-3 rounded" style={{background: 'var(--cosmic-navy)'}}>
                      <p className="text-sm" style={{color: 'var(--cosmic-lavender)'}}>
                        <strong>Instructions:</strong> {gemstone.wearingInstructions}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timing">
                    <div className="space-y-3 p-3 rounded" style={{background: 'var(--cosmic-navy)'}}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{color: 'var(--cosmic-gold)'}} />
                        <span className="text-sm" style={{color: 'var(--cosmic-lavender)'}}>
                          Best Days: {gemstone.bestDays.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{color: 'var(--cosmic-gold)'}} />
                        <span className="text-sm" style={{color: 'var(--cosmic-lavender)'}}>
                          {gemstone.timeToWear}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}