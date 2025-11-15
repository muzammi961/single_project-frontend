import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Pt_Bd_Navbar from './Pt_Bd_Navbar'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Pt_Bd_DashboardLayout() {
  const navigate=useNavigate()
  const [newDate, setNewDate] = useState('');
  const [tripdata, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDateoftriploading, SetChangeDateoftriploading] = useState(false);
  const [error, setError] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [activeTab, setActiveTab] = useState('attractions');
  const [visibility, setVisibility] = useState('private');
  const [email, setEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  
  const token = localStorage.getItem("access_token");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const trip_id = useSelector((state) => state.app.prtpidcode);

  const fetchspecifictripdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8006/TripSpecificAPIView/${trip_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTripData(response.data || null);

      if (response.data?.visibility) {
        setVisibility(response.data.visibility);
      }
      if (response.data?.invite_link) {
        setShareLink(response.data.invite_link);
      }
      console.log('trip data', response.data);
    } catch (error) {
      console.error("❌ Error fetching trips:", error);
      setError("Failed to load trip data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('asdfasdfasdf', trip_id)
    fetchspecifictripdata();
  }, [token, trip_id]);

  // Initialize map when tripdata is available
  useEffect(() => {
    if (!tripdata || !tripdata.origin) return;

    if (!mapInstance.current && mapRef.current) {
      const origin = tripdata.origin.coordinates;
      mapInstance.current = L.map(mapRef.current).setView([origin.lat, origin.lng], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing layers and add markers/routes
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) return;
        mapInstance.current.removeLayer(layer);
      });
      addMarkersAndRoutes();
    }
  }, [tripdata]);

  // Update visibility and generate share link
  const updateTripVisibility = async (newVisibility) => {
    setIsUpdatingVisibility(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8006/TripVisibilityUpdateView/`,
        {
          trip_id: trip_id,
          visibility: newVisibility
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.trip) {
        setVisibility(newVisibility);
        setShareLink(response.data.trip.invite_link || '');
      }
      
      console.log('Visibility updated:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating trip visibility:", error);
      alert('Failed to update trip visibility');
    } finally {
      setIsUpdatingVisibility(false);
    }
  };



const Gettriplinkfunc = async () => {
    
    try {
      const response = await axios.get(`http://127.0.0.1:8006/GetTriplink/${trip_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.triplink){
        console.log('asdfasfasdf')
        // setIsUpdatingVisibility(true);
        setVisibility(response.data.visibility);
        setShareLink(response.data.triplink || '');
      }
    } catch (error) {
      console.error("❌ Error fetching trips:", error);
  };
  }

useEffect(()=>{
Gettriplinkfunc()
},[trip_id])


