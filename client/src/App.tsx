import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Personal from "@/pages/personal";
import Couples from "@/pages/couples";
import Spaces from "@/pages/spaces";
import Chart from "@/pages/chart";
import Chart3D from "@/pages/3d-chart";
import Chart3DDemo from "@/pages/3d-demo";
import BirthFormPage from "@/pages/birth-form";
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
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed starfield background */}
      <div className="fixed inset-0 starfield opacity-30 pointer-events-none"></div>
      
      <Switch>
        {!isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Navigation />
            <Route path="/" component={Home} />
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
          </>
        )}
        <Route component={NotFound} />
      </Switch>
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
