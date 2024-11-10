import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { postUuid } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/api/host/post/${postUuid}`
        );
        const data = await response.json();
        if (data.isSuccess) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </button>
        <div className="card">
          <div className="card-content">
            <p className="text-center text-muted-foreground">
              게시글을 찾을 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <button onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        뒤로 가기
      </button>
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl">{post.title}</h2>
          <p>
            작성일: {format(new Date(post.createDate), "yyyy-MM-dd HH:mm")}
            {post.updatedDate !== post.createDate && (
              <>
                {" "}
                | 수정일:{" "}
                {format(new Date(post.updatedDate), "yyyy-MM-dd HH:mm")}
              </>
            )}
          </p>
        </div>
        <div className="card-content">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
        <div className="card-footer text-sm text-muted-foreground">
          작성자: {post.authorName}
        </div>
      </div>
    </div>
  );
}
