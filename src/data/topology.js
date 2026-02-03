export const topoDevices = [
  { id:1, type:'router', label:'R1',   x:12, y:45, config:'hostname R1\n!\ninterface Gi0/0\n ip address 10.1.1.1 255.255.255.0\n no shutdown\n!\nrouter ospf 1\n network 10.1.1.0 0.0.0.255 area 0' },
  { id:2, type:'switch', label:'SW1',  x:42, y:45, config:'hostname SW1\n!\nvlan 10\n name SALES\nvlan 20\n name ENGINEERING\n!\ninterface Gi0/1\n switchport mode trunk' },
  { id:3, type:'pc',     label:'PC1',  x:28, y:78, config:'hostname PC1\nIP:      10.1.10.10\nMask:    255.255.255.0\nGW:      10.1.1.1\nVLAN:    10 (SALES)' },
  { id:4, type:'pc',     label:'PC2',  x:56, y:78, config:'hostname PC2\nIP:      10.1.20.10\nMask:    255.255.255.0\nGW:      10.1.1.1\nVLAN:    20 (ENGINEERING)' },
  { id:5, type:'server', label:'SRV1', x:72, y:45, config:'hostname SRV1\n!\ninterface Gi0/0\n ip address 10.1.1.100 255.255.255.0\n no shutdown\n!\nip dhcp pool SALES\n network 10.1.10.0 255.255.255.0\n default-router 10.1.1.1' },
];

export const topoLinks = [
  { from:1, to:2, label:'Gi0/0' },
  { from:2, to:3, label:'Fa0/2' },
  { from:2, to:4, label:'Fa0/3' },
  { from:2, to:5, label:'Gi0/4' },
];
