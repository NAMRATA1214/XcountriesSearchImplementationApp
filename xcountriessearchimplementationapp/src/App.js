import { useEffect, useState, useMemo } from 'react';
import './App.css';
import axios from 'axios';
import Card from './Card';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCountryList, setTotalCountryList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchResult = await axios.get(
          'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries'
        );
        console.log(fetchResult.data);
        setTotalCountryList(fetchResult.data);
        setCountryList(fetchResult.data);
        setSuccess(true);
      } catch (err) {
        console.log('Error:', err);
        setSuccess(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    try {
      if (searchQuery === '') {
        setSuccess(true);
        setCountryList(totalCountryList);
      } else {
        const filteredCountries = totalCountryList.filter((country) =>
          country.common.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredCountries.length > 0) {
          setSuccess(true);
          setCountryList(filteredCountries);
        } else {
          setSuccess(false);
        }
      }
    } catch (err) {
      console.log('Error:', err);
      setSuccess(false);
    }
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
        {success &&
          countryList.map((country, index) => (
            <Card
              key={index}
              countryFlag={country.png}
              countryName={country.common}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
