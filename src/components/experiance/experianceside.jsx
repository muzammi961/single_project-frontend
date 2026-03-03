// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import axios from "axios";
// import '../stylecomponent/experianceside.css';
// // import '../stylecomponent/newmessageiconstyle.css'
// import '../stylecomponent/backbutton.css'
// import '../stylecomponent/overviewserchebutton.css'
// import { useDispatch } from 'react-redux';
// import { setMessageandProfileViewid } from '../actioncreate';
// const ExperienceSide = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access_token");
//   const authuserid = useSelector(state => state.app.autherazeduserId);
//   const dispatch=useDispatch()
//   const wsRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   const [experiences, setExperiences] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchType, setSearchType] = useState('Experiences');
//   const [showModal, setShowModal] = useState(null);
//   const [formData, setFormData] = useState({ title: '', content: '', image: '', placeId: '' });
//   const [reviewData, setReviewData] = useState({ content: '', rating: 5 });
//   const [commentData, setCommentData] = useState({ content: '' });
//   const [selectedExperience, setSelectedExperience] = useState(null);
//   const [placeOverview, setPlaceOverview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [experiencesLoading, setExperiencesLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [wsConnected, setWsConnected] = useState(false);

//   // WebSocket connection for notifications
//   const connectWebSocket = () => {
//     if (!authuserid || !token) {
//       console.log('❌ Cannot connect WebSocket: missing authuserid or token');
//       return;
//     }
   
//     // Clear any existing reconnection timeout
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//     }

//     // Use wss:// for secure connection if using HTTPS
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const wsUrl = `${protocol}//127.0.0.1:8003/ws/socialmedia/notifications/${authuserid}/`;
    
//     console.log(`🔗 Connecting to WebSocket: ${wsUrl}`);
    


    



//     try {
//       const ws = new WebSocket(wsUrl);
//       wsRef.current = ws;

//       ws.onopen = () => {
//         console.log('✅ WebSocket connected for notifications');
//         setWsConnected(true);
//       };

//       ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log('📨 WebSocket message received:', data);
          
//           if (data.type === 'notification') {
//             const notificationId = Date.now();
//             const notificationMessage = data.message || "You have a new message";
            
//             setNotifications(prev => [...prev, { 
//               id: notificationId, 
//               message: notificationMessage,
//               notification_id: data.notification_id,
//               type: data.notification_type,
//               timestamp: new Date().toLocaleTimeString()
//             }]);
//             setUnreadCount(prev => prev + 1);
            
//             // Show browser notification if supported
//             if ('Notification' in window && Notification.permission === 'granted') {
//               new Notification('PathFinder', {
//                 body: notificationMessage,
//                 icon: '/favicon.ico'
//               });
//             }
            
//             console.log('🔔 New notification:', notificationMessage);
//           }
//         } catch (error) {
//           console.error('❌ Error parsing WebSocket message:', error);
//         }
//       };

//       ws.onclose = (event) => {
//         console.log('🔔 WebSocket disconnected:', event.code, event.reason);
//         setWsConnected(false);
        
//         // Reconnect after delay (with exponential backoff)
//         reconnectTimeoutRef.current = setTimeout(() => {
//           console.log('🔄 Attempting to reconnect WebSocket...');
//           connectWebSocket();
//         }, 3000);
//       };

//       ws.onerror = (error) => {
//         console.error('❌ WebSocket error:', error);
//         setWsConnected(false);
//       };

//     } catch (error) {
//       console.error('❌ Error creating WebSocket:', error);
//       setWsConnected(false);
//     }
//   };

//   // Request notification permission
//   const requestNotificationPermission = () => {
//     if ('Notification' in window) {
//       Notification.requestPermission().then(permission => {
//         console.log('Notification permission:', permission);
//       });
//     }
//   };

//   useEffect(() => {
//     requestNotificationPermission();
//   }, []);

//   useEffect(() => {
//     connectWebSocket();

//     // Cleanup on unmount
//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, [authuserid, token]);

//   // Test function to simulate receiving a notification
//   const testNotification = () => {
//     const testNotification = {
//       id: Date.now(),
//       message: "Test notification - this is working!",
//       type: 'test',
//       timestamp: new Date().toLocaleTimeString()
//     };
    
//     setNotifications(prev => [...prev, testNotification]);
//     setUnreadCount(prev => prev + 1);
    
//     console.log('🧪 Test notification added');
//   };

//   // Redirect if no token
//   useEffect(() => {
//     if (!token) {
//       navigate("/RegistrationForm");
//     }
//   }, [token, navigate]);

//   // Fetch experiences with profile data
//   useEffect(() => {
//     if (!token) return;

//     const fetchExperiences = async () => {
//       setExperiencesLoading(true);
//       try {
//         const res = await axios.get("http://127.0.0.1:8004/TravelExperienceListAPIViewbypage/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const apiExperiences = res.data.results || [];
        
//         // Adapt API data to experience structure with profile data
//         const adaptedExperiences = apiExperiences.map(exp => ({
//           id: exp.id,
//           user_id: exp.user_id,
//           userName: exp.user_profile?.name || 'Unknown User',
//           profileImage: exp.user_profile?.profile_picture 
//             ? `http://127.0.0.1:8002${exp.user_profile.profile_picture}` 
//             : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
//           timestamp: new Date(exp.date_of_visit).toLocaleDateString('en-US', { 
//             month: 'short', 
//             day: 'numeric', 
//             year: 'numeric' 
//           }),
//           title: exp.title,
//           place_name: exp.place_name,
//           category: exp.category,
//           description: exp.description,
//           image: exp.image ? `http://127.0.0.1:8004${exp.image}` : null,
//           video: exp.video ? `http://127.0.0.1:8004${exp.video}` : null,
//           rating: exp.rating,
//           date_of_visit: exp.date_of_visit,
//           tags: exp.tags || [],
//           sentiment: exp.sentiment,
//           likes: 0,
//           liked: false,
//           reviews: [],
//           comments: [],
//           user_profile: exp.user_profile // Include full profile data
//         }));
        
//         setExperiences(adaptedExperiences);
//         console.log('Adapted experiences:', adaptedExperiences);
//       } catch (error) {
//         console.error("Error fetching experiences:", error);
//       } finally {
//         setExperiencesLoading(false);
//       }
//     };

//     fetchExperiences();
//   }, [token]);

//   // Reset selected experience when starting search
//   useEffect(() => {
//     if (searchQuery !== '') {
//       setSelectedExperience(null);
//     }
//   }, [searchQuery]);

//   // Fetch AI Overview when searching
//   useEffect(() => {
//     if (searchQuery && searchType === 'Experiences') {
//       setLoading(true);
//       fetchPlaceOverview(searchQuery);
//     } else {
//       setPlaceOverview(null);
//     }
//   }, [searchQuery, searchType]);

//   // Fetch AI Overview for a place
//   const fetchPlaceOverview = async (placeName) => {
//     try {
//       const params = new URLSearchParams();
//       params.append('place_name', placeName);

