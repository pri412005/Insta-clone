import React, { useEffect } from "react";
import "../style/rightsidebar.scss";
import { useAuth } from "../../auth/hook/useAuth"; 
import { useNavigate } from "react-router-dom";
import { usePost } from "../hook/usePost";
import { usefollow } from "../../follow/hook/usefollow";

const Rightsidebar = () => {
  const { user, handlegetCurrentUser, loading } = useAuth();
  const { post, postsCount, handleGetUserPosts } = usePost()
  const { followStats } = usefollow()

  useEffect(() => {
    if (!user) {
      handlegetCurrentUser();
    }
    handleGetUserPosts()
  }, []);

  const navigate = useNavigate();
  if (loading) {
    return <p>Loading sidebar...</p>;
  }
  return (
    <aside className="right-sidebar">

      <div className="current-user card">
        <div className="user-info">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-img"
          />
          <p className="username">{user?.username || "Loading..."}</p>
        </div>
        <span className="subtext">
          {user?.bio || "No bio available"}
        </span>
        <button className='button' onClick={() => navigate("/profile")}>Edit</button>
      </div>

      <div className="sidebar-card">
        <h3 className="sidebar-title">Your Stats</h3>

        <div className="stats">
          <div>
            <p className="stat-number">{postsCount}</p>
            <span>Posts</span>
          </div>
          <div>
            <p className="stat-number">{followStats.followers}</p>
            <span>Followers</span>
          </div>
          <div>
            <p className="stat-number">{followStats.following}</p>
            <span>Following</span>
          </div>
        </div>
      </div>


      <div className="sidebar-card">
        <div className="suggested-header">
          <h3 className="sidebar-title">Suggested for you</h3>
          <button className="see-all">See All</button>
        </div>


        <p className="empty-text">Suggestions coming soon...</p>
      </div>

      <div className="sidebar-card">
        <h3 className="sidebar-title">Recent Activity</h3>
        <p className="empty-text">No activity yet</p>
      </div>


      <div className="sidebar-footer">
        <p>About • Help • Press • API • Jobs • Privacy</p>
        <p className="copyright">© 2026 Pixora</p>
      </div>

    </aside>
  );
};

export default Rightsidebar;