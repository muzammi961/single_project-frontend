const TravelPlannerItinerary = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">
        <div className="flex h-full grow">
          {/* SideNavBar */}
          <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:flex">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYn_GomgS-PfoAMXa_RLqeG8StL2yXxwatiWODxT5XMRqGo0RFwLX0114YUKOrYWt948DZvY-seXxrjviOs17J9BJbjNduGHnlP2Kw3a81L4YtgK1iGwx-TGrG3z0EG8Xsjbg2BMmdImyrBgltzZ2OocQSMpFQbOwkyIqtwiALYD613o2ZoUShY3oxwwMCjsBpTgk1HsGhkxBWyBffjWVXFGqwGIU2uhA66VViP9Gh_k3tmLevyN4hyUECAnLQnaQqbnGJdPYH93Q")'
                  }}
                />
                <div className="flex flex-col">
                  <h1 className="text-base font-medium text-gray-900 dark:text-gray-100">Alex Chen</h1>
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">My Japan Trip</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" href="#">
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">dashboard</span>
                  <p className="text-sm font-medium">Dashboard</p>
                </a>
                <a className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-primary dark:bg-gray-800" href="#">
                  <span className="material-symbols-outlined !font-bold">calendar_month</span>
                  <p className="text-sm font-medium">Itinerary</p>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" href="#">
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">confirmation_number</span>
                  <p className="text-sm font-medium">Bookings</p>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" href="#">
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">credit_card</span>
                  <p className="text-sm font-medium">Expenses</p>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" href="#">
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">map</span>
                  <p className="text-sm font-medium">Map</p>
                </a>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-1">
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" href="#">
                <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">settings</span>
                <p className="text-sm font-medium">Settings</p>
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
              {/* PageHeading */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Daily Itinerary</h1>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">Your day-by-day plan for the trip.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <span className="material-symbols-outlined">add</span>
                  <span>Add New Day</span>
                </button>
              </div>

              {/* Accordions for days */}
              <div className="flex flex-col gap-4">
                {/* Day 1 */}
                <details className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800" open="">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Day 1 - Oct 26, 2024</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          <span>Tokyo, Japan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">directions_car</span>
                          <span>~5km travel</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">checklist</span>
                          <span>4 Activities</span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-500 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
                  </summary>
                  <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    {/* Timeline for Day 1 */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4">
                      {/* Activity Item 1 */}
                      <div className="flex flex-col items-center gap-1 pt-1.5">
                        <div className="size-3 rounded-full bg-emerald-500"></div>
                        <div className="w-px grow bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex flex-col pb-8">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Visit to Senso-ji Temple</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">10:00 AM - 1.5 hours, ~$15</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>

                      {/* Activity Item 2 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-600"></div>
                        <div className="size-3 rounded-full bg-orange-500"></div>
                        <div className="w-px grow bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex flex-col pb-8">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Lunch at Asakusa</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">12:00 PM - 1 hour, ~$25</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>

                      {/* Activity Item 3 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-600"></div>
                        <div className="size-3 rounded-full bg-emerald-500"></div>
                        <div className="w-px grow bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex flex-col pb-8">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Tokyo Skytree Observation</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2:00 PM - 2 hours, ~$30</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>

                      {/* Activity Item 4 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-600"></div>
                        <div className="size-3 rounded-full bg-indigo-500"></div>
                      </div>
                      <div className="flex flex-col pb-2">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Check-in at Shibuya Hotel</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">5:00 PM - 30 mins, $250</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>
                    </div>
                    <button className="mt-4 w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-primary hover:text-primary dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary">
                      Add Activity
                    </button>
                  </div>
                </details>

                {/* Day 2 */}
                <details className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Day 2 - Oct 27, 2024</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          <span>Kyoto, Japan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">directions_car</span>
                          <span>~515km travel</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">checklist</span>
                          <span>3 Activities</span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-500 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
                  </summary>
                  <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    {/* Timeline for Day 2 */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4">
                      {/* Activity Item 1 */}
                      <div className="flex flex-col items-center gap-1 pt-1.5">
                        <div className="size-3 rounded-full bg-blue-500"></div>
                        <div className="w-px grow bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex flex-col pb-8">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Shinkansen from Tokyo to Kyoto</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">9:00 AM - 2.5 hours, ~$130</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>

                      {/* Activity Item 2 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-600"></div>
                        <div className="size-3 rounded-full bg-emerald-500"></div>
                        <div className="w-px grow bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex flex-col pb-8">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Visit Fushimi Inari Shrine</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">1:00 PM - 3 hours, Free</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>

                      {/* Activity Item 3 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-600"></div>
                        <div className="size-3 rounded-full bg-orange-500"></div>
                      </div>
                      <div className="flex flex-col pb-2">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">Dinner in Gion District</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">6:00 PM - 1.5 hours, ~$50</p>
                        <button className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <span className="material-symbols-outlined text-sm">edit_calendar</span>
                          Reschedule
                        </button>
                      </div>
                    </div>
                    <button className="mt-4 w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-primary hover:text-primary dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary">
                      Add Activity
                    </button>
                  </div>
                </details>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerItinerary;