import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePost } from "../hook/usePost";
import "../style/postdetails.scss";
import { FiMoreHorizontal} from "react-icons/fi";
import BackButton from "../../../Componenet/Pageheader";

const PostDetails = () => {
  const { postid } = useParams();
  const { handleGetPostDetails, handleDeletePost, loading, handleToggleLike } = usePost();

  const [post, setPost] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await handleGetPostDetails(postid);
      console.log(res);
      setPost(res.data);
    };
    fetchPost();
  }, [postid]);

  const handleDelete = async () => {
    const res = await handleDeletePost(post._id);

    if (res?.status) {
      alert("Post deleted successfully ✅");
      navigate("/");
    } else {
      alert("Delete failed ❌");
    }
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    setCurrentIndex(index);
  };

  if (loading) return <h2>Loading...</h2>;
  if (!post) return <h2>No Post Found</h2>;

  return (
    <div className="post-details">
      <BackButton />

      <div className="post-header">
        <div className="leftheader">
          <img src={post.user?.profileImage} alt="" />
          <span>{post.user?.username}</span>
        </div>

        <div className="rightheader">
          <div className="post-menu">
            <button onClick={() => setShowMenu(!showMenu)}>
              <FiMoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div className="dropdown">
                <button
                  className="delete-btn"
                  onClick={() => {
                    setShowMenu(false);
                    setShowModal(true);
                  }}
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="slider-wrapper">
        <div
          className="slider"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {post.images.map((img, i) => (
            <img key={i} src={img} alt="post" />
          ))}
        </div>

        <div className="dots">
          {post.images.map((_, i) => (
            <span
              key={i}
              className={i === currentIndex ? "dot active" : "dot"}
            ></span>
          ))}
        </div>
      </div>

      <div className="content">
        <p><b>{post.user?.username}</b> {post.caption}</p>
        <p><b>{post?.likesCount || 0} likes</b></p>
        <p className="date">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Post?</h3>
            <p>Are you sure you want to delete this post?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostDetails;