import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import "../style/userProfilePage.scss";
import PageHeader from "../../../Componenet/Pageheader"
import { usefollow } from "../../follow/hook/usefollow";

const UserProfilePage = () => {

    const { id } = useParams();

    const {
        handleGetUserById,
        profileUser,
        loading,
        profilePosts,
    } = useAuth();
    const { handleToggleFollow } = usefollow()
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowClick = async () => {
        try {
            await handleToggleFollow(profileUser._id);

            setIsFollowing(prev => !prev);

            await handleGetUserById(id);

        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {

        if (id) {
            handleGetUserById(id);
        }

    }, [id]);

    return (
        <div className="up-wrapper">
            <PageHeader />
            {
                loading && (
                    <div className="up-loader">
                        Loading...
                    </div>
                )
            }

            {
                !loading && !profileUser && (
                    <p className="up-loading-text">
                        User not found
                    </p>
                )
            }

            {
                profileUser && (

                    <div className="up-container">

                        <div className="up-header">

                            <img
                                src={profileUser.profileImage}
                                alt={profileUser.username}
                                className="up-avatar"
                            />

                            <div className="up-details">

                                <h2>{profileUser.username}

                                    <button
                                        className="follow-btn"
                                        onClick={handleFollowClick}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                </h2>

                                <p>{profileUser.email}</p>

                                <div className="up-stats">

                                    <div>
                                        <span>{profileUser.postsCount}</span>
                                        <p>Posts</p>
                                    </div>

                                    <div>
                                        <span>{profileUser.followersCount}</span>
                                        <p>Followers</p>
                                    </div>

                                    <div>
                                        <span>{profileUser.followingCount}</span>
                                        <p>Following</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="up-bio-box">

                            <h3>Bio</h3>

                            <p>
                                {profileUser.bio || "No bio added yet"}
                            </p>

                        </div>

                        <div className="up-post-grid">

                            {
                                profilePosts?.map((post) => (

                                    <div
                                        className="up-post-card"
                                        key={post._id}
                                    >

                                        <div className="up-scroll-container">

                                            {
                                                post.images?.map((img, index) => (

                                                    <div
                                                        className="up-image-wrapper"
                                                        key={index}
                                                    >

                                                        <img
                                                            src={img}
                                                            alt="post"
                                                            className="up-post-image"
                                                            loading="lazy"
                                                        />

                                                        {
                                                            post.images?.length > 1 && (

                                                                <div className="up-post-badge">
                                                                    {index + 1}/{post.images.length}
                                                                </div>

                                                            )
                                                        }

                                                    </div>

                                                ))
                                            }

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                )
            }

        </div>
    );
};

export default UserProfilePage;