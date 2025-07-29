import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { 
  Calculator, 
  Star, 
  Heart, 
  Eye, 
  Lightbulb,
  TrendingUp,
  Calendar,
  Gem,
  Palette,
  Shield
} from "lucide-react";

interface NumerologyData {
  lifePath: any;
  destiny: any;
  soulUrge: any;
  personality: any;
  personalYear: any;
  compatibility: string;
  luckyNumbers: number[];
  challenges: string[];
  strengths: string[];
  tarotCards?: any;
  colors?: any;
  gemstones?: any;
}

export default function Numerology() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null);
  const { toast } = useToast();

  const numerologyMutation = useMutation({
    mutationFn: async (data: { fullName: string; birthDate: string }) => {
      const response = await apiRequest("POST", "/api/numerology/calculate", data);
      return response.json();
    },
    onSuccess: (response) => {
      setNumerologyData(response as NumerologyData);
      toast({
        title: "Numerology Calculated",
        description: "Your complete numerological profile has been generated."
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate numerology. Please check your input.",
        variant: "destructive"
      });
    }
  });

  const handleCalculate = () => {
    if (!fullName.trim() || !birthDate) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name and birth date.",
        variant: "destructive"
      });
      return;
    }

    numerologyMutation.mutate({ fullName, birthDate });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="h-10 w-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Numerology Analysis
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover your life path, destiny, and personal numbers through mathematical analysis 
            of your name and birth date.
          </p>
        </div>

        {/* Input Form */}
        <Card className="cosmic-card mb-8">
          <CardHeader>
            <CardTitle className="text-purple-500 text-center">Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name (as on birth certificate)</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Michael Smith"
                  className="bg-purple-800/30 border-purple-600 text-white placeholder-purple-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-purple-800/30 border-purple-600 text-white"
                />
              </div>
            </div>
            <div className="text-center">
              <Button
                onClick={handleCalculate}
                disabled={numerologyMutation.isPending}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-3"
              >
                {numerologyMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Calculating...</span>
                  </div>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Numerology
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {numerologyData && (
          <Tabs defaultValue="core" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-purple-800/30">
              <TabsTrigger value="core" className="data-[state=active]:bg-purple-600">Core Numbers</TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600">Insights</TabsTrigger>
              <TabsTrigger value="tarot" className="data-[state=active]:bg-purple-600">Tarot Cards</TabsTrigger>
              <TabsTrigger value="colors" className="data-[state=active]:bg-purple-600">Colors</TabsTrigger>
              <TabsTrigger value="gemstones" className="data-[state=active]:bg-purple-600">Gemstones</TabsTrigger>
            </TabsList>

            {/* Core Numbers Tab */}
            <TabsContent value="core">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Life Path Number */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500 flex items-center space-x-2">
                      <Star className="h-6 w-6" />
                      <span>Life Path Number</span>
                      <Badge variant="outline" className="border-purple-400 text-purple-300">
                        {numerologyData.lifePath.reducedNumber}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <strong>Calculation:</strong> {numerologyData.lifePath.calculation}
                    </div>
                    <p className="text-gray-300">{numerologyData.lifePath.meaning}</p>
                  </CardContent>
                </Card>

                {/* Destiny Number */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6" />
                      <span>Destiny Number</span>
                      <Badge variant="outline" className="border-purple-400 text-purple-300">
                        {numerologyData.destiny.reducedNumber}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <strong>Calculation:</strong> {numerologyData.destiny.calculation}
                    </div>
                    <p className="text-gray-300">{numerologyData.destiny.meaning}</p>
                  </CardContent>
                </Card>

                {/* Soul Urge Number */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-pink-400 flex items-center space-x-2">
                      <Heart className="h-6 w-6" />
                      <span>Soul Urge Number</span>
                      <Badge variant="outline" className="border-pink-400 text-pink-300">
                        {numerologyData.soulUrge.reducedNumber}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <strong>Calculation:</strong> {numerologyData.soulUrge.calculation}
                    </div>
                    <p className="text-gray-300">{numerologyData.soulUrge.meaning}</p>
                  </CardContent>
                </Card>

                {/* Personality Number */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center space-x-2">
                      <Eye className="h-6 w-6" />
                      <span>Personality Number</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-300">
                        {numerologyData.personality.reducedNumber}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <strong>Calculation:</strong> {numerologyData.personality.calculation}
                    </div>
                    <p className="text-gray-300">{numerologyData.personality.meaning}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Personal Year */}
              <Card className="cosmic-card mt-6">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center space-x-2">
                    <Calendar className="h-6 w-6" />
                    <span>Personal Year {numerologyData.personalYear.year}</span>
                    <Badge variant="outline" className="border-green-400 text-green-300">
                      {numerologyData.personalYear.number}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-400">
                    <strong>Calculation:</strong> {numerologyData.personalYear.calculation}
                  </div>
                  <p className="text-gray-300">{numerologyData.personalYear.meaning}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Compatibility */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500 flex items-center space-x-2">
                      <Lightbulb className="h-6 w-6" />
                      <span>Number Compatibility</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{numerologyData.compatibility}</p>
                  </CardContent>
                </Card>

                {/* Lucky Numbers */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center space-x-2">
                      <Star className="h-6 w-6" />
                      <span>Lucky Numbers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {numerologyData.luckyNumbers.map((number, index) => (
                        <Badge key={index} variant="outline" className="border-green-400 text-green-300 px-3 py-1">
                          {number}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6" />
                      <span>Life Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {numerologyData.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-300 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Challenges */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-orange-400 flex items-center space-x-2">
                      <Shield className="h-6 w-6" />
                      <span>Life Challenges</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {numerologyData.challenges.map((challenge, index) => (
                        <li key={index} className="text-gray-300 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full" />
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Placeholder tabs for future expansion */}
            <TabsContent value="tarot">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center space-x-2">
                    <Star className="h-6 w-6" />
                    <span>Tarot Birth Cards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center py-8">
                    Tarot birth card analysis coming soon! This will show your personal Tarot cards 
                    calculated from your birth date, revealing life themes and yearly influences.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-pink-400 flex items-center space-x-2">
                    <Palette className="h-6 w-6" />
                    <span>Personal Colors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center py-8">
                    Personal color analysis coming soon! This will show your lucky colors, 
                    healing colors, and optimal color choices for different purposes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gemstones">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center space-x-2">
                    <Gem className="h-6 w-6" />
                    <span>Personal Gemstones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center py-8">
                    Gemstone recommendations coming soon! This will show your birthstones, 
                    healing stones, and protective stones based on your numerological profile.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}