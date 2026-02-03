import React, { useState, useRef, useCallback } from 'react';
import { DeviceIcon } from '../common/DeviceIcon';

/**
 * Canvas for building network topologies
 * Supports drag-and-drop device placement and cable connections
 */
export const TopologyCanvas = ({
  devices,
  connections,
  packets,
  onDeviceClick,
  onDeviceAdd,
  onDeviceDelete,
  onConnect,
  selectedDevice
}) => {
  const [mode, setMode] = useState('select'); // 'select', 'router', 'switch', 'pc', 'server', 'cable'
  const [cableStart, setCableStart] = useState(null);
  const [draggedDevice, setDraggedDevice] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Handle canvas click for adding devices
  const handleCanvasClick = useCallback((e) => {
    if (mode === 'select' || mode === 'cable') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onDeviceAdd(mode, { x, y });
    setMode('select'); // Return to select mode after adding
  }, [mode, onDeviceAdd]);

  // Handle device drag start
  const handleDeviceDragStart = useCallback((e, device) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - device.x;
    const offsetY = e.clientY - rect.top - device.y;

    setDraggedDevice(device);
    setDragOffset({ x: offsetX, y: offsetY });
    e.stopPropagation();
  }, []);

  // Handle device drag
  const handleCanvasMouseMove = useCallback((e) => {
    if (!draggedDevice) return;

    const rect = canvasRef.current.getBoundingClientRect();
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
  const handleDeviceClickInternal = useCallback((device, e) => {
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
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.6"
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
          fill="var(--success)"
          opacity="0.8"
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
    <div className="topology-canvas-container">
      {/* Toolbar */}
      <div className="pt-toolbar" role="toolbar" aria-label="Device tools">
        <button
          className={`btn btn-sm ${mode === 'select' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMode('select')}
          aria-label="Select mode"
          title="Select Mode"
        >
          <span>Select</span>
        </button>

        <div className="toolbar-divider" />

        <button
          className={`btn btn-sm btn-icon ${mode === 'router' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMode('router')}
          aria-label="Add router"
          title="Add Router"
        >
          <DeviceIcon type="router" size={20} />
          <span className="btn-label">Router</span>
        </button>

        <button
          className={`btn btn-sm btn-icon ${mode === 'switch' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMode('switch')}
          aria-label="Add switch"
          title="Add Switch"
        >
          <DeviceIcon type="switch" size={20} />
          <span className="btn-label">Switch</span>
        </button>

        <button
          className={`btn btn-sm btn-icon ${mode === 'pc' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMode('pc')}
          aria-label="Add PC"
          title="Add PC"
        >
          <DeviceIcon type="pc" size={20} />
          <span className="btn-label">PC</span>
        </button>

        <button
          className={`btn btn-sm btn-icon ${mode === 'server' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMode('server')}
          aria-label="Add server"
          title="Add Server"
        >
          <DeviceIcon type="server" size={20} />
          <span className="btn-label">Server</span>
        </button>

        <div className="toolbar-divider" />

        <button
          className={`btn btn-sm ${mode === 'cable' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setMode('cable'); setCableStart(null); }}
          aria-label="Cable connection mode"
          title="Connect Devices"
        >
          <span>Cable</span>
        </button>

        {mode !== 'select' && (
          <div className="toolbar-hint">
            {mode === 'cable' ? 'Click two devices to connect' : 'Click on canvas to place device'}
          </div>
        )}
      </div>

      {/* Canvas */}
      <svg
        ref={canvasRef}
        className="topology-canvas"
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
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.4"
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
              className={`device ${selectedDevice?.id === device.id ? 'selected' : ''}`}
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
                  stroke="var(--accent)"
                  strokeWidth="2"
                  opacity="0.6"
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
              <foreignObject x="5" y="5" width="50" height="50">
                <div className="device-icon-wrapper">
                  <DeviceIcon type={device.type} size={40} />
                </div>
              </foreignObject>

              {/* Device label */}
              <text
                x="30"
                y="70"
                textAnchor="middle"
                fill="var(--text)"
                fontSize="12"
                fontWeight="500"
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
                  fill={iface.status === 'up' ? 'var(--success)' : 'var(--muted)'}
                  opacity="0.8"
                />
              ))}

              {/* Delete button (on hover in select mode) */}
              {mode === 'select' && (
                <g
                  className="device-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeviceDelete(device.id);
                  }}
                  style={{ cursor: 'pointer', opacity: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  <circle cx="50" cy="10" r="8" fill="var(--danger)" />
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
      <div className="canvas-info">
        <span>{devices.length} devices</span>
        <span>{connections.length} connections</span>
        {mode === 'cable' && cableStart && (
          <span className="text-accent">Cable from: {cableStart.hostname}</span>
        )}
      </div>
    </div>
  );
};
