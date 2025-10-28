import React from 'react';

const DailyItinerary = () => {
  const days = [
    {
      id: 1,
      date: "Oct 25, 2024",
      location: "Paris, France",
      distance: "5km",
      activityCount: 4,
      open: false,
      activities: []
    },
    {
      id: 2,
      date: "Oct 26, 2024",
      location: "Paris, France",
      distance: "15km",
      activityCount: 5,
      open: true,
      activities: [
        {
          id: 1,
          title: "Breakfast at Du Pain",
          time: "09:00 - 10:00 (1h)",
          cost: "€15",
          color: "orange"
        },
        {
          id: 2,
          title: "Louvre Museum Visit",
          time: "10:00 - 13:00 (3h)",
          cost: "€17",
          color: "green"
        },
        {
          id: 3,
          title: "Lunch at Le Bouillon",
          time: "13:00 - 14:00 (1h)",
          cost: "€25",
          color: "orange"
        },
        {
          id: 4,
          title: "Eiffel Tower Tour",
          time: "14:30 - 16:30 (2h)",
          cost: "€25",
          color: "green"
        },
        {
          id: 5,
          title: "Seine River Cruise",
          time: "17:00 - 18:00 (1h)",
          cost: "€20",
          color: "blue"
        }
      ]
    },
    {
      id: 3,
      date: "Oct 27, 2024",
      location: "Versailles, France",
      distance: "30km",
      activityCount: 3,
      open: false,
      activities: []
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      orange: "bg-orange-500 ring-orange-500/20",
      green: "bg-green-500 ring-green-500/20",
      blue: "bg-blue-500 ring-blue-500/20"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white">
      <div className="relative flex min-h-screen w-full flex-col">
        <div className="flex h-full flex-1">
          {/* SideNavBar */}
          <aside className="flex w-72 flex-col gap-8 border-r border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark p-6 sticky top-0 h-screen">
            <div className="flex items-center gap-3">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                data-alt="User's profile picture, Alex Doe"
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnkNqzDYkJAPefHiZdPMau2qbp-FnItZRrEWYNRJjZWAoDljzeUd1wUOm9BGOUpDUIkn2K7_JWQSjw60o0c6JyIk59_NMW00oO4VPEGIqZyBRT7cty7kBoggZ7VKA8dUwyEaZ-zB3JtWlb6NAHoxrn9F_o20Oxbw_-zd0bnuIn6j_Xvok8l8W_LYVB4Gvf9BrnE1QfpI9I4lJgolG_NTAFy264crLbCkr4pbyS7_240GxTradwxU3zyY7IjzSkc7unSdmLZeP_Ipk")'}}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-base font-medium leading-normal text-[#111418] dark:text-white">Alex Doe</h1>
                <p className="text-sm font-normal leading-normal text-[#637188] dark:text-gray-400">alex.doe@email.com</p>
              </div>
            </div>
            <nav className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <a className="flex items-center gap-3 px-3 py-2 text-[#637188] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white" href="#">
                  <span className="material-symbols-outlined">dashboard</span>
                  <p className="text-sm font-medium leading-normal">Dashboard</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 text-[#637188] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white" href="#">
                  <span className="material-symbols-outlined">luggage</span>
                  <p className="text-sm font-medium leading-normal">My Trips</p>
                </a>
                <a className="flex items-center gap-3 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2 text-primary" href="#">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
                  <p className="text-sm font-medium leading-normal">Itinerary</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 text-[#637188] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white" href="#">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  <p className="text-sm font-medium leading-normal">Budget</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 text-[#637188] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white" href="#">
                  <span className="material-symbols-outlined">explore</span>
                  <p className="text-sm font-medium leading-normal">Explore</p>
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">New Trip</span>
                </button>
                <div className="border-t border-[#dcdfe5] dark:border-gray-700 my-2"></div>
                <a className="flex items-center gap-3 px-3 py-2 text-[#637188] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white" href="#">
                  <span className="material-symbols-outlined">settings</span>
                  <p className="text-sm font-medium leading-normal">Settings</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 text-[#637188] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white" href="#">
                  <span className="material-symbols-outlined">logout</span>
                  <p className="text-sm font-medium leading-normal">Log Out</p>
                </a>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-10">
            <div className="mx-auto max-w-4xl">
              {/* PageHeading */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                  <p className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Daily Itinerary</p>
                  <p className="text-[#637188] dark:text-gray-400 text-base font-normal leading-normal">Your day-by-day plan for the trip to Paris.</p>
                </div>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-white dark:bg-gray-700 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-[#dcdfe5] dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <span className="material-symbols-outlined text-base">add</span>
                  <span className="truncate">Add New Day</span>
                </button>
              </div>

              {/* Accordions */}
              <div className="flex flex-col gap-4">
                {days.map((day) => (
                  <details 
                    key={day.id} 
                    className="flex flex-col rounded-xl border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-gray-800 p-4 group"
                    open={day.open}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <p className="text-[#111418] dark:text-white text-base font-bold leading-normal">Day {day.id}: {day.date}</p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-[#637188] dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {day.location}
                          </span>
                          <span className="hidden md:inline">·</span>
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">directions_walk</span>
                            {day.distance}
                          </span>
                          <span className="hidden md:inline">·</span>
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">local_activity</span>
                            {day.activityCount} Activities
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#111418] dark:text-white group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    
                    <div className="mt-4 border-t border-[#dcdfe5] dark:border-gray-700 pt-4">
                      {day.activities.length === 0 ? (
                        // Empty State
                        <div className="text-center py-8">
                          <p className="text-[#637188] dark:text-gray-400">No activities planned for this day yet.</p>
                          <button className="mt-4 flex mx-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="material-symbols-outlined text-base">add</span>
                            <span className="truncate">Add Activity</span>
                          </button>
                        </div>
                      ) : (
                        // Timeline
                        <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-6">
                          {day.activities.map((activity, index) => (
                            <React.Fragment key={activity.id}>
                              {/* Timeline dot and line */}
                              <div className="flex h-full flex-col items-center">
                                <div className={`size-3 rounded-full ring-4 ${getColorClasses(activity.color)}`}></div>
                                <div className={`w-px grow ${index === day.activities.length - 1 ? 'bg-transparent' : 'bg-[#dcdfe5] dark:bg-gray-600'}`}></div>
                              </div>
                              
                              {/* Activity details */}
                              <div className="flex flex-col gap-0.5">
                                <p className="font-semibold text-[#111418] dark:text-white">{activity.title}</p>
                                <p className="text-sm text-[#637188] dark:text-gray-400">
                                  {activity.time} | Cost: {activity.cost}
                                </p>
                              </div>
                              
                              {/* Edit button */}
                              <button className="flex items-center justify-center size-9 rounded-lg bg-white dark:bg-gray-700 border border-[#dcdfe5] dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-[#637188] dark:text-gray-400">
                                <span className="material-symbols-outlined text-lg">edit_calendar</span>
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DailyItinerary;