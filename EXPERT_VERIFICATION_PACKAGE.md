# Torchlight Codebase Verification Package

## Project Overview
Torchlight is a comprehensive astrology web application providing detailed natal chart analysis, compatibility readings, daily guidance, and personalized recommendations across multiple astrological systems. Built as a full-stack TypeScript application with React frontend and Express backend.

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components, TanStack Query, Wouter
- **Backend**: Express.js, TypeScript, ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tools**: Vite (frontend), esbuild (backend)

## Key Features Implemented
1. **Sacred Energy Exchange**: Complete contribution system with 8 sacred tiers, cosmic wheel, gratitude cookie
2. **Official Logo**: Montserrat 600 weight, polished gold (#D4B35B), warm charcoal background
3. **Sanctuary Design System**: Warm charcoal, brushed gold, sage teal color palette
4. **Multi-AI Integration**: OpenAI GPT-4o, Gemini 2.5, Grok AI for astrological analysis
5. **Authentic Calculations**: Swiss Ephemeris precision via FreeAstrologyAPI
6. **Mobile-First Design**: iOS/Android optimized with native app-like experience

## Current Status
- Sacred Energy Exchange fully integrated into main home page
- Official Torchlight logo implemented across all components
- Application running successfully on port 5000
- Zero design system violations maintained
- Clean codebase with no orphaned contribution code

## Files for Expert Review
See individual file exports below for complete implementation details.

---

## Project Structure
```
torchlight/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EnergyExchange.tsx         # Sacred Energy Exchange component
│   │   │   ├── torchlight-logo.tsx        # Official logo component
│   │   │   ├── navigation.tsx             # Main navigation
│   │   │   └── [other components]
│   │   ├── pages/
│   │   │   ├── home.tsx                   # Main home page with integrated Sacred Exchange
│   │   │   ├── contribute.tsx             # Separate contribution page
│   │   │   └── [other pages]
│   │   ├── lib/
│   │   │   └── contributionTiers.ts       # Sacred tier definitions
│   │   └── index.css                      # Sanctuary design system
├── server/
│   ├── index.ts                           # Express server entry
│   └── [other server files]
├── shared/
│   └── schema.ts                          # Database schema
├── package.json                           # Dependencies
└── replit.md                              # Project documentation
```

## Verification Checklist
- [ ] Sacred Energy Exchange displays on home page
- [ ] Official logo shows in navigation and headers
- [ ] Sanctuary color palette (warm charcoal, brushed gold, sage teal) applied
- [ ] Application starts successfully
- [ ] No console errors or build issues
- [ ] Mobile-responsive design working
- [ ] All contribution features functional

---

# COMPLETE FILE EXPORTS FOR EXPERT REVIEW

## 1. MAIN HOME PAGE WITH INTEGRATED SACRED ENERGY EXCHANGE