import React, { useState } from 'react';
import { uploadProject } from '../services/api';

const UploadProject = ({ onProjectUploaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a ZIP file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await uploadProject(file);
      setSuccess(`Project uploaded successfully! Project ID: ${data.projectId}`);
      onProjectUploaded(data.projectId);
    } catch (err) {
      setError(err.response?.data || 'Failed to upload project. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">1. Upload Project</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP File Repository
          </label>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
        >
          {loading ? 'Uploading & Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>
      
      {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
      {success && <div className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded">{success}</div>}
    </div>
  );
};

export default UploadProject;
