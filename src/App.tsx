import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute"; // Imported here

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
import AuthCallback from "./pages/AuthCallback"; 
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

// Global smart redirect routing engine based on resolved roles
function DashboardFallback() {
  const { profile } = useAuth();

  if (!profile) return <Navigate to="/" replace />;

  switch (profile.role) {
    case "admin":
      return <Navigate to="/admin-dashboard" replace />;
    case "dpco":
      return <Navigate to="/dpco-dashboard" replace />;
    case "organization":
    default:
      return <Navigate to="/org-dashboard" replace />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
        {/* Public Marketing & Information Routes */}
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
        
        {/* Supabase Core Identity Callback Endpoint */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Unified Dashboard Entry Routing Logic */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardFallback />
          </ProtectedRoute>
        } />

        {/* Organization Infrastructure Workspace */}
        <Route path="/org-dashboard" element={
          <ProtectedRoute roles={["organization", "admin"]}>
            <OrganizationDashboard />
          </ProtectedRoute>
        } />

        {/* Data Protection Compliance Services (DPCO) Panel */}
        <Route path="/dpco-dashboard" element={
          <ProtectedRoute roles={["dpco", "admin"]}>
            <DPCODashboard />
          </ProtectedRoute>
        } />

        {/* System Administration Configuration Interface */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Apex Regulatory Auditing Environment */}
        <Route path="/regulator" element={
          <ProtectedRoute roles={["admin"]}>
            <Regulator />
          </ProtectedRoute>
        } />

        {/* Wildcard Fallback Router Exception Block */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;