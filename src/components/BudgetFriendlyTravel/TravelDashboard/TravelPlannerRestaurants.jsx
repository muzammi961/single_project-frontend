import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const TravelPlannerRestaurants = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
  // Get restaurants data from trip data or use empty array as fallback
  const restaurantsData = calculateTripData?.restaurants || [];
  
  // Remove duplicates based on restaurant ID
  const uniqueRestaurants = restaurantsData.filter((restaurant, index, self) =>
    index === self.findIndex((r) => r.id === restaurant.id)
  );

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span 
            key={`full-${i}`} 
            className="material-symbols-outlined text-secondary text-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <span 
            className="material-symbols-outlined text-secondary text-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star_half
          </span>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span 
            key={`empty-${i}`} 
            className="material-symbols-outlined text-gray-300 text-lg"
          >
            star
          </span>
        ))}
        
        <span className="ml-1 text-sm text-text-light-secondary">
          {rating.toFixed(1)} ({Math.floor(rating * 100)} reviews)
        </span>
      </div>
    );
  };

  // Function to get cuisine types from restaurant data
  const getCuisineTypes = (restaurant) => {
    if (restaurant.types && restaurant.types.length > 0) {
      return restaurant.types
        .filter(type => 
          type.includes('restaurant') || 
          type.includes('food') ||
          type.includes('cafe') ||
          type === 'fast_food_restaurant'
        )
        .map(type => {
          // Convert type to readable format
          const readableType = type
            .replace('_restaurant', '')
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return readableType || 'Restaurant';
        })
        .slice(0, 2); // Limit to 2 types
    }
    return ['Local Cuisine'];
  };

  // Function to determine if restaurant is open
  const getOpenStatus = (restaurant) => {
    if (restaurant.opening_hours) {
      return restaurant.opening_hours.openNow ? 
        'Open Now' : 'Closed';
    }
    return 'Hours Unknown';
  };

  return (
    <div className="bg-white text-gray-900 font-display min-h-screen">
      <Navbar/>
      <div className="relative flex min-h-screen w-full">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* PageHeading */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Restaurants in {calculateTripData?.destination?.address?.split(',')[0] || 'Your Destination'}
                </h1>
                <p className="text-base font-normal leading-normal text-gray-600">
                  {uniqueRestaurants.length > 0 
                    ? `Discover ${uniqueRestaurants.length} unique places to eat in the area.`
                    : 'Find the best places to eat in the city.'
                  }
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* SearchBar */}
              <div className="flex-grow">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-gray-300 bg-white">
                    <div className="text-gray-500 flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 pl-2 text-base font-normal leading-normal" 
                      placeholder="Search restaurants by name..." 
                      value=""
                    />
                  </div>
                </label>
              </div>
              
              {/* Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Cuisine</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Price Range</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Rating</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
              </div>
            </div>

            {/* Restaurant Grid */}
            {uniqueRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {uniqueRestaurants.map((restaurant, index) => {
                  const cuisineTypes = getCuisineTypes(restaurant);
                  const isTopRated = restaurant.rating >= 4.5;
                  
                  return (
                    <div 
                      key={restaurant.id} 
                      className={`group relative flex flex-col items-stretch justify-start rounded-xl bg-white shadow-md ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        isTopRated ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                      }`}
                    >
                      {isTopRated && (
                        <div className="absolute top-0 right-0 z-10 -mt-3 -mr-3">
                          <div className="flex items-center gap-2 rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-white shadow-md">
                            <span className="material-symbols-outlined text-base">star</span>
                            <span>Top Rated</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Restaurant Image */}
                      <div 
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl bg-gray-200"
                        style={{
                          backgroundImage: restaurant.photo_url ? `url("${restaurant.photo_url}")` : 'none'
                        }}
                      >
                        {!restaurant.photo_url && (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-xl">
                            <span className="material-symbols-outlined text-gray-400 text-4xl">
                              restaurant
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                        <div>
                          <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-900">
                            {restaurant.name}
                          </h3>
                          
                          {/* Rating */}
                          {restaurant.rating > 0 ? (
                            renderStars(restaurant.rating)
                          ) : (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm text-gray-600">No ratings yet</span>
                            </div>
                          )}
                          
                          {/* Open Status & Distance */}
                          <p className="text-sm font-normal leading-normal text-gray-600 mt-2">
                            {getOpenStatus(restaurant)} • {restaurant.distance_km?.toFixed(1) || 'N/A'} km away
                          </p>
                          
                          {/* Cuisine Tags */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {cuisineTypes.map((cuisine, idx) => (
                              <span 
                                key={idx} 
                                className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800"
                              >
                                {cuisine}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-medium leading-normal transition-colors hover:bg-blue-700">
                          <span className="truncate">View Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-4xl">
                    restaurant
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Restaurants Found
                </h3>
                <p className="text-gray-600 max-w-md">
                  We couldn't find any restaurants in this area. Try adjusting your filters or search for a different location.
                </p>
              </div>
            )}

            {/* Pagination */}
            {uniqueRestaurants.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium leading-normal text-gray-900 shadow-sm transition-colors hover:bg-gray-50">
                  Load More
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TravelPlannerRestaurants;