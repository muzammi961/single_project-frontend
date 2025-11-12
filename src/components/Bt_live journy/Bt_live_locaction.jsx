import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Rotating arrow icon for user direction - FIXED VERSION
const createArrowIcon = (angle = 0) => {
  return new L.DivIcon({
    html: `
      <div style="
        transform: rotate(${angle}deg);
        transition: transform 0.5s ease;
        width: 40px;
        height: 40px;
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 12px solid white;
          margin-top: -4px;
        "></div>
      </div>
    `,
    className: 'arrow-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const startIcon = createCustomIcon('green');
const destinationIcon = createCustomIcon('red');

// Map center handler
const MapCenterHandler = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Map resize handler
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

// Calculate bearing between two points (improved)
const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let θ = Math.atan2(y, x);
  
  return (toDeg(θ) + 360) % 360;
};

// Helper function to get compass direction
const getCompassDirection = (bearing) => {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

// LiveTripMap Component - CORRECTED VERSION
const LiveTripMap = ({ trip_id }) => {
  const [startingLocation, setStartingLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [arrivedAtDestination, setArrivedAtDestination] = useState(false);
  const [mapCenter, setMapCenter] = useState([11.106872, 75.8685795]);
  const [routePath, setRoutePath] = useState([]);
  const [userBearing, setUserBearing] = useState(0);
  const [locationError, setLocationError] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [positionHistory, setPositionHistory] = useState([]);

  const previousLocationRef = useRef(null);
  const locationUpdateCountRef = useRef(0);
  const watchIdRef = useRef(null);
  const arrowIconRef = useRef(createArrowIcon(0));

  // Update arrow icon when bearing changes
  useEffect(() => {
    arrowIconRef.current = createArrowIcon(userBearing);
  }, [userBearing]);

  // Calculate distance
  const getDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);

  // Check if geolocation is available
  const isGeolocationAvailable = () => {
    return "geolocation" in navigator;
  };

  // Check location permissions
  const checkLocationPermission = async () => {
    if (!isGeolocationAvailable()) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLocationEnabled(false);
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') {
        setIsLocationEnabled(true);
        setLocationError(null);
        return true;
      } else if (permission.state === 'prompt') {
        // Will request permission when getCurrentPosition is called
        return true;
      } else {
        setLocationError("Location access denied. Please enable location permissions.");
        setIsLocationEnabled(false);
        return false;
      }
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setIsLocationEnabled(true);
            setLocationError(null);
            resolve(true);
          },
          () => {
            setLocationError("Location access denied. Please enable location permissions.");
            setIsLocationEnabled(false);
            resolve(false);
          },
          { timeout: 5000 }
        );
      });
    }
  };

  // Handle location errors
  const handleLocationError = (error) => {
    console.error("Location error:", error);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationError("Location access denied. Please enable location permissions in your browser settings.");
        setIsLocationEnabled(false);
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationError("Location information unavailable. Please check your device location settings.");
        setIsLocationEnabled(false);
        break;
      case error.TIMEOUT:
        setLocationError("Location request timed out. Please try again.");
        break;
      default:
        setLocationError("An unknown error occurred while accessing location.");
        setIsLocationEnabled(false);
        break;
    }
  };

  // Fetch trip data
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`http://127.0.0.1:8006/TripStartingDestinationlocation/${trip_id}/`);
        const data = await response.json();
        
        if (data.data) {
          const tripData = data.data;
          
          // Set starting location
          if (tripData.starting_lat && tripData.starting_lng) {
            setStartingLocation({
              lat: parseFloat(tripData.starting_lat),
              lng: parseFloat(tripData.starting_lng),
              address: tripData.starting_address || "Starting Point"
            });
            setMapCenter([parseFloat(tripData.starting_lat), parseFloat(tripData.starting_lng)]);
          }

          // Set destination
          if (tripData.destination_lat && tripData.destination_lng) {
            setDestination({
              lat: parseFloat(tripData.destination_lat),
              lng: parseFloat(tripData.destination_lng),
              address: tripData.destination_address || "Destination"
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch trip data:", err);
        // Set fallback data
        setStartingLocation({
          lat: 11.106872,
          lng: 75.8685795,
          address: "Chenakkalangadi, Tirurangadi, Malappuram"
        });
        setDestination({
          lat: 11.258753,
          lng: 75.780411,
          address: "Calicut, Kerala"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (trip_id) {
      fetchTripData();
    }
  }, [trip_id]);

  // Initialize geolocation tracking - IMPROVED VERSION
  const initializeGeolocation = useCallback(async () => {
    if (!startingLocation) {
      console.log("Waiting for starting location...");
      return;
    }

    console.log("Initializing geolocation tracking with high accuracy");
    
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }

    if (!isGeolocationAvailable()) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    // Get initial position with high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        console.log("Initial position:", latitude, longitude, "Heading:", heading);
        
        const newLocation = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);
        setMapCenter([latitude, longitude]);
        previousLocationRef.current = newLocation;
        locationUpdateCountRef.current = 1;
        
        // Use device heading if available, otherwise calculate from movement
        if (heading !== null && !isNaN(heading)) {
          setUserBearing(heading);
          console.log("Using device heading:", heading);
        }
        
        setHasStarted(true);
        setLocationError(null);
        setIsLoading(false);

        // Add to position history
        setPositionHistory(prev => [...prev, { ...newLocation, timestamp: Date.now() }]);
      },
      (error) => {
        handleLocationError(error);
        setIsLoading(false);
        // Use starting location as fallback
        setCurrentLocation(startingLocation);
        setHasStarted(true);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Watch position for real-time updates - IMPROVED
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        locationUpdateCountRef.current += 1;
        
        // Update position history (keep last 10 positions for bearing calculation)
        setPositionHistory(prev => {
          const newHistory = [...prev, { ...newLocation, timestamp: Date.now() }];
          return newHistory.slice(-10);
        });

        // Calculate bearing from position history
        if (positionHistory.length >= 2) {
          const recentPositions = positionHistory.slice(-2);
          const prevPos = recentPositions[0];
          const currentPos = recentPositions[1];
          
          if (prevPos && currentPos) {
            const calculatedBearing = calculateBearing(
              prevPos.lat, prevPos.lng,
              currentPos.lat, currentPos.lng
            );
            
            // Use device heading if available and accurate, otherwise use calculated bearing
            let finalBearing = calculatedBearing;
            if (heading !== null && !isNaN(heading) && Math.abs(heading - calculatedBearing) < 90) {
              finalBearing = heading;
            }
            
            setUserBearing(finalBearing);
            console.log(`Position update ${locationUpdateCountRef.current}:`, 
              `Lat: ${latitude}, Lng: ${longitude}, ` +
              `Device Heading: ${heading}, ` +
              `Calculated Bearing: ${calculatedBearing.toFixed(1)}°, ` +
              `Final Bearing: ${finalBearing.toFixed(1)}°`);
          }
        } else if (heading !== null && !isNaN(heading)) {
          // Use device heading if we don't have enough history
          setUserBearing(heading);
        }

        setCurrentLocation(newLocation);
        setMapCenter([latitude, longitude]);
        setLocationError(null);

        // Check if arrived at destination
        if (destination) {
          const distanceToDestination = getDistance(latitude, longitude, destination.lat, destination.lng);
          if (distanceToDestination <= 50 && !arrivedAtDestination) {
            setArrivedAtDestination(true);
            console.log("🎉 Arrived at destination!");
          }
        }

        previousLocationRef.current = newLocation;
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,  // Crucial for accurate heading
        maximumAge: 1000,          // Get fresh positions frequently
        timeout: 5000
      }
    );
  }, [startingLocation, destination, arrivedAtDestination, getDistance, positionHistory]);

  // Cleanup geolocation
  const cleanupGeolocation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Retry location access
  const retryLocationAccess = async () => {
    setLocationError(null);
    setIsLoading(true);
    cleanupGeolocation();
    setPositionHistory([]);
    await initializeGeolocation();
  };

  // Initialize when starting location is available
  useEffect(() => {
    if (startingLocation && !currentLocation) {
      initializeGeolocation();
    }

    return () => {
      cleanupGeolocation();
    };
  }, [startingLocation, currentLocation, initializeGeolocation, cleanupGeolocation]);

  // Calculate distance to destination
  const distanceToDestination = currentLocation && destination ? 
    getDistance(currentLocation.lat, currentLocation.lng, destination.lat, destination.lng) : 
    startingLocation && destination ? 
    getDistance(startingLocation.lat, startingLocation.lng, destination.lat, destination.lng) : 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading Live Map...</p>
          <p className="text-sm text-gray-600">Acquiring your location</p>
        </div>
      </div>
    );
  }

  // Show location error state
  if (locationError && !currentLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">📍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Location Access Required</h3>
          <p className="text-gray-600 mb-4">{locationError}</p>
          <button
            onClick={retryLocationAccess}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Retry Location Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Status Information */}
      <div className="bg-white p-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-base">Live Trip Map</h3>
            <p className="text-xs text-gray-600">
              {hasStarted ? "Live tracking active" : "Ready to start"}
            </p>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Direction: {getCompassDirection(userBearing)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs">
              Distance: {(distanceToDestination / 1000).toFixed(2)} km
            </p>
            <p className={`text-xs font-semibold ${
              arrivedAtDestination ? 'text-green-600' : 'text-blue-600'
            }`}>
              {arrivedAtDestination ? '🎉 Arrived!' : '📍 Tracking...'}
            </p>
            <p className="text-xs text-gray-500">
              Bearing: {userBearing.toFixed(0)}°
            </p>
            <p className="text-xs text-gray-400">
              Updates: {locationUpdateCountRef.current}
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {!isLocationEnabled && (
          <div className="absolute inset-0 bg-red-100 bg-opacity-80 z-10 flex items-center justify-center">
            <div className="text-center bg-white p-4 rounded-lg shadow-lg max-w-sm mx-4">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <h3 className="font-semibold text-base mb-2">Location Disabled</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please enable location services to see live direction.
              </p>
              <button
                onClick={retryLocationAccess}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors text-sm"
              >
                Enable Location
              </button>
            </div>
          </div>
        )}
        
        <MapContainer 
          center={mapCenter} 
          zoom={15} 
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapCenterHandler center={mapCenter} />
          <MapResizeHandler />
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Starting Point Marker */}
          {startingLocation && (
            <Marker position={[startingLocation.lat, startingLocation.lng]} icon={startIcon}>
              <Popup>
                <div className="text-center">
                  <strong>Starting Point</strong>
                  <br />
                  <small>{startingLocation.address}</small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
              <Popup>
                <div className="text-center">
                  <strong>Destination</strong>
                  <br />
                  <small>{destination.address}</small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Current User Location with Rotating Arrow */}
          {currentLocation && (
            <Marker 
              position={[currentLocation.lat, currentLocation.lng]} 
              icon={arrowIconRef.current}
              key={`user-${currentLocation.lat}-${currentLocation.lng}-${userBearing}`}
            >
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                  <br />
                  <small>Facing: {getCompassDirection(userBearing)}</small>
                  <br />
                  <small>Bearing: {userBearing.toFixed(0)}°</small>
                  <br />
                  <small>Updates: {locationUpdateCountRef.current}</small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Position history trail */}
          {positionHistory.length > 1 && (
            <Polyline 
              positions={positionHistory.map(pos => [pos.lat, pos.lng])}
              color="blue"
              weight={3}
              opacity={0.6}
            />
          )}
        </MapContainer>
      </div>

      {/* Controls and Info Panel */}
      <div className="bg-white p-2 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3 text-xs">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              <span>Start</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              <span>Destination</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 relative">
                <div className="absolute inset-0 bg-white rounded-full transform scale-50"></div>
              </div>
              <span>You ({getCompassDirection(userBearing)})</span>
            </div>
          </div>
          
          <button
            onClick={retryLocationAccess}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveTripMap;