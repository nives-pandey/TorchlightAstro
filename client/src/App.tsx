import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { PageTransition } from "@/components/page-transition";
import Navigation from "@/components/navigation";
import TimeAdaptiveNavigation from "@/components/time-adaptive-navigation";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Personal from "@/pages/personal";
import Couples from "@/pages/couples";
import Spaces from "@/pages/spaces";
import Chart from "@/pages/chart";
import Chart3D from "@/pages/3d-chart";
import Chart3DDemo from "@/pages/3d-demo";
import BirthFormPage from "@/pages/birth-form";
import EnhancedDemo from "@/pages/enhanced-demo";
import CosmicTimeInterface from "@/pages/cosmic-time-interface";
import FlowingRiverPage from "@/pages/flowing-river";
import Compatibility from "@/pages/compatibility";
import Daily from "@/pages/daily";
import AIAssistant from "@/pages/ai-assistant";
import Numerology from "@/pages/numerology";
import AboutAstrology from "@/pages/about-astrology";
import AstrologyGuide from "@/pages/astrology-guide";
import ComprehensiveAnalysis from "@/pages/comprehensive-analysis";
import ComprehensiveTest from "@/pages/comprehensive-test";
import Pricing from "@/pages/pricing";
import FeatureDashboard from "@/pages/feature-dashboard";
import GemstoneGuidance from "@/pages/gemstone-guidance";
import ComprehensivePredictions from "@/pages/comprehensive-predictions";
import ComprehensiveLifestyle from "@/pages/comprehensive-lifestyle";
import LifestyleIntelligence from "@/pages/lifestyle-intelligence";
import GemstoneLifestylePairing from "@/pages/gemstone-lifestyle-pairing";
import GemstoneEnergyPairingPage from "@/pages/gemstone-energy-pairing-page";
import DemoChart from "@/pages/demo-chart";
import TimezoneAnalytics from "@/pages/timezone-analytics";
import AdminDashboard from "@/pages/admin-dashboard";
import ContributePage from "@/pages/contribute";
import NotFound from "@/pages/not-found";
import AstralSoundtrack from "@/components/astral-soundtrack";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  // For demo purposes, show the main app without authentication
  return (
    <div className="min-h-screen">
      {/* Fixed starfield background */}
      <div className="fixed inset-0 starfield opacity-30 pointer-events-none"></div>
      
      <PageTransition>
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Switch>
        <Route path="/" component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/personal" component={Personal} />
        <Route path="/couples" component={Couples} />
        <Route path="/spaces" component={Spaces} />
        <Route path="/chart" component={Chart} />
        <Route path="/3d-chart" component={Chart3D} />
        <Route path="/3d-demo" component={Chart3DDemo} />
        <Route path="/compatibility" component={Compatibility} />
        <Route path="/daily" component={Daily} />
        <Route path="/ai-assistant" component={AIAssistant} />
        <Route path="/numerology" component={Numerology} />
        <Route path="/astrology-guide" component={AstrologyGuide} />
        <Route path="/about-astrology" component={AboutAstrology} />
        <Route path="/analysis" component={ComprehensiveAnalysis} />
        <Route path="/test" component={ComprehensiveTest} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/features" component={FeatureDashboard} />
        <Route path="/birth-form" component={BirthFormPage} />
        <Route path="/enhanced-demo" component={EnhancedDemo} />
        <Route path="/cosmic-time" component={CosmicTimeInterface} />
        <Route path="/flowing-river" component={FlowingRiverPage} />
        <Route path="/gemstone-guidance" component={GemstoneGuidance} />
        <Route path="/comprehensive-predictions" component={ComprehensivePredictions} />
        <Route path="/comprehensive-lifestyle" component={ComprehensiveLifestyle} />
        <Route path="/lifestyle-intelligence" component={LifestyleIntelligence} />
        <Route path="/gemstone-lifestyle-pairing" component={GemstoneLifestylePairing} />
        <Route path="/gemstone-energy-pairing" component={GemstoneEnergyPairingPage} />
        <Route path="/demo-chart" component={DemoChart} />
        <Route path="/timezone-analytics" component={TimezoneAnalytics} />
        <Route path="/astral-soundtrack" component={AstralSoundtrack} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/contribute" component={ContributePage} />
        <Route component={NotFound} />
            </Switch>
          </motion.div>
        </AnimatePresence>
      </PageTransition>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
