import PostCard from "../components/PostCard";
import { usePost } from "../hook/usePost";
import '../style/feed.scss'

const FeedPage = () => {

  const { feed, loading, handleToggleLike, handleDeletePost, handleToggleSave } = usePost();


  if (loading) {
    return (
      <div className="feed-loading">
        <p>Loading posts...</p>
      </div>
    );
  }
  return (
    <>
      <main className="feed-page">
        <div className="feed-container">

          {feed?.length === 0 ? (
            <p className="empty-feed">No posts yet</p>
          ) : (
            feed.map((post, index) => {

              return (
                <PostCard
                  key={post?._id || index}
                  user={post.user}
                  post={post}
                  handleToggleLike={handleToggleLike}
                  handleDeletePost={handleDeletePost}
                  handleToggleSave={handleToggleSave}
                />
              )
            })
          )}

        </div>

      </main>
    </>
  );
};

export default FeedPage;