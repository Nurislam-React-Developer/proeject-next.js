'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from 'react-icons/fa';
import Header from '../components/Header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  imageUrl: string;
  likes: string[];

  createdAt: string;
}

export default function Feed() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { posts, addPost, editPost, deletePost, toggleLike } = usePosts();
  const [newPost, setNewPost] = useState({ content: '', imageUrl: '' });
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error('Пожалуйста, войдите в систему');
      return;
    }

    if (newPost.content.trim()) {
      addPost(newPost.content, user.id, user.username);
      setNewPost({ content: '', imageUrl: '' });
      toast.success('Пост создан!');
      router.refresh();
    }
  };

  const handleLike = (postId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Пожалуйста, войдите в систему');
      return;
    }

    toggleLike(postId, user.id);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = (postId: string) => {
    if (editContent.trim()) {
      editPost(postId, editContent);
      setEditingPost(null);
      setEditContent('');
      toast.success('Пост обновлен!');
    }
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      deletePost(postId);
      toast.success('Пост удален!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <p className="text-center text-gray-600">Пожалуйста, войдите в систему, чтобы просматривать ленту</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <form onSubmit={handleCreatePost} className="bg-white rounded-lg shadow p-6 mb-8">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="Что у вас нового?"
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <input
            type="text"
            value={newPost.imageUrl}
            onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
            placeholder="URL изображения (необязательно)"
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Опубликовать
          </button>
        </form>

        {posts.length === 0 ? (
          <div className="text-center py-4">Загрузка...</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="font-semibold">{post.username}</div>
                    <div className="text-gray-500 text-sm ml-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {editingPost === post.id ? (
                    <div className="mb-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSaveEdit(post.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-4">{post.content}</p>
                  )}
                  {post.imageUrl && (
                    <div className="relative h-64 mb-4">
                      <Image
                        src={post.imageUrl}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
                      >
                        {post.likes.includes(user?.id || '') ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span>{post.likes.length}</span>
                      </button>
                    </div>
                    {post.userId === user?.id && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}