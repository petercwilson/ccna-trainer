import React from 'react';

export const DeviceIcon = ({ type }) => {
  const getLabel = () => {
    switch(type) {
      case 'router': return 'Router';
      case 'switch': return 'Switch';
      case 'pc': return 'PC';
      case 'server': return 'Server';
      default: return 'Network Device';
    }
  };

  if (type === 'router') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" role="img" aria-label={getLabel()}>
      <rect x="3" y="9" width="22" height="10" rx="2" stroke="#f2c434" strokeWidth="1.8" fill="none"/>
      <circle cx="8" cy="14" r="2" fill="#f2c434"/><circle cx="14" cy="14" r="2" fill="#f2c434"/><circle cx="20" cy="14" r="2" fill="#1ea86a"/>
      <line x1="7" y1="9" x2="7" y2="5" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="21" y1="9" x2="21" y2="5" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="7" y1="19" x2="7" y2="23" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="21" y1="19" x2="21" y2="23" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  if (type === 'switch') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" role="img" aria-label={getLabel()}>
      <rect x="3" y="10" width="22" height="8" rx="2" stroke="#f2c434" strokeWidth="1.8" fill="none"/>
      {[6,9,12,15,18,21].map((x,i) => <rect key={i} x={x-1} y="12.5" width="2" height="5" rx=".8" fill={i<4?'#f2c434':'#7a95b0'}/>)}
      <line x1="6" y1="10" x2="6" y2="6" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="10" x2="22" y2="6" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="18" x2="6" y2="22" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="18" x2="22" y2="22" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  if (type === 'pc') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" role="img" aria-label={getLabel()}>
      <rect x="4" y="3" width="20" height="14" rx="2" stroke="#f2c434" strokeWidth="1.8" fill="none"/>
      <rect x="6" y="5" width="16" height="10" rx=".8" fill="#011839"/>
      <rect x="11" y="17" width="6" height="3" fill="#7a95b0"/>
      <rect x="8" y="20" width="12" height="2.8" rx="1.4" stroke="#f2c434" strokeWidth="1.3" fill="none"/>
      <circle cx="14" cy="9" r="2" fill="#f2c434" opacity=".6"/>
    </svg>
  );

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" role="img" aria-label={getLabel()}>
      <rect x="7" y="2" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="1.5" fill="none"/>
      <rect x="7" y="11" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="1.5" fill="none"/>
      <rect x="7" y="20" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="1.5" fill="none"/>
      <circle cx="11" cy="5" r="1.5" fill="#1ea86a"/><circle cx="11" cy="14" r="1.5" fill="#1ea86a"/><circle cx="11" cy="23" r="1.5" fill="#e8a012"/>
    </svg>
  );
};
