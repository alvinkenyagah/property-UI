import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const { name, email, currentPassword, newPassword, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
    setFormSuccess('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Validate form
    if (newPassword && newPassword !== confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }
    
    try {
      const userData = {
        name
      };
      
      // Only include password fields if the user is changing their password
      if (currentPassword && newPassword) {
        userData.currentPassword = currentPassword;
        userData.newPassword = newPassword;
      }
      
      await updateProfile(userData);
      setFormSuccess('Profile updated successfully');
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {formError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {formError}
          </div>
        )}
        
        {formSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
            {formSuccess}
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
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
            <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
          </div>
          
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-semibold mb-2">Change Password</h2>
            <p className="text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
            
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
