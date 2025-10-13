
import { useEffect, useState } from "react";
import axios from 'axios';
const WeatherCard = () => {  
const [time, setTime] = useState(""); 
 useEffect(() => {
    const updateTime = () => {
      const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];  
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








  const [errorMessage, setErrorMessage] = useState("");
  const [useraddressandWether,setUseraddressandWether]=useState([])

   useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

          setErrorMessage("");
          try {
            const token = localStorage.getItem("access_token");
            const res = await axios.post("http://127.0.0.1:8003/SaveUserLocation/",{latitude,longitude},{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setUseraddressandWether(res.data)
            // console.log(res.data);
          } catch (err) {
            console.error("Error saving location:", err);
            setErrorMessage("Failed to send location to server.");
          }
        },
        (error) => {
          // Handle geolocation errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage(
                "Location permission denied. Please enable location services in your browser or device."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMessage(
                "Location information is unavailable. Please ensure your device has location services enabled."
              );
              break;
            case error.TIMEOUT:
              setErrorMessage(
                "Location request timed out. Try again or check your device settings."
              );
              break;
            default:
              setErrorMessage("An unknown error occurred while fetching location.");
          }
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  }, []);






  const locationData = {
    address: "Brooklyn, New York. USA"
  };

  const currentWeather = {
    temperature: 16,
    description: "Storm with Rain",
    wind_speed: "2.4km/h",
    humidity: "70%"
  };

  const forecast = [
    { day: 'Friday', icon: 'thunderstorm', description: 'Cloudy with rain', temp: '18°' },
    { day: 'Saturday', icon: 'wb_sunny', description: 'Sunny', temp: '28°' },
    { day: 'Sunday', icon: 'grain', description: 'Rain', temp: '22°' },
    { day: 'Monday', icon: 'flash_on', description: 'Rain with thunder', temp: '17°' },
    { day: 'Tuesday', icon: 'ac_unit', description: 'Snow', temp: '2°' },
    { day: 'Wednesday', icon: 'cloud', description: 'Cloudy with rain', temp: '12°' }
  ];

  const hourlyTemps = [
    { time: '08:00', temp: '9°', left: '12.5%', mb: '8' },
    { time: '09:00', temp: '12°', left: '20.8%', mb: '12', hasDot: true },
    { time: '10:00', temp: '8°', left: '29.1%', mb: '8' },
    { time: '11:00', temp: '19°', left: '37.4%', mb: '16' },
    { time: '12:00', temp: '25°', left: '45.7%', mb: '20' },
    { time: '13:00', temp: '22°', left: '54%', mb: '18' },
    { time: '14:00', temp: '18°', left: '62.3%', mb: '14' },
    { time: '15:00', temp: '22°', left: '70.6%', mb: '18' }
  ];

  const date = "(Friday, January 4)";

  return (
    <div className="bg-black font-display text-white p-4 sm:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center space-x-2 text-gray-400 w-full sm:w-auto">
            {/* <span className="material-icons text-base">location_on</span> */}
            <span className="text-sm sm:text-base">{useraddressandWether?.address ?? "Loading..."}</span>
            
            {/* <span className="material-icons text-base">expand_more</span> */}
          </div>
          <div className="text-gray-400 text-sm sm:text-base">
             {time}
          </div>
        </header>

        {/* Main */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2 relative">
            <div className="flex items-start">
              <div className="w-full">
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-light tracking-tighter leading-tight">
                  {useraddressandWether?.Weather?.temperature ?? "Loading..."}
                  <span className="align-super text-3xl sm:text-4xl lg:text-5xl">°C</span>
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-400 mt-2">
                    {useraddressandWether?.Weather?.description ?? "Loading..."}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 mt-6 sm:mt-8 text-base sm:text-lg text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-base">air</span>
                    <span className="text-sm sm:text-base">Wind</span>
                    <span className="font-bold text-white">
                        {useraddressandWether?.Weather?.wind_speed ?? "Loading..."}
                      
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-base">thermostat</span>
                    <span className="text-sm sm:text-base">Humidity</span>
                    <span className="font-bold text-white">
                       {useraddressandWether?.Weather?.humidity ?? "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 sm:-top-16 right-0 w-1/2 sm:w-3/4 h-48 sm:h-64 -z-10">
              <img
                alt="Cloudy with lightning"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADOhThah_HvW2p4KAdYJC405rhfpLIaB6d78tnMEh4OLSsYGldmO5iotnFVLnSDEuNWD6beeuMG1TinSQH6XHPJoiyxPkF9UrlAVC9itpuMXz9QLtu3avd9AY5mhTNGFxkDK1HFpngD3Sn6xOdWalbRzY5qjDDVxLws6U8Oje5gqBYGVcPqArxKL9wel18UBEg2l3OT81uWpan1rLyzJ_p3s_RAMKWiBpszWz1rVv12P7d5cx4TGCJ0ju46oWFOcTfoStqxeHDVHPF"
              />
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
            <ul className="space-y-3 sm:space-y-4">
              {forecast.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-base sm:text-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <span className="truncate">{item.day}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-right min-w-0">
                    <span className="text-gray-400 text-sm sm:text-base truncate">{item.description}</span>
                    <span className="font-bold whitespace-nowrap">{item.temp}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>

        {/* Footer: Hourly Forecast */}
        <footer className="mt-[50px]">
          <div className="relative w-full">
            <div className="curve"></div>
            <div className="absolute inset-0 flex justify-between items-end pb-2 px-2 sm:px-4">
              {hourlyTemps.map((point, index) => (
                <div
                  key={index}
                  className="temperature-point"
                  style={{ left: point.left, marginBottom: `${point.mb}px` }}
                >
                  <span className="text-lg sm:text-xl font-bold mb-6 sm:mb-8">{point.temp}</span>
                  {point.hasDot && (
                    <div className="w-2 h-2 rounded-full bg-yellow-500 ring-4 ring-yellow-500 ring-opacity-30"></div>
                  )}
                  {!point.hasDot && <div className="w-px h-2 bg-gray-500"></div>}
                  <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">{point.time}</span>
                </div>
              ))}
            </div>
          </div>
      
        </footer>
      </div>

      <style jsx>{`
        .curve {
          position: relative;
          height: 120px;
          background-color: transparent;
        }
        .curve::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60px;
          border-bottom: 2px solid #9CA3AF;
          border-radius: 50% / 30px;
        }
        .temperature-point {
          position: absolute;
          top: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (min-width: 640px) {
          .curve {
            height: 140px;
          }
          .curve::before {
            height: 80px;
            border-radius: 50% / 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherCard;