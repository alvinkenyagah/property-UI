// export default function App() {
//   return (
//     <h1 className="text-3xl font-bold underline text-center">
//       Hello, Tailwind CSS!
//     </h1>
//   );
// }



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetail from './pages/PropertyDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import UserProfile from './pages/UserProfile';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/landlord/dashboard" 
                element={
                  <PrivateRoute>
                    <LandlordDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/property/add" 
                element={
                  <PrivateRoute>
                    <AddProperty />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/property/edit/:id" 
                element={
                  <PrivateRoute>
                    <EditProperty />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
