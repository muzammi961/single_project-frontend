import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AutherazedUserId } from "../actioncreate";
import '../stylecomponent/wetherstyle.css'
import '../stylecomponent/hometitletext.css'
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

  return <div className="text-sm text-white font-medium">{time}</div>;
};

// WeatherDisplay component (styled like the image)
const WeatherDisplay = () => {
  const navigate = useNavigate();
  return (
<div className="container" onClick={()=>navigate('/WeatherCard')}>
  <div className="cloud front">
    <span className="left-front"></span>
    <span className="right-front"></span>
  </div>
  <span className="sun sunshine"></span>
  <span className="sun"></span>
  <div className="cloud back">
    <span className="left-back"></span>
    <span className="right-back"></span>
  </div>
</div>
  );
};

export default function HomeSide() {
const PathFinderLoader = ({ size = 64, label = "PathFinder loading" }) => {
  const style = { height: size, width: size };

}


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  const [experiences, setExperiences] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [privatedatas,SetPrivatedatas]=useState({})

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



    // const getprivatefunc= async () => {
    //   try {
    //     const res = await axios.get("http://127.0.0.1:8006/Getprivatedata/");
    //     SetPrivatedatas(res.data)
    //   } catch (error) {
    //     console.error("Error fetching experiences:", error);
    //   }
    // };





    // getprivatefunc();
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

  // Hero background
  const heroBg =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80";

  // Sub-components
  const TextSection = () => (
    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-black">
        Your AI-Powered Travel Companion
      </h2>
      <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto mb-8">
        Plan personalized trips, optimize the budget, and create unforgettable itineraries with TravelAI.
      </p>
      <button
        onClick={() => goToDashboard("Experience")}
        className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
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
    <div className="bg-gray-100 rounded-xl shadow-lg shadow-gray-300 hover:shadow-gray-400 transition-all duration-300 p-6 text-center">
      <h4 className="text-xl font-semibold text-black mb-2">{feature.title}</h4>
      <p className="text-black">{feature.text}</p>
    </div>
  );

  const ExperienceCard = ({ experience }) => {
    const navigate = useNavigate();
    const profile = profiles[experience.user_id];
    const userName = profile ? (profile.name || 'Unknown User') : 'Unknown User';
    const profilePicSrc = profile && profile.profile_picture 
      ? `http://127.0.0.1:8002${profile.profile_picture}` 
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?format&fit=crop&w=100&q=80";
    
    let mediaElement;
    if (experience.video) {
      const videoSrc = `http://127.0.0.1:8004${experience.video}`;
      mediaElement = (
        <video 
          src={videoSrc} 
          className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
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
          className="w-full h-96 object-cover transition-transform  ease-in-out group-hover:scale-110"
        />
      );
    } else {
      mediaElement = (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 animate-pulse">
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/70 to-transparent"></div>
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    <div className="min-h-screen bg-white font-sans transition-colors duration-500 text-black">
      {/* Inline styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-in {
          from { 
            transform: translateY(-100px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
        .animate-slide-in {
          animation: slide-in 1s ease-out forwards;
        }
        @keyframes pathfinder {
          0% {
            clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
            opacity: 0;
          }
          50% {
            clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
            opacity: 0.5;
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            opacity: 1;
          }
        }
        .animate-pathfinder {
          animation: pathfinder 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-500 shadow-sm border-b border-b-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">PathFinder</h1>
            <TimeDisplay className="flex flex-col items-end space-y-1"/>
          <WeatherDisplay className="absolute top-20 right-4 z-10 flex" />
        </div>
          
      </header>
 
      {/* Hero */}
      
      <section className="relative min-h-screen flex items-center justify-center bg-white">
       
        <div className="min-h-screen flex flex-col items-center justify-center">
  
          <div className="w-full max-w-4xl h-64 bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-8 animate-slide-in" 
                style={{ 
                 backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80")`
               }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>
          <TextSection />
        </div>
      </section>

      {/* Recent Travel Experiences */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">Recent Travel Experiences</h3>
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
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-black text-center mb-8">
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
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-black mb-4">Ready to Explore?</h3>
          <p className="text-lg text-black max-w-xl mx-auto mb-8">
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
      <footer className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-black">TravelAI © 2025 - Made with ❤️ for travelers</p>
        </div>
      </footer>
    </div>
  );
}