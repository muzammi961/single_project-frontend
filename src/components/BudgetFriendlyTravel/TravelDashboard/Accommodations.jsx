import React from 'react';

const Accommodations = () => {
  const accommodations = [
    {
      id: 1,
      name: "The Grand Parisian Hotel",
      rating: 4.0,
      stars: 4,
      location: "Rue de Rivoli, 75001 Paris",
      distance: "0.8 km away",
      tags: ["Hotel", "Luxury"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWdy5yzLRIx1X0BHlHWXqM2OYsi9RjUcdmi8umg8WRRHE8b_IDnn-KhAw9rfklFnuSzGXv6EhosT34IkCBh9iL2C5gYkwQEUTwQSJpzGskSO935hiftzSukBAvR80MKOkKkQruWXzMI6XMlnXcUmeUgRcpXKVQhFxkpOzymoTFRrNLEe9NEKwecF9523Wnzgyn-wqhc5IocioFDtpn4dYkMIoab5MDJczfQfX5QylRF2pdNtwU4uFk8xxbpWbQIY8gFnjYP0sFdBw",
      featured: true,
      featuredText: "Nearest"
    },
    {
      id: 2,
      name: "Chic Boutique Apartment",
      rating: 5.0,
      stars: 5,
      location: "Le Marais, 75004 Paris",
      distance: "1.5 km away",
      tags: ["Apartment"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDRkkFHXDwBrC1HItRJlcuxCG8yG0iq4G3X-HT5V4Zq6JA9pPZ1VitNKIlj3oFUeXciMRHB1EgZhQRdfJS3KCQqbfmX9am1YOrvjP2-RJbij8jMOOjpP18NGwX0Xy6uuaVxnUbEMDl656FPKZjhQPbc4EgnzPpPF4KRbMK70dAZ9lheJLL37oUGHpMF2kwTqJIAZLyjzJQgg5UvybY8dnbxT8Eh3dkhT6PHH2zXdeAry2NZjyugdHYqM1oazmv-uEX7SMZOdyRd8Q",
      featured: false
    },
    {
      id: 3,
      name: "Le Jardin Secret B&B",
      rating: 4.5,
      stars: 4.5,
      location: "Montmartre, 75018 Paris",
      distance: "2.2 km away",
      tags: ["B&B", "Lodging"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnfMsXd0KYKJB4ipiHYf13zy5ifa2zat5OQXb9vhRaKtABCkHiMxg7PtIfELhSbYgYQxKQrYIe9IsBUd7sO56s5WZ-VOCXL-_RlFwcabbqO0VjPDEw7sLoJUZ0zu9oBDO4kNOkk33_trHL1FBWbteW2tzuxA2OhvRnCnRMG89e1UhE2KzV4sQguOZpqcvufoF8EYE9XTJs017hcdYdSX7Hu1iVPvssLwCua3ki22BRxxATZtHsPzxxt-RrOkYW7jviPzAwUJ8LnHs",
      featured: false
    },
    {
      id: 4,
      name: "Hotel Moderno",
      rating: 4.0,
      stars: 4,
      location: "Latin Quarter, 75005 Paris",
      distance: "3.1 km away",
      tags: ["Hotel"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbrcksirmlM0sl8yODXCTzNRUh4liJJGkCFwO-8msrkQcrQ4dKRa7niHYwuf7F2iVowsBuKsF503sQD-CSSq6-iVKG47HmiS9ElbmXoTahBDLGOFXyzOMQowJTKNO0R-7UmLG-GWdclPWH4OMIPXSa6Sg1SWQPLDCf3R5dTvaf8j0LGDHueBNI3-VR4MBDvaCzdACnhZlIjOV_u79K_OfgZbtAbTOdIDROTwuv2BMBIFpWMofbCbr_0ejLbDT5uqhHyXmT8lHXRQ0",
      featured: false
    },
    {
      id: 5,
      name: "The People's Hostel",
      rating: 3.0,
      stars: 3,
      location: "Belleville, 75020 Paris",
      distance: "4.5 km away",
      tags: ["Hostel"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBR3OFG4AtxaAb60iUPPr8I3c4-MCBFRr9PBWullIHFtNNr_2ECbV6CVJXrszyIo_7es-MX8nZxpCJQViMS1yoq8ZBTRunVM_dM8ZR_OUnTci8aUbgrh7mb8mmuaVWZVEVF-9ov0LPLgrtyF6fcGhWpkIIknaA-1H2xB-Vtn8z4DatcZIH-lqI_8ylhPhjbZTs7hHzq_zGtaZC-9aPA7jLzGwgu4pPrFeAlXjPWwkFckqxMpbM329mOuoqOVjp62v1lq4ctA1CqYw",
      featured: false
    },
    {
      id: 6,
      name: "Elysian Fields Hotel",
      rating: 5.0,
      stars: 5,
      location: "Champs-Élysées, 75008 Paris",
      distance: "5.0 km away",
      tags: ["Hotel", "Luxury"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDJsAr-K-pgnW40N0kZnqcKpJvJVR9HjwjYOuyrfGfHvXTPRirKfvVK2WxR5Gx6S1R45NokQC215VTJ0rN0rDjs_0nuZ6waxVJ-CQsyc5c0yGNOyhn9bNwYEK8fvzmks229boctuxmCEyiY1K2pcJmB7wFwGkkukV5Vi5AJtThvaHmNV6k2YzRXsMqCeZQt9gJH1GlQw_pRz3MdKbd3RwFeffSCVc8pguaWmkrQRbWDFo22yfKr_Nu51iZZn1ygE0Ati_sMvvguss",
      featured: false
    }
  ];

  const renderStars = (rating, totalStars = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={`star-${i}`}
          className="material-symbols-outlined text-amber-500"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span
          key="half-star"
          className="material-symbols-outlined text-gray-300 dark:text-gray-600"
        >
          star_half
        </span>
      );
    }

    const emptyStars = totalStars - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span
          key={`empty-star-${i}`}
          className="material-symbols-outlined text-gray-300 dark:text-gray-600"
        >
          star
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* TopNavBar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-b-gray-800 px-4 sm:px-6 lg:px-10 py-3 bg-white dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                <div className="size-6 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Travel Planner</h2>
              </div>
              <nav className="hidden md:flex items-center gap-9">
                <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Dashboard</a>
                <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Itinerary</a>
                <a className="text-primary text-sm font-bold leading-normal" href="#">Accommodations</a>
                <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Flights</a>
              </nav>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-background-light dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User profile picture" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCq0sXO0Xj9gKou41ydWZr9DbQRwM_XUwhUYMicbDh5n6z7EWVOnBAyrFatG6RKq0jmz-uNmqFcmTPJ7D89bCI1NyJbHWIxHCz__HgGw-qlEXgwRGgVVX4x2EEgoDn0mP-mggVCwh3fMtJnltJi66X07E-ofu-VXchjrgHNEnuPhzhHy4c4RJN27kJG3wMlyT39jcaIGL0k_hPYWr2e9vOdrto0hc7GI9O59flEBjML24PmfKBU8dO_hz2y5EeKDgQcOW_QY5rsRA")'}}></div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-10 flex-1 py-8">
            <div className="layout-content-container flex flex-col max-w-7xl mx-auto flex-1">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium leading-normal" href="#">Trip to Paris</a>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Accommodations</span>
              </div>

              {/* PageHeading */}
              <div className="flex flex-wrap justify-between gap-4 p-4 items-center">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Accommodations for Trip to Paris</p>
                  <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">Find and book your stay from our curated list.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 h-12 overflow-hidden rounded-lg bg-primary text-white text-base font-bold leading-normal tracking-tight min-w-[120px] transition-transform hover:scale-105 active:scale-100">
                  <span className="material-symbols-outlined">add</span>
                  <span>Add Stay</span>
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 px-4 py-5 border-y border-gray-200 dark:border-gray-800 my-6">
                <div className="flex-grow">
                  <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                      <div className="text-gray-500 dark:text-gray-400 flex border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
                        <span className="material-symbols-outlined text-2xl">search</span>
                      </div>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-opacity-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark h-full placeholder:text-gray-500 dark:placeholder:text-gray-500 px-4 border-l-0 text-base font-normal leading-normal" 
                        placeholder="Search by name or address..." 
                        defaultValue=""
                      />
                    </div>
                  </label>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 px-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Type</p>
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">expand_more</span>
                  </button>
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 px-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Rating</p>
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">expand_more</span>
                  </button>
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 px-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Distance</p>
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">expand_more</span>
                  </button>
                  <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 px-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Sort By</p>
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">expand_more</span>
                  </button>
                </div>
              </div>

              {/* Accommodations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
                {accommodations.map((accommodation) => (
                  <div
                    key={accommodation.id}
                    className={`flex flex-col bg-white dark:bg-background-dark rounded-xl overflow-hidden transition-transform hover:-translate-y-1 ${
                      accommodation.featured 
                        ? 'border-2 border-primary shadow-lg' 
                        : 'border border-gray-200 dark:border-gray-800 shadow-md'
                    }`}
                  >
                    {accommodation.featured && (
                      <div className="absolute top-3 right-3 bg-primary/20 text-primary text-xs font-bold py-1 px-3 rounded-full">
                        {accommodation.featuredText}
                      </div>
                    )}
                    <div 
                      className="h-48 bg-cover bg-center" 
                      data-alt={`Exterior view of ${accommodation.name}`}
                      style={{ backgroundImage: `url('${accommodation.image}')` }}
                    ></div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{accommodation.name}</h3>
                      <div className="flex items-center my-2">
                        {renderStars(accommodation.stars)}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({accommodation.rating})</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {accommodation.location} | {accommodation.distance}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {accommodation.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              accommodation.featured
                                ? 'bg-primary/20 text-primary'
                                : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto pt-4">
                        <button
                          className={`w-full flex items-center justify-center gap-2 px-4 py-3 h-auto overflow-hidden rounded-lg text-base font-bold leading-normal tracking-tight transition-transform ${
                            accommodation.featured
                              ? 'bg-primary text-white hover:scale-105 active:scale-100'
                              : 'bg-primary/20 text-primary hover:bg-primary/30'
                          }`}
                        >
                          Book Now
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

export default Accommodations;