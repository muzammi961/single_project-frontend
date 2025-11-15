// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom"; 
// import { useSelector, useDispatch } from 'react-redux';
// import axios from "axios";
// import { setMessageandProfileViewid } from '../actioncreate';

// // WebSocket Manager Hook
// const useWebSocketManager = () => {
//   const sockets = useRef({
//     comments: new Map(),
//     likes: new Map(),
//     notification: null
//   });

//   const createWebSocket = useCallback((url) => {
//     const token = localStorage.getItem("access_token");
//     const wsUrl = token ? `${url}?token=${token}` : url;
    
//     try {
//       const socket = new WebSocket(wsUrl);
//       return socket;
//     } catch (error) {
//       console.error("Failed to create WebSocket:", error);
//       return null;
//     }
//   }, []);

//   const initializeCommentSocket = useCallback((postId, onMessage, onError) => {
//     // Remove existing socket if exists
//     if (sockets.current.comments.has(postId)) {
//       const oldSocket = sockets.current.comments.get(postId);
//       if (oldSocket.readyState === WebSocket.OPEN) {
//         oldSocket.close();
//       }
//       sockets.current.comments.delete(postId);
//     }

//     const socket = createWebSocket(`ws://127.0.0.1:8004/ws/comments/${postId}/`);
//     if (!socket) {
//       onError(new Error('Failed to create socket'));
//       return null;
//     }

//     socket.onopen = () => {
//       console.log(`💬 Comment WebSocket connected for post ${postId}`);
//     };

//     socket.onmessage = onMessage;

//     socket.onerror = onError;

//     socket.onclose = (event) => {
//       console.log(`💬 Comment WebSocket closed for post ${postId}:`, event.code);
//       sockets.current.comments.delete(postId);
//     };

//     sockets.current.comments.set(postId, socket);
//     return socket;
//   }, [createWebSocket]);

//   const initializeLikeSocket = useCallback((postId, onMessage, onError) => {
//     if (sockets.current.likes.has(postId)) {
//       const oldSocket = sockets.current.likes.get(postId);
//       if (oldSocket.readyState === WebSocket.OPEN) {
//         oldSocket.close();
//       }
//       sockets.current.likes.delete(postId);
//     }

//     const socket = createWebSocket(`ws://127.0.0.1:8004/ws/likes/${postId}/`);
//     if (!socket) {
//       onError(new Error('Failed to create socket'));
//       return null;
//     }

//     socket.onopen = () => {
//       console.log(`❤️ Like WebSocket connected for post ${postId}`);
//     };

//     socket.onmessage = onMessage;

//     socket.onerror = onError;

//     socket.onclose = (event) => {
//       console.log(`❤️ Like WebSocket closed for post ${postId}:`, event.code);
//       sockets.current.likes.delete(postId);
//     };

//     sockets.current.likes.set(postId, socket);
//     return socket;
//   }, [createWebSocket]);

//   const initializeNotificationSocket = useCallback((userId, onMessage, onError) => {
//     if (sockets.current.notification) {
//       const oldSocket = sockets.current.notification;
//       if (oldSocket.readyState === WebSocket.OPEN) {
//         oldSocket.close();
//       }
//       sockets.current.notification = null;
//     }

//     const socket = createWebSocket(`ws://127.0.0.1:8004/ws/notifications/${userId}/`);
//     if (!socket) {
//       onError(new Error('Failed to create socket'));
//       return null;
//     }

//     socket.onopen = () => {
//       console.log("🔔 Notification WebSocket connected");
//     };

//     socket.onmessage = onMessage;

//     socket.onerror = onError;

//     socket.onclose = (event) => {
//       console.log("🔔 Notification WebSocket closed:", event.code);
//       sockets.current.notification = null;
//     };

//     sockets.current.notification = socket;
//     return socket;
//   }, [createWebSocket]);

//   const sendComment = useCallback((postId, text, userId) => {
//     const socket = sockets.current.comments.get(postId);
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         socket.send(JSON.stringify({
//           user_id: userId,
//           text: text
//         }));
//         return true;
//       } catch (error) {
//         console.error("Error sending comment via WebSocket:", error);
//         return false;
//       }
//     }
//     console.warn("Comment WebSocket not connected for post", postId);
//     return false;
//   }, []);

//   const toggleLike = useCallback((postId, userId) => {
//     const socket = sockets.current.likes.get(postId);
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         socket.send(JSON.stringify({ 
//           user_id: userId 
//         }));
//         return true;
//       } catch (error) {
//         console.error("Error sending like via WebSocket:", error);
//         return false;
//       }
//     }
//     console.warn("Like WebSocket not connected for post", postId);
//     return false;
//   }, []);

//   const closeAllWebSockets = useCallback(() => {
//     // Close comment sockets
//     sockets.current.comments.forEach((socket, postId) => {
//       if (socket.readyState === WebSocket.OPEN) {
//         socket.close(1000, "Component unmounting");
//       }
//     });
//     sockets.current.comments.clear();

//     // Close like sockets
//     sockets.current.likes.forEach((socket, postId) => {
//       if (socket.readyState === WebSocket.OPEN) {
//         socket.close(1000, "Component unmounting");
//       }
//     });
//     sockets.current.likes.clear();

//     // Close notification socket
//     if (sockets.current.notification && sockets.current.notification.readyState === WebSocket.OPEN) {
//       sockets.current.notification.close(1000, "Component unmounting");
//     }
//     sockets.current.notification = null;
//   }, []);

//   return {
//     initializeCommentSocket,
//     initializeLikeSocket,
//     initializeNotificationSocket,
//     sendComment,
//     toggleLike,
//     closeAllWebSockets
//   };
// };

// // Data Management Hook
// const useProfileData = () => {
//   const [profileData, setProfileData] = useState({});
//   const [posts, setPosts] = useState([]);
//   const [ffCount, setFfCount] = useState({ followersCount: 0, followingCoun: 0 });
//   const [notifications, setNotifications] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [loading, setLoading] = useState({
//     profile: false,
//     posts: false,
//     followers: false,
//     following: false,
//     notifications: false
//   });

//   const base = "http://127.0.0.1:8002";
//   const expBase = "http://127.0.0.1:8004";
//   const countBase = "http://127.0.0.1:8003";

//   const userId = useSelector(state => state.app.messageandprofileviewid);
//   const authuserid = useSelector(state => state.app.autherazeduserId);
//   const accesstoken = localStorage.getItem("access_token");

//   // Utility functions
//   const safeRender = useCallback((value, defaultValue = "") => {
//     if (value == null) return defaultValue;
//     if (typeof value === 'string' || typeof value === 'number') return value;
//     if (typeof value === 'boolean') return value.toString();
//     if (Array.isArray(value)) return value.join(', ');
//     if (typeof value === 'object') {
//       try {
//         return JSON.stringify(value);
//       } catch {
//         return defaultValue;
//       }
//     }
//     return defaultValue;
//   }, []);

//   const cleanProfileData = useCallback((data) => {
//     if (!data || typeof data !== 'object') return {};
    
//     return {
//       ...data,
//       name: safeRender(data.name, "Unnamed"),
//       bio: safeRender(data.bio, "Tell something about this profile..."),
//       location: safeRender(data.location, "Unknown location"),
//       gender: safeRender(data.gender, "—"),
//       date_of_birth: safeRender(data.date_of_birth, "—"),
//       contact_number: safeRender(data.contact_number, "—"),
//       social_links: safeRender(data.social_links, ""),
//       profile_picture: data.profile_picture || "",
//       cover_photo: data.cover_photo || ""
//     };
//   }, [safeRender]);

//   const getTimeAgo = useCallback((dateString) => {
//     if (!dateString) return "Unknown";
//     const now = new Date();
//     const past = new Date(dateString);
//     const diff = now - past;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     if (days < 1) return "Today";
//     if (days < 7) return `${days} days ago`;
//     if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
//     return `${Math.floor(days / 30)} months ago`;
//   }, []);

//   // API functions
//   const fetchProfileData = useCallback(async () => {
//     if (!userId || !accesstoken) return;
    
//     setLoading(prev => ({ ...prev, profile: true }));
//     try {
//       const response = await axios.get(`${base}/SpecificUserProfile/${userId}/`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       console.log(response.data)
//       setProfileData(cleanProfileData(response.data));
//     } catch (error) {
//       console.error("Profile fetch failed:", error);
//       setProfileData({});
//     } finally {
//       setLoading(prev => ({ ...prev, profile: false }));
//     }
//   }, [userId, accesstoken, base, cleanProfileData]);

//   const fetchCounts = useCallback(async () => {
//     if (!userId || !accesstoken) return;
    
//     try {
//       const response = await axios.get(`${countBase}/CountofFollwerandFollwingByspecific/${userId}`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       setFfCount({
//         followersCount: response.data.followersCount || 0,
//         followingCoun: response.data.followingCoun || 0
//       });
//     } catch (error) {
//       console.error("Count fetch failed:", error);
//       setFfCount({ followersCount: 0, followingCoun: 0 });
//     }
//   }, [userId, accesstoken, countBase]);

//   const fetchUserPosts = useCallback(async () => {
//     if (!userId || !accesstoken) return;
    
//     setLoading(prev => ({ ...prev, posts: true }));
//     try {
//       const response = await axios.get(`${expBase}/TravalExperienceGetspecificuserDatas/${userId}/`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       console.log('data',response.data)
//       if (response.data?.data) {
//         const uniqueExperiences = response.data.data.filter((exp, index, self) => 
//           index === self.findIndex(e => e.id === exp.id)
//         );
        
//         const userName = "User"; // Fallback name
//         let experiencesData = uniqueExperiences.map(exp => ({
//           id: exp.id,
//           userName,
//           title: exp.title || "Untitled",
//           content: exp.description ? exp.description.substring(0, 100) + (exp.description.length > 100 ? "..." : "") : "No description",
//           place_name: exp.place_name || "Unknown location",
//           category: exp.category || "General",
//           description: exp.description || "",
//           rating: exp.rating || 0,
//           date_of_visit: exp.date_of_visit,
//           tags: exp.tags || [],
//           media: exp.image 
//             ? [{ type: "image", url: `${expBase}${exp.image}`, caption: exp.title, aspect: "square" }]
//             : exp.video 
//             ? [{ type: "video", url: `${expBase}${exp.video}`, poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=300", aspect: "16:9" }]
//             : [],
//           comments: (exp.comments || []).map(c => ({
//             id: c.id,
//             userName: c.user_name || `User${c.user_id}`,
//             content: c.content || c.text || "",
//             timestamp: c.timestamp || c.created_at,
//             user_id: c.user_id
//           })),
//           timestamp: getTimeAgo(exp.created_at),
//           likes: exp.like_count || exp.likes || 0,
//           isLiked: exp.is_liked || false,
//           sentiment: exp.sentiment,
//           privacy: exp.privacy,
//         })).filter(post => post.media.length > 0);

//         // Fetch like status if authenticated and posts exist
//         if (experiencesData.length > 0 && authuserid && accesstoken) {
//           const firstPostId = experiencesData[0].id;
//           try {
//             const likeResponse = await axios.get(`${expBase}/TravelExperienceLikeStatusAPIView/${firstPostId}/${userId}/`, {
//               headers: { Authorization: `Bearer ${accesstoken}` },
//             });
//             const likedPostIds = new Set(likeResponse.data.liked_posts.map(p => p.id));
//             experiencesData = experiencesData.map(post => ({
//               ...post,
//               isLiked: likedPostIds.has(post.id)
//             }));
//           } catch (likeError) {
//             console.error("Like status fetch failed:", likeError);
//             // Proceed with original isLiked
//           }
//         }
        
//         setPosts(experiencesData);
//       }
//     } catch (error) {
//       console.error("Experience fetch failed:", error);
//       setPosts([]);
//     } finally {
//       setLoading(prev => ({ ...prev, posts: false }));
//     }
//   }, [userId, accesstoken, expBase, getTimeAgo, authuserid]);

//   const fetchPostComments = useCallback(async (postId) => {
//     if (!postId || !accesstoken) return [];
//     try {
//       const response = await axios.get(`${expBase}/UserCommentsBYUseridandPostid/${postId}/`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       const commentsData = response.data.comments || [];
//       const mappedComments = commentsData.map(c => ({
//         id: c.id,
//         userName: c.user_name || `User${c.user_id}`,
//         content: c.content || c.text || "",
//         timestamp: c.created_at,
//         user_id: c.user_id
//       })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//       return mappedComments;
//     } catch (error) {
//       console.error("Comments fetch failed:", error);
//       return [];
//     }
//   }, [accesstoken, expBase]);

//   const fetchNotifications = useCallback(async () => {
//     if (!accesstoken) return;
    
//     setLoading(prev => ({ ...prev, notifications: true }));
//     try {
//       const response = await axios.get(`${expBase}/get_notifications/`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       console.log(response.data)
//       setNotifications(response.data?.map(n => ({
//         id: n.id,
//         type: n.notification_type,
//         message: n.message,
//         timestamp: n.created_at,
//         read: n.is_read,
//         sender_id: n.sender_id
//       })) || []);
//     } catch (error) {
//       console.error("Notifications fetch failed:", error);
//       setNotifications([]);
//     } finally {
//       setLoading(prev => ({ ...prev, notifications: false }));
//     }
//   }, [accesstoken, expBase]);

//   const fetchFollowers = useCallback(async () => {
//     if (!userId || !accesstoken) return;
    
//     setLoading(prev => ({ ...prev, followers: true }));
//     try {
//       const response = await axios.get(`${countBase}/SpecificUserFolloweListView/${userId}/`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       setFollowers(response.data || []);
//     } catch (error) {
//       console.error("Followers fetch failed:", error);
//       setFollowers([]);
//     } finally {
//       setLoading(prev => ({ ...prev, followers: false }));
//     }
//   }, [userId, accesstoken, countBase]);

//   const fetchFollowing = useCallback(async () => {
//     if (!userId || !accesstoken) return;
    
//     setLoading(prev => ({ ...prev, following: true }));
//     try {
//       const response = await axios.get(`${countBase}/SpecificUserFollowingListView/${userId}/`, {
//         headers: { Authorization: `Bearer ${accesstoken}` },
//       });
//       setFollowing(response.data || []);
//     } catch (error) {
//       console.error("Following fetch failed:", error);
//       setFollowing([]);
//     } finally {
//       setLoading(prev => ({ ...prev, following: false }));
//     }
//   }, [userId, accesstoken, countBase]);

//   return {
//     profileData: cleanProfileData(profileData),
//     posts,
//     ffCount,
//     notifications,
//     followers,
//     following,
//     loading,
//     setPosts, // Added this to fix the error
//     setNotifications, // Added this for consistency
//     fetchProfileData,
//     fetchCounts,
//     fetchUserPosts,
//     fetchPostComments,
//     fetchNotifications,
//     fetchFollowers,
//     fetchFollowing,
//     safeRender,
//     getTimeAgo
//   };
// };

// // Main Profile Component
// export default function ProfileOnly() {
//   const navigate = useNavigate(); 
//   const dispatch = useDispatch();
  
//   // State management
//   const [activeTab, setActiveTab] = useState("All");
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [hoveredPostId, setHoveredPostId] = useState(null);
//   const [showFollowersModal, setShowFollowersModal] = useState(false);
//   const [showFollowingModal, setShowFollowingModal] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState({});

//   // Custom hooks
//   const {
//     profileData,
//     posts,
//     ffCount,
//     notifications,
//     followers,
//     following,
//     loading,
//     setPosts,
//     setNotifications,
//     fetchProfileData,
//     fetchCounts,
//     fetchUserPosts,
//     fetchPostComments,
//     fetchNotifications,
//     fetchFollowers,
//     fetchFollowing,
//     safeRender,
//     getTimeAgo
//   } = useProfileData();

//   const {
//     initializeCommentSocket,
//     initializeLikeSocket,
//     initializeNotificationSocket,
//     sendComment,
//     toggleLike,
//     closeAllWebSockets
//   } = useWebSocketManager();

//   const userId = useSelector(state => state.app.messageandprofileviewid);
//   const authuserid = useSelector(state => state.app.autherazeduserId);
//   const accesstoken = localStorage.getItem("access_token");
//   const expBase = "http://127.0.0.1:8004";

//   // WebSocket message handlers
//   const handleCommentMessage = useCallback((postId) => (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("💬 New comment received:", data);
      
//       const newComment = {
//         id: data.id,
//         userName: data.user_name || `User${data.user_id}`,
//         content: data.text,
//         timestamp: data.timestamp,
//         user_id: data.user_id
//       };
      
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post.id === postId 
//             ? { 
//                 ...post, 
//                 comments: [...(post.comments || []), newComment],
//                 commentsCount: (post.comments?.length || 0) + 1
//               }
//             : post
//         )
//       );

//       if (selectedPost && selectedPost.id === postId) {
//         setSelectedPost(prev => ({
//           ...prev,
//           comments: [...(prev.comments || []), newComment]
//         }));
//       }
//     } catch (error) {
//       console.error("Error processing comment message:", error);
//     }
//   }, [selectedPost, setPosts]);

//   const handleLikeMessage = useCallback((postId) => (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("❤️ Like update received:", data);
      
//       setPosts(prevPosts => 
//         prevPosts.map(post => {
//           if (post.id === postId) {
//             return {
//               ...post,
//               likes: data.like_count || data.likes || 0,
//               isLiked: data.user_id === authuserid ? data.liked : post.isLiked
//             };
//           }
//           return post;
//         })
//       );

//       if (selectedPost && selectedPost.id === postId) {
//         setSelectedPost(prev => ({
//           ...prev,
//           likes: data.like_count || data.likes || 0,
//           isLiked: data.user_id === authuserid ? data.liked : prev.isLiked
//         }));
//       }
//     } catch (error) {
//       console.error("Error processing like message:", error);
//     }
//   }, [selectedPost, authuserid, setPosts]);

//   const handleNotificationMessage = useCallback((event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("🔔 New notification received:", data);
      
//       const newNotif = {
//         id: data.id || Date.now(),
//         type: data.notification_type,
//         message: data.message || `New ${data.notification_type?.toLowerCase()} notification`,
//         timestamp: data.timestamp || data.created_at,
//         read: false,
//         sender_id: data.sender_id,
//         ...data
//       };
      
//       setNotifications(prev => [newNotif, ...prev]);
//     } catch (error) {
//       console.error("Error processing notification message:", error);
//     }
//   }, [setNotifications]);

//   const handleWebSocketError = useCallback((type, postId = null) => (error) => {
//     console.error(`${type} WebSocket error ${postId ? `for post ${postId}` : ''}:`, error);
//     setConnectionStatus(prev => ({ 
//       ...prev, 
//       [`${type}_${postId}`]: { connected: false, error: error.message } 
//     }));
//   }, []);

//   const handleWebSocketOpen = useCallback((type, postId = null) => () => {
//     console.log(`${type} WebSocket connected ${postId ? `for post ${postId}` : ''}`);
//     setConnectionStatus(prev => ({ 
//       ...prev, 
//       [`${type}_${postId}`]: { connected: true, error: null } 
//     }));
//   }, []);

//   // API fallback functions - Moved inside the component to access setPosts
//   const sendCommentAPI = useCallback(async (postId, text) => {
//     try {
//       const response = await axios.post(
//         `${expBase}/posts/${postId}/comments/`,
//         {
//           user_id: authuserid,
//           text: text
//         },
//         {
//           headers: { Authorization: `Bearer ${accesstoken}` },
//           timeout: 10000
//         }
//       );
      
//       if (response.data) {
//         const newComment = {
//           id: response.data.id,
//           userName: "You",
//           content: text,
//           timestamp: response.data.timestamp || new Date().toISOString(),
//           user_id: authuserid
//         };
        
//         setPosts(prevPosts => 
//           prevPosts.map(post => 
//             post.id === postId 
//               ? { 
//                   ...post, 
//                   comments: [...(post.comments || []), newComment],
//                   commentsCount: (post.comments?.length || 0) + 1
//                 }
//               : post
//           )
//         );

//         if (selectedPost && selectedPost.id === postId) {
//           setSelectedPost(prev => ({
//             ...prev,
//             comments: [...(prev.comments || []), newComment]
//           }));
//         }
//       }
      
//       return true;
//     } catch (error) {
//       console.error("API fallback for comment failed:", error);
//       return false;
//     }
//   }, [authuserid, expBase, accesstoken, selectedPost, setPosts]);

//   const toggleLikeAPI = useCallback(async (postId) => {
//     try {
//       const response = await axios.post(
//         `${expBase}/posts/${postId}/toggle_like/`,
//         {
//           user_id: authuserid
//         },
//         {
//           headers: { Authorization: `Bearer ${accesstoken}` },
//           timeout: 10000
//         }
//       );
      
//       if (response.data) {
//         setPosts(prevPosts => 
//           prevPosts.map(post => {
//             if (post.id === postId) {
//               return {
//                 ...post,
//                 likes: response.data.like_count || response.data.likes || 0,
//                 isLiked: response.data.liked || response.data.is_liked || false
//               };
//             }
//             return post;
//           })
//         );

//         if (selectedPost && selectedPost.id === postId) {
//           setSelectedPost(prev => ({
//             ...prev,
//             likes: response.data.like_count || response.data.likes || 0,
//             isLiked: response.data.liked || response.data.is_liked || false
//           }));
//         }
//       }
      
//       return true;
//     } catch (error) {
//       console.error("API fallback for like failed:", error);
//       return false;
//     }
//   }, [authuserid, expBase, accesstoken, selectedPost, setPosts]);

//   // Combined functions with WebSocket fallback to API
//   const sendCommentWithFallback = useCallback(async (postId, text) => {
//     // Try WebSocket first
//     const wsSuccess = sendComment(postId, text, authuserid);
    
//     if (wsSuccess) {
//       console.log("Comment sent via WebSocket");
//       return true;
//     }
    
//     // Fallback to API
//     console.log("WebSocket not available, using API fallback for comment");
//     return await sendCommentAPI(postId, text);
//   }, [sendComment, sendCommentAPI, authuserid]);

//   const toggleLikeWithFallback = useCallback(async (postId) => {
//     // Try WebSocket first
//     const wsSuccess = toggleLike(postId, authuserid);
    
//     if (wsSuccess) {
//       console.log("Like sent via WebSocket");
//       return true;
//     }
    
//     // Fallback to API
//     console.log("WebSocket not available, using API fallback for like");
//     return await toggleLikeAPI(postId);
//   }, [toggleLike, toggleLikeAPI, authuserid]);

//   // Initialize WebSockets for posts
//   useEffect(() => {
//     posts.forEach(post => {
//       // Initialize comment socket
//       initializeCommentSocket(
//         post.id, 
//         handleCommentMessage(post.id), 
//         handleWebSocketError('comment', post.id)
//       );
      
//       // Initialize like socket
//       initializeLikeSocket(
//         post.id, 
//         handleLikeMessage(post.id), 
//         handleWebSocketError('like', post.id)
//       );
//     });
//   }, [posts, initializeCommentSocket, initializeLikeSocket, handleCommentMessage, handleLikeMessage, handleWebSocketError]);

//   // Initialize notification WebSocket
//   useEffect(() => {
//     if (authuserid) {
//       initializeNotificationSocket(
//         authuserid,
//         handleNotificationMessage,
//         handleWebSocketError('notification')
//       );
//     }
//   }, [authuserid, initializeNotificationSocket, handleNotificationMessage, handleWebSocketError]);

//   // Fetch initial data
//   useEffect(() => {
//     if (userId && accesstoken) {
//       fetchCounts();
//       fetchProfileData();
//     }
//   }, [userId, accesstoken, fetchCounts, fetchProfileData]);

//   useEffect(() => {
//     if (userId && accesstoken) {
//       fetchUserPosts();
//     }
//   }, [userId, accesstoken, fetchUserPosts]);

//   useEffect(() => {
//     if (authuserid && accesstoken) {
//       fetchNotifications();
//     }
//   }, [authuserid, accesstoken, fetchNotifications]);
//   useEffect(() => {
//     if (selectedPost?.id && accesstoken) {
//       fetchPostComments(selectedPost.id).then((comments) => {
//         setSelectedPost((prev) => ({
//           ...prev,
//           comments: comments
//         }));
//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post.id === selectedPost.id ? { ...post, comments: comments } : post
//           )
//         );
//       });
//     }
//   }, [selectedPost?.id, fetchPostComments, accesstoken, selectedPost?.id, setPosts]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       closeAllWebSockets();
//     };
//   }, [closeAllWebSockets]);

//   // UI helper functions
//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return "Unknown date";
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   }, []);

//   const handlePostClick = useCallback((post) => {
//     setSelectedPost(post);
//     setShowComments(true);
//   }, []);

//   const handleAddComment = useCallback(async () => {
//     if (newComment.trim() === "" || !selectedPost) return;
    
//     const success = await sendCommentWithFallback(selectedPost.id, newComment.trim());
//     if (success) {
//       setNewComment("");
//     } else {
//       alert("Failed to post comment. Please try again.");
//     }
//   }, [newComment, selectedPost, sendCommentWithFallback]);

//   const handleLike = useCallback(async (postId, e) => {
//     e?.stopPropagation();
//     await toggleLikeWithFallback(postId);
//   }, [toggleLikeWithFallback]);

//   const handleViewFollowers = useCallback(() => {
//     if (followers.length === 0) {
//       fetchFollowers();
//     }
//     setShowFollowersModal(true);
//   }, [followers.length, fetchFollowers]);

//   const handleViewFollowing = useCallback(() => {
//     if (following.length === 0) {
//       fetchFollowing();
//     }
//     setShowFollowingModal(true);
//   }, [following.length, fetchFollowing]);

//   const handleToggleNotifications = useCallback(() => {
//     setShowNotifications(!showNotifications);
//   }, [showNotifications]);

//   const markNotificationAsRead = useCallback((notificationId) => {
//     setNotifications(prev => 
//       prev.map(notif => 
//         notif.id === notificationId ? { ...notif, read: true } : notif
//       )
//     );
//   }, [setNotifications]);

//   // Filter posts based on active tab
//   const imagePosts = posts.filter((post) => post.media[0]?.type === "image");
//   const videoPosts = posts.filter((post) => post.media[0]?.type === "video");

//   const getCurrentPosts = useCallback(() => {
//     switch (activeTab) {
//       case "All": return posts;
//       case "Images": return imagePosts;
//       case "Videos": return videoPosts;
//       default: return posts;
//     }
//   }, [activeTab, posts, imagePosts, videoPosts]);

//   // Render functions
//   const renderUserList = useCallback((users, title) => {
//     const isFollowers = title.includes('Followers');
//     const closeHandler = isFollowers ? () => setShowFollowersModal(false) : () => setShowFollowingModal(false);
//     const currentLoading = isFollowers ? loading.followers : loading.following;
//     console.log('following datas ',user)
//     const userList = users || [];

//     return (
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-black">{title}</h3>
//           <button onClick={closeHandler} className="text-gray-500 hover:text-black">
//             <span className="material-symbols-outlined">close</span>
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {userList.length > 0 ? (
//             userList.map((user) => {
//               const safeName = safeRender(user.name, "Unnamed User");
//               const safeBio = safeRender(user.bio, "No bio available");
//               // const profile_picture=selectedPost(user.profile_picture,"no profile image");
//               // const cover_photo=selectedPost(user.cover_photo,"no cover image");
              
//               return (
//                 <div
//                   key={`user-${user.user_id}`}
//                   onClick={() => {
//                     dispatch(setMessageandProfileViewid(user.user_id));
//                     navigate('/ProfileOnly');
//                     closeHandler();
//                   }}
//                   className="flex items-satart space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
//                     {safeName ? safeName.charAt(0).toUpperCase() : "?"}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-black text-sm truncate">{safeName}</p>
//                     <p className="text-xs text-black truncate">{safeBio}</p>
//                   </div>
//                   <button className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm self-start hover:bg-teal-600 transition">
//                     Follow
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             currentLoading ? (
//               <div className="text-center py-8 text-gray-500">
//                 <span className="material-symbols-outlined text-4xl mb-2">hourglass_empty</span>
//                 <p>Loading...</p>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
//                 <p>No users found</p>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     );
//   }, [dispatch, loading.followers, loading.following, navigate, safeRender]);

//   const renderNotificationPanel = useCallback(() => {
//     return (
//       <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
//         <div className="p-4 border-b border-gray-200">
//           <h3 className="text-lg font-bold text-black">Notifications</h3>
//         </div>
//         <div className="p-2">
//           {notifications.length > 0 ? (
//             notifications.map((notification) => (
//               <div
//                 key={`notification-${notification.id}`}
//                 className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
//                   notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
//                 }`}
//                 onClick={() => markNotificationAsRead(notification.id)}
//               >
//                 <div className="flex items-start space-x-3">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     notification.type === 'LIKE' ? 'bg-red-100 text-red-600' :
//                     notification.type === 'COMMENT' ? 'bg-blue-100 text-blue-600' :
//                     'bg-green-100 text-green-600'
//                   }`}>
//                     <span className="material-symbols-outlined text-sm">
//                       {notification.type === 'LIKE' ? 'favorite' :
//                        notification.type === 'COMMENT' ? 'chat_bubble' : 'person_add'}
//                     </span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {getTimeAgo(notification.timestamp)}
//                     </p>
//                   </div>
//                   {!notification.read && (
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <span className="material-symbols-outlined text-4xl mb-2">notifications</span>
//               <p className="text-sm">No notifications yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }, [notifications, markNotificationAsRead, getTimeAgo]);

//   const renderPostGrid = useCallback((currentPosts, tab) => {
//     const title = tab === "All" ? "All Posts" : `${tab} Only`;
    
//     return (
//       <section>
//         <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
//         {currentPosts.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//             {currentPosts.map((post) => {
//               const media = post.media[0];
//               if (!media) return null;
              
//               const isVideo = media.type === "video";
//               const displayUrl = isVideo ? (media.poster || "https://via.placeholder.com/400x300?text=Video") : media.url;
//               const isHovered = hoveredPostId === post.id;

//               return (
//                 <div 
//                   key={`post-${post.id}`}
//                   className="relative aspect-square group cursor-pointer"
//                   onClick={() => handlePostClick(post)}
//                   onMouseEnter={() => setHoveredPostId(post.id)}
//                   onMouseLeave={() => setHoveredPostId(null)}
//                 >
//                   <img
//                     src={displayUrl}
//                     alt={media.caption || post.title}
//                     className="w-full h-full object-cover rounded-lg"
//                     loading="lazy"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/400x400?text=Image+Error";
//                     }}
//                   />
                  
//                   {isVideo && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
//                       <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
//                     </div>
//                   )}
                  
//                   {/* Hover Overlay */}
//                   {isHovered && (
//                     <div className="absolute inset-0 bg-black/80 transition-opacity duration-300 rounded-lg flex flex-col justify-between p-4">
//                       <div className="text-white">
//                         <div className="text-lg font-bold mb-2">{post.title}</div>
//                         <div className="text-sm mb-1 flex items-center">
//                           <span className="material-symbols-outlined text-base mr-1">location_on</span>
//                           {post.place_name}
//                         </div>
//                         <div className="text-xs text-gray-300 mt-2 line-clamp-2">
//                           {post.description}
//                         </div>
//                       </div>
                      
//                       <div className="text-white text-sm">
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="flex items-center">
//                             <span className="material-symbols-outlined text-yellow-400 text-base mr-1">star</span>
//                             <span>Rating: {post.rating}/5</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center justify-between text-white">
//                         <div className="flex items-center space-x-4">
//                           <div 
//                             className="flex items-center space-x-1 cursor-pointer"
//                             onClick={(e) => handleLike(post.id, e)}
//                           >
//                             <span className={`material-symbols-outlined text-lg ${
//                               post.isLiked ? 'text-red-500 fill-red-500' : 'text-white'
//                             }`}>
//                               favorite
//                             </span>
//                             {/* <span className="text-sm">{post.likes}</span> */}
//                           </div>
//                           <div className="flex items-center space-x-1">
//                             <span className="material-symbols-outlined text-lg">chat_bubble</span>
//                             <span className="text-sm">{post.comments?.length || 0}</span>
//                           </div>
//                         </div>
//                         <span className="text-gray-300 text-xs">{post.timestamp}</span>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="absolute bottom-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     {/* <div className="bg-black/50 rounded px-1 py-0.5 text-xs text-white">
//                       ♥ {post.likes}
//                     </div>
//                     <div className="bg-black/50 rounded px-1 py-0.5 text-xs text-white">
//                       💬 {post.comments?.length || 0}
//                     </div> */}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <span className="material-symbols-outlined text-teal-400 text-6xl mb-4">travel_explore</span>
//             <p className="text-gray-400 text-lg">No {activeTab.toLowerCase()} posts found</p>
//             {activeTab !== "All" && <p className="text-gray-500 text-sm mt-2">Try switching to "All" tab</p>}
//           </div>
//         )}
//       </section>
//     );
//   }, [hoveredPostId, handlePostClick, handleLike, activeTab]);

//   // Safe profile data for rendering
//   const safeProfileData = profileData;

//   return (
//     <div className="min-h-screen bg-black text-white font-sans">
//       <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-teal-500/30">
//         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//           <button
//             className="h-10 w-10 inline-flex items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
//             onClick={() => navigate(-1)}
//             aria-label="Go back"
//           >
//             <span className="material-symbols-outlined">arrow_back</span>
//           </button>
//           <h1 className="text-xl sm:text-2xl font-bold text-teal-400">Profile</h1>
//           <div className="flex items-center space-x-2">
//             <div className="relative">
//               <button
//                 onClick={handleToggleNotifications}
//                 className="h-10 w-10 inline-flex items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500 relative"
//                 aria-label="Notifications"
//               >
//                 <span className="material-symbols-outlined">notifications</span>
//                 {notifications.filter(n => !n.read).length > 0 && (
//                   <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
//                     {notifications.filter(n => !n.read).length}
//                   </span>
//                 )}
//               </button>
//               {showNotifications && renderNotificationPanel()}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
//         {/* Profile Header Section */}
//         <section className="relative overflow-hidden rounded-2xl border border-white/10 from-teal-600/20 via-cyan-600/10 to-fuchsia-600/20 shadow-2xl">
//           <div className="p-6 sm:p-8  bg-cover bg-center" style={{
//     backgroundImage: safeProfileData.cover_photo
//       ? `url(http://127.0.0.1:8002${safeProfileData.cover_photo})`
//       : undefined,
//   }}>
//             <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
//             <div
//   className="h-28 w-28 rounded-full ring-4 ring-teal-500/30 shadow-xl bg-cover bg-center bg-gray-800"
//   style={{
//     backgroundImage: safeProfileData.profile_picture
//       ? `url(http://127.0.0.1:8002${safeProfileData.profile_picture})`
//       : undefined,
//   }}
// />
//               <div className="flex-1 min-w-0">
//                 <p className="text-2xl font-extrabold">
//                   {safeProfileData.name}
//                 </p>
//                 <p className="text-slate-200 mt-1">{safeProfileData.bio}</p>
//                 <p className="text-slate-300 mt-2 inline-flex items-center gap-1">
//                   <span className="material-symbols-outlined text-base">location_on</span>
//                   {safeProfileData.location}
//                 </p>
               
//                 <div className="mt-4 space-y-1 text-sm text-slate-300">
//                   <p>Gender: {safeProfileData.gender}</p>
//                   <p>Date of Birth: {safeProfileData.date_of_birth}</p>
//                   <p>Contact: {safeProfileData.contact_number}</p>
//                   {safeProfileData.social_links && (
//                     <p>Social Links: {safeProfileData.social_links}</p>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
//                 <div 
//                   className="text-center cursor-pointer hover:text-teal-400 transition-colors"
//                   onClick={handleViewFollowers}
//                 >
//                   <p className="text-2xl font-bold">{ffCount.followersCount}</p>
//                   <p className="text-sm text-gray-400">Followers</p>
//                 </div>
//                 <div 
//                   className="text-center cursor-pointer hover:text-teal-400 transition-colors"
//                   onClick={handleViewFollowing}
//                 >
//                   <p className="text-2xl font-bold">{ffCount.followingCoun}</p>
//                   <p className="text-sm text-gray-400">Following</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-2xl font-bold">{posts.length}</p>
//                   <p className="text-sm text-gray-400">Posts</p>
//                 </div>
//                 <button 
//                   onClick={() => navigate('/DirectMessagesUI')} 
//                   className="bg-gray-200 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2"
//                 >
//                   Message
//                 </button>
//                 <button className="bg-gray-200 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2">
//                   Following
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-700 mb-4">
//           {["All", "Images", "Videos"].map((tab) => (
//             <button
//               key={`tab-${tab}`}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-3 px-4 text-center font-semibold text-sm ${
//                 activeTab === tab
//                   ? "text-teal-400 border-b-2 border-teal-400"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Posts Grid */}
//         {renderPostGrid(getCurrentPosts(), activeTab)}

//         {/* Enhanced Post Modal with Full Comment Section */}
//         {showComments && selectedPost && (
//           <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
//               {/* Left Side - Media with Full Controls */}
//               <div className="md:w-1/2 bg-black flex flex-col">
//                 <div className="flex-1 flex items-center justify-center p-4">
//                   {selectedPost.media[0].type === "image" ? (
//                     <img
//                       src={selectedPost.media[0].url}
//                       alt={selectedPost.media[0].caption}
//                       className="w-full h-full object-contain max-h-[70vh] rounded-lg"
//                       onError={(e) => {
//                         e.target.src = "https://via.placeholder.com/400x400?text=Image+Error";
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full">
//                       <video
//                         controls
//                         autoPlay
//                         poster={selectedPost.media[0].poster}
//                         className="w-full h-full object-contain max-h-[70vh] rounded-lg"
//                       >
//                         <source src={selectedPost.media[0].url} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Media Controls Bar */}
//                 <div className="p-4 border-t border-gray-700 bg-black">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <button 
//                         className={`flex items-center space-x-1 ${
//                           selectedPost.isLiked ? 'text-red-500' : 'text-white hover:text-teal-400'
//                         }`}
//                         onClick={() => handleLike(selectedPost.id, { stopPropagation: () => {} })}
//                       >
//                         <span className={`material-symbols-outlined ${
//                           selectedPost.isLiked ? 'fill-red-500' : ''
//                         }`}>
//                           favorite
//                         </span>
//                         {/* <span>{selectedPost.likes}</span> */}
//                       </button>
//                       <button className="flex items-center space-x-1 text-white hover:text-teal-400">
//                         <span className="material-symbols-outlined">chat_bubble</span>
//                         <span>{selectedPost.comments?.length || 0}</span>
//                       </button>
//                     </div>
//                   </div>
                  
//                   {/* Post Details Summary */}
//                   <div className="mt-3 text-sm text-gray-300">
//                     <div className="font-semibold text-white">{selectedPost.title}</div>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <span className="material-symbols-outlined text-xs">location_on</span>
//                       <span>{selectedPost.place_name}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side - Full Comment Section */}
//               <div className="md:w-1/2 flex flex-col bg-white text-black">
//                 {/* User Info Header */}
//                 <div className="p-4 border-b">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
//                       {selectedPost.userName?.charAt(0) || "U"}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold">{selectedPost.userName}</p>
//                       <p className="text-sm text-gray-500">{selectedPost.place_name}</p>
//                     </div>
//                     <button
//                       onClick={() => setShowComments(false)}
//                       className="text-gray-500 hover:text-gray-700"
//                     >
//                       <span className="material-symbols-outlined">close</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Comments Section */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   {/* Post Content */}
//                   <div className="mb-6 pb-4 border-b">
//                     <h3 className="font-bold text-lg mb-2">{selectedPost.title}</h3>
//                     <p className="text-gray-700 mb-3">{selectedPost.description}</p>
                    
//                     <div className="flex items-center space-x-4 text-sm text-gray-600">
//                       <div className="flex items-center space-x-1">
//                         <span className="material-symbols-outlined text-base">category</span>
//                         <span>{selectedPost.category}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <span className="material-symbols-outlined text-base">star</span>
//                         <span>{selectedPost.rating}/5</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <span className="material-symbols-outlined text-base">calendar_today</span>
//                         <span>{formatDate(selectedPost.date_of_visit)}</span>
//                       </div>
//                     </div>
                    
//                     {selectedPost.tags && selectedPost.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mt-2">
//                         {selectedPost.tags.map((tag, index) => (
//                           <span key={`modal-tag-${index}`} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
//                             #{tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Comments List */}
//                   {selectedPost.comments && selectedPost.comments.length > 0 ? (
//                     selectedPost.comments.map((comment) => (
//                       <div key={`comment-${comment.id}`} className="flex space-x-3">
//                         <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
//                           {comment.userName.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-2">
//                             <p className="font-semibold text-sm">{comment.userName}</p>
//                             <span className="text-gray-500 text-xs">
//                               {new Date(comment.timestamp).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <p className="text-gray-700 mt-1">{comment.content}</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
//                       <p>No comments yet. Be the first to comment!</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Add Comment Section */}
//                 <div className="p-4 border-t">
//                   <div className="flex space-x-2">
//                     <input
//                       type="text"
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder="Add a comment..."
//                       className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
//                     />
//                     <button
//                       onClick={handleAddComment}
//                       disabled={!newComment.trim()}
//                       className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Post
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Followers Modal */}
//         {showFollowersModal && (
//           <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
//               {renderUserList(followers, `${ffCount.followersCount} Followers`)}
//             </div>
//           </div>
//         )}

//         {/* Following Modal */}
//         {showFollowingModal && (
//           <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
//               {renderUserList(following, `${ffCount.followingCoun} Following`)}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }






















import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { setMessageandProfileViewid } from '../actioncreate';

// WebSocket Manager Hook
const useWebSocketManager = () => {
  const sockets = useRef({
    comments: new Map(),
    likes: new Map(),
    notification: null
  });

  const createWebSocket = useCallback((url) => {
    const token = localStorage.getItem("access_token");
    const wsUrl = token ? `${url}?token=${token}` : url;
    
    try {
      const socket = new WebSocket(wsUrl);
      return socket;
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      return null;
    }
  }, []);

  const initializeCommentSocket = useCallback((postId, onMessage, onError) => {
    if (sockets.current.comments.has(postId)) {
      const oldSocket = sockets.current.comments.get(postId);
      if (oldSocket.readyState === WebSocket.OPEN) {
        oldSocket.close();
      }
      sockets.current.comments.delete(postId);
    }

    const socket = createWebSocket(`ws://127.0.0.1:8004/ws/comments/${postId}/`);
    if (!socket) {
      onError(new Error('Failed to create socket'));
      return null;
    }

    socket.onopen = () => {
      console.log(`💬 Comment WebSocket connected for post ${postId}`);
    };

    socket.onmessage = onMessage;

    socket.onerror = onError;

    socket.onclose = (event) => {
      console.log(`💬 Comment WebSocket closed for post ${postId}:`, event.code);
      sockets.current.comments.delete(postId);
    };

    sockets.current.comments.set(postId, socket);
    return socket;
  }, [createWebSocket]);

  const initializeLikeSocket = useCallback((postId, onMessage, onError) => {
    if (sockets.current.likes.has(postId)) {
      const oldSocket = sockets.current.likes.get(postId);
      if (oldSocket.readyState === WebSocket.OPEN) {
        oldSocket.close();
      }
      sockets.current.likes.delete(postId);
    }

    const socket = createWebSocket(`ws://127.0.0.1:8004/ws/likes/${postId}/`);
    if (!socket) {
      onError(new Error('Failed to create socket'));
      return null;
    }

    socket.onopen = () => {
      console.log(`❤️ Like WebSocket connected for post ${postId}`);
    };

    socket.onmessage = onMessage;

    socket.onerror = onError;

    socket.onclose = (event) => {
      console.log(`❤️ Like WebSocket closed for post ${postId}:`, event.code);
      sockets.current.likes.delete(postId);
    };

    sockets.current.likes.set(postId, socket);
    return socket;
  }, [createWebSocket]);

  const initializeNotificationSocket = useCallback((userId, onMessage, onError) => {
    if (sockets.current.notification) {
      const oldSocket = sockets.current.notification;
      if (oldSocket.readyState === WebSocket.OPEN) {
        oldSocket.close();
      }
      sockets.current.notification = null;
    }

    const socket = createWebSocket(`ws://127.0.0.1:8004/ws/notifications/${userId}/`);
    if (!socket) {
      onError(new Error('Failed to create socket'));
      return null;
    }

    socket.onopen = () => {
      console.log("🔔 Notification WebSocket connected");
    };

    socket.onmessage = onMessage;

    socket.onerror = onError;

    socket.onclose = (event) => {
      console.log("🔔 Notification WebSocket closed:", event.code);
      sockets.current.notification = null;
    };

    sockets.current.notification = socket;
    return socket;
  }, [createWebSocket]);

  const sendComment = useCallback((postId, text, userId) => {
    const socket = sockets.current.comments.get(postId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({
          user_id: userId,
          text: text
        }));
        return true;
      } catch (error) {
        console.error("Error sending comment via WebSocket:", error);
        return false;
      }
    }
    console.warn("Comment WebSocket not connected for post", postId);
    return false;
  }, []);

  const toggleLike = useCallback((postId, userId) => {
    const socket = sockets.current.likes.get(postId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ 
          user_id: userId 
        }));
        return true;
      } catch (error) {
        console.error("Error sending like via WebSocket:", error);
        return false;
      }
    }
    console.warn("Like WebSocket not connected for post", postId);
    return false;
  }, []);

  const closeAllWebSockets = useCallback(() => {
    sockets.current.comments.forEach((socket, postId) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "Component unmounting");
      }
    });
    sockets.current.comments.clear();

    sockets.current.likes.forEach((socket, postId) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "Component unmounting");
      }
    });
    sockets.current.likes.clear();

    if (sockets.current.notification && sockets.current.notification.readyState === WebSocket.OPEN) {
      sockets.current.notification.close(1000, "Component unmounting");
    }
    sockets.current.notification = null;
  }, []);

  return {
    initializeCommentSocket,
    initializeLikeSocket,
    initializeNotificationSocket,
    sendComment,
    toggleLike,
    closeAllWebSockets
  };
};

