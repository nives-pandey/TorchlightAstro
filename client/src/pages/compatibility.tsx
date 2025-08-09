import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Star, Check, Lightbulb } from "lucide-react";
import CompatibilityAnalysis from "@/components/compatibility-analysis";

export default function Compatibility() {
  const [people, setPeople] = useState([
    {
      id: 1,
      name: "You (John Doe)",
      sunSign: "Capricorn",
      moonSign: "Pisces", 
      risingSign: "Virgo",
      isPrimary: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      sunSign: "Leo",
      moonSign: "Scorpio",
      risingSign: "Gemini",
      isPrimary: false
    }
  ]);

  const [compatibilityResults, setCompatibilityResults] = useState({
    overallScore: 85,
    systemScores: {
      western: 88,
      vedic: 82,
      chinese: 90,
      humanDesign: 78
    },
    strengths: [
      "Complementary sun-moon harmony",
      "Shared creative vision and goals", 
      "Natural communication flow"
    ],
    challenges: [
      "Different approaches to decision-making",
      "Balance individual vs shared time"
    ]
  });

  const addPerson = () => {
    if (people.length < 3) {
      setPeople([...people, {
        id: people.length + 1,
        name: "New Person",
        sunSign: "Aries",
        moonSign: "Taurus",
        risingSign: "Cancer", 
        isPrimary: false
      }]);
    }
  };

  const analysisOptions = [
    { id: "basic", label: "Basic Compatibility", description: "Sun sign compatibility overview" },
    { id: "detailed", label: "Detailed Multi-System Analysis", description: "All systems with synthesis", selected: true },
    { id: "professional", label: "Professional Report", description: "In-depth with recommendations" }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Multi-Person Compatibility Analysis
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Deep relationship insights across all astrological systems with cross-pattern detection and group dynamics assessment.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compatibility Setup */}
          <div className="space-y-6">
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600">Add People for Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Person Cards */}
                {people.map((person, index) => (
                  <div 
                    key={person.id}
                    className={`bg-black/30 rounded-lg p-4 border ${
                      person.isPrimary ? 'border-yellow-600/20' : 'border-yellow-600/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold ${
                          person.isPrimary ? 'bg-yellow-600' : 'bg-yellow-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{person.name}</div>
                          <div className="text-gray-400 text-sm">
                            {person.sunSign} ☉ • {person.moonSign} ☽ • {person.risingSign} ↗
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {person.isPrimary && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600/30">
                            Primary
                          </Badge>
                        )}
                        {!person.isPrimary && (
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add Person Button */}
                {people.length < 3 && (
                  <Button
                    onClick={addPerson}
                    variant="outline"
                    className="w-full border-2 border-dashed border-yellow-600/50 text-yellow-600 hover:border-yellow-600 hover:bg-yellow-600/10"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Person (Max 3)
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Analysis Options */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600">Analysis Depth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      option.selected 
                        ? 'border-yellow-600 bg-yellow-600/10' 
                        : 'border-gray-600 hover:border-yellow-600/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        option.selected 
                          ? 'border-yellow-600 bg-yellow-600' 
                          : 'border-gray-500'
                      }`}></div>
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-gray-400 text-sm">{option.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Button className="w-full sanctuary-button">
              Analyze Compatibility
            </Button>
          </div>
          
          {/* Compatibility Results */}
          <div className="space-y-6">
            {/* Overall Compatibility Score */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600">Overall Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{compatibilityResults.overallScore}%</div>
                  <div className="text-yellow-600 font-medium mb-4">Highly Compatible</div>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-5 w-5 ${
                          star <= 4 ? 'text-yellow-600 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Strong foundation with complementary energies and shared values.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* System-Specific Scores */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600">Cross-System Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(compatibilityResults.systemScores).map(([system, score]) => (
                  <div key={system} className="flex justify-between items-center">
                    <span className="text-white capitalize">
                      {system === 'humanDesign' ? 'Human Design' : system} Astrology
                    </span>
                    <div className="flex items-center space-x-3">
                      <Progress value={score} className="w-24" />
                      <span className="text-yellow-600 font-medium w-12 text-right">{score}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Key Strengths & Challenges */}
            <div className="grid gap-4">
              <Card className="sanctuary-card">
                <CardHeader>
                  <CardTitle className="text-yellow-600 text-lg flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Relationship Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {compatibilityResults.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                        <span className="text-white">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="sanctuary-card">
                <CardHeader>
                  <CardTitle className="text-yellow-600 text-lg flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Growth Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {compatibilityResults.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                        <span className="text-white">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
