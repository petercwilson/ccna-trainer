import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Network, FileText, BarChart3, Check, X, RefreshCw, Award, ChevronDown, Clock, Target, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

/* ─── DATA ─── */
const studyGuides = {
  'network-fundamentals': {
    title: 'Network Fundamentals',
    icon: '🌐',
    color: '#06b6d4',
    topics: [
      {
        id: 'osi-model',
        title: 'OSI Model & TCP/IP',
        content: `The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes network communication into 7 layers:

**Layer 7 - Application**: End-user protocols (HTTP, FTP, SMTP, DNS)
**Layer 6 - Presentation**: Data translation, encryption, compression
**Layer 5 - Session**: Session management and synchronization
**Layer 4 - Transport**: End-to-end communication (TCP, UDP)
**Layer 3 - Network**: Routing and logical addressing (IP)
**Layer 2 - Data Link**: Frame switching and physical addressing (MAC)
**Layer 1 - Physical**: Transmission of raw bits over physical medium

**TCP/IP Model** (4 layers):
- Application (combines OSI 5-7)
- Transport (OSI 4)
- Internet (OSI 3)
- Network Access (OSI 1-2)

**Key Protocols by Layer:**
- Application: HTTP(S), FTP, SMTP, DNS, DHCP, SNMP
- Transport: TCP (connection-oriented), UDP (connectionless)
- Network: IP, ICMP, ARP, OSPF, EIGRP
- Data Link: Ethernet, PPP, Frame Relay`
      },
      {
        id: 'ip-addressing',
        title: 'IP Addressing & Subnetting',
        content: `**IPv4 Address Structure:**
- 32-bit address divided into 4 octets (e.g., 192.168.1.1)
- Network portion + Host portion
- Subnet mask determines network/host boundary

**Address Classes:**
- Class A: 1.0.0.0 to 126.255.255.255 (/8)
- Class B: 128.0.0.0 to 191.255.255.255 (/16)
- Class C: 192.0.0.0 to 223.255.255.255 (/24)

**Private IP Ranges:**
- 10.0.0.0/8 (Class A)
- 172.16.0.0/12 (Class B)
- 192.168.0.0/16 (Class C)

**Subnetting Basics:**
CIDR Notation: /24 = 255.255.255.0
- /24 = 256 addresses (254 usable)
- /25 = 128 addresses (126 usable)
- /26 = 64 addresses (62 usable)
- /27 = 32 addresses (30 usable)
- /28 = 16 addresses (14 usable)
- /29 = 8 addresses (6 usable)
- /30 = 4 addresses (2 usable - point-to-point links)`
      }
    ]
  },
  'routing': {
    title: 'IP Routing',
    icon: '🔀',
    color: '#10b981',
    topics: [
      {
        id: 'routing-basics',
        title: 'Routing Fundamentals',
        content: `**Routing Process:**
1. Router receives packet on incoming interface
2. De-encapsulates Layer 2 frame
3. Examines destination IP address
4. Consults routing table for best match
5. Encapsulates in new Layer 2 frame
6. Forwards out appropriate interface

**Administrative Distances (Lower = More Trusted):**
- Directly Connected: 0
- Static Route: 1
- EIGRP Summary: 5
- eBGP: 20
- EIGRP (internal): 90
- OSPF: 110
- RIP: 120`
      }
    ]
  },
  'switching': {
    title: 'Switching Technologies',
    icon: '🔄',
    color: '#f59e0b',
    topics: [
      {
        id: 'vlans',
        title: 'VLANs & Trunking',
        content: `**VLAN Benefits:**
- Segmentation of broadcast domains
- Improved security through isolation
- Simplified management and troubleshooting
- Flexibility in network design

**VLAN Types:**
- Data VLAN: User traffic
- Voice VLAN: IP phone traffic (QoS priority)
- Management VLAN: Switch management
- Native VLAN: Untagged frames on trunk (default VLAN 1)

**Trunking:**
- Carries multiple VLANs over single link
- 802.1Q: Industry standard, single native VLAN`
      }
    ]
  },
  'security': {
    title: 'Network Security',
    icon: '🔒',
    color: '#ef4444',
    topics: [
      {
        id: 'acls',
        title: 'Access Control Lists (ACLs)',
        content: `**ACL Types:**

**Standard ACLs (1-99, 1300-1999):**
- Filter based on source IP only
- Applied close to destination

**Extended ACLs (100-199, 2000-2699):**
- Filter on source/destination IP, protocol, port
- Applied close to source

**Common Port Numbers:**
- FTP: 20/21
- SSH: 22
- Telnet: 23
- HTTP: 80
- HTTPS: 443`
      }
    ]
  },
  'automation': {
    title: 'Network Automation',
    icon: '🤖',
    color: '#8b5cf6',
    topics: [
      {
        id: 'rest-apis',
        title: 'REST APIs & JSON',
        content: `**REST (Representational State Transfer):**

**HTTP Methods:**
- GET: Retrieve data (read-only)
- POST: Create new resource
- PUT: Update existing resource
- DELETE: Remove resource

**JSON (JavaScript Object Notation):**
Human-readable data format used in REST APIs.
Consists of key-value pairs and supports nested objects.`
      }
    ]
  },
  'wireless': {
    title: 'Wireless Networking',
    icon: '📡',
    color: '#ec4899',
    topics: [
      {
        id: 'wireless-fundamentals',
        title: 'Wireless Fundamentals',
        content: `**802.11 Standards:**
- 802.11n (Wi-Fi 4): 2.4/5 GHz, 600 Mbps, MIMO
- 802.11ac (Wi-Fi 5): 5 GHz, 6.9 Gbps, MU-MIMO
- 802.11ax (Wi-Fi 6): 2.4/5 GHz, 9.6 Gbps, OFDMA

**Frequency Bands:**
- 2.4 GHz: 14 channels (1-14), longer range, more interference
- 5 GHz: UNII bands, more channels, less interference

**Wireless Security:**
- WEP: Deprecated, easily cracked
- WPA2: AES/CCMP, current standard
- WPA3: Enhanced security, SAE`
      }
    ]
  }
};

