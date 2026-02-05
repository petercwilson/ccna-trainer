import React from 'react';
import type { DomainListProps } from '../../types';

export const DomainList: React.FC<DomainListProps> = ({ domains, activeCategory, onSelect }) => {
  return (
    <div className="bg-navy-mid border border-navy rounded-lg overflow-hidden">
      <div className="bg-navy-lite border-b border-navy px-6 py-4">
        <h3 className="text-xl font-semibold text-text">Domains</h3>
      </div>
      <div
        className="flex flex-col"
        role="navigation"
        aria-label="Study domains"
      >
        {Object.entries(domains).map(([key, value], i) => (
          <button
            key={key}
            className={`flex items-center gap-3 px-6 py-4 text-left transition-colors border-b border-navy last:border-0 ${
              activeCategory === key
                ? 'bg-navy-lite text-gold'
                : 'hover:bg-navy-dark text-text'
            }`}
            onClick={() => onSelect(key)}
            aria-current={activeCategory === key ? 'page' : undefined}
            aria-label={`${value.title} - Domain ${i + 1}`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                activeCategory === key
                  ? 'bg-gold text-navy-dark'
                  : 'bg-navy-dark text-text-muted'
              }`}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-medium">{value.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
