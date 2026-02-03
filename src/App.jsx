import React, { useState, useEffect } from 'react';

/* ══════════════════════════ DATA ══════════════════════════════ */
const studyGuides = {
  'network-fundamentals': {
    title: 'Network Fundamentals',
    topics: [
      { id: 'osi-model', title: 'OSI Model & TCP/IP',
        content: [
          { type:'heading', text:'OSI Model — 7 Layers' },
          { type:'rows', rows:[
            ['Layer 7','Application','HTTP, FTP, SMTP, DNS'],
            ['Layer 6','Presentation','Encryption, compression'],
            ['Layer 5','Session','Session management'],
            ['Layer 4','Transport','TCP, UDP'],
            ['Layer 3','Network','IP routing, logical addressing'],
            ['Layer 2','Data Link','MAC, frame switching'],
            ['Layer 1','Physical','Raw bit transmission'],
          ]},
          { type:'heading', text:'TCP/IP Model — 4 Layers' },
          { type:'list', items:['Application (OSI 5–7)','Transport (OSI 4)','Internet (OSI 3)','Network Access (OSI 1–2)'] },
          { type:'heading', text:'Key Protocols' },
          { type:'list', items:['Application: HTTP(S), FTP, SMTP, DNS, DHCP, SNMP','Transport: TCP (connection-oriented), UDP (connectionless)','Network: IP, ICMP, ARP, OSPF, EIGRP','Data Link: Ethernet, PPP, Frame Relay'] },
        ]
      },
      { id: 'ip-addressing', title: 'IP Addressing & Subnetting',
        content: [
          { type:'heading', text:'IPv4 Structure' },
          { type:'list', items:['32-bit address in 4 octets (e.g. 192.168.1.1)','Network portion + Host portion','Subnet mask sets the boundary'] },
          { type:'heading', text:'Private IP Ranges' },
          { type:'rows', rows:[['10.0.0.0/8','Class A','Large networks'],['172.16.0.0/12','Class B','Medium networks'],['192.168.0.0/16','Class C','Small networks']] },
          { type:'heading', text:'Subnet Quick Reference' },
          { type:'rows', rows:[['/ 24','256 addr','254 usable'],['/ 25','128 addr','126 usable'],['/ 26','64 addr','62 usable'],['/ 27','32 addr','30 usable'],['/ 28','16 addr','14 usable'],['/ 29','8 addr','6 usable'],['/ 30','4 addr','2 usable (P2P)']] },
        ]
      }
    ]
  },
  'routing': {
    title: 'IP Routing',
    topics: [{ id:'routing-basics', title:'Routing Fundamentals',
      content: [
        { type:'heading', text:'Routing Process' },
        { type:'list', items:['1. Receive packet on incoming interface','2. De-encapsulate Layer 2 frame','3. Examine destination IP','4. Consult routing table → best match','5. Encapsulate in new L2 frame','6. Forward out the correct interface'] },
        { type:'heading', text:'Administrative Distance (lower = trusted)' },
        { type:'rows', rows:[['Directly Connected','0','Most trusted'],['Static Route','1','Manual'],['EIGRP Summary','5',''],['eBGP','20','External'],['EIGRP Internal','90',''],['OSPF','110','Link-state'],['RIP','120','Distance vector']] },
      ]
    }]
  },
  'switching': {
    title: 'Switching Technologies',
    topics: [{ id:'vlans', title:'VLANs & Trunking',
      content: [
        { type:'heading', text:'VLAN Benefits' },
        { type:'list', items:['Broadcast domain segmentation','Security through isolation','Simplified management','Flexible network design'] },
        { type:'heading', text:'VLAN Types' },
        { type:'rows', rows:[['Data VLAN','User traffic','Standard'],['Voice VLAN','IP phones','QoS priority'],['Management VLAN','Switch mgmt','Isolated'],['Native VLAN','Untagged trunk','Default: VLAN 1']] },
        { type:'heading', text:'Trunking' },
        { type:'list', items:['Carries multiple VLANs on one link','802.1Q — industry standard, single native VLAN'] },
      ]
    }]
  },
  'security': {
    title: 'Network Security',
    topics: [{ id:'acls', title:'Access Control Lists (ACLs)',
      content: [
        { type:'heading', text:'ACL Types' },
        { type:'rows', rows:[['Standard','1–99, 1300–1999','Source IP only — apply near destination'],['Extended','100–199, 2000–2699','Src/Dst IP, protocol, port — apply near source']] },
        { type:'heading', text:'Common Port Numbers' },
        { type:'rows', rows:[['FTP','20 / 21','File transfer'],['SSH','22','Secure shell'],['Telnet','23','Remote access'],['HTTP','80','Web'],['HTTPS','443','Secure web']] },
      ]
    }]
  },
  'automation': {
    title: 'Network Automation',
    topics: [{ id:'rest-apis', title:'REST APIs & JSON',
      content: [
        { type:'heading', text:'HTTP Methods' },
        { type:'rows', rows:[['GET','Retrieve data','Read-only, idempotent'],['POST','Create resource','New entry'],['PUT','Update resource','Replace entry'],['DELETE','Remove resource','Permanent']] },
        { type:'heading', text:'JSON' },
        { type:'list', items:['Human-readable key-value format','Used in REST APIs','Supports nested objects & arrays'] },
      ]
    }]
  },
  'wireless': {
    title: 'Wireless Networking',
    topics: [{ id:'wireless-fund', title:'Wireless Fundamentals',
      content: [
        { type:'heading', text:'802.11 Standards' },
        { type:'rows', rows:[['Wi-Fi 4','802.11n','2.4 / 5 GHz — 600 Mbps'],['Wi-Fi 5','802.11ac','5 GHz only — 6.9 Gbps'],['Wi-Fi 6','802.11ax','2.4 / 5 GHz — 9.6 Gbps']] },
        { type:'heading', text:'Frequency Bands' },
        { type:'list', items:['2.4 GHz: 14 channels, longer range, more interference','5 GHz: many channels, less interference, shorter range'] },
        { type:'heading', text:'Security Protocols' },
        { type:'rows', rows:[['WEP','Deprecated','Easily cracked'],['WPA2','AES / CCMP','Current standard'],['WPA3','SAE','Next-gen, enhanced']] },
      ]
    }]
  },
};

