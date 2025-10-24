import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TravelPlannerofBadget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [travelMode, setTravelMode] = useState('bike');
  const [selectedTripTypes, setSelectedTripTypes] = useState(['adventure']);
  const [selectedBudgetCategories, setSelectedBudgetCategories] = useState('');

const access_token=localStorage.getItem("access_token");


  const handleFindTrips =async (e) => {
    e.preventDefault();
    await axios.post('http://127.0.0.1:8006/CreateTripofBudget/',{'budget':budget,'location':location,'travelMode':travelMode,'selectedTripTypes':selectedTripTypes,'selectedBudgetCategories':selectedBudgetCategories},{
       headers: { Authorization: `Bearer ${access_token}` },

    }
  )
    if (loading) return;
    setLoading(true);

    const formElements = document.querySelectorAll('input, select, button');
    formElements.forEach((el) => {
      if (el.innerText !== 'Find My Trips') el.disabled = true;
    });

    setTimeout(() => {
      setLoading(false);
      formElements.forEach((el) => {
        el.disabled = false;
      });
    }, 4000); // Simulate a 4-second search
  };

  const toggleTripType = (type) => {
    setSelectedTripTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

const toggleBudgetCategory = (category) => {
  setSelectedBudgetCategories((prev) => (prev === category ? '' : category));
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
                    Your Budget
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      attach_money
                    </span>
                    <input
                      required
                      max={999}
                      type='nu'
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black focus:outline-0 focus:ring-2 focus:ring-black/50 border border-gray-300 bg-white/50 h-14 placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal font-display"
                      placeholder="Enter budget less than 100"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </label>
                <label className="flex flex-col">
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Starting Location
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      location_on
                    </span>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black focus:outline-0 focus:ring-2 focus:ring-black/50 border border-gray-300 bg-white/50 h-14 placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal font-display"
                      placeholder="New York, NY"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={loading}
                    />
                  </div>
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
                    Trip Type (Optional)
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
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
                </div>
                <div>
                  <p className="text-black text-base font-medium leading-normal pb-2 font-display">
                    Budget Category (Optional)
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedBudgetCategories.includes('budget')
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
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedBudgetCategories.includes('midrange')
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
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal font-display transition-colors ${
                        selectedBudgetCategories.includes('luxury')
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
                </div>
              </div>
              <div className="w-full max-w-sm mt-8">
                <button
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
        `}</style>
      </div>
      <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">



          <a onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-teal-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </a>


          <a onClick={() => navigate('/TravelPlannerofBadget')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-gray-500 transition-colors duration-200" href="#">
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

export default TravelPlannerofBadget;



























