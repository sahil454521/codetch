'use client';

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { WiDaySunny, WiRain, WiCloudy, WiFog } from "react-icons/wi";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";


const Globe = dynamic(
  () => import('@/components/magicui/globe').then(mod => mod.Globe),
  { ssr: false }
);

const cityCoords = {
  Manila: { lat: 14.5995, lng: 120.9842 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Dhaka: { lat: 23.8103, lng: 90.4125 },
  Cairo: { lat: 30.0444, lng: 31.2357 },
  Beijing: { lat: 39.9042, lng: 116.4074 },
  "Sao Paulo": { lat: -23.5505, lng: -46.6333 },
  "Mexico City": { lat: 19.4326, lng: -99.1332 },
  "New York": { lat: 40.7128, lng: -74.006 },
  Osaka: { lat: 34.6937, lng: 135.5022 },
  Istanbul: { lat: 41.0082, lng: 28.9784 },
} as const;

type WeatherResult = {
  location: string;
  temperature: number | string;
  condition: string;
} | null;

export default function PredictPage() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherResult>(null);
  const [globeRotation, setGlobeRotation] = useState({ x: 0, y: 0, z: 0, scale: 1 });
  const [markerVisible, setMarkerVisible] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [isSearched, setIsSearched] = useState(false); // Track if a search has been made
  const [targetCoords, setTargetCoords] = useState({ lat: 0, lng: 0 }); // Add a state to store the random target coordinates
  const [randomCoords, setRandomCoords] = useState({ lat: 0, lng: 0 });
  const globeRef = useRef(null);

  
  const getWeatherIcon = (condition: any) => {
    switch (condition) {
      case "Sunny": return <WiDaySunny className="w-10 h-10 text-amber-500" />;
      case "Rainy": return <WiRain className="w-10 h-10 text-blue-500" />;
      case "Cloudy": return <WiCloudy className="w-10 h-10 text-gray-500" />;
      case "Foggy": return <WiFog className="w-10 h-10 text-gray-400" />;
      default: return <WiDaySunny className="w-10 h-10 text-amber-500" />;
    }
  };

  // Define a function to get random city coordinates
  const getRandomCityCoords = () => {
    // Get all city names from the cityCoords object
    const cityNames = Object.keys(cityCoords) as (keyof typeof cityCoords)[];
    // Pick a random city
    const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)];
    // Return its coordinates
    return cityCoords[randomCity];
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);
    
    
    setShowForm(false);
    
    // Get random coordinates for the marker to land on
    const randomCoords = getRandomCityCoords();
    setTargetCoords(randomCoords);
    
    
    // Start a slower, progressive zoom animation
    const startZoom = () => {
      let currentScale = 1;
      const targetScale = 1.4;
      const zoomDuration = 1500;
      const startTime = Date.now();
      
      const animateZoom = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / zoomDuration, 1);
        
   
        const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);
        const easedProgress = easeOutCubic(progress);
        
        
        currentScale = 1 + (targetScale - 1) * easedProgress;
        
        
        setGlobeRotation(prev => ({
          ...prev,
          scale: currentScale
        }));
        
      
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          // When zoom completes, set isSearched to stop the globe
          setIsSearched(true);
        }
      };
      
      // Start the zoom animation
      requestAnimationFrame(animateZoom);
    };
    
    // Begin the zoom animation
    startZoom();
    
   
    try {
      
      const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`
      );
      const data = await response.json();

      // Parse weather data
      const temperature = Math.round(data.current.temp_c);
      const condition = data.current.condition.text;

      
      let mappedCondition = "Sunny";
      if (/rain/i.test(condition)) mappedCondition = "Rainy";
      else if (/cloud/i.test(condition)) mappedCondition = "Cloudy";
      else if (/fog|mist|haze/i.test(condition)) mappedCondition = "Foggy";

      setResult({
        location: data.location.name,
        temperature,
        condition: mappedCondition,
      });
    } catch (err) {
      setResult({
        location,
        temperature: "--",
        condition: "Sunny",
      });
    }

    setLoading(false);
    
    
    setTimeout(() => {
      setMarkerVisible(true);
    }, 1000);
  };

  
  useEffect(() => {
  
    const coords = getRandomCityCoords();
    setRandomCoords(coords);
  }, []);

  function getCityNameFromCoords(targetCoords: { lat: number; lng: number; }): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 transition-transform hover:scale-110">
            <div className="flex items-center justify-center w-10 h-10 bg-zinc-900 rounded-full shadow-md">
              <FaArrowLeft className="text-gray-400 hover:text-white transition-colors" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-center drop-shadow-lg relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white">
              Weather Prediction
            </span>
            <span className="absolute -bottom-3 left-0 w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"></span>
          </h1>
        </div>
        
        {/* 3D Globe Visualization Container */}
        <motion.div 
          className="relative w-full mb-6 perspective-1000 z-10" 
          animate={{ 
            height: result ? "320px" : "250px",
            marginBottom: result ? "40px" : "24px" 
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Globe Component */}
          <Globe 
            ref={globeRef}
            scale={globeRotation.scale}
            moveToLocationTrigger={isSearched ? location : undefined}
            targetLat={targetCoords.lat} 
            targetLng={targetCoords.lng}
          />
          
          {/* Marker layer (stays above the globe) */}
          <AnimatePresence>
            {markerVisible && (
              <motion.div 
                className="absolute top-1/2 left-1/2 z-10"
                initial={{ scale: 0, opacity: 0, y: -80, x: "-50%" }}
                animate={{ scale: 1.8, opacity: 1, y: "-50%", x: "-50%" }}
                exit={{ scale: 0, opacity: 0, y: -30 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 7,
                  mass: 1.2
                }}
              >
                <div className="relative">
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: 1,
                      repeatType: "reverse"
                    }}
                  >
                    <FaMapMarkerAlt className="text-4xl text-red-500 drop-shadow-lg" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 bg-zinc-800 px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-zinc-700"
                    initial={{ y: 10, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  >
                    {/* Display either the API result location or the random city name */}
                    <span className="font-medium text-white">
                      {result?.location || getCityNameFromCoords(targetCoords)}
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-1 left-1/2 w-10 h-10 -ml-5 bg-red-400 rounded-full"
                    animate={{ 
                      scale: [1, 2.5, 1], 
                      opacity: [0.8, 0.1, 0.8],
                      boxShadow: [
                        "0 0 0 0 rgba(239, 68, 68, 0.7)",
                        "0 0 0 20px rgba(239, 68, 68, 0)",
                        "0 0 0 0 rgba(239, 68, 68, 0.7)"
                      ]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      ease: "easeInOut" 
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Add a subtle connection line between the marker and results */}
          {markerVisible && result && (
            <motion.div
              className="absolute bottom-0 left-1/2 w-1 bg-gradient-to-b from-red-500 to-transparent" 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 60, opacity: 0.7 }} 
              transition={{ delay: 0.5, duration: 0.3 }}
              style={{ transform: 'translateX(-50%)' }}
            />
          )}
        </motion.div>
        
        {/* Input and Results Container - Make it motion-aware */}
        <motion.div 
          className="overflow-hidden bg-zinc-900 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-zinc-800 relative z-20" 
          animate={{ 
            y: result ? -70 : 0, 
            marginTop: result ? '-30px' : '0px'
          }}
          transition={{ 
            duration: 0.6,
            delay: result ? 1.2 : 0 
          }}
        >
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.form 
                onSubmit={handleSubmit} 
                className="mb-6"
                initial={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  y: -20,
                  transition: { 
                    opacity: { duration: 0.2 },
                    height: { duration: 0.3, delay: 0.1 },
                    y: { duration: 0.2 }
                  }
                }}
              >
                <div className="flex">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location..."
                    className="w-full px-4 py-3 border border-zinc-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-zinc-800 text-white placeholder-zinc-400"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-3 text-white bg-gradient-to-r from-gray-600 to-zinc-700 rounded-r-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaSearch />
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-zinc-300 text-sm">Finding {location}...</span>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => {
                      setShowForm(true);
                      setResult(null);
                      setMarkerVisible(false);
                      setGlobeRotation({ x: 0, y: 0, z: 0, scale: 1 });
                      setIsSearched(false);
                    }}
                    className="px-3 py-2 text-sm text-gray-300 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                  >
                    Search New Location
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 80, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}    
                transition={{ 
                  delay: 0.3,                              
                  duration: 0.8,                           
                  type: "spring",
                  stiffness: 60,                           
                  damping: 12                              
                }}
                className="p-5 bg-zinc-900 rounded-xl border border-zinc-800"
              >
                {/* Weather content */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {result.location}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="text-gray-300 font-medium">
                        {result.condition}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      {getWeatherIcon(result.condition)}
                    </motion.div>
                    <motion.span 
                      className="ml-2 text-3xl font-bold text-gray-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.3 }}
                    >
                      {result.temperature}°
                    </motion.span>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-4 p-3 bg-zinc-800 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                >
                  {/* Weather details section - could add more details here */}
                  <div className="text-sm text-gray-300">
                    <p>Today's forecast: {result.condition}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!result && !loading && (
            <p className="mt-4 text-sm text-zinc-400 text-center">
              Enter a city name to get the current weather prediction for that location.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}