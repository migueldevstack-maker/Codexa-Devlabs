import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function AdminRoutes() {
  const { token, isAuthenticated, login, logout } = useAuth();
  return (
    <Switch>
      <Route path="/admin">
        {isAuthenticated ? <Redirect to="/admin/dashboard" /> : <Login onLogin={login} />}
      </Route>
      <Route path="/admin/dashboard">
        {isAuthenticated ? <Dashboard token={token!} onLogout={logout} /> : <Redirect to="/admin" />}
      </Route>
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminRoutes} />
      <Route path="/admin/dashboard" component={AdminRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
