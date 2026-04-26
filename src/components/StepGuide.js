'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRegistrationSteps } from '@/services/api';
import { useApp } from '@/context/AppContext';
import styles from './StepGuide.module.css';

export default function StepGuide() {
  const { profile, completeStep } = useApp();
  const steps = getRegistrationSteps(profile.countryCode || 'IN');
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const completedCount = profile.completedSteps.length;
  const progress = Math.round((completedCount / steps.length) * 100);
  const step = steps[currentStep];
  const isCompleted = step && profile.completedSteps.includes(step.id);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(p => p + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(p => p - 1);
    }
  };

  const handleComplete = () => {
    if (step) completeStep(step.id);
  };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={`${styles.title} heading-md`}>Voter Registration Guide</h2>
        <p className={styles.subtitle}>
          {profile.country || 'India'} · {completedCount}/{steps.length} steps complete
        </p>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
          />
        </div>
        <span className={styles.progressPct}>{progress}%</span>
      </div>

      {/* Step Dots */}
      <div className={styles.stepDots} role="tablist" aria-label="Registration steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === currentStep ? styles.dotActive : ''} ${profile.completedSteps.includes(s.id) ? styles.dotDone : ''}`}
            onClick={() => { setDirection(i > currentStep ? 1 : -1); setCurrentStep(i); }}
            role="tab"
            aria-selected={i === currentStep}
            aria-label={`Step ${i + 1}: ${s.title}`}
          >
            {profile.completedSteps.includes(s.id) ? '✓' : i + 1}
          </button>
        ))}
      </div>

      {/* Step Card */}
      <div className={styles.cardWrapper}>
        <AnimatePresence mode="wait" custom={direction}>
          {step && (
            <motion.div
              key={step.id}
              className={`${styles.stepCard} glass-card`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.stepTop}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepBadge}>
                  <span className="badge badge-primary">Step {currentStep + 1} of {steps.length}</span>
                  {step.timeRequired && (
                    <span className="badge badge-warning">⏱ {step.timeRequired}</span>
                  )}
                </div>
              </div>

              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>

              {step.documents && (
                <div className={styles.docList}>
                  <p className={styles.docLabel}>📎 Required Documents:</p>
                  <ul>
                    {step.documents.map((doc, i) => (
                      <li key={i} className={styles.docItem}>
                        <span className={styles.docCheck}>✓</span> {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-secondary btn-sm ${styles.linkBtn}`}
                >
                  🔗 Open Official Portal
                </a>
              )}

              {/* Complete Button */}
              <motion.button
                className={`${styles.completeBtn} ${isCompleted ? styles.completedBtn : ''}`}
                onClick={handleComplete}
                disabled={isCompleted}
                whileTap={{ scale: 0.97 }}
                aria-label={isCompleted ? 'Step completed' : 'Mark step as complete'}
              >
                {isCompleted ? (
                  <>✅ Completed! +20 XP</>
                ) : (
                  <>☑ Mark as Complete — Earn 20 XP</>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className={styles.navRow}>
        <button
          className="btn btn-ghost"
          onClick={goPrev}
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          ← Previous
        </button>
        <span className={styles.navCount}>{currentStep + 1} / {steps.length}</span>
        <button
          className="btn btn-primary"
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
          aria-label="Next step"
        >
          Next →
        </button>
      </div>

      {/* All Steps Overview */}
      <div className={styles.overviewSection}>
        <h4 className={styles.overviewTitle}>All Steps Overview</h4>
        <div className={styles.overviewList}>
          {steps.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.overviewItem} ${i === currentStep ? styles.overviewActive : ''} ${profile.completedSteps.includes(s.id) ? styles.overviewDone : ''}`}
              onClick={() => { setDirection(i > currentStep ? 1 : -1); setCurrentStep(i); }}
            >
              <span className={styles.overviewIcon}>{profile.completedSteps.includes(s.id) ? '✅' : s.icon}</span>
              <span className={styles.overviewName}>{s.title}</span>
              {profile.completedSteps.includes(s.id) && <span className="badge badge-success" style={{fontSize:'0.65rem'}}>Done</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
