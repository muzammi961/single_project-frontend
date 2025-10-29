import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const DailyItinerary = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
  // Get daily itineraries from trip data
  const dailyItineraries = calculateTripData?.daily_itineraries || [];

  const getColorClasses = (type) => {
    const colorMap = {
      morning_routine: "bg-orange-500 ring-orange-500/20",
      travel: "bg-blue-500 ring-blue-500/20",
      meal: "bg-green-500 ring-green-500/20",
      attraction: "bg-purple-500 ring-purple-500/20",
      leisure: "bg-pink-500 ring-pink-500/20",
      accommodation: "bg-indigo-500 ring-indigo-500/20",
      planning: "bg-gray-500 ring-gray-500/20"
    };
    return colorMap[type] || colorMap.blue;
  };

  // Function to get activity type display name
  const getActivityTypeName = (type) => {
    const typeMap = {
      morning_routine: "Morning Routine",
      travel: "Travel",
      meal: "Meal",
      attraction: "Attraction",
      leisure: "Leisure",
      accommodation: "Accommodation",
      planning: "Planning"
    };
    return typeMap[type] || type;
  };

  // Function to format activity details
  const formatActivityDetails = (activity) => {
    if (activity.type === 'travel') {
      return `${activity.details?.distance || 'Travel'} | Cost: ₹${activity.estimated_cost || 0}`;
    }
    if (activity.type === 'attraction') {
      return `${activity.time} | Cost: ₹${activity.estimated_cost || 0}`;
    }
    if (activity.type === 'meal') {
      return `${activity.time} | Cost: ₹${activity.estimated_cost || 0}`;
    }
    return activity.time || '';
  };

  return (
    <div className="bg-white font-display text-gray-900">
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar/>
        <div className="flex h-full flex-1">
          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-10">
            <div className="mx-auto max-w-4xl">
              {/* PageHeading */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">Daily Itinerary</p>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    Your day-by-day plan for the trip to {calculateTripData?.destination?.address || 'Destination'}.
                  </p>
                </div>
                {/* <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-white text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 hover:bg-gray-50">
                  <span className="material-symbols-outlined text-base">add</span>
                  <span className="truncate">Add New Day</span>
                </button> */}
              </div>

              {/* Accordions */}
              <div className="flex flex-col gap-4">
                {dailyItineraries.length > 0 ? (
                  dailyItineraries.map((day) => (
                    <details 
                      key={day.day} 
                      className="flex flex-col rounded-xl border border-gray-300 bg-white p-4 group"
                      open={day.day === 1} // Open first day by default
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <p className="text-gray-900 text-base font-bold leading-normal">
                            Day {day.day}: {day.date} ({day.trip_phase === 'going' ? 'Going' : 'Returning'})
                          </p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {day.current_location?.lat ? `${day.current_location.lat.toFixed(2)}, ${day.current_location.lng.toFixed(2)}` : 'Travel Day'}
                            </span>
                            <span className="hidden md:inline">·</span>
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">directions_car</span>
                              {day.daily_travel_distance} km
                            </span>
                            <span className="hidden md:inline">·</span>
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">local_activity</span>
                              {day.total_activities || 0} Activities
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-900 group-open:rotate-180 transition-transform">expand_more</span>
                      </summary>
                      
                      <div className="mt-4 border-t border-gray-300 pt-4">
                        {!day.schedule || day.schedule.length === 0 ? (
                          // Empty State
                          <div className="text-center py-8">
                            <p className="text-gray-600">No activities planned for this day yet.</p>
                            <button className="mt-4 flex mx-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                              <span className="material-symbols-outlined text-base">add</span>
                              <span className="truncate">Add Activity</span>
                            </button>
                          </div>
                        ) : (
                          // Timeline
                          <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-6">
                            {day.schedule.map((activity, index) => (
                              <React.Fragment key={index}>
                                {/* Timeline dot and line */}
                                <div className="flex h-full flex-col items-center">
                                  <div className={`size-3 rounded-full ring-4 ${getColorClasses(activity.type)}`}></div>
                                  <div className={`w-px grow ${index === day.schedule.length - 1 ? 'bg-transparent' : 'bg-gray-300'}`}></div>
                                </div>
                                
                                {/* Activity details */}
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">{activity.activity}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      activity.type === 'travel' ? 'bg-blue-100 text-blue-800' :
                                      activity.type === 'attraction' ? 'bg-purple-100 text-purple-800' :
                                      activity.type === 'meal' ? 'bg-green-100 text-green-800' :
                                      activity.type === 'accommodation' ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {getActivityTypeName(activity.type)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {formatActivityDetails(activity)}
                                  </p>
                                  {activity.details && typeof activity.details === 'object' && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {activity.details.travel_mode && (
                                        <span>Mode: {activity.details.travel_mode}</span>
                                      )}
                                      {activity.details.from && activity.details.to && (
                                        <div className="mt-1">
                                          <div>From: {typeof activity.details.from === 'object' ? `${activity.details.from.lat?.toFixed(2)}, ${activity.details.from.lng?.toFixed(2)}` : activity.details.from}</div>
                                          <div>To: {typeof activity.details.to === 'object' ? `${activity.details.to.lat?.toFixed(2)}, ${activity.details.to.lng?.toFixed(2)}` : activity.details.to}</div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Edit button */}
                                <button className="flex items-center justify-center size-9 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-600">
                                  <span className="material-symbols-outlined text-lg">edit_calendar</span>
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  ))
                ) : (
                  // Empty state when no itineraries
                  <div className="text-center py-16">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                      calendar_today
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Itinerary Found
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We couldn't find any daily itineraries for your trip. Your travel plan might still be processing.
                    </p>
                  </div>
                )}
              </div>

              {/* Trip Summary */}
              {dailyItineraries.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-600">Total Days</span>
                      <span className="text-gray-900 font-semibold">{calculateTripData?.summary?.trip_duration_days || dailyItineraries.length} days</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600">Total Distance</span>
                      <span className="text-gray-900 font-semibold">{calculateTripData?.summary?.total_round_trip_distance_km || 0} km</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600">Total Activities</span>
                      <span className="text-gray-900 font-semibold">{calculateTripData?.summary?.total_scheduled_activities || 0} scheduled</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DailyItinerary;