import React, { useState, useCallback } from 'react';
import { TopologyCanvas } from './TopologyCanvas';
import { DeviceCLI } from './DeviceCLI';
import { PacketAnimation } from './PacketAnimation';
import { NetworkSimulator } from './NetworkSimulator';

/**
 * Packet Tracer-like network simulator component
 * Allows building topologies, configuring devices, and testing connectivity
 */
export const PacketTracer = () => {
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showCLI, setShowCLI] = useState(false);
  const [packets, setPackets] = useState([]);
  const [simulator] = useState(() => new NetworkSimulator());

  // Add device to topology
  const addDevice = useCallback((type, position) => {
    console.log('Adding device:', type, 'at position:', position);
    const newDevice = {
      id: `${type}-${Date.now()}`,
      type,
      x: position.x,
      y: position.y,
      hostname: `${type}${devices.length + 1}`,
      interfaces: type === 'router' ? [
        { name: 'GigabitEthernet0/0', ip: '', subnet: '', status: 'down' },
        { name: 'GigabitEthernet0/1', ip: '', subnet: '', status: 'down' }
      ] : type === 'switch' ? [
        { name: 'FastEthernet0/1', vlan: 1, status: 'down' },
        { name: 'FastEthernet0/2', vlan: 1, status: 'down' },
        { name: 'FastEthernet0/3', vlan: 1, status: 'down' },
        { name: 'FastEthernet0/4', vlan: 1, status: 'down' }
      ] : [
        { name: 'Ethernet0', ip: '', subnet: '', gateway: '', status: 'down' }
      ],
      config: {
        runningConfig: [],
        startupConfig: []
      }
    };

    setDevices(prev => {
      const updated = [...prev, newDevice];
      console.log('Devices after add:', updated.length, updated);
      return updated;
    });
    simulator.addDevice(newDevice);
    return newDevice;
  }, [devices.length, simulator]);

  // Connect two devices
  const connectDevices = useCallback((device1Id, device2Id, port1, port2) => {
    const connection = {
      id: `conn-${Date.now()}`,
      from: device1Id,
      to: device2Id,
      fromPort: port1,
      toPort: port2
    };

    setConnections(prev => [...prev, connection]);
    simulator.addConnection(connection);

    // Update interface status to 'up'
    setDevices(prev => prev.map(d => {
      if (d.id === device1Id) {
        return {
          ...d,
          interfaces: d.interfaces.map((iface, idx) =>
            idx === port1 ? { ...iface, status: 'up' } : iface
          )
        };
      }
      if (d.id === device2Id) {
        return {
          ...d,
          interfaces: d.interfaces.map((iface, idx) =>
            idx === port2 ? { ...iface, status: 'up' } : iface
          )
        };
      }
      return d;
    }));
  }, [simulator]);

  // Delete device
  const deleteDevice = useCallback((deviceId) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setConnections(prev => prev.filter(c => c.from !== deviceId && c.to !== deviceId));
    simulator.removeDevice(deviceId);
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null);
      setShowCLI(false);
    }
  }, [selectedDevice, simulator]);

  // Select device and show CLI
  const handleDeviceClick = useCallback((device) => {
    setSelectedDevice(device);
    setShowCLI(true);
  }, []);

  // Execute CLI command
  const executeCommand = useCallback((command) => {
    if (!selectedDevice) return { output: 'No device selected', error: true };

    const result = simulator.executeCommand(selectedDevice.id, command);

    // Update device state if configuration changed
    if (result.configChanged) {
      setDevices(prev => prev.map(d =>
        d.id === selectedDevice.id ? result.updatedDevice : d
      ));
      setSelectedDevice(result.updatedDevice);
    }

    return result;
  }, [selectedDevice, simulator]);

  // Send packet for visualization
  const sendPacket = useCallback((sourceId, destIp, type = 'icmp') => {
    const path = simulator.findPath(sourceId, destIp);

    if (path.length > 0) {
      const packet = {
        id: `packet-${Date.now()}`,
        type,
        source: sourceId,
        destination: destIp,
        path,
        currentStep: 0
      };

      setPackets(prev => [...prev, packet]);

      // Animate packet movement
      const animatePacket = () => {
        setPackets(prev => prev.map(p => {
          if (p.id === packet.id) {
            if (p.currentStep < p.path.length - 1) {
              return { ...p, currentStep: p.currentStep + 1 };
            } else {
              // Remove packet after animation
              setTimeout(() => {
                setPackets(prev => prev.filter(pk => pk.id !== packet.id));
              }, 1000);
              return p;
            }
          }
          return p;
        }));
      };

      // Animate every 500ms
      const interval = setInterval(() => {
        animatePacket();
      }, 500);

      setTimeout(() => clearInterval(interval), path.length * 500 + 1000);
    }

    return path;
  }, [simulator]);

  // Load sample topology
  const loadSampleTopology = useCallback(() => {
    // Clear existing
    setDevices([]);
    setConnections([]);
    setSelectedDevice(null);
    setShowCLI(false);
    setPackets([]);
    simulator.clear();

    // Create sample network
    const router1 = addDevice('router', { x: 300, y: 200 });
    const switch1 = addDevice('switch', { x: 150, y: 350 });
    const switch2 = addDevice('switch', { x: 450, y: 350 });
    const pc1 = addDevice('pc', { x: 50, y: 500 });
    const pc2 = addDevice('pc', { x: 250, y: 500 });
    const pc3 = addDevice('pc', { x: 550, y: 500 });

    // Create connections
    setTimeout(() => {
      connectDevices(router1.id, switch1.id, 0, 0);
      connectDevices(router1.id, switch2.id, 1, 0);
      connectDevices(switch1.id, pc1.id, 1, 0);
      connectDevices(switch1.id, pc2.id, 2, 0);
      connectDevices(switch2.id, pc3.id, 1, 0);
    }, 100);
  }, [addDevice, connectDevices, simulator]);

  // Clear topology
  const clearTopology = useCallback(() => {
    setDevices([]);
    setConnections([]);
    setSelectedDevice(null);
    setShowCLI(false);
    setPackets([]);
    simulator.clear();
  }, [simulator]);

  return (
    <div className="packet-tracer">
      <div className="section-hdr">
        <h2>Packet Tracer Simulator</h2>
        <div className="pt-controls">
          <button className="btn btn-sm" onClick={loadSampleTopology}>
            Load Sample
          </button>
          <button className="btn btn-sm btn-outline" onClick={clearTopology}>
            Clear All
          </button>
        </div>
      </div>

      <div className="pt-workspace">
        <div className="pt-main">
          <TopologyCanvas
            devices={devices}
            connections={connections}
            packets={packets}
            onDeviceClick={handleDeviceClick}
            onDeviceAdd={addDevice}
            onDeviceDelete={deleteDevice}
            onConnect={connectDevices}
            selectedDevice={selectedDevice}
          />
          <PacketAnimation packets={packets} devices={devices} />
        </div>

        {showCLI && selectedDevice && (
          <DeviceCLI
            device={selectedDevice}
            onExecuteCommand={executeCommand}
            onClose={() => setShowCLI(false)}
            onSendPacket={sendPacket}
          />
        )}
      </div>

      <div className="pt-instructions">
        <h3>Quick Start</h3>
        <ul>
          <li><strong>Add Device:</strong> Click a device icon in the toolbar, then click on canvas</li>
          <li><strong>Connect Devices:</strong> Click "Cable" button, then click two devices to connect</li>
          <li><strong>Configure:</strong> Click a device to open CLI terminal</li>
          <li><strong>Test Connectivity:</strong> Use <code>ping</code> command in CLI</li>
        </ul>
      </div>
    </div>
  );
};
