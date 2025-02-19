'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

interface EditedUser {
  username: string;
  email: string;
  bio: string;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
  };
  theme: 'light' | 'dark';
  avatarColor: string;
}

export default function Profile() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<EditedUser>({
    username: '',
    email: '',
    bio: '',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: ''
    },
    theme: 'light',
    avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16)
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    } else if (user) {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setEditedUser({
          ...parsedData,
          username: user.username,
          email: user.email
        });
      } else {
        setEditedUser({
          ...editedUser,
          username: user.username,
          email: user.email
        });
      }
    }
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(editedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setEditedUser(JSON.parse(savedUserData));
    } else {
      setEditedUser({
        ...editedUser,
        username: user.username,
        email: user.email
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Профиль пользователя</h1>
              <div className="flex space-x-4">
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Редактировать
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Выйти
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: editedUser.avatarColor }}
                  >
                    <span className="text-4xl font-bold text-white">
                      {editedUser.username && editedUser.username[0] ? editedUser.username[0].toUpperCase() : ''}
                    </span>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => setEditedUser({
                        ...editedUser,
                        avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16)
                      })}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
                        <input
                          type="text"
                          value={editedUser.username}
                          onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">О себе</label>
                        <textarea
                          value={editedUser.bio}
                          onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Социальные сети</label>
                        <div>
                          <input
                            type="text"
                            placeholder="Twitter"
                            value={editedUser.socialLinks.twitter}
                            onChange={(e) => setEditedUser({
                              ...editedUser,
                              socialLinks: { ...editedUser.socialLinks, twitter: e.target.value }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="GitHub"
                            value={editedUser.socialLinks.github}
                            onChange={(e) => setEditedUser({
                              ...editedUser,
                              socialLinks: { ...editedUser.socialLinks, github: e.target.value }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="LinkedIn"
                            value={editedUser.socialLinks.linkedin}
                            onChange={(e) => setEditedUser({
                              ...editedUser,
                              socialLinks: { ...editedUser.socialLinks, linkedin: e.target.value }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Тема</label>
                        <select
                          value={editedUser.theme}
                          onChange={(e) => setEditedUser({ ...editedUser, theme: e.target.value as 'light' | 'dark' })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="light">Светлая</option>
                          <option value="dark">Темная</option>
                        </select>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800">{editedUser.username}</h2>
                      <p className="text-gray-600">{editedUser.email}</p>
                      {editedUser.bio && (
                        <p className="mt-2 text-gray-600">{editedUser.bio}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!isEditing && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Информация профиля</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">ID пользователя</p>
                      <p className="mt-1 text-gray-900">{user.id}</p>
                    </div>
                    {editedUser.bio && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">О себе</p>
                        <p className="mt-1 text-gray-900">{editedUser.bio}</p>
                      </div>
                    )}
                    {Object.entries(editedUser.socialLinks).map(([platform, link]) => (
                      link && (
                        <div key={platform} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">{platform.charAt(0).toUpperCase() + platform.slice(1)}</p>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="mt-1 text-blue-500 hover:text-blue-600">
                            {link}
                          </a>
                        </div>
                      )
                    ))}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Тема</p>
                      <p className="mt-1 text-gray-900">{editedUser.theme === 'light' ? 'Светлая' : 'Темная'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}