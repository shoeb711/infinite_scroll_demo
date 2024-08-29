import { useEffect, useRef, useState } from "react";
import "./App.css";
import { fetchPosts } from "./services";
import { useCallback } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  const loadMorePosts = async () => {
    setLoading(true);
    const newPosts = await fetchPosts(page, 10);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setLoading(false);
  };

  useEffect(() => {
    loadMorePosts();
  }, [page]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return; // If loading, do nothing
      if (observer.current) observer.current.disconnect(); // Disconnect previous observer if exists

      // Create new IntersectionObserver
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // When last post element comes into view
          setPage((prevPage) => prevPage + 1); // Increment page to load more posts
        }
      });

      // If node exists, observe it
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  // console.log(posts, "posts");

  return (
    <div>
      <h1>Your Feed</h1>
      <ul>
        {posts.map((post, index) => (
          <li
            key={post.id}
            ref={posts.length === index + 1 ? lastPostElementRef : null} //Set ref for last post element
          >
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
