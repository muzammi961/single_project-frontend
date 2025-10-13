// src/components/GetLocation.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const GetLocation = () => {
  const [errorMessage, setErrorMessage] = useState(""); // For user feedback

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

          setErrorMessage("");
          try {
            const token = localStorage.getItem("access_token");
            const res = await axios.post(
              "http://127.0.0.1:8003/SaveUserLocation/",
              { latitude, longitude },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(res.data);
          } catch (err) {
            console.error("Error saving location:", err);
            setErrorMessage("Failed to send location to server.");
          }
        },
        (error) => {
          // Handle geolocation errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage(
                "Location permission denied. Please enable location services in your browser or device."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMessage(
                "Location information is unavailable. Please ensure your device has location services enabled."
              );
              break;
            case error.TIMEOUT:
              setErrorMessage(
                "Location request timed out. Try again or check your device settings."
              );
              break;
            default:
              setErrorMessage("An unknown error occurred while fetching location.");
          }
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      <p>Getting your current location...</p>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default GetLocation;
