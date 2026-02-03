import React, { useState } from 'react';
import { topoDevices, topoLinks } from '../../data/topology';
import { DeviceIcon } from '../common/DeviceIcon';

export const NetworkLab = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const W = 1000, H = 440;
  const px = p => W * p / 100;
  const py = p => H * p / 100;

  const handleDeviceClick = (deviceId) => {
    setSelectedDevice(selectedDevice === deviceId ? null : deviceId);
  };

  const handleKeyDown = (e, deviceId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDeviceClick(deviceId);
    }
  };

  return (
    <>
      <div className="section-hdr">
        <h2>Network Lab</h2>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Topology Simulator — Click a Device</h3>
        </div>
        <div className="card-body">
          <div className="lab-canvas" role="application" aria-label="Network topology simulator">
            <svg
              className="topo-svg"
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
                const x1 = px(f.x), y1 = py(f.y), x2 = px(t.x), y2 = py(t.y);
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lg1)" strokeWidth="2" strokeDasharray="8 4" filter="url(#glow)"/>
                    <rect x={mx - 22} y={my - 10} width="44" height="20" rx="3" fill="#0a2744" stroke="#1a3555" strokeWidth="1"/>
                    <text x={mx} y={my + 5} textAnchor="middle" className="topo-link-label">{lk.label}</text>
                  </g>
                );
              })}
            </svg>
            {topoDevices.map(device => (
              <div
                key={device.id}
                className={`device${selectedDevice === device.id ? ' sel' : ''}`}
                style={{ left: `${device.x}%`, top: `${device.y}%` }}
                onClick={() => handleDeviceClick(device.id)}
                onKeyDown={(e) => handleKeyDown(e, device.id)}
                role="button"
                tabIndex="0"
                aria-pressed={selectedDevice === device.id}
                aria-label={`${device.label} - ${device.type}`}
              >
                <div className="dv-wrap">
                  <DeviceIcon type={device.type} />
                </div>
                <div className="dv-label">{device.label}</div>
              </div>
            ))}
          </div>
          {selectedDevice !== null && (() => {
            const device = topoDevices.find(d => d.id === selectedDevice);
            return (
              <div className="cfg-panel" role="region" aria-label={`Configuration for ${device.label}`}>
                <div className="cfg-panel-head">
                  <span>{device.label} — Configuration</span>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    aria-label={`Close ${device.label} configuration`}
                  >
                    &times;
                  </button>
                </div>
                <pre className="cfg-code" aria-label="Device configuration">{device.config}</pre>
              </div>
            );
          })()}
          <div className="palette" role="toolbar" aria-label="Device types">
            {['Router', 'Switch', 'PC', 'Server'].map(type => (
              <div key={type} className="palette-item" role="button" tabIndex="0" aria-label={`Add ${type}`}>
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
