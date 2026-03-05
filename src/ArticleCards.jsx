import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ARTICLES = [
  {
    id: '1',
    icon: '💰',
    title: 'How to Budget When Buying Groceries',
    items: [
      "Set a weekly or monthly food budget and stick to it—track spending in an app or spreadsheet.",
      "Plan meals for the week and write a list before you shop to avoid impulse buys.",
      "Compare unit prices (price per kg/L) instead of pack size; bigger isn't always cheaper.",
      "Shop at discount stores (Lidl, Aldi) for staples; use Albert Heijn/Jumbo for deals and own brands.",
      "Buy in bulk only for non-perishables you'll use (pasta, rice, tins) to cut cost per meal.",
    ],
  },
  {
    id: '2',
    icon: '🥬',
    title: 'Tips for Buying Fruit & Vegetables',
    items: [
      "Choose seasonal produce—it's cheaper and often better quality (e.g. apples in autumn, strawberries in summer).",
      'Check the "reduced" section for ripe fruit and veg you can use the same day or freeze.',
      "Frozen and tinned veg (peas, spinach, tomatoes) are cheap, last long, and keep nutrients.",
      "Buy loose items when possible so you only pay for what you need and reduce waste.",
      "Store correctly: potatoes in a dark cool place, bananas away from other fruit, greens in the fridge.",
    ],
  },
  {
    id: '3',
    icon: '🛒',
    title: 'Student Kitchen Essentials',
    items: [
      "Keep pantry staples: pasta, rice, tinned tomatoes, beans, oil, salt, and basic spices.",
      "One good knife, a big pan, and a baking tray can cover most simple recipes.",
      "Batch cook and freeze portions so you always have a cheap meal ready when you're busy.",
      "Use the FoodMaxxing generator to get recipes that match your budget and what you already have.",
    ],
  },
];

export default function ArticleCards() {
  const [allOpen, setAllOpen] = useState(false);

  const toggleAll = () => setAllOpen((prev) => !prev);

  return (
    <div className="articles-grid">
      {ARTICLES.map((article) => (
        <motion.article
          key={article.id}
          className="article-card"
          data-open={allOpen}
          layout
          initial={false}
        >
          <motion.button
            type="button"
            className="article-card-header"
            aria-expanded={allOpen}
            aria-controls={`article-body-${article.id}`}
            id={`article-toggle-${article.id}`}
            onClick={toggleAll}
            whileHover={{ backgroundColor: 'rgba(255, 90, 82, 0.06)' }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="article-icon">{article.icon}</span>
            <h3>{article.title}</h3>
            <motion.span
              className="article-chevron"
              aria-hidden="true"
              animate={{ rotate: allOpen ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              ▶
            </motion.span>
          </motion.button>
          <AnimatePresence initial={false}>
            {allOpen ? (
              <motion.div
                key={`body-${article.id}`}
                id={`article-body-${article.id}`}
                className="article-card-body"
                role="region"
                aria-labelledby={`article-toggle-${article.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { type: 'spring', stiffness: 280, damping: 28 },
                  opacity: { duration: 0.25 },
                }}
                style={{ overflow: 'hidden', padding: '0 1.75rem 1.5rem 1.75rem' }}
              >
                <motion.ul
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08, duration: 0.35 }}
                >
                  {article.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.article>
      ))}
    </div>
  );
}
