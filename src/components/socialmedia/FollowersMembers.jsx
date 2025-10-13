import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowersMembers = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const mockFollowingData = [
    {
      id: 1,
      username: "travel_lover",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Adventure seeker & photography enthusiast",
      isFollowing: true,
      mutualFriends: 12,
      location: "New York, USA"
    },
    {
      id: 2,
      username: "wanderer_23",
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Digital nomad exploring the world one city at a time",
      isFollowing: true,
      mutualFriends: 8,
      location: "Tokyo, Japan"
    },
    {
      id: 3,
      username: "nature_explorer",
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Hiking | Camping | Mountain lover",
      isFollowing: true,
      mutualFriends: 15,
      location: "Colorado, USA"
    },
    {
      id: 4,
      username: "foodie_travels",
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Culinary adventures around the globe",
      isFollowing: true,
      mutualFriends: 5,
      location: "Barcelona, Spain"
    },
    {
      id: 5,
      username: "beach_bum",
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      bio: "Sun, sand, and sea 🌊",
      isFollowing: true,
      mutualFriends: 20,
      location: "Bali, Indonesia"
    }
  ];

  // Fetch following data from API
  const fetchFollowingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      // Replace with your actual API endpoint
      const response = await axios.get('http://127.0.0.1:8003/following/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFollowing(response.data);
    } catch (err) {
      console.error('Error fetching following data:', err);
      setError('Failed to load following list');
      // Use mock data as fallback
      setFollowing(mockFollowingData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowingData();
  }, []);

  // Handle unfollow action
  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Replace with your actual unfollow API endpoint
      await axios.post(
        `http://127.0.0.1:8003/unfollow/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setFollowing(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error unfollowing user:', err);
      alert('Failed to unfollow user');
    }
  };

  // Filter following based on search term
  const filteredFollowing = following.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                </div>
                <div className="h-10 bg-gray-600 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                Following
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              {following.length} {following.length === 1 ? 'person' : 'people'}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search following..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-teal-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300 backdrop-blur-lg"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-lg">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-red-400">error</span>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Following List */}
        <div className="space-y-4">
          {filteredFollowing.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">
                group
              </span>
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'No matching users found' : 'You are not following anyone yet'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredFollowing.map((user) => (
              <div
                key={user.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-teal-500/30 p-4 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/50"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{user.name}</h3>
                        
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                        {user.bio}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-sm">group</span>
                          <span>{user.mutualFriends} mutual friends</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => handleUnfollow(user.id)}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20"
                    >
                      Unfollow
                    </button>
                    
                    <button className="text-teal-400 hover:text-teal-300 text-sm transition-colors flex items-center space-x-1">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1 text-gray-400">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      <span>Joined 2 months ago</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-400">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span>4.8 rating</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-400 text-xs">Online</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredFollowing.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Global Styles for Material Icons */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FollowersMembers;