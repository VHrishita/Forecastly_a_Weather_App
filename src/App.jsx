import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WeatherCard from "./components/WeatherCard.jsx";
import Forecast from "./components/Forecast.jsx";
import AnimatedBackground from "./components/AnimatedBackground.jsx";
import Loading from "./components/Loading.jsx";

const API_KEY = "ebdf913131824d1887452436251511"; 

export default function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeather() {
    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        city
      )}&days=3&aqi=no&alerts=no`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.error) {
        setError(json.error.message || "City not found.");
        setLoading(false);
        return;
      }

      setData(json);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const condition = data?.current?.condition?.text?.toLowerCase() || "";
  let bgType = "first";
  if (condition.includes("rain") || condition.includes("shower")) bgType = "rain";
  else if (condition.includes("sunny") || condition.includes("clear")) bgType = "clear";
  else if (condition.includes("snow") || condition.includes("sleet") || condition.includes("blizzard")) bgType = "snow";
  else if (condition.includes("cloud")) bgType = "cloud";
  else if (condition.includes("thunder") || condition.includes("storm") || condition.includes("patchy")) bgType = "thunder";
  else if (condition.includes("mist") || condition.includes("fog")) bgType = "fog";

  return (
    <div className="app-root">
      <AnimatedBackground type={bgType} />
      <div className="app-wrap">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="header"
        >
          <h1>Forecastly</h1>
          <p className="sub">Uncovering the sky's secrets</p>
          <p className="sub sub-third">“Rain or shine, we’ve got you covered ☀️🌧️”</p>
        </motion.header>

        <main className="main">
          <section className="control">
            <div className="search">
              <input
                placeholder="Search city (e.g., Tokyo)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
              />
              <button onClick={fetchWeather} className="btn">Search</button>
            </div>
            <div className="notes">
              <small>Tip: press Enter to search</small>
            </div>
          </section>

          <section className="content">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="center">
                  <Loading />
                </motion.div>
              )}

              {!loading && error && (
                <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="center">
                  <div className="error">{error}</div>
                </motion.div>
              )}

              {!loading && data && (
                <motion.div key="weather" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.35 }} className="center">
                  <WeatherCard current={data.current} location={data.location} />
                  <Forecast days={data.forecast.forecastday} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="footer">
          <small>All Rights Reserved | Vempali Hrishita | Powered by WeatherAPI.com | 2025</small>
        </motion.footer>
      </div>
    </div>
  );
}
