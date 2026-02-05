import React, { useState, useRef, useCallback } from 'react';
import { DeviceIcon } from '../common/DeviceIcon';
import type { TopologyCanvasProps, DeviceType, Device } from '../../types';

type Mode = 'select' | 'router' | 'switch' | 'pc' | 'server' | 'cable';

/**
 * Canvas for building network topologies
 * Supports drag-and-drop device placement and cable connections
 */
export const TopologyCanvas: React.FC<TopologyCanvasProps> = ({
  devices,
  connections,
  packets,
  onDeviceClick,
  onDeviceAdd,
  onDeviceDelete,
  onConnect,
  selectedDevice
}) => {
  const [mode, setMode] = useState<Mode>('select');
  const [cableStart, setCableStart] = useState<Device | null>(null);
  const [draggedDevice, setDraggedDevice] = useState<Device | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<SVGSVGElement>(null);

  // Handle canvas click for adding devices
  const handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (mode === 'select' || mode === 'cable') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onDeviceAdd(mode as DeviceType, { x, y });
    setMode('select'); // Return to select mode after adding
  }, [mode, onDeviceAdd]);

  // Handle device drag start
  const handleDeviceDragStart = useCallback((e: React.MouseEvent, device: Device) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left - device.x;
    const offsetY = e.clientY - rect.top - device.y;

    setDraggedDevice(device);
    setDragOffset({ x: offsetX, y: offsetY });
    e.stopPropagation();
  }, []);

  // Handle device drag
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedDevice) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    // Update device position (would need to be passed up to parent)
    // For now, just visual feedback
  }, [draggedDevice, dragOffset]);

  // Handle device drag end
  const handleCanvasMouseUp = useCallback(() => {
    setDraggedDevice(null);
  }, []);

  // Handle device click for cable mode or selection
  const handleDeviceClickInternal = useCallback((device: Device, e: React.MouseEvent) => {
    e.stopPropagation();

    if (mode === 'cable') {
      if (!cableStart) {
        setCableStart(device);
      } else if (cableStart.id !== device.id) {
        // Connect devices using first available ports
        const port1 = cableStart.interfaces.findIndex(i => i.status === 'down');
        const port2 = device.interfaces.findIndex(i => i.status === 'down');

        if (port1 !== -1 && port2 !== -1) {
          onConnect(cableStart.id, device.id, port1, port2);
        }

        setCableStart(null);
        setMode('select');
      }
    } else {
      onDeviceClick(device);
    }
  }, [mode, cableStart, onConnect, onDeviceClick]);

  // Draw connection lines
  const renderConnections = () => {
    return connections.map(conn => {
      const from = devices.find(d => d.id === conn.from);
      const to = devices.find(d => d.id === conn.to);

      if (!from || !to) return null;

      return (
        <line
          key={conn.id}
          x1={from.x + 30}
          y1={from.y + 30}
          x2={to.x + 30}
          y2={to.y + 30}
          className="stroke-gold opacity-60"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      );
    });
  };

  // Draw packet animations
  const renderPackets = () => {
    return packets.map(packet => {
      if (packet.currentStep >= packet.path.length) return null;

      const deviceId = packet.path[packet.currentStep];
      const device = devices.find(d => d.id === deviceId);

      if (!device) return null;

      return (
        <circle
          key={packet.id}
          cx={device.x + 30}
          cy={device.y + 30}
          r="8"
          className="fill-success opacity-80"
        >
          <animate
            attributeName="r"
            values="8;12;8"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 bg-navy-mid border border-navy rounded-lg p-3"
        role="toolbar"
        aria-label="Device tools"
      >
        <button
          className={`px-3 py-1.5 rounded transition-colors text-sm font-medium ${
            mode === 'select'
              ? 'bg-gold text-navy-dark'
              : 'bg-transparent text-text hover:bg-navy-lite border border-navy'
          }`}
          onClick={() => setMode('select')}
          aria-label="Select mode"
          title="Select Mode"
        >
          Select
        </button>

        <div className="w-px h-6 bg-navy" />

        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm font-medium ${
            mode === 'router'
              ? 'bg-gold text-navy-dark'
              : 'bg-transparent text-text hover:bg-navy-lite border border-navy'
          }`}
          onClick={() => setMode('router')}
          aria-label="Add router"
          title="Add Router"
        >
          <DeviceIcon type="router" size={20} />
          <span>Router</span>
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm font-medium ${
            mode === 'switch'
              ? 'bg-gold text-navy-dark'
              : 'bg-transparent text-text hover:bg-navy-lite border border-navy'
          }`}
          onClick={() => setMode('switch')}
          aria-label="Add switch"
          title="Add Switch"
        >
          <DeviceIcon type="switch" size={20} />
          <span>Switch</span>
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm font-medium ${
            mode === 'pc'
              ? 'bg-gold text-navy-dark'
              : 'bg-transparent text-text hover:bg-navy-lite border border-navy'
          }`}
          onClick={() => setMode('pc')}
          aria-label="Add PC"
          title="Add PC"
        >
          <DeviceIcon type="pc" size={20} />
          <span>PC</span>
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm font-medium ${
            mode === 'server'
              ? 'bg-gold text-navy-dark'
              : 'bg-transparent text-text hover:bg-navy-lite border border-navy'
          }`}
          onClick={() => setMode('server')}
          aria-label="Add server"
          title="Add Server"
        >
          <DeviceIcon type="server" size={20} />
          <span>Server</span>
        </button>

        <div className="w-px h-6 bg-navy" />

        <button
          className={`px-3 py-1.5 rounded transition-colors text-sm font-medium ${
            mode === 'cable'
              ? 'bg-gold text-navy-dark'
              : 'bg-transparent text-text hover:bg-navy-lite border border-navy'
          }`}
          onClick={() => { setMode('cable'); setCableStart(null); }}
          aria-label="Cable connection mode"
          title="Connect Devices"
        >
          Cable
        </button>

        {mode !== 'select' && (
          <div className="ml-auto text-sm text-text-muted italic">
            {mode === 'cable' ? 'Click two devices to connect' : 'Click on canvas to place device'}
          </div>
        )}
      </div>

      {/* Canvas */}
      <svg
        ref={canvasRef}
        className="w-full h-[600px] bg-navy-dark border border-navy rounded-lg"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        role="application"
        aria-label="Network topology canvas"
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connection lines */}
        <g className="connections">
          {renderConnections()}
        </g>

        {/* Packet animations */}
        <g className="packets">
          {renderPackets()}
        </g>

        {/* Cable preview */}
        {mode === 'cable' && cableStart && (
          <line
            x1={cableStart.x + 30}
            y1={cableStart.y + 30}
            x2={cableStart.x + 30}
            y2={cableStart.y + 30}
            className="stroke-gold opacity-40"
            strokeWidth="2"
            strokeDasharray="5,5"
          >
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        )}

        {/* Devices */}
        <g className="devices">
          {devices.map(device => (
            <g
              key={device.id}
              transform={`translate(${device.x}, ${device.y})`}
              className={`svg-device ${selectedDevice?.id === device.id ? 'selected' : ''}`}
              onClick={(e) => handleDeviceClickInternal(device, e)}
              onMouseDown={(e) => handleDeviceDragStart(e, device)}
              style={{ cursor: mode === 'select' ? 'pointer' : 'default' }}
            >
              {/* Selection highlight */}
              {selectedDevice?.id === device.id && (
                <circle
                  cx="30"
                  cy="30"
                  r="35"
                  fill="none"
                  className="stroke-gold opacity-60"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="r"
                    values="35;38;35"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Device icon */}
              <g transform="translate(30, 30) scale(2.5)">
                {device.type === 'router' && (
                  <>
                    <rect x="-12" y="-5" width="24" height="10" rx="2" stroke="#f2c434" strokeWidth="2.5" fill="#004d73"/>
                    <circle cx="-7" cy="0" r="2" fill="#f2c434"/>
                    <circle cx="0" cy="0" r="2" fill="#f2c434"/>
                    <circle cx="7" cy="0" r="2" fill="#1ea86a"/>
                  </>
                )}
                {device.type === 'switch' && (
                  <>
                    <rect x="-12" y="-4" width="24" height="8" rx="2" stroke="#f2c434" strokeWidth="2.5" fill="#004d73"/>
                    <rect x="-9" y="-1.5" width="2" height="3" rx=".8" fill="#f2c434"/>
                    <rect x="-5" y="-1.5" width="2" height="3" rx=".8" fill="#f2c434"/>
                    <rect x="-1" y="-1.5" width="2" height="3" rx=".8" fill="#f2c434"/>
                    <rect x="3" y="-1.5" width="2" height="3" rx=".8" fill="#f2c434"/>
                    <rect x="7" y="-1.5" width="2" height="3" rx=".8" fill="#7a95b0"/>
                  </>
                )}
                {device.type === 'pc' && (
                  <>
                    <rect x="-10" y="-8" width="20" height="14" rx="2" stroke="#f2c434" strokeWidth="2.5" fill="#004d73"/>
                    <rect x="-8" y="-6" width="16" height="10" rx=".8" fill="#0076a9"/>
                    <rect x="-3" y="6" width="6" height="3" fill="#7a95b0"/>
                    <rect x="-6" y="9" width="12" height="2.8" rx="1.4" stroke="#f2c434" strokeWidth="2" fill="#004d73"/>
                    <circle cx="0" cy="-2" r="2.5" fill="#f2c434" opacity="0.8"/>
                  </>
                )}
                {device.type === 'server' && (
                  <>
                    <rect x="-7" y="-12" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="2" fill="#004d73"/>
                    <rect x="-7" y="-3" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="2" fill="#004d73"/>
                    <rect x="-7" y="6" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="2" fill="#004d73"/>
                    <circle cx="-3" cy="-9" r="1.5" fill="#1ea86a"/>
                    <circle cx="-3" cy="0" r="1.5" fill="#1ea86a"/>
                    <circle cx="-3" cy="9" r="1.5" fill="#e8a012"/>
                  </>
                )}
              </g>

              {/* Device label */}
              <text
                x="30"
                y="70"
                textAnchor="middle"
                className="fill-text text-xs font-medium"
              >
                {device.hostname}
              </text>

              {/* Interface status indicators */}
              {device.interfaces.map((iface, idx) => (
                <circle
                  key={idx}
                  cx={30 + (idx - device.interfaces.length / 2 + 0.5) * 12}
                  cy="55"
                  r="3"
                  className={iface.status === 'up' ? 'fill-success opacity-80' : 'fill-text-muted opacity-50'}
                />
              ))}

              {/* Delete button (on hover in select mode) */}
              {mode === 'select' && (
                <g
                  className="device-delete opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeviceDelete(device.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <circle cx="50" cy="10" r="8" className="fill-danger" />
                  <text x="50" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    ×
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* Canvas info */}
      <div className="flex items-center gap-4 text-sm text-text-muted px-4">
        <span>{devices.length} devices</span>
        <span>{connections.length} connections</span>
        {mode === 'cable' && cableStart && (
          <span className="text-gold">Cable from: {cableStart.hostname}</span>
        )}
      </div>
    </div>
  );
};
