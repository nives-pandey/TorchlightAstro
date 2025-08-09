import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Users, Target } from "lucide-react";

interface CompatibilityAnalysisProps {
  results: {
    overallScore: number;
    systemScores: {
      western: number;
      vedic: number;
      chinese: number;
      humanDesign: number;
    };
    strengths: string[];
    challenges: string[];
    recommendations?: string[];
  };
}

export default function CompatibilityAnalysis({ results }: CompatibilityAnalysisProps) {
  const getCompatibilityLevel = (score: number) => {
    if (score >= 80) return { label: "Highly Compatible", color: "text-green-400" };
    if (score >= 60) return { label: "Good Compatibility", color: "text-yellow-500" };
    if (score >= 40) return { label: "Moderate Compatibility", color: "text-orange-400" };
    return { label: "Challenging Compatibility", color: "text-red-400" };
  };

  const compatibility = getCompatibilityLevel(results.overallScore);
  const starCount = Math.round(results.overallScore / 20);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="sanctuary-card cosmic-glow">
        <CardHeader>
          <CardTitle className="text-yellow-600 flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Overall Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{results.overallScore}%</div>
            <div className={`font-medium mb-4 ${compatibility.color}`}>{compatibility.label}</div>
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-6 w-6 ${
                    star <= starCount ? 'text-yellow-600 fill-current' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-400">
              {results.overallScore >= 80 && "Exceptional harmony with strong potential for lasting connection."}
              {results.overallScore >= 60 && results.overallScore < 80 && "Good foundation with areas for growth and understanding."}
              {results.overallScore >= 40 && results.overallScore < 60 && "Moderate compatibility requiring effort and communication."}
              {results.overallScore < 40 && "Significant differences that require patience and compromise."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Breakdown */}
      <Card className="sanctuary-card">
        <CardHeader>
          <CardTitle className="text-yellow-600">System-by-System Analysis</CardTitle>
          <CardDescription className="text-gray-400">
            Compatibility scores across different astrological traditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(results.systemScores).map(([system, score]) => {
            const systemNames = {
              western: "Western Astrology",
              vedic: "Vedic (Jyotish)",
              chinese: "Chinese Zodiac", 
              humanDesign: "Human Design"
            };
            
            return (
              <div key={system} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{systemNames[system as keyof typeof systemNames]}</span>
                  <span className="text-yellow-600 font-bold">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
                <div className="text-xs text-gray-400">
                  {score >= 80 && "Excellent harmony"}
                  {score >= 60 && score < 80 && "Good compatibility"}
                  {score >= 40 && score < 60 && "Moderate alignment"}
                  {score < 40 && "Requires attention"}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Strengths and Challenges Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="sanctuary-card">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Relationship Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="sanctuary-card">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white text-sm">{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {results.recommendations && (
        <Card className="sanctuary-card">
          <CardHeader>
            <CardTitle className="text-yellow-600">Personalized Recommendations</CardTitle>
            <CardDescription className="text-gray-400">
              Actionable insights to enhance your relationship
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-black/20 rounded-lg border border-yellow-600/10">
                  <p className="text-white text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
