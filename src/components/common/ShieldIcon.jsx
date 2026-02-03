import React from 'react';

export const ShieldIcon = ({ size = 56, opacity = 1 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 56 56"
    fill="none"
    opacity={opacity}
    role="img"
    aria-label="CCNA Certification Shield"
  >
    <path d="M28 4L6 14v16c0 12.5 9.5 23.5 22 26 12.5-2.5 22-13.5 22-26V14L28 4z" stroke="#f2c434" strokeWidth="2" fill="none"/>
    <path d="M28 12L12 19v11c0 9 7 17.5 16 19.5 9-2 16-10.5 16-19.5V19L28 12z" stroke="#f2c434" strokeWidth="1" fill="rgba(242,196,52,.06)"/>
    <text x="28" y="33" textAnchor="middle" fill="#f2c434" fontFamily="Liberator,sans-serif" fontSize="16" fontWeight="700">CC</text>
    <text x="28" y="41" textAnchor="middle" fill="#7a95b0" fontFamily="Share Tech Mono,monospace" fontSize="6.5">CCNA</text>
  </svg>
);
