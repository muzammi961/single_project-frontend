// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';

// // Fix default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Custom icons
// const createCustomIcon = (color) => new L.Icon({
//   iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// // Rotating arrow icon for user direction
// const createArrowIcon = (angle = 0) => new L.DivIcon({
//   html: `
//     <div style="
//       transform: rotate(${angle}deg);
//       transition: transform 0.3s ease;
//       width: 35px;
//       height: 35px;
//       background: #3B82F6;
//       border: 3px solid white;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       box-shadow: 0 2px 10px rgba(0,0,0,0.3);
//     ">
//       <div style="
//         width: 0;
//         height: 0;
//         border-left: 6px solid transparent;
//         border-right: 6px solid transparent;
//         border-bottom: 12px solid white;
//         margin-top: -4px;
//       "></div>
//     </div>
//   `,
//   className: 'arrow-marker',
//   iconSize: [35, 35],
//   iconAnchor: [17, 17],
// });

// const startIcon = createCustomIcon('green');
// const destinationIcon = createCustomIcon('red');

// // Map center handler
// const MapCenterHandler = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center && center[0] && center[1]) {
//       map.setView(center, map.getZoom());
//     }
//   }, [center, map]);
//   return null;
// };

// // Map resize handler
// const MapResizeHandler = () => {
//   const map = useMap();
//   useEffect(() => {
//     setTimeout(() => {
//       map.invalidateSize();
//     }, 100);
//   }, [map]);
//   return null;
// };

// // Routing directions using OSRM API
// const getRouteDirections = async (startLat, startLng, endLat, endLng) => {
//   try {
//     if (!startLat || !startLng || !endLat || !endLng) {
//       console.error("Invalid coordinates for route:", { startLat, startLng, endLat, endLng });
//       return null;
//     }

//     const response = await fetch(
//       `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
//     );
    
//     if (!response.ok) {
//       throw new Error(`Route API failed with status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data.routes && data.routes.length > 0) {
//       return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
//     }
//     return null;
//   } catch (error) {
//     console.error("Error fetching route directions:", error);
//     return null;
//   }
// };

// // Calculate bearing between two points
// const calculateBearing = (startLat, startLng, endLat, endLng) => {
//   const startLatRad = startLat * Math.PI / 180;
//   const startLngRad = startLng * Math.PI / 180;
//   const endLatRad = endLat * Math.PI / 180;
//   const endLngRad = endLng * Math.PI / 180;

//   const y = Math.sin(endLngRad - startLngRad) * Math.cos(endLatRad);
//   const x = Math.cos(startLatRad) * Math.sin(endLatRad) -
//            Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(endLngRad - startLngRad);
  
//   let bearing = Math.atan2(y, x) * 180 / Math.PI;
//   bearing = (bearing + 360) % 360;
  
//   return bearing;
// };

// // Helper function to get compass direction
// const getCompassDirection = (bearing) => {
//   const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
//   const index = Math.round(bearing / 45) % 8;
//   return directions[index];
// };

// // Generate color based on name
// const getColorFromName = (name) => {
//   const colors = [
//     'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
//     'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
//     'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
//   ];
//   if (!name) return 'bg-gray-500';
//   const index = name.charCodeAt(0) % colors.length;
//   return colors[index];
// };

// // Get initials from name
// const getInitials = (name) => {
//   if (!name) return 'U';
//   return name.charAt(0).toUpperCase();
// };

// // LiveTripMap Component
// const LiveTripMap = ({ trip_id }) => {
//   const userName = "User";
  
//   const [startingLocation, setStartingLocation] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [hasStarted, setHasStarted] = useState(false);
//   const [arrivedAtDestination, setArrivedAtDestination] = useState(false);
//   const [mapCenter, setMapCenter] = useState([11.106872, 75.8685795]);
//   const [routePath, setRoutePath] = useState([]);
//   const [userBearing, setUserBearing] = useState(0);
//   const [routeInstructions, setRouteInstructions] = useState([]);
//   const [nextInstruction, setNextInstruction] = useState("");
//   const [locationError, setLocationError] = useState(null);
//   const [isLocationEnabled, setIsLocationEnabled] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);

//   const previousLocationRef = useRef(null);
//   const locationUpdateCountRef = useRef(0);
//   const watchIdRef = useRef(null);

//   // Check if geolocation is available
//   const isGeolocationAvailable = () => {
//     return "geolocation" in navigator;
//   };

//   // Check location permissions
//   const checkLocationPermission = async () => {
//     if (!isGeolocationAvailable()) {
//       setLocationError("Geolocation is not supported by this browser.");
//       setIsLocationEnabled(false);
//       return false;
//     }

//     try {
//       await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject, {
//           timeout: 5000,
//           maximumAge: 0
//         });
//       });
//       setIsLocationEnabled(true);
//       setLocationError(null);
//       return true;
//     } catch (error) {
//       handleLocationError(error);
//       return false;
//     }
//   };

//   // Handle location errors
//   const handleLocationError = (error) => {
//     console.error("Location error:", error);
    
//     switch (error.code) {
//       case error.PERMISSION_DENIED:
//         setLocationError("Location access denied. Please enable location permissions.");
//         setIsLocationEnabled(false);
//         break;
//       case error.POSITION_UNAVAILABLE:
//         setLocationError("Location information unavailable.");
//         setIsLocationEnabled(false);
//         break;
//       case error.TIMEOUT:
//         setLocationError("Location request timed out.");
//         break;
//       default:
//         setLocationError("An unknown error occurred while accessing location.");
//         setIsLocationEnabled(false);
//         break;
//     }
//   };

