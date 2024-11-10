import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import MainPage from "./pages/Main";
import ManagementPage from "./pages/Management";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/stadium-management" element={<ManagementPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
