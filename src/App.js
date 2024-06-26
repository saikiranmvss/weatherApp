import React, { useState } from 'react';
import './App.css';
import WeatherModule from './WeatherModule';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const InputChange = (e) => {
    setCityName(e.target.value);
  };

  const SearchClick = async () => {
    setLoading(true);
    setError('');
    setWeatherData([]);
    
    const data = await WeatherModule(cityName);
    if (data && data.list) {
      const dailyForecasts = [];
      const usedDates = new Set();
      const today = new Date().toLocaleDateString();
      
      for (let i = 0; i < data.list.length; i++) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (date !== today && !usedDates.has(date)) {
          dailyForecasts.push(forecast);
          usedDates.add(date);
        }
        if (dailyForecasts.length === 5) {
          break;
        }
      }
      
      if (dailyForecasts.length > 0) {
        setWeatherData(dailyForecasts);
      } else {
        setError('No forecast data found. Please check the city name and try again.');
      }
    } else {
      setError('No forecast data found. Please check the city name and try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className='search-header'>
        <h1>Weather in your city</h1>
        <div className="search-container">
          <input
            type="text"
            id="city"
            className='cityName'
            placeholder="City Name"
            value={cityName}
            onChange={InputChange}
          />
          <button id="searchBtn" onClick={SearchClick}>
            Search
          </button>
          {loading && <div className="loader" id="loader"></div>}
        </div>
      </div>
      <div id="weatherContainer">
        {error && <div className="error">{error}</div>}
        {weatherData.length > 0 && weatherData.map((forecast, index) => (
          <table className="weather-table" key={index}>
            <thead>
              <tr>
                <th colSpan="2" className="date">Date: {new Date(forecast.dt * 1000).toLocaleDateString()}</th>
              </tr>
              <tr>
                <th colSpan="2" className="temperature-header">Temperature</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="min-max">Min</td>
                <td className="min-max">Max</td>
              </tr>
              <tr>
                <td className="value">{(forecast.main.temp_min - 273.15).toFixed(2)}</td>
                <td className="value">{(forecast.main.temp_max - 273.15).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label">Pressure</td>
                <td className="value">{forecast.main.pressure}</td>
              </tr>
              <tr>
                <td className="label">Humidity</td>
                <td className="value">{forecast.main.humidity}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

export default App;
