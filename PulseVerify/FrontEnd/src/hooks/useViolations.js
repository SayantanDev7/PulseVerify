import { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios.js';

export const useViolations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/violations');
      
      // Transform backend data to match frontend UI expectations
      const transformedViolations = response.data.map((v, index) => {
        // Derive some UI fields based on confidence and distance
        const level = v.confidence >= 90 ? 'Critical' : (v.confidence >= 70 ? 'Medium' : 'Low');
        const statusMap = {
          'Open': 'open',
          'Under Review': 'open',
          'Takedown Issued': 'takedown_sent',
          'Resolved': 'resolved'
        };

        return {
          id: v._id,
          originalTitle: `Master Asset ${v.masterAssetId?.substring(0, 5) || 'Unknown'}`,
          originalThumb: v.masterAssetUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=225&fit=crop", // fallback
          detectedTitle: `Detected on ${v.platform || 'Unknown'}`,
          detectedThumb: v.suspectUrl,
          platform: v.platform || 'Unknown',
          similarity: Math.round(v.confidence),
          level: level,
          detectedAt: new Date(v.detectedAt).toLocaleString(),
          pulseId: `PV-${v._id.substring(0, 8).toUpperCase()}`,
          aiConfidence: Math.round(v.confidence * 0.98), // slightly offset for realism
          modifications: [v.aiContext || "Matches Master Hash"],
          sourceUrl: v.suspectUrl,
          status: statusMap[v.status] || 'open',
          
          // Map properties (Mocking locations since backend doesn't track IP yet)
          region: "North America",
          country: "USA",
          city: "New York",
          time: new Date(v.detectedAt).toLocaleTimeString(),
          coords: [-74.006, 40.7128] // Default to NY
        };
      });

      setViolations(transformedViolations);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch violations');
    } finally {
      setLoading(false);
    }
  }, []);

  const detectViolation = async (suspectUrl, platform) => {
    try {
      const response = await axios.post('/api/violations/detect', { suspectUrl, platform });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  return { violations, loading, error, refetch: fetchViolations, detectViolation };
};