//   // Calculate distance
//   const getDistance = (lat1, lng1, lat2, lng2) => {
//     const R = 6371e3;
//     const φ1 = lat1 * Math.PI / 180;
//     const φ2 = lat2 * Math.PI / 180;
//     const Δφ = (lat2 - lat1) * Math.PI / 180;
//     const Δλ = (lng2 - lng1) * Math.PI / 180;

//     const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//               Math.cos(φ1) * Math.cos(φ2) *
//               Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   // Calculate distance to destination
//   const getDistanceToDestination = (currentLat, currentLng) => {
//     if (!destination || !destination.lat || !destination.lng) return 0;
//     return getDistance(currentLat, currentLng, destination.lat, destination.lng);
//   };

//   // Get route directions
//   const fetchRouteDirections = async (startLat, startLng) => {
//     if (!destination || !destination.lat || !destination.lng) {
//       console.warn("Cannot fetch route: destination coordinates are invalid");
//       return;
//     }
    
//     const route = await getRouteDirections(startLat, startLng, destination.lat, destination.lng);
//     if (route) {
//       setRoutePath(route);
      
//       const instructions = [];
//       if (route.length > 2) {
//         instructions.push(
//           { distance: getDistance(startLat, startLng, route[1][0], route[1][1]), instruction: "Head towards destination" },
//           { distance: getDistance(startLat, startLng, route[Math.floor(route.length/2)][0], route[Math.floor(route.length/2)][1]), instruction: "Continue on route" },
//           { distance: getDistance(startLat, startLng, route[route.length-2][0], route[route.length-2][1]), instruction: "Approaching destination" },
//           { distance: 50, instruction: "You have arrived at your destination" }
//         );
//       }
//       setRouteInstructions(instructions);
//       setNextInstruction(instructions[0]?.instruction || "Follow the route");
//     } else {
//       setNextInstruction("Head towards destination");
//     }
//   };

//   // Update next instruction based on distance
//   const updateRouteInstructions = (currentDistance) => {
//     const nextInstruction = routeInstructions.find(instruction => 
//       currentDistance <= instruction.distance
//     );
//     if (nextInstruction) {
//       setNextInstruction(nextInstruction.instruction);
//     }
//   };

//   // Calculate user bearing (direction)
//   const calculateUserBearing = (currentLat, currentLng, prevLat, prevLng) => {
//     if (!prevLat || !prevLng) return 0;
    
//     const bearing = calculateBearing(prevLat, prevLng, currentLat, currentLng);
//     return bearing;
//   };

//   // Fetch trip data
//   useEffect(() => {
//     const fetchTripData = async () => {
//       try {
//         setIsLoading(true);
        
//         const response = await axios.get(`http://127.0.0.1:8006/TripStartingDestinationlocation/${trip_id}/`);
        
//         const responseData = response.data;
        
//         if (!responseData.data) {
//           throw new Error("No data found in API response");
//         }

//         const tripData = responseData.data;
        
//         // Validate and set starting location
//         if (tripData.starting_lat && tripData.starting_lng) {
//           setStartingLocation({
//             lat: parseFloat(tripData.starting_lat),
//             lng: parseFloat(tripData.starting_lng),
//             address: tripData.starting_address || "Starting Point"
//           });
          
//           setMapCenter([parseFloat(tripData.starting_lat), parseFloat(tripData.starting_lng)]);
//         } else {
//           throw new Error("Invalid starting location data");
//         }

//         // Validate and set destination
//         if (tripData.destination_lat && tripData.destination_lng) {
//           setDestination({
//             lat: parseFloat(tripData.destination_lat),
//             lng: parseFloat(tripData.destination_lng),
//             address: tripData.destination_address || "Destination"
//           });
//         } else {
//           setDestination({
//             lat: parseFloat(tripData.starting_lat) + 0.01,
//             lng: parseFloat(tripData.starting_lng) + 0.01,
//             address: "Default Destination"
//           });
//         }

//       } catch (err) {
//         console.error("Failed to fetch trip data:", err);
        
//         // Set fallback data
//         setStartingLocation({
//           lat: 11.106872,
//           lng: 75.8685795,
//           address: "Chenakkalangadi, Tirurangadi, Malappuram"
//         });
//         setDestination({
//           lat: 11.258753,
//           lng: 75.780411,
//           address: "Calicut, Kerala"
//         });
//         setMapCenter([11.106872, 75.8685795]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (trip_id) {
//       fetchTripData();
//     }
//   }, [trip_id]);

//   // Initialize geolocation tracking
//   const initializeGeolocation = async () => {
//     if (!startingLocation) {
//       return;
//     }

//     const hasPermission = await checkLocationPermission();
//     if (!hasPermission) {
//       setIsLoading(false);
//       return;
//     }

//     if (!isGeolocationAvailable()) {
//       setLocationError("Geolocation is not supported by your browser.");
//       setIsLoading(false);
//       return;
//     }

//     // Get initial position
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude, heading } = position.coords;
        
//         setCurrentLocation({ lat: latitude, lng: longitude });
//         setMapCenter([latitude, longitude]);
//         previousLocationRef.current = { lat: latitude, lng: longitude };
//         locationUpdateCountRef.current += 1;
        
//         if (heading !== null && !isNaN(heading)) {
//           setUserBearing(heading);
//         }
        
//         setHasStarted(true);
//         setLocationError(null);
//         setIsLoading(false);
        
//         // Fetch route directions only if destination is valid
//         if (destination && destination.lat && destination.lng) {
//           fetchRouteDirections(latitude, longitude);
//         }
//       },
//       (error) => {
//         handleLocationError(error);
//         setIsLoading(false);
//         // Use starting location as fallback
//         setCurrentLocation(startingLocation);
//         setHasStarted(true);
//         if (destination && destination.lat && destination.lng) {
//           fetchRouteDirections(startingLocation.lat, startingLocation.lng);
//         }
//       },
//       { 
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 60000 
//       }
//     );

