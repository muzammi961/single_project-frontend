import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import INvateTripNavbar from './invatetripNavbar'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DashboardLayoutinvateorpublic = () => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [activeTab, setActiveTab] = useState('attractions');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const { invatetripid } = useParams();

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8006/TripSpecificAPIViewWithoutuserIdPublicorinvateonly/${invatetripid}`);
        setTripData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trip data');
        setLoading(false);
      }
    };

    if (invatetripid) {
      fetchTripData();
    }
  }, [invatetripid]);

  // Initialize map
  useEffect(() => {
    if (!tripData || !tripData.origin || !mapRef.current) return;

    if (!mapInstance.current) {
      const origin = tripData.origin.coordinates;
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

    // Add markers and routes
    addMarkersAndRoutes();

  }, [tripData]);

  const addMarkersAndRoutes = () => {
    if (!tripData || !mapInstance.current) return;

    const { origin, destination, return_destination, travel_plan } = tripData;
    
    // Add origin marker
    const originName = getLocationName(origin);
    L.marker([origin.coordinates.lat, origin.coordinates.lng])
      .addTo(mapInstance.current)
      .bindPopup(`<b>🚩 Origin</b><br>${originName}`)
      .openPopup();

    // Add destination marker
    const destinationName = getDestinationName();
    L.marker([destination.coordinates.lat, destination.coordinates.lng])
      .addTo(mapInstance.current)
      .bindPopup(`<b>🎯 Destination</b><br>${destinationName}<br>Distance: ${destination.distance_from_origin_km} km`);

    // Add return destination marker if exists
    if (return_destination && return_destination.coordinates) {
      const returnDestinationName = getLocationName(return_destination);
      L.marker([return_destination.coordinates.lat, return_destination.coordinates.lng])
        .addTo(mapInstance.current)
        .bindPopup(`<b>🔁 Return Stop</b><br>${returnDestinationName}`)
        .setIcon(new L.Icon({
          ...L.Icon.Default.prototype.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
        }));
    }

    // Add intermediate stops for going journey
    if (travel_plan.intermediate_stops_going) {
      travel_plan.intermediate_stops_going.forEach((stop, index) => {
        if (stop.coordinates) {
          const stopName = getLocationName(stop);
          L.marker([stop.coordinates.lat, stop.coordinates.lng])
            .addTo(mapInstance.current)
            .bindPopup(`<b>📍 Stop ${index + 1} (Going)</b><br>Day ${stop.day}<br>${stopName}`)
            .setIcon(new L.Icon({
              ...L.Icon.Default.prototype.options,
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'
            }));
        }
      });
    }

    // Add intermediate stops for return journey
    if (travel_plan.intermediate_stops_return) {
      travel_plan.intermediate_stops_return.forEach((stop, index) => {
        if (stop.coordinates) {
          const stopName = getLocationName(stop);
          L.marker([stop.coordinates.lat, stop.coordinates.lng])
            .addTo(mapInstance.current)
            .bindPopup(`<b>📍 Stop ${index + 1} (Return)</b><br>Day ${stop.day}<br>${stopName}`)
            .setIcon(new L.Icon({
              ...L.Icon.Default.prototype.options,
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png'
            }));
        }
      });
    }

    // Draw route lines
    drawRouteLines();

    // Fit map to show all markers
    const group = L.featureGroup([
      L.marker([origin.coordinates.lat, origin.coordinates.lng]),
      L.marker([destination.coordinates.lat, destination.coordinates.lng]),
      ...(travel_plan.intermediate_stops_going || []).map(stop => 
        stop.coordinates ? L.marker([stop.coordinates.lat, stop.coordinates.lng]) : null
      ).filter(Boolean),
      ...(travel_plan.intermediate_stops_return || []).map(stop => 
        stop.coordinates ? L.marker([stop.coordinates.lat, stop.coordinates.lng]) : null
      ).filter(Boolean),
      ...(return_destination && return_destination.coordinates ? 
        [L.marker([return_destination.coordinates.lat, return_destination.coordinates.lng])] : [])
    ]);

    mapInstance.current.fitBounds(group.getBounds().pad(0.1));
  };

  const drawRouteLines = () => {
    if (!tripData || !mapInstance.current) return;

    const { origin, destination, return_destination, travel_plan } = tripData;

    // Draw going route (blue line)
    const goingPoints = [
      [origin.coordinates.lat, origin.coordinates.lng],
      ...(travel_plan.intermediate_stops_going || []).map(stop => 
        stop.coordinates ? [stop.coordinates.lat, stop.coordinates.lng] : null
      ).filter(Boolean),
      [destination.coordinates.lat, destination.coordinates.lng]
    ];

    const goingPolyline = L.polyline(goingPoints, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(mapInstance.current);

    // Draw return route
    if (return_destination && return_destination.coordinates) {
      const returnPoints = [
        [destination.coordinates.lat, destination.coordinates.lng],
        ...(travel_plan.intermediate_stops_return || []).map(stop => 
          stop.coordinates ? [stop.coordinates.lat, stop.coordinates.lng] : null
        ).filter(Boolean),
        [return_destination.coordinates.lat, return_destination.coordinates.lng],
        [origin.coordinates.lat, origin.coordinates.lng]
      ];

      const returnPolyline = L.polyline(returnPoints, {
        color: '#10b981',
        weight: 4,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(mapInstance.current);
    } else {
      // Direct return route
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
    }
  };

  // Helper functions
  const getLocationName = (locationData) => {
    if (!locationData) return 'Unknown Location';
    
    if (typeof locationData === 'string') {
      const parts = locationData.split(',');
      return parts[0].trim();
    }
    
    if (locationData.address) {
      const parts = locationData.address.split(',');
      return parts[0].trim();
    }
    
    if (locationData.name) {
      return locationData.name;
    }
    
    return 'Unknown Location';
  };

  const getDestinationName = () => {
    if (!tripData || !tripData.destination) return 'Destination';
    return tripData.destination.name || getLocationName(tripData.destination);
  };

  const getDisplayData = () => {
    if (!tripData) return [];
    
    switch (activeTab) {
      case 'attractions':
        return tripData.attractions || [];
      case 'accommodations':
        return tripData.accommodations || [];
      case 'restaurants':
        return tripData.restaurants || [];
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

  const getWeatherData = () => {
    if (tripData?.destination?.weather) {
      return tripData.destination.weather;
    }
    return { temperature: 'N/A', description: 'No data' };
  };

  // Budget calculations
  const getOverallProgress = () => {
    if (!tripData || !tripData.divided_budget) return 0;
    const spent = (tripData.divided_budget.travel || 0) + 
                  (tripData.divided_budget.hotel || 0) + 
                  (tripData.divided_budget.food || 0) + 
                  (tripData.divided_budget.activities || 0);
    const totalBudget = tripData.summary?.total_budget || 1;
    return (spent / totalBudget) * 100;
  };

  const getCategoryCircleData = () => {
    if (!tripData || !tripData.divided_budget) return [];
    
    const categories = [
      { name: "Travel", spent: tripData.divided_budget.travel || 0, budget: tripData.divided_budget.travel || 0, color: "#3b82f6" },
      { name: "Hotel", spent: tripData.divided_budget.hotel || 0, budget: tripData.divided_budget.hotel || 0, color: "#8b5cf6" },
      { name: "Food", spent: tripData.divided_budget.food || 0, budget: tripData.divided_budget.food || 0, color: "#f59e0b" },
      { name: "Activities", spent: tripData.divided_budget.activities || 0, budget: tripData.divided_budget.activities || 0, color: "#10b981" }
    ];

    const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);
   
    return categories.map(category => ({
      ...category,
      percentage: totalSpent > 0 ? (category.spent / totalSpent) * 100 : 25
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

  // Show loading state
  if (loading) {
    return (
      <div className="font-display bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-bold">Loading Trip...</div>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="font-display bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-4">Trip Not Found</div>
          <p className="text-gray-600">{error || "The requested trip could not be loaded."}</p>
        </div>
      </div>
    );
  }

  const {
    origin,
    destination,
    return_destination,
    travel_plan,
    daily_itineraries = [],
    attractions = [],
    accommodations = [],
    restaurants = [],
    summary = {},
    divided_budget = {}
  } = tripData;

  const currentDayItinerary = daily_itineraries.find(day => day.day === currentDay) || daily_itineraries[0];
  const displayData = getDisplayData();
  const destinationName = getDestinationName();
  const originName = getLocationName(origin);
  const weatherData = getWeatherData();

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="flex flex-col min-h-screen">
        <INvateTripNavbar/>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">TripPlanner</h1>
            <div className="text-sm text-gray-500">
              Shared Trip • View Only
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header Section */}
          <header className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:flex-wrap justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-4xl font-black leading-tight tracking-tight">
                  Trip to {destinationName}
                </h1>
                <p className="text-sm lg:text-base font-normal text-gray-500">
                  {daily_itineraries[0]?.date || 'Start date'} - {daily_itineraries[daily_itineraries.length - 1]?.date || 'End date'}
                </p>
                <p className="text-sm text-gray-600">
                  {summary.going_days || 0} days going • {summary.return_days || 0} days returning • {summary.travel_mode || 'car'} travel
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <span className="material-symbols-outlined text-base">visibility</span>
                <span className="text-sm font-medium">View Only Mode</span>
              </div>
            </div>
           
            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Total Budget</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">
                    ₹{summary.total_budget || 0}
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Total Distance</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">
                    {summary.total_round_trip_distance_km || 0} km
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Trip Duration</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">
                    {summary.trip_duration_days || 0} Days
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg p-4 lg:p-6 bg-white border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-sm lg:text-base font-medium">Weather ({destinationName})</p>
                  <p className="text-xl lg:text-3xl font-bold">{weatherData.temperature}°C</p>
                  <p className="text-sm text-gray-600 capitalize">{weatherData.description}</p>
                </div>
                <span className="material-symbols-outlined text-3xl lg:text-5xl text-yellow-500">
                  {weatherData.description?.includes('rain') ? 'rainy' : 
                   weatherData.description?.includes('cloud') ? 'cloudy' : 'sunny'}
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
                      <p className="text-2xl lg:text-3xl font-bold text-blue-600">₹{divided_budget.travel || 0}</p>
                      <p className="text-sm text-gray-500">Travel</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-purple-600">₹{divided_budget.hotel || 0}</p>
                      <p className="text-sm text-gray-500">Accommodation</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-orange-500">₹{divided_budget.food || 0}</p>
                      <p className="text-sm text-gray-500">Food</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl lg:text-3xl font-bold text-green-500">₹{divided_budget.activities || 0}</p>
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
                {currentDayItinerary ? (
                  <div>
                    <p className="font-bold text-sm lg:text-base mb-2">
                      Day {currentDayItinerary.day}: {currentDayItinerary.date} - {currentDayItinerary.trip_phase === 'going' ? 'Going' : 'Returning'} Day {currentDayItinerary.phase_day}
                    </p>
                    <div className="relative pl-6 lg:pl-8 space-y-3 lg:space-y-4 border-l-2 border-gray-200">
                      <div className="absolute -left-[9px] lg:-left-[11px] top-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-blue-600 ring-2 lg:ring-4 ring-white"></div>
                      
                      {(currentDayItinerary.schedule || []).map((activity, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-xs lg:text-sm font-semibold">{activity.time} - {activity.activity}</p>
                            <p className="text-xs text-gray-500">
                              {activity.details && typeof activity.details === 'object' 
                                ? activity.details.activity || activity.details.meal_type || `${activity.details.distance} travel` || 'Activity details'
                                : activity.details || 'No details available'}
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
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No itinerary available for this day
                  </div>
                )}
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
                    className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {place.photo_url ? (
                      <img 
                        src={place.photo_url} 
                        alt={place.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-32 bg-gray-200 flex items-center justify-center ${place.photo_url ? 'hidden' : 'flex'}`}>
                      <span className="material-symbols-outlined text-gray-400 text-4xl">
                        {activeTab === 'attractions' ? 'landscape' : 
                         activeTab === 'accommodations' ? 'hotel' : 'restaurant'}
                      </span>
                    </div>
                    <div className="p-3 lg:p-4">
                      <h4 className="font-bold text-sm lg:text-base truncate" title={place.name}>
                        {place.name || 'Unknown Place'}
                      </h4>
                      <div className="flex items-center text-xs lg:text-sm text-gray-500 mt-1">
                        <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                        <span className="ml-1">{place.rating || 'No rating'}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate" title={place.address}>
                        {place.address || 'Address not available'}
                      </p>
                      {place.distance_km && (
                        <p className="text-xs text-blue-600 mt-1">{place.distance_km} km away</p>
                      )}
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
           
            {/* Right Column - Trip Summary */}
            <div className="space-y-6 lg:space-y-8">
              {/* Trip Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Trip Summary</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Going Distance</p>
                      <p className="text-xl font-bold">{summary.going_distance_km || 0} km</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Return Distance</p>
                      <p className="text-xl font-bold">{summary.return_distance_km || 0} km</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Travel Mode:</span>
                      <span className="text-sm font-medium capitalize">{summary.travel_mode || 'car'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vehicle Mileage:</span>
                      <span className="text-sm font-medium">{summary.vehicle_mileage || 0} km/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost per km:</span>
                      <span className="text-sm font-medium">₹{summary.cost_per_km || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Activities:</span>
                      <span className="text-sm font-medium">{summary.total_scheduled_activities || 0}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-sm mb-2">Route Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Origin:</span>
                        <span className="text-right max-w-[150px] truncate" title={origin.address}>
                          {originName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span className="text-right max-w-[150px] truncate" title={destination.address}>
                          {destinationName}
                        </span>
                      </div>
                      {return_destination && (
                        <div className="flex justify-between">
                          <span>Return Stop:</span>
                          <span className="text-right max-w-[150px] truncate" title={return_destination.address}>
                            {getLocationName(return_destination)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Trip Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="material-symbols-outlined text-blue-600">info</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Shared Trip</p>
                      <p className="text-xs text-blue-600">This is a view-only version of the trip plan</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trip Type:</span>
                      <span className="font-medium capitalize">{(tripData.trip_types || []).join(', ') || 'General'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Category:</span>
                      <span className="font-medium capitalize">{tripData.budget_category || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Round Trip:</span>
                      <span className="font-medium">{summary.is_round_trip ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
            <button onClick={()=>navigate(`/Joininthepublictrip/${summary.invite_code}/`)} className="flex items-center justify-center w-full  rounded-lg text-white text-sm font-medium  py-2.5 transition-all hover:bg-primary/90 dark:bg-black dark:text-primary dark:hover:bg-gray-500">Travel Book</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6">
          <div className="text-center text-sm text-gray-500">
            Shared via TripPlanner • View Only Access
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayoutinvateorpublic;