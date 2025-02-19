'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaTimes, FaImage } from 'react-icons/fa';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  userId: string;
  username: string;
  createdAt: string;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Пожалуйста, введите текст поста');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newPost: Post = {
      id: Date.now().toString(),
      content: content.trim(),
      image: image || undefined,
      userId: user.id,
      username: user.username,
      createdAt: new Date().toISOString()
    };

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    localStorage.setItem('posts', JSON.stringify([newPost, ...posts]));

    toast.success('Пост успешно создан!');
    setContent('');
    setImage(null);
    onClose();
    window.location.href = '/';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Создать пост</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Что у вас нового?"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="image-upload"
                className="flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-600"
              >
                <FaImage size={20} />
                <span>Добавить изображение</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-48 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Опубликовать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}