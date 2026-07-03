"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type GlobalStateContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  user: any;
  setUser: (user: any) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  taxRates: any;
  setTaxRates: (rates: any) => void;
  stats: any;
  setStats: (stats: any) => void;
  surveyLogs: any[];
  setSurveyLogs: (logs: any[]) => void;
  handleLogin: (newToken: string, newUser: any) => void;
  handleLogout: () => void;
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [taxRates, setTaxRates] = useState({
    baseDutyBeans: 0.25,
    baseDutyMaize: 0.25,
    baseDutyCassava: 0.25,
    baseDutyVegetables: 0.25,
    baseDutyTextiles: 0.25,
    baseDutyElectronics: 0.10,
    baseDutyAgriInputs: 0.10,
    vatDrc: 16.0,
    vatRwanda: 18.0,
    occFeeDrc: 1.5,
    whNonRegDrc: 5.0,
    whNonRegRwanda: 5.0,
    whRegDrc: 1.5
  });

  const [stats, setStats] = useState({
    calculationsRun: 142,
    incentivesApplied: 73,
    satisfactionScore: 4.6,
    runsByCategory: {
      'Common Beans': 48,
      'Maize / Corn': 36,
      'Cassava Roots': 22,
      'Fresh Vegetables': 18,
      'Textiles / Clothing': 12,
      'Electronics': 6
    }
  });

  const [surveyLogs, setSurveyLogs] = useState([
    {
      scores: [5, 4, 5, 5, 5],
      comment: "EAC STR saved me $125 in customs duties for my cabbage consignment! Highly recommend this tool.",
      date: "2026-06-12"
    }
  ]);

  // Initial Auth & Theme load
  useEffect(() => {
    const savedToken = localStorage.getItem('st_token');
    const savedUser = localStorage.getItem('st_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    const savedDark = localStorage.getItem('st_dark');
    if (savedDark !== null) {
      setDarkMode(savedDark === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    // Fetch initial settings from DB
    fetch('/api/taxes')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setTaxRates(data.settings);
        }
      })
      .catch(console.error);

    // Socket real-time updates
    import('socket.io-client').then(({ io }) => {
      const socket = io();
      socket.on('tax_updated', (data) => {
        if (data.settings) {
          setTaxRates(data.settings);
          alert(data.message || 'Tax rates have been updated dynamically by an admin!');
        }
      });
      return () => socket.disconnect();
    });
  }, []);

  useEffect(() => {
    const savedStats = localStorage.getItem('st_stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    const savedSurveys = localStorage.getItem('st_surveys');
    if (savedSurveys) setSurveyLogs(JSON.parse(savedSurveys));
  }, []);

  useEffect(() => {
    localStorage.setItem('st_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('st_rates', JSON.stringify(taxRates));
  }, [taxRates]);

  useEffect(() => {
    localStorage.setItem('st_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('st_surveys', JSON.stringify(surveyLogs));
  }, [surveyLogs]);

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('st_token', newToken);
    localStorage.setItem('st_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('st_token');
    localStorage.removeItem('st_user');
  };

  return (
    <GlobalStateContext.Provider value={{
      token, setToken,
      user, setUser,
      darkMode, setDarkMode,
      taxRates, setTaxRates,
      stats, setStats,
      surveyLogs, setSurveyLogs,
      handleLogin, handleLogout
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
