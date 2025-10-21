// Updated PublicTripView.jsx - Full implementation with fetch by ID
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PublicTripView = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8005/';  // Change to IP for cross-device

  useEffect(() => {
    if (tripId) fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}PublicTripDetailAPIView/${tripId}/`);
      setTripData(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching public trip:', err);
      setError('Trip not found');
      setLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    try {
      // Implement join logic for public trip (e.g., POST to a join endpoint)
      // For now, simulate success
      alert('Successfully joined the trip!');
      navigate('/TripPlanner');  // Redirect to planner
    } catch (err) {
      console.error('Error joining trip:', err);
      setError('Error joining trip');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{tripData.trip_name}</h1>
      <p className="text-lg mb-2">Destination: {tripData.destination}</p>
      <p className="text-lg mb-2">Start Date: {tripData.start_date}</p>
      <p className="text-lg mb-2">End Date: {tripData.end_date}</p>
      <p className="text-lg mb-2">Trip Type: {tripData.trip_type}</p>
      <p className="text-lg mb-2">Place Type: {Array.isArray(tripData.place_type) ? tripData.place_type.join(', ') : tripData.place_type}</p>
      <p className="text-lg mb-2">Budget: ${tripData.budget}</p>
      <p className="text-lg mb-2">Privacy: {tripData.privacy}</p>

      <div className="mt-8">
        <button 
          onClick={handleJoinTrip} 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Join Trip
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default PublicTripView;