// import { setMessageandProfileViewid } from '../actioncreate';
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { AutherazedUserId } from "../actioncreate";
// import { UserEp } from '../actioncreate';
// import '../stylecomponent/wetherstyle.css';
// import '../stylecomponent/hometitletext.css';

// const TimeDisplay = () => {
//   const [time, setTime] = useState("");

//   useEffect(() => {
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//     const updateTime = () => {
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

//   return (
//     <div className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded-md shadow-sm bg-white">
//       {time}
//     </div>
//   );
// };

// const WeatherDisplay = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="container" onClick={() => navigate('/WeatherCard')}>
//       <div className="cloud front">
//         <span className="left-front"></span>
//         <span className="right-front"></span>
//       </div>
//       <span className="sun sunshine"></span>
//       <span className="sun"></span>
//       <div className="cloud back">
//         <span className="left-back"></span>
//         <span className="right-back"></span>
//       </div>
//     </div>
//   );
// };

// const TripCard = ({ trip, navigate }) => {
//   const dispatch=useDispatch()
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'ongoing': return 'bg-green-500';
//       case 'completed': return 'bg-blue-500';
//       case 'upcoming': return 'bg-yellow-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getTravelModeIcon = (mode) => {
//     switch (mode.toLowerCase()) {
//       case 'bike': return '🏍️';
//       case 'car': return '🚗';
//       case 'train': return '🚆';
//       case 'flight': return '✈️';
//       case 'bus': return '🚌';
//       default: return '🚗';
//     }
//   };

//   // Get profile data with fallbacks
//   const profileData = trip.profile_data || {};
//   const userName = profileData.name || 'Traveler';
//   const userLocation = profileData.location || 'Unknown Location';
//   const useridforprofile=profileData.user_id || 'unknown user id '
//   const profilePicSrc = profileData.profile_picture 
//     ? `http://127.0.0.1:8002${profileData.profile_picture}`
//     : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?format&fit=crop&w=100&q=80";

//   return (
//     <div 
//       className="flex-shrink-0 w-80 snap-center group rounded-2xl h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
//       style={{ backgroundImage: `url(${trip.destination_image})` }}
//       aria-label={trip.destination_name}
//     >
//       <div className="relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 h-full bg-black/40 backdrop-blur-sm">
//         {/* User Profile Section */}
//         <div onClick={()=>{dispatch(setMessageandProfileViewid(useridforprofile)) ; navigate('/ProfileOnly');}} className="absolute top-3 left-3 right-3 flex items-center z-10">
//           <img
//             src={profilePicSrc}
//             alt={`${userName}'s profile`}
//             className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-white"
//           />
//           <div className="flex-1 min-w-0">
//             <p className="font-semibold text-white text-sm truncate">{userName}</p>
//             <p className="text-xs text-gray-200 truncate">{userLocation}</p>
//           </div>
//         </div>

//         {/* Trip Status Badge */}
//         <div className="absolute top-3 right-3 z-10">
//           <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(trip.trip_status)}`}>
//             {trip.trip_status.charAt(0).toUpperCase() + trip.trip_status.slice(1)}
//           </span>
//         </div>

//         {/* Travel Mode Icon */}
//         <div className="absolute top-12 left-3 bg-black/50 rounded-full p-2 z-10">
//           <span className="text-amber-50 text-sm">{getTravelModeIcon(trip.travel_mode)}</span>
//         </div>

//         {/* Content Section */}
//         <div className="pt-20 p-4 h-full flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
//           <div className="mb-3">
//             <h3 className="text-lg font-bold text-amber-50 truncate">{trip.destination_name}</h3>
//             <p className="text-sm text-amber-50">
//               {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
//             </p>
//           </div>

