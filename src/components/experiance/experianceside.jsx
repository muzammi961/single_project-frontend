import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import '../stylecomponent/experianceside.css';
import '../stylecomponent/newmessageiconstyle.css'
import '../stylecomponent/backbutton.css'

const ExperienceSide = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const authuserid = useSelector(state => state.app.autherazeduserId);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const [experiences, setExperiences] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Experiences');
  const [showModal, setShowModal] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image: '', placeId: '' });
  const [reviewData, setReviewData] = useState({ content: '', rating: 5 });
  const [commentData, setCommentData] = useState({ content: '' });
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [placeOverview, setPlaceOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  // WebSocket connection for notifications
  const connectWebSocket = () => {
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
        console.log('✅ WebSocket connected for notifications');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          if (data.type === 'notification') {
            const notificationId = Date.now();
            const notificationMessage = data.message || "You have a new message";
            
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
              new Notification('PathFinder', {
                body: notificationMessage,
                icon: '/favicon.ico'
              });
            }
            
            console.log('🔔 New notification:', notificationMessage);
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
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [authuserid, token]);

  // Test function to simulate receiving a notification
  const testNotification = () => {
    const testNotification = {
      id: Date.now(),
      message: "Test notification - this is working!",
      type: 'test',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setNotifications(prev => [...prev, testNotification]);
    setUnreadCount(prev => prev + 1);
    
    console.log('🧪 Test notification added');
  };

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/RegistrationForm");
    }
  }, [token, navigate]);

  // Fetch all profiles
  useEffect(() => {
    if (!token) return;

    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8002/GetAllProfileAPIview/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileMap = {};
        res.data.forEach((profile) => {
          profileMap[profile.user_id] = profile;
        });
        setProfiles(profileMap);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [token]);

  // Fetch experiences
  useEffect(() => {
    if (!token) return;

    const fetchExperiences = async () => {
      setExperiencesLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8004/TravelExperienceListAPIViewbypage/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const apiExperiences = res.data.results || [];
        // Adapt API data to experience structure
        const adaptedExperiences = apiExperiences.map(exp => ({
          id: exp.id,
          userName: profiles[exp.user_id]?.name || 'Unknown User',
          profileImage: profiles[exp.user_id]?.profile_picture 
            ? `http://127.0.0.1:8002${profiles[exp.user_id].profile_picture}` 
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
          timestamp: new Date(exp.date_of_visit).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          title: exp.title,
          placeId: exp.place_name,
          content: exp.description,
          image: exp.image ? `http://127.0.0.1:8004${exp.image}` : null,
          likes: 0,
          liked: false,
          reviews: [],
          comments: [],
        }));
        setExperiences(adaptedExperiences);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setExperiencesLoading(false);
      }
    };

    fetchExperiences();
  }, [token, profiles]);

  // Reset selected experience when starting search
  useEffect(() => {
    if (searchQuery !== '') {
      setSelectedExperience(null);
    }
  }, [searchQuery]);

  // Fetch AI Overview when searching
  useEffect(() => {
    if (searchQuery && searchType === 'Experiences') {
      setLoading(true);
      fetchPlaceOverview(searchQuery);
    } else {
      setPlaceOverview(null);
    }
  }, [searchQuery, searchType]);

  // Fetch AI Overview for a place
  const fetchPlaceOverview = async (placeName) => {
    try {
      const params = new URLSearchParams();
      params.append('place_name', placeName);

      const overres = await axios.post("http://127.0.0.1:8004/TravelExperienceAIOverview/", params, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}` 
        },
      });
      
      console.log("AI Overview API Response:", overres.data);
      setPlaceOverview(overres.data);
    } catch (error) {
      console.error("Error fetching AI overview:", error.response?.data || error.message);
      // Fallback data if API fails
      setPlaceOverview({
        total_trips: 0,
        average_rating: 0,
        sentiment_summary: { Positive: 0, Neutral: 0, Negative: 0 },
        all_tags: [],
        overview: "No AI overview available at the moment."
      });
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const filteredExperiences = searchQuery
    ? experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.placeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : experiences;

  const isSearching = searchQuery !== '';

  // Handle form submissions
  const handleAddExperience = () => {
    const newExperience = {
      id: experiences.length + 1,
      userName: 'Current User',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...formData,
      likes: 0,
      liked: false,
      reviews: [],
      comments: [],
    };
    setExperiences([...experiences, newExperience]);
    setFormData({ title: '', content: '', image: '', placeId: '' });
    setShowModal(null);
  };

  const handleAddReview = (expId) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          reviews: [
            ...exp.reviews,
            { id: exp.reviews.length + 1, userName: 'Current User', ...reviewData, likes: 0, liked: false },
          ],
        };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
    setReviewData({ content: '', rating: 5 });
    setShowModal(null);
  };

  const handleAddComment = (expId, reviewId = null) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        if (reviewId) {
          return {
            ...exp,
            reviews: exp.reviews.map(review => {
              if (review.id === reviewId) {
                return {
                  ...review,
                  comments: [
                    ...(review.comments || []),
                    { id: (review.comments?.length || 0) + 1, userName: 'Current User', content: commentData.content },
                  ],
                };
              }
              return review;
            }),
          };
        }
        return {
          ...exp,
          comments: [
            ...exp.comments,
            { id: exp.comments.length + 1, userName: 'Current User', content: commentData.content, replies: [] },
          ],
        };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
    setCommentData({ content: '' });
    setShowModal(null);
  };

  const handleLikeExperience = (expId) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, liked: !exp.liked, likes: exp.liked ? exp.likes - 1 : exp.likes + 1 };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
  };

  const handleLikeReview = (expId, reviewId) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          reviews: exp.reviews.map(review => {
            if (review.id === reviewId) {
              return { ...review, liked: !review.liked, likes: review.liked ? review.likes - 1 : review.likes + 1 };
            }
            return review;
          }),
        };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
  };

  const handleUpdateExperience = (expId) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, ...formData };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
    setFormData({ title: '', content: '', image: '', placeId: '' });
    setShowModal(null);
  };

  const handleDeleteExperience = (expId) => {
    setExperiences(experiences.filter(exp => exp.id !== expId));
  };

  const handleUpdateReview = (expId, reviewId) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          reviews: exp.reviews.map(review => {
            if (review.id === reviewId) {
              return { ...review, ...reviewData };
            }
            return review;
          }),
        };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
    setReviewData({ content: '', rating: 5 });
    setShowModal(null);
  };

  const handleDeleteReview = (expId, reviewId) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, reviews: exp.reviews.filter(review => review.id !== reviewId) };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (unreadCount > 0 && !showNotifications) {
      setUnreadCount(0);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const ExperienceCard = ({ exp }) => (
    <div
      className="w-full bg-white/50 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 border border-gray-200"
    >
      {exp.image ? (
        <img
          alt={exp.title}
          className="w-full h-48 object-cover rounded-t-xl"
          src={exp.image}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-xl text-gray-500">
          No Image
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={exp.profileImage}
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-400/30"
              alt={`${exp.userName}'s profile`}
            />
            <div>
              <p className="text-sm font-semibold text-black">{exp.userName}</p>
              <p className="text-xs text-gray-600">{exp.timestamp}</p>
            </div>
          </div>
          <button
            className="text-teal-600 hover:text-teal-500 text-sm font-medium"
            onClick={() => setSelectedExperience(exp)}
            aria-label={`View details for ${exp.title}`}
          >
            Details
          </button>
        </div>
        <h3 className="text-xl font-semibold text-black">{exp.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{exp.content}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-6">
            <button
              className="flex items-center space-x-1 text-teal-600 hover:text-teal-500 transition-colors duration-200"
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
              className="flex items-center space-x-1 text-teal-600 hover:text-teal-500 transition-colors duration-200"
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
            className="text-teal-600 hover:text-teal-500 text-sm font-medium"
            onClick={() => setShowModal(`addReview-${exp.id}`)}
            aria-label={`Add review for ${exp.title}`}
          >
            Add Review
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-white font-display text-black">
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-20 z-50 p-2 rounded-lg text-white text-sm flex items-center space-x-2 ${
        wsConnected ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
        <span>{wsConnected ? '🔔 Connected' : '🔔 Disconnected'}</span>
      </div>

      {/* Test Notification Button */}
      <button 
        onClick={testNotification}
        className="fixed top-4 right-40 z-50 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
      >
        Test Notification
      </button>

      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm shadow-teal-500/20 border-b border-gray-200">




          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">


    <button className="button" onClick={()=>navigate(-1)}>
        
      <div className="button-box">
        <span className="button-elem">
          <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
          </svg>
        </span>
        <span className="button-elem">
          <svg viewBox="0 0 46 40">
            <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
          </svg>
        </span>
      </div>
    </button>
  




            <button onClick={() => navigate('/Calendar')} className="p-2" aria-label="Calendar">
              <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">calendar_today</span>
            </button>
            <h1 className="text-2xl font-bold text-teal-600">PathFinder</h1>
            <div className='justify-between flex items-center'>
              <Link to={'/ProfilePage'} className="p-2" aria-label="Profile">
                <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">account_circle</span>
              </Link>

              <button className="inbox-btn relative" onClick={handleToggleNotifications}>
                <svg viewBox="0 0 512 512" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                  ></path>
                </svg>
                {unreadCount > 0 && <span className="msg-count absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{unreadCount}</span>}
              </button>
            </div>
          </div>
 */}

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      
      {/* Left side: Back Button */}
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

      {/* Center: Title */}
      <h1 className="text-2xl font-bold text-teal-600">PathFinder</h1>

      {/* Right side: Calendar, Profile, Notifications */}
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

        <button className="relative" onClick={handleToggleNotifications} aria-label="Notifications">
          <svg viewBox="0 0 512 512" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 z-10">search</span>
              <input
                className="w-full rounded-full border border-gray-300 bg-gray-50/60 pl-12 pr-20 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-gray-500 transition-all duration-300"
                placeholder="Search for experiences"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search experiences"
              />
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

          {/* Place AI Overview when searching */}
          {isSearching && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 shadow-lg shadow-teal-500/20 border border-teal-500/20">
              {loading ? (
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
              ) : placeOverview ? (
                <>
                  <h3 className="text-xl font-bold text-teal-600 mb-4">AI-Powered Insights for "{searchQuery}"</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <p className="text-2xl font-bold text-teal-600">{placeOverview.total_trips || 0}</p>
                      <p className="text-sm text-gray-600">Total Trips</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <p className="text-2xl font-bold text-teal-600">{placeOverview.average_rating || 0}</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <div className="flex justify-center space-x-2 mb-2">
                        <span className="text-green-600">👍 {placeOverview.sentiment_summary?.Positive || 0}</span>
                        <span className="text-gray-600">😐 {placeOverview.sentiment_summary?.Neutral || 0}</span>
                        <span className="text-red-600">👎 {placeOverview.sentiment_summary?.Negative || 0}</span>
                      </div>
                      <p className="text-sm text-gray-600">Sentiment</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {placeOverview.all_tags?.map((tag, index) => (
                      <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                    {(!placeOverview.all_tags || placeOverview.all_tags.length === 0) && (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        No tags available
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {placeOverview.overview || "No overview available."}
                  </p>
                </>
              ) : null}
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
                  <div data-text="Loading Experiences" className="text"></div>
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
                    <p className="text-gray-600 text-lg">No experiences found.</p>
                  </div>
                )}
                {!isSearching && (
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

          {/* Rest of your modals remain the same */}
          {/* ... (keep all your existing modal code) ... */}
        </main>
      </div>

      {/* Enhanced Notifications Sidebar */}
      {showNotifications && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl shadow-teal-500/20 border-l-2 border-teal-500/50 z-50 overflow-y-auto animate-slide-in">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-teal-600 flex items-center justify-between">
              Notifications
              <div className="flex items-center space-x-2">
                <button 
                  onClick={clearAllNotifications}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
                >
                  Clear All
                </button>
                <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </h3>
          </div>
          <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-teal-50 text-teal-800 p-3 rounded-lg border-l-4 border-teal-400">
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-teal-600 mt-1">{notif.timestamp}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No notifications yet.</p>
                <p className="text-xs text-gray-400">Notifications will appear here when you receive messages.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">
          <a onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </a>
          <a onClick={() => navigate('/TravelPlannerofBadget')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
            <span className="text-sm font-medium">Expense</span>
          </a>
          <a  onClick={() => navigate('/TripPlannerofCustome')}  className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">tune</span>
            <span className="text-sm font-medium">Customize</span>
          </a>
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
          width: 8px;
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #14b8a6;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: #e5e7eb;
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
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .msg-count {
          min-width: 18px;
          min-height: 18px;
        }
      `}</style>
    </div>
  );
};

export default ExperienceSide;