import React from 'react';
import '../stylecomponent/backbutton.css'
import { useSelector } from 'react-redux';
import { MapPin, Calendar, User, Tag, Star, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserExperienceside() {
  const navigate=useNavigate()  
  const experience = useSelector(state => state.app.userexperience);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return null;
    const baseUrl = 'http://127.0.0.1:8004';
    return `${baseUrl}${mediaPath}`;
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black text-xl">No experience to display</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">


{/* <h1 className="text-4xl font-bold text-black mb-8">Travel Experience</h1> */}





<div className="relative flex items-center w-full mb-8">
  {/* Button on the left */}
  <div className="absolute left-0">
    <button className="button" onClick={()=>navigate(-1)}>
        
      <div className="button-box">
        <span className="button-elem">
          <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
          </svg>
        </span>
        <span className="button-elem">
          <svg viewBox="0 0 46 40">
            <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
          </svg>
        </span>
      </div>
    </button>
  </div>

  {/* Heading centered */}
  <h1 className="mx-auto text-4xl font-bold text-black">Travel Experience</h1>
</div>


      <div className="max-w-6xl mx-auto">
        
        
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
          {/* Media Section - Show image OR video */}
          {(experience.image || experience.video) && (
            <div className="w-full h-96 bg-gray-100">
              {experience.video ? (
                <video
                  src={getMediaUrl(experience.video)}
                  controls
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              ) : experience.image ? (
                <img
                  src={getMediaUrl(experience.image)}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                  }}
                />
              ) : null}
            </div>
          )}

          {/* Content Section */}
          <div className="p-2">
            {/* Header with Rating */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black mb-2">
                  {experience.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-black font-medium text-sm">
                    {experience.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-black text-sm flex items-center gap-1">
                    {experience.privacy === 'PUBLIC' ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {experience.privacy}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    experience.sentiment === 'Positive' 
                      ? 'bg-green-100 text-green-800' 
                      : experience.sentiment === 'Negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {experience.sentiment}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-4">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-black">{experience.rating}</span>
              </div>
            </div>

            {/* Location, Date, User Info */}
            <div className="flex flex-wrap gap-4 text-black mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{experience.place_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span>{formatDate(experience.date_of_visit)}</span>
              </div>
              
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-black leading-relaxed text-base">
                {experience.description}
              </p>
            </div>

            {/* Tags */}
            {experience.tags && experience.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Tag className="w-4 h-4 text-gray-600" />
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-black rounded-full text-sm border border-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

      
            <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="font-medium text-black">Created:</span> {formatDate(experience.created_at)}
                </div>
                <div>
                  <span className="font-medium text-black">Updated:</span> {formatDate(experience.updated_at)}
                </div>
                {experience.latitude && experience.longitude && (
                  <div>
                    <span className="font-medium text-black">Coordinates:</span> {experience.latitude}, {experience.longitude}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}