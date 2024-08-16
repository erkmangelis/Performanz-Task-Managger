import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { UserProvider } from './contexts/UserContext';
import './App.css'

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  return element;
};

function App() {
  return (
    
      <Router>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<UserProvider><ProtectedRoute element={<HomePage />} /></UserProvider>} />
        </Routes>
      </Router>
    
  );
}

export default App;
