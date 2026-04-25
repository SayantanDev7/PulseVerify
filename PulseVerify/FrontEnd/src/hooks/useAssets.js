import { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios.js';

export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/assets');
      
      // Transform backend data to match frontend UI expectations
      const transformedAssets = response.data.map(asset => ({
        id: asset._id,
        title: asset.metadata?.league
          ? `${asset.metadata.league} — ${asset.url.split('/').pop()}`
          : asset.url.split('/').pop() || 'Uploaded Media',
        thumbnail: asset.url,
        type: asset.metadata?.format?.includes('video') ? 'video' : 'image',
        status: asset.status === 'Processing' ? 'Scanning' : (asset.status === 'Verified' ? 'Secure' : 'Violated'),
        violations: 0,
        pulseId: `PV-${asset._id.toString().substring(0, 8).toUpperCase()}`,
        uploadedAt: new Date(asset.createdAt).toLocaleDateString(),
      }));

      setAssets(transformedAssets);
      setError(null);
    } catch (err) {
      console.error("useAssets fetch error:", err);
      setError(err.response?.data?.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
};
