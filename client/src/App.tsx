import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Chart from "@/pages/chart";
import Compatibility from "@/pages/compatibility";
import Daily from "@/pages/daily";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen">
      {/* Fixed starfield background */}
      <div className="fixed inset-0 starfield opacity-30 pointer-events-none"></div>
      
      <Navigation />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chart" component={Chart} />
        <Route path="/compatibility" component={Compatibility} />
        <Route path="/daily" component={Daily} />
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
