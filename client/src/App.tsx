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
import Compatibility from "@/pages/compatibility";
import Daily from "@/pages/daily";
import AIAssistant from "@/pages/ai-assistant";
import Numerology from "@/pages/numerology";
import AboutAstrology from "@/pages/about-astrology";
import ComprehensiveAnalysis from "@/pages/comprehensive-analysis";
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
            <Route path="/compatibility" component={Compatibility} />
            <Route path="/daily" component={Daily} />
            <Route path="/ai-assistant" component={AIAssistant} />
            <Route path="/numerology" component={Numerology} />
            <Route path="/about-astrology" component={AboutAstrology} />
            <Route path="/analysis" component={ComprehensiveAnalysis} />
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
