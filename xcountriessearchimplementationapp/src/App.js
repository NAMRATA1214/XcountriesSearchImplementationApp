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

  // Memoize the debounced function
  const debounceHandleSearchChange = useMemo(
    () => debounceCreator(handleSearchChange, 500),
    [] // No dependencies to ensure it's only created once
  );

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchResult = await axios.get('https://restcountries.com/v3.1/all');
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

  // Filter countries based on searchQuery
  useEffect(() => {
    try {
      if (searchQuery === '') {
        setSuccess(true);
        setCountryList(totalCountryList);
      } else {
        const filteredCountries = totalCountryList.filter((country) =>
          country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
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
          countryList.map((country) => (
            <Card
              key={country.cca3} // Key moved to the `Card` component
              countryFlag={country.flags.png}
              countryName={country.name.common}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
