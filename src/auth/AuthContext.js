import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 앱이 처음 로드될 때 로그인 상태 확인
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const login = token => {
    localStorage.setItem("jwtToken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
