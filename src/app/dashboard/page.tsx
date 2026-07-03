"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPanel } from '../../components/AdminPanel';
import { useGlobalState } from '../../context/GlobalStateContext';
import { User as UserIcon, Mail, Lock, X, Check, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const router = useRouter();
  
  const {
    user,
    taxRates,
    setTaxRates,
    handleLogout,
    handleLogin,
    token
  } = useGlobalState();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Update Name and Email
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: user.id, name: editName, email: editEmail })
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      
      // Update password if provided
      if (editPassword) {
        if (editPassword.length < 6) throw new Error('Password must be at least 6 characters');
        const passRes = await fetch('/api/auth/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, newPassword: editPassword })
        });
        if (!passRes.ok) throw new Error('Failed to update password');
      }

      handleLogin(token!, { ...user, name: updatedUser.name, email: updatedUser.email });
      setShowProfileModal(false);
      setEditPassword('');
      Swal.fire('Success', 'Profile updated successfully', 'success');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    // If not logged in as admin, redirect to home
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Don't render until user is verified to avoid flash of content
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="grid-bg bg-glow-emerald bg-glow-amber bg-stone-50 dark:bg-zinc-950 text-zinc-850 dark:text-zinc-100 transition-colors duration-300 min-h-screen flex flex-col font-sans relative">
      {/* Standalone Dashboard Header */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-900/10 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => router.push('/')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 shadow-md shadow-brand-500/20">
                <span className="text-lg font-black text-white font-display">ST</span>
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-base font-extrabold text-zinc-900 dark:text-white font-display leading-tight tracking-tight">
                  SmartTrade RDC
                </span>
                <span className="block text-[10px] font-medium text-brand-600 dark:text-brand-400 font-sans tracking-wider uppercase">
                  Admin Dashboard
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-brand-500 transition-colors cursor-pointer"
              >
                {user?.name || 'Administrator'}
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  router.push('/');
                }}
                className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 z-10 max-w-[1600px] mx-auto">
        <div className="animate-fadeIn">
          <AdminPanel
            taxRates={taxRates}
            setTaxRates={setTaxRates}
          />
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-zinc-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-zinc-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">New Password (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-zinc-900 dark:text-white transition-all"
                    placeholder="Leave blank to keep current"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl py-2.5 mt-2 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
