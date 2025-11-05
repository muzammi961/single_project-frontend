import React from 'react';
import '../../stylecomponent/navabaresyle.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
const INvateTripNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { invatetripid } = useParams();

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
          onClick={() => handleNavigation(`/invitetrip/${invatetripid}`)} 
          className={`nav-button ${isActive('/DashboardLayout') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <p className="button-text">Dashboard</p>
        </button>
        
        <button 
          onClick={() => handleNavigation(`/TripSummarylayoutinvate/${invatetripid}`)} 
          className={`nav-button ${isActive('/TripSummary') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">summarize</span>
          <p className="button-text">Trip Summary</p>
        </button>
        
        <button 
          onClick={() => handleNavigation(`/Accommodationslayoutinvate/${invatetripid}`)} 
          className={`nav-button ${isActive('/Accommodations') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">hotel</span>
          <p className="button-text">Accommodations</p>
        </button>
        
        <button 
          onClick={() => handleNavigation(`/TravelPlannerRestaurantslayoutinvate/${invatetripid}`)} 
          className={`nav-button ${isActive('/TravelPlannerRestaurants') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">restaurant</span>
          <p className="button-text">Restaurants</p>
        </button>
         
        <button 
          onClick={() => handleNavigation(`/Attractionslayoutinvate/${invatetripid}`)} 
          className={`nav-button ${isActive('/Attractions') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">attractions</span>
          <p className="button-text">Attractions</p>
        </button>
          
        <button 
          onClick={() => handleNavigation(`/DailyItinerarylayoutinvate/${invatetripid}`)} 
          className={`nav-button ${isActive('/DailyItinerary') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <p className="button-text">Daily Itinerary</p>
        </button>
          
        <button 
          onClick={() => handleNavigation(`/TravelMaplayoutInvited/${invatetripid}`)} 
          className={`nav-button ${isActive('/TravelMap') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">map</span>
          <p className="button-text">Travel Map</p>
        </button>
        
      </div>
    </nav>
  );
};

export default INvateTripNavbar;