const examQuestions = [
  { id: 1, category: 'network-fundamentals', difficulty: 'easy', question: 'At which OSI layer does a router operate?', options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'], correctAnswer: 2, explanation: 'Routers operate at Layer 3 (Network layer) of the OSI model. They make forwarding decisions based on IP addresses and maintain routing tables.' },
  { id: 2, category: 'network-fundamentals', difficulty: 'medium', question: 'What is the maximum number of usable host addresses in a /26 subnet?', options: ['30', '62', '126', '254'], correctAnswer: 1, explanation: 'A /26 subnet has 6 host bits (32 - 26 = 6). This gives us 2^6 = 64 total addresses. Subtracting 2 for network and broadcast: 64 - 2 = 62 usable host addresses.' },
  { id: 3, category: 'network-fundamentals', difficulty: 'easy', question: 'Which protocol uses UDP port 69?', options: ['FTP', 'TFTP', 'HTTP', 'Telnet'], correctAnswer: 1, explanation: 'TFTP (Trivial File Transfer Protocol) uses UDP port 69. It is a simplified protocol used primarily for transferring configuration files and IOS images.' },
  { id: 4, category: 'switching', difficulty: 'medium', question: 'What is the default STP port state for a port that will neither forward frames nor learn MAC addresses?', options: ['Disabled', 'Blocking', 'Listening', 'Learning'], correctAnswer: 1, explanation: 'Blocking is the STP state where a port receives BPDUs but does not forward frames or learn MAC addresses. This prevents loops while maintaining the ability to transition to forwarding if the topology changes.' },
  { id: 5, category: 'switching', difficulty: 'hard', question: 'Which command configures an interface to allow only VLANs 10, 20, and 30 on a trunk?', options: ['switchport trunk vlan 10,20,30', 'switchport trunk allowed vlan 10,20,30', 'switchport trunk permit vlan 10,20,30', 'vlan trunk allowed 10,20,30'], correctAnswer: 1, explanation: 'The correct command is "switchport trunk allowed vlan 10,20,30". This explicitly permits only VLANs 10, 20, and 30 to traverse the trunk link.' },
  { id: 6, category: 'routing', difficulty: 'medium', question: 'What is the administrative distance of OSPF?', options: ['90', '100', '110', '120'], correctAnswer: 2, explanation: 'OSPF has an administrative distance of 110. Administrative distance determines the trustworthiness of routing information sources. Lower values are preferred.' },
  { id: 7, category: 'routing', difficulty: 'hard', question: 'In EIGRP, what condition must be met for a route to be considered a feasible successor?', options: ['The reported distance must be less than the feasible distance', 'The feasible distance must be less than the reported distance', 'The metric must be equal to the successor metric', 'The administrative distance must be lower than OSPF'], correctAnswer: 0, explanation: 'For EIGRP feasibility condition: Reported Distance (RD) < Feasible Distance (FD). The RD is the neighbor\'s best metric to the destination. If this condition is met, the route is loop-free.' },
  { id: 8, category: 'switching', difficulty: 'medium', question: 'Which VLAN is the default native VLAN on Cisco switches?', options: ['VLAN 0', 'VLAN 1', 'VLAN 10', 'VLAN 1005'], correctAnswer: 1, explanation: 'VLAN 1 is the default native VLAN. The native VLAN carries untagged frames on a trunk link. Best practice is to change the native VLAN to prevent VLAN hopping attacks.' },
  { id: 9, category: 'security', difficulty: 'medium', question: 'What is the effect of configuring port security violation mode as "restrict"?', options: ['Port shuts down and requires manual intervention', 'Packets are dropped and violations are logged', 'All traffic is allowed but logged', 'Port security is disabled'], correctAnswer: 1, explanation: 'In "restrict" mode, packets from unauthorized MAC addresses are dropped, violations are logged, SNMP traps are sent - but the port stays operational.' },
  { id: 10, category: 'security', difficulty: 'hard', question: 'Which security feature requires DHCP snooping to be enabled first?', options: ['Port security', 'Dynamic ARP Inspection (DAI)', 'PortFast', 'BPDU Guard'], correctAnswer: 1, explanation: 'Dynamic ARP Inspection (DAI) relies on the DHCP snooping binding database to validate ARP packets and prevent ARP spoofing attacks.' },
  { id: 11, category: 'wireless', difficulty: 'medium', question: 'Which wireless standard operates exclusively in the 5 GHz band and supports up to 6.9 Gbps?', options: ['802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6)', '802.11g'], correctAnswer: 1, explanation: '802.11ac (Wi-Fi 5) operates exclusively in the 5 GHz band and supports speeds up to 6.9 Gbps using features like wider channels and MU-MIMO.' },
  { id: 12, category: 'automation', difficulty: 'medium', question: 'Which HTTP method is used to retrieve data from a REST API without modifying it?', options: ['POST', 'PUT', 'GET', 'DELETE'], correctAnswer: 2, explanation: 'GET is the HTTP method used to retrieve data from a REST API without making any changes. It\'s idempotent - multiple identical requests have the same effect as one.' }
];

/* ─── HELPERS ─── */
function parseContent(text) {
  const lines = text.split('\n');
  const blocks = [];
  let currentList = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) { if (currentList) { blocks.push(currentList); currentList = null; } return; }

    // numbered step
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') { if (currentList) blocks.push(currentList); currentList = { type: 'ol', items: [] }; }
      currentList.items.push(numMatch[2]);
      return;
    }
    // bullet
    if (trimmed.startsWith('- ')) {
      if (!currentList || currentList.type !== 'ul') { if (currentList) blocks.push(currentList); currentList = { type: 'ul', items: [] }; }
      currentList.items.push(trimmed.slice(2));
      return;
    }
    // heading (bold ending with colon)
    if (trimmed.startsWith('**') && (trimmed.endsWith(':**') || trimmed.endsWith('**'))) {
      if (currentList) { blocks.push(currentList); currentList = null; }
      blocks.push({ type: 'h', text: trimmed.replace(/\*\*/g, '') });
      return;
    }
    // inline bold items like  **Layer 7 - Application**: …
    const inlineBold = trimmed.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
    if (inlineBold) {
      if (currentList) { blocks.push(currentList); currentList = null; }
      blocks.push({ type: 'p', parts: [{ bold: true, text: inlineBold[1] }, { bold: false, text: (inlineBold[2] || '').replace(/^:\s*/, ': ') }] });
      return;
    }
    // plain paragraph
    if (currentList) { blocks.push(currentList); currentList = null; }
    blocks.push({ type: 'p', parts: [{ bold: false, text: trimmed }] });
  });
  if (currentList) blocks.push(currentList);
  return blocks;
}

