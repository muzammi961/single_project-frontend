import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const Accommodations = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
  // Get accommodations data from the trip data
  const accommodations = calculateTripData?.accommodations || [];

  const renderStars = (rating, totalStars = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={`star-${i}`}
          className="material-symbols-outlined text-amber-500"
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
          className="material-symbols-outlined text-gray-300"
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
          className="material-symbols-outlined text-gray-300"
        >
          star
        </span>
      );
    }

    return stars;
  };

  // Function to get accommodation type from types array
  const getAccommodationType = (types) => {
    if (types.includes('hotel')) return 'Hotel';
    if (types.includes('hostel')) return 'Hostel';
    if (types.includes('lodging')) return 'Lodging';
    return 'Accommodation';
  };

  // Function to check if accommodation is featured (nearest)
  const isFeatured = (accommodation, index) => {
    return index === 0; // First accommodation is featured as nearest
  };

  return (
    <div className="font-display bg-white">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* TopNavBar */}
          <Navbar/>

          <main className="px-4 sm:px-6 lg:px-10 flex-1 py-8">
            <div className="layout-content-container flex flex-col max-w-7xl mx-auto flex-1">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                <a className="text-gray-500 hover:text-primary text-sm font-medium leading-normal" href="#">
                  Trip to {calculateTripData?.destination?.address || 'Destination'}
                </a>
                <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-800 text-sm font-medium leading-normal">Accommodations</span>
              </div>

              {/* PageHeading */}
              <div className="flex flex-wrap justify-between gap-4 p-4 items-center">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                    Accommodations for Your Trip
                  </p>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    {accommodations.length > 0 
                      ? `Found ${accommodations.length} places to stay near your destination`
                      : 'Searching for accommodations...'
                    }
                  </p>
                </div>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 h-12 overflow-hidden rounded-lg bg-primary text-white text-base font-bold leading-normal tracking-tight min-w-[120px] transition-transform hover:scale-105 active:scale-100">
                  <span className="material-symbols-outlined">add</span>
                  <span>Add Stay</span>
                </button>
              </div>

              {/* Search and Filter Bar
              <div className="flex flex-col md:flex-row gap-4 px-4 py-5 border-y border-gray-200 my-6">
                <div className="flex-grow">
                  <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                      <div className="text-gray-500 flex border border-gray-200 bg-white items-center justify-center pl-4 rounded-l-lg border-r-0">
                        <span className="material-symbols-outlined text-2xl">search</span>
                      </div>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-opacity-50 border border-gray-200 bg-white h-full placeholder:text-gray-500 px-4 border-l-0 text-base font-normal leading-normal" 
                        placeholder="Search by name or address..." 
                        defaultValue=""
                      />
                    </div>
                  </label>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 px-4 transition-colors hover:bg-gray-100">
                    <p className="text-gray-800 text-sm font-medium leading-normal">Type</p>
                    <span className="material-symbols-outlined text-gray-600 text-xl">expand_more</span>
                  </button>
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 px-4 transition-colors hover:bg-gray-100">
                    <p className="text-gray-800 text-sm font-medium leading-normal">Rating</p>
                    <span className="material-symbols-outlined text-gray-600 text-xl">expand_more</span>
                  </button>
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 px-4 transition-colors hover:bg-gray-100">
                    <p className="text-gray-800 text-sm font-medium leading-normal">Distance</p>
                    <span className="material-symbols-outlined text-gray-600 text-xl">expand_more</span>
                  </button>
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 px-4 transition-colors hover:bg-gray-100">
                    <p className="text-gray-800 text-sm font-medium leading-normal">Sort By</p>
                    <span className="material-symbols-outlined text-gray-600 text-xl">expand_more</span>
                  </button>
                </div>
              </div> */}

              {/* Accommodations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
                {accommodations.length > 0 ? (
                  accommodations.map((accommodation, index) => (
                    <div
                      key={accommodation.id || index}
                      className={`flex flex-col bg-white rounded-xl overflow-hidden transition-transform hover:-translate-y-1 relative ${
                        isFeatured(accommodation, index)
                          ? 'border-2 border-primary shadow-lg' 
                          : 'border border-gray-200 shadow-md'
                      }`}
                    >
                      {isFeatured(accommodation, index) && (
                        <div className="absolute top-3 right-3 bg-primary/20 text-primary text-xs font-bold py-1 px-3 rounded-full z-10">
                          Nearest
                        </div>
                      )}
                      
                      {/* Accommodation Image */}
                      <div 
                        className="h-48 bg-cover bg-center relative" 
                        data-alt={`Exterior view of ${accommodation.name}`}
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
                      </div>
                      
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                          {accommodation.name}
                        </h3>
                        
                        {/* Rating and Stars */}
                        <div className="flex items-center my-2">
                          {accommodation.rating > 0 ? (
                            <>
                              {renderStars(accommodation.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                ({accommodation.rating})
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No ratings yet
                            </span>
                          )}
                        </div>
                        
                        {/* Location and Distance */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {accommodation.address}
                        </p>
                        <p className="text-sm text-primary font-medium mb-3">
                          {accommodation.distance_km} km away
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              isFeatured(accommodation, index)
                                ? 'bg-primary/20 text-primary'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {getAccommodationType(accommodation.types)}
                          </span>
                          {accommodation.opening_hours?.openNow && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                              Open Now
                            </span>
                          )}
                        </div>
                        
                        {/* Action Button */}
                        <div className="mt-auto pt-4">
                          <button
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 h-auto overflow-hidden rounded-lg text-base font-bold leading-normal tracking-tight transition-transform ${
                              isFeatured(accommodation, index)
                                ? 'bg-primary text-white hover:scale-105 active:scale-100'
                                : 'bg-primary/20 text-primary hover:bg-primary/30'
                            }`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              hotel
                            </span>
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty State
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                      hotel
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Accommodations Found
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      We couldn't find any accommodations for your trip. Try adjusting your search criteria or check back later.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Accommodations;