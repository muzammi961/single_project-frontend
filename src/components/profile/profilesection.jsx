// import axios from "axios";
// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// // ========== Travel Experiences Section Component ==========
// const TravelExperiencesSection = () => {
//   const [experiences, setExperiences] = useState([]);
//   const [filteredExperiences, setFilteredExperiences] = useState([]);
//   const [activeTab, setActiveTab] = useState("All");
//   const [selectedExperience, setSelectedExperience] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [hoveredExperience, setHoveredExperience] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("access_token");
//   const baseUrl = "http://127.0.0.1:8004";

//   // Fetch experiences from API
//   const fetchExperiences = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://127.0.0.1:8004/TravalExperienceGetApiView",{
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log(response.data)
      
//       if (response.data && response.data.data) {
//         const experiencesData = response.data.data.map(exp => ({
//           ...exp,
//           // Determine media type and URL
//           media: exp.video ? 
//             { type: "video", url: `${baseUrl}${exp.video}`, poster: null } :
//             exp.image ? 
//             { type: "image", url: `${baseUrl}${exp.image}` } : 
//             null
//         }));
        
//         setExperiences(experiencesData);
//         setFilteredExperiences(experiencesData);
//       }
//     } catch (error) {
//       console.error("Error fetching experiences:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchExperiences();
//     }
//   }, [token]);

//   // Filter experiences based on active tab
//   useEffect(() => {
//     if (activeTab === "All") {
//       setFilteredExperiences(experiences);
//     } else if (activeTab === "Images") {
//       setFilteredExperiences(experiences.filter(exp => exp.image));
//     } else if (activeTab === "Videos") {
//       setFilteredExperiences(experiences.filter(exp => exp.video));
//     }
//   }, [activeTab, experiences]);

//   const handleExperienceClick = (experience) => {
//     setSelectedExperience(experience);
//     setShowDetailModal(true);
//   };

//   const handleMouseEnter = (experienceId) => {
//     setHoveredExperience(experienceId);
//   };

//   const handleMouseLeave = () => {
//     setHoveredExperience(null);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "No date specified";
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Experience Card Component
//   const ExperienceCard = ({ experience }) => {
//     const hasMedia = experience.media !== null;
//     const isHovered = hoveredExperience === experience.id;

//     return (
//       <div 
//         className="group relative bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl border border-teal-500/30 overflow-hidden shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-102 cursor-pointer"
//         onClick={() => handleExperienceClick(experience)}
//         onMouseEnter={() => handleMouseEnter(experience.id)}
//         onMouseLeave={handleMouseLeave}
//       >
//         {/* Media Display */}
//         <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-black">
//           {hasMedia ? (
//             experience.media.type === "video" ? (
//               <video
//                 className="w-full h-full object-cover"
//                 poster={experience.media.poster}
//                 preload="metadata"
//               >
//                 <source src={experience.media.url} type="video/mp4" />
//               </video>
//             ) : (
//               <img
//                 src={experience.media.url}
//                 alt={experience.title}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 loading="lazy"
//               />
//             )
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
//               <span className="material-symbols-outlined text-teal-400 text-4xl">
//                 {experience.category === "Nature" ? "landscape" : 
//                  experience.category === "Adventure" ? "hiking" :
//                  experience.category === "Cultural" ? "account_balance" :
//                  experience.category === "Historical" ? "history" :
//                  experience.category === "Food" ? "restaurant" :
//                  experience.category === "Relaxation" ? "beach_access" :
//                  "place"}
//               </span>
//             </div>
//           )}

//           {/* Video Play Icon */}
//           {hasMedia && experience.media.type === "video" && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//               <span className="material-symbols-outlined text-white text-4xl">
//                 play_arrow
//               </span>
//             </div>
//           )}

//           {/* Rating Badge */}
//           {experience.rating > 0 && (
//             <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
//               <span className="material-symbols-outlined text-yellow-400 text-sm">
//                 star
//               </span>
//               <span className="text-white text-xs font-semibold">
//                 {experience.rating.toFixed(1)}
//               </span>
//             </div>
//           )}

//           {/* Hover Overlay with Details */}
//           {isHovered && (
//             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between p-4">
//               {/* Top Section */}
//               <div className="text-white">
//                 <h3 className="text-lg font-bold mb-2 line-clamp-2">
//                   {experience.title}
//                 </h3>
//                 <div className="flex items-center gap-1 text-sm mb-1">
//                   <span className="material-symbols-outlined text-base">location_on</span>
//                   <span className="line-clamp-1">{experience.place_name}</span>
//                 </div>
//                 <div className="flex items-center gap-1 text-sm">
//                   <span className="material-symbols-outlined text-base">category</span>
//                   <span>{experience.category}</span>
//                 </div>
//               </div>

//               {/* Middle Section */}
//               <div className="text-white text-sm">
//                 <p className="text-gray-300 line-clamp-2 mb-2">
//                   {experience.description}
//                 </p>
//                 {experience.date_of_visit && (
//                   <div className="flex items-center gap-1 text-xs">
//                     <span className="material-symbols-outlined text-base">calendar_today</span>
//                     <span>Visited: {formatDate(experience.date_of_visit)}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Bottom Section */}
//               <div className="flex justify-between items-center text-white text-xs">
//                 <div className="flex items-center gap-2">
//                   <span className={`px-2 py-1 rounded-full ${
//                     experience.sentiment === "Positive" ? "bg-green-500/80" :
//                     experience.sentiment === "Negative" ? "bg-red-500/80" :
//                     "bg-yellow-500/80"
//                   }`}>
//                     {experience.sentiment || "Neutral"}
//                   </span>
//                   <span className="bg-teal-500/80 px-2 py-1 rounded-full">
//                     {experience.privacy}
//                   </span>
//                 </div>
//                 <span className="text-gray-300">
//                   {new Date(experience.created_at).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Static engagement indicators */}
//           <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//             <div className="bg-black/50 rounded px-2 py-1 text-xs text-white flex items-center gap-1">
//               <span className="material-symbols-outlined text-sm">star</span>
//               <span>{experience.rating > 0 ? experience.rating.toFixed(1) : "N/A"}</span>
//             </div>
//           </div>
//         </div>

//         {/* Basic info always visible */}
//         <div className="p-3">
//           <h3 className="font-semibold text-white text-sm line-clamp-1">
//             {experience.title}
//           </h3>
//           <p className="text-gray-300 text-xs line-clamp-1">
//             {experience.place_name}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Experience Detail Modal

















//   // const ExperienceDetailModal = () => {
//   //   if (!selectedExperience) return null;

//   //   return (
//   //     <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//   //       <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
//   //         {/* Left Side - Media */}
//   //         <div className="md:w-1/2 bg-black flex flex-col">
//   //           <div className="flex-1 flex items-center justify-center p-4">
//   //             {selectedExperience.media ? (
//   //               selectedExperience.media.type === "video" ? (
//   //                 <div className="w-full">
//   //                  <video
//   //                     controls
//   //                     autoPlay
//   //                     muted // Required for autoplay
//   //                     className="w-full h-full object-contain max-h-[70vh] rounded-lg"
//   //                     poster={selectedExperience.media.poster}
//   //                   >
//   //                     <source src={selectedExperience.media.url} type="video/mp4" />
//   //                     Your browser does not support the video tag.
//   //                   </video>
//   //                 </div>
//   //               ) : (
//   //                <img
//   //                   src={selectedExperience.media.url}
//   //                   alt={selectedExperience.title}
//   //                   className="w-full h-full object-contain max-h-[70vh] rounded-lg"
//   //                   onError={(e) => {
//   //                     // Fallback if image fails to load
//   //                     e.target.style.display = 'none';
//   //                   }}
//   //                 />
//   //               )
//   //             ) : (
//   //               <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg">
//   //                 <span className="material-symbols-outlined text-teal-400 text-6xl">
//   //                   {selectedExperience.category === "Nature" ? "landscape" : 
//   //                    selectedExperience.category === "Adventure" ? "hiking" :
//   //                    selectedExperience.category === "Cultural" ? "account_balance" :
//   //                    selectedExperience.category === "Historical" ? "history" :
//   //                    selectedExperience.category === "Food" ? "restaurant" :
//   //                    selectedExperience.category === "Relaxation" ? "beach_access" :
//   //                    "place"}
//   //                 </span>
//   //               </div>
//   //             )}
//   //           </div>
//   //         </div>

//   //         {/* Right Side - Details */}
//   //         <div className="md:w-1/2 flex flex-col bg-white text-black">
//   //           {/* Header */}
//   //           <div className="p-6 border-b">
//   //             <div className="flex justify-between items-start">
//   //               <div>
//   //                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//   //                   {selectedExperience.title}
//   //                 </h2>
//   //                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//   //                   <span className="material-symbols-outlined text-base">location_on</span>
//   //                   <span>{selectedExperience.place_name}</span>
//   //                 </div>
//   //               </div>
//   //               <button
//   //                 onClick={() => setShowDetailModal(false)}
//   //                 className="text-gray-500 hover:text-gray-700"
//   //               >
//   //                 <span className="material-symbols-outlined">close</span>
//   //               </button>
//   //             </div>
//   //           </div>

//   //           {/* Details */}
//   //           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//   //             {/* Description */}
//   //             <div>
//   //               <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
//   //               <p className="text-gray-700">{selectedExperience.description}</p>
//   //             </div>

//   //             {/* Details Grid */}
//   //             <div className="grid grid-cols-2 gap-4">
//   //               <div>
//   //                 <h4 className="font-semibold text-gray-900 text-sm">Category</h4>
//   //                 <p className="text-gray-600">{selectedExperience.category}</p>
//   //               </div>
//   //               <div>
//   //                 <h4 className="font-semibold text-gray-900 text-sm">Rating</h4>
//   //                 <div className="flex items-center gap-1">
//   //                   <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
//   //                   <span className="text-gray-600">
//   //                     {selectedExperience.rating > 0 ? selectedExperience.rating.toFixed(1) : "Not rated"}
//   //                   </span>
//   //                 </div>
//   //               </div>
//   //               <div>
//   //                 <h4 className="font-semibold text-gray-900 text-sm">Date Visited</h4>
//   //                 <p className="text-gray-600">{formatDate(selectedExperience.date_of_visit)}</p>
//   //               </div>
//   //               <div>
//   //                 <h4 className="font-semibold text-gray-900 text-sm">Privacy</h4>
//   //                 <p className="text-gray-600">{selectedExperience.privacy}</p>
//   //               </div>
//   //               <div>
//   //                 <h4 className="font-semibold text-gray-900 text-sm">Sentiment</h4>
//   //                 <span className={`px-2 py-1 rounded-full text-xs ${
//   //                   selectedExperience.sentiment === "Positive" ? "bg-green-100 text-green-800" :
//   //                   selectedExperience.sentiment === "Negative" ? "bg-red-100 text-red-800" :
//   //                   "bg-yellow-100 text-yellow-800"
//   //                 }`}>
//   //                   {selectedExperience.sentiment || "Neutral"}
//   //                 </span>
//   //               </div>
//   //               <div>
//   //                 <h4 className="font-semibold text-gray-900 text-sm">Created</h4>
//   //                 <p className="text-gray-600">
//   //                   {new Date(selectedExperience.created_at).toLocaleDateString()}
//   //                 </p>
//   //               </div>
//   //             </div>

//   //             {/* Tags */}
//   //             {selectedExperience.tags && selectedExperience.tags.length > 0 && (
//   //               <div>
//   //                 <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
//   //                 <div className="flex flex-wrap gap-2">
//   //                   {selectedExperience.tags.map((tag, index) => (
//   //                     <span
//   //                       key={index}
//   //                       className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
//   //                     >
//   //                       #{tag}
//   //                     </span>
//   //                   ))}
//   //                 </div>
//   //               </div>
//   //             )}

//   //             {/* Location */}
//   //             <div>
//   //               <h3 className="font-semibold text-gray-900 mb-2">Location Coordinates</h3>
//   //               <div className="text-sm text-gray-600">
//   //                 <p>Latitude: {selectedExperience.latitude}</p>
//   //                 <p>Longitude: {selectedExperience.longitude}</p>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // };











//   const ExperienceDetailModal = () => {
//   // Internal state for self-containment
//   const [selectedExperience, setSelectedExperience] = React.useState(null);
//   const [showDetailModal, setShowDetailModal] = React.useState(false);
//   const [newComment, setNewComment] = React.useState("");
//   const [comments, setComments] = React.useState([]);

//   // Mock data or assume passed via props; for self-containment, use mock
//   React.useEffect(() => {
//     // Mock selectedExperience; in real use, set from parent
//     setSelectedExperience({
//       id: 1,
//       title: "Sample Adventure",
//       description: "A wonderful experience in the mountains.",
//       place_name: "Mountains",
//       category: "Adventure",
//       rating: 4.5,
//       date_of_visit: "2025-10-01",
//       tags: ["hiking", "nature"],
//       media: { type: "image", url: "https://via.placeholder.com/600x400" }, // Mock media
//       privacy: "Public",
//       sentiment: "Positive",
//       created_at: new Date().toISOString(),
//       latitude: 40.7128,
//       longitude: -74.0060,
//       userName: "User",
//       userProfilePicture: "",
//       likes: 150,
//       comments: []
//     });
//     setShowDetailModal(true);
//     setComments([
//       { id: 1, userName: "Traveler1", content: "Amazing view!", timestamp: new Date().toISOString() },
//       { id: 2, userName: "Explorer2", content: "Loved the hike!", timestamp: new Date(Date.now() - 86400000).toISOString() }
//     ]);
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const handleAddComment = () => {
//     if (newComment.trim() === "") return;
//     const updatedComments = [
//       ...comments,
//       {
//         id: Date.now(),
//         userName: "You",
//         content: newComment,
//         timestamp: new Date().toISOString(),
//       },
//     ];
//     setComments(updatedComments);
//     setNewComment("");
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case "Nature": return "landscape";
//       case "Adventure": return "hiking";
//       case "Cultural": return "account_balance";
//       case "Historical": return "history";
//       case "Food": return "restaurant";
//       case "Relaxation": return "beach_access";
//       default: return "place";
//     }
//   };

//   if (!selectedExperience || !showDetailModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4">
//       <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
//         {/* Left Side - Media (Flexible and Responsive) */}
//         <div className="lg:w-1/2 bg-black flex flex-col relative">
//           <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-[40vh] lg:min-h-[70vh]">
//             {selectedExperience.media ? (
//               selectedExperience.media.type === "video" ? (
//                 <video
//                   controls
//                   autoPlay
//                   muted
//                   loop
//                   className="w-full h-full object-contain max-h-full rounded-lg"
//                   poster={selectedExperience.media.poster}
//                   onError={(e) => {
//                     console.error("Video load error");
//                   }}
//                 >
//                   <source src={selectedExperience.media.url} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <img
//                   src={selectedExperience.media.url}
//                   alt={selectedExperience.title}
//                   className="w-full h-full object-contain max-h-full rounded-lg"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                     const fallback = e.target.parentNode.appendChild(document.createElement("div"));
//                     fallback.className = "w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg";
//                     fallback.innerHTML = `<span class="material-symbols-outlined text-teal-400 text-6xl">${getCategoryIcon(selectedExperience.category)}</span>`;
//                   }}
//                 />
//               )
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg">
//                 <span className="material-symbols-outlined text-teal-400 text-6xl">
//                   {getCategoryIcon(selectedExperience.category)}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Media Controls Bar */}
//           <div className="p-3 border-t border-gray-700 bg-black/80">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4 text-white">
//                 <button className="flex items-center space-x-1 hover:text-teal-400 transition">
//                   <span className="material-symbols-outlined">favorite</span>
//                   <span>{selectedExperience.likes || 0}</span>
//                 </button>
//                 <button className="flex items-center space-x-1 hover:text-teal-400 transition">
//                   <span className="material-symbols-outlined">chat_bubble</span>
//                   <span>{comments.length}</span>
//                 </button>
//                 <button className="flex items-center space-x-1 hover:text-teal-400 transition">
//                   <span className="material-symbols-outlined">share</span>
//                 </button>
//               </div>
//               <button className="flex items-center space-x-1 text-white hover:text-teal-400 transition">
//                 <span className="material-symbols-outlined">bookmark</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Details & Comments */}
//         <div className="lg:w-1/2 flex flex-col bg-white text-black">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 bg-cover" 
//                    style={{ backgroundImage: `url(${selectedExperience.userProfilePicture || ""})` }} />
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-sm">{selectedExperience.userName || "User"}</p>
//                 <p className="text-xs text-gray-500">{selectedExperience.place_name}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowDetailModal(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <span className="material-symbols-outlined">close</span>
//             </button>
//           </div>

//           {/* Post Content & Details */}
//           <div className="p-4 border-b space-y-3 max-h-48 overflow-y-auto">
//             <h3 className="font-bold text-lg">{selectedExperience.title}</h3>
//             <p className="text-gray-700">{selectedExperience.description}</p>
            
//             <div className="flex items-center space-x-4 text-sm text-gray-600">
//               <div className="flex items-center space-x-1">
//                 <span className="material-symbols-outlined text-base">category</span>
//                 <span>{selectedExperience.category}</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <span className="material-symbols-outlined text-yellow-400 text-base">star</span>
//                 <span>{selectedExperience.rating > 0 ? selectedExperience.rating.toFixed(1) : "Not rated"}</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <span className="material-symbols-outlined text-base">calendar_today</span>
//                 <span>{formatDate(selectedExperience.date_of_visit)}</span>
//               </div>
//             </div>

//             {selectedExperience.tags && selectedExperience.tags.length > 0 && (
//               <div className="flex flex-wrap gap-1">
//                 {selectedExperience.tags.map((tag, index) => (
//                   <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {/* Location Coordinates */}
//             <div className="text-xs text-gray-500">
//               <p>Latitude: {selectedExperience.latitude || "N/A"}</p>
//               <p>Longitude: {selectedExperience.longitude || "N/A"}</p>
//             </div>

//             {/* Additional Details Grid */}
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <h4 className="font-semibold text-gray-900 text-sm">Privacy</h4>
//                 <p className="text-gray-600">{selectedExperience.privacy}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-gray-900 text-sm">Sentiment</h4>
//                 <span className={`px-2 py-1 rounded-full text-xs ${
//                   selectedExperience.sentiment === "Positive" ? "bg-green-100 text-green-800" :
//                   selectedExperience.sentiment === "Negative" ? "bg-red-100 text-red-800" :
//                   "bg-yellow-100 text-yellow-800"
//                 }`}>
//                   {selectedExperience.sentiment || "Neutral"}
//                 </span>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-gray-900 text-sm">Created</h4>
//                 <p className="text-gray-600">
//                   {new Date(selectedExperience.created_at).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Comments Section */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {comments.length > 0 ? (
//               comments.map((comment) => (
//                 <div key={comment.id} className="flex space-x-3">
//                   <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
//                     {comment.userName.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                       <p className="font-semibold text-sm">{comment.userName}</p>
//                       <span className="text-gray-500 text-xs">
//                         {new Date(comment.timestamp).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p className="text-gray-700 mt-1">{comment.content}</p>
//                     <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
//                       <button className="hover:text-teal-600">Like</button>
//                       <button className="hover:text-teal-600">Reply</button>
//                       <button className="hover:text-teal-600">Share</button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
//                 <p>No comments yet. Be the first to comment!</p>
//               </div>
//             )}
//           </div>

//           {/* Add Comment Section */}
//           <div className="p-4 border-t border-gray-200">
//             <div className="flex items-center space-x-2 mb-3">
//               <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-600 text-sm">
//                 <span className="material-symbols-outlined text-base">favorite</span>
//                 <span>Like</span>
//               </button>
//               <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-600 text-sm">
//                 <span className="material-symbols-outlined text-base">reply</span>
//                 <span>Reply</span>
//               </button>
//             </div>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment..."
//                 className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
//               />
//               <button
//                 onClick={handleAddComment}
//                 disabled={!newComment.trim()}
//                 className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Post
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
















  
//   if (loading) {
//     return (
//       <section className="max-w-7xl mx-auto">
//         <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//           <span className="material-symbols-outlined text-teal-400">flight</span>
//           Travel Experiences
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, index) => (
//             <div key={index} className="animate-pulse">
//               <div className="bg-white/10 h-56 sm:h-64 lg:h-72 rounded-t-xl"></div>
//               <div className="p-3 space-y-2">
//                 <div className="h-4 bg-white/10 rounded"></div>
//                 <div className="h-3 bg-white/10 rounded w-2/3"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto">
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//         <span className="material-symbols-outlined text-teal-400">flight</span>
//         Travel Experiences
//       </h2>

//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-700 mb-6">
//         {["All", "Images", "Videos"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-3 px-4 text-center font-semibold text-sm ${
//               activeTab === tab
//                 ? "text-teal-400 border-b-2 border-teal-400"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             {tab} ({tab === "All" ? experiences.length : 
//                     tab === "Images" ? experiences.filter(exp => exp.image).length :
//                     experiences.filter(exp => exp.video).length})
                    
//           </button>
//         ))}
//       </div>

//       {/* Experiences Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {filteredExperiences.length > 0 ? (
//           filteredExperiences.map((experience) => (
//             <ExperienceCard key={experience.id} experience={experience} />
//           ))
//         ) : (
//           <div className="col-span-full text-center py-12">
//             <span className="material-symbols-outlined text-teal-400 text-6xl mb-4">
//               travel_explore
//             </span>
//             <p className="text-gray-400 text-lg">No travel experiences found</p>
//             <p className="text-gray-500 text-sm mt-2">
//               {activeTab !== "All" ? `Try switching to "All" tab` : "Start adding your travel experiences!"}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Detail Modal */}
//       {showDetailModal && <ExperienceDetailModal />}
//     </section>
//   );
// };

// // ========== Travel History Section ==========
// const TravelHistorySection = () => {
//   const [travelHistory, setTravelHistory] = useState([
//     {
//       id: 1,
//       city: "Paris, France",
//       date: "2023-07-15",
//       image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
//       description: "Explored the charming streets and iconic Eiffel Tower. The Louvre Museum was absolutely breathtaking.",
//       duration: "5 days",
//       highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"]
//     },
//     {
//       id: 2,
//       city: "Tokyo, Japan",
//       date: "2023-05-20",
//       image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
//       description: "Immersed in vibrant culture and cutting-edge technology. The cherry blossoms were in full bloom.",
//       duration: "7 days",
//       highlights: ["Shibuya Crossing", "Tokyo Skytree", "Traditional Temples"]
//     },
//     {
//       id: 3,
//       city: "New York, USA",
//       date: "2023-03-10",
//       image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
//       description: "Experienced the bustling energy of Times Square and Broadway shows.",
//       duration: "4 days",
//       highlights: ["Central Park", "Statue of Liberty", "Broadway Show"]
//     }
//   ]);

//   const TravelHistoryCard = ({ trip, isLast }) => (
//     <div className="relative flex items-start mb-8 group animate-fade-in">
//       {!isLast && (
//         <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-teal-500/30" />
//       )}
//       <div className="flex items-start gap-4 z-10 w-full">
//         <div className="w-4 h-4 rounded-full bg-teal-500 ring-4 ring-gray-900/50 group-hover:ring-teal-500/50 transition-all duration-300 mt-2 flex-shrink-0" />
//         <div className="flex-1 rounded-xl border border-teal-500/30 bg-white/10 backdrop-blur-lg shadow-lg group-hover:shadow-teal-500/40 transition-all duration-300 transform group-hover:scale-102 overflow-hidden flex flex-col sm:flex-row">
//           <div className="sm:w-2/5 h-48 sm:h-auto">
//             <img
//               src={trip.image}
//               alt={trip.city}
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//             />
//           </div>
//           <div className="p-4 sm:p-6 flex-1">
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
//               <h3 className="font-bold text-lg text-white">{trip.city}</h3>
//               <div className="flex items-center gap-2 text-sm text-teal-400 mt-1 sm:mt-0">
//                 <span className="material-symbols-outlined text-base">calendar_today</span>
//                 <span>{trip.date}</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
//               <span className="material-symbols-outlined text-base">schedule</span>
//               <span>{trip.duration}</span>
//             </div>
//             <p className="text-gray-300 text-sm mb-3">{trip.description}</p>
//             <div className="flex flex-wrap gap-1">
//               {trip.highlights.map((highlight, index) => (
//                 <span key={index} className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
//                   {highlight}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="max-w-7xl mx-auto">
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//         <span className="material-symbols-outlined text-teal-400">history</span>
//         Travel History
//       </h2>
//       <div className="space-y-2">
//         {travelHistory.map((trip, index) => (
//           <TravelHistoryCard 
//             key={trip.id} 
//             trip={trip} 
//             isLast={index === travelHistory.length - 1}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// // ========== Upcoming Trips Section ==========
// const UpcomingTripsSection = () => {
//   const [upcomingTrips, setUpcomingTrips] = useState([
//     {
//       id: 1,
//       city: "London, UK",
//       date: "2024-08-15",
//       daysLeft: 45,
//       image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
//       duration: "6 days",
//       budget: "$2,500",
//       activities: ["British Museum", "London Eye", "West End Show"]
//     },
//     {
//       id: 2,
//       city: "Bali, Indonesia",
//       date: "2024-11-20",
//       daysLeft: 142,
//       image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop",
//       duration: "10 days",
//       budget: "$1,800",
//       activities: ["Beach Hopping", "Temple Tours", "Spa Treatments"]
//     }
//   ]);

//   const UpcomingTripCard = ({ trip }) => {
//     const getDaysLeftColor = (days) => {
//       if (days < 30) return "text-red-400";
//       if (days < 90) return "text-orange-400";
//       return "text-green-400";
//     };

//     return (
//       <div className="flex flex-col sm:flex-row items-start gap-4 rounded-xl bg-white/10 backdrop-blur-lg p-4 border border-teal-500/30 shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-102">
//         <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
//           <img
//             src={trip.image}
//             alt={trip.city}
//             className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
//           />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
//             <h3 className="font-bold text-lg text-white">{trip.city}</h3>
//             <div className={`text-sm font-semibold ${getDaysLeftColor(trip.daysLeft)}`}>
//               {trip.daysLeft} days left
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-3">
//             <div className="flex items-center gap-1">
//               <span className="material-symbols-outlined text-base">calendar_today</span>
//               <span>{trip.date}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="material-symbols-outlined text-base">schedule</span>
//               <span>{trip.duration}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="material-symbols-outlined text-base">attach_money</span>
//               <span>{trip.budget}</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-1 mb-3">
//             {trip.activities.map((activity, index) => (
//               <span key={index} className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
//                 {activity}
//               </span>
//             ))}
//           </div>
//           <div className="flex gap-2">
//             <button className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
//               Edit Plans
//             </button>
//             <button className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
//               Cancel Trip
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <section className="max-w-7xl mx-auto">
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//         <span className="material-symbols-outlined text-teal-400">schedule</span>
//         Upcoming Trips
//       </h2>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {upcomingTrips.map((trip) => (
//           <UpcomingTripCard key={trip.id} trip={trip} />
//         ))}
//       </div>
//     </section>
//   );
// };

// // ========== Wishlist Section ==========
// const WishlistSection = () => {
//   const [wishlist, setWishlist] = useState([
//     {
//       id: 1,
//       city: "Santorini",
//       country: "Greece",
//       image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?w=400&h=300&fit=crop",
//       priority: "High",
//       estimatedCost: "$3,200",
//       bestSeason: "Summer",
//       attractions: ["Sunset Views", "White Buildings", "Volcanic Beaches"]
//     },
//     {
//       id: 2,
//       city: "Machu Picchu",
//       country: "Peru",
//       image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
//       priority: "Medium",
//       estimatedCost: "$2,800",
//       bestSeason: "Dry Season",
//       attractions: ["Ancient Ruins", "Mountain Views", "Inca Trail"]
//     },
//     {
//       id: 3,
//       city: "Kyoto",
//       country: "Japan",
//       image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
//       priority: "High",
//       estimatedCost: "$3,500",
//       bestSeason: "Spring",
//       attractions: ["Cherry Blossoms", "Traditional Temples", "Geisha District"]
//     }
//   ]);

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High": return "text-red-400";
//       case "Medium": return "text-orange-400";
//       case "Low": return "text-green-400";
//       default: return "text-gray-400";
//     }
//   };

//   const WishlistCard = ({ item }) => (
//     <div className="group relative overflow-hidden rounded-xl bg-white/10 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105">
//       <div className="h-48 w-full overflow-hidden">
//         <img
//           src={item.image}
//           alt={`${item.city}, ${item.country}`}
//           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//         <div className="absolute top-3 right-3">
//           <span className={`bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
//             {item.priority} Priority
//           </span>
//         </div>
//         <button className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-rose-500/80 p-2 text-white hover:bg-rose-600">
//           <span className="material-symbols-outlined text-sm">favorite</span>
//         </button>
//       </div>
//       <div className="p-4">
//         <div className="mb-2">
//           <h3 className="font-bold text-white text-lg">{item.city}</h3>
//           <p className="text-gray-300 text-sm">{item.country}</p>
//         </div>
//         <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3">
//           <div className="flex items-center gap-1">
//             <span className="material-symbols-outlined text-sm">attach_money</span>
//             <span>{item.estimatedCost}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <span className="material-symbols-outlined text-sm">sunny</span>
//             <span>{item.bestSeason}</span>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-1">
//           {item.attractions.map((attraction, index) => (
//             <span key={index} className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
//               {attraction}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="max-w-7xl mx-auto">
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//         <span className="material-symbols-outlined text-teal-400">favorite</span>
//         Travel Wishlist
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {wishlist.map((item) => (
//           <WishlistCard key={item.id} item={item} />
//         ))}
//       </div>
//     </section>
//   );
// };

// // ========== Settings Section ==========
// const SettingsSection = () => {
//   const [settings, setSettings] = useState({
//     notifications: true,
//     emailUpdates: false,
//     darkMode: true,
//     language: "English",
//     currency: "USD"
//   });

//   const handleSettingChange = (key, value) => {
//     setSettings(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const SettingsCard = ({ icon, label, description, children }) => (
//     <div className="flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-lg p-4 border border-teal-500/30 shadow-lg hover:shadow-teal-500/40 transition-all duration-300 hover:bg-gray-800/70">
//       <div className="flex items-center gap-4 flex-1">
//         <span className="material-symbols-outlined text-teal-400 text-2xl">{icon}</span>
//         <div className="flex-1">
//           <h3 className="text-white font-semibold">{label}</h3>
//           <p className="text-gray-300 text-sm">{description}</p>
//         </div>
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <section className="max-w-7xl mx-auto">
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//         <span className="material-symbols-outlined text-teal-400">settings</span>
//         Settings & Preferences
//       </h2>
//       <div className="space-y-4">
//         <SettingsCard 
//           icon="notifications"
//           label="Push Notifications"
//           description="Receive updates about your trips and new features"
//         >
//           <button
//             onClick={() => handleSettingChange('notifications', !settings.notifications)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               settings.notifications ? 'bg-teal-500' : 'bg-gray-600'
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 settings.notifications ? 'translate-x-6' : 'translate-x-1'
//               }`}
//             />
//           </button>
//         </SettingsCard>

//         <SettingsCard 
//           icon="mail"
//           label="Email Updates"
//           description="Get weekly travel inspiration and deals"
//         >
//           <button
//             onClick={() => handleSettingChange('emailUpdates', !settings.emailUpdates)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               settings.emailUpdates ? 'bg-teal-500' : 'bg-gray-600'
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
//               }`}
//             />
//           </button>
//         </SettingsCard>

//         <SettingsCard 
//           icon="dark_mode"
//           label="Dark Mode"
//           description="Use dark theme across the application"
//         >
//           <button
//             onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               settings.darkMode ? 'bg-teal-500' : 'bg-gray-600'
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 settings.darkMode ? 'translate-x-6' : 'translate-x-1'
//               }`}
//             />
//           </button>
//         </SettingsCard>

//         <SettingsCard 
//           icon="language"
//           label="Language"
//           description="Choose your preferred language"
//         >
//           <select 
//             value={settings.language}
//             onChange={(e) => handleSettingChange('language', e.target.value)}
//             className="bg-white/10 border border-teal-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="English">English</option>
//             <option value="Spanish">Spanish</option>
//             <option value="French">French</option>
//             <option value="German">German</option>
//           </select>
//         </SettingsCard>

//         <SettingsCard 
//           icon="payments"
//           label="Currency"
//           description="Select your preferred currency"
//         >
//           <select 
//             value={settings.currency}
//             onChange={(e) => handleSettingChange('currency', e.target.value)}
//             className="bg-white/10 border border-teal-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="USD">USD ($)</option>
//             <option value="EUR">EUR (€)</option>
//             <option value="GBP">GBP (£)</option>
//             <option value="JPY">JPY (¥)</option>
//           </select>
//         </SettingsCard>

//         <SettingsCard 
//           icon="privacy_tip"
//           label="Privacy & Security"
//           description="Manage your data and privacy settings"
//         >
//           <button className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
//             Manage
//           </button>
//         </SettingsCard>
//       </div>
//     </section>
//   );
// };

// // ========== Reusable UI: Logout Modal ==========
// function LogoutModal({ open, onConfirm, onCancel }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//         onClick={onCancel}
//         aria-hidden="true"
//       />
//       <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-3">
//             <span className="material-symbols-outlined text-amber-400">logout</span>
//             <h3 className="text-lg font-semibold">Sign out</h3>
//           </div>
//           <p className="text-sm text-slate-300">
//             Are you sure you want to log out of this device?
//           </p>
//           <div className="mt-6 flex gap-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="flex-1 h-11 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300/40"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="flex-1 h-11 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-semibold shadow-lg shadow-rose-500/30 focus:outline-none focus:ring-2 focus:ring-rose-400/60 transition-all"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ========== Reusable UI: Toast ==========
// function LogoutToast({ show, onDone, timeout = 4000 }) {
//   useEffect(() => {
//     if (!show) return;
//     const id = setTimeout(onDone, timeout);
//     return () => clearTimeout(id);
//   }, [show, timeout, onDone]);

//   return (
//     <div
//       className={`fixed z-[90] transition-all duration-300 ${
//         show ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
//       } bottom-4 right-4 left-4 sm:left-auto`}
//     >
//       <div className="mx-auto w-full max-w-sm rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-xl text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
//         <div className="flex items-center gap-3 p-4">
//           <span className="material-symbols-outlined text-amber-400">logout</span>
//           <div className="flex-1">
//             <p className="text-sm font-semibold">Logged out</p>
//             <p className="text-xs text-slate-300">Session ended successfully.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ========== Helpers ==========
// const isHttpUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
// const stripLeadingSlashes = (p) => (typeof p === "string" ? p.replace(/^\/+/, "") : "");
// const toAbs = (base, p) => (p ? `${base}/${stripLeadingSlashes(p)}` : "");
// const readAsDataURL = (file) =>
//   new Promise((resolve) => {
//     const r = new FileReader();
//     r.onload = () => resolve(String(r.result || ""));
//     r.readAsDataURL(file);
//   });

// // ========== Main Profile Page Component ==========
// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const accesstoken = localStorage.getItem("access_token");
//   const refreshtoken = localStorage.getItem("refresh_token");

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showToast, setShowToast] = useState(false);

//   // Profile state
//   const [profileData, setProfileData] = useState({
//     name: "",
//     bio: "",
//     location: "",
//     gender: "",
//     date_of_birth: "",
//     contact_number: "",
//     social_links: "",
//     profile_picture: "",
//     cover_photo: "",
//   });

//   const [coverPreview, setCoverPreview] = useState("");
//   const [avatarPreview, setAvatarPreview] = useState("");
//   const [counts, setCounts] = useState({ followersCount: 0, followingCoun: 0 });

//   const token = accesstoken || localStorage.getItem("access_token");

//   const ProfiledataFunc = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProfileData((prev) => ({
//         ...prev,
//         ...(res.data || {}),
//       }));
//     } catch (error) {
//       console.log("Error fetching profile:", error);
//     }
//   };

//   const fetchCounts = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8003/CountOfFollwerandFollowingall/",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(response.data)
//       setCounts(response.data);
//     } catch (err) {
//       console.error("Error fetching counts:", err);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchCounts();
//       ProfiledataFunc();
//     } else {
//       console.log("does not have access token");
//     }
//   }, [token]);

//   // Safe URLs for cover/avatar
//   const base = "http://127.0.0.1:8002";

//   const coverUrl = useMemo(() => {
//     const v = profileData?.cover_photo;
//     if (v instanceof File) return coverPreview || "";
//     if (isHttpUrl(v)) return v;
//     if (typeof v === "string" && v) return toAbs(base, v);
//     return "";
//   }, [profileData?.cover_photo, coverPreview]);

//   const avatarUrl = useMemo(() => {
//     const v = profileData?.profile_picture;
//     if (v instanceof File) return avatarPreview || "";
//     if (isHttpUrl(v)) return v;
//     if (typeof v === "string" && v) return toAbs(base, v);
//     return "";
//   }, [profileData?.profile_picture, avatarPreview]);

//   // Previews for selected files
//   useEffect(() => {
//     let active = true;
//     (async () => {
//       if (profileData.cover_photo instanceof File) {
//         const url = await readAsDataURL(profileData.cover_photo);
//         if (active) setCoverPreview(url);
//       } else {
//         setCoverPreview("");
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, [profileData.cover_photo]);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       if (profileData.profile_picture instanceof File) {
//         const url = await readAsDataURL(profileData.profile_picture);
//         if (active) setAvatarPreview(url);
//       } else {
//         setAvatarPreview("");
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, [profileData.profile_picture]);

//   const handleEditProfile = async () => {
//     try {
//       const tok = accesstoken || localStorage.getItem("access_token");
//       if (!tok) throw new Error("Missing access token");

//       const form = new FormData();
//       const maybeAppend = (key, val) => {
//         if (val !== undefined && val !== null && val !== "") form.append(key, val);
//       };

//       maybeAppend("name", profileData.name);
//       maybeAppend("bio", profileData.bio);
//       maybeAppend("location", profileData.location);
//       maybeAppend("gender", profileData.gender);
//       maybeAppend("date_of_birth", profileData.date_of_birth);
//       maybeAppend("contact_number", profileData.contact_number);

//       if (
//         profileData.social_links !== undefined &&
//         profileData.social_links !== null &&
//         profileData.social_links !== ""
//       ) {
//         if (typeof profileData.social_links === "string") {
//           form.append("social_links", profileData.social_links);
//         } else {
//           const blob = new Blob([JSON.stringify(profileData.social_links)], {
//             type: "application/json",
//           });
//           form.append("social_links", blob, "social_links.json");
//         }
//       }

//       if (profileData.profile_picture instanceof File) {
//         form.append("profile_picture", profileData.profile_picture);
//       }
//       if (profileData.cover_photo instanceof File) {
//         form.append("cover_photo", profileData.cover_photo);
//       }

//       const res = await axios.patch("http://127.0.0.1:8002/UpdateProfileAPIView/", form, {
//         headers: {
//           Authorization: `Bearer ${tok}`,
//         },
//       });

//       console.log("Profile updated", res.data);
//       setShowEditModal(false);
//       ProfiledataFunc();
//     } catch (error) {
//       console.error(
//         "Update error:",
//         error?.response?.status,
//         error?.response?.data || error?.message
//       );
//     }
//   };

//   const confirmLogout = async () => {
//     try {
//       const datas = await axios.post(
//         "http://127.0.0.1:8001/authentication/LogoutPasswordApiView/",
//         { refresh: refreshtoken },
//         {
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${accesstoken}` },
//         }
//       );
//       console.log("datas", datas.data);
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//     } catch (e) {
//       console.warn("Logout cleanup error:", e.response?.data || e.message);
//     } finally {
//       setShowLogoutModal(false);
//       setShowToast(true);
//       setTimeout(() => {
//         navigate("/LoginPage", { replace: true });
//       }, 600);
//     }
//   };

//   const Header = () => (
//     <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg shadow-teal-500/20 border-b border-teal-500/30">
//       <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
//         <div className="flex items-center justify-between gap-3">
//           <button
//             className="flex h-10 w-10 items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
//             aria-label="Go back"
//             onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
//           >
//             <span className="material-symbols-outlined">arrow_back</span>
//           </button>

//           <h1 className="text-xl sm:text-2xl font-bold text-teal-500">Profile</h1>

//           <button
//             onClick={() => setShowLogoutModal(true)}
//             className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold px-3 py-2 text-sm shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 hover:scale-105"
//             aria-label="Logout"
//             title="Logout"
//           >
//             <span className="material-symbols-outlined">logout</span>
//             <span className="hidden sm:inline">Logout</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );

//   const ProfileCard = () => (
//     <section
//       className="relative flex flex-col items-center gap-4 sm:gap-6 bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg shadow-teal-500/20 animate-fade-in overflow-hidden"
//       style={{
//         backgroundImage: coverUrl
//           ? `url("${coverUrl}")`
//           : "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(8,145,178,0.15))",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
//       <div className="flex flex-col items-center gap-3 sm:gap-4 text-center relative z-10">
//         <div
//           className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-cover bg-center shadow-xl ring-4 ring-teal-500/20 transition-all duration-300 hover:scale-105 hover:shadow-teal-500/40"
//           style={{ backgroundImage: avatarUrl ? `url("${avatarUrl}")` : undefined }}
//         />
//         <div>
//           <p className="text-lg sm:text-2xl font-bold text-white drop-shadow-md">
//             {profileData.name || "Unnamed"}
//           </p>
//           <p className="text-sm sm:text-base text-gray-200">{profileData.bio || "—"}</p>
//           <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1">
//             <span className="material-symbols-outlined text-xs sm:text-sm">location_on</span>
//             {profileData.location || "—"}
//           </p>
//         </div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm relative z-10">
//         <button
//           className="flex-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 sm:py-2.5 text-sm sm:text-base shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           onClick={() => setShowEditModal(true)}
//           aria-label="Edit profile"
//         >
//           Edit Profile
//         </button>
//         <Link
//           to="/experience"
//           className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-teal-500"
//           aria-label="Navigate to Experience page"
//         >
//           Experience
//         </Link>
//       </div>
//     </section>
//   );

//   const StatsCard = ({ value, label }) => (
//     <div className="flex flex-col items-center rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 text-center border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500">
//       <p className="text-lg sm:text-2xl font-bold text-teal-400">{value}</p>
//       <p className="text-xs sm:text-sm text-gray-200">{label}</p>
//     </div>
//   );

//   const SocialCounters = () => (
//     <section className="max-w-7xl mx-auto">
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
//         <span className="material-symbols-outlined text-teal-400">groups</span>
//         Social
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
//         <button
//           className="flex items-center justify-center gap-2 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-teal-500"
//           onClick={() => navigate("/FollowersandFollowingpage")}
//           aria-label="View followers"
//         >
//           <span className="text-base sm:text-lg font-bold text-teal-400">
//             {counts.followersCount}
//           </span>
//           <span className="text-xs sm:text-sm text-gray-200">Followers</span>
//         </button>

//         <button
//           className="flex items-center justify-center gap-2 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-teal-500"
//           onClick={() => navigate("/FollowersandFollowingpage")}
//           aria-label="View following"
//         >
//           <span className="text-base sm:text-lg font-bold text-teal-400">
//             {counts.followingCoun}
//           </span>
//           <span className="text-xs sm:text-sm text-gray-200">Following</span>
//         </button>
//       </div>
//     </section>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col font-display text-white">
//       <Header />

//       <main className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 flex-grow">
//         <div className="max-w-7xl mx-auto">
//           <ProfileCard />
//         </div>

//         <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto w-full">
//           <StatsCard value="25" label="Trips" />
//           <StatsCard value="3" label="Upcoming" />
//           <StatsCard value="12" label="Wishlist" />
//           <StatsCard value="4.8★" label="Ratings" />
//         </section>

//         <SocialCounters />

//         {/* Integrated Travel Experiences Section */}
//         <TravelExperiencesSection />

//         {/* Travel History Section */}
//         <TravelHistorySection />

//         {/* Upcoming Trips Section */}
//         <UpcomingTripsSection />

//         {/* Wishlist Section */}
//         <WishlistSection />

//         {/* Settings Section */}
//         <SettingsSection />

//       </main>

//       {showEditModal && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
//           <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hidden shadow-2xl">
//             <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Edit Profile</h3>
//             <div className="space-y-4 sm:space-y-6">
//               <input
//                 className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
//                 placeholder="Name"
//                 value={profileData.name}
//                 onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//                 aria-label="Name"
//               />
//               <input
//                 className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
//                 placeholder="Contact number"
//                 value={profileData.contact_number}
//                 onChange={(e) => setProfileData({ ...profileData, contact_number: e.target.value })}
//                 aria-label="Contact number"
//               />
//               <input
//                 className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
//                 placeholder="Bio"
//                 value={profileData.bio}
//                 onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
//                 aria-label="Bio"
//               />
//               <input
//                 className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
//                 placeholder="Location"
//                 value={profileData.location}
//                 onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
//                 aria-label="Location"
//               />

//               <label className="block">
//                 <select
//                   className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white transition-all duration-300 hover:bg-white/20"
//                   value={profileData.gender || ""}
//                   onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
//                   aria-label="Gender"
//                 >
//                   <option className="bg-slate-900" value="">Select gender</option>
//                   <option className="bg-slate-900" value="M">Male</option>
//                   <option className="bg-slate-900" value="F">Female</option>
//                   <option className="bg-slate-900" value="O">Other</option>
//                 </select>
//               </label>

//               <label className="block">
//                 <span className="block text-sm text-white/80 mb-1">Cover image</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   aria-label="Cover image file"
//                   onChange={async (e) => {
//                     const file = e.target.files?.[0];
//                     if (!file) return;
//                     setProfileData((p) => ({ ...p, cover_photo: file }));
//                   }}
//                   className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-white/20"
//                 />
//                 <p className="mt-1 text-xs text-white/60">JPG, PNG, or WebP. Max ~5MB.</p>
//               </label>

//               <label className="block">
//                 <span className="block text-sm text-white/80 mb-1">Profile image</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   aria-label="Profile image file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (!file) return;
//                     setProfileData((p) => ({ ...p, profile_picture: file }));
//                   }}
//                   className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-white/20"
//                 />
//                 <p className="mt-1 text-xs text-white/60">JPG, PNG, or WebP. Max ~5MB.</p>
//               </label>

//               <input
//                 className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
//                 placeholder="Date of birth"
//                 type="date"
//                 value={profileData.date_of_birth}
//                 onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
//                 aria-label="Date of birth"
//               />

//               <input
//                 className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
//                 type="url"
//                 inputMode="url"
//                 placeholder="LinkedIn, YouTube, etc."
//                 value={typeof profileData.social_links === "string" ? profileData.social_links : ""}
//                 onChange={(e) => setProfileData({ ...profileData, social_links: e.target.value })}
//                 aria-label="Social links URL"
//               />

//               <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
//                 <button
//                   className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                   onClick={() => setShowEditModal(false)}
//                   aria-label="Cancel editing profile"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   onClick={handleEditProfile}
//                   aria-label="Save profile changes"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <footer className="sticky bottom-0 bg-black/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
//         <nav className="flex justify-around py-3 sm:py-4">
//           {["home", "explore", "bookmark", "person"].map((icon) => (
//             <button
//               key={icon}
//               className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
//                 icon === "person" ? "text-teal-500" : "text-gray-200 hover:text-teal-400"
//               } focus:outline-none focus:ring-2 focus:ring-teal-500`}
//               aria-label={`Navigate to ${icon}`}
//             >
//               <span className="material-symbols-outlined text-xl sm:text-2xl">{icon}</span>
//               <span className="text-xs sm:text-sm font-medium capitalize">{icon}</span>
//             </button>
//           ))}
//         </nav>
//         <div style={{ height: "env(safe-area-inset-bottom)" }} />
//       </footer>

//       <LogoutModal
//         open={showLogoutModal}
//         onConfirm={confirmLogout}
//         onCancel={() => setShowLogoutModal(false)}
//       />
//       <LogoutToast show={showToast} onDone={() => setShowToast(false)} />

//       {/* Global Styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

//         body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; }
//         .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
//         .animate-fade-in { animation: fadeIn 0.6s ease-out; }
//         @keyframes fadeIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
//         .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
//         .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #14b8a6; border-radius: 4px; }
//         .scrollbar-thin::-webkit-scrollbar-track { background-color: #1f2937; }
//         .scrollbar-hidden::-webkit-scrollbar { display: none; }
//         .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//         .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
//         @media (max-width: 640px) { .scrollbar-thin::-webkit-scrollbar { width: 4px; } }
//       `}</style>
//     </div>
//   );
// };

// export default ProfilePage;























import axios from "axios";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

// ========== Travel Experiences Section Component ==========
const TravelExperiencesSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hoveredExperience, setHoveredExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");
  const baseUrl = "http://127.0.0.1:8004";

  // Fetch experiences from API
  const fetchExperiences = useCallback(async () => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${baseUrl}/TravalExperienceGetApiView`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("Experiences response:", response.data);
      
      if (response.data && response.data.data) {
        const experiencesData = response.data.data.map(exp => ({
          ...exp,
          // Determine media type and URL
          media: exp.video ? 
            { type: "video", url: `${baseUrl}${exp.video}`, poster: null } :
            exp.image ? 
            { type: "image", url: `${baseUrl}${exp.image}` } : 
            null
        }));
        
        setExperiences(experiencesData);
        setFilteredExperiences(experiencesData);
      } else {
        setExperiences([]);
        setFilteredExperiences([]);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setError("Failed to load experiences");
      setExperiences([]);
      setFilteredExperiences([]);
    } finally {
      setLoading(false);
    }
  }, [token, baseUrl]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Filter experiences based on active tab
  useEffect(() => {
    if (activeTab === "All") {
      setFilteredExperiences(experiences);
    } else if (activeTab === "Images") {
      setFilteredExperiences(experiences.filter(exp => exp.image));
    } else if (activeTab === "Videos") {
      setFilteredExperiences(experiences.filter(exp => exp.video));
    }
  }, [activeTab, experiences]);

  const handleExperienceClick = useCallback((experience) => {
    setSelectedExperience(experience);
    setShowDetailModal(true);
  }, []);

  const handleMouseEnter = useCallback((experienceId) => {
    setHoveredExperience(experienceId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredExperience(null);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "No date specified";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid date";
    }
  }, []);

  const getCategoryIcon = useCallback((category) => {
    switch (category) {
      case "Nature": return "landscape";
      case "Adventure": return "hiking";
      case "Cultural": return "account_balance";
      case "Historical": return "history";
      case "Food": return "restaurant";
      case "Relaxation": return "beach_access";
      default: return "place";
    }
  }, []);

  // Experience Card Component
  const ExperienceCard = React.memo(({ experience }) => {
    const hasMedia = experience.media !== null;
    const isHovered = hoveredExperience === experience.id;

    return (
      <div 
        className="group relative bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl border border-teal-500/30 overflow-hidden shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-102 cursor-pointer"
        onClick={() => handleExperienceClick(experience)}
        onMouseEnter={() => handleMouseEnter(experience.id)}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleExperienceClick(experience);
          }
        }}
      >
        {/* Media Display */}
        <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-black">
          {hasMedia ? (
            experience.media.type === "video" ? (
              <video
                className="w-full h-full object-cover"
                poster={experience.media.poster}
                preload="metadata"
                muted
              >
                <source src={experience.media.url} type="video/mp4" />
              </video>
            ) : (
              <img
                src={experience.media.url}
                alt={experience.title || "Travel experience"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
              <span className="material-symbols-outlined text-teal-400 text-4xl">
                {getCategoryIcon(experience.category)}
              </span>
            </div>
          )}

          {/* Fallback for image error */}
          {hasMedia && experience.media.type === "image" && (
            <div 
              className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20"
              style={{ display: 'none' }}
            >
              <span className="material-symbols-outlined text-teal-400 text-4xl">
                {getCategoryIcon(experience.category)}
              </span>
            </div>
          )}

          {/* Video Play Icon */}
          {hasMedia && experience.media.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="material-symbols-outlined text-white text-4xl">
                play_arrow
              </span>
            </div>
          )}

          {/* Rating Badge */}
          {experience.rating > 0 && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-yellow-400 text-sm">
                star
              </span>
              <span className="text-white text-xs font-semibold">
                {experience.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Hover Overlay with Details */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between p-4">
              {/* Top Section */}
              <div className="text-white">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                  {experience.title || "Untitled Experience"}
                </h3>
                <div className="flex items-center gap-1 text-sm mb-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span className="line-clamp-1">{experience.place_name || "Unknown location"}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="material-symbols-outlined text-base">category</span>
                  <span>{experience.category || "Uncategorized"}</span>
                </div>
              </div>

              {/* Middle Section */}
              <div className="text-white text-sm">
                <p className="text-gray-300 line-clamp-2 mb-2">
                  {experience.description || "No description available"}
                </p>
                {experience.date_of_visit && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>Visited: {formatDate(experience.date_of_visit)}</span>
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div className="flex justify-between items-center text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full ${
                    experience.sentiment === "Positive" ? "bg-green-500/80" :
                    experience.sentiment === "Negative" ? "bg-red-500/80" :
                    "bg-yellow-500/80"
                  }`}>
                    {experience.sentiment || "Neutral"}
                  </span>
                  <span className="bg-teal-500/80 px-2 py-1 rounded-full">
                    {experience.privacy || "Public"}
                  </span>
                </div>
                <span className="text-gray-300">
                  {experience.created_at ? new Date(experience.created_at).toLocaleDateString() : "Unknown date"}
                </span>
              </div>
            </div>
          )}

          {/* Static engagement indicators */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 rounded px-2 py-1 text-xs text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">star</span>
              <span>{experience.rating > 0 ? experience.rating.toFixed(1) : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Basic info always visible */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-1">
            {experience.title || "Untitled Experience"}
          </h3>
          <p className="text-gray-300 text-xs line-clamp-1">
            {experience.place_name || "Unknown location"}
          </p>
        </div>
      </div>
    );
  });

  // Experience Detail Modal Component
  const ExperienceDetailModal = React.memo(() => {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch comments when modal opens
    useEffect(() => {
      if (selectedExperience && showDetailModal) {
        // Mock comments - replace with actual API call
        setComments([
          { id: 1, userName: "Traveler1", content: "Amazing view!", timestamp: new Date().toISOString() },
          { id: 2, userName: "Explorer2", content: "Loved the hike!", timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]);
      }
    }, [selectedExperience, showDetailModal]);

    const handleAddComment = async () => {
      if (newComment.trim() === "") return;
      
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedComments = [
          ...comments,
          {
            id: Date.now(),
            userName: "You",
            content: newComment,
            timestamp: new Date().toISOString(),
          },
        ];
        setComments(updatedComments);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddComment();
      }
    };

    if (!selectedExperience || !showDetailModal) return null;

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
          {/* Left Side - Media */}
          <div className="lg:w-1/2 bg-black flex flex-col relative">
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-[40vh] lg:min-h-[70vh]">
              {selectedExperience.media ? (
                selectedExperience.media.type === "video" ? (
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-contain max-h-full rounded-lg"
                    poster={selectedExperience.media.poster}
                    onError={(e) => {
                      console.error("Video load error");
                      e.target.style.display = "none";
                      const fallback = e.target.parentNode.appendChild(document.createElement("div"));
                      fallback.className = "w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg";
                      fallback.innerHTML = `<span class="material-symbols-outlined text-teal-400 text-6xl">${getCategoryIcon(selectedExperience.category)}</span>`;
                    }}
                  >
                    <source src={selectedExperience.media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={selectedExperience.media.url}
                    alt={selectedExperience.title || "Travel experience"}
                    className="w-full h-full object-contain max-h-full rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = e.target.parentNode.appendChild(document.createElement("div"));
                      fallback.className = "w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg";
                      fallback.innerHTML = `<span class="material-symbols-outlined text-teal-400 text-6xl">${getCategoryIcon(selectedExperience.category)}</span>`;
                    }}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg">
                  <span className="material-symbols-outlined text-teal-400 text-6xl">
                    {getCategoryIcon(selectedExperience.category)}
                  </span>
                </div>
              )}
            </div>

            {/* Media Controls Bar */}
            <div className="p-3 border-t border-gray-700 bg-black/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-white">
                  <button className="flex items-center space-x-1 hover:text-teal-400 transition">
                    <span className="material-symbols-outlined">favorite</span>
                    <span>{selectedExperience.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-teal-400 transition">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span>{comments.length}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-teal-400 transition">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
                <button className="flex items-center space-x-1 text-white hover:text-teal-400 transition">
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Details & Comments */}
          <div className="lg:w-1/2 flex flex-col bg-white text-black">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 bg-cover" 
                     style={{ backgroundImage: `url(${selectedExperience.userProfilePicture || ""})` }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{selectedExperience.userName || "User"}</p>
                  <p className="text-xs text-gray-500">{selectedExperience.place_name || "Unknown location"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Post Content & Details */}
            <div className="p-4 border-b space-y-3 max-h-48 overflow-y-auto">
              <h3 className="font-bold text-lg">{selectedExperience.title || "Untitled Experience"}</h3>
              <p className="text-gray-700">{selectedExperience.description || "No description available"}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap gap-2">
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-base">category</span>
                  <span>{selectedExperience.category || "Uncategorized"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-yellow-400 text-base">star</span>
                  <span>{selectedExperience.rating > 0 ? selectedExperience.rating.toFixed(1) : "Not rated"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>{formatDate(selectedExperience.date_of_visit)}</span>
                </div>
              </div>

              {selectedExperience.tags && selectedExperience.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedExperience.tags.map((tag, index) => (
                    <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Location Coordinates */}
              <div className="text-xs text-gray-500">
                <p>Latitude: {selectedExperience.latitude || "N/A"}</p>
                <p>Longitude: {selectedExperience.longitude || "N/A"}</p>
              </div>

              {/* Additional Details Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Privacy</h4>
                  <p className="text-gray-600">{selectedExperience.privacy || "Public"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Sentiment</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedExperience.sentiment === "Positive" ? "bg-green-100 text-green-800" :
                    selectedExperience.sentiment === "Negative" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {selectedExperience.sentiment || "Neutral"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Created</h4>
                  <p className="text-gray-600">
                    {selectedExperience.created_at ? new Date(selectedExperience.created_at).toLocaleDateString() : "Unknown date"}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-sm">{comment.userName}</p>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <button className="hover:text-teal-600">Like</button>
                        <button className="hover:text-teal-600">Reply</button>
                        <button className="hover:text-teal-600">Share</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Add Comment Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-600 text-sm transition-colors">
                  <span className="material-symbols-outlined text-base">favorite</span>
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-600 text-sm transition-colors">
                  <span className="material-symbols-outlined text-base">reply</span>
                  <span>Reply</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                  className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-400">flight</span>
          Travel Experiences
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white/10 h-56 sm:h-64 lg:h-72 rounded-t-xl"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-400">flight</span>
          Travel Experiences
        </h2>
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-red-400 text-6xl mb-4">
            error
          </span>
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <button
            onClick={fetchExperiences}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-400">flight</span>
        Travel Experiences
      </h2>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        {["All", "Images", "Videos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors ${
              activeTab === tab
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab} ({tab === "All" ? experiences.length : 
                    tab === "Images" ? experiences.filter(exp => exp.image).length :
                    experiences.filter(exp => exp.video).length})
          </button>
        ))}
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-teal-400 text-6xl mb-4">
              travel_explore
            </span>
            <p className="text-gray-400 text-lg">No travel experiences found</p>
            <p className="text-gray-500 text-sm mt-2">
              {activeTab !== "All" ? `Try switching to "All" tab` : "Start adding your travel experiences!"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && <ExperienceDetailModal />}
    </section>
  );
};

// ========== Travel History Section ==========
const TravelHistorySection = () => {
  const [travelHistory, setTravelHistory] = useState([
    {
      id: 1,
      city: "Paris, France",
      date: "2023-07-15",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
      description: "Explored the charming streets and iconic Eiffel Tower. The Louvre Museum was absolutely breathtaking.",
      duration: "5 days",
      highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"]
    },
    {
      id: 2,
      city: "Tokyo, Japan",
      date: "2023-05-20",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      description: "Immersed in vibrant culture and cutting-edge technology. The cherry blossoms were in full bloom.",
      duration: "7 days",
      highlights: ["Shibuya Crossing", "Tokyo Skytree", "Traditional Temples"]
    },
    {
      id: 3,
      city: "New York, USA",
      date: "2023-03-10",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      description: "Experienced the bustling energy of Times Square and Broadway shows.",
      duration: "4 days",
      highlights: ["Central Park", "Statue of Liberty", "Broadway Show"]
    }
  ]);

  const TravelHistoryCard = React.memo(({ trip, isLast }) => (
    <div className="relative flex items-start mb-8 group animate-fade-in">
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-teal-500/30" />
      )}
      <div className="flex items-start gap-4 z-10 w-full">
        <div className="w-4 h-4 rounded-full bg-teal-500 ring-4 ring-gray-900/50 group-hover:ring-teal-500/50 transition-all duration-300 mt-2 flex-shrink-0" />
        <div className="flex-1 rounded-xl border border-teal-500/30 bg-white/10 backdrop-blur-lg shadow-lg group-hover:shadow-teal-500/40 transition-all duration-300 transform group-hover:scale-102 overflow-hidden flex flex-col sm:flex-row">
          <div className="sm:w-2/5 h-48 sm:h-auto">
            <img
              src={trip.image}
              alt={trip.city}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-4 sm:p-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <h3 className="font-bold text-lg text-white">{trip.city}</h3>
              <div className="flex items-center gap-2 text-sm text-teal-400 mt-1 sm:mt-0">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                <span>{trip.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>{trip.duration}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{trip.description}</p>
            <div className="flex flex-wrap gap-1">
              {trip.highlights.map((highlight, index) => (
                <span key={index} className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-400">history</span>
        Travel History
      </h2>
      <div className="space-y-2">
        {travelHistory.map((trip, index) => (
          <TravelHistoryCard 
            key={trip.id} 
            trip={trip} 
            isLast={index === travelHistory.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

// ========== Upcoming Trips Section ==========
const UpcomingTripsSection = () => {
  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 1,
      city: "London, UK",
      date: "2024-08-15",
      daysLeft: 45,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
      duration: "6 days",
      budget: "$2,500",
      activities: ["British Museum", "London Eye", "West End Show"]
    },
    {
      id: 2,
      city: "Bali, Indonesia",
      date: "2024-11-20",
      daysLeft: 142,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop",
      duration: "10 days",
      budget: "$1,800",
      activities: ["Beach Hopping", "Temple Tours", "Spa Treatments"]
    }
  ]);

  const UpcomingTripCard = React.memo(({ trip }) => {
    const getDaysLeftColor = (days) => {
      if (days < 30) return "text-red-400";
      if (days < 90) return "text-orange-400";
      return "text-green-400";
    };

    return (
      <div className="flex flex-col sm:flex-row items-start gap-4 rounded-xl bg-white/10 backdrop-blur-lg p-4 border border-teal-500/30 shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-102">
        <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={trip.image}
            alt={trip.city}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
            <h3 className="font-bold text-lg text-white">{trip.city}</h3>
            <div className={`text-sm font-semibold ${getDaysLeftColor(trip.daysLeft)}`}>
              {trip.daysLeft} days left
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-3">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span>{trip.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">attach_money</span>
              <span>{trip.budget}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {trip.activities.map((activity, index) => (
              <span key={index} className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
                {activity}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
              Edit Plans
            </button>
            <button className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
              Cancel Trip
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-400">schedule</span>
        Upcoming Trips
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {upcomingTrips.map((trip) => (
          <UpcomingTripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
};

// ========== Wishlist Section ==========
const WishlistSection = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      city: "Santorini",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?w=400&h=300&fit=crop",
      priority: "High",
      estimatedCost: "$3,200",
      bestSeason: "Summer",
      attractions: ["Sunset Views", "White Buildings", "Volcanic Beaches"]
    },
    {
      id: 2,
      city: "Machu Picchu",
      country: "Peru",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
      priority: "Medium",
      estimatedCost: "$2,800",
      bestSeason: "Dry Season",
      attractions: ["Ancient Ruins", "Mountain Views", "Inca Trail"]
    },
    {
      id: 3,
      city: "Kyoto",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
      priority: "High",
      estimatedCost: "$3,500",
      bestSeason: "Spring",
      attractions: ["Cherry Blossoms", "Traditional Temples", "Geisha District"]
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-400";
      case "Medium": return "text-orange-400";
      case "Low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const WishlistCard = React.memo(({ item }) => (
    <div className="group relative overflow-hidden rounded-xl bg-white/10 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={item.image}
          alt={`${item.city}, ${item.country}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
            {item.priority} Priority
          </span>
        </div>
        <button className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-rose-500/80 p-2 text-white hover:bg-rose-600">
          <span className="material-symbols-outlined text-sm">favorite</span>
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-white text-lg">{item.city}</h3>
          <p className="text-gray-300 text-sm">{item.country}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">attach_money</span>
            <span>{item.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">sunny</span>
            <span>{item.bestSeason}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.attractions.map((attraction, index) => (
            <span key={index} className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
              {attraction}
            </span>
          ))}
        </div>
      </div>
    </div>
  ));

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-400">favorite</span>
        Travel Wishlist
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

// ========== Settings Section ==========
const SettingsSection = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    language: "English",
    currency: "USD"
  });

  const handleSettingChange = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const SettingsCard = React.memo(({ icon, label, description, children }) => (
    <div className="flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-lg p-4 border border-teal-500/30 shadow-lg hover:shadow-teal-500/40 transition-all duration-300 hover:bg-gray-800/70">
      <div className="flex items-center gap-4 flex-1">
        <span className="material-symbols-outlined text-teal-400 text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{label}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  ));

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-400">settings</span>
        Settings & Preferences
      </h2>
      <div className="space-y-4">
        <SettingsCard 
          icon="notifications"
          label="Push Notifications"
          description="Receive updates about your trips and new features"
        >
          <button
            onClick={() => handleSettingChange('notifications', !settings.notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications ? 'bg-teal-500' : 'bg-gray-600'
            }`}
            aria-label={`${settings.notifications ? 'Disable' : 'Enable'} notifications`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </SettingsCard>

        <SettingsCard 
          icon="mail"
          label="Email Updates"
          description="Get weekly travel inspiration and deals"
        >
          <button
            onClick={() => handleSettingChange('emailUpdates', !settings.emailUpdates)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailUpdates ? 'bg-teal-500' : 'bg-gray-600'
            }`}
            aria-label={`${settings.emailUpdates ? 'Disable' : 'Enable'} email updates`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </SettingsCard>

        <SettingsCard 
          icon="dark_mode"
          label="Dark Mode"
          description="Use dark theme across the application"
        >
          <button
            onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.darkMode ? 'bg-teal-500' : 'bg-gray-600'
            }`}
            aria-label={`${settings.darkMode ? 'Disable' : 'Enable'} dark mode`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </SettingsCard>

        <SettingsCard 
          icon="language"
          label="Language"
          description="Choose your preferred language"
        >
          <select 
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="bg-white/10 border border-teal-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </SettingsCard>

        <SettingsCard 
          icon="payments"
          label="Currency"
          description="Select your preferred currency"
        >
          <select 
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            className="bg-white/10 border border-teal-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </SettingsCard>

        <SettingsCard 
          icon="privacy_tip"
          label="Privacy & Security"
          description="Manage your data and privacy settings"
        >
          <button className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
            Manage
          </button>
        </SettingsCard>
      </div>
    </section>
  );
};

// ========== Reusable UI: Logout Modal ==========
function LogoutModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-amber-400">logout</span>
            <h3 className="text-lg font-semibold">Sign out</h3>
          </div>
          <p className="text-sm text-slate-300">
            Are you sure you want to log out of this device?
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300/40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-11 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-semibold shadow-lg shadow-rose-500/30 focus:outline-none focus:ring-2 focus:ring-rose-400/60 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Reusable UI: Toast ==========
function LogoutToast({ show, onDone, timeout = 4000 }) {
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(onDone, timeout);
    return () => clearTimeout(id);
  }, [show, timeout, onDone]);

  return (
    <div
      className={`fixed z-[90] transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      } bottom-4 right-4 left-4 sm:left-auto`}
    >
      <div className="mx-auto w-full max-w-sm rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-xl text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="flex items-center gap-3 p-4">
          <span className="material-symbols-outlined text-amber-400">logout</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Logged out</p>
            <p className="text-xs text-slate-300">Session ended successfully.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Helpers ==========
const isHttpUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
const stripLeadingSlashes = (p) => (typeof p === "string" ? p.replace(/^\/+/, "") : "");
const toAbs = (base, p) => (p ? `${base}/${stripLeadingSlashes(p)}` : "");
const readAsDataURL = (file) =>
  new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.readAsDataURL(file);
  });

// ========== Main Profile Page Component ==========
const ProfilePage = () => {
  const navigate = useNavigate();
  const accesstoken = localStorage.getItem("access_token");
  const refreshtoken = localStorage.getItem("refresh_token");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    location: "",
    gender: "",
    date_of_birth: "",
    contact_number: "",
    social_links: "",
    profile_picture: "",
    cover_photo: "",
  });

  const [coverPreview, setCoverPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [counts, setCounts] = useState({ followersCount: 0, followingCoun: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const token = accesstoken || localStorage.getItem("access_token");

  const ProfiledataFunc = useCallback(async () => {
    if (!token) {
      console.log("No access token available");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData((prev) => ({
        ...prev,
        ...(res.data || {}),
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchCounts = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        "http://127.0.0.1:8003/CountOfFollwerandFollowingall/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Counts response:", response.data);
      setCounts(response.data);
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCounts();
      ProfiledataFunc();
    } else {
      console.log("does not have access token");
    }
  }, [token, fetchCounts, ProfiledataFunc]);

  // Safe URLs for cover/avatar
  const base = "http://127.0.0.1:8002";

  const coverUrl = useMemo(() => {
    const v = profileData?.cover_photo;
    if (v instanceof File) return coverPreview || "";
    if (isHttpUrl(v)) return v;
    if (typeof v === "string" && v) return toAbs(base, v);
    return "";
  }, [profileData?.cover_photo, coverPreview]);

  const avatarUrl = useMemo(() => {
    const v = profileData?.profile_picture;
    if (v instanceof File) return avatarPreview || "";
    if (isHttpUrl(v)) return v;
    if (typeof v === "string" && v) return toAbs(base, v);
    return "";
  }, [profileData?.profile_picture, avatarPreview]);

  // Previews for selected files
  useEffect(() => {
    let active = true;
    (async () => {
      if (profileData.cover_photo instanceof File) {
        const url = await readAsDataURL(profileData.cover_photo);
        if (active) setCoverPreview(url);
      } else {
        setCoverPreview("");
      }
    })();
    return () => {
      active = false;
    };
  }, [profileData.cover_photo]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (profileData.profile_picture instanceof File) {
        const url = await readAsDataURL(profileData.profile_picture);
        if (active) setAvatarPreview(url);
      } else {
        setAvatarPreview("");
      }
    })();
    return () => {
      active = false;
    };
  }, [profileData.profile_picture]);

  const handleEditProfile = async () => {
    try {
      const tok = accesstoken || localStorage.getItem("access_token");
      if (!tok) throw new Error("Missing access token");

      const form = new FormData();
      const maybeAppend = (key, val) => {
        if (val !== undefined && val !== null && val !== "") form.append(key, val);
      };

      maybeAppend("name", profileData.name);
      maybeAppend("bio", profileData.bio);
      maybeAppend("location", profileData.location);
      maybeAppend("gender", profileData.gender);
      maybeAppend("date_of_birth", profileData.date_of_birth);
      maybeAppend("contact_number", profileData.contact_number);

      if (
        profileData.social_links !== undefined &&
        profileData.social_links !== null &&
        profileData.social_links !== ""
      ) {
        if (typeof profileData.social_links === "string") {
          form.append("social_links", profileData.social_links);
        } else {
          const blob = new Blob([JSON.stringify(profileData.social_links)], {
            type: "application/json",
          });
          form.append("social_links", blob, "social_links.json");
        }
      }

      if (profileData.profile_picture instanceof File) {
        form.append("profile_picture", profileData.profile_picture);
      }
      if (profileData.cover_photo instanceof File) {
        form.append("cover_photo", profileData.cover_photo);
      }

      const res = await axios.patch("http://127.0.0.1:8002/UpdateProfileAPIView/", form, {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      });

      console.log("Profile updated", res.data);
      setShowEditModal(false);
      ProfiledataFunc();
    } catch (error) {
      console.error(
        "Update error:",
        error?.response?.status,
        error?.response?.data || error?.message
      );
    }
  };

  const confirmLogout = async () => {
    try {
      const datas = await axios.post(
        "http://127.0.0.1:8001/authentication/LogoutPasswordApiView/",
        { refresh: refreshtoken },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accesstoken}` },
        }
      );
      console.log("datas", datas.data);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch (e) {
      console.warn("Logout cleanup error:", e.response?.data || e.message);
    } finally {
      setShowLogoutModal(false);
      setShowToast(true);
      setTimeout(() => {
        navigate("/LoginPage", { replace: true });
      }, 600);
    }
  };

  const Header = () => (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg shadow-teal-500/20 border-b border-teal-500/30">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Go back"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-teal-500">Profile</h1>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold px-3 py-2 text-sm shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 hover:scale-105"
            aria-label="Logout"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );

  const ProfileCard = () => (
    <section
      className="relative flex flex-col items-center gap-4 sm:gap-6 bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg shadow-teal-500/20 animate-fade-in overflow-hidden"
      style={{
        backgroundImage: coverUrl
          ? `url("${coverUrl}")`
          : "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(8,145,178,0.15))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="flex flex-col items-center gap-3 sm:gap-4 text-center relative z-10">
        <div
          className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-cover bg-center shadow-xl ring-4 ring-teal-500/20 transition-all duration-300 hover:scale-105 hover:shadow-teal-500/40"
          style={{ 
            backgroundImage: avatarUrl ? `url("${avatarUrl}")` : "none",
            backgroundColor: avatarUrl ? "transparent" : "#374151"
          }}
        />
        <div>
          <p className="text-lg sm:text-2xl font-bold text-white drop-shadow-md">
            {profileData.name || "Unnamed"}
          </p>
          <p className="text-sm sm:text-base text-gray-200">{profileData.bio || "—"}</p>
          <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs sm:text-sm">location_on</span>
            {profileData.location || "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm relative z-10">
        <button
          className="flex-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 sm:py-2.5 text-sm sm:text-base shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={() => setShowEditModal(true)}
          aria-label="Edit profile"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Edit Profile"}
        </button>
        <Link
          to="/experience"
          className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
          aria-label="Navigate to Experience page"
        >
          Experience
        </Link>
      </div>
    </section>
  );

  const StatsCard = ({ value, label }) => (
    <div className="flex flex-col items-center rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 text-center border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500">
      <p className="text-lg sm:text-2xl font-bold text-teal-400">{value}</p>
      <p className="text-xs sm:text-sm text-gray-200">{label}</p>
    </div>
  );

  const SocialCounters = () => (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-teal-400">groups</span>
        Social
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={() => navigate("/FollowersandFollowingpage")}
          aria-label="View followers"
        >
          <span className="text-base sm:text-lg font-bold text-teal-400">
            {counts.followersCount || 0}
          </span>
          <span className="text-xs sm:text-sm text-gray-200">Followers</span>
        </button>

        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={() => navigate("/FollowersandFollowingpage")}
          aria-label="View following"
        >
          <span className="text-base sm:text-lg font-bold text-teal-400">
            {counts.followingCoun || 0}
          </span>
          <span className="text-xs sm:text-sm text-gray-200">Following</span>
        </button>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col font-display text-white">
      <Header />

      <main className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 flex-grow">
        <div className="max-w-7xl mx-auto">
          <ProfileCard />
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto w-full">
          <StatsCard value="25" label="Trips" />
          <StatsCard value="3" label="Upcoming" />
          <StatsCard value="12" label="Wishlist" />
          <StatsCard value="4.8★" label="Ratings" />
        </section>

        <SocialCounters />

        {/* Integrated Travel Experiences Section */}
        <TravelExperiencesSection />

        {/* Travel History Section */}
        <TravelHistorySection />

        {/* Upcoming Trips Section */}
        <UpcomingTripsSection />

        {/* Wishlist Section */}
        <WishlistSection />

        {/* Settings Section */}
        <SettingsSection />

      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hidden shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Edit Profile</h3>
            <div className="space-y-4 sm:space-y-6">
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
                placeholder="Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                aria-label="Name"
              />
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
                placeholder="Contact number"
                value={profileData.contact_number}
                onChange={(e) => setProfileData({ ...profileData, contact_number: e.target.value })}
                aria-label="Contact number"
              />
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
                placeholder="Bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                aria-label="Bio"
              />
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
                placeholder="Location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                aria-label="Location"
              />

              <label className="block">
                <select
                  className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white transition-all duration-300 hover:bg-white/20"
                  value={profileData.gender || ""}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  aria-label="Gender"
                >
                  <option className="bg-slate-900" value="">Select gender</option>
                  <option className="bg-slate-900" value="M">Male</option>
                  <option className="bg-slate-900" value="F">Female</option>
                  <option className="bg-slate-900" value="O">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm text-white/80 mb-1">Cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Cover image file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProfileData((p) => ({ ...p, cover_photo: file }));
                  }}
                  className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-white/20"
                />
                <p className="mt-1 text-xs text-white/60">JPG, PNG, or WebP. Max ~5MB.</p>
              </label>

              <label className="block">
                <span className="block text-sm text-white/80 mb-1">Profile image</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Profile image file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProfileData((p) => ({ ...p, profile_picture: file }));
                  }}
                  className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-white/20"
                />
                <p className="mt-1 text-xs text-white/60">JPG, PNG, or WebP. Max ~5MB.</p>
              </label>

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
                placeholder="Date of birth"
                type="date"
                value={profileData.date_of_birth}
                onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                aria-label="Date of birth"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300 hover:bg-white/20"
                type="url"
                inputMode="url"
                placeholder="LinkedIn, YouTube, etc."
                value={typeof profileData.social_links === "string" ? profileData.social_links : ""}
                onChange={(e) => setProfileData({ ...profileData, social_links: e.target.value })}
                aria-label="Social links URL"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Cancel editing profile"
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onClick={handleEditProfile}
                  aria-label="Save profile changes"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="sticky bottom-0 bg-black/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around py-3 sm:py-4">
          {["home", "explore", "bookmark", "person"].map((icon) => (
            <button
              key={icon}
              className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
                icon === "person" ? "text-teal-500" : "text-gray-200 hover:text-teal-400"
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              aria-label={`Navigate to ${icon}`}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">{icon}</span>
              <span className="text-xs sm:text-sm font-medium capitalize">{icon}</span>
            </button>
          ))}
        </nav>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </footer>

      <LogoutModal
        open={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <LogoutToast show={showToast} onDone={() => setShowToast(false)} />

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #14b8a6; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background-color: #1f2937; }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        @media (max-width: 640px) { .scrollbar-thin::-webkit-scrollbar { width: 4px; } }
      `}</style>
    </div>
  );
};

export default ProfilePage;