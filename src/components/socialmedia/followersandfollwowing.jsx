import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setMessageandProfileViewid } from '../actioncreate';

const BLACK_DATA_URI_48 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='48' height='48' fill='black'/></svg>";

export default function ConnectionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState("followers");
  const [followedUser, setFollowedUser] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [followingUserData, setFollowingUserData] = useState([]);
  const [loading, setLoading] = useState({
    followers: false,
    following: false,
    suggestions: false
  });
  const token = localStorage.getItem("access_token");

  // Keep token in sync once on mount
  useEffect(() => {
    const current = localStorage.getItem("access_token") || "";
    if (current !== token) {
      setToken(current);
    }
  }, []);

  // Fetch data functions
  const fetchUserProfiles = async () => {
    if (!token) return;
    setLoading(prev => ({ ...prev, suggestions: true }));
    try {
      const res = await axios.get("http://127.0.0.1:8002/GetAllProfileAPIview/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfiles(res.data || []);
    } catch (error) {
      console.error("Failed to load suggestions:", error?.message || error);
      setUserProfiles([]);
    } finally {
      setLoading(prev => ({ ...prev, suggestions: false }));
    }
  };

  const fetchFollowedUser = async () => {
    if (!token) return;
    setLoading(prev => ({ ...prev, followers: true }));
    try {
      const res = await axios.get("http://127.0.0.1:8003/FolloweListView/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowedUser(res.data || []);
    } catch (error) {
      console.error("Failed to load followers:", error?.message || error);
      setFollowedUser([]);
    } finally {
      setLoading(prev => ({ ...prev, followers: false }));
    }
  };

  const fetchFollowingUser = async () => {
    if (!token) return;
    setLoading(prev => ({ ...prev, following: true }));
    try {
      const res = await axios.get("http://127.0.0.1:8003/FollowingListView/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingUserData(res.data || []);
    } catch (error) {
      console.error("Failed to load following list:", error?.message || error);
      setFollowingUserData([]);
    } finally {
      setLoading(prev => ({ ...prev, following: false }));
    }
  };

  // Fetch all data
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      if (!token || ignore) return;
      try {
        await Promise.all([
          fetchUserProfiles(),
          fetchFollowedUser(),
          fetchFollowingUser()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [token]);

  // Follow user with proper event handling
  const followUser = async (following_id, event) => {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
    }
    
    if (!token) return;
    try {
      await axios.post(
        "http://127.0.0.1:8003/FollowUser/",
        { following_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Refresh the relevant data
      if (mode === "suggestions") {
        fetchFollowingUser();
      }
    } catch (error) {
      console.error("Follow error:", error?.response?.data || error?.message || error);
    }
  };

  // Unfollow user with proper event handling
  const unfollowUser = async (following_id, event) => {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
    }
    
    if (!token) return;
    try {
      await axios.delete("http://127.0.0.1:8003/UnfollowUser/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { following_id },
      });
      
      // Update local state immediately for better UX
      setFollowingUserData(prev => 
        Array.isArray(prev) ? prev.filter(u => (u.user_id || u.id) !== following_id) : []
      );
    } catch (error) {
      console.error("Unfollow error:", error?.response?.data || error?.message || error);
    }
  };

  // Navigation handlers with event propagation control
  const handleProfileClick = (userId, event) => {
    if (event) {
      event.stopPropagation();
    }
    dispatch(setMessageandProfileViewid(userId)); 
    navigate('/ProfileOnly');           
  };

  const handleMessageClick = (userId, event) => {
    if (event) {
      event.stopPropagation();
    }
    dispatch(setMessageandProfileViewid(userId)); 
    navigate('/DirectMessagesUI');
  };

  // Safe data handling function
  const safeRender = (value, defaultValue = "") => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Get current dataset based on mode
  const dataset = useMemo(() => {
    switch (mode) {
      case "followers":
        return followedUser;
      case "following":
        return followingUserData;
      case "suggestions":
        return userProfiles;
      default:
        return [];
    }
  }, [mode, followedUser, followingUserData, userProfiles]);

  // Common button component to ensure consistency
  const ActionButton = ({ onClick, children, variant = "primary", ...props }) => {
    const baseClasses = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50";
    
    const variants = {
      primary: "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-900/30 hover:from-fuchsia-700 hover:to-pink-700",
      secondary: "bg-[#1a2030] text-slate-200 ring-1 ring-white/10 hover:bg-[#252b3d]",
      danger: "text-red-200 bg-red-900/30 ring-1 ring-red-400/30 hover:bg-red-900/40"
    };

    return (
      <button
        {...props}
        className={`${baseClasses} ${variants[variant]}`}
        onClick={(e) => {
          e.stopPropagation(); // Always stop propagation for buttons
          if (onClick) onClick(e);
        }}
      >
        {children}
      </button>
    );
  };

  // List components with proper event handling
  const List1 = ({ items }) => (
    <main className="max-w-5xl mx-auto px-4 mt-6 space-y-4 pb-16">
      {items.map((p) => {
        const safeUser = {
          ...p,
          name: safeRender(p.name, "Unknown User"),
          handle: safeRender(p.handle, "@unknown"),
          bio: safeRender(p.bio, ""),
          user_id: p.user_id || p.id
        };

        return (
          <article
            key={safeUser.user_id}
            onClick={(e) => handleProfileClick(safeUser.user_id, e)}
            className="flex items-center justify-between rounded-2xl bg-[#101522] p-4 ring-1 ring-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] cursor-pointer hover:bg-[#1a2030] transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={safeUser?.profile_picture ? `http://127.0.0.1:8002/${safeUser.profile_picture}` : BLACK_DATA_URI_48}
                alt={safeUser.name}
                className="h-12 w-12 rounded-full ring-2 ring-fuchsia-500/30 object-cover bg-black"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = BLACK_DATA_URI_48;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold leading-5 truncate">{safeUser.name}</h3>
                <p className="text-xs text-slate-400 truncate">{safeUser.handle}</p>
                <p className="mt-1 text-sm text-slate-300 line-clamp-2">{safeUser.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
              <ActionButton
                onClick={(e) => followUser(safeUser.user_id, e)}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                Follow
              </ActionButton>

              <ActionButton
                onClick={(e) => handleMessageClick(safeUser.user_id, e)}
              >
                Message
              </ActionButton>
            </div>
          </article>
        );
      })}
      {items.length === 0 && !loading.followers && (
        <div className="text-center py-8 text-slate-400">
          No followers found
        </div>
      )}
      {loading.followers && (
        <div className="text-center py-8 text-slate-400">
          Loading followers...
        </div>
      )}
    </main>
  );

  const List2 = ({ items }) => (
    <main className="max-w-5xl mx-auto px-4 mt-6 space-y-4 pb-16">
      {items.map((p) => {
        const safeUser = {
          ...p,
          name: safeRender(p.name, "Unknown User"),
          handle: safeRender(p.handle, "@unknown"),
          bio: safeRender(p.bio, ""),
          user_id: p.user_id || p.id
        };

        const imgSrc = safeUser?.profile_picture ? `http://127.0.0.1:8002/${safeUser.profile_picture}` : BLACK_DATA_URI_48;

        return (
          <article
            key={safeUser.user_id}
            onClick={(e) => handleProfileClick(safeUser.user_id, e)}
            className="flex items-center justify-between rounded-2xl bg-[#101522] p-4 ring-1 ring-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] cursor-pointer hover:bg-[#1a2030] transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={imgSrc}
                alt={safeUser.name}
                className="h-12 w-12 rounded-full ring-2 ring-fuchsia-500/30 object-cover bg-black"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = BLACK_DATA_URI_48;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold leading-5 truncate">{safeUser.name}</h3>
                <p className="text-xs text-slate-400 truncate">{safeUser.handle}</p>
                <p className="mt-1 text-sm text-slate-300 line-clamp-2">{safeUser.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
              <ActionButton
                onClick={(e) => handleMessageClick(safeUser.user_id, e)}
              >
                Message
              </ActionButton>

              <ActionButton
                variant="danger"
                onClick={(e) => unfollowUser(safeUser.user_id, e)}
                title="Remove this follower"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-red-400/90" />
                Remove
              </ActionButton>
            </div>
          </article>
        );
      })}
      {items.length === 0 && !loading.following && (
        <div className="text-center py-8 text-slate-400">
          Not following anyone yet
        </div>
      )}
      {loading.following && (
        <div className="text-center py-8 text-slate-400">
          Loading following list...
        </div>
      )}
    </main>
  );

  const List3 = ({ items }) => (
    <main className="max-w-5xl mx-auto px-4 mt-6 space-y-4 pb-16">
      {items.map((p) => {
        const safeUser = {
          ...p,
          name: safeRender(p.name, "Unknown User"),
          handle: safeRender(p.handle, "@unknown"),
          bio: safeRender(p.bio, ""),
          user_id: p.user_id || p.id
        };

        const imgSrc = safeUser?.profile_picture ? `http://127.0.0.1:8002/${safeUser.profile_picture}` : BLACK_DATA_URI_48;

        return (
          <article
            key={safeUser.user_id}
            onClick={(e) => handleProfileClick(safeUser.user_id, e)}
            className="flex items-center justify-between rounded-2xl bg-[#101522] p-4 ring-1 ring-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] cursor-pointer hover:bg-[#1a2030] transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={imgSrc}
                alt={safeUser.name}
                className="h-12 w-12 rounded-full ring-2 ring-fuchsia-500/30 object-cover bg-black"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = BLACK_DATA_URI_48;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold leading-5 truncate">{safeUser.name}</h3>
                <p className="text-xs text-slate-400 truncate">{safeUser.handle}</p>
                <p className="mt-1 text-sm text-slate-300 line-clamp-2">{safeUser.bio}</p>
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              {safeUser.following ? (
                <ActionButton variant="secondary" disabled>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  Following
                </ActionButton>
              ) : (
                <ActionButton
                  onClick={(e) => followUser(safeUser.user_id, e)}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                  Follow
                </ActionButton>
              )}
            </div>
          </article>
        );
      })}
      {items.length === 0 && !loading.suggestions && (
        <div className="text-center py-8 text-slate-400">
          No suggestions available
        </div>
      )}
      {loading.suggestions && (
        <div className="text-center py-8 text-slate-400">
          Loading suggestions...
        </div>
      )}
    </main>
  );

  // Dynamic counts for badges
  const followersCount = followedUser.length;
  const followingCount = followingUserData.length;
  const suggestionsCount = userProfiles.length;

  return (
    <div className="min-h-screen bg-[#0b0d13] text-slate-200">
      {/* Page header */}
      <header className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Connections</h1>
      </header>

      {/* Search bar */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="w-full rounded-xl bg-[#121826] ring-1 ring-white/5">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-transparent px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="inline-flex gap-2 rounded-xl bg-[#121826] p-2 ring-1 ring-white/5">
          <button
            onClick={() => setMode("followers")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              mode === "followers"
                ? "bg-[#0f1422] text-white ring-1 ring-fuchsia-500/40 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Followers
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#1b2030] px-1.5 text-xs text-slate-400">
              {followersCount}
            </span>
          </button>

          <button
            onClick={() => setMode("following")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              mode === "following"
                ? "bg-[#0f1422] text-white ring-1 ring-fuchsia-500/40 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Following
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#1b2030] px-1.5 text-xs text-slate-400">
              {followingCount}
            </span>
          </button>

          <button
            onClick={() => setMode("suggestions")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              mode === "suggestions"
                ? "bg-[#0f1422] text-white ring-1 ring-fuchsia-500/40 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Suggestions
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#1b2030] px-1.5 text-xs text-slate-400">
              {suggestionsCount}
            </span>
          </button>
        </div>
      </div>

      {/* List: render exactly one section by mode */}
      {mode === "followers" && <List1 items={dataset} />}
      {mode === "following" && <List2 items={dataset} />}
      {mode === "suggestions" && <List3 items={dataset} />}
    </div>
  );
}