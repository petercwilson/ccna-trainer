import React, { useState, useEffect } from 'react';
import { BookOpen, Network, FileText, BarChart3, Play, Check, X, RefreshCw, Award, ChevronRight, ChevronDown, Zap, Clock, Target } from 'lucide-react';

// CCNA Study Content Database
const studyGuides = {
  'network-fundamentals': {
    title: 'Network Fundamentals',
    icon: '🌐',
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

// Exam Questions Database
const examQuestions = [
  {
    id: 1,
    category: 'network-fundamentals',
    difficulty: 'easy',
    question: 'At which OSI layer does a router operate?',
    options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
    correctAnswer: 2,
    explanation: 'Routers operate at Layer 3 (Network layer) of the OSI model. They make forwarding decisions based on IP addresses and maintain routing tables.'
  },
  {
    id: 2,
    category: 'network-fundamentals',
    difficulty: 'medium',
    question: 'What is the maximum number of usable host addresses in a /26 subnet?',
    options: ['30', '62', '126', '254'],
    correctAnswer: 1,
    explanation: 'A /26 subnet has 6 host bits (32 - 26 = 6). This gives us 2^6 = 64 total addresses. Subtracting 2 for network and broadcast: 64 - 2 = 62 usable host addresses.'
  },
  {
    id: 3,
    category: 'network-fundamentals',
    difficulty: 'easy',
    question: 'Which protocol uses UDP port 69?',
    options: ['FTP', 'TFTP', 'HTTP', 'Telnet'],
    correctAnswer: 1,
    explanation: 'TFTP (Trivial File Transfer Protocol) uses UDP port 69. It is a simplified protocol used primarily for transferring configuration files and IOS images.'
  },
  {
    id: 4,
    category: 'switching',
    difficulty: 'medium',
    question: 'What is the default STP port state for a port that will neither forward frames nor learn MAC addresses?',
    options: ['Disabled', 'Blocking', 'Listening', 'Learning'],
    correctAnswer: 1,
    explanation: 'Blocking is the STP state where a port receives BPDUs but does not forward frames or learn MAC addresses. This prevents loops while maintaining the ability to transition to forwarding if the topology changes.'
  },
  {
    id: 5,
    category: 'switching',
    difficulty: 'hard',
    question: 'Which command configures an interface to allow only VLANs 10, 20, and 30 on a trunk?',
    options: ['switchport trunk vlan 10,20,30', 'switchport trunk allowed vlan 10,20,30', 'switchport trunk permit vlan 10,20,30', 'vlan trunk allowed 10,20,30'],
    correctAnswer: 1,
    explanation: 'The correct command is "switchport trunk allowed vlan 10,20,30". This explicitly permits only VLANs 10, 20, and 30 to traverse the trunk link.'
  },
  {
    id: 6,
    category: 'routing',
    difficulty: 'medium',
    question: 'What is the administrative distance of OSPF?',
    options: ['90', '100', '110', '120'],
    correctAnswer: 2,
    explanation: 'OSPF has an administrative distance of 110. Administrative distance determines the trustworthiness of routing information sources. Lower values are preferred.'
  },
  {
    id: 7,
    category: 'routing',
    difficulty: 'hard',
    question: 'In EIGRP, what condition must be met for a route to be considered a feasible successor?',
    options: ['The reported distance must be less than the feasible distance', 'The feasible distance must be less than the reported distance', 'The metric must be equal to the successor metric', 'The administrative distance must be lower than OSPF'],
    correctAnswer: 0,
    explanation: 'For EIGRP feasibility condition: Reported Distance (RD) < Feasible Distance (FD). The RD is the neighbor\'s best metric to the destination. If this condition is met, the route is loop-free.'
  },
  {
    id: 8,
    category: 'switching',
    difficulty: 'medium',
    question: 'Which VLAN is the default native VLAN on Cisco switches?',
    options: ['VLAN 0', 'VLAN 1', 'VLAN 10', 'VLAN 1005'],
    correctAnswer: 1,
    explanation: 'VLAN 1 is the default native VLAN. The native VLAN carries untagged frames on a trunk link. Best practice is to change the native VLAN to prevent VLAN hopping attacks.'
  },
  {
    id: 9,
    category: 'security',
    difficulty: 'medium',
    question: 'What is the effect of configuring port security violation mode as "restrict"?',
    options: ['Port shuts down and requires manual intervention', 'Packets are dropped and violations are logged', 'All traffic is allowed but logged', 'Port security is disabled'],
    correctAnswer: 1,
    explanation: 'In "restrict" mode, packets from unauthorized MAC addresses are dropped, violations are logged, SNMP traps are sent - but the port stays operational.'
  },
  {
    id: 10,
    category: 'security',
    difficulty: 'hard',
    question: 'Which security feature requires DHCP snooping to be enabled first?',
    options: ['Port security', 'Dynamic ARP Inspection (DAI)', 'PortFast', 'BPDU Guard'],
    correctAnswer: 1,
    explanation: 'Dynamic ARP Inspection (DAI) relies on the DHCP snooping binding database to validate ARP packets and prevent ARP spoofing attacks.'
  },
  {
    id: 11,
    category: 'wireless',
    difficulty: 'medium',
    question: 'Which wireless standard operates exclusively in the 5 GHz band and supports up to 6.9 Gbps?',
    options: ['802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6)', '802.11g'],
    correctAnswer: 1,
    explanation: '802.11ac (Wi-Fi 5) operates exclusively in the 5 GHz band and supports speeds up to 6.9 Gbps using features like wider channels and MU-MIMO.'
  },
  {
    id: 12,
    category: 'automation',
    difficulty: 'medium',
    question: 'Which HTTP method is used to retrieve data from a REST API without modifying it?',
    options: ['POST', 'PUT', 'GET', 'DELETE'],
    correctAnswer: 2,
    explanation: 'GET is the HTTP method used to retrieve data from a REST API without making any changes. It\'s idempotent - multiple identical requests have the same effect as one.'
  }
];

// Network Simulation Component
const NetworkSimulation = () => {
  const [devices, setDevices] = useState([
    { id: 1, type: 'router', x: 200, y: 150, name: 'R1', config: { ip: '10.1.1.1' } },
    { id: 2, type: 'switch', x: 400, y: 150, name: 'SW1', config: { vlans: [1, 10, 20] } },
    { id: 3, type: 'pc', x: 350, y: 300, name: 'PC1', config: { ip: '10.1.10.10' } },
    { id: 4, type: 'pc', x: 450, y: 300, name: 'PC2', config: { ip: '10.1.10.11' } },
  ]);
  
  const [connections] = useState([
    { from: 1, to: 2, label: 'Gi0/0' },
    { from: 2, to: 3, label: 'Fa0/1' },
    { from: 2, to: 4, label: 'Fa0/2' }
  ]);
  
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  const deviceIcons = {
    router: '🔷',
    switch: '📦',
    pc: '💻',
    server: '🖥️'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400">Network Topology Simulator</h3>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 transition-all">
          <Play size={18} />
          Simulate Traffic
        </button>
      </div>
      
      <div className="relative bg-slate-950/50 rounded-xl border border-slate-700 h-[450px] mb-4 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {connections.map((conn, idx) => {
            const from = devices.find(d => d.id === conn.from);
            const to = devices.find(d => d.id === conn.to);
            if (!from || !to) return null;
            
            return (
              <g key={idx}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 10}
                  fill="#06b6d4"
                  fontSize="12"
                  fontWeight="600"
                >
                  {conn.label}
                </text>
              </g>
            );
          })}
        </svg>
        
        {devices.map(device => (
          <div
            key={device.id}
            className={`absolute cursor-pointer transition-all transform hover:scale-110 ${
              selectedDevice?.id === device.id ? 'ring-4 ring-cyan-400 rounded-full' : ''
            }`}
            style={{ left: device.x - 25, top: device.y - 25 }}
            onClick={() => { setSelectedDevice(device); setShowConfig(true); }}
          >
            <div className="text-center">
              <div className="text-5xl mb-1 filter drop-shadow-lg">{deviceIcons[device.type]}</div>
              <div className="text-xs font-bold text-cyan-300 bg-slate-900/80 px-2 py-1 rounded">{device.name}</div>
            </div>
          </div>
        ))}
      </div>
      
      {showConfig && selectedDevice && (
        <div className="bg-slate-800/80 rounded-xl p-6 border border-cyan-500/30">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-cyan-400">{selectedDevice.name} Configuration</h4>
            <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-green-400">
            <div>hostname {selectedDevice.name}</div>
            <div>!</div>
            {selectedDevice.type === 'router' && (
              <>
                <div>interface GigabitEthernet0/0</div>
                <div className="ml-4">ip address {selectedDevice.config.ip} 255.255.255.0</div>
                <div className="ml-4">no shutdown</div>
              </>
            )}
            {selectedDevice.type === 'pc' && (
              <>
                <div>IP Address: {selectedDevice.config.ip}</div>
                <div>Subnet Mask: 255.255.255.0</div>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-3 mt-4">
        {Object.entries(deviceIcons).map(([type, icon]) => (
          <button key={type} className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg p-3 flex items-center justify-center gap-2 transition-all">
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-semibold text-slate-300 capitalize">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const CCNATrainer = () => {
  const [activeTab, setActiveTab] = useState('study');
  const [selectedCategory, setSelectedCategory] = useState('network-fundamentals');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [examMode, setExamMode] = useState(false);
  const allQuestions = examQuestions; // All questions from database
  const [activeExamQuestions, setActiveExamQuestions] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('ccna-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('ccna-progress', JSON.stringify(progress));
  }, [progress]);

  const tabs = [
    { id: 'study', label: 'Study Guides', icon: BookOpen },
    { id: 'practice', label: 'Practice Questions', icon: FileText },
    { id: 'simulate', label: 'Network Lab', icon: Network },
    { id: 'progress', label: 'My Progress', icon: BarChart3 }
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
    activeExamQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setExamCompleted(true);
    
    const newProgress = { ...progress };
    if (!newProgress.exams) newProgress.exams = [];
    newProgress.exams.push({
      date: new Date().toISOString(),
      score: correct,
      total: activeExamQuestions.length,
      percentage: Math.round((correct / activeExamQuestions.length) * 100)
    });
    setProgress(newProgress);
  };

  const filteredQuestions = allQuestions.filter(q => q.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@400;600;700;800&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 border border-cyan-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl animate-float border border-white/20">
                🎓
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-2">CCNA Certification Trainer</h1>
                <p className="text-cyan-100 text-lg font-medium">Master Cisco networking fundamentals • Complete exam preparation</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <span className="text-cyan-200 text-sm font-semibold">📚 6 Study Domains</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <span className="text-cyan-200 text-sm font-semibold">❓ 12+ Practice Questions</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <span className="text-cyan-200 text-sm font-semibold">🌐 Interactive Lab Simulations</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <span className="text-cyan-200 text-sm font-semibold">📊 Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mt-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* Study Guides Tab */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 sticky top-6">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Study Domains</h2>
                <div className="space-y-2">
                  {Object.entries(studyGuides).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedCategory(key); setExpandedTopic(null); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                        selectedCategory === key
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                          : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span>{category.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-3">
                  <span className="text-4xl">{studyGuides[selectedCategory].icon}</span>
                  {studyGuides[selectedCategory].title}
                </h2>
                
                <div className="space-y-3">
                  {studyGuides[selectedCategory].topics.map(topic => (
                    <div key={topic.id} className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                      <button
                        onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                        className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-800/50 transition-all"
                      >
                        <span className="font-bold text-lg text-cyan-300">{topic.title}</span>
                        {expandedTopic === topic.id ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                      </button>
                      
                      {expandedTopic === topic.id && (
                        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-700">
                          <div className="prose prose-invert prose-cyan max-w-none">
                            {topic.content.split('\n\n').map((paragraph, idx) => {
                              if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
                                return <h4 key={idx} className="text-xl font-bold text-cyan-400 mt-6 mb-3">{paragraph.replace(/\*\*/g, '').replace(':', '')}</h4>;
                              } else if (paragraph.startsWith('-')) {
                                return (
                                  <ul key={idx} className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                                    {paragraph.split('\n').map((item, i) => (
                                      <li key={i} className="leading-relaxed">{item.replace(/^- /, '')}</li>
                                    ))}
                                  </ul>
                                );
                              } else {
                                return <p key={idx} className="text-slate-300 leading-relaxed mb-4">{paragraph}</p>;
                              }
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Practice Questions Tab */}
        {activeTab === 'practice' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
              {!examMode ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-cyan-400">Choose Practice Mode</h2>
                    <p className="text-slate-300 mb-8">Select how you want to study</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => { setExamMode(false); setCurrentQuestionIndex(0); }}
                        className="bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 p-8 rounded-2xl border border-cyan-400/30 transition-all transform hover:scale-105 shadow-xl"
                      >
                        <div className="text-6xl mb-4">📖</div>
                        <h3 className="text-2xl font-bold mb-2">Topic-by-Topic</h3>
                        <p className="text-cyan-100">Practice questions by category with immediate feedback</p>
                      </button>
                      
                      <button
                        onClick={() => { setExamMode(true); setExamStarted(false); setExamCompleted(false); }}
                        className="bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 p-8 rounded-2xl border border-orange-400/30 transition-all transform hover:scale-105 shadow-xl"
                      >
                        <div className="text-6xl mb-4">⏱️</div>
                        <h3 className="text-2xl font-bold mb-2">Timed Exam</h3>
                        <p className="text-orange-100">Random questions to simulate the real CCNA exam</p>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {!examStarted ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">🎯</div>
                      <h2 className="text-3xl font-bold mb-4 text-orange-400">Ready for Your Practice Exam?</h2>
                      <p className="text-slate-300 mb-8 text-lg">You'll have {Math.min(12, allQuestions.length)} questions covering all CCNA topics.</p>
                      <div className="flex gap-4 justify-center">
                        <button onClick={startExam} className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                          Start Exam
                        </button>
                        <button onClick={() => setExamMode(false)} className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-lg transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : examCompleted ? (
                    <div className="text-center py-12">
                      <div className="text-7xl mb-6">{score >= Math.floor(activeExamQuestions.length * 0.8) ? '🎉' : score >= Math.floor(activeExamQuestions.length * 0.6) ? '👍' : '📚'}</div>
                      <h2 className="text-4xl font-bold mb-4 text-cyan-400">Exam Complete!</h2>
                      <div className="text-6xl font-bold mb-6 text-orange-400">{score} / {activeExamQuestions.length}</div>
                      <p className="text-2xl text-slate-300 mb-8">{Math.round((score / activeExamQuestions.length) * 100)}% Score</p>
                      <div className="flex gap-4 justify-center">
                        <button onClick={() => { setExamMode(false); setExamStarted(false); setExamCompleted(false); }} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg">
                          Back to Practice
                        </button>
                        <button onClick={() => { setExamCompleted(false); startExam(); }} className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all">
                          <RefreshCw size={20} className="inline mr-2" />Retake Exam
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <Clock size={24} className="text-orange-400" />
                            <span className="text-2xl font-bold text-orange-400">Question {currentQuestionIndex + 1} / {activeExamQuestions.length}</span>
                          </div>
                          <button onClick={submitExam} className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg">
                            Submit Exam
                          </button>
                        </div>
                        
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
                          <div className="bg-gradient-to-r from-orange-600 to-red-600 h-3 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / activeExamQuestions.length) * 100}%` }} />
                        </div>
                      </div>
                      
                      {activeExamQuestions[currentQuestionIndex] && (
                        <div>
                          <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="bg-orange-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                                {currentQuestionIndex + 1}
                              </div>
                              <p className="text-xl font-semibold leading-relaxed">{activeExamQuestions[currentQuestionIndex].question}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                            {activeExamQuestions[currentQuestionIndex].options.map((option, idx) => {
                              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                              
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: idx })}
                                  className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                                    isSelected
                                      ? 'bg-cyan-600/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-slate-500'
                                    }`}>
                                      {isSelected && <Check size={16} className="text-white" />}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          
                          <div className="flex justify-between">
                            <button
                              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                              disabled={currentQuestionIndex === 0}
                              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ← Previous
                            </button>
                            <button
                              onClick={() => setCurrentQuestionIndex(Math.min(activeExamQuestions.length - 1, currentQuestionIndex + 1))}
                              disabled={currentQuestionIndex === activeExamQuestions.length - 1}
                              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              
              {/* Topic Practice Mode */}
              {!examMode && filteredQuestions.length > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Filter by Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => { setSelectedCategory(e.target.value); setCurrentQuestionIndex(0); setSelectedAnswers({}); setShowExplanation({}); }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {Object.entries(studyGuides).map(([key, category]) => (
                        <option key={key} value={key}>{category.icon} {category.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-cyan-400">Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
                      <span className={`px-4 py-2 rounded-lg font-bold ${
                        filteredQuestions[currentQuestionIndex].difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
                        filteredQuestions[currentQuestionIndex].difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {filteredQuestions[currentQuestionIndex].difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }} />
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700">
                    <p className="text-xl font-semibold mb-1 leading-relaxed">{filteredQuestions[currentQuestionIndex].question}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {filteredQuestions[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                      const isCorrect = idx === filteredQuestions[currentQuestionIndex].correctAnswer;
                      const showResult = showExplanation[currentQuestionIndex];
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => { if (!showResult) setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: idx }); }}
                          disabled={showResult}
                          className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                            showResult
                              ? isCorrect ? 'bg-green-600/20 border-green-500' : isSelected ? 'bg-red-600/20 border-red-500' : 'bg-slate-700/30 border-slate-600'
                              : isSelected ? 'bg-cyan-600/20 border-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-slate-700/30 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              showResult ? (isCorrect ? 'border-green-400 bg-green-500' : isSelected ? 'border-red-400 bg-red-500' : 'border-slate-500')
                              : isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-slate-500'
                            }`}>
                              {showResult && isCorrect && <Check size={16} className="text-white" />}
                              {showResult && isSelected && !isCorrect && <X size={16} className="text-white" />}
                              {!showResult && isSelected && <Check size={16} className="text-white" />}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {!showExplanation[currentQuestionIndex] && selectedAnswers[currentQuestionIndex] !== undefined && (
                    <button
                      onClick={() => setShowExplanation({ ...showExplanation, [currentQuestionIndex]: true })}
                      className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg mb-4"
                    >
                      Check Answer
                    </button>
                  )}
                  
                  {showExplanation[currentQuestionIndex] && (
                    <div className={`rounded-xl p-6 mb-6 border-2 ${
                      selectedAnswers[currentQuestionIndex] === filteredQuestions[currentQuestionIndex].correctAnswer
                        ? 'bg-green-600/10 border-green-500'
                        : 'bg-red-600/10 border-red-500'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        {selectedAnswers[currentQuestionIndex] === filteredQuestions[currentQuestionIndex].correctAnswer ? (
                          <>
                            <Check size={28} className="text-green-400" />
                            <span className="text-2xl font-bold text-green-400">Correct!</span>
                          </>
                        ) : (
                          <>
                            <X size={28} className="text-red-400" />
                            <span className="text-2xl font-bold text-red-400">Incorrect</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-200 leading-relaxed">{filteredQuestions[currentQuestionIndex].explanation}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => { if (currentQuestionIndex < filteredQuestions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1); }}
                      disabled={currentQuestionIndex === filteredQuestions.length - 1}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Network Simulation Tab */}
        {activeTab === 'simulate' && <NetworkSimulation />}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
                <BarChart3 size={32} />
                Your Learning Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 border border-cyan-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-100 font-semibold">Questions Answered</span>
                    <Target size={24} className="text-cyan-200" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{Object.keys(selectedAnswers).length}</div>
                  <div className="text-sm text-cyan-200">Practice questions</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 border border-green-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-100 font-semibold">Correct Answers</span>
                    <Check size={24} className="text-green-200" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {Object.keys(selectedAnswers).filter(idx => {
                      const q = allQuestions[parseInt(idx)];
                      return q && selectedAnswers[idx] === q.correctAnswer;
                    }).length}
                  </div>
                  <div className="text-sm text-green-200">Correct responses</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 border border-orange-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-100 font-semibold">Exams Taken</span>
                    <Award size={24} className="text-orange-200" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{progress.exams?.length || 0}</div>
                  <div className="text-sm text-orange-200">Mock exams completed</div>
                </div>
              </div>
              
              {progress.exams && progress.exams.length > 0 ? (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-2xl font-bold mb-6 text-cyan-400">Exam History</h3>
                  <div className="space-y-3">
                    {progress.exams.slice().reverse().map((exam, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-4 flex justify-between items-center border border-slate-700">
                        <div>
                          <div className="font-bold text-lg text-slate-200">Mock Exam #{progress.exams.length - idx}</div>
                          <div className="text-sm text-slate-400">{new Date(exam.date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${exam.percentage >= 80 ? 'text-green-400' : exam.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {exam.percentage}%
                          </div>
                          <div className="text-sm text-slate-400">{exam.score}/{exam.total}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 rounded-xl p-12 border border-slate-700 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-slate-300 mb-2">Ready to Test Your Knowledge?</h3>
                  <p className="text-slate-400 mb-6">Take your first practice exam to track your progress</p>
                  <button
                    onClick={() => { setActiveTab('practice'); setExamMode(true); setExamStarted(false); }}
                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                  >
                    <Zap size={20} />
                    Start Practice Exam
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-slate-400">
        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
          <p className="text-sm mb-2">🎓 <strong className="text-cyan-400">CCNA Certification Trainer</strong> - Your complete study companion</p>
          <p className="text-xs text-slate-500">Built with React • Covers all CCNA 200-301 exam topics • Practice makes perfect!</p>
        </div>
      </div>
    </div>
  );
};

export default CCNATrainer;
