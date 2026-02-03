/**
 * Network Simulator - Handles network logic, routing, and CLI commands
 */
export class NetworkSimulator {
  constructor() {
    this.devices = new Map();
    this.connections = new Map();
  }

  addDevice(device) {
    this.devices.set(device.id, device);
  }

  removeDevice(deviceId) {
    this.devices.delete(deviceId);
    // Remove connections involving this device
    for (const [connId, conn] of this.connections.entries()) {
      if (conn.from === deviceId || conn.to === deviceId) {
        this.connections.delete(connId);
      }
    }
  }

  addConnection(connection) {
    this.connections.set(connection.id, connection);
  }

  clear() {
    this.devices.clear();
    this.connections.clear();
  }

  /**
   * Execute a Cisco IOS-like command
   */
  executeCommand(deviceId, command) {
    const device = this.devices.get(deviceId);
    if (!device) {
      return { output: 'Device not found', error: true };
    }

    const cmd = command.trim().toLowerCase();
    let output = '';
    let error = false;
    let configChanged = false;
    let updatedDevice = { ...device };

    // Parse command
    if (cmd === 'show running-config' || cmd === 'show run') {
      output = this.showRunningConfig(device);
    } else if (cmd === 'show ip interface brief' || cmd === 'show ip int br') {
      output = this.showIPInterfaceBrief(device);
    } else if (cmd === 'show interfaces' || cmd === 'show int') {
      output = this.showInterfaces(device);
    } else if (cmd.startsWith('ping ')) {
      const ip = cmd.split(' ')[1];
      output = this.ping(device, ip);
    } else if (cmd.startsWith('traceroute ') || cmd.startsWith('trace ')) {
      const ip = cmd.split(' ')[1];
      output = this.traceroute(device, ip);
    } else if (cmd === 'enable') {
      output = `${device.hostname}#`;
    } else if (cmd === 'configure terminal' || cmd === 'conf t') {
      output = `Entering configuration mode.\n${device.hostname}(config)#`;
    } else if (cmd.startsWith('hostname ')) {
      const newHostname = command.trim().split(' ')[1];
      updatedDevice.hostname = newHostname;
      updatedDevice.config.runningConfig.push(command);
      output = `${updatedDevice.hostname}(config)#`;
      configChanged = true;
    } else if (cmd.startsWith('interface ') || cmd.startsWith('int ')) {
      const interfaceName = command.trim().substring(cmd.indexOf(' ') + 1);
      output = `${device.hostname}(config-if)#\n% Entering interface ${interfaceName}`;
    } else if (cmd.startsWith('ip address ')) {
      // ip address 192.168.1.1 255.255.255.0
      const parts = cmd.split(' ');
      if (parts.length >= 4) {
        const ip = parts[2];
        const mask = parts[3];
        // Update first available interface
        const iface = updatedDevice.interfaces.find(i => i.ip === '' || i.ip === undefined);
        if (iface) {
          iface.ip = ip;
          iface.subnet = mask;
          updatedDevice.config.runningConfig.push(command);
          output = `IP address ${ip} ${mask} configured on interface`;
          configChanged = true;
        } else {
          output = 'No interface selected. Use "interface <name>" first.';
          error = true;
        }
      } else {
        output = 'Invalid syntax. Usage: ip address <ip> <subnet-mask>';
        error = true;
      }
    } else if (cmd === 'no shutdown' || cmd === 'no shut') {
      // Bring interface up
      output = 'Interface enabled';
      updatedDevice.config.runningConfig.push(command);
      configChanged = true;
    } else if (cmd === 'exit' || cmd === 'end') {
      output = `${device.hostname}#`;
    } else if (cmd === '?') {
      output = this.showHelp();
    } else if (cmd === 'show version' || cmd === 'show ver') {
      output = this.showVersion(device);
    } else if (cmd === '') {
      output = `${device.hostname}>`;
    } else {
      output = `% Invalid command: ${command}`;
      error = true;
    }

    // Update device in map if changed
    if (configChanged) {
      this.devices.set(deviceId, updatedDevice);
    }

    return {
      output,
      error,
      configChanged,
      updatedDevice: configChanged ? updatedDevice : device
    };
  }

  showRunningConfig(device) {
    let config = `Building configuration...\n\nCurrent configuration:\n!\nversion 15.0\n!\n`;
    config += `hostname ${device.hostname}\n!\n`;

    device.interfaces.forEach(iface => {
      config += `interface ${iface.name}\n`;
      if (iface.ip) {
        config += ` ip address ${iface.ip} ${iface.subnet || '255.255.255.0'}\n`;
      }
      if (iface.vlan) {
        config += ` switchport access vlan ${iface.vlan}\n`;
      }
      config += ` ${iface.status === 'up' ? 'no shutdown' : 'shutdown'}\n!\n`;
    });

    config += 'end';
    return config;
  }

  showIPInterfaceBrief(device) {
    let output = 'Interface              IP-Address      OK? Method Status                Protocol\n';
    device.interfaces.forEach(iface => {
      const ip = iface.ip || 'unassigned';
      const status = iface.status === 'up' ? 'up' : 'administratively down';
      const protocol = iface.status === 'up' ? 'up' : 'down';
      output += `${iface.name.padEnd(22)} ${ip.padEnd(15)} YES manual ${status.padEnd(22)} ${protocol}\n`;
    });
    return output;
  }

