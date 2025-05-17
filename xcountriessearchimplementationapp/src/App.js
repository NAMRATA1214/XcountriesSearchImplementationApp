import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    fetch("https://countries-search-data-prod-812920491762.asia-south1.run.app/countries")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setSearchData(data);
      })
      .catch((err) => console.error("Error fetching data: ", err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCountries();
    }, 300); // Adjust the debounce delay as needed

    return () => clearTimeout(timer);
  }, [searchText]);

  function handleSearch(e) {
    setSearchText(e.target.value);
  }

  function searchCountries() {
    if (searchText === "") {
      setSearchData(countries);
      return;
    }

    const filteredData = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchData(filteredData);
  }

  const cardStyle = {
    width: "200px",
    height: "200px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    margin: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle = {
    width: "100px",
    height: "100px",
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    height: "100vh",
    marginTop: "30px",
  };

  const searchBoxContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
  };

  const searchBox = {
    width: "800px",
    height: "30px",
  };

  return (
    <div>
      <div style={{ backgroundColor: "rgba(0,0,0,0.1)" }}>
        <form
          style={searchBoxContainer}
          onSubmit={(e) => {
            e.preventDefault();
            searchCountries();
          }}
        >
          <input
            style={searchBox}
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e)}
            placeholder="Search for countries..."
          />
        </form>
      </div>
      <div style={containerStyle}>
        {searchData.map((country) => (
          <div key={country.cca3} style={cardStyle} className="countryCard">
            <img
              src={country.flags.png}
              alt={`Flag of ${country.name.common}`}
              style={imageStyle}
            />
            <h2>{country.name.common}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}