import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import "./Forecast.css"; // Assuming you're using an external CSS file

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit

  // Fetch weather data from OpenWeather API
  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = "318389dea644703dc0efea08a6e7cab1"; // Your OpenWeather API key
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city}&units=metric&appid=${apiKey}`;

      try {
        const response = await axios.get(url);
        setForecastData(response.data.list); // List of forecast data
      } catch (error) {
        console.log("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data.city]);

  // Format the day for forecast display
  const formatDay = (dateString) => {
    const options = { weekday: "short" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  // Get current date
  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  // Toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  // Convert Fahrenheit to Celsius
  const convertToCelsius = (temperature) => {
    return Math.round((temperature - 32) * (5 / 9));
  };

  // Convert Celsius to Fahrenheit
  const convertToFahrenheit = (temperature) => {
    return Math.round((temperature * 9) / 5 + 32);
  };

  // Render temperature based on selected unit (Celsius or Fahrenheit)
  const renderTemperature = (temperature) => {
    if (isCelsius) {
      return Math.round(temperature);
    } else {
      return convertToFahrenheit(temperature);
    }
  };

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <span>{data.country}</span>
        </h2>
      </div>
      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>
      <div
  className="temp"
  style={{
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px", // Adds space between elements
  }}
>
  {data.condition.icon_url && (
    <img
      src={data.condition.icon_url}
      alt={data.condition.description}
      className="temp-icon"
    />
  )}
  {/* Add weather description */}
  <span className="weather-des" style={{ marginRight: "10px" }}>
    {data.condition.description}
  </span>
  {/* Add temperature */}
  <span className="temperature">
    {renderTemperature(data.temperature.current)}
    <sup className="temp-deg" onClick={toggleTemperatureUnit}>
      {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
    </sup>
  </span>
</div>

      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40" />
          <div>
            <p className="wind">{data.wind.speed} m/s</p>
            <p>Wind speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40" />
          <div>
            <p className="humidity">{data.temperature.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>
      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">
          {forecastData &&
            forecastData.slice(0, 5).map((day) => (
              <div className="day" key={day.dt}>
                <p className="day-name">{formatDay(day.dt_txt)}</p>
                {day.weather[0].icon && (
                  <img
                    className="day-icon"
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                )}
                <p className="day-temperature">
                  {Math.round(day.main.temp_min)}°/{" "}
                  <span>{Math.round(day.main.temp_max)}°</span>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Forecast;
