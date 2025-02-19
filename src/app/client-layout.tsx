'use client';

import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PostProvider>
        <ThemeProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </ThemeProvider>
      </PostProvider>
    </AuthProvider>
  );
}