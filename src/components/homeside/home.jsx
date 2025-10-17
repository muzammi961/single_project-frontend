import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AutherazedUserId } from "../actioncreate";

// Separate TimeDisplay component to avoid re-renders in parent
const TimeDisplay = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const updateTime = () => {
      const today = new Date();
      const dayName = days[today.getDay()];
      const day = String(today.getDate()).padStart(2, "0");
      const monthName = months[today.getMonth()];
      const year = today.getFullYear();
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");
      setTime(`${dayName}, ${day}-${monthName}-${year} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className="text-sm text-gray-200">{time}</div>;
};

// WeatherDisplay component (hardcoded based on provided image)
const WeatherDisplay = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 flex items-center space-x-2 min-w-0 flex-1 mr-4" onClick={()=>navigate('/WeatherCard')}>
      <div className="text-xs text-gray-300 truncate">Hongkong</div>
      <div className="flex items-center space-x-1">
        <svg
          className="w-4 h-4 text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
        <div className="text-xs text-blue-300">24°</div>
      </div>
      <div className="text-xs text-gray-400 ml-auto">09:30 - 03:08</div>
    </div>
  );
};

export default function HomeSide() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  const [experiences, setExperiences] = useState([]);
  const [profiles, setProfiles] = useState({});

  // Fetch profile and dispatch user ID
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(AutherazedUserId(res.data.user_id));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token, dispatch]);

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
        console.log(profileMap)
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
      try {
        const res = await axios.get("http://127.0.0.1:8004/TravelExperienceListAPIViewbypage/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExperiences(res.data.results || []);
        console.log(res.data.results)
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    fetchExperiences();
  }, [token]);

  // Navigation handler
  const goToDashboard = (value = null) => {
    const access_token =localStorage.getItem("access_token");
    const refreshtoken = localStorage.getItem("refresh_token");
    if (!access_token&&!refreshtoken) {

      return navigate("/RegistrationForm");
    }else{
    console.log('asdfasdfasdfhiiiiii')
    switch (value) {
      case "Experience":
        navigate("/ExperienceSide");
        break;
      case "Expense":
        navigate("/ExpenseSide"); 
        break;
      case "CustomizePlace":
        navigate("/CustomizePlaceSide"); 
        break;
      default:
        navigate("/RegistrationForm");
    }


  }
  };

  const features = useMemo(
    () => [
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
    ],
    []
  );

  // Animated headline letters data
  const letters = useMemo(
    () => [
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
    ],
    []
  );

  // Hero background
  const heroBg =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80";

  // Sub-components
  const Letter = ({ path, gradientId, animationClass }) => (
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
        pathLength="1"
      />
    </svg>
  );

  const GradientDefs = () => (
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

  const TextSection = () => (
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
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );

  const FeatureCard = ({ feature }) => (
    <div className="bg-white/15 backdrop-blur-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 p-6 text-center">
      <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
      <p className="text-gray-200">{feature.text}</p>
    </div>
  );

  const ExperienceCard = ({ experience }) => {
    const navigate = useNavigate();
    const profile = profiles[experience.user_id];
    const userName = profile ? (profile.name || 'Unknown User') : 'Unknown User';
    const profilePicSrc = profile && profile.profile_picture 
      ? `http://127.0.0.1:8002${profile.profile_picture}` 
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?=format&fit=crop&w=100&q=80";
    
    let mediaElement;
    if (experience.video) {
      const videoSrc = `http://127.0.0.1:8004${experience.video}`;
      mediaElement = (
        <video 
          src={videoSrc} 
          className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
          muted
          loop
          preload="metadata"
          autoPlay  
        />
      );
    } else if (experience.image) {
      const imgSrc = `http://127.0.0.1:8004${experience.image}`;
      mediaElement = (
        <img 
          src={imgSrc} 
          alt={experience.title || experience.place_name}
          className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      );
    } else {
      mediaElement = (
        <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-gray-500">
          No Media Available
        </div>
      );
    }

    const visitDate = new Date(experience.date_of_visit);
    const formattedDate = visitDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    return (
      <div className="flex-shrink-0 w-80 snap-center group">
        <div className="relative overflow-hidden rounded-xl">
          {mediaElement}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <div className="flex items-center mb-2">
              <img
                src={profilePicSrc}
                alt={`${userName}'s profile`}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-bold">{userName}</p>
                <p className="text-xs">{formattedDate}</p>
              </div>
            </div>
            <p className="text-sm">{experience.description}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors duration-200"
              onClick={() => navigate(`/experience/${experience.id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black font-sans transition-colors duration-500 text-white">
      {/* Inline styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .animate-fade-in { animation: fadeIn .5s ease-in-out; }
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/15 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-500">TravelAI</h1>
          <div className="flex items-center space-x-4">
            <WeatherDisplay />
            <TimeDisplay />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroBg}")` }}
        >
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

      {/* Recent Travel Experiences */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">Recent Travel Experiences</h3>
          <div className="flex overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hidden">
            <div className="flex flex-row items-start justify-start gap-4">
              {experiences.map((experience, idx) => (
                <ExperienceCard key={idx} experience={experience} />
              ))}
            </div>
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
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
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
      <footer className="bg-white/15 backdrop-blur-lg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-200">TravelAI © 2025 - Made with ❤️ for travelers</p>
        </div>
      </footer>
    </div>
  );
}