import React, { useState } from 'react';

const TripPlanner = () => {
  const [tripData, setTripData] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    aiSuggestions: false
  });

  const [selectedBudgetTier, setSelectedBudgetTier] = useState('budget-friendly');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTravelerChange = (change) => {
    setTripData(prev => ({
      ...prev,
      travelers: Math.max(1, prev.travelers + change)
    }));
  };

  const toggleAI = () => {
    setTripData(prev => ({
      ...prev,
      aiSuggestions: !prev.aiSuggestions
    }));
  };

  const handleBudgetTierSelect = (tier) => {
    setSelectedBudgetTier(tier);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      {/* Sidebar Navigation */}
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
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white h-12 text-base font-bold hover:bg-blue-700 transition-colors">
            <span className="material-symbols-outlined">add</span>
            New Trip
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900">Create a New Trip</h1>
            <p className="mt-2 text-lg text-gray-600">Plan your next adventure with ease.</p>
          </div>

          {/* Trip Details Form */}
          <div className="space-y-8">
            {/* Trip Details Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Trip Name</p>
                  <input
                    name="tripName"
                    value={tripData.tripName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="e.g., Summer Vacation in Italy"
                  />
                </label>
                
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Destination</p>
                  <div className="flex">
                    <input
                      name="destination"
                      value={tripData.destination}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="e.g., Rome, Italy"
                    />
                    <div className="bg-gray-100 px-4 py-3 border border-gray-300 border-l-0 rounded-r-lg flex items-center">
                      <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                  </div>
                </label>
                
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Start Date</p>
                  <input
                    name="startDate"
                    type="date"
                    value={tripData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </label>
                
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">End Date</p>
                  <input
                    name="endDate"
                    type="date"
                    value={tripData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </label>
                
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">Number of Travelers</p>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => handleTravelerChange(-1)}
                      className="px-4 py-3 bg-gray-200 text-gray-700 border border-gray-300 rounded-l-lg hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <input
                      name="travelers"
                      type="number"
                      value={tripData.travelers}
                      onChange={handleInputChange}
                      className="w-20 px-4 py-3 border-t border-b border-gray-300 text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleTravelerChange(1)}
                      className="px-4 py-3 bg-gray-200 text-gray-700 border border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </label>
              </div>
            </div>

            {/* Budget Section Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Set Your Budget</h2>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700" htmlFor="ai-toggle">
                    Get AI Budget Suggestions
                  </label>
                  <button
                    id="ai-toggle"
                    role="switch"
                    aria-checked={tripData.aiSuggestions}
                    onClick={toggleAI}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      tripData.aiSuggestions ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Use AI</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tripData.aiSuggestions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2 text-gray-700">My Budget (Optional)</p>
                  <input
                    name="budget"
                    value={tripData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="$1,500"
                  />
                </label>
                
                <div className="space-y-4 pt-8">
                  <div className="flex gap-4">
                    <div
                      className={`flex-1 p-4 border rounded-lg text-center cursor-pointer hover:shadow-lg transition-all ${
                        selectedBudgetTier === 'budget-friendly'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => handleBudgetTierSelect('budget-friendly')}
                    >
                      <h3 className={`font-bold ${selectedBudgetTier === 'budget-friendly' ? 'text-orange-600' : 'text-gray-900'}`}>
                        Budget-Friendly
                      </h3>
                      <p className="text-gray-600">$800 - $1,200</p>
                    </div>
                    
                    <div
                      className={`flex-1 p-4 border rounded-lg text-center cursor-pointer hover:shadow-lg transition-all ${
                        selectedBudgetTier === 'comfort'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => handleBudgetTierSelect('comfort')}
                    >
                      <h3 className={`font-bold ${selectedBudgetTier === 'comfort' ? 'text-blue-600' : 'text-gray-900'}`}>
                        Comfort
                      </h3>
                      <p className="text-gray-600">$1,500 - $2,500</p>
                    </div>
                    
                    <div
                      className={`flex-1 p-4 border rounded-lg text-center cursor-pointer hover:shadow-lg transition-all ${
                        selectedBudgetTier === 'luxury'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => handleBudgetTierSelect('luxury')}
                    >
                      <h3 className={`font-bold ${selectedBudgetTier === 'luxury' ? 'text-purple-600' : 'text-gray-900'}`}>
                        Luxury
                      </h3>
                      <p className="text-gray-600">$3,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button className="px-6 py-3 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold transition-colors">
                Save as Draft
              </button>
              <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg">
                Generate Trip Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripPlanner;