// import React from 'react';
// import { useSelector } from 'react-redux';
// import Navbar from './Navbar';

// const DailyItinerary = () => {
//   const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
//   // Get daily itineraries from trip data
//   const dailyItineraries = calculateTripData?.daily_itineraries || [];

//   const getColorClasses = (type) => {
//     const colorMap = {
//       morning_routine: "bg-orange-500 ring-orange-500/20",
//       travel: "bg-blue-500 ring-blue-500/20",
//       meal: "bg-green-500 ring-green-500/20",
//       attraction: "bg-purple-500 ring-purple-500/20",
//       leisure: "bg-pink-500 ring-pink-500/20",
//       accommodation: "bg-indigo-500 ring-indigo-500/20",
//       planning: "bg-gray-500 ring-gray-500/20"
//     };
//     return colorMap[type] || colorMap.blue;
//   };

//   // Function to get activity type display name
//   const getActivityTypeName = (type) => {
//     const typeMap = {
//       morning_routine: "Morning Routine",
//       travel: "Travel",
//       meal: "Meal",
//       attraction: "Attraction",
//       leisure: "Leisure",
//       accommodation: "Accommodation",
//       planning: "Planning"
//     };
//     return typeMap[type] || type;
//   };

//   // Function to format activity details
//   const formatActivityDetails = (activity) => {
//     if (activity.type === 'travel') {
//       return `${activity.details?.distance || 'Travel'} | Cost: ₹${activity.estimated_cost || 0}`;
//     }
//     if (activity.type === 'attraction') {
//       return `${activity.time} | Cost: ₹${activity.estimated_cost || 0}`;
//     }
//     if (activity.type === 'meal') {
//       return `${activity.time} | Cost: ₹${activity.estimated_cost || 0}`;
//     }
//     return activity.time || '';
//   };

//   return (
//     <div className="bg-white font-display text-gray-900">
//       <div className="relative flex min-h-screen w-full flex-col">
//         <Navbar/>
//         <div className="flex h-full flex-1">
//           {/* Main Content */}
//           <main className="flex-1 p-6 lg:p-10">
//             <div className="mx-auto max-w-4xl">
//               {/* PageHeading */}
//               <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
//                 <div className="flex flex-col gap-1">
//                   <p className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">Daily Itinerary</p>
//                   <p className="text-gray-600 text-base font-normal leading-normal">
//                     Your day-by-day plan for the trip to {calculateTripData?.destination?.address || 'Destination'}.
//                   </p>
//                 </div>
//                 {/* <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-white text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 hover:bg-gray-50">
//                   <span className="material-symbols-outlined text-base">add</span>
//                   <span className="truncate">Add New Day</span>
//                 </button> */}
//               </div>

//               {/* Accordions */}
//               <div className="flex flex-col gap-4">
//                 {dailyItineraries.length > 0 ? (
//                   dailyItineraries.map((day) => (
//                     <details 
//                       key={day.day} 
//                       className="flex flex-col rounded-xl border border-gray-300 bg-white p-4 group"
//                       open={day.day === 1} // Open first day by default
//                     >
//                       <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
//                         <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//                           <p className="text-gray-900 text-base font-bold leading-normal">
//                             Day {day.day}: {day.date} ({day.trip_phase === 'going' ? 'Going' : 'Returning'})
//                           </p>
//                           <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-gray-600">
//                             <span className="flex items-center gap-1.5">
//                               <span className="material-symbols-outlined text-sm">location_on</span>
//                               {day.current_location?.lat ? `${day.current_location.lat.toFixed(2)}, ${day.current_location.lng.toFixed(2)}` : 'Travel Day'}
//                             </span>
//                             <span className="hidden md:inline">·</span>
//                             <span className="flex items-center gap-1.5">
//                               <span className="material-symbols-outlined text-sm">directions_car</span>
//                               {day.daily_travel_distance} km
//                             </span>
//                             <span className="hidden md:inline">·</span>
//                             <span className="flex items-center gap-1.5">
//                               <span className="material-symbols-outlined text-sm">local_activity</span>
//                               {day.total_activities || 0} Activities
//                             </span>
//                           </div>
//                         </div>
//                         <span className="material-symbols-outlined text-gray-900 group-open:rotate-180 transition-transform">expand_more</span>
//                       </summary>
                      
