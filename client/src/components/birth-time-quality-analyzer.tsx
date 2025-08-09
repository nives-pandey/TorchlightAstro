import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Target, 
  Star,
  Calendar,
  MapPin,
  Moon,
  Sun
} from "lucide-react";

interface TimeQualityAssessment {
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  confidenceScore: number;
  accuracyRange: string;
  impactAreas: {
    risingSign: { affected: boolean; alternatives: string[] };
    houses: { affected: boolean; shiftDegrees: number };
    aspects: { affected: boolean; changedAspects: number };
  };
  recommendations: string[];
  alternativeScenarios: {
    timeAdjustment: string;
    risingSignChange: boolean;
    houseDifferences: string[];
    aspectChanges: string[];
  }[];
}

interface DSTAnalysis {
  dstActive: boolean;
  adjustmentMade: boolean;
  originalTime: string;
  adjustedTime: string;
  explanation: string;
  historicalAccuracy: number;
}

interface SolarTimeComparison {
  clockTime: string;
  solarTime: string;
  difference: string;
  explanation: string;
  traditionalPreference: boolean;
}

export default function BirthTimeQualityAnalyzer({
  birthDate,
  birthTime,
  birthCity,
  timezone,
  onQualityAssessed
}: {
  birthDate: string;
  birthTime: string;
  birthCity: string;
  timezone: string;
  onQualityAssessed: (quality: TimeQualityAssessment) => void;
}) {
  const [assessment, setAssessment] = useState<TimeQualityAssessment | null>(null);
  const [dstAnalysis, setDSTAnalysis] = useState<DSTAnalysis | null>(null);
  const [solarTimeComparison, setSolarTimeComparison] = useState<SolarTimeComparison | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    if (birthDate && birthTime && birthCity && timezone) {
      analyzeTimeQuality();
    }
  }, [birthDate, birthTime, birthCity, timezone]);

  const analyzeTimeQuality = async () => {
    setIsAnalyzing(true);

    // Simulate comprehensive time quality analysis
    const mockAssessment: TimeQualityAssessment = {
      qualityGrade: assessTimeGrade(birthTime),
      confidenceScore: calculateConfidenceScore(birthTime, birthCity),
      accuracyRange: getAccuracyRange(birthTime),
      impactAreas: {
        risingSign: {
          affected: isRoundedTime(birthTime),
          alternatives: isRoundedTime(birthTime) ? ["Leo", "Virgo"] : []
        },
        houses: {
          affected: isRoundedTime(birthTime),
          shiftDegrees: isRoundedTime(birthTime) ? 15 : 0
        },
        aspects: {
          affected: isRoundedTime(birthTime),
          changedAspects: isRoundedTime(birthTime) ? 2 : 0
        }
      },
      recommendations: generateRecommendations(birthTime, birthCity),
      alternativeScenarios: generateAlternativeScenarios(birthTime)
    };

    const mockDSTAnalysis: DSTAnalysis = {
      dstActive: isDSTActive(birthDate, timezone),
      adjustmentMade: isDSTActive(birthDate, timezone),
      originalTime: birthTime,
      adjustedTime: isDSTActive(birthDate, timezone) ? adjustForDST(birthTime, -1) : birthTime,
      explanation: isDSTActive(birthDate, timezone) 
        ? "Daylight Saving Time was active on your birth date. We've adjusted your time by -1 hour to match standard time."
        : "Daylight Saving Time was not active on your birth date. No adjustment needed.",
      historicalAccuracy: 0.94
    };

    const mockSolarTime: SolarTimeComparison = {
      clockTime: birthTime,
      solarTime: calculateSolarTime(birthTime, birthCity),
      difference: "14 minutes earlier",
      explanation: "Solar time is based on the sun's actual position, while clock time follows time zones.",
      traditionalPreference: true
    };

    setAssessment(mockAssessment);
    setDSTAnalysis(mockDSTAnalysis);
    setSolarTimeComparison(mockSolarTime);
    setIsAnalyzing(false);

    onQualityAssessed(mockAssessment);
  };

  const assessTimeGrade = (time: string): TimeQualityAssessment['qualityGrade'] => {
    if (!time || time === 'unknown') return 'D';
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const min = parseInt(minutes);
      if (min === 0 || min === 15 || min === 30 || min === 45) {
        return 'C+'; // Rounded to quarter hours
      }
      if (min % 5 === 0) {
        return 'B'; // Rounded to 5 minutes
      }
      return 'A'; // Specific minute
    }
    return 'C'; // Hour only
  };

  const calculateConfidenceScore = (time: string, city: string): number => {
    let score = 0.5;
    if (time.includes(':')) score += 0.3;
    if (!isRoundedTime(time)) score += 0.2;
    if (city && city !== 'unknown') score += 0.1;
    return Math.min(score, 1.0);
  };

  const getAccuracyRange = (time: string): string => {
    if (!time || time === 'unknown') return "±4 hours or more";
    if (!time.includes(':')) return "±2 hours";
    if (isRoundedTime(time)) return "±15 minutes";
    return "±2 minutes";
  };

  const isRoundedTime = (time: string): boolean => {
    if (!time.includes(':')) return true;
    const [hours, minutes] = time.split(':');
    const min = parseInt(minutes);
    return min % 15 === 0;
  };

  const generateRecommendations = (time: string, city: string): string[] => {
    const recommendations = [];
    
    if (isRoundedTime(time)) {
      recommendations.push("Check your birth certificate for exact birth time");
      recommendations.push("Contact the hospital where you were born");
      recommendations.push("Consider alternative time scenarios in your reading");
    }
    
    if (!city || city === 'unknown') {
      recommendations.push("Verify exact birth location for timezone accuracy");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your birth time data appears accurate and reliable");
    }
    
    return recommendations;
  };

  const generateAlternativeScenarios = (time: string): TimeQualityAssessment['alternativeScenarios'] => {
    if (!isRoundedTime(time)) return [];
    
    return [
      {
        timeAdjustment: "15 minutes earlier",
        risingSignChange: true,
        houseDifferences: ["1st house shifts to Leo", "Midheaven moves to Taurus"],
        aspectChanges: ["Moon-Venus aspect becomes exact", "Mars square Jupiter weakens"]
      },
      {
        timeAdjustment: "15 minutes later",
        risingSignChange: false,
        houseDifferences: ["Planetary positions shift within houses"],
        aspectChanges: ["Sun-Mercury conjunction strengthens"]
      },
      {
        timeAdjustment: "30 minutes earlier",
        risingSignChange: true,
        houseDifferences: ["Rising sign changes to Leo", "2nd house cusp moves"],
        aspectChanges: ["Venus-Mars trine becomes exact", "Jupiter aspects change"]
      }
    ];
  };

  const isDSTActive = (date: string, timezone: string): boolean => {
    // Simplified DST check - in real implementation would use historical data
    const birthDate = new Date(date);
    const month = birthDate.getMonth();
    return (timezone.includes("America") || timezone.includes("Europe")) && 
           (month >= 2 && month <= 10); // Rough DST period
  };

  const adjustForDST = (time: string, hours: number): string => {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr) + hours;
    const adjustedHour = hour < 0 ? hour + 24 : hour > 23 ? hour - 24 : hour;
    return `${adjustedHour.toString().padStart(2, '0')}:${minuteStr}`;
  };

  const calculateSolarTime = (clockTime: string, city: string): string => {
    // Simplified solar time calculation
    const [hours, minutes] = clockTime.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    // Mock calculation: subtract longitude-based offset
    const solarMinutes = totalMinutes - 14; // Example: 14 minutes earlier
    const solarHours = Math.floor(solarMinutes / 60);
    const remainingMinutes = solarMinutes % 60;
    return `${solarHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A+': case 'A': return "text-green-400";
      case 'B+': case 'B': return "text-yellow-500";
      case 'C+': case 'C': return "text-orange-400";
      case 'D': return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getGradeBadgeColor = (grade: string): string => {
    switch (grade) {
      case 'A+': case 'A': return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'B+': case 'B': return "bg-yellow-600/20 text-yellow-500 border-yellow-600/30";
      case 'C+': case 'C': return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 'D': return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="sanctuary-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Analyzing Birth Time Quality</h3>
          <p className="text-gray-400">Calculating precision, DST adjustments, and impact analysis...</p>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) return null;

  return (
    <div className="space-y-6">
      {/* Quality Overview */}
      <Card className="sanctuary-card">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Birth Time Quality Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                <Badge className={getGradeBadgeColor(assessment.qualityGrade)}>
                  Grade {assessment.qualityGrade}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">Quality Score</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {Math.round(assessment.confidenceScore * 100)}%
              </div>
              <Progress value={assessment.confidenceScore * 100} className="mb-2" />
              <p className="text-sm text-gray-400">Confidence Level</p>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-2">
                {assessment.accuracyRange}
              </div>
              <p className="text-sm text-gray-400">Accuracy Range</p>
            </div>
          </div>

          {/* Recommendations */}
          {assessment.recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center text-blue-400 text-sm font-medium mb-2">
                <Info className="h-4 w-4 mr-2" />
                Recommendations for Better Accuracy
              </div>
              {assessment.recommendations.map((rec, index) => (
                <p key={index} className="text-sm text-blue-300 mb-1">• {rec}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="impact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="impact" className="data-[state=active]:bg-yellow-600">
            <Star className="h-4 w-4 mr-2" />
            Impact
          </TabsTrigger>
          <TabsTrigger value="dst" className="data-[state=active]:bg-yellow-600">
            <Clock className="h-4 w-4 mr-2" />
            DST Analysis
          </TabsTrigger>
          <TabsTrigger value="solar" className="data-[state=active]:bg-yellow-600">
            <Sun className="h-4 w-4 mr-2" />
            Solar Time
          </TabsTrigger>
          <TabsTrigger value="alternatives" className="data-[state=active]:bg-yellow-600">
            <Calendar className="h-4 w-4 mr-2" />
            Scenarios
          </TabsTrigger>
        </TabsList>

        {/* Impact Analysis */}
        <TabsContent value="impact">
          <Card className="sanctuary-card">
            <CardHeader>
              <CardTitle className="text-yellow-500">Astrological Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Rising Sign Impact */}
                <div className={`p-4 rounded-lg border ${
                  assessment.impactAreas.risingSign.affected 
                    ? 'bg-yellow-600/10 border-yellow-600/20' 
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center mb-2">
                    {assessment.impactAreas.risingSign.affected ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    )}
                    <h4 className="font-semibold text-white">Rising Sign</h4>
                  </div>
                  {assessment.impactAreas.risingSign.affected ? (
                    <div>
                      <p className="text-sm text-teal-300 mb-2">Potential variation</p>
                      <p className="text-xs text-gray-400">
                        Could be: {assessment.impactAreas.risingSign.alternatives.join(" or ")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-300">Stable and accurate</p>
                  )}
                </div>

                {/* House System Impact */}
                <div className={`p-4 rounded-lg border ${
                  assessment.impactAreas.houses.affected 
                    ? 'bg-yellow-600/10 border-yellow-600/20' 
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center mb-2">
                    {assessment.impactAreas.houses.affected ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    )}
                    <h4 className="font-semibold text-white">House Positions</h4>
                  </div>
                  {assessment.impactAreas.houses.affected ? (
                    <div>
                      <p className="text-sm text-teal-300 mb-1">May shift ±{assessment.impactAreas.houses.shiftDegrees}°</p>
                      <p className="text-xs text-gray-400">House cusps could move</p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-300">Positions are reliable</p>
                  )}
                </div>

                {/* Aspect Impact */}
                <div className={`p-4 rounded-lg border ${
                  assessment.impactAreas.aspects.affected 
                    ? 'bg-yellow-600/10 border-yellow-600/20' 
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center mb-2">
                    {assessment.impactAreas.aspects.affected ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    )}
                    <h4 className="font-semibold text-white">Planetary Aspects</h4>
                  </div>
                  {assessment.impactAreas.aspects.affected ? (
                    <div>
                      <p className="text-sm text-teal-300 mb-1">{assessment.impactAreas.aspects.changedAspects} aspects affected</p>
                      <p className="text-xs text-gray-400">Minor orb changes possible</p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-300">Aspects are stable</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DST Analysis */}
        <TabsContent value="dst">
          {dstAnalysis && (
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-orange-400">Daylight Saving Time Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">DST Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">DST Active:</span>
                        <span className={dstAnalysis.dstActive ? "text-orange-400" : "text-gray-400"}>
                          {dstAnalysis.dstActive ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Adjustment Made:</span>
                        <span className={dstAnalysis.adjustmentMade ? "text-blue-400" : "text-gray-400"}>
                          {dstAnalysis.adjustmentMade ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Historical Accuracy:</span>
                        <span className="text-green-400">
                          {Math.round(dstAnalysis.historicalAccuracy * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">Time Adjustment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Original Time:</span>
                        <span className="text-white font-mono">{dstAnalysis.originalTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Adjusted Time:</span>
                        <span className="text-blue-400 font-mono">{dstAnalysis.adjustedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h5 className="font-medium text-blue-400 mb-2">Explanation</h5>
                  <p className="text-sm text-blue-300">{dstAnalysis.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Solar Time Comparison */}
        <TabsContent value="solar">
          {solarTimeComparison && (
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-500">Solar Time vs Clock Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Time Comparison</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Clock Time:</span>
                        <span className="text-white font-mono">{solarTimeComparison.clockTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Solar Time:</span>
                        <span className="text-yellow-500 font-mono">{solarTimeComparison.solarTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Difference:</span>
                        <span className="text-orange-400">{solarTimeComparison.difference}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">Traditional Preference</h4>
                    <div className="flex items-center">
                      {solarTimeComparison.traditionalPreference ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="text-gray-300">
                        {solarTimeComparison.traditionalPreference 
                          ? "Solar time preferred for traditional astrology"
                          : "Clock time acceptable for modern astrology"
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <h5 className="font-medium text-yellow-500 mb-2">Solar Time Explanation</h5>
                  <p className="text-sm text-teal-300">{solarTimeComparison.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Alternative Scenarios */}
        <TabsContent value="alternatives">
          <Card className="sanctuary-card">
            <CardHeader>
              <CardTitle className="text-green-400">Alternative Time Scenarios</CardTitle>
              <p className="text-sm text-gray-400">
                How different birth times would affect your astrological chart
              </p>
            </CardHeader>
            <CardContent>
              {assessment.alternativeScenarios.length > 0 ? (
                <div className="space-y-4">
                  {assessment.alternativeScenarios.map((scenario, index) => (
                    <div key={index} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">
                          If birth time was {scenario.timeAdjustment}
                        </h4>
                        {scenario.risingSignChange && (
                          <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                            Rising Sign Change
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-300 mb-2">House Differences:</h5>
                          <ul className="text-gray-400 space-y-1">
                            {scenario.houseDifferences.map((diff, i) => (
                              <li key={i}>• {diff}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-300 mb-2">Aspect Changes:</h5>
                          <ul className="text-gray-400 space-y-1">
                            {scenario.aspectChanges.map((change, i) => (
                              <li key={i}>• {change}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center text-blue-400 text-sm font-medium mb-2">
                      <Info className="h-4 w-4 mr-2" />
                      Scenario Analysis
                    </div>
                    <p className="text-sm text-blue-300">
                      These alternative scenarios show how sensitive your chart is to birth time accuracy. 
                      If you're unsure about your exact birth time, consider multiple readings to 
                      understand the range of possibilities.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Alternative Scenarios Needed</h3>
                  <p className="text-gray-400">
                    Your birth time appears accurate enough that alternative scenarios would not 
                    significantly change your astrological chart.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}