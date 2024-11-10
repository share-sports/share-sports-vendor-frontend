import { useState, useEffect } from "react";
import { PencilIcon, Trash2Icon, InfoIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

// 게시글 관리 컴포넌트
export default function PostList({ stadiumUuid }) {
  const [posts, setPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [stadiumUuid]);

  // 게시글 목록 가져오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/host/post/list/${stadiumUuid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setPosts(data.result);
      } else {
        console.error("Failed to fetch posts:", data.message);
        alert("게시글 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("게시글 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 게시글 생성/수정 요청 처리
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get("title"),
      content: formData.get("content"),
      stadiumUuid,
    };

    const url = "http://localhost:9090/api/host/post";
    const method = selectedPost ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...postData,
          ...(selectedPost && { postUuid: selectedPost.postUuid }),
        }),
      });
      const data = await response.json();

      if (data.isSuccess) {
        alert(
          selectedPost ? "게시글이 수정되었습니다." : "게시글이 생성되었습니다."
        );
        setIsDialogOpen(false);
        setSelectedPost(null);
        fetchPosts(); // 게시글 목록을 다시 불러옴
      } else {
        console.error("Failed to save post:", data.message);
        alert("게시글 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("게시글 저장 중 오류가 발생했습니다.");
    }
  };

  // 게시글 삭제 요청 처리
  const handleDelete = async postUuid => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://localhost:9090/api/host/post/${postUuid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      if (data.isSuccess) {
        alert("게시글이 삭제되었습니다.");
        setPosts(posts.filter(post => post.postUuid !== postUuid));
      } else {
        console.error("Failed to delete post:", data.message);
        alert("게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "날짜 없음";
      }
      return format(date, "yyyy-MM-dd HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "날짜 없음";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">게시글 관리</h2>
          <button
            className="rounded-full p-2"
            onClick={() => alert("게시글 관리 정보를 표시합니다.")}
          >
            <InfoIcon className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => {
            setSelectedPost(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <PlusIcon className="mr-2 h-4 w-4" />새 게시글 작성
        </button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.postUuid} className="border p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-medium">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  작성일: {formatDate(post.createDate)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1 rounded border border-gray-300 hover:bg-gray-200"
                  onClick={() => {
                    setSelectedPost(post);
                    setIsDialogOpen(true);
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  className="p-1 rounded border border-gray-300 hover:bg-gray-200"
                  onClick={() => handleDelete(post.postUuid)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedPost ? "게시글 수정" : "새 게시글 작성"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium">
                  제목
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={selectedPost?.title || ""}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium">
                  내용
                </label>
                <textarea
                  id="content"
                  name="content"
                  defaultValue={selectedPost?.content || ""}
                  required
                  className="w-full p-2 border rounded min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {selectedPost ? "수정하기" : "작성하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
