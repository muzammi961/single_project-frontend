import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const TripSummary = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);

  // Check if data exists
  if (!calculateTripData) {
    return (
      <div className="font-display bg-white text-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Loading trip data...</p>
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
    destination
  } = calculateTripData;

  // Calculate total days and format dates
  const totalDays = summary?.trip_duration_days || 0;
  const goingDays = summary?.going_days || 0;
  const returnDays = summary?.return_days || 0;

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString() || '0'}`;
  };

  // Calculate budget usage
  const totalSpent = (divided_budget?.travel || 0) + 
                    (divided_budget?.hotel || 0) + 
                    (divided_budget?.food || 0) + 
                    (divided_budget?.activities || 0);
  
  const totalBudget = summary?.total_budget || 0;
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Navbar/>
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5 md:py-10">
            <div className="layout-content-container flex flex-col max-w-7xl flex-1">
              
              {/* Page Heading */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Trip Summary</p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
                
                {/* Left Column (Span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Trip Info Card */}
                  <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[4/1] bg-cover rounded-t-xl"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    ></div>
                    <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-6">
                      <p className="text-gray-600 text-sm font-normal leading-normal">
                        {summary?.trip_type?.replace(/_/g, ' ') || 'Round Trip'} - {summary?.different_return_route ? 'Different Routes' : 'Same Route'}
                      </p>
                      <div className="flex items-end gap-3 justify-between">
                        <p className="text-2xl font-bold leading-tight tracking-[-0.015em]">
                          {destination?.address || 'Destination'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-600 text-2xl">calendar_month</span>
                          <p className="text-xl font-bold leading-tight tracking-[-0.015em]">{totalDays} Days</p>
                        </div>
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
                          label: 'Vehicle', 
                          value: travel_plan?.travel_mode === 'bike' ? 'Motorcycle' : 'Car' 
                        },
                        { 
                          icon: 'multiple_stop', 
                          label: 'Going Distance', 
                          value: `${summary?.going_distance_km || 0} km` 
                        },
                        { 
                          icon: 'route', 
                          label: 'Return Distance', 
                          value: `${summary?.return_distance_km || 0} km` 
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
                          value: formatCurrency(summary?.total_travel_cost) 
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
                            label: 'Total Accommodations', 
                            value: accommodations?.length || 0 
                          },
                          { 
                            icon: 'bed', 
                            label: 'Total Nights', 
                            value: totalDays - 1 
                          },
                          { 
                            icon: 'wallet', 
                            label: 'Hotel Cost', 
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
                            label: 'Total Restaurants', 
                            value: restaurants?.length || 0 
                          },
                          { 
                            icon: 'fastfood', 
                            label: 'Estimated Food Cost', 
                            value: formatCurrency(divided_budget?.food) 
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
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#4c51bf" strokeDasharray={`${(divided_budget?.travel / totalBudget) * 100}, 100`} strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#6574cd" strokeDasharray={`${(divided_budget?.hotel / totalBudget) * 100}, 100`} strokeDashoffset={`-${(divided_budget?.travel / totalBudget) * 100}`} strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#979ec9" strokeDasharray={`${(divided_budget?.food / totalBudget) * 100}, 100`} strokeDashoffset={`-${((divided_budget?.travel + divided_budget?.hotel) / totalBudget) * 100}`} strokeWidth="3"></path>
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
                        { color: '#d1d5db', label: 'Remaining', value: formatCurrency(remainingBudget) }
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
                          value: summary?.total_scheduled_activities || 0, 
                          label: 'Activities' 
                        },
                        { 
                          icon: 'attractions', 
                          value: attractions?.length || 0, 
                          label: 'Attractions' 
                        },
                        { 
                          icon: 'shopping_bag', 
                          value: formatCurrency(divided_budget?.activities), 
                          label: 'Activity Cost' 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <span className="material-symbols-outlined text-blue-600 text-3xl">{item.icon}</span>
                          <p className="mt-2 text-lg font-bold text-black">{item.value}</p>
                          <p className="text-xs text-gray-600">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Route Details</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { 
                          label: 'Different Return Route', 
                          value: summary?.different_return_route 
                        },
                        { 
                          label: 'Round Trip', 
                          value: summary?.is_round_trip 
                        },
                        { 
                          label: 'Unique Destination', 
                          value: summary?.unique_destination 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <p className="text-gray-600">{item.label}</p>
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

                  {/* Trip Phases */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white border border-gray-200 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Trip Phases</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { 
                          label: 'Going Days', 
                          value: `${goingDays} days` 
                        },
                        { 
                          label: 'Return Days', 
                          value: `${returnDays} days` 
                        },
                        { 
                          label: 'Total Distance', 
                          value: `${summary?.total_round_trip_distance_km || 0} km` 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <p className="text-gray-600">{item.label}</p>
                          <span className="font-bold text-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;