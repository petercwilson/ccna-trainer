import React from 'react';
import type { DomainListProps } from '../../types';

export const DomainList: React.FC<DomainListProps> = ({ domains, activeCategory, onSelect }) => {
  return (
    <div
      className="domain-list"
      role="navigation"
      aria-label="Study domains"
    >
      {Object.entries(domains).map(([key, value], i) => (
        <button
          key={key}
          className={`domain-btn ${activeCategory === key ? 'active' : ''}`}
          onClick={() => onSelect(key)}
          aria-current={activeCategory === key ? 'page' : undefined}
          aria-label={`${value.title} - Domain ${i + 1}`}
        >
          <span className="d-num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span>{value.title}</span>
        </button>
      ))}
    </div>
  );
};
