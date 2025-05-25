"use client";
import { AnimatedList } from "@/components/magicui/animated-list";
import { FaCloudRain, FaSun, FaSmog, FaMapMarkerAlt, FaCloud } from "react-icons/fa";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useEffect, useState } from "react";

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cities to fetch weather for - with different cities
  const cities = ["Paris", "Sydney", "Rio de Janeiro"];

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      try {
        const apiKey = "b939d537523042adb2e165139251102";
        const weatherPromises = cities.map(city => 
          fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`)
            .then(res => res.json())
        );
        
        const results = await Promise.all(weatherPromises);
        const processedData = results.map(data => ({
          location: data.location.name,
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          mappedCondition: getMappedCondition(data.current.condition.text)
        }));
        
        setWeatherData(processedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Helper function to map API weather conditions to our UI categories
  function getMappedCondition(condition) {
    if (/rain/i.test(condition)) return "Rainy";
    if (/cloud/i.test(condition)) return "Cloudy";
    if (/fog|mist|haze/i.test(condition)) return "Foggy";
    return "Sunny";
  }
  
  // Helper function to get correct icon based on condition
  function getWeatherIcon(condition) {
    switch(condition) {
      case "Rainy": return <FaCloudRain className="w-6 h-6 text-blue-300" />;
      case "Cloudy": return <FaCloud className="w-6 h-6 text-gray-300" />;
      case "Foggy": return <FaSmog className="w-6 h-6 text-zinc-300" />;
      default: return <FaSun className="w-6 h-6 text-amber-300" />;
    }
  }
  
  // Helper function to get city-specific styles
  function getCityStyles(cityName) {
    // Apply different color schemes based on city name
    switch(cityName) {
      case "Paris": 
        return {
          gradient: "from-indigo-900 to-purple-800",
          border: "border-indigo-700/30",
          shadow: "shadow-indigo-900/30",
          text: "text-indigo-300",
          subtext: "text-indigo-400/80",
          temp: "text-purple-300",
          bg: "bg-indigo-800/50"
        };
      case "Sydney": 
        return {
          gradient: "from-emerald-900 to-teal-800",
          border: "border-emerald-700/30",
          shadow: "shadow-emerald-900/30",
          text: "text-emerald-300",
          subtext: "text-emerald-400/80",
          temp: "text-teal-300",
          bg: "bg-emerald-800/50"
        };
      case "Rio de Janeiro": 
        return {
          gradient: "from-yellow-800 to-orange-800",
          border: "border-yellow-700/30",
          shadow: "shadow-yellow-900/30",
          text: "text-yellow-300",
          subtext: "text-yellow-400/80",
          temp: "text-orange-300",
          bg: "bg-yellow-800/50"
        };
      default: 
        // Fallback for any other city
        return {
          gradient: "from-pink-900 to-rose-800",
          border: "border-pink-700/30",
          shadow: "shadow-pink-900/30",
          text: "text-pink-300",
          subtext: "text-pink-400/80",
          temp: "text-rose-300",
          bg: "bg-pink-800/50"
        };
    }
  }
  
  // Keep the original weather condition styles for the icons
  function getWeatherStyles(condition) {
    switch(condition) {
      case "Rainy": 
        return {
          gradient: "from-blue-900 to-blue-800",
          border: "border-blue-700/30",
          shadow: "shadow-blue-900/30",
          text: "text-blue-300",
          subtext: "text-blue-400/80",
          temp: "text-cyan-400",
          bg: "bg-blue-800/50"
        };
      case "Cloudy": 
        return {
          gradient: "from-gray-800 to-gray-700",
          border: "border-gray-600/30",
          shadow: "shadow-gray-800/30",
          text: "text-gray-300",
          subtext: "text-gray-400/80",
          temp: "text-gray-300",
          bg: "bg-gray-700/50"
        };
      case "Foggy": 
        return {
          gradient: "from-zinc-800 to-zinc-900",
          border: "border-zinc-700/30",
          shadow: "shadow-zinc-800/30",
          text: "text-zinc-300",
          subtext: "text-zinc-400/80",
          temp: "text-zinc-300",
          bg: "bg-zinc-700/50"
        };
      default: 
        return {
          gradient: "from-amber-900 to-amber-800",
          border: "border-amber-700/30",
          shadow: "shadow-amber-900/30",
          text: "text-amber-300",
          subtext: "text-amber-400/80",
          temp: "text-amber-400",
          bg: "bg-amber-800/50"
        };
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 md:p-8">
        <h1 className="mb-12 text-4xl md:text-5xl font-bold text-center drop-shadow-lg relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white">
            Weather Predictions
          </span>
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"></span>
        </h1>
        
        <div className="overflow-hidden bg-zinc-900 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800">
          <div className="p-1">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : (
              <AnimatedList delay={700} className="flex flex-col gap-4 p-4">
                {weatherData.map((item, index) => {
                  // Use city-specific styles instead of weather condition styles
                  const styles = getCityStyles(item.location);
                  return (
                    <div key={index} className={`flex items-center p-5 transition-all duration-500 bg-gradient-to-r ${styles.gradient} rounded-xl shadow-lg hover:scale-[1.02] hover:${styles.shadow} group border ${styles.border}`}>
                      <div className={`flex items-center justify-center w-12 h-12 mr-4 ${styles.bg} rounded-full shadow-inner group-hover:rotate-12 transition-transform`}>
                        {getWeatherIcon(item.mappedCondition)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${styles.text} text-lg`}>{item.location}</h3>
                        <p className={`text-sm ${styles.subtext}`}>{item.condition}</p>
                      </div>
                      <span className={`text-2xl font-bold ${styles.temp}`}>{item.temperature}°</span>
                    </div>
                  );
                })}
              </AnimatedList>
            )}
          </div>
          <Link href="/predict" className="group block">
            <InteractiveHoverButton className="flex items-center justify-between w-full p-4 transition-all duration-300 bg-zinc-800 hover:bg-gradient-to-r from-gray-800 to-zinc-900 border-t border-zinc-700">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 bg-zinc-700 rounded-full shadow-inner group-hover:bg-gray-600 transition-colors">
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-200 text-lg group-hover:text-white transition-colors">Predict Weather</h3>
                  <p className="text-sm text-zinc-400 group-hover:text-gray-200 transition-colors">Get forecast for your location</p>
                </div>
              </div>
            </InteractiveHoverButton>
          </Link>
        </div>
      </div>
    </div>
  );
}