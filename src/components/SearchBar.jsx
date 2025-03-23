import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(location);
  };
  
  return (
    <div className="bg-dark py-8 px-4 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl text-light font-bold mb-4 text-center">
        Find Your Perfect Accommodation
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter location (city, neighborhood)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-grow py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        <button
          type="submit"
          className="bg-primary text-white py-3 px-6 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
