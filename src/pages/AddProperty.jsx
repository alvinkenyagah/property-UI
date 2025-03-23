import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const AddProperty = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { title, description, price, location } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };
  
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    const imageUrls = [];
    
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!res.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await res.json();
        imageUrls.push(data.imageUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
        throw err;
      }
    }
    
    return imageUrls;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate form
      if (!title || !description || !price || !location) {
        throw new Error('Please fill in all required fields');
      }
      
      // Upload images first
      const imageUrls = await uploadImages();
      
      // Create property listing
      const res = await fetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          price: parseFloat(price)
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to create property listing');
      }
      
      navigate('/landlord/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user || !user.isLandlord) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl text-red-600">Access Denied</h3>
        <p className="mt-2 text-gray-600">You must be registered as a landlord to add properties.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Property Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
              Monthly Rent (USD) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="City, State"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="images" className="block text-gray-700 font-medium mb-2">
              Property Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Select multiple images for your property listing
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate('/landlord/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="bg-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
