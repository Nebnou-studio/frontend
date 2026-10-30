import React, { useEffect } from 'react';
import { Header } from './Header';
import { Hero } from './sections/hero';
import { Projects } from './sections/projects';
import { Steps } from './sections/steps';
import { Cta } from './sections/cta';
import { Footer } from './Footer';

export const LandingPage = () => {
  // IntersectionObserver for section enter fade-up
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7EE] text-[#1B1F2A] flex flex-col selection:bg-[#FF7A3D] selection:text-[#1B1F2A]">
      <Header />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Steps />
        <Cta />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
