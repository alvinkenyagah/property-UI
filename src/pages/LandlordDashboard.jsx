import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const LandlordDashboard = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandlordProperties = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch properties');
        }
        
        const allProperties = await res.json();
        // Filter properties that belong to the current landlord
        const landlordProperties = allProperties.filter(
          property => property.landlord === user._id
        );
        
        setProperties(landlordProperties);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching landlord properties:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isLandlord) {
      fetchLandlordProperties();
    }
  }, [user]);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete property');
      }
      
      // Remove the deleted property from the state
      setProperties(properties.filter(property => property._id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting property:', err);
    }
  };

  if (!user || !user.isLandlord) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl text-red-600">Access Denied</h3>
        <p className="mt-2 text-gray-600">You must be registered as a landlord to access this page.</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
        <Link
          to="/property/add"
          className="bg-secondary text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Add New Property
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading your properties...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">You haven't listed any properties yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first property listing.</p>
          <Link
            to="/property/add"
            className="bg-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
          >
            Add Property
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link 
                      to={`/properties/${property._id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {property.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{property.location}</td>
                  <td className="py-3 px-4 text-gray-700">${property.price}/month</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/property/edit/${property._id}`}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;