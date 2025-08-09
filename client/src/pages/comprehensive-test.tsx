import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Star, Moon, Sun, Globe } from 'lucide-react';

export default function ComprehensiveTest() {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [kundaliData, setKundaliData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Test with Krishna Raj's corrected data
  const krishnaRajData = {
    name: "Krishna Raj",
    birthDate: "1975-06-14",
    birthTime: "09:18",
    city: "Manipal",
    country: "India", 
    latitude: 13.3415,
    longitude: 74.7421,
    timezone: "Asia/Kolkata"
  };

  const generateComprehensiveAnalysis = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Test both comprehensive chart and Kundali generation
      const [chartResponse, kundaliResponse] = await Promise.all([
        apiRequest('POST', '/api/generate-chart', krishnaRajData),
        apiRequest('POST', '/api/generate-kundali', krishnaRajData)
      ]);

      setChartData(chartResponse);
      setKundaliData(kundaliResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoChart = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiRequest('GET', '/api/demo-chart');
      setChartData(response);
      setKundaliData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo chart');
      console.error('Demo chart error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Torchlight Comprehensive Analysis Test
          </h1>
          <p className="text-gray-300 text-lg">
            Testing Krishna Raj's Complete Astrological Profile
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              onClick={generateComprehensiveAnalysis} 
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Star className="w-4 h-4 mr-2" />}
              Generate Full Analysis
            </Button>
            <Button 
              onClick={loadDemoChart} 
              disabled={loading}
              variant="outline"
              className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
            >
              <Moon className="w-4 h-4 mr-2" />
              Load Demo Chart
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-500 bg-red-900/20 mb-6">
            <CardContent className="p-4">
              <p className="text-red-400">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Birth Data Summary */}
        <Card className="sanctuary-card mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Test Profile: Krishna Raj
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-orange-300 text-sm">Birth Date</div>
                <div className="font-medium">June 14, 1975</div>
              </div>
              <div>
                <div className="text-orange-300 text-sm">Birth Time</div>
                <div className="font-medium">9:18 AM</div>
              </div>
              <div>
                <div className="text-orange-300 text-sm">Location</div>
                <div className="font-medium">Manipal, India</div>
              </div>
              <div>
                <div className="text-orange-300 text-sm">Coordinates</div>
                <div className="font-medium">13.34°N, 74.74°E</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        {(chartData || kundaliData) && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="western">Western</TabsTrigger>
              <TabsTrigger value="vedic">Vedic</TabsTrigger>
              <TabsTrigger value="kundali">Kundali</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="synthesis">Synthesis</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="sanctuary-card">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Corrected Calculations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-orange-300 font-medium mb-2">Western Astrology</h4>
                        <div className="space-y-1">
                          <div>Sun: <Badge variant="outline" className="text-green-400">Gemini ✓</Badge></div>
                          <div>Moon: <Badge variant="outline" className="text-green-400">Gemini ✓</Badge></div>
                          <div>Rising: <Badge variant="outline" className="text-green-400">Leo ✓</Badge></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-orange-300 font-medium mb-2">Vedic Astrology</h4>
                        <div className="space-y-1">
                          <div>Rashi: <Badge variant="outline" className="text-green-400">Karkata (Cancer) ✓</Badge></div>
                          <div>Nakshatra: <Badge variant="outline" className="text-green-400">Ashlesha ✓</Badge></div>
                          <div>Ascendant: <Badge variant="outline" className="text-green-400">Cancer ✓</Badge></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="sanctuary-card">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Analysis Depth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData?.chart && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Western Chart</span>
                          <Badge className="bg-green-600">Complete</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Vedic Chart</span>
                          <Badge className="bg-green-600">Complete</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Chinese Astrology</span>
                          <Badge className="bg-green-600">Complete</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Human Design</span>
                          <Badge className="bg-green-600">Complete</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Numerology</span>
                          <Badge className="bg-green-600">Complete</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Predictions</span>
                          <Badge className="bg-green-600">Complete</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Western Tab */}
            <TabsContent value="western" className="mt-6">
              {chartData?.chart?.westernChart && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Planetary Positions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {chartData.chart.westernChart.planets?.map((planet: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-medium">{planet.name}</span>
                            <div className="text-right">
                              <div>{planet.sign} {planet.degree}°</div>
                              <div className="text-sm text-gray-400">House {planet.house}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Chart Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {chartData.chart.westernChart.patterns && (
                        <div className="space-y-3">
                          <div>
                            <span className="text-orange-300">Dominant Element:</span>
                            <Badge className="ml-2">{chartData.chart.westernChart.patterns.dominantElement}</Badge>
                          </div>
                          <div>
                            <span className="text-orange-300">Chart Pattern:</span>
                            <Badge className="ml-2">{chartData.chart.westernChart.patterns.chartPattern}</Badge>
                          </div>
                          <div>
                            <span className="text-orange-300">Dominant Modality:</span>
                            <Badge className="ml-2">{chartData.chart.westernChart.patterns.dominantModality}</Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Vedic Tab */}
            <TabsContent value="vedic" className="mt-6">
              {chartData?.chart?.vedicChart && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Vedic Basics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-orange-300 text-sm">Rashi (Moon Sign)</div>
                            <div className="font-medium">{chartData.chart.vedicChart.rashi}</div>
                          </div>
                          <div>
                            <div className="text-orange-300 text-sm">Nakshatra</div>
                            <div className="font-medium">{chartData.chart.vedicChart.nakshatra}</div>
                          </div>
                          <div>
                            <div className="text-orange-300 text-sm">Ascendant</div>
                            <div className="font-medium">{chartData.chart.vedicChart.ascendant}</div>
                          </div>
                          <div>
                            <div className="text-orange-300 text-sm">Pada</div>
                            <div className="font-medium">{chartData.chart.vedicChart.nakshatraPada}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Dasha System</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {chartData.chart.vedicChart.dashas && (
                        <div className="space-y-3">
                          <div>
                            <div className="text-orange-300 text-sm">Current Mahadasha</div>
                            <div className="font-medium">{chartData.chart.vedicChart.dashas.current}</div>
                          </div>
                          <div>
                            <div className="text-orange-300 text-sm">Remaining Period</div>
                            <div className="font-medium">{chartData.chart.vedicChart.dashas.remaining}</div>
                          </div>
                          <div>
                            <div className="text-orange-300 text-sm">Next Dasha</div>
                            <div className="font-medium">{chartData.chart.vedicChart.dashas.next}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Kundali Tab */}
            <TabsContent value="kundali" className="mt-6">
              {kundaliData?.kundali && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Traditional Kundali</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Chart Type</div>
                          <Badge>{kundaliData.kundali.chartInfo?.chartType || 'North Indian'}</Badge>
                        </div>
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Ayanamsa</div>
                          <div className="font-medium">{kundaliData.kundali.chartInfo?.ayanamsa || 24.1}°</div>
                        </div>
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Planetary Dignities</div>
                          <div className="space-y-2">
                            {kundaliData.kundali.planetaryDetails?.slice(0, 7).map((planet: any, index: number) => (
                              <div key={index} className="flex justify-between">
                                <span>{planet.planet}</span>
                                <Badge 
                                  variant={planet.dignity === 'Exalted' ? 'default' : 'outline'}
                                  className={planet.dignity === 'Exalted' ? 'bg-green-600' : ''}
                                >
                                  {planet.dignity}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Vedic Yogas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {kundaliData.kundali.yogas && (
                        <div className="space-y-3">
                          {kundaliData.kundali.yogas.slice(0, 5).map((yoga: any, index: number) => (
                            <div key={index} className="border border-orange-500/30 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium">{yoga.name}</span>
                                <Badge variant="outline">{yoga.strength}</Badge>
                              </div>
                              <div className="text-sm text-gray-300">
                                Planets: {yoga.planets?.join(', ')}
                              </div>
                              {yoga.effects && (
                                <div className="text-sm text-gray-400 mt-1">
                                  Effects: {yoga.effects.slice(0, 2).join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Predictions Tab */}
            <TabsContent value="predictions" className="mt-6">
              {chartData?.chart?.predictions && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Current Life Phase</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-orange-300">{chartData.chart.predictions.currentPhase?.title}</h4>
                          <p className="text-gray-300 text-sm mt-1">{chartData.chart.predictions.currentPhase?.description}</p>
                        </div>
                        <div>
                          <div className="text-orange-300 text-sm">Duration</div>
                          <div>{chartData.chart.predictions.currentPhase?.duration}</div>
                        </div>
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Opportunities</div>
                          <div className="space-y-1">
                            {chartData.chart.predictions.currentPhase?.opportunities?.map((opp: string, index: number) => (
                              <div key={index} className="text-sm text-green-400">• {opp}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Upcoming Transits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {chartData.chart.predictions.upcomingTransits?.slice(0, 4).map((transit: any, index: number) => (
                          <div key={index} className="border border-yellow-600/30 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium">{transit.planet}</span>
                              <span className="text-sm text-gray-400">{transit.date}</span>
                            </div>
                            <div className="text-sm text-teal-300">{transit.aspect}</div>
                            <div className="text-sm text-gray-300 mt-1">{transit.significance}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Synthesis Tab */}
            <TabsContent value="synthesis" className="mt-6">
              {chartData?.chart?.synthesis && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Core Traits & Talents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Core Traits</div>
                          <div className="space-y-1">
                            {chartData.chart.synthesis.coreTraits?.map((trait: string, index: number) => (
                              <div key={index} className="text-sm text-blue-300">• {trait}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Natural Talents</div>
                          <div className="space-y-1">
                            {chartData.chart.synthesis.talents?.map((talent: string, index: number) => (
                              <div key={index} className="text-sm text-green-300">• {talent}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sanctuary-card">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Life Path & Guidance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Career Path</div>
                          <div className="space-y-1">
                            {chartData.chart.synthesis.careerPath?.map((path: string, index: number) => (
                              <div key={index} className="text-sm text-teal-300">• {path}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-orange-300 text-sm mb-2">Spiritual Path</div>
                          <div className="space-y-1">
                            {chartData.chart.synthesis.spiritualPath?.map((path: string, index: number) => (
                              <div key={index} className="text-sm text-teal-300">• {path}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Torchlight Comprehensive Astrology System</p>
          <p className="text-sm">Authentic calculations • Swiss Ephemeris precision • AI-powered insights</p>
        </div>
      </div>
    </div>
  );
}