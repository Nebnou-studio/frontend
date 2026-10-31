import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import FunnelApp from './pages/funnel/FunnelApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* The whole funnel: /start, /start/questions, /start/booking, /start/done */}
        <Route path="/start/*" element={<FunnelApp />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}