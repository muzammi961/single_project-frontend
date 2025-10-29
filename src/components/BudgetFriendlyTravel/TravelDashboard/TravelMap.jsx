import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

// Import Leaflet CSS and JS
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TravelMap = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get trip data
  const origin = calculateTripData?.origin;
  const destination = calculateTripData?.destination;
  const returnDestination = calculateTripData?.return_destination;
  const travelPlan = calculateTripData?.travel_plan;
  const summary = calculateTripData?.summary;
  const attractions = calculateTripData?.attractions || [];
  const accommodations = calculateTripData?.accommodations || [];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Create map instance
    mapInstance.current = L.map(mapRef.current, {
      zoomControl: false, // We'll add custom controls
      attributionControl: false // Remove Leaflet attribution
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapInstance.current);

    setMapLoaded(true);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Plot route and points when data is available and map is loaded
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded || !origin || !destination) return;

    const map = mapInstance.current;

    // Create bounds to fit all points
    const bounds = L.latLngBounds([]);

    // Plot origin
    if (origin.coordinates) {
      const originMarker = L.marker([origin.coordinates.lat, origin.coordinates.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <strong>🚗 Origin</strong><br/>
            ${origin.address || 'Starting point'}
          </div>
        `);
      bounds.extend([origin.coordinates.lat, origin.coordinates.lng]);
    }

    // Plot destination
    if (destination.coordinates) {
      const destMarker = L.marker([destination.coordinates.lat, destination.coordinates.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <strong>🏁 Destination</strong><br/>
            ${destination.address || 'Destination'}
          </div>
        `);
      bounds.extend([destination.coordinates.lat, destination.coordinates.lng]);
    }

    // Plot intermediate stops (going)
    if (travelPlan?.intermediate_stops_going) {
      travelPlan.intermediate_stops_going.forEach((stop, index) => {
        if (stop.coordinates) {
          const stopMarker = L.marker([stop.coordinates.lat, stop.coordinates.lng])
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <strong>📍 Stop ${index + 1}</strong><br/>
                ${stop.address || 'Intermediate stop'}
              </div>
            `);
          bounds.extend([stop.coordinates.lat, stop.coordinates.lng]);
        }
      });
    }

    // Plot attractions (limited to first 10 for clarity)
    attractions.slice(0, 10).forEach((attraction, index) => {
      if (attraction.coordinates) {
        const attractionIcon = L.divIcon({
          html: '<div class="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>',
          className: 'attraction-marker',
          iconSize: [16, 16],
        });

        const attractionMarker = L.marker([attraction.coordinates.lat, attraction.coordinates.lng], { icon: attractionIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 min-w-[200px]">
              <strong>🏞️ ${attraction.name}</strong><br/>
              <span class="text-sm">${attraction.types?.[0]?.replace(/_/g, ' ') || 'Attraction'}</span><br/>
              <span class="text-xs text-gray-600">${attraction.distance_km ? `${attraction.distance_km.toFixed(1)} km away` : ''}</span>
            </div>
          `);
        bounds.extend([attraction.coordinates.lat, attraction.coordinates.lng]);
      }
    });

    // Plot accommodations (limited to first 5 for clarity)
    accommodations.slice(0, 5).forEach((accommodation, index) => {
      if (accommodation.coordinates) {
        const accommodationIcon = L.divIcon({
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
          className: 'accommodation-marker',
          iconSize: [16, 16],
        });

        const accommodationMarker = L.marker([accommodation.coordinates.lat, accommodation.coordinates.lng], { icon: accommodationIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 min-w-[200px]">
              <strong>🏨 ${accommodation.name}</strong><br/>
              <span class="text-sm">${accommodation.types?.includes('hotel') ? 'Hotel' : 'Accommodation'}</span><br/>
              <span class="text-xs text-gray-600">Rating: ${accommodation.rating || 'N/A'}</span>
            </div>
          `);
        bounds.extend([accommodation.coordinates.lat, accommodation.coordinates.lng]);
      }
    });

    // Fit map to bounds if we have valid points
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      // Default view if no coordinates
      map.setView([20.5937, 78.9629], 5); // Center of India
    }

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

  }, [mapLoaded, origin, destination, travelPlan, attractions, accommodations]);

  // Function to get trip title
  const getTripTitle = () => {
    if (origin?.address && destination?.address) {
      const originCity = origin.address.split(',')[0];
      const destCity = destination.address.split(',')[0];
      return `${originCity} to ${destCity} Adventure`;
    }
    return "Your Trip Journey";
  };

  // Function to get trip description
  const getTripDescription = () => {
    const days = summary?.trip_duration_days || travelPlan?.total_travel_days || 0;
    const distance = summary?.total_round_trip_distance_km || travelPlan?.total_round_trip_distance_km || 0;
    
    if (days > 0 && distance > 0) {
      return `A ${days}-day journey covering ${distance} km${travelPlan?.trip_type === 'round_trip_different_routes' ? ' with different return route' : ''}`;
    }
    return "Your travel adventure awaits";
  };

  // Custom map controls
  const zoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  const fitToBounds = () => {
    if (mapInstance.current && origin?.coordinates && destination?.coordinates) {
      const bounds = L.latLngBounds([
        [origin.coordinates.lat, origin.coordinates.lng],
        [destination.coordinates.lat, destination.coordinates.lng]
      ]);
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar/>
        <div className="flex flex-1">
          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            <div className="flex flex-col h-full max-w-7xl mx-auto">
              {/* PageHeading */}
              <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <h1 className="text-black text-4xl font-black leading-tight tracking-[-0.033em]">
                    {getTripTitle()}
                  </h1>
                  <p className="text-gray-500 text-base font-normal leading-normal mt-2">
                    {getTripDescription()}
                  </p>
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-blue-600 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-blue-700">
                  <span className="material-symbols-outlined text-white text-lg">share</span>
                  <span className="truncate">Share Trip</span>
                </button>
              </header>

              {/* Trip Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">location_on</span>
                    <span className="text-blue-800 text-sm font-medium">Origin</span>
                  </div>
                  <p className="text-black text-sm mt-1 truncate">{origin?.address || 'Starting point'}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">flag</span>
                    <span className="text-green-800 text-sm font-medium">Destination</span>
                  </div>
                  <p className="text-black text-sm mt-1 truncate">{destination?.address || 'Destination'}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">route</span>
                    <span className="text-purple-800 text-sm font-medium">Distance</span>
                  </div>
                  <p className="text-black text-sm mt-1">{summary?.total_round_trip_distance_km || 0} km</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-600">calendar_today</span>
                    <span className="text-orange-800 text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-black text-sm mt-1">{summary?.trip_duration_days || 0} days</p>
                </div>
              </div>

              {/* Map Container */}
              <div className="@container flex flex-col flex-1 h-full mb-6">
                <div className="flex flex-1 flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <div 
                    ref={mapRef}
                    className="flex-1 w-full h-[500px] bg-gray-100"
                  >
                    {!mapLoaded && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">map</span>
                          <p className="text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="flex flex-col items-end gap-3 absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
                <div className="flex flex-col gap-0.5 bg-white rounded-lg shadow-lg border border-gray-200">
                  <button 
                    onClick={zoomIn}
                    className="flex size-10 items-center justify-center rounded-t-lg text-black hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <button 
                    onClick={zoomOut}
                    className="flex size-10 items-center justify-center rounded-b-lg text-black hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                </div>
                <button 
                  onClick={fitToBounds}
                  className="flex size-10 items-center justify-center rounded-lg bg-white text-black shadow-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <span className="material-symbols-outlined">zoom_out_map</span>
                </button>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-lg p-4 z-10 border border-gray-200 shadow-lg">
                <h4 className="text-black text-sm font-bold mb-3">Map Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-black text-sm">Origin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-black text-sm">Destination</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-black text-sm">Accommodations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-black text-sm">Attractions</span>
                  </div>
                </div>
              </div>

              {/* Additional Trip Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-black font-bold mb-2">Travel Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Travel:</span>
                      <span className="text-black">{travelPlan?.daily_going_distance_km || 0} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel Cost:</span>
                      <span className="text-black">₹{summary?.total_travel_cost || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per km:</span>
                      <span className="text-black">₹{travelPlan?.cost_per_km || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-black font-bold mb-2">Trip Highlights</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attractions:</span>
                      <span className="text-black">{attractions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accommodations:</span>
                      <span className="text-black">{accommodations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Distance:</span>
                      <span className="text-black">{summary?.total_round_trip_distance_km || 0} km</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-black font-bold mb-2">Weather Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="text-black">{destination?.weather?.temperature || 'N/A'}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="text-black capitalize">{destination?.weather?.description || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wind Speed:</span>
                      <span className="text-black">{destination?.weather?.wind_speed || 'N/A'} m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TravelMap;