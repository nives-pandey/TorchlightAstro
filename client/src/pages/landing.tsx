import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars, Sparkles, Users, Calendar, Moon, Sun } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { TranslationDebug } from "@/components/translation-debug";

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

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.guidance')}
          </h3>
          <p className="text-center text-purple-200 mb-12 max-w-2xl mx-auto">
            {t('landing.guidanceSubtitle')}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{t('features.natal.title')}</h4>
                <p className="text-purple-200 text-sm mb-4">
                  {t('features.natal.desc')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Planetary positions & aspects
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  House interpretations
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Cross-system comparisons
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Personality insights
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{t('features.compatibility.title')}</h4>
                <p className="text-purple-200 text-sm mb-4">
                  {t('features.compatibility.desc')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Multi-person compatibility
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Strengths & challenges
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Communication guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Relationship timing
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{t('features.daily.title')}</h4>
                <p className="text-purple-200 text-sm mb-4">
                  {t('features.daily.desc')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Daily horoscopes
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Lucky numbers & colors
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Optimal timing
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Auspicious activities
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{t('features.ai.title')}</h4>
                <p className="text-purple-200 text-sm mb-4">
                  {t('features.ai.desc')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                  Conversational AI guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                  Complete numerology profiles
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                  Life path and destiny numbers
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                  Personality analysis
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Moon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{t('features.lifestyle.title')}</h4>
                <p className="text-purple-200 text-sm mb-4">
                  {t('features.lifestyle.desc')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Career path guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Health recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Personal development
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Timing for decisions
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <Stars className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{t('features.education.title')}</h4>
                <p className="text-purple-200 text-sm mb-4">
                  {t('features.education.desc')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Scientific background
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Multiple traditions
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Calculation methods
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Historical context
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
      
      {/* Translation Debug Component */}
      <TranslationDebug />
    </div>
  );
}