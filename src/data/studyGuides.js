export const studyGuides = {
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
