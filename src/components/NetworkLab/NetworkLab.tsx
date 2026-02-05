import React, { useState } from 'react';
import { topoDevices, topoLinks } from '../../data/topology';
import { DeviceIcon } from '../common/DeviceIcon';

export const NetworkLab: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const W = 1000, H = 440;
  const px = (p: number) => W * p / 100;
  const py = (p: number) => H * p / 100;

  const handleDeviceClick = (deviceId: number) => {
    setSelectedDevice(selectedDevice === deviceId ? null : deviceId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, deviceId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDeviceClick(deviceId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Network Lab</h2>
      </div>
      <div className="bg-navy-mid border border-navy rounded-lg overflow-hidden">
        <div className="bg-navy-lite border-b border-navy px-6 py-4">
          <h3 className="text-xl font-semibold text-text">Topology Simulator — Click a Device</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="relative w-full bg-navy-dark border border-navy rounded-lg overflow-hidden" role="application" aria-label="Network topology simulator">
            <svg
              className="w-full h-auto"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f2c434" stopOpacity=".5"/>
                  <stop offset="100%" stopColor="#7a95b0" stopOpacity=".4"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="b"/>
                  <feMerge>
                    <feMergeNode in="b"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {topoLinks.map((lk, i) => {
                const f = topoDevices.find(d => d.id === lk.from);
                const t = topoDevices.find(d => d.id === lk.to);
                if (!f || !t) return null;
                const x1 = px(f.x), y1 = py(f.y), x2 = px(t.x), y2 = py(t.y);
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lg1)" strokeWidth="2" strokeDasharray="8 4" filter="url(#glow)"/>
                    <rect x={mx - 22} y={my - 10} width="44" height="20" rx="3" fill="#0a2744" stroke="#1a3555" strokeWidth="1"/>
                    <text x={mx} y={my + 5} textAnchor="middle" className="fill-gold text-xs font-mono">{lk.label}</text>
                  </g>
                );
              })}
            </svg>
            {topoDevices.map(device => (
              <div
                key={device.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedDevice === device.id ? 'z-10' : ''
                }`}
                style={{ left: `${device.x}%`, top: `${device.y}%` }}
                onClick={() => handleDeviceClick(device.id)}
                onKeyDown={(e) => handleKeyDown(e, device.id)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedDevice === device.id}
                aria-label={`${device.label} - ${device.type}`}
              >
                <div
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer ${
                    selectedDevice === device.id
                      ? 'bg-navy-lite border-2 border-gold shadow-lg shadow-gold/20'
                      : 'bg-navy-mid border border-navy hover:border-gold/50'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <DeviceIcon type={device.type} />
                  </div>
                  <div className={`text-xs font-semibold ${
                    selectedDevice === device.id ? 'text-gold' : 'text-text'
                  }`}>
                    {device.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedDevice !== null && (() => {
            const device = topoDevices.find(d => d.id === selectedDevice);
            if (!device) return null;
            return (
              <div className="bg-navy-dark border border-navy rounded-lg overflow-hidden" role="region" aria-label={`Configuration for ${device.label}`}>
                <div className="flex items-center justify-between bg-navy-lite border-b border-navy px-4 py-3">
                  <span className="text-text font-semibold">{device.label} — Configuration</span>
                  <button
                    className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-danger transition-colors text-xl leading-none"
                    onClick={() => setSelectedDevice(null)}
                    aria-label={`Close ${device.label} configuration`}
                  >
                    &times;
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-text-muted overflow-x-auto whitespace-pre-wrap" aria-label="Device configuration">{device.config}</pre>
              </div>
            );
          })()}
          <div className="flex items-center gap-3 bg-navy-dark border border-navy rounded-lg p-4" role="toolbar" aria-label="Device types">
            {['Router', 'Switch', 'PC', 'Server'].map(type => (
              <div
                key={type}
                className="px-4 py-2 bg-navy-mid hover:bg-navy-lite border border-navy rounded transition-colors cursor-pointer text-text text-sm font-medium"
                role="button"
                tabIndex={0}
                aria-label={`Add ${type}`}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
