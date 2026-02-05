import React from 'react';
import type { PacketAnimationProps } from '../../types';

/**
 * Packet animation visualization panel
 * Shows packet details and path during transmission
 */
export const PacketAnimation: React.FC<PacketAnimationProps> = ({ packets, devices }) => {
  if (packets.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-navy-mid border border-navy rounded-lg p-6 space-y-4"
      role="status"
      aria-live="polite"
    >
      <h4 className="text-lg font-semibold text-gold">Packet Transmission</h4>
      {packets.map(packet => {
        const currentDevice = devices.find(d => d.id === packet.path[packet.currentStep]);
        const progress = ((packet.currentStep + 1) / packet.path.length) * 100;

        return (
          <div key={packet.id} className="bg-navy-dark rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-navy-lite text-gold text-xs font-mono rounded uppercase font-semibold">
                {packet.type}
              </span>
              <span className="text-text text-sm">
                → {packet.destination}
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-navy-lite rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="text-text-muted text-xs">
                Hop {packet.currentStep + 1} of {packet.path.length}
              </span>
            </div>

            {currentDevice && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-muted">Current Location:</span>
                <span className="text-gold font-semibold">{currentDevice.hostname}</span>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-text-muted text-sm">Path:</span>
              <div className="flex items-center flex-wrap gap-2">
                {packet.path.map((deviceId, idx) => {
                  const device = devices.find(d => d.id === deviceId);
                  const isCurrent = idx === packet.currentStep;
                  const isPast = idx < packet.currentStep;

                  return (
                    <React.Fragment key={idx}>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isCurrent
                            ? 'bg-gold text-navy-dark'
                            : isPast
                            ? 'bg-success text-text'
                            : 'bg-navy-lite text-text-muted'
                        }`}
                      >
                        {device?.hostname || 'Unknown'}
                      </span>
                      {idx < packet.path.length - 1 && (
                        <span className="text-text-muted">→</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
