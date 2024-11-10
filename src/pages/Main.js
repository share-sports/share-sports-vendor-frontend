import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, UserIcon, LogInIcon } from 'lucide-react';

export default function MainPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col p-4">
            <header className="w-full flex justify-end mb-8">
                <Link to="/login" className="flex items-center bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <LogInIcon size={20} className="mr-2" />
                    <span className="font-semibold">로그인</span>
                </Link>
            </header>
            <main className="flex-grow flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-8">풋살장 관리 시스템</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                    <Link to="/stadium-management" className="flex flex-col items-center justify-center bg-white text-black p-6 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200">
                        <HomeIcon size={48} />
                        <span className="mt-2 text-lg font-semibold">구장 관리</span>
                    </Link>
                    <Link to="/dashboard" className="flex flex-col items-center justify-center bg-white text-black p-6 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200">
                        <ChartBarIcon size={48} />
                        <span className="mt-2 text-lg font-semibold">대시보드</span>
                    </Link>
                    <Link to="/my-page" className="flex flex-col items-center justify-center bg-white text-black p-6 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200">
                        <UserIcon size={48} />
                        <span className="mt-2 text-lg font-semibold">마이페이지</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
