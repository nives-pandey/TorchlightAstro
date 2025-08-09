import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import EnergyExchange from '@/components/EnergyExchange';
import { Sparkles, Heart, Star } from 'lucide-react';

const SacredEnergyExchangePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-warm-charcoal">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-warm-charcoal to-warm-charcoal">
        <div className="absolute inset-0 bg-gradient-to-r from-sage-teal/5 to-brushed-gold/5"></div>
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-brushed-gold" />
                <div className="absolute -top-2 -right-2">
                  <Heart className="h-6 w-6 text-sage-teal" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <Star className="h-6 w-6 text-brushed-gold" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-warm-off-white mb-6">
              Sacred Energy Exchange
            </h1>
            
            <p className="text-xl text-warm-gray max-w-2xl mx-auto mb-8">
              Join a sacred circle of seekers supporting authentic astrological wisdom. 
              Every contribution, no matter the size, helps keep ancient knowledge 
              accessible to all souls on their cosmic journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Exchange Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Information */}
          <div className="space-y-8">
            <Card className="bg-warm-charcoal/50 border-warm-gray/20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-brushed-gold mb-4">Our Sacred Mission</h2>
                <p className="text-warm-gray leading-relaxed mb-4">
                  Torchlight was born from a simple belief: authentic astrological wisdom belongs to humanity, 
                  not corporations. We're committed to keeping genuine cosmic insights accessible to every seeker, 
                  free from advertising and corporate influence.
                </p>
                <p className="text-warm-gray leading-relaxed">
                  Your energy exchange helps us maintain the highest standards of authenticity while supporting 
                  our small team of researchers, covering server costs, and advancing AI-powered interpretations 
                  that honor ancient traditions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-warm-charcoal/50 border-warm-gray/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-sage-teal mb-4">Why Sacred Numbers Matter</h3>
                <p className="text-warm-gray leading-relaxed mb-4">
                  Each contribution tier is carefully chosen based on numerological significance and 
                  spiritual meaning. From the unity of "1" to the cosmic wholeness of "1008", 
                  every number carries intention and purpose.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-brushed-gold/10 rounded-lg">
                    <div className="text-2xl font-bold text-brushed-gold">11</div>
                    <div className="text-sm text-warm-gray">Master Number</div>
                  </div>
                  <div className="text-center p-3 bg-sage-teal/10 rounded-lg">
                    <div className="text-2xl font-bold text-sage-teal">108</div>
                    <div className="text-sm text-warm-gray">Sacred Mala</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-warm-charcoal/50 border-warm-gray/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-brushed-gold mb-4">100% Transparency Promise</h3>
                <ul className="space-y-2 text-warm-gray">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-sage-teal mr-2" />
                    Ad-free sanctuary forever
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-sage-teal mr-2" />
                    Authentic astronomical calculations
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-sage-teal mr-2" />
                    Open-source mission principles
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-sage-teal mr-2" />
                    Small team, big heart
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Exchange Interface */}
          <div className="lg:sticky lg:top-8">
            <EnergyExchange />
          </div>
        </div>
      </div>

      {/* Bottom Section - Community Impact */}
      <div className="bg-warm-charcoal/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-warm-off-white mb-8">
            Join Our Circle of Light
          </h2>
          <p className="text-lg text-warm-gray mb-8">
            Every contribution creates ripples of positive energy that reach seekers worldwide.
            Together, we're building something beautiful - a sanctuary where ancient wisdom 
            flows freely to those who need it most.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brushed-gold mb-2">10,000+</div>
              <div className="text-warm-gray">Souls Guided</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-teal mb-2">24/7</div>
              <div className="text-warm-gray">Available Wisdom</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brushed-gold mb-2">∞</div>
              <div className="text-warm-gray">Gratitude</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SacredEnergyExchangePage;