import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useSelector } from 'react-redux';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setMessageandProfileViewid } from '../actioncreate';

// Helper function to safely render values
const safeRender = (value, defaultValue = "") => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    if (value.linkdin) {
      return value.linkdin;
    }
    if (value.name || value.title || value.value || value.url) {
      return value.name || value.title || value.value || value.url || defaultValue;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
};

const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = now - past;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

export default function ProfileOnly() {
  const navigate = useNavigate(); 
  const base = "http://127.0.0.1:8002"; 
  const expBase = "http://127.0.0.1:8004";
  const countBase = "http://127.0.0.1:8003";
    const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [ffCount, setFfCount] = useState({ followersCount: 0, followingCoun: 0 });  
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  
  const userId = useSelector(state => state.app.messageandprofileviewid);
  const authuserid = useSelector(state => state.app.autherazeduserId);
  const accesstoken = localStorage.getItem("access_token");

  // Clean profile data to ensure all fields are safe to render
  const cleanProfileData = (data) => {
    if (!data || typeof data !== 'object') {
      return {};
    }
    
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
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const FetchuserVideoandimages = async () => {
    try {
      const datas = await axios.get(`http://127.0.0.1:8004/TravalExperienceGetspecificuserDatas/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      console.log(datas.data);
      if (datas.data && datas.data.data) {
        // Remove duplicates based on id
        const uniqueExperiences = datas.data.data.filter((exp, index, self) => 
          index === self.findIndex(e => e.id === exp.id)
        );
        const userName = profileData.name || "User";
        const experiencesData = uniqueExperiences.map(exp => ({
          id: exp.id,
          userName,
          title: exp.title,
          content: exp.description.substring(0, 100) + (exp.description.length > 100 ? "..." : ""),
          place_name: exp.place_name,
          category: exp.category,
          description: exp.description,
          rating: exp.rating,
          date_of_visit: exp.date_of_visit,
          tags: exp.tags || [],
          media: exp.image 
            ? [{ type: "image", url: `${expBase}${exp.image}`, caption: exp.title, aspect: "square" }]
            : exp.video 
            ? [{ type: "video", url: `${expBase}${exp.video}`, poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=300", aspect: "16:9" }]
            : [],
          comments: [],
          timestamp: getTimeAgo(exp.created_at),
          likes: Math.floor(Math.random() * 200) + 50,
          sentiment: exp.sentiment,
          privacy: exp.privacy,
        })).filter(post => post.media.length > 0); // Only include posts with media
        setPosts(experiencesData);
      }
    } catch (e) {
      console.log("Experience fetch failed", e);
      setPosts([]);
    }
  };

  // Fetch followers list
  const fetchFollowers = async () => {
    if (loadingFollowers) return;
    setLoadingFollowers(true);
    try {
      const res = await axios.get(`${countBase}/SpecificUserFolloweListView/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      console.log("Followers data:", res.data);
      setFollowers(res.data || []);
    } catch (e) {
      console.log("Followers fetch failed", e);
      setFollowers([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  // Fetch following list
  const fetchFollowing = async () => {
    if (loadingFollowing) return;
    setLoadingFollowing(true);
    try {
      const res = await axios.get(`${countBase}/SpecificUserFollowingListView/${userId}/`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      console.log("Following data:", res.data);
      setFollowing(res.data || []);
    } catch (e) {
      console.log("Following fetch failed", e);
      setFollowing([]);
    } finally {
      setLoadingFollowing(false);
    }
  };

  useEffect(() => {
    const Specificuserfunc = async () => {
      try {
        const res = await axios.get(`${base}/SpecificUserProfile/${userId}/`, {
          headers: { Authorization: `Bearer ${accesstoken}` },
        });
        console.log("Profile data:", res.data);
        setProfileData(cleanProfileData(res.data));
      } catch (e) {
        console.log("Profile fetch failed", e);
        setProfileData({});
      }
    };

    const counstOfall = async () => {
      try {
        const res = await axios.get(`${countBase}/CountofFollwerandFollwingByspecific/${userId}`, {
          headers: { Authorization: `Bearer ${accesstoken}` },
        });
        console.log("Count data:", res.data);
        setFfCount({
          followersCount: res.data.followersCount || 0,
          followingCoun: res.data.followingCoun || 0
        });
      } catch (e) {
        console.log("Count fetch failed", e);
        setFfCount({ followersCount: 0, followingCoun: 0 });
      }
    };

    if (userId && accesstoken) {
      counstOfall();
      Specificuserfunc();
    }
  }, [userId, accesstoken]);

  // Fetch experiences after profile is loaded
  useEffect(() => {
    if (profileData.name) {
      FetchuserVideoandimages();
    }
  }, [profileData.name]);

  const imagePosts = posts.filter((post) => post.media[0]?.type === "image");
  const videoPosts = posts.filter((post) => post.media[0]?.type === "video");

  const getCurrentPosts = () => {
    switch (activeTab) {
      case "All":
        return posts;
      case "Images":
        return imagePosts;
      case "Videos":
        return videoPosts;
      default:
        return posts;
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    
    const updatedPost = {
      ...selectedPost,
      comments: [
        ...selectedPost.comments,
        {
          id: `c${Date.now()}`,
          userName: "You",
          content: newComment,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    setSelectedPost(updatedPost);
    setNewComment("");
  };

  const handleMouseEnter = (postId) => {
    setHoveredPostId(postId);
  };

  const handleMouseLeave = () => {
    setHoveredPostId(null);
  };

  const handleViewFollowers = () => {
    if (followers.length === 0) {
      fetchFollowers();
    }
    setShowFollowersModal(true);
  };

  const handleViewFollowing = () => {
    if (following.length === 0) {
      fetchFollowing();
    }
    setShowFollowingModal(true);
  };

  const handleCloseFollowersModal = () => {
    setShowFollowersModal(false);
  };

  const handleCloseFollowingModal = () => {
    setShowFollowingModal(false);
  };

  const renderUserList = (users, title) => {
    const isFollowers = title.includes('Followers');
    const closeHandler = isFollowers ? handleCloseFollowersModal : handleCloseFollowingModal;
    const loading = isFollowers ? loadingFollowers : loadingFollowing;
    const userList = users || [];

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <button
            onClick={closeHandler}
            className="text-gray-500 hover:text-black"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {userList.length > 0 ? (
            userList.map((user, index) => {
              const safeName = safeRender(user.name, "Unnamed User");
              const safeBio = safeRender(user.bio, "No bio available");
              const avatarUrl = user.profile_picture  ? `${base}${user.profile_picture}` :null;
              const coverUrl = user.cover_photo ? `${base}${user.cover_photo}` : null;
               const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";
              return (
  <div
    key={user.user_id || index}
    onClick={() => {
      dispatch(setMessageandProfileViewid(user.user_id));
      navigate('/ProfileOnly');
      setShowFollowersModal(false)
    }}
    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
    style={{
      backgroundImage: coverUrl ? `url("${coverUrl}")` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >asdfasdfsd
    {/* Avatar / First Letter */}
    {avatarUrl ? (
      <div

        className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${avatarUrl})` }}
        title={safeName}
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
        {safeName ? safeName.charAt(0).toUpperCase() : "?"}
      </div>
    )}

    {/* User Details */}
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm truncate">{safeName}</p>
      <p className="text-xs text-gray-500 truncate">{safeBio}</p>
    </div>

    {/* Follow Button */}
    <button className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm self-start hover:bg-teal-600 transition">
      Follow
    </button>
  </div>
);

            })
          ) : (
            loading ? (
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
  };
  
  const renderPostGrid = (currentPosts, tab) => {
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
                  key={post.id} 
                  className="relative aspect-square group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                  onMouseEnter={() => handleMouseEnter(post.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={displayUrl}
                    alt={media.caption || post.title}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                  
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay with Post Details - Only shows when hovered */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-black/80 transition-opacity duration-300 rounded-lg flex flex-col justify-between p-4">
                      {/* Top Section: Title and Basic Info */}
                      <div className="text-white">
                        <div className="text-lg font-bold mb-2">{post.title}</div>
                        <div className="text-sm mb-1 flex items-center">
                          <span className="material-symbols-outlined text-base mr-1">location_on</span>
                          {post.place_name}
                        </div>
                        <div className="text-sm mb-1 flex items-center">
                          <span className="material-symbols-outlined text-base mr-1">category</span>
                          {post.category}
                        </div>
                        <div className="text-xs text-gray-300 mt-2 line-clamp-2">
                          {post.description}
                        </div>
                      </div>
                      
                      {/* Middle Section: Rating and Date */}
                      <div className="text-white text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="material-symbols-outlined text-yellow-400 text-base mr-1">star</span>
                            <span>Rating: {post.rating}/5</span>
                          </div>
                          <div className="text-xs">
                            Visited: {formatDate(post.date_of_visit)}
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.tags.map((tag, index) => (
                              <span key={index} className="bg-teal-500/80 text-white px-2 py-1 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom Section: Engagement Stats */}
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="material-symbols-outlined text-red-500 text-lg">favorite</span>
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="material-symbols-outlined text-lg">chat_bubble</span>
                            <span className="text-sm">{post.comments.length}</span>
                          </div>
                        </div>
                        <span className="text-gray-300 text-xs">{post.timestamp}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Static engagement indicators (always visible) */}
                  <div className="absolute bottom-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded px-1 py-0.5 text-xs text-white">
                      ♥ {post.likes}
                    </div>
                    <div className="bg-black/50 rounded px-1 py-0.5 text-xs text-white">
                      💬 {post.comments.length}
                    </div>
                  </div>
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
  };

  // Safe profile data for rendering
  const safeProfileData = cleanProfileData(profileData);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-teal-500/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            className="h-10 w-10 inline-flex items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            aria-label="Go back"
            title="Back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-teal-400">Profile</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Profile Header Section */}
        <section
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-teal-600/20 via-cyan-600/10 to-fuchsia-600/20 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(20,184,166,0.15), rgba(8,145,178,0.15)), url(${base}${safeProfileData.cover_photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div
                className="h-28 w-28 rounded-full ring-4 ring-teal-500/30 shadow-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${base}${safeProfileData.profile_picture})` }}
              />
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
                  <p className="text-2xl font-bold">{ffCount.followingCoun}</p>
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
                <button className="bg-gray-200 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded col-span-3 sm:col-span-1 mt-2">
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
              key={tab}
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
                      <button className="flex items-center space-x-1 text-white hover:text-teal-400">
                        <span className="material-symbols-outlined">favorite</span>
                        <span>{selectedPost.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-white hover:text-teal-400">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        <span>{selectedPost.comments.length}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-white hover:text-teal-400">
                        <span className="material-symbols-outlined">share</span>
                      </button>
                    </div>
                    <button className="flex items-center space-x-1 text-white hover:text-teal-400">
                      <span className="material-symbols-outlined">bookmark</span>
                    </button>
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
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
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
                          <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comments List */}
                  {selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
                          {comment.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-sm">{comment.userName}</p>
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{comment.content}</p>
                          
                          {/* Comment Actions */}
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
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2 mb-3">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-600 text-sm">
                      <span className="material-symbols-outlined text-base">favorite</span>
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-600 text-sm">
                      <span className="material-symbols-outlined text-base">reply</span>
                      <span>Reply</span>
                    </button>
                  </div>
                  
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
              {renderUserList(following, `${ffCount.followingCoun} Following`)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}