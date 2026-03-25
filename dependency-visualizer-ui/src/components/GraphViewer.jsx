import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getGraph } from '../services/api';

const GraphViewer = ({ projectId }) => {
  const [idToLoad, setIdToLoad] = useState(projectId || '');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) setIdToLoad(projectId);
  }, [projectId]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleLoadGraph = async (e) => {
    e?.preventDefault();
    if (!idToLoad) {
      setError('Please provide a Project ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getGraph(idToLoad);
      
      // Transform incoming graph data to ReactFlow structure
      // Layout them in a simple grid
      const cols = Math.ceil(Math.sqrt(data.nodes.length));
      
      const newNodes = data.nodes.map((nodeName, index) => {
        const x = (index % cols) * 250;
        const y = Math.floor(index / cols) * 150;
        return {
          id: nodeName,
          position: { x, y },
          data: { label: nodeName },
          style: {
            background: '#fff',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }
        };
      });

      const newEdges = data.edges.map((edge, index) => ({
        id: `e${index}-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      setError('Failed to load dependency graph.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">3. Dependency Graph</h2>
      <form onSubmit={handleLoadGraph} className="flex gap-4 mb-4">
        <input
          type="number"
          value={idToLoad}
          onChange={(e) => setIdToLoad(e.target.value)}
          placeholder="Project ID..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-colors"
        >
          {loading ? 'Loading graph...' : 'Load Graph'}
        </button>
      </form>

      {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div className="h-[600px] w-full border border-gray-200 rounded-lg overflow-hidden mt-4 bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphViewer;