//                       <div className="mt-4 border-t border-gray-300 pt-4">
//                         {!day.schedule || day.schedule.length === 0 ? (
//                           // Empty State
//                           <div className="text-center py-8">
//                             <p className="text-gray-600">No activities planned for this day yet.</p>
//                             <button className="mt-4 flex mx-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
//                               <span className="material-symbols-outlined text-base">add</span>
//                               <span className="truncate">Add Activity</span>
//                             </button>
//                           </div>
//                         ) : (
//                           // Timeline
//                           <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-6">
//                             {day.schedule.map((activity, index) => (
//                               <React.Fragment key={index}>
//                                 {/* Timeline dot and line */}
//                                 <div className="flex h-full flex-col items-center">
//                                   <div className={`size-3 rounded-full ring-4 ${getColorClasses(activity.type)}`}></div>
//                                   <div className={`w-px grow ${index === day.schedule.length - 1 ? 'bg-transparent' : 'bg-gray-300'}`}></div>
//                                 </div>
                                
//                                 {/* Activity details */}
//                                 <div className="flex flex-col gap-0.5">
//                                   <div className="flex items-center gap-2">
//                                     <p className="font-semibold text-gray-900">{activity.activity}</p>
//                                     <span className={`text-xs px-2 py-1 rounded-full ${
//                                       activity.type === 'travel' ? 'bg-blue-100 text-blue-800' :
//                                       activity.type === 'attraction' ? 'bg-purple-100 text-purple-800' :
//                                       activity.type === 'meal' ? 'bg-green-100 text-green-800' :
//                                       activity.type === 'accommodation' ? 'bg-indigo-100 text-indigo-800' :
//                                       'bg-gray-100 text-gray-800'
//                                     }`}>
//                                       {getActivityTypeName(activity.type)}
//                                     </span>
//                                   </div>
//                                   <p className="text-sm text-gray-600">
//                                     {formatActivityDetails(activity)}
//                                   </p>
//                                   {activity.details && typeof activity.details === 'object' && (
//                                     <div className="text-xs text-gray-500 mt-1">
//                                       {activity.details.travel_mode && (
//                                         <span>Mode: {activity.details.travel_mode}</span>
//                                       )}
//                                       {activity.details.from && activity.details.to && (
//                                         <div className="mt-1">
//                                           <div>From: {typeof activity.details.from === 'object' ? `${activity.details.from.lat?.toFixed(2)}, ${activity.details.from.lng?.toFixed(2)}` : activity.details.from}</div>
//                                           <div>To: {typeof activity.details.to === 'object' ? `${activity.details.to.lat?.toFixed(2)}, ${activity.details.to.lng?.toFixed(2)}` : activity.details.to}</div>
//                                         </div>
//                                       )}
//                                     </div>
//                                   )}
//                                 </div>
                                
//                                 {/* Edit button */}
//                                 <button className="flex items-center justify-center size-9 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-600">
//                                   <span className="material-symbols-outlined text-lg">edit_calendar</span>
//                                 </button>
//                               </React.Fragment>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </details>
//                   ))
//                 ) : (
//                   // Empty state when no itineraries
//                   <div className="text-center py-16">
//                     <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
//                       calendar_today
//                     </span>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       No Itinerary Found
//                     </h3>
//                     <p className="text-gray-600 max-w-md mx-auto">
//                       We couldn't find any daily itineraries for your trip. Your travel plan might still be processing.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Trip Summary */}
//               {dailyItineraries.length > 0 && (
//                 <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-300">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Summary</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                     <div className="flex flex-col">
//                       <span className="text-gray-600">Total Days</span>
//                       <span className="text-gray-900 font-semibold">{calculateTripData?.summary?.trip_duration_days || dailyItineraries.length} days</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-600">Total Distance</span>
//                       <span className="text-gray-900 font-semibold">{calculateTripData?.summary?.total_round_trip_distance_km || 0} km</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-600">Total Activities</span>
//                       <span className="text-gray-900 font-semibold">{calculateTripData?.summary?.total_scheduled_activities || 0} scheduled</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DailyItinerary;



























