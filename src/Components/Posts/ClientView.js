import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './PostList';

export default function PostContainer() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://laraproject.test/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return <PostList posts={posts} />;
}
