'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const INITIAL_PROFILE = {
  age: null,
  country: 'India',
  countryCode: 'IN',
  state: '',
  language: 'en',
  isSetupComplete: false,
  xp: 0,
  badges: [],
  completedSteps: [],
  completedChecklist: [],
};

const XP_MAP = {
  step_complete: 20,
  checklist_item: 15,
  chat_message: 5,
  badge_earned: 50,
  map_viewed: 10,
  calendar_added: 25,
};

const BADGES = [
  { id: 'first_step', name: 'First Step', icon: '👣', description: 'Completed your first step', threshold: 1, type: 'steps' },
  { id: 'half_way', name: 'Halfway Hero', icon: '⚡', description: 'Completed 3 steps', threshold: 3, type: 'steps' },
  { id: 'voter_ready', name: 'Voter Ready', icon: '🗳️', description: 'Completed all steps', threshold: 6, type: 'steps' },
  { id: 'explorer', name: 'Explorer', icon: '🗺️', description: 'Viewed the map', threshold: 1, type: 'map' },
  { id: 'chatty', name: 'Engaged Citizen', icon: '💬', description: 'Asked 5 questions', threshold: 5, type: 'chat' },
  { id: 'calendar_pro', name: 'Planner', icon: '📅', description: 'Added an election date', threshold: 1, type: 'calendar' },
];

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [theme, setTheme] = useState('dark');
  const [contrast, setContrast] = useState('normal');
  const [simpleLanguage, setSimpleLanguage] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [mapViewed, setMapViewed] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('electiq_profile');
      if (saved) setProfile(JSON.parse(saved));
      const savedTheme = localStorage.getItem('electiq_theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch {}
  }, []);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('electiq_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addXP = (action) => {
    const points = XP_MAP[action] || 0;
    setProfile(prev => {
      const newXP = prev.xp + points;
      return { ...prev, xp: newXP };
    });
  };

  const completeStep = (stepId) => {
    setProfile(prev => {
      if (prev.completedSteps.includes(stepId)) return prev;
      const newCompleted = [...prev.completedSteps, stepId];
      const newXP = prev.xp + XP_MAP.step_complete;
      // Check badges
      const newBadges = checkBadges(newCompleted, prev.badges, 'steps');
      return { ...prev, completedSteps: newCompleted, xp: newXP, badges: newBadges };
    });
  };

  const completeChecklist = (itemId) => {
    setProfile(prev => {
      if (prev.completedChecklist.includes(itemId)) return prev;
      const newList = [...prev.completedChecklist, itemId];
      const newXP = prev.xp + XP_MAP.checklist_item;
      return { ...prev, completedChecklist: newList, xp: newXP };
    });
  };

  const checkBadges = (completed, currentBadges, type) => {
    const newBadges = [...currentBadges];
    BADGES.forEach(badge => {
      if (badge.type === type && !currentBadges.includes(badge.id)) {
        if (type === 'steps' && completed.length >= badge.threshold) {
          newBadges.push(badge.id);
        }
      }
    });
    return newBadges;
  };

  const incrementChat = () => {
    const newCount = chatCount + 1;
    setChatCount(newCount);
    addXP('chat_message');
    if (newCount >= 5 && !profile.badges.includes('chatty')) {
      setProfile(prev => ({ ...prev, badges: [...prev.badges, 'chatty'] }));
    }
  };

  const markMapViewed = () => {
    if (!mapViewed) {
      setMapViewed(true);
      addXP('map_viewed');
      if (!profile.badges.includes('explorer')) {
        setProfile(prev => ({ ...prev, badges: [...prev.badges, 'explorer'] }));
      }
    }
  };

  const markCalendarAdded = () => {
    const newCount = calendarAdded + 1;
    setCalendarAdded(newCount);
    addXP('calendar_added');
    if (newCount === 1 && !profile.badges.includes('calendar_pro')) {
      setProfile(prev => ({ ...prev, badges: [...prev.badges, 'calendar_pro'] }));
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('electiq_theme', newTheme);
  };

  const toggleContrast = () => {
    const newContrast = contrast === 'normal' ? 'high' : 'normal';
    setContrast(newContrast);
    document.documentElement.setAttribute('data-contrast', newContrast === 'high' ? 'high' : '');
  };

  const getLevelInfo = (xp) => {
    const levels = [
      { level: 1, name: 'Curious Citizen', min: 0, max: 99 },
      { level: 2, name: 'Informed Voter', min: 100, max: 249 },
      { level: 3, name: 'Active Participant', min: 250, max: 499 },
      { level: 4, name: 'Democracy Champion', min: 500, max: 999 },
      { level: 5, name: 'Election Expert', min: 1000, max: Infinity },
    ];
    return levels.find(l => xp >= l.min && xp <= l.max) || levels[0];
  };

  const allBadges = BADGES;

  return (
    <AppContext.Provider value={{
      profile, updateProfile,
      theme, toggleTheme,
      contrast, toggleContrast,
      simpleLanguage, setSimpleLanguage,
      completeStep, completeChecklist,
      addXP, incrementChat, markMapViewed, markCalendarAdded,
      getLevelInfo, allBadges, chatCount,
      BADGES,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
