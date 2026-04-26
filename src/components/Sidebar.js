'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import styles from './Sidebar.module.css';

export default function Sidebar({ activeTab, onTabChange }) {
  const { profile, getLevelInfo, allBadges } = useApp();

  const levelInfo = getLevelInfo(profile.xp);
  const nextLevel = getLevelInfo(profile.xp + 1);
  const progressToNext = levelInfo.max === Infinity ? 100 :
    Math.round(((profile.xp - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressToNext / 100) * circumference;

  const tabs = [
    { id: 'chat', icon: '💬', label: 'Chat Assistant' },
    { id: 'steps', icon: '📋', label: 'Step Guide' },
    { id: 'timeline', icon: '📅', label: 'Timeline' },
    { id: 'map', icon: '🗺️', label: 'Find Stations' },
    { id: 'faqs', icon: '❓', label: 'FAQs' },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Profile Card */}
      <div className={`${styles.profileCard} glass-card`}>
        <div className={styles.ringWrapper}>
          <svg width="92" height="92" className="progress-ring" aria-hidden="true">
            <circle className="progress-ring-track" cx="46" cy="46" r={radius} strokeWidth="5" />
            <circle
              className="progress-ring-fill"
              cx="46" cy="46" r={radius}
              strokeWidth="5"
              stroke="url(#xpGrad)"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.avatarCenter}>
            <span className={styles.avatarEmoji}>🗳️</span>
          </div>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.levelName}>{levelInfo.name}</div>
          <div className={styles.xpRow}>
            <span className={styles.xpBadge}>⚡ {profile.xp} XP</span>
            <span className={styles.levelNum}>Lv.{levelInfo.level}</span>
          </div>
          {profile.country && (
            <div className={styles.countryTag}>
              {profile.countryCode === 'IN' ? '🇮🇳' : '🇺🇸'} {profile.country}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.navItem} ${activeTab === tab.id ? styles.navActive : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            aria-label={tab.label}
          >
            <span className={styles.navIcon}>{tab.icon}</span>
            <span className={styles.navLabel}>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div className={styles.navIndicator} layoutId="navIndicator" />
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className={`${styles.statsCard} glass-card`}>
        <h4 className={styles.statsTitle}>Your Progress</h4>
        <div className={styles.statRows}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>📋 Steps Done</span>
            <span className={styles.statVal}>{profile.completedSteps.length}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>🏅 Badges</span>
            <span className={styles.statVal}>{profile.badges.length}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>💬 Questions</span>
            <span className={styles.statVal}>{profile.completedChecklist.length}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div className={`${styles.badgesCard} glass-card`}>
          <h4 className={styles.statsTitle}>🏅 Earned Badges</h4>
          <div className={styles.badgeGrid}>
            {allBadges.filter(b => profile.badges.includes(b.id)).map(badge => (
              <motion.div
                key={badge.id}
                className={styles.badge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                title={badge.description}
                aria-label={`${badge.name}: ${badge.description}`}
              >
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <span className={styles.badgeName}>{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Not-yet-earned Badges (locked) */}
      <div className={`${styles.lockedCard} glass-card`}>
        <h4 className={styles.statsTitle}>🔒 Locked Badges</h4>
        <div className={styles.lockedGrid}>
          {allBadges.filter(b => !profile.badges.includes(b.id)).map(badge => (
            <div key={badge.id} className={styles.lockedBadge} title={badge.description}>
              <span className={styles.lockedIcon}>🔒</span>
              <span className={styles.lockedName}>{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
