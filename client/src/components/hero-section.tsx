import React from 'react';

// =============================================================================
// The Corrected Hero Section Component
// =============================================================================
const HeroSection = () => {
    return (
        <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Authentic ancient wisdom meets modern precision.
            </h1>
            <p className="mt-4 text-lg text-foreground/90 font-serif">
                Discover your complete astrological profile across Western, Vedic, Chinese, Human Design, Numerology, Vaastu, Feng Shui, Color & Gemstone systems.
            </p>
            <p className="mt-2 text-base text-muted-foreground font-serif">
                We believe this knowledge should be accessible to all, freely.
            </p>
        </div>
    );
};

export default HeroSection;