//     // Watch position for real-time updates
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude, heading } = position.coords;
        
//         if (heading !== null && !isNaN(heading)) {
//           setUserBearing(heading);
//         } else if (previousLocationRef.current) {
//           const bearing = calculateUserBearing(
//             latitude, 
//             longitude, 
//             previousLocationRef.current.lat, 
//             previousLocationRef.current.lng
//           );
//           setUserBearing(bearing);
//         }
        
//         previousLocationRef.current = { lat: latitude, lng: longitude };
        
//         locationUpdateCountRef.current += 1;
        
//         setCurrentLocation({ lat: latitude, lng: longitude });
//         setMapCenter([latitude, longitude]);
//         setLocationError(null);

//         const distanceToDestination = getDistanceToDestination(latitude, longitude);
        
//         updateRouteInstructions(distanceToDestination);
        
//         if (distanceToDestination <= 50 && !arrivedAtDestination) {
//           setArrivedAtDestination(true);
//         }
//       },
//       (error) => {
//         handleLocationError(error);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 2000,
//         timeout: 10000
//       }
//     );
//   };

//   // Cleanup geolocation
//   const cleanupGeolocation = () => {
//     if (watchIdRef.current) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//   };

//   // Retry location access
//   const retryLocationAccess = async () => {
//     setLocationError(null);
//     setIsLoading(true);
//     cleanupGeolocation();
//     await initializeGeolocation();
//   };

//   // Initialize when starting location is available
//   useEffect(() => {
//     if (startingLocation && !currentLocation) {
//       initializeGeolocation();
//     }

//     return () => {
//       cleanupGeolocation();
//     };
//   }, [startingLocation, currentLocation]);

//   // Calculate route and distance
//   const distanceToDestination = currentLocation && destination ? 
//     getDistanceToDestination(currentLocation.lat, currentLocation.lng) : 
//     startingLocation && destination ? 
//     getDistance(startingLocation.lat, startingLocation.lng, destination.lat, destination.lng) : 0;

//   // Create arrow icon with current bearing
//   const arrowIcon = createArrowIcon(userBearing);

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-lg font-semibold">Loading Trip Map...</p>
//           <p className="text-sm text-gray-600">Initializing location services</p>
//         </div>
//       </div>
//     );
//   }

//   // Show location error state
//   if (locationError && !currentLocation) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-gray-100">
//         <div className="text-center max-w-md mx-4">
//           <div className="text-red-500 text-6xl mb-4">📍</div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">Location Access Required</h3>
//           <p className="text-gray-600 mb-4">{locationError}</p>
//           <button
//             onClick={retryLocationAccess}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
//           >
//             Retry Location Access
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col">
//       {/* Status Information */}
//       <div className="bg-white p-3 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="font-semibold text-base">Live Trip Map</h3>
//             <p className="text-xs text-gray-600">
//               {hasStarted ? "Trip in progress" : "Ready to start"}
//             </p>
//             {nextInstruction && (
//               <p className="text-xs text-blue-600 font-medium mt-1">
//                 Next: {nextInstruction}
//               </p>
//             )}
//           </div>
//           <div className="text-right">
//             <p className="text-xs">
//               Distance: {(distanceToDestination / 1000).toFixed(2)} km
//             </p>
//             <p className={`text-xs font-semibold ${
//               arrivedAtDestination ? 'text-green-600' : 'text-blue-600'
//             }`}>
//               {arrivedAtDestination ? '🎉 Arrived!' : '🚗 On the way...'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Map Container */}
//       <div className="flex-1 relative">
//         {!isLocationEnabled && (
//           <div className="absolute inset-0 bg-red-100 bg-opacity-80 z-10 flex items-center justify-center">
//             <div className="text-center bg-white p-4 rounded-lg shadow-lg max-w-sm mx-4">
//               <div className="text-red-500 text-4xl mb-3">⚠️</div>
//               <h3 className="font-semibold text-base mb-2">Location Disabled</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Please enable location services to track your trip in real-time.
//               </p>
//               <button
//                 onClick={retryLocationAccess}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors text-sm"
//               >
//                 Enable Location
//               </button>
//             </div>
//           </div>
//         )}
        
//         <MapContainer 
//           center={mapCenter} 
//           zoom={15} 
//           style={{ height: "100%", width: "100%" }}
//           className="z-0"
//         >
//           <MapCenterHandler center={mapCenter} />
//           <MapResizeHandler />
//           <TileLayer 
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
          
//           {/* Starting Point Marker */}
//           {startingLocation && startingLocation.lat && startingLocation.lng && (
//             <Marker position={[startingLocation.lat, startingLocation.lng]} icon={startIcon}>
//               <Popup>
//                 <div className="text-center">
//                   <strong>Starting Point</strong>
//                   <br />
//                   <small>{startingLocation.address}</small>
//                 </div>
//               </Popup>
//             </Marker>
//           )}

//           {/* Destination Marker */}
//           {destination && destination.lat && destination.lng && (
//             <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
//               <Popup>
//                 <div className="text-center">
//                   <strong>Destination</strong>
//                   <br />
//                   <small>{destination.address}</small>
//                 </div>
//               </Popup>
//             </Marker>
//           )}

