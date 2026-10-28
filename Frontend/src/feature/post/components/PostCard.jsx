import { useState } from "react";
import { useAuth } from "../../auth/hook/useAuth";

import "../style/postcard.scss";
import { useComment } from "../../comments/hook/useComments";
import CommentModal from "../../comments/pages/CommentModal";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal
} from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { useEffect } from "react";

const PostCard = ({
  user,
  post,
  handleToggleLike,
  handleDeletePost,
  handleToggleSave
}) => {

  const { user: currentUser } = useAuth();
  const { handleGetCommentCount } = useComment();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const handleLikeClick = () => {
    handleToggleLike(post?._id, post?.isLiked);
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };
  useEffect(() => {
    async function fetchCount() {
      const count = await handleGetCommentCount(post?._id);
      setCommentCount(count);
    }

    if (post?._id) {
      fetchCount();
    }
  }, [post?._id]);

  return (
    <div className="post-card">

      <div className="post-header">

        <div className="user-info">

          <img
            className="profile-img"
            src={user?.profileImage || "/default-avatar.png"}
            alt={user?.username}
          />

          <span className="username">
            {user?.username}
          </span>

        </div>

        {
          user?._id === currentUser?._id && (
            <button
              className="more-btn"
              type="button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FiMoreHorizontal size={20} />
            </button>
          )
        }

      </div>

      <div className="post-image-wrapper">

        <div className="image-count">
          {currentIndex + 1} / {post?.images?.length}
        </div>

        <div
          className="post-image-scroll"
          onScroll={handleScroll}
        >
          {
            post?.images?.map((img, i) => (
              <img
                key={`${post?._id}-${i}`}
                src={img}
                alt={`post-${i}`}
              />
            ))
          }
        </div>

      </div>

      <div className="post-actions">

        <div className="left-actions">

          <button
            className="icon-btn"
            onClick={handleLikeClick}
          >
            <FiHeart
              className={
                post?.isLiked
                  ? "icon liked"
                  : "icon"
              }
            />

            <span className="counts-num">
              {post?.likesCount || 0}
            </span>
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowComments(true)}
          >
            <FiMessageCircle className="icon" />
            <span className="counts-num">
              {commentCount}
            </span>
          </button>

          <button className="icon-btn">
            <FiSend className="icon" />
          </button>
        </div>

        <button
          className="icon-btn"
          onClick={() => handleToggleSave(post?._id)}
        >
          {
            post?.isSaved
              ? <BsBookmarkFill className="icon saved" />
              : <FiBookmark className="icon" />
          }
        </button>

      </div>

      <div className="post-caption">

        <span className="username">
          {user?.username}
        </span>

        <span className="caption-text">
          {post?.caption}
        </span>

      </div>


      {
        showDeleteModal && (

          <div className="delete-modal-overlay">

            <div
              className="delete-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <h3>Delete Post?</h3>

              <p>
                This action cannot be undone.
              </p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={() => {
                    handleDeletePost(post?._id);
                    setShowDeleteModal(false);
                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )
      }


      {
        showComments && (
          <CommentModal
            postId={post?._id}
            onClose={() => setShowComments(false)}
            onCommentAdded={() =>
              setCommentCount(prev => prev + 1)
            }
          />
        )
      }

    </div>
  );
};

export default PostCard;