const examQuestions = [
  { id:1,  category:'network-fundamentals', difficulty:'easy',   question:'At which OSI layer does a router operate?',                                          options:['Layer 1 (Physical)','Layer 2 (Data Link)','Layer 3 (Network)','Layer 4 (Transport)'],                                                   correctAnswer:2, explanation:'Routers operate at Layer 3 (Network). They forward packets based on destination IP and maintain routing tables.' },
  { id:2,  category:'network-fundamentals', difficulty:'medium', question:'How many usable host addresses are in a /26 subnet?',                              options:['30','62','126','254'],                                                                                                                          correctAnswer:1, explanation:'A /26 has 6 host bits → 2⁶ = 64 addresses. Minus network + broadcast = 62 usable hosts.' },
  { id:3,  category:'network-fundamentals', difficulty:'easy',   question:'Which protocol uses UDP port 69?',                                                 options:['FTP','TFTP','HTTP','Telnet'],                                                                                                                    correctAnswer:1, explanation:'TFTP (Trivial File Transfer Protocol) uses UDP port 69 for config and IOS image transfers.' },
  { id:4,  category:'switching',            difficulty:'medium', question:'What STP port state neither forwards frames nor learns MACs?',                     options:['Disabled','Blocking','Listening','Learning'],                                                                                                   correctAnswer:1, explanation:'Blocking receives BPDUs but does not forward or learn — it prevents loops until topology changes.' },
  { id:5,  category:'switching',            difficulty:'hard',   question:'Which command restricts a trunk to VLANs 10, 20 and 30?',                        options:['switchport trunk vlan 10,20,30','switchport trunk allowed vlan 10,20,30','switchport trunk permit vlan 10,20,30','vlan trunk allowed 10,20,30'], correctAnswer:1, explanation:'"switchport trunk allowed vlan 10,20,30" explicitly permits only those VLANs on the trunk.' },
  { id:6,  category:'routing',              difficulty:'medium', question:'What is the administrative distance of OSPF?',                                     options:['90','100','110','120'],                                                                                                                         correctAnswer:2, explanation:'OSPF = 110. Lower AD is more trusted: Connected 0, Static 1, EIGRP 90, OSPF 110, RIP 120.' },
  { id:7,  category:'routing',              difficulty:'hard',   question:'What must be true for an EIGRP route to be a feasible successor?',               options:['Reported Distance < Feasible Distance','Feasible Distance < Reported Distance','Metric equals successor metric','AD lower than OSPF'],           correctAnswer:0, explanation:'Feasibility condition: RD < FD. This guarantees the route is loop-free and can serve as a backup path.' },
  { id:8,  category:'switching',            difficulty:'medium', question:'What is the default native VLAN on Cisco switches?',                             options:['VLAN 0','VLAN 1','VLAN 10','VLAN 1005'],                                                                                                        correctAnswer:1, explanation:'VLAN 1 is the default native VLAN. Best practice: change it to an unused VLAN to prevent hopping attacks.' },
  { id:9,  category:'security',             difficulty:'medium', question:'What happens in port security "restrict" violation mode?',                       options:['Port shuts down, needs manual fix','Packets dropped + violation logged','All traffic allowed but logged','Port security disabled'],           correctAnswer:1, explanation:'Restrict drops bad packets, logs violations, and sends SNMP traps — but keeps the port up.' },
  { id:10, category:'security',             difficulty:'hard',   question:'Which feature depends on DHCP snooping being enabled?',                         options:['Port Security','Dynamic ARP Inspection (DAI)','PortFast','BPDU Guard'],                                                                      correctAnswer:1, explanation:'DAI uses the DHCP snooping binding table to validate ARP packets and stop ARP spoofing.' },
  { id:11, category:'wireless',             difficulty:'medium', question:'Which 802.11 standard is 5 GHz-only and reaches 6.9 Gbps?',                    options:['802.11n (Wi-Fi 4)','802.11ac (Wi-Fi 5)','802.11ax (Wi-Fi 6)','802.11g'],                                                                      correctAnswer:1, explanation:'802.11ac (Wi-Fi 5) operates only at 5 GHz and supports up to 6.9 Gbps via MU-MIMO.' },
  { id:12, category:'automation',           difficulty:'medium', question:'Which HTTP method retrieves data without modifying it?',                        options:['POST','PUT','GET','DELETE'],                                                                                                                     correctAnswer:2, explanation:'GET is read-only and idempotent — repeating the request yields the same result.' },
];

const topoDevices = [
  { id:1, type:'router', label:'R1',   x:12, y:45, config:'hostname R1\n!\ninterface Gi0/0\n ip address 10.1.1.1 255.255.255.0\n no shutdown\n!\nrouter ospf 1\n network 10.1.1.0 0.0.0.255 area 0' },
  { id:2, type:'switch', label:'SW1',  x:42, y:45, config:'hostname SW1\n!\nvlan 10\n name SALES\nvlan 20\n name ENGINEERING\n!\ninterface Gi0/1\n switchport mode trunk' },
  { id:3, type:'pc',     label:'PC1',  x:28, y:78, config:'hostname PC1\nIP:      10.1.10.10\nMask:    255.255.255.0\nGW:      10.1.1.1\nVLAN:    10 (SALES)' },
  { id:4, type:'pc',     label:'PC2',  x:56, y:78, config:'hostname PC2\nIP:      10.1.20.10\nMask:    255.255.255.0\nGW:      10.1.1.1\nVLAN:    20 (ENGINEERING)' },
  { id:5, type:'server', label:'SRV1', x:72, y:45, config:'hostname SRV1\n!\ninterface Gi0/0\n ip address 10.1.1.100 255.255.255.0\n no shutdown\n!\nip dhcp pool SALES\n network 10.1.10.0 255.255.255.0\n default-router 10.1.1.1' },
];
const topoLinks = [
  { from:1, to:2, label:'Gi0/0' },
  { from:2, to:3, label:'Fa0/2' },
  { from:2, to:4, label:'Fa0/3' },
  { from:2, to:5, label:'Gi0/4' },
];

