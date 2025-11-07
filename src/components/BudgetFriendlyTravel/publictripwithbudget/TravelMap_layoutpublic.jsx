import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PublicTripNavbar from './PublicTripNavbar';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TravelMaplayoutpublic = () => {
  const { invatetripid } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const normalMapRef = useRef(null);
  const fullScreenMapRef = useRef(null);
  const normalMapInstance = useRef(null);
  const fullScreenMapInstance = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fetch trip data from API
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8006/TripSpecificAPIViewWithoutuserIdPublicorinvateonly/${invatetripid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTripData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trip data:', err);
        setError('Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };

    if (invatetripid) {
      fetchTripData();
    }
  }, [invatetripid]);

  // Get trip data with proper fallbacks
  const origin = tripData?.origin || {};
  const destination = tripData?.destination || {};
  const returnDestination = tripData?.return_destination || {};
  const travelPlan = tripData?.travel_plan || {};
  const summary = tripData?.summary || {};
  const attractions = tripData?.attractions || [];
  const accommodations = tripData?.accommodations || [];
  const intermediateStopsGoing = travelPlan?.intermediate_stops_going || [];
  const intermediateStopsReturn = travelPlan?.intermediate_stops_return || [];
  
  // Check if we have valid trip data
  const hasTripData = origin?.coordinates && destination?.coordinates;

  // Initialize normal map
  useEffect(() => {
    if (!normalMapRef.current || normalMapInstance.current || !hasTripData || isFullScreen) return;

    console.log('Initializing normal map...');
    
    // Create map instance
    normalMapInstance.current = L.map(normalMapRef.current, {
      zoomControl: false,
      attributionControl: false
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(normalMapInstance.current);

    // Plot data immediately after map creation
    plotMapData(normalMapInstance.current);

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(normalMapInstance.current);

    return () => {
      if (normalMapInstance.current && !isFullScreen) {
        console.log('Cleaning up normal map...');
        normalMapInstance.current.remove();
        normalMapInstance.current = null;
      }
    };
  }, [hasTripData, isFullScreen]);

  // Initialize full screen map
  useEffect(() => {
    if (!fullScreenMapRef.current || fullScreenMapInstance.current || !isFullScreen || !hasTripData) return;

    console.log('Initializing full screen map...');
    
    // Create map instance
    fullScreenMapInstance.current = L.map(fullScreenMapRef.current, {
      zoomControl: false,
      attributionControl: false
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(fullScreenMapInstance.current);

    // Plot data immediately after map creation
    plotMapData(fullScreenMapInstance.current);

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(fullScreenMapInstance.current);

    // Resize map after a short delay
    setTimeout(() => {
      if (fullScreenMapInstance.current) {
        fullScreenMapInstance.current.invalidateSize();
      }
    }, 100);

    return () => {
      if (fullScreenMapInstance.current && isFullScreen) {
        console.log('Cleaning up full screen map...');
        fullScreenMapInstance.current.remove();
        fullScreenMapInstance.current = null;
      }
    };
  }, [isFullScreen, hasTripData]);

  // Common function to plot map data
  const plotMapData = (map) => {
    if (!map || !hasTripData) {
      console.log('Cannot plot map data: no map or trip data');
      return;
    }

    console.log('Plotting map data...');

    // Clear existing layers (except base tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Create bounds to fit all points
    const bounds = L.latLngBounds([]);
    const goingPoints = [];
    const returnPoints = [];

    // Plot origin
    if (origin.coordinates && origin.coordinates.lat && origin.coordinates.lng) {
      const originIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-xs">location_on</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Origin
            </div>
          </div>
        `,
        className: 'origin-marker',
        iconSize: [30, 40],
      });

      const originMarker = L.marker([origin.coordinates.lat, origin.coordinates.lng], { icon: originIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-[250px]">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-red-500">location_on</span>
              <strong class="text-lg">🚗 Origin</strong>
            </div>
            <p class="text-sm mb-1"><strong>Address:</strong> ${origin.address || 'Starting point'}</p>
            <p class="text-sm"><strong>Coordinates:</strong> ${origin.coordinates.lat?.toFixed(6) || 'N/A'}, ${origin.coordinates.lng?.toFixed(6) || 'N/A'}</p>
          </div>
        `);
      bounds.extend([origin.coordinates.lat, origin.coordinates.lng]);
      goingPoints.push([origin.coordinates.lat, origin.coordinates.lng]);
    }

    // Plot intermediate stops (going)
    intermediateStopsGoing.forEach((stop, index) => {
      if (stop.coordinates && stop.coordinates.lat && stop.coordinates.lng) {
        const stopIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span class="text-white text-xs font-bold">${index + 1}</span>
              </div>
              <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Stop ${index + 1}
              </div>
            </div>
          `,
          className: 'stop-marker',
          iconSize: [25, 35],
        });

        const stopMarker = L.marker([stop.coordinates.lat, stop.coordinates.lng], { icon: stopIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-[250px]">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-orange-500">location_on</span>
                <strong class="text-lg">📍 Stop ${index + 1}</strong>
              </div>
              <p class="text-sm mb-1"><strong>Address:</strong> ${stop.address || 'Intermediate stop'}</p>
              <p class="text-sm"><strong>Coordinates:</strong> ${stop.coordinates.lat?.toFixed(6) || 'N/A'}, ${stop.coordinates.lng?.toFixed(6) || 'N/A'}</p>
            </div>
          `);
        bounds.extend([stop.coordinates.lat, stop.coordinates.lng]);
        goingPoints.push([stop.coordinates.lat, stop.coordinates.lng]);
      }
    });

    // Plot destination
    if (destination.coordinates && destination.coordinates.lat && destination.coordinates.lng) {
      const destIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-xs">flag</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Destination
            </div>
          </div>
        `,
        className: 'destination-marker',
        iconSize: [30, 40],
      });

      const destMarker = L.marker([destination.coordinates.lat, destination.coordinates.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-[250px]">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-green-500">flag</span>
              <strong class="text-lg">🏁 Destination</strong>
            </div>
            <p class="text-sm mb-1"><strong>Address:</strong> ${destination.address || 'Destination'}</p>
            <p class="text-sm mb-1"><strong>Coordinates:</strong> ${destination.coordinates.lat?.toFixed(6) || 'N/A'}, ${destination.coordinates.lng?.toFixed(6) || 'N/A'}</p>
            ${destination.weather ? `
              <div class="mt-2 pt-2 border-t border-gray-300">
                <p class="text-sm"><strong>Weather:</strong> ${destination.weather.temperature}°C, ${destination.weather.description}</p>
              </div>
            ` : ''}
          </div>
        `);
      bounds.extend([destination.coordinates.lat, destination.coordinates.lng]);
      goingPoints.push([destination.coordinates.lat, destination.coordinates.lng]);
    }

    // Plot return destination if different
    if (returnDestination.coordinates && 
        returnDestination.coordinates.lat && returnDestination.coordinates.lng &&
        (returnDestination.coordinates.lat !== destination.coordinates.lat || 
         returnDestination.coordinates.lng !== destination.coordinates.lng)) {
      
      const returnDestIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-xs">home</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Return Point
            </div>
          </div>
        `,
        className: 'return-destination-marker',
        iconSize: [30, 40],
      });

      const returnDestMarker = L.marker([returnDestination.coordinates.lat, returnDestination.coordinates.lng], { icon: returnDestIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-[250px]">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-blue-500">home</span>
              <strong class="text-lg">🏠 Return Point</strong>
            </div>
            <p class="text-sm mb-1"><strong>Address:</strong> ${returnDestination.address || 'Return point'}</p>
            <p class="text-sm mb-1"><strong>Coordinates:</strong> ${returnDestination.coordinates.lat?.toFixed(6) || 'N/A'}, ${returnDestination.coordinates.lng?.toFixed(6) || 'N/A'}</p>
          </div>
        `);
      bounds.extend([returnDestination.coordinates.lat, returnDestination.coordinates.lng]);
      returnPoints.push([returnDestination.coordinates.lat, returnDestination.coordinates.lng]);
    }

    // Plot intermediate stops (return)
    intermediateStopsReturn.forEach((stop, index) => {
      if (stop.coordinates && stop.coordinates.lat && stop.coordinates.lng) {
        const stopIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-5 h-5 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span class="text-white text-xs font-bold">R${index + 1}</span>
              </div>
              <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Return ${index + 1}
              </div>
            </div>
          `,
          className: 'return-stop-marker',
          iconSize: [25, 35],
        });

        const stopMarker = L.marker([stop.coordinates.lat, stop.coordinates.lng], { icon: stopIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-[250px]">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-purple-500">location_on</span>
                <strong class="text-lg">🔄 Return Stop ${index + 1}</strong>
              </div>
              <p class="text-sm mb-1"><strong>Address:</strong> ${stop.address || 'Return stop'}</p>
              <p class="text-sm"><strong>Coordinates:</strong> ${stop.coordinates.lat?.toFixed(6) || 'N/A'}, ${stop.coordinates.lng?.toFixed(6) || 'N/A'}</p>
            </div>
          `);
        bounds.extend([stop.coordinates.lat, stop.coordinates.lng]);
        returnPoints.push([stop.coordinates.lat, stop.coordinates.lng]);
      }
    });

    // Draw going route if we have at least 2 points
    if (goingPoints.length >= 2) {
      L.polyline(goingPoints, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo(map).bindPopup('Going Route');
    }

    // Draw return route if we have different route
    if (returnPoints.length >= 2 && summary?.different_return_route) {
      L.polyline(returnPoints, {
        color: '#ef4444',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1,
        dashArray: '5, 10'
      }).addTo(map).bindPopup('Return Route');
    }

    // Plot attractions (limited to first 8 for clarity)
    attractions.slice(0, 8).forEach((attraction) => {
      if (attraction.coordinates && attraction.coordinates.lat && attraction.coordinates.lng) {
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
              <p class="text-xs mt-1"><strong>Coordinates:</strong> ${attraction.coordinates.lat?.toFixed(6) || 'N/A'}, ${attraction.coordinates.lng?.toFixed(6) || 'N/A'}</p>
            </div>
          `);
        bounds.extend([attraction.coordinates.lat, attraction.coordinates.lng]);
      }
    });

    // Plot accommodations (limited to first 5 for clarity)
    accommodations.slice(0, 5).forEach((accommodation) => {
      if (accommodation.coordinates && accommodation.coordinates.lat && accommodation.coordinates.lng) {
        const accommodationIcon = L.divIcon({
          html: '<div class="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>',
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
              <p class="text-xs mt-1"><strong>Coordinates:</strong> ${accommodation.coordinates.lat?.toFixed(6) || 'N/A'}, ${accommodation.coordinates.lng?.toFixed(6) || 'N/A'}</p>
            </div>
          `);
        bounds.extend([accommodation.coordinates.lat, accommodation.coordinates.lng]);
      }
    });

    // Fit map to bounds if we have valid points
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Default view if no coordinates
      map.setView([20.5937, 78.9629], 5); // Center of India
    }

    console.log('Map data plotted successfully');
  };

  // Handle full screen toggle
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Resize maps when full screen state changes
  useEffect(() => {
    const resizeMap = () => {
      setTimeout(() => {
        if (isFullScreen && fullScreenMapInstance.current) {
          fullScreenMapInstance.current.invalidateSize();
        } else if (normalMapInstance.current) {
          normalMapInstance.current.invalidateSize();
        }
      }, 300);
    };

    resizeMap();
  }, [isFullScreen]);

  // Function to get trip title
  const getTripTitle = () => {
    if (origin?.address && destination?.address) {
      const originCity = origin.address.split(',')[0];
      const destCity = destination.address.split(',')[0];
      return `${originCity} to ${destCity} Adventure`;
    }
    return "Shared Trip Journey";
  };

  // Function to get trip description
  const getTripDescription = () => {
    const days = summary?.trip_duration_days || travelPlan?.total_travel_days || 0;
    const distance = summary?.total_round_trip_distance_km || travelPlan?.total_round_trip_distance_km || 0;
    
    if (days > 0 && distance > 0) {
      return `A ${days}-day journey covering ${distance} km${travelPlan?.trip_type === 'round_trip_different_routes' ? ' with different return route' : ''}`;
    }
    return "Explore this travel adventure";
  };

  // Custom map controls
  const zoomIn = () => {
    const currentMap = isFullScreen ? fullScreenMapInstance.current : normalMapInstance.current;
    if (currentMap) {
      currentMap.zoomIn();
    }
  };

  const zoomOut = () => {
    const currentMap = isFullScreen ? fullScreenMapInstance.current : normalMapInstance.current;
    if (currentMap) {
      currentMap.zoomOut();
    }
  };

  const fitToBounds = () => {
    const currentMap = isFullScreen ? fullScreenMapInstance.current : normalMapInstance.current;
    if (currentMap && hasTripData) {
      const bounds = L.latLngBounds([]);
      
      // Add all points to bounds
      if (origin.coordinates) bounds.extend([origin.coordinates.lat, origin.coordinates.lng]);
      if (destination.coordinates) bounds.extend([destination.coordinates.lat, destination.coordinates.lng]);
      
      intermediateStopsGoing.forEach(stop => {
        if (stop.coordinates) bounds.extend([stop.coordinates.lat, stop.coordinates.lng]);
      });
      
      intermediateStopsReturn.forEach(stop => {
        if (stop.coordinates) bounds.extend([stop.coordinates.lat, stop.coordinates.lng]);
      });
      
      if (returnDestination.coordinates) {
        bounds.extend([returnDestination.coordinates.lat, returnDestination.coordinates.lng]);
      }
      
      if (bounds.isValid()) {
        currentMap.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="font-display bg-white text-black min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Loading Trip</h2>
            <p className="text-gray-500">Please wait while we load the trip data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="font-display bg-white text-black min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Error Loading Trip</h2>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no trip data state
  if (!tripData) {
    return (
      <div className="font-display bg-white text-black min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">map</span>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Trip Not Found</h2>
            <p className="text-gray-500">The requested trip could not be found or is no longer available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">
        <PublicTripNavbar/>
        
        {/* Full Screen Overlay */}
        {isFullScreen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              {/* Full Screen Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <div className="flex flex-col">
                  <h1 className="text-black text-2xl font-bold">
                    {getTripTitle()}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {getTripDescription()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={toggleFullScreen}
                    className="flex cursor-pointer items-center justify-center rounded-lg h-10 bg-gray-600 text-white gap-2 text-sm font-bold px-4 hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-white text-lg">fullscreen_exit</span>
                    <span>Exit Full Screen</span>
                  </button>
                </div>
              </div>

              {/* Full Screen Map */}
              <div className="flex-1 relative">
                <div 
                  ref={fullScreenMapRef}
                  className="w-full h-full"
                />
                
                {/* Map Controls */}
                <div className="flex flex-col items-end gap-3 absolute right-4 top-4 z-10">
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
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 z-10 border border-gray-200 shadow-lg max-w-xs">
                  <h4 className="text-black text-sm font-bold mb-3">Map Legend</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" style={{fontSize: '12px'}}>location_on</span>
                      </div>
                      <span className="text-black">Origin</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" style={{fontSize: '12px'}}>flag</span>
                      </div>
                      <span className="text-black">Destination</span>
                    </div>
                    {returnDestination.coordinates && (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                          <span className="material-symbols-outlined text-white" style={{fontSize: '12px'}}>home</span>
                        </div>
                        <span className="text-black">Return Point</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow"></div>
                      <span className="text-black">Going Stops</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                      <span className="text-black">Return Stops</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
                      <span className="text-black">Accommodations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                      <span className="text-black">Attractions</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-8 h-1 bg-blue-500 rounded"></div>
                      <span className="text-black text-xs">Going Route</span>
                    </div>
                    {summary?.different_return_route && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-red-500 rounded border-dashed border-2 border-red-500"></div>
                        <span className="text-black text-xs">Return Route</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Normal Screen Content */}
        {!isFullScreen && (
          <div className="flex flex-1">
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
                    <p className="text-gray-400 text-sm mt-1">
                      Shared Trip • ID: {invatetripid}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={toggleFullScreen}
                      className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-600 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4 hover:bg-gray-700"
                    >
                      <span className="material-symbols-outlined text-white text-lg">fullscreen</span>
                      <span className="truncate">Full Screen</span>
                    </button>
                  </div>
                </header>

                {/* Trip Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">location_on</span>
                      <span className="text-blue-800 text-sm font-medium">Origin</span>
                    </div>
                    <p className="text-black text-sm mt-1 truncate">{origin?.address || 'Starting point'}</p>
                    {origin?.coordinates && (
                      <p className="text-gray-600 text-xs mt-1">
                        {origin.coordinates.lat?.toFixed(6) || 'N/A'}, {origin.coordinates.lng?.toFixed(6) || 'N/A'}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600">flag</span>
                      <span className="text-green-800 text-sm font-medium">Destination</span>
                    </div>
                    <p className="text-black text-sm mt-1 truncate">{destination?.address || 'Destination'}</p>
                    {destination?.coordinates && (
                      <p className="text-gray-600 text-xs mt-1">
                        {destination.coordinates.lat?.toFixed(6) || 'N/A'}, {destination.coordinates.lng?.toFixed(6) || 'N/A'}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-600">route</span>
                      <span className="text-purple-800 text-sm font-medium">Distance</span>
                    </div>
                    <p className="text-black text-sm mt-1">{summary?.total_round_trip_distance_km || 0} km</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {intermediateStopsGoing.length + intermediateStopsReturn.length} stops
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-orange-600">calendar_today</span>
                      <span className="text-orange-800 text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-black text-sm mt-1">{summary?.trip_duration_days || 0} days</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {attractions.length} attractions
                    </p>
                  </div>
                </div>

                {/* Map Container */}
                <div className="@container flex flex-col flex-1 h-full mb-6">
                  <div className="flex flex-1 flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                    <div 
                      ref={normalMapRef}
                      className="w-full h-[500px] bg-gray-100"
                    />
                    
                    {/* Map Controls */}
                    <div className="flex flex-col items-end gap-3 absolute right-4 top-4 z-10">
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
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 z-10 border border-gray-200 shadow-lg max-w-xs">
                      <h4 className="text-black text-sm font-bold mb-3">Map Legend</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{fontSize: '12px'}}>location_on</span>
                          </div>
                          <span className="text-black">Origin</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{fontSize: '12px'}}>flag</span>
                          </div>
                          <span className="text-black">Destination</span>
                        </div>
                        {returnDestination.coordinates && (
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                              <span className="material-symbols-outlined text-white" style={{fontSize: '12px'}}>home</span>
                            </div>
                            <span className="text-black">Return Point</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow"></div>
                          <span className="text-black">Going Stops</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                          <span className="text-black">Return Stops</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
                          <span className="text-black">Accommodations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                          <span className="text-black">Attractions</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-8 h-1 bg-blue-500 rounded"></div>
                          <span className="text-black text-xs">Going Route</span>
                        </div>
                        {summary?.different_return_route && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-1 bg-red-500 rounded border-dashed border-2 border-red-500"></div>
                            <span className="text-black text-xs">Return Route</span>
                          </div>
                        )}
                      </div>
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
        )}
      </div>
    </div>
  );
};

export default TravelMaplayoutpublic;