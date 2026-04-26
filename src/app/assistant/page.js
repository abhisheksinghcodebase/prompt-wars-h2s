'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import styles from './page.module.css';

// Dynamic imports to avoid SSR issues with browser APIs
const ChatUI = dynamic(() => import('@/components/ChatUI'), { ssr: false });
const Timeline = dynamic(() => import('@/components/Timeline'), { ssr: false });
const StepGuide = dynamic(() => import('@/components/StepGuide'), { ssr: false });
const MapPanel = dynamic(() => import('@/components/MapPanel'), { ssr: false });
const FAQPanel = dynamic(() => import('@/components/FAQPanel'), { ssr: false });
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const PersonaSetup = dynamic(() => import('@/components/PersonaSetup'), { ssr: false });

const TAB_COMPONENTS = {
  chat: ChatUI,
  steps: StepGuide,
  timeline: Timeline,
  map: MapPanel,
  faqs: FAQPanel,
};

const TAB_LABELS = {
  chat: { icon: '💬', label: 'Chat' },
  steps: { icon: '📋', label: 'Steps' },
  timeline: { icon: '📅', label: 'Timeline' },
  map: { icon: '🗺️', label: 'Map' },
  faqs: { icon: '❓', label: 'FAQs' },
};

export default function AssistantPage() {
  const { profile, theme, toggleTheme, toggleContrast, simpleLanguage, setSimpleLanguage } = useApp();
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Small delay to check profile after localStorage loads
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('electiq_profile');
        if (!saved || !JSON.parse(saved).isSetupComplete) {
          setShowSetup(true);
        }
      } catch {
        setShowSetup(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  if (!mounted) return null;

  return (
    <div className={styles.appShell}>
      {/* Persona Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <PersonaSetup onComplete={() => setShowSetup(false)} />
        )}
      </AnimatePresence>

      {/* Top Nav Bar */}
      <header className={styles.topBar} role="banner">
        <div className={styles.topLeft}>
          <button
            className={`btn btn-ghost btn-icon hide-desktop ${styles.menuBtn}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <Link href="/" className={styles.topLogo} aria-label="Go to home page">
            <div className={styles.logoIcon}>⚡</div>
            <span className={styles.logoText}>ElectIQ</span>
          </Link>
          <span className="badge badge-primary hide-mobile">Beta</span>
        </div>

        {/* Tab Bar (mobile) */}
        <div className={`${styles.mobileTabBar} hide-desktop`} role="tablist" aria-label="App sections">
          {Object.entries(TAB_LABELS).map(([id, { icon }]) => (
            <button
              key={id}
              className={`${styles.mobileTab} ${activeTab === id ? styles.mobileTabActive : ''}`}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              role="tab"
              aria-selected={activeTab === id}
              aria-label={TAB_LABELS[id].label}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className={styles.topRight}>
          {/* Simple language toggle */}
          <button
            className={`btn btn-ghost btn-sm hide-mobile ${simpleLanguage ? styles.activeToggle : ''}`}
            onClick={() => setSimpleLanguage(!simpleLanguage)}
            title="Simple language mode"
            aria-label={`${simpleLanguage ? 'Disable' : 'Enable'} simple language mode`}
            aria-pressed={simpleLanguage}
          >
            📖 Simple
          </button>

          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={toggleContrast}
            title="Toggle high contrast"
            aria-label="Toggle high contrast mode"
          >
            ◑
          </button>

          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className="btn btn-ghost btn-sm hide-mobile"
            onClick={() => setShowSetup(true)}
            aria-label="Edit your profile"
          >
            👤 Profile
          </button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* Desktop Sidebar */}
        <aside
          className={`${styles.desktopSidebar} hide-mobile`}
          aria-label="Navigation sidebar"
        >
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className={styles.mobileOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                className={styles.mobileSidebar}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                aria-label="Mobile navigation"
              >
                <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={styles.mainContent} role="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className={styles.panelWrapper}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {ActiveComponent && (
                <ActiveComponent
                  onTabSwitch={setActiveTab}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