//           <div className="flex items-center mb-2 text-sm text-amber-50">
//             <span className="font-semibold mr-2">From:</span>
//             <span className="truncate">{trip.origin_name}</span>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
//             <div className="flex items-center">
//               <span className="font-semibold text-amber-50 mr-1">Duration:</span>
//               <span className="text-amber-50">{trip.trip_duration_days} days</span>
//             </div>
//             <div className="flex items-center">
//               <span className="font-semibold text-amber-50 mr-1">Distance:</span>
//               <span className="text-amber-50">{trip.total_distance_km} km</span>
//             </div>
//             <div className="flex items-center">
//               <span className="font-semibold text-amber-50 mr-1">Budget:</span>
//               <span className="text-amber-50">{formatCurrency(trip.total_budget)}</span>
//             </div>
//             <div className="flex items-center">
//               <span className="font-semibold text-amber-50 mr-1">Type:</span>
//               <span className="text-amber-50 capitalize">{trip.budget_category}</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-1 mb-3">
//             {trip.trip_types.map((type, index) => (
//               <span 
//                 key={index}
//                 className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium capitalize"
//               >
//                 {type}
//               </span>
//             ))}
//           </div>

//           <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <button 
//               className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
//               onClick={() => navigate(`/publictrip/${trip.invite_code}`)}
//             >
//               View Trip Details
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PublicTripDataCard = () => {
//   const navigate = useNavigate();
//   const [privateDatas, setPrivateDatas] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getPrivateFunc = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await axios.get("http://127.0.0.1:8006/Getprivatedata/");
//         setPrivateDatas(res.data);
//         console.log('Trip data loaded:', res.data);
//       } catch (error) {
//         console.error("Error fetching trip data:", error);
//         setError("Failed to load trips. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getPrivateFunc();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex space-x-4 px-4 py-3">
//         {[1, 2, 3].map((item) => (
//           <div key={item} className="flex-shrink-0 w-80 snap-center">
//             <div className="bg-gray-200 rounded-xl h-96 animate-pulse">
//               <div className="h-48 bg-gray-300 rounded-t-xl"></div>
//               <div className="p-4 space-y-3">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                   <div className="space-y-2">
//                     <div className="h-3 bg-gray-300 rounded w-24"></div>
//                     <div className="h-2 bg-gray-300 rounded w-16"></div>
//                   </div>
//                 </div>
//                 <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//                 <div className="h-3 bg-gray-300 rounded w-2/3"></div>
//                 <div className="h-3 bg-gray-300 rounded w-1/3"></div>
//                 <div className="h-10 bg-gray-300 rounded mt-4"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <div className="text-red-500 text-lg mb-2">⚠️</div>
//         <p className="text-gray-600">{error}</p>
//         <button 
//           onClick={() => window.location.reload()}
//           className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!privateDatas || privateDatas.trips.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <div className="text-gray-400 text-4xl mb-4">🌍</div>
//         <h3 className="text-xl font-semibold text-gray-600 mb-2">No Trips Available</h3>
//         <p className="text-gray-500">Be the first to share your travel adventure!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
//       <div className="flex flex-row items-start justify-start gap-6">
//         {privateDatas.trips.map((trip) => (
//           <TripCard key={trip.trip_id} trip={trip} navigate={navigate} />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Experience Card Component with corrected profile data
// const ExperienceCard = ({ experience }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Use the user_profile data directly from the experience object
//   const userName = experience.user_profile?.name || 'Unknown User';
//   const useridforuserprofile=experience.user_profile.user_id || 'unknown user id'
//   console.log('user idis for porfile ',useridforuserprofile)
//   const profilePicSrc = experience.user_profile?.profile_picture 
//     ? `http://127.0.0.1:8002${experience.user_profile.profile_picture}`
//     : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?format&fit=crop&w=100&q=80";

//   let mediaElement;
//   if (experience.video) {
//     const videoSrc = `http://127.0.0.1:8004${experience.video}`;
//     mediaElement = (
//       <video
//         src={videoSrc}
//         className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
//         muted
//         loop
//         preload="metadata"
//         autoPlay
//       />
//     );
//   } else if (experience.image) {
//     const imgSrc = `http://127.0.0.1:8004${experience.image}`;
//     mediaElement = (
//       <img
//         src={imgSrc}
//         alt={experience.title || experience.place_name}
//         className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
//       />
//     );
//   } else {
//     mediaElement = (
//       <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 animate-pulse">
//         No Media Available
//       </div>
//     );
//   }

//   const visitDate = new Date(experience.date_of_visit);
//   const formattedDate = visitDate.toLocaleDateString('en-US', {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric'
//   });
//    console.log('experei  ciekeke',experience)
//   return (
//     <div 
//       className="flex-shrink-0 w-80 snap-center group cursor-pointer"
//      onClick={() => {dispatch(UserEp(experience));navigate("/UserExperienceside");}}
//     >
//       <div className="relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300">
//         {mediaElement}
//         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
        
//         {/* User Profile Info */}
//         <div  className="absolute top-4 left-4 right-4 flex items-center">
//           <img
//           onClick={() => {
//           dispatch(setMessageandProfileViewid(useridforuserprofile));navigate('/ProfileOnly');}}
//             src={profilePicSrc}
//             alt={`${userName}'s profile`}
//             className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white"
//           />
//           <div className="flex-1">
//             <p className="font-bold text-white text-sm">{userName}</p>
//             <p className="text-xs text-gray-200">{formattedDate}</p>
//           </div>
//           {experience.rating && (
//             <div className="bg-black/50 rounded-full px-2 py-1">
//               <span className="text-yellow-400 text-sm font-semibold">
//                 ⭐ {experience.rating}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Experience Details */}
//         <div 
            
//         className="absolute bottom-4 left-4 right-4">
//           <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
//             {experience.title || experience.place_name}
//           </h3>
//           <p className="text-sm text-gray-200 line-clamp-2 mb-2">
//             {experience.description}
//           </p>
          
//           {/* Category and Tags */}
//           <div className="flex flex-wrap gap-2">
//             {experience.category && (
//               <span className="px-2 py-1 bg-teal-500 text-white rounded-full text-xs font-medium">
//                 {experience.category}
//               </span>
//             )}
//             {experience.tags && experience.tags.map((tag, index) => (
//               <span 
//                 key={index}
//                 className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Hover Overlay */}
//         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function HomeSide() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = localStorage.getItem("access_token");

//   const [experiences, setExperiences] = useState([]);
//   const [loadingExperiences, setLoadingExperiences] = useState(true);
//   const [errorExperiences, setErrorExperiences] = useState(null);

//   // Fetch profile and dispatch user ID
//   useEffect(() => {
//     if (!token) return;

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         dispatch(AutherazedUserId(res.data.user_id));
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
//   }, [token, dispatch]);

//   // Fetch experiences with profile data included
//   useEffect(() => {

//     const fetchExperiences = async () => {
//       try {
//         setLoadingExperiences(true);
//         setErrorExperiences(null);
//         const res = await axios.get("http://127.0.0.1:8004/TravelExperienceListAPIViewbypage/");
//         setExperiences(res.data.results || []);
//         console.log('Experiences with profiles:', res.data.results);
//       } catch (error) {
//         console.error("Error fetching experiences:", error);
//         setErrorExperiences("Failed to load experiences. Please try again later.");
//       } finally {
//         setLoadingExperiences(false);
//       }
//     };
//     fetchExperiences();
//   }, []);

//   // Navigation handler
//   const goToDashboard = (value = null) => {
//     const access_token = localStorage.getItem("access_token");
//     const refreshtoken = localStorage.getItem("refresh_token");
//     console.log('acccss ',access_token,'refreshh',refreshtoken) 
//     if (!access_token && !refreshtoken) {
//       return navigate("/RegistrationForm");
//     } else {
//       switch (value) {
//         case "Experience":
//           navigate("/ExperienceSide");
//           break;
//         case "TravelPlannerofBadget":
//           navigate("/TravelPlannerofBadget");
//           break;
//         case "CustomizePlace":
//           navigate("/CustomizePlaceSide");
//           break;
//         default:
//           navigate("/RegistrationForm");
//       }
//     }
//   };

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
//     []
//   );

//   // Loading skeleton for experiences
//   const ExperienceSkeleton = () => (
//     <div className="flex-shrink-0 w-80 snap-center">
//       <div className="bg-gray-200 rounded-xl h-96 animate-pulse">
//         <div className="h-64 bg-gray-300 rounded-t-xl"></div>
//         <div className="p-4 space-y-3">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//             <div className="space-y-2">
//               <div className="h-3 bg-gray-300 rounded w-24"></div>
//               <div className="h-2 bg-gray-300 rounded w-16"></div>
//             </div>
//           </div>
//           <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//           <div className="h-3 bg-gray-300 rounded w-full"></div>
//           <div className="h-3 bg-gray-300 rounded w-2/3"></div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white font-sans transition-colors duration-500 text-black">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
//         .scrollbar-hidden::-webkit-scrollbar { display: none; }
//         .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
//         .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
//         .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
//         @keyframes slide-in {
//           from { transform: translateY(-100px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slide-in { animation: slide-in 1s ease-out forwards; }
//       `}</style>

//       {/* Header */}
//       <header className="sticky top-0 z-50 backdrop-blur-2xl shadow-sm rounded-b-sm border-b-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-800">TripVerse</h1>
//           <div className="flex flex-col space-y-2">
//             <WeatherDisplay className="z-10 flex items-end" />
//             <TimeDisplay className="flex flex-col items-end space-y-1" />
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center bg-white">
//         <div className="min-h-screen flex flex-col items-center justify-center">
//           <div className="w-full max-w-4xl h-64 bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-8 animate-slide-in"
//             style={{
//               backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80")`
//             }}>
//             <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
//           </div>

//           <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
//             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-black">
//               Your AI-Powered Travel Companion
//             </h2>
//             <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto mb-8">
//               Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
//             </p>
//             <button
//               onClick={() => goToDashboard("Experience")}
//               className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
//               aria-label="Get started with TravelAI experience"
//             >
//               Get Started
//               <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Recent Travel Experiences */}
//       <section className="py-12 sm:py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">Recent Travel Experiences</h3>
          
//           {loadingExperiences ? (
//             <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
//               <div className="flex flex-row items-start justify-start gap-4">
//                 {[1, 2, 3].map((item) => (
//                   <ExperienceSkeleton key={item} />
//                 ))}
//               </div>
//             </div>
//           ) : errorExperiences ? (
//             <div className="text-center py-8">
//               <div className="text-red-500 text-lg mb-2">⚠️</div>
//               <p className="text-gray-600">{errorExperiences}</p>
//               <button 
//                 onClick={() => window.location.reload()}
//                 className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
//               >
//                 Retry
//               </button>
//             </div>
//           ) : experiences.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="text-gray-400 text-4xl mb-4">📸</div>
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">No Experiences Yet</h3>
//               <p className="text-gray-500">Share your first travel experience with the community!</p>
//             </div>
//           ) : (
//             <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
//               <div className="flex flex-row items-start justify-start gap-4">
//                 {experiences.map((experience, idx) => (
//                   <ExperienceCard key={experience.id || idx} experience={experience} />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Public Trip Data Section */}
//       <section className="py-12 sm:py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">Public Travel Trips</h3>
//           <PublicTripDataCard />
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-12 sm:py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">
//             Why Choose TravelAI?
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//             {features.map((feature) => (
//               <div key={feature.title} className="bg-gray-100 rounded-xl shadow-lg shadow-gray-300 hover:shadow-gray-400 transition-all duration-300 p-6 text-center">
//                 <h4 className="text-xl font-semibold text-black mb-2">{feature.title}</h4>
//                 <p className="text-black">{feature.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-12 sm:py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h3 className="text-3xl sm:text-4xl font-bold text-black mb-4">Ready to Explore?</h3>
//           <p className="text-lg text-black max-w-xl mx-auto mb-8">
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
//               onClick={() => goToDashboard("TravelPlannerofBadget")}
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
//       <footer className="bg-gray-100 py-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <p className="text-sm text-black">TravelAI © 2025 - Made with ❤️ for travelers</p>
//         </div>
//       </footer>
//     </div>
//   );
// }





import { setMessageandProfileViewid } from '../actioncreate';
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AutherazedUserId } from "../actioncreate";
import { UserEp } from '../actioncreate';
import '../stylecomponent/wetherstyle.css';
import '../stylecomponent/hometitletext.css';

