import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { AuthContext } from "../../auth/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <button onClick={() => navigate("/")} className="text-2xl font-bold">
            Share Sports
          </button>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <LogOutIcon size={20} className="mr-2" />
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <LogInIcon size={20} className="mr-2" />
                로그인
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
