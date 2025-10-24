import React, { useState } from "react";
import axios from "axios";

const PlacesTest = () => {
  const [location, setLocation] = useState("28.6139,77.2090"); // Default Delhi
  const [type, setType] = useState("restaurant");
  const [radius, setRadius] = useState(1000);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://127.0.0.1:8006/api/search_places", {
        params: {
          location,
          type,
          radius,
        },
      });

      if (res.data.results) {
        setPlaces(res.data.results);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch places. Make sure your backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Places Test</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Location (lat,lng):{" "}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Type:{" "}
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="cafe">Cafe</option>
            <option value="tourist_attraction">Tourist Attraction</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Radius (meters):{" "}
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search Places"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "20px" }}>
        {places.map((place) => (
          <li key={place.place_id}>
            <strong>{place.name}</strong> — {place.vicinity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlacesTest;