// Blocked User Component
const BlockedUserMessage = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-6 text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Account Blocked
        </h2>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your account has been temporarily suspended by the administrator. 
          Please contact support if you believe this is a mistake.
        </p>
        
        {/* Support Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            For assistance, please contact:
          </p>
          <p className="text-blue-600 font-medium">
            support@smarttravel.com
          </p>
          <p className="text-gray-500 text-sm mt-1">
            or call: +1 (555) 123-4567
          </p>
        </div>
        
        {/* Action Button */}
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          Return to Home
        </button>
        
        {/* Footer */}
        <p className="text-xs text-gray-400 mt-4">
          Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

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

  return (
    <div className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded-md shadow-sm bg-white">
      {time}
    </div>
  );
};

const WeatherDisplay = () => {
  const navigate = useNavigate();
  return (
    <div className="container" onClick={() => navigate('/WeatherCard')}>
      <div className="cloud front">
        <span className="left-front"></span>
        <span className="right-front"></span>
      </div>
      <span className="sun sunshine"></span>
      <span className="sun"></span>
      <div className="cloud back">
        <span className="left-back"></span>
        <span className="right-back"></span>
      </div>
    </div>
  );
};

const TripCard = ({ trip, navigate }) => {
  const dispatch=useDispatch()
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'upcoming': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTravelModeIcon = (mode) => {
    switch (mode.toLowerCase()) {
      case 'bike': return '🏍️';
      case 'car': return '🚗';
      case 'train': return '🚆';
      case 'flight': return '✈️';
      case 'bus': return '🚌';
      default: return '🚗';
    }
  };

  // Get profile data with fallbacks
  const profileData = trip.profile_data || {};
  const userName = profileData.name || 'Traveler';
  const userLocation = profileData.location || 'Unknown Location';
  const useridforprofile=profileData.user_id || 'unknown user id '
  const profilePicSrc = profileData.profile_picture 
    ? `http://127.0.0.1:8002${profileData.profile_picture}`
    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?format&fit=crop&w=100&q=80";

  return (
    <div 
      className="flex-shrink-0 w-80 snap-center group rounded-2xl h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
      style={{ backgroundImage: `url(${trip.destination_image})` }}
      aria-label={trip.destination_name}
    >
      <div className="relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 h-full bg-black/40 backdrop-blur-sm">
        {/* User Profile Section */}
        <div onClick={()=>{dispatch(setMessageandProfileViewid(useridforprofile)) ; navigate('/ProfileOnly');}} className="absolute top-3 left-3 right-3 flex items-center z-10">
          <img
            src={profilePicSrc}
            alt={`${userName}'s profile`}
            className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-white"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{userName}</p>
            <p className="text-xs text-gray-200 truncate">{userLocation}</p>
          </div>
        </div>

        {/* Trip Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(trip.trip_status)}`}>
            {trip.trip_status.charAt(0).toUpperCase() + trip.trip_status.slice(1)}
          </span>
        </div>

        {/* Travel Mode Icon */}
        <div className="absolute top-12 left-3 bg-black/50 rounded-full p-2 z-10">
          <span className="text-amber-50 text-sm">{getTravelModeIcon(trip.travel_mode)}</span>
        </div>

        {/* Content Section */}
        <div className="pt-20 p-4 h-full flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-amber-50 truncate">{trip.destination_name}</h3>
            <p className="text-sm text-amber-50">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </p>
          </div>

          <div className="flex items-center mb-2 text-sm text-amber-50">
            <span className="font-semibold mr-2">From:</span>
            <span className="truncate">{trip.origin_name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div className="flex items-center">
              <span className="font-semibold text-amber-50 mr-1">Duration:</span>
              <span className="text-amber-50">{trip.trip_duration_days} days</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-amber-50 mr-1">Distance:</span>
              <span className="text-amber-50">{trip.total_distance_km} km</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-amber-50 mr-1">Budget:</span>
              <span className="text-amber-50">{formatCurrency(trip.total_budget)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-amber-50 mr-1">Type:</span>
              <span className="text-amber-50 capitalize">{trip.budget_category}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {trip.trip_types.map((type, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium capitalize"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate(`/publictrip/${trip.invite_code}`)}
            >
              View Trip Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicTripDataCard = () => {
  const navigate = useNavigate();
  const [privateDatas, setPrivateDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPrivateFunc = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://127.0.0.1:8006/Getprivatedata/");
        setPrivateDatas(res.data);
        console.log('Trip data loaded:', res.data);
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setError("Failed to load trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getPrivateFunc();
  }, []);

  if (loading) {
    return (
      <div className="flex space-x-4 px-4 py-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex-shrink-0 w-80 snap-center">
            <div className="bg-gray-200 rounded-xl h-96 animate-pulse">
              <div className="h-48 bg-gray-300 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                    <div className="h-2 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                <div className="h-10 bg-gray-300 rounded mt-4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!privateDatas || privateDatas.trips.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">🌍</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Trips Available</h3>
        <p className="text-gray-500">Be the first to share your travel adventure!</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
      <div className="flex flex-row items-start justify-start gap-6">
        {privateDatas.trips.map((trip) => (
          <TripCard key={trip.trip_id} trip={trip} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};

// Experience Card Component with corrected profile data
const ExperienceCard = ({ experience }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use the user_profile data directly from the experience object
  const userName = experience.user_profile?.name || 'Unknown User';
  const useridforuserprofile=experience.user_profile?.user_id || 'unknown user id'
  console.log('user idis for porfile ',useridforuserprofile)
  const profilePicSrc = experience.user_profile?.profile_picture 
    ? `http://127.0.0.1:8002${experience.user_profile.profile_picture}`
    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?format&fit=crop&w=100&q=80";

  let mediaElement;
  if (experience.video) {
    const videoSrc = `http://127.0.0.1:8004${experience.video}`;
    mediaElement = (
      <video
        src={videoSrc}
        className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        muted
        loop
        preload="metadata"
        autoPlay
      />
    );
  } else if (experience.image) {
    const imgSrc = `http://127.0.0.1:8004${experience.image}`;
    mediaElement = (
      <img
        src={imgSrc}
        alt={experience.title || experience.place_name}
        className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
    );
  } else {
    mediaElement = (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 animate-pulse">
        No Media Available
      </div>
    );
  }

  const visitDate = new Date(experience.date_of_visit);
  const formattedDate = visitDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
   console.log('experei  ciekeke',experience)
  return (
    <div 
      className="flex-shrink-0 w-80 snap-center group cursor-pointer"
     onClick={() => {dispatch(UserEp(experience));navigate("/UserExperienceside");}}
    >
      <div className="relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300">
        {mediaElement}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
        
        {/* User Profile Info */}
        <div  className="absolute top-4 left-4 right-4 flex items-center">
          <img
          onClick={() => {
          dispatch(setMessageandProfileViewid(useridforuserprofile));navigate('/ProfileOnly');}}
            src={profilePicSrc}
            alt={`${userName}'s profile`}
            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white"
          />
          <div className="flex-1">
            <p className="font-bold text-white text-sm">{userName}</p>
            <p className="text-xs text-gray-200">{formattedDate}</p>
          </div>
          {experience.rating && (
            <div className="bg-black/50 rounded-full px-2 py-1">
              <span className="text-yellow-400 text-sm font-semibold">
                ⭐ {experience.rating}
              </span>
            </div>
          )}
        </div>

        {/* Experience Details */}
        <div 
            
        className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
            {experience.title || experience.place_name}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-2">
            {experience.description}
          </p>
          
          {/* Category and Tags */}
          <div className="flex flex-wrap gap-2">
            {experience.category && (
              <span className="px-2 py-1 bg-teal-500 text-white rounded-full text-xs font-medium">
                {experience.category}
              </span>
            )}
            {experience.tags && experience.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        </div>
      </div>
    </div>
  );
};

export default function HomeSide() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [errorExperiences, setErrorExperiences] = useState(null);
  const [adminBlockbool, setAdminBlockbool] = useState(false);

  // Check block status on component mount and periodically
  useEffect(() => {
    const checkBlockStatus = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        await BlockorunBlockuser(accessToken);
      }
    };

    checkBlockStatus();
    
    // Check block status every 30 seconds
    const interval = setInterval(checkBlockStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Fixed BlockorunBlockuser function
  const BlockorunBlockuser = async (accessToken) => {
    try {
      const res = await axios.get("http://127.0.0.1:8001/authentication/GetUserdata/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('User block status:', res.data);
      setAdminBlockbool(res.data.is_blocked === true);
      
      // If user is blocked, clear tokens
      if (res.data.is_blocked === true) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (err) {
      console.log("Block status check error:", err?.response?.data || err?.message);
      // On error, assume not blocked to allow normal flow
      setAdminBlockbool(false);
    }
  };

  // Fetch profile and dispatch user ID
  useEffect(() => {
    if (!token || adminBlockbool) return;

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
  }, [token, dispatch, adminBlockbool]);

  // Fetch experiences with profile data included
  useEffect(() => {
    if (adminBlockbool) return;

    const fetchExperiences = async () => {
      try {
        setLoadingExperiences(true);
        setErrorExperiences(null);
        const res = await axios.get("http://127.0.0.1:8004/TravelExperienceListAPIViewbypage/");
        setExperiences(res.data.results || []);
        console.log('Experiences with profiles:', res.data.results);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setErrorExperiences("Failed to load experiences. Please try again later.");
      } finally {
        setLoadingExperiences(false);
      }
    };
    fetchExperiences();
  }, [adminBlockbool]);

  // Navigation handler with block check
  const goToDashboard = async (value = null) => {
    const access_token = localStorage.getItem("access_token");
    const refreshtoken = localStorage.getItem("refresh_token");
    console.log('access ',access_token,'refresh',refreshtoken);
    
    if (!access_token && !refreshtoken) {
      return navigate("/RegistrationForm");
    } else {
      // Check block status before navigation
      if (access_token) {
        await BlockorunBlockuser(access_token);
      }
      
      if (adminBlockbool) {
        return; // Don't navigate if blocked
      }

      switch (value) {
        case "Experience":
          navigate("/ExperienceSide");
          break;
        case "TravelPlannerofBadget":
          navigate("/TravelPlannerofBadget");
          break;
        case "CustomizePlace":
          navigate("/CustomizePlaceSide");
          break;
        default:
          navigate("/RegistrationForm");
      }
    }
  };

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

  // Loading skeleton for experiences
  const ExperienceSkeleton = () => (
    <div className="flex-shrink-0 w-80 snap-center">
      <div className="bg-gray-200 rounded-xl h-96 animate-pulse">
        <div className="h-64 bg-gray-300 rounded-t-xl"></div>
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-24"></div>
              <div className="h-2 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  // If user is blocked, show only the blocked message
  if (adminBlockbool) {
    return <BlockedUserMessage />;
  }

  return (
    <div className="min-h-screen bg-white font-sans transition-colors duration-500 text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        @keyframes slide-in {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 1s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl shadow-sm rounded-b-sm border-b-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">TripVerse</h1>
          <div className="flex flex-col space-y-2">
            <WeatherDisplay className="z-10 flex items-end" />
            <TimeDisplay className="flex flex-col items-end space-y-1" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl h-64 bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-8 animate-slide-in"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80")`
            }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>

          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-black">
              Your AI-Powered Travel Companion
            </h2>
            <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto mb-8">
              Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
            </p>
            <button
              onClick={() => goToDashboard("Experience")}
              className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
              aria-label="Get started with TravelAI experience"
            >
              Get Started
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Recent Travel Experiences */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">Recent Travel Experiences</h3>
          
          {loadingExperiences ? (
            <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
              <div className="flex flex-row items-start justify-start gap-4">
                {[1, 2, 3].map((item) => (
                  <ExperienceSkeleton key={item} />
                ))}
              </div>
            </div>
          ) : errorExperiences ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-2">⚠️</div>
              <p className="text-gray-600">{errorExperiences}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Experiences Yet</h3>
              <p className="text-gray-500">Share your first travel experience with the community!</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
              <div className="flex flex-row items-start justify-start gap-4">
                {experiences.map((experience, idx) => (
                  <ExperienceCard key={experience.id || idx} experience={experience} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Public Trip Data Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">Public Travel Trips</h3>
          <PublicTripDataCard />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">
            Why Choose TravelAI?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-100 rounded-xl shadow-lg shadow-gray-300 hover:shadow-gray-400 transition-all duration-300 p-6 text-center">
                <h4 className="text-xl font-semibold text-black mb-2">{feature.title}</h4>
                <p className="text-black">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-black mb-4">Ready to Explore?</h3>
          <p className="text-lg text-black max-w-xl mx-auto mb-8">
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
              onClick={() => goToDashboard("TravelPlannerofBadget")}
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
      <footer className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-black">TravelAI © 2025 - Made with ❤️ for travelers</p>
        </div>
      </footer>
    </div>
  );
}