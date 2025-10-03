import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WeatherCard from "./WeatherCard";
import axios from "axios";

export default function HomeSide() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  // Profile + modal states
  const [profileData, setProfileData] = useState({
    name: "",
    contact_number: "",
    bio: "",
    location: "",
    gender: "",
    date_of_birth: "",
    social_links: "",
    profile_picture: "", // string URL or File
    cover_photo: "", // string URL or File
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Gate that triggers profile completion modal for new/empty profiles
  const [addressBool, setAddressBool] = useState(false);

  // Fetch profile
  const fetchProfile = useCallback(async (token) => {
    try {
      const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res?.data) {
        setProfileData((p) => ({ ...p, ...res.data }));
        // Decide if modal should show. Here: show when name is missing.
        setAddressBool(!res.data?.name);
      } else {
        setAddressBool(true);
      }
    } catch (err) {
      console.log("Profile fetch error:", err?.response?.data || err?.message);
      // If unauthorized or error, force modal to help fill data later
      setAddressBool(true);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchProfile(accessToken);
    }
  }, [accessToken, fetchProfile]);

  // Navigation
  const goToDashboard = (value = null) => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/RegistrationForm");

    if (value === "Experience") navigate("/ExperienceSide");
    else if (value === "Expense") console.log("Expense");
    else if (value === "CustomizePlace") console.log("CustomizePlace");
    else navigate("/RegistrationForm");
  };

  // Data
  const destinations = [
    {
      name: "Paris, France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      description: "Experience the romance of the Eiffel Tower and charming cafes.",
      rating: 4.8,
      review: "A magical city! The food and culture were unforgettable.",
    },
    {
      name: "Tokyo, Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      description: "Discover vibrant city life and serene temples.",
      rating: 4.7,
      review: "Loved the blend of tradition and modernity!",
    },
    {
      name: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
      description: "Explore the city that never sleeps.",
      rating: 4.6,
      review: "The energy of NYC is unmatched!",
    },
  ];

  const userPosts = [
    {
      userName: "Emma Traveler",
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      timestamp: "2 days ago",
      content:
        "Had an amazing time in Santorini! The AI planner made it so easy to explore the island’s beauty. Highly recommend! #travel #santorini",
      postImage:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5db?auto=format&fit=crop&w=800&q=80",
    },
    {
      userName: "John Explorer",
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      timestamp: "1 week ago",
      content:
        "The budget optimization feature saved me hundreds in Bali! Perfect trip, amazing beaches. #bali #travelai",
      postImage:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    },
    {
      userName: "Sarah Wanderlust",
      profileImage:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80",
      timestamp: "3 days ago",
      content:
        "Loved the AI recommendations for Rome. Perfect itinerary for a week of adventure! #rome #travel",
      postImage:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Animated headline shapes
  const letters = [
    {
      path: "M 12 4 H 52 V 12 H 36 V 60 H 28 V 12 H 12 Z",
      gradientId: "gradient1",
      animationClass:
        "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 4 V 60 M 12 4 H 40 Q 52 4 52 16 V 20 Q 52 32 40 32 H 12 M 32 32 L 52 60",
      gradientId: "gradient2",
      animationClass:
        "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
    },
    {
      path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
      gradientId: "gradient3",
      animationClass:
        "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 4 L 32 60 L 52 4",
      gradientId: "gradient4",
      animationClass:
        "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 4 V 60 H 52 M 12 32 H 44 M 12 4 H 52",
      gradientId: "gradient5",
      animationClass:
        "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
    },
    {
      path: "M 12 4 V 60 H 52",
      gradientId: "gradient1",
      animationClass:
        "animate-[dashArray_3s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 12 60 L 32 4 L 52 60 M 22 36 H 42",
      gradientId: "gradient2",
      animationClass:
        "animate-[spinDashArray_3s_ease-in-out_infinite,spin_8s_ease-in-out_infinite,dashOffset_3s_linear_infinite]",
    },
    {
      path: "M 20 4 H 44 M 32 4 V 60 M 20 60 H 44",
      gradientId: "gradient3",
      animationClass:
        "animate-[dashArray_2.5s_ease-in-out_infinite,dashOffset_2.5s_linear_infinite,pulse_4s_ease-in-out_infinite]",
    },
  ];

  function Letter({ path, gradientId, animationClass }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="8"
          stroke={`url(#${gradientId})`}
          d={path}
          className={animationClass}
          pathLength="360"
        />
      </svg>
    );
  }

  function GradientDefs() {
    return (
      <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
        <defs>
          <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient1">
            <stop stopColor="#973BED" />
            <stop stopColor="#007CFF" offset="1" />
          </linearGradient>
          <linearGradient y2="0" x2="0" y1="64" x1="0" id="gradient2">
            <stop stopColor="#FFC800" />
            <stop stopColor="#F0F" offset="1" />
            <animateTransform
              repeatCount="indefinite"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
              keyTimes="0; 0.25; 0.5; 0.75; 1"
              dur="8s"
              values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
              type="rotate"
              attributeName="gradientTransform"
            />
          </linearGradient>
          <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient3">
            <stop stopColor="#00E0ED" />
            <stop stopColor="#00DA72" offset="1" />
          </linearGradient>
          <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient4">
            <stop stopColor="#FF6B6B" />
            <stop stopColor="#4ECDC4" offset="1" />
          </linearGradient>
          <linearGradient y2="2" x2="0" y1="62" x1="0" id="gradient5">
            <stop stopColor="#A8E6CF" />
            <stop stopColor="#FFD93D" offset="1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  function TextSection() {
    return (
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-400 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
          Your AI-Powered Travel Companion
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-pulse">
          Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
        </p>
        <button
          onClick={() => goToDashboard("Experience")}
          className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
          aria-label="Get started with TravelAI experience"
        >
          Get Started
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    );
  }

  
  const handleCreateProfile = async () => {
    try {
      const token = accessToken || localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const form = new FormData();
      const maybeAppend = (k, v) => {
        if (v !== undefined && v !== null && v !== "") form.append(k, v);
      };

      maybeAppend("name", profileData.name);
      maybeAppend("contact_number", profileData.contact_number);
      maybeAppend("bio", profileData.bio);
      maybeAppend("location", profileData.location);
      maybeAppend("gender", profileData.gender);
      maybeAppend("date_of_birth", profileData.date_of_birth);

      if (profileData.social_links) {
        if (typeof profileData.social_links === "object") {
          form.append("social_links", JSON.stringify(profileData.social_links));
        } else {
          form.append("social_links", profileData.social_links);
        }
      }

      if (profileData.cover_photo instanceof File) {
        form.append("cover_photo", profileData.cover_photo);
      }
      if (profileData.profile_picture instanceof File) {
        form.append("profile_picture", profileData.profile_picture);
      }

      const res = await axios.post("http://127.0.0.1:8002/ProfileAPIView/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Profile updated", res.data);
      // setShowEditModal(false);
      setAddressBool(false);
      fetchProfile(token); // refresh to get final URLs
    } catch (err) {
      console.error("Update error:", err?.response?.status, err?.response?.data || err?.message);
    }
  };

  // Helpers
  const heroBg =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80";

  const ratingStars = useMemo(
    () => [...Array(5)].map((_, i) => i),
    []
  );

  return (
    <div className="min-h-screen bg-black font-sans transition-colors duration-500 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-500 dark:text-teal-400">TravelAI</h1>
          <div className="text-sm text-gray-200 dark:text-gray-100">
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroBg}")` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="flex gap-1 drop-shadow-lg">
            <GradientDefs />
            {letters.map((letter, idx) => (
              <div key={idx} className={idx === 6 ? "w-2" : ""}>
                <Letter {...letter} />
              </div>
            ))}
          </div>
          <TextSection />
        </div>
      </section>

      {/* Social feed */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">User Experiences</h3>
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
            {userPosts.map((post, idx) => (
              <div
                key={idx}
                className="flex-none w-80 sm:w-96 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center"
              >
                <div className="relative">
                  <div className="border border-teal-500/50 dark:border-teal-400/50 rounded-lg overflow-hidden">
                    <img
                      src={post.postImage}
                      alt={post.userName}
                      className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={post.profileImage}
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-400/30"
                          alt="Profile"
                        />
                        <div>
                          <p className="text-sm font-bold text-white">{post.userName}</p>
                          <p className="text-xs text-gray-200">{post.timestamp}</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-medium rounded-lg shadow shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
                  <div className="flex space-x-8">
                    <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 transform hover:scale-110 transition-transform duration-200 fill-current text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 5-8 12.5-8 12.5z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">54.1K</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 transform hover:scale-110 transition-transform duration-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">173</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 transform hover:scale-110 transition-transform duration-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 12v.01M12 20v.01M20 12v.01M12 4v.01M7.05 7.05l9.9 9.9M16.95 7.05l-9.9 9.9"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">173</span>
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-200">26.9K views</span>
                </div>

                <div className="px-4 sm:px-5 pb-4">
                  <p className="text-sm text-white line-clamp-3">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">Top Destinations</h3>
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory scrollbar-hidden">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="flex-none w-80 sm:w-96 bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 snap-center"
              >
                <div className="border border-teal-500/50 dark:border-teal-400/50 rounded-t-xl overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-semibold text-white">{dest.name}</h4>
                  <p className="text-sm text-gray-200 mt-2 line-clamp-2">{dest.description}</p>
                  <div className="flex items-center mt-3">
                    <div className="flex text-yellow-400">
                      {ratingStars.map((i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(dest.rating) ? "fill-current" : "fill-none stroke-current"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354l2.094 4.237 4.684.682-3.39 3.305.8 4.662L12 15.354l-4.188 2.086.8-4.662-3.39-3.305 4.684-.682L12 4.354z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-200">{dest.rating}</span>
                  </div>
                  <p className="text-sm italic text-gray-300 mt-3">"{dest.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            Why Choose TravelAI?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Personalized Itineraries",
                text: "Tailored travel plans designed just for you.",
              },
              {
                title: "Budget Optimization",
                text: "Save money with smart travel planning.",
              },
              {
                title: "AI Recommendations",
                text: "Discover the best destinations with AI insights.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center"
              >
                <h4 className="text-xl font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-gray-200">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Explore?</h3>
          <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Start your journey with TravelAI and make every trip unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => goToDashboard("Experience")}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Experience
            </button>
            <button
              onClick={() => goToDashboard("Expense")}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Expense
            </button>
            <button
              onClick={() => goToDashboard("CustomizePlace")}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Customize Place
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/15 dark:bg-gray-900/20 backdrop-blur-lg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-200">TravelAI © 2025 - Made with ❤️ for travelers</p>
        </div>
      </footer>

      {/* Profile completion modal */}
      {(addressBool) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hidden">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Create Profile</h3>
            <div className="space-y-4 sm:space-y-6">
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Name"
                value={profileData.name || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                aria-label="Name"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Contact number"
                value={profileData.contact_number || ""}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, contact_number: e.target.value }))
                }
                aria-label="Contact number"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Bio"
                value={profileData.bio || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                aria-label="Bio"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Location"
                value={profileData.location || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
                aria-label="Location"
              />

              <label className="block">
                <select
                  className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white transition-all duration-300"
                  value={profileData.gender || ""}
                  onChange={(e) => setProfileData((p) => ({ ...p, gender: e.target.value }))}
                  aria-label="Gender"
                >
                  <option className="bg-slate-900" value="">
                    Select gender
                  </option>
                  <option className="bg-slate-900" value="M">
                    Male
                  </option>
                  <option className="bg-slate-900" value="F">
                    Female
                  </option>
                  <option className="bg-slate-900" value="O">
                    Other
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm text-white/80 mb-1">Cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Cover image file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProfileData((p) => ({ ...p, cover_photo: file }));
                  }}
                  className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </label>

              <label className="block">
                <span className="block text-sm text-white/80 mb-1">Profile image</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Profile image file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProfileData((p) => ({ ...p, profile_picture: file }));
                  }}
                  className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </label>

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Date of birth"
                type="date"
                value={profileData.date_of_birth || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, date_of_birth: e.target.value }))}
                aria-label="Date of birth"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                type="url"
                inputMode="url"
                placeholder="LinkedIn, YouTube, etc."
                value={typeof profileData.social_links === "string" ? profileData.social_links : ""}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, social_links: e.target.value }))
                }
                aria-label="Social links URL"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300"
                  onClick={() => {
                    // setShowEditModal(false);
                    setAddressBool(false);
                  }}
                  aria-label="Cancel editing profile"
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
                  onClick={handleCreateProfile}
                  aria-label="Save profile changes"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline utilities only (no separate CSS file) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .animate-fade-in { animation: fadeIn .5s ease-in-out; }
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .scrollbar-thin::-webkit-scrollbar{height:8px}
        .scrollbar-thin::-webkit-scrollbar-thumb{background-color:#14b8a6;border-radius:4px}
        .scrollbar-thin::-webkit-scrollbar-track{background-color:#e5e7eb}
        .dark .scrollbar-thin::-webkit-scrollbar-track{background-color:#374151}
      `}</style>
    </div>
  );
}
