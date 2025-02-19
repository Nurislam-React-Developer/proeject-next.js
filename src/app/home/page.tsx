'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import Header from '../components/Header';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { posts, addPost, addComment, toggleLike } = usePosts();
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      addPost(newPost, user.id, user.username);
      setNewPost('');

    }
  };

  const handleCommentSubmit = (postId: string) => {
    const comment = commentText[postId];
    if (comment?.trim()) {
      addComment(postId, comment, user.id, user.username);
      setCommentText(prev => ({ ...prev, [postId]: '' }));

    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <form onSubmit={handlePostSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Что у вас нового?"
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Опубликовать
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="font-semibold text-lg">{post.username}</div>
                  <div className="text-gray-500 text-sm ml-2">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike(post.id, user.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
                  >
                    {(post.likes || []).includes(user.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{(post.likes || []).length}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
                  >
                    <FaComment />
                    <span>{(post.comments || []).length}</span>
                  </button>
                </div>

                {showComments[post.id] && (
                  <div className="mt-4">
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded">
                          <div className="flex items-center mb-1">
                            <span className="font-medium">{comment.username}</span>
                            <span className="text-gray-500 text-sm ml-2">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex">
                      <input
                        type="text"
                        value={commentText[post.id] || ''}
                        onChange={(e) =>
                          setCommentText(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))
                        }
                        placeholder="Написать комментарий..."
                        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Отправить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}