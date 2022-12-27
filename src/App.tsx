import React, { useState, useEffect } from "react";

interface Forecast {
  temperature: number;
  weather: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherResponse {
  properties: {
    periods: Array<{
      temperature: number;
      shortForecast: string;
    }>;
  };
}

const App: React.FC = () => {
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Look up coordinates for the specified address
        const location: Coordinates = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (err) => {
              reject(err);
            }
          );
        });
        // const { latitude, longitude } = location;
        let latitude = 42.536457;
        let longitude = -70.985786;

        // Look up the 7 day forecast for the coordinates
        const weatherUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData: WeatherResponse = await weatherResponse.json();
        console.log(weatherData);
        const forecastData = weatherData.properties.periods
          .slice(0, 7)
          .map((period) => ({
            temperature: period.temperature,
            weather: period.shortForecast
          }));

        setForecast(forecastData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>An error occurred: {error}</p>;
  }

  return (
    <div>
      <p>7 Day Forecast</p>
      {forecast.map((day, index) => (
        <div key={index}>
          <li>Day {index + 1}</li>
          <li>Temperature: {day.temperature}°F</li>
          <li>Weather: {day.weather}</li>
        </div>
      ))}
    </div>
  );
};

export default App;
