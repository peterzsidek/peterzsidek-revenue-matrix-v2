import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HeroPreview from "./pages/HeroPreview";
import Adatkezeles from "./pages/Adatkezeles";
import DifferentiatorPrototype from "./pages/DifferentiatorPrototype";
import InAppBrowserBanner from "./components/InAppBrowserBanner";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/differentiator-prototype"} component={DifferentiatorPrototype} />
      <Route path={"/hero-preview"} component={HeroPreview} />
      <Route path={"/adatkezeles"} component={Adatkezeles} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <div style={{ overflowX: 'clip', width: '100%', maxWidth: '100vw', position: 'relative' }}>
            <Router />
            <InAppBrowserBanner />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
