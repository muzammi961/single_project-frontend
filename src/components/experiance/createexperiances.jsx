import React, { useState, useEffect } from "react";
import axios from "axios";

const AddExperience = () => {
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
    file: null,        // single file (image/video)
    fileType: "image", // "image" or "video"
    date_of_visit: "",  // new date field
  });

  const [selectedTag, setSelectedTag] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = ["Adventure", "Cultural", "Nature", "Historical", "Food", "Relaxation"];
  const privacyOptions = ["PUBLIC", "FRIENDS", "PRIVATE"];

  // ✅ Fetch place suggestions and auto-fill latitude & longitude
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

          // Auto-fill latitude and longitude from first result
          if (res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              latitude: res.data[0].lat,
              longitude: res.data[0].lon,
            }));
          }
        } catch (err) {
          console.error("Error fetching location:", err);
        }
      } else {
        setPlaceSuggestions([]);
        setShowSuggestions(false);
        setFormData((prev) => ({ ...prev, latitude: "", longitude: "" }));
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.place_name]);

  // Handle input changes (text, date, number)
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

  // Handle file type selection (image/video)
  const handleFileTypeChange = (e) => {
    const fileType = e.target.value;
    setFormData((prev) => ({ ...prev, fileType, file: null })); // reset file on type change
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

  // Get live location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
          }));
          setShowSuggestions(false);
          setLoadingLocation(false);
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
          if (value) submitData.append(formData.fileType, value); // send as image or video
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
    //  max-w-lg mx-auto
    <div className="max bg-black p-6 shadow-lg rounded-lg relative text-amber-50">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Travel Experience</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Place Name */}
        <div className="relative">
          <input
            type="text"
            name="place_name"
            placeholder="Place Name"
            value={formData.place_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            autoComplete="off"
          />
          {showSuggestions && placeSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
              {placeSuggestions.map((place, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Write about your experience..."
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Category & Privacy */}
        <div className="flex gap-2">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          >
            {privacyOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Date of Visit */}
        <input
          type="date"
          name="date_of_visit"
          value={formData.date_of_visit}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Location Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          disabled={loadingLocation}
        >
          {loadingLocation ? "Detecting..." : "📍 Use My Current Location"}
        </button>

        {/* Choose file type */}
        <div className="flex gap-4 items-center mt-2">
          <label>
            <input
              type="radio"
              name="fileType"
              value="image"
              checked={formData.fileType === "image"}
              onChange={handleFileTypeChange}
            />{" "}
            Image
          </label>
          <label>
            <input
              type="radio"
              name="fileType"
              value="video"
              checked={formData.fileType === "video"}
              onChange={handleFileTypeChange}
            />{" "}
            Video
          </label>
        </div>

        {/* Single File Input */}
        <input
          type="file"
          accept={formData.fileType === "image" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="w-full p-2 border rounded mt-2"
        />

        {/* Tags */}
        <div className="flex gap-2 mt-2">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Tag --</option>
            <option value="beach">beach</option>
            <option value="mountain">mountain</option>
            <option value="forest">forest</option>
            <option value="waterfall">waterfall</option>
            <option value="island">island</option>
            <option value="desert">desert</option>
            <option value="lake">lake</option>
          </select>

          <button
            type="button"
            onClick={handleAddTag}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
          >
            Add Tag
          </button>
        </div>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500 font-bold hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddExperience;
