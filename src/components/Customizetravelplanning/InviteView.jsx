import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InviteView = () => {
  const { inviteCode } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('view');
  const [joinData, setJoinData] = useState({ name: '', email: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8005/';  // Change to IP for cross-device

  useEffect(() => {
    if (inviteCode) fetchTrip();
  }, [inviteCode]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}TripInviteAPIView/${inviteCode}/`);
      setTripData(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError('Trip not found');
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}InviteJoinAPIView/${inviteCode}/`, joinData);
      setStep('verify');
      setError('');  // Clear previous errors
      alert('OTP sent to your email!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Error sending OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}InviteVerifyOTPAPIView/${inviteCode}/`, { otp });
      setError('');  // Clear previous errors
      alert('Successfully joined the trip!');
      window.location.href = '/TripPlanner';  // Redirect to planner
    } catch (err) {
      console.error('Error verifying OTP:', err);
      if (err.response && err.response.status === 404) {
        setError('Invalid invite code. The link may be expired or incorrect.');
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);  // Backend error message (e.g., "Incorrect OTP")
      } else {
        setError('Invalid OTP. Please check and try again.');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error && step === 'view') return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

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

      {step === 'view' && (
        <div className="mt-8">
          {tripData.privacy === 'public' ? (
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={() => alert('Joined! (Implement join logic)')}>
              Join Trip
            </button>
          ) : (
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={joinData.name} 
                onChange={(e) => setJoinData({ ...joinData, name: e.target.value })} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={joinData.email} 
                onChange={(e) => setJoinData({ ...joinData, email: e.target.value })} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                type="tel" 
                placeholder="Phone (optional)" 
                value={joinData.phone} 
                onChange={(e) => setJoinData({ ...joinData, phone: e.target.value })} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Request to Join
              </button>
            </form>
          )}
        </div>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyOTP} className="mt-8 space-y-4">
          <input 
            type="text" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
            required 
            maxLength="6" 
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Verify OTP
          </button>
        </form>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default InviteView;