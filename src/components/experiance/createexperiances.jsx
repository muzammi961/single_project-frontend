import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExperience = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    title: "",
    place_name: "",
    category: "Adventure",
    description: "",
    rating: "",
    privacy: "PUBLIC",
    latitude: "",
    longitude: "",
    tags: [],
    file: null,
    fileType: "image",
    date_of_visit: "",
  });

  const [selectedTag, setSelectedTag] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = ["Adventure", "Cultural", "Nature", "Historical", "Food", "Relaxation"];
  const privacyOptions = ["PUBLIC", "FRIENDS", "PRIVATE"];

  // ✅ Fetch place suggestions
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const query = formData.place_name.trim();
      if (query.length > 2) {
        try {
          const res = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
              q: query,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
          });

          setPlaceSuggestions(res.data);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Error fetching location:", err);
        }
      } else {
        setPlaceSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.place_name]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    }
  };

  // Handle file type selection
  const handleFileTypeChange = (e) => {
    const fileType = e.target.value;
    setFormData((prev) => ({ ...prev, fileType, file: null }));
  };

  // Select suggestion
  const handleSelectSuggestion = (place) => {
    setFormData((prev) => ({
      ...prev,
      place_name: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
    }));
    setShowSuggestions(false);
  };

  // Get live location and reverse geocode to get place name
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          
          try {
            // Reverse geocode to get place name
            const response = await axios.get(
              "https://nominatim.openstreetmap.org/reverse",
              {
                params: {
                  lat: lat,
                  lon: lon,
                  format: "json",
                  addressdetails: 1,
                },
              }
            );
            
            const placeName = response.data.display_name;
            
            setFormData((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lon,
              place_name: placeName,
            }));
            
            setShowSuggestions(false);
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            // Still set coordinates even if reverse geocoding fails
            setFormData((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lon,
            }));
          } finally {
            setLoadingLocation(false);
          }
        },
        (err) => {
          console.error("Location error:", err);
          alert("Unable to access location. Please allow permission.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation not supported in your browser.");
    }
  };

  // Add & remove tags
  const handleAddTag = () => {
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, selectedTag] }));
    }
    setSelectedTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return alert("Please enter a description.");

    setLoadingSubmit(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          submitData.append("tags", JSON.stringify(value));
        } else if (key === "file") {
          if (value) submitData.append(formData.fileType, value);
        } else if (value) {
          submitData.append(key, value);
        }
      });

      const res = await axios.post(
        "http://127.0.0.1:8004/TravelExperienceCreateAPIView/",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Experience added successfully!");
      console.log("Saved:", res.data);

      // Reset form
      setFormData({
        title: "",
        place_name: "",
        category: "Adventure",
        description: "",
        rating: "",
        privacy: "PUBLIC",
        latitude: "",
        longitude: "",
        tags: [],
        file: null,
        fileType: "image",
        date_of_visit: "",
      });
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Error adding experience!");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 shadow-lg rounded-lg text-black border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add Travel Experience</h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* First Row: Title, Place Name, Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Place Name with suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Place Name</label>
            <input
              type="text"
              name="place_name"
              placeholder="Enter place name"
              value={formData.place_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="off"
            />

            {showSuggestions && placeSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                {placeSuggestions.map((place, idx) => (
                  <li
                    key={idx}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-black border-b border-gray-200 last:border-b-0"
                    onClick={() => handleSelectSuggestion(place)}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Write about your experience..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              required
            />
          </div>
        </div>

        {/* Second Row: Category, Privacy, Rating, Date, Location */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-black">{cat}</option>
              ))}
            </select>
          </div>

          {/* Privacy */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
            <select
              name="privacy"
              value={formData.privacy}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {privacyOptions.map((opt) => (
                <option key={opt} value={opt} className="text-black">{opt}</option>
              ))}
            </select>
          </div> */}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              placeholder="0.0 - 5.0"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date of Visit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Visit</label>
            <input
              type="date"
              name="date_of_visit"
              value={formData.date_of_visit}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg transition duration-200 font-medium"
              disabled={loadingLocation}
            >
              {loadingLocation ? "📍 Detecting..." : "📍 Use Current Location"}
            </button>
          </div>
        </div>

        {/* File Type Selection and File Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Media Type</label>
            <div className="flex gap-6 items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="fileType"
                  value="image"
                  checked={formData.fileType === "image"}
                  onChange={handleFileTypeChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-black font-medium">Image</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="fileType"
                  value="video"
                  checked={formData.fileType === "video"}
                  onChange={handleFileTypeChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-black font-medium">Video</span>
              </label>
            </div>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.fileType === "image" ? "Upload Image" : "Upload Video"}
            </label>
            <input
              type="file"
              accept={formData.fileType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-shadow-black hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="flex gap-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="text-gray-500">-- Select Tag --</option>
              <option value="beach" className="text-black">beach</option>
              <option value="mountain" className="text-black">mountain</option>
              <option value="forest" className="text-black">forest</option>
              <option value="waterfall" className="text-black">waterfall</option>
              <option value="island" className="text-black">island</option>
              <option value="desert" className="text-black">desert</option>
              <option value="lake" className="text-black">lake</option>






              
            </select>

            <button
              type="button"
              onClick={handleAddTag}
              className="bg-black hover:bg-gray-700 text-white px-6 rounded-lg font-medium transition duration-200 whitespace-nowrap"
            >
              Add Tag
            </button>
          </div>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 px-3 py-2 rounded-full text-sm flex items-center gap-2 text-black font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500 font-bold hover:text-red-700 text-lg"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="w-1/2 bg-black hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:bg-gray-400"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Saving..." : "Submit"}
          </button>

          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-1/2 bg-black hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExperience;