import { useEffect, useState, useMemo } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCountryList, setTotalCountryList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const debounceCreator = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    console.log('SEARCH:', value);
  };

  const debounceHandleSearchChange = useMemo(
    () => debounceCreator(handleSearchChange, 500),
    []
  );

  // Fetch data from specified API endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries'
        );
        console.log(res.data);
        setTotalCountryList(res.data);
        setCountryList(res.data);
      } catch (err) {
        console.log('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Filter based on search input
  useEffect(() => {
  const filtered = totalCountryList.filter((country) =>
  typeof country.name === 'string' &&
  country.name.toLowerCase().includes(searchQuery.toLowerCase())
);
    setCountryList(filtered);
  }, [searchQuery, totalCountryList]);

  return (
    <div className="App">
      <header className="flex-center">
        <input
          type="text"
          placeholder="Search for countries"
          onChange={(e) => debounceHandleSearchChange(e.target.value)}
        />
      </header>

      <div className="flag-container flex-center">
        {countryList.length > 0 &&
          countryList.map((country) => (
            <div className="countryCard" key={country.name}>
              <img src={country.flag} alt={`Flag of ${country.name}`} />
              <p>{country.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