// Data Management Hook
const useProfileData = () => {
  const [profileData, setProfileData] = useState({});
  const [posts, setPosts] = useState([]);
  const [ffCount, setFfCount] = useState({ followersCount: 0, followingCount: 0 });
  const [notifications, setNotifications] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    followers: false,
    following: false,
    notifications: false
  });

  const base = "http://127.0.0.1:8002";
  const expBase = "http://127.0.0.1:8004";
  const countBase = "http://127.0.0.1:8003";

  const userId = useSelector(state => state.app.messageandprofileviewid);
  const authuserid = useSelector(state => state.app.autherazeduserId);
  const accesstoken = localStorage.getItem("access_token");

  // Utility functions
  const safeRender = useCallback((value, defaultValue = "") => {
    if (value == null) return defaultValue;
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }, []);

  const cleanProfileData = useCallback((data) => {
    if (!data || typeof data !== 'object') return {};
    
    return {
      ...data,
      name: safeRender(data.name, "Unnamed"),
      bio: safeRender(data.bio, "Tell something about this profile..."),
      location: safeRender(data.location, "Unknown location"),
      gender: safeRender(data.gender, "—"),
      date_of_birth: safeRender(data.date_of_birth, "—"),
      contact_number: safeRender(data.contact_number, "—"),
      social_links: safeRender(data.social_links, ""),
      profile_picture: data.profile_picture || "",
      cover_photo: data.cover_photo || ""
    };
  }, [safeRender]);

  const getTimeAgo = useCallback((dateString) => {
    if (!dateString) return "Unknown";
    const now = new Date();
    const past = new Date(dateString);
    const diff = now - past;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return "Today";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }, []);

  // API functions
  const fetchProfileData = useCallback(async () => {
    if (!userId || !accesstoken) return;
    
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const response = await axios.get(`${base}/SpecificUserProfile/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      setProfileData(cleanProfileData(response.data));
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setProfileData({});
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [userId, accesstoken, base, cleanProfileData]);

  const fetchCounts = useCallback(async () => {
    if (!userId || !accesstoken) return;
    
    try {
      const response = await axios.get(`${countBase}/CountofFollwerandFollwingByspecific/${userId}`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      setFfCount({
        followersCount: response.data.followersCount || 0,
        followingCount: response.data.followingCoun || 0
      });
    } catch (error) {
      console.error("Count fetch failed:", error);
      setFfCount({ followersCount: 0, followingCount: 0 });
    }
  }, [userId, accesstoken, countBase]);

  const fetchUserPosts = useCallback(async () => {
    if (!userId || !accesstoken) return;
    
    setLoading(prev => ({ ...prev, posts: true }));
    try {
      const response = await axios.get(`${expBase}/TravalExperienceGetspecificuserDatas/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      
      if (response.data?.data) {
        const uniqueExperiences = response.data.data.filter((exp, index, self) => 
          index === self.findIndex(e => e.id === exp.id)
        );
        
        const userName = profileData.name || "User";
        let experiencesData = uniqueExperiences.map(exp => ({
          id: exp.id,
          userName,
          title: exp.title || "Untitled",
          content: exp.description ? exp.description.substring(0, 100) + (exp.description.length > 100 ? "..." : "") : "No description",
          place_name: exp.place_name || "Unknown location",
          category: exp.category || "General",
          description: exp.description || "",
          rating: exp.rating || 0,
          date_of_visit: exp.date_of_visit,
          tags: exp.tags || [],
          media: exp.image 
            ? [{ type: "image", url: `${expBase}${exp.image}`, caption: exp.title, aspect: "square" }]
            : exp.video 
            ? [{ type: "video", url: `${expBase}${exp.video}`, poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=300", aspect: "16:9" }]
            : [],
          comments: (exp.comments || []).map(c => ({
            id: c.id,
            userName: c.user_name || `User${c.user_id}`,
            content: c.content || c.text || "",
            timestamp: c.timestamp || c.created_at,
            user_id: c.user_id
          })),
          timestamp: getTimeAgo(exp.created_at),
          likes: exp.like_count || exp.likes || 0,
          isLiked: exp.is_liked || false,
          sentiment: exp.sentiment,
          privacy: exp.privacy,
        })).filter(post => post.media.length > 0);

        // Fetch like status if authenticated and posts exist
        if (experiencesData.length > 0 && authuserid && accesstoken) {
          const firstPostId = experiencesData[0].id;
          try {
            const likeResponse = await axios.get(`${expBase}/TravelExperienceLikeStatusAPIView/${firstPostId}/${userId}/`, {
              headers: { Authorization: `Bearer ${accesstoken}` },
            });
            const likedPostIds = new Set(likeResponse.data.liked_posts.map(p => p.id));
            experiencesData = experiencesData.map(post => ({
              ...post,
              isLiked: likedPostIds.has(post.id)
            }));
          } catch (likeError) {
            console.error("Like status fetch failed:", likeError);
          }
        }
        
        setPosts(experiencesData);
      }
    } catch (error) {
      console.error("Experience fetch failed:", error);
      setPosts([]);
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  }, [userId, accesstoken, expBase, getTimeAgo, authuserid, profileData.name]);

  const fetchPostComments = useCallback(async (postId) => {
    if (!postId || !accesstoken) return [];
    try {
      const response = await axios.get(`${expBase}/UserCommentsBYUseridandPostid/${postId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      const commentsData = response.data.comments || [];
      const mappedComments = commentsData.map(c => ({
        id: c.id,
        userName: c.user_name || `User${c.user_id}`,
        content: c.content || c.text || "",
        timestamp: c.created_at,
        user_id: c.user_id
      })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return mappedComments;
    } catch (error) {
      console.error("Comments fetch failed:", error);
      return [];
    }
  }, [accesstoken, expBase]);

  const fetchNotifications = useCallback(async () => {
    if (!accesstoken) return;
    
    setLoading(prev => ({ ...prev, notifications: true }));
    try {
      const response = await axios.get(`${expBase}/get_notifications/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      setNotifications(response.data?.map(n => ({
        id: n.id,
        type: n.notification_type,
        message: n.message,
        timestamp: n.created_at,
        read: n.is_read,
        sender_id: n.sender_id
      })) || []);
    } catch (error) {
      console.error("Notifications fetch failed:", error);
      setNotifications([]);
    } finally {
      setLoading(prev => ({ ...prev, notifications: false }));
    }
  }, [accesstoken, expBase]);

  const fetchFollowers = useCallback(async () => {
    if (!userId || !accesstoken) return;
    
    setLoading(prev => ({ ...prev, followers: true }));
    try {
      const response = await axios.get(`${countBase}/SpecificUserFolloweListView/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      // The API returns an array of user objects
      setFollowers(response.data || []);
    } catch (error) {
      console.error("Followers fetch failed:", error);
      setFollowers([]);
    } finally {
      setLoading(prev => ({ ...prev, followers: false }));
    }
  }, [userId, accesstoken, countBase]);

  const fetchFollowing = useCallback(async () => {
    if (!userId || !accesstoken) return;
    
    setLoading(prev => ({ ...prev, following: true }));
    try {
      const response = await axios.get(`${countBase}/SpecificUserFollowingListView/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      // The API returns an array of user objects
      setFollowing(response.data || []);
    } catch (error) {
      console.error("Following fetch failed:", error);
      setFollowing([]);
    } finally {
      setLoading(prev => ({ ...prev, following: false }));
    }
  }, [userId, accesstoken, countBase]);

  return {
    profileData: cleanProfileData(profileData),
    posts,
    ffCount,
    notifications,
    followers,
    following,
    loading,
    setPosts,
    setNotifications,
    fetchProfileData,
    fetchCounts,
    fetchUserPosts,
    fetchPostComments,
    fetchNotifications,
    fetchFollowers,
    fetchFollowing,
    safeRender,
    getTimeAgo
  };
};

// Main Profile Component
export default function ProfileOnly() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  
  // State management
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  // Custom hooks
  const {
    profileData,
    posts,
    ffCount,
    notifications,
    followers,
    following,
    loading,
    setPosts,
    setNotifications,
    fetchProfileData,
    fetchCounts,
    fetchUserPosts,
    fetchPostComments,
    fetchNotifications,
    fetchFollowers,
    fetchFollowing,
    safeRender,
    getTimeAgo
  } = useProfileData();

  const {
    initializeCommentSocket,
    initializeLikeSocket,
    initializeNotificationSocket,
    sendComment,
    toggleLike,
    closeAllWebSockets
  } = useWebSocketManager();

  const userId = useSelector(state => state.app.messageandprofileviewid);
  const authuserid = useSelector(state => state.app.autherazeduserId);
  const accesstoken = localStorage.getItem("access_token");
  const expBase = "http://127.0.0.1:8004";

  // WebSocket message handlers
  const handleCommentMessage = useCallback((postId) => (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("💬 New comment received:", data);
      
      const newComment = {
        id: data.id,
        userName: data.user_name || `User${data.user_id}`,
        content: data.text,
        timestamp: data.timestamp,
        user_id: data.user_id
      };
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: [...(post.comments || []), newComment],
                commentsCount: (post.comments?.length || 0) + 1
              }
            : post
        )
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
        }));
      }
    } catch (error) {
      console.error("Error processing comment message:", error);
    }
  }, [selectedPost, setPosts]);





  const followUser = async (following_id) => {   
    console.log('following_id',following_id) 
    const token= localStorage.getItem("access_token");
    if (!token) return;
    try {
     const res= await axios.post("http://127.0.0.1:8003/FollowUser/",{ following_id },
        {headers: {Authorization: `Bearer ${token}`,"Content-Type": "application/json",},});
      
    alert(res.data.detail)
    } catch (error) {
     alert(error?.response?.data.detail) 
     console.error("Follow error:", error?.response?.data );
    }
  };




  const handleLikeMessage = useCallback((postId) => (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("❤️ Like update received:", data);
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: data.like_count || data.likes || 0,
              isLiked: data.user_id === authuserid ? data.liked : post.isLiked
            };
          }
          return post;
        })
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          likes: data.like_count || data.likes || 0,
          isLiked: data.user_id === authuserid ? data.liked : prev.isLiked
        }));
      }
    } catch (error) {
      console.error("Error processing like message:", error);
    }
  }, [selectedPost, authuserid, setPosts]);

  const handleNotificationMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🔔 New notification received:", data);
      
      const newNotif = {
        id: data.id || Date.now(),
        type: data.notification_type,
        message: data.message || `New ${data.notification_type?.toLowerCase()} notification`,
        timestamp: data.timestamp || data.created_at,
        read: false,
        sender_id: data.sender_id,
        ...data
      };
      
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      console.error("Error processing notification message:", error);
    }
  }, [setNotifications]);

  const handleWebSocketError = useCallback((type, postId = null) => (error) => {
    console.error(`${type} WebSocket error ${postId ? `for post ${postId}` : ''}:`, error);
    setConnectionStatus(prev => ({ 
      ...prev, 
      [`${type}_${postId}`]: { connected: false, error: error.message } 
    }));
  }, []);

  // API fallback functions
  const sendCommentAPI = useCallback(async (postId, text) => {
    try {
      const response = await axios.post(
        `${expBase}/posts/${postId}/comments/`,
        {
          user_id: authuserid,
          text: text
        },
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          timeout: 10000
        }
      );
      
      if (response.data) {
        const newComment = {
          id: response.data.id,
          userName: "You",
          content: text,
          timestamp: response.data.timestamp || new Date().toISOString(),
          user_id: authuserid
        };
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  comments: [...(post.comments || []), newComment],
                  commentsCount: (post.comments?.length || 0) + 1
                }
              : post
          )
        );

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => ({
            ...prev,
            comments: [...(prev.comments || []), newComment]
          }));
        }
      }
      
      return true;
    } catch (error) {
      console.error("API fallback for comment failed:", error);
      return false;
    }
  }, [authuserid, expBase, accesstoken, selectedPost, setPosts]);

  const toggleLikeAPI = useCallback(async (postId) => {
    try {
      const response = await axios.post(
        `${expBase}/posts/${postId}/toggle_like/`,
        {
          user_id: authuserid
        },
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          timeout: 10000
        }
      );
      
      if (response.data) {
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes: response.data.like_count || response.data.likes || 0,
                isLiked: response.data.liked || response.data.is_liked || false
              };
            }
            return post;
          })
        );

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => ({
            ...prev,
            likes: response.data.like_count || response.data.likes || 0,
            isLiked: response.data.liked || response.data.is_liked || false
          }));
        }
      }
      
      return true;
    } catch (error) {
      console.error("API fallback for like failed:", error);
      return false;
    }
  }, [authuserid, expBase, accesstoken, selectedPost, setPosts]);

  // Combined functions with WebSocket fallback to API
  const sendCommentWithFallback = useCallback(async (postId, text) => {
    const wsSuccess = sendComment(postId, text, authuserid);
    
    if (wsSuccess) {
      console.log("Comment sent via WebSocket");
      return true;
    }
    
    console.log("WebSocket not available, using API fallback for comment");
    return await sendCommentAPI(postId, text);
  }, [sendComment, sendCommentAPI, authuserid]);

  const toggleLikeWithFallback = useCallback(async (postId) => {
    const wsSuccess = toggleLike(postId, authuserid);
    
    if (wsSuccess) {
      console.log("Like sent via WebSocket");
      return true;
    }
    
    console.log("WebSocket not available, using API fallback for like");
    return await toggleLikeAPI(postId);
  }, [toggleLike, toggleLikeAPI, authuserid]);

  // Initialize WebSockets for posts
  useEffect(() => {
    posts.forEach(post => {
      initializeCommentSocket(
        post.id, 
        handleCommentMessage(post.id), 
        handleWebSocketError('comment', post.id)
      );
      
      initializeLikeSocket(
        post.id, 
        handleLikeMessage(post.id), 
        handleWebSocketError('like', post.id)
      );
    });
  }, [posts, initializeCommentSocket, initializeLikeSocket, handleCommentMessage, handleLikeMessage, handleWebSocketError]);

  // Initialize notification WebSocket
  useEffect(() => {
    if (authuserid) {
      initializeNotificationSocket(
        authuserid,
        handleNotificationMessage,
        handleWebSocketError('notification')
      );
    }
  }, [authuserid, initializeNotificationSocket, handleNotificationMessage, handleWebSocketError]);

  // Fetch initial data
  useEffect(() => {
    if (userId && accesstoken) {
      fetchCounts();
      fetchProfileData();
    }
  }, [userId, accesstoken, fetchCounts, fetchProfileData]);

  useEffect(() => {
    if (userId && accesstoken) {
      fetchUserPosts();
    }
  }, [userId, accesstoken, fetchUserPosts]);

  useEffect(() => {
    if (authuserid && accesstoken) {
      fetchNotifications();
    }
  }, [authuserid, accesstoken, fetchNotifications]);

  useEffect(() => {
    if (selectedPost?.id && accesstoken) {
      fetchPostComments(selectedPost.id).then((comments) => {
        setSelectedPost((prev) => ({
          ...prev,
          comments: comments
        }));
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === selectedPost.id ? { ...post, comments: comments } : post
          )
        );
      });
    }
  }, [selectedPost?.id, fetchPostComments, accesstoken, setPosts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeAllWebSockets();
    };
  }, [closeAllWebSockets]);

  // UI helper functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Unknown date";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
    setShowComments(true);
  }, []);

  const handleAddComment = useCallback(async () => {
    if (newComment.trim() === "" || !selectedPost) return;
    
    const success = await sendCommentWithFallback(selectedPost.id, newComment.trim());
    if (success) {
      setNewComment("");
    } else {
      alert("Failed to post comment. Please try again.");
    }
  }, [newComment, selectedPost, sendCommentWithFallback]);

  const handleLike = useCallback(async (postId, e) => {
    e?.stopPropagation();
    await toggleLikeWithFallback(postId);
  }, [toggleLikeWithFallback]);

  const handleViewFollowers = useCallback(() => {
    if (followers.length === 0) {
      fetchFollowers();
    }
    setShowFollowersModal(true);
  }, [followers.length, fetchFollowers]);

  const handleViewFollowing = useCallback(() => {
    if (following.length === 0) {
      fetchFollowing();
    }
    setShowFollowingModal(true);
  }, [following.length, fetchFollowing]);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications(!showNotifications);
  }, [showNotifications]);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, [setNotifications]);

  // Filter posts based on active tab
  const imagePosts = posts.filter((post) => post.media[0]?.type === "image");
  const videoPosts = posts.filter((post) => post.media[0]?.type === "video");

  const getCurrentPosts = useCallback(() => {
    switch (activeTab) {
      case "All": return posts;
      case "Images": return imagePosts;
      case "Videos": return videoPosts;
      default: return posts;
    }
  }, [activeTab, posts, imagePosts, videoPosts]);

  // CORRECTED: Render user list function with proper data structure handling
  const renderUserList = useCallback((users, title) => {
    const isFollowers = title.includes('Followers');
    const closeHandler = isFollowers ? () => setShowFollowersModal(false) : () => setShowFollowingModal(false);
    const currentLoading = isFollowers ? loading.followers : loading.following;

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <button onClick={closeHandler} className="text-gray-500 hover:text-black">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {users && users.length > 0 ? (
            users.map((user) => {
              // Handle the API response structure properly
              const userData = user.user_id ? user : user; // Your API returns user objects directly
              const safeName = safeRender(userData.name, "Unnamed User");
              const safeBio = safeRender(userData.bio, "No bio available");
              const userId = userData.user_id || userData.id;

              return (
                <div
                  key={`user-${userId}`}
                  onClick={() => {
                    dispatch(setMessageandProfileViewid(userId));
                    navigate('/ProfileOnly');
                    closeHandler();
                  }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <div 
                    className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg bg-cover bg-center"
                    style={{
                      backgroundImage: userData.profile_picture 
                        ? `url(http://127.0.0.1:8002${userData.profile_picture})`
                        : undefined
                    }}
                  >
                    {!userData.profile_picture && (safeName ? safeName.charAt(0).toUpperCase() : "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black text-sm truncate">{safeName}</p>
                    <p className="text-xs text-gray-600 truncate">{safeBio}</p>
                  </div>
                  <button className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm self-start hover:bg-teal-600 transition">
                    Follow
                  </button>
                </div>
              );
            })
          ) : (
            currentLoading ? (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">hourglass_empty</span>
                <p>Loading...</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                <p>No users found</p>
              </div>
            )
          )}
        </div>
      </div>
    );
  }, [dispatch, loading.followers, loading.following, navigate, safeRender]);

  const renderNotificationPanel = useCallback(() => {
    return (
      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-black">Notifications</h3>
        </div>
        <div className="p-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={`notification-${notification.id}`}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === 'LIKE' ? 'bg-red-100 text-red-600' :
                    notification.type === 'COMMENT' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {notification.type === 'LIKE' ? 'favorite' :
                       notification.type === 'COMMENT' ? 'chat_bubble' : 'person_add'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">notifications</span>
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }, [notifications, markNotificationAsRead, getTimeAgo]);

  const renderPostGrid = useCallback((currentPosts, tab) => {
    const title = tab === "All" ? "All Posts" : `${tab} Only`;
    
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {currentPosts.map((post) => {
              const media = post.media[0];
              if (!media) return null;
              
              const isVideo = media.type === "video";
              const displayUrl = isVideo ? (media.poster || "https://via.placeholder.com/400x300?text=Video") : media.url;
              const isHovered = hoveredPostId === post.id;

              return (
                <div 
                  key={`post-${post.id}`}
                  className="relative aspect-square group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                  onMouseEnter={() => setHoveredPostId(post.id)}
                  onMouseLeave={() => setHoveredPostId(null)}
                >
                  <img
                    src={displayUrl}
                    alt={media.caption || post.title}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x400?text=Image+Error";
                    }}
                  />
                  
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-black/80 transition-opacity duration-300 rounded-lg flex flex-col justify-between p-4">
                      <div className="text-white">
                        <div className="text-lg font-bold mb-2">{post.title}</div>
                        <div className="text-sm mb-1 flex items-center">
                          <span className="material-symbols-outlined text-base mr-1">location_on</span>
                          {post.place_name}
                        </div>
                        <div className="text-xs text-gray-300 mt-2 line-clamp-2">
                          {post.description}
                        </div>
                      </div>
                      
                      <div className="text-white text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="material-symbols-outlined text-yellow-400 text-base mr-1">star</span>
                            <span>Rating: {post.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="flex items-center space-x-1 cursor-pointer"
                            onClick={(e) => handleLike(post.id, e)}
                          >
                            <span className={`material-symbols-outlined text-lg ${
                              post.isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                            }`}>
                              favorite
                            </span>
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="material-symbols-outlined text-lg">chat_bubble</span>
                            <span className="text-sm">{post.comments?.length || 0}</span>
                          </div>
                        </div>
                        <span className="text-gray-300 text-xs">{post.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-teal-400 text-6xl mb-4">travel_explore</span>
            <p className="text-gray-400 text-lg">No {activeTab.toLowerCase()} posts found</p>
            {activeTab !== "All" && <p className="text-gray-500 text-sm mt-2">Try switching to "All" tab</p>}
          </div>
        )}
      </section>
    );
  }, [hoveredPostId, handlePostClick, handleLike, activeTab]);

  // Safe profile data for rendering
  const safeProfileData = profileData;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-teal-500/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            className="h-10 w-10 inline-flex items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-teal-400">Profile</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={handleToggleNotifications}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500 relative"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifications && renderNotificationPanel()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Profile Header Section */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 from-teal-600/20 via-cyan-600/10 to-fuchsia-600/20 shadow-2xl">
          <div 
            className="p-6 sm:p-8 bg-cover bg-center" 
            style={{
              backgroundImage: safeProfileData.cover_photo
                ? `url(http://127.0.0.1:8002${safeProfileData.cover_photo})`
                : 'linear-gradient(135deg, #0f766e 0%, #115e59 50%, #134e4a 100%)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div
                className="h-28 w-28 rounded-full ring-4 ring-teal-500/30 shadow-xl bg-cover bg-center bg-gray-800"
                style={{
                  backgroundImage: safeProfileData.profile_picture
                    ? `url(http://127.0.0.1:8002${safeProfileData.profile_picture})`
                    : undefined,
                }}
              >
                {!safeProfileData.profile_picture && (
                  <div className="w-full h-full rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold">
                    {safeProfileData.name ? safeProfileData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-extrabold">
                  {safeProfileData.name}
                </p>
                <p className="text-slate-200 mt-1">{safeProfileData.bio}</p>
                <p className="text-slate-300 mt-2 inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {safeProfileData.location}
                </p>
               
                <div className="mt-4 space-y-1 text-sm text-slate-300">
                  <p>Gender: {safeProfileData.gender}</p>
                  <p>Date of Birth: {safeProfileData.date_of_birth}</p>
                  <p>Contact: {safeProfileData.contact_number}</p>
                  {safeProfileData.social_links && (
                    <p>Social Links: {safeProfileData.social_links}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                <div 
                  className="text-center cursor-pointer hover:text-teal-400 transition-colors"
                  onClick={handleViewFollowers}
                >
                  <p className="text-2xl font-bold">{ffCount.followersCount}</p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div 
                  className="text-center cursor-pointer hover:text-teal-400 transition-colors"
                  onClick={handleViewFollowing}
                >
                  <p className="text-2xl font-bold">{ffCount.followingCount}</p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-sm text-gray-400">Posts</p>
                </div>
                <button 
                  onClick={() => navigate('/DirectMessagesUI')} 
                  className="bg-gray-200 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2"
                >
                  Message
                </button>
                <button onClick={()=>followUser(safeProfileData.user_id)} className="bg-gray-200 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2">
                  Following
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-4">
          {["All", "Images", "Videos"].map((tab) => (
            <button
              key={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center font-semibold text-sm ${
                activeTab === tab
                  ? "text-teal-400 border-b-2 border-teal-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {renderPostGrid(getCurrentPosts(), activeTab)}

        {/* Enhanced Post Modal with Full Comment Section */}
        {showComments && selectedPost && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
              {/* Left Side - Media with Full Controls */}
              <div className="md:w-1/2 bg-black flex flex-col">
                <div className="flex-1 flex items-center justify-center p-4">
                  {selectedPost.media[0].type === "image" ? (
                    <img
                      src={selectedPost.media[0].url}
                      alt={selectedPost.media[0].caption}
                      className="w-full h-full object-contain max-h-[70vh] rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400?text=Image+Error";
                      }}
                    />
                  ) : (
                    <div className="w-full">
                      <video
                        controls
                        autoPlay
                        poster={selectedPost.media[0].poster}
                        className="w-full h-full object-contain max-h-[70vh] rounded-lg"
                      >
                        <source src={selectedPost.media[0].url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
                
                {/* Media Controls Bar */}
                <div className="p-4 border-t border-gray-700 bg-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        className={`flex items-center space-x-1 ${
                          selectedPost.isLiked ? 'text-red-500' : 'text-white hover:text-teal-400'
                        }`}
                        onClick={() => handleLike(selectedPost.id, { stopPropagation: () => {} })}
                      >
                        <span className={`material-symbols-outlined ${
                          selectedPost.isLiked ? 'fill-red-500' : ''
                        }`}>
                          favorite
                        </span>
                        <span>{selectedPost.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-white hover:text-teal-400">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        <span>{selectedPost.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Post Details Summary */}
                  <div className="mt-3 text-sm text-gray-300">
                    <div className="font-semibold text-white">{selectedPost.title}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span>{selectedPost.place_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Full Comment Section */}
              <div className="md:w-1/2 flex flex-col bg-white text-black">
                {/* User Info Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                      {selectedPost.userName?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{selectedPost.userName}</p>
                      <p className="text-sm text-gray-500">{selectedPost.place_name}</p>
                    </div>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Post Content */}
                  <div className="mb-6 pb-4 border-b">
                    <h3 className="font-bold text-lg mb-2">{selectedPost.title}</h3>
                    <p className="text-gray-700 mb-3">{selectedPost.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-base">category</span>
                        <span>{selectedPost.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-base">star</span>
                        <span>{selectedPost.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        <span>{formatDate(selectedPost.date_of_visit)}</span>
                      </div>
                    </div>
                    
                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedPost.tags.map((tag, index) => (
                          <span key={`modal-tag-${index}`} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comments List */}
                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map((comment) => (
                      <div key={`comment-${comment.id}`} className="flex space-x-3">
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
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Followers Modal */}
        {showFollowersModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {renderUserList(followers, `${ffCount.followersCount} Followers`)}
            </div>
          </div>
        )}

        {/* Following Modal */}
        {showFollowingModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {renderUserList(following, `${ffCount.followingCount} Following`)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}