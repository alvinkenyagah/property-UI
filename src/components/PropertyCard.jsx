import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-dark mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-2">{property.location}</p>
        <p className="text-primary font-bold mb-3">${property.price}/month</p>
        <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
        
        <Link 
          to={`/properties/${property._id}`}
          className="inline-block bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;