  showInterfaces(device) {
    let output = '';
    device.interfaces.forEach(iface => {
      output += `${iface.name} is ${iface.status}, line protocol is ${iface.status}\n`;
      if (iface.ip) {
        output += `  Internet address is ${iface.ip}/${this.subnetToCIDR(iface.subnet)}\n`;
      }
      output += `  MTU 1500 bytes, BW 1000000 Kbit/sec\n\n`;
    });
    return output;
  }

  showVersion(device) {
    return `Cisco IOS Software, Simulated Version 15.0\n` +
           `${device.type.toUpperCase()} (${device.hostname}) processor\n` +
           `512K bytes of non-volatile configuration memory.\n` +
           `Configuration register is 0x2102\n\n` +
           `This is a simulated device for CCNA training purposes.`;
  }

  showHelp() {
    return `Available commands:
  show running-config     - Display current configuration
  show ip interface brief - Display interface summary
  show interfaces         - Display detailed interface info
  show version            - Display device version info
  ping <ip>              - Test connectivity to IP address
  traceroute <ip>        - Trace route to IP address
  enable                 - Enter privileged mode
  configure terminal     - Enter configuration mode
  hostname <name>        - Set device hostname
  interface <name>       - Enter interface configuration
  ip address <ip> <mask> - Configure interface IP
  no shutdown            - Enable interface
  exit/end               - Exit current mode
  ?                      - Show this help`;
  }

  /**
   * Ping simulation
   */
  ping(sourceDevice, destIp) {
    const path = this.findPath(sourceDevice.id, destIp);

    if (path.length === 0) {
      return `Pinging ${destIp}...\n\n` +
             `Request timed out.\nRequest timed out.\nRequest timed out.\n\n` +
             `Ping statistics for ${destIp}:\n` +
             `    Packets: Sent = 3, Received = 0, Lost = 3 (100% loss)`;
    }

    const destDevice = this.devices.get(path[path.length - 1]);
    const destName = destDevice ? destDevice.hostname : 'Unknown';

    return `Pinging ${destIp} from ${sourceDevice.hostname}...\n\n` +
           `Reply from ${destIp}: bytes=32 time<1ms TTL=128\n` +
           `Reply from ${destIp}: bytes=32 time<1ms TTL=128\n` +
           `Reply from ${destIp}: bytes=32 time<1ms TTL=128\n\n` +
           `Ping statistics for ${destIp}:\n` +
           `    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)\n` +
           `    Destination: ${destName}\n` +
           `    Hops: ${path.length}`;
  }

  /**
   * Traceroute simulation
   */
  traceroute(sourceDevice, destIp) {
    const path = this.findPath(sourceDevice.id, destIp);

    if (path.length === 0) {
      return `Tracing route to ${destIp}...\n\n` +
             `  1     *        *        *     Request timed out.\n\n` +
             `Trace complete.`;
    }

    let output = `Tracing route to ${destIp}...\n\n`;
    path.forEach((deviceId, idx) => {
      const device = this.devices.get(deviceId);
      const ip = this.getDeviceIP(device) || 'unknown';
      const name = device ? device.hostname : 'Unknown';
      output += `  ${idx + 1}    <1 ms    <1 ms    <1 ms    ${ip} [${name}]\n`;
    });
    output += `\nTrace complete.`;

    return output;
  }

  /**
   * Find path from source device to destination IP
   * Simple BFS pathfinding through connected devices
   */
  findPath(sourceId, destIp) {
    const destDevice = this.findDeviceByIP(destIp);
    if (!destDevice) return [];
    if (sourceId === destDevice.id) return [sourceId];

    const visited = new Set();
    const queue = [[sourceId]];

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === destDevice.id) {
        return path;
      }

      if (visited.has(current)) continue;
      visited.add(current);

      // Find connected devices
      const neighbors = this.getConnectedDevices(current);
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          queue.push([...path, neighborId]);
        }
      });
    }

    return [];
  }

  /**
   * Get devices connected to given device
   */
  getConnectedDevices(deviceId) {
    const neighbors = [];
    for (const conn of this.connections.values()) {
      if (conn.from === deviceId) {
        neighbors.push(conn.to);
      } else if (conn.to === deviceId) {
        neighbors.push(conn.from);
      }
    }
    return neighbors;
  }

  /**
   * Find device by IP address
   */
  findDeviceByIP(ip) {
    for (const device of this.devices.values()) {
      for (const iface of device.interfaces) {
        if (iface.ip === ip) {
          return device;
        }
      }
    }
    return null;
  }

  /**
   * Get primary IP of device
   */
  getDeviceIP(device) {
    if (!device) return null;
    const iface = device.interfaces.find(i => i.ip);
    return iface ? iface.ip : null;
  }

  /**
   * Convert subnet mask to CIDR notation
   */
  subnetToCIDR(subnet) {
    if (!subnet) return '24';
    const parts = subnet.split('.');
    let cidr = 0;
    parts.forEach(part => {
      const num = parseInt(part);
      cidr += num.toString(2).split('1').length - 1;
    });
    return cidr;
  }
}
