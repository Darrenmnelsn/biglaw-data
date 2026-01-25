import { motion } from 'framer-motion';
import { useState } from 'react';
import LessonCard from './components/LessonCard.jsx';
import Exercise from './components/Exercise.jsx';
import PropertyLawGame from './components/PropertyLawGame.jsx';
import ConLawGame from './components/ConLawGame.jsx';

// Navigation views
const VIEWS = {
  HOME: 'home',
  PROPERTY: 'property',
  CONLAW: 'conlaw',
  CODING: 'coding'
};

const lessons = [
  {
    title: 'JavaScript foundations',
    description: 'Variables, functions, conditionals, and how browsers execute code.',
    duration: '25 min',
    topics: ['Values', 'Functions', 'Control flow', 'Debugging']
  },
  {
    title: 'React in 30 minutes',
    description: 'Build a tiny UI with components, props, and local state.',
    duration: '30 min',
    topics: ['Components', 'Hooks', 'JSX', 'Rendering']
  },
  {
    title: 'Animating with Framer Motion',
    description: 'Make your UI feel alive with physics-driven motion.',
    duration: '20 min',
    topics: ['Motion', 'Transitions', 'Gestures']
  }
];

const exercise = {
  title: 'Build a live counter',
  steps: [
    'Create a <Counter /> component that stores a count in React state.',
    'Add a button that calls setCount(count + 1) when clicked.',
    'Animate the button press with a framer-motion whileTap scale.',
    'Log the current count to the console using useEffect.'
  ],
  code: `import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count updated:', count);
  }, [count]);

  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCount((c) => c + 1)}>
      You clicked {count} times
    </motion.button>
  );
}`,
  outcome: 'You will have a tactile button, live state updates, and a mental model for how React re-renders.'
};

const resources = [
  {
    title: 'Practice prompts',
    description: 'Small, confidence-building tasks you can complete in under 10 minutes.',
    items: ['Reverse a string', 'Build a todo item', 'Animate a card hover']
  },
  {
    title: 'Daily drills',
    description: 'Habit-forming reps to keep your skills sharp and your hands in the code.',
    items: ['One code kata', 'Read 20 lines of source', 'Refactor 1 component']
  }
];

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);

  // Render law games
  if (currentView === VIEWS.PROPERTY) {
    return (
      <div>
        <nav style={{
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <button
            onClick={() => setCurrentView(VIEWS.HOME)}
            className="secondary-button"
            style={{ padding: '8px 16px' }}
          >
            Back to Hub
          </button>
          <span style={{ color: '#7c3aed', fontWeight: 700 }}>Property Law Mastery</span>
        </nav>
        <PropertyLawGame />
      </div>
    );
  }

  if (currentView === VIEWS.CONLAW) {
    return (
      <div>
        <nav style={{
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <button
            onClick={() => setCurrentView(VIEWS.HOME)}
            className="secondary-button"
            style={{ padding: '8px 16px' }}
          >
            Back to Hub
          </button>
          <span style={{ color: '#7c3aed', fontWeight: 700 }}>Constitutional Law Mastery</span>
        </nav>
        <ConLawGame />
      </div>
    );
  }

  if (currentView === VIEWS.CODING) {
    return (
      <div>
        <nav style={{
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <button
            onClick={() => setCurrentView(VIEWS.HOME)}
            className="secondary-button"
            style={{ padding: '8px 16px' }}
          >
            Back to Hub
          </button>
          <span style={{ color: '#7c3aed', fontWeight: 700 }}>Coding Fundamentals</span>
        </nav>
        <div className="container">
          <h2 className="section-title">Bite-sized lessons</h2>
          <div className="grid">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.title} {...lesson} />
            ))}
          </div>

          <h2 className="section-title">Guided exercise</h2>
          <Exercise {...exercise} />

          <h2 className="section-title">Practice routines</h2>
          <div className="grid">
            {resources.map((resource) => (
              <motion.div
                key={resource.title}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25 }}
              >
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <ul>
                  {resource.items.map((item) => (
                    <li key={item} style={{ color: '#cbd5e1' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Home / Hub view
  return (
    <div className="container">
      <header className="hero" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            className="badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Khan Academy for Law
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Master Law Through <span className="highlight">Active Learning</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            No boring multiple choice. Game-based learning that requires you to actually master the material.
            Issue spotting, oral arguments, and synthesis challenges.
          </motion.p>
        </div>
      </header>

      <h2 className="section-title">Law Courses</h2>
      <div className="grid">
        <motion.div
          className="card"
          whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView(VIEWS.PROPERTY)}
          style={{ cursor: 'pointer' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="badge">20+ Cases</div>
          <h3>Property Law</h3>
          <p>From Pierson v. Post to Kelo. Master acquisition, estates, landlord-tenant, servitudes, and takings.</p>
          <div className="lesson-list">
            <span className="lesson-chip">Doctrine Match</span>
            <span className="lesson-chip">Issue Spotting</span>
            <span className="lesson-chip">Timeline</span>
            <span className="lesson-chip">Boss Battles</span>
          </div>
          <div className="action-bar">
            <button className="button">Start Learning</button>
          </div>
        </motion.div>

        <motion.div
          className="card"
          whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView(VIEWS.CONLAW)}
          style={{ cursor: 'pointer' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="badge">30+ Cases</div>
          <h3>Constitutional Law</h3>
          <p>From Marbury to Dobbs. Judicial power, federalism, separation of powers, equal protection, due process.</p>
          <div className="lesson-list">
            <span className="lesson-chip">Framework Builder</span>
            <span className="lesson-chip">Power Mapping</span>
            <span className="lesson-chip">Oral Argument</span>
            <span className="lesson-chip">Circuit Breaker</span>
          </div>
          <div className="action-bar">
            <button className="button">Start Learning</button>
          </div>
        </motion.div>

        <motion.div
          className="card"
          style={{ opacity: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="pill">Coming Soon</div>
          <h3>Contracts</h3>
          <p>Formation, performance, breach, and remedies. From Hamer v. Sidway to UCC Article 2.</p>
          <div className="lesson-list">
            <span className="lesson-chip">65+ Cases</span>
          </div>
        </motion.div>

        <motion.div
          className="card"
          style={{ opacity: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="pill">Coming Soon</div>
          <h3>Torts</h3>
          <p>Negligence, strict liability, intentional torts. Palsgraf, Carroll Towing, and the reasonable person.</p>
          <div className="lesson-list">
            <span className="lesson-chip">50+ Cases</span>
          </div>
        </motion.div>
      </div>

      <h2 className="section-title">How It Works</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>1</div>
          <h3>No Passive Reading</h3>
          <p>Every interaction forces active recall. Match doctrines, spot issues, build frameworks.</p>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>2</div>
          <h3>Progressive Difficulty</h3>
          <p>Start with matching, advance to issue spotting, master with synthesis and oral arguments.</p>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>3</div>
          <h3>Exam-Ready</h3>
          <p>Boss battles simulate real exam hypos. Write analysis, get feedback on key points.</p>
        </motion.div>
      </div>

      <h2 className="section-title">Also Available</h2>
      <div className="grid">
        <motion.div
          className="card"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView(VIEWS.CODING)}
          style={{ cursor: 'pointer' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="pill">Bonus</div>
          <h3>Coding Fundamentals</h3>
          <p>JavaScript, React, and Framer Motion. Build interactive skills.</p>
          <div className="action-bar">
            <button className="secondary-button">Explore</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
