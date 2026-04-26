'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './page.module.css';

const FEATURES = [
  { icon: '🤖', title: 'AI Chat Assistant', desc: 'Ask anything in plain language. Get instant, personalized answers powered by Google Gemini.', color: '#6366f1' },
  { icon: '📋', title: 'Step-by-Step Guide', desc: 'Follow your personalized registration guide. Mark steps as done and earn XP along the way.', color: '#06b6d4' },
  { icon: '📅', title: 'Interactive Timeline', desc: 'Visual election timeline from announcement to results. Add key dates to Google Calendar.', color: '#f59e0b' },
  { icon: '🗺️', title: 'Find Polling Stations', desc: 'Discover nearby polling booths and registration centers using Google Maps integration.', color: '#10b981' },
  { icon: '🌐', title: 'Multi-Language Support', desc: 'Available in 8 languages with voice input/output powered by Web Speech API.', color: '#8b5cf6' },
  { icon: '🎮', title: 'Gamified Progress', desc: 'Earn XP, unlock badges, and level up as you complete your civic journey.', color: '#ef4444' },
];

const STATS = [
  { value: '900M+', label: 'Registered Voters in India' },
  { value: '1M+', label: 'Polling Stations Nationwide' },
  { value: '18', label: 'Minimum Voting Age' },
  { value: '6', label: 'Voting Methods Available' },
];

