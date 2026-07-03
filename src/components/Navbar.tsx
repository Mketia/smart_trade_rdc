import React, { useState } from 'react';
import { Home as HomeIcon, Shield, Menu, X, Calculator, MessageSquare, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user?: any;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { id: 'landing', label: 'Home', icon: HomeIcon },
    { id: 'home', label: 'Portal', icon: Shield },
    { id: 'estimator', label: 'Estimator', icon: Calculator },
    { id: 'professionals', label: 'Directory', icon: UserIcon },
    { id: 'contact', label: 'Contact Us', icon: MessageSquare }
  ];

  // The Admin tab is intentionally omitted from the navbar as per user request;
  // admins are automatically redirected to it upon login instead.

  const allMenuItems = menuItems;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-900/10 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => setCurrentTab('home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 shadow-md shadow-brand-500/20">
              <span className="text-lg font-black text-white font-display">ST</span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-base font-extrabold text-zinc-900 dark:text-white font-display leading-tight tracking-tight">
                SmartTrade RDC
              </span>
              <span className="block text-[10px] font-medium text-brand-600 dark:text-brand-400 font-sans tracking-wider uppercase">
                Goma-Gisenyi Trade & Tax Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav Tabs (Centered text-only) */}
          <div className="hidden lg:flex items-center justify-center flex-grow gap-8">
            {allMenuItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    active
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Utilities (Lang, Dark Mode) */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle Removed */}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5" />
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm shadow-brand-500/20 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </button>
            )}
          </div>


          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Auth mobile */}
            {user ? (
              <button onClick={onLogout} className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => setCurrentTab('auth')} className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
                <LogIn className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-brand-500 transition-all cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-hidden shadow-inner px-4 py-4 space-y-4">
          {/* Navigation Links */}
          <div className="space-y-1.5">
            {allMenuItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className="h-5 w-5 text-zinc-400" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* dark mode removed in mobile drawer */}
        </div>
      )}
    </nav>
  );
};

