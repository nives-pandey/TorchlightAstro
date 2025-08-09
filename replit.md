# Torchlight Astrology Application

## Overview
Torchlight is a comprehensive astrology web application providing detailed natal chart analysis, compatibility readings, daily guidance, and personalized recommendations across multiple astrological systems: Western, Vedic, Chinese Zodiac, Human Design, Numerology, Tarot, Color Astrology, Gemstone Guidance, Vaastu, and Feng Shui. Built as a full-stack TypeScript application, it emphasizes authentic astronomical calculations and traditional methodologies. The project aims to offer a unique 10-in-1 platform with educational depth, lifestyle intelligence, and cross-system synthesis, setting it apart from single-system competitors and delivering professional-grade insights.

## User Preferences
Preferred communication style: Simple, everyday language.
Remove references to "urban professionals" and age groups to avoid alienating users.
Focus on inclusive language that welcomes all seekers of astrological guidance.
Brand name: "Torchlight" confirmed after SEO and relevance analysis - stronger than "Lamplight" for modern astrology applications.
Remove mention of years from astrology systems display - maintain chronological order but without age badges or year references.
Update contribution section: Add "free forever" emphasis, include detailed reasons for requesting contributions (volunteers, 1000s hours, centuries experience, technology costs), and add "Can't pay? Just share the love" section for those unable to contribute financially.
**Critical Design Consistency**: External advisor review completed - all purple/cosmic elements removed from CSS, logo harmonized with sanctuary palette for authentic brand cohesion.
**Timeline Corrections**: Replace all specific development dates (April/May 2025 claims when current date is August 2025) with simplified "Coming Soon" messaging to avoid misleading users about development progress.
**Expert UX Consolidation (Jan 2025)**: Implemented expert-recommended single-flow approach by removing duplicate "Begin Your Journey" navigation button and consolidating to superior modal-based "Begin Your Cosmic Journey Now ✨" approach across all three CTA locations for maximum engagement and conversion.
**Card Status Consistency**: Added missing "Coming Soon" badges to Business Analysis cards to match other inactive features.
**Functional Sharing System**: Transformed "Share the Love" into comprehensive social sharing with Facebook, Twitter, WhatsApp, Email, Copy Link, and native mobile share API integration.

## System Architecture
The application employs a monorepo structure separating client, server, and shared components. The frontend is a React application built with Vite, the backend uses Express.js, and PostgreSQL with Drizzle ORM handles data persistence.

**Technology Stack**:
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components, TanStack Query, Wouter, React Hook Form with Zod.
- **Backend**: Express.js, TypeScript, ESM modules.
- **Database**: PostgreSQL with Drizzle ORM.
- **Build Tools**: Vite (frontend), esbuild (backend).
- **Internationalization**: Custom i18n system supporting English, Spanish, Russian, and French.

**Key Components & Design Decisions**:
- **UI/UX**: Component-based architecture with shadcn/ui for consistent design. Features a dark theme with space/astrology-inspired styling, animations, and a mobile-first approach optimized for iOS/Android. Emphasizes clean layouts, intuitive navigation, and value-first psychology. The "Sanctuary" color palette (Brushed Gold, Sage Teal, True Warm Charcoal, Warm Gray) is psychologically optimized for a female demographic, creating a mystical, safe, and deeply personal digital sanctuary.
- **Core Functionality**:
    - **Chart Generation**: User inputs birth data, system validates and geocodes, performs astronomical calculations using Swiss Ephemeris precision, generates interpretations across multiple systems, and stores results.
    - **Real-time Calculations**: Planetary positions, house systems, aspects, and patterns computed dynamically, integrating multiple astrological traditions.
    - **Output Formats**: Screen viewing (interactive chat with 8-section structured output), premium PDF reports, email delivery, and white-label reports.
    - **Cross-System Analysis**: Includes system comparison reports, multi-partner astro-matching, group compatibility, and side-by-side comparative analysis. A cross-system compatibility engine is built for queries across any combination of the 5 authentic systems with weighted scoring.
    - **Input-Based Systems**: Numerology, Tarot birth cards, color recommendations, and gemstone guidance.
    - **AI Assistant**: Conversational AI assistant for astrological interpretations and educational content, using OpenAI GPT-4o, Gemini 2.5, and Grok AI. Provides structured JSON-formatted insights and comprehensive lifestyle recommendations (food, career, activities, relationships, intimate guidance) integrated across systems.
    - **Time-Based Interface**: Dynamic interface adapting throughout the day with distinct themes and personalized content.
    - **Mobile Optimization**: Comprehensive iOS/Android optimization with safe area support, touch targets, and a native app-like experience. Includes single-line displays for systems and simplified gradient backgrounds.
    - **Authenticity & Compliance**: Critical data authenticity audit completed for all systems (Human Design flagged and hidden behind a feature flag until authentic API integration). Legal compliance includes age verification (country-specific) and GDPR implementation with consent management and privacy notices.
    - **Contribution Psychology**: "Energy Exchange" model implemented with sacred timing and numbers, mission transparency, and a no-pressure architecture.

**Database Schema**: Five main tables: `users`, `birth_data`, `charts`, `compatibility`, `daily_guidance`.

## External Dependencies
- **Database**: Neon Database (serverless PostgreSQL).
- **ORMs/Libraries**: Drizzle, TanStack Query, Radix UI, React Hook Form, Wouter.
- **UI/Styling**: Tailwind CSS, shadcn/ui, Lucide React, Class Variance Authority.
- **Development Tools**: TypeScript, Vite, ESBuild, PostCSS.
- **APIs**:
    - **OpenAI**: For AI astrology assistant (GPT-4o).
    - **FreeAstrologyAPI.com**: For authentic Swiss Ephemeris astrological calculations.
    - **GeoNames.org**: For superior city finding and global location data.
    - **PlanetaryHoursAPI**: For location-specific timing calculations.
    - **Stripe**: For payment processing.
    - **Gemini AI**: For expert consultation system (tested with 6 API endpoints).
    - **Grok AI**: For AI astrology assistant.
```