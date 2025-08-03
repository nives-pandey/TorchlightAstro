# Torchlight Astrology Application

## Overview

Torchlight is a comprehensive astrology web application providing detailed natal chart analysis, compatibility readings, daily guidance, and personalized recommendations across multiple astrological systems: Western, Vedic, Chinese Zodiac, Human Design, Numerology, Tarot, Color Astrology, Gemstone Guidance, Vaastu, and Feng Shui. Built as a full-stack TypeScript application, it emphasizes authentic astronomical calculations and traditional methodologies. The project aims to offer a unique 10-in-1 platform with educational depth, lifestyle intelligence, and cross-system synthesis, setting it apart from single-system competitors and delivering professional-grade insights.

## User Preferences

Preferred communication style: Simple, everyday language.
Remove references to "urban professionals" and age groups to avoid alienating users.
Focus on inclusive language that welcomes all seekers of astrological guidance.
Brand name: "Torchlight" confirmed after SEO and relevance analysis - stronger than "Lamplight" for modern astrology applications.
Remove mention of years from astrology systems display (user request: Jan 31, 2025) - maintain chronological order but without age badges or year references.
Update contribution section: Add "free forever" emphasis, include detailed reasons for requesting contributions (volunteers, 1000s hours, centuries experience, technology costs), and add "Can't pay? Just share the love" section for those unable to contribute financially.

## Recent Major Enhancements (Jan 31, 2025)

### Mobile iOS Optimization Completed ✅
- Comprehensive mobile-first responsive design implementation
- iOS safe area support for notch and home indicator compatibility  
- 44px minimum touch targets meeting iOS accessibility standards
- Font zoom prevention with 16px minimum font sizes
- Gesture-based navigation support and touch optimization
- Complete CSS rebuild to eliminate font overlapping issues
- Mobile-specific breakpoints with clamp() responsive scaling

### Enhanced Business Logic Documentation ✅
- Complete codebase structure documentation created for Gemini AI testing
- Business logic and technical architecture fully documented
- All enhanced features beyond original requirements highlighted
- Testing package prepared with comprehensive instructions
- Deployment configuration and success metrics defined

### Comprehensive Codebase Package for Gemini AI Created ✅
- Generated complete technical documentation (GEMINI_AI_TESTING_PACKAGE.md)
- Detailed codebase structure analysis (CODEBASE_STRUCTURE.md)
- Business logic and architecture documentation
- API integration status and testing protocols
- Performance metrics and security implementation details
- Revenue projections and competitive analysis
- Complete file structure with component descriptions
- Testing checklist and validation requirements

## System Architecture

### Full-Stack Application Structure
The application employs a monorepo structure separating client, server, and shared components. The frontend is a React application built with Vite, the backend uses Express.js, and PostgreSQL with Drizzle ORM handles data persistence.

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components, TanStack Query for state management, Wouter for routing, React Hook Form with Zod validation.
- **Backend**: Express.js, TypeScript, ESM modules.
- **Database**: PostgreSQL with Drizzle ORM.
- **Build Tools**: Vite (frontend), esbuild (backend).
- **Internationalization**: Custom i18n system supporting English, Spanish, Russian, and French.

### Key Components & Design Decisions
- **UI/UX**: Component-based architecture with shadcn/ui for consistent design. Features a dark theme with space/astrology-inspired styling, animations, and a mobile-first approach optimized for iOS/Android, particularly for women aged 20-60. Emphasizes clean layouts, intuitive navigation, and value-first psychology (delivering results before payment requests).
- **Core Functionality**:
    - **Chart Generation**: User inputs birth data, system validates and geocodes, performs astronomical calculations using Swiss Ephemeris precision, generates interpretations across multiple systems, and stores results.
    - **Real-time Calculations**: Planetary positions, house systems, aspects, and patterns are computed dynamically, integrating multiple astrological traditions.
    - **Output Formats**: Screen viewing (interactive chat with 8-section structured output), premium PDF reports, email delivery, and white-label reports for professionals.
    - **Cross-System Analysis**: Includes system comparison reports, multi-partner astro-matching, group compatibility, and side-by-side comparative analysis of system strengths.
    - **Input-Based Systems**: Numerology, Tarot birth cards, color recommendations, and gemstone guidance are integrated.
    - **AI Assistant**: Conversational AI assistant for astrological interpretations and educational content, using OpenAI GPT-4o with a fallback architecture for quota management.
    - **Time-Based Interface**: Dynamic interface adapting throughout the day with distinct themes and personalized content.
    - **Mobile Optimization**: Comprehensive iOS/Android optimization with safe area support, touch targets, and native app-like experience.

### Database Schema
Five main tables: `users` (profiles, auth), `birth_data` (birth info, location, preferences), `charts` (generated charts, interpretations), `compatibility` (relationship analysis), `daily_guidance` (personalized insights).

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
```