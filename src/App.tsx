import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import { useAuth } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import ComplianceGap from "./pages/ComplianceGap";
import Solution from "./pages/solution";
import Demo from "./pages/Demo";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Regulator from "./pages/Regulator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DPCODashboard from "./pages/DPCODashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" replace />;

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/compliance-gap" element={<ComplianceGap />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Organization Dashboard */}
        <Route path="/org-dashboard" element={
          <ProtectedRoute roles={["organization", "admin"]}>
            <OrganizationDashboard />
          </ProtectedRoute>
        } />

        {/* DPCO Dashboard */}
        <Route path="/dpco-dashboard" element={
          <ProtectedRoute roles={["dpco", "admin"]}>
            <DPCODashboard />
          </ProtectedRoute>
        } />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Regulator - admin only */}
        <Route path="/regulator" element={
          <ProtectedRoute roles={["admin"]}>
            <Regulator />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;