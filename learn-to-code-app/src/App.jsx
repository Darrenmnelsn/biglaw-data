import { motion } from 'framer-motion';
import LessonCard from './components/LessonCard.jsx';
import Exercise from './components/Exercise.jsx';

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
  return (
    <div className="container">
      <header className="hero">
        <div>
          <div className="badge">Interactive playground</div>
          <h1>
            Build skills with <span className="highlight">React</span>, motion, and guided labs.
          </h1>
          <p>
            Learn the essentials of modern front-end development through short lessons, animated UI
            patterns, and hands-on practice prompts.
          </p>
          <div className="action-bar">
            <button className="button">Start the first lesson</button>
            <button className="secondary-button">View curriculum</button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
          style={{ height: '100%' }}
        >
          <div className="pill">Live preview</div>
          <p className="code-block" style={{ minHeight: 180 }}>
            <strong>What you will build</strong>
            <br />
            A responsive React + Framer Motion playground with guided exercises.
          </p>
          <p style={{ color: '#cbd5e1' }}>
            Everything updates in real time—perfect for pairing, teaching, or solo practice.
          </p>
        </motion.div>
      </header>

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
  );
}

export default App;
