import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';


const UpdateExperience = () => {
  const navabar=useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    place_name: '',
    category: '',
    date_of_visit: '',
    description: '',
    rating: 0,
    privacy: 'PUBLIC',
    tags: [],
    latitude: '',
    longitude: '',
    image: ''
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  
  // const experienceId = 1;
  const experienceId = useSelector((state) => state.app.updateexperienceid);
 console.log('experinect id ',experienceId)
  const suggestionsRef = useRef(null);
  const placeInputRef = useRef(null);

  const isAuthenticated = localStorage.getItem("access_token");

  // Fetch experience data
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8004/TravalSpecificExperienceByget/${experienceId}/`,
          {
            headers: {
              'Authorization': `Bearer ${isAuthenticated}`
            }
          }
        );
        
        const data = response.data;
        setFormData({
          title: data.title || '',
          place_name: data.place_name || '',
          category: data.category || '',
          date_of_visit: data.date_of_visit || '',
          description: data.description || '',
          rating: data.rating || 0,
          privacy: data.privacy || 'PUBLIC',
          tags: data.tags || [],
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          image: data.image || ''
        });
      } catch (error) {
        console.error('Error fetching experience:', error);
        alert('Error loading experience data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchExperience();
    }
  }, [experienceId, isAuthenticated]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          placeInputRef.current && !placeInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch place suggestions
  const fetchPlaceSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Using OpenStreetMap Nominatim API for place suggestions
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: 'json',
            limit: 5,
            addressdetails: 1
          }
        }
      );

      const suggestions = response.data.map(place => ({
        display_name: place.display_name,
        lat: place.lat,
        lon: place.lon
      }));

      setPlaceSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle place name input with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.place_name) {
        fetchPlaceSuggestions(formData.place_name);
      } else {
        setPlaceSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.place_name]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePlaceSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      place_name: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon
    }));
    setShowSuggestions(false);
    setPlaceSuggestions([]);
  };

  const fetchCoordinatesForPlace = async (placeName) => {
    if (!placeName) return;

    try {
      setFetchingLocation(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: placeName,
            format: 'json',
            limit: 1
          }
        }
      );

      if (response.data && response.data.length > 0) {
        const place = response.data[0];
        setFormData(prev => ({
          ...prev,
          latitude: place.lat,
          longitude: place.lon
        }));
        return { latitude: place.lat, longitude: place.lon };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    } finally {
      setFetchingLocation(false);
    }
    return null;
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleDeleteImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to update experience');
      return;
    }

    try {
      setUpdating(true);
      
      // If place name is provided but coordinates are missing, try to fetch them
      let coordinates = null;
      if (formData.place_name && (!formData.latitude || !formData.longitude)) {
        coordinates = await fetchCoordinatesForPlace(formData.place_name);
      }

      const submitData = new FormData();
      
      // Append all form data
      submitData.append('title', formData.title);
      submitData.append('place_name', formData.place_name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('rating', formData.rating.toString());
      submitData.append('date_of_visit', formData.date_of_visit);
      submitData.append('privacy', formData.privacy);
      
      // Handle tags - convert array to JSON string
      if (formData.tags && formData.tags.length > 0) {
        submitData.append('tags', JSON.stringify(formData.tags));
      } else {
        submitData.append('tags', JSON.stringify([]));
      }
      
      // Handle coordinates - use fetched ones if available, otherwise use existing
      const finalLatitude = coordinates ? coordinates.latitude : formData.latitude;
      const finalLongitude = coordinates ? coordinates.longitude : formData.longitude;
      
      if (finalLatitude) submitData.append('latitude', finalLatitude);
      if (finalLongitude) submitData.append('longitude', finalLongitude);
      
      // Handle file uploads
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      if (videoFile) {
        submitData.append('video', videoFile);
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key + ': ' + value);
      }

      const response = await axios.patch(
        `http://127.0.0.1:8004/TravelExperienceUpdateAPIView/${experienceId}/`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${isAuthenticated}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log('Experience updated:', response.data);
      alert('Experience updated successfully!');
      navabar(-1)
    } catch (error) {
      console.error('Error updating experience:', error);
      console.error('Error details:', error.response?.data);
      alert(`Error updating experience: ${error.response?.data?.detail || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-display flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-900">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-display">
      {/* Main Content */}
      <main className="w-full px-4 py-8">
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-gray-900 text-3xl sm:text-4xl font-black tracking-[-0.033em]">
              Update Your Experience
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Share your latest adventure with the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="title">
                  Title
                </label>
                <input
                  className="block w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="place_name">
                  Place Name
                </label>
                <div ref={placeInputRef}>
                  <input
                    className="block w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    id="place_name"
                    type="text"
                    value={formData.place_name}
                    onChange={handleInputChange}
                    placeholder="Start typing to see suggestions..."
                    required
                  />
                </div>
                
                {/* Place Suggestions Dropdown */}
                {showSuggestions && placeSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {placeSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => handlePlaceSuggestionClick(suggestion)}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {suggestion.display_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="category">
                  Category
                </label>
                <select
                  className="block w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Nature">Nature</option>
                  <option value="Historical">Historical</option>
                  <option value="Food">Food</option>
                  <option value="Relaxation">Relaxation</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="date_of_visit">
                  Date of Visit
                </label>
                <div className="relative">
                  <input
                    className="block w-full h-12 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    id="date_of_visit"
                    type="date"
                    value={formData.date_of_visit}
                    onChange={handleInputChange}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geolocation Display */}
            {(formData.latitude || formData.longitude) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-600">location_on</span>
                  <span className="text-sm font-medium text-blue-900">Location Coordinates</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Latitude:</span>
                    <span className="ml-2 text-blue-900">{formData.latitude}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Longitude:</span>
                    <span className="ml-2 text-blue-900">{formData.longitude}</span>
                  </div>
                </div>
                {fetchingLocation && (
                  <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Fetching location...
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="description">
                Description
              </label>
              <textarea
                className="block w-full p-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                id="description"
                rows="6"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <div className="mt-3 flex items-center gap-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <span className="material-symbols-outlined mr-1.5 text-base">sentiment_very_satisfied</span>
                  Positive Sentiment
                </span>
              </div>
            </div>

            {/* Media Uploads */}
            <div>
              <p className="block mb-2 text-sm font-medium text-gray-900">Media</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                      <p className="mb-2 text-sm text-center">
                        <span className="font-semibold">Click to upload an image</span>
                      </p>
                      {imageFile && (
                        <p className="text-xs text-blue-600 text-center">{imageFile.name}</p>
                      )}
                    </div>
                    <input 
                      className="hidden" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <span className="material-symbols-outlined text-4xl">video_call</span>
                      <p className="mb-2 text-sm text-center">
                        <span className="font-semibold">Click to upload a video</span>
                      </p>
                      {videoFile && (
                        <p className="text-xs text-blue-600 text-center">{videoFile.name}</p>
                      )}
                    </div>
                    <input 
                      className="hidden" 
                      type="file" 
                      accept="video/*"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>
              </div>
              
              {/* Current Media Display */}
              {formData.image && (
                <div className="mt-4">
                  <p className="block mb-2 text-sm font-medium text-gray-900">Current Image</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="relative group aspect-square">
                      <img 
                        className="object-cover w-full h-full rounded-lg border border-gray-200" 
                        src={`http://127.0.0.1:8004${formData.image}`}
                        alt={formData.title} 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <button 
                          type="button" 
                          className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                          onClick={handleDeleteImage}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="rating">
                  Rating: <span className="font-bold text-blue-600">{formData.rating}/5</span>
                </label>
                <input
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  id="rating"
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 p-3 bg-white">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {tag}
                      <button 
                        type="button" 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleTagRemove(tag)}
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <span className="text-gray-500 text-sm">No tags added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select Tag --</option>
                    <option value="beach">beach</option>
                    <option value="mountain">mountain</option>
                    <option value="forest">forest</option>
                    <option value="waterfall">waterfall</option>
                    <option value="island">island</option>
                    <option value="desert">desert</option>
                    <option value="lake">lake</option>
                    <option value="hiking">hiking</option>
                    <option value="camping">camping</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition duration-200 whitespace-nowrap"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button 
                type="button" 
                className="px-6 py-3 text-sm font-semibold rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCancel}
                disabled={updating}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updating}
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </span>
                ) : (
                  'Save Experience'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateExperience;