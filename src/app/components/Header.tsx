'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CreatePostModal from './CreatePostModal';
import { FaPlus } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
              GamePortal
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
              Главная
            </Link>
            {user ? (
              <>
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium"
                >
                  <FaPlus size={14} />
                  <span>Создать пост</span>
                </button>
                <Link href="/profile" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Выйти
                </button>
                <CreatePostModal
                  isOpen={isCreatePostModalOpen}
                  onClose={() => setIsCreatePostModalOpen(false)}
                />
              </>
            ) : (
              <>
                <Link href="/signin" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                  Войти
                </Link>
                <Link href="/signup" className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium">
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}