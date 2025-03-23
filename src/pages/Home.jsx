import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async (location = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = location 
        ? `${API_URL}/api/properties/search?location=${location}`
        : `${API_URL}/api/properties`;
        
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (location) => {
    fetchProperties(location);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading properties...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl text-gray-600">No properties found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;