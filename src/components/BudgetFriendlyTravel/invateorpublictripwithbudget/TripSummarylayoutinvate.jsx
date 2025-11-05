import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import INvateTripNavbar from './invatetripNavbar'
const TripSummarylayoutinvate = () => {
  const { invatetripid } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use Redux data if available, otherwise use API data
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate) || tripData;

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8006/TripSpecificAPIViewWithoutuserIdPublicorinvateonly/${invatetripid}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trip data');
        }
        
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

  // Check if data exists
  if (loading) {
    return (
      <div className="font-display bg-white text-black min-h-screen">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Loading trip data...</p>
        </div>
      </div>
    );
  }

  if (error || !calculateTripData) {
    return (
      <div className="font-display bg-white text-black min-h-screen">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-red-600">{error || 'No trip data available'}</p>
        </div>
      </div>
    );
  }

  const {
    summary,
    travel_plan,
    daily_budgets,
    divided_budget,
    accommodations,
    restaurants,
    attractions,
    destination,
    return_destination,
    origin,
    daily_itineraries,
    travel_mode,
    budget_category
  } = calculateTripData;

  // Calculate totals from actual data
  const totalDays = summary?.trip_duration_days || daily_itineraries?.length || 0;
  const totalTravelCost = travel_plan?.total_travel_cost || summary?.total_travel_cost || 0;
  const totalActivities = attractions?.length || 0;
  const totalAccommodations = accommodations?.length || 0;
  const totalRestaurants = restaurants?.length || 0;
  
  // Calculate budget usage based on divided_budget
  const totalSpent = (divided_budget?.travel || 0) + 
                    (divided_budget?.hotel || 0) + 
                    (divided_budget?.food || 0) + 
                    (divided_budget?.activities || 0);
  
  const totalBudget = summary?.total_budget || totalSpent;
  const remainingBudget = totalBudget - totalSpent;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₹0';
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  // Get vehicle display name
  const getVehicleName = (mode) => {
    const vehicleMap = {
      'bike': 'Motorcycle',
      'car': 'Car',
      'bus': 'Bus'
    };
    return vehicleMap[mode] || 'Vehicle';
  };

  // Calculate scheduled activities from itineraries
  const totalScheduledActivities = daily_itineraries?.reduce((total, day) => {
    return total + (day.total_activities || 0);
  }, 0) || 0;

  // Get region display name
  const getRegionName = (region) => {
    if (!region) return 'Unknown';
    return region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
  };

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <INvateTripNavbar/>
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5 md:py-10">
            <div className="layout-content-container flex flex-col max-w-7xl flex-1">
              
              {/* Page Heading */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div>
                  <p className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Trip Summary</p>
                  <p className="text-gray-600 mt-2">
                    {destination?.name || 'Destination'} • {totalDays} Days • {budget_category?.charAt(0).toUpperCase() + budget_category?.slice(1)} Budget
                  </p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
                
                {/* Left Column (Span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Trip Overview Card */}
                  <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[4/1] bg-cover rounded-t-xl"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      <div className="h-full flex items-center justify-center text-white bg-black bg-opacity-30 rounded-t-xl">
                        <div className="text-center">
                          <h1 className="text-2xl md:text-3xl font-bold">{destination?.name || 'Your Trip'}</h1>
                          <p className="text-lg opacity-90">{totalDays} Day Adventure</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-3 p-6">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-gray-600 text-sm font-normal leading-normal mb-1">
                            {summary?.trip_type?.replace(/_/g, ' ') || 'Round Trip'} • {summary?.different_return_route ? 'Different Routes' : 'Same Route'}
                          </p>
                          <p className="text-xl font-bold leading-tight">
                            {destination?.address || 'Destination'}
                          </p>
                          {return_destination && (
                            <p className="text-sm text-gray-600 mt-1">
                              Return via: {return_destination.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-blue-600">calendar_month</span>
                              <span className="text-lg font-bold">{totalDays} Days</span>
                            </div>
                            <p className="text-xs text-gray-600">Duration</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-green-600">payments</span>
                              <span className="text-lg font-bold">{formatCurrency(totalBudget)}</span>
                            </div>
                            <p className="text-xs text-gray-600">Total Budget</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Regions Info */}
                      <div className="flex flex-wrap gap-4 mt-2">
                        {origin && (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-600 text-sm">location_on</span>
                            <span className="text-sm">
                              From: <span className="font-medium">{getRegionName(summary?.geographical_regions?.origin_region)}</span>
                            </span>
                          </div>
                        )}
                        {destination && (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-sm">flag</span>
                            <span className="text-sm">
                              To: <span className="font-medium">{getRegionName(destination.region)}</span>
                            </span>
                          </div>
                        )}
                        {return_destination && (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-600 text-sm">swap_horiz</span>
                            <span className="text-sm">
                              Return via: <span className="font-medium">{getRegionName(return_destination.region)}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Travel Details Card */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Travel Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                      {[
                        { 
                          icon: 'directions_bike', 
                          label: 'Travel Mode', 
                          value: getVehicleName(travel_mode) 
                        },
                        { 
                          icon: 'multiple_stop', 
                          label: 'Going Distance', 
                          value: `${travel_plan?.going_distance_km || summary?.going_distance_km || 0} km` 
                        },
                        { 
                          icon: 'route', 
                          label: 'Return Distance', 
                          value: `${travel_plan?.return_distance_km || summary?.return_distance_km || 0} km` 
                        },
                        { 
                          icon: 'speed', 
                          label: 'Total Distance', 
                          value: `${travel_plan?.total_round_trip_distance_km || summary?.total_round_trip_distance_km || 0} km` 
                        },
                        { 
                          icon: 'local_gas_station', 
                          label: 'Mileage', 
                          value: `${travel_plan?.vehicle_data?.mileage || summary?.vehicle_mileage || 0} km/l` 
                        },
                        { 
                          icon: 'price_change', 
                          label: 'Cost per KM', 
                          value: `₹${travel_plan?.cost_per_km || summary?.cost_per_km || 0}` 
                        },
                        { 
                          icon: 'payments', 
                          label: 'Total Travel Cost', 
                          value: formatCurrency(totalTravelCost) 
                        },
                        { 
                          icon: 'schedule', 
                          label: 'Going Days', 
                          value: `${travel_plan?.going_days || summary?.going_days || 0} days` 
                        },
                        { 
                          icon: 'schedule', 
                          label: 'Return Days', 
                          value: `${travel_plan?.return_days || summary?.return_days || 0} days` 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                            <span className="material-symbols-outlined text-blue-600 text-2xl">{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">{item.label}</p>
                            <p className="text-base font-bold text-black">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stay and Food Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Stay Details */}
                    <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                      <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Stay Details</h2>
                      <div className="flex flex-col gap-4">
                        {[
                          { 
                            icon: 'hotel', 
                            label: 'Available Accommodations', 
                            value: totalAccommodations 
                          },
                          { 
                            icon: 'bed', 
                            label: 'Total Nights', 
                            value: totalDays > 0 ? totalDays - 1 : 0 
                          },
                          { 
                            icon: 'star', 
                            label: 'Top Rated Stay', 
                            value: accommodations?.[0]?.name || 'Not available' 
                          },
                          { 
                            icon: 'wallet', 
                            label: 'Accommodation Budget', 
                            value: formatCurrency(divided_budget?.hotel) 
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              <span className="material-symbols-outlined text-blue-600">{item.icon}</span>
                              <p className="text-gray-600">{item.label}</p>
                            </div>
                            <p className="font-bold text-black">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Food Details */}
                    <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                      <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Food Details</h2>
                      <div className="flex flex-col gap-4">
                        {[
                          { 
                            icon: 'restaurant', 
                            label: 'Available Restaurants', 
                            value: totalRestaurants 
                          },
                          { 
                            icon: 'star', 
                            label: 'Top Rated Restaurant', 
                            value: restaurants?.[0]?.name || 'Not available' 
                          },
                          { 
                            icon: 'fastfood', 
                            label: 'Food Budget', 
                            value: formatCurrency(divided_budget?.food) 
                          },
                          { 
                            icon: 'lunch_dining', 
                            label: 'Daily Food Budget', 
                            value: formatCurrency(daily_budgets?.food) 
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              <span className="material-symbols-outlined text-blue-600">{item.icon}</span>
                              <p className="text-gray-600">{item.label}</p>
                            </div>
                            <p className="font-bold text-black">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Daily Budget Breakdown */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Daily Budget Breakdown</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: 'hotel', label: 'Hotel/Day', value: formatCurrency(daily_budgets?.hotel) },
                        { icon: 'restaurant', label: 'Food/Day', value: formatCurrency(daily_budgets?.food) },
                        { icon: 'local_activity', label: 'Activities/Day', value: formatCurrency(daily_budgets?.activities) },
                        { icon: 'directions_car', label: 'Travel/Day', value: formatCurrency(daily_budgets?.travel) }
                      ].map((item, index) => (
                        <div key={index} className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                          <span className="material-symbols-outlined text-blue-600 text-3xl block mx-auto mb-2">
                            {item.icon}
                          </span>
                          <p className="text-sm text-gray-600">{item.label}</p>
                          <p className="text-lg font-bold mt-1 text-black">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Budget Overview */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Budget Overview</h2>
                    <div className="flex justify-center my-4">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          {/* Background circle */}
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3"></path>
                          
                          {/* Travel segment */}
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#4c51bf" strokeDasharray={`${(divided_budget?.travel / totalBudget) * 100}, 100`} strokeWidth="3"></path>
                          
                          {/* Hotel segment */}
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#6574cd" strokeDasharray={`${(divided_budget?.hotel / totalBudget) * 100}, 100`} strokeDashoffset={`-${(divided_budget?.travel / totalBudget) * 100}`} strokeWidth="3"></path>
                          
                          {/* Food segment */}
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#979ec9" strokeDasharray={`${(divided_budget?.food / totalBudget) * 100}, 100`} strokeDashoffset={`-${((divided_budget?.travel + divided_budget?.hotel) / totalBudget) * 100}`} strokeWidth="3"></path>
                          
                          {/* Activities segment */}
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#48bb78" strokeDasharray={`${(divided_budget?.activities / totalBudget) * 100}, 100`} strokeDashoffset={`-${((divided_budget?.travel + divided_budget?.hotel + divided_budget?.food) / totalBudget) * 100}`} strokeWidth="3"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold text-black">{formatCurrency(totalSpent)}</p>
                          <p className="text-xs text-gray-600">of {formatCurrency(totalBudget)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      {[
                        { color: '#6574cd', label: 'Hotel Cost', value: formatCurrency(divided_budget?.hotel) },
                        { color: '#979ec9', label: 'Food Cost', value: formatCurrency(divided_budget?.food) },
                        { color: '#4c51bf', label: 'Travel Cost', value: formatCurrency(divided_budget?.travel) },
                        { color: '#48bb78', label: 'Activities Cost', value: formatCurrency(divided_budget?.activities) },
                        { color: remainingBudget > 0 ? '#d1d5db' : '#f56565', label: 'Remaining', value: formatCurrency(remainingBudget) }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="flex items-center gap-2 text-black">
                            <span 
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></span>
                            {item.label}
                          </span>
                          <span className="text-black font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Activity Details</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { 
                          icon: 'local_activity', 
                          value: totalScheduledActivities, 
                          label: 'Scheduled Activities' 
                        },
                        { 
                          icon: 'attractions', 
                          value: totalActivities, 
                          label: 'Available Attractions' 
                        },
                        { 
                          icon: 'star', 
                          value: attractions?.[0]?.name?.split(' ').slice(0, 2).join(' ') || 'N/A', 
                          label: 'Top Attraction' 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <span className="material-symbols-outlined text-blue-600 text-3xl">{item.icon}</span>
                          <p className="mt-2 text-sm font-bold text-black text-center leading-tight">{item.value}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 text-sm">Activities Budget</span>
                        <span className="font-bold text-green-800">{formatCurrency(divided_budget?.activities)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Features */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Trip Features</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { 
                          label: 'Different Return Route', 
                          value: summary?.different_return_route,
                          description: 'Return journey takes a different route'
                        },
                        { 
                          label: 'Round Trip', 
                          value: summary?.is_round_trip,
                          description: 'Journey starts and ends at origin'
                        },
                        { 
                          label: 'Unique Destination', 
                          value: summary?.unique_destination,
                          description: 'Visiting unique locations'
                        },
                        { 
                          label: 'Multi-Region', 
                          value: summary?.geographical_regions?.going_region !== summary?.geographical_regions?.origin_region,
                          description: 'Traveling across different regions'
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-gray-600 text-sm">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            item.value 
                              ? 'text-green-700 bg-green-100'
                              : 'text-red-700 bg-red-100'
                          }`}>
                            {item.value ? 'Yes' : 'No'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather Information */}
                  {(destination?.weather || return_destination?.weather) && (
                    <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                      <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Weather</h2>
                      <div className="flex flex-col gap-3">
                        {destination?.weather && (
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{destination.name}</p>
                              <p className="text-xs text-gray-600 capitalize">{destination.weather.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{Math.round(destination.weather.temperature)}°C</p>
                              <p className="text-xs text-gray-600">{destination.weather.humidity}% humidity</p>
                            </div>
                          </div>
                        )}
                        {return_destination?.weather && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{return_destination.name}</p>
                              <p className="text-xs text-gray-600 capitalize">{return_destination.weather.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{Math.round(return_destination.weather.temperature)}°C</p>
                              <p className="text-xs text-gray-600">{return_destination.weather.humidity}% humidity</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSummarylayoutinvate;