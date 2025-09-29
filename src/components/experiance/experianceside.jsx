import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ExperienceSide = () => {
  // Mock data for places (unchanged)
  const places = [
    {
      id: 1,
      name: 'Marrakech Markets',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP04R7W2gV97LaWGs5ALWECOwfOjyC9t-TVBSZAKNNp5m77VdqkeKAyG3N01sJ9Iy82xpVQw0AqzhwjxBf6mGq_30zvN6gkKqGjvQtMuzsStwZ2VDNpsZgcXQmFub6JqfbxixwdBdZt1CxpcaMOvNs0_Ho4vusmXD6Lou1LljmLj4iN0HokuM6XwulTVXOTgdU9O_OXD92hKo3rUHRJC9UP7nGSpYs7SXszgz0AqfHnuXdNuTQuuI3tCSNxdY96zB6cMQTeZ7vrdA',
      description: 'Explore the bustling souks and vibrant culture of Marrakech.',
      rating: 4.5,
      reviewsCount: 120,
      overview: 'A vibrant destination with colorful markets and rich culture. 80% of reviews highlight the lively atmosphere, while 10% mention crowded conditions.',
    },
    {
      id: 2,
      name: 'Bali Beaches',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAiwU3JzWMAOnCpYWqulnFyWv48Rpr8knjIXAIgQFREgjnvUwolcSkajHmb75rvzN9tThTu8pfJIsuVwYGBf3YrCol_EExSR0veh1v8O0CtNCfswPHAR-3LGO5SBlQGIfU8OarN_-F2DdRompErLtJTiOVnOostRQUYHCsf96dBK7SpAihzwOfcmrUPl20jxfibejswq5mhqYuqYa6twm9zj7_rkexkhzNsQEOS9ZqzEBM_eg80tUjXaeTIyqNPioKN6GdgcEx_Lk',
      description: 'Relax on the pristine beaches and enjoy the tranquil atmosphere of Bali.',
      rating: 4.7,
      reviewsCount: 150,
      overview: 'Known for serene beaches and relaxation. 90% of reviews praise the scenery, while 5% note high costs during peak seasons.',
    },
    {
      id: 3,
      name: 'Tokyo Tech',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw5RnLPFPktx2M8oVJrshwBHhbeTc9nbTM4Ar-e_jz-ll0fdFLicR7FDpxL97EtsQQqeS0GW9GM4jFP5Dm0SrhmLwMX_ThKn308Tbgbg51LymLSTNmc8pY54eBRqoiBR1D8wCSSn5bNg9Jv9SHCiEOMpGk7MhJ-5-mV0edh1g42lR1AD58u-SXR7LupgTSUbLNsfWMEaIfGhbGHnwlJ6uhsyI47p1eaOW_1TWv-5la5PKgvsIs2uUjjfCDvaY39__unOdCAOo1OwA',
      description: 'Discover the cutting-edge technology and vibrant city life of Tokyo.',
      rating: 4.6,
      reviewsCount: 135,
      overview: 'A hub of innovation and culture. 85% of reviews love the tech attractions, while 8% mention language barriers.',
    },
    {
      id: 4,
      name: 'Parisian Charm',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCghZIGon4HCbnQnsV23w5wEzJyAgpvlEsaJLGYKYj6_WmAsHNT2ekBI6pmW9Pvwn23z1v2IChsHU8rIBvC613R0caMWSRwnC9heTbNghVmjb0-fL0UW_1aKSoKUadk6apoPhFsv1EbLiqIhkBPtGIzUFRBZ9lfiwLJe0OODMsE-qFNaY4OsbFzGnSp4bmvz0yUwQYJhup7B93HG5gdoDXw9Vxy4JUJgGyTMdfgulPYYZvExNWm9WLsE1rx_vUfXGUncB4TtZKR3vE',
      description: 'Experience the romantic ambiance and iconic landmarks of Paris.',
      rating: 4.8,
      reviewsCount: 160,
      overview: 'A romantic destination with iconic sights. 95% of reviews adore the charm, while 3% note high tourist traffic.',
    },
  ];

  // Mock data for experiences (unchanged)
  const initialExperiences = [
    {
      id: 1,
      userName: 'Emma Traveler',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      timestamp: '2 days ago',
      title: 'Santorini Sunset',
      placeId: 2,
      content: 'Had an amazing time in Santorini! The AI planner made it so easy to explore the island’s beauty. Highly recommend! #travel #santorini',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80',
      likes: 54100,
      liked: false,
      reviews: [
        { id: 1, userName: 'Alex', content: 'Amazing experience!', rating: 5, likes: 10, liked: false },
        { id: 2, userName: 'Mia', content: 'Crowded but beautiful.', rating: 4, likes: 5, liked: false },
      ],
      comments: [
        { id: 1, userName: 'John', content: 'Great post!', replies: [{ id: 1, userName: 'Emma', content: 'Thanks!' }] },
      ],
    },
    {
      id: 2,
      userName: 'John Explorer',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      timestamp: '1 week ago',
      title: 'Bali Adventure',
      placeId: 2,
      content: 'The budget optimization feature saved me hundreds in Bali! Perfect trip, amazing beaches. #bali #travelai',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      likes: 173,
      liked: false,
      reviews: [
        { id: 3, userName: 'Sarah', content: 'Loved the beaches!', rating: 5, likes: 8, liked: false },
      ],
      comments: [],
    },
  ];

  const [experiences, setExperiences] = useState(initialExperiences);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Places');
  const [showModal, setShowModal] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image: '', placeId: '' });
  const [reviewData, setReviewData] = useState({ content: '', rating: 5 });
  const [commentData, setCommentData] = useState({ content: '' });
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Search functionality
  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredExperiences = experiences.filter(exp =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    places.find(p => p.id === exp.placeId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-black font-display text-white">
      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg shadow-sm shadow-teal-500/20 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button className="p-2" aria-label="Calendar">
              <span className="material-symbols-outlined text-teal-400 hover:text-teal-300 transition-colors">calendar_today</span>
            </button>
            <h1 className="text-2xl font-bold text-teal-500">TravelAI</h1>
            <Link to={'/ProfilePage'} className="p-2" aria-label="Profile"><span className="material-symbols-outlined text-teal-400 hover:text-teal-300 transition-colors">account_circle</span></Link>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 z-10">search</span>
              <input
                className="w-full rounded-full border-none bg-gray-800/60 pl-12 pr-20 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-gray-400 transition-all duration-300"
                placeholder={searchType === 'Places' ? 'Search for places' : 'Search for experiences'}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search places or experiences"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <select
                  className="h-full rounded-r-full border-l border-gray-600 bg-gray-800/40 text-gray-300 py-0 pl-2 pr-7 text-sm focus:ring-0 focus:border-transparent"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  aria-label="Select search type"
                >
                  <option>Places</option>
                  <option>Experiences</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* AI User Insights */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">AI User Insights</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Based on your searches, we recommend exploring the vibrant markets of Marrakech or the serene beaches of Bali. These destinations are trending among travelers like you.
            </p>
          </section>

          {/* Add New Experience */}
          <section className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg shadow-teal-500/20 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Share Your Experience</h2>
              <button
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
                onClick={() => setShowModal('addExperience')}
                aria-label="Add new experience"
              >
                Post Experience
              </button>
            </div>
          </section>

          {/* Places Listing */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Explore Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  className="w-full bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 shine-effect"
                >
                  <img
                    alt={place.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                    src={place.image}
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-white">{place.name}</h3>
                    <p className="text-sm text-gray-200 mt-2 line-clamp-2">{place.description}</p>
                    <div className="flex items-center mt-3 text-sm text-gray-200">
                      <span className="material-symbols-outlined text-base text-teal-400 mr-1">star</span>
                      <span>{place.rating} ({place.reviewsCount} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-200 mt-3 line-clamp-3">{place.overview}</p>
                    <button
                      className="mt-4 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
                      onClick={() => setSelectedPlace(place)}
                      aria-label={`View details for ${place.name}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Listing */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Traveler Experiences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map(exp => (
                <div
                  key={exp.id}
                  className="w-full bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 shine-effect"
                >
                  <img
                    alt={exp.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                    src={exp.image}
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={exp.profileImage}
                          className="w-10 h-10 rounded-full object-cover border-2 border-teal-400/30"
                          alt={`${exp.userName}'s profile`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{exp.userName}</p>
                          <p className="text-xs text-gray-200">{exp.timestamp}</p>
                        </div>
                      </div>
                      <button
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                        onClick={() => setSelectedExperience(exp)}
                        aria-label={`View details for ${exp.title}`}
                      >
                        Details
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-200 mt-2 line-clamp-3">{exp.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-6">
                        <button
                          className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 transition-colors duration-200"
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
                              d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
                            />
                          </svg>
                          <span className="text-sm text-white">{exp.likes.toLocaleString()}</span>
                        </button>
                        <button
                          className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 transition-colors duration-200"
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
                          <span className="text-sm text-white">{exp.comments.length}</span>
                        </button>
                      </div>
                      <button
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                        onClick={() => setShowModal(`addReview-${exp.id}`)}
                        aria-label={`Add review for ${exp.title}`}
                      >
                        Add Review
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-6">
              <button
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
                aria-label="Load more experiences"
              >
                Load More
              </button>
            </div>
          </section>

          {/* Place Details Modal */}
          {selectedPlace && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">{selectedPlace.name}</h3>
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                <p className="text-base text-gray-200 mb-3">{selectedPlace.description}</p>
                <p className="text-sm text-gray-200 mb-3">Rating: {selectedPlace.rating} ({selectedPlace.reviewsCount} reviews)</p>
                <p className="text-sm text-gray-200 mb-6">Overview: {selectedPlace.overview}</p>
                <button
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
                  onClick={() => setSelectedPlace(null)}
                  aria-label={`Close ${selectedPlace.name} details`}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Experience Details Modal */}
          {selectedExperience && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">{selectedExperience.title}</h3>
                <img src={selectedExperience.image} alt={selectedExperience.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                <p className="text-base text-gray-200 mb-3">{selectedExperience.content}</p>
                <p className="text-sm text-gray-200 mb-3">Posted by: {selectedExperience.userName} on {selectedExperience.timestamp}</p>
                <p className="text-sm text-gray-200 mb-6">Likes: {selectedExperience.likes.toLocaleString()}</p>
                <h4 className="text-lg font-semibold text-white mb-3">Reviews</h4>
                {selectedExperience.reviews.map(review => (
                  <div key={review.id} className="border-t border-teal-500/50 pt-3 mt-3">
                    <p className="text-sm text-white font-medium">{review.userName}: {review.content}</p>
                    <p className="text-sm text-gray-200">Rating: {review.rating}/5</p>
                    <p className="text-sm text-gray-200">Likes: {review.likes}</p>
                    <div className="flex space-x-4 mt-2">
                      <button
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                        onClick={() => handleLikeReview(selectedExperience.id, review.id)}
                        aria-label={review.liked ? `Unlike review by ${review.userName}` : `Like review by ${review.userName}`}
                      >
                        {review.liked ? 'Unlike' : 'Like'}
                      </button>
                      <button
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                        onClick={() => {
                          setReviewData({ content: review.content, rating: review.rating });
                          setShowModal(`updateReview-${selectedExperience.id}-${review.id}`);
                        }}
                        aria-label={`Edit review by ${review.userName}`}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                        onClick={() => handleDeleteReview(selectedExperience.id, review.id)}
                        aria-label={`Delete review by ${review.userName}`}
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      className="text-teal-400 hover:text-teal-300 text-sm font-medium mt-2"
                      onClick={() => setShowModal(`addComment-${selectedExperience.id}-${review.id}`)}
                      aria-label={`Add comment to review by ${review.userName}`}
                    >
                      Add Comment
                    </button>
                    {review.comments?.map(comment => (
                      <div key={comment.id} className="ml-4 text-sm text-gray-200 mt-2">
                        <p>{comment.userName}: {comment.content}</p>
                      </div>
                    ))}
                  </div>
                ))}
                <h4 className="text-lg font-semibold text-white mt-6 mb-3">Comments</h4>
                {selectedExperience.comments.map(comment => (
                  <div key={comment.id} className="border-t border-teal-500/50 pt-3 mt-3">
                    <p className="text-sm text-white font-medium">{comment.userName}: {comment.content}</p>
                    {comment.replies.map(reply => (
                      <p key={reply.id} className="ml-4 text-sm text-gray-200 mt-1">{reply.userName}: {reply.content}</p>
                    ))}
                  </div>
                ))}
                <button
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
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
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Share New Experience</h3>
                <div className="space-y-6">
                  <input
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Experience Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    aria-label="Experience title"
                  />
                  <textarea
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Describe your experience"
                    rows="4"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    aria-label="Experience description"
                  />
                  <input
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    aria-label="Experience image URL"
                  />
                  <select
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white"
                    value={formData.placeId}
                    onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                    aria-label="Select place"
                  >
                    <option value="" className="text-gray-200">Select a Place</option>
                    {places.map(place => (
                      <option key={place.id} value={place.id} className="text-white">{place.name}</option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel adding experience"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
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

          {/* Update Experience Modal */}
          {showModal?.startsWith('updateExperience') && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Update Experience</h3>
                <div className="space-y-6">
                  <input
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Experience Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    aria-label="Experience title"
                  />
                  <textarea
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Describe your experience"
                    rows="4"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    aria-label="Experience description"
                  />
                  <input
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    aria-label="Experience image URL"
                  />
                  <select
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white"
                    value={formData.placeId}
                    onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                    aria-label="Select place"
                  >
                    <option value="" className="text-gray-200">Select a Place</option>
                    {places.map(place => (
                      <option key={place.id} value={place.id} className="text-white">{place.name}</option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel updating experience"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
                      onClick={() => handleUpdateExperience(parseInt(showModal.split('-')[1]))}
                      aria-label="Update experience"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Review Modal */}
          {showModal?.startsWith('addReview') && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Add Review</h3>
                <div className="space-y-6">
                  <textarea
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Write your review"
                    rows="4"
                    value={reviewData.content}
                    onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                    aria-label="Review content"
                  />
                  <select
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    aria-label="Select rating"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating} className="text-white">{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel adding review"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
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

          {/* Update Review Modal */}
          {showModal?.startsWith('updateReview') && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Update Review</h3>
                <div className="space-y-6">
                  <textarea
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Write your review"
                    rows="4"
                    value={reviewData.content}
                    onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                    aria-label="Review content"
                  />
                  <select
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    aria-label="Select rating"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating} className="text-white">{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel updating review"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
                      onClick={() => handleUpdateReview(
                        parseInt(showModal.split('-')[1]),
                        parseInt(showModal.split('-')[2])
                      )}
                      aria-label="Update review"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Comment Modal */}
          {showModal?.startsWith('addComment') && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-xl shadow-lg shadow-teal-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Add Comment</h3>
                <div className="space-y-6">
                  <textarea
                    className="w-full rounded-lg border-none bg-gray-800/60 pl-4 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                    placeholder="Write your comment"
                    rows="4"
                    value={commentData.content}
                    onChange={(e) => setCommentData({ ...commentData, content: e.target.value })}
                    aria-label="Comment content"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setShowModal(null)}
                      aria-label="Cancel adding comment"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 shine-effect"
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
      <footer className="sticky bottom-0 bg-black/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
        <nav className="flex justify-around items-center p-4">
          <a className="flex flex-col items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">explore</span>
            <span className="text-sm font-medium">Experience</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-200 hover:text-gray-100 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
            <span className="text-sm font-medium">Expense</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-200 hover:text-gray-100 transition-colors duration-200" href="#">
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
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .shine-effect:hover::before {
          left: 100%;
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
          background-color: #374151;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ExperienceSide;