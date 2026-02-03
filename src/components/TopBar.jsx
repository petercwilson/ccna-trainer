import React from 'react';
import { ShieldIcon } from './common/ShieldIcon';

const navItems = [
  { id: 'study', label: 'Study' },
  { id: 'practice', label: 'Quiz' },
  { id: 'lab', label: 'Network Lab' },
  { id: 'progress', label: 'Stats' }
];

export const TopBar = ({ activeTab, onTabChange }) => {
  return (
    <>
      <nav className="topbar" role="navigation" aria-label="Main navigation">
        <div className="topbar-inner">
          <div className="topbar-logo">
            <ShieldIcon size={38} />
            <div className="topbar-logo-text">
              CCNA Trainer<span>Certification Preparation</span>
            </div>
          </div>
          <div className="topbar-nav" role="tablist">
            {navItems.map(nav => (
              <button
                key={nav.id}
                role="tab"
                aria-selected={activeTab === nav.id}
                aria-controls={`${nav.id}-panel`}
                id={`${nav.id}-tab`}
                className={activeTab === nav.id ? 'active' : ''}
                onClick={() => onTabChange(nav.id)}
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="gold-stripe" role="presentation" aria-hidden="true" />
    </>
  );
};
