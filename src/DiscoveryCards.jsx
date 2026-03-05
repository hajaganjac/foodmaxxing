import React from 'react';
import { motion } from 'framer-motion';

const DISCOVERIES = [
  { id: '1', emoji: '💰', title: 'Under €2 Meals', href: 'explore-budget.html' },
  { id: '2', emoji: '⚡', title: '15-Minute Meals', href: 'explore-quick.html' },
  { id: '3', emoji: '🔥', title: 'Protein Powerhouses', href: 'explore-protein.html' },
  { id: '4', emoji: '🌟', title: 'Comfort Food', href: 'explore-comfort.html' },
];

export default function DiscoveryCards() {
  return (
    <div className="discovery-grid">
      {DISCOVERIES.map((card) => (
        <motion.div
          key={card.id}
          className="discovery-card discovery-card-simple"
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <div className="discovery-card-content">
            <motion.div className="discovery-emoji" whileHover={{ scale: 1.1 }}>
              {card.emoji}
            </motion.div>
            <h3>{card.title}</h3>
          </div>
          <motion.a
            href={card.href}
            className="discovery-play-btn"
            aria-label={`Explore ${card.title}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="discovery-play-icon" aria-hidden="true">▶</span>
          </motion.a>
        </motion.div>
      ))}
    </div>
  );
}