//       const overres = await axios.post("http://127.0.0.1:8004/TravelExperienceAIOverview/", params, {
//         headers: { 
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: `Bearer ${token}` 
//         },
//       });
      
//       console.log("AI Overview API Response:", overres.data.overview);
//       setPlaceOverview(overres.data);
//     } catch (error) {
//       console.error("Error fetching AI overview:", error.response?.data || error.message);
//       // Fallback data if API fails
//       setPlaceOverview({
//         total_trips: 0,
//         average_rating: 0,
//         sentiment_summary: { Positive: 0, Neutral: 0, Negative: 0 },
//         all_tags: [],
//         overview: "No AI overview available at the moment."
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search functionality
//   const filteredExperiences = searchQuery
//     ? experiences.filter(exp =>
//         exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         exp.place_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         exp.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : experiences;

//   const isSearching = searchQuery !== '';

//   // Handle form submissions
//   const handleAddExperience = () => {
//     const newExperience = {
//       id: experiences.length + 1,
//       userName: 'Current User',
//       profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
//       timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       ...formData,
//       likes: 0,
//       liked: false,
//       reviews: [],
//       comments: [],
//     };
//     setExperiences([...experiences, newExperience]);
//     setFormData({ title: '', content: '', image: '', placeId: '' });
//     setShowModal(null);
//   };

//   const handleAddReview = (expId) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         return {
//           ...exp,
//           reviews: [
//             ...exp.reviews,
//             { id: exp.reviews.length + 1, userName: 'Current User', ...reviewData, likes: 0, liked: false },
//           ],
//         };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//     setReviewData({ content: '', rating: 5 });
//     setShowModal(null);
//   };

//   const handleAddComment = (expId, reviewId = null) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         if (reviewId) {
//           return {
//             ...exp,
//             reviews: exp.reviews.map(review => {
//               if (review.id === reviewId) {
//                 return {
//                   ...review,
//                   comments: [
//                     ...(review.comments || []),
//                     { id: (review.comments?.length || 0) + 1, userName: 'Current User', content: commentData.content },
//                   ],
//                 };
//               }
//               return review;
//             }),
//           };
//         }
//         return {
//           ...exp,
//           comments: [
//             ...exp.comments,
//             { id: exp.comments.length + 1, userName: 'Current User', content: commentData.content, replies: [] },
//           ],
//         };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//     setCommentData({ content: '' });
//     setShowModal(null);
//   };

//   const handleLikeExperience = (expId) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         return { ...exp, liked: !exp.liked, likes: exp.liked ? exp.likes - 1 : exp.likes + 1 };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//   };

//   const handleLikeReview = (expId, reviewId) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         return {
//           ...exp,
//           reviews: exp.reviews.map(review => {
//             if (review.id === reviewId) {
//               return { ...review, liked: !review.liked, likes: review.liked ? review.likes - 1 : review.likes + 1 };
//             }
//             return review;
//           }),
//         };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//   };

//   const handleUpdateExperience = (expId) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         return { ...exp, ...formData };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//     setFormData({ title: '', content: '', image: '', placeId: '' });
//     setShowModal(null);
//   };

//   const handleDeleteExperience = (expId) => {
//     setExperiences(experiences.filter(exp => exp.id !== expId));
//   };

//   const handleUpdateReview = (expId, reviewId) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         return {
//           ...exp,
//           reviews: exp.reviews.map(review => {
//             if (review.id === reviewId) {
//               return { ...review, ...reviewData };
//             }
//             return review;
//           }),
//         };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//     setReviewData({ content: '', rating: 5 });
//     setShowModal(null);
//   };

//   const handleDeleteReview = (expId, reviewId) => {
//     const updatedExperiences = experiences.map(exp => {
//       if (exp.id === expId) {
//         return { ...exp, reviews: exp.reviews.filter(review => review.id !== reviewId) };
//       }
//       return exp;
//     });
//     setExperiences(updatedExperiences);
//   };

//   const handleToggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//     if (unreadCount > 0 && !showNotifications) {
//       setUnreadCount(0);
//     }
//   };

//   const clearAllNotifications = () => {
//     setNotifications([]);
//     setUnreadCount(0);
//   };

//   // Enhanced Experience Card with proper profile data
//   const ExperienceCard = ({ exp }) => {
//     const profileImageSrc = exp.user_profile?.profile_picture 
//       ? `http://127.0.0.1:8002${exp.user_profile.profile_picture}`
//       : exp.profileImage;
//     const userprofileid=exp.user_profile.user_id
//     const userName = exp.user_profile?.name || exp.userName || 'Unknown User';
//     const userLocation = exp.user_profile?.location || '';
//     const userBio = exp.user_profile?.bio || '';

//     return (
//       <div className="w-full bg-white/50 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 border border-gray-200 hover:border-teal-300">
//         {/* Media Section */}
//         {exp.image ? (
//           <img
//             alt={exp.title}
//             className="w-full h-48 object-cover rounded-t-xl"
//             src={exp.image}
//           />
//         ) : exp.video ? (
//           <video
//             className="w-full h-48 object-cover rounded-t-xl"
//             src={exp.video}
//             controls
//             muted
//           />
//         ) : (
//           <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center rounded-t-xl text-gray-500">
//             <span className="material-symbols-outlined text-4xl text-teal-400">landscape</span>
//           </div>
//         )}

//         {/* Content Section */}
//         <div className="p-5">
//           {/* User Profile Header */}
//           <div className="flex items-center justify-between mb-4">
//             <div 
//               onClick={()=>{dispatch(setMessageandProfileViewid(userprofileid)); 
//     navigate('/ProfileOnly');}}    
//             className="flex items-center space-x-3">
//               <img
//                 src={profileImageSrc}
//                 className="w-12 h-12 rounded-full object-cover border-2 border-teal-400/50 shadow-sm"
//                 alt={`${userName}'s profile`}
//               />
//               <div className="flex-1">
//                 <p className="text-sm font-semibold text-black">{userName}</p>
//                 <p className="text-xs text-gray-600">{exp.timestamp}</p>
//                 {userLocation && (
//                   <p className="text-xs text-gray-500 flex items-center mt-1">
//                     <span className="material-symbols-outlined text-xs mr-1">location_on</span>
//                     {userLocation}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <button
//               className="text-teal-600 hover:text-teal-500 text-sm font-medium bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full transition-colors duration-200"
//               onClick={() => setSelectedExperience(exp)}
//               aria-label={`View details for ${exp.title}`}
//             >
//               Details
//             </button>
//           </div>

//           {/* Experience Details */}
//           <div className="mb-3">
//             <h3 className="text-xl font-bold text-black mb-2">{exp.title}</h3>
//             <div className="flex items-center space-x-4 mb-2">
//               {exp.place_name && (
//                 <span className="text-sm text-teal-600 font-medium flex items-center">
//                   <span className="material-symbols-outlined text-base mr-1">place</span>
//                   {exp.place_name}
//                 </span>
//               )}
//               {exp.category && (
//                 <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
//                   {exp.category}
//                 </span>
//               )}
//             </div>
//             <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{exp.description}</p>
//           </div>

