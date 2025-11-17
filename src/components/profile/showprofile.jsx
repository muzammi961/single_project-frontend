import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { setMessageandProfileViewid } from '../actioncreate';

// WebSocket Manager Hook
const useWebSocketManager = () => {
  const sockets = useRef({
    comments: new Map(),
    likes: new Map()
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
  }, []);

  return {
    initializeCommentSocket,
    initializeLikeSocket,
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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    followers: false,
    following: false
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
            console.log('like status response:', likeResponse.data);
            const likedPostIds = new Set(likeResponse.data.liked_posts?.map(p => p.id) || []);
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

  const fetchFollowers = useCallback(async () => {
    if (!userId || !accesstoken) return;
    
    setLoading(prev => ({ ...prev, followers: true }));
    try {
      const response = await axios.get(`${countBase}/SpecificUserFolloweListView/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
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
    followers,
    following,
    loading,
    setPosts,
    fetchProfileData,
    fetchCounts,
    fetchUserPosts,
    fetchPostComments,
    fetchFollowers,
    fetchFollowing,
    safeRender,
    getTimeAgo
  };
};

const TripCard = ({ trip, navigate }) => {
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

  return (
    <div 
      className="flex-shrink-0 w-80 snap-center group group rounded-2xl h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
      style={{ backgroundImage: `url(${trip.destination_image})` }}
      aria-label={trip.destination_name}
    >
      <div className="relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t to-transparent"></div>
          
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(trip.trip_status)}`}>
              {trip.trip_status.charAt(0).toUpperCase() + trip.trip_status.slice(1)}
            </span>
          </div>

          <div className="absolute top-3 left-3 bg-black/50 rounded-full p-2">
            <span className="text-amber-50 text-sm">{getTravelModeIcon(trip.travel_mode)}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-amber-50 truncate">{trip.destination_name}</h3>
            <p className="text-sm text-amber-50">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </p>
          </div>

          <div className="flex items-center mb-2 text-sm text-amber-50">
            <span className="font-semibold mr-2">From:</span>
            <span>{trip.origin_name}</span>
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
              <span className="text-amber-50">{trip.budget_category}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {trip.trip_types.map((type, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
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
  const [connectionStatus, setConnectionStatus] = useState({});

  // Custom hooks
  const {
    profileData,
    posts,
    ffCount,
    followers,
    following,
    loading,
    setPosts,
    fetchProfileData,
    fetchCounts,
    fetchUserPosts,
    fetchPostComments,
    fetchFollowers,
    fetchFollowing,
    safeRender,
    getTimeAgo
  } = useProfileData();

  const {
    initializeCommentSocket,
    initializeLikeSocket,
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
      
      // Generate unique key with timestamp to prevent duplicates
      const commentKey = `comment-${data.id}-${Date.now()}`;
      
      const newComment = {
        id: commentKey,
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
                comments: [...(post.comments || []), newComment].filter((comment, index, self) => 
                  index === self.findIndex(c => c.id === comment.id)
                ),
                commentsCount: (post.comments?.length || 0) + 1
              }
            : post
        )
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment].filter((comment, index, self) => 
            index === self.findIndex(c => c.id === comment.id)
          )
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
        `${expBase}/TravelExperienceCreateAPIView/`,
        {
          user_id: authuserid,
          post_id: postId,
          text: text,
          action: "comment"
        },
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          timeout: 10000
        }
      );
      
      if (response.data) {
        // Generate unique key with timestamp
        const commentKey = `comment-${response.data.id || Date.now()}-${Date.now()}`;
        
        const newComment = {
          id: commentKey,
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
                  comments: [...(post.comments || []), newComment].filter((comment, index, self) => 
                    index === self.findIndex(c => c.id === comment.id)
                  ),
                  commentsCount: (post.comments?.length || 0) + 1
                }
              : post
          )
        );

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => ({
            ...prev,
            comments: [...(prev.comments || []), newComment].filter((comment, index, self) => 
              index === self.findIndex(c => c.id === comment.id)
            )
          }));
        }
      }
      
      return true;
    } catch (error) {
      console.error("API fallback for comment failed:", error);
      // Fallback: Just update the UI optimistically with unique key
      const optimisticComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userName: "You",
        content: text,
        timestamp: new Date().toISOString(),
        user_id: authuserid
      };
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: [...(post.comments || []), optimisticComment].filter((comment, index, self) => 
                  index === self.findIndex(c => c.id === comment.id)
                ),
                commentsCount: (post.comments?.length || 0) + 1
              }
            : post
        )
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), optimisticComment].filter((comment, index, self) => 
            index === self.findIndex(c => c.id === comment.id)
          )
        }));
      }
      
      return true;
    }
  }, [authuserid, expBase, accesstoken, selectedPost, setPosts]);

  const toggleLikeAPI = useCallback(async (postId) => {
    try {
      const response = await axios.post(
        `${expBase}/TravelExperienceLikeStatusAPIView/${postId}/${userId}/`,
        {
          user_id: authuserid,
          action: "toggle_like"
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
              const currentLikes = post.likes || 0;
              const newIsLiked = !post.isLiked;
              return {
                ...post,
                likes: newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
                isLiked: newIsLiked
              };
            }
            return post;
          })
        );

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => {
            const currentLikes = prev.likes || 0;
            const newIsLiked = !prev.isLiked;
            return {
              ...prev,
              likes: newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
              isLiked: newIsLiked
            };
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("API fallback for like failed:", error);
      // Fallback: Just update the UI optimistically
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const currentLikes = post.likes || 0;
            const newIsLiked = !post.isLiked;
            return {
              ...post,
              likes: newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
              isLiked: newIsLiked
            };
          }
          return post;
        })
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => {
          const currentLikes = prev.likes || 0;
          const newIsLiked = !prev.isLiked;
          return {
            ...prev,
            likes: newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
            isLiked: newIsLiked
          };
        });
      }
      
      return true;
    }
  }, [authuserid, expBase, accesstoken, selectedPost, setPosts, userId]);

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
    if (selectedPost?.id && accesstoken) {
      fetchPostComments(selectedPost.id).then((comments) => {
        // Ensure unique keys for comments
        const uniqueComments = comments.map(comment => ({
          ...comment,
          id: `comment-${comment.id}-${comment.timestamp || Date.now()}`
        }));
        
        setSelectedPost((prev) => ({
          ...prev,
          comments: uniqueComments
        }));
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === selectedPost.id ? { ...post, comments: uniqueComments } : post
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

  // Render user list function
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
              const userData = user.user_id ? user : user;
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

  const renderPostGrid = useCallback((currentPosts, tab) => {
    const title = tab === "All" ? "All Posts" : `${tab} Only`;
    
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">{title}</h2>
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
                            <span className="text-sm"></span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="material-symbols-outlined text-lg">chat_bubble</span>
                            <span className="text-sm"></span>
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
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-teal-500/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            className="h-10 w-10 inline-flex items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-teal-400">Profile</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Profile Header Section */}
        <section className="relative overflow-hidden rounded-2xl border border-gray-200 from-teal-600/20 via-cyan-600/10 to-fuchsia-600/20 shadow-2xl">
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
                <p className="text-2xl font-extrabold text-white">
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
                  className="text-center cursor-pointer hover:text-teal-400 transition-colors text-white"
                  onClick={handleViewFollowers}
                >
                  <p className="text-2xl font-bold">{ffCount.followersCount}</p>
                  <p className="text-sm text-gray-300">Followers</p>
                </div>
                <div 
                  className="text-center cursor-pointer hover:text-teal-400 transition-colors text-white"
                  onClick={handleViewFollowing}
                >
                  <p className="text-2xl font-bold">{ffCount.followingCount}</p>
                  <p className="text-sm text-gray-300">Following</p>
                </div>
                <div className="text-center text-white">
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-sm text-gray-300">Posts</p>
                </div>
                <button 
                  onClick={() => navigate('/DirectMessagesUI')} 
                  className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2"
                >
                  Message
                </button>
                <button onClick={()=>followUser(safeProfileData.user_id)} className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2">
                  Following
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300 mb-4">
          {["All", "Images", "Videos"].map((tab) => (
            <button
              key={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center font-semibold text-sm ${
                activeTab === tab
                  ? "text-teal-400 border-b-2 border-teal-400"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {renderPostGrid(getCurrentPosts(), activeTab)}
































{showComments && selectedPost && (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-0">
    <div className="bg-white w-full h-full flex flex-col lg:flex-row lg:max-w-6xl lg:max-h-[90vh] lg:rounded-xl lg:m-4 lg:shadow-xl">
  
<div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col">

  <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
    <div className="flex items-center space-x-3 flex-1">
      <div className="w-10 h-10 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
        {selectedPost.userName?.charAt(0) || "U"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate text-gray-800">{selectedPost.userName}</p>
        <p className="text-xs text-gray-500 truncate">{selectedPost.place_name}</p>
      </div>
    </div>
    <button
      onClick={() => setShowComments(false)}
      className="text-gray-500 hover:text-gray-700 p-1"
    >
      <span className="material-symbols-outlined text-xl">close</span>
    </button>
  </div>

  
  <div className="flex-1 overflow-y-auto">
  
    <div className="bg-gray-100 w-full flex-shrink-0">
      <div className="flex items-center justify-center p-4">
        {selectedPost.media[0].type === "image" ? (
          <img
            src={selectedPost.media[0].url}
            alt={selectedPost.media[0].caption}
            className="w-full max-w-md object-contain rounded-lg bg-white"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x400?text=Image+Error";
            }}
          />
        ) : (
          <div className="w-full max-w-md bg-black rounded-lg">
            <video
              controls
              autoPlay
              poster={selectedPost.media[0].poster}
              className="w-full h-auto object-contain rounded-lg"
            >
              <source src={selectedPost.media[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-300 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className={`flex items-center space-x-1 ${
                selectedPost.isLiked ? 'text-red-500' : 'text-gray-700 hover:text-teal-400'
              }`}
              onClick={() => handleLike(selectedPost.id, { stopPropagation: () => {} })}
            >
              <span className={`material-symbols-outlined text-lg ${
                selectedPost.isLiked ? 'fill-red-500' : ''
              }`}>
                favorite
              </span>
              <span className="text-sm text-gray-800">{selectedPost.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-teal-400">
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
              <span className="text-sm text-gray-800">{selectedPost.comments?.length || 0}</span>
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-700">
          <div className="font-semibold text-gray-900 text-base">{selectedPost.title}</div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="material-symbols-outlined text-xs text-gray-600">location_on</span>
            <span className="text-xs text-gray-600">{selectedPost.place_name}</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Mobile Comments Section */}
    <div className="flex-1 bg-white">
      <div className="p-4">
        {/* Mobile Post Content */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="font-bold text-lg mb-2 text-gray-900">{selectedPost.title}</h3>
          <p className="text-gray-800 text-base mb-3">{selectedPost.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-sm text-gray-600">category</span>
              <span>{selectedPost.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-sm text-gray-600">star</span>
              <span>{selectedPost.rating}/5</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-sm text-gray-600">calendar_today</span>
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

        {/* Mobile Comments List */}
        <div className="space-y-4">
          {selectedPost.comments && selectedPost.comments.length > 0 ? (
            selectedPost.comments.map((comment, index) => (
              <div 
                key={`comment-${comment.id}-${index}-${comment.timestamp || Date.now()}`}
                className="flex space-x-3"
              >
                <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-sm truncate text-gray-900">{comment.userName}</p>
                    <span className="text-gray-500 text-xs flex-shrink-0">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 text-base break-words">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
              <p className="text-base">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Mobile Add Comment Section - Fixed at bottom */}
  <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 flex-shrink-0">
    <div className="flex space-x-2">
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
      />
      <button
        onClick={handleAddComment}
        disabled={!newComment.trim()}
        className="bg-teal-500 text-white px-4 py-3 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium min-w-[70px]"
      >
        Post
      </button>
    </div>
  </div>
</div>


      <div className="hidden lg:flex flex-1">
        {/* Desktop Media Section */}
        <div className="w-1/2 bg-gray-100 flex flex-col rounded-l-xl">
          <div className="flex-1 flex items-center justify-center p-6">
            {selectedPost.media[0].type === "image" ? (
              <img
                src={selectedPost.media[0].url}
                alt={selectedPost.media[0].caption}
                className="w-full h-full object-contain max-h-[70vh] rounded-lg bg-white shadow-sm"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x400?text=Image+Error";
                }}
              />
            ) : (
              <div className="w-full bg-black rounded-lg">
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
          
          {/* Desktop Media Controls */}
          <div className="p-4 border-t border-gray-300 bg-white rounded-bl-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  className={`flex items-center space-x-1 ${
                    selectedPost.isLiked ? 'text-red-500' : 'text-gray-700 hover:text-teal-400'
                  }`}
                  onClick={() => handleLike(selectedPost.id, { stopPropagation: () => {} })}
                >
                  <span className={`material-symbols-outlined text-lg ${
                    selectedPost.isLiked ? 'fill-red-500' : ''
                  }`}>
                    favorite
                  </span>
                  <span className="text-base text-gray-900">{selectedPost.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-teal-400">
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  <span className="text-base text-gray-900">{selectedPost.comments?.length || 0}</span>
                </button>
              </div>
            </div>
            
            <div className="mt-3 text-gray-700">
              <div className="font-semibold text-gray-900 text-lg">{selectedPost.title}</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="material-symbols-outlined text-sm text-gray-600">location_on</span>
                <span className="text-sm text-gray-600">{selectedPost.place_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Comments Section */}
        <div className="w-1/2 flex flex-col bg-white rounded-r-xl">
          {/* Desktop Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 w-full">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                {selectedPost.userName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate text-gray-900">{selectedPost.userName}</p>
                <p className="text-sm text-gray-500 truncate">{selectedPost.place_name}</p>
              </div>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Desktop Post Content */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-xl mb-2 text-gray-900">{selectedPost.title}</h3>
            <p className="text-gray-800 text-base mb-3">{selectedPost.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-3">
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm text-gray-600">category</span>
                <span>{selectedPost.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm text-gray-600">star</span>
                <span>{selectedPost.rating}/5</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm text-gray-600">calendar_today</span>
                <span>{formatDate(selectedPost.date_of_visit)}</span>
              </div>
            </div>
            
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedPost.tags.map((tag, index) => (
                  <span key={`modal-tag-${index}`} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Comments Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((comment, index) => (
                  <div 
                    key={`comment-${comment.id}-${index}-${comment.timestamp || Date.now()}`}
                    className="flex space-x-3"
                  >
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-sm truncate text-gray-900">{comment.userName}</p>
                        <span className="text-gray-500 text-xs flex-shrink-0">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-base break-words">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
                  <p className="text-base">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Add Comment Section */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium min-w-[70px]"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



        {/* Followers Modal */}
        {showFollowersModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
              {renderUserList(followers, `${ffCount.followersCount} Followers`)}
            </div>
          </div>
        )}

        {/* Following Modal */}
        {showFollowingModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
              {renderUserList(following, `${ffCount.followingCount} Following`)}
            </div>
          </div>
        )}
        
        {/* Public Travel Trips Section */}
        <section className="py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Trips</h3>
            <PublicTripDataCard />
          </div>
        </section>
      </main>
    </div>
  );
}