const InviteJoinThrougEmailfunc = async () => {
  console.log('emal',email)
    try {
    const response=await axios.post(`http://127.0.0.1:8006/InviteJoinThrougEmailAPIView/${trip_id}/`,{'email':email});
    // if(response.data.message){
    //   alert(response.data.message)
    // }
    }catch(error) {
      alert(response.data.error)
  };
  }


  const handleVisibilityChange = async (newVisibility) => {
    setVisibility(newVisibility);
    await updateTripVisibility(newVisibility);
  };

  // Improved function to get location name
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
    
    if (locationData.coordinates) {
      return `Location (${locationData.coordinates.lat?.toFixed(4) || 'N/A'}, ${locationData.coordinates.lng?.toFixed(4) || 'N/A'})`;
    }
    
    return 'Unknown Location';
  };

  const getDestinationName = () => {
    if (!tripdata || !tripdata.destination) return 'Destination';
    return tripdata.destination.name || getLocationName(tripdata.destination);
  };

  const addMarkersAndRoutes = () => {
    if (!tripdata || !mapInstance.current) return;

    const { origin, destination, return_destination, travel_plan } = tripdata;
    
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
    if (return_destination && return_destination.coordinates && 
        (return_destination.coordinates.lat !== destination.coordinates.lat || 
         return_destination.coordinates.lng !== destination.coordinates.lng)) {
      const returnDestinationName = getLocationName(return_destination);
      L.marker([return_destination.coordinates.lat, return_destination.coordinates.lng])
        .addTo(mapInstance.current)
        .bindPopup(`<b>🔁 Return Stop</b><br>${returnDestinationName}<br>Distance: ${return_destination.distance_from_origin_km} km`)
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
    const markers = [
      L.marker([origin.coordinates.lat, origin.coordinates.lng]),
      L.marker([destination.coordinates.lat, destination.coordinates.lng])
    ];

    // Add intermediate stops markers
    if (travel_plan.intermediate_stops_going) {
      travel_plan.intermediate_stops_going.forEach(stop => {
        if (stop.coordinates) {
          markers.push(L.marker([stop.coordinates.lat, stop.coordinates.lng]));
        }
      });
    }

    if (travel_plan.intermediate_stops_return) {
      travel_plan.intermediate_stops_return.forEach(stop => {
        if (stop.coordinates) {
          markers.push(L.marker([stop.coordinates.lat, stop.coordinates.lng]));
        }
      });
    }

    if (return_destination && return_destination.coordinates) {
      markers.push(L.marker([return_destination.coordinates.lat, return_destination.coordinates.lng]));
    }

    const group = new L.featureGroup(markers);
    mapInstance.current.fitBounds(group.getBounds().pad(0.1));
  };

  const drawRouteLines = () => {
    if (!tripdata || !mapInstance.current) return;

    const { origin, destination, return_destination, travel_plan } = tripdata;

    // Draw going route (blue line)
    const goingPoints = [
      [origin.coordinates.lat, origin.coordinates.lng]
    ];

    // Add intermediate stops for going route
    if (travel_plan.intermediate_stops_going) {
      travel_plan.intermediate_stops_going.forEach(stop => {
        if (stop.coordinates) {
          goingPoints.push([stop.coordinates.lat, stop.coordinates.lng]);
        }
      });
    }

    goingPoints.push([destination.coordinates.lat, destination.coordinates.lng]);

    const goingPolyline = L.polyline(goingPoints, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(mapInstance.current);

    const originName = getLocationName(origin);
    const destinationName = getDestinationName();
    goingPolyline.bindPopup(`<b>🛣️ Going Route</b><br>${originName} to ${destinationName}`);

    // Draw return route
    if (return_destination && return_destination.coordinates) {
      const returnPoints = [
        [destination.coordinates.lat, destination.coordinates.lng]
      ];

      // Add intermediate stops for return route
      if (travel_plan.intermediate_stops_return) {
        travel_plan.intermediate_stops_return.forEach(stop => {
          if (stop.coordinates) {
            returnPoints.push([stop.coordinates.lat, stop.coordinates.lng]);
          }
        });
      }

      returnPoints.push([return_destination.coordinates.lat, return_destination.coordinates.lng]);
      returnPoints.push([origin.coordinates.lat, origin.coordinates.lng]);

      const returnPolyline = L.polyline(returnPoints, {
        color: '#10b981',
        weight: 4,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(mapInstance.current);

      const returnDestinationName = getLocationName(return_destination);
      returnPolyline.bindPopup(`<b>🔁 Return Route</b><br>${destinationName} to ${returnDestinationName}`);
    } else {
      // Direct return route (red line)
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

      returnPolyline.bindPopup(`<b>🔙 Return Route</b><br>${destinationName} to ${getLocationName(origin)}`);
    }
  };

  const addPlaceToMap = (place) => {
    if (!mapInstance.current || !place.coordinates) return;

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
      icon: getIcon(activeTab.slice(0, -1))
    }).addTo(mapInstance.current);

    const placeName = place.name || getLocationName(place);
    const popupContent = `
      <div class="p-2">
        <b>${activeTab === 'accommodations' ? '🏨' : activeTab === 'restaurants' ? '🍽️' : '🏛️'} ${placeName}</b><br>
        <small>${place.address || 'Address not available'}</small><br>
        ${place.rating ? `<span>⭐ ${place.rating}/5</span><br>` : ''}
        ${place.distance_km ? `<span>📏 ${place.distance_km} km away</span>` : ''}
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();
    mapInstance.current.setView([place.coordinates.lat, place.coordinates.lng], 13);
  };

  // Helper functions for budget calculations
  const getOverallProgress = () => {
    if (!tripdata || !tripdata.divided_budget) return 0;
    const spent = (tripdata.divided_budget.travel || 0) + 
                  (tripdata.divided_budget.hotel || 0) + 
                  (tripdata.divided_budget.food || 0) + 
                  (tripdata.divided_budget.activities || 0);
    const totalBudget = tripdata.summary?.total_budget || 1;
    return (spent / totalBudget) * 100;
  };

  const getCategoryCircleData = () => {
    if (!tripdata || !tripdata.divided_budget) return [];
    
    const categories = [
      { name: "Travel", spent: tripdata.divided_budget.travel || 0, budget: tripdata.divided_budget.travel || 0, color: "#3b82f6" },
      { name: "Hotel", spent: tripdata.divided_budget.hotel || 0, budget: tripdata.divided_budget.hotel || 0, color: "#8b5cf6" },
      { name: "Food", spent: tripdata.divided_budget.food || 0, budget: tripdata.divided_budget.food || 0, color: "#f59e0b" },
      { name: "Activities", spent: tripdata.divided_budget.activities || 0, budget: tripdata.divided_budget.activities || 0, color: "#10b981" }
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

  // Get display data based on active tab
  const getDisplayData = () => {
    if (!tripdata) return [];
    
    switch (activeTab) {
      case 'attractions':
        return tripdata.attractions || [];
      case 'accommodations':
        return tripdata.accommodations || [];
      case 'restaurants':
        return tripdata.restaurants || [];
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
    if (!shareLink) {
      alert('No share link available. Please set visibility to "Invite Only" or "Public" first.');
      return;
    }
    
    navigator.clipboard.writeText(shareLink).then(() => {
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  // Safe data access with fallbacks
  const getWeatherData = () => {
    if (tripdata?.destination?.weather) {
      return tripdata.destination.weather;
    }
    return { temperature: 'N/A', description: 'No data' };
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

  if (error || !tripdata) {
    return (
      <div className="font-display bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-4">Error Loading Trip Data</div>
          <p className="text-gray-600">{error || "Trip data not found"}</p>
          <button 
            onClick={fetchspecifictripdata}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
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
    daily_budgets = {},
    divided_budget = {}
  } = tripdata;

  const currentDayItinerary = daily_itineraries.find(day => day.day === currentDay) || daily_itineraries[0];
  const displayData = getDisplayData();

  // Get names for display
  const destinationName = getDestinationName();
  const originName = getLocationName(origin);
  const returnDestinationName = return_destination ? getLocationName(return_destination) : null;

  const weatherData = getWeatherData();


const handlePostpone = async () => {
     SetChangeDateoftriploading(true);
    if (!newDate) {
      alert("Please select a new date.");
       SetChangeDateoftriploading(false);
      return;
    }
     
    try {
      const response = await axios.put(`http://127.0.0.1:8006/TripStartDateUpdateAPIView/${trip_id}/`,
        { new_start_date: newDate },
        { headers: { Authorization: `Bearer ${token}`}});
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error("Error postponing trip:", error);
      alert("Failed to postpone trip.");
      SetChangeDateoftriploading(false);
    }finally {
    SetChangeDateoftriploading(false);
  }

  }





