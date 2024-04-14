import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import search from "./assets/icons/search.svg";
import { useStateContext } from "./Context";
import { BackgroundLayout, WeatherCard, MiniCard } from "./Components";


function App() {
  const [input, setInput] = useState("");
  const [cities, setCities] = useState([]);
  const { weather, thisLocation, values, place, setPlace } = useStateContext();

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (input) {
        fetchCities();
      }
    }, 500); // Debouncing to reduce API call frequency
    return () => clearTimeout(timerId);
  }, [input]);

  const fetchCities = async () => {
    const options = {
      method: "GET",
      url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}`,
      headers: {
        "X-RapidAPI-Key": "faa082de75msh0bebc26f810fc98p14251cjsn8f9cb6fda227",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setCities(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedCity = (cityName) => {
    setInput(cityName);
    setPlace(cityName);
    setCities([]); // Optionally clear cities after selection
  };

  return (
    <div className="w-full h-screen text-white px-8">
      <nav className="w-full p-3 flex justify-between items-center">
        <h1 className="font-bold tracking-wide text-3xl">Weather App</h1>
        <div className="relative">
          <div className="bg-white w-full md:w-[20rem] overflow-hidden shadow-2xl rounded-lg flex items-center p-2 gap-2">
            <img src={search} alt="search" className="w-[1.5rem] h-[1.5rem]" />
            <input
              type="Search"
              placeholder="Search city"
              className="focus:outline-none w-full text-[#212121] text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPlace(input);
                }
              }}
            />
          </div>
          {input && cities.length > 0 && (
            <ul className="absolute bg-white w-full md:w-[20rem] m-2 rounded-lg shadow-lg text-gray-600">
              {cities.map((city) => (
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-lg"
                  key={city.id}
                  onClick={() => handleSelectedCity(city.name)}
                >
                  {city.name} - {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
      <BackgroundLayout />
      <main className="w-full flex flex-wrap gap-8  px-4 md:px-16 py-4 items-center">
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
        />
        <div
        
          className="flex justify-center gap-8 flex-wrap w-full md:w-[50%]  "
        >
          {values?.slice(1, 7).map((curr) => (
            <MiniCard
            
              key={curr.datetime}
              time={curr.datetime}
              temp={curr.temp} 
              iconString={curr.conditions}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