/* ══════════════════════════ STYLES ════════════════════════════ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Share+Tech+Mono&display=swap');

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --navy:      #00204d;
  --navy-dark: #011839;
  --navy-mid:  #0a2744;
  --navy-lite: #162d4a;
  --gold:      #f2c434;
  --gold-dark: #c9a01a;
  --white:     #ffffff;
  --off-white: #eef1f4;
  --muted:     #7a95b0;
  --border:    #1a3555;
  --green:     #1ea86a;
  --green-bg:  rgba(30,168,106,.12);
  --red:       #d93025;
  --red-bg:    rgba(217,48,37,.12);
  --amber:     #e8a012;
  --amber-bg:  rgba(232,160,18,.12);
}

html, body {
  min-height:100%;
  background:var(--navy-dark);
  color:var(--off-white);
  font-family:'Source Sans 3', sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
::-webkit-scrollbar       { width:8px; }
::-webkit-scrollbar-track { background:var(--navy-dark); }
::-webkit-scrollbar-thumb { background:var(--navy-lite); }

/* ═══ TOP NAV BAR ═══ */
.topbar {
  background:var(--navy-dark);
  border-bottom:1px solid var(--border);
  position:sticky; top:0; z-index:100;
}
.topbar-inner {
  max-width:1200px; margin:0 auto;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 28px; height:68px;
}
.topbar-logo {
  display:flex; align-items:center; gap:14px;
}
.topbar-logo-text {
  font-family:'Oswald',sans-serif;
  font-size:20px; font-weight:600;
  color:var(--white);
  text-transform:uppercase;
  letter-spacing:2.5px;
  line-height:1;
}
.topbar-logo-text span {
  display:block;
  font-size:10px; font-weight:400;
  letter-spacing:3px;
  color:var(--muted);
  margin-top:3px;
}
.topbar-nav { display:flex; gap:2px; }
.topbar-nav button {
  background:none; border:none;
  font-family:'Oswald',sans-serif;
  font-size:14px; font-weight:500;
  color:var(--muted);
  text-transform:uppercase;
  letter-spacing:1.8px;
  padding:8px 16px;
  cursor:pointer;
  border-radius:4px;
  transition:color .15s, background .15s;
  position:relative;
}
.topbar-nav button:hover { color:var(--white); background:rgba(255,255,255,.06); }
.topbar-nav button.active { color:var(--white); background:rgba(255,255,255,.1); }
.topbar-nav button.active::after {
  content:''; position:absolute; bottom:0; left:16px; right:16px;
  height:3px; background:var(--gold); border-radius:2px 2px 0 0;
}

/* ═══ GOLD STRIPE ═══ */
.gold-stripe { height:4px; background:var(--gold); }

/* ═══ HERO ═══ */
.hero {
  background:linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 50%, #003366 100%);
  padding:48px 28px 44px;
  position:relative; overflow:hidden;
}
.hero::before {
  content:''; position:absolute; inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 90% 50%, rgba(0,51,102,.55) 0%, transparent 70%),
    radial-gradient(ellipse 40% 80% at 5% 80%, rgba(0,32,77,.5) 0%, transparent 60%);
  pointer-events:none;
}
.hero-inner {
  max-width:1200px; margin:0 auto;
  position:relative; z-index:1;
  display:flex; align-items:center; gap:40px;
}
.hero-content { flex:1; }
.hero-content h1 {
  font-family:'Oswald',sans-serif;
  font-size:52px; font-weight:700;
  color:var(--white);
  text-transform:uppercase;
  letter-spacing:2px;
  line-height:1.05;
  margin-bottom:14px;
}
.hero-content h1 em { font-style:normal; color:var(--gold); }
.hero-content p {
  font-size:18px; font-weight:300;
  color:var(--muted); line-height:1.5;
  max-width:540px;
}
.hero-badges { display:flex; gap:10px; flex-wrap:wrap; margin-top:22px; }
.hero-badge {
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.15);
  color:var(--off-white);
  font-family:'Oswald',sans-serif;
  font-size:13px; font-weight:500;
  text-transform:uppercase; letter-spacing:1.5px;
  padding:6px 16px; border-radius:3px;
}
.hero-emblem { flex-shrink:0; }

/* ═══ SHELL ═══ */
.shell { max-width:1200px; margin:0 auto; padding:32px 28px 80px; }

/* ═══ SECTION HEADER ═══ */
.section-hdr { margin-bottom:24px; border-bottom:2px solid var(--border); }
.section-hdr h2 {
  font-family:'Oswald',sans-serif;
  font-size:22px; font-weight:600;
  color:var(--white);
  text-transform:uppercase;
  letter-spacing:2px;
  padding-bottom:12px;
  border-bottom:3px solid var(--gold);
  display:inline-block;
  margin-bottom:-2px;
}

