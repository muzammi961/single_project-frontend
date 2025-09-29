import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        show ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
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

// ========== Mock data ==========
const socialActivity = {
  posts: [
    {
      id: 1,
      title: 'Santorini Sunset',
      content: 'Amazing time in Santorini! #travel',
      image:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80',
      likes: 54100,
      comments: 120,
      timestamp: '2 days ago'
    },
    {
      id: 2,
      title: 'Bali Adventure',
      content: 'Loved the beaches in Bali! #bali',
      image:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      likes: 173,
      comments: 45,
      timestamp: '1 week ago'
    }
  ],
  followers: [
    {
      id: 1,
      name: 'Emma Traveler',
      profileImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'John Explorer',
      profileImage:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    }
  ],
  following: [
    {
      id: 1,
      name: 'Sarah Wanderer',
      profileImage:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80'
    }
  ]
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Sophia Carter',
    bio: 'Travel Enthusiast',
    location: 'San Francisco, CA',
    profileImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face'
  });

  const travelHistory = [
    {
      city: 'Paris',
      date: '2023-07-15',
      image:
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      description: 'Explored the charming streets and iconic Eiffel Tower.'
    },
    {
      city: 'Tokyo',
      date: '2023-05-20',
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      description: 'Immersed in vibrant culture and cutting-edge technology.'
    },
    {
      city: 'New York',
      date: '2023-03-10',
      image:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      description: 'Experienced the bustling energy of Times Square.'
    }
  ];

  const upcomingTrips = [
    {
      city: 'London',
      date: '2024-08-15',
      daysLeft: 3,
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=150&fit=crop'
    }
  ];

  const wishlist = [
    {
      city: 'Santorini',
      country: 'Greece',
      image:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?w=400&h=300&fit=crop'
    },
    {
      city: 'Bali',
      country: 'Indonesia',
      image:
        'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop'
    }
  ];

  const handleEditProfile = () => {
    setShowEditModal(false);
    console.log('Updated Profile:', profileData);
  };

  const confirmLogout = () => {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Close modal, show toast, then navigate
    setShowLogoutModal(false);
    setShowToast(true);
    setTimeout(() => {
      navigate('/LoginPage', { replace: true });
    }, 400); // small delay so toast displays momentarily before route change (optional)
  };

  // Header
  const Header = () => (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg shadow-teal-500/20 border-b border-teal-500/30">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-teal-400 hover:bg-teal-500/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Go back"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-teal-500">Profile</h1>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold px-3 py-2 text-sm shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
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

  // Profile Card component from your previous version...
  const ProfileCard = () => (
    <section className="flex flex-col items-center gap-4 sm:gap-6 bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg shadow-teal-500/20 animate-fade-in">
      <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
        <div
          className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-cover bg-center shadow-lg ring-4 ring-teal-500/20 transition-transform duration-300 hover:scale-105"
          style={{ backgroundImage: `url("${profileData.profileImage}")` }}
        />
        <div>
          <p className="text-lg sm:text-2xl font-bold text-white">{profileData.name}</p>
          <p className="text-sm sm:text-base text-gray-200">{profileData.bio}</p>
          <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs sm:text-sm">location_on</span>
            {profileData.location}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
        <button
          className="flex-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 sm:py-2.5 text-sm sm:text-base shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
          onClick={() => setShowEditModal(true)}
          aria-label="Edit profile"
        >
          Edit Profile
        </button>
        <Link
          to="/experience"
          className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
          aria-label="Navigate to Experience page"
        >
          Experience
        </Link>
      </div>
    </section>
  );

  const StatsCard = ({ value, label }) => (
    <div className="flex flex-col items-center rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 text-center border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105">
      <p className="text-lg sm:text-2xl font-bold text-teal-400">{value}</p>
      <p className="text-xs sm:text-sm text-gray-200">{label}</p>
    </div>
  );

  const SocialActivityCard = ({ title, content, image, likes, comments, timestamp }) => (
    <div className="group rounded-xl bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg border border-teal-500/30 shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-102 animate-fade-in">
      <div
        className="h-32 sm:h-40 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110 object-cover"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="p-3 sm:p-4">
        <p className="text-base sm:text-lg font-semibold text-white">{title}</p>
        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mt-1 sm:mt-2">{content}</p>
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <p className="text-xs text-gray-400">{timestamp}</p>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1 text-teal-400">
              <span className="material-symbols-outlined text-xs sm:text-sm">favorite</span>
              <span className="text-xs sm:text-sm">{likes.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-1 text-teal-400">
              <span className="material-symbols-outlined text-xs sm:text-sm">comment</span>
              <span className="text-xs sm:text-sm">{comments}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const SocialModal = ({ title, users, onClose }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-thin">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{title}</h3>
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 py-2">
            <img
              src={user.profileImage}
              alt={`${user.name}'s profile`}
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-400/30"
            />
            <p className="text-sm sm:text-base text-white">{user.name}</p>
          </div>
        ))}
        <button
          className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
          onClick={onClose}
          aria-label={`Close ${title} modal`}
        >
          Close
        </button>
      </div>
    </div>
  );

  const TravelHistoryCard = ({ city, date, image, description, isLast }) => (
    <div className="relative flex flex-col sm:flex-row items-start mb-6 sm:mb-8 group animate-fade-in">
      {!isLast && (
        <div className="absolute left-3 sm:left-4 top-6 sm:top-8 bottom-0 w-0.5 bg-teal-500/30 sm:bg-gradient-to-b sm:from-teal-500/30 sm:to-transparent" />
      )}
      <div className="flex items-start gap-3 sm:gap-4 z-10 w-full">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-teal-500 ring-4 ring-gray-900/50 group-hover:ring-teal-500/50 transition-all duration-300 mt-1 sm:mt-2" />
        <div className="flex-1 rounded-xl border border-teal-500/30 bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg shadow-lg group-hover:shadow-teal-500/40 transition-all duration-300 transform group-hover:scale-102 overflow-hidden sm:flex sm:items-center">
          <div
            className="h-24 sm:h-32 md:h-40 sm:w-1/3 bg-cover bg-center transition-transform duration-300 group-hover:scale-105 object-cover"
            style={{ backgroundImage: `url("${image}")` }}
          />
          <div className="p-3 sm:p-4 md:p-6 sm:flex-1">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-white">{city}</h3>
            <p className="text-xs sm:text-sm text-gray-200 mt-1">{date}</p>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2 line-clamp-3 sm:line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const UpcomingTripCard = ({ city, date, daysLeft, image }) => (
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-102 animate-fade-in">
      <div
        className="h-16 sm:h-20 w-16 sm:w-20 flex-shrink-0 rounded-lg bg-cover bg-center transition-transform duration-300 hover:scale-110 object-cover"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="flex-grow">
        <p className="text-xs sm:text-sm text-orange-400 font-medium">{daysLeft} days left</p>
        <p className="font-bold text-base sm:text-lg text-white">{city}</p>
        <p className="text-xs sm:text-sm text-gray-200">{date}</p>
        <button className="mt-2 rounded-lg bg-teal-500/20 px-3 py-1 text-xs sm:text-sm font-bold text-teal-400 hover:bg-teal-500/30 transition-colors duration-300">
          Edit
        </button>
      </div>
    </div>
  );

  const WishlistCard = ({ city, country, image }) => (
    <div className="group relative overflow-hidden rounded-xl bg-white/10 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in">
      <div
        className="h-32 sm:h-40 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110 object-cover"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 p-3 sm:p-4 text-white">
        <p className="font-bold text-base sm:text-lg">{city}</p>
        <p className="text-xs sm:text-sm">{country}</p>
      </div>
    </div>
  );

  const SettingsCard = ({ label }) => (
    <div className="flex items-center justify-between rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 hover:bg-gray-800/70 animate-fade-in">
      <span className="text-sm sm:text-base text-white font-medium">{label}</span>
      <span className="material-symbols-outlined text-teal-400 text-lg sm:text-xl">
        chevron_right
      </span>
    </div>
  );

  const Footer = () => (
    <footer className="sticky bottom-0 bg-black/80 backdrop-blur-lg border-t border-teal-500/50 shadow-lg shadow-teal-500/20">
      <nav className="flex justify-around py-3 sm:py-4">
        {['home', 'explore', 'bookmark', 'person'].map((icon) => (
          <button
            key={icon}
            className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-colors duration-300 ${
              icon === 'person' ? 'text-teal-500' : 'text-gray-200 hover:text-teal-400'
            } focus:outline-none focus:ring-2 focus:ring-teal-500`}
            aria-label={`Navigate to ${icon}`}
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">{icon}</span>
            <span className="text-xs sm:text-sm font-medium capitalize">{icon}</span>
          </button>
        ))}
      </nav>
      <div style={{ height: 'env(safe-area-inset-bottom)' }} />
    </footer>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col font-display text-white">
      <Header />

      {/* Edge-to-edge main to avoid big side gaps */}
      <main className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12 flex-grow">
        <div className="max-w-7xl mx-auto">
          <ProfileCard />
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto w-full">
          <StatsCard value="25" label="Trips" />
          <StatsCard value="3" label="Upcoming" />
          <StatsCard value="12" label="Wishlist" />
          <StatsCard value="4.8★" label="Ratings" />
        </section>

        <section className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Social Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              onClick={() => setShowFollowersModal(true)}
              aria-label="View followers"
            >
              <span className="text-base sm:text-lg font-bold text-teal-400">
                {socialActivity.followers.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-200">Followers</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-white/10 dark:bg-gray-900/30 p-3 sm:p-4 border border-teal-500/30 backdrop-blur-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              onClick={() => setShowFollowingModal(true)}
              aria-label="View following"
            >
              <span className="text-base sm:text-lg font-bold text-teal-400">
                {socialActivity.following.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-200">Following</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {socialActivity.posts.map((post) => (
              <SocialActivityCard key={post.id} {...post} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Travel History</h2>
          <div className="space-y-4 sm:space-y-6">
            {travelHistory.map((trip, index) => (
              <TravelHistoryCard
                key={index}
                {...trip}
                isLast={index === travelHistory.length - 1}
              />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Upcoming Trips</h2>
          <div className="space-y-4 sm:space-y-6">
            {upcomingTrips.map((trip, index) => (
              <UpcomingTripCard key={index} {...trip} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Wishlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlist.map((item, index) => (
              <WishlistCard key={index} {...item} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Settings</h2>
          <div className="space-y-3 sm:space-y-4">
            <SettingsCard label="Account" />
            <SettingsCard label="Notifications" />
            <SettingsCard label="Payment Preferences" />
          </div>
        </section>
      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-thin">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Edit Profile</h3>
            <div className="space-y-4 sm:space-y-6">
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                aria-label="Name"
              />
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                aria-label="Bio"
              />
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                aria-label="Location"
              />
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Profile Image URL"
                value={profileData.profileImage}
                onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                aria-label="Profile image URL"
              />
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Cancel editing profile"
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
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

      {showFollowersModal && (
        <SocialModal
          title="Followers"
          users={socialActivity.followers}
          onClose={() => setShowFollowersModal(false)}
        />
      )}
      {showFollowingModal && (
        <SocialModal
          title="Following"
          users={socialActivity.following}
          onClose={() => setShowFollowingModal(false)}
        />
      )}

      <Footer />

      {/* Logout confirm modal + toast */}
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
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #14b8a6; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background-color: #1f2937; }
        @media (max-width: 640px) { .scrollbar-thin::-webkit-scrollbar { width: 4px; } }
      `}</style>
    </div>
  );
};

export default ProfilePage;
