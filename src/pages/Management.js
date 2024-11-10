"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import Header from "../components/ui/Header";
import PostList from "./Posts";

export default function StadiumManagement() {
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      const response = await fetch(
        "http://localhost:9090/api/host/stadium/list",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setStadiums(data.result);
      }
    } catch (error) {
      console.error("Error fetching stadiums:", error);
    }
  };

  const fetchStadiumDetail = async stadiumUuid => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/host/stadium/detail?stadiumUuid=${stadiumUuid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setSelectedStadium(data.result);
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error fetching stadium detail:", error);
    }
  };

  const handleAddStadium = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const stadiumData = {
      stadiumName: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      description: formData.get("description"),
      parking: formData.get("parking") === "on",
      shoeRent: formData.get("shoeRent") === "on",
      ballRent: formData.get("ballRent") === "on",
      uniformRent: formData.get("uniformRent") === "on",
      rentCost: parseInt(formData.get("rentCost"), 10),
      openingHours: formData.get("openingHours"),
      closingHours: formData.get("closingHours"),
    };

    try {
      const response = await fetch("http://localhost:9090/api/host/stadium", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stadiumData),
      });
      const data = await response.json();
      if (data.isSuccess) {
        fetchStadiums();
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error adding stadium:", error);
    }
  };

  const handleDeleteStadium = async () => {
    if (!selectedStadium) return;

    try {
      const response = await fetch("http://localhost:9090/api/host/stadium", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stadiumUuid: selectedStadium.stadiumUuid }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        fetchStadiums();
        setSelectedStadium(null);
      }
    } catch (error) {
      console.error("Error deleting stadium:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">구장 목록</h2>
          <ul className="space-y-2">
            {stadiums.map(stadium => (
              <li
                key={stadium.stadiumUuid}
                className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                onClick={() => fetchStadiumDetail(stadium.stadiumUuid)}
              >
                {stadium.name}
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-black text-white p-2 rounded flex items-center"
            onClick={() => setIsAdding(true)}
          >
            <PlusIcon size={20} className="mr-2" />
            구장 추가
          </button>
        </div>
        <div className="w-2/3 p-4 overflow-y-auto">
          {isAdding ? (
            <form
              onSubmit={handleAddStadium}
              className="space-y-4 bg-gray-100 p-4 rounded"
            >
              <input
                type="text"
                name="name"
                placeholder="구장 이름"
                className="w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="주소"
                className="w-full p-2 rounded"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="전화번호"
                className="w-full p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="설명"
                className="w-full p-2 rounded"
              />
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" name="parking" className="mr-2" />
                  주차 가능
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="shoeRent" className="mr-2" />
                  신발 대여
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="ballRent" className="mr-2" />공
                  대여
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="uniformRent" className="mr-2" />
                  유니폼 대여
                </label>
              </div>
              <input
                type="number"
                name="rentCost"
                placeholder="대여 비용"
                className="w-full p-2 rounded"
                required
              />
              <input
                type="time"
                name="openingHours"
                className="w-full p-2 rounded"
                required
              />
              <input
                type="time"
                name="closingHours"
                className="w-full p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                구장 추가
              </button>
            </form>
          ) : selectedStadium ? (
            <div className="flex flex-col h-full">
              <div className="bg-gray-100 p-4 rounded mb-4 flex-shrink-0">
                <h2 className="text-2xl font-bold mb-4">구장 상세 정보</h2>
                <p>
                  <strong>이름:</strong> {selectedStadium.name}
                </p>
                <p>
                  <strong>주소:</strong> {selectedStadium.address}
                </p>
                <p>
                  <strong>전화번호:</strong> {selectedStadium.phone}
                </p>
                <p>
                  <strong>설명:</strong> {selectedStadium.description}
                </p>
                <p>
                  <strong>주차 가능:</strong>{" "}
                  {selectedStadium.parking ? "예" : "아니오"}
                </p>
                <p>
                  <strong>신발 대여:</strong>{" "}
                  {selectedStadium.shoeRent ? "예" : "아니오"}
                </p>
                <p>
                  <strong>공 대여:</strong>{" "}
                  {selectedStadium.ballRent ? "예" : "아니오"}
                </p>
                <p>
                  <strong>유니폼 대여:</strong>{" "}
                  {selectedStadium.uniformRent ? "예" : "아니오"}
                </p>
                <p>
                  <strong>대여 비용:</strong> {selectedStadium.rentCost}원
                </p>
                <p>
                  <strong>영업 시간:</strong> {selectedStadium.openingHours} -{" "}
                  {selectedStadium.closingHours}
                </p>
                <button
                  className="mt-4 bg-red-500 text-white p-2 rounded flex items-center"
                  onClick={handleDeleteStadium}
                >
                  <TrashIcon size={20} className="mr-2" />
                  구장 삭제
                </button>
              </div>
              <div className="flex-grow">
                <PostList stadiumUuid={selectedStadium.stadiumUuid} />
              </div>
            </div>
          ) : (
            <p>구장을 선택하거나 새 구장을 추가하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
