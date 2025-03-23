import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-dark text-light shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          AccommodateApp
        </Link>
        
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-primary transition">
                Profile
              </Link>
              
              {user && user.isLandlord && (
                <Link to="/landlord/dashboard" className="hover:text-primary transition">
                  Dashboard
                </Link>
              )}
              
              <button 
                onClick={logout} 
                className="hover:text-primary transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-primary transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;