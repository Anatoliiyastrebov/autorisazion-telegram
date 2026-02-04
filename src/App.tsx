import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Anketa from "./pages/Anketa";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Impressum from "./pages/Impressum";
import DataRequest from "./pages/DataRequest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/anketa" element={<Anketa />} />
            <Route path="/success" element={<Success />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/data-request" element={<DataRequest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
