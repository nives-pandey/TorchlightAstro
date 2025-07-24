import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Palette, 
  Gem, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Apple, 
  X, 
  Calendar,
  Target,
  Sparkles,
  Crown,
  Zap,
  Users
} from "lucide-react";

interface LifestyleRecommendationsProps {
  recommendations: {
    luckyNumbers: number[];
    luckyColors: string[];
    favorableStones: string[];
    careerGuidance: string;
    subjects: string[];
    personalityTraits: string[];
    foods: string[];
    avoidItems: string[];
    auspiciousDates: string[];
    dailyPractices: string[];
  };
  systemComparison?: {
    westernTraits: string[];
    vedicTraits: string[];
    chineseTraits: string[];
    humanDesignTraits: string[];
    commonPatterns: string[];
    uniqueInsights: {
      western: string;
      vedic: string;
      chinese: string;
      humanDesign: string;
    };
    synthesizedGuidance: {
      strengths: string[];
      challenges: string[];
      recommendations: string[];
    };
  };
}

export function LifestyleRecommendations({ recommendations, systemComparison }: LifestyleRecommendationsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Comprehensive Lifestyle Guidance
        </h2>
        <p className="text-muted-foreground">
          Personalized recommendations from multiple astrological traditions
        </p>
      </div>

      <Tabs defaultValue="lifestyle" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lifestyle">Lifestyle Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">System Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="lifestyle" className="space-y-6">
          {/* Lucky Elements */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <Star className="h-5 w-5" />
                  Lucky Numbers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.luckyNumbers.map((number) => (
                    <Badge key={number} variant="outline" className="text-yellow-600 border-yellow-300">
                      {number}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Palette className="h-5 w-5" />
                  Lucky Colors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.luckyColors.map((color) => (
                    <Badge key={color} variant="outline" className="text-purple-600 border-purple-300">
                      {color}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Gem className="h-5 w-5" />
                  Favorable Stones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.favorableStones.map((stone) => (
                    <Badge key={stone} variant="outline" className="text-emerald-600 border-emerald-300">
                      {stone}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Career & Personal Development */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Career Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{recommendations.careerGuidance}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Recommended Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personality & Health */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Personality Traits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.personalityTraits.map((trait) => (
                    <Badge key={trait} variant="outline" className="text-pink-600 border-pink-300">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Beneficial Foods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.foods.map((food) => (
                    <Badge key={food} variant="outline" className="text-green-600 border-green-300">
                      {food}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timing & Practices */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Auspicious Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.auspiciousDates.map((date) => (
                    <div key={date} className="text-sm p-2 bg-muted rounded">
                      {date}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.dailyPractices.map((practice) => (
                    <div key={practice} className="text-sm p-2 bg-muted rounded">
                      {practice}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <X className="h-5 w-5" />
                  Items to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.avoidItems.map((item) => (
                    <div key={item} className="text-sm p-2 bg-red-50 dark:bg-red-950 rounded text-red-700 dark:text-red-300">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {systemComparison && (
            <>
              {/* System-Specific Traits */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-orange-200 dark:border-orange-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm">
                      <Crown className="h-4 w-4" />
                      Western Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {systemComparison.westernTraits.map((trait) => (
                      <Badge key={trait} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-indigo-200 dark:border-indigo-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm">
                      <Sparkles className="h-4 w-4" />
                      Vedic Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {systemComparison.vedicTraits.map((trait) => (
                      <Badge key={trait} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <Zap className="h-4 w-4" />
                      Chinese Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {systemComparison.chineseTraits.map((trait) => (
                      <Badge key={trait} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <Users className="h-4 w-4" />
                      Human Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {systemComparison.humanDesignTraits.map((trait) => (
                      <Badge key={trait} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Common Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Common Patterns Across Systems
                  </CardTitle>
                  <CardDescription>
                    Shared insights that appear in multiple astrological traditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {systemComparison.commonPatterns.map((pattern) => (
                      <Badge key={pattern} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Unique Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Unique System Insights</CardTitle>
                  <CardDescription>
                    Distinctive perspectives from each astrological tradition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-orange-600 dark:text-orange-400">Western Astrology</h4>
                      <p className="text-sm text-muted-foreground">{systemComparison.uniqueInsights.western}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-indigo-600 dark:text-indigo-400">Vedic Astrology</h4>
                      <p className="text-sm text-muted-foreground">{systemComparison.uniqueInsights.vedic}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600 dark:text-red-400">Chinese Zodiac</h4>
                      <p className="text-sm text-muted-foreground">{systemComparison.uniqueInsights.chinese}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-600 dark:text-green-400">Human Design</h4>
                      <p className="text-sm text-muted-foreground">{systemComparison.uniqueInsights.humanDesign}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Synthesized Guidance */}
              <Card>
                <CardHeader>
                  <CardTitle>Synthesized Guidance</CardTitle>
                  <CardDescription>
                    Unified wisdom combining insights from all systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {systemComparison.synthesizedGuidance.strengths.map((strength) => (
                          <li key={strength} className="text-sm text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Challenges</h4>
                      <ul className="space-y-1">
                        {systemComparison.synthesizedGuidance.challenges.map((challenge) => (
                          <li key={challenge} className="text-sm text-muted-foreground">
                            • {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {systemComparison.synthesizedGuidance.recommendations.map((recommendation) => (
                          <li key={recommendation} className="text-sm text-muted-foreground">
                            • {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}