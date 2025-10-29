import React from 'react';
import '../../stylecomponent/navabaresyle.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="w-full flex-shrink-0 bg-white border-b border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 lg:px-6 lg:py-4">
      <div className="flex items-center gap-3 mb-4 lg:mb-0">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          <span className="material-symbols-outlined">travel_explore</span>
        </div>
        <h1 className="text-xl font-bold text-black">TripPlanner</h1>
      </div>
     
      <div className="flex flex-row gap-2 w-full lg:w-auto overflow-x-auto lg:overflow-x-visible">
        <button 
          onClick={() => handleNavigation('/DashboardLayout')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <p className="text-sm font-medium">Dashboard</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/TripSummary')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">summarize</span>
          <p className="text-sm font-medium">Trip Summary</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/Accommodations')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">hotel</span>
          <p className="text-sm font-medium">Accommodations</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/TravelPlannerRestaurants')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">restaurant</span>
          <p className="text-sm font-medium">Restaurants</p>
        </button>
         
        <button 
          onClick={() => handleNavigation('/Attractions')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">attractions</span>
          <p className="text-sm font-medium">Attractions</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/DailyItinerary')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <p className="text-sm font-medium">Daily Itinerary</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/TravelMap')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">map</span>
          <p className="text-sm font-medium">Travel Map</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/TravelPlannerItinerary')} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap text-black bg-white"
        >
          <span className="material-symbols-outlined">route</span>
          <p className="text-sm font-medium">Travel Planner</p>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;