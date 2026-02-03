import React from 'react';

export const DomainList = ({ domains, activeCategory, onSelect }) => {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Domains</h3>
      </div>
      <div className="domain-list" role="navigation" aria-label="Study domains">
        {Object.entries(domains).map(([key, value], i) => (
          <button
            key={key}
            className={`domain-btn${activeCategory === key ? ' active' : ''}`}
            onClick={() => onSelect(key)}
            aria-current={activeCategory === key ? 'page' : undefined}
            aria-label={`${value.title} - Domain ${i + 1}`}
          >
            <span className="d-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {value.title}
          </button>
        ))}
      </div>
    </div>
  );
};
