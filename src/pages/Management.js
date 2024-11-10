import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon, SaveIcon } from "lucide-react";
import Header from "../components/ui/Header";
import PostList from "./Posts";

export default function StadiumManagement() {
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

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
      if (data.isSuccess && !data.httpStatus.error) {
        setStadiums(data.result);
      } else {
        alert("구장 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching stadiums:", error);
      alert("구장 목록 불러오기 중 오류가 발생했습니다.");
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
      if (data.isSuccess && !data.httpStatus.error) {
        setSelectedStadium(data.result);
        setEditForm(data.result);
      } else {
        alert("구장 상세 정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching stadium detail:", error);
      alert("구장 상세 정보 불러오기 중 오류가 발생했습니다.");
    }
  };

  const handleAddStadium = async e => {
    e.preventDefault();
    const newStadium = {
      stadiumName: e.target.stadiumName.value,
      address: e.target.address.value,
      phone: e.target.phone.value,
      description: e.target.description.value,
      parking: e.target.parking.checked,
      shoeRent: e.target.shoeRent.checked,
      ballRent: e.target.ballRent.checked,
      uniformRent: e.target.uniformRent.checked,
      rentCost: parseInt(e.target.rentCost.value, 10),
      openingHours: e.target.openingHours.value,
      closingHours: e.target.closingHours.value,
    };
    console.log(newStadium);
    try {
      const response = await fetch("http://localhost:9090/api/host/stadium", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStadium),
      });
      const data = await response.json();
      if (data.isSuccess) {
        alert("구장이 성공적으로 추가되었습니다.");
        setIsAdding(false);
        fetchStadiums();
      } else {
        alert("구장 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding stadium:", error);
      alert("구장 추가 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteStadium = async stadiumUuid => {
    if (!window.confirm("정말로 이 구장을 삭제하시겠습니까?")) return;
    try {
      const response = await fetch("http://localhost:9090/api/host/stadium", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stadiumUuid }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        alert("구장이 성공적으로 삭제되었습니다.");
        setSelectedStadium(null);
        fetchStadiums();
      } else {
        alert("구장 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting stadium:", error);
      alert("구장 삭제 중 오류가 발생했습니다.");
    }
  };

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({ ...selectedStadium });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    const updatedData = {
      ...editForm,
      stadiumUuid: selectedStadium.stadiumUuid,
    };
    try {
      const response = await fetch("http://localhost:9090/api/host/stadium", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (data.isSuccess) {
        alert("구장 정보가 수정되었습니다.");
        setIsEditing(false);
        fetchStadiumDetail(selectedStadium.stadiumUuid);
        fetchStadiums();
      } else {
        alert("구장 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating stadium:", error);
      alert("구장 정보 수정 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchStadiums();
  }, []);

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
                className="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
              >
                <span
                  className="flex-1 cursor-pointer"
                  onClick={() => fetchStadiumDetail(stadium.stadiumUuid)}
                >
                  {stadium.name}
                </span>
                <button
                  className="p-1 rounded hover:bg-gray-300"
                  onClick={() => handleDeleteStadium(stadium.stadiumUuid)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded flex items-center justify-center"
            onClick={() => setIsAdding(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> 구장 추가
          </button>
        </div>

        <div className="w-2/3 p-4 overflow-y-auto">
          {isAdding ? (
            <form
              onSubmit={handleAddStadium}
              className="space-y-4 bg-gray-100 p-4 rounded"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">구장 이름</label>
                  <input
                    name="stadiumName"
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">주소</label>
                  <input
                    name="address"
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">전화번호</label>
                  <input
                    name="phone"
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">대여 비용</label>
                  <input
                    name="rentCost"
                    type="number"
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1">설명</label>
                  <textarea
                    name="description"
                    required
                    className="border p-2 rounded w-full min-h-[100px]"
                  />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">영업 시작 시간</label>
                    <input
                      name="openingHours"
                      type="time"
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">영업 종료 시간</label>
                    <input
                      name="closingHours"
                      type="time"
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </div>
                <div className="col-span-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="parking"
                      id="parking"
                      className="w-4 h-4"
                    />
                    <label htmlFor="parking">주차 가능</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="shoeRent"
                      id="shoeRent"
                      className="w-4 h-4"
                    />
                    <label htmlFor="shoeRent">신발 대여</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="ballRent"
                      id="ballRent"
                      className="w-4 h-4"
                    />
                    <label htmlFor="ballRent">공 대여</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="uniformRent"
                      id="uniformRent"
                      className="w-4 h-4"
                    />
                    <label htmlFor="uniformRent">유니폼 대여</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                  onClick={() => setIsAdding(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
                >
                  구장 추가
                </button>
              </div>
            </form>
          ) : selectedStadium ? (
            <div className="flex flex-col h-full">
              <div className="bg-gray-100 p-4 rounded mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">구장 상세 정보</h2>
                  {!isEditing && (
                    <button
                      className="border px-4 hover:bg-gray-200 flex items-center"
                      onClick={startEditing}
                    >
                      <PencilIcon className="mr-2 h-4 w-4" /> 수정하기
                    </button>
                  )}
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label>이름</label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={e =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        disabled={!isEditing}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label>주소</label>
                      <input
                        type="text"
                        value={editForm.address || ""}
                        onChange={e =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        disabled={!isEditing}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label>전화번호</label>
                      <input
                        type="text"
                        value={editForm.phone || ""}
                        onChange={e =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div className="col-span-2">
                      <label>설명</label>
                      <textarea
                        value={editForm.description || ""}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="border p-2 rounded w-full min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center gap-4 col-span-2">
                      <div>
                        <label>주차 가능</label>
                        <input
                          type="checkbox"
                          checked={editForm.parking || false}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              parking: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label>신발 대여</label>
                        <input
                          type="checkbox"
                          checked={editForm.shoeRent || false}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              shoeRent: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label>공 대여</label>
                        <input
                          type="checkbox"
                          checked={editForm.ballRent || false}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              ballRent: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label>유니폼 대여</label>
                        <input
                          type="checkbox"
                          checked={editForm.uniformRent || false}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              uniformRent: e.target.checked,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label>대여 비용</label>
                      <input
                        type="number"
                        value={editForm.rentCost || 0}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            rentCost: parseInt(e.target.value, 10),
                          })
                        }
                        disabled={!isEditing}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <label>영업 시작 시간</label>
                        <input
                          type="time"
                          value={editForm.openingHours || ""}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              openingHours: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label>영업 종료 시간</label>
                        <input
                          type="time"
                          value={editForm.closingHours || ""}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              closingHours: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="border p-2 rounded w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 justify-end mt-4">
                      <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                        onClick={cancelEditing}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
                      >
                        <SaveIcon className="mr-2 h-4 w-4" /> 저장
                      </button>
                    </div>
                  )}
                </form>
              </div>
              <PostList stadiumUuid={selectedStadium.stadiumUuid} />
            </div>
          ) : (
            <p>구장을 선택하거나 새 구장을 추가하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
