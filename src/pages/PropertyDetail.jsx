import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch property details');
        }
        
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl text-gray-600">Property not found</h3>
        <Link to="/" className="mt-4 text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && property.landlord === user._id;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-96">
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {property.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  &lt;
                </button>
                <button
                  onClick={nextImage}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  &gt;
                </button>
              </div>
            )}
            
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImage ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-dark">{property.title}</h1>
          <p className="text-2xl font-bold text-primary">${property.price}/month</p>
        </div>

        <p className="text-lg text-gray-600 mt-2">
          <span className="mr-2">📍</span>
          {property.location}
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {isOwner ? (
            <>
              <Link
                to={`/property/edit/${property._id}`}
                className="bg-secondary text-white py-2 px-6 rounded hover:bg-green-600 transition"
              >
                Edit Property
              </Link>
            </>
          ) : (
            <a
              href={`mailto:landlord@example.com?subject=Inquiry about ${property.title}`}
              className="bg-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
            >
              Contact Landlord
            </a>
          )}
          
          <Link
            to="/"
            className="border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-100 transition"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
