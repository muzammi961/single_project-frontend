// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import WeatherCard from "./WeatherCard";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import {AutherazedUserId} from '../actioncreate'

// export default function HomeSide() {
//  const [time, setTime] = useState(""); 
//  useEffect(() => {
//     const updateTime = () => {
//       const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//       const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];  
//       const today = new Date();
//       const dayName = days[today.getDay()];      
//       const day = String(today.getDate()).padStart(2, "0");
//       const monthName = months[today.getMonth()];
//       const year = today.getFullYear();
//       const hours = String(today.getHours()).padStart(2, "0");     
//       const minutes = String(today.getMinutes()).padStart(2, "0"); 
//       const seconds = String(today.getSeconds()).padStart(2, "0"); 
//       setTime(`${dayName}, ${day}-${monthName}-${year} ${hours}:${minutes}:${seconds}`);
//     };
//     updateTime();
//     const interval = setInterval(updateTime, 1000);
//     return () => clearInterval(interval); 
//   }, []); 

//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem("access_token");


//   const goToDashboard = (value = null) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return navigate("/RegistrationForm");

//     if (value === "Experience") navigate("/ExperienceSide");
//     else if (value === "Expense") console.log("Expense");
//     else if (value === "CustomizePlace") console.log("CustomizePlace");
//     else navigate("/RegistrationForm");
//   };




// const dispatchvalue = useDispatch();

// const token=localStorage.getItem("access_token");
// useEffect(()=>{
//     let addfunc=async()=>{
//      try {
//       const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//      dispatchvalue(AutherazedUserId(res.data.user_id)); 
//      let vlaues=res.data
//      console.log('value is sof porfil',vlaues)
//     }catch(e){
//       console.log('errror')
//     }

//     }
//     addfunc()
// },[token])




      


//   const destinations = [
//     {
//       name: "Paris, France",
//       image:
//         "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
//       description: "Experience the romance of the Eiffel Tower and charming cafes.",
//       rating: 4.8,
//       review: "A magical city! The food and culture were unforgettable.",
//     },
//     {
//       name: "Tokyo, Japan",
//       image:
//         "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
//       description: "Discover vibrant city life and serene temples.",
//       rating: 4.7,
//       review: "Loved the blend of tradition and modernity!",
//     },
//     {
//       name: "New York, USA",
//       image:
//         "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
//       description: "Explore the city that never sleeps.",
//       rating: 4.6,
//       review: "The energy of NYC is unmatched!",
//     },
//   ];

//   const userPosts = [
//     {
//       userName: "Emma Traveler",
//       profileImage:
//         "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
//       timestamp: "2 days ago",
//       content:
//         "Had an amazing time in Santorini! The AI planner made it so easy to explore the island’s beauty. Highly recommend! #travel #santorini",
//       postImage:
//         "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80",
//     },
//     {
//       userName: "John Explorer",
//       profileImage:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
//       timestamp: "1 week ago",
//       content:
//         "The budget optimization feature saved me hundreds in Bali! Perfect trip, amazing beaches. #bali #travelai",
//       postImage:
//         "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
//     },
//     {
//       userName: "Sarah Wanderlust",
//       profileImage:
//         "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80",
//       timestamp: "3 days ago",
//       content:
//         "Loved the AI recommendations for Rome. Perfect itinerary for a week of adventure! #rome #travel",
//       postImage:
//         "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
//     },
//   ];

//   // Animated headline shapes
//   const letters = [
//     {
//       path: "M 12 4 H 52 V 12 H 36 V 60 H 28 V 12 H 12 Z",
//       gradientId: "gradient1",
//       animationClass:
//         "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//     },
//     {
//       path: "M 12 4 V 60 M 12 4 H 40 Q 52 4 52 16 V 20 Q 52 32 40 32 H 12 M 32 32 L 52 60",
//       gradientId: "gradient2",
//       animationClass:
//         "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
//     },
//     {
//       path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
//       gradientId: "gradient3",
//       animationClass:
//         "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//     },
//     {
//       path: "M 12 4 L 32 60 L 52 4",
//       gradientId: "gradient4",
//       animationClass:
//         "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//     },
//     {
//       path: "M 12 4 V 60 H 52 M 12 32 H 44 M 12 4 H 52",
//       gradientId: "gradient5",
//       animationClass:
//         "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
//     },
//     {
//       path: "M 12 4 V 60 H 52",
//       gradientId: "gradient1",
//       animationClass:
//         "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//     },
//     {
//       path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
//       gradientId: "gradient2",
//       animationClass:
//         "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//     },
//     {
//       path: "M 20 4 H 44 M 32 4 V 60 M 20 60 H 44",
//       gradientId: "gradient3",
//       animationClass:
//         "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
//     },
//   ];

//   function Letter({ path, gradientId, animationClass }) {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 64 64"
//         height="64"
//         width="64"
//         className="inline-block"
//       >
//         <path
//           strokeLinejoin="round"
//           strokeLinecap="round"
//           strokeWidth="8"
//           stroke={`url(#${gradientId})`}
//           d={path}
//           className={animationClass}
//           pathLength="360"
//         />
//       </svg>
//     );
//   }

//   function GradientDefs() {
//     return (
//       <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
//         <defs>
//           <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient1">
//             <stop stopColor="#973BED" />
//             <stop stopColor="#007CFF" offset="1" />
//           </linearGradient>
//           <linearGradient y2="0" x2="0" y1="64" x1="0" id="gradient2">
//             <stop stopColor="#FFC800" />
//             <stop stopColor="#F0F" offset="1" />
//             <animateTransform
//               repeatCount="indefinite"
//               keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
//               keyTimes="0; 0.25; 0.5; 0.75; 1"
//               dur="8s"
//               values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
//               type="rotate"
//               attributeName="gradientTransform"
//             />
//           </linearGradient>
//           <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient3">
//             <stop stopColor="#00E0ED" />
//             <stop stopColor="#00DA72" offset="1" />
//           </linearGradient>
//           <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient4">
//             <stop stopColor="#FF6B6B" />
//             <stop stopColor="#4ECDC4" offset="1" />
//           </linearGradient>
//           <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient5">
//             <stop stopColor="#A8E6CF" />
//             <stop stopColor="#FFD93D" offset="1" />
//           </linearGradient>
//         </defs>
//       </svg>
//     );
//   }

//   function TextSection() {
//     return (
//       <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
        
//         <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-400 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
//           Your AI-Powered Travel Companion
//         </h2>
//         <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-pulse">
//           Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
//         </p>
//         <button
//           onClick={() => goToDashboard("Experience")}
//           className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
//           aria-label="Get started with TravelAI experience"
//         >
//           Get Started
//           <svg
//             className="ml-2 w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//           </svg>
//         </button>
//       </div>
//     );
//   }



//   // Helpers
//   const heroBg =
//     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80";

//   const ratingStars = useMemo(
//     () => [...Array(5)].map((_, i) => i),
//     []
//   );

//   return (
//     <div className="min-h-screen bg-black font-sans transition-colors duration-500 text-white">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-teal-500 dark:text-teal-400">TravelAI</h1>
//           <div className="text-sm text-gray-200 dark:text-gray-100">
//            {time}
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="relative min-h-screen flex items-center justify-center">
//         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroBg}")` }}>
//           <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
//         </div>

//         <div className="min-h-screen flex flex-col items-center justify-center">
//           <div className="flex gap-1 drop-shadow-lg">
//             <GradientDefs />
//             {letters.map((letter, idx) => (
//               <div key={idx} className={idx === 6 ? "w-2" : ""}>
//                 <Letter {...letter} />
//               </div>
//             ))}
//           </div>
//           <TextSection />
//         </div>
//       </section>

//       {/* Social feed */}
//       <section className="py-12 sm:py-16 bg-black">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">User Experiences</h3>
//           <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
//             {userPosts.map((post, idx) => (
//               <div
//                 key={idx}
//                 className="flex-none w-80 sm:w-96 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center"
//               >
//                 <div className="relative">
//                   <div className="border border-teal-500/50 dark:border-teal-400/50 rounded-lg overflow-hidden">
//                     <img
//                       src={post.postImage}
//                       alt={post.userName}
//                       className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
//                     />
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-5">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={post.profileImage}
//                           className="w-12 h-12 rounded-full object-cover border-2 border-teal-400/30"
//                           alt="Profile"
//                         />
//                         <div>
//                           <p className="text-sm font-bold text-white">{post.userName}</p>
//                           <p className="text-xs text-gray-200">{post.timestamp}</p>
//                         </div>
//                       </div>
//                       <button className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-medium rounded-lg shadow shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">
//                         Follow
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
//                   <div className="flex space-x-8">
//                     <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-6 h-6 transform hover:scale-110 transition-transform duration-200 fill-current text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
//                         />
//                       </svg>
//                       <span className="text-sm font-medium text-white">54.1K</span>
//                     </button>
//                     <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         className="w-6 h-6 transform hover:scale-110 transition-transform duration-200"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                         />
//                       </svg>
//                       <span className="text-sm font-medium text-white">173</span>
//                     </button>
//                     <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         className="w-6 h-6 transform hover:scale-110 transition-transform duration-200"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M4 12v.01M12 20v.01M20 12v.01M12 4v.01M7.05 7.05l9.9 9.9M16.95 7.05l-9.9 9.9"
//                         />
//                       </svg>
//                       <span className="text-sm font-medium text-white">173</span>
//                     </button>
//                   </div>
//                   <span className="text-sm font-medium text-gray-200">26.9K views</span>
//                 </div>