const DeleteTripFunc = async () => {
  console.log('trip id ',trip_id)
  try {
    await axios.delete('http://127.0.0.1:8006/TripDeleteAPIView/', {
      data: { trip_id: trip_id }, 
      headers: { Authorization: `Bearer ${token}`}});

    navigate(-1);
  } catch (error) {
    console.error("❌ Error delete trips:", error);
  }
};



  return (
    <div className="font-display bg-white text-black min-h-screen">
        <Pt_Bd_Navbar/>
      <div className="flex flex-col min-h-screen">
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

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button  onClick={DeleteTripFunc} className="flex-1 lg:flex-none flex items-center justify-center rounded-lg h-10 px-4 border border-gray-300 text-sm font-bold gap-2 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-base">delete</span>
                  <span className="truncate">Delete</span>
                </button>
              </div>

            </div>
           
            {/* Stats & Charts */}
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
                    className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addPlaceToMap(place)}
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
                            {returnDestinationName}
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
                          onChange={(e) => handleVisibilityChange(e.target.value)}
                          disabled={isUpdatingVisibility}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">lock</span>
                          <span className="text-sm">Private (Only you)</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="invite_only"
                          checked={visibility === 'invite_only'}
                          onChange={(e) => handleVisibilityChange(e.target.value)}
                          disabled={isUpdatingVisibility}
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
                          onChange={(e) => handleVisibilityChange(e.target.value)}
                          disabled={isUpdatingVisibility}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">public</span>
                          <span className="text-sm">Public (Anyone with link)</span>
                        </div>
                      </label>
                    </div>
                    
                    {/* Share Link - Only show for invite-only and public */}
                    {(visibility === 'invite_only' || visibility === 'public') && shareLink && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Share this link:</p>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 text-sm bg-white border border-blue-200 rounded px-3 py-2 text-blue-600"
                            value={shareLink}
                            readOnly
                          />
                          <button 
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-300"
                            onClick={copyShareLink}
                            disabled={!shareLink}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}

                    {isUpdatingVisibility && (
                      <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Updating visibility...
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
                        onChange={(e) => setEmail(e.target.value)}/>
                      <button onClick={InviteJoinThrougEmailfunc} className="flex-shrink-0 rounded-md h-10 px-4 bg-green-500 text-white text-sm font-bold whitespace-nowrap">Invite</button>
                    </div>
                  </div>
                  
                  {/* <div>
                    <label className="font-medium text-sm lg:text-base">Postpone Trip</label>
                    <input 
                      className="w-full mt-1 rounded-md border-gray-300 bg-transparent text-sm focus:ring-blue-600 focus:border-blue-600" 
                      type="date"
                    />
                  </div> */}















                  <div className="w-full">
                  <label className="font-medium text-sm lg:text-base">Postpone Trip</label>
                  <input 
                    className="w-full mt-1 rounded-md border-gray-300 bg-transparent text-sm focus:ring-blue-600 focus:border-blue-600" 
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />




                  
<button 
  onClick={handlePostpone} 
  disabled={changeDateoftriploading}
  className={`mt-3 w-full py-2 rounded-md transition-all text-white 
    ${changeDateoftriploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-600'}`}
>
  {changeDateoftriploading ? "Updating..." : "Update Trip Date"}
</button>

                </div>



                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pt_Bd_DashboardLayout;