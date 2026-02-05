import React, { useState, useRef, useEffect } from 'react';
import type { DeviceCLIProps } from '../../types';

interface HistoryEntry {
  type: 'output' | 'command' | 'error';
  text: string;
}

interface QuickCommand {
  label: string;
  cmd: string;
}

/**
 * CLI Terminal for configuring devices
 * Simulates Cisco IOS command-line interface
 */
export const DeviceCLI: React.FC<DeviceCLIProps> = ({ device, onExecuteCommand, onClose, onSendPacket }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: `Connected to ${device.hostname}` },
    { type: 'output', text: 'Type "?" for help\n' }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const command = input.trim();
    if (!command) return;

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', text: `${device.hostname}> ${command}` }]);
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');

    // Execute command
    const result = onExecuteCommand(command);

    // Add output to history
    setHistory(prev => [...prev, {
      type: result.error ? 'error' : 'output',
      text: result.output
    }]);

    // Handle special commands
    if (command.toLowerCase().startsWith('ping ')) {
      const ip = command.split(' ')[1];
      // Trigger packet animation
      setTimeout(() => {
        onSendPacket(device.id, ip, 'icmp');
      }, 500);
    }
  };

  // Handle keyboard navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const suggestions = [
        'show running-config',
        'show ip interface brief',
        'show interfaces',
        'show version',
        'configure terminal',
        'ping',
        'traceroute',
        'enable',
        'exit',
        'hostname',
        'interface',
        'ip address',
        'no shutdown'
      ];

      const matches = suggestions.filter(s => s.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `Possible completions:\n  ${matches.join('\n  ')}`
        }]);
      }
    }
  };

  // Quick command buttons
  const quickCommands: QuickCommand[] = [
    { label: 'Show Config', cmd: 'show running-config' },
    { label: 'Show IP', cmd: 'show ip interface brief' },
    { label: 'Show Int', cmd: 'show interfaces' },
    { label: 'Help', cmd: '?' }
  ];

  return (
    <div
      className="flex flex-col w-96 bg-navy-dark border border-navy rounded-lg overflow-hidden"
      role="complementary"
      aria-label="Device CLI Terminal"
    >
      <div className="flex items-center justify-between bg-navy-mid border-b border-navy px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-text font-semibold">{device.hostname}</span>
          <span className="px-2 py-0.5 bg-navy-lite text-gold text-xs font-mono rounded">
            {device.type}
          </span>
        </div>
        <button
          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-danger transition-colors text-xl leading-none"
          onClick={onClose}
          aria-label="Close CLI terminal"
          title="Close Terminal"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-2 bg-navy-mid border-b border-navy px-4 py-2">
        {quickCommands.map((qc, idx) => (
          <button
            key={idx}
            className="px-2 py-1 text-xs bg-transparent hover:bg-navy-lite text-text border border-navy rounded transition-colors"
            onClick={() => {
              setInput(qc.cmd);
              inputRef.current?.focus();
            }}
            title={qc.cmd}
          >
            {qc.label}
          </button>
        ))}
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto bg-navy-dark p-4 font-mono text-sm h-96"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {history.map((entry, idx) => (
          <div
            key={idx}
            className={`mb-1 ${
              entry.type === 'command'
                ? 'text-gold'
                : entry.type === 'error'
                ? 'text-danger'
                : 'text-text-muted'
            }`}
          >
            {entry.text.split('\n').map((line, lineIdx) => (
              <div key={lineIdx}>{line || '\u00A0'}</div>
            ))}
          </div>
        ))}

        {/* Command input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-2">
          <span className="text-gold">{device.hostname}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-text outline-none border-none"
            autoComplete="off"
            spellCheck="false"
            aria-label="Command input"
          />
        </form>
      </div>

      <div className="bg-navy-mid border-t border-navy px-4 py-2">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>↑↓ Command history</span>
          <span>Tab: Autocomplete</span>
          <span>?: Help</span>
        </div>
      </div>
    </div>
  );
};
