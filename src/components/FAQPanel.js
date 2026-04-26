'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFAQs } from '@/services/api';
import { useApp } from '@/context/AppContext';
import styles from './FAQPanel.module.css';

export default function FAQPanel() {
  const { profile } = useApp();
  const faqs = getFAQs(profile.countryCode || 'IN');
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={`${styles.title} heading-md`}>Frequently Asked Questions</h2>
        <p className={styles.subtitle}>Common questions about voting in {profile.country || 'India'}</p>
      </div>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={`input ${styles.searchInput}`}
          placeholder="Search FAQs..."
          value={search}
          onChange={e => { setSearch(e.target.value); setOpenIdx(null); }}
          aria-label="Search FAQs"
        />
      </div>

      <div className={styles.faqList}>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span>🤔</span>
            <p>No FAQs match your search. Try asking the chat assistant!</p>
          </div>
        )}
        {filtered.map((faq, i) => (
          <motion.div
            key={i}
            className={`${styles.faqItem} glass-card`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              aria-expanded={openIdx === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span className={styles.qIcon}>Q</span>
              <span className={styles.qText}>{faq.q}</span>
              <motion.span
                className={styles.chevron}
                animate={{ rotate: openIdx === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  id={`faq-answer-${i}`}
                  className={styles.faqAnswer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={styles.answerInner}>
                    <span className={styles.aIcon}>A</span>
                    <p className={styles.aText}>{faq.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className={styles.helpBox}>
        <div className={styles.helpIcon}>💡</div>
        <div>
          <p className={styles.helpTitle}>Didn't find your answer?</p>
          <p className={styles.helpText}>Ask our AI assistant! It's powered by Google Gemini and knows everything about elections.</p>
        </div>
      </div>
    </div>
  );
}
