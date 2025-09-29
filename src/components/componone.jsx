// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import L from "leaflet";
// import "leaflet-routing-machine";

// // Component to add route
// function Routing({ from, to }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     const routingControl = L.Routing.control({
//       waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
//       routeWhileDragging: true,
//       showAlternatives: false,
//     }).addTo(map);

//     // Listen to route found event
//     routingControl.on("routesfound", function (e) {
//       const route = e.routes[0];
//       const distance = (route.summary.totalDistance / 1000).toFixed(2); // km
//       alert(`Distance: ${distance} km 🚗`);
//     });

//     return () => map.removeControl(routingControl);
//   }, [map, from, to]);

//   return null;
// }

// function MyMap() {
//   // Example: From Kozhikode → To Kochi
//   const from = [11.2588, 75.7804]; // Kozhikode
//   const to = [9.9312, 76.2673];    // Kochi

//   return (
//     <MapContainer
//       center={from}
//       zoom={7}
//       scrollWheelZoom={true}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//       />
//       <Marker position={from}>
//         <Popup>Starting Point (From)</Popup>
//       </Marker>
//       <Marker position={to}>
//         <Popup>Destination (To)</Popup>
//       </Marker>

//       {/* Routing component */}
//       <Routing from={from} to={to} />
//     </MapContainer>
//   );
// }

// export default MyMap;




import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { debounce } from "lodash";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const destIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MyMap = () => {
  const [from, setFrom] = useState([11.2588, 75.7804]);
  const [to, setTo] = useState(null);
  const [info, setInfo] = useState({ distance: null, time: null });
  const [fromAddress, setFromAddress] = useState("Kozhikode, Kerala");
  const [toAddress, setToAddress] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const mapRef = useRef();
  const searchProvider = new OpenStreetMapProvider();

  // Debounced search function
  const searchLocation = useCallback(
    debounce(async (query, setSuggestions) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      
      try {
        const results = await searchProvider.search({ query });
        setSuggestions(results.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Reverse geocoding function
  const reverseGeocode = async (latlng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng[0]}&lon=${latlng[1]}`
      );
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      return "Unknown location";
    }
  };

  // Handle address input change
  const handleAddressChange = (type, value) => {
    if (type === 'from') {
      setFromAddress(value);
      searchLocation(value, setFromSuggestions);
    } else {
      setToAddress(value);
      searchLocation(value, setToSuggestions);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (type, suggestion) => {
    const { x, y, label } = suggestion;
    const newLocation = [y, x];
    
    if (type === 'from') {
      setFrom(newLocation);
      setFromAddress(label);
      setFromSuggestions([]);
      
      // Center map on new location
      if (mapRef.current) {
        mapRef.current.setView(newLocation, 13);
      }
    } else {
      setTo(newLocation);
      setToAddress(label);
      setToSuggestions([]);
    }
  };

  // Update addresses when markers change
  useEffect(() => {
    if (from) {
      reverseGeocode(from).then(setFromAddress);
    }
  }, [from]);

  useEffect(() => {
    if (to) {
      reverseGeocode(to).then(setToAddress);
    }
  }, [to]);

  // Routing Component
  const Routing = ({ from, to, setInfo }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !from || !to) return;

      const routingControl = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        routeWhileDragging: false,
        addWaypoints: false,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: "#3388ff", weight: 5 }]
        },
        createMarker: function () {
          return null;
        },
      }).addTo(map);

      routingControl.on("routesfound", function (e) {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const time = (route.summary.totalTime / 60).toFixed(0);
        setInfo({ distance, time });
      });

      routingControl.on("routingerror", function (e) {
        setInfo({ distance: "N/A", time: "N/A" });
      });

      return () => {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      };
    }, [map, from, to, setInfo]);

    return null;
  };

  // Handler functions
  const handleSwapLocations = () => {
    if (from && to) {
      const tempFrom = [...from];
      const tempFromAddress = fromAddress;
      
      setFrom(to);
      setFromAddress(toAddress);
      setTo(tempFrom);
      setToAddress(tempFromAddress);
    }
  };

  const handleClearRoute = () => {
    setTo(null);
    setToAddress("");
    setInfo({ distance: null, time: null });
    setToSuggestions([]);
  };

  const handleInputFocus = (type) => {
    setActiveInput(type);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for click
    setTimeout(() => {
      setFromSuggestions([]);
      setToSuggestions([]);
      setActiveInput(null);
    }, 200);
  };

  // Map click handler to set location
  const MapClickHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const handleMapClick = (e) => {
        if (activeInput) {
          const newLocation = [e.latlng.lat, e.latlng.lng];
          
          if (activeInput === 'from') {
            setFrom(newLocation);
            reverseGeocode(newLocation).then(setFromAddress);
          } else {
            setTo(newLocation);
            reverseGeocode(newLocation).then(setToAddress);
          }
          
          setActiveInput(null);
        }
      };

      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }, [map, activeInput]);

    return null;
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Enhanced Input UI */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          width: "90%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* From Input with Suggestions */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold"
            }}>A</div>
            <input
              type="text"
              placeholder="Choose starting point"
              value={fromAddress}
              style={{ 
                width: "100%", 
                padding: "12px",
                border: activeInput === 'from' ? '2px solid #4285f4' : '1px solid #ddd',
                borderRadius: "4px",
                fontSize: "16px"
              }}
              onChange={(e) => handleAddressChange('from', e.target.value)}
              onFocus={() => handleInputFocus('from')}
              onBlur={handleInputBlur}
            />
          </div>
          
          {/* From Suggestions Dropdown */}
          {fromSuggestions.length > 0 && activeInput === 'from' && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: "30px",
              right: "0",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1001,
              maxHeight: "200px",
              overflowY: "auto"
            }}>
              {fromSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    fontSize: "14px"
                  }}
                  onMouseDown={() => handleSuggestionSelect('from', suggestion)}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleSwapLocations}
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Swap locations"
          >
            ⇅
          </button>
        </div>

        {/* To Input with Suggestions */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold"
            }}>B</div>
            <input
              type="text"
              placeholder="Choose destination"
              value={toAddress}
              style={{ 
                width: "100%", 
                padding: "12px",
                border: activeInput === 'to' ? '2px solid #4285f4' : '1px solid #ddd',
                borderRadius: "4px",
                fontSize: "16px"
              }}
              onChange={(e) => handleAddressChange('to', e.target.value)}
              onFocus={() => handleInputFocus('to')}
              onBlur={handleInputBlur}
            />
            {to && (
              <button
                onClick={handleClearRoute}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666"
                }}
                title="Clear route"
              >
                ×
              </button>
            )}
          </div>
          
          {/* To Suggestions Dropdown */}
          {toSuggestions.length > 0 && activeInput === 'to' && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: "30px",
              right: "0",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1001,
              maxHeight: "200px",
              overflowY: "auto"
            }}>
              {toSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    fontSize: "14px"
                  }}
                  onMouseDown={() => handleSuggestionSelect('to', suggestion)}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Click Instruction */}
        {activeInput && (
          <div style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
            padding: "5px",
            fontStyle: "italic"
          }}>
            💡 You can also click on the map to set the {activeInput === 'from' ? 'starting point' : 'destination'}
          </div>
        )}
      </div>

      {/* Map Container - Hide zoom controls */}
      <MapContainer
        center={from}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={mapInstance => {
          mapRef.current = mapInstance;
          // Hide default zoom controls :cite[2]
          mapInstance.removeControl(mapInstance.zoomControl);
        }}
        zoomControl={false} // Disable default zoom control :cite[2]
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />

        {/* Map Click Handler */}
        <MapClickHandler />

        {/* Markers */}
        {from && (
          <Marker position={from} icon={startIcon}>
            <Popup>
              <div>
                <strong>Starting Point</strong>
                <br />
                {fromAddress}
              </div>
            </Popup>
          </Marker>
        )}
        
        {to && (
          <Marker position={to} icon={destIcon}>
            <Popup>
              <div>
                <strong>Destination</strong>
                <br />
                {toAddress}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Routing */}
        {from && to && <Routing from={from} to={to} setInfo={setInfo} />}
      </MapContainer>

      {/* Route Information */}
      {info.distance && info.time && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            fontWeight: "bold",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            fontSize: "16px",
            zIndex: 1000,
          }}
        >
          <span>🚗 {info.distance} km</span>
          <span>⏱ {info.time} mins</span>
          <span>📍 {fromAddress.split(',')[0]} to {toAddress.split(',')[0]}</span>
        </div>
      )}

   
      {!to && !activeInput && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.9)",
            padding: "10px 20px",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
            zIndex: 1000,
          }}
        >
          💡 Start typing in the destination field or click on the map to set locations
        </div>
      )}
    </div>
  );
};

export default MyMap;