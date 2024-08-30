"use client"; // This makes this component a client-side component

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', 
      });
      router.push('/auth/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1 border-white border text-white rounded "
    >
      Logout
    </button>
  );
}