function NavBar() {
  const { theme, toggleTheme, toggleContrast } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`} role="banner">
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo} aria-label="ElectIQ Home">
          <div className={styles.logoIcon}>⚡</div>
          <span className={styles.logoText}>ElectIQ</span>
        </Link>

        <nav className={styles.navLinks} aria-label="Site navigation">
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#about" className={styles.navLink}>About</a>
        </nav>

        <div className={styles.navActions}>
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
          <Link href="/assistant" className="btn btn-primary btn-sm">
            Launch App →
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroContent}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.heroBadge}
        >
          <span className="badge badge-primary">🇮🇳 Built for Democracy</span>
          <span className={styles.badgeDivider}>•</span>
          <span className="badge badge-cyan">Powered by Google Gemini</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          className={`${styles.heroHeadline} heading-display`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your Vote,<br />
          <span className="text-gradient">Intelligently</span><br />
          Guided
        </motion.h1>

        <motion.p
          className={styles.heroDesc}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          ElectIQ uses AI to walk you through every step of the electoral process — from eligibility checking
          to casting your vote. Personalized, accessible, and powered by Google services.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          className={styles.ctaRow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/assistant" className="btn btn-primary btn-lg" id="get-started-btn">
            🚀 Get Started — It's Free
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            See Features ↓
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className={styles.trustRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className={styles.trustItem}>✅ No sign-up required</span>
          <span className={styles.trustItem}>🔒 Privacy-first design</span>
          <span className={styles.trustItem}>🌐 8 languages</span>
          <span className={styles.trustItem}>♿ WCAG AA accessible</span>
        </motion.div>
      </div>

      {/* Hero Visual */}
      <motion.div
        className={styles.heroVisual}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        aria-hidden="true"
      >
        <div className={styles.chatPreview}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDots}>
              <span /><span /><span />
            </div>
            <span className={styles.previewTitle}>⚡ ElectIQ Assistant</span>
          </div>
          <div className={styles.previewMessages}>
            <div className={`${styles.previewMsg} ${styles.previewBot}`}>
              👋 Hello! How can I help you vote today?
            </div>
            <div className={`${styles.previewMsg} ${styles.previewUser}`}>
              How do I register to vote?
            </div>
            <div className={`${styles.previewMsg} ${styles.previewBot}`}>
              Great question! First, let me check your eligibility. How old are you? 🎂
            </div>
            <div className={`${styles.previewMsg} ${styles.previewUser}`}>
              I'm 22 years old
            </div>
            <div className={`${styles.previewMsg} ${styles.previewBot}`}>
              ✅ You're eligible! Here's your personalized 6-step registration guide...
            </div>
          </div>
          <div className={styles.previewInput}>
            <span className={styles.previewPlaceholder}>Ask anything about voting...</span>
            <span className={styles.previewSend}>↑</span>
          </div>
        </div>

        {/* Floating cards */}
        <motion.div
          className={`${styles.floatCard} ${styles.floatCard1}`}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <span>🗳️</span>
          <div>
            <div className={styles.floatCardTitle}>Voter Registration</div>
            <div className={styles.floatCardSub}>Step 2 of 6 ✓</div>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.floatCard} ${styles.floatCard2}`}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
        >
          <span>🏅</span>
          <div>
            <div className={styles.floatCardTitle}>Badge Earned!</div>
            <div className={styles.floatCardSub}>Informed Voter +50 XP</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className={styles.statsSection} aria-label="Election statistics">
      <div className={styles.statsGrid}>
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            className={`${styles.statCard} glass-card`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`${styles.statValue} text-gradient`}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.featuresSection} id="features" aria-labelledby="features-heading">
      <div className={styles.sectionHeader}>
        <motion.span
          className="badge badge-primary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✨ Everything You Need
        </motion.span>
        <motion.h2
          id="features-heading"
          className={`heading-xl ${styles.sectionTitle}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Built for Every Citizen
        </motion.h2>
        <motion.p
          className={styles.sectionDesc}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          From first-time voters to seasoned participants, ElectIQ has tools tailored for everyone.
        </motion.p>
      </div>

      <div className={styles.featuresGrid}>
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            className={`${styles.featureCard} glass-card`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.featureIcon} style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
            </div>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: '1️⃣', title: 'Set Your Profile', desc: 'Tell us your country, age, and language. We check your eligibility instantly.' },
    { icon: '2️⃣', title: 'Get Personalized Guide', desc: 'Receive a step-by-step checklist tailored specifically to your situation.' },
    { icon: '3️⃣', title: 'Ask Questions', desc: 'Chat with our AI assistant in plain language — anytime, about anything election-related.' },
    { icon: '4️⃣', title: 'Find & Vote', desc: 'Locate your polling station, add reminders, and cast your vote with confidence.' },
  ];

  return (
    <section className={styles.howSection} id="how-it-works" aria-labelledby="how-heading">
      <div className={styles.sectionHeader}>
        <span className="badge badge-cyan">🗺️ Simple Journey</span>
        <h2 id="how-heading" className={`heading-xl ${styles.sectionTitle}`}>How It Works</h2>
        <p className={styles.sectionDesc}>From zero to confident voter in 4 simple steps</p>
      </div>
      <div className={styles.howGrid}>
        {steps.map((s, i) => (
          <motion.div
            key={i}
            className={`${styles.howCard} glass-card`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            {i < steps.length - 1 && <div className={styles.howConnector} aria-hidden="true" />}
            <div className={styles.howIcon}>{s.icon}</div>
            <h3 className={styles.howTitle}>{s.title}</h3>
            <p className={styles.howDesc}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection} id="about" aria-labelledby="cta-heading">
      <motion.div
        className={`${styles.ctaBox} glass-panel`}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className={styles.ctaGlow} aria-hidden="true" />
        <span className={styles.ctaEmoji}>🗳️</span>
        <h2 id="cta-heading" className={`heading-xl ${styles.ctaTitle}`}>
          Ready to <span className="text-gradient">Exercise Your Vote?</span>
        </h2>
        <p className={styles.ctaDesc}>
          Democracy works when every citizen participates. Let ElectIQ guide you — it only takes 2 minutes to get started.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/assistant" className="btn btn-primary btn-lg" id="cta-launch-btn">
            🚀 Launch ElectIQ Now
          </Link>
        </div>
        <div className={styles.techBadges}>
          <span className="badge badge-primary">Google Gemini AI</span>
          <span className="badge badge-cyan">Firebase</span>
          <span className="badge badge-warning">Google Maps</span>
          <span className="badge badge-success">Google Calendar</span>
          <span className="badge badge-primary">Translate API</span>
        </div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className={styles.main}>
      <NavBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      <footer className={styles.footer} role="contentinfo">
        <p>© 2025 ElectIQ · Built with ❤️ for Democracy · <a href="https://eci.gov.in" target="_blank" rel="noopener">ECI Official Site</a></p>
      </footer>
    </main>
  );
}
