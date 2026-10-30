import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import { BrandMark } from './components/BrandBlocks';

// Placeholder view for /start funnel before funnel phase is built
const FunnelStarter = () => {
  return (
    <div className="min-h-screen bg-[#FFF7EE] text-[#1B1F2A] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-3 bg-white rounded-2xl border border-[#EADFD2] mb-6 shadow-xs">
        <BrandMark size={48} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">
        Tunnel de réservation Nebnou
      </h1>
      <p className="text-[#6B7280] max-w-md mb-8">
        La première étape du tunnel (Vidéo · 3 questions · Réservation d'appel) sera intégrée ici à la prochaine étape du projet.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF7A3D] text-[#1B1F2A] font-heading font-semibold hover:bg-[#E2591B] transition-colors"
      >
        ← Retour à la page d'accueil
      </Link>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<FunnelStarter />} />
        <Route path="/start/*" element={<FunnelStarter />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
