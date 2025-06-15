
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import VenuesPage from "@/pages/VenuesPage";
import ProvidersPage from "@/pages/ProvidersPage";
import BookingsPage from "@/pages/BookingsPage";
import MessagesPage from "@/pages/MessagesPage";
import ListingsPage from "@/pages/ListingsPage";
import ProfilePage from "@/pages/ProfilePage";
import VenueDetailPage from "@/pages/VenueDetailPage";
import SettingsPage from "@/pages/SettingsPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import FAQPage from "@/pages/FAQPage";
import SupportPage from "@/pages/SupportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/venue/:id" element={<VenueDetailPage />} />
              <Route path="/providers" element={<ProvidersPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
