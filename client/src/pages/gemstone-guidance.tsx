import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gem, Shield, Heart, DollarSign, Star, Calendar, Clock } from "lucide-react";
import { pageTransitions, cardVariants, staggerContainer } from "@/components/page-transition";

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

  const getGemstoneRecommendations = (details: BirthDetails): GemstoneSuggestion[] => {
    // Authentic gemstone recommendations based on astrological principles
    const recommendations: GemstoneSuggestion[] = [];

    // Based on zodiac sign (Libra)
    if (details.zodiacSign === "Libra") {
      recommendations.push({
        name: "Opal",
        color: "Multi-color",
        purpose: "love",
        planet: "Venus",
        chakra: "Heart",
        benefits: [
          "Enhances love and emotional healing",
          "Brings balance and harmony in relationships",
          "Amplifies artistic and creative abilities",
          "Promotes peace and emotional stability"
        ],
        wearingInstructions: "Wear as ring on ring finger or pendant over heart",
        bestDays: ["Friday"],
        timeToWear: "Friday evening or during Shukla Paksha"
      });

      recommendations.push({
        name: "Rose Quartz",
        color: "Pink",
        purpose: "love",
        planet: "Venus",
        chakra: "Heart",
        benefits: [
          "Unconditional love and self-acceptance",
          "Heals emotional wounds and trauma",
          "Attracts romantic partnerships",
          "Promotes forgiveness and compassion"
        ],
        wearingInstructions: "Wear as pendant or keep in bedroom",
        bestDays: ["Friday", "Monday"],
        timeToWear: "Evening during Venus hora"
      });
    }

    // Previous Pisces recommendations (commented out)
    if (details.zodiacSign === "Pisces") {
      recommendations.push({
        name: "Aquamarine",
        color: "Blue-green",
        purpose: "healing",
        planet: "Neptune",
        chakra: "Throat",
        benefits: [
          "Enhances intuition and psychic abilities",
          "Brings emotional clarity and calm",
          "Improves communication skills",
          "Protects during water travel"
        ],
        wearingInstructions: "Wear as pendant close to throat chakra, or ring on index finger",
        bestDays: ["Monday", "Thursday"],
        timeToWear: "Dawn or during full moon"
      });

      recommendations.push({
        name: "Amethyst",
        color: "Purple",
        purpose: "wisdom",
        planet: "Jupiter",
        chakra: "Crown",
        benefits: [
          "Strengthens spiritual connection",
          "Reduces stress and anxiety",
          "Enhances meditation practice",
          "Improves sleep quality"
        ],
        wearingInstructions: "Wear as ring on middle finger or keep under pillow",
        bestDays: ["Thursday", "Sunday"],
        timeToWear: "Evening or before meditation"
      });
    }

    // Based on moon sign (Aquarius)
    if (details.moonSign === "Aquarius") {
      recommendations.push({
        name: "Amethyst",
        color: "Purple",
        purpose: "wisdom",
        planet: "Saturn",
        chakra: "Crown",
        benefits: [
          "Enhances intuition and spiritual awareness",
          "Calms anxiety and promotes mental clarity",
          "Supports humanitarian ideals",
          "Improves focus and concentration"
        ],
        wearingInstructions: "Wear as ring on middle finger or crown chakra",
        bestDays: ["Saturday"],
        timeToWear: "Saturday morning during meditation"
      });

      recommendations.push({
        name: "Garnet",
        color: "Deep Red",
        purpose: "protection",
        planet: "Rahu",
        chakra: "Root",
        benefits: [
          "Provides grounding and stability",
          "Enhances commitment and devotion",
          "Boosts self-confidence and courage",
          "Protects from negative energies"
        ],
        wearingInstructions: "Wear as ring on index finger or base chakra",
        bestDays: ["Saturday", "Tuesday"],
        timeToWear: "Tuesday morning for strength"
      });
    }

    // Previous Cancer recommendations (commented out)
    if (details.moonSign === "Cancer") {
      recommendations.push({
        name: "Moonstone",
        color: "White/Cream",
        purpose: "healing",
        planet: "Moon",
        chakra: "Sacral",
        benefits: [
          "Balances emotions and mood swings",
          "Enhances feminine energy",
          "Improves relationships",
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

    // Based on life path number (1)
    if (details.lifePathNumber === 1) {
      recommendations.push({
        name: "Ruby",
        color: "Red",
        purpose: "prosperity",
        planet: "Sun",
        chakra: "Solar Plexus",
        benefits: [
          "Enhances leadership and authority",
          "Boosts confidence and self-esteem",
          "Attracts success and recognition",
          "Increases vitality and energy"
        ],
        wearingInstructions: "Wear as ring on ring finger of right hand",
        bestDays: ["Sunday"],
        timeToWear: "Sunday morning during sunrise"
      });
    }

    // Previous life path 9 recommendations (commented out)
    if (details.lifePathNumber === 9) {
      recommendations.push({
        name: "Red Coral",
        color: "Red",
        purpose: "prosperity",
        planet: "Mars",
        chakra: "Root",
        benefits: [
          "Increases leadership qualities",
          "Boosts confidence and courage",
          "Enhances physical strength",
          "Brings success in ventures"
        ],
        wearingInstructions: "Wear as ring on ring finger of right hand",
        bestDays: ["Tuesday"],
        timeToWear: "Tuesday morning during sunrise"
      });
    }

    // Based on ascendant (Sagittarius)
    if (details.ascendant === "Sagittarius") {
      recommendations.push({
        name: "Yellow Sapphire",
        color: "Yellow",
        purpose: "wisdom",
        planet: "Jupiter",
        chakra: "Solar Plexus",
        benefits: [
          "Enhances wisdom and spiritual growth",
          "Brings good fortune and prosperity",
          "Improves teaching and learning abilities",
          "Supports higher education and travel"
        ],
        wearingInstructions: "Wear as ring on index finger or pendant",
        bestDays: ["Thursday"],
        timeToWear: "Thursday morning during Jupiter hora"
      });
    }

    // Previous Virgo recommendations (commented out)
    if (details.ascendant === "Virgo") {
      recommendations.push({
        name: "Emerald",
        color: "Green",
        purpose: "wisdom",
        planet: "Mercury",
        chakra: "Heart",
        benefits: [
          "Enhances analytical abilities",
          "Improves communication skills",
          "Brings prosperity in business",
          "Strengthens nervous system"
        ],
        wearingInstructions: "Wear as ring on little finger or pendant",
        bestDays: ["Wednesday"],
        timeToWear: "Wednesday morning"
      });
    }

    return recommendations;
  };

  const gemstoneRecommendations = getGemstoneRecommendations(birthDetails);

  const getPurposeIcon = (purpose: string) => {
    switch (purpose) {
      case "healing": return <Heart className="w-4 h-4" />;
      case "protection": return <Shield className="w-4 h-4" />;
      case "prosperity": return <DollarSign className="w-4 h-4" />;
      case "love": return <Heart className="w-4 h-4" />;
      case "wisdom": return <Star className="w-4 h-4" />;
      default: return <Gem className="w-4 h-4" />;
    }
  };

  const filteredGemstones = selectedPurpose === "all" 
    ? gemstoneRecommendations 
    : gemstoneRecommendations.filter(gem => gem.purpose === selectedPurpose);

  return (
    <motion.div 
      className="min-h-screen p-6"
      style={{background: 'var(--cosmic-gradient-3)'}}
      variants={pageTransitions.home}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--cosmic-lavender)'}}>
            <Gem className="w-8 h-8 inline-block mr-3" style={{color: 'var(--cosmic-gold)'}} />
            Gemstone & Crystal Guidance
          </h1>
          <p className="text-lg max-w-3xl mx-auto" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
            Discover your personalized gemstone recommendations based on your complete astrological profile
          </p>
        </motion.div>

        {/* Birth Details Summary */}
        <motion.div 
          className="mb-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
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
        </motion.div>

        {/* Purpose Filter */}
        <motion.div 
          className="mb-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
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
        </motion.div>

        {/* Gemstone Recommendations */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filteredGemstones.map((gemstone, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full border-2 hover:shadow-lg transition-all duration-300" 
                    style={{borderColor: 'var(--cosmic-purple)', background: 'var(--cosmic-indigo)'}}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2" style={{color: 'var(--cosmic-lavender)'}}>
                      <Gem className="w-5 h-5" style={{color: 'var(--cosmic-gold)'}} />
                      {gemstone.name}
                    </CardTitle>
                    <Badge 
                      variant="secondary"
                      className="capitalize"
                      style={{background: 'var(--cosmic-purple)', color: 'var(--cosmic-lavender)'}}
                    >
                      {getPurposeIcon(gemstone.purpose)}
                      <span className="ml-1">{gemstone.purpose}</span>
                    </Badge>
                  </div>
                  <CardDescription style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                    {gemstone.color} • {gemstone.planet} • {gemstone.chakra} Chakra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2" style={{color: 'var(--cosmic-gold)'}}>Benefits:</h4>
                    <ul className="space-y-1">
                      {gemstone.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2" style={{color: 'var(--cosmic-lavender)'}}>
                          <Star className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: 'var(--cosmic-gold)'}} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2" style={{color: 'var(--cosmic-gold)'}}>
                      <Calendar className="w-4 h-4" />
                      How to Wear:
                    </h4>
                    <p className="text-sm mb-2" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
                      {gemstone.wearingInstructions}
                    </p>
                    <div className="flex items-center gap-4 text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {gemstone.bestDays.join(", ")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {gemstone.timeToWear}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Important Notes */}
        <motion.div 
          className="mt-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-2" style={{borderColor: 'var(--cosmic-gold)', background: 'var(--cosmic-indigo)'}}>
            <CardHeader>
              <CardTitle style={{color: 'var(--cosmic-gold)'}}>Important Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm" style={{color: 'var(--cosmic-lavender)'}}>
                <p>• Always cleanse new gemstones before wearing (moonlight, salt water, or sage)</p>
                <p>• Choose natural, untreated stones for maximum astrological benefit</p>
                <p>• Start wearing gradually to allow your energy to adjust</p>
                <p>• Consult with a qualified gemologist for authenticity verification</p>
                <p>• Remove during sleep unless specifically recommended otherwise</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}