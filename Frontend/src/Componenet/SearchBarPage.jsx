import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import FormGroup from "./FormGroup";
import { getAllUsersApi } from "../feature/auth/services/auth.api";
import PageHeader from "../Componenet/Pageheader"
import "../feature/auth/style/searchBarPage.scss";

const SearchBarPage = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const activeSearchText = useRef(""); 
    const navigate = useNavigate();

    const handleGetAllUsers = async (searchText = "", page = 1, limit = 10) => {
        try {
            setLoading(true);
            activeSearchText.current = searchText; 

            const data = await getAllUsersApi(searchText, page, limit);
   
            if (activeSearchText.current === searchText) {
                if (data?.users) {
                    setUsers(data.users);
                } else {
                    setUsers([]);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (activeSearchText.current === searchText) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {

        if (!search.trim()) {
            setUsers([]);
            setLoading(false);
            activeSearchText.current = "";
            return;
        }

        const delay = setTimeout(() => {
            handleGetAllUsers(search.trim());
        }, 350);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <div className="search-page">
          <PageHeader/>

            <div className="search-header">
                <h2>Search</h2>

                <div className="search-box">
                    {loading ? (
                        <div className="search-spinner"></div>
                    ) : (
                        <FiSearch className="search-icon" />
                    )}

                    <FormGroup
                        label=""
                        type="text"
                        placeholder="Search username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {!loading && search.trim() && users.length === 0 && (
                <p className="empty-text">No results found.</p>
            )}

            <div className="search-results" style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s ease' }}>
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="search-user-card"
                        onClick={() => navigate(`/user/${user._id}`)}
                    >
                        <div className="avatar">
                            <img
                                src={user.profileImage || "https://via.placeholder.com/150"}
                                alt={user.username}
                            />
                        </div>

                        <div className="user-info">
                            <h4>{user.username}</h4>
                            <p>{user.email || `@${user.username}`}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchBarPage;