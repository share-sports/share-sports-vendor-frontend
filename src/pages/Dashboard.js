import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";

// 차트를 위한 가상 데이터
const bookingData = [
  { name: "월", bookings: 4 },
  { name: "화", bookings: 3 },
  { name: "수", bookings: 2 },
  { name: "목", bookings: 6 },
  { name: "금", bookings: 8 },
  { name: "토", bookings: 9 },
  { name: "일", bookings: 7 },
];

const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

export default function StadiumOwnerDashboard() {
  const [date, setDate] = useState(new Date());
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "2rem",
      }}
    >
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <Card>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.5rem",
            }}
          >
            총 예약
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>245</div>
          <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            전월 대비 20% 증가
          </p>
        </Card>
        <Card>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.5rem",
            }}
          >
            수익
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            15,231,000원
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            전월 대비 10% 증가
          </p>
        </Card>
        <Card>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.5rem",
            }}
          >
            활성 구장
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>3</div>
          <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            2개 구장 관리 필요
          </p>
        </Card>
        <Card>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.5rem",
            }}
          >
            예정된 예약
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>12</div>
          <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>향후 7일 동안</p>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "1fr 1fr",
          marginTop: "1.5rem",
        }}
      >
        <Card>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            주간 예약 현황
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8884d8" name="예약 수" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            일정
          </h3>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              padding: "1rem",
            }}
          >
            <p>달력 컴포넌트가 들어갈 자리입니다.</p>
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          최근 예약
        </h3>
        <div>
          {[1, 2, 3].map(booking => (
            <div
              key={booking}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <img
                src={`/placeholder-avatar-${booking}.jpg`}
                alt="아바타"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  marginRight: "1rem",
                }}
              />
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  홍길동
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  hong.gildong@email.com
                </p>
              </div>
              <div style={{ marginLeft: "auto", fontWeight: "500" }}>
                구장 {booking}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
