import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';

const TripPlannerofCustome = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    tripName: '',
    destination: '',
    startingLocation: '',
    startDate: '',
    endDate: '',
    tripType: '',
    placeType: [],
    budget: '',
    aiSuggestions: false,
    privacy: 'private'
  });

  const [selectedBudgetTier, setSelectedBudgetTier] = useState('budget-friendly');
  const [inviteLink, setInviteLink] = useState('');

  // Suggestion states
  const [startingSuggestions, setStartingSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showStartingSuggestions, setShowStartingSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const tripTypes = ['Bus', 'Group Tour', 'Bike', 'Car', 'Train'];
  const placeTypes = ['Urban/City', 'Beach/Coastal', 'Mountain/Hiking', 'Historical', 'Adventure', 'Relaxation'];

  const API_BASE_URL = 'http://127.0.0.1:8005/';  // Change to IP for cross-device

  // Fetch suggestions
  const fetchSuggestions = async (query, setter, showSetter) => {
    if (query.length < 3) {
      setter([]);
      showSetter(false);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=IN`,
        { headers: { 'User-Agent': 'TripFlowApp/1.0' } }
      );
      const data = await res.json();
      setter(data.map(item => item.display_name));
      showSetter(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setter([]);
      showSetter(false);
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartingChange = (e) => {
    handleInputChange(e);
    fetchSuggestions(e.target.value, setStartingSuggestions, setShowStartingSuggestions);
  };

  const handleDestinationChange = (e) => {
    handleInputChange(e);
    fetchSuggestions(e.target.value, setDestinationSuggestions, setShowDestinationSuggestions);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceTypeChange = (type) => {
    setTripData(prev => ({
      ...prev,
      placeType: prev.placeType.includes(type)
        ? prev.placeType.filter(t => t !== type)
        : [...prev.placeType, type]
    }));
  };

  const toggleAI = () => {
    setTripData(prev => ({ ...prev, aiSuggestions: !prev.aiSuggestions }));
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setTripData(prev => ({ ...prev, startingLocation: `${lat}, ${lng} (Current Location)` }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSuggestionClick = (suggestion, field, setter, showSetter) => {
    setTripData(prev => ({ ...prev, [field]: suggestion }));
    setter([]);
    showSetter(false);
  };

  const handlePrivacyChange = (e) => {
    setTripData(prev => ({ ...prev, privacy: e.target.value }));
  };

  const handleGenerateTrip = async () => {
    if (!tripData.tripName || !tripData.destination || !tripData.startingLocation || !tripData.startDate || !tripData.endDate || !tripData.tripType || tripData.placeType.length === 0) {  // Fixed: startingLocation
      alert('Please fill all required fields.');
      return;
    }

    const data = {
      trip_name: tripData.tripName,
      destination: tripData.destination,
      starting_place: tripData.startingLocation,
      start_date: tripData.startDate,
      end_date: tripData.endDate,
      trip_type: tripData.tripType,
      place_type: tripData.placeType,
      budget: parseFloat(tripData.budget) || 0,
      selected_budget_tier: selectedBudgetTier,
      ai_suggestions: tripData.aiSuggestions,
      privacy: tripData.privacy,
    };

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please log in to create a trip.');
        return;
      }

      const res = await axios.post(`${API_BASE_URL}TripCreateAPIView/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const createdTrip = res.data;
      if (createdTrip.invite_link) {
        setInviteLink(createdTrip.invite_link);
        navigator.clipboard.writeText(createdTrip.invite_link);
      }
      alert('Trip created successfully! Link copied to clipboard.');
      setTripData({
        tripName: '',
        destination: '',
        startingLocation: '',
        startDate: '',
        endDate: '',
        tripType: '',
        placeType: [],
        budget: '',
        aiSuggestions: false,
        privacy: 'private'
      });
      setSelectedBudgetTier('budget-friendly');
    } catch (err) {
      console.error('Full error:', err.response?.data || err);
      const errorMsg = err.response?.data?.non_field_errors?.[0] || 
                       Object.values(err.response?.data || {})?.flat()?.[0] || 
                       'Unknown error';
      alert('Error creating trip: ' + errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <aside className="w-64 bg-white shadow-md flex flex-col border-r border-gray-200">
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">TripFlow</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50" href="#">
            <span className="material-symbols-outlined mr-3 text-gray-400">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center px-4 py-3 text-white bg-blue-600 rounded-lg" href="#">
            <span className="material-symbols-outlined mr-3">flight_takeoff</span>
            Trips
          </a>
          <a className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50" href="#">
            <span className="material-symbols-outlined mr-3 text-gray-400">person</span>
            Profile
          </a>
        </nav>
      
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900">Create a New Trip</h1>
            <p className="mt-2 text-lg text-gray-600">Plan your next adventure with ease.</p>
          </div>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Trip Name</p>
                  <input name="tripName" value={tripData.tripName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Summer Vacation" />
                </label>

                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Destination</p>
                  <div className="relative">
                    <input name="destination" value={tripData.destination} onChange={handleDestinationChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Rome, Italy" />
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                        {destinationSuggestions.map((sug, idx) => (
                          <li key={idx} onClick={() => handleSuggestionClick(sug, 'destination', setDestinationSuggestions, setShowDestinationSuggestions)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0">
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </label>

                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Starting Location</p>
                  <div className="relative flex gap-2">
                    <input name="startingLocation" value={tripData.startingLocation} onChange={handleStartingChange} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., New York, USA" />
                    <button type="button" onClick={handleCurrentLocation} className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center" title="Use Current Location">
                      📍
                    </button>
                    {showStartingSuggestions && startingSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg left-0">
                        {startingSuggestions.map((sug, idx) => (
                          <li key={idx} onClick={() => handleSuggestionClick(sug, 'startingLocation', setStartingSuggestions, setShowStartingSuggestions)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0">
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </label>

                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Start Date</p>
                  <input type="date" name="startDate" value={tripData.startDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </label>

                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">End Date</p>
                  <input type="date" name="endDate" value={tripData.endDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <p className="text-base font-medium pb-2 text-gray-700">Trip Type</p>
                  <select name="tripType" value={tripData.tripType} onChange={handleSelectChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Trip Type</option>
                    {tripTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>

                <label className="flex flex-col md:col-span-2">
                  <p className="text-base font-medium pb-2 text-gray-700">Place Type (Select Multiple)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {placeTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" value={type} checked={tripData.placeType.includes(type)} onChange={() => handlePlaceTypeChange(type)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                  {tripData.placeType.length > 0 && <p className="text-sm text-gray-500 mt-2">Selected: {tripData.placeType.join(', ')}</p>}
                </label>

                <label className="flex flex-col md:col-span-2">
                  <p className="text-base font-medium pb-2 text-gray-700">Budget Tier</p>
                  <select value={selectedBudgetTier} onChange={(e) => setSelectedBudgetTier(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="budget-friendly">Budget-Friendly</option>
                    <option value="comfort">Comfort</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Budget Amount</p>
                  <input name="budget" type="number" step="0.01" value={tripData.budget} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 1000" />
                </label>

                <label className="flex items-center gap-2 md:col-span-2">
                  <input type="checkbox" checked={tripData.aiSuggestions} onChange={toggleAI} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-base font-medium text-gray-700">Enable AI Suggestions</span>
                </label>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="privacy" value="private" checked={tripData.privacy === 'private'} onChange={handlePrivacyChange} />
                  <div>
                    <span className="text-base font-medium text-gray-700">Private</span>
                    <p className="text-sm text-gray-500">Only you can view and manage this trip.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="privacy" value="invite_only" checked={tripData.privacy === 'invite_only'} onChange={handlePrivacyChange} />
                  <div>
                    <span className="text-base font-medium text-gray-700">Invite Only</span>
                    <p className="text-sm text-gray-500">Only invited users can join via link and OTP verification.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="privacy" value="public" checked={tripData.privacy === 'public'} onChange={handlePrivacyChange} />
                  <div>
                    <span className="text-base font-medium text-gray-700">Public</span>
                    <p className="text-sm text-gray-500">Anyone can view and join this trip.</p>
                  </div>
                </label>
              </div>

              {inviteLink && (
                <div className="mt-6">
                  <p className="text-base font-medium pb-2 text-gray-700">Shareable Invite Link</p>
                  <div className="flex gap-2">
                    <input type="text" value={inviteLink} readOnly className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => navigator.clipboard.writeText(inviteLink)} className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Share this link via email, WhatsApp, etc. For invite_only, users will receive an OTP for verification.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button className="px-6 py-3 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold">
                Save as Draft
              </button>
              <button onClick={handleGenerateTrip} className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg">
                Generate Trip Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripPlannerofCustome;