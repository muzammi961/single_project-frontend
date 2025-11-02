import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const TravelPlannerRestaurants = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
  // Get restaurants data from trip data - corrected structure
  const restaurantsData = calculateTripData?.restaurants || [];
  
  // Remove duplicates based on restaurant ID
  const uniqueRestaurants = restaurantsData.filter((restaurant, index, self) =>
    index === self.findIndex((r) => r.id === restaurant.id)
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

  // Function to get cuisine types from restaurant data
  const getCuisineTypes = (restaurant) => {
    if (restaurant.types && restaurant.types.length > 0) {
      return restaurant.types
        .filter(type => 
          type.includes('restaurant') || 
          type.includes('food') ||
          type.includes('cafe') ||
          type.includes('coffee') ||
          type.includes('tea') ||
          type === 'fast_food_restaurant' ||
          type === 'steak_house' ||
          type === 'pizza_restaurant' ||
          type === 'seafood_restaurant'
        )
        .map(type => {
          // Convert type to readable format
          const readableType = type
            .replace('_restaurant', '')
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return readableType || 'Dining';
        })
        .slice(0, 2); // Limit to 2 types
    }
    return ['Local Cuisine'];
  };

  // Function to determine if restaurant is open
  const getOpenStatus = (restaurant) => {
    if (restaurant.opening_hours) {
      if (restaurant.opening_hours.openNow !== undefined) {
        return restaurant.opening_hours.openNow ? 
          { status: 'Open Now', class: 'text-green-600 bg-green-100' } : 
          { status: 'Closed', class: 'text-red-600 bg-red-100' };
      }
      
      // Check next open time if available
      if (restaurant.opening_hours.nextOpenTime) {
        const nextOpen = new Date(restaurant.opening_hours.nextOpenTime);
        return { 
          status: `Opens at ${nextOpen.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`, 
          class: 'text-orange-600 bg-orange-100' 
        };
      }
    }
    return { status: 'Hours Unknown', class: 'text-gray-600 bg-gray-100' };
  };

  // Function to get price range based on rating and types
  const getPriceRange = (restaurant) => {
    if (restaurant.types?.includes('fine_dining_restaurant')) {
      return '₹₹₹₹';
    } else if (restaurant.types?.includes('cafe') || restaurant.types?.includes('coffee_shop')) {
      return '₹₹';
    } else if (restaurant.rating > 4) {
      return '₹₹₹';
    }
    return '₹₹';
  };

  // Get destination name for display
  const getDestinationName = () => {
    return calculateTripData?.destination?.name || 
           calculateTripData?.destination?.address?.split(',')[0] || 
           'Your Destination';
  };

  // Get address for display
  const getShortAddress = (address) => {
    if (!address) return 'Location not specified';
    const parts = address.split(',');
    return parts.slice(0, 2).join(',');
  };

  return (
    <div className="bg-white text-gray-900 font-display min-h-screen">
      <Navbar/>
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
              <span className="text-gray-800 text-sm font-medium leading-normal">Restaurants</span>
            </div>

            {/* PageHeading */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900">
                  Restaurants & Dining
                </h1>
                <p className="text-base font-normal leading-normal text-gray-600">
                  {uniqueRestaurants.length > 0 
                    ? `Discover ${uniqueRestaurants.length} unique places to eat in ${getDestinationName()}`
                    : 'Find the best places to eat in the city.'
                  }
                </p>
              </div>
              
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 h-12 rounded-lg bg-primary text-white text-base font-bold leading-normal tracking-tight min-w-[140px] transition-transform hover:scale-105 active:scale-100">
                <span className="material-symbols-outlined">restaurant</span>
                <span>Add Restaurant</span>
              </button>
            </div>

            {/* Stats Bar */}
            {uniqueRestaurants.length > 0 && (
              <div className="flex flex-wrap gap-6 px-4 py-4 mb-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">restaurant</span>
                  <span className="text-sm text-gray-600">
                    {uniqueRestaurants.length} restaurants found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">star</span>
                  <span className="text-sm text-gray-600">
                    Highest rated: {Math.max(...uniqueRestaurants.map(r => r.rating || 0)).toFixed(1)}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-sm text-gray-600">
                    Nearest: {uniqueRestaurants[0]?.distance_km} km
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
                      placeholder="Search restaurants by name, cuisine..." 
                    />
                  </div>
                </label>
              </div>
              
              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Cuisine</p>
                  <span className="material-symbols-outlined text-gray-500 text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium leading-normal text-gray-900">Price</p>
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
              </div>
            </div>

            {/* Restaurant Grid */}
            {uniqueRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {uniqueRestaurants.map((restaurant, index) => {
                  const cuisineTypes = getCuisineTypes(restaurant);
                  const openStatus = getOpenStatus(restaurant);
                  const priceRange = getPriceRange(restaurant);
                  const isTopRated = restaurant.rating >= 4.5;
                  const isHighlyRated = restaurant.rating >= 4.0;
                  
                  return (
                    <div 
                      key={restaurant.id || index} 
                      className={`group relative flex flex-col rounded-xl bg-white shadow-md ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
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
                      
                      {/* Restaurant Image */}
                      <div 
                        className="w-full h-48 bg-center bg-cover bg-gray-200 relative"
                        style={{
                          backgroundImage: restaurant.photo_url ? `url("${restaurant.photo_url}")` : 'none'
                        }}
                      >
                        {!restaurant.photo_url && (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <span className="material-symbols-outlined text-gray-400 text-4xl">
                              restaurant
                            </span>
                          </div>
                        )}
                        
                        {/* Price Range Badge */}
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                          {priceRange}
                        </div>
                        
                        {/* Distance Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold">
                          {restaurant.distance_km} km
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4 p-5">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 pr-2">
                              {restaurant.name}
                            </h3>
                            {isHighlyRated && !isTopRated && (
                              <span className="material-symbols-outlined text-amber-500 text-sm flex-shrink-0">
                                star
                              </span>
                            )}
                          </div>
                          
                          {/* Rating and Open Status */}
                          <div className="flex items-center justify-between mb-3">
                            {restaurant.rating > 0 ? (
                              renderStars(restaurant.rating)
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
                              {getShortAddress(restaurant.address)}
                            </p>
                          </div>
                          
                          {/* Cuisine Tags */}
                          <div className="flex flex-wrap gap-2">
                            {cuisineTypes.map((cuisine, idx) => (
                              <span 
                                key={idx} 
                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                              >
                                {cuisine}
                              </span>
                            ))}
                          </div>
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
                    restaurant
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Restaurants Found
                </h3>
                <p className="text-gray-600 max-w-md mb-6">
                  We couldn't find any restaurants in this area. Try adjusting your search criteria or check back later.
                </p>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined">refresh</span>
                  Try Again
                </button>
              </div>
            )}

            {/* Load More Button */}
            {uniqueRestaurants.length >= 12 && (
              <div className="flex justify-center mt-12">
                <button className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  <span>Load More Restaurants</span>
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

export default TravelPlannerRestaurants;