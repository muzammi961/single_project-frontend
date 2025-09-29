import React from 'react';
import { useNavigate,Link } from "react-router-dom";
const HomeSide = () => {
   const navigate = useNavigate(); 

   const goToDashboard = (value=null) => {
    const token = localStorage.getItem("access_token");

    if (value=="Experience" && token) {
      console.log('looo ddd')
      navigate("/ExperienceSide"); 
    }else if(value=="Expense" && token){
        console.log('expense')
    }else if(value=="CustomizePlace" && token){
      console.log('customizeplace');
      
    } else{
      navigate("/GoogleLoginButton");
    }
  };
  const destinations = [
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'Experience the romance of the Eiffel Tower and charming cafes.',
      rating: 4.8,
      review: 'A magical city! The food and culture were unforgettable.',
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      description: 'Discover vibrant city life and serene temples.',
      rating: 4.7,
      review: 'Loved the blend of tradition and modernity!',
    },
    {
      name: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      description: 'Explore the city that never sleeps.',
      rating: 4.6,
      review: 'The energy of NYC is unmatched!',
    },
  ];

  // Mock data for User Experiences
  const userPosts = [
    {
      userName: 'Emma Traveler',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      timestamp: '2 days ago',
      content: 'Had an amazing time in Santorini! The AI planner made it so easy to explore the island’s beauty. Highly recommend! #travel #santorini',
      postImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80',
    },
    {
      userName: 'John Explorer',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      timestamp: '1 week ago',
      content: 'The budget optimization feature saved me hundreds in Bali! Perfect trip, amazing beaches. #bali #travelai',
      postImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    },
    {
      userName: 'Sarah Wanderlust',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80',
      timestamp: '3 days ago',
      content: 'Loved the AI recommendations for Rome. Perfect itinerary for a week of adventure! #rome #travel',
      postImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    },
  ];





                                         // animationsection
   const letters = [
    {
      path: "M 12 4 H 52 V 12 H 36 V 60 H 28 V 12 H 12 Z",
      gradientId: "gradient1",
      animationClass: "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 4 V 60 M 12 4 H 40 Q 52 4 52 16 V 20 Q 52 32 40 32 H 12 M 32 32 L 52 60",
      gradientId: "gradient2",
      animationClass: "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
    },
    {
      path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
      gradientId: "gradient3",
      animationClass: "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 4 L 32 60 L 52 4",
      gradientId: "gradient4",
      animationClass: "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 4 V 60 H 52 M 12 32 H 44 M 12 4 H 52",
      gradientId: "gradient5",
      animationClass: "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
    },
    {
      path: "M 12 4 V 60 H 52",
      gradientId: "gradient1",
      animationClass: "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
      gradientId: "gradient2",
      animationClass: "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 20 4 H 44 M 32 4 V 60 M 20 60 H 44",
      gradientId: "gradient3",
      animationClass: "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
    },
];
function TextSection() {
  return (
    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-400 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
        Your AI-Powered Travel Companion
      </h2>
      <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-pulse">
        Plan personalized trips, optimize your budget, and create unforgettable itineraries with TravelAI.
      </p>
     <button
    onClick={()=>goToDashboard("Experience")}
    className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
    aria-label="Get started with TravelAI experience"
  >
    Get Started
        <svg
          className="ml-2 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  );
}

function Letter({ path, gradientId, animationClass }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 64 64"
      height="64"
      width="64"
      className="inline-block"
    >
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="8"
        stroke={`url(#${gradientId})`}
        d={path}
        className={animationClass}
        pathLength="360"
      />
    </svg>
  );
}
function GradientDefs() {
  return (
    <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
      <defs>
        <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient1">
          <stop stopColor="#973BED" />
          <stop stopColor="#007CFF" offset="1" />
        </linearGradient>
        <linearGradient y2="0" x2="0" y1="64" x1="0" id="gradient2">
          <stop stopColor="#FFC800" />
          <stop stopColor="#F0F" offset="1" />
          <animateTransform
            repeatCount="indefinite"
            keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
            keyTimes="0; 0.25; 0.5; 0.75; 1"
            dur="8s"
            values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
            type="rotate"
            attributeName="gradientTransform"
          />
        </linearGradient>
        <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient3">
          <stop stopColor="#00E0ED" />
          <stop stopColor="#00DA72" offset="1" />
        </linearGradient>
        <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient4">
          <stop stopColor="#FF6B6B" />
          <stop stopColor="#4ECDC4" offset="1" />
        </linearGradient>
        <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient5">
          <stop stopColor="#A8E6CF" />
          <stop stopColor="#FFD93D" offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

  return (
    <div className="min-h-screen bg-black font-sans transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-500 dark:text-teal-400">TravelAI</h1>
          <div className="text-sm text-gray-200 dark:text-gray-100">
            {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>


        </div>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="flex gap-1 drop-shadow-lg">
        <GradientDefs />
        {letters.map((letter, index) => (
          <div key={index} className={index === 6 ? "w-2" : ""}>
            <Letter {...letter} />
          </div>
        ))}
      </div>
      <TextSection />
    </div>



      </section>
    {/* User Experiences / Social Feed Section */}

       <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            User Experiences
          </h3>
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
            {userPosts.map((post, index) => (
              <div
                key={index}
                className="flex-none w-80 sm:w-96 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center"
              >
                <div className="relative">
                  <div className="border border-teal-500/50 dark:border-teal-400/50 rounded-lg overflow-hidden">
                    <img
                      src={post.postImage}
                      alt={post.userName}
                      className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={post.profileImage}
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-400/30"
                          alt="Profile"
                        />
                        <div>
                          <p className="text-sm font-bold text-white">{post.userName}</p>
                          <p className="text-xs text-gray-200">{post.timestamp}</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-medium rounded-lg shadow shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
                  <div className="flex space-x-8">
                    <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 transform hover:scale-110 transition-transform duration-200 fill-current text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">54.1K</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 transform hover:scale-110 transition-transform duration-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">173</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 transform hover:scale-110 transition-transform duration-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 12v.01M12 20v.01M20 12v.01M12 4v.01M7.05 7.05l9.9 9.9M16.95 7.05l-9.9 9.9"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">173</span>
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-200">26.9K views</span>
                </div>
                <div className="px-4 sm:px-5 pb-4">
                  <p className="text-sm text-white line-clamp-3">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Destinations Carousel */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            Top Destinations
          </h3>
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="flex-none w-80 sm:w-96 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center"
              >
                <div className="border border-teal-500/50 dark:border-teal-400/50 rounded-t-xl overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-semibold text-white">{dest.name}</h4>
                  <p className="text-sm text-gray-200 mt-2 line-clamp-2">{dest.description}</p>
                  <div className="flex items-center mt-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(dest.rating) ? 'fill-current' : 'fill-none stroke-current'}`}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354l2.094 4.237 4.684.682-3.39 3.305.8 4.662L12 15.354l-4.188 2.086.8-4.662-3.39-3.305 4.684-.682L12 4.354z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-200">{dest.rating}</span>
                  </div>
                  <p className="text-sm italic text-gray-300 mt-3">"{dest.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            Why Choose TravelAI?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center">
              <svg
                className="w-12 h-12 mx-auto text-teal-500 dark:text-teal-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553-2.276A1 1 0 0021 13.382V6.618a1 1 0 00-1.447-.894L15 8"
                ></path>
              </svg>
              <h4 className="text-xl font-semibold text-white mb-2">Personalized Itineraries</h4>
              <p className="text-gray-200">Tailored travel plans designed just for you.</p>
            </div>
            <div className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center">
              <svg
                className="w-12 h-12 mx-auto text-teal-500 dark:text-teal-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h4 className="text-xl font-semibold text-white mb-2">Budget Optimization</h4>
              <p className="text-gray-200">Save money with smart travel planning.</p>
            </div>
            <div className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center">
              <svg
                className="w-12 h-12 mx-auto text-teal-500 dark:text-teal-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143 15.714 12l2.286 6.857L12 15.714 6.286 18.571l2.286-6.857L3 9.143 8.714 12z"
                ></path>
              </svg>
              <h4 className="text-xl font-semibold text-white mb-2">AI Recommendations</h4>
              <p className="text-gray-200">Discover the best destinations with AI insights.</p>
            </div>
          </div>
        </div>
      </section>

  
     

      {/* Call-to-Action Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Explore?
          </h3>
          <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Start your journey with TravelAI and make every trip unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={()=>goToDashboard("Experience")} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">Experience</button> 
          <button onClick={()=>goToDashboard("Expense")} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">Expense</button>
          <button onClick={()=>goToDashboard("CustomizePlace")} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">Customize Place</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-200">
            TravelAI © 2025 - Made with ❤️ for travelers
          </p>
        </div>
      </footer>

      {/* Global Styles for Plus Jakarta Sans and Scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #14b8a6;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: #e5e7eb;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-track {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default HomeSide;