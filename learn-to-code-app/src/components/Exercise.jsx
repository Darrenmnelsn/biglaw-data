import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Exercise = ({ title, steps, code, outcome }) => (
  <motion.div
    className="card"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25 }}
  >
    <div className="badge">Guided lab</div>
    <h3>{title}</h3>
    <ol>
      {steps.map((step, index) => (
        <li key={index} style={{ color: '#cbd5e1' }}>
          {step}
        </li>
      ))}
    </ol>
    <div className="code-block">
      <pre style={{ margin: 0 }}>{code}</pre>
    </div>
    <p style={{ color: '#a5b4fc', fontWeight: 600 }}>{outcome}</p>
  </motion.div>
);

Exercise.propTypes = {
  title: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  code: PropTypes.string.isRequired,
  outcome: PropTypes.string.isRequired
};

export default Exercise;
