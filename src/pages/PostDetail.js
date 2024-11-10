"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Edit2, Trash2, User } from "lucide-react";
import { format } from "date-fns";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { postUuid } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/api/host/post/${postUuid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess && !data.httpStatus.error) {
          setPost(data.result);
        } else {
          throw new Error(data.message || "Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postUuid]);

  const handleEdit = () => {
    navigate(`/edit-post/${postUuid}`);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsDeleting(true);
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
        alert("게시글이 성공적으로 삭제되었습니다.");
        navigate("/posts");
      } else {
        throw new Error(data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <button
          className="flex items-center text-gray-500 mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
        <div className="border rounded-lg shadow p-4">
          <div className="border-b pb-4 mb-4">
            <div className="h-8 w-3/4 bg-gray-200 mb-2 animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="h-4 w-1/3 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <button
          className="flex items-center text-gray-500 mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
        <div className="border rounded-lg shadow p-8 text-center text-gray-500">
          게시글을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <header className="flex items-center justify-between mb-6">
        <button
          className="flex items-center text-gray-500"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
        <h1 className="text-xl font-bold">{post.title}</h1>
      </header>
      <div className="border rounded-lg shadow overflow-hidden">
        <div className="border-b bg-gray-100 p-4">
          <div className="text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <time dateTime={post.createdDate}>
                {format(new Date(post.createdDate), "yyyy년 MM월 dd일 HH:mm")}
              </time>
            </div>
            {post.updatedDate !== post.createdDate && (
              <div className="flex items-center mt-2">
                <Edit2 className="mr-2 h-4 w-4" />
                <time dateTime={post.updatedDate}>
                  수정:{" "}
                  {format(new Date(post.updatedDate), "yyyy년 MM월 dd일 HH:mm")}
                </time>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>
        <div className="border-t bg-gray-100 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center">
            <User className="mr-2 h-4 w-4" />
            작성자: {post.authorName}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Edit2 className="mr-1 h-4 w-4" />
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 border border-red-500 rounded bg-red-500 text-white hover:bg-red-600 flex items-center"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
