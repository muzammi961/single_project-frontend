import React, { useEffect, useRef } from "react";

const PlacesTest = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC597c7IUWMMTT_zezGbsQGlTEMpJA-JKM&libraries=places`;
    script.async = true;
    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        // Create the autocomplete element
        const autocompleteElement = new window.google.maps.places.UnrestrictedPlaceAutocompleteElement();

        // Bind your input field
        autocompleteElement.bindElement(inputRef.current);

        // Listen for place selection
        autocompleteElement.addEventListener("place_changed", () => {
          const place = autocompleteElement.getPlace();
          console.log("Selected Place:", place);

          if (place.geometry) {
            console.log("Latitude:", place.geometry.location.lat());
            console.log("Longitude:", place.geometry.location.lng());
          }
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Google Places API Test</h2>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a place name..."
        style={{ width: "300px", padding: "8px" }}
      />
    </div>
  );
};

export default PlacesTest;
