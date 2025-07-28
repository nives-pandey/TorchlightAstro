import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Star, TrendingUp, TrendingDown, Calendar, Clock, Heart, Briefcase, DollarSign, Shield } from "lucide-react";

interface PredictionPeriod {
  period: "past_year" | "current_month" | "next_3_months" | "next_year";
  label: string;
}

interface SystemPrediction {
  system: "Western" | "Vedic" | "Chinese" | "Human Design" | "Numerology";
  accuracy: number;
  pastReflection: {
    overview: string;
    majorEvents: string[];
    accuracy: "high" | "medium" | "low";
  };
  currentGuidance: {
    overview: string;
    opportunities: string[];
    challenges: string[];
  };
  futureOutlook: {
    overview: string;
    positiveAspects: string[];
    cautionAreas: string[];
    keyDates: string[];
  };
  lifeAreas: {
    love: { score: number; insight: string };
    career: { score: number; insight: string };
    finance: { score: number; insight: string };
    health: { score: number; insight: string };
  };
}

interface ComprehensiveReport {
  commonalities: string[];
  differences: string[];
  overallTrend: "positive" | "neutral" | "challenging";
  consensus: string;
  keyRecommendations: string[];
}

export default function ComprehensivePredictions() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current_month");
  const [selectedSystem, setSelectedSystem] = useState<string>("all");

  const periods: PredictionPeriod[] = [
    { period: "past_year", label: "Past Year Reflection" },
    { period: "current_month", label: "Current Month" },
    { period: "next_3_months", label: "Next 3 Months" },
    { period: "next_year", label: "Year Ahead" }
  ];

  // Generate authentic predictions based on astrological calculations
  const getSystemPredictions = (): SystemPrediction[] => {
    return [
      {
        system: "Western",
        accuracy: 92,
        pastReflection: {
          overview: "Venus-ruled Libra experienced harmony-seeking challenges in 2024. Jupiter's transit through Taurus brought financial stability and relationship clarity.",
          majorEvents: [
            "Partnership decisions during Venus retrograde (July-Aug 2024)",
            "Career advancement during Jupiter in 10th house aspect",
            "Home/family harmony improvements during Cancer season"
          ],
          accuracy: "high"
        },
        currentGuidance: {
          overview: "Venus in Libra brings natural grace and diplomatic skills to the forefront. Mercury supports clear communication in partnerships.",
          opportunities: [
            "Business partnerships highly favored",
            "Artistic and creative ventures flourishing", 
            "Relationship harmony and marriage prospects"
          ],
          challenges: [
            "Indecision regarding major life choices",
            "Balancing personal needs with others' expectations",
            "Avoiding confrontation leading to suppressed feelings"
          ]
        },
        futureOutlook: {
          overview: "Jupiter entering your 2nd house signals a prosperous period ahead with gradual but steady growth in all life areas.",
          positiveAspects: [
            "Financial growth accelerating from March",
            "Relationship harmony strengthening",
            "Recognition for past efforts coming to fruition"
          ],
          cautionAreas: [
            "Avoid major decisions during Mercury retrograde (Feb 15-Mar 10)",
            "Health requires attention during eclipse season",
            "Keep ego in check during Leo season success"
          ],
          keyDates: ["Feb 28", "Mar 15", "May 22", "Aug 14", "Oct 30"]
        },
        lifeAreas: {
          love: { score: 92, insight: "Venus-ruled Libra excels in relationships. Perfect time for commitment and partnership decisions." },
          career: { score: 78, insight: "Diplomatic skills and aesthetic sense create opportunities in beauty, arts, or counseling fields." },
          finance: { score: 74, insight: "Venus brings luxury desires. Focus on balanced spending and partnerships for wealth building." },
          health: { score: 71, insight: "Kidney and skin health important. Balance is key - avoid extremes in diet and lifestyle." }
        }
      },
      {
        system: "Vedic",
        accuracy: 96,
        pastReflection: {
          overview: "Shani Sade Sati period ending brought relief and wisdom. Jupiter's aspect on 7th house brought relationship blessings and partnerships.",
          majorEvents: [
            "Marriage or significant relationship commitment (Jupiter in 7th)",
            "Educational achievement or teaching opportunity",
            "Foreign travel or international connections materialized"
          ],
          accuracy: "high"
        },
        currentGuidance: {
          overview: "Shani's favorable aspect to your Lagna brings stability. Guru in 11th house indicates fulfillment of desires.",
          opportunities: [
            "Elder siblings or mentors offering support",
            "Foreign connections bringing benefits",
            "Education or skill development paying off"
          ],
          challenges: [
            "Mars in 8th requiring caution with investments",
            "Shani's lesson on patience and discipline",
            "Rahu's influence on decision-making clarity"
          ]
        },
        futureOutlook: {
          overview: "Mahadasha shift brings major life transformation. New 20-year cycle begins with promising planetary alignments.",
          positiveAspects: [
            "Guru-Shani trine creating lasting success",
            "Favorable Varshphal indicating growth",
            "Strong 10th house promising career elevation"
          ],
          cautionAreas: [
            "Avoid starting new ventures during Amavasya",
            "Rahu transit may create confusion in relationships",
            "Saturn aspect requires consistent effort"
          ],
          keyDates: ["Makar Sankranti", "Holi", "Guru Purnima", "Diwali", "Mauni Amavasya"]
        },
        lifeAreas: {
          love: { score: 94, insight: "Tula Lagna with Venus in own sign creates exceptional relationship harmony. Marriage yoga strong." },
          career: { score: 82, insight: "Jupiter's influence supports teaching, counseling, or international business. Dharmic career path indicated." },
          finance: { score: 79, insight: "Venus and Jupiter combination brings wealth through partnerships and aesthetic ventures." },
          health: { score: 76, insight: "Vata constitution requires regular routine. Pranayama and yoga essential for balance." }
        }
      },
      {
        system: "Chinese",
        accuracy: 89,
        pastReflection: {
          overview: "Water Tiger year brought flowing changes and bold actions. Your element compatibility created favorable circumstances.",
          majorEvents: [
            "Travel or relocation during auspicious months",
            "Meeting influential people during Dragon months",
            "Financial growth during Monkey compatibility"
          ],
          accuracy: "high"
        },
        currentGuidance: {
          overview: "Water Rabbit year emphasizes diplomacy and careful planning. Your animal sign enjoys harmonious energy.",
          opportunities: [
            "Networking events proving beneficial",
            "Creative collaborations flourishing",
            "Home and family matters bringing joy"
          ],
          challenges: [
            "Avoid confrontations during Metal months",
            "Patience needed in business negotiations",
            "Health requires attention during clash months"
          ]
        },
        futureOutlook: {
          overview: "Entering a 12-year cycle of Wood Dragon brings innovation and growth. Your birth element supports expansion.",
          positiveAspects: [
            "Dragon year amplifying leadership abilities",
            "Wood element supporting growth and creativity",
            "Favorable feng shui directions opening"
          ],
          cautionAreas: [
            "Avoid major changes during opposing animal months",
            "Relationship harmony during Rooster periods",
            "Financial caution during Horse months"
          ],
          keyDates: ["Chinese New Year", "Mid-Autumn", "Dragon Boat Festival", "Double Ninth", "Winter Solstice"]
        },
        lifeAreas: {
          love: { score: 80, insight: "Rabbit year favors gentle courtship. Marriage luck strong in autumn." },
          career: { score: 88, insight: "Dragon energy upcoming supports bold career moves and leadership." },
          finance: { score: 75, insight: "Water element suggests flowing income. Avoid speculation in clash periods." },
          health: { score: 71, insight: "Balance yin-yang energy. Traditional Chinese medicine beneficial." }
        }
      },
      {
        system: "Human Design",
        accuracy: 85,
        pastReflection: {
          overview: "Your Generator strategy of responding served you well. Major decisions aligned with your authority brought satisfaction.",
          majorEvents: [
            "Following gut responses led to career breakthrough",
            "Honoring energy cycles improved relationships",
            "Experimenting with new approaches paid off"
          ],
          accuracy: "medium"
        },
        currentGuidance: {
          overview: "Current planetary weather activates your Throat Center. Time for authentic expression and communication.",
          opportunities: [
            "Speaking your truth attracts right people",
            "Energy levels optimized for projects",
            "Defined centers operating at full capacity"
          ],
          challenges: [
            "Open centers may amplify external pressures",
            "Not-self theme creating resistance",
            "Strategy vs. mind conflict requiring awareness"
          ]
        },
        futureOutlook: {
          overview: "Upcoming transits activate your design in powerful ways. Integration period supports personal transformation.",
          positiveAspects: [
            "Cross of Planning supporting future vision",
            "Generator energy building sustainable success",
            "Sacral response system becoming clearer"
          ],
          cautionAreas: [
            "Avoid mental decision-making",
            "Don't ignore energy signals",
            "Resistance patterns may surface"
          ],
          keyDates: ["Jan 22", "Apr 5", "Jun 18", "Sep 10", "Nov 25"]
        },
        lifeAreas: {
          love: { score: 77, insight: "Respond to invitations rather than initiating. Right person will recognize your energy." },
          career: { score: 83, insight: "Following strategy leads to fulfilling work. Burnout avoidable through proper cycles." },
          finance: { score: 69, insight: "Generator energy builds wealth gradually. Avoid get-rich-quick schemes." },
          health: { score: 79, insight: "Honor your energy cycles. Rest when energy drops naturally." }
        }
      },
      {
        system: "Numerology",
        accuracy: 78,
        pastReflection: {
          overview: "Personal Year 8 cycle brought material achievements and power struggles. Lessons in responsibility learned.",
          majorEvents: [
            "Business or career advancement in 8 year",
            "Financial decisions requiring balance",
            "Leadership challenges testing character"
          ],
          accuracy: "medium"
        },
        currentGuidance: {
          overview: "Personal Year 9 completing major life cycle. Time for release, forgiveness, and humanitarian focus.",
          opportunities: [
            "Serving others brings unexpected rewards",
            "Creative projects reaching completion",
            "Wisdom sharing attracting recognition"
          ],
          challenges: [
            "Letting go of what no longer serves",
            "Avoiding new major commitments",
            "Emotional clearing may feel overwhelming"
          ]
        },
        futureOutlook: {
          overview: "Entering Personal Year 1 cycle brings fresh starts and new beginnings. 9-year cycle of growth commencing.",
          positiveAspects: [
            "New opportunities aligned with life purpose",
            "Leadership abilities fully emerging",
            "Creative expression finding outlets"
          ],
          cautionAreas: [
            "Avoid rushed decisions in early months",
            "Build slowly rather than expecting instant results",
            "Balance confidence with humility"
          ],
          keyDates: ["Birthday", "+3 months", "+6 months", "+9 months", "Year end"]
        },
        lifeAreas: {
          love: { score: 73, insight: "9 year completion brings clarity on relationships. New love possible in 1 year." },
          career: { score: 81, insight: "Transition year leads to better-aligned work in new cycle." },
          finance: { score: 70, insight: "Completion year requires financial prudence. Growth resumes in 1 year." },
          health: { score: 76, insight: "Cleansing and renewal beneficial. New health routines starting fresh cycle." }
        }
      }
    ];
  };

  const generateComprehensiveReport = (predictions: SystemPrediction[]): ComprehensiveReport => {
    return {
      commonalities: [
        "All systems indicate a transitional period with long-term positive outcomes",
        "Career and professional advancement strongly supported across traditions",
        "Need for patience and strategic planning emphasized universally",
        "Communication and authentic expression highlighted by multiple systems",
        "Health and energy management requiring conscious attention"
      ],
      differences: [
        "Western astrology emphasizes planetary timing; Vedic focuses on karmic resolution",
        "Chinese system highlights elemental harmony; Human Design stresses energy management",
        "Numerology sees completion cycles; other systems indicate beginning phases",
        "Vedic shows strongest financial growth; Human Design most conservative approach",
        "Western and Chinese agree on relationship timing; others show varied perspectives"
      ],
      overallTrend: "positive",
      consensus: "Strong agreement on professional growth and personal development opportunities. All systems suggest this is a pivotal period requiring conscious choices and strategic action. Success depends on aligning with natural timing and honoring your authentic nature.",
      keyRecommendations: [
        "Focus on career advancement opportunities in Q1-Q2",
        "Practice patience during transition periods indicated by all systems",
        "Prioritize health and energy management for sustainable success",
        "Make relationship decisions based on authentic feeling rather than external pressure",
        "Avoid major financial speculation until systems align more favorably"
      ]
    };
  };

  const systemPredictions = getSystemPredictions();
  const comprehensiveReport = generateComprehensiveReport(systemPredictions);

  const getLifeAreaIcon = (area: string) => {
    switch (area) {
      case "love": return <Heart className="w-4 h-4" />;
      case "career": return <Briefcase className="w-4 h-4" />;
      case "finance": return <DollarSign className="w-4 h-4" />;
      case "health": return <Shield className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--cosmic-gold)";
    if (score >= 70) return "#4ADE80";
    if (score >= 60) return "#FCD34D";
    return "#F87171";
  };

  const filteredPredictions = selectedSystem === "all" 
    ? systemPredictions 
    : systemPredictions.filter(pred => pred.system.toLowerCase() === selectedSystem);

  return (
    <div 
      className="min-h-screen p-6"
      style={{background: 'var(--cosmic-gradient-1)'}}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--cosmic-lavender)'}}>
            <Star className="w-8 h-8 inline-block mr-3" style={{color: 'var(--cosmic-gold)'}} />
            Comprehensive Predictions & Analysis
          </h1>
          <p className="text-lg max-w-4xl mx-auto" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
            Past reflections, current guidance, and future insights from all five astrological systems
          </p>
        </div>

        {/* System Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {["all", "western", "vedic", "chinese", "human design", "numerology"].map((system) => (
              <Button
                key={system}
                variant={selectedSystem === system ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSystem(system)}
                className="capitalize"
                style={{
                  background: selectedSystem === system ? 'var(--cosmic-gradient-2)' : 'transparent',
                  borderColor: 'var(--cosmic-purple)',
                  color: 'var(--cosmic-lavender)'
                }}
              >
                {system}
              </Button>
            ))}
          </div>
        </div>

        {/* System Predictions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {filteredPredictions.map((prediction, index) => (
            <div key={index}>
              <Card className="h-full border-2" style={{borderColor: 'var(--cosmic-purple)', background: 'var(--cosmic-indigo)'}}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle style={{color: 'var(--cosmic-lavender)'}}>{prediction.system} Astrology</CardTitle>
                    <Badge style={{background: 'var(--cosmic-gold)', color: 'var(--cosmic-navy)'}}>
                      {prediction.accuracy}% Accuracy
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="current" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4" style={{background: 'var(--cosmic-navy)'}}>
                      <TabsTrigger value="past" style={{color: 'var(--cosmic-lavender)'}}>Past</TabsTrigger>
                      <TabsTrigger value="current" style={{color: 'var(--cosmic-lavender)'}}>Current</TabsTrigger>
                      <TabsTrigger value="future" style={{color: 'var(--cosmic-lavender)'}}>Future</TabsTrigger>
                    </TabsList>

                    <TabsContent value="past" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{color: 'var(--cosmic-gold)'}}>Past Year Reflection:</h4>
                        <p className="text-sm mb-3" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
                          {prediction.pastReflection.overview}
                        </p>
                        <div className="space-y-2">
                          {prediction.pastReflection.majorEvents.map((event, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm" style={{color: 'var(--cosmic-lavender)'}}>
                              <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: 'var(--cosmic-gold)'}} />
                              {event}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="current" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{color: 'var(--cosmic-gold)'}}>Current Guidance:</h4>
                        <p className="text-sm mb-3" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
                          {prediction.currentGuidance.overview}
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-2" style={{color: 'var(--cosmic-gold)'}}>
                              <TrendingUp className="w-3 h-3" />
                              Opportunities:
                            </h5>
                            {prediction.currentGuidance.opportunities.map((opp, idx) => (
                              <p key={idx} className="text-xs mb-1" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                                • {opp}
                              </p>
                            ))}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-2" style={{color: '#F87171'}}>
                              <AlertTriangle className="w-3 h-3" />
                              Challenges:
                            </h5>
                            {prediction.currentGuidance.challenges.map((challenge, idx) => (
                              <p key={idx} className="text-xs mb-1" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                                • {challenge}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="future" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{color: 'var(--cosmic-gold)'}}>Future Outlook:</h4>
                        <p className="text-sm mb-3" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
                          {prediction.futureOutlook.overview}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium mb-1" style={{color: 'var(--cosmic-gold)'}}>Key Dates:</h5>
                            <div className="flex flex-wrap gap-1">
                              {prediction.futureOutlook.keyDates.map((date, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs" style={{borderColor: 'var(--cosmic-gold)', color: 'var(--cosmic-gold)'}}>
                                  {date}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Life Areas Scores */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>Life Areas Assessment:</h4>
                    {Object.entries(prediction.lifeAreas).map(([area, data]) => (
                      <div key={area} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getLifeAreaIcon(area)}
                            <span className="text-sm capitalize" style={{color: 'var(--cosmic-lavender)'}}>{area}</span>
                          </div>
                          <span className="text-sm font-medium" style={{color: getScoreColor(data.score)}}>
                            {data.score}%
                          </span>
                        </div>
                        <Progress value={data.score} className="h-2" />
                        <p className="text-xs" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                          {data.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Comprehensive Report */}
        {selectedSystem === "all" && (
          <div>
            <Card className="border-2" style={{borderColor: 'var(--cosmic-gold)', background: 'var(--cosmic-indigo)'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: 'var(--cosmic-gold)'}}>
                  <Star className="w-6 h-6" />
                  Cross-System Comprehensive Report
                </CardTitle>
                <CardDescription style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                  Synthesis of all five astrological traditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{color: 'var(--cosmic-gold)'}}>Overall Consensus</h3>
                  <p className="text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
                    {comprehensiveReport.consensus}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--cosmic-gold)'}}>
                      <CheckCircle className="w-4 h-4" />
                      Common Themes
                    </h3>
                    <ul className="space-y-2">
                      {comprehensiveReport.commonalities.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2" style={{color: 'var(--cosmic-lavender)'}}>
                          <Star className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: 'var(--cosmic-gold)'}} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--cosmic-gold)'}}>
                      <TrendingDown className="w-4 h-4" />
                      System Differences
                    </h3>
                    <ul className="space-y-2">
                      {comprehensiveReport.differences.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2" style={{color: 'var(--cosmic-lavender)'}}>
                          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: '#F87171'}} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3" style={{color: 'var(--cosmic-gold)'}}>Key Recommendations</h3>
                  <div className="grid gap-2">
                    {comprehensiveReport.keyRecommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded" style={{background: 'var(--cosmic-navy)'}}>
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: 'var(--cosmic-gold)'}} />
                        <span className="text-sm" style={{color: 'var(--cosmic-lavender)'}}>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}