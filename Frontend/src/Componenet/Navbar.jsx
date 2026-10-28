import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlusSquare,
  FiBell,
  FiUser,
} from "react-icons/fi";

import "../feature/shared/style/navbar.scss";
import { useNotification } from "../feature/notification/hook/useNotification";
import { socket } from "../socket/socket";
import { usefollow } from "../feature/follow/hook/usefollow.js";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    unreadCount,
    handleGetUnreadCount
  } = useNotification();

  const {pendingRequests,setPendingRequests} = usefollow()

  useEffect(() => {
    handleGetUnreadCount();
    socket.on("newNotification", () => {
      handleGetUnreadCount();
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <img src="/logo.png" alt="Pixora logo" className="logo-img" />
        <span>Pixora</span>
      </div>

      {/* Actions */}
      <div className="nav-actions">

        <button
          type="button"
          className="icon-btn search-trigger"
          aria-label="Open search"
          onClick={() => navigate("/search")}
        >
          <FiSearch />
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="Create post"
          onClick={() => navigate("/create-post")}
        >
          <FiPlusSquare />
        </button>


        <button
          type="button"
          className="icon-btn notification-btn"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <FiBell />

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className="profile-btn"
          aria-label="Account"
          onClick={() => navigate("/profile")}
        >
          <FiUser />
        </button>
      </div>

    </nav>
  );
};

export default Navbar;