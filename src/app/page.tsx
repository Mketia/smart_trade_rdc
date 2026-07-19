"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LandingPage } from '../components/LandingPage';
import { Home } from '../components/Home';
import { Dashboard } from '../components/Dashboard';
import { Estimator } from '../components/Estimator';
import { Professionals } from '../components/Professionals';
import { Agencies } from '../components/Agencies';
import { Incentives } from '../components/Incentives';
import { Contact } from '../components/Contact';
import { Auth } from '../components/Auth';
import { Chatbot } from '../components/Chatbot';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { useGlobalState } from '../context/GlobalStateContext';

export default function App() {
  const router = useRouter();
  
  const {
    user,
    taxRates,
    stats,
    setStats,
    handleLogin: globalHandleLogin,
    handleLogout: globalHandleLogout
  } = useGlobalState();

  const userRole = user?.role || 'small_trader';

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string>('beans');

  const handleLogin = (newToken: string, newUser: any) => {
    globalHandleLogin(newToken, newUser);
    if (newUser.role === 'admin') {
      router.push('/dashboard');
    } else {
      setCurrentTab('landing');
    }
  };

  const handleLogout = () => {
    globalHandleLogout();
    setCurrentTab('landing');
  };

  const handleCalculationRun = (productName: string, _totalTaxUsd: number, incentiveApplied: boolean) => {
    const newStats = { ...stats };
    newStats.calculationsRun += 1;
    if (incentiveApplied) {
      newStats.incentivesApplied += 1;
    }
    
    const displayCategory = productName || 'Other Goods';
    newStats.runsByCategory[displayCategory] = (newStats.runsByCategory[displayCategory] || 0) + 1;

    setStats(newStats);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage setCurrentTab={setCurrentTab} />;
      case 'home':
        return <Home setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProductId} />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} stats={stats} />;
      case 'estimator':
        return (
          <Estimator 
            userRole={userRole} 
            taxRates={taxRates} 
            onCalculationRun={handleCalculationRun}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
          />
        );
      case 'incentives':
        return <Incentives />;
      case 'professionals':
        return <Professionals />;
      case 'agencies':
        return <Agencies />;
      case 'contact':
        return <Contact />;
      default:
        return <LandingPage setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="grid-bg bg-glow-emerald bg-glow-amber bg-stone-50 dark:bg-zinc-950 text-zinc-850 dark:text-zinc-100 transition-colors duration-300 min-h-screen flex flex-col font-sans relative">
      {/* Navigation header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main container */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 z-10">
        <div className="animate-fadeIn">
          {renderTabContent()}
        </div>
      </main>

      {/* Global AI Chatbot Widget */}
      <Chatbot />

      {/* Global WhatsApp Contact Widget */}
      <WhatsAppButton />

      {/* Footer credits */}
      <Footer />
    </div>
  );
}