//           {/* Current User Location with Arrow */}
//           {currentLocation && currentLocation.lat && currentLocation.lng && (
//             <Marker position={[currentLocation.lat, currentLocation.lng]} icon={arrowIcon}>
//               <Popup>
//                 <div className="text-center">
//                   <strong>You</strong>
//                   <br />
//                   <small>Facing: {getCompassDirection(userBearing)}</small>
//                 </div>
//               </Popup>
//             </Marker>
//           )}

//           {/* Route Path from OSRM */}
//           {routePath.length > 0 && (
//             <Polyline 
//               positions={routePath} 
//               color="blue" 
//               weight={6}
//               opacity={0.7}
//             />
//           )}

//           {/* Direct route line (fallback) */}
//           {currentLocation && hasStarted && !arrivedAtDestination && routePath.length === 0 && destination && destination.lat && destination.lng && (
//             <Polyline 
//               positions={[[currentLocation.lat, currentLocation.lng], [destination.lat, destination.lng]]} 
//               color="red" 
//               weight={4}
//               opacity={0.5}
//               dashArray="10, 10"
//             />
//           )}
//         </MapContainer>
//       </div>

//       {/* Controls and Info Panel */}
//       <div className="bg-white p-2 border-t border-gray-200">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-3 text-xs">
//             <div className="flex items-center">
//               <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//               <span>Start</span>
//             </div>
//             <div className="flex items-center">
//               <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
//               <span>Destination</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 relative">
//                 <div className="absolute inset-0 bg-white rounded-full transform scale-50"></div>
//               </div>
//               <span>You</span>
//             </div>
//           </div>
          
//           <button
//             onClick={retryLocationAccess}
//             className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded transition-colors"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main BtliveTripChat Component
// const BtliveTripChat = () => {
//   const { trip_id, invateuserid } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [tripInfo, setTripInfo] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isMapVisible, setIsMapVisible] = useState(true);
//   const ws = useRef(null);
//   const messagesEndRef = useRef(null);
//   const messageInputRef = useRef(null);
//   const pendingMessageIdRef = useRef(null);

//   // Get current user info
//   useEffect(() => {
//     const user = {
//       id: invateuserid,
//       name: "Muzammil"
//     };
    
//     setCurrentUser(user);
//     console.log('Current user set:', user);
//   }, [invateuserid]);

//   // Fetch message history
//   const fetchMessageHistory = async () => {
//     try {
//       const formattedTripId = trip_id.replace(/-/g, '');
//       const response = await fetch(
//         `http://127.0.0.1:8006/LiveJourneyArriveMessageHistoryAPIView/${formattedTripId}/messages/`
//       );
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Fetched message history:', data);
        
//         const transformedMessages = data.messages.map(msg => ({
//           id: msg.id,
//           message: msg.content,
//           sender_name: msg.sender_name,
//           timestamp: msg.timestamp,
//           sender_id: msg.invated_id
//         }));
        
//         setMessages(transformedMessages);
//         setTripInfo({
//           tripTitle: data.trip_title,
//           messageCount: data.message_count
//         });
//       } else {
//         console.error('Failed to fetch messages');
//       }
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   // WebSocket connection with better error handling
//   useEffect(() => {
//     const connectWebSocket = () => {
//       try {
//         const formattedTripId = trip_id.replace(/-/g, '');
//         const formattedUserId = invateuserid.replace(/-/g, '');
        
//         const wsUrl = `ws://127.0.0.1:8006/ws/trip/${formattedTripId}/${formattedUserId}/`;
        
//         ws.current = new WebSocket(wsUrl);

//         ws.current.onopen = () => {
//           console.log('WebSocket connected successfully');
//           setIsConnected(true);
//         };

//         ws.current.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
//             console.log('Received WebSocket message:', data);
            
//             if (data.message || data.content) {
//               setMessages(prev => {
//                 const transformedMessage = {
//                   id: data.id || Date.now(),
//                   message: data.message || data.content,
//                   sender_name: data.sender_name || 'User',
//                   timestamp: data.timestamp || new Date().toISOString(),
//                   sender_id: data.invite
//                 };

//                 // Remove the pending message if it exists (to prevent duplicates)
//                 const filteredMessages = prev.filter(msg => 
//                   !(pendingMessageIdRef.current && msg.id === pendingMessageIdRef.current)
//                 );

//                 // Check if message already exists to prevent duplicates
//                 const messageExists = filteredMessages.some(msg => 
//                   msg.id === transformedMessage.id || 
//                   (msg.message === transformedMessage.message && 
//                    msg.sender_name === transformedMessage.sender_name && 
//                    Math.abs(new Date(msg.timestamp).getTime() - new Date(transformedMessage.timestamp).getTime()) < 1000)
//                 );
                
//                 if (!messageExists) {
//                   return [...filteredMessages, transformedMessage];
//                 }
//                 return filteredMessages;
//               });

//               // Clear pending message ID after receiving from server
//               if (pendingMessageIdRef.current) {
//                 pendingMessageIdRef.current = null;
//               }
//             }
//           } catch (error) {
//             console.error('Error parsing WebSocket message:', error);
//           }
//         };

//         ws.current.onclose = (event) => {
//           console.log('WebSocket disconnected:', event.code, event.reason);
//           setIsConnected(false);
          
//           setTimeout(() => {
//             console.log('Attempting to reconnect WebSocket...');
//             connectWebSocket();
//           }, 3000);
//         };

//         ws.current.onerror = (error) => {
//           console.error('WebSocket error:', error);
//           setIsConnected(false);
//         };

//       } catch (error) {
//         console.error('Error creating WebSocket connection:', error);
//         setIsConnected(false);
//       }
//     };

//     if (currentUser) {
//       connectWebSocket();
//       fetchMessageHistory();
//     }

