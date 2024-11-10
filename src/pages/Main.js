import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, ChartBarIcon, UserIcon, LogOutIcon } from "lucide-react";
import Header from "../components/ui/Header";

export default function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-4">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">풋살장 관리 시스템</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <Link
            to="/stadium-management"
            className="flex flex-col items-center justify-center bg-black text-white p-6 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <HomeIcon size={48} />
            <span className="mt-2 text-lg font-semibold">구장 관리</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex flex-col items-center justify-center bg-black text-white p-6 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <ChartBarIcon size={48} />
            <span className="mt-2 text-lg font-semibold">대시보드</span>
          </Link>
          <Link
            to="/my-page"
            className="flex flex-col items-center justify-center bg-black text-white p-6 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <UserIcon size={48} />
            <span className="mt-2 text-lg font-semibold">마이페이지</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
