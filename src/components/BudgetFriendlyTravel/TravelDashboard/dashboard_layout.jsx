import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { clearTripData } from '../../actioncreate.jsx'
import { useNavigate } from 'react-router-dom';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const token=localStorage.getItem('access_token')
  const [visibility, setVisibility] = useState('private');
  const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [activeTab, setActiveTab] = useState('attractions');
  const [routeLayer, setRouteLayer] = useState(null);

  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
  console.log('calculate trip data :: ', calculateTripData);

  // Initialize map
  useEffect(() => {
    if (!calculateTripData || !calculateTripData.origin) return;

    if (!mapInstance.current) {
      const origin = calculateTripData.origin.coordinates;
      mapInstance.current = L.map(mapRef.current).setView([origin.lat, origin.lng], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing layers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      mapInstance.current.removeLayer(layer);
    });

    // Add markers, routes, and directions
    addMarkersAndRoutes();

  }, [calculateTripData]);

  const addMarkersAndRoutes = () => {
    if (!calculateTripData || !mapInstance.current) return;

    const { origin, destination, return_destination, travel_plan } = calculateTripData;
    console.log('dis:::::',destination)
    // Add origin marker
    L.marker([origin.coordinates.lat, origin.coordinates.lng])
      .addTo(mapInstance.current)
      .bindPopup(`<b>🚩 Origin</b><br>${origin.address}`)
      .openPopup();

    // Add destination marker
    L.marker([destination.coordinates.lat, destination.coordinates.lng])
      .addTo(mapInstance.current)
      .bindPopup(`<b>🎯 Destination</b><br>${destination.address}<br>Distance: ${destination.distance_from_origin_km} km<br>Direction: ${destination.direction}`);

    // Add return destination marker if different
    if (return_destination && 
        (return_destination.coordinates.lat !== destination.coordinates.lat || 
         return_destination.coordinates.lng !== destination.coordinates.lng)) {
      L.marker([return_destination.coordinates.lat, return_destination.coordinates.lng])
        .addTo(mapInstance.current)
        .bindPopup(`<b>🔁 Return Stop</b><br>${return_destination.address}<br>Distance: ${return_destination.distance_from_origin_km} km<br>Direction: ${return_destination.direction}`)
        .setIcon(new L.Icon({
          ...L.Icon.Default.prototype.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
        }));
    }

    // Add intermediate stops for going journey
    travel_plan.intermediate_stops_going.forEach((stop, index) => {
      L.marker([stop.coordinates.lat, stop.coordinates.lng])
        .addTo(mapInstance.current)
        .bindPopup(`<b>📍 Stop ${index + 1} (Going)</b><br>Day ${stop.day}<br>${stop.address}`)
        .setIcon(new L.Icon({
          ...L.Icon.Default.prototype.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'
        }));
    });

    // Add intermediate stops for return journey
    travel_plan.intermediate_stops_return.forEach((stop, index) => {
      L.marker([stop.coordinates.lat, stop.coordinates.lng])
        .addTo(mapInstance.current)
        .bindPopup(`<b>📍 Stop ${index + 1} (Return)</b><br>Day ${stop.day}<br>${stop.address}`)
        .setIcon(new L.Icon({
          ...L.Icon.Default.prototype.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png'
        }));
    });

    // Draw route lines
    drawRouteLines();

    // Fit map to show all markers
    const group = new L.featureGroup([
      L.marker([origin.coordinates.lat, origin.coordinates.lng]),
      L.marker([destination.coordinates.lat, destination.coordinates.lng]),
      ...travel_plan.intermediate_stops_going.map(stop => 
        L.marker([stop.coordinates.lat, stop.coordinates.lng])
      ),
      ...travel_plan.intermediate_stops_return.map(stop => 
        L.marker([stop.coordinates.lat, stop.coordinates.lng])
      )
    ]);
    
    mapInstance.current.fitBounds(group.getBounds().pad(0.1));
  };

  const drawRouteLines = () => {
    if (!calculateTripData || !mapInstance.current) return;

    const { origin, destination, return_destination, travel_plan } = calculateTripData;

    // Draw going route (blue line)
    const goingPoints = [
      [origin.coordinates.lat, origin.coordinates.lng],
      ...travel_plan.intermediate_stops_going.map(stop => [stop.coordinates.lat, stop.coordinates.lng]),
      [destination.coordinates.lat, destination.coordinates.lng]
    ];

    const goingPolyline = L.polyline(goingPoints, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(mapInstance.current);

    goingPolyline.bindPopup('<b>🛣️ Going Route</b><br>Origin to Destination');

    // Draw return route (green line) if different destination
    if (return_destination && return_destination.coordinates.lat !== destination.coordinates.lat) {
      const returnPoints = [
        [destination.coordinates.lat, destination.coordinates.lng],
        [return_destination.coordinates.lat, return_destination.coordinates.lng],
        [origin.coordinates.lat, origin.coordinates.lng]
      ];

      const returnPolyline = L.polyline(returnPoints, {
        color: '#10b981',
        weight: 4,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(mapInstance.current);

      returnPolyline.bindPopup('<b>🔁 Return Route</b><br>Different return path');
    } else {
      // Draw direct return route (red line)
      const returnPoints = [
        [destination.coordinates.lat, destination.coordinates.lng],
        [origin.coordinates.lat, origin.coordinates.lng]
      ];

      const returnPolyline = L.polyline(returnPoints, {
        color: '#ef4444',
        weight: 4,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(mapInstance.current);

      returnPolyline.bindPopup('<b>🔙 Return Route</b><br>Direct return path');
    }
  };

  const addPlaceToMap = (place) => {
    if (!mapInstance.current || !place.coordinates) return;

    // Create custom icon based on place type
    const getIcon = (type) => {
      const iconColor = type === 'accommodation' ? 'purple' : 
                       type === 'restaurant' ? 'orange' : 'red';
      
      return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${iconColor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    };

    const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
      icon: getIcon(activeTab === 'accommodations' ? 'accommodation' : 'restaurant')
    }).addTo(mapInstance.current);

    const popupContent = `
      <div class="p-2">
        <b>${activeTab === 'accommodations' ? '🏨' : '🍽️'} ${place.name}</b><br>
        <small>${place.address}</small><br>
        ${place.rating ? `<span>⭐ ${place.rating}/5</span><br>` : ''}
        ${place.distance_km ? `<span>📏 ${place.distance_km} km away</span>` : ''}
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    // Center map on this place
    mapInstance.current.setView([place.coordinates.lat, place.coordinates.lng], 13);
  };

  // Helper functions for budget calculations
  const getProgressPercentage = (spent, budget) => {
    return (spent / budget) * 100;
  };

  const getOverallProgress = () => {
    if (!calculateTripData) return 0;
    const spent = calculateTripData.divided_budget.travel + 
                  calculateTripData.divided_budget.hotel + 
                  calculateTripData.divided_budget.food + 
                  calculateTripData.divided_budget.activities;
    return (spent / calculateTripData.summary.total_budget) * 100;
  };

  const getCategoryCircleData = () => {
    if (!calculateTripData) return [];
    
    const categories = [
      { name: "Travel", spent: calculateTripData.divided_budget.travel, budget: calculateTripData.divided_budget.travel, color: "#3b82f6" },
      { name: "Hotel", spent: calculateTripData.divided_budget.hotel, budget: calculateTripData.divided_budget.hotel, color: "#8b5cf6" },
      { name: "Food", spent: calculateTripData.divided_budget.food, budget: calculateTripData.divided_budget.food, color: "#f59e0b" },
      { name: "Activities", spent: calculateTripData.divided_budget.activities, budget: calculateTripData.divided_budget.activities, color: "#10b981" }
    ];

    const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);
   
    return categories.map(category => ({
      ...category,
      percentage: (category.spent / totalSpent) * 100
    }));
  };

  const categoryCircleData = getCategoryCircleData();
 
  // Calculate angles for the circle segments
  let currentAngle = -90;
  const circleSegments = categoryCircleData.map(category => {
    const angle = (category.percentage / 100) * 360;
    const segment = {
      ...category,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  // Function to calculate SVG path for circle segments
  const getCircleSegmentPath = (cx, cy, radius, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
   
    return [
      "M", cx, cy,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (cx, cy, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (radius * Math.cos(angleInRadians)),
      y: cy + (radius * Math.sin(angleInRadians))
    };
  };

  // Get display data based on active tab
  const getDisplayData = () => {
    if (!calculateTripData) return [];
    
    switch (activeTab) {
      case 'attractions':
        return calculateTripData.attractions || [];
      case 'accommodations':
        return calculateTripData.accommodations || [];
      case 'restaurants':
        return calculateTripData.restaurants || [];
      default:
        return [];
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'attractions':
        return '🏛️';
      case 'accommodations':
        return '🏨';
      case 'restaurants':
        return '🍽️';
      default:
        return '📍';
    }
  };

  // Function to copy share link to clipboard
  const copyShareLink = () => {
    const shareLink = "https://tripplanner.com/trip/european-adventure-2024";
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  // Function to get location name from address
  const getLocationName = (address) => {
    if (!address) return 'Unknown Location';
    
    // Try to extract a meaningful name from the address
    const parts = address.split(',');
    if (parts.length > 0) {
      // Return the first part (usually the most specific location name)
      return parts[0].trim();
    }
    return address;
  };

 const SaveTravaldatafunc=async()=>{


  console.log('calculateTripData',)
  console.log('calculateTripData',calculateTripData)
  const originlat =calculateTripData.origin.coordinates.lat
  const originlng =calculateTripData.origin.coordinates.lng


  const destinationlat=calculateTripData.destination.coordinates.lat
  const destinationlng=calculateTripData.destination.coordinates.lng
  
 console.log('destinaion locaion    ',originlat,'   ',originlng)
 console.log('starting location  ',destinationlat,'     ',destinationlng)

  try{
    await axios.post('http://127.0.0.1:8006/TripSaveAPIView/',{'calculateTripData':calculateTripData},{
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log('trip data has stored in the db')
  }catch(e){
   console.log('trip data does not save in the db ')
  }
 }

  const handleClearTrip = () => {
    dispatch(clearTripData());
    console.log('your trip is deleted......')
    navigate('/TravelPlannerofBadget')
  };














  if (!calculateTripData) {
    return (
      <div className="font-display bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-4">No Trip Data Available</div>
          <p className="text-gray-600">Please calculate a trip first to see the dashboard.</p>
        </div>
      </div>
    );
  }

  const {
    origin,
    destination,
    return_destination,
    travel_plan,
    coordinates,
    daily_itineraries,
    attractions,
    accommodations,
    restaurants,
    summary,
    daily_budgets,
    divided_budget
  } = calculateTripData;

  const currentDayItinerary = daily_itineraries.find(day => day.day === currentDay) || daily_itineraries[0];
  const displayData = getDisplayData();

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <Navbar/>
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header Section */}
          <header className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:flex-wrap justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-4xl font-black leading-tight tracking-tight">
                  {getLocationName(destination.address)} Adventure
                  
                </h1>
                <p className="text-sm lg:text-base font-normal text-gray-500">
                  {daily_itineraries[0]?.date} - {daily_itineraries[daily_itineraries.length - 1]?.date}
                </p>
                <p className="text-sm text-gray-600">
                  {summary.going_days} days going • {summary.return_days} days returning • {summary.travel_mode} travel
                </p>
              </div>
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <button onClick={SaveTravaldatafunc} className="flex-1 lg:flex-none flex items-center justify-center rounded-lg h-10 px-4 border border-gray-300 text-sm font-bold gap-2 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-base">save</span>
                  <span className="truncate">Save</span>
                </button>
                  <button className="flex-1 lg:flex-none flex items-center justify-center rounded-lg h-10 px-4 border border-gray-300 text-sm font-bold gap-2 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-base">edit</span>
                  <span className="truncate">Edit</span>
                </button>
                  



                       <button onClick={handleClearTrip} className="w-full flex items-center justify-center rounded-lg h-10 px-4 border border-red-500 text-red-500 text-sm font-bold gap-2 hover:bg-red-50">
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span className="truncate">Cancel Trip</span>
                    </button>
              </div>
            </div>
           
            {/* Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Total Budget</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">
                    ₹{summary.total_budget}
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Total Distance</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">
                    {summary.total_round_trip_distance_km} km
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Trip Duration</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">
                    {summary.trip_duration_days} Days
                  </p>
                </div>
              </div>
              <div className="rounded-lg p-4 lg:p-6 bg-white border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-sm lg:text-base font-medium">Weather ({getLocationName(destination.address)})</p>
                  <p className="text-xl lg:text-3xl font-bold">{destination.weather.temperature}°C</p>
                  <p className="text-sm text-gray-600 capitalize">{destination.weather.description}</p>
                </div>
                <span className="material-symbols-outlined text-3xl lg:text-5xl text-yellow-500">
                  {destination.weather.description.includes('rain') ? 'rainy' : 'partly_cloudy_day'}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content (Two-Column Layout) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Left Column */}
            <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
              {/* Interactive Map */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Journey Map & Directions</h3>
                <div 
                  ref={mapRef} 
                  className="w-full h-96 rounded-lg"
                  style={{ height: '400px' }}
                ></div>
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Origin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span>Destination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>Return Stop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Going Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Return Route</span>
                  </div>
                </div>
              </div>
             
              {/* Budget Tracker */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Budget Allocation</h3>
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                  {/* Segmented Circle Progress */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                     
                      {circleSegments.map((segment, index) => (
                        <path
                          key={segment.name}
                          d={getCircleSegmentPath(50, 50, 45, segment.startAngle, segment.endAngle)}
                          fill={segment.color}
                          stroke={segment.color}
                          strokeWidth="2"
                        />
                      ))}
                     
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="white"
                      />
                    </svg>
                   
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                        {getOverallProgress().toFixed(0)}%
                      </span>
                      <span className="text-sm text-gray-500">Allocated</span>
                    </div>
                  </div>
                 
                  {/* Budget Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-blue-600">₹{divided_budget.travel}</p>
                      <p className="text-sm text-gray-500">Travel</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-purple-600">₹{divided_budget.hotel}</p>
                      <p className="text-sm text-gray-500">Accommodation</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-orange-500">₹{divided_budget.food}</p>
                      <p className="text-sm text-gray-500">Food</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-green-500">₹{divided_budget.activities}</p>
                      <p className="text-sm text-gray-500">Activities</p>
                    </div>
                  </div>
                </div>
               
                {/* Category Breakdown */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {circleSegments.map((category, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span>₹{category.spent}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
           
            {/* Right Column - Daily Itinerary */}
            <div className="xl:col-span-1 bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg lg:text-xl font-bold">Daily Itinerary</h3>
                <select 
                  value={currentDay}
                  onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {daily_itineraries.map(day => (
                    <option key={day.day} value={day.day}>
                      Day {day.day} - {day.date}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4 lg:space-y-6 max-h-[500px] lg:max-h-[800px] overflow-y-auto pr-2">
                <div>
                  <p className="font-bold text-sm lg:text-base mb-2">
                    Day {currentDayItinerary.day}: {currentDayItinerary.date} - {currentDayItinerary.trip_phase === 'going' ? 'Going' : 'Returning'} Day {currentDayItinerary.phase_day}
                  </p>
                  <div className="relative pl-6 lg:pl-8 space-y-3 lg:space-y-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[9px] lg:-left-[11px] top-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-blue-600 ring-2 lg:ring-4 ring-white"></div>
                    
                    {currentDayItinerary.schedule.map((activity, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs lg:text-sm font-semibold">{activity.time} - {activity.activity}</p>
                          <p className="text-xs text-gray-500">
                            {activity.details && typeof activity.details === 'object' 
                              ? activity.details.activity || activity.details.meal_type || `${activity.details.distance} travel`
                              : activity.details}
                          </p>
                        </div>
                        {activity.estimated_cost > 0 && (
                          <span className="text-xs lg:text-sm font-bold text-blue-500 ml-2">
                            ₹{activity.estimated_cost}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Places Explorer */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold mb-4">Places Explorer {getTabIcon()}</h3>
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-4 lg:space-x-6 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('attractions')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'attractions' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Attractions ({attractions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('accommodations')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'accommodations' 
                        ? 'border-purple-600 text-purple-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Accommodations ({accommodations.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('restaurants')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'restaurants' 
                        ? 'border-orange-600 text-orange-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Restaurants ({restaurants.length})
                  </button>
                </nav>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayData.slice(0, 6).map((place, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addPlaceToMap(place)}
                  >
                    {place.photo_url ? (
                      <img 
                        src={place.photo_url} 
                        alt={place.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400">
                          {activeTab === 'attractions' ? 'landscape' : 
                           activeTab === 'accommodations' ? 'hotel' : 'restaurant'}
                        </span>
                      </div>
                    )}
                    <div className="p-3 lg:p-4">
                      <h4 className="font-bold text-sm lg:text-base truncate">{place.name}</h4>
                      <div className="flex items-center text-xs lg:text-sm text-gray-500 mt-1">
                        <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                        <span className="ml-1">{place.rating || 'No rating'}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate" title={place.address}>
                        {getLocationName(place.address)}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">{place.distance_km} km away</p>
                      <button 
                        className="mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          addPlaceToMap(place);
                        }}
                      >
                        Show on Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {displayData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {activeTab} found for this trip.
                </div>
              )}
            </div>
           
            {/* Right Column - Trip Summary & Management */}
            <div className="space-y-6 lg:space-y-8">
              {/* Trip Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Trip Summary</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Going Distance</p>
                      <p className="text-xl font-bold">{summary.going_distance_km} km</p>
                      <p className="text-xs text-blue-600">Direction: {destination.direction}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Return Distance</p>
                      <p className="text-xl font-bold">{summary.return_distance_km} km</p>
                      <p className="text-xs text-green-600">Direction: {return_destination?.direction || 'Direct'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Travel Mode:</span>
                      <span className="text-sm font-medium capitalize">{summary.travel_mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vehicle Mileage:</span>
                      <span className="text-sm font-medium">{summary.vehicle_mileage} km/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost per km:</span>
                      <span className="text-sm font-medium">₹{summary.cost_per_km}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Activities:</span>
                      <span className="text-sm font-medium">{summary.total_scheduled_activities}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-sm mb-2">Route Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Origin:</span>
                        <span className="text-right max-w-[150px] truncate" title={origin.address}>
                          {getLocationName(origin.address)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span className="text-right max-w-[150px] truncate" title={destination.address}>
                          {getLocationName(destination.address)}
                        </span>
                      </div>
                      {return_destination && (
                        <div className="flex justify-between">
                          <span>Return Stop:</span>
                          <span className="text-right max-w-[150px] truncate" title={return_destination.address}>
                            {getLocationName(return_destination.address)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Management */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Trip Management</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-sm lg:text-base mb-3 block">Visibility Settings</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={visibility === 'private'}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">lock</span>
                          <span className="text-sm">Private (Only invited collaborators)</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="invite-only"
                          checked={visibility === 'invite-only'}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">link</span>
                          <span className="text-sm">Invite Only</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={visibility === 'public'}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">public</span>
                          <span className="text-sm">Public (Anyone with link)</span>
                        </div>
                      </label>
                    </div>
                    
                    {/* Share Link - Only show for invite-only and public */}
                    {(visibility === 'invite-only' || visibility === 'public') && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Share this link:</p>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 text-sm bg-white border border-blue-200 rounded px-3 py-2 text-blue-600"
                            value="https://tripplanner.com/trip/european-adventure-2024"
                            readOnly
                          />
                          <button 
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            onClick={copyShareLink}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="font-medium text-sm lg:text-base">Invite Collaborators</label>
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <input 
                        className="w-full rounded-md border-gray-300 bg-transparent text-sm focus:ring-blue-600 focus:border-blue-600" 
                        placeholder="friend@email.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button className="flex-shrink-0 rounded-md h-10 px-4 bg-green-500 text-white text-sm font-bold whitespace-nowrap">
                        Invite
                      </button>
                    </div>
                  </div>
                  
                  {/* <div>
                    <label className="font-medium text-sm lg:text-base">Postpone Trip</label>
                    <input 
                      className="w-full mt-1 rounded-md border-gray-300 bg-transparent text-sm focus:ring-blue-600 focus:border-blue-600" 
                      type="date"
                    />
                  </div>
                   */}
                  <div>
  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;