import { useState, useEffect } from "react";
import { PencilIcon, Trash2Icon, InfoIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";

export default function PostList({ stadiumUuid = "example-uuid" }) {
  const [posts, setPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // 게시글 목록 조회 함수
  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/host/post/list?stadiumUuid=${stadiumUuid}&postType=NOTICE`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.isSuccess && !data.httpStatus.error) {
        setPosts(data.result);
      } else {
        alert("게시글 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("게시글 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [stadiumUuid]);

  // 게시글 삭제 함수
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
      if (data.isSuccess && !data.httpStatus.error) {
        alert("게시글이 삭제되었습니다.");
        setPosts(posts.filter(post => post.postUuid !== postUuid));
      } else {
        alert("게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 게시글 생성 또는 수정 함수
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get("title"),
      content: formData.get("content"),
      stadiumUuid,
      postType: "NOTICE",
    };
    const url = selectedPost
      ? "http://localhost:9090/api/host/post"
      : "http://localhost:9090/api/host/post";
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
      if (data.isSuccess && !data.httpStatus.error) {
        alert(
          selectedPost ? "게시글이 수정되었습니다." : "게시글이 생성되었습니다."
        );
        setIsDialogOpen(false);
        setSelectedPost(null);
        fetchPosts(); // 게시글 목록을 다시 불러옵니다.
      } else {
        alert("게시글 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("게시글 저장 중 오류가 발생했습니다.");
    }
  };

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "날짜 없음"
        : format(date, "yyyy-MM-dd HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "날짜 없음";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">공지 관리</h2>
          <InfoIcon
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={() => alert("공지 관리 정보를 표시합니다.")}
          />
        </div>
        <button
          onClick={() => {
            setSelectedPost(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <PlusIcon className="mr-2 h-4 w-4" />새 게시글 작성
        </button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div
            key={post.postUuid}
            className="border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  작성자: {post.authorName} | 작성일:{" "}
                  {formatDate(post.createdDate)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1 border border-gray-300 rounded hover:bg-gray-200"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedPost(post);
                    setIsDialogOpen(true);
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  className="p-1 border border-gray-300 rounded hover:bg-gray-200"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(post.postUuid);
                  }}
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* 본문 내용을 진하게 하고 폰트 크기를 크게 변경 */}
            <p className="text-lg font-medium text-gray-800 whitespace-pre-wrap mt-2">
              {post.content}
            </p>
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
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
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