//     return () => {
//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         ws.current.close();
//       }
//     };
//   }, [trip_id, invateuserid, currentUser]);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Focus on input when component mounts
//   useEffect(() => {
//     if (messageInputRef.current) {
//       messageInputRef.current.focus();
//     }
//   }, []);

//   const sendMessage = () => {
//     if (!newMessage.trim()) {
//       console.log('Message is empty');
//       return;
//     }

//     if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
//       console.log('WebSocket is not connected');
//       alert('Connection lost. Please refresh the page.');
//       return;
//     }

//     try {
//       const tempMessageId = Date.now();
//       pendingMessageIdRef.current = tempMessageId;

//       const messageData = {
//         message: newMessage.trim(),
//         sender_id: currentUser?.id,
//         sender_name: currentUser?.name,
//         timestamp: new Date().toISOString()
//       };

//       // Optimistically add the message to the UI immediately with temporary ID
//       const optimisticMessage = {
//         id: tempMessageId,
//         message: newMessage.trim(),
//         sender_id: currentUser?.id,
//         sender_name: currentUser?.name,
//         timestamp: new Date().toISOString()
//       };

//       setMessages(prev => [...prev, optimisticMessage]);
//       setNewMessage('');
      
//       // Send via WebSocket
//       ws.current.send(JSON.stringify(messageData));
      
