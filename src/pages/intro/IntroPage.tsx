import React from 'react';
import { Hero } from '../../components/intro/Hero.tsx';
import { HowItWorks } from '../../components/intro/HowItWorks.tsx';
import { ComparisonTable } from '../../components/intro/ComparisonTable.tsx';
import { FeaturedComparison } from '../../components/intro/FeaturedComparison.tsx';
import { SuperSaveTeaser } from '../../components/intro/SuperSaveTeaser.tsx';
import { TrustStrip } from '../../components/intro/TrustStrip.tsx';
import { CategoryTiles } from '../../components/intro/CategoryTiles.tsx';
import { FaqAccordion } from '../../components/intro/FaqAccordion.tsx';
import { ProofCta } from '../../components/intro/ProofCta.tsx';

interface IntroPageProps {
  onNavigate: (path: string) => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <Hero onNavigate={onNavigate} />
      <HowItWorks />
      <ComparisonTable onNavigate={onNavigate} />
      <FeaturedComparison onNavigate={onNavigate} />
      <SuperSaveTeaser onNavigate={onNavigate} />
      <TrustStrip />
      <CategoryTiles onNavigate={onNavigate} />
      <FaqAccordion />
      <ProofCta onNavigate={onNavigate} />
    </div>
  );
};