import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const DailyItinerary = () => {
  const calculateTripData = useSelector((state) => state.app.tripDatacalculate);
  
  // Get daily itineraries from trip data - corrected structure
  const dailyItineraries = calculateTripData?.daily_itineraries || [];

  const getColorClasses = (type) => {
    const colorMap = {
      morning_routine: "bg-orange-500 ring-orange-500/20",
      travel: "bg-blue-500 ring-blue-500/20",
      meal: "bg-green-500 ring-green-500/20",
      attraction: "bg-purple-500 ring-purple-500/20",
      leisure: "bg-pink-500 ring-pink-500/20",
      accommodation: "bg-indigo-500 ring-indigo-500/20",
      planning: "bg-gray-500 ring-gray-500/20",
      exploration: "bg-teal-500 ring-teal-500/20"
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
      planning: "Planning",
      exploration: "Exploration"
    };
    return typeMap[type] || type;
  };

  // Function to format activity details
  const formatActivityDetails = (activity) => {
    if (activity.type === 'travel') {
      return `${activity.details?.distance || 'Travel'} | Cost: ₹${activity.estimated_cost || 0}`;
    }
    if (activity.type === 'attraction') {
      return `${activity.duration_hours || 0}h | Cost: ₹${activity.estimated_cost || 0}`;
    }
    if (activity.type === 'meal') {
      return `${activity.duration_hours || 0}h | Cost: ₹${activity.estimated_cost || 0}`;
    }
    if (activity.type === 'accommodation') {
      return `Check-in | Cost: ₹${activity.details?.estimated_cost || 0}`;
    }
    return `${activity.duration_hours || 0}h`;
  };

  // Function to get detailed description
  const getActivityDescription = (activity) => {
    if (activity.details && typeof activity.details === 'object') {
      if (activity.type === 'travel') {
        return `Travel from current location to next stop`;
      }
      if (activity.type === 'meal') {
        return activity.details.meal_type ? `${activity.details.meal_type} - Budget: ₹${activity.details.budget || 0}` : 'Meal break';
      }
      if (activity.type === 'attraction') {
        return `Visit ${activity.details.name || 'attraction'}`;
      }
      return activity.details.activity || activity.details.description || '';
    }
    return activity.details || '';
  };

  // Function to get trip phase display name
  const getTripPhaseDisplay = (tripPhase, phaseDay) => {
    const phaseMap = {
      going: `Going - Day ${phaseDay}`,
      returning: `Returning - Day ${phaseDay}`
    };
    return phaseMap[tripPhase] || tripPhase;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate total trip statistics
  const calculateTripStats = () => {
    const totalDays = dailyItineraries.length;
    const totalActivities = dailyItineraries.reduce((sum, day) => sum + (day.total_activities || 0), 0);
    const totalTravelDistance = dailyItineraries.reduce((sum, day) => sum + (day.daily_travel_distance || 0), 0);
    const totalCost = dailyItineraries.reduce((sum, day) => {
      const dayCost = day.schedule?.reduce((daySum, activity) => daySum + (activity.estimated_cost || 0), 0) || 0;
      return sum + dayCost;
    }, 0);

    return {
      totalDays,
      totalActivities,
      totalTravelDistance: Math.round(totalTravelDistance),
      totalCost: Math.round(totalCost)
    };
  };

  const tripStats = calculateTripStats();

  return (
    <div className="bg-white font-display text-gray-900 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar/>
        <div className="flex h-full flex-1">
          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 px-4 pb-6">
                <a className="text-gray-500 hover:text-primary text-sm font-medium leading-normal" href="#">
                  Trip to {calculateTripData?.destination?.name || 'Destination'}
                </a>
                <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-800 text-sm font-medium leading-normal">Daily Itinerary</span>
              </div>

              {/* PageHeading */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900">
                    Daily Itinerary
                  </h1>
                  <p className="text-base font-normal leading-normal text-gray-600">
                    Your complete day-by-day travel plan for {calculateTripData?.destination?.name || 'your trip'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {tripStats.totalDays} Days • {tripStats.totalActivities} Activities
                  </span>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-lg">print</span>
                    <span>Print Itinerary</span>
                  </button>
                </div>
              </div>

              {/* Trip Summary Stats */}
              {dailyItineraries.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{tripStats.totalDays}</div>
                    <div className="text-sm text-blue-800">Total Days</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{tripStats.totalActivities}</div>
                    <div className="text-sm text-green-800">Activities</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{tripStats.totalTravelDistance} km</div>
                    <div className="text-sm text-orange-800">Total Distance</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">₹{tripStats.totalCost}</div>
                    <div className="text-sm text-purple-800">Estimated Cost</div>
                  </div>
                </div>
              )}

              {/* Daily Itineraries */}
              <div className="flex flex-col gap-6">
                {dailyItineraries.length > 0 ? (
                  dailyItineraries.map((day) => (
                    <div 
                      key={day.day} 
                      className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Day Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full font-bold text-lg">
                              {day.day}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {formatDate(day.date)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {getTripPhaseDisplay(day.trip_phase, day.phase_day)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">location_on</span>
                              <span>
                                {day.current_location ? 
                                  (Array.isArray(day.current_location) ? 
                                    `${day.current_location[0]?.toFixed(2)}, ${day.current_location[1]?.toFixed(2)}` : 
                                    'Travel Day') : 
                                  'Starting Point'
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">directions_car</span>
                              <span>{day.daily_travel_distance} km travel</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">schedule</span>
                              <span>{day.total_activities || 0} activities</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            day.trip_phase === 'going' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {day.trip_phase === 'going' ? 'Going Trip' : 'Return Trip'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Schedule Timeline */}
                      <div className="p-6">
                        {!day.schedule || day.schedule.length === 0 ? (
                          // Empty State for Day
                          <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">
                              schedule
                            </span>
                            <p className="text-gray-600 mb-4">No activities planned for this day yet.</p>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                              <span className="material-symbols-outlined text-lg">add</span>
                              Add Activities
                            </button>
                          </div>
                        ) : (
                          // Timeline
                          <div className="space-y-6">
                            {day.schedule.map((activity, index) => (
                              <div key={index} className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                                {/* Time and Duration */}
                                <div className="flex flex-col items-center w-20 flex-shrink-0">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {activity.time?.split(' - ')[0] || '--:--'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {activity.duration_hours || 0}h
                                  </div>
                                </div>
                                
                                {/* Timeline dot and line */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-3 h-3 rounded-full ring-4 ${getColorClasses(activity.type)}`}></div>
                                  {index < day.schedule.length - 1 && (
                                    <div className="w-px h-full bg-gray-300 mt-1"></div>
                                  )}
                                </div>
                                
                                {/* Activity Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-lg font-semibold text-gray-900">
                                        {activity.activity}
                                      </h4>
                                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                                        activity.type === 'travel' ? 'bg-blue-100 text-blue-800' :
                                        activity.type === 'attraction' ? 'bg-purple-100 text-purple-800' :
                                        activity.type === 'meal' ? 'bg-green-100 text-green-800' :
                                        activity.type === 'accommodation' ? 'bg-indigo-100 text-indigo-800' :
                                        activity.type === 'leisure' ? 'bg-pink-100 text-pink-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {getActivityTypeName(activity.type)}
                                      </span>
                                    </div>
                                    {activity.estimated_cost > 0 && (
                                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        ₹{activity.estimated_cost}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-2">
                                    {getActivityDescription(activity)}
                                  </p>
                                  
                                  {/* Additional Details */}
                                  {activity.details && typeof activity.details === 'object' && (
                                    <div className="text-xs text-gray-500 space-y-1">
                                      {activity.details.travel_mode && (
                                        <div>Travel Mode: {activity.details.travel_mode}</div>
                                      )}
                                      {activity.details.distance && (
                                        <div>Distance: {activity.details.distance}</div>
                                      )}
                                      {activity.details.meal_type && (
                                        <div>Meal Type: {activity.details.meal_type}</div>
                                      )}
                                      {activity.details.budget && (
                                        <div>Budget: ₹{activity.details.budget}</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Action Button */}
                                <button className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 transition-all">
                                  <span className="material-symbols-outlined text-base">more_vert</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      We couldn't find any daily itineraries for your trip. Your travel plan might still be processing or there might be an issue with the trip data.
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      <span className="material-symbols-outlined">refresh</span>
                      Reload Itinerary
                    </button>
                  </div>
                )}
              </div>

              {/* Overall Trip Summary */}
              {dailyItineraries.length > 0 && (
                <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{tripStats.totalDays}</div>
                      <div className="text-sm text-blue-800 font-medium">Travel Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{tripStats.totalActivities}</div>
                      <div className="text-sm text-green-800 font-medium">Total Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{tripStats.totalTravelDistance} km</div>
                      <div className="text-sm text-orange-800 font-medium">Total Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">₹{tripStats.totalCost}</div>
                      <div className="text-sm text-purple-800 font-medium">Estimated Total</div>
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