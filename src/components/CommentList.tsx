import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addComment, removeComment, updateProduct } from "../app/productsSlice";
import { type Comment, type CommentListProps } from "../types/type";

const CommentList = ({ productId, comments }: CommentListProps) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState<Comment[]>(comments);

  useEffect(() => {
    fetch(`http://localhost:3001/comments?productId=${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
      })
      .then((data) => setAllComments(data))
      .catch((err) => alert(err.message));
  }, [productId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    const comment = {
      id: Date.now(),
      productId,
      description: newComment,
      date: new Date().toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };

    fetch("http://localhost:3001/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add comment");
        return res.json();
      })
      .then((data) => {
        dispatch(addComment(data));
        setAllComments([...allComments, data]);

        fetch(`http://localhost:3001/products/${productId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
          })
          .then((product) => {
            const updatedProduct = {
              ...product,
              comments: [...product.comments, data],
            };
            return fetch(`http://localhost:3001/products/${productId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedProduct),
            });
          })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to update product comments");
            return res.json();
          })
          .then((updatedProduct) => {
            dispatch(updateProduct(updatedProduct));
            setNewComment("");
          })
          .catch((err) => alert(err.message));
      })
      .catch((err) => alert(err.message));
  };

  const handleDeleteComment = (commentId: number) => {
    fetch(`http://localhost:3001/comments/${commentId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete comment");
        dispatch(removeComment({ productId, commentId }));
        setAllComments(allComments.filter((c) => c.id !== commentId));

        fetch(`http://localhost:3001/products/${productId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
          })
          .then((product) => {
            const updatedProduct = {
              ...product,
              comments: product.comments.filter(
                (c: Comment) => c.id !== commentId
              ),
            };
            return fetch(`http://localhost:3001/products/${productId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedProduct),
            });
          })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to update product comments");
            return res.json();
          })
          .then((updatedProduct) => {
            dispatch(updateProduct(updatedProduct));
          })
          .catch((err) => alert(err.message));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="comment-list">
      <h3>Comments</h3>
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add</button>
      </form>
      {allComments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="comment-list-items">
          {allComments.map((comment) => (
            <li key={comment.id} className="comment-item">
              {comment.description} ({comment.date})
              <button onClick={() => handleDeleteComment(comment.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CommentList;
