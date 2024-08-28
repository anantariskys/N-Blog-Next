"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
  
        setPosts(response.data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);


  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4 text-black">All Posts</h1>
      {error && <p className="text-red-500">{error}</p>}
      <section className="grid grid-cols-4 gap-3">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
         posts.length>0?(
            posts.map((post) => (
                <li key={post.id} className="border p-4 rounded-md shadow-sm">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p>{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Created at: {new Date(post.createdAt).toLocaleString()}
                  </p>
                </li>
              ))
         ):
         (
            <div>no post</div>
         )
        )}
      </section>
    </div>
  );
};

export default PostList;
