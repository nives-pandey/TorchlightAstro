import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars, Sparkles, Users, Calendar, Moon, Sun } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";

export default function Landing() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Clean Header */}
      <header className="clean-nav fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Stars className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Torchlight
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="clean-button px-6 py-2 text-sm"
            >
              {t('nav.signIn')}
            </Button>
          </div>
        </div>
      </header>

      {/* Clean Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            {t('landing.title')}
          </h2>
          <p className="text-lg md:text-xl mb-12 text-purple-200 max-w-3xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="outline" className="border-yellow-400 text-yellow-400 px-4 py-2">
              {t('badges.western')}
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2">
              {t('badges.vedic')}
            </Badge>
            <Badge variant="outline" className="border-pink-400 text-pink-400 px-4 py-2">
              {t('badges.chinese')}
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
              {t('badges.humanDesign')}
            </Badge>
            <Badge variant="outline" className="border-green-400 text-green-400 px-4 py-2">
              {t('badges.numerology')}
            </Badge>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-8 py-4 text-base font-medium"
          >
            {t('landing.startJourney')}
          </Button>
        </div>
      </section>

      {/* What is Torchlight Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.whatIs')}
          </h3>
          <p className="text-center text-purple-200 mb-12 max-w-2xl mx-auto">
            {t('landing.whatIsSubtitle')}
          </p>
          
          <div className="clean-card p-8 md:p-12 mb-8">
            <p className="text-lg text-gray-200 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              <strong className="text-yellow-400">Torchlight</strong> combines the wisdom of multiple ancient traditions with modern astronomical precision. Like a torch illuminating a path, this system offers insights to help you navigate life's journey while preserving your autonomy to choose your direction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-yellow-400">{t('landing.philosophy')}</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.illumination')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.multiple')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.authentic')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.responsibility')}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-4 text-purple-400">{t('landing.science')}</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.precision')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.study')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.validation')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.openSource')}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-black/30 rounded-lg border-l-4 border-yellow-500">
              <p className="text-gray-300 italic text-center">
                {t('quote.astrology')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Sections */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.guidance')}
          </h3>
          <p className="text-center text-purple-200 mb-16 max-w-3xl mx-auto text-lg">
            {t('landing.guidanceSubtitle')}
          </p>

          {/* Three Main Sections */}
          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            
            {/* Personal Astrology Section */}
            <div className="clean-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{t('sections.personal')}</h4>
                <p className="text-purple-200">{t('sections.personalDesc')}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-yellow-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.natal.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.natal.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-orange-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.numerology.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.numerology.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-pink-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.daily.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.daily.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-purple-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.design.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.design.desc')}</p>
                </div>
              </div>
            </div>

            {/* Couples Section */}
            <div className="clean-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{t('sections.couples')}</h4>
                <p className="text-purple-200">{t('sections.couplesDesc')}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-pink-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.synastry.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.synastry.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-rose-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.composite.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.composite.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-red-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.chinese.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.chinese.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-purple-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.numerology.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.numerology.desc')}</p>
                </div>
              </div>
            </div>

            {/* Spaces Section */}
            <div className="clean-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Moon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{t('sections.spaces')}</h4>
                <p className="text-purple-200">{t('sections.spacesDesc')}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-green-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.vastu.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.vastu.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-emerald-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.fengshui.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.fengshui.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-teal-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.timing.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.timing.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-cyan-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.remedies.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.remedies.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Astrological Tools */}
      <section className="py-16 px-6 bg-black/20">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Astrological Tools & AI Guidance
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* AI Astrological Assistant */}
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">AI Astrological Assistant</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Conversational AI for personalized birth chart interpretation and cosmic timing guidance
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Real-time birth chart analysis
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Multi-system astrological synthesis
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Personalized cosmic timing advice
                </li>
              </ul>
            </div>

            {/* Astrological Education & Research */}
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Stars className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Astrological Education & Research</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Comprehensive learning resources on astronomical calculations and astrological traditions
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Swiss Ephemeris calculations explained
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Historical astrological traditions
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Cross-cultural astrology comparisons
                </li>
              </ul>
            </div>

            {/* Advanced Astrological Timing */}
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Advanced Astrological Timing</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Precise planetary transit analysis and electional astrology for optimal decision timing
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Planetary transit predictions
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Electional astrology for events
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Vedic Muhurta timing calculations
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.ready')}
          </h3>
          <p className="text-lg text-purple-200 mb-8">
            {t('landing.readySubtitle')}
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-8 py-4 text-base font-medium"
          >
            {t('landing.startJourney')}
          </Button>
        </div>
      </section>
    </div>
  );
}