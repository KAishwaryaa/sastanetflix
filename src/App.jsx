import React, { useEffect, useState } from 'react';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, onAuthStateChanged } from "./mockAuth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // Logged In
        console.log("Mock User:", userAuth);
        setUser(userAuth);
      } else {
        // Logged Out
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Routes>
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
