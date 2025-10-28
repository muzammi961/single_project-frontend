import React from 'react';

const TravelMap = () => {
  return (
    <div className="font-display bg-white text-black">
      <div className="relative flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          {/* SideNavBar */}
          <aside className="flex flex-col w-64 p-4 bg-white border-r border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                  data-alt="User avatar for Alex Miller"
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKHr20-tsYLIhIM9VLUTZhQzafHgnjlycys7FPcrs12EZBVUFu3sXd0BL3afu2leGk8JoN_KSGMFyEG678OGTz2PVn_sl0psSBb5dKOB6ASQBAkqUxBSeP4OZ93z_xm6OHrTZCpe-3CXW8pwfRCn3dV_N32jG7I61-fKxtNFd9jY8en_yC_WwtOhgo_flM6vXKFq4UoWfB95qA20MSSffAuFl0F94FlIHYyEERk1cPbWUi1oY8AWEhSkmBd_b2Or8uCnyrTsujsyI")'}}
                ></div>
                <div className="flex flex-col">
                  <h1 className="text-black text-base font-medium leading-normal">Alex Miller</h1>
                  <p className="text-gray-500 text-sm font-normal leading-normal">alex.miller@email.com</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-black">dashboard</span>
                  <p className="text-black text-sm font-medium leading-normal">Dashboard</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-black">luggage</span>
                  <p className="text-black text-sm font-medium leading-normal">My Trips</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-100" href="#">
                  <span className="material-symbols-outlined text-blue-600">travel_explore</span>
                  <p className="text-blue-600 text-sm font-medium leading-normal">Travel Map</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-black">explore</span>
                  <p className="text-black text-sm font-medium leading-normal">Discover</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-black">person</span>
                  <p className="text-black text-sm font-medium leading-normal">Profile</p>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-auto">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700">
                <span className="truncate">New Trip</span>
              </button>
              <div className="flex flex-col gap-1 border-t border-gray-200 pt-2">
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-black">settings</span>
                  <p className="text-black text-sm font-medium leading-normal">Settings</p>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-black">logout</span>
                  <p className="text-black text-sm font-medium leading-normal">Logout</p>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            <div className="flex flex-col h-full max-w-7xl mx-auto">
              {/* PageHeading */}
              <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <h1 className="text-black text-4xl font-black leading-tight tracking-[-0.033em]">Paris & Rome Adventure</h1>
                  <p className="text-gray-500 text-base font-normal leading-normal mt-2">A 10-day journey through the heart of France and Italy</p>
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-blue-600 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-blue-700">
                  <span className="material-symbols-outlined text-white text-lg">share</span>
                  <span className="truncate">Share Trip</span>
                </button>
              </header>

              {/* Map Component */}
              <div className="@container flex flex-col flex-1 h-full">
                <div className="flex flex-1 flex-col">
                  <div 
                    className="bg-cover bg-center flex flex-1 flex-col justify-between p-4 @[480px]:rounded-xl relative overflow-hidden" 
                    data-location="Europe"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7amiOaat3WlOyei-YtX0S5HFlaaPviThJeelGKglQ0jI0Dch7EhNZQ7IOFUD8ktyB5iF4Hio-o7-6f5N8lvmlPoNRRY8B9qOzh0jVfzxQM3cfL1bwu5nhJDmBAda_vvx_ukS2FvA3PFNs0m1fYY9F8J3zFGdR9Jm1Zr8q5hbP4MaYSBlRpr9Z-qJIgWG7P-eESi9_kdOOvB7sXekgaCvIzuhPONLeXVCArYXFcM90eO7rF-rLvWciqUMFegsyrT5CN1xFSl5vZUY")'}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
                    
                    {/* Search Bar */}
                    <label className="flex flex-col min-w-40 h-12 w-full max-w-sm z-10">
                      <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-md">
                        <div className="text-gray-500 flex bg-white items-center justify-center pl-4 rounded-l-lg border-r-0">
                          <span className="material-symbols-outlined">search</span>
                        </div>
                        <input 
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-black focus:outline-0 focus:ring-2 focus:ring-blue-600 focus:ring-inset border-none bg-white h-full placeholder:text-gray-500 px-4 pl-2 text-base font-normal leading-normal" 
                          placeholder="Search locations on your route" 
                          defaultValue=""
                        />
                      </div>
                    </label>

                    {/* Map Controls */}
                    <div className="flex flex-col items-end gap-3 z-10 self-end">
                      <div className="flex flex-col gap-0.5">
                        <button className="flex size-10 items-center justify-center rounded-t-lg bg-white text-black shadow-md hover:bg-gray-100">
                          <span className="material-symbols-outlined">add</span>
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-b-lg bg-white text-black shadow-md hover:bg-gray-100">
                          <span className="material-symbols-outlined">remove</span>
                        </button>
                      </div>
                      <button className="flex size-10 items-center justify-center rounded-lg bg-white text-black shadow-md hover:bg-gray-100">
                        <span className="material-symbols-outlined">my_location</span>
                      </button>
                      <button className="flex size-10 items-center justify-center rounded-lg bg-white text-black shadow-md hover:bg-gray-100">
                        <span className="material-symbols-outlined">zoom_out_map</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TravelMap;