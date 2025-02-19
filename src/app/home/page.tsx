'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Добро пожаловать в GamePortal!',
    content: 'Мы рады приветствовать вас на нашей платформе. Здесь вы найдете множество интересных игр и сможете общаться с другими игроками.',
    date: '2024-02-20'
  },
  {
    id: 2,
    title: 'Новые функции',
    content: 'Мы добавили возможность настройки профиля и загрузки аватара. Попробуйте новые функции прямо сейчас!',
    date: '2024-02-21'
  },
  {
    id: 3,
    title: 'Предстоящие обновления',
    content: 'Скоро будут доступны новые игры и улучшенная система рейтинга. Следите за обновлениями!',
    date: '2024-02-22'
  }
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Объявления</h1>
          <div className="grid gap-6">
            {mockAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{announcement.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}