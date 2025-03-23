import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isLandlord: false
  });
  const [formError, setFormError] = useState('');
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, isLandlord } = formData;

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!name || !email || !password) {
      setFormError('Please enter all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      await register({
        name,
        email,
        password,
        isLandlord
      });
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
      
      {formError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isLandlord"
              checked={isLandlord}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-primary"
            />
            <span className="text-gray-700">Register as a Landlord</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;