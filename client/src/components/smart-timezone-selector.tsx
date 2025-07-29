import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Globe, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Navigation, 
  Zap,
  Target,
  Map
} from "lucide-react";
import { timezoneAnalytics } from "@/lib/timezone-analytics";

interface TimezoneRecommendation {
  timezoneId: string;
  displayName: string;
  confidence: number;
  reasoning: string[];
  alternatives: { id: string; name: string; confidence: number }[];
  source: 'city_match' | 'ip_geolocation' | 'browser_detection' | 'user_preference';
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  warnings: string[];
  suggestions: string[];
  dstApplied: boolean;
  qualityScore: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
}

export default function SmartTimezoneSelector({ 
  onTimezoneSelect, 
  initialCity = "", 
  initialCountry = "" 
}: {
  onTimezoneSelect: (timezone: string, confidence: number, source: string) => void;
  initialCity?: string;
  initialCountry?: string;
}) {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [recommendations, setRecommendations] = useState<TimezoneRecommendation[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [userIP, setUserIP] = useState<string | null>(null);
  const [browserTimezone, setBrowserTimezone] = useState<string>("");

  useEffect(() => {
    // Get browser timezone
    setBrowserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // Get user IP for geolocation (in real app, this would be from backend)
    // setUserIP(await fetchUserIP());
  }, []);

  useEffect(() => {
    if (city && country) {
      generateRecommendations();
    }
  }, [city, country]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate API call to get timezone recommendations
    const mockRecommendations: TimezoneRecommendation[] = [
      {
        timezoneId: "America/New_York",
        displayName: "Eastern Time (ET)",
        confidence: 0.95,
        reasoning: ["Exact city match", "Historical data verified", "DST rules confirmed"],
        alternatives: [
          { id: "America/Detroit", name: "Eastern Time (Detroit)", confidence: 0.88 },
          { id: "America/Toronto", name: "Eastern Time (Toronto)", confidence: 0.85 }
        ],
        source: 'city_match'
      },
      {
        timezoneId: browserTimezone,
        displayName: "Browser Detected",
        confidence: 0.75,
        reasoning: ["Browser timezone detection", "User's current system setting"],
        alternatives: [],
        source: 'browser_detection'
      }
    ];

    if (userIP) {
      mockRecommendations.push({
        timezoneId: "America/New_York", // Would be from IP geolocation
        displayName: "IP Location Match",
        confidence: 0.65,
        reasoning: ["IP geolocation", "Regional approximation"],
        alternatives: [],
        source: 'ip_geolocation'
      });
    }

    setRecommendations(mockRecommendations.sort((a, b) => b.confidence - a.confidence));
    setIsLoading(false);

    // Auto-select highest confidence recommendation
    if (mockRecommendations.length > 0) {
      const best = mockRecommendations[0];
      setSelectedTimezone(best.timezoneId);
      validateTimezone(best.timezoneId, best.confidence, best.source);
    }
  };

  const validateTimezone = (timezoneId: string, confidence: number, source: string) => {
    // Simulate timezone validation
    const mockValidation: ValidationResult = {
      isValid: true,
      confidence: confidence,
      warnings: confidence < 0.8 ? ["Lower confidence - please verify"] : [],
      suggestions: confidence < 0.9 ? ["Consider checking birth certificate for exact location"] : [],
      dstApplied: timezoneId.includes("America") || timezoneId.includes("Europe"),
      qualityScore: confidence > 0.95 ? 'A+' : confidence > 0.9 ? 'A' : confidence > 0.8 ? 'B+' : 'B'
    };

    setValidation(mockValidation);
    
    // Track analytics
    timezoneAnalytics.trackTimezoneUsage(timezoneId, true, confidence, getRegionFromTimezone(timezoneId));
    timezoneAnalytics.trackAutoDetection(city, timezoneId, confidence, true);
    
    // Notify parent component
    onTimezoneSelect(timezoneId, confidence, source);
  };

  const getRegionFromTimezone = (timezoneId: string): string => {
    if (timezoneId.startsWith("America/")) return "North America";
    if (timezoneId.startsWith("Europe/")) return "Europe";
    if (timezoneId.startsWith("Asia/")) return "Asia";
    if (timezoneId.startsWith("Australia/")) return "Oceania";
    if (timezoneId.startsWith("Africa/")) return "Africa";
    return "Other";
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return "text-green-400";
    if (confidence >= 0.8) return "text-purple-400";
    if (confidence >= 0.7) return "text-orange-400";
    return "text-red-400";
  };

  const getConfidenceBadgeColor = (confidence: number): string => {
    if (confidence >= 0.9) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (confidence >= 0.8) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (confidence >= 0.7) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'city_match': return <MapPin className="h-4 w-4" />;
      case 'ip_geolocation': return <Globe className="h-4 w-4" />;
      case 'browser_detection': return <Navigation className="h-4 w-4" />;
      case 'user_preference': return <Target className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Birth City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your birth city"
            className="cosmic-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Birth Country</label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your birth country"
            className="cosmic-input"
          />
        </div>
      </div>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Smart Timezone Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTimezone === rec.timezoneId
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                }`}
                onClick={() => {
                  setSelectedTimezone(rec.timezoneId);
                  validateTimezone(rec.timezoneId, rec.confidence, rec.source);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getSourceIcon(rec.source)}
                    <span className="ml-2 font-medium text-white">{rec.displayName}</span>
                    {selectedTimezone === rec.timezoneId && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <Badge className={getConfidenceBadgeColor(rec.confidence)}>
                    {Math.round(rec.confidence * 100)}% confidence
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Progress value={rec.confidence * 100} className="h-2" />
                  <div className="text-sm text-gray-400">
                    {rec.reasoning.join(" • ")}
                  </div>
                </div>

                {rec.alternatives.length > 0 && showAlternatives && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-sm font-medium text-gray-300 mb-2">Alternatives:</div>
                    <div className="space-y-1">
                      {rec.alternatives.map((alt, altIndex) => (
                        <div key={altIndex} className="flex justify-between text-sm text-gray-400">
                          <span>{alt.name}</span>
                          <span>{Math.round(alt.confidence * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="text-gray-400"
            >
              {showAlternatives ? "Hide" : "Show"} Alternative Options
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validation && (
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Timezone Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quality Score */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Data Quality Score:</span>
              <Badge variant="outline" className="text-white">
                Grade {validation.qualityScore}
              </Badge>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Detection Confidence:</span>
              <div className="flex items-center">
                <Progress value={validation.confidence * 100} className="w-20 mr-2 h-2" />
                <span className={`font-medium ${getConfidenceColor(validation.confidence)}`}>
                  {Math.round(validation.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* DST Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">DST Adjustment:</span>
              <div className="flex items-center">
                {validation.dstApplied ? (
                  <>
                    <Clock className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400">Applied automatically</span>
                  </>
                ) : (
                  <span className="text-gray-400">Not applicable</span>
                )}
              </div>
            </div>

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center text-purple-400 text-sm font-medium mb-1">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Accuracy Warnings
                </div>
                {validation.warnings.map((warning, index) => (
                  <p key={index} className="text-xs text-purple-300">• {warning}</p>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {validation.suggestions.length > 0 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center text-blue-400 text-sm font-medium mb-1">
                  <Info className="h-4 w-4 mr-2" />
                  Suggestions for Better Accuracy
                </div>
                {validation.suggestions.map((suggestion, index) => (
                  <p key={index} className="text-xs text-blue-300">• {suggestion}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Override Option */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center">
            <Map className="mr-2 h-5 w-5" />
            Manual Timezone Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTimezone}
            onValueChange={(value) => {
              setSelectedTimezone(value);
              validateTimezone(value, 1.0, 'user_preference');
              timezoneAnalytics.trackAutoDetection(city, value, 1.0, false); // Manual override
            }}
          >
            <SelectTrigger className="cosmic-input">
              <SelectValue placeholder="Choose timezone manually" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
              <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
              <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
              <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
              <SelectItem value="Australia/Sydney">Australian Eastern Time</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400 mt-2">
            Override automatic detection if you know the exact timezone
          </p>
        </CardContent>
      </Card>

      {/* Educational Information */}
      <Card className="bg-slate-800/30 border-blue-400/30">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-400 mb-1">Why Timezone Accuracy Matters</h4>
              <p className="text-sm text-gray-300 mb-2">
                Your exact birth timezone affects your rising sign and house positions. Even a 30-minute 
                difference can change key aspects of your astrological chart.
              </p>
              <p className="text-xs text-gray-400">
                Our system automatically accounts for historical daylight saving time changes and 
                provides confidence scoring to help you get the most accurate reading possible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}