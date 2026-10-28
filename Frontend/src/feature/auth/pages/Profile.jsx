import React, { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../Componenet/Pageheader";
import ProfileEdit from "./ProfileEdit";
import "../style/profile.scss";
import { usePost } from "../../post/hook/usePost"
import { usefollow } from "../../follow/hook/usefollow";

const Profile = () => {
  const { user, loading, handleUpdateProfile, setUser } = useAuth();
  const { post,postsCount, handleGetUserPosts } = usePost()
  const {followStats}= usefollow()
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetUserPosts()
  }, [])

  if (loading) return <div className="loader">Loading...</div>;
  if (!user) return <div>Please login first</div>;

  return (
    <div className="profile-page">
      <PageHeader />

      {isEditing ? (
        <ProfileEdit
          user={user}
          setIsEditing={setIsEditing}
          handleUpdateProfile={handleUpdateProfile}
          setUser={setUser}
        />
      ) : (
        <>
          <div className="profile-view">
            <div className="profile-pic-section">
              <img
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-img"
              />
            </div>

            <div className="profile-info">
              <h2>{user.username}</h2>
              <p>{user.bio || "Web Developer 🚀"}</p>

              <div className="stats">
                <div><b>{postsCount}</b> Posts</div>
                <div><b>{followStats.followers}</b> Followers</div>
                <div><b>{followStats.following}</b> Following</div>
              </div>

              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>


          <div className="posts-section">
            {post?.length > 0 ? (
              <div className="posts-grid">
                {post.map((p) => (
                  <div
                    key={p._id}
                    className="post-item"
                    onClick={() => navigate(`/post/${p._id}`)}
                  >
                    <img src={p.images?.[0]} alt="post" />

                    {p.images?.length > 1 && (
                      <div className="overlay">
                        <span>1 / {p.images.length}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-post">No posts yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;