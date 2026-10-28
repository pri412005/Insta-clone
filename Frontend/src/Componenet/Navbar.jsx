import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlusSquare,
  FiBell,
  FiUser,
  FiChevronDown,
  FiLogOut
} from "react-icons/fi";

import "../feature/shared/style/navbar.scss";
import { useNotification } from "../feature/notification/hook/useNotification";
import { useAuth } from "../feature/auth/hook/useAuth"
import { socket } from "../socket/socket";
import { usefollow } from "../feature/follow/hook/usefollow.js";

const Navbar = () => {
  const navigate = useNavigate();
  const { unreadCount, handleGetUnreadCount, } = useNotification();
  const { handleLogout, authLoading } = useAuth()
  const [showMenu, setShowMenu] = useState(false);

  const onLogout = async () => {
    const result = await handleLogout();

    if (result) {
      setShowMenu(false);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar">

      <div className="logo">
        <img src="/logo.png" alt="Pixora logo" className="logo-img" />
        <span>Pixora</span>
      </div>

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

        <div className="profile-menu">
          <button
            type="button"
            className="profile-btn"
            aria-label="Account menu"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FiUser />
            <FiChevronDown />
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
              >
                <FiUser />
                View Profile
              </button>
              <button
                type="button"
                disabled={authLoading}
                onClick={onLogout}
              >
                <FiLogOut />
                {authLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;