//           {/* Tags */}
//           {exp.tags && exp.tags.length > 0 && (
//             <div className="flex flex-wrap gap-1 mb-3">
//               {exp.tags.map((tag, index) => (
//                 <span 
//                   key={index}
//                   className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
//                 >
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Rating and Stats */}
//           <div className="flex items-center justify-between mb-3">
//             {exp.rating && (
//               <div className="flex items-center space-x-1">
//                 <div className="flex text-yellow-400">
//                   {'★'.repeat(Math.floor(exp.rating))}
//                   {'☆'.repeat(5 - Math.floor(exp.rating))}
//                 </div>
//                 <span className="text-sm text-gray-600 ml-1">({exp.rating})</span>
//               </div>
//             )}
//             {exp.sentiment && (
//               <span className={`text-xs px-2 py-1 rounded-full ${
//                 exp.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
//                 exp.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
//                 'bg-yellow-100 text-yellow-800'
//               }`}>
//                 {exp.sentiment}
//               </span>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//             <div className="flex space-x-6">
//               <button
//                 className="flex items-center space-x-2 text-teal-600 hover:text-teal-500 transition-colors duration-200"
//                 onClick={() => handleLikeExperience(exp.id)}
//                 aria-label={exp.liked ? `Unlike ${exp.title}` : `Like ${exp.title}`}
//               >
//                 <svg
//                   className={`w-5 h-5 ${exp.liked ? 'fill-current text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500' : ''}`}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1a4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
//                   />
//                 </svg>
//                 <span className="text-sm text-black">{exp.likes.toLocaleString()}</span>
//               </button>
//               <button
//                 className="flex items-center space-x-2 text-teal-600 hover:text-teal-500 transition-colors duration-200"
//                 onClick={() => setShowModal(`addComment-${exp.id}`)}
//                 aria-label={`Comment on ${exp.title}`}
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                   />
//                 </svg>
//                 <span className="text-sm text-black">{exp.comments.length}</span>
//               </button>
//             </div>
//             <button
//               className="text-teal-600 hover:text-teal-500 text-sm font-medium bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full transition-colors duration-200"
//               onClick={() => setShowModal(`addReview-${exp.id}`)}
//               aria-label={`Add review for ${exp.title}`}
//             >
//               Add Review
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="relative flex min-h-screen w-full flex-col justify-between bg-white font-display text-black">
//       {/* Connection Status Indicator */}
//       {/* <div className={`fixed top-4 right-20 z-50 p-2 rounded-lg text-white text-sm flex items-center space-x-2 ${
//         wsConnected ? 'bg-green-500' : 'bg-red-500'
//       }`}>
//         <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
//         <span>{wsConnected ? '🔔 Connected' : '🔔 Disconnected'}</span>
//       </div> */}

//       {/* Test Notification Button */}
//       {/* <button 
//         onClick={testNotification}
//         className="fixed top-4 right-40 z-50 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
//       >
//         Test Notification
//       </button> */}

//       <div className="flex-grow">
//         {/* Header */}
//         <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm shadow-teal-500/20 border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//             {/* Back Button */}
//             <button className="button" onClick={() => navigate('/')} aria-label="Go back">
//               <div className="button-box">
//                 <span className="button-elem">
//                   <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
//                   </svg>
//                 </span>
//                 <span className="button-elem">
//                   <svg viewBox="0 0 46 40">
//                     <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
//                   </svg>
//                 </span>
//               </div>
//             </button>

//             {/* Title */}
//             <h1 className="text-2xl font-bold text-teal-600">TripVerse</h1>

//             {/* Right side icons */}
//             <div className="flex items-center gap-4">
//               <button onClick={() => navigate('/Calendar')} className="p-2" aria-label="Calendar">
//                 <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">
//                   calendar_today
//                 </span>
//               </button>

//               <Link to={'/ProfilePage'} className="p-2" aria-label="Profile">
//                 <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">
//                   account_circle
//                 </span>
//               </Link>

//               <button className="relative" onClick={handleToggleNotifications} aria-label="Notifications">
//                 <svg viewBox="0 0 512 512" height="20" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
//                 </svg>
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
//             <div className="relative flex items-center">
//               <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 z-10">search</span>
//               <input
//                 className="w-full rounded-full border border-gray-300 bg-gray-50/60 pl-12 pr-20 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-gray-500 transition-all duration-300"
//                 placeholder="Search for experiences, places, or categories"
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 aria-label="Search experiences"
//               />
             






//             </div>
            
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isSearching ? 'py-4 space-y-6' : 'py-8 space-y-12'}`}>
//           {/* AI User Insights */}
//           {!isSearching && (
//             <section className="animate-fade-in">
//               <h2 className="text-3xl font-bold text-black mb-4">AI-Generated Experience Overview</h2>
//               <p className="text-base text-gray-700 leading-relaxed">
//                 Discover a smart summary of travel experiences similar to your search. Our AI analyzes destination trends, traveler reviews, and related experiences to give you an overall view of what makes this journey special.
//               </p>
//             </section>
//           )}

//           {/* Add New Experience */}
//           {!isSearching && (
//             <section className="bg-gray-50/50 backdrop-blur-lg rounded-xl p-6 shadow-lg shadow-teal-500/20 animate-fade-in">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-black">Share Your Experience</h2>
//                 <button
//                   className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
//                   onClick={() => navigate('/AddExperience')}
//                   aria-label="Add new experience"
//                 >
//                   Post Experience
//                 </button>
//               </div>
//             </section>
//           )}

//           {/* Place AI Overview when searching */}
//           {isSearching && (
//             <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 shadow-lg shadow-teal-500/20 border border-teal-500/20">
//               {loading ? (
//                 <div className="flex items-center justify-center py-12">
//                   <div id="wifi-loader">
//                     <svg viewBox="0 0 86 86" className="circle-outer">
//                       <circle r="40" cy="43" cx="43" className="back"></circle>
//                       <circle r="40" cy="43" cx="43" className="front"></circle>
//                       <circle r="40" cy="43" cx="43" className="new"></circle>
//                     </svg>
//                     <svg viewBox="0 0 60 60" className="circle-middle">
//                       <circle r="27" cy="30" cx="30" className="back"></circle>
//                       <circle r="27" cy="30" cx="30" className="front"></circle>
//                     </svg>
//                     <svg viewBox="0 0 34 34" className="circle-inner">
//                       <circle r="14" cy="17" cx="17" className="back"></circle>
//                       <circle r="14" cy="17" cx="17" className="front"></circle>
//                     </svg>
//                     <div data-text="Searching" className="text"></div>
//                   </div>
//                 </div>
//               ) : placeOverview ? (
//                 <>
//                   <h3 className="text-xl font-bold text-teal-600 mb-4">AI-Powered Insights for "{searchQuery}"</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                     <div className="text-center p-3 bg-white/50 rounded-lg">
//                       <p className="text-2xl font-bold text-teal-600">{placeOverview.total_trips || 0}</p>
//                       <p className="text-sm text-gray-600">Total Trips</p>
//                     </div>
//                     <div className="text-center p-3 bg-white/50 rounded-lg">
//                       <p className="text-2xl font-bold text-teal-600">{placeOverview.average_rating || 0}</p>
//                       <p className="text-sm text-gray-600">Avg Rating</p>
//                     </div>
//                     <div className="text-center p-3 bg-white/50 rounded-lg">
//                       <div className="flex justify-center space-x-2 mb-2">
//                         <span className="text-green-600">👍 {placeOverview.sentiment_summary?.Positive || 0}</span>
//                         <span className="text-gray-600">😐 {placeOverview.sentiment_summary?.Neutral || 0}</span>
//                         <span className="text-red-600">👎 {placeOverview.sentiment_summary?.Negative || 0}</span>
//                       </div>
//                       <p className="text-sm text-gray-600">Sentiment</p>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {placeOverview.all_tags?.map((tag, index) => (
//                       <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
//                         {tag}
//                       </span>
//                     ))}
//                     {(!placeOverview.all_tags || placeOverview.all_tags.length === 0) && (
//                       <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
//                         No tags available
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-700 leading-relaxed">
//                     {placeOverview.overview || "No overview available."}
//                   </p>
//                 </>
//               ) : null}
//             </div>
//           )}

//           {/* Experiences Section */}
//           <section className="animate-fade-in">
//             <h2 className="text-3xl font-bold text-black mb-6">
//               {isSearching ? `Search Results for "${searchQuery}"` : 'Traveler Experiences'}
//             </h2>
//             {experiencesLoading ? (
//               <div className="flex items-center justify-center py-12">
//                 <div id="wifi-loader">
//                   <svg viewBox="0 0 86 86" className="circle-outer">
//                     <circle r="40" cy="43" cx="43" className="back"></circle>
//                     <circle r="40" cy="43" cx="43" className="front"></circle>
//                     <circle r="40" cy="43" cx="43" className="new"></circle>
//                   </svg>
//                   <svg viewBox="0 0 60 60" className="circle-middle">
//                     <circle r="27" cy="30" cx="30" className="back"></circle>
//                     <circle r="27" cy="30" cx="30" className="front"></circle>
//                   </svg>
//                   <svg viewBox="0 0 34 34" className="circle-inner">
//                     <circle r="14" cy="17" cx="17" className="back"></circle>
//                     <circle r="14" cy="17" cx="17" className="front"></circle>
//                   </svg>
//                   <div data-text="Loading Experiences" className="text"></div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredExperiences.map(exp => (
//                     <ExperienceCard key={exp.id} exp={exp} />
//                   ))}
//                 </div>
//                 {filteredExperiences.length === 0 && isSearching && (
//                   <div className="text-center py-12">
//                     <p className="text-gray-600 text-lg">No experiences found for "{searchQuery}".</p>
//                   </div>
//                 )}
//                 {filteredExperiences.length === 0 && !isSearching && (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 text-6xl mb-4">🌍</div>
//                     <h3 className="text-xl font-semibold text-gray-600 mb-2">No Experiences Yet</h3>
//                     <p className="text-gray-500 mb-4">Be the first to share your travel adventure!</p>
//                     <button
//                       className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg"
//                       onClick={() => navigate('/AddExperience')}
//                     >
//                       Share Your First Experience
//                     </button>
//                   </div>
//                 )}
//                 {!isSearching && filteredExperiences.length > 0 && (
//                   <div className="flex justify-center pt-6">
//                     <button
//                       className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
//                       aria-label="Load more experiences"
//                     >
//                       Load More
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </section>
//         </main>
//       </div>

//       {/* Enhanced Notifications Sidebar */}
//       {showNotifications && (
//         <div className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl shadow-teal-500/20 border-l-2 border-teal-500/50 z-50 overflow-y-auto animate-slide-in">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-bold text-teal-600 flex items-center justify-between">
//               Notifications
//               <div className="flex items-center space-x-2">
//                 <button 
//                   onClick={clearAllNotifications}
//                   className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
//                 >
//                   Clear All
//                 </button>
//                 <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             </h3>
//           </div>
//           <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
//             {notifications.length > 0 ? (
//               notifications.map((notif) => (
//                 <div key={notif.id} className="bg-teal-50 text-teal-800 p-3 rounded-lg border-l-4 border-teal-400">
//                   <p className="text-sm">{notif.message}</p>
//                   <p className="text-xs text-teal-600 mt-1">{notif.timestamp}</p>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500 mb-2">No notifications yet.</p>
//                 <p className="text-xs text-gray-400">Notifications will appear here when you receive messages.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
//         <nav className="flex justify-around items-center p-4">
//           <a onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-500 transition-colors duration-200" href="#">
//             <span className="material-symbols-outlined text-2xl">explore</span>
//             <span className="text-sm font-medium">Experience</span>
//           </a>
//           <a onClick={() => navigate('/TravelPlannerofBadget')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
//             <span className="material-symbols-outlined text-2xl">receipt_long</span>
//             <span className="text-sm font-medium">Expense</span>
//           </a>
//           {/* <a  onClick={() => navigate('/TripPlannerofCustome')}  className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
//             <span className="material-symbols-outlined text-2xl">tune</span>
//             <span className="text-sm font-medium">Customize</span>
//           </a> */}
//         </nav>
//       </footer>

//       {/* Global Styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
//         body {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background-color: #14b8a6;
//           border-radius: 4px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-track {
//           background-color: #e5e7eb;
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.5s ease-in-out;
//         }
//         @keyframes fadeIn {
//           0% { opacity: 0; transform: translateY(10px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slide-in {
//           animation: slideIn 0.3s ease-out;
//         }
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .msg-count {
//           min-width: 18px;
//           min-height: 18px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ExperienceSide;




























































import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import '../stylecomponent/experianceside.css';
import '../stylecomponent/backbutton.css';
import '../stylecomponent/overviewserchebutton.css';
import { useDispatch } from 'react-redux';
import { setMessageandProfileViewid } from '../actioncreate';

const ExperienceSide = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const authuserid = useSelector(state => state.app.autherazeduserId);
  const dispatch = useDispatch();
  
  const [experiences, setExperiences] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [placeOverview, setPlaceOverview] = useState(null);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  
  // Progress tracking state
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [taskError, setTaskError] = useState(null);

  // Messages and Notifications state
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // WebSocket for real-time messages
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Refs for interval management
  const pollingIntervalRef = useRef(null);
  const processingTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  // WebSocket connection for real-time messages
  const connectWebSocket = useCallback(() => {
    if (!authuserid || !token) {
      console.log('❌ Cannot connect WebSocket: missing authuserid or token');
      return;
    }
    
    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Use wss:// for secure connection if using HTTPS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//127.0.0.1:8003/ws/socialmedia/notifications/${authuserid}/`;
    
    console.log(`🔗 Connecting to WebSocket: ${wsUrl}`);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected for real-time messages');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          if (data.type === 'notification') {
            handleNewNotification(data);
          } else if (data.type === 'message') {
            handleNewMessage(data);
          } else if (data.type === 'conversation_update') {
            fetchConversations();
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔔 WebSocket disconnected:', event.code, event.reason);
        setWsConnected(false);
        
        // Reconnect after delay (with exponential backoff)
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setWsConnected(false);
      };

    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setWsConnected(false);
    }
  }, [authuserid, token]);

  // Handle new notification
  const handleNewNotification = (data) => {
    const notificationId = Date.now();
    const notificationMessage = data.message || "You have a new notification";
    
    setNotifications(prev => [...prev, { 
      id: notificationId, 
      message: notificationMessage,
      notification_id: data.notification_id,
      type: data.notification_type,
      timestamp: new Date().toLocaleTimeString()
    }]);
    
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TripVerse', {
        body: notificationMessage,
        icon: '/favicon.ico'
      });
    }
  };

  // Handle new message
  const handleNewMessage = (data) => {
    const newMsg = {
      id: Date.now(),
      sender: data.sender || 'Unknown User',
      sender_id: data.sender_id,
      content: data.content,
      timestamp: new Date().toLocaleTimeString(),
      is_read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // If messages panel is not open, increment unread count
    if (!showMessages) {
      setUnreadCount(prev => prev + 1);
    }
    
    // Update conversations
    fetchConversations();
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8003/api/conversations/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      
      if (response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8003/api/conversations/${conversationId}/messages/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      
      if (response.data) {
        setMessages(response.data);
        setSelectedConversation(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8003/api/conversations/${selectedConversation}/messages/`,
        { content: newMessage },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          timeout: 5000
        }
      );
      
      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Start a new conversation
  const startNewConversation = async (userId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8003/api/conversations/start/`,
        { participant_id: userId },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          timeout: 5000
        }
      );
      
      if (response.data) {
        fetchConversations();
        fetchMessages(response.data.id);
        setShowMessages(true);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    requestNotificationPermission();
    connectWebSocket();
    
    // Fetch conversations on mount
    if (token) {
      fetchConversations();
    }
    
    return () => {
      isMountedRef.current = false;
      stopPolling();
      clearTimers();
      cleanupAbortController();
      
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket, token]);

  // Cleanup functions
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current);
      processingTimerRef.current = null;
    }
  }, []);

  const cleanupAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Reset all processing state
  const resetProcessingState = useCallback(() => {
    setProgress(0);
    setCurrentStep('');
    setTaskId(null);
    setProcessingTime(0);
    setIsProcessing(false);
    setTaskError(null);
    setLastUpdateTime(0);
    stopPolling();
    clearTimers();
    cleanupAbortController();
  }, [stopPolling, clearTimers, cleanupAbortController]);

  // Start processing timer
  const startProcessingTimer = useCallback(() => {
    clearTimers();
    let seconds = 0;
    processingTimerRef.current = setInterval(() => {
      seconds++;
      if (isMountedRef.current) {
        setProcessingTime(seconds);
      }
    }, 1000);
  }, [clearTimers]);

  // Map backend state to frontend state
  const mapTaskState = useCallback((taskResponse) => {
    // Handle different response structures from backend
    const status = taskResponse.status?.toLowerCase() || 
                  taskResponse.state?.toLowerCase() || 
                  'pending';
    
    const progress = taskResponse.progress || 
                    (taskResponse.info?.progress || 0);
    
    const step = taskResponse.step || 
                taskResponse.info?.step || 
                '';
    
    const elapsed = taskResponse.elapsed || 
                   taskResponse.info?.elapsed || 
                   0;
    
    const data = taskResponse.data || 
                (status === 'success' ? taskResponse.result : null);
    
    const error = taskResponse.error || 
                 (taskResponse.info && typeof taskResponse.info === 'string' ? taskResponse.info : null);
    
    return {
      status,
      progress,
      step,
      elapsed,
      data,
      error
    };
  }, []);

  // FIXED: Improved poll task status with proper state handling
  const pollTaskStatus = useCallback(async (taskIdToPoll) => {
    if (!taskIdToPoll || !isMountedRef.current) return;

    try {
      console.log(`🔄 Polling task status for: ${taskIdToPoll}`);
      
      const statusResponse = await axios.get(
        `http://127.0.0.1:8004/TravelOverviewStatus/${taskIdToPoll}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      const taskData = mapTaskState(statusResponse.data);
      console.log('📊 Task status mapped:', taskData);
      
      if (!isMountedRef.current) return;

      // Update last update time
      setLastUpdateTime(Date.now());

      switch (taskData.status) {
        case "processing":
        case "progress":
          setProgress(taskData.progress || 0);
          setCurrentStep(taskData.step || 'Processing...');
          setProcessingTime(taskData.elapsed || processingTime);
          break;
          
        case "success":
        case "completed":
          console.log('✅ Task completed successfully:', taskData);
          
          if (taskData.data) {
            // Success! We have the AI overview data
            console.log('📊 Received AI overview data:', taskData.data);
            setPlaceOverview({
              ...taskData.data,
              from_cache: taskData.data.from_cache || false,
              search_query: lastSearchQuery
            });
            setProgress(100);
            setCurrentStep('Completed');
            setIsProcessing(false);
            
            // Stop polling on success
            stopPolling();
            clearTimers();
            
            // Clear task ID after a delay
            setTimeout(() => {
              if (isMountedRef.current) {
                setTaskId(null);
                setProgress(0);
                setCurrentStep('');
              }
            }, 2000);
          } else {
            // Task completed but no data
            console.warn('⚠️ Task completed but no data returned');
            setPlaceOverview({
              total_trips: 0,
              average_rating: 0,
              sentiment_summary: { Positive: 0, Neutral: 0, Negative: 0 },
              all_tags: [],
              overview: "AI analysis completed but no valid data was returned.",
              search_query: lastSearchQuery,
              from_cache: false
            });
            setIsProcessing(false);
            resetProcessingState();
          }
          break;
          
        case "failure":
        case "failed":
          console.error("❌ Task failed:", taskData.error || 'Unknown error');
          setTaskError(taskData.error || 'Task processing failed');
          setPlaceOverview({
            total_trips: 0,
            average_rating: 0,
            sentiment_summary: { Positive: 0, Neutral: 0, Negative: 0 },
            all_tags: [],
            overview: taskData.error || "AI processing failed. Please try again.",
            search_query: lastSearchQuery,
            from_cache: false
          });
          setIsProcessing(false);
          resetProcessingState();
          break;
          
        case "pending":
          setProgress(10);
          setCurrentStep('Task is queued...');
          break;
          
        default:
          console.log('📝 Task state:', taskData.status);
          setProgress(taskData.progress || 0);
          setCurrentStep(taskData.step || 'Processing...');
      }
    } catch (error) {
      console.error("❌ Error polling task status:", error);
      
      if (isMountedRef.current) {
        // Check if it's been a while since last update
        const timeSinceLastUpdate = Date.now() - lastUpdateTime;
        
        if (timeSinceLastUpdate > 60000 && lastUpdateTime > 0) { // 60 seconds with no update
          console.log('⏰ Task appears to be stuck, resetting...');
          setTaskError('Task timed out. Please try again.');
          setPlaceOverview({
            total_trips: 0,
            average_rating: 0,
            sentiment_summary: { Positive: 0, Neutral: 0, Negative: 0 },
            all_tags: [],
            overview: "AI analysis is taking too long. Please try again with a different search.",
            search_query: lastSearchQuery,
            from_cache: false
          });
          resetProcessingState();
        } else {
          setCurrentStep('Waiting for server response...');
          // Continue polling on network errors
        }
      }
    }
  }, [token, resetProcessingState, stopPolling, clearTimers, lastUpdateTime, lastSearchQuery, mapTaskState]);

  // Start polling with interval
  const startPolling = useCallback((taskIdToPoll) => {
    stopPolling();
    
    // Initial poll immediately
    pollTaskStatus(taskIdToPoll);
    
    // Set up interval for polling - every 1.5 seconds
    pollingIntervalRef.current = setInterval(() => {
      pollTaskStatus(taskIdToPoll);
    }, 1500);
  }, [pollTaskStatus, stopPolling]);

  // Handle AI search with improved error handling
  const handleSearchPlace = useCallback(async (placeName) => {
    if (!placeName.trim() || isProcessing) {
      return;
    }

    const trimmedPlaceName = placeName.trim();
    
    // Reset states for new search
    resetProcessingState();
    setPlaceOverview(null);
    setLastSearchQuery(trimmedPlaceName);
    
    setIsProcessing(true);
    setProgress(5);
    setCurrentStep('Initializing AI analysis...');
    startProcessingTimer();

    try {
      console.log(`🔍 Starting AI search for: "${trimmedPlaceName}"`);
      
      // Create new abort controller for this request
      cleanupAbortController();
      abortControllerRef.current = new AbortController();
      
      const response = await axios.post(
        "http://127.0.0.1:8004/TravelExperienceAIOverview/", 
        { place_name: trimmedPlaceName }, 
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          timeout: 30000,
          signal: abortControllerRef.current.signal
        }
      );
      
      console.log('📨 API Response:', response.data);
      
      if (response.data.cached) {
        // Cached data available
        console.log('💾 Using cached data');
        setPlaceOverview({
          ...response.data.data,
          from_cache: true,
          search_query: trimmedPlaceName
        });
        setIsProcessing(false);
        setProgress(100);
        setCurrentStep('Loaded from cache');
        
        // Reset after showing cache
        setTimeout(() => {
          if (isMountedRef.current) {
            setProgress(0);
            setCurrentStep('');
          }
        }, 1500);
      } else if (response.data.task_id) {
        // New task started
        console.log('🚀 Task created with ID:', response.data.task_id);
        setTaskId(response.data.task_id);
        setProgress(20);
        setCurrentStep('Task created, processing started...');
        setLastUpdateTime(Date.now());
        
        // Start polling for this task
        startPolling(response.data.task_id);
      } else {
        console.error('❌ Unexpected response:', response.data);
        throw new Error('Unexpected server response');
      }
      
    } catch (error) {
      console.error("❌ Error starting AI overview:", error);
      
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('Request was cancelled');
        return;
      }
      
      let errorMessage = "Unable to generate AI overview at the moment. Please try again later.";
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = "AI analysis is taking longer than expected. The request timed out.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid search query. Please try a different search term.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
        navigate("/RegistrationForm");
        return;
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      setTaskError(errorMessage);
      setPlaceOverview({
        total_trips: 0,
        average_rating: 0,
        sentiment_summary: { Positive: 0, Neutral: 0, Negative: 0 },
        all_tags: [],
        overview: errorMessage,
        search_query: trimmedPlaceName,
        from_cache: false
      });
      
      resetProcessingState();
    }
  }, [token, isProcessing, resetProcessingState, startPolling, startProcessingTimer, navigate, cleanupAbortController]);

  // Cancel search
  const cancelSearch = useCallback(() => {
    console.log('⏹️ Cancelling search...');
    resetProcessingState();
    setPlaceOverview(null);
    setSearchQuery('');
    setLastSearchQuery('');
  }, [resetProcessingState]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/RegistrationForm");
    }
  }, [token, navigate]);

  // Fetch experiences with profile data
  useEffect(() => {
    if (!token) return;

    const fetchExperiences = async () => {
      setExperiencesLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8004/TravelExperienceListAPIViewbypage/", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        });
        const apiExperiences = res.data.results || [];
        
        const adaptedExperiences = apiExperiences.map(exp => ({
          id: exp.id,
          user_id: exp.user_id,
          userName: exp.user_profile?.name || 'Unknown User',
          profileImage: exp.user_profile?.profile_picture 
            ? `http://127.0.0.1:8002${exp.user_profile.profile_picture}` 
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
          timestamp: new Date(exp.date_of_visit).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          title: exp.title,
          place_name: exp.place_name,
          category: exp.category,
          description: exp.description,
          image: exp.image ? `http://127.0.0.1:8004${exp.image}` : null,
          video: exp.video ? `http://127.0.0.1:8004${exp.video}` : null,
          rating: exp.rating,
          date_of_visit: exp.date_of_visit,
          tags: exp.tags || [],
          sentiment: exp.sentiment,
          likes: 0,
          liked: false,
          reviews: [],
          comments: [],
          user_profile: exp.user_profile
        }));
        
        setExperiences(adaptedExperiences);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setExperiencesLoading(false);
      }
    };

    fetchExperiences();
  }, [token]);

  // Handle search query changes with debounce
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim() && searchQuery !== lastSearchQuery) {
        handleSearchPlace(searchQuery);
      } else if (!searchQuery.trim()) {
        setPlaceOverview(null);
        setLastSearchQuery('');
        resetProcessingState();
      }
    }, 800);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, lastSearchQuery, handleSearchPlace, resetProcessingState]);

  // Search functionality
  const filteredExperiences = searchQuery
    ? experiences.filter(exp =>
        exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.place_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : experiences;

  const isSearching = searchQuery !== '';

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    if (unreadCount > 0 && !showNotifications) {
      setUnreadCount(0);
    }
  };

  // Toggle messages panel
  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    if (unreadCount > 0 && !showMessages) {
      setUnreadCount(0);
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Enhanced Experience Card with messaging button
  const ExperienceCard = React.memo(({ exp }) => {
    const profileImageSrc = exp.user_profile?.profile_picture 
      ? `http://127.0.0.1:8002${exp.user_profile.profile_picture}`
      : exp.profileImage;
    const userprofileid = exp.user_profile?.user_id || exp.user_id;
    const userName = exp.user_profile?.name || exp.userName || 'Unknown User';
    const userLocation = exp.user_profile?.location || '';

    return (
      <div className="w-full bg-white/50 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 border border-gray-200 hover:border-teal-300">
        {/* Media Section */}
        {exp.image ? (
          <img
            alt={exp.title}
            className="w-full h-48 object-cover rounded-t-xl"
            src={exp.image}
            loading="lazy"
          />
        ) : exp.video ? (
          <video
            className="w-full h-48 object-cover rounded-t-xl"
            src={exp.video}
            controls
            muted
            preload="metadata"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center rounded-t-xl text-gray-500">
            <span className="material-symbols-outlined text-4xl text-teal-400">landscape</span>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5">
          {/* User Profile Header */}
          <div className="flex items-center justify-between mb-4">
            <div 
              onClick={() => { 
                dispatch(setMessageandProfileViewid(userprofileid)); 
                navigate('/ProfileOnly'); 
              }}    
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={profileImageSrc}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-400/50 shadow-sm"
                alt={`${userName}'s profile`}
                loading="lazy"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">{userName}</p>
                <p className="text-xs text-gray-600">{exp.timestamp}</p>
                {userLocation && (
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <span className="material-symbols-outlined text-xs mr-1">location_on</span>
                    {userLocation}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-teal-600 hover:text-teal-500 text-sm font-medium bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full transition-colors duration-200"
                onClick={() => setSelectedExperience(exp)}
                aria-label={`View details for ${exp.title}`}
              >
                Details
              </button>
              <button
                className="text-blue-600 hover:text-blue-500 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-200"
                onClick={() => startNewConversation(userprofileid)}
                aria-label={`Message ${userName}`}
              >
                <span className="material-symbols-outlined text-sm">message</span>
              </button>
            </div>
          </div>

          {/* Experience Details */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-black mb-2">{exp.title}</h3>
            <div className="flex items-center space-x-4 mb-2">
              {exp.place_name && (
                <span className="text-sm text-teal-600 font-medium flex items-center">
                  <span className="material-symbols-outlined text-base mr-1">place</span>
                  {exp.place_name}
                </span>
              )}
              {exp.category && (
                <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                  {exp.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{exp.description}</p>
          </div>

          {/* Tags */}
          {exp.tags && exp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {exp.tags.map((tag, index) => (
                <span 
                  key={`${exp.id}-tag-${index}`}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Rating and Stats */}
          <div className="flex items-center justify-between mb-3">
            {exp.rating && (
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.floor(exp.rating))}
                  {'☆'.repeat(5 - Math.floor(exp.rating))}
                </div>
                <span className="text-sm text-gray-600 ml-1">({exp.rating})</span>
              </div>
            )}
            {exp.sentiment && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                exp.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                exp.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {exp.sentiment}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex space-x-6">
              <button
                className="flex items-center space-x-2 text-teal-600 hover:text-teal-500 transition-colors duration-200"
                onClick={() => handleLikeExperience(exp.id)}
                aria-label={exp.liked ? `Unlike ${exp.title}` : `Like ${exp.title}`}
              >
                <svg
                  className={`w-5 h-5 ${exp.liked ? 'fill-current text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1a4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
                  />
                </svg>
                <span className="text-sm text-black">{exp.likes.toLocaleString()}</span>
              </button>
              <button
                className="flex items-center space-x-2 text-teal-600 hover:text-teal-500 transition-colors duration-200"
                onClick={() => setShowModal(`addComment-${exp.id}`)}
                aria-label={`Comment on ${exp.title}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="text-sm text-black">{exp.comments.length}</span>
              </button>
            </div>
            <button
              className="text-teal-600 hover:text-teal-500 text-sm font-medium bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full transition-colors duration-200"
              onClick={() => setShowModal(`addReview-${exp.id}`)}
              aria-label={`Add review for ${exp.title}`}
            >
              Add Review
            </button>
          </div>
        </div>
      </div>
    );
  });

  ExperienceCard.displayName = 'ExperienceCard';

  // Dummy function for likes
  const handleLikeExperience = (expId) => {
    console.log('Like experience:', expId);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-white font-display text-black">
      {/* Connection Status Indicator */}
      {/* <div className={`fixed top-4 right-20 z-50 p-2 rounded-lg text-white text-sm flex items-center space-x-2 ${
        wsConnected ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
        <span>{wsConnected ? '🔔 Connected' : '🔔 Disconnected'}</span>
      </div> */}

      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm shadow-teal-500/20 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Back Button */}
            <button className="button" onClick={() => navigate(-1)} aria-label="Go back">
            <div className="button-box">
              <span className="button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
                </svg>
              </span>
              <span className="button-elem">
                <svg viewBox="0 0 46 40">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
                </svg>
              </span>
            </div>
          </button>

            {/* Title */}
            <h1 className="text-2xl font-bold text-teal-600">TripVerse</h1>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/Calendar')} className="p-2" aria-label="Calendar">
                <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">
                  calendar_today
                </span>
              </button>

              <Link to={'/ProfilePage'} className="p-2" aria-label="Profile">
                <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">
                  account_circle
                </span>
              </Link>

              {/* Messages Button */}
              <button className="relative p-2" onClick={toggleMessages} aria-label="Messages">
                <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">
                  chat
                </span>
                {unreadCount > 0 && !showMessages && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Button */}
              <button className="relative p-2" onClick={toggleNotifications} aria-label="Notifications">
                <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">
                  notifications
                </span>
                {notifications.length > 0 && !showNotifications && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 z-10">search</span>
              <input
                className="w-full rounded-full border border-gray-300 bg-gray-50/60 pl-12 pr-20 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-gray-500 transition-all duration-300"
                placeholder="Search for experiences, places, or categories"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isProcessing}
                aria-label="Search experiences"
              />
              
              {/* Cancel button when processing */}
              {isProcessing && (
                <button
                  onClick={cancelSearch}
                  className="absolute right-4 bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-1.5 rounded-full transition-colors duration-200"
                  aria-label="Cancel search"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isSearching ? 'py-4 space-y-6' : 'py-8 space-y-12'}`}>
          {/* AI User Insights */}
          {!isSearching && (
            <section className="animate-fade-in">
              <h2 className="text-3xl font-bold text-black mb-4">AI-Generated Experience Overview</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Discover a smart summary of travel experiences similar to your search. Our AI analyzes destination trends, traveler reviews, and related experiences to give you an overall view of what makes this journey special.
              </p>
            </section>
          )}

          {/* Add New Experience */}
          {!isSearching && (
            <section className="bg-gray-50/50 backdrop-blur-lg rounded-xl p-6 shadow-lg shadow-teal-500/20 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">Share Your Experience</h2>
                <button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
                  onClick={() => navigate('/AddExperience')}
                  aria-label="Add new experience"
                >
                  Post Experience
                </button>
              </div>
            </section>
          )}

          {/* AI Processing Progress */}
          {isProcessing && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 shadow-lg shadow-teal-500/20 border border-teal-500/20">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-teal-600 flex items-center">
                  <span className="material-symbols-outlined mr-2 animate-spin">sync</span>
                  Generating AI Insights for "{lastSearchQuery}"
                </h3>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                {/* Progress Info */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{currentStep}</p>
                    <p className="text-xs text-gray-500">
                      Time elapsed: {processingTime}s {taskId && `• Task ID: ${taskId.slice(-8)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-teal-600">{progress}%</p>
                  </div>
                </div>
                
                {/* Progress Steps Visualization */}
                <div className="flex justify-between items-center pt-4">
                  {['Starting', 'Checking DB', 'Fetching Data', 'AI Processing', 'Completed'].map((step, index) => {
                    const stepProgress = [0, 20, 40, 70, 100][index];
                    const isActive = progress >= stepProgress;
                    const isCurrent = progress >= stepProgress && progress < (stepProgress + 20);
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isActive ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                        } ${isCurrent ? 'ring-2 ring-teal-300 ring-offset-2' : ''}`}>
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-xs font-medium">{step}</span>
                        {isCurrent && (
                          <div className="text-xs text-teal-600 font-bold mt-1">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {taskError && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 shadow-lg shadow-red-500/20 border border-red-500/20 animate-fade-in">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
                <div>
                  <h4 className="text-lg font-bold text-red-600">Processing Error</h4>
                  <p className="text-sm text-gray-700">{taskError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Place AI Overview when searching */}
          {!isProcessing && placeOverview && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 shadow-lg shadow-teal-500/20 border border-teal-500/20 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-teal-600">AI-Powered Insights for "{placeOverview.search_query || lastSearchQuery}"</h3>
                {placeOverview.from_cache && (
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center">
                    <span className="material-symbols-outlined text-xs mr-1">cached</span>
                    From Cache
                  </span>
                )}
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white/50 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-teal-600">{placeOverview.total_trips || 0}</p>
                  <p className="text-sm text-gray-600">Total Trips</p>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-teal-600">{placeOverview.average_rating?.toFixed(1) || 0}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg shadow-sm">
                  <div className="flex justify-center space-x-3 mb-2">
                    <div className="flex flex-col items-center">
                      <span className="text-green-600 font-bold text-lg">{placeOverview.sentiment_summary?.Positive || 0}</span>
                      <span className="text-xs text-green-600">Positive</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-gray-600 font-bold text-lg">{placeOverview.sentiment_summary?.Neutral || 0}</span>
                      <span className="text-xs text-gray-600">Neutral</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-600 font-bold text-lg">{placeOverview.sentiment_summary?.Negative || 0}</span>
                      <span className="text-xs text-red-600">Negative</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Sentiment</p>
                </div>
              </div>
              
              {/* Tags */}
              {placeOverview.all_tags && placeOverview.all_tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {placeOverview.all_tags.slice(0, 10).map((tag, index) => (
                      <span key={`tag-${index}`} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm shadow-sm">
                        {tag}
                      </span>
                    ))}
                    {placeOverview.all_tags.length > 10 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        +{placeOverview.all_tags.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* AI Overview */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Summary:</h4>
                <div className="text-sm text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  {placeOverview.overview || "No overview available."}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-right">
                Generated by AI • {placeOverview.from_cache ? 'Cached' : `Processed in ${placeOverview.processing_time || processingTime}s`}
              </div>
            </div>
          )}

          {/* Experiences Section */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold text-black mb-6">
              {isSearching ? `Search Results for "${searchQuery}"` : 'Traveler Experiences'}
            </h2>
            {experiencesLoading ? (
              <div className="flex items-center justify-center py-12">
                  <div id="wifi-loader">
                    <svg viewBox="0 0 86 86" className="circle-outer">
                      <circle r="40" cy="43" cx="43" className="back"></circle>
                      <circle r="40" cy="43" cx="43" className="front"></circle>
                      <circle r="40" cy="43" cx="43" className="new"></circle>
                    </svg>
                    <svg viewBox="0 0 60 60" className="circle-middle">
                      <circle r="27" cy="30" cx="30" className="back"></circle>
                      <circle r="27" cy="30" cx="30" className="front"></circle>
                    </svg>
                    <svg viewBox="0 0 34 34" className="circle-inner">
                      <circle r="14" cy="17" cx="17" className="back"></circle>
                      <circle r="14" cy="17" cx="17" className="front"></circle>
                    </svg>
                    <div data-text="Searching" className="text"></div>
                  </div>
                </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExperiences.map(exp => (
                    <ExperienceCard key={exp.id} exp={exp} />
                  ))}
                </div>
                {filteredExperiences.length === 0 && isSearching && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-lg">No experiences found for "{searchQuery}".</p>
                    <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
                  </div>
                )}
                {filteredExperiences.length === 0 && !isSearching && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🌍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Experiences Yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share your travel adventure!</p>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg"
                      onClick={() => navigate('/AddExperience')}
                    >
                      Share Your First Experience
                    </button>
                  </div>
                )}
                {!isSearching && filteredExperiences.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
                      aria-label="Load more experiences"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      {/* Enhanced Messages Sidebar */}
      {showMessages && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-lg shadow-2xl shadow-teal-500/20 border-l-2 border-teal-500/50 z-50 overflow-hidden animate-slide-in flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-teal-600 flex items-center">
                <span className="material-symbols-outlined mr-2">chat</span>
                Messages
                {wsConnected && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Live
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowMessages(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Close messages"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left: Conversations */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-3 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-1">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => fetchMessages(conv.id)}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedConversation === conv.id ? 'bg-teal-50 border-r-4 border-teal-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                          {conv.participant_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {conv.participant_name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {conv.last_message || 'No messages yet'}
                          </p>
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">forum</span>
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                    <p className="text-gray-400 text-xs mt-1">Start a conversation by messaging a user</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Messages */}
            <div className="w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Messages Header */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm">
                        {conversations.find(c => c.id === selectedConversation)?.participant_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {conversations.find(c => c.id === selectedConversation)?.participant_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === authuserid ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs rounded-2xl px-4 py-2 ${
                              msg.sender_id === authuserid
                                ? 'bg-teal-500 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-75 mt-1 text-right">
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">message</span>
                          <p className="text-gray-500">No messages yet</p>
                          <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send message"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">forum</span>
                    <h4 className="font-medium text-gray-700 mb-2">Select a conversation</h4>
                    <p className="text-gray-500 text-sm">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Notifications Sidebar */}
      {showNotifications && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl shadow-teal-500/20 border-l-2 border-teal-500/50 z-50 overflow-y-auto animate-slide-in">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <h3 className="text-lg font-bold text-teal-600 flex items-center justify-between">
              <span className="flex items-center">
                <span className="material-symbols-outlined mr-2">notifications</span>
                Notifications
              </span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={clearAllNotifications}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowNotifications(false)} 
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Close notifications"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </h3>
          </div>
          <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border-l-4 border-teal-400 shadow-sm">
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-teal-600">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">schedule</span>
                      {notif.timestamp}
                    </span>
                    {notif.type && (
                      <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                        {notif.type}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">notifications_off</span>
                <p className="text-gray-500 mb-2">No notifications yet.</p>
                <p className="text-xs text-gray-400">Notifications will appear here when you receive updates.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">
          <button onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-500 transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </button>
          <button onClick={() => navigate('/TravelPlannerofBadget')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
            <span className="text-sm font-medium">Expense</span>
          </button>
        </nav>
      </footer>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(20, 184, 166, 0.5);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(20, 184, 166, 0.7);
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: rgba(229, 231, 235, 0.3);
          border-radius: 3px;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ExperienceSide;