import React from 'react';
import { ShieldIcon } from './common/ShieldIcon';

export const Hero = () => {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <h1>Master the <em>Network.</em><br/>Ace the Exam.</h1>
          <p>A comprehensive CCNA 200-301 preparation platform. Study six core domains, practice with real exam questions, and simulate live network topologies.</p>
          <div className="hero-badges" role="list">
            <span className="hero-badge" role="listitem" aria-label="Six study domains available">6 Domains</span>
            <span className="hero-badge" role="listitem" aria-label="Over 12 practice questions">12+ Questions</span>
            <span className="hero-badge" role="listitem" aria-label="Interactive network lab">Network Lab</span>
            <span className="hero-badge" role="listitem" aria-label="Track your progress">Progress Tracking</span>
          </div>
        </div>
        <div className="hero-emblem" aria-hidden="true">
          <ShieldIcon size={140} opacity={0.22} />
        </div>
      </div>
    </header>
  );
};