//       // Refocus input after sending
//       if (messageInputRef.current) {
//         messageInputRef.current.focus();
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       alert('Failed to send message. Please try again.');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const formatMessageTime = (timestamp) => {
//     if (!timestamp) return '';
    
//     try {
//       const date = new Date(timestamp);
//       return date.toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         minute: '2-digit',
//         hour12: true 
//       });
//     } catch {
//       return '';
//     }
//   };

//   const toggleMapVisibility = () => {
//     setIsMapVisible(!isMapVisible);
//   };

//   const renderMessage = (msg, index) => {
//     const isCurrentUser = currentUser && msg.sender_id === currentUser.id;
    
//     const timestamp = msg.timestamp;
//     const messageContent = msg.message;
//     const senderName = msg.sender_name || 'User';
//     const initials = getInitials(senderName);
//     const colorClass = getColorFromName(senderName);

//     return (
//       <div 
//         key={msg.id} 
//         className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}
//       >
//         <div className={`flex gap-3 max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
//           {/* Avatar with initials */}
//           <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
//             {initials}
//           </div>
          
//           {/* Message Content */}
//           <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
//             {/* Sender Name and Time */}
//             <div className={`flex items-baseline gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
//               <span className="font-semibold text-sm text-gray-800">
//                 {isCurrentUser ? 'You' : senderName}
//               </span>
//               <span className="text-xs text-gray-500">{formatMessageTime(timestamp)}</span>
//             </div>
            
//             {/* Message Bubble */}
//             <div className={`p-3 rounded-2xl max-w-full shadow-sm ${
//               isCurrentUser 
//                 ? 'bg-blue-600 text-white rounded-br-md' 
//                 : 'bg-gray-100 text-gray-800 rounded-bl-md'
//             }`}>
//               <p className="text-sm leading-relaxed break-words">
//                 {messageContent}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white text-black font-sans">
//       {/* Mobile Header with Toggle Button */}
//       <div className="lg:hidden bg-white border-b border-gray-200 p-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-xl font-bold text-black">Trip Chat</h1>
//           <button
//             onClick={toggleMapVisibility}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
//           >
//             {isMapVisible ? 'Show Chat' : 'Show Map'}
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row h-screen w-full">
        
//         {/* Chat Section - Always visible on desktop, toggle on mobile */}
//         <main className={`flex flex-col w-full lg:w-1/2 bg-white border-r border-gray-200 ${
//           isMapVisible ? 'hidden lg:flex' : 'flex'
//         }`}>
//           <header className="hidden lg:flex items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6">
//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-bold text-black truncate">
//                 {tripInfo?.tripTitle || 'Group Chat'}
//               </h2>
//               <p className="text-sm text-gray-600 truncate mt-1">
//                 {tripInfo?.messageCount || messages.length} messages • Live trip chat
//               </p>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//               <span className="text-sm text-gray-600">{isConnected ? 'Live' : 'Connecting...'}</span>
//             </div>
//           </header>
          
//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50">
//             {/* Today Indicator */}
//             <div className="flex justify-center my-4">
//               <div className="text-center text-xs text-gray-600 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
//                 Today
//               </div>
//             </div>
            
//             {/* Render messages from API and WebSocket */}
//             {messages.length > 0 ? (
//               messages.map((message) => renderMessage(message))
//             ) : (
//               <div className="flex justify-center items-center h-32">
//                 <div className="text-center">
//                   <div className="text-gray-400 text-6xl mb-2">💬</div>
//                   <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>
          
//           {/* Message Input */}
//           <footer className="bg-white p-4 border-t border-gray-200">
//             <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
//               <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//                 </svg>
//               </button>
              
//               <input 
//                 ref={messageInputRef}
//                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-black placeholder:text-gray-500 outline-none py-2"
//                 placeholder="Type your message..." 
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 disabled={!isConnected}
//               />
              
//               <button 
//                 className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 transition-colors min-w-[44px] min-h-[44px] shadow-sm"
//                 onClick={sendMessage}
//                 disabled={!newMessage.trim() || !isConnected}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               </button>
//             </div>
//             {!isConnected && (
//               <p className="text-xs text-red-500 mt-2 text-center">
//                 Connection lost. Attempting to reconnect...
//               </p>
//             )}
//           </footer>
//         </main>

//         {/* Map Section - Always visible on desktop, toggle on mobile */}
//         <aside className={`flex flex-col w-full lg:w-1/2 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 ${
//           isMapVisible ? 'flex' : 'hidden lg:flex'
//         }`}>
//           <LiveTripMap trip_id={trip_id} />
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default BtliveTripChat;


















import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

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

// Rotating arrow icon for user direction
const createArrowIcon = (angle = 0) => new L.DivIcon({
  html: `
    <div style="
      transform: rotate(${angle}deg);
      transition: transform 0.3s ease;
      width: 35px;
      height: 35px;
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
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 12px solid white;
        margin-top: -4px;
      "></div>
    </div>
  `,
  className: 'arrow-marker',
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

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

// Routing directions using OSRM API
const getRouteDirections = async (startLat, startLng, endLat, endLng) => {
  try {
    if (!startLat || !startLng || !endLat || !endLng) {
      console.error("Invalid coordinates for route:", { startLat, startLng, endLat, endLng });
      return null;
    }

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      throw new Error(`Route API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    }
    return null;
  } catch (error) {
    console.error("Error fetching route directions:", error);
    return null;
  }
};

// Calculate bearing between two points
const calculateBearing = (startLat, startLng, endLat, endLng) => {
  const startLatRad = startLat * Math.PI / 180;
  const startLngRad = startLng * Math.PI / 180;
  const endLatRad = endLat * Math.PI / 180;
  const endLngRad = endLng * Math.PI / 180;

  const y = Math.sin(endLngRad - startLngRad) * Math.cos(endLatRad);
  const x = Math.cos(startLatRad) * Math.sin(endLatRad) -
           Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(endLngRad - startLngRad);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  return bearing;
};

// Helper function to get compass direction
const getCompassDirection = (bearing) => {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

// Generate color based on name
const getColorFromName = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
  ];
  if (!name) return 'bg-gray-500';
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

// LiveTripMap Component
const LiveTripMap = ({ trip_id }) => {
  const userName = "User";
  
  const [startingLocation, setStartingLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [arrivedAtDestination, setArrivedAtDestination] = useState(false);
  const [mapCenter, setMapCenter] = useState([11.106872, 75.8685795]);
  const [routePath, setRoutePath] = useState([]);
  const [userBearing, setUserBearing] = useState(0);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [nextInstruction, setNextInstruction] = useState("");
  const [locationError, setLocationError] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const previousLocationRef = useRef(null);
  const locationUpdateCountRef = useRef(0);
  const watchIdRef = useRef(null);

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
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 0
        });
      });
      setIsLocationEnabled(true);
      setLocationError(null);
      return true;
    } catch (error) {
      handleLocationError(error);
      return false;
    }
  };

  // Handle location errors
  const handleLocationError = (error) => {
    console.error("Location error:", error);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationError("Location access denied. Please enable location permissions.");
        setIsLocationEnabled(false);
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationError("Location information unavailable.");
        setIsLocationEnabled(false);
        break;
      case error.TIMEOUT:
        setLocationError("Location request timed out.");
        break;
      default:
        setLocationError("An unknown error occurred while accessing location.");
        setIsLocationEnabled(false);
        break;
    }
  };

  // Calculate distance
  const getDistance = (lat1, lng1, lat2, lng2) => {
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
  };

  // Calculate distance to destination
  const getDistanceToDestination = (currentLat, currentLng) => {
    if (!destination || !destination.lat || !destination.lng) return 0;
    return getDistance(currentLat, currentLng, destination.lat, destination.lng);
  };

  // Get route directions
  const fetchRouteDirections = async (startLat, startLng) => {
    if (!destination || !destination.lat || !destination.lng) {
      console.warn("Cannot fetch route: destination coordinates are invalid");
      return;
    }
    
    const route = await getRouteDirections(startLat, startLng, destination.lat, destination.lng);
    if (route) {
      setRoutePath(route);
      
      const instructions = [];
      if (route.length > 2) {
        instructions.push(
          { distance: getDistance(startLat, startLng, route[1][0], route[1][1]), instruction: "Head towards destination" },
          { distance: getDistance(startLat, startLng, route[Math.floor(route.length/2)][0], route[Math.floor(route.length/2)][1]), instruction: "Continue on route" },
          { distance: getDistance(startLat, startLng, route[route.length-2][0], route[route.length-2][1]), instruction: "Approaching destination" },
          { distance: 50, instruction: "You have arrived at your destination" }
        );
      }
      setRouteInstructions(instructions);
      setNextInstruction(instructions[0]?.instruction || "Follow the route");
    } else {
      setNextInstruction("Head towards destination");
    }
  };

  // Update next instruction based on distance
  const updateRouteInstructions = (currentDistance) => {
    const nextInstruction = routeInstructions.find(instruction => 
      currentDistance <= instruction.distance
    );
    if (nextInstruction) {
      setNextInstruction(nextInstruction.instruction);
    }
  };

  // Calculate user bearing (direction)
  const calculateUserBearing = (currentLat, currentLng, prevLat, prevLng) => {
    if (!prevLat || !prevLng) return 0;
    
    const bearing = calculateBearing(prevLat, prevLng, currentLat, currentLng);
    return bearing;
  };

  // Fetch trip data
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setIsLoading(true);
        
        const response = await axios.get(`http://127.0.0.1:8006/TripStartingDestinationlocation/${trip_id}/`);
        
        const responseData = response.data;
        
        if (!responseData.data) {
          throw new Error("No data found in API response");
        }

        const tripData = responseData.data;
        
        // Validate and set starting location
        if (tripData.starting_lat && tripData.starting_lng) {
          setStartingLocation({
            lat: parseFloat(tripData.starting_lat),
            lng: parseFloat(tripData.starting_lng),
            address: tripData.starting_address || "Starting Point"
          });
          
          setMapCenter([parseFloat(tripData.starting_lat), parseFloat(tripData.starting_lng)]);
        } else {
          throw new Error("Invalid starting location data");
        }

        // Validate and set destination
        if (tripData.destination_lat && tripData.destination_lng) {
          setDestination({
            lat: parseFloat(tripData.destination_lat),
            lng: parseFloat(tripData.destination_lng),
            address: tripData.destination_address || "Destination"
          });
        } else {
          setDestination({
            lat: parseFloat(tripData.starting_lat) + 0.01,
            lng: parseFloat(tripData.starting_lng) + 0.01,
            address: "Default Destination"
          });
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
        setMapCenter([11.106872, 75.8685795]);
      } finally {
        setIsLoading(false);
      }
    };

    if (trip_id) {
      fetchTripData();
    }
  }, [trip_id]);

  // Initialize geolocation tracking
  const initializeGeolocation = async () => {
    if (!startingLocation) {
      return;
    }

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

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        
        setCurrentLocation({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
        previousLocationRef.current = { lat: latitude, lng: longitude };
        locationUpdateCountRef.current += 1;
        
        if (heading !== null && !isNaN(heading)) {
          setUserBearing(heading);
        }
        
        setHasStarted(true);
        setLocationError(null);
        setIsLoading(false);
        
        // Fetch route directions only if destination is valid
        if (destination && destination.lat && destination.lng) {
          fetchRouteDirections(latitude, longitude);
        }
      },
      (error) => {
        handleLocationError(error);
        setIsLoading(false);
        // Use starting location as fallback
        setCurrentLocation(startingLocation);
        setHasStarted(true);
        if (destination && destination.lat && destination.lng) {
          fetchRouteDirections(startingLocation.lat, startingLocation.lng);
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 
      }
    );

    // Watch position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        
        if (heading !== null && !isNaN(heading)) {
          setUserBearing(heading);
        } else if (previousLocationRef.current) {
          const bearing = calculateUserBearing(
            latitude, 
            longitude, 
            previousLocationRef.current.lat, 
            previousLocationRef.current.lng
          );
          setUserBearing(bearing);
        }
        
        previousLocationRef.current = { lat: latitude, lng: longitude };
        
        locationUpdateCountRef.current += 1;
        
        setCurrentLocation({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
        setLocationError(null);

        const distanceToDestination = getDistanceToDestination(latitude, longitude);
        
        updateRouteInstructions(distanceToDestination);
        
        if (distanceToDestination <= 50 && !arrivedAtDestination) {
          setArrivedAtDestination(true);
        }
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000
      }
    );
  };

  // Cleanup geolocation
  const cleanupGeolocation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Retry location access
  const retryLocationAccess = async () => {
    setLocationError(null);
    setIsLoading(true);
    cleanupGeolocation();
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
  }, [startingLocation, currentLocation]);

  // Calculate route and distance
  const distanceToDestination = currentLocation && destination ? 
    getDistanceToDestination(currentLocation.lat, currentLocation.lng) : 
    startingLocation && destination ? 
    getDistance(startingLocation.lat, startingLocation.lng, destination.lat, destination.lng) : 0;

  // Create arrow icon with current bearing
  const arrowIcon = createArrowIcon(userBearing);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading Trip Map...</p>
          <p className="text-sm text-gray-600">Initializing location services</p>
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
              {hasStarted ? "Trip in progress" : "Ready to start"}
            </p>
            {nextInstruction && (
              <p className="text-xs text-blue-600 font-medium mt-1">
                Next: {nextInstruction}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs">
              Distance: {(distanceToDestination / 1000).toFixed(2)} km
            </p>
            <p className={`text-xs font-semibold ${
              arrivedAtDestination ? 'text-green-600' : 'text-blue-600'
            }`}>
              {arrivedAtDestination ? '🎉 Arrived!' : '🚗 On the way...'}
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
                Please enable location services to track your trip in real-time.
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
          {startingLocation && startingLocation.lat && startingLocation.lng && (
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
          {destination && destination.lat && destination.lng && (
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

          {/* Current User Location with Arrow */}
          {currentLocation && currentLocation.lat && currentLocation.lng && (
            <Marker position={[currentLocation.lat, currentLocation.lng]} icon={arrowIcon}>
              <Popup>
                <div className="text-center">
                  <strong>You</strong>
                  <br />
                  <small>Facing: {getCompassDirection(userBearing)}</small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route Path from OSRM */}
          {routePath.length > 0 && (
            <Polyline 
              positions={routePath} 
              color="blue" 
              weight={6}
              opacity={0.7}
            />
          )}

          {/* Direct route line (fallback) */}
          {currentLocation && hasStarted && !arrivedAtDestination && routePath.length === 0 && destination && destination.lat && destination.lng && (
            <Polyline 
              positions={[[currentLocation.lat, currentLocation.lng], [destination.lat, destination.lng]]} 
              color="red" 
              weight={4}
              opacity={0.5}
              dashArray="10, 10"
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
              <span>You</span>
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

// Main BtliveTripChat Component
const BtliveTripChat = () => {
  const { trip_id, invateuserid } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tripInfo, setTripInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Get current user info
  useEffect(() => {
    const user = {
      id: invateuserid,
      name: "Current User"
    };
    
    setCurrentUser(user);
  }, [invateuserid]);

  // Fetch message history
  const fetchMessageHistory = async () => {
    try {
      const formattedTripId = trip_id.replace(/-/g, '');
      const response = await fetch(
        `http://127.0.0.1:8006/LiveJourneyArriveMessageHistoryAPIView/${formattedTripId}/messages/`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform the data to match our expected format
        const transformedMessages = data.messages.map(msg => ({
          id: msg.id,
          message: msg.content,
          sender_name: msg.sender_name,
          timestamp: msg.timestamp,
          sender_id: msg.invated_id || msg.sender_name
        }));
        
        setMessages(transformedMessages);
        setTripInfo({
          tripTitle: data.trip_title,
          messageCount: data.message_count
        });
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const formattedTripId = trip_id.replace(/-/g, '');
        const formattedUserId = invateuserid.replace(/-/g, '');
        
        const wsUrl = `ws://127.0.0.1:8006/ws/trip/${formattedTripId}/${formattedUserId}/`;
        
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.message) {
              setMessages(prev => {
                const transformedMessage = {
                  id: data.id || Date.now(),
                  message: data.message,
                  sender_name: data.sender_name || 'User',
                  timestamp: data.timestamp || new Date().toISOString(),
                  sender_id: data.invite || data.sender_name
                };
                
                // Check if message already exists to prevent duplicates
                const messageExists = prev.some(msg => 
                  msg.id === transformedMessage.id || 
                  (msg.message === transformedMessage.message && 
                   msg.sender_name === transformedMessage.sender_name && 
                   Math.abs(new Date(msg.timestamp).getTime() - new Date(transformedMessage.timestamp).getTime()) < 1000)
                );
                
                if (!messageExists) {
                  return [...prev, transformedMessage];
                }
                return prev;
              });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.current.onclose = (event) => {
          setIsConnected(false);
          
          // Attempt reconnection after 3 seconds
          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setIsConnected(false);
      }
    };

    if (trip_id && invateuserid) {
      connectWebSocket();
      fetchMessageHistory();
    }

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [trip_id, invateuserid]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when component mounts
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      alert('Connection lost. Please refresh the page.');
      return;
    }

    try {
      const messageData = {
        message: newMessage.trim(),
        sender_id: currentUser?.id,
        sender_name: currentUser?.name || "User",
        timestamp: new Date().toISOString(),
        trip: trip_id,
        invite: invateuserid
      };

      ws.current.send(JSON.stringify(messageData));
      
      // Optimistically add the message to the UI immediately
      const optimisticMessage = {
        id: Date.now(),
        message: newMessage.trim(),
        sender_id: currentUser?.id,
        sender_name: currentUser?.name || "User",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      
      // Refocus input after sending
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return '';
    }
  };

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  const renderMessage = (msg, index) => {
    // CORRECTED: Properly identify if message is from current user
    const isCurrentUser = currentUser && 
      (msg.sender_id === currentUser.id || 
       msg.invated_id === currentUser.id ||
       msg.invite === currentUser.id);
    
    const timestamp = msg.timestamp;
    const messageContent = msg.message || msg.content;
    const senderName = msg.sender_name || 'User';
    const initials = getInitials(senderName);
    const colorClass = getColorFromName(senderName);

    return (
      <div 
        key={msg.id || index} 
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}
      >
        <div className={`flex gap-3 max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          {/* Avatar with initials */}
          {!isCurrentUser && (
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
              {initials}
            </div>
          )}
          
          {/* Message Content */}
          <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            {/* Sender Name and Time */}
            <div className={`flex items-baseline gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
              <span className="font-semibold text-sm text-gray-800">
                {isCurrentUser ? 'You' : senderName}
              </span>
              <span className="text-xs text-gray-500">{formatMessageTime(timestamp)}</span>
            </div>
            
            {/* Message Bubble */}
            <div className={`p-3 rounded-2xl max-w-full shadow-sm ${
              isCurrentUser 
                ? 'bg-blue-600 text-white rounded-br-md' 
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}>
              <p className="text-sm leading-relaxed break-words">
                {messageContent}
              </p>
            </div>
          </div>

          {/* Avatar for current user (on the right) */}
          {isCurrentUser && (
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
              {initials}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Mobile Header with Toggle Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Trip Chat</h1>
          <button
            onClick={toggleMapVisibility}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {isMapVisible ? 'Show Chat' : 'Show Map'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen w-full">
        
        {/* Chat Section */}
        <main className={`flex flex-col w-full lg:w-1/2 bg-white border-r border-gray-200 ${
          isMapVisible ? 'hidden lg:flex' : 'flex'
        }`}>
          <header className="hidden lg:flex items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-black truncate">
                {tripInfo?.tripTitle || 'Group Chat'}
              </h2>
              <p className="text-sm text-gray-600 truncate mt-1">
                {tripInfo?.messageCount || messages.length} messages • Live trip chat
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Connecting...'}</span>
            </div>
          </header>
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50">
            {/* Today Indicator */}
            <div className="flex justify-center my-4">
              <div className="text-center text-xs text-gray-600 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                Today
              </div>
            </div>
            
            {/* Render messages from API and WebSocket */}
            {messages.length > 0 ? (
              messages.map((message, index) => renderMessage(message, index))
            ) : (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-2">💬</div>
                  <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <footer className="bg-white p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              <input 
                ref={messageInputRef}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-black placeholder:text-gray-500 outline-none py-2"
                placeholder="Type your message..." 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
              />
              
              <button 
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 transition-colors min-w-[44px] min-h-[44px] shadow-sm"
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </footer>
        </main>

        {/* Map Section */}
        <aside className={`flex flex-col w-full lg:w-1/2 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 ${
          isMapVisible ? 'flex' : 'hidden lg:flex'
        }`}>
          <LiveTripMap trip_id={trip_id} />
        </aside>
      </div>
    </div>
  );
};

export default BtliveTripChat;