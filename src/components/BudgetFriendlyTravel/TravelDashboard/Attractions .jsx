import React from 'react';
import Navbar from './Navbar';

const Attractions = () => {
  const attractions = [
    {
      id: 1,
      name: "Grand Canyon National Park",
      type: "National Park",
      location: "Arizona, USA",
      distance: "1.5 miles away",
      rating: 4.9,
      reviews: 2188,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtybpTVJ1cuVA_USAVtfvv3MMFLcMa-azN1w1yZ6-84RFDh4e5afWhiMPp-LsOox4572PFYo3NWd3xXaWZrcIYOlqfQu3bEFjpETXo6Q7k10xAspdK4i9WmUtve8rDYDTyjDC4oW3kIoizVVIjFEeQCM5IH7sE1zUp9ckQX_GLspc-be9FdNrsM1W6hXgLuUx8DUC7h3r6toM4j6ZolQdOtUbq7yqBdC84rqpO7ue9RLZL_xqdmPoyZUFBy0K7WlVyt-sVNcob-Sw",
      topRated: true,
      typeColor: "green"
    },
    {
      id: 2,
      name: "Thrill Land",
      type: "Amusement Park",
      location: "Orlando, Florida",
      distance: "3.2 miles away",
      rating: 4.7,
      reviews: 1540,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjy-BNH6YNjGvRiuEZwgVvOlMBYw0c8L-iOHbYTVL23CsnqM25CLchj2jz_V9Li1lLzXDxFHDornQjaHZdpkadJsksQy9-I4JTtthJdTgVHl5vYMwmNanHf5lS47YaP0mt2NsMI4CyvIWWHFgxCx4kydqJChNPRdkH0sC7cFy-NA3hSexgootBeFGKz-mO5_VPQW9cnJi-jJtuIAVtHAZ6MpZw8edhpiXR1lFkc7Azs7gqsF7x0qUoCHCQWckdL3kqyWtaFcr2A_E",
      topRated: false,
      typeColor: "purple"
    },
    {
      id: 3,
      name: "Museum of Modern Art",
      type: "Museum",
      location: "New York, NY",
      distance: "5.8 miles away",
      rating: 4.6,
      reviews: 3012,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBTo1-LJ34IpAYscyRrKm37tmxHG_LB4nisJ2rPVxqTqPLTn7K-RBWItPdEvTjuAVSzHjf7Oebzs9ABNlGgRQNVetRtc_4nzvBTPBib1geGGBBzvVgJ_VXT2LrAZtYKlROdSc1MC1mNFvTmFkBKYlOGDXBuwOTcVfFS1kx4XZ2RI2bB6GVt-tBdNrrdwM1g2MPBPnzZoPoAkIiCXHe_a8rFtIJ6op-zeOIcRvQHp6UDKQPP37i83Ua49WthsM87TpqFF7PXJgx6_Q",
      topRated: false,
      typeColor: "blue"
    },
    {
      id: 4,
      name: "Aqua Splash World",
      type: "Water Park",
      location: "San Diego, California",
      distance: "1.1 miles away",
      rating: 4.5,
      reviews: 987,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJV0XdbI5jnnRUH5dnZpEtXZRVctPWzRfJgipqJkOITbvRw72I6OlzRwzr6yX72AxVs95W6JPiddqy1EBnvRF4vZPwx4UuM_mMCS02ozcC1RGqRAS-HI04l6mAmGBDAodrYyN9chxNPYe-np_kf0iHlxICJU1kkq9zp6tMXRdhFuHnu4JgIMSwTwurDy0eZrwreXWS1xn6sL2MHgKKSRplzwhiF1saTpAnOM1I4oSzgva2i20QGdeeQiD4rW3EiK8WDCnBEtFXydU",
      topRated: false,
      typeColor: "cyan"
    },
    {
      id: 5,
      name: "Golden Gate Bridge",
      type: "Landmark",
      location: "San Francisco, CA",
      distance: "8.4 miles away",
      rating: 4.9,
      reviews: 4215,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzDrOSKEdU-MO0Cl2wRnEKdPQ6kVfr5HLOBpfjiF5rv5vyM4R1C98LBWtGv5dpCBu-ROJw8HTCp2kMYj6vel7fRqXXIzJ6pWa2Kxwbyf7NnoNYGI_bwaR-6OZMqBD-6IbOtgoMGHsLflT5Pxjt-cnN8tItrv-GSin4HAXSDmeJz62msSjeIF0aqcIc6w7YUx3gXX8qPacphpUZb7PQFIoVYhcp8My_cWyPECzaJ4A2QyknlED8281TVRw3hGEOSeoScfbfCfyYGig",
      topRated: true,
      typeColor: "red"
    },
    {
      id: 6,
      name: "Verdant Gardens",
      type: "Botanical Garden",
      location: "Kyoto, Japan",
      distance: "0.5 miles away",
      rating: 4.8,
      reviews: 899,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjMbppXc211tbZiOfedfiPn8gKIUDe1NvKZtSCf_aJNoYJlAxTZ-GjpnkUMEyW_NA_1-KTmyNsmmVdRohSkSdp2jWSzH98udylRUSi8XEkOEaQZVjWkzTZ4yIjWB-SFwp69WdTNpQV2pLNpJ1txWmk1njws5650exiXFAke5ZoVmn-pCyE45k27hpDJ3hlyiFd81e9vmEJag9Kl5X7X1Ot22t-ffZYBkjr3c1XBGW8m_a3F-6xlyWBtadjoBZ2ScY7iQLBA4PHmTI",
      topRated: false,
      typeColor: "green"
    }
  ];

  const getTypeColorClasses = (color) => {
    const colorMap = {
      green: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
      purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300",
      blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
      cyan: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300",
      red: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
    };
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <Navbar/>
        <div className="flex flex-1">
    

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {/* PageHeading */}
              <header className="flex flex-wrap justify-between gap-4 items-center mb-6">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-black tracking-tighter">Explore Attractions</h1>
                  <p className="text-[#637188] dark:text-gray-400 text-base font-normal leading-normal">Find the best places to visit on your next adventure</p>
                </div>
              </header>

              {/* SearchBar & Chips */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="relative">
                  <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <div className="text-[#637188] dark:text-gray-400 flex bg-white dark:bg-background-dark items-center justify-center pl-4 rounded-l-xl border border-gray-200 dark:border-gray-800 border-r-0">
                        <span className="material-symbols-outlined">search</span>
                      </div>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 h-full placeholder:text-[#637188] dark:placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                        placeholder="Search by name or type..." 
                        defaultValue=""
                      />
                    </div>
                  </label>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">swap_vert</span>
                    <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Sort by: Distance</p>
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">expand_more</span>
                  </button>
                  <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">category</span>
                    <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Type: All</p>
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">expand_more</span>
                  </button>
                  <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">star</span>
                    <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Rating: 4+ Stars</p>
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">expand_more</span>
                  </button>
                  <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-sm text-[#111418] dark:text-white">schedule</span>
                    <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Open Now</p>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {attractions.map((attraction) => (
                  <div 
                    key={attraction.id}
                    className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-background-dark shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    {attraction.topRated && (
                      <div className="absolute top-0 right-0 z-10 m-2">
                        <div className="flex items-center gap-1 bg-yellow-400/90 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                          <span className="material-symbols-outlined !text-sm" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                          <span>Top Rated</span>
                        </div>
                      </div>
                    )}
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[16/10] bg-cover" 
                      data-alt={`${attraction.name}`}
                      style={{backgroundImage: `url('${attraction.image}')`}}
                    ></div>
                    <div className="flex w-full grow flex-col items-stretch justify-between gap-3 p-4">
                      <div className="flex flex-col gap-2">
                        <div className={`inline-block self-start ${getTypeColorClasses(attraction.typeColor)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                          {attraction.type}
                        </div>
                        <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">{attraction.name}</p>
                        <div className="flex items-center gap-1.5 text-[#637188] dark:text-gray-400">
                          <span className="material-symbols-outlined !text-base">location_on</span>
                          <p className="text-sm font-normal">{attraction.location}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#637188] dark:text-gray-400">
                          <span className="material-symbols-outlined !text-base">route</span>
                          <p className="text-sm font-normal">{attraction.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-yellow-500 !text-lg" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                          <p className="text-[#111418] dark:text-white text-sm font-bold">
                            {attraction.rating} <span className="text-[#637188] dark:text-gray-400 font-normal">({attraction.reviews.toLocaleString()})</span>
                          </p>
                        </div>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium hover:bg-primary/90">
                          <span className="material-symbols-outlined !text-base">map</span>
                          <span className="truncate">View on Map</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Attractions;