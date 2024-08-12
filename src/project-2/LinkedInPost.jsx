import React, { useState, useRef } from "react";
import "./LinkedInPost.css";

const MAX_CHARACTERS = 1300;
const MAX_IMAGES = 9;
const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif"],
  video: ["video/mp4", "video/quicktime"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

const LinkedInPost = () => {
  const [post, setPost] = useState("");
  const [media, setMedia] = useState([]);
  const [error, setError] = useState("");
  const [submittedPost, setSubmittedPost] = useState(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const fileInputRef = useRef(null);

  const handlePostChange = (e) => {
    setPost(e.target.value);
    setError("");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (media.length + files.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} files.`);
      return;
    }

    const validFiles = files.filter((file) =>
      Object.values(ALLOWED_FILE_TYPES).flat().includes(file.type)
    );

    if (validFiles.length !== files.length) {
      setError(
        "Some files were not added. Only images, videos, and documents are allowed."
      );
    }

    setMedia([
      ...media,
      ...validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
    setError("");
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    URL.revokeObjectURL(newMedia[index].preview);
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const handleSubmit = () => {
    if (post.trim().length === 0 && media.length === 0) {
      setError("Post cannot be empty. Please add text or media.");
      return;
    }
    if (post.length > MAX_CHARACTERS) {
      setError(`Post exceeds maximum character limit of ${MAX_CHARACTERS}.`);
      return;
    }
    setSubmittedPost({
      text: post,
      media: media,
      likes: 0,
      comments: [],
      reposts: 0,
      isLiked: false,
      isReposted: false,
    });
    setPost("");
    setMedia([]);
  };

  const handleLike = () => {
    setSubmittedPost((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const handleComment = () => {
    setIsCommentDialogOpen(true);
  };

  const submitComment = () => {
    if (comment.trim()) {
      setSubmittedPost((prev) => ({
        ...prev,
        comments: [...prev.comments, comment],
      }));
      setComment("");
      setIsCommentDialogOpen(false);
    }
  };

  const handleRepost = () => {
    setSubmittedPost((prev) => ({
      ...prev,
      reposts: prev.isReposted ? prev.reposts - 1 : prev.reposts + 1,
      isReposted: !prev.isReposted,
    }));
  };

  const handleShare = () => {
    alert("Post shared!");
  };

  const PostPreview = ({ post }) => (
    <div className="post-preview">
      <div className="post-header">
        <div className="profile-pic"></div>
        <div>
          <h3>Your Name</h3>
          <p>Your Headline • Just now</p>
        </div>
      </div>
      <p className="post-content">{post.text}</p>
      {post.media.length > 0 && (
        <div className="media-grid">
          {post.media.map((item, index) => (
            <div key={index} className="media-item">
              {item.file.type.startsWith("image/") ? (
                <img src={item.preview} alt="Preview" />
              ) : (
                <div className="file-preview">{item.file.name}</div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="post-stats">
        <span>{post.likes} likes</span>
        <span>{post.comments.length} comments</span>
        <span>{post.reposts} reposts</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className={post.isLiked ? "active" : ""}>
          Like
        </button>
        <button onClick={handleComment}>Comment</button>
        <button
          onClick={handleRepost}
          className={post.isReposted ? "active" : ""}
        >
          Repost
        </button>
        <button onClick={handleShare}>Send</button>
      </div>
      {post.comments.length > 0 && (
        <div className="comments-section">
          <h4>Comments</h4>
          {post.comments.map((comment, index) => (
            <p key={index} className="comment">
              {comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="linkedin-post">
      <textarea
        value={post}
        onChange={handlePostChange}
        placeholder="What do you want to talk about?"
        className="post-input"
      />
      {media.length > 0 && (
        <div className="media-preview">
          {media.map((item, index) => (
            <div key={index} className="media-item">
              {item.file.type.startsWith("image/") ? (
                <img src={item.preview} alt="Preview" />
              ) : (
                <div className="file-preview">{item.file.name}</div>
              )}
              <button
                onClick={() => removeMedia(index)}
                className="remove-media"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="post-actions">
        <div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="add-media"
          >
            Add Media
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept={Object.values(ALLOWED_FILE_TYPES).flat().join(",")}
            multiple
            style={{ display: "none" }}
          />
          <span
            className={
              post.length > MAX_CHARACTERS ? "char-count error" : "char-count"
            }
          >
            {post.length}/{MAX_CHARACTERS}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={
            (post.length === 0 && media.length === 0) ||
            post.length > MAX_CHARACTERS
          }
          className="post-button"
        >
          Post
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {submittedPost && <PostPreview post={submittedPost} />}

      {isCommentDialogOpen && (
        <div className="comment-dialog">
          <div className="comment-dialog-content">
            <h2>Add a comment</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="comment-input"
            />
            <div className="dialog-actions">
              <button onClick={() => setIsCommentDialogOpen(false)}>
                Cancel
              </button>
              <button onClick={submitComment}>Submit Comment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInPost;
