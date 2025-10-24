import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TripPlannerofCustome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tripName: '',
    description: '',
    startLocation: '',
    destination: '',
    startDate: '2025-11-01',
    endDate: '2025-11-08',
    travelMode: 'Car',
    privacy: 'Private',
  });
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'start-location') {
      if (value.length > 2) {
        fetchSuggestions(value, setStartSuggestions, setShowStartSuggestions);
      } else {
        setStartSuggestions([]);
        setShowStartSuggestions(false);
      }
    } else if (name === 'destination') {
      if (value.length > 2) {
        fetchSuggestions(value, setDestSuggestions, setShowDestSuggestions);
      } else {
        setDestSuggestions([]);
        setShowDestSuggestions(false);
      }
    }
  };

  const fetchSuggestions = async (query, setter, showSetter) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=IN`,
        { headers: { 'User-Agent': 'TripFlowApp/1.0' } }
      );
      const data = await res.json();
      setter(data);
      showSetter(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const selectSuggestion = (suggestion, field) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion.display_name }));
    if (field === 'start-location') {
      setShowStartSuggestions(false);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { 'User-Agent': 'TripFlowApp/1.0' } }
          );
          const data = await res.json();
          setFormData((prev) => ({ ...prev, startLocation: data.display_name || 'Current Location' }));
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          setFormData((prev) => ({ ...prev, startLocation: `${latitude}, ${longitude}` }));
        }
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location.');
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white text-black font-display">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-center border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="text-blue-500 size-7">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-black text-lg font-bold">Trip Planner</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar image"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgSTJ7gM_UERF9sx0Ttw73nWnt2creQo6eCDqcwfSF3HnBZr2sjwrAgrMf4nWejlKjqew9Zs5oKoG_HUtW05vibYw8SM7jlVURKMpFO3Ejbazo5rfIQMn-jmjXtCfUcdXmKJrUQKrcLbs-x3fr3Ape1kkcZ2uzqNhyXzW4SPihaZ4w4mbwp_k_G0VgCWwNi-xsbKhYgXmGM87ZCmVCCNtozc3gO_nJRi_Jf8bhXwsQuJ0dWMjLIEM47-VrigIZJC6S3jBYsTGDzEQ")',
              }}
            />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-3xl h-full flex flex-col justify-between">
          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-black text-3xl font-black leading-tight tracking-tight">
              Create a New Trip
            </h1>
            <p className="text-gray-600 mt-2 text-base font-normal leading-normal">
              Fill in the details below to start planning your next adventure.
            </p>
          </div>
          {/* Form Container */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Trip Name */}
              <div>
                <label className="block text-base font-medium text-black pb-2" htmlFor="trip-name">
                  Trip Name
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  id="trip-name"
                  name="tripName"
                  placeholder="e.g., California Coast Roadtrip"
                  type="text"
                  value={formData.tripName}
                  onChange={handleInputChange}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-base font-medium text-black pb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  id="description"
                  name="description"
                  placeholder="Describe your trip's purpose and highlights..."
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              {/* Location Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-base font-medium text-black pb-2" htmlFor="start-location">
                    Start Location
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">place</span>
                    </div>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-base text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      id="start-location"
                      name="startLocation"
                      placeholder="e.g., San Francisco, CA"
                      type="text"
                      value={formData.startLocation}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={loadingLocation}
                      className="absolute right-2 inset-y-0 flex items-center px-2 text-gray-400 hover:text-blue-500"
                    >
                      <span className="material-symbols-outlined">{loadingLocation ? 'hourglass_empty' : 'my_location'}</span>
                    </button>
                  </div>
                  {showStartSuggestions && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                      {startSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => selectSuggestion(suggestion, 'startLocation')}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-base font-medium text-black pb-2" htmlFor="destination">
                    Destination
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">flag</span>
                    </div>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-base text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      id="destination"
                      name="destination"
                      placeholder="e.g., Los Angeles, CA"
                      type="text"
                      value={formData.destination}
                      onChange={handleInputChange}
                    />
                  </div>
                  {showDestSuggestions && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                      {destSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => selectSuggestion(suggestion, 'destination')}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Date Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-base font-medium text-black pb-2" htmlFor="start-date">
                    Start Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                    </div>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      id="start-date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black pb-2" htmlFor="end-date">
                    End Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                    </div>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      id="end-date"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              {/* Travel Mode Radio Buttons */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-base font-medium text-black pb-2">Travel Mode</label>
                  <div className="space-y-2">
                    {['Car', 'Bike', 'Private Bus', 'Airplane'].map((mode) => (
                      <label key={mode} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="travelMode"
                          value={mode}
                          checked={formData.travelMode === mode}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black pb-2" htmlFor="privacy">
                    Privacy
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      id="privacy"
                      name="privacy"
                      value={formData.privacy}
                      onChange={handleInputChange}
                    >
                      <option>Private</option>
                      <option>Invite Only</option>
                      <option>Public</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="pt-2">
                <button
                  className="w-full rounded-lg bg-blue-500 px-4 py-3 text-base font-bold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  type="submit"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">
          <a onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </a>
          <a onClick={() => navigate('/TravelPlannerofBadget')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
            <span className="text-sm font-medium">Expense</span>
          </a>
          <a onClick={() => navigate('/TripPlannerofCustome')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">tune</span>
            <span className="text-sm font-medium">Customize</span>
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default TripPlannerofCustome;