import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../stylecomponent/experianceside.css';
import '../stylecomponent/newmessageiconstyle.css'

const ExperienceSide = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

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

  // Fetch all profiles
  useEffect(() => {
    if (!token) {
      navigate("/RegistrationForm");
      return;
    }

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
  }, [token, navigate]);

  // Fetch experiences
  useEffect(() => {
    if (!token) {
      navigate("/RegistrationForm");
      return;
    }

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
  }, [token, profiles, navigate]);

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
      console.log('param   s  ',params)

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
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm shadow-teal-500/20 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/Calendar')} className="p-2" aria-label="Calendar">
              <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">calendar_today</span>
            </button>
            <h1 className="text-2xl font-bold text-teal-600">PathFinder</h1>
            <div className='justify-between flex items-center'>
            <Link to={'/ProfilePage'} className="p-2" aria-label="Profile">
              <span className="material-symbols-outlined text-teal-600 hover:text-teal-500 transition-colors">account_circle</span>
            </Link>






<button class="inbox-btn">
  <svg viewBox="0 0 512 512" height="16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
    ></path>
  </svg>
  <span class="msg-count">99</span>
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

          {/* Experience Details Modal */}
          {selectedExperience && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200">
                <h3 className="text-2xl font-bold text-black mb-4">{selectedExperience.title}</h3>
                {selectedExperience.image ? (
                  <img src={selectedExperience.image} alt={selectedExperience.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg mb-4 text-gray-500">
                    No Image
                  </div>
                )}
                <p className="text-base text-gray-700 mb-3">{selectedExperience.content}</p>
                <p className="text-sm text-gray-600 mb-3">Posted by: {selectedExperience.userName} on {selectedExperience.timestamp}</p>
                <p className="text-sm text-gray-600 mb-6">Likes: {selectedExperience.likes.toLocaleString()}</p>
                <h4 className="text-lg font-semibold text-black mb-3">Reviews</h4>
                {selectedExperience.reviews.map(review => (
                  <div key={review.id} className="border-t border-teal-500/50 pt-3 mt-3">
                    <p className="text-sm text-black font-medium">{review.userName}: {review.content}</p>
                    <p className="text-sm text-gray-600">Rating: {review.rating}/5</p>
                    <p className="text-sm text-gray-600">Likes: {review.likes}</p>
                    <div className="flex space-x-4 mt-2">
                      <button
                        className="text-teal-600 hover:text-teal-500 text-sm font-medium"
                        onClick={() => handleLikeReview(selectedExperience.id, review.id)}
                        aria-label={review.liked ? `Unlike review by ${review.userName}` : `Like review by ${review.userName}`}
                      >
                        {review.liked ? 'Unlike' : 'Like'}
                      </button>
                      <button
                        className="text-teal-600 hover:text-teal-500 text-sm font-medium"
                        onClick={() => {
                          setReviewData({ content: review.content, rating: review.rating });
                          setShowModal(`updateReview-${selectedExperience.id}-${review.id}`);
                        }}
                        aria-label={`Edit review by ${review.userName}`}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-500 text-sm font-medium"
                        onClick={() => handleDeleteReview(selectedExperience.id, review.id)}
                        aria-label={`Delete review by ${review.userName}`}
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      className="text-teal-600 hover:text-teal-500 text-sm font-medium mt-2"
                      onClick={() => setShowModal(`addComment-${selectedExperience.id}-${review.id}`)}
                      aria-label={`Add comment to review by ${review.userName}`}
                    >
                      Add Comment
                    </button>
                    {review.comments?.map(comment => (
                      <div key={comment.id} className="ml-4 text-sm text-gray-600 mt-2">
                        <p>{comment.userName}: {comment.content}</p>
                      </div>
                    ))}
                  </div>
                ))}
                <h4 className="text-lg font-semibold text-black mt-6 mb-3">Comments</h4>
                {selectedExperience.comments.map(comment => (
                  <div key={comment.id} className="border-t border-teal-500/50 pt-3 mt-3">
                    <p className="text-sm text-black font-medium">{comment.userName}: {comment.content}</p>
                    {comment.replies.map(reply => (
                      <p key={reply.id} className="ml-4 text-sm text-gray-600 mt-1">{reply.userName}: {reply.content}</p>
                    ))}
                  </div>
                ))}
                <button
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
                  onClick={() => setSelectedExperience(null)}
                  aria-label={`Close ${selectedExperience.title} details`}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Add Experience Modal */}
          {showModal === 'addExperience' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-black mb-6">Share New Experience</h3>
                <div className="space-y-6">
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black placeholder=text-gray-500 transition-all duration-300"
                    placeholder="Experience Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    aria-label="Experience title"
                  />
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black placeholder=text-gray-500 transition-all duration-300"
                    placeholder="Describe your experience"
                    rows="4"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    aria-label="Experience description"
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black placeholder=text-gray-500 transition-all duration-300"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    aria-label="Experience image URL"
                  />
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black"
                    value={formData.placeId}
                    onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                    aria-label="Select place"
                  >
                    <option value="" className="text-gray-500">Select a Place</option>
                    <option value="1">Marrakech Markets</option>
                    <option value="2">Bali Beaches</option>
                    <option value="3">Tokyo Tech</option>
                    <option value="4">Parisian Charm</option>
                    <option value="5">Manali</option>
                  </select>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel adding experience"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
                      onClick={handleAddExperience}
                      aria-label="Submit new experience"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Review Modal */}
          {showModal?.startsWith('addReview') && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-black mb-6">Add Review</h3>
                <div className="space-y-6">
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black placeholder=text-gray-500 transition-all duration-300"
                    placeholder="Write your review"
                    rows="4"
                    value={reviewData.content}
                    onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                    aria-label="Review content"
                  />
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    aria-label="Select rating"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating} className="text-black">{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel adding review"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
                      onClick={() => handleAddReview(parseInt(showModal.split('-')[1]))}
                      aria-label="Submit review"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Comment Modal */}
          {showModal?.startsWith('addComment') && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-black mb-6">Add Comment</h3>
                <div className="space-y-6">
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-black placeholder=text-gray-500 transition-all duration-300"
                    placeholder="Write your comment"
                    rows="4"
                    value={commentData.content}
                    onChange={(e) => setCommentData({ ...commentData, content: e.target.value })}
                    aria-label="Comment content"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel adding comment"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300"
                      onClick={() => {
                        const [_, expId, reviewId] = showModal.split('-');
                        handleAddComment(parseInt(expId), reviewId ? parseInt(reviewId) : null);
                      }}
                      aria-label="Submit comment"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-gray-50/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">
          <a onClick={() => navigate('/ExperienceSide')} className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </a>
          <a onClick={() => navigate('/TripPlanner')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
            <span className="text-sm font-medium">Expense</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-500 transition-colors duration-200" href="#">
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
      `}</style>
    </div>
  );
};

export default ExperienceSide;