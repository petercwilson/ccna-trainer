import React, { useState, useRef, useEffect } from 'react';

/**
 * CLI Terminal for configuring devices
 * Simulates Cisco IOS command-line interface
 */
export const DeviceCLI = ({ device, onExecuteCommand, onClose, onSendPacket }) => {
  const [history, setHistory] = useState([
    { type: 'output', text: `Connected to ${device.hostname}` },
    { type: 'output', text: 'Type "?" for help\n' }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

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
  const handleSubmit = (e) => {
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
  const handleKeyDown = (e) => {
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
  const quickCommands = [
    { label: 'Show Config', cmd: 'show running-config' },
    { label: 'Show IP', cmd: 'show ip interface brief' },
    { label: 'Show Int', cmd: 'show interfaces' },
    { label: 'Help', cmd: '?' }
  ];

  return (
    <div className="device-cli" role="complementary" aria-label="Device CLI Terminal">
      <div className="cli-header">
        <div className="cli-title">
          <span className="cli-device-name">{device.hostname}</span>
          <span className="cli-device-type">{device.type}</span>
        </div>
        <button
          className="cli-close"
          onClick={onClose}
          aria-label="Close CLI terminal"
          title="Close Terminal"
        >
          ×
        </button>
      </div>

      <div className="cli-quick-commands">
        {quickCommands.map((qc, idx) => (
          <button
            key={idx}
            className="btn btn-xs btn-outline"
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
        className="cli-terminal"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {history.map((entry, idx) => (
          <div key={idx} className={`cli-line cli-${entry.type}`}>
            {entry.text.split('\n').map((line, lineIdx) => (
              <div key={lineIdx}>{line || '\u00A0'}</div>
            ))}
          </div>
        ))}

        {/* Command input */}
        <form onSubmit={handleSubmit} className="cli-input-form">
          <span className="cli-prompt">{device.hostname}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="cli-input"
            autoComplete="off"
            spellCheck="false"
            aria-label="Command input"
          />
        </form>
      </div>

      <div className="cli-footer">
        <div className="cli-hints">
          <span>↑↓ Command history</span>
          <span>Tab: Autocomplete</span>
          <span>?: Help</span>
        </div>
      </div>
    </div>
  );
};
