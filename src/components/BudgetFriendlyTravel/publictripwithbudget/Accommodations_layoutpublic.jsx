import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PublicTripNavbar from './PublicTripNavbar'

const Accommodationslayoutpublic = () => {
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

  // Get accommodations data from the trip data
  const accommodations = tripData?.accommodations || [];

  const renderStars = (rating, totalStars = 5) => {
    if (!rating || rating === 0) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={`star-${i}`}
          className="material-symbols-outlined text-amber-500 text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span
          key="half-star"
          className="material-symbols-outlined text-amber-500 text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star_half
        </span>
      );
    }

    const emptyStars = totalStars - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span
          key={`empty-star-${i}`}
          className="material-symbols-outlined text-gray-300 text-sm"
        >
          star
        </span>
      );
    }

    return stars;
  };

  // Function to get accommodation type from types array
  const getAccommodationType = (types) => {
    if (!types || !Array.isArray(types)) return 'Accommodation';
    if (types.includes('hotel')) return 'Hotel';
    if (types.includes('hostel')) return 'Hostel';
    if (types.includes('lodging')) return 'Lodging';
    if (types.includes('guest_house')) return 'Guest House';
    if (types.includes('resort')) return 'Resort';
    return 'Accommodation';
  };

  // Function to check if accommodation is open
  const isOpenNow = (openingHours) => {
    if (!openingHours) return null;
    return openingHours.openNow;
  };

  // Function to get next opening time
  const getNextOpenTime = (openingHours) => {
    if (!openingHours || !openingHours.nextOpenTime) return null;
    const nextOpen = new Date(openingHours.nextOpenTime);
    return nextOpen.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format distance with better precision
  const formatDistance = (distance) => {
    if (!distance) return 'Distance not available';
    return `${distance} km away`;
  };

  // Get destination name for breadcrumb
  const getDestinationName = () => {
    return tripData?.destination?.name || 
           tripData?.destination?.address || 
           'Your Destination';
  };

  // Loading state
  if (loading) {
    return (
      <div className="font-display bg-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <main className="px-4 sm:px-6 lg:px-10 flex-1 py-8">
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading accommodations...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="font-display bg-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <main className="px-4 sm:px-6 lg:px-10 flex-1 py-8">
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
                    error
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                    Try Again
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-white min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* TopNavBar */}
          <PublicTripNavbar/>
          <main className="px-4 sm:px-6 lg:px-10 flex-1 py-8">
            <div className="layout-content-container flex flex-col max-w-7xl mx-auto flex-1">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 px-4 pb-6">
                <a className="text-gray-500 hover:text-primary text-sm font-medium leading-normal" href="#">
                  Trip to {getDestinationName()}
                </a>
                <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-800 text-sm font-medium leading-normal">Accommodations</span>
              </div>

              {/* PageHeading */}
              <div className="flex flex-wrap justify-between gap-4 p-4 items-center">
                <div className="flex min-w-72 flex-col gap-2">
                  <h1 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                    Places to Stay
                  </h1>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    {accommodations.length > 0 
                      ? `Found ${accommodations.length} accommodations near ${getDestinationName()}`
                      : 'Searching for accommodations...'
                    }
                  </p>
                </div>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 h-12 overflow-hidden rounded-lg bg-primary text-white text-base font-bold leading-normal tracking-tight min-w-[120px] transition-transform hover:scale-105 active:scale-100">
                  <span className="material-symbols-outlined text-lg">hotel</span>
                  <span>Add Stay</span>
                </button>
              </div>

              {/* Stats Bar */}
              {accommodations.length > 0 && (
                <div className="flex flex-wrap gap-6 px-4 py-4 mb-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">hotel</span>
                    <span className="text-sm text-gray-600">
                      {accommodations.length} places found
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="text-sm text-gray-600">
                      Nearest: {accommodations[0]?.distance_km} km
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">star</span>
                    <span className="text-sm text-gray-600">
                      Highest rated: {Math.max(...accommodations.map(acc => acc.rating || 0))}/5
                    </span>
                  </div>
                </div>
              )}

              {/* Accommodations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
                {accommodations.length > 0 ? (
                  accommodations.map((accommodation, index) => {
                    const isOpen = isOpenNow(accommodation.opening_hours);
                    const nextOpenTime = getNextOpenTime(accommodation.opening_hours);
                    const accommodationType = getAccommodationType(accommodation.types);
                    
                    return (
                      <div
                        key={accommodation.id || index}
                        className="flex flex-col bg-white rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-200"
                      >
                        {/* Accommodation Image */}
                        <div 
                          className="h-48 bg-cover bg-center relative" 
                          style={{ 
                            backgroundImage: accommodation.photo_url 
                              ? `url('${accommodation.photo_url}')` 
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        >
                          {!accommodation.photo_url && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-4xl">
                                hotel
                              </span>
                            </div>
                          )}
                          
                          {/* Rating Badge */}
                          {accommodation.rating > 0 && (
                            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-amber-400 text-sm">
                                star
                              </span>
                              <span className="text-sm font-semibold">{accommodation.rating}</span>
                            </div>
                          )}
                          
                          {/* Distance Badge */}
                          <div className="absolute top-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full">
                            <span className="text-sm font-semibold">{accommodation.distance_km} km</span>
                          </div>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1">
                              {accommodation.name}
                            </h3>
                          </div>
                          
                          {/* Type and Status */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                              {accommodationType}
                            </span>
                            {isOpen !== null && (
                              <span className={`text-sm font-medium px-2 py-1 rounded ${
                                isOpen 
                                  ? 'text-green-800 bg-green-100' 
                                  : 'text-orange-800 bg-orange-100'
                              }`}>
                                {isOpen ? 'Open Now' : `Opens at ${nextOpenTime}`}
                              </span>
                            )}
                          </div>
                          
                          {/* Rating Stars */}
                          {accommodation.rating > 0 && (
                            <div className="flex items-center mb-3">
                              {renderStars(accommodation.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                ({accommodation.rating})
                              </span>
                            </div>
                          )}
                          
                          {/* Location */}
                          <div className="flex items-start gap-2 mb-3">
                            <span className="material-symbols-outlined text-gray-400 text-sm mt-0.5">
                              location_on
                            </span>
                            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                              {accommodation.address}
                            </p>
                          </div>
                          
                          {/* Additional Info */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">
                                distance
                              </span>
                              <span>{formatDistance(accommodation.distance_km)}</span>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <button
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 h-auto overflow-hidden rounded-lg bg-primary text-white text-base font-bold leading-normal tracking-tight transition-transform hover:scale-105 active:scale-100"
                            >
                              <span className="material-symbols-outlined text-lg">
                                hotel
                              </span>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Empty State
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                      hotel
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Accommodations Found
                    </h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      We couldn't find any accommodations for your trip. Try adjusting your search criteria or check back later.
                    </p>
                    <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold">
                      <span className="material-symbols-outlined">refresh</span>
                      Try Again
                    </button>
                  </div>
                )}
              </div>

              {/* Load More Button for many results */}
              {accommodations.length >= 10 && (
                <div className="flex justify-center mt-8 px-4">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    <span>Load More</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Accommodationslayoutpublic;