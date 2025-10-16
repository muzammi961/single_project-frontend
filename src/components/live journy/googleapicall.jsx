import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 28.6139, // New Delhi latitude
  lng: 77.2090, // New Delhi longitude
};

export default function GoogleMapComponent() {
  return (
    <></>
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold mb-4 text-center">
    //     🌍 My Google Map
    //   </h1>
    //   <div className="rounded-2xl shadow-lg overflow-hidden border">
    //     <LoadScript googleMapsApiKey="AIzaSyCWl1WzGc-q0K-1lTO4vrMw1LiUd8fqyiM">
    //       <GoogleMap
    //         mapContainerStyle={containerStyle}
    //         center={center}
    //         zoom={10}
    //       >
    //         <Marker position={center} />
    //       </GoogleMap>
    //     </LoadScript>
    //   </div>
    // </div>
  );
}
