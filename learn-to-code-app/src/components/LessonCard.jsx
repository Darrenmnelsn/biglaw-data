import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LessonCard = ({ title, description, topics, duration }) => {
  return (
    <motion.div
      className="card"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.35)' }}
    >
      <div className="pill">{duration}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="lesson-list">
        {topics.map((topic) => (
          <span className="lesson-chip" key={topic}>
            {topic}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

LessonCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  duration: PropTypes.string.isRequired
};

export default LessonCard;
