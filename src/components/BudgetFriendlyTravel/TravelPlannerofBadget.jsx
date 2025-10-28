import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../stylecomponent/livelocationbutton.css'
import '../stylecomponent/budgetboxstyle.css'
import { setCalculateTripData } from '../actioncreate';

const TravelPlannerofBadget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [travelMode, setTravelMode] = useState('bike');
  const [selectedTripTypes, setSelectedTripTypes] = useState(['adventure']);
  const [selectedBudgetCategories, setSelectedBudgetCategories] = useState('');
  const [locationlonandlat,Setlocationlonandlat]=useState({'lat':null,'lon':null})

  const access_token = localStorage.getItem("access_token");

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          
          Setlocationlonandlat({lat:lat,lon:lon})
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await response.json();
            const placeName = data.display_name || "Unknown location";

            // Set the location in the input field
            setLocation(placeName);
            
            // Clear location error if any
            if (errors.location) {
              setErrors(prev => ({ ...prev, location: '' }));
            }
          } catch (error) {
            console.error("Error fetching place name:", error);
            setLocation("Unable to get location name");
          }

          setLoadingLocation(false);
        },
        (err) => {
          console.error("Location error:", err);
          alert("Unable to access location. Please allow permission.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation not supported in your browser.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Budget validation
    if (!budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(budget) || Number(budget) <= 0) {
      newErrors.budget = 'Budget must be a valid number';
    } else if (Number(budget) < 1000) {
      newErrors.budget = 'Budget must be 1000 Rs or more';
    }

    // Location validation
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Trip Type validation
    if (selectedTripTypes.length === 0) {
      newErrors.tripTypes = 'At least one trip type is required';
    }

    // Budget Category validation
    if (!selectedBudgetCategories) {
      newErrors.budgetCategories = 'Budget category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFindTrips = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (loading) return;
    setLoading(true);

    const formElements = document.querySelectorAll('input, select, button');
    formElements.forEach((el) => {
      if (el.innerText !== 'Find My Trips') el.disabled = true;
    });

    try {
     const valueortp= await axios.post('http://127.0.0.1:8006/CreateTripofBudget/',{
          budget: budget,
          location: location,
          travelMode: travelMode,
          selectedTripTypes: selectedTripTypes,
          selectedBudgetCategories: selectedBudgetCategories,
          locationlonandlat:locationlonandlat
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
     dispatch(setCalculateTripData(valueortp.data));  d
      console.log('valueortp',valueortp.data)
      navigate('/DashboardLayout')
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        formElements.forEach((el) => {
          el.disabled = false;
        });
      }, 4000);
    }
  };

  const toggleTripType = (type) => {
    setSelectedTripTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
    // Clear trip type error when user selects one
    if (errors.tripTypes) {
      setErrors(prev => ({ ...prev, tripTypes: '' }));
    }
  };

  const toggleBudgetCategory = (category) => {
    setSelectedBudgetCategories((prev) => (prev === category ? '' : category));
    // Clear budget category error when user selects one
    if (errors.budgetCategories) {
      setErrors(prev => ({ ...prev, budgetCategories: '' }));
    }
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    setBudget(value);
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: '' }));
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  return (
    <div>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white overflow-x-hidden">
        <div className="relative flex h-full grow flex-col justify-center py-10 px-4">
          <div className="flex flex-col max-w-[960px] flex-1 mx-auto">
            <div className="flex flex-col items-center justify-center gap-6 p-4 md:p-8 bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <p className="text-black text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] font-display">
                  Plan Your Next Adventure
                </p>
                <p className="text-black text-base md:text-lg font-normal leading-normal mt-2 font-display">
                  Tell us your budget and travel preferences, and we'll find the perfect trip for you.
                </p>
              </div>
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <label className="flex flex-col">
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Your Budget *
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      attach_money
                    </span>
                    <input
                      required
                      type="number"
                      min="1000"
                      step="1"
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black focus:outline-0 focus:ring-2 focus:ring-black/50 border ${
                        errors.budget ? 'border-red-500' : 'border-gray-300'
                      } bg-white/50 h-14 placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal font-display`}
                      placeholder="Enter budget (min 1000 Rs)"
                      value={budget}
                      onChange={handleBudgetChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                  )}
                </label>
                <label className="flex flex-col">
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Starting Location *
                  </p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loadingLocation || loading}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {loadingLocation ? (
                        <div className="loader w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      ) : (
                        <span className="material-symbols-outlined">location_on</span>
                      )}
                    </button>
                    <input
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black focus:outline-0 focus:ring-2 focus:ring-black/50 border ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      } bg-white/50 h-14 placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal font-display`}
                      placeholder="New York, NY or click location icon"
                      value={location}
                      onChange={handleLocationChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </label>
                <label className="flex flex-col">
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Travel Mode
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      explore
                    </span>
                    <select
                      className="form-select appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black focus:outline-0 focus:ring-2 focus:ring-black/50 border border-gray-300 bg-white/50 h-14 pl-12 pr-10 text-base font-normal leading-normal font-display"
                      value={travelMode}
                      onChange={(e) => setTravelMode(e.target.value)}
                      disabled={loading}
                    >
                      <option value="bike">Bike</option>
                      <option value="bus">Bus</option>
                      <option value="car">Car</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      unfold_more
                    </span>
                  </div>
                </label>
              </div>
              <div className="w-full max-w-4xl mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Trip Type *
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedTripTypes.includes('adventure')
                          ? 'bg-gray-700 text-white hover:bg-black/30 '
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                      onClick={() => toggleTripType('adventure')}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-lg">hiking</span>
                      <p>Adventure</p>
                    </button>
                    <button
                      type="button"
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedTripTypes.includes('relaxation')
                          ? 'bg-gray-700 text-white hover:bg-black/30 '
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                      onClick={() => toggleTripType('relaxation')}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-lg">beach_access</span>
                      <p>Relaxation</p>
                    </button>
                    <button
                      type="button"
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedTripTypes.includes('cultural')
                          ?'bg-gray-700 text-white hover:bg-black/30 '
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                      onClick={() => toggleTripType('cultural')}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-lg">museum</span>
                      <p>Cultural</p>
                    </button>
                  </div>
                  {errors.tripTypes && (
                    <p className="text-red-500 text-sm mt-1">{errors.tripTypes}</p>
                  )}
                </div>
                <div>
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Budget Category *
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedBudgetCategories === 'budget'
                          ? 'bg-gray-700 text-white hover:bg-black/30 '
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                      onClick={() => toggleBudgetCategory('budget')}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-lg">savings</span>
                      <p>Budget</p>
                    </button>
                    <button
                      type="button"
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedBudgetCategories === 'midrange'
                          ? 'bg-gray-700 text-white hover:bg-black/30 '
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                      onClick={() => toggleBudgetCategory('midrange')}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-lg">attach_money</span>
                      <p>Mid-range</p>
                    </button>
                    <button
                      type="button"
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedBudgetCategories === 'luxury'
                          ? 'bg-gray-700 text-white hover:bg-black/30 '
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                      onClick={() => toggleBudgetCategory('luxury')}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-lg">emoji_events</span>
                      <p>Luxury</p>
                    </button>
                  </div>
                  {errors.budgetCategories && (
                    <p className="text-red-500 text-sm mt-1">{errors.budgetCategories}</p>
                  )}
                </div>
              </div>
              <div className="w-full max-w-sm mt-8">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full h-14 rounded-lg bg-black text-white text-lg font-bold hover:bg-black/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleFindTrips}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Find My Trips'}
                </button>
              </div>
              
              <div
                className={`w-full max-w-4xl mt-8 flex flex-col items-center justify-center gap-4 ${loading ? 'flex' : 'hidden'}`}
              >
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute h-full w-full animate-plane-fly">
                    <span
                      className="material-symbols-outlined text-black text-3xl"
                      style={{ transform: 'rotate(90deg)' }}
                    >
                      flight
                    </span>
                  </div>
                </div>
                <p className="text-black text-base font-medium">
                  Searching for the best trips for you...
                </p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes plane-fly {
            0% {
              transform: translateX(-100%) translateY(20%);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translateX(100%) translateY(-20%);
              opacity: 0;
            }
          }
          .animate-plane-fly {
            animation: plane-fly 3s ease-in-out infinite;
          }
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #666;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">
          <a onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-teal-500 transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </a>
          <a onClick={() => navigate('/TravelPlannerofBadget')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-gray-500 transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
            <span className="text-sm font-medium">Expense</span>
          </a>
          <a onClick={() => navigate('/TripPlannerofCustome')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">tune</span>
            <span className="text-sm font-medium">Customize</span>
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default TravelPlannerofBadget;







































