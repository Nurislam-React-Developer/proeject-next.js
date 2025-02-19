'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Post {
  id: number;
  content: string;
  author: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: 'Привет всем! Это мой первый пост в нашей социальной сети! 👋',
      author: 'Алекс',
      imageUrl: '/next.svg',
      likes: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      content: 'Отличный день для новых открытий! 🌟',
      author: 'Мария',
      likes: 3,
      createdAt: new Date().toISOString()
    }
  ]);
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: posts.length + 1,
      content: newPostContent,
      author: 'Пользователь',
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Социальная сеть</h1>
        
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Что у вас нового?"
            className="w-full p-2 border rounded-lg mb-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreatePost}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Опубликовать
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">{post.author[0]}</span>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">{post.author}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4">{post.content}</p>
              
              {post.imageUrl && (
                <div className="mb-4">
                  <Image
                    src={post.imageUrl}
                    alt="Post image"
                    width={500}
                    height={300}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between text-gray-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 hover:text-blue-500 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{post.likes}</span>
                </button>
                
                <button className="hover:text-blue-500 transition">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