//                 <div className="px-4 sm:px-5 pb-4">
//                   <p className="text-sm text-white line-clamp-3">{post.content}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Top Destinations */}
//       <section className="py-12 sm:py-16 bg-black">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">Top Destinations</h3>
//           <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
//             {destinations.map((dest, index) => (
//               <div
//                 key={index}
//                 className="flex-none w-80 sm:w-96 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center"
//               >
//                 <div className="border border-teal-500/50 dark:border-teal-400/50 rounded-t-xl overflow-hidden">
//                   <img
//                     src={dest.image}
//                     alt={dest.name}
//                     className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-5">
//                   <h4 className="text-xl font-semibold text-white">{dest.name}</h4>
//                   <p className="text-sm text-gray-200 mt-2 line-clamp-2">{dest.description}</p>
//                   <div className="flex items-center mt-3">
//                     <div className="flex text-yellow-400">
//                       {ratingStars.map((i) => (
//                         <svg
//                           key={i}
//                           className={`w-5 h-5 ${
//                             i < Math.round(dest.rating) ? "fill-current" : "fill-none stroke-current"
//                           }`}
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M12 4.354l2.094 4.237 4.684.682-3.39 3.305.8 4.662L12 15.354l-4.188 2.086.8-4.662-3.39-3.305 4.684-.682L12 4.354z"
//                           />
//                         </svg>
//                       ))}
//                     </div>
//                     <span className="ml-2 text-sm text-gray-200">{dest.rating}</span>
//                   </div>
//                   <p className="text-sm italic text-gray-300 mt-3">"{dest.review}"</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-12 sm:py-16 bg-black">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
//             Why Choose TravelAI?
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//             {[
//               {
//                 title: "Personalized Itineraries",
//                 text: "Tailored travel plans designed just for you.",
//               },
//               {
//                 title: "Budget Optimization",
//                 text: "Save money with smart travel planning.",
//               },
//               {
//                 title: "AI Recommendations",
//                 text: "Discover the best destinations with AI insights.",
//               },
//             ].map((f) => (
//               <div
//                 key={f.title}
//                 className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center"
//               >
//                 <h4 className="text-xl font-semibold text-white mb-2">{f.title}</h4>
//                 <p className="text-gray-200">{f.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-12 sm:py-16 bg-black">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Explore?</h3>
//           <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8">
//             Start your journey with TravelAI and make every trip unforgettable.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               onClick={() => goToDashboard("Experience")}
//               className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
//             >
//               Experience
//             </button>
//             <button
//               onClick={() => goToDashboard("Expense")}
//               className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
//             >
//               Expense
//             </button>
//             <button
//               onClick={() => goToDashboard("CustomizePlace")}
//               className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
//             >
//               Customize Place
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg py-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <p className="text-sm text-gray-200">TravelAI © 2025 - Made with ❤️ for travelers</p>
//         </div>
//       </footer>


//       {/* Inline utilities only (no separate CSS file) */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
//         .animate-fade-in { animation: fadeIn .5s ease-in-out; }
//         @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
//         .scrollbar-thin::-webkit-scrollbar{height:8px}
//         .scrollbar-thin::-webkit-scrollbar-thumb{background-color:#14b8a6;border-radius:4px}
//         .scrollbar-thin::-webkit-scrollbar-track{background-color:#e5e7eb}
//         .dark .scrollbar-thin::-webkit-scrollbar-track{background-color:#374151}
//       `}</style>
//     </div>
//   );
// }





























import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AutherazedUserId } from "../actioncreate";

// Separate TimeDisplay component to avoid re-renders in parent
const TimeDisplay = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const updateTime = () => {
      const today = new Date();
      const dayName = days[today.getDay()];
      const day = String(today.getDate()).padStart(2, "0");
      const monthName = months[today.getMonth()];
      const year = today.getFullYear();
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");
      setTime(`${dayName}, ${day}-${monthName}-${year} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className="text-sm text-gray-200">{time}</div>;
};

// WeatherDisplay component (hardcoded based on provided image)
const WeatherDisplay = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 flex items-center space-x-2 min-w-0 flex-1 mr-4" onClick={()=>navigate('\WeatherCard')}>
      <div className="text-xs text-gray-300 truncate">Hongkong</div>
      <div className="flex items-center space-x-1">
        <svg
          className="w-4 h-4 text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
        <div className="text-xs text-blue-300">24°</div>
      </div>
      <div className="text-xs text-gray-400 ml-auto">09:30 - 03:08</div>
    </div>
  );
};

export default function HomeSide() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  // Fetch profile and dispatch user ID
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(AutherazedUserId(res.data.user_id));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token, dispatch]);

  // Navigation handler
  const goToDashboard = (value = null) => {
    if (!token) {
      return navigate("/RegistrationForm");
    }

    switch (value) {
      case "Experience":
        navigate("/ExperienceSide");
        break;
      case "Expense":
        navigate("/ExpenseSide"); // Assuming path; adjust if needed
        break;
      case "CustomizePlace":
        navigate("/CustomizePlaceSide"); // Assuming path; adjust if needed
        break;
      default:
        navigate("/RegistrationForm");
    }
  };

  // Hardcoded data
  const destinations = useMemo(
    () => [
      {
        name: "Paris, France",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        description: "Experience the romance of the Eiffel Tower and charming cafes.",
        rating: 4.8,
        review: "A magical city! The food and culture were unforgettable.",
      },
      {
        name: "Tokyo, Japan",
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
        description: "Discover vibrant city life and serene temples.",
        rating: 4.7,
        review: "Loved the blend of tradition and modernity!",
      },
      {
        name: "New York, USA",
        image:
          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
        description: "Explore the city that never sleeps.",
        rating: 4.6,
        review: "The energy of NYC is unmatched!",
      },
    ],
    []
  );

  const userPosts = useMemo(
    () => [
      {
        userName: "Emma Traveler",
        profileImage:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        timestamp: "2 days ago",
        content:
          "Had an amazing time in Santorini! The AI planner made it so easy to explore the island’s beauty. Highly recommend! #travel #santorini",
        postImage:
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80",
        likes: "54.1K",
        comments: "173",
        shares: "89",
        views: "26.9K",
      },
      {
        userName: "John Explorer",
        profileImage:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        timestamp: "1 week ago",
        content:
          "The budget optimization feature saved me hundreds in Bali! Perfect trip, amazing beaches. #bali #travelai",
        postImage:
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        likes: "32.5K",
        comments: "245",
        shares: "156",
        views: "18.4K",
      },
      {
        userName: "Sarah Wanderlust",
        profileImage:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80",
        timestamp: "3 days ago",
        content:
          "Loved the AI recommendations for Rome. Perfect itinerary for a week of adventure! #rome #travel",
        postImage:
          "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
        likes: "67.2K",
        comments: "301",
        shares: "234",
        views: "41.7K",
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        title: "Personalized Itineraries",
        text: "Tailored travel plans designed just for you.",
      },
      {
        title: "Budget Optimization",
        text: "Save money with smart travel planning.",
      },
      {
        title: "AI Recommendations",
        text: "Discover the best destinations with AI insights.",
      },
    ],
    []
  );

  // Animated headline letters data
  const letters = useMemo(
    () => [
      {
        path: "M 12 4 H 52 V 12 H 36 V 60 H 28 V 12 H 12 Z",
        gradientId: "gradient1",
        animationClass:
          "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
      },
      {
        path: "M 12 4 V 60 M 12 4 H 40 Q 52 4 52 16 V 20 Q 52 32 40 32 H 12 M 32 32 L 52 60",
        gradientId: "gradient2",
        animationClass:
          "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
      },
      {
        path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
        gradientId: "gradient3",
        animationClass:
          "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
      },
      {
        path: "M 12 4 L 32 60 L 52 4",
        gradientId: "gradient4",
        animationClass:
          "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
      },
      {
        path: "M 12 4 V 60 H 52 M 12 32 H 44 M 12 4 H 52",
        gradientId: "gradient5",
        animationClass:
          "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
      },
      {
        path: "M 12 4 V 60 H 52",
        gradientId: "gradient1",
        animationClass:
          "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
      },
      {
        path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
        gradientId: "gradient2",
        animationClass:
          "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
      },
      {
        path: "M 20 4 H 44 M 32 4 V 60 M 20 60 H 44",
        gradientId: "gradient3",
        animationClass:
          "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
      },
    ],
    []
  );

  // Rating stars helper
  const ratingStars = useMemo(() => [...Array(5)].map((_, i) => i), []);

  // Hero background
  const heroBg =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80";

  // Sub-components
  const Letter = ({ path, gradientId, animationClass }) => (
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
        pathLength="1"
      />
    </svg>
  );

  const GradientDefs = () => (
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

  const TextSection = () => (
    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-400 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
        Your AI-Powered Travel Companion
      </h2>
      <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-pulse">
        Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
      </p>
      <button
        onClick={() => goToDashboard("Experience")}
        className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
        aria-label="Get started with TravelAI experience"
      >
        Get Started
        <svg
          className="ml-2 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );

  const PostCard = ({ post }) => (
    <div className="flex-none w-80 sm:w-96 bg-white/15 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center">
      <div className="relative">
        <div className="border border-teal-500/50 rounded-lg overflow-hidden">
          <img
            src={post.postImage}
            alt={post.content}
            className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={post.profileImage}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-400/30"
                alt={`${post.userName}'s profile`}
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
            <span className="text-sm font-medium text-white">{post.likes}</span>
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
            <span className="text-sm font-medium text-white">{post.comments}</span>
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
            <span className="text-sm font-medium text-white">{post.shares}</span>
          </button>
        </div>
        <span className="text-sm font-medium text-gray-200">{post.views} views</span>
      </div>

      <div className="px-4 sm:px-5 pb-4">
        <p className="text-sm text-white line-clamp-3">{post.content}</p>
      </div>
    </div>
  );

  const DestinationCard = ({ dest }) => (
    <div className="flex-none w-80 sm:w-96 bg-white/15 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center">
      <div className="border border-teal-500/50 rounded-t-xl overflow-hidden">
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
            {ratingStars.map((i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(dest.rating) ? "fill-current" : "fill-none stroke-current"
                }`}
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
  );

  const FeatureCard = ({ feature }) => (
    <div className="bg-white/15 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center">
      <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
      <p className="text-gray-200">{feature.text}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black font-sans transition-colors duration-500 text-white">
      {/* Inline styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .animate-fade-in { animation: fadeIn .5s ease-in-out; }
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/15 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-500">TravelAI</h1>
          <div className="flex items-center space-x-4">
            <WeatherDisplay />
            <TimeDisplay />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroBg}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="flex gap-1 drop-shadow-lg">
            <GradientDefs />
            {letters.map((letter, idx) => (
              <div key={idx} className={idx === 6 ? "w-2" : ""}>
                <Letter {...letter} />
              </div>
            ))}
          </div>
          <TextSection />
        </div>
      </section>

      {/* User Experiences */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">User Experiences</h3>
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
            {userPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">Top Destinations</h3>
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
            {destinations.map((dest, index) => (
              <DestinationCard key={index} dest={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            Why Choose TravelAI?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Explore?</h3>
          <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Start your journey with TravelAI and make every trip unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => goToDashboard("Experience")}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Experience
            </button>
            <button
              onClick={() => goToDashboard("Expense")}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Expense
            </button>
            <button
              onClick={() => goToDashboard("CustomizePlace")}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Customize Place
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/15 backdrop-blur-lg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-200">TravelAI © 2025 - Made with ❤️ for travelers</p>
        </div>
      </footer>
    </div>
  );
}












// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { useDispatch } from "react-redux"
// import { AutherazedUserId } from "../actioncreate"

// // Separate TimeDisplay component to avoid re-renders in parent
// const TimeDisplay = ({ token }) => {
//   const [time, setTime] = useState("")
//   const colors = useMemo(() => {
//     const colorMap = {
//       user1: "text-red-500",
//       user2: "text-blue-500",
//       user3: "text-green-500",
//       // Add more token-based colors as needed
//     }
//     return colorMap[token] || "text-gray-200"
//   }, [token])

//   useEffect(() => {
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ]

//     const updateTime = () => {
//       const today = new Date()
//       const dayName = days[today.getDay()]
//       const day = String(today.getDate()).padStart(2, "0")
//       const monthName = months[today.getMonth()]
//       const year = today.getFullYear()
//       const hours = String(today.getHours()).padStart(2, "0")
//       const minutes = String(today.getMinutes()).padStart(2, "0")
//       const seconds = String(today.getSeconds()).padStart(2, "0")
//       setTime(`${dayName}, ${day}-${monthName}-${year} ${hours}:${minutes}:${seconds}`)
//     }

//     updateTime()
//     const interval = setInterval(updateTime, 1000)
//     return () => clearInterval(interval)
//   }, [])

//   return <div className={`text-xs font-mono tracking-tight ${colors}`}>{time}</div>
// }

// // WeatherDisplay component (hardcoded based on provided image)
// const WeatherDisplay = () => {
//   const navigate = useNavigate()
//   return (
//     <div
//       className="cursor-pointer rounded-xl ring-1 ring-border bg-muted/40 hover:bg-muted/60 backdrop-blur-md p-2.5 flex items-center gap-2 min-w-0 flex-1 mr-4 transition-colors"
//       role="button"
//       tabIndex={0}
//       onClick={() => navigate("\\WeatherCard")}
//       aria-label="Open weather details"
//     >
//       <div className="text-xs text-muted-foreground truncate">Hongkong</div>
//       <div className="flex items-center gap-1">
//         <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
//           />
//         </svg>
//         <div className="text-xs text-primary">24°</div>
//       </div>
//       <div className="text-xs text-muted-foreground ml-auto">09:30 - 03:08</div>
//     </div>
//   )
// }

// export default function HomeSide() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const token = localStorage.getItem("access_token")

//   // Fetch profile and dispatch user ID
//   useEffect(() => {
//     if (!token) return

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         dispatch(AutherazedUserId(res.data.user_id))
//       } catch (error) {
//         console.error("Error fetching profile:", error)
//       }
//     }

//     fetchProfile()
//   }, [token, dispatch])

//   // Navigation handler
//   const goToDashboard = (value = null) => {
//     if (!token) {
//       return navigate("/RegistrationForm")
//     }

//     switch (value) {
//       case "Experience":
//         navigate("/ExperienceSide")
//         break
//       case "Expense":
//         navigate("/ExpenseSide") // Assuming path; adjust if needed
//         break
//       case "CustomizePlace":
//         navigate("/CustomizePlaceSide") // Assuming path; adjust if needed
//         break
//       default:
//         navigate("/RegistrationForm")
//     }
//   }

//   // Hardcoded data
//   const destinations = useMemo(
//     () => [
//       {
//         name: "Paris, France",
//         image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
//         description: "Experience the romance of the Eiffel Tower and charming cafes.",
//         rating: 4.8,
//         review: "A magical city! The food and culture were unforgettable.",
//       },
//       {
//         name: "Tokyo, Japan",
//         image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
//         description: "Discover vibrant city life and serene temples.",
//         rating: 4.7,
//         review: "Loved the blend of tradition and modernity!",
//       },
//       {
//         name: "New York, USA",
//         image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
//         description: "Explore the city that never sleeps.",
//         rating: 4.6,
//         review: "The energy of NYC is unmatched!",
//       },
//     ],
//     [],
//   )

//   const userPosts = useMemo(
//     () => [
//       {
//         userName: "Emma Traveler",
//         profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
//         timestamp: "2 days ago",
//         content:
//           "Had an amazing time in Santorini! The AI planner made it so easy to explore the island’s beauty. Highly recommend! #travel #santorini",
//         postImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80",
//         likes: "54.1K",
//         comments: "173",
//         shares: "89",
//         views: "26.9K",
//       },
//       {
//         userName: "John Explorer",
//         profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
//         timestamp: "1 week ago",
//         content:
//           "The budget optimization feature saved me hundreds in Bali! Perfect trip, amazing beaches. #bali #travelai",
//         postImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
//         likes: "32.5K",
//         comments: "245",
//         shares: "156",
//         views: "18.4K",
//       },
//       {
//         userName: "Sarah Wanderlust",
//         profileImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80",
//         timestamp: "3 days ago",
//         content: "Loved the AI recommendations for Rome. Perfect itinerary for a week of adventure! #rome #travel",
//         postImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
//         likes: "67.2K",
//         comments: "301",
//         shares: "234",
//         views: "41.7K",
//       },
//     ],
//     [],
//   )

//   const features = useMemo(
//     () => [
//       {
//         title: "Personalized Itineraries",
//         text: "Tailored travel plans designed just for you.",
//       },
//       {
//         title: "Budget Optimization",
//         text: "Save money with smart travel planning.",
//       },
//       {
//         title: "AI Recommendations",
//         text: "Discover the best destinations with AI insights.",
//       },
//     ],
//     [],
//   )

//   // Animated headline letters data
//   const letters = useMemo(
//     () => [
//       {
//         path: "M 12 4 H 52 V 12 H 36 V 60 H 28 V 12 H 12 Z",
//         gradientId: "gradient1",
//         animationClass: "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite_infinite]",
//       },
//       {
//         path: "M 12 4 V 60 M 12 4 H 40 Q 52 4 52 16 V 20 Q 52 32 40 32 H 12 M 32 32 L 52 60",
//         gradientId: "gradient2",
//         animationClass:
//           "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite_infinite,pulse_4s_ease-in-out_infinite]",
//       },
//       {
//         path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
//         gradientId: "gradient3",
//         animationClass:
//           "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//       },
//       {
//         path: "M 12 4 L 32 60 L 52 4",
//         gradientId: "gradient4",
//         animationClass: "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite_infinite]",
//       },
//       {
//         path: "M 12 4 V 60 H 52 M 12 32 H 44 M 12 4 H 52",
//         gradientId: "gradient5",
//         animationClass:
//           "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite_infinite,pulse_4s_ease-in-out_infinite]",
//       },
//       {
//         path: "M 12 4 V 60 H 52",
//         gradientId: "gradient1",
//         animationClass: "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite_infinite]",
//       },
//       {
//         path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
//         gradientId: "gradient2",
//         animationClass:
//           "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
//       },
//       {
//         path: "M 20 4 H 44 M 32 4 V 60 M 20 60 H 44",
//         gradientId: "gradient3",
//         animationClass:
//           "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite_infinite,pulse_4s_ease-in-out_infinite]",
//       },
//     ],
//     [],
//   )

//   // Rating stars helper
//   const ratingStars = useMemo(() => [...Array(5)].map((_, i) => i), [])

//   // Hero background
//   const heroBg = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80"

//   // Sub-components
//   const Letter = ({ path, gradientId, animationClass }) => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 64 64"
//       height="64"
//       width="64"
//       className="inline-block"
//     >
//       <path
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         strokeWidth="8"
//         stroke={`url(#${gradientId})`}
//         d={path}
//         className={animationClass}
//         pathLength="1"
//       />
//     </svg>
//   )

//   const GradientDefs = () => (
//     <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
//       <defs>
//         <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient1">
//           <stop stopColor="#06b6d4" />
//           <stop stopColor="#0ea5a8" offset="1" />
//         </linearGradient>
//         <linearGradient y2="0" x2="0" y1="64" x1="0" id="gradient2">
//           <stop stopColor="#fbbf24" />
//           <stop stopColor="#f59e0b" offset="1" />
//           <animateTransform
//             repeatCount="indefinite"
//             keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
//             keyTimes="0; 0.25; 0.5; 0.75; 1"
//             dur="8s"
//             values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
//             type="rotate"
//             attributeName="gradientTransform"
//           />
//         </linearGradient>
//         <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient3">
//           <stop stopColor="#22d3ee" />
//           <stop stopColor="#14b8a6" offset="1" />
//         </linearGradient>
//         <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient4">
//           <stop stopColor="#2dd4bf" />
//           <stop stopColor="#22d3ee" offset="1" />
//         </linearGradient>
//         <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient5">
//           <stop stopColor="#fde68a" />
//           <stop stopColor="#fbbf24" offset="1" />
//         </linearGradient>
//       </defs>
//     </svg>
//   )

//   const TextSection = () => (
//     <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
//       <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-balance text-primary mb-4">
//         Your AI-Powered Travel Companion
//       </h2>
//       <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
//         Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
//       </p>
//       <button
//         onClick={() => goToDashboard("Experience")}
//         className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-medium shadow-lg hover:bg-primary/90 transition-colors"
//         aria-label="Get started with TravelAI experience"
//       >
//         Get Started
//         <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//         </svg>
//       </button>
//     </div>
//   )

//   const PostCard = ({ post }) => (
//     <div className="flex-none w-80 sm:w-96 rounded-2xl overflow-hidden bg-card/70 ring-1 ring-border shadow-lg hover:shadow-xl transition-shadow duration-300 snap-center">
//       <div className="relative">
//         <div className="rounded-lg overflow-hidden ring-1 ring-border">
//           <img
//             src={post.postImage || "/placeholder.svg"}
//             alt={post.content}
//             className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
//           />
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4 sm:p-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <img
//                 src={post.profileImage || "/placeholder.svg"}
//                 className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
//                 alt={`${post.userName}'s profile`}
//               />
//               <div>
//                 <p className="text-sm font-semibold">{post.userName}</p>
//                 <p className="text-xs text-muted-foreground">{post.timestamp}</p>
//               </div>
//             </div>
//             <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md shadow hover:bg-primary/90 transition-colors">
//               Follow
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-6">
//           <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
//               />
//             </svg>
//             <span className="text-sm font-medium">{post.likes}</span>
//           </button>
//           <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-5 h-5"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//               />
//             </svg>
//             <span className="text-sm font-medium">{post.comments}</span>
//           </button>
//           <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-5 h-5"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 12v.01M12 20v.01M20 12v.01M12 4v.01M7.05 7.05l9.9 9.9M16.95 7.05l-9.9 9.9"
//               />
//             </svg>
//             <span className="text-sm font-medium">{post.shares}</span>
//           </button>
//         </div>
//         <span className="text-sm font-medium text-muted-foreground">{post.views} views</span>
//       </div>

//       <div className="px-4 sm:px-5 pb-4">
//         <p className="text-sm text-pretty">{post.content}</p>
//       </div>
//     </div>
//   )

//   const DestinationCard = ({ dest }) => (
//     <div className="flex-none w-80 sm:w-96 bg-card/70 rounded-xl ring-1 ring-border shadow-lg hover:shadow-xl transition-shadow duration-300 snap-center">
//       <div className="rounded-t-xl overflow-hidden ring-1 ring-border">
//         <img
//           src={dest.image || "/placeholder.svg"}
//           alt={dest.name}
//           className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
//         />
//       </div>
//       <div className="p-5">
//         <h4 className="text-lg font-semibold">{dest.name}</h4>
//         <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{dest.description}</p>
//         <div className="flex items-center mt-3">
//           <div className="flex text-amber-400">
//             {ratingStars.map((i) => (
//               <svg
//                 key={i}
//                 className={`w-5 h-5 ${i < Math.round(dest.rating) ? "fill-current" : "fill-none stroke-current"}`}
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4.354l2.094 4.237 4.684.682-3.39 3.305.8 4.662L12 15.354l-4.188 2.086.8-4.662-3.39-3.305 4.684-.682L12 4.354z"
//                 />
//               </svg>
//             ))}
//           </div>
//           <span className="ml-2 text-sm text-muted-foreground">{dest.rating}</span>
//         </div>
//         <p className="text-sm italic text-muted-foreground mt-3">"{dest.review}"</p>
//       </div>
//     </div>
//   )

//   const FeatureCard = ({ feature }) => (
//     <div className="rounded-xl bg-card/70 ring-1 ring-border shadow-lg p-6 text-center">
//       <h4 className="text-lg font-semibold mb-1.5">{feature.title}</h4>
//       <p className="text-sm text-muted-foreground">{feature.text}</p>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-500">
//       {/* Inline styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
//         .scrollbar-hidden::-webkit-scrollbar { display: none; }
//         .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
//         .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//         .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
//       `}</style>

//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-muted/40 backdrop-blur-md border-b border-border">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
//           <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">TravelAI</h1>
//           <div className="flex items-center gap-3">
//             <WeatherDisplay />
//             <TimeDisplay token={token} />
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="relative min-h-screen flex items-center justify-center">
//         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroBg}")` }}>
//           <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60" />
//         </div>

//         <div className="min-h-screen flex flex-col items-center justify-center">
//           <div className="flex gap-1 drop-shadow-lg">
//             <GradientDefs />
//             {letters.map((letter, idx) => (
//               <div key={idx} className={idx === 6 ? "w-2" : ""}>
//                 <Letter {...letter} />
//               </div>
//             ))}
//           </div>
//           <TextSection />
//         </div>
//       </section>

//       {/* User Experiences */}
//       <section className="py-12 sm:py-16">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-2xl sm:text-4xl font-bold text-center mb-8">User Experiences</h3>
//           <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
//             {userPosts.map((post, idx) => (
//               <PostCard key={idx} post={post} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Top Destinations */}
//       <section className="py-12 sm:py-16">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-2xl sm:text-4xl font-bold text-center mb-8">Top Destinations</h3>
//           <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
//             {destinations.map((dest, index) => (
//               <DestinationCard key={index} dest={dest} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-12 sm:py-16 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-center mb-8">Why Choose TravelAI?</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//             {features.map((feature) => (
//               <FeatureCard key={feature.title} feature={feature} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-12 sm:py-16 bg-background">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h3 className="text-2xl sm:text-4xl font-bold mb-3">Ready to Explore?</h3>
//           <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
//             Start your journey with TravelAI and make every trip unforgettable.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
//             <button
//               onClick={() => goToDashboard("Experience")}
//               className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
//             >
//               Experience
//             </button>
//             <button
//               onClick={() => goToDashboard("Expense")}
//               className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
//             >
//               Expense
//             </button>
//             <button
//               onClick={() => goToDashboard("CustomizePlace")}
//               className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
//             >
//               Customize Place
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-muted/40 backdrop-blur-md border-t border-border py-6">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <p className="text-sm text-muted-foreground">TravelAI © 2025 - Made with ❤️ for travelers</p>
//         </div>
//       </footer>
//     </div>
//   )
// }
