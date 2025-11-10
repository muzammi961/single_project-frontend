// import React from 'react';
// import '../../stylecomponent/navabaresyle.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from "react-redux";





// const Pt_Bd_Navbar = () => {
//   const tripId = useSelector((state) => state.app.prtpidcode);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <nav className="navbar-container">
//       <div className="navbar-header">
//         <div className="navbar-logo">
//           <div className="logo-icon">
//             <span className="material-symbols-outlined">travel_explore</span>
//           </div>
//           <h1 className="logo-text">TripPlanner</h1>
//         </div>
//       </div>
     
//       <div className="navbar-menu">
//         <button 
//           onClick={() => handleNavigation(`/Pt_Bd_DashboardLayout`)} 
//           className={`nav-button ${isActive('/Pt_Bd_DashboardLayout') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">dashboard</span>
//           <p className="button-text">Dashboard</p>
//         </button>
        
//         <button 
//           onClick={() => handleNavigation('/TripSummary')} 
//           className={`nav-button ${isActive('/TripSummary') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">summarize</span>
//           <p className="button-text">Trip Summary</p>
//         </button>
        
//         <button 

//         // onClick={() => handleNavigation(`/Pt_Bd_Accommodations`)} 
//         onClick={() => navigate(`/Pt_Bd_Accommodations`)} 
//           className={`nav-button ${isActive(`/Pt_Bd_Accommodations`) ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">hotel</span>
//           <p className="button-text">Accommodations</p>
//         </button>
        
//         <button 
//           onClick={() => handleNavigation('/TravelPlannerRestaurants')} 
//           className={`nav-button ${isActive('/TravelPlannerRestaurants') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">restaurant</span>
//           <p className="button-text">Restaurants</p>
//         </button>
         
//         <button 
//           onClick={() => handleNavigation(`/Pt_Bd_Attractions`)} 
//           className={`nav-button ${isActive('/Pt_Bd_Attractions') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">attractions</span>
//           <p className="button-text">Attractions</p>
//         </button>
          
//         <button 
//           onClick={() => handleNavigation('/Pt_Bd_DailyItinerary')} 
//           className={`nav-button ${isActive('/Pt_Bd_DailyItinerary') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">calendar_today</span>
//           <p className="button-text">Daily Itinerary</p>
//         </button>
          
//         <button 
//           onClick={() => handleNavigation('/TravelMap')} 
//           className={`nav-button ${isActive('/TravelMap') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">map</span>
//           <p className="button-text">Travel Map</p>
//         </button>
          
//         <button 
//           onClick={() => handleNavigation('/TravelPlannerItinerary')} 
//           className={`nav-button ${isActive('/TravelPlannerItinerary') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">route</span>
//           <p className="button-text">Travel Planner</p>
//         </button>

//         <button 
//           onClick={() => handleNavigation('/TripManagementDashboard')} 
//           className={`nav-button ${isActive('/TripManagementDashboard') ? 'active' : ''}`}
//         >
//           <span className="material-symbols-outlined">travel_explore</span>
//           <p className="button-text">Trip Management</p>
//         </button>
//       </div>
//     </nav>
//   );
// };
// export default Pt_Bd_Navbar;










import React from 'react';
import '../../stylecomponent/navabaresyle.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const Pt_Bd_Navbar = () => {
  const tripId = useSelector((state) => state.app.prtpidcode);
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
        <div className="navbar-logo m-2">
          <div className="logo-icon ">
            <span className="material-symbols-outlined">travel_explore</span>
          </div>
          <h1 className="logo-text">TripPlanner</h1>
        </div>
      </div>
     
      <div className="navbar-menu">
        <button 
          onClick={() => handleNavigation(`/Pt_Bd_DashboardLayout`)} 
          className={`nav-button ${isActive('/Pt_Bd_DashboardLayout') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <p className="button-text">Dashboard</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/Pr_bd_Summarylayout')} 
          className={`nav-button ${isActive('/Pr_bd_Summarylayout') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">summarize</span>
          <p className="button-text">Trip Summary</p>
        </button>
        
        <button 
          onClick={() => navigate(`/Pt_Bd_Accommodations`)} 
          className={`nav-button ${isActive(`/Pt_Bd_Accommodations`) ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">hotel</span>
          <p className="button-text">Accommodations</p>
        </button>
        
        <button 
          onClick={() => handleNavigation('/Pr_bd_Restaurantslayout')} 
          className={`nav-button ${isActive('/Pr_bd_Restaurantslayout') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">restaurant</span>
          <p className="button-text">Restaurants</p>
        </button>
         
        <button 
          onClick={() => handleNavigation(`/Pt_Bd_Attractions`)} 
          className={`nav-button ${isActive('/Pt_Bd_Attractions') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">attractions</span>
          <p className="button-text">Attractions</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/Pt_Bd_DailyItinerary')} 
          className={`nav-button ${isActive('/Pt_Bd_DailyItinerary') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <p className="button-text">Daily Itinerary</p>
        </button>
          
        <button 
          onClick={() => handleNavigation('/Pr_bd_TravelMaplayout')} 
          className={`nav-button ${isActive('/Pr_bd_TravelMaplayout') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">map</span>
          <p className="button-text">Travel Map</p>
        </button>
          
      

        <button 
          onClick={() => handleNavigation('/Pr_bd_TripManagementDashboard')} 
          className={`nav-button ${isActive('/Pr_bd_TripManagementDashboard') ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">travel_explore</span>
          <p className="button-text">Trip Management</p>
        </button>
      </div>
    </nav>
  );
};

export default Pt_Bd_Navbar;