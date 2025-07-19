import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, Download, Upload, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  connections: string[];
  color: string;
  size: 'small' | 'medium' | 'large';
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  color: string;
}

interface MindMappingToolProps {
  onClose?: () => void;
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
];

export const MindMappingTool: React.FC<MindMappingToolProps> = ({ onClose }) => {
  const [nodes, setNodes] = useState<MindMapNode[]>([
    {
      id: '1',
      text: 'Calculus',
      x: 400,
      y: 300,
      connections: ['2', '3', '4'],
      color: COLORS[0],
      size: 'large'
    },
    {
      id: '2',
      text: 'Derivatives',
      x: 200,
      y: 200,
      connections: ['1'],
      color: COLORS[1],
      size: 'medium'
    },
    {
      id: '3',
      text: 'Integrals',
      x: 600,
      y: 200,
      connections: ['1'],
      color: COLORS[2],
      size: 'medium'
    },
    {
      id: '4',
      text: 'Limits',
      x: 400,
      y: 500,
      connections: ['1'],
      color: COLORS[3],
      size: 'medium'
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAddNode, setShowAddNode] = useState(false);
  const [newNodeText, setNewNodeText] = useState('');
  const [newNodeColor, setNewNodeColor] = useState(COLORS[0]);
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1-2',
      from: '1',
      to: '2',
      label: 'includes',
      color: COLORS[0]
    },
    {
      id: '1-3',
      from: '1',
      to: '3',
      label: 'includes',
      color: COLORS[0]
    },
    {
      id: '1-4',
      from: '1',
      to: '4',
      label: 'includes',
      color: COLORS[0]
    }
  ]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<{ from: string; to: string } | null>(null);
  const [connectionLabel, setConnectionLabel] = useState('');

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (nodeId: string) => {
    if (isConnecting && connectionStart && connectionStart !== nodeId) {
      // Complete connection
      setPendingConnection({ from: connectionStart, to: nodeId });
      setShowConnectionModal(true);
      setIsConnecting(false);
      setConnectionStart(null);
    } else {
      // Toggle selection - if already selected, keep it selected
      setSelectedNode(nodeId);
    }
  };

  const handleNodeDoubleClick = (nodeId: string) => {
    setEditingNode(nodeId);
  };

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setIsDragging(true);
      setSelectedNode(nodeId);
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y
      });
    }
  };

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (isDragging && selectedNode) {
      e.preventDefault();
      const newX = Math.max(0, e.clientX - dragOffset.x);
      const newY = Math.max(0, e.clientY - dragOffset.y);
      
      setNodes(prev => prev.map(node => 
        node.id === selectedNode 
          ? { ...node, x: newX, y: newY }
          : node
      ));
    }
  };

  const handleNodeDragEnd = () => {
    setIsDragging(false);
  };

  const handleAddNode = () => {
    if (newNodeText.trim() && selectedNode) {
      const newNode: MindMapNode = {
        id: Date.now().toString(),
        text: newNodeText.trim(),
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100,
        connections: [selectedNode],
        color: newNodeColor,
        size: 'medium'
      };

      setNodes(prev => [
        ...prev,
        newNode,
        ...prev.map(node => 
          node.id === selectedNode 
            ? { ...node, connections: [...node.connections, newNode.id] }
            : node
        )
      ]);

      setNewNodeText('');
      setShowAddNode(false);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedNode(null);
  };

  const handleSaveNode = (nodeId: string, newText: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, text: newText }
        : node
    ));
    setEditingNode(null);
  };

  const handleStartConnection = (nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
    setSelectedNode(nodeId);
  };

  const handleCreateConnection = () => {
    if (pendingConnection) {
      const newConnection: Connection = {
        id: `${pendingConnection.from}-${pendingConnection.to}`,
        from: pendingConnection.from,
        to: pendingConnection.to,
        label: connectionLabel.trim() || undefined,
        color: nodes.find(n => n.id === pendingConnection.from)?.color || COLORS[0]
      };
      
      setConnections(prev => [...prev, newConnection]);
      
      // Update node connections
      setNodes(prev => prev.map(node => {
        if (node.id === pendingConnection.from && !node.connections.includes(pendingConnection.to)) {
          return { ...node, connections: [...node.connections, pendingConnection.to] };
        }
        if (node.id === pendingConnection.to && !node.connections.includes(pendingConnection.from)) {
          return { ...node, connections: [...node.connections, pendingConnection.from] };
        }
        return node;
      }));
      
      setPendingConnection(null);
      setConnectionLabel('');
      setShowConnectionModal(false);
    }
  };

  const handleRemoveConnection = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      setNodes(prev => prev.map(node => ({
        ...node,
        connections: node.connections.filter(c => c !== connection.from && c !== connection.to)
      })));
    }
  };

  const getNodeSize = (size: string) => {
    switch (size) {
      case 'small': return 'w-20 h-20 text-sm';
      case 'large': return 'w-32 h-32 text-lg';
      default: return 'w-24 h-24 text-base';
    }
  };

  const renderConnections = () => {
    const connectionElements: JSX.Element[] = [];
    
    // Render existing connections
    connections.forEach(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        // Calculate center points of nodes
        const fromSize = fromNode.size === 'large' ? 64 : fromNode.size === 'small' ? 40 : 48;
        const toSize = toNode.size === 'large' ? 64 : toNode.size === 'small' ? 40 : 48;
        
        const x1 = fromNode.x + fromSize / 2;
        const y1 = fromNode.y + fromSize / 2;
        const x2 = toNode.x + toSize / 2;
        const y2 = toNode.y + toSize / 2;
        
        // Calculate midpoint for label
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        connectionElements.push(
          <g key={connection.id}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={connection.color}
              strokeWidth="3"
              opacity="0.8"
              strokeDasharray="5,5"
              className="cursor-pointer hover:opacity-100 transition-opacity duration-300"
              onClick={() => handleRemoveConnection(connection.id)}
            />
            {connection.label && (
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-white pointer-events-none"
                style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
              >
                {connection.label}
              </text>
            )}
          </g>
        );
      }
    });
    
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {connectionElements}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Mind Mapping Tool</h1>
              <p className="text-gray-300">Create interactive concept maps for your subjects</p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
              >
                <Save className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Canvas */}
      <div className="relative mb-6">
        <GlassCard className="p-4">
          <div
            ref={canvasRef}
            className="relative w-full h-96 bg-glass-100/20 rounded-lg overflow-hidden"
            onMouseMove={handleNodeDrag}
            onMouseUp={handleNodeDragEnd}
            onMouseLeave={handleNodeDragEnd}
            onClick={() => {
              if (!isConnecting) {
                setSelectedNode(null);
              }
            }}
          >
            {/* Connections */}
            {renderConnections()}

            {/* Nodes */}
            {nodes.map(node => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                className={`absolute ${getNodeSize(node.size)} ${isDragging && selectedNode === node.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: node.x,
                  top: node.y,
                  zIndex: selectedNode === node.id ? 10 : 2
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging) {
                    handleNodeClick(node.id);
                  }
                }}
                onDoubleClick={() => handleNodeDoubleClick(node.id)}
                onMouseDown={(e) => handleNodeDragStart(e, node.id)}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center text-white font-medium shadow-lg border-2 transition-all duration-300 ${
                    selectedNode === node.id ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: node.color }}
                >
                  {editingNode === node.id ? (
                    <input
                      type="text"
                      value={node.text}
                      onChange={(e) => {
                        setNodes(prev => prev.map(n => 
                          n.id === node.id ? { ...n, text: e.target.value } : n
                        ));
                      }}
                      onBlur={() => handleSaveNode(node.id, node.text)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveNode(node.id, node.text);
                        }
                      }}
                      className="bg-transparent text-white text-center font-medium outline-none border-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-center px-2">{node.text}</span>
                  )}
                </div>

                {/* Node Controls */}
                {selectedNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-1"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNode(node.id);
                      }}
                      className="p-1 bg-blue-500 rounded text-white"
                      title="Edit node"
                    >
                      <Edit3 className="w-3 h-3" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartConnection(node.id);
                      }}
                      className="p-1 bg-green-500 rounded text-white"
                      title="Connect to another node"
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="p-1 bg-red-500 rounded text-white"
                      title="Delete node"
                    >
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddNode(true)}
          disabled={!selectedNode}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Node</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsConnecting(!isConnecting);
            setConnectionStart(null);
          }}
          className={`px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 ${
            isConnecting 
              ? 'bg-gradient-to-r from-orange-400 to-red-400' 
              : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>{isConnecting ? 'Cancel Connection' : 'Connect Nodes'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setNodes([]);
            setConnections([]);
          }}
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Clear All
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <GlassCard className="p-4 max-w-2xl mx-auto">
          <h3 className="text-white font-semibold mb-2">How to use:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>
              <div className="font-medium text-blue-400">Select & Move</div>
              <p>Click to select, drag to move nodes</p>
            </div>
            <div>
              <div className="font-medium text-green-400">Edit & Connect</div>
              <p>Double-click to edit, use + button to connect</p>
            </div>
            <div>
              <div className="font-medium text-purple-400">Visualize</div>
              <p>Create labeled connections between concepts</p>
            </div>
            <div>
              <div className="font-medium text-orange-400">Manage</div>
              <p>Click connections to remove them</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Add Node Modal */}
      <AnimatePresence>
        {showAddNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddNode(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 w-96">
                <h3 className="text-xl font-bold text-white mb-4">Add New Node</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Node Text</label>
                    <input
                      type="text"
                      value={newNodeText}
                      onChange={(e) => setNewNodeText(e.target.value)}
                      className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter concept name..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Color</label>
                    <div className="flex space-x-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewNodeColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                            newNodeColor === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddNode}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Add Node
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddNode(false)}
                      className="flex-1 px-4 py-2 bg-glass-100/50 rounded-lg text-white font-semibold hover:bg-glass-200/50 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Modal */}
      <AnimatePresence>
        {showConnectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowConnectionModal(false);
              setPendingConnection(null);
              setConnectionLabel('');
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 w-96">
                <h3 className="text-xl font-bold text-white mb-4">Create Connection</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Connection Label (Optional)</label>
                    <input
                      type="text"
                      value={connectionLabel}
                      onChange={(e) => setConnectionLabel(e.target.value)}
                      className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="e.g., 'leads to', 'includes', 'depends on'..."
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>Connecting: <span className="text-blue-400">{nodes.find(n => n.id === pendingConnection?.from)?.text}</span> → <span className="text-green-400">{nodes.find(n => n.id === pendingConnection?.to)?.text}</span></p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateConnection}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Create Connection
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowConnectionModal(false);
                        setPendingConnection(null);
                        setConnectionLabel('');
                      }}
                      className="flex-1 px-4 py-2 bg-glass-100/50 rounded-lg text-white font-semibold hover:bg-glass-200/50 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 