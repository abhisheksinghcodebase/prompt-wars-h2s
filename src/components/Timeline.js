'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { buildTimeline } from '@/services/api';
import { useApp } from '@/context/AppContext';
import { generateCalendarURL } from '@/services/api';
import styles from './Timeline.module.css';

export default function Timeline() {
  const { profile, markCalendarAdded } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [orientation, setOrientation] = useState('vertical');

  const events = buildTimeline(profile.countryCode || 'IN');
  const currentIdx = events.findIndex(e => e.id === 'voting');

  const addToCalendar = (event) => {
    const today = new Date();
    const electionDate = new Date();
    electionDate.setDate(today.getDate() + Math.abs(event.daysFromElection <= 0 ? 30 : event.daysFromElection));
    
    const dateStr = electionDate.toISOString().split('T')[0];
    const url = generateCalendarURL({
      title: `ElectIQ: ${event.label}`,
      date: dateStr,
      description: event.description,
      location: profile.country || 'India',
    });
    window.open(url, '_blank');
    markCalendarAdded();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={`${styles.title} heading-md`}>Election Timeline</h2>
          <p className={styles.subtitle}>Key milestones in the democratic process</p>
        </div>
        <div className={styles.toggleRow}>
          <button
            className={`btn btn-ghost btn-sm ${orientation === 'vertical' ? styles.activeToggle : ''}`}
            onClick={() => setOrientation('vertical')}
            aria-label="Vertical view"
          >
            ↕ Vertical
          </button>
          <button
            className={`btn btn-ghost btn-sm ${orientation === 'horizontal' ? styles.activeToggle : ''}`}
            onClick={() => setOrientation('horizontal')}
            aria-label="Horizontal view"
          >
            ↔ Horizontal
          </button>
        </div>
      </div>

      {orientation === 'vertical' ? (
        <VerticalTimeline events={events} currentIdx={currentIdx} onSelect={setSelectedEvent} onCalendar={addToCalendar} />
      ) : (
        <HorizontalTimeline events={events} currentIdx={currentIdx} onSelect={setSelectedEvent} onCalendar={addToCalendar} />
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className={`${styles.modal} glass-panel`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>{selectedEvent.icon}</span>
              <div>
                <h3 className={styles.modalTitle}>{selectedEvent.label}</h3>
                <span className={`badge badge-primary`}>{selectedEvent.computedDate}</span>
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelectedEvent(null)} aria-label="Close modal">✕</button>
            </div>
            <p className={styles.modalDesc}>{selectedEvent.description}</p>
            <div className={styles.modalActions}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { addToCalendar(selectedEvent); setSelectedEvent(null); }}
              >
                📅 Add to Google Calendar
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function VerticalTimeline({ events, currentIdx, onSelect, onCalendar }) {
  return (
    <div className={styles.verticalList}>
      {events.map((event, i) => {
        const isPast = event.isPast;
        const isCurrent = event.isCurrent;
        const isFuture = !isPast && !isCurrent;

        return (
          <motion.div
            key={event.id}
            className={`${styles.vItem} ${isCurrent ? styles.current : ''} ${isPast ? styles.past : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            {/* Connector Line */}
            {i < events.length - 1 && (
              <div className={`${styles.vLine} ${isPast ? styles.vLinePast : ''}`} />
            )}

            {/* Node */}
            <button
              className={`${styles.vNode} ${isCurrent ? styles.vNodeCurrent : ''} ${isPast ? styles.vNodePast : ''}`}
              onClick={() => onSelect(event)}
              style={{ '--event-color': event.color }}
              aria-label={`View details for ${event.label}`}
            >
              {isPast ? '✓' : event.icon}
            </button>

            {/* Content */}
            <div className={styles.vContent}>
              <div className={styles.vMeta}>
                <span className={styles.vDate}>{event.computedDate}</span>
                {isCurrent && <span className="badge badge-success">Current Stage</span>}
                {isPast && <span className="badge badge-cyan">Completed</span>}
              </div>
              <h4 className={styles.vLabel}>{event.label}</h4>
              <p className={styles.vDesc}>{event.description}</p>
              <button
                className={`btn btn-ghost btn-sm ${styles.calBtn}`}
                onClick={() => onCalendar(event)}
                aria-label={`Add ${event.label} to calendar`}
              >
                📅 Add Reminder
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function HorizontalTimeline({ events, currentIdx, onSelect, onCalendar }) {
  return (
    <div className={styles.hScroll}>
      <div className={styles.hTrack}>
        {/* Progress bar */}
        <div className={styles.hLine}>
          <div
            className={styles.hLineFill}
            style={{ width: `${(currentIdx / (events.length - 1)) * 100}%` }}
          />
        </div>

        {events.map((event, i) => {
          const isPast = event.isPast;
          const isCurrent = event.isCurrent;

          return (
            <motion.div
              key={event.id}
              className={styles.hItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <button
                className={`${styles.hNode} ${isCurrent ? styles.hNodeCurrent : ''} ${isPast ? styles.hNodePast : ''}`}
                onClick={() => onSelect(event)}
                style={{ '--event-color': event.color }}
                aria-label={`View details for ${event.label}`}
              >
                {isPast ? '✓' : event.icon}
              </button>
              <span className={styles.hLabel}>{event.label}</span>
              <span className={styles.hDate}>{event.computedDate}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
