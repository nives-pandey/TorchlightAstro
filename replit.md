# Torchlight Astrology Application

## Overview

Torchlight is a comprehensive astrology web application that integrates multiple astrological systems including Western, Vedic, Chinese Zodiac, Human Design, Numerology, and other input-based metaphysical systems. The application provides users with detailed natal chart analysis, compatibility readings, daily guidance, numerological profiles, tarot birth cards, color recommendations, and gemstone guidance - all based on authentic astronomical calculations and traditional methodologies. Built as a full-stack TypeScript application with a React frontend and Express backend, it uses PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.
Remove references to "urban professionals" and age groups to avoid alienating users.
Focus on inclusive language that welcomes all seekers of astrological guidance.
Brand name: "Torchlight" confirmed after SEO and relevance analysis - stronger than "Lamplight" for modern astrology applications.
Domain situation: Primary domains (torchlight.com, gettorchlight.com) are taken by established businesses. Alternatives to consider: mytorchlight.com, torchlight.co, torchlight.dev, torchlight.tech

## System Architecture

### Full-Stack Application Structure
The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Client**: React frontend with TypeScript, built with Vite
- **Server**: Express.js backend with TypeScript
- **Shared**: Common schemas and types used across both client and server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, TypeScript, ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tools**: Vite for frontend, esbuild for backend bundling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Internationalization**: Custom i18n system with 4 language support (EN, ES, RU, FR)

## Key Components

### Frontend Architecture
The client application uses a component-based architecture with:
- **UI Components**: shadcn/ui component library for consistent design
- **Page Components**: Home, Chart, Compatibility, Daily guidance pages
- **Feature Components**: Specialized components for birth data forms, chart wheels, compatibility analysis
- **Cosmic Theme**: Dark theme with space/astrology-inspired styling and animations
- **Language Support**: Complete multilingual interface with 4 languages and language switching

### Backend API Structure
The server provides RESTful endpoints for:
- **User Management**: Create and retrieve user profiles
- **Birth Data**: Store and manage birth information with location data
- **Chart Generation**: Calculate and store astrological charts
- **Compatibility Analysis**: Multi-person compatibility calculations
- **Daily Guidance**: Personalized daily astrological insights
- **Numerology Calculations**: Complete numerological profiles with life path, destiny, and personality analysis
- **Input-Based Systems**: Tarot birth cards, color recommendations, and gemstone guidance

### Database Schema
The application uses five main tables:
- **users**: User profiles and authentication data
- **birth_data**: Birth information including date, time, location, and system preferences
- **charts**: Generated astrological charts with interpretations
- **compatibility**: Relationship compatibility analysis results
- **daily_guidance**: Personalized daily astrological guidance

## Data Flow

### Chart Generation Process
1. User inputs birth data through multi-step form
2. System validates and geocodes location information
3. Astronomical calculations performed using birth data
4. Multiple astrological systems generate interpretations
5. Results synthesized and stored in database
6. Visual chart wheel and detailed analysis presented to user

### Real-time Calculations
The application performs authentic astrological calculations rather than using pre-generated content:
- Planetary positions calculated from astronomical data
- House systems computed based on birth time and location
- Aspects and patterns identified through geometric analysis
- Multiple astrological traditions integrated for comprehensive readings

## Recent Updates

### Comprehensive Sectional Organization (July 24, 2025)
- Reorganized application into three user-focused sections: People, Couples, Homes & Business
- Personal Astrology section: Natal charts, numerology, daily guidance, Human Design
- Couples section: Synastry, composite charts, Chinese compatibility, numerology compatibility
- Homes & Business section: Vastu Shastra, Feng Shui, auspicious timing, space remedies
- Updated navigation structure to reflect comprehensive user categories
- Enhanced landing page with clear sectional organization and feature descriptions
- Multilingual support expanded to include new sectional content

### Multilingual Interface Implementation (July 24, 2025)
- Comprehensive internationalization system supporting Spanish, Russian, and French
- Complete translation management with 90+ text strings across all user interfaces
- Language switcher component with dropdown selection and persistent storage
- Translation verification system with word count tracking and debugging tools
- Auto-detection of browser language preferences with fallback to English
- Cosmic-themed language selector maintaining design consistency
- Full landing page translation across all supported languages
- Navigation and user interface elements fully localized

### Swiss Ephemeris Integration (July 24, 2025)
- High-precision astronomical calculations implemented using pure JavaScript algorithms
- Enhanced planetary position calculations with orbital mechanics considerations
- Placidus house system calculations with latitude adjustments
- Improved aspect calculations with exactness ratings
- Mathematical Julian Day conversions for precise timing

### AI Assistant Implementation (July 24, 2025)
- Conversational astrological guidance without external API dependencies
- Open-source knowledge base covering Western, Vedic, Chinese, and Human Design systems
- Processing animations and realistic delays for better user experience
- Personalized insights based on complete birth chart analysis
- Cross-system synthesis and timing recommendations

### Educational Content Addition (July 24, 2025)
- Comprehensive "About Astrology" page explaining the science and mathematics behind astrology
- Information about different astrological arts: palmistry, face reading, anjana, kavade
- Clear explanation of Torchlight's role as illumination rather than decision-making
- Emphasis on personal responsibility and free will in all readings

### Design System Refinement (July 24, 2025)
- Restored cosmic color scheme with dark gradient backgrounds and golden accents
- Maintained Apple-inspired clean layout structure and typography
- Updated language to be honest about AI system (removed corporate "we" pronouns)
- Separated "Numerology" as standalone feature in navigation and forms
- Implemented clean navigation with cosmic-themed active states and hover effects

### Input-Based Systems Implementation (July 24, 2025)
- Numerology system with complete calculations (Life Path, Destiny, Soul Urge, Personality)
- Tarot birth card analysis based on birth date calculations
- Color astrology recommendations for different purposes and timing
- Gemstone astrology with healing, protection, and prosperity stones
- Cross-system integration providing comprehensive metaphysical profiles
- User-friendly interface with tabbed navigation for different calculation types

## External Dependencies

### Core Libraries
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Drizzle**: Type-safe ORM with schema validation
- **TanStack Query**: Server state management and caching
- **Radix UI**: Headless component primitives for accessibility
- **React Hook Form**: Form validation and management
- **Wouter**: Lightweight client-side routing

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across full stack
- **Vite**: Fast development and build tooling
- **ESBuild**: Backend bundling for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Build Process
The application uses a two-stage build process:
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: ESBuild bundles Express server with external dependencies

### Environment Configuration
- **Development**: Hot module replacement with Vite dev server
- **Production**: Compiled static frontend served by Express server
- **Database**: Environment-based connection strings for different deployment stages

### Hosting Considerations
The application is designed for deployment on platforms supporting:
- Node.js runtime for Express backend
- Static file serving for React frontend
- PostgreSQL database connectivity
- Environment variable configuration for database URLs and API keys

### Performance Optimizations
- Code splitting with Vite for optimal loading
- TanStack Query for intelligent caching and background updates
- Lazy loading of components for faster initial page loads
- Optimized bundle sizes through proper dependency management