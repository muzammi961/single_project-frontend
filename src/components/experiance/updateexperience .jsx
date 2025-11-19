import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateExperience = () => {
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
    longitude: ''
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const experienceId = 1; // You can make this dynamic based on route params

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
          longitude: data.longitude || ''
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to update experience');
      return;
    }

    try {
      setUpdating(true);
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('place_name', formData.place_name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('rating', formData.rating.toString());
      submitData.append('date_of_visit', formData.date_of_visit);
      submitData.append('privacy', formData.privacy);
      submitData.append('tags', JSON.stringify(formData.tags));
      
      if (formData.latitude) submitData.append('latitude', formData.latitude);
      if (formData.longitude) submitData.append('longitude', formData.longitude);
      if (imageFile) submitData.append('image', imageFile);
      if (videoFile) submitData.append('video', videoFile);

      const response = await axios.put(
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
      
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Error updating experience');
    } finally {
      setUpdating(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      case 'neutral': return 'neutral';
      default: return 'positive';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-primary-light dark:text-text-primary-dark">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
  
      {/* Main Content */}
      <main className="w-full px-4 py-8">
        <div className="w-full bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl sm:text-4xl font-black tracking-[-0.033em]">
              Update Your Experience
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base mt-2">
              Share your latest adventure with the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label" htmlFor="title">Title</label>
                <input
                  className="form-input h-12 px-4"
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="place_name">Place Name</label>
                <input
                  className="form-input h-12 px-4"
                  id="place_name"
                  type="text"
                  value={formData.place_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="category">Category</label>
                <select
                  className="form-input h-12 px-4"
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
                <label className="form-label" htmlFor="date_of_visit">Date of Visit</label>
                <div className="relative">
                  <input
                    className="form-input h-12 px-4 pr-10"
                    id="date_of_visit"
                    type="date"
                    value={formData.date_of_visit}
                    onChange={handleInputChange}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                className="form-input p-4"
                id="description"
                rows="6"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <div className="mt-3 flex items-center gap-4">
                <span className={`inline-flex items-center rounded-full bg-${getSentimentColor('Positive')}/10 px-3 py-1 text-sm font-medium text-${getSentimentColor('Positive')}`}>
                  <span className="material-symbols-outlined mr-1.5 text-base">sentiment_very_satisfied</span>
                  Positive Sentiment
                </span>
              </div>
            </div>

            {/* Media Uploads */}
            <div>
              <p className="form-label">Media</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border-light dark:border-border-dark border-dashed rounded-lg cursor-pointer bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-secondary-light dark:text-text-secondary-dark">
                      <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                      <p className="mb-2 text-sm"><span className="font-semibold">Click to upload an image</span></p>
                      {imageFile && <p className="text-xs text-primary">{imageFile.name}</p>}
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
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border-light dark:border-border-dark border-dashed rounded-lg cursor-pointer bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-secondary-light dark:text-text-secondary-dark">
                      <span className="material-symbols-outlined text-4xl">video_call</span>
                      <p className="mb-2 text-sm"><span className="font-semibold">Click to upload a video</span></p>
                      {videoFile && <p className="text-xs text-primary">{videoFile.name}</p>}
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
                  <p className="form-label mb-2">Current Image</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="relative group aspect-square">
                      <img 
                        className="object-cover w-full h-full rounded-lg" 
                        src={`http://127.0.0.1:8004${formData.image}`}
                        alt={formData.title} 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <button type="button" className="text-white">
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
                <label className="form-label" htmlFor="rating">
                  Rating: <span className="font-bold text-primary">{formData.rating}/5</span>
                </label>
                <input
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-accent"
                  id="rating"
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="privacy">Privacy</label>
                <select
                  className="form-input h-12 px-4"
                  id="privacy"
                  value={formData.privacy}
                  onChange={handleInputChange}
                >
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="form-label" htmlFor="tags">Tags</label>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                    {tag}
                    <button 
                      type="button" 
                      className="text-primary/70 hover:text-primary"
                      onClick={() => handleTagRemove(tag)}
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                    </button>
                  </span>
                ))}
                <input
                  className="flex-grow bg-transparent border-0 focus:ring-0 text-sm p-1 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark"
                  placeholder="Add a tag..."
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleTagAdd}
                />
              </div>
            </div>

            {/* Geolocation */}
            <div>
              <p className="form-label">Geolocation (Optional)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="sr-only" htmlFor="latitude">Latitude</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary-light dark:text-text-secondary-dark">
                      <span className="material-symbols-outlined">public</span>
                    </div>
                    <input
                      className="form-input h-12 pl-10 pr-4"
                      id="latitude"
                      placeholder="Latitude"
                      type="text"
                      value={formData.latitude}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="sr-only" htmlFor="longitude">Longitude</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary-light dark:text-text-secondary-dark">
                      <span className="material-symbols-outlined">public</span>
                    </div>
                    <input
                      className="form-input h-12 pl-10 pr-4"
                      id="longitude"
                      placeholder="Longitude"
                      type="text"
                      value={formData.longitude}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-4">
              <button 
                type="button" 
                className="px-6 py-2.5 text-sm font-semibold rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={updating}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 text-sm font-semibold rounded-lg text-black bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Save Experience'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateExperience;