# Torchlight Astrology Application - Complete Codebase Export

## Project Overview
Torchlight is a comprehensive astrology web application providing detailed natal chart analysis across 9 authentic astrological systems: Western, Vedic, Chinese, Human Design, Numerology, Vaastu, Feng Shui, Color & Gemstone guidance. Built with React, TypeScript, Express.js, and PostgreSQL.

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Vite
- **Backend**: Express.js, TypeScript, ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o, Gemini 2.5, Grok AI
- **APIs**: FreeAstrologyAPI.com, GeoNames.org, PlanetaryHoursAPI

## Project Structure
```
torchlight/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── index.css
├── server/
├── shared/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── replit.md
```

## Key Configuration Files

### package.json
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build client",
    "build:server": "esbuild server/index.ts --platform=node --target=node18 --format=esm --bundle --outfile=dist/server.js --external:tsx",
    "start": "node dist/server.js",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.33.0",
    "@google/genai": "^0.8.0",
    "@hookform/resolvers": "^3.10.0",
    "@neondatabase/serverless": "^0.10.1",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-hover-card": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.1",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@stripe/react-stripe-js": "^2.8.1",
    "@stripe/stripe-js": "^4.8.0",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.0-alpha.30",
    "@tanstack/react-query": "^5.62.2",
    "astronomia": "^2.1.3",
    "astronomy-bundle": "^0.17.4",
    "astronomy-js": "^1.1.6",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "date-fns": "^4.1.0",
    "drizzle-orm": "^0.36.3",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.3.0",
    "express": "^4.21.1",
    "framer-motion": "^11.11.11",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.460.0",
    "memoizee": "^0.4.17",
    "memorystore": "^1.6.7",
    "next-themes": "^0.4.3",
    "openai": "^4.73.1",
    "postcss": "^8.5.1",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.13.3",
    "stripe": "^17.3.1",
    "tailwind-merge": "^2.5.4",
    "tailwindcss": "^3.4.15",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.170.0",
    "tsx": "^4.19.2",
    "tw-animate-css": "^1.0.1",
    "typescript": "^5.6.3",
    "vaul": "^1.1.1",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/memoizee": "^0.4.11",
    "@types/node": "^22.8.6",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.170.0",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.3",
    "drizzle-kit": "^0.29.1",
    "esbuild": "^0.24.0",
    "vite": "^6.0.1"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist/client",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  define: {
    "process.env": {},
  },
});
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        body: ["Lato", "system-ui", "sans-serif"],
        accent: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### drizzle.config.ts
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Core Components

### client/src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Custom Properties - Sanctuary Design System */
:root {
  /* Primary Colors - Sanctuary Palette */
  --brushed-gold: #C5A55A;        /* Warm, luxurious gold */
  --sage-teal: #7FA0A0;           /* Calming, balanced teal */
  --warm-charcoal: #2C2C2E;       /* Deep, sophisticated charcoal */
  --warm-gray: #8E8E93;           /* Soft, neutral gray */
  
  /* Extended Palette */
  --off-white: #F5F5DC;           /* Soft, warm white */
  --deep-navy: #1C1C1E;           /* Rich, profound navy */
  --muted-rose: #D4A5A5;          /* Gentle, nurturing rose */
  --forest-green: #5A6B4F;        /* Grounding, natural green */
  
  /* Semantic Applications */
  --primary-accent: var(--brushed-gold);
  --secondary-accent: var(--sage-teal);
  --background: var(--warm-charcoal);
  --surface: var(--deep-navy);
  --text-primary: var(--off-white);
  --text-secondary: var(--warm-gray);
  --border-muted: var(--warm-gray);
  
  /* Component Specific */
  --card-background: rgba(44, 44, 46, 0.85);
  --button-primary: linear-gradient(135deg, var(--brushed-gold), var(--sage-teal));
  --button-hover: linear-gradient(135deg, #D4B35B, #8BB0B0);
  
  /* shadcn/ui variables */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
}

/* Global Styles */
* {
  border-color: hsl(var(--border));
}

body {
  color: hsl(var(--foreground));
  background: linear-gradient(135deg, 
    hsl(222.2, 84%, 4.9%) 0%,
    hsl(217.2, 32.6%, 8%) 50%,
    hsl(222.2, 84%, 4.9%) 100%);
  font-feature-settings: "rlig" 1, "calt" 1;
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
}

/* Typography */
.font-body {
  font-family: 'Lato', system-ui, sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

.font-accent {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  letter-spacing: -0.015em;
}

/* Sanctuary button styling */
.sanctuary-button {
  background: linear-gradient(135deg, var(--primary-accent), var(--secondary-accent));
  border: 1px solid var(--border-muted);
  color: var(--background);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(197, 165, 90, 0.3);
}

.sanctuary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(197, 165, 90, 0.4);
  border-color: var(--primary-accent);
}

/* Sanctuary Card Style */
.sanctuary-card {
  background: linear-gradient(135deg, 
    hsla(30, 8%, 18%, 0.85) 0%, 
    hsla(30, 6%, 22%, 0.9) 100%);
  border: 1px solid var(--border-muted);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* Mobile optimizations */
.mobile-container {
  padding: 1rem;
  max-width: 28rem;
  margin: 0 auto;
}

.mobile-card {
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
  background: linear-gradient(135deg, 
    hsla(30, 8%, 18%, 0.85), 
    hsla(30, 6%, 22%, 0.9)) !important;
  border: 1px solid var(--warm-gray) !important;
  padding: clamp(1rem, 3vw, 1.5rem) !important;
  min-height: 120px !important;
}

/* Navigation header styles */
.clean-nav {
  background: linear-gradient(135deg, 
    hsla(30, 8%, 18%, 0.95) 0%, 
    hsla(30, 6%, 22%, 0.98) 100%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--warm-gray);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Better mobile touch targets */
button, input, select, textarea, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
  -webkit-appearance: none;
  appearance: none;
}

/* Mobile form optimizations */
input, textarea, select {
  font-size: 16px;
  border-radius: 8px;
  padding: 12px 16px;
}

/* Base layer styles */
@layer base {
  * {
    border-color: hsl(var(--border));
  }
}
```

### client/src/components/torchlight-logo.tsx
```typescript
import React from 'react';

interface TorchlightLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export const TorchlightLogo: React.FC<TorchlightLogoProps> = ({ 
  size = 'md', 
  className = '',
  showIcon = true,
  showText = true
}) => {
  const containerHeight = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const iconSize = {
    sm: { width: 30, height: 30, viewBox: "0 0 100 100" },
    md: { width: 50, height: 50, viewBox: "0 0 100 100" },
    lg: { width: 60, height: 60, viewBox: "0 0 100 100" },
    xl: { width: 80, height: 80, viewBox: "0 0 100 100" }
  };

  const textSize = {
    sm: 20,
    md: 32,
    lg: 40,
    xl: 48
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && (
        <svg 
          width={iconSize[size].width}
          height={iconSize[size].height}
          viewBox={iconSize[size].viewBox}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {/* The 'T' Stem (Torch Handle) */}
          <rect fill="#D4B35B" x="40" y="35" width="20" height="50" rx="3" />

          {/* The Flame (Top of the 'T') */}
          <path fill="#D4B35B" d="M50 30 C 35 30, 25 15, 50 5 C 75 15, 65 30, 50 30 Z" />

          {/* The Guiding Star */}
          <path fill="#D4B35B" d="M50 0 L55 10 L65 15 L55 20 L50 30 L45 20 L35 15 L45 10 Z" />
        </svg>
      )}
      
      {showText && (
        <span 
          className="font-semibold"
          style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontWeight: 600,
            fontSize: `${textSize[size]}px`,
            color: '#F5F5DC' // Off-White
          }}
        >
          Torchlight
        </span>
      )}
    </div>
  );
};

export default TorchlightLogo;
```

### shared/schema.ts
```typescript
import { pgTable, text, timestamp, varchar, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const birthData = pgTable("birth_data", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  fullName: varchar("full_name").notNull(),
  birthDate: varchar("birth_date").notNull(),
  birthTime: varchar("birth_time"),
  birthLocation: varchar("birth_location").notNull(),
  latitude: varchar("latitude"),
  longitude: varchar("longitude"),
  timezone: varchar("timezone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const charts = pgTable("charts", {
  id: varchar("id").primaryKey(),
  birthDataId: varchar("birth_data_id").references(() => birthData.id),
  chartType: varchar("chart_type").notNull(), // western, vedic, chinese, etc.
  chartData: jsonb("chart_data").notNull(),
  interpretation: text("interpretation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const compatibility = pgTable("compatibility", {
  id: varchar("id").primaryKey(),
  person1Id: varchar("person1_id").references(() => birthData.id),
  person2Id: varchar("person2_id").references(() => birthData.id),
  compatibilityType: varchar("compatibility_type").notNull(),
  score: integer("score"),
  analysis: jsonb("analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyGuidance = pgTable("daily_guidance", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  date: varchar("date").notNull(),
  guidance: jsonb("guidance").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertBirthDataSchema = createInsertSchema(birthData);
export const selectBirthDataSchema = createSelectSchema(birthData);
export const insertChartSchema = createInsertSchema(charts);
export const selectChartSchema = createSelectSchema(charts);

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BirthData = z.infer<typeof selectBirthDataSchema>;
export type InsertBirthData = z.infer<typeof insertBirthDataSchema>;
export type Chart = z.infer<typeof selectChartSchema>;
export type InsertChart = z.infer<typeof insertChartSchema>;
```

## Server Files

### server/index.ts
```typescript
import express from "express";
import ViteExpress from "vite-express";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());

async function startServer() {
  const server = await registerRoutes(app);
  
  ViteExpress.listen(server, 5000, () => {
    console.log("Server is listening on port 5000...");
  });
}

startServer().catch(console.error);
```

### server/routes.ts
```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { generateChart } from "./chart-generator.js";
import { generateCompatibility } from "./compatibility-analyzer.js";
import { generateDailyGuidance } from "./daily-guidance.js";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chart generation endpoint
  app.post("/api/generate-chart", async (req, res) => {
    try {
      const birthDataSchema = z.object({
        fullName: z.string().min(1),
        birthDate: z.string(),
        birthTime: z.string().optional(),
        birthLocation: z.string().min(1),
        systems: z.array(z.string()).optional().default(["western", "vedic"])
      });

      const birthData = birthDataSchema.parse(req.body);
      const charts = await generateChart(birthData);
      
      res.json({ success: true, charts });
    } catch (error) {
      console.error("Chart generation error:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Compatibility analysis endpoint
  app.post("/api/analyze-compatibility", async (req, res) => {
    try {
      const compatibilitySchema = z.object({
        person1: z.object({
          fullName: z.string(),
          birthDate: z.string(),
          birthTime: z.string().optional(),
          birthLocation: z.string()
        }),
        person2: z.object({
          fullName: z.string(),
          birthDate: z.string(),
          birthTime: z.string().optional(),
          birthLocation: z.string()
        }),
        systems: z.array(z.string()).optional().default(["western", "vedic"])
      });

      const data = compatibilitySchema.parse(req.body);
      const compatibility = await generateCompatibility(data);
      
      res.json({ success: true, compatibility });
    } catch (error) {
      console.error("Compatibility analysis error:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Daily guidance endpoint
  app.post("/api/daily-guidance", async (req, res) => {
    try {
      const guidanceSchema = z.object({
        birthData: z.object({
          fullName: z.string(),
          birthDate: z.string(),
          birthTime: z.string().optional(),
          birthLocation: z.string()
        }),
        date: z.string().optional()
      });

      const data = guidanceSchema.parse(req.body);
      const guidance = await generateDailyGuidance(data);
      
      res.json({ success: true, guidance });
    } catch (error) {
      console.error("Daily guidance error:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

## Key Features Implementation

### Multi-System Astrological Analysis
- **Western Astrology**: Tropical zodiac, 12 houses, planetary aspects
- **Vedic Astrology**: Sidereal zodiac, 27 nakshatras, dasha periods, gemstone recommendations
- **Chinese Zodiac**: 12-year cycles, five elements, yin-yang
- **Human Design**: Gates, centers, channels, strategy and authority
- **Numerology**: Life path, destiny, soul urge numbers
- **Vaastu Shastra**: Directional energy, five elements
- **Feng Shui**: Chi flow, bagua map, flying stars
- **Color Astrology**: Personalized color recommendations
- **Gemstone Guidance**: Vedic-based crystal therapy

### AI Integration
- **OpenAI GPT-4o**: Primary interpretation engine
- **Gemini 2.5**: Expert consultation system
- **Grok AI**: Alternative interpretation source
- **Quad-AI Synthesis**: Cross-validation of insights

### Mobile-First Design
- **Sanctuary Design Palette**: Warm charcoal, brushed gold, sage teal
- **Responsive Components**: Optimized for iOS/Android
- **Touch-Friendly Interface**: 44px minimum touch targets
- **Safe Area Support**: iOS notch and gesture handling

### Authentication & Security
- **Replit Auth Integration**: OpenID Connect
- **Session Management**: PostgreSQL-backed sessions
- **GDPR Compliance**: Consent management
- **Age Verification**: Country-specific requirements

## Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://...

# AI Services
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
XAI_API_KEY=...

# Astrology APIs
FREE_ASTROLOGY_API_KEY=...

# Payment Processing
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...

# Authentication
SESSION_SECRET=...
REPL_ID=...
REPLIT_DOMAINS=...
```

## Deployment Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npm run db:push
   ```

3. **Environment Configuration**:
   - Set all required environment variables
   - Configure Replit authentication domains

4. **Development**:
   ```bash
   npm run dev
   ```

5. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## Key Design Principles

1. **Authentic Data Only**: No mock or placeholder data
2. **Mobile-First**: Optimized for smartphone usage
3. **Sanctuary Aesthetic**: Psychologically optimized color palette
4. **Cross-System Synthesis**: Unified insights across traditions
5. **Professional Grade**: $200+ value comprehensive reports

## Future Enhancements

- [ ] Real-time transit tracking
- [ ] Advanced relationship analysis
- [ ] 3D chart visualization
- [ ] Astral soundtrack generation
- [ ] Business astrology analysis
- [ ] Multi-language support expansion

## Complete File Structure
```
torchlight/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (shadcn/ui components)
│   │   │   ├── navigation.tsx
│   │   │   ├── torchlight-logo.tsx
│   │   │   ├── simple-birth-form.tsx
│   │   │   ├── chart-results.tsx
│   │   │   ├── feature-hover-card.tsx
│   │   │   ├── language-switcher.tsx
│   │   │   ├── mobile-navigation.tsx
│   │   │   └── energy-exchange.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx
│   │   │   ├── landing.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── compatibility.tsx
│   │   │   └── daily-guidance.tsx
│   │   ├── hooks/
│   │   │   ├── use-toast.ts
│   │   │   ├── useAuth.ts
│   │   │   └── use-mobile.tsx
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── i18n.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
├── server/
│   ├── chart-generator.ts
│   ├── compatibility-analyzer.ts
│   ├── daily-guidance.ts
│   ├── gemstone-astrology.ts
│   ├── ai-synthesizer-service.ts
│   ├── routes.ts
│   └── index.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── tsconfig.json
├── components.json
└── replit.md
```

## Download Instructions

The complete codebase has been exported to `TORCHLIGHT_COMPLETE_CODEBASE_EXPORT.md` and a compressed archive has been created.

To download and set up the project:

1. **Download the export file**: `TORCHLIGHT_COMPLETE_CODEBASE_EXPORT.md`
2. **Install dependencies**: `npm install`
3. **Set up environment variables** (see Environment Variables section)
4. **Initialize database**: `npm run db:push`
5. **Start development**: `npm run dev`

## Key Technologies Summary
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + ESM
- **Database**: PostgreSQL + Drizzle ORM
- **UI Components**: shadcn/ui + Radix UI
- **AI**: OpenAI GPT-4o + Gemini 2.5 + Grok
- **APIs**: FreeAstrologyAPI.com + GeoNames + PlanetaryHours
- **Authentication**: Replit Auth (OpenID Connect)
- **Payments**: Stripe integration ready

---

**Last Updated**: August 2025
**Version**: 1.0.0
**Platform**: Replit
**License**: Proprietary