import React from 'react';

const TripSummary = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-200 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
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
                  <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[4/1] bg-cover rounded-t-xl"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBY3AfqGDDsER--AVKtefXpFwRqaz5bxCCCie17g6CS2OTIH59KLfXfJCAj6UjzvgxDUQx-NJIf-pmZye8A1kge_PANKgiK7JsoJUo_SXYtAXZnLxxlwUZNdLO47l2xfNMyqWPhEaZ3A-Suwdfc-NYZo403nPa17K9HHcNF5PyRv6ag7O6zVQlWiM6YWCMsJ16L0Zvhxr371PfufdT3N0jM7i-qF0XYHm8Mec55RhHR96Bp4QurJj_jPM1AXEqE21vVRZjtwZBv4x4")'
                      }}
                    ></div>
                    <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-6">
                      <p className="text-[#637188] dark:text-gray-400 text-sm font-normal leading-normal">Round Trip - Different Routes</p>
                      <div className="flex items-end gap-3 justify-between">
                        <p className="text-2xl font-bold leading-tight tracking-[-0.015em]">Santorini, Greece</p>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                          <p className="text-xl font-bold leading-tight tracking-[-0.015em]">10 Days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Travel Details Card */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Travel Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                      {[
                        { icon: 'directions_car', label: 'Vehicle', value: 'Sedan' },
                        { icon: 'multiple_stop', label: 'Going Distance', value: '450 km' },
                        { icon: 'route', label: 'Return Distance', value: '520 km' },
                        { icon: 'local_gas_station', label: 'Mileage', value: '15 km/l' },
                        { icon: 'price_change', label: 'Cost per KM', value: '$0.50' },
                        { icon: 'payments', label: 'Total Travel Cost', value: '$485.00' }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                            <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-[#637188] dark:text-gray-400 text-sm">{item.label}</p>
                            <p className="text-base font-bold">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stay and Food Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Stay Details */}
                    <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800 p-6">
                      <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Stay Details</h2>
                      <div className="flex flex-col gap-4">
                        {[
                          { icon: 'hotel', label: 'Total Accommodations', value: '2' },
                          { icon: 'bed', label: 'Total Nights', value: '9' },
                          { icon: 'wallet', label: 'Hotel Cost', value: '$1,250.00' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              <span className="material-symbols-outlined text-primary">{item.icon}</span>
                              <p className="text-[#637188] dark:text-gray-400">{item.label}</p>
                            </div>
                            <p className="font-bold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Food Details */}
                    <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800 p-6">
                      <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Food Details</h2>
                      <div className="flex flex-col gap-4">
                        {[
                          { icon: 'restaurant', label: 'Total Restaurants', value: '15' },
                          { icon: 'fastfood', label: 'Estimated Food Cost', value: '$700.00' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              <span className="material-symbols-outlined text-primary">{item.icon}</span>
                              <p className="text-[#637188] dark:text-gray-400">{item.label}</p>
                            </div>
                            <p className="font-bold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Budget Overview */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Budget Overview</h2>
                    <div className="flex justify-center my-4">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#4c51bf" strokeDasharray="19, 100" strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#6574cd" strokeDasharray="48, 100" strokeDashoffset="-19" strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#979ec9" strokeDasharray="27, 100" strokeDashoffset="-67" strokeWidth="3"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs text-[#637188] dark:text-gray-400">Total Spent</p>
                          <p className="text-2xl font-bold">$2,735</p>
                          <p className="text-xs text-[#637188] dark:text-gray-400">of $3,500</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      {[
                        { color: '#6574cd', label: 'Hotel Cost', value: '$1,250.00' },
                        { color: '#979ec9', label: 'Food Cost', value: '$700.00' },
                        { color: '#4c51bf', label: 'Travel Cost', value: '$485.00' },
                        { color: 'bg-gray-200 dark:bg-gray-600', label: 'Remaining', value: '$765.00' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span 
                              className={`h-2 w-2 rounded-full ${item.color.includes('bg-') ? item.color : ''}`}
                              style={!item.color.includes('bg-') ? { backgroundColor: item.color } : {}}
                            ></span>
                            {item.label}
                          </span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Activity Details</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { icon: 'local_activity', value: '8', label: 'Activities' },
                        { icon: 'attractions', value: '5', label: 'Attractions' },
                        { icon: 'shopping_bag', value: '$300', label: 'Activity Cost' }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                          <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                          <p className="mt-2 text-lg font-bold">{item.value}</p>
                          <p className="text-xs text-[#637188] dark:text-gray-400">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800 p-6">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Route Details</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Different Return Route', value: true },
                        { label: 'One Way Trip', value: false }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <p className="text-[#637188] dark:text-gray-400">{item.label}</p>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            item.value 
                              ? 'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300'
                              : 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {item.value ? 'True' : 'False'}
                          </span>
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