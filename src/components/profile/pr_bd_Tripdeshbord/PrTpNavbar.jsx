import React from 'react';
import '../../stylecomponent/navabaresyle.css';
import { useNavigate, useLocation } from 'react-router-dom';

const PrTpNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-header">
        <div className="navbar-logo">
          <div className="logo-icon">
            <span className="material-symbols-outlined">travel_explore</span>
          </div>
          <h1 className="logo-text">TripPlanner</h1>
        </div>
      </div>
     
      <div className="navbar-menu">
        <button 
          onClick={() => handleNavigation('/DashboardLayout')} 
          className={`nav-button ${isActive('/DashboardLayout') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <p className="button-text">Dashboard</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/TripSummary')} 
          className={`nav-button ${isActive('/TripSummary') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">summarize</span>
          <p className="button-text">Trip Summary</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/Pt_Bd_Accommodations')} 
          className={`nav-button ${isActive('/Pt_Bd_Accommodations') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">hotel</span>
          <p className="button-text">Accommodations</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/TravelPlannerRestaurants')} 
          className={`nav-button ${isActive('/TravelPlannerRestaurants') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">restaurant</span>
          <p className="button-text">Restaurants</p>
        </button>
         
        <button 
          onClick={() => handleNavigation('/Pt_Bd_Attractions')} 
          className={`nav-button ${isActive('/Pt_Bd_Attractions') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">attractions</span>
          <p className="button-text">Attractions</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/DailyItinerary')} 
          className={`nav-button ${isActive('/DailyItinerary') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <p className="button-text">Daily Itinerary</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/TravelMap')} 
          className={`nav-button ${isActive('/TravelMap') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">map</span>
          <p className="button-text">Travel Map</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/TravelPlannerItinerary')} 
          className={`nav-button ${isActive('/TravelPlannerItinerary') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">route</span>
          <p className="button-text">Travel Planner</p>
        </button>
      </div>
    </nav>
  );
};
export default PrTpNavbar;