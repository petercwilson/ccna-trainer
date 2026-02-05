// Navigation types
export type TabId = 'study' | 'practice' | 'lab' | 'simulator' | 'progress';

export interface NavItem {
  id: TabId;
  label: string;
}

export interface TopBarProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

// Device types for Packet Tracer
export type DeviceType = 'router' | 'switch' | 'pc' | 'server';

export interface Device {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  hostname: string;
  interfaces: NetworkInterface[];
  config: DeviceConfig;
}

export interface NetworkInterface {
  name: string;
  ip?: string;
  subnet?: string;
  vlan?: number;
  gateway?: string;
  status: 'up' | 'down';
}

export interface DeviceConfig {
  runningConfig: string[];
  startupConfig: string[];
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: number;
  toPort: number;
}

// Quiz types
export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExamResult {
  date: string;
  score: number;
  total: number;
  percentage: number;
}

export interface Progress {
  exams?: ExamResult[];
}

// Error Boundary types
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  friendlyMessage?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export interface InlineErrorFallbackProps {
  message?: string;
}

// Packet types
export type PacketType = 'icmp' | 'tcp' | 'udp';

export interface Packet {
  id: string;
  type: PacketType;
  source: string;
  destination: string;
  path: string[];
  currentStep: number;
}

// Study Guide types
export interface StudyContentBlock {
  type: 'heading' | 'list' | 'rows' | 'table';
  text?: string;
  items?: string[];
  rows?: string[][];
}

export interface StudyTopic {
  id: string;
  title: string;
  content: StudyContentBlock[];
}

export interface StudyGuideCategory {
  title: string;
  topics: StudyTopic[];
}

export interface StudyGuides {
  [key: string]: StudyGuideCategory;
}

// Component Props
export interface PacketTracerProps {}

export interface TopologyCanvasProps {
  devices: Device[];
  connections: Connection[];
  packets: Packet[];
  onDeviceClick: (device: Device) => void;
  onDeviceAdd: (type: DeviceType, position: { x: number; y: number }) => Device | null;
  onDeviceDelete: (deviceId: string) => void;
  onConnect: (device1Id: string, device2Id: string, port1: number, port2: number) => void;
  selectedDevice: Device | null;
}

export interface DeviceCLIProps {
  device: Device;
  onExecuteCommand: (command: string) => CommandResult;
  onClose: () => void;
  onSendPacket: (sourceId: string, destIp: string, type?: PacketType) => string[];
}

export interface CommandResult {
  output: string;
  error: boolean;
  configChanged?: boolean;
  updatedDevice?: Device;
}

export interface PacketAnimationProps {
  packets: Packet[];
  devices: Device[];
}

export interface StudyGuideProps {}

export interface StudyContentProps {
  blocks: StudyContentBlock[];
}

export interface TopicAccordionProps {
  topics: StudyTopic[];
  openTopic: string | null;
  onToggle: (topicId: string | null) => void;
}

export interface DomainListProps {
  domains: StudyGuides;
  activeCategory: string;
  onSelect: (category: string) => void;
}

export interface NetworkLabProps {}

// Topology types for NetworkLab
export interface TopologyDevice {
  id: number;
  type: DeviceType;
  x: number;
  y: number;
  label: string;
  config: string;
}

export interface TopologyLink {
  from: number;
  to: number;
  label: string;
}
