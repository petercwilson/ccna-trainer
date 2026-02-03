import React from 'react';

/**
 * Packet animation visualization panel
 * Shows packet details and path during transmission
 */
export const PacketAnimation = ({ packets, devices }) => {
  if (packets.length === 0) {
    return null;
  }

  return (
    <div className="packet-animation-panel" role="status" aria-live="polite">
      <h4>Packet Transmission</h4>
      {packets.map(packet => {
        const currentDevice = devices.find(d => d.id === packet.path[packet.currentStep]);
        const progress = ((packet.currentStep + 1) / packet.path.length) * 100;

        return (
          <div key={packet.id} className="packet-info">
            <div className="packet-header">
              <span className="packet-type">{packet.type.toUpperCase()}</span>
              <span className="packet-dest">→ {packet.destination}</span>
            </div>

            <div className="packet-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <span className="progress-text">
                Hop {packet.currentStep + 1} of {packet.path.length}
              </span>
            </div>

            {currentDevice && (
              <div className="packet-current">
                <span className="packet-label">Current Location:</span>
                <span className="packet-device">{currentDevice.hostname}</span>
              </div>
            )}

            <div className="packet-path">
              <span className="packet-label">Path:</span>
              <div className="packet-hops">
                {packet.path.map((deviceId, idx) => {
                  const device = devices.find(d => d.id === deviceId);
                  const isCurrent = idx === packet.currentStep;
                  const isPast = idx < packet.currentStep;

                  return (
                    <React.Fragment key={idx}>
                      <span
                        className={`packet-hop ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
                      >
                        {device?.hostname || 'Unknown'}
                      </span>
                      {idx < packet.path.length - 1 && (
                        <span className="packet-arrow">→</span>
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
