'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes: string[];
}

interface PostContextType {
  posts: Post[];
  addPost: (content: string, userId: string, username: string) => void;
  editPost: (postId: string, content: string) => void;
  deletePost: (postId: string) => void;
  toggleLike: (postId: string, userId: string) => void;
}

const PostContext = createContext<PostContextType | null>(null);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    localStorage.setItem('posts', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const addPost = (content: string, userId: string, username: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId,
      username,
      content,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };
    savePosts([newPost, ...posts]);
  };

  const editPost = (postId: string, content: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          content
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    savePosts(updatedPosts);
  };

  const toggleLike = (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId);
        const updatedLikes = hasLiked
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];

        return {
          ...post,
          likes: updatedLikes
        };
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, editPost, deletePost, toggleLike }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}