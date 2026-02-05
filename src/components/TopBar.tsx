import { ShieldIcon } from './common/ShieldIcon';
import type { NavItem, TopBarProps } from '../types';

const navItems: NavItem[] = [
  { id: 'study', label: 'Study' },
  { id: 'practice', label: 'Quiz' },
  { id: 'lab', label: 'Network Lab' },
  { id: 'simulator', label: 'Packet Tracer' },
  { id: 'progress', label: 'Stats' }
];

export const TopBar = ({ activeTab, onTabChange }: TopBarProps) => {
  return (
    <>
      {/* Main Navigation Bar */}
      <nav
        className="sticky top-0 z-50 bg-navy-dark border-b border-navy-lite"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-screen-xl mx-auto px-7 h-17 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3.5">
            <ShieldIcon size={38} />
            <div className="font-liberator">
              <div className="text-xl font-bold text-text uppercase tracking-wider leading-none">
                CCNA Trainer
              </div>
              <div className="text-[10px] font-light tracking-[3px] text-text-muted mt-0.5">
                Certification Preparation
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-0.5" role="tablist">
            {navItems.map(nav => (
              <button
                key={nav.id}
                role="tab"
                aria-selected={activeTab === nav.id}
                aria-controls={`${nav.id}-panel`}
                id={`${nav.id}-tab`}
                onClick={() => onTabChange(nav.id)}
                className={`
                  px-4 py-2 font-liberator text-sm font-medium uppercase tracking-[1.8px]
                  transition-all duration-200 cursor-pointer
                  ${activeTab === nav.id
                    ? 'text-gold bg-navy-lite border-b-2 border-gold'
                    : 'text-text-muted hover:text-text hover:bg-navy-lite/50'
                  }
                `}
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Gold accent stripe */}
      <div
        className="h-0.5 bg-gradient-to-r from-gold via-yellow-400 to-gold opacity-80"
        role="presentation"
        aria-hidden="true"
      />
    </>
  );
};
