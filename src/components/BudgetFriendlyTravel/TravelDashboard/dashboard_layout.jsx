import React, { useState } from 'react';

const DashboardLayout = () => {
  const [visibility, setVisibility] = useState('private');
  const [email, setEmail] = useState('');

  return (
    <div className="font-display bg-white text-black min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* SideNavBar - Mobile First */}
        <aside className="lg:w-64 w-full flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col p-4">
          <div className="flex items-center gap-3 mb-4 lg:mb-8">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <span className="material-symbols-outlined">travel_explore</span>
            </div>
            <h1 className="text-xl font-bold">TripPlanner</h1>
          </div>
          
          <div className="flex flex-row lg:flex-col flex-grow justify-between overflow-x-auto lg:overflow-x-visible">
            <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-100 text-blue-600 whitespace-nowrap" href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-medium">Dashboard</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap" href="#">
                <span className="material-symbols-outlined">list_alt</span>
                <p className="text-sm font-medium">Itinerary</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap" href="#">
                <span className="material-symbols-outlined">account_balance_wallet</span>
                <p className="text-sm font-medium">Budget</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap" href="#">
                <span className="material-symbols-outlined">map</span>
                <p className="text-sm font-medium">Explore</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap" href="#">
                <span className="material-symbols-outlined">group</span>
                <p className="text-sm font-medium">Manage Trip</p>
              </a>
            </div>
            
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header Section */}
          <header className="mb-6 lg:mb-8">
            {/* PageHeading */}
            <div className="flex flex-col lg:flex-row lg:flex-wrap justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-4xl font-black leading-tight tracking-tight">European Adventure: Paris to Rome</h1>
                <p className="text-sm lg:text-base font-normal text-gray-500">July 15, 2024 - July 29, 2024</p>
              </div>
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none flex items-center justify-center rounded-lg h-10 px-4 border border-gray-300 text-sm font-bold gap-2 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-base">share</span>
                  <span className="truncate">Share</span>
                </button>
                <button className="flex-1 lg:flex-none flex items-center justify-center rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold gap-2">
                  <span className="material-symbols-outlined text-base">edit</span>
                  <span className="truncate">Edit Trip</span>
                </button>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold whitespace-nowrap">
                <span className="truncate">New Trip</span>
              </button>
              </div>
            </div>
            
            {/* Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Total Budget</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">€2,500 <span className="text-sm lg:text-lg font-medium text-gray-400">/ €4,000</span></p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Total Distance</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">1,430 km</p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 lg:p-6 bg-white border border-gray-200">
                  <p className="text-sm lg:text-base font-medium">Trip Duration</p>
                  <p className="text-xl lg:text-3xl font-bold tracking-tight">15 Days</p>
                </div>
              </div>
              <div className="rounded-lg p-4 lg:p-6 bg-white border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-sm lg:text-base font-medium">Weather (Paris)</p>
                  <p className="text-xl lg:text-3xl font-bold">24°C</p>
                </div>
                <span className="material-symbols-outlined text-3xl lg:text-5xl text-yellow-500">partly_cloudy_day</span>
              </div>
            </div>
          </header>

          {/* Main Content (Two-Column Layout) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Left Column */}
            <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
              {/* Interactive Map */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[4/3] lg:aspect-[16/10] bg-cover rounded-lg" 
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSN5bipgGfbxfxs0gw5NKwmQ3zuGcKJOc-D3TJVxuBD0C3BjgZM1UWH5QjIMN2ZUrdDnc4YrdVnqU-NVz2xbt1Wa6D-kLcrsMfVB1ztaEs2TPW7MbxEczKkDGn70xrk6Re43ht-5YCpzELxqODj_FVEnH8SaUR402T5Q4oKscdhhQZS72lanIRStyyk8ZEdKD17ED3RUtdDuu-M4GlBYITlcL96ZYCmH50qyFvNCkw9nPe4qDpQmXnPJLu1VBxR7WEDcZqvAv7ptk")'}}
                ></div>
              </div>
              
              {/* Budget Tracker */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Budget Tracker</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-medium text-sm lg:text-base">Total Spent: <span className="text-blue-600 font-bold">€2,500</span></span>
                    <span className="font-medium text-sm lg:text-base">Remaining: <span className="text-green-500 font-bold">€1,500</span></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 lg:h-4">
                    <div className="bg-blue-600 h-3 lg:h-4 rounded-full" style={{width: '62.5%'}}></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs lg:text-sm"><span>Transport</span><span>€900</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs lg:text-sm"><span>Accommodation</span><span>€1100</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{width: '70%'}}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs lg:text-sm"><span>Food</span><span>€350</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{width: '50%'}}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs lg:text-sm"><span>Activities</span><span>€150</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="xl:col-span-1 bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold mb-4">Daily Itinerary</h3>
              <div className="space-y-4 lg:space-y-6 max-h-[500px] lg:max-h-[800px] overflow-y-auto pr-2">
                {/* Day 1 */}
                <div>
                  <p className="font-bold text-sm lg:text-base mb-2">Day 1: July 15 - Arrival in Paris</p>
                  <div className="relative pl-6 lg:pl-8 space-y-3 lg:space-y-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[9px] lg:-left-[11px] top-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-blue-600 ring-2 lg:ring-4 ring-white"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs lg:text-sm font-semibold">14:00 - Flight to CDG</p>
                        <p className="text-xs text-gray-500">Air France AF123</p>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-blue-500">€350</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs lg:text-sm font-semibold">16:00 - Check-in: Hotel Lumière</p>
                        <p className="text-xs text-gray-500">Confirmation: #H4567</p>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-purple-500">€180</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs lg:text-sm font-semibold">19:30 - Dinner at Le Petit Comptoir</p>
                        <p className="text-xs text-gray-500">Reservation for 2</p>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-orange-500">€75</span>
                    </div>
                  </div>
                </div>
                
                {/* Day 2 */}
                <div>
                  <p className="font-bold text-sm lg:text-base mb-2">Day 2: July 16 - Parisian Wonders</p>
                  <div className="relative pl-6 lg:pl-8 space-y-3 lg:space-y-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[9px] lg:-left-[11px] top-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-blue-600 ring-2 lg:ring-4 ring-white"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs lg:text-sm font-semibold">10:00 - Eiffel Tower Visit</p>
                        <p className="text-xs text-gray-500">Tickets booked</p>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-green-500">€25</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs lg:text-sm font-semibold">13:00 - Lunch near Louvre</p>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-orange-500">€40</span>
                    </div>
                  </div>
                </div>
                
                {/* Day 3 */}
                <div>
                  <p className="font-bold text-sm lg:text-base mb-2">Day 3: July 17 - Travel to Lyon</p>
                  <div className="relative pl-6 lg:pl-8 space-y-3 lg:space-y-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[9px] lg:-left-[11px] top-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-blue-600 ring-2 lg:ring-4 ring-white"></div>
                    <div className="flex justify-between items-start">
                      <p className="text-xs lg:text-sm font-semibold">09:00 - Train to Lyon</p>
                      <span className="text-xs lg:text-sm font-bold text-blue-500">€80</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Places Explorer */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold mb-4">Places Explorer</h3>
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-4 lg:space-x-6 overflow-x-auto">
                  <a className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-blue-600 text-blue-600" href="#">
                    Attractions
                  </a>
                  <a className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" href="#">
                    Accommodations
                  </a>
                  <a className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" href="#">
                    Restaurants
                  </a>
                </nav>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCRNm0OBWS7xTAAaen03dvXssiO1N0GBKD59honhSAtQ730zf_xLz05IzPZbEmkheGf-DzolueIL_If83MNS9uJ2Z7VAt9L6zEQnlhQFlO5sMh90neLBDB4eg3NmWpGezhQrxxllm4qhZEo1VJdwqd7c0xD7QgDkvH-bYtBVGSaBy--n9KIpt4zrwF_BMoeMERKu4xuA5ts5cIc4Yf115er2WUweqIdytSISDyTGdUy2C3GC01kPA4wi_OBH0iHJ2H_baBlqBgiqEQ")'}}
                  ></div>
                  <div className="p-3 lg:p-4">
                    <h4 className="font-bold text-sm lg:text-base">Louvre Museum</h4>
                    <div className="flex items-center text-xs lg:text-sm text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                      <span className="ml-1">4.7 (150k reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDN_0q3YwTINQLEQuNJt0svNpuZmig8Bs6pJ-WEdpP2Rz4BmuPISv5faoLflE3AKutccUqZ1Kv4p7Ph1lK6pO1nnwT4g-TQ8REocdhj7Ud5aR3bafd7MN1ilRBuBlQ2vcHml5whI7T9y9DyqDTPp8nhW897DNYfbtLO6z4Jhb2AYh3RAfoJ-pN7HN_N0H6Rw4uvOkWDURg5liot8-KG-z1mQV4U9VaA-X1b5qBXEUCd_ANJqbgynzu6rySXyUH5miqgFCSxpGrfEpU")'}}
                  ></div>
                  <div className="p-3 lg:p-4">
                    <h4 className="font-bold text-sm lg:text-base">Colosseum</h4>
                    <div className="flex items-center text-xs lg:text-sm text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                      <span className="ml-1">4.8 (200k reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqK4KP-6m267fmPclGh4UhgjMW_CnBxnUiXD1LoecdyP9i0X1hANvuNSAGFUVYptx1sTkvYe2rPQWWuqMm6V7OJ7TxJsOQElCb8BiWtrI39DxdZZS21cepkrvyvcnuUu7tY4-mkwmV5aqUzKycYykff-i7P9tsDsVAtU_R1w8Z6km4j-o6fh4d0CG0BqXf77VRycJkj7cnvJw4YtTIfQisiRIEv8CuLm0uYj9nTfod_2JECTHDttnnTCBWwslVLPag1DkJkUSHOzo")'}}
                  ></div>
                  <div className="p-3 lg:p-4">
                    <h4 className="font-bold text-sm lg:text-base">Florence Cathedral</h4>
                    <div className="flex items-center text-xs lg:text-sm text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                      <span className="ml-1">4.9 (90k reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trip Management */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold mb-4">Trip Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm lg:text-base mb-3 block">Visibility Settings</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={visibility === 'private'}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">lock</span>
                        <span className="text-sm">Private (Only invited collaborators)</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="invite-only"
                        checked={visibility === 'invite-only'}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">link</span>
                        <span className="text-sm">Invite Only</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={visibility === 'public'}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">public</span>
                        <span className="text-sm">Public (Anyone with link)</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="font-medium text-sm lg:text-base">Invite Collaborators</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <input 
                      className="w-full rounded-md border-gray-300 bg-transparent text-sm focus:ring-blue-600 focus:border-blue-600" 
                      placeholder="friend@email.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="flex-shrink-0 rounded-md h-10 px-4 bg-green-500 text-white text-sm font-bold whitespace-nowrap">
                      Invite
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="font-medium text-sm lg:text-base">Postpone Trip</label>
                  <input 
                    className="w-full mt-1 rounded-md border-gray-300 bg-transparent text-sm focus:ring-blue-600 focus:border-blue-600" 
                    type="date"
                  />
                </div>
                
                <div>
                  <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 border border-red-500 text-red-500 text-sm font-bold gap-2 hover:bg-red-50">
                    <span className="material-symbols-outlined text-base">delete</span>
                    <span className="truncate">Cancel Trip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;