import React, { useState, useCallback } from 'react';
import { TopologyCanvas } from './TopologyCanvas';
import { DeviceCLI } from './DeviceCLI';
import { PacketAnimation } from './PacketAnimation';
import { NetworkSimulator } from './NetworkSimulator';
import type { Device, DeviceType, Packet, Connection } from '../../types';

/**
 * Packet Tracer-like network simulator component
 * Allows building topologies, configuring devices, and testing connectivity
 */
export const PacketTracer: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showCLI, setShowCLI] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [simulator] = useState(() => new NetworkSimulator());

  // Add device to topology
  const addDevice = useCallback((type: DeviceType, position: { x: number; y: number }): Device | null => {
    let addedDevice: Device | null = null;

    setDevices(prev => {
      const newDevice: Device = {
        id: `${type}-${Date.now()}`,
        type,
        x: position.x,
        y: position.y,
        hostname: `${type}${prev.length + 1}`,
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

      const updated = [...prev, newDevice];
      addedDevice = newDevice;
      simulator.addDevice(newDevice);
      return updated;
    });

    return addedDevice;
  }, [simulator]);

  // Connect two devices
  const connectDevices = useCallback((device1Id: string, device2Id: string, port1: number, port2: number) => {
    const connection: Connection = {
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
  const deleteDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setConnections(prev => prev.filter(c => c.from !== deviceId && c.to !== deviceId));
    simulator.removeDevice(deviceId);
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null);
      setShowCLI(false);
    }
  }, [selectedDevice, simulator]);

  // Select device and show CLI
  const handleDeviceClick = useCallback((device: Device) => {
    setSelectedDevice(device);
    setShowCLI(true);
  }, []);

  // Execute CLI command
  const executeCommand = useCallback((command: string) => {
    if (!selectedDevice) return { output: 'No device selected', error: true };

    const result = simulator.executeCommand(selectedDevice.id, command);

    // Update device state if configuration changed
    if (result.configChanged) {
      setDevices(prev => prev.map(d =>
        d.id === selectedDevice.id ? result.updatedDevice! : d
      ));
      setSelectedDevice(result.updatedDevice!);
    }

    return result;
  }, [selectedDevice, simulator]);

  // Send packet for visualization
  const sendPacket = useCallback((sourceId: string, destIp: string, type: 'icmp' | 'tcp' | 'udp' = 'icmp') => {
    const path = simulator.findPath(sourceId, destIp);

    if (path.length > 0) {
      const packet: Packet = {
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
      if (router1 && switch1 && switch2 && pc1 && pc2 && pc3) {
        connectDevices(router1.id, switch1.id, 0, 0);
        connectDevices(router1.id, switch2.id, 1, 0);
        connectDevices(switch1.id, pc1.id, 1, 0);
        connectDevices(switch1.id, pc2.id, 2, 0);
        connectDevices(switch2.id, pc3.id, 1, 0);
      }
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
    <div className="space-y-6">
      <div className="section-hdr">
        <h2>Packet Tracer Simulator</h2>
      </div>
      <div className="flex justify-end gap-3 mb-4">
        <button
          className="btn btn-gold"
          onClick={loadSampleTopology}
        >
          Load Sample
        </button>
        <button
          className="btn btn-outline"
          onClick={clearTopology}
        >
          Clear All
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
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

      <div className="card">
        <div className="card-head">
          <h3>Quick Start</h3>
        </div>
        <div className="card-body">
          <ul className="space-y-2 text-text-muted text-sm">
            <li className="flex items-start">
              <span className="text-gold mr-2">•</span>
              <span><strong className="text-text">Add Device:</strong> Click a device icon in the toolbar, then click on canvas</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">•</span>
              <span><strong className="text-text">Connect Devices:</strong> Click "Cable" button, then click two devices to connect</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">•</span>
              <span><strong className="text-text">Configure:</strong> Click a device to open CLI terminal</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">•</span>
              <span><strong className="text-text">Test Connectivity:</strong> Use <code className="px-2 py-0.5 bg-navy-dark rounded text-gold font-mono text-xs">ping</code> command in CLI</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
