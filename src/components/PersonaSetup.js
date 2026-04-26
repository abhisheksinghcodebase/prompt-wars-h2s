'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { checkEligibility } from '@/services/api';
import styles from './PersonaSetup.module.css';

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
];

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
];

export default function PersonaSetup({ onComplete }) {
  const { updateProfile, addXP } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ age: '', country: 'India', countryCode: 'IN', state: '', language: 'en' });
  const [eligResult, setEligResult] = useState(null);

  const steps = ['Country', 'Your Age', 'Language', 'Ready!'];

  const handleCountry = (c) => setData(p => ({ ...p, country: c.name, countryCode: c.code }));
  const handleNext = () => {
    if (step === 1 && data.age) {
      const result = checkEligibility(parseInt(data.age), data.countryCode);
      setEligResult(result);
    }
    if (step < steps.length - 1) setStep(p => p + 1);
  };

  const handleFinish = () => {
    updateProfile({ ...data, age: parseInt(data.age) || null, isSetupComplete: true });
    addXP('step_complete');
    onComplete?.();
  };

  const canNext = () => {
    if (step === 0) return !!data.country;
    if (step === 1) return !!data.age && parseInt(data.age) > 0 && parseInt(data.age) < 120;
    if (step === 2) return !!data.language;
    return true;
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-modal="true"
      role="dialog"
      aria-label="Setup your profile"
    >
      <motion.div
        className={`${styles.modal} glass-panel`}
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.logo}>⚡</div>
          <h1 className={styles.heading}>Welcome to <span className="text-gradient">ElectIQ</span></h1>
          <p className={styles.subheading}>Let's personalize your election guide in 3 quick steps</p>
        </div>

        {/* Progress */}
        <div className={styles.stepProgress}>
          {steps.map((s, i) => (
            <div key={i} className={`${styles.stepPip} ${i <= step ? styles.stepPipActive : ''}`}>
              <div className={styles.pipDot}>{i < step ? '✓' : i + 1}</div>
              <span className={styles.pipLabel}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className={styles.stepContent}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className={styles.stepInner}>
                <h2 className={styles.stepQuestion}>Where are you voting? 🌍</h2>
                <div className={styles.countryGrid}>
                  {COUNTRIES.map(c => (
                    <button
                      key={c.code}
                      className={`${styles.countryCard} ${data.countryCode === c.code ? styles.countrySelected : ''}`}
                      onClick={() => handleCountry(c)}
                      aria-pressed={data.countryCode === c.code}
                    >
                      <span className={styles.countryFlag}>{c.flag}</span>
                      <span className={styles.countryName}>{c.name}</span>
                      {data.countryCode === c.code && <span className={styles.checkmark}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className={styles.stepInner}>
                <h2 className={styles.stepQuestion}>How old are you? 🎂</h2>
                <p className={styles.stepHint}>We use this to check your voting eligibility</p>
                <div className={styles.ageInputWrapper}>
                  <input
                    type="number"
                    className={`input ${styles.ageInput}`}
                    placeholder="Enter your age"
                    value={data.age}
                    onChange={e => setData(p => ({ ...p, age: e.target.value }))}
                    min={1}
                    max={120}
                    autoFocus
                    aria-label="Your age"
                  />
                  <span className={styles.ageUnit}>years old</span>
                </div>
                {eligResult && (
                  <motion.div
                    className={`${styles.eligResult} ${eligResult.eligible ? styles.eligible : styles.notEligible}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {eligResult.message}
                  </motion.div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepInner}>
                <h2 className={styles.stepQuestion}>Preferred language? 🌐</h2>
                <p className={styles.stepHint}>We'll use this for voice responses and future translations</p>
                <div className={styles.langGrid}>
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      className={`${styles.langCard} ${data.language === l.code ? styles.langSelected : ''}`}
                      onClick={() => setData(p => ({ ...p, language: l.code }))}
                      aria-pressed={data.language === l.code}
                    >
                      <span className={styles.langNative}>{l.native}</span>
                      <span className={styles.langName}>{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepInner}>
                <div className={styles.readyIcon}>🎉</div>
                <h2 className={styles.stepQuestion}>You're all set!</h2>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryRow}>
                    <span>🌍 Country</span><strong>{data.country}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>🎂 Age</span><strong>{data.age || '—'}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>🌐 Language</span><strong>{LANGUAGES.find(l => l.code === data.language)?.name}</strong>
                  </div>
                  {eligResult && (
                    <div className={styles.summaryRow}>
                      <span>✅ Eligible</span><strong style={{ color: eligResult.eligible ? '#34d399' : '#f87171' }}>{eligResult.eligible ? 'Yes' : 'Not yet'}</strong>
                    </div>
                  )}
                </div>
                <p className={styles.readyNote}>Your personalized election guide is ready. Let's begin! 🗳️</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className={styles.footer}>
          {step > 0 && step < 3 && (
            <button className="btn btn-ghost" onClick={() => setStep(p => p - 1)}>← Back</button>
          )}
          {step < 3 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canNext()}
              style={{ marginLeft: 'auto' }}
            >
              {step === 2 ? 'See Summary →' : 'Continue →'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleFinish} style={{ width: '100%' }}>
              🚀 Launch My Guide
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
