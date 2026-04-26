'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import styles from './MapPanel.module.css';

const DEMO_STATIONS = [
  { id: 1, name: 'Government School Booth #42', address: 'Sector 14, Main Road', distance: '0.3 km', type: 'polling', open: true },
  { id: 2, name: 'Community Hall — Ward 7', address: 'Park Avenue, Near Metro', distance: '0.8 km', type: 'polling', open: true },
  { id: 3, name: 'Municipal Corporation Office', address: 'Civil Lines, MG Road', distance: '1.2 km', type: 'registration', open: true },
  { id: 4, name: 'Primary School Block B', address: 'Colony Road, Opp. Park', distance: '1.6 km', type: 'polling', open: false },
  { id: 5, name: 'Election Registration Center', address: 'Court Road, District HQ', distance: '2.1 km', type: 'registration', open: true },
];

export default function MapPanel() {
  const { profile, markMapViewed } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const mapsKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const hasRealMaps = mapsKey && mapsKey !== 'your_maps_api_key_here';

  useEffect(() => {
    markMapViewed();
    const timer = setTimeout(() => setMapLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = DEMO_STATIONS.filter(s => {
    const matchFilter = filter === 'all' || s.type === filter;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={`${styles.title} heading-md`}>Nearby Locations</h2>
          <p className={styles.subtitle}>Find polling stations & registration centers near you</p>
        </div>
        <span className={`badge ${hasRealMaps ? 'badge-success' : 'badge-warning'}`}>
          {hasRealMaps ? '🗺️ Google Maps' : '📍 Demo Mode'}
        </span>
      </div>

      {/* Search + Filter */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={`input ${styles.searchInput}`}
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search locations"
          />
        </div>
        <div className={styles.filters}>
          {['all', 'polling', 'registration'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              aria-label={`Filter: ${f}`}
            >
              {f === 'all' ? '📍 All' : f === 'polling' ? '🗳️ Polling' : '📋 Registration'}
            </button>
          ))}
        </div>
      </div>

      {/* Map Embed */}
      <div className={styles.mapArea}>
        {!mapLoaded ? (
          <div className={`${styles.mapPlaceholder} skeleton`} />
        ) : hasRealMaps ? (
          <iframe
            title="Google Maps — Nearby Polling Stations"
            className={styles.mapIframe}
            src={`https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=polling+station+near+${encodeURIComponent(profile.state || 'India')}`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={styles.demoMap}>
            <div className={styles.demoMapBg}>
              {/* Animated demo map */}
              <svg viewBox="0 0 400 220" className={styles.mapSvg} aria-hidden="true">
                {/* Roads */}
                <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                <line x1="200" y1="0" x2="200" y2="220" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                <line x1="0" y1="55" x2="400" y2="55" stroke="rgba(99,102,241,0.1)" strokeWidth="4" />
                <line x1="0" y1="165" x2="400" y2="165" stroke="rgba(99,102,241,0.1)" strokeWidth="4" />
                <line x1="100" y1="0" x2="100" y2="220" stroke="rgba(99,102,241,0.1)" strokeWidth="4" />
                <line x1="300" y1="0" x2="300" y2="220" stroke="rgba(99,102,241,0.1)" strokeWidth="4" />
                {/* Blocks */}
                {[[30,20,60,25],[130,20,60,25],[230,20,60,25],[330,20,55,25],
                  [30,70,60,30],[130,70,60,30],[230,70,60,30],[330,70,55,30],
                  [30,125,60,30],[130,125,60,30],[230,125,60,30],[330,125,55,30],
                  [30,175,60,35],[130,175,60,35],[230,175,60,35],[330,175,55,35]].map(([x,y,w,h], i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.12)" strokeWidth="1" />
                ))}
                {/* Your location */}
                <circle cx="200" cy="110" r="8" fill="#6366f1" opacity="0.9" />
                <circle cx="200" cy="110" r="16" fill="#6366f1" opacity="0.2" className={styles.pulse} />
                <text x="200" y="107" textAnchor="middle" fontSize="8" fill="white">📍</text>
                {/* Pins */}
                {[[80,60,'#10b981'],[310,145,'#10b981'],[155,170,'#f59e0b'],[280,50,'#10b981'],[340,80,'#f59e0b']].map(([px,py,color],i) => (
                  <g key={i}>
                    <circle cx={px} cy={py} r="10" fill={color} opacity="0.85" />
                    <text x={px} y={py+4} textAnchor="middle" fontSize="9">🗳</text>
                  </g>
                ))}
              </svg>
              <div className={styles.demoLabel}>
                <span className="badge badge-primary">Interactive Demo Map</span>
                <p>Add your Google Maps API key to see real locations</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Station List */}
      <div className={styles.stationList}>
        <h3 className={styles.listTitle}>
          {filtered.length} Location{filtered.length !== 1 ? 's' : ''} Found
        </h3>
        <div className={styles.stations}>
          {filtered.map((station, i) => (
            <motion.button
              key={station.id}
              className={`${styles.stationCard} glass-card ${selectedStation?.id === station.id ? styles.selected : ''}`}
              onClick={() => setSelectedStation(station.id === selectedStation?.id ? null : station)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              aria-label={`${station.name} — ${station.distance} away`}
              aria-expanded={selectedStation?.id === station.id}
            >
              <div className={styles.stationLeft}>
                <span className={styles.stationPin}>
                  {station.type === 'polling' ? '🗳️' : '📋'}
                </span>
                <div className={styles.stationInfo}>
                  <div className={styles.stationName}>{station.name}</div>
                  <div className={styles.stationAddr}>{station.address}</div>
                </div>
              </div>
              <div className={styles.stationRight}>
                <span className={`badge ${station.open ? 'badge-success' : 'badge-danger'}`}>
                  {station.open ? 'Open' : 'Closed'}
                </span>
                <span className={styles.stationDist}>{station.distance}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Directions Button */}
      {selectedStation && (
        <motion.div
          className={styles.directionsBar}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <strong className={styles.selectedName}>{selectedStation.name}</strong>
            <span className={styles.selectedAddr}>{selectedStation.address}</span>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStation.name + ' ' + selectedStation.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            🗺️ Get Directions
          </a>
        </motion.div>
      )}
    </div>
  );
}
