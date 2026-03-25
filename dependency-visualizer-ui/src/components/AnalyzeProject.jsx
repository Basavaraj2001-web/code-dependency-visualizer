import React, { useState } from 'react';
import { getCycles } from '../services/api';

const AnalyzeProject = ({ projectId }) => {
  const [idToAnalyze, setIdToAnalyze] = useState(projectId || '');
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Update local state if prop changes
  React.useEffect(() => {
    if (projectId) setIdToAnalyze(projectId);
  }, [projectId]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!idToAnalyze) {
      setError('Please provide a Project ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasAnalyzed(false);

    try {
      const data = await getCycles(idToAnalyze);
      setCycles(data.cycles || []);
      setHasAnalyzed(true);
    } catch (err) {
      setError('Failed to fetch circular dependencies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">2. Analyze Dependencies (Cycles)</h2>
      <form onSubmit={handleAnalyze} className="flex gap-4 mb-4">
        <input
          type="number"
          value={idToAnalyze}
          onChange={(e) => setIdToAnalyze(e.target.value)}
          placeholder="Project ID..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 transition-colors"
        >
          {loading ? 'Analyzing...' : 'Detect Cycles'}
        </button>
      </form>

      {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
      
      {hasAnalyzed && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Cycle Detection Results</h3>
          {cycles.length === 0 ? (
            <p className="text-green-600 font-medium">No circular dependencies found!</p>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600 font-medium">Found {cycles.length} circular dependencies:</p>
              {cycles.map((cycle, i) => (
                <div key={i} className="bg-red-50 p-3 rounded border border-red-100 text-sm font-mono break-all">
                  {cycle.join(' → ')}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzeProject;