/* ─── NETWORK SIMULATION ─── */
const NetworkSimulation = () => {
  const [devices] = useState([
    { id: 1, type: 'router', x: 160, y: 100, name: 'R1', config: 'hostname R1\n!\ninterface GigabitEthernet0/0\n ip address 10.1.1.1 255.255.255.0\n no shutdown\n!\ninterface GigabitEthernet0/1\n ip address 10.1.2.1 255.255.255.0\n no shutdown' },
    { id: 2, type: 'switch', x: 380, y: 100, name: 'SW1', config: 'hostname SW1\n!\ninterface FastEthernet0/1\n switchport mode trunk\n no shutdown\n!\ninterface FastEthernet0/2\n switchport access vlan 10\n no shutdown\n!\nvlan 10\n name Engineering\nvlan 20\n name Marketing' },
    { id: 3, type: 'switch', x: 540, y: 260, name: 'SW2', config: 'hostname SW2\n!\ninterface FastEthernet0/1\n switchport mode trunk\n no shutdown\n!\ninterface FastEthernet0/2\n switchport access vlan 20\n no shutdown' },
    { id: 4, type: 'pc', x: 280, y: 280, name: 'PC1', config: 'Hostname : PC1\nIP Address : 10.1.10.10\nSubnet Mask : 255.255.255.0\nDefault Gateway : 10.1.10.1\nVLAN : 10 (Engineering)' },
    { id: 5, type: 'pc', x: 440, y: 380, name: 'PC2', config: 'Hostname : PC2\nIP Address : 10.1.20.10\nSubnet Mask : 255.255.255.0\nDefault Gateway : 10.1.20.1\nVLAN : 20 (Marketing)' },
    { id: 6, type: 'server', x: 640, y: 380, name: 'SRV1', config: 'Hostname : SRV1\nIP Address : 10.1.30.1\nSubnet Mask : 255.255.255.0\nServices : DHCP, DNS, HTTP\nVLAN : 30 (Servers)' },
  ]);

  const connections = [
    { from: 1, to: 2, label: 'Gi0/0 — Fa0/1', speed: '1 Gbps' },
    { from: 2, to: 3, label: 'Fa0/3 — Fa0/1', speed: '100 Mbps' },
    { from: 2, to: 4, label: 'Fa0/2', speed: '100 Mbps' },
    { from: 3, to: 5, label: 'Fa0/2', speed: '100 Mbps' },
    { from: 3, to: 6, label: 'Fa0/3', speed: '100 Mbps' },
  ];

  const [selected, setSelected] = useState(null);
  const sel = devices.find(d => d.id === selected);

  const iconPaths = {
    router: (
      <g>
        <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/>
        <circle cx="0" cy="0" r="14" fill="none" stroke="#06b6d4" strokeWidth="2.5"/>
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#06b6d4" strokeWidth="2.5"/>
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#06b6d4" strokeWidth="2.5"/>
        <polygon points="8,-3 12,0 8,3" fill="#06b6d4"/>
        <polygon points="-8,3 -12,0 -8,-3" fill="#06b6d4"/>
        <polygon points="-3,-8 0,-12 3,-8" fill="#06b6d4"/>
        <polygon points="3,8 0,12 -3,8" fill="#06b6d4"/>
      </g>
    ),
    switch: (
      <g>
        <rect x="-22" y="-14" width="44" height="28" rx="5" fill="#1e293b" stroke="#10b981" strokeWidth="2"/>
        {[-12,-4,4,12].map((x,i) => <rect key={i} x={x-2} y="-8" width="4" height="10" rx="1" fill="#10b981"/>)}
        <line x1="-14" y1="8" x2="14" y2="8" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3"/>
      </g>
    ),
    pc: (
      <g>
        <rect x="-16" y="-14" width="32" height="20" rx="3" fill="#1e293b" stroke="#a78bfa" strokeWidth="2"/>
        <rect x="-4" y="6" width="8" height="4" fill="#a78bfa"/>
        <rect x="-8" y="10" width="16" height="2" rx="1" fill="#a78bfa"/>
        <rect x="-10" y="-10" width="20" height="12" rx="1" fill="#334155"/>
      </g>
    ),
    server: (
      <g>
        <rect x="-14" y="-18" width="28" height="36" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
        {[-10, -2, 6].map((y,i) => <rect key={i} x="-10" y={y} width="20" height="5" rx="2" fill="#334155" stroke="#f59e0b" strokeWidth="0.8"/>)}
        {[-10, -2, 6].map((y,i) => <circle key={i} cx="8" cy={y+2.5} r="1.5" fill="#10b981"/>)}
      </g>
    )
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Network Topology</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Click any device to inspect its configuration</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { type: 'router', color: '#06b6d4', label: 'Router' },
                { type: 'switch', color: '#10b981', label: 'Switch' },
                { type: 'pc', color: '#a78bfa', label: 'PC' },
                { type: 'server', color: '#f59e0b', label: 'Server' },
              ].map(item => (
                <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }}/>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <svg viewBox="0 0 780 440" style={{ width: '100%', background: '#0f172a' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="bg1" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.04"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <rect width="780" height="440" fill="url(#bg1)"/>

          {/* grid dots */}
          {Array.from({ length: 20 }, (_, i) => Array.from({ length: 12 }, (_, j) => (
            <circle key={`${i}-${j}`} cx={i * 40 + 20} cy={j * 40 + 20} r="1" fill="#1e293b"/>
          )))}

          {/* connections */}
          {connections.map((c, i) => {
            const from = devices.find(d => d.id === c.from);
            const to = devices.find(d => d.id === c.to);
            if (!from || !to) return null;
            const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.35" filter="url(#glow)"/>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="4 6"/>
                <rect x={mx - 34} y={my - 10} width="68" height="18" rx="9" fill="#0f172a" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1"/>
                <text x={mx} y={my + 3} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="'JetBrains Mono', monospace">{c.label}</text>
              </g>
            );
          })}

          {/* devices */}
          {devices.map(d => (
            <g key={d.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected === d.id ? null : d.id)}>
              {selected === d.id && <circle cx={d.x} cy={d.y} r="30" fill="none" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="4 3"/>}
              <g transform={`translate(${d.x},${d.y})`} filter="url(#glow)">{iconPaths[d.type]}</g>
              <rect x={d.x - 18} y={d.y + 26} width="36" height="16" rx="8" fill="#1e293b" fillOpacity="0.9"/>
              <text x={d.x} y={d.y + 37} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="600" fontFamily="'Syne', sans-serif">{d.name}</text>
            </g>
          ))}
        </svg>

        {/* config panel */}
        {sel && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: sel.type === 'router' ? '#06b6d4' : sel.type === 'switch' ? '#10b981' : sel.type === 'pc' ? '#a78bfa' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14 }}>{sel.type === 'router' ? '⬡' : sel.type === 'switch' ? '⬜' : sel.type === 'pc' ? '💻' : '🖥️'}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{sel.name} <span style={{ fontWeight: 400, color: '#64748b', textTransform: 'capitalize' }}>— {sel.type}</span></span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
            <pre style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 18px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#34d399', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{sel.config}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── PROGRESS RING SVG ─── */
const ProgressRing = ({ percent, size = 80, stroke = 7, color = '#06b6d4' }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}/>
    </svg>
  );
};

/* ─── MAIN APP ─── */
const CCNATrainer = () => {
  const [activeTab, setActiveTab] = useState('study');
  const [selectedCategory, setSelectedCategory] = useState('network-fundamentals');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [examMode, setExamMode] = useState(false);
  const allQuestions = examQuestions;
  const [activeExamQuestions, setActiveExamQuestions] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [progress, setProgress] = useState(() => {
    try { const s = localStorage.getItem('ccna-progress'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem('ccna-progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { setMounted(true); }, []);

  const tabs = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: FileText },
    { id: 'simulate', label: 'Lab', icon: Network },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  const startExam = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setActiveExamQuestions(shuffled.slice(0, Math.min(12, shuffled.length)));
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setExamCompleted(false);
  };

  const submitExam = () => {
    let correct = 0;
    activeExamQuestions.forEach((q, idx) => { if (selectedAnswers[idx] === q.correctAnswer) correct++; });
    setScore(correct);
    setExamCompleted(true);
    const np = { ...progress };
    if (!np.exams) np.exams = [];
    np.exams.push({ date: new Date().toISOString(), score: correct, total: activeExamQuestions.length, percentage: Math.round((correct / activeExamQuestions.length) * 100) });
    setProgress(np);
  };

  const filteredQuestions = allQuestions.filter(q => q.category === selectedCategory);

  const diffColor = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
  const diffBg = { easy: 'rgba(16,185,129,0.12)', medium: 'rgba(245,158,11,0.12)', hard: 'rgba(239,68,68,0.12)' };

  /* ── STYLES (injected once) ── */
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Syne', sans-serif; background: #0a0e1a; color: #cbd5e1; min-height: 100vh; }

    .app-root {
      min-height: 100vh;
      background: #0a0e1a;
      background-image:
        radial-gradient(ellipse 80% 40% at 20% 0%, rgba(6,182,212,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 60% 50% at 85% 100%, rgba(16,185,129,0.06) 0%, transparent 70%),
        radial-gradient(ellipse 50% 30% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 70%);
      color: #cbd5e1;
      font-family: 'Syne', sans-serif;
    }

    /* grain overlay */
    .app-root::before {
      content: '';
      position: fixed; inset: 0; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    .glass-card {
      position: relative; z-index: 1;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .glass-card-hover { transition: border-color 0.25s, box-shadow 0.25s; }
    .glass-card-hover:hover { border-color: rgba(6,182,212,0.25); box-shadow: 0 0 24px rgba(6,182,212,0.08); }

    .btn-primary {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      color: #fff; border: none; border-radius: 10px;
      padding: 10px 22px; font-family: 'Syne', sans-serif;
      font-weight: 600; font-size: 14px; cursor: pointer;
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 2px 12px rgba(6,182,212,0.25);
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(6,182,212,0.35); }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost {
      background: rgba(30,41,59,0.7); color: #94a3b8; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; padding: 10px 22px; font-family: 'Syne', sans-serif;
      font-weight: 600; font-size: 14px; cursor: pointer;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .btn-ghost:hover { background: rgba(51,65,85,0.8); color: #f1f5f9; border-color: rgba(255,255,255,0.12); }

    .btn-ghost:disabled { opacity: 0.35; cursor: not-allowed; }

    /* staggered fade-in */
    .reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.45s ease, transform 0.45s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
  `;

  /* ── REVEAL HOOK ── */
  const RevealWrap = ({ children, delay = 0 }) => {
    const ref = useRef();
    const [vis, setVis] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
      }, delay);
      return () => clearTimeout(t);
    }, [delay]);
    return <div ref={ref} className={`reveal${vis ? ' visible' : ''}`}>{children}</div>;
  };

  /* ── RENDER ── */
  return (
    <div className="app-root" style={{ position: 'relative', zIndex: 1 }}>
      <style>{globalStyles}</style>

      {/* ── TOP NAV ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 24px', background: 'rgba(10,14,26,0.75)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>CCNA</span>
              <span style={{ fontSize: 17, fontWeight: 400, color: '#64748b', marginLeft: 6 }}>Trainer</span>
            </div>
          </div>
          {/* tabs */}
          <nav style={{ display: 'flex', gap: 4 }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id !== 'practice') { setExamMode(false); setExamStarted(false); } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8,
                    background: active ? 'rgba(6,182,212,0.12)' : 'transparent',
                    border: active ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
                    color: active ? '#06b6d4' : '#64748b',
                    fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          {/* badge */}
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>200-301</div>
        </div>
      </header>

      {/* ── PAGE BODY ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ════════════════ STUDY TAB ════════════════ */}
        {activeTab === 'study' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
            {/* sidebar */}
            <aside>
              <div className="glass-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Domains</div>
                {Object.entries(studyGuides).map(([key, cat], i) => {
                  const active = selectedCategory === key;
                  return (
                    <button key={key} onClick={() => { setSelectedCategory(key); setExpandedTopic(null); }}
                      style={{
                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                        background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
                        borderLeft: active ? `3px solid ${cat.color}` : '3px solid transparent',
                        color: active ? '#f1f5f9' : '#94a3b8',
                        fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: active ? 600 : 500,
                        transition: 'all 0.2s'
                      }}>
                      <span style={{ fontSize: 17 }}>{cat.icon}</span>
                      <span>{cat.title}</span>
                      {/* question count badge */}
                      <span style={{ marginLeft: 'auto', fontSize: 10, background: 'rgba(255,255,255,0.06)', color: '#64748b', padding: '2px 7px', borderRadius: 10 }}>
                        {allQuestions.filter(q => q.category === key).length}Q
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* content */}
            <div>
              <RevealWrap>
                <div className="glass-card" style={{ padding: 28 }}>
                  {/* header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: studyGuides[selectedCategory].color + '1a', border: `1px solid ${studyGuides[selectedCategory].color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {studyGuides[selectedCategory].icon}
                    </div>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>{studyGuides[selectedCategory].title}</h2>
                      <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{studyGuides[selectedCategory].topics.length} topic{studyGuides[selectedCategory].topics.length > 1 ? 's' : ''} available</p>
                    </div>
                  </div>

                  {/* topic accordions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {studyGuides[selectedCategory].topics.map((topic, i) => {
                      const open = expandedTopic === topic.id;
                      return (
                        <div key={topic.id} style={{ borderRadius: 12, border: `1px solid ${open ? studyGuides[selectedCategory].color + '33' : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden', transition: 'border-color 0.3s' }}>
                          <button onClick={() => setExpandedTopic(open ? null : topic.id)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: open ? studyGuides[selectedCategory].color + '08' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: studyGuides[selectedCategory].color, opacity: open ? 1 : 0.4 }}/>
                              <span style={{ fontSize: 15, fontWeight: 600, color: open ? '#f1f5f9' : '#cbd5e1', fontFamily: 'Syne, sans-serif' }}>{topic.title}</span>
                            </div>
                            <ChevronDown size={18} color="#64748b" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}/>
                          </button>

                          {open && (
                            <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ paddingTop: 18 }}>
                                {parseContent(topic.content).map((block, idx) => {
                                  if (block.type === 'h') return <div key={idx} style={{ fontSize: 14, fontWeight: 700, color: studyGuides[selectedCategory].color, marginTop: idx > 0 ? 18 : 0, marginBottom: 8 }}>{block.text}</div>;
                                  if (block.type === 'ul' || block.type === 'ol') return (
                                    <div key={idx} style={{ marginBottom: 10 }}>
                                      {block.items.map((item, j) => (
                                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 0' }}>
                                          <span style={{ marginTop: 7, width: 6, height: 6, borderRadius: '50%', background: '#334155', flexShrink: 0 }}/>
                                          <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                  // paragraph with possible bold
                                  return (
                                    <p key={idx} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 6 }}>
                                      {block.parts.map((p, j) => p.bold ? <strong key={j} style={{ color: '#cbd5e1' }}>{p.text}</strong> : <span key={j}>{p.text}</span>)}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </RevealWrap>
            </div>
          </div>
        )}

        {/* ════════════════ PRACTICE TAB ════════════════ */}
        {activeTab === 'practice' && (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* mode selector */}
            {!examMode && !examStarted && (
              <RevealWrap>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
                  {[
                    { type: 'topic', title: 'Topic Practice', desc: 'Study by category with instant feedback', icon: '📖', color: '#06b6d4', gradient: 'rgba(6,182,212,0.08)' },
                    { type: 'exam', title: 'Timed Exam', desc: 'Simulate the real CCNA exam', icon: '⏱️', color: '#f59e0b', gradient: 'rgba(245,158,11,0.08)' }
                  ].map(m => (
                    <button key={m.type} onClick={() => { if (m.type === 'exam') { setExamMode(true); setExamStarted(false); setExamCompleted(false); } else { setExamMode(false); setCurrentQuestionIndex(0); } }}
                      className="glass-card glass-card-hover"
                      style={{ padding: 24, border: `1px solid ${m.color}22`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s', background: m.gradient }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{m.icon}</div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{m.title}</h3>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{m.desc}</p>
                    </button>
                  ))}
                </div>
              </RevealWrap>
            )}

            {/* ── TOPIC PRACTICE ── */}
            {!examMode && (
              <RevealWrap delay={60}>
                <div className="glass-card" style={{ padding: 28 }}>
                  {/* category selector */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
                    {Object.entries(studyGuides).map(([key, cat]) => {
                      const active = selectedCategory === key;
                      const hasQ = allQuestions.some(q => q.category === key);
                      if (!hasQ) return null;
                      return (
                        <button key={key} onClick={() => { setSelectedCategory(key); setCurrentQuestionIndex(0); setSelectedAnswers({}); setShowExplanation({}); }}
                          style={{
                            padding: '6px 14px', borderRadius: 20, border: `1px solid ${active ? cat.color + '55' : 'rgba(255,255,255,0.07)'}`,
                            background: active ? cat.color + '12' : 'transparent',
                            color: active ? cat.color : '#94a3b8',
                            fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                          }}>
                          {cat.icon} {cat.title}
                        </button>
                      );
                    })}
                  </div>

                  {filteredQuestions.length > 0 && (
                    <>
                      {/* progress bar + meta */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Question {currentQuestionIndex + 1} <span style={{ color: '#475569' }}>/ {filteredQuestions.length}</span></span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: diffColor[filteredQuestions[currentQuestionIndex].difficulty], background: diffBg[filteredQuestions[currentQuestionIndex].difficulty], padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {filteredQuestions[currentQuestionIndex].difficulty}
                        </span>
                      </div>
                      <div style={{ height: 3, background: '#1e293b', borderRadius: 2, marginBottom: 22, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`, background: 'linear-gradient(90deg,#06b6d4,#10b981)', borderRadius: 2, transition: 'width 0.4s ease' }}/>
                      </div>

                      {/* question card */}
                      <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px 22px', marginBottom: 18 }}>
                        <p style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.55 }}>{filteredQuestions[currentQuestionIndex].question}</p>
                      </div>

                      {/* options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                        {filteredQuestions[currentQuestionIndex].options.map((opt, idx) => {
                          const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                          const isCorrect = idx === filteredQuestions[currentQuestionIndex].correctAnswer;
                          const revealed = showExplanation[currentQuestionIndex];
                          let bg = 'rgba(30,41,59,0.5)', border = 'rgba(255,255,255,0.07)', textCol = '#cbd5e1';
                          if (revealed) {
                            if (isCorrect) { bg = 'rgba(16,185,129,0.12)'; border = '#10b981'; textCol = '#fff'; }
                            else if (isSelected) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; textCol = '#fff'; }
                          } else if (isSelected) { bg = 'rgba(6,182,212,0.12)'; border = '#06b6d4'; textCol = '#fff'; }
                          return (
                            <button key={idx} disabled={!!revealed} onClick={() => { if (!revealed) setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: idx }); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderRadius: 10, background: bg, border: `1px solid ${border}`, cursor: revealed ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                              {/* radio circle */}
                              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${revealed ? (isCorrect ? '#10b981' : isSelected ? '#ef4444' : '#334155') : (isSelected ? '#06b6d4' : '#334155')}`, background: revealed ? (isCorrect ? '#10b981' : isSelected ? '#ef4444' : 'transparent') : (isSelected ? '#06b6d4' : 'transparent'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                {((revealed && isCorrect) || (!revealed && isSelected)) && <Check size={13} color="#fff"/>}
                                {revealed && isSelected && !isCorrect && <X size={13} color="#fff"/>}
                              </div>
                              <span style={{ fontSize: 14, color: textCol, fontWeight: isSelected || (revealed && isCorrect) ? 600 : 400 }}>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* check answer btn */}
                      {!showExplanation[currentQuestionIndex] && selectedAnswers[currentQuestionIndex] !== undefined && (
                        <button className="btn-primary" onClick={() => setShowExplanation({ ...showExplanation, [currentQuestionIndex]: true })} style={{ width: '100%', padding: '12px', fontSize: 15, marginBottom: 16 }}>
                          Check Answer
                        </button>
                      )}

                      {/* explanation */}
                      {showExplanation[currentQuestionIndex] && (
                        <div style={{ borderRadius: 12, padding: '18px 20px', marginBottom: 20, background: selectedAnswers[currentQuestionIndex] === filteredQuestions[currentQuestionIndex].correctAnswer ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selectedAnswers[currentQuestionIndex] === filteredQuestions[currentQuestionIndex].correctAnswer ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            {selectedAnswers[currentQuestionIndex] === filteredQuestions[currentQuestionIndex].correctAnswer
                              ? <><Check size={18} color="#10b981"/><span style={{ fontWeight: 700, color: '#10b981', fontSize: 15 }}>Correct!</span></>
                              : <><X size={18} color="#ef4444"/><span style={{ fontWeight: 700, color: '#ef4444', fontSize: 15 }}>Incorrect</span></>
                            }
                          </div>
                          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{filteredQuestions[currentQuestionIndex].explanation}</p>
                        </div>
                      )}

                      {/* prev / next */}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn-ghost" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ArrowLeft size={15}/> Previous
                        </button>
                        <button className="btn-ghost" disabled={currentQuestionIndex === filteredQuestions.length - 1} onClick={() => { setCurrentQuestionIndex(currentQuestionIndex + 1); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          Next <ArrowRight size={15}/>
                        </button>
                      </div>
                    </>
                  )}

                  {filteredQuestions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                      <p style={{ color: '#64748b', fontSize: 14 }}>No questions available for this topic yet.</p>
                    </div>
                  )}
                </div>
              </RevealWrap>
            )}

            {/* ── EXAM MODE ── */}
            {examMode && (
              <RevealWrap>
                <div className="glass-card" style={{ padding: 28 }}>
                  {!examStarted ? (
                    /* start screen */
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ fontSize: 52, marginBottom: 16 }}>🎯</div>
                      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Ready for Your Practice Exam?</h2>
                      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
                        You'll answer {Math.min(12, allQuestions.length)} randomly selected questions covering all CCNA domains. Take your time — there is no time limit.
                      </p>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={startExam} style={{ padding: '12px 32px', fontSize: 15 }}>Start Exam</button>
                        <button className="btn-ghost" onClick={() => setExamMode(false)} style={{ padding: '12px 24px', fontSize: 15 }}>Cancel</button>
                      </div>
                    </div>
                  ) : examCompleted ? (
                    /* results screen */
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <div style={{ fontSize: 56, marginBottom: 8 }}>{score >= Math.floor(activeExamQuestions.length * 0.8) ? '🎉' : score >= Math.floor(activeExamQuestions.length * 0.6) ? '👍' : '📚'}</div>
                      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>Exam Complete</h2>
                      {/* ring + score */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 28 }}>
                        <div style={{ position: 'relative', width: 100, height: 100 }}>
                          <ProgressRing percent={Math.round((score / activeExamQuestions.length) * 100)} size={100} stroke={10} color={score / activeExamQuestions.length >= 0.8 ? '#10b981' : score / activeExamQuestions.length >= 0.6 ? '#f59e0b' : '#ef4444'}/>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>{Math.round((score / activeExamQuestions.length) * 100)}%</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ fontSize: 14, color: '#64748b' }}>Score</p>
                          <p style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>{score} <span style={{ fontSize: 16, fontWeight: 400, color: '#475569' }}>/ {activeExamQuestions.length}</span></p>
                          <p style={{ fontSize: 13, color: score >= Math.floor(activeExamQuestions.length * 0.8) ? '#10b981' : score >= Math.floor(activeExamQuestions.length * 0.6) ? '#f59e0b' : '#ef4444', fontWeight: 600, marginTop: 4 }}>
                            {score >= Math.floor(activeExamQuestions.length * 0.8) ? 'Excellent — CCNA ready!' : score >= Math.floor(activeExamQuestions.length * 0.6) ? 'Good — keep studying!' : 'Keep practicing, you\'ll get there!'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => { setExamCompleted(false); startExam(); }} style={{ padding: '12px 28px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>
                          <RefreshCw size={15}/> Retake
                        </button>
                        <button className="btn-ghost" onClick={() => { setExamMode(false); setExamStarted(false); setExamCompleted(false); }} style={{ padding: '12px 28px', fontSize: 15 }}>
                          Back to Practice
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* active exam questions */
                    <>
                      {/* header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={16} color="#f59e0b"/>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>Question {currentQuestionIndex + 1} / {activeExamQuestions.length}</span>
                        </div>
                        <button className="btn-primary" onClick={submitExam} style={{ padding: '8px 20px', fontSize: 13, background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 2px 10px rgba(16,185,129,0.3)' }}>
                          Submit Exam
                        </button>
                      </div>
                      <div style={{ height: 3, background: '#1e293b', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / activeExamQuestions.length) * 100}%`, background: 'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius: 2, transition: 'width 0.4s ease' }}/>
                      </div>

                      {activeExamQuestions[currentQuestionIndex] && (
                        <>
                          <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px 22px', marginBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f59e0b22', border: '1px solid #f59e0b44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#f59e0b', fontSize: 14, flexShrink: 0 }}>{currentQuestionIndex + 1}</div>
                              <p style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.55 }}>{activeExamQuestions[currentQuestionIndex].question}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                            {activeExamQuestions[currentQuestionIndex].options.map((opt, idx) => {
                              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                              let bg = 'rgba(30,41,59,0.5)', border = 'rgba(255,255,255,0.07)', textCol = '#cbd5e1';
                              if (isSelected) { bg = 'rgba(245,158,11,0.12)'; border = '#f59e0b'; textCol = '#fff'; }
                              return (
                                <button key={idx} onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: idx })}
                                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderRadius: 10, background: bg, border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${isSelected ? '#f59e0b' : '#334155'}`, background: isSelected ? '#f59e0b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                    {isSelected && <Check size={13} color="#fff"/>}
                                  </div>
                                  <span style={{ fontSize: 14, color: textCol, fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn-ghost" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <ArrowLeft size={15}/> Previous
                            </button>
                            <button className="btn-ghost" disabled={currentQuestionIndex === activeExamQuestions.length - 1} onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              Next <ArrowRight size={15}/>
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </RevealWrap>
            )}
          </div>
        )}

        {/* ════════════════ LAB TAB ════════════════ */}
        {activeTab === 'simulate' && (
          <RevealWrap>
            <NetworkSimulation />
          </RevealWrap>
        )}

        {/* ════════════════ PROGRESS TAB ════════════════ */}
        {activeTab === 'progress' && (
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <RevealWrap>
              {/* stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Questions Done', value: Object.keys(selectedAnswers).length, icon: Target, color: '#06b6d4' },
                  { label: 'Correct', value: Object.keys(selectedAnswers).filter(i => { const q = allQuestions[parseInt(i)]; return q && selectedAnswers[i] === q.correctAnswer; }).length, icon: Check, color: '#10b981' },
                  { label: 'Exams Taken', value: progress.exams?.length || 0, icon: Award, color: '#f59e0b' }
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="glass-card" style={{ padding: '20px 22px', borderTop: `2px solid ${s.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                          <p style={{ fontSize: 34, fontWeight: 800, color: '#f1f5f9', marginTop: 4, letterSpacing: '-1px' }}>{s.value}</p>
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={s.color}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealWrap>

            <RevealWrap delay={100}>
              <div className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 18 }}>Exam History</h3>
                {progress.exams && progress.exams.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {progress.exams.slice().reverse().map((exam, idx) => {
                      const pct = exam.percentage;
                      const col = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 18px', borderRadius: 12, background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <ProgressRing percent={pct} size={52} stroke={6} color={col}/>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Mock Exam #{progress.exams.length - idx}</p>
                            <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 22, fontWeight: 800, color: col }}>{pct}%</p>
                            <p style={{ fontSize: 12, color: '#475569' }}>{exam.score}/{exam.total}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '52px 0' }}>
                    <div style={{ fontSize: 42, marginBottom: 14 }}>🎯</div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>No exams yet</h4>
                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Take a practice exam to start tracking your progress.</p>
                    <button className="btn-primary" onClick={() => { setActiveTab('practice'); setExamMode(true); setExamStarted(false); }} style={{ padding: '10px 24px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Zap size={15}/> Start Practice Exam
                    </button>
                  </div>
                )}
              </div>
            </RevealWrap>
          </div>
        )}
      </main>
    </div>
  );
};

export default CCNATrainer;