/* ═══ CARDS ═══ */
.card { background:var(--navy-mid); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
.card-head {
  background:var(--navy); border-bottom:1px solid var(--border);
  padding:14px 22px;
  display:flex; align-items:center; justify-content:space-between;
}
.card-head h3 {
  font-family:'Oswald',sans-serif;
  font-size:16px; font-weight:600;
  color:var(--white);
  text-transform:uppercase; letter-spacing:1.8px;
}
.card-body { padding:22px; }

/* ═══ STUDY GRID ═══ */
.study-grid { display:grid; grid-template-columns:240px 1fr; gap:20px; }
@media(max-width:700px){ .study-grid { grid-template-columns:1fr; } }

.domain-list { display:flex; flex-direction:column; }
.domain-btn {
  display:flex; align-items:center; gap:12px;
  padding:13px 18px;
  background:transparent; border:none;
  border-bottom:1px solid var(--border);
  color:var(--muted);
  font-family:'Source Sans 3',sans-serif;
  font-size:15px; font-weight:600;
  cursor:pointer; text-align:left; width:100%;
  transition:background .15s, color .15s;
}
.domain-btn:first-child { border-top:1px solid var(--border); }
.domain-btn:hover { background:rgba(255,255,255,.04); color:var(--white); }
.domain-btn.active {
  background:var(--navy-dark); color:var(--gold);
  border-left:3px solid var(--gold); padding-left:15px;
}
.domain-btn .d-num {
  font-family:'Share Tech Mono',monospace;
  font-size:11px; color:var(--muted); width:22px; flex-shrink:0;
}
.domain-btn.active .d-num { color:var(--gold); }

/* ═══ ACCORDION ═══ */
.accord { border-bottom:1px solid var(--border); }
.accord:last-child { border-bottom:none; }
.accord-head {
  display:flex; justify-content:space-between; align-items:center;
  padding:15px 0; background:none; border:none; width:100%;
  cursor:pointer; color:var(--off-white);
  font-family:'Source Sans 3',sans-serif; font-size:16px; font-weight:600;
  text-align:left; transition:color .15s;
}
.accord-head:hover { color:var(--gold); }
.accord-head .chevr { font-size:10px; color:var(--muted); transition:transform .2s; flex-shrink:0; }
.accord-head.open { color:var(--gold); }
.accord-head.open .chevr { transform:rotate(90deg); }
.accord-body { padding:0 0 20px; animation:fadeDown .2s ease; }
@keyframes fadeDown { from{ opacity:0; transform:translateY(-6px); } to{ opacity:1; transform:translateY(0); } }

/* ═══ CONTENT ═══ */
.c-heading {
  font-family:'Oswald',sans-serif; font-size:14px; font-weight:600;
  color:var(--gold); text-transform:uppercase; letter-spacing:1.5px;
  margin:18px 0 10px; padding-bottom:6px; border-bottom:1px solid var(--border);
}
.c-heading:first-child { margin-top:0; }
.c-list { list-style:none; padding:0; }
.c-list li { padding:5px 0 5px 20px; position:relative; font-size:15px; color:var(--off-white); line-height:1.55; }
.c-list li::before { content:'▸'; position:absolute; left:0; color:var(--gold); font-size:13px; }
.c-table { width:100%; border-collapse:collapse; margin:4px 0; }
.c-table tr { border-bottom:1px solid rgba(26,53,85,.6); }
.c-table tr:last-child { border-bottom:none; }
.c-table tr:nth-child(even) { background:rgba(0,0,0,.12); }
.c-table td { padding:7px 12px; font-size:14px; vertical-align:top; }
.c-table td:first-child { font-family:'Share Tech Mono',monospace; color:var(--gold); font-weight:600; white-space:nowrap; width:1%; }
.c-table td:nth-child(2) { color:var(--white); font-weight:600; }
.c-table td:nth-child(3) { color:var(--muted); }

/* ═══ MODE CARDS ═══ */
.mode-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
@media(max-width:540px){ .mode-grid { grid-template-columns:1fr; } }
.mode-card {
  background:var(--navy-mid); border:2px solid var(--border);
  border-radius:6px; padding:32px 24px; text-align:center;
  cursor:pointer; transition:border-color .2s, transform .15s;
}
.mode-card:hover { border-color:var(--gold); transform:translateY(-2px); }
.mode-card .mc-icon {
  width:52px; height:52px; margin:0 auto 16px;
  background:var(--navy-dark); border:2px solid var(--border); border-radius:50%;
  display:flex; align-items:center; justify-content:center;
}
.mode-card .mc-icon svg { width:24px; height:24px; }
.mode-card h3 {
  font-family:'Oswald',sans-serif; font-size:19px; font-weight:600;
  color:var(--white); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:6px;
}
.mode-card p { font-size:14px; color:var(--muted); }

/* ═══ QUESTION ═══ */
.q-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.q-counter { font-family:'Share Tech Mono',monospace; font-size:13px; color:var(--muted); }
.q-badge {
  font-family:'Oswald',sans-serif; font-size:11px; font-weight:600;
  letter-spacing:1.2px; text-transform:uppercase; padding:3px 12px; border-radius:3px;
}
.q-badge.easy   { background:var(--green-bg); color:var(--green); border:1px solid rgba(30,168,106,.3); }
.q-badge.medium { background:var(--amber-bg); color:var(--amber); border:1px solid rgba(232,160,18,.3); }
.q-badge.hard   { background:var(--red-bg);   color:var(--red);   border:1px solid rgba(217,48,37,.3); }

.progress-track { height:4px; background:var(--navy-dark); margin-bottom:22px; overflow:hidden; }
.progress-fill  { height:100%; background:var(--gold); transition:width .35s; }

.q-text {
  font-size:17px; font-weight:600; color:var(--white); line-height:1.5;
  padding:20px 22px; border-radius:4px;
  background:var(--navy-dark); border-left:4px solid var(--gold); margin-bottom:20px;
}

.options { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
.opt {
  display:flex; align-items:center; gap:14px;
  padding:14px 18px; border-radius:4px;
  border:2px solid var(--border); background:var(--navy-dark);
  color:var(--off-white); font-size:15px;
  cursor:pointer; transition:all .15s; text-align:left;
  font-family:'Source Sans 3',sans-serif;
}
.opt:hover:not([disabled]) { border-color:var(--muted); background:rgba(255,255,255,.04); }
.opt.sel     { border-color:var(--gold);  background:rgba(242,196,52,.08); color:var(--white); }
.opt.correct { border-color:var(--green); background:var(--green-bg);      color:var(--white); }
.opt.wrong   { border-color:var(--red);   background:var(--red-bg);        color:var(--white); }
.opt[disabled] { cursor:default; }
.opt-radio {
  width:22px; height:22px; border-radius:50%;
  border:2px solid var(--border); background:var(--navy-mid);
  display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s;
}
.opt.sel     .opt-radio { border-color:var(--gold);  background:var(--gold); }
.opt.correct .opt-radio { border-color:var(--green); background:var(--green); }
.opt.wrong   .opt-radio { border-color:var(--red);   background:var(--red); }
.opt-radio svg { width:12px; height:12px; }

/* ═══ FEEDBACK ═══ */
.feedback { padding:18px 20px; border-radius:4px; margin-bottom:18px; animation:fadeDown .2s ease; border-left:4px solid transparent; }
.feedback.correct { background:var(--green-bg); border-left-color:var(--green); }
.feedback.wrong   { background:var(--red-bg);   border-left-color:var(--red); }
.feedback-head { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.feedback-head strong { font-size:15px; font-family:'Oswald',sans-serif; text-transform:uppercase; letter-spacing:1px; }
.feedback.correct .feedback-head strong { color:var(--green); }
.feedback.wrong   .feedback-head strong { color:var(--red); }
.feedback p { font-size:14px; color:var(--off-white); line-height:1.55; }

/* ═══ BUTTONS ═══ */
.btn {
  padding:11px 26px; border-radius:4px; border:none;
  font-family:'Oswald',sans-serif; font-size:15px; font-weight:600;
  text-transform:uppercase; letter-spacing:1.8px;
  cursor:pointer; transition:all .15s;
}
.btn:hover  { filter:brightness(1.1); transform:translateY(-1px); }
.btn:active { transform:translateY(0); }
.btn-gold   { background:var(--gold); color:var(--navy-dark); box-shadow:0 3px 10px rgba(242,196,52,.3); }
.btn-gold:hover { background:#f5d05a; }
.btn-outline { background:transparent; color:var(--white); border:2px solid var(--muted); }
.btn-outline:hover { border-color:var(--white); }
.btn-green  { background:var(--green); color:#fff; }
.btn-ghost  { background:var(--navy-dark); color:var(--off-white); border:1px solid var(--border); font-size:13px; padding:9px 20px; }
.btn-ghost:hover { border-color:var(--muted); }
.btn-ghost[disabled] { opacity:.3; cursor:default; filter:none; transform:none; }
.btn-full { width:100%; }
.btn-row { display:flex; justify-content:space-between; gap:8px; margin-top:20px; }

/* ═══ SELECT ═══ */
.sel-wrap { margin-bottom:20px; position:relative; }
.sel-wrap select {
  width:100%; padding:11px 40px 11px 16px; border-radius:4px; appearance:none;
  border:2px solid var(--border); background:var(--navy-dark);
  color:var(--white); font-family:'Source Sans 3',sans-serif; font-size:15px; font-weight:600; cursor:pointer;
}
.sel-wrap select:focus { outline:none; border-color:var(--gold); }
.sel-wrap select option { background:var(--navy-dark); color:#fff; }
.sel-wrap::after { content:'▾'; position:absolute; right:16px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }

/* ═══ NETWORK LAB ═══ */
.lab-canvas {
  position:relative; width:100%; aspect-ratio:16/7;
  background:var(--navy-dark); border:1px solid var(--border); border-radius:4px;
  overflow:hidden; margin-bottom:16px;
}
.lab-canvas svg.topo-svg { position:absolute; inset:0; width:100%; height:100%; }
.device {
  position:absolute; display:flex; flex-direction:column; align-items:center;
  transform:translate(-50%,-50%); cursor:pointer; transition:transform .18s; user-select:none;
}
.device:hover { transform:translate(-50%,-50%) scale(1.12); }
.device .dv-wrap {
  width:50px; height:50px; border-radius:6px;
  background:var(--navy-mid); border:2px solid var(--border);
  display:flex; align-items:center; justify-content:center; transition:all .18s;
}
.device.sel .dv-wrap { border-color:var(--gold); box-shadow:0 0 0 3px rgba(242,196,52,.25); }
.device .dv-label {
  margin-top:6px; font-family:'Oswald',sans-serif;
  font-size:11px; font-weight:600; letter-spacing:1.5px;
  text-transform:uppercase; color:var(--muted);
}
.device.sel .dv-label { color:var(--gold); }
.topo-link-label { font-size:9px; font-weight:600; fill:var(--gold); font-family:'Share Tech Mono',monospace; }

/* ═══ CONFIG PANEL ═══ */
.cfg-panel { margin-bottom:16px; border:1px solid var(--border); border-radius:4px; overflow:hidden; animation:fadeDown .18s ease; }
.cfg-panel-head {
  background:var(--navy-dark); border-bottom:1px solid var(--border);
  padding:10px 16px; display:flex; justify-content:space-between; align-items:center;
}
.cfg-panel-head span { font-family:'Oswald',sans-serif; font-size:13px; font-weight:600; color:var(--gold); text-transform:uppercase; letter-spacing:1.5px; }
.cfg-panel-head button { background:none; border:none; color:var(--muted); font-size:20px; cursor:pointer; line-height:1; }
.cfg-panel-head button:hover { color:var(--white); }
.cfg-code { background:var(--navy-dark); padding:16px 18px; font-family:'Share Tech Mono',monospace; font-size:13px; color:var(--green); line-height:1.8; white-space:pre; overflow-x:auto; }
.palette { display:flex; gap:6px; }
.palette-item {
  flex:1; padding:10px 4px; border-radius:4px;
  border:1px solid var(--border); background:var(--navy-dark);
  cursor:pointer; text-align:center;
  font-family:'Oswald',sans-serif; font-size:11px; font-weight:500;
  color:var(--muted); letter-spacing:1px; text-transform:uppercase; transition:all .15s;
}
.palette-item:hover { border-color:var(--gold); color:var(--gold); }

/* ═══ STATS ═══ */
.stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
@media(max-width:500px){ .stats-grid { grid-template-columns:1fr; } }
.stat-card { background:var(--navy-dark); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
.stat-card-top { height:4px; }
.stat-card-top.blue  { background:var(--gold); }
.stat-card-top.green { background:var(--green); }
.stat-card-top.amber { background:var(--amber); }
.stat-card-inner { padding:18px 20px; }
.stat-card-label { font-family:'Oswald',sans-serif; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:1.8px; color:var(--muted); margin-bottom:8px; }
.stat-card .s-val { font-family:'Oswald',sans-serif; font-size:38px; font-weight:700; line-height:1; }
.stat-card.blue  .s-val { color:var(--gold); }
.stat-card.green .s-val { color:var(--green); }
.stat-card.amber .s-val { color:var(--amber); }
.stat-card .s-sub { font-size:13px; color:var(--muted); margin-top:4px; }
.history-row { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border); background:var(--navy-dark); }
.history-row:last-child { border-bottom:none; }
.history-row .hr-title { font-size:15px; font-weight:600; color:var(--white); }
.history-row .hr-date  { font-size:12px; color:var(--muted); margin-top:2px; font-family:'Share Tech Mono',monospace; }
.history-row .hr-score { font-family:'Oswald',sans-serif; font-size:24px; font-weight:700; }
.history-row .hr-sub   { font-size:12px; color:var(--muted); text-align:right; margin-top:2px; font-family:'Share Tech Mono',monospace; }
.hr-score.pass { color:var(--green); }
.hr-score.mid  { color:var(--amber); }
.hr-score.fail { color:var(--red); }

/* ═══ CENTERED STATES ═══ */
.centered { text-align:center; padding:56px 24px 40px; }
.centered .c-icon { margin-bottom:18px; }
.centered .c-icon svg { width:56px; height:56px; }
.centered h2 { font-family:'Oswald',sans-serif; font-size:24px; font-weight:600; color:var(--white); text-transform:uppercase; letter-spacing:2px; margin-bottom:10px; }
.centered p { font-size:15px; color:var(--muted); margin-bottom:24px; max-width:460px; margin-left:auto; margin-right:auto; }
.centered .btn-group { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
.exam-result .big { font-family:'Oswald',sans-serif; font-size:64px; font-weight:700; color:var(--gold); margin:8px 0; }
.exam-result .pct { font-size:17px; color:var(--muted); margin-bottom:28px; }
.exam-nav { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.exam-nav .en-left { font-family:'Share Tech Mono',monospace; font-size:13px; color:var(--muted); }

/* ═══ FOOTER STRIPE ═══ */
.footer-stripe { height:6px; background:linear-gradient(90deg, var(--navy-dark) 0%, var(--gold) 30%, var(--gold) 70%, var(--navy-dark) 100%); position:fixed; bottom:0; left:0; right:0; z-index:50; }
`;

/* ══════════════════════════ DEVICE ICONS ══════════════════════ */
const DevIcon = ({ type }) => {
  if (type === 'router') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="9" width="22" height="10" rx="2" stroke="#f2c434" strokeWidth="1.8" fill="none"/>
      <circle cx="8" cy="14" r="2" fill="#f2c434"/><circle cx="14" cy="14" r="2" fill="#f2c434"/><circle cx="20" cy="14" r="2" fill="#1ea86a"/>
      <line x1="7" y1="9" x2="7" y2="5" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="21" y1="9" x2="21" y2="5" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="7" y1="19" x2="7" y2="23" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="21" y1="19" x2="21" y2="23" stroke="#f2c434" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
  if (type === 'switch') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="10" width="22" height="8" rx="2" stroke="#f2c434" strokeWidth="1.8" fill="none"/>
      {[6,9,12,15,18,21].map((x,i) => <rect key={i} x={x-1} y="12.5" width="2" height="5" rx=".8" fill={i<4?'#f2c434':'#7a95b0'}/>)}
      <line x1="6" y1="10" x2="6" y2="6" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="10" x2="22" y2="6" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="18" x2="6" y2="22" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="18" x2="22" y2="22" stroke="#f2c434" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (type === 'pc') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="3" width="20" height="14" rx="2" stroke="#f2c434" strokeWidth="1.8" fill="none"/>
      <rect x="6" y="5" width="16" height="10" rx=".8" fill="#011839"/>
      <rect x="11" y="17" width="6" height="3" fill="#7a95b0"/>
      <rect x="8" y="20" width="12" height="2.8" rx="1.4" stroke="#f2c434" strokeWidth="1.3" fill="none"/>
      <circle cx="14" cy="9" r="2" fill="#f2c434" opacity=".6"/>
    </svg>
  );
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="7" y="2" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="1.5" fill="none"/>
      <rect x="7" y="11" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="1.5" fill="none"/>
      <rect x="7" y="20" width="14" height="6" rx="1.5" stroke="#f2c434" strokeWidth="1.5" fill="none"/>
      <circle cx="11" cy="5" r="1.5" fill="#1ea86a"/><circle cx="11" cy="14" r="1.5" fill="#1ea86a"/><circle cx="11" cy="23" r="1.5" fill="#e8a012"/>
    </svg>
  );
};

/* ══════════════════════════ CONTENT RENDERER ══════════════════ */
function renderContent(blocks) {
  return blocks.map((b, i) => {
    if (b.type === 'heading') return <div key={i} className="c-heading">{b.text}</div>;
    if (b.type === 'list')    return <ul key={i} className="c-list">{b.items.map((it,j)=><li key={j}>{it}</li>)}</ul>;
    if (b.type === 'rows' || b.type === 'table') return (
      <table key={i} className="c-table"><tbody>{b.rows.map((r,j)=><tr key={j}>{r.map((c,k)=><td key={k}>{c}</td>)}</tr>)}</tbody></table>
    );
    return null;
  });
}

/* ══════════════════════════ NETWORK LAB ═══════════════════════ */
function NetworkLab() {
  const [sel, setSel] = useState(null);
  const W = 1000, H = 440;
  const px = p => W * p / 100;
  const py = p => H * p / 100;
  return (
    <>
      <div className="lab-canvas">
        <svg className="topo-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f2c434" stopOpacity=".5"/><stop offset="100%" stopColor="#7a95b0" stopOpacity=".4"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          {topoLinks.map((lk, i) => {
            const f=topoDevices.find(d=>d.id===lk.from), t=topoDevices.find(d=>d.id===lk.to);
            const x1=px(f.x),y1=py(f.y),x2=px(t.x),y2=py(t.y),mx=(x1+x2)/2,my=(y1+y2)/2;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lg1)" strokeWidth="2" strokeDasharray="8 4" filter="url(#glow)"/>
                <rect x={mx-22} y={my-10} width="44" height="20" rx="3" fill="#0a2744" stroke="#1a3555" strokeWidth="1"/>
                <text x={mx} y={my+5} textAnchor="middle" className="topo-link-label">{lk.label}</text>
              </g>
            );
          })}
        </svg>
        {topoDevices.map(d => (
          <div key={d.id} className={`device${sel===d.id?' sel':''}`} style={{left:`${d.x}%`,top:`${d.y}%`}} onClick={()=>setSel(sel===d.id?null:d.id)}>
            <div className="dv-wrap"><DevIcon type={d.type}/></div>
            <div className="dv-label">{d.label}</div>
          </div>
        ))}
      </div>
      {sel !== null && (() => {
        const dev = topoDevices.find(d=>d.id===sel);
        return (
          <div className="cfg-panel">
            <div className="cfg-panel-head"><span>{dev.label} — Configuration</span><button onClick={()=>setSel(null)}>&times;</button></div>
            <div className="cfg-code">{dev.config}</div>
          </div>
        );
      })()}
      <div className="palette">{['Router','Switch','PC','Server'].map(t=><div key={t} className="palette-item">{t}</div>)}</div>
    </>
  );
}

/* ══════════════════════════ MAIN APP ══════════════════════════ */
export default function CCNATrainer() {
  const [tab, setTab]         = useState('study');
  const [cat, setCat]         = useState('network-fundamentals');
  const [openTopic, setOpen]  = useState(null);
  const [tpIdx, setTpIdx]     = useState(0);
  const [tpAns, setTpAns]     = useState({});
  const [tpShow, setTpShow]   = useState({});
  const [examMode, setExamMode]       = useState(false);
  const [examQs, setExamQs]           = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examDone, setExamDone]       = useState(false);
  const [exIdx, setExIdx]             = useState(0);
  const [exAns, setExAns]             = useState({});
  const [exScore, setExScore]         = useState(0);
  const [progress, setProgress] = useState(()=>{
    try{ const s=localStorage.getItem('ccna-progress'); return s?JSON.parse(s):{}; } catch(e){ return {}; }
  });
  useEffect(()=>{ localStorage.setItem('ccna-progress', JSON.stringify(progress)); }, [progress]);

  const filteredQs = examQuestions.filter(q => q.category === cat);
  const startExam = () => {
    setExamQs([...examQuestions].sort(()=>Math.random()-.5).slice(0,12));
    setExamStarted(true); setExamDone(false); setExIdx(0); setExAns({});
  };
  const submitExam = () => {
    let c=0; examQs.forEach((q,i)=>{ if(exAns[i]===q.correctAnswer) c++; });
    setExScore(c); setExamDone(true);
    const p={...progress}; if(!p.exams) p.exams=[];
    p.exams.push({ date:new Date().toISOString(), score:c, total:examQs.length, percentage:Math.round(c/examQs.length*100) });
    setProgress(p);
  };

  const ShieldSVG = ({ size=56, opacity=1 }) => (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" opacity={opacity}>
      <path d="M28 4L6 14v16c0 12.5 9.5 23.5 22 26 12.5-2.5 22-13.5 22-26V14L28 4z" stroke="#f2c434" strokeWidth="2" fill="none"/>
      <path d="M28 12L12 19v11c0 9 7 17.5 16 19.5 9-2 16-10.5 16-19.5V19L28 12z" stroke="#f2c434" strokeWidth="1" fill="rgba(242,196,52,.06)"/>
      <text x="28" y="33" textAnchor="middle" fill="#f2c434" fontFamily="Oswald,sans-serif" fontSize="16" fontWeight="700">CC</text>
      <text x="28" y="41" textAnchor="middle" fill="#7a95b0" fontFamily="Share Tech Mono,monospace" fontSize="6.5">CCNA</text>
    </svg>
  );

  const navDefs = [
    { id:'study',label:'Study' },{ id:'practice',label:'Quiz' },{ id:'lab',label:'Network Lab' },{ id:'progress',label:'Stats' }
  ];

  const renderOpt = (option, idx, { isExam, revealed, answerIdx, correctIdx, onPick }) => {
    let cls = 'opt';
    if (isExam) { if (answerIdx===idx) cls+=' sel'; }
    else { if (revealed) { if (idx===correctIdx) cls+=' correct'; else if (idx===answerIdx) cls+=' wrong'; } else if (answerIdx===idx) cls+=' sel'; }
    const showCheck = (revealed && idx===correctIdx) || (!revealed && answerIdx===idx);
    const showX     = revealed && idx===answerIdx && idx!==correctIdx;
    return (
      <button key={idx} className={cls} disabled={!isExam && !!revealed} onClick={()=>onPick(idx)}>
        <div className="opt-radio">
          {showCheck && !showX && <svg viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          {showX && <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>}
        </div>
        {option}
      </button>
    );
  };

  /* ═══ RENDER ═══ */
  return (
    <div>
      <style>{STYLE}</style>

      {/* nav */}
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="topbar-logo">
            <ShieldSVG size={38}/>
            <div className="topbar-logo-text">CCNA Trainer<span>Certification Preparation</span></div>
          </div>
          <div className="topbar-nav">
            {navDefs.map(n => <button key={n.id} className={tab===n.id?'active':''} onClick={()=>setTab(n.id)}>{n.label}</button>)}
          </div>
        </div>
      </nav>
      <div className="gold-stripe"/>

      {/* hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <h1>Master the <em>Network.</em><br/>Ace the Exam.</h1>
            <p>A comprehensive CCNA 200-301 preparation platform. Study six core domains, practice with real exam questions, and simulate live network topologies.</p>
            <div className="hero-badges">
              <span className="hero-badge">6 Domains</span>
              <span className="hero-badge">12+ Questions</span>
              <span className="hero-badge">Network Lab</span>
              <span className="hero-badge">Progress Tracking</span>
            </div>
          </div>
          <div className="hero-emblem"><ShieldSVG size={140} opacity={0.22}/></div>
        </div>
      </div>

      {/* content */}
      <div className="shell">

        {/* STUDY */}
        {tab === 'study' && (
          <>
            <div className="section-hdr"><h2>Study Guides</h2></div>
            <div className="study-grid">
              <div className="card">
                <div className="card-head"><h3>Domains</h3></div>
                <div className="domain-list">
                  {Object.entries(studyGuides).map(([k,v],i) => (
                    <button key={k} className={`domain-btn${cat===k?' active':''}`} onClick={()=>{setCat(k);setOpen(null);}}>
                      <span className="d-num">{String(i+1).padStart(2,'0')}</span>{v.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-head"><h3>{studyGuides[cat].title}</h3></div>
                <div className="card-body">
                  {studyGuides[cat].topics.map(t => (
                    <div key={t.id} className="accord">
                      <button className={`accord-head${openTopic===t.id?' open':''}`} onClick={()=>setOpen(openTopic===t.id?null:t.id)}>
                        <span>{t.title}</span><span className="chevr">&#9654;</span>
                      </button>
                      {openTopic===t.id && <div className="accord-body">{renderContent(t.content)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* PRACTICE */}
        {tab === 'practice' && (() => {
          if (examMode) {
            if (!examStarted) return (
              <>
                <div className="section-hdr"><h2>Practice Exam</h2></div>
                <div className="card"><div className="centered">
                  <div className="c-icon"><svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke="#f2c434" strokeWidth="2.5"/><path d="M28 14v14l9 5" stroke="#f2c434" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <h2>Ready for a Practice Exam?</h2>
                  <p>12 shuffled questions drawn from all CCNA domains. Answers are locked until you submit.</p>
                  <div className="btn-group">
                    <button className="btn btn-gold" onClick={startExam}>Begin Exam</button>
                    <button className="btn btn-outline" onClick={()=>setExamMode(false)}>Cancel</button>
                  </div>
                </div></div>
              </>
            );
            if (examDone) return (
              <>
                <div className="section-hdr"><h2>Exam Results</h2></div>
                <div className="card"><div className="centered exam-result">
                  <div className="c-icon"><svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke={exScore>=10?'#1ea86a':'#e8a012'} strokeWidth="2.5"/><path d="M16 28l8 8 16-16" stroke={exScore>=10?'#1ea86a':'#e8a012'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <h2>Exam Complete</h2>
                  <div className="big">{exScore} / {examQs.length}</div>
                  <div className="pct">{Math.round(exScore/examQs.length*100)}% — {exScore>=10?'Excellent Work':'Keep Studying'}</div>
                  <div className="btn-group">
                    <button className="btn btn-gold" onClick={()=>{setExamMode(false);setExamStarted(false);setExamDone(false);}}>Back to Quiz</button>
                    <button className="btn btn-outline" onClick={()=>{setExamDone(false);startExam();}}>Retake</button>
                  </div>
                </div></div>
              </>
            );
            const q = examQs[exIdx];
            return (
              <>
                <div className="section-hdr"><h2>Practice Exam</h2></div>
                <div className="card">
                  <div className="card-head"><h3>Question {exIdx+1} of {examQs.length}</h3><button className="btn btn-green" onClick={submitExam}>Submit Exam</button></div>
                  <div className="card-body">
                    <div className="progress-track"><div className="progress-fill" style={{width:`${(exIdx+1)/examQs.length*100}%`}}/></div>
                    <div className="q-text">{q.question}</div>
                    <div className="options">{q.options.map((o,i) => renderOpt(o,i,{ isExam:true, answerIdx:exAns[exIdx], onPick:i=>setExAns({...exAns,[exIdx]:i}) }))}</div>
                    <div className="btn-row">
                      <button className="btn btn-ghost" disabled={exIdx===0} onClick={()=>setExIdx(exIdx-1)}>← Previous</button>
                      <button className="btn btn-ghost" disabled={exIdx===examQs.length-1} onClick={()=>setExIdx(exIdx+1)}>Next →</button>
                    </div>
                  </div>
                </div>
              </>
            );
          }
          const q = filteredQs[tpIdx];
          return (
            <>
              <div className="section-hdr"><h2>Practice</h2></div>
              <div className="mode-grid">
                <div className="mode-card" onClick={()=>setExamMode(false)}>
                  <div className="mc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#f2c434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-1H2z"/><path d="M22 3h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-1h6z"/></svg></div>
                  <h3>Topic by Topic</h3><p>Instant feedback after each answer</p>
                </div>
                <div className="mode-card" onClick={()=>{setExamMode(true);setExamStarted(false);setExamDone(false);}}>
                  <div className="mc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#f2c434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                  <h3>Timed Exam</h3><p>Simulate the real CCNA exam</p>
                </div>
              </div>
              {filteredQs.length > 0 && (
                <div className="card">
                  <div className="card-head"><h3>Topic Practice</h3></div>
                  <div className="card-body">
                    <div className="sel-wrap">
                      <select value={cat} onChange={e=>{setCat(e.target.value);setTpIdx(0);setTpAns({});setTpShow({});}}>
                        {Object.entries(studyGuides).map(([k,v])=><option key={k} value={k}>{v.title}</option>)}
                      </select>
                    </div>
                    <div className="q-meta"><span className="q-counter">{tpIdx+1} / {filteredQs.length}</span><span className={`q-badge ${q.difficulty}`}>{q.difficulty}</span></div>
                    <div className="progress-track"><div className="progress-fill" style={{width:`${(tpIdx+1)/filteredQs.length*100}%`}}/></div>
                    <div className="q-text">{q.question}</div>
                    <div className="options">{q.options.map((o,i) => renderOpt(o,i,{ isExam:false, revealed:!!tpShow[tpIdx], answerIdx:tpAns[tpIdx], correctIdx:q.correctAnswer, onPick:i=>{ if(!tpShow[tpIdx]) setTpAns({...tpAns,[tpIdx]:i}); } }))}</div>
                    {tpAns[tpIdx]!==undefined && !tpShow[tpIdx] && <button className="btn btn-gold btn-full" onClick={()=>setTpShow({...tpShow,[tpIdx]:true})}>Check Answer</button>}
                    {tpShow[tpIdx] && (
                      <div className={`feedback ${tpAns[tpIdx]===q.correctAnswer?'correct':'wrong'}`}>
                        <div className="feedback-head"><strong>{tpAns[tpIdx]===q.correctAnswer?'Correct':'Incorrect'}</strong></div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                    <div className="btn-row">
                      <button className="btn btn-ghost" disabled={tpIdx===0} onClick={()=>setTpIdx(tpIdx-1)}>← Previous</button>
                      <button className="btn btn-ghost" disabled={tpIdx===filteredQs.length-1} onClick={()=>setTpIdx(tpIdx+1)}>Next →</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* LAB */}
        {tab === 'lab' && (
          <>
            <div className="section-hdr"><h2>Network Lab</h2></div>
            <div className="card">
              <div className="card-head"><h3>Topology Simulator — Click a Device</h3></div>
              <div className="card-body"><NetworkLab/></div>
            </div>
          </>
        )}

        {/* PROGRESS */}
        {tab === 'progress' && (() => {
          const totalAns=Object.keys(tpAns).length;
          const totalRight=Object.keys(tpAns).filter(i=>{ const q=examQuestions[parseInt(i)]; return q&&tpAns[i]===q.correctAnswer; }).length;
          return (
            <>
              <div className="section-hdr"><h2>Progress & Stats</h2></div>
              <div className="stats-grid">
                <div className="stat-card blue"><div className="stat-card-top blue"/><div className="stat-card-inner"><div className="stat-card-label">Questions Answered</div><div className="s-val">{totalAns}</div><div className="s-sub">Total attempts</div></div></div>
                <div className="stat-card green"><div className="stat-card-top green"/><div className="stat-card-inner"><div className="stat-card-label">Correct Answers</div><div className="s-val">{totalRight}</div><div className="s-sub">Right answers</div></div></div>
                <div className="stat-card amber"><div className="stat-card-top amber"/><div className="stat-card-inner"><div className="stat-card-label">Exams Taken</div><div className="s-val">{progress.exams?.length||0}</div><div className="s-sub">Completed</div></div></div>
              </div>
              <div className="card">
                <div className="card-head"><h3>Exam History</h3></div>
                {progress.exams && progress.exams.length>0 ? progress.exams.slice().reverse().map((e,i) => (
                  <div key={i} className="history-row">
                    <div><div className="hr-title">Mock Exam #{progress.exams.length-i}</div><div className="hr-date">{new Date(e.date).toLocaleDateString()}</div></div>
                    <div style={{textAlign:'right'}}><div className={`hr-score ${e.percentage>=80?'pass':e.percentage>=60?'mid':'fail'}`}>{e.percentage}%</div><div className="hr-sub">{e.score} / {e.total}</div></div>
                  </div>
                )) : (
                  <div className="centered">
                    <div className="c-icon"><svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke="#7a95b0" strokeWidth="2"/><path d="M22 28h12M28 22v12" stroke="#7a95b0" strokeWidth="2.5" strokeLinecap="round"/></svg></div>
                    <h2>No Exams Yet</h2>
                    <p>Take a practice exam to start tracking your performance over time.</p>
                    <button className="btn btn-gold" onClick={()=>{setTab('practice');setExamMode(true);setExamStarted(false);}}>Start Practice Exam</button>
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </div>
      <div className="footer-stripe"/>
    </div>
  );
}
