import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import INvateTripNavbar from './invatetripNavbar'
const Attractionslayoutinvate = () => {
  const { invatetripid } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8006/TripSpecificAPIViewWithoutuserIdPublicorinvateonly/${invatetripid}`);
        const data = await response.json();
        setTripData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trip data');
        setLoading(false);
      }
    };

    if (invatetripid) {
      fetchTripData();
    }
  }, [invatetripid]);

  // Get attractions data from trip data
  const attractionsData = tripData?.attractions || [];

  // Remove duplicates based on attraction ID
  const uniqueAttractions = attractionsData.filter((attraction, index, self) =>
    index === self.findIndex((a) => a.id === attraction.id)
  );

  // Function to render star ratings
  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span 
            key={`full-${i}`} 
            className="material-symbols-outlined text-amber-500 text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <span 
            className="material-symbols-outlined text-amber-500 text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star_half
          </span>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span 
            key={`empty-${i}`} 
            className="material-symbols-outlined text-gray-300 text-base"
          >
            star
          </span>
        ))}
        
        <span className="ml-1 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Function to get attraction type from types array
  const getAttractionType = (types) => {
    if (!types || !Array.isArray(types)) return 'Attraction';
    
    if (types.includes('park')) return 'Park';
    if (types.includes('museum')) return 'Museum';
    if (types.includes('shopping_mall')) return 'Shopping';
    if (types.includes('amusement_park')) return 'Amusement Park';
    if (types.includes('tourist_attraction')) return 'Tourist Attraction';
    if (types.includes('natural_feature')) return 'Natural Feature';
    if (types.includes('zoo')) return 'Zoo';
    if (types.includes('aquarium')) return 'Aquarium';
    if (types.includes('art_gallery')) return 'Art Gallery';
    if (types.includes('church') || types.includes('hindu_temple') || types.includes('mosque')) return 'Religious Site';
    if (types.includes('historical_place')) return 'Historical Place';
    if (types.includes('garden')) return 'Garden';
    if (types.includes('sculpture')) return 'Sculpture';
    
    return 'Attraction';
  };

  // Function to get type color
  const getTypeColorClasses = (type) => {
    const colorMap = {
      'Park': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'Museum': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'Shopping': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'Amusement Park': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
      'Tourist Attraction': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      'Natural Feature': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      'Zoo': 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300',
      'Aquarium': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
      'Art Gallery': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
      'Religious Site': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      'Historical Place': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
      'Garden': 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
      'Sculpture': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  };

  // Function to determine if attraction is open
  const getOpenStatus = (attraction) => {
    if (attraction.opening_hours) {
      if (attraction.opening_hours.openNow !== undefined) {
        return attraction.opening_hours.openNow ? 
          { status: 'Open Now', class: 'text-green-600 bg-green-100 dark:bg-green-900/50' } : 
          { status: 'Closed', class: 'text-red-600 bg-red-100 dark:bg-red-900/50' };
      }
      
      // Check next open time if available
      if (attraction.opening_hours.nextOpenTime) {
        const nextOpen = new Date(attraction.opening_hours.nextOpenTime);
        return { 
          status: `Opens at ${nextOpen.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`, 
          class: 'text-orange-600 bg-orange-100 dark:bg-orange-900/50' 
        };
      }
    }
    return { status: 'Hours Unknown', class: 'text-gray-600 bg-gray-100 dark:bg-gray-900/50' };
  };

  // Get destination name for display
  const getDestinationName = () => {
    return tripData?.destination?.name || 
           tripData?.destination?.address?.split(',')[0] || 
           'Your Destination';
  };

  // Get short address for display
  const getShortAddress = (address) => {
    if (!address) return 'Location not specified';
    const parts = address.split(',');
    return parts.slice(0, 2).join(',');
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white text-gray-900 font-display min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attractions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white text-gray-900 font-display min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
              error
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">refresh</span>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No trip data state
  if (!tripData) {
    return (
      <div className="bg-white text-gray-900 font-display min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-gray-400 text-4xl">
                explore
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trip Found</h3>
            <p className="text-gray-600 max-w-md mb-6">
              We couldn't find the trip you're looking for. Please check the link and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 font-display min-h-screen">
      <INvateTripNavbar/>
      <div className="relative flex min-h-screen w-full">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 px-4 pb-6">
              <a className="text-gray-500 hover:text-primary text-sm font-medium leading-normal" href="#">
                Trip to {getDestinationName()}
              </a>
              <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
              <span className="text-gray-800 text-sm font-medium leading-normal">Attractions</span>
            </div>

            {/* PageHeading */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900">
                  Explore Attractions
                </h1>
                <p className="text-base font-normal leading-normal text-gray-600">
                  {uniqueAttractions.length > 0 
                    ? `Discover ${uniqueAttractions.length} amazing places in ${getDestinationName()}`
                    : 'Find the best attractions and activities in the area.'
                  }
                </p>
              </div>
              
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 h-12 rounded-lg bg-primary text-white text-base font-bold leading-normal tracking-tight min-w-[140px] transition-transform hover:scale-105 active:scale-100">
                <span className="material-symbols-outlined">explore</span>
                <span>Add to Trip</span>
              </button>
            </div>

            {/* Stats Bar */}
            {uniqueAttractions.length > 0 && (
              <div className="flex flex-wrap gap-6 px-4 py-4 mb-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">explore</span>
                  <span className="text-sm text-gray-600">
                    {uniqueAttractions.length} attractions found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">star</span>
                  <span className="text-sm text-gray-600">
                    Highest rated: {Math.max(...uniqueAttractions.map(a => a.rating || 0)).toFixed(1)}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-sm text-gray-600">
                    Nearest: {uniqueAttractions[0]?.distance_km} km
                  </span>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4">
              {/* SearchBar */}
              <div className="flex-grow">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                    <div className="text-gray-500 flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input 
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 focus:outline-0 bg-transparent h-full placeholder:text-gray-500 pl-2 text-base font-normal leading-normal" 
                      placeholder="Search attractions by name, type..." 
                    />
                  </div>
                </label>
              </div>
              
              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Type</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Rating</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Distance</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Open Now</p>
                </button>
              </div>
            </div>

            {/* Attractions Grid */}
            {uniqueAttractions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {uniqueAttractions.map((attraction, index) => {
                  const attractionType = getAttractionType(attraction.types);
                  const openStatus = getOpenStatus(attraction);
                  const isTopRated = attraction.rating >= 4.5;
                  const isHighlyRated = attraction.rating >= 4.0;
                  
                  return (
                    <div 
                      key={attraction.id || index} 
                      className={`flex flex-col rounded-xl bg-white shadow-md ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
                        isTopRated ? 'ring-2 ring-amber-400 shadow-lg' : ''
                      }`}
                    >
                      {isTopRated && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                            <span className="material-symbols-outlined text-sm">star</span>
                            <span>Top Rated</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Attraction Image */}
                      <div 
                        className="w-full h-48 bg-center bg-cover bg-gray-200 relative"
                        style={{
                          backgroundImage: attraction.photo_url ? `url("${attraction.photo_url}")` : 'none'
                        }}
                      >
                        {!attraction.photo_url && (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <span className="material-symbols-outlined text-gray-400 text-4xl">
                              landscape
                            </span>
                          </div>
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTypeColorClasses(attractionType)}`}>
                            {attractionType}
                          </span>
                        </div>
                        
                        {/* Distance Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold">
                          {attraction.distance_km} km
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4 p-5">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 pr-2">
                              {attraction.name}
                            </h3>
                            {isHighlyRated && !isTopRated && (
                              <span className="material-symbols-outlined text-amber-500 text-sm flex-shrink-0">
                                star
                              </span>
                            )}
                          </div>
                          
                          {/* Rating and Open Status */}
                          <div className="flex items-center justify-between mb-3">
                            {attraction.rating > 0 ? (
                              renderStars(attraction.rating)
                            ) : (
                              <span className="text-sm text-gray-600">No ratings</span>
                            )}
                            
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${openStatus.class}`}>
                              {openStatus.status}
                            </span>
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-start gap-2 mb-3">
                            <span className="material-symbols-outlined text-gray-400 text-sm mt-0.5">
                              location_on
                            </span>
                            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                              {getShortAddress(attraction.address)}
                            </p>
                          </div>
                          
                          {/* Additional Info */}
                          {attraction.opening_hours?.weekdayDescriptions && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              {attraction.opening_hours.weekdayDescriptions[0]}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Button */}
                        <button className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-medium leading-normal transition-all hover:bg-primary/90 hover:scale-105 active:scale-100">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                          <span className="truncate">View Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-gray-400 text-4xl">
                    explore
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Attractions Found
                </h3>
                <p className="text-gray-600 max-w-md mb-6">
                  We couldn't find any attractions in this area. Try adjusting your search criteria or check back later.
                </p>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined">refresh</span>
                  Try Again
                </button>
              </div>
            )}

            {/* Load More Button */}
            {uniqueAttractions.length >= 15 && (
              <div className="flex justify-center mt-12">
                <button className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  <span>Load More Attractions</span>
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Attractionslayoutinvate;