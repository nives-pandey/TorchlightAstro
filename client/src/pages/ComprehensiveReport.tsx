import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Star, Gem, Heart, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

interface BirthData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
}

interface ComprehensiveReport {
  personalityCore: string;
  strengths: string[];
  challenges: string[];
  lifeThemes: string[];
  currentInfluences: string;
  guidance: string;
  careerPath: string;
  relationships: string;
  health: string;
  spirituality: string;
  gemstones: {
    primary: string;
    secondary: string[];
    avoid: string[];
  };
  colors: {
    favorable: string[];
    avoid: string[];
  };
  lifestyle: {
    bestTimes: string[];
    avoid: string[];
    dailyRoutines: string[];
    environment: string;
  };
  futureOutlook: {
    nextMonth: string;
    nextYear: string;
    lifeDirection: string;
  };
}

interface SystemReport {
  system: string;
  report: ComprehensiveReport;
  confidence: number;
}

export default function ComprehensiveReport() {
  const [birthData, setBirthData] = useState<BirthData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: 'prefer-not-to-say'
  });
  
  // Load test personas for demo
  const testPersonas = [
    { name: 'Sarah Chen (Analytical Virgo)', data: { name: 'Sarah Chen', birthDate: '1990-09-15', birthTime: '14:30', birthPlace: 'San Francisco, CA', gender: 'female' }},
    { name: 'Luna Rodriguez (Creative Pisces)', data: { name: 'Luna Rodriguez', birthDate: '1985-03-08', birthTime: '19:45', birthPlace: 'Barcelona, Spain', gender: 'female' }},
    { name: 'Marcus Johnson (Leadership Leo)', data: { name: 'Marcus Johnson', birthDate: '1988-08-12', birthTime: '10:15', birthPlace: 'New York, NY', gender: 'male' }},
    { name: 'Isabella Martinez (Nurturing Cancer)', data: { name: 'Isabella Martinez', birthDate: '1992-07-22', birthTime: '06:00', birthPlace: 'Mexico City, Mexico', gender: 'female' }},
    { name: 'Jake Thompson (Adventurous Sagittarius)', data: { name: 'Jake Thompson', birthDate: '1987-12-03', birthTime: '16:20', birthPlace: 'Sydney, Australia', gender: 'male' }}
  ];
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['western', 'vedic', 'chinese', 'numerology', 'tarot']);
  const [reportGenerated, setReportGenerated] = useState(false);

  const { data: comprehensiveReport, isLoading, error } = useQuery({
    queryKey: ['/api/comprehensive-report', birthData, selectedSystems],
    enabled: reportGenerated && !!birthData.name && !!birthData.birthDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthData.name && birthData.birthDate && birthData.birthTime && birthData.birthPlace) {
      setReportGenerated(true);
    }
  };

  const systemNames = {
    western: 'Western Astrology',
    vedic: 'Vedic Astrology',
    chinese: 'Chinese Zodiac',
    numerology: 'Numerology',
    tarot: 'Tarot Birth Cards'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Comprehensive Life Report</h1>
          <p className="text-purple-300">Complete 5-page analysis across all astrological systems</p>
        </div>

        {!reportGenerated ? (
          <Card className="max-w-2xl mx-auto bg-slate-900/80 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Birth Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-purple-200">Full Name</Label>
                  <Input
                    id="name"
                    value={birthData.name}
                    onChange={(e) => setBirthData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate" className="text-purple-200">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthData.birthDate}
                      onChange={(e) => setBirthData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="bg-slate-800 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthTime" className="text-purple-200">Birth Time</Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={birthData.birthTime}
                      onChange={(e) => setBirthData(prev => ({ ...prev, birthTime: e.target.value }))}
                      className="bg-slate-800 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthPlace" className="text-purple-200">Birth Place</Label>
                  <Input
                    id="birthPlace"
                    value={birthData.birthPlace}
                    onChange={(e) => setBirthData(prev => ({ ...prev, birthPlace: e.target.value }))}
                    placeholder="City, State/Country"
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-purple-200">Gender (Optional)</Label>
                  <Select value={birthData.gender} onValueChange={(value) => setBirthData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-purple-200 text-sm">Quick Test with Sample Personas</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {testPersonas.map((persona, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBirthData(persona.data);
                            setTimeout(() => setReportGenerated(true), 100);
                          }}
                          className="text-xs bg-slate-800/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20"
                        >
                          {persona.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Generate Custom Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {isLoading && (
              <Card className="bg-slate-900/80 border-purple-500/30">
                <CardContent className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mr-3" />
                  <span className="text-white">Generating comprehensive report across all systems...</span>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="bg-red-900/30 border-red-500/30">
                <CardContent className="p-4">
                  <p className="text-red-200">Error generating report. Please try again.</p>
                </CardContent>
              </Card>
            )}

            {comprehensiveReport && (
              <div className="space-y-6">
                <Card className="bg-slate-900/80 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="w-6 h-6 text-yellow-400 mr-2" />
                      Comprehensive Life Report for {birthData.name}
                    </CardTitle>
                    <p className="text-purple-300">
                      Born {new Date(birthData.birthDate).toLocaleDateString()} at {birthData.birthTime} in {birthData.birthPlace}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {comprehensiveReport.systems?.map((system: SystemReport) => (
                        <Badge key={system.system} variant="secondary" className="bg-purple-600/20 text-purple-200">
                          {systemNames[system.system as keyof typeof systemNames]} ({Math.round(system.confidence)}% confidence)
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="personality" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
                    <TabsTrigger value="personality" className="text-white data-[state=active]:bg-purple-600">Page 1: Core</TabsTrigger>
                    <TabsTrigger value="lifestyle" className="text-white data-[state=active]:bg-purple-600">Page 2: Lifestyle</TabsTrigger>
                    <TabsTrigger value="guidance" className="text-white data-[state=active]:bg-purple-600">Page 3: Guidance</TabsTrigger>
                    <TabsTrigger value="wellness" className="text-white data-[state=active]:bg-purple-600">Page 4: Wellness</TabsTrigger>
                    <TabsTrigger value="future" className="text-white data-[state=active]:bg-purple-600">Page 5: Future</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personality" className="space-y-4">
                    <ReportPage1 data={comprehensiveReport} />
                  </TabsContent>

                  <TabsContent value="lifestyle" className="space-y-4">
                    <ReportPage2 data={comprehensiveReport} />
                  </TabsContent>

                  <TabsContent value="guidance" className="space-y-4">
                    <ReportPage3 data={comprehensiveReport} />
                  </TabsContent>

                  <TabsContent value="wellness" className="space-y-4">
                    <ReportPage4 data={comprehensiveReport} />
                  </TabsContent>

                  <TabsContent value="future" className="space-y-4">
                    <ReportPage5 data={comprehensiveReport} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportPage1({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="w-5 h-5 text-pink-400 mr-2" />
            Personality Core
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <p className="text-purple-100 leading-relaxed">{data.synthesis?.personalityCore}</p>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            Core Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <ul className="space-y-2">
              {data.synthesis?.strengths?.map((strength: string, index: number) => (
                <li key={index} className="text-purple-100 flex items-start">
                  <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
            Growth Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <ul className="space-y-2">
              {data.synthesis?.challenges?.map((challenge: string, index: number) => (
                <li key={index} className="text-purple-100 flex items-start">
                  <AlertTriangle className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                  {challenge}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Life Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <ul className="space-y-2">
              {data.synthesis?.lifeThemes?.map((theme: string, index: number) => (
                <li key={index} className="text-purple-100 flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                  {theme}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportPage2({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Gem className="w-5 h-5 text-emerald-400 mr-2" />
            Gemstone Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-purple-200 font-semibold mb-2">Primary Gemstone</h4>
            <Badge className="bg-emerald-600/20 text-emerald-200">{data.recommendations?.gemstones?.primary}</Badge>
          </div>
          <div>
            <h4 className="text-purple-200 font-semibold mb-2">Supporting Stones</h4>
            <div className="flex flex-wrap gap-2">
              {data.recommendations?.gemstones?.secondary?.map((gem: string, index: number) => (
                <Badge key={index} variant="outline" className="border-purple-400 text-purple-200">{gem}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-orange-200 font-semibold mb-2">Stones to Avoid</h4>
            <div className="flex flex-wrap gap-2">
              {data.recommendations?.gemstones?.avoid?.map((gem: string, index: number) => (
                <Badge key={index} variant="destructive" className="bg-red-600/20 text-red-200">{gem}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Color Therapy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-purple-200 font-semibold mb-2">Favorable Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              {data.recommendations?.colors?.favorable?.map((color: string, index: number) => (
                <div key={index} className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1`} style={{ backgroundColor: color.toLowerCase() }} />
                  <span className="text-xs text-purple-200">{color}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-orange-200 font-semibold mb-2">Colors to Limit</h4>
            <div className="grid grid-cols-4 gap-2">
              {data.recommendations?.colors?.avoid?.map((color: string, index: number) => (
                <div key={index} className="text-center opacity-60">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 border-2 border-red-400`} style={{ backgroundColor: color.toLowerCase() }} />
                  <span className="text-xs text-red-200">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Daily Lifestyle Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-green-200 font-semibold mb-3">Best Times for Important Activities</h4>
              <ul className="space-y-2">
                {data.recommendations?.lifestyle?.bestTimes?.map((time: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start">
                    <Calendar className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    {time}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-orange-200 font-semibold mb-3">Times to Avoid Major Decisions</h4>
              <ul className="space-y-2">
                {data.recommendations?.lifestyle?.avoid?.map((time: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    {time}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-blue-200 font-semibold mb-3">Recommended Daily Routines</h4>
              <ul className="space-y-2">
                {data.recommendations?.lifestyle?.dailyRoutines?.map((routine: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    {routine}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportPage3({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Current Life Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <p className="text-purple-100 leading-relaxed">{data.synthesis?.guidance}</p>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Career & Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <p className="text-purple-100 leading-relaxed">{data.analysis?.careerPath}</p>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Relationships & Love</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <p className="text-purple-100 leading-relaxed">{data.analysis?.relationships}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Current Planetary Influences</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <p className="text-purple-100 leading-relaxed">{data.synthesis?.currentInfluences}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportPage4({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Health & Vitality</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <p className="text-purple-100 leading-relaxed">{data.analysis?.health}</p>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Spiritual Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <p className="text-purple-100 leading-relaxed">{data.analysis?.spirituality}</p>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-purple-500/30 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Optimal Environment & Living</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100 leading-relaxed">{data.recommendations?.lifestyle?.environment}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportPage5({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">Next Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <p className="text-purple-100 leading-relaxed">{data.futureOutlook?.nextMonth}</p>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">Next Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <p className="text-purple-100 leading-relaxed">{data.futureOutlook?.nextYear}</p>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">Life Direction</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <p className="text-purple-100 leading-relaxed">{data.futureOutlook?.lifeDirection}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center">Your Astrological Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-purple-100 text-lg leading-relaxed">
              This comprehensive analysis combines insights from multiple astrological traditions to provide 
              you with a complete picture of your cosmic blueprint and life path.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-purple-300">
              <span>Generated with authentic astronomical calculations</span>
              <span>•</span>
              <span>AI-enhanced interpretations</span>
              <span>•</span>
              <span>Cross-system synthesis</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}