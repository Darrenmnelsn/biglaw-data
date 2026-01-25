import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// Property Law Case Library - Master Level Content
const PROPERTY_CASES = {
  acquisition: [
    {
      name: "Pierson v. Post",
      year: 1805,
      cite: "3 Cai. R. 175 (N.Y. 1805)",
      doctrine: "First possession requires actual capture",
      keyFacts: ["Fox hunt on unclaimed land", "Post was pursuing, Pierson intercepted and killed"],
      holding: "Mere pursuit is not enough; actual capture or mortal wounding required",
      rule: "Occupancy/possession requires certain control, not mere pursuit"
    },
    {
      name: "Ghen v. Rich",
      year: 1881,
      cite: "8 F. 159 (D. Mass. 1881)",
      doctrine: "Custom can define possession",
      keyFacts: ["Whaling industry custom", "Bomb-lance marked whale washed ashore", "Finder sold to third party"],
      holding: "Industry custom of marking whales respected; finder liable for conversion",
      rule: "When capture method makes physical control impractical, custom governs"
    },
    {
      name: "Keeble v. Hickeringill",
      year: 1707,
      cite: "103 Eng. Rep. 1127 (Q.B. 1707)",
      doctrine: "Interference with trade/livelihood",
      keyFacts: ["Decoy pond for wild fowl", "Defendant fired guns to scare ducks"],
      holding: "Malicious interference with lawful livelihood actionable even without possession",
      rule: "Ratione soli gives landowner constructive possession of wild animals on their land"
    },
    {
      name: "Popov v. Hayashi",
      year: 2002,
      cite: "2002 WL 31833731 (Cal. Super. Ct. 2002)",
      doctrine: "Pre-possessory interest",
      keyFacts: ["Barry Bonds' 73rd home run ball", "Popov caught but mobbed", "Hayashi emerged with ball"],
      holding: "Both had equal claims; ball sold and proceeds split",
      rule: "Pre-possessory interest protected when dispossession wrongful"
    }
  ],
  estates: [
    {
      name: "White v. Brown",
      year: 1977,
      cite: "559 S.W.2d 938 (Tenn. 1977)",
      doctrine: "Preference for fee simple",
      keyFacts: ["Will: 'I wish Evelyn White to have my home'", "No express limitation"],
      holding: "Language construed as fee simple, not life estate",
      rule: "Modern presumption favors fee simple; life estate requires clear intent"
    },
    {
      name: "Mahrenholz v. County Board",
      year: 1981,
      cite: "417 N.E.2d 138 (Ill. App. Ct. 1981)",
      doctrine: "Fee simple determinable vs. fee simple subject to condition subsequent",
      keyFacts: ["School deed: 'to be used for school purposes only'", "School use ceased"],
      holding: "Language created fee simple determinable with automatic reverter",
      rule: "'So long as' = determinable (automatic); 'but if/provided' = condition subsequent (re-entry needed)"
    },
    {
      name: "Mountain Brow Lodge v. Toscano",
      year: 1967,
      cite: "64 Cal. Rptr. 816 (Cal. Ct. App. 1967)",
      doctrine: "Restraints on alienation",
      keyFacts: ["Grant to lodge with restriction against sale", "Condition allowing use only by lodge"],
      holding: "Use restriction valid; absolute restraint on alienation void",
      rule: "Total restraints on fee simple alienation invalid; use restrictions may be valid"
    },
    {
      name: "Ink v. City of Canton",
      year: 1965,
      cite: "212 N.E.2d 574 (Ohio 1965)",
      doctrine: "Rights of entry alienability",
      keyFacts: ["City acquired right of entry", "Attempted conveyance to park district"],
      holding: "Rights of entry not alienable inter vivos at common law",
      rule: "Possibilities of reverter and rights of entry historically inalienable (now changed in most states)"
    }
  ],
  landlordTenant: [
    {
      name: "Berg v. Wiley",
      year: 1978,
      cite: "264 N.W.2d 145 (Minn. 1978)",
      doctrine: "Self-help eviction prohibited",
      keyFacts: ["Restaurant lease dispute", "Landlord changed locks while tenant away"],
      holding: "Self-help forbidden; only judicial process allowed",
      rule: "Modern rule requires judicial process for eviction regardless of lease terms"
    },
    {
      name: "Hilder v. St. Peter",
      year: 1984,
      cite: "478 A.2d 202 (Vt. 1984)",
      doctrine: "Implied warranty of habitability",
      keyFacts: ["Sewage backup, no water, broken windows", "Tenant paid rent, sued for damages"],
      holding: "Implied warranty exists in all residential leases; damages and rent abatement available",
      rule: "Landlord must maintain premises fit for human habitation; warranty cannot be waived"
    },
    {
      name: "Reste Realty v. Cooper",
      year: 1969,
      cite: "251 A.2d 268 (N.J. 1969)",
      doctrine: "Constructive eviction",
      keyFacts: ["Basement flooding whenever it rained", "Landlord failed to fix", "Tenant vacated"],
      holding: "Tenant's departure within reasonable time after substantial interference = constructive eviction",
      rule: "Landlord breach substantially interfering with use + tenant vacates = constructive eviction defense"
    },
    {
      name: "Sommer v. Kridel",
      year: 1977,
      cite: "378 A.2d 767 (N.J. 1977)",
      doctrine: "Landlord duty to mitigate",
      keyFacts: ["Tenant abandoned lease", "Landlord refused replacement tenant", "Sued for full rent"],
      holding: "Landlord must make reasonable efforts to re-let",
      rule: "Landlord has duty to mitigate damages by attempting to re-rent"
    }
  ],
  servitudes: [
    {
      name: "Tulk v. Moxhay",
      year: 1848,
      cite: "41 Eng. Rep. 1143 (Ch. 1848)",
      doctrine: "Equitable servitudes run with notice",
      keyFacts: ["Leicester Square garden covenant", "Subsequent purchaser with notice"],
      holding: "Covenant enforceable against successor with notice",
      rule: "Equity will enforce covenant against party who takes with notice, regardless of privity"
    },
    {
      name: "Sanborn v. McLean",
      year: 1925,
      cite: "206 N.W. 496 (Mich. 1925)",
      doctrine: "Implied reciprocal servitude",
      keyFacts: ["Residential neighborhood", "No express restriction in defendant's deed", "Gas station planned"],
      holding: "Common scheme creates implied restriction; inquiry notice sufficient",
      rule: "General plan of development creates implied reciprocal negative easements on all lots"
    },
    {
      name: "Neponsit v. Emigrant Bank",
      year: 1938,
      cite: "15 N.E.2d 793 (N.Y. 1938)",
      doctrine: "Touch and concern + affirmative covenants",
      keyFacts: ["HOA fees covenant", "Successor refused to pay", "Association sued"],
      holding: "Affirmative covenant to pay fees touches and concerns land",
      rule: "Touch and concern satisfied when covenant affects legal relations of parties as landowners"
    },
    {
      name: "Shelley v. Kraemer",
      year: 1948,
      cite: "334 U.S. 1 (1948)",
      doctrine: "Judicial enforcement as state action",
      keyFacts: ["Racially restrictive covenants", "Court enforcement sought"],
      holding: "Court enforcement of racial covenants = unconstitutional state action",
      rule: "Private discrimination becomes state action when courts enforce it"
    }
  ],
  takings: [
    {
      name: "Loretto v. Teleprompter",
      year: 1982,
      cite: "458 U.S. 419 (1982)",
      doctrine: "Per se taking - permanent physical occupation",
      keyFacts: ["Cable box installation on building", "State law required landlord access", "Minor intrusion"],
      holding: "Permanent physical occupation is per se taking regardless of size",
      rule: "Any permanent physical occupation requires compensation"
    },
    {
      name: "Lucas v. South Carolina",
      year: 1992,
      cite: "505 U.S. 1003 (1992)",
      doctrine: "Per se taking - total economic wipeout",
      keyFacts: ["Beachfront lots", "New law banned construction", "100% value loss"],
      holding: "Total deprivation of economic value is per se taking unless nuisance exception",
      rule: "Regulation eliminating all value requires compensation unless activity was already prohibited"
    },
    {
      name: "Penn Central v. New York City",
      year: 1978,
      cite: "438 U.S. 104 (1978)",
      doctrine: "Regulatory takings balancing test",
      keyFacts: ["Grand Central landmark designation", "Air rights development denied"],
      holding: "Not a taking under multi-factor analysis; TDRs relevant",
      rule: "Balance: (1) economic impact, (2) investment-backed expectations, (3) character of regulation"
    },
    {
      name: "Kelo v. City of New London",
      year: 2005,
      cite: "545 U.S. 469 (2005)",
      doctrine: "Public use includes economic development",
      keyFacts: ["Private homes condemned for private development", "Economic revitalization plan"],
      holding: "Economic development qualifies as public use under broad interpretation",
      rule: "Public use satisfied by any conceivable public purpose; deference to legislature"
    }
  ]
};

// Game modes
const GAME_MODES = {
  DOCTRINE_MATCH: 'doctrine_match',
  ISSUE_SPOT: 'issue_spot',
  TIMELINE: 'timeline',
  CASE_SORT: 'case_sort',
  BOSS_BATTLE: 'boss_battle'
};

// Issue spotting fact patterns
const ISSUE_PATTERNS = [
  {
    facts: "A hunter is chasing a fox across open land when another hunter, seeing the chase, kills the fox and takes it.",
    issues: ["First possession", "Actual capture requirement", "Mere pursuit insufficient"],
    relevantCase: "Pierson v. Post",
    difficulty: 1
  },
  {
    facts: "A residential developer sells lots with deed restrictions requiring single-family homes. Ten years later, one owner's deed never mentioned the restriction, but all other lots did. The owner now wants to build apartments.",
    issues: ["Implied reciprocal servitude", "Common scheme", "Notice doctrine"],
    relevantCase: "Sanborn v. McLean",
    difficulty: 2
  },
  {
    facts: "A landlord's tenant complains repeatedly about sewage backing up into the basement. The landlord promises to fix it but never does. After six months, the tenant moves out and stops paying rent.",
    issues: ["Implied warranty of habitability", "Constructive eviction", "Tenant remedies"],
    relevantCase: "Hilder v. St. Peter / Reste Realty v. Cooper",
    difficulty: 2
  },
  {
    facts: "A city passes a law requiring all landlords to allow cable companies to install small junction boxes on their buildings. Landlords receive $1 per installation.",
    issues: ["Per se taking", "Permanent physical occupation", "Just compensation"],
    relevantCase: "Loretto v. Teleprompter",
    difficulty: 3
  },
  {
    facts: "A will states: 'I leave Blackacre to my daughter, but if she ever sells it, then to my son.' The daughter wants to sell the property.",
    issues: ["Fee simple determinable vs. condition subsequent", "Restraint on alienation", "Validity of forfeiture clause"],
    relevantCase: "Mountain Brow Lodge v. Toscano",
    difficulty: 3
  },
  {
    facts: "After a tenant abandons her lease with 6 months remaining, the landlord rejects a qualified replacement tenant and sues the original tenant for all remaining rent.",
    issues: ["Duty to mitigate", "Landlord obligations", "Damages calculation"],
    relevantCase: "Sommer v. Kridel",
    difficulty: 2
  },
  {
    facts: "A state passes environmental legislation that completely prohibits any construction on certain coastal lots. An owner who paid $1 million for two lots argues this eliminates all value.",
    issues: ["Total economic wipeout", "Nuisance exception", "Background principles"],
    relevantCase: "Lucas v. South Carolina",
    difficulty: 4
  },
  {
    facts: "A city designates a historic train station as a landmark, prohibiting the owners from building a 55-story tower above it. The owners retain significant value from the existing use and receive transferable development rights.",
    issues: ["Regulatory taking", "Penn Central factors", "Investment-backed expectations", "TDRs"],
    relevantCase: "Penn Central v. New York City",
    difficulty: 4
  }
];

// Boss battle synthesis questions
const BOSS_QUESTIONS = [
  {
    question: "A covenant restricts property to 'residential use only.' The current owner wants to run a daycare from her home. She argues: (1) the covenant doesn't touch and concern land, (2) she had no actual notice, and (3) changed conditions make enforcement inequitable. Analyze each argument.",
    model_answer: {
      touchAndConcern: "Under Neponsit, a covenant touches and concerns land when it affects the parties' legal relations as landowners. A residential use restriction directly affects how the land may be used, satisfying this requirement.",
      notice: "Under Sanborn, inquiry notice may suffice. If the neighborhood shows a common residential scheme, the owner had duty to investigate. Actual notice of the exact covenant is not required if circumstances would lead a reasonable person to inquire.",
      changedConditions: "Changed conditions defense requires the ENTIRE area's character to have changed, not just the immediate vicinity. If surrounding properties remain residential, mere commercial encroachment nearby is insufficient."
    },
    points: 30,
    difficulty: 5
  },
  {
    question: "The government requires landowners to allow public beach access across their property. Analyze whether this is: (a) a per se physical taking under Loretto, (b) a per se economic taking under Lucas, or (c) requires Penn Central balancing. What factors matter most?",
    model_answer: {
      loretto: "This could be a per se taking under Loretto if it constitutes a permanent physical occupation. However, Loretto involved fixed installations; public access might be distinguishable as temporary/intermittent intrusions.",
      lucas: "Not a Lucas taking unless the access requirement eliminates ALL economic value. If the owner can still build and use the property, this fails the total wipeout test.",
      pennCentral: "Most likely requires Penn Central balancing: (1) Economic impact - partial loss of exclusion right but property still usable; (2) Investment-backed expectations - depends on when purchased and existing regulations; (3) Character - public access requirement has physical invasion character favoring owner. The 'character' factor may push toward compensation even without total deprivation."
    },
    points: 30,
    difficulty: 5
  }
];

function PropertyLawGame() {
  const [gameMode, setGameMode] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledCases, setShuffledCases] = useState([]);
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [matched, setMatched] = useState([]);
  const [issueInput, setIssueInput] = useState('');
  const [foundIssues, setFoundIssues] = useState([]);
  const [timelineOrder, setTimelineOrder] = useState([]);
  const [bossAnswer, setBossAnswer] = useState('');
  const [bossGrade, setBossGrade] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Get all cases flattened
  const getAllCases = useCallback(() => {
    return Object.values(PROPERTY_CASES).flat();
  }, []);

  // Initialize game mode
  const initializeGame = useCallback((mode) => {
    setGameMode(mode);
    setScore(0);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setStreak(0);
    setLives(3);
    setGameOver(false);
    setMatched([]);
    setSelectedFirst(null);
    setFoundIssues([]);
    setIssueInput('');
    setBossAnswer('');
    setBossGrade(null);
    setShowHint(false);

    const allCases = getAllCases();

    if (mode === GAME_MODES.DOCTRINE_MATCH) {
      // Create matching pairs
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 6);
      const cases = selected.map((c, i) => ({ id: `case-${i}`, type: 'case', text: c.name, pair: i }));
      const doctrines = selected.map((c, i) => ({ id: `doc-${i}`, type: 'doctrine', text: c.doctrine, pair: i }));
      setMatchPairs([...cases, ...doctrines].sort(() => Math.random() - 0.5));
    } else if (mode === GAME_MODES.TIMELINE) {
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 5);
      setShuffledCases(selected.sort(() => Math.random() - 0.5));
      setTimelineOrder([]);
    }
  }, [getAllCases]);

  // Handle doctrine matching
  const handleMatchClick = (item) => {
    if (matched.includes(item.pair)) return;

    if (!selectedFirst) {
      setSelectedFirst(item);
    } else {
      if (selectedFirst.pair === item.pair && selectedFirst.type !== item.type) {
        // Match found!
        setMatched([...matched, item.pair]);
        setScore(s => s + 10);
        setStreak(s => s + 1);
        if (matched.length + 1 === 6) {
          setTimeout(() => {
            setLevel(l => l + 1);
            initializeGame(GAME_MODES.DOCTRINE_MATCH);
          }, 1000);
        }
      } else {
        // Wrong match
        setStreak(0);
        setLives(l => l - 1);
        if (lives <= 1) setGameOver(true);
      }
      setSelectedFirst(null);
    }
  };

  // Handle issue spotting
  const handleIssueSubmit = () => {
    const currentPattern = ISSUE_PATTERNS[currentQuestion % ISSUE_PATTERNS.length];
    const input = issueInput.toLowerCase();

    let newFound = [...foundIssues];
    currentPattern.issues.forEach(issue => {
      const keywords = issue.toLowerCase().split(' ');
      const matches = keywords.filter(k => k.length > 4 && input.includes(k));
      if (matches.length >= 2 && !newFound.includes(issue)) {
        newFound.push(issue);
        setScore(s => s + 15);
      }
    });

    setFoundIssues(newFound);
    setIssueInput('');

    if (newFound.length === currentPattern.issues.length) {
      setShowFeedback(true);
      setIsCorrect(true);
      setStreak(s => s + 1);
    }
  };

  // Handle timeline ordering
  const handleTimelineAdd = (caseItem) => {
    if (timelineOrder.find(c => c.name === caseItem.name)) return;
    const newOrder = [...timelineOrder, caseItem];
    setTimelineOrder(newOrder);

    if (newOrder.length === shuffledCases.length) {
      // Check order
      const correct = [...newOrder].sort((a, b) => a.year - b.year);
      const isOrderCorrect = newOrder.every((c, i) => c.name === correct[i].name);

      if (isOrderCorrect) {
        setScore(s => s + 25);
        setStreak(s => s + 1);
        setIsCorrect(true);
      } else {
        setLives(l => l - 1);
        setIsCorrect(false);
        if (lives <= 1) setGameOver(true);
      }
      setShowFeedback(true);
    }
  };

  // Handle boss battle grading
  const handleBossSubmit = () => {
    const currentBoss = BOSS_QUESTIONS[currentQuestion % BOSS_QUESTIONS.length];
    const answer = bossAnswer.toLowerCase();

    let grade = 0;
    const feedback = [];

    // Check for key concepts
    Object.entries(currentBoss.model_answer).forEach(([key, value]) => {
      const keywords = value.toLowerCase().split(' ').filter(w => w.length > 5);
      const matchCount = keywords.filter(k => answer.includes(k)).length;
      const matchPercent = matchCount / keywords.length;

      if (matchPercent > 0.3) {
        grade += currentBoss.points / Object.keys(currentBoss.model_answer).length;
        feedback.push({ key, status: 'good' });
      } else {
        feedback.push({ key, status: 'needs_work' });
      }
    });

    setScore(s => s + Math.round(grade));
    setBossGrade({ score: Math.round(grade), total: currentBoss.points, feedback, model: currentBoss.model_answer });
  };

  // Next question
  const nextQuestion = () => {
    setCurrentQuestion(q => q + 1);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setFoundIssues([]);
    setTimelineOrder([]);
    setBossAnswer('');
    setBossGrade(null);
    setShowHint(false);

    if (gameMode === GAME_MODES.TIMELINE) {
      const allCases = getAllCases();
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 5);
      setShuffledCases(selected.sort(() => Math.random() - 0.5));
    }
  };

  // Render game mode selector
  if (!gameMode) {
    return (
      <div className="container">
        <header className="hero" style={{ gridTemplateColumns: '1fr' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="badge">Property Law Mastery</div>
            <h1>Choose Your <span className="highlight">Challenge</span></h1>
            <p>Master property law through active learning - not boring multiple choice.</p>
          </div>
        </header>

        <h2 className="section-title">Game Modes</h2>
        <div className="grid">
          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.DOCTRINE_MATCH)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pill">Level 1-2</div>
            <h3>Doctrine Match</h3>
            <p>Match landmark cases to their doctrines. Build your foundation.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Memory</span>
              <span className="lesson-chip">Recognition</span>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.ISSUE_SPOT)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pill">Level 2-3</div>
            <h3>Issue Spotting</h3>
            <p>Read fact patterns and identify all legal issues. Think like a lawyer.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Analysis</span>
              <span className="lesson-chip">Application</span>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.TIMELINE)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pill">Level 2-3</div>
            <h3>Timeline Challenge</h3>
            <p>Arrange cases chronologically. Understand how doctrine evolved.</p>
            <div className="lesson-list">
              <span className="lesson-chip">History</span>
              <span className="lesson-chip">Evolution</span>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.BOSS_BATTLE)}
            style={{ cursor: 'pointer' }}
          >
            <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Master Level</div>
            <h3>Boss Battle</h3>
            <p>Complex hypos requiring synthesis of multiple doctrines. Essay format.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Synthesis</span>
              <span className="lesson-chip">Exam Prep</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <div className="container">
        <motion.div
          className="hero"
          style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div>
            <h1>Game Over</h1>
            <p style={{ fontSize: '48px', margin: '20px 0' }}>{score} points</p>
            <p>Level reached: {level} | Best streak: {streak}</p>
            <div className="action-bar" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <button className="button" onClick={() => initializeGame(gameMode)}>Try Again</button>
              <button className="secondary-button" onClick={() => setGameMode(null)}>Choose Mode</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render active game
  return (
    <div className="container">
      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="badge">Score: {score}</div>
        <div className="badge">Level: {level}</div>
        <div className="badge">Streak: {streak}</div>
        <div className="badge" style={{ background: lives <= 1 ? 'rgba(239, 68, 68, 0.2)' : undefined }}>
          Lives: {'❤️'.repeat(lives)}
        </div>
        <button className="secondary-button" onClick={() => setGameMode(null)} style={{ padding: '6px 12px' }}>Exit</button>
      </div>

      {/* Doctrine Match Mode */}
      {gameMode === GAME_MODES.DOCTRINE_MATCH && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Match Cases to Doctrines</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>Click a case, then click its matching doctrine.</p>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {matchPairs.map(item => (
              <motion.div
                key={item.id}
                className="card"
                whileHover={{ scale: matched.includes(item.pair) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMatchClick(item)}
                style={{
                  cursor: matched.includes(item.pair) ? 'default' : 'pointer',
                  opacity: matched.includes(item.pair) ? 0.5 : 1,
                  minHeight: '100px',
                  justifyContent: 'center',
                  borderColor: selectedFirst?.id === item.id ? '#7c3aed' : undefined,
                  borderWidth: selectedFirst?.id === item.id ? '2px' : undefined
                }}
              >
                <div className="pill" style={{ fontSize: '10px' }}>{item.type}</div>
                <p style={{ textAlign: 'center', fontWeight: item.type === 'case' ? 600 : 400 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>

          {matched.length === 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', marginTop: '30px' }}
            >
              <h3 style={{ color: '#22d3ee' }}>Level Complete!</h3>
              <p>Loading next level...</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Issue Spotting Mode */}
      {gameMode === GAME_MODES.ISSUE_SPOT && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Spot the Issues</h2>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="pill">Fact Pattern #{currentQuestion + 1}</div>
            <p style={{ fontSize: '18px', lineHeight: 1.7 }}>
              {ISSUE_PATTERNS[currentQuestion % ISSUE_PATTERNS.length].facts}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
              Found: {foundIssues.length} / {ISSUE_PATTERNS[currentQuestion % ISSUE_PATTERNS.length].issues.length} issues
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {foundIssues.map((issue, i) => (
                <span key={i} className="lesson-chip" style={{ background: 'rgba(34, 211, 238, 0.2)' }}>{issue}</span>
              ))}
            </div>
          </div>

          {!showFeedback ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={issueInput}
                onChange={(e) => setIssueInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleIssueSubmit()}
                placeholder="Type a legal issue you identify..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#e2e8f0',
                  fontSize: '16px'
                }}
              />
              <button className="button" onClick={handleIssueSubmit}>Submit</button>
              <button className="secondary-button" onClick={() => setShowHint(!showHint)}>
                {showHint ? 'Hide Hint' : 'Hint'}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
              style={{ background: 'rgba(34, 211, 238, 0.1)', borderColor: 'rgba(34, 211, 238, 0.3)' }}
            >
              <h3 style={{ color: '#22d3ee' }}>All Issues Found!</h3>
              <p><strong>Relevant Case:</strong> {ISSUE_PATTERNS[currentQuestion % ISSUE_PATTERNS.length].relevantCase}</p>
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next Pattern</button>
            </motion.div>
          )}

          {showHint && !showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
              style={{ marginTop: '15px', background: 'rgba(124, 58, 237, 0.1)' }}
            >
              <p><strong>Hint:</strong> Think about {ISSUE_PATTERNS[currentQuestion % ISSUE_PATTERNS.length].relevantCase}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Timeline Mode */}
      {gameMode === GAME_MODES.TIMELINE && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Arrange Cases Chronologically (Oldest First)</h2>

          {/* Timeline display */}
          <div className="card" style={{ marginBottom: '20px', minHeight: '100px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '10px' }}>Your Timeline:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timelineOrder.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lesson-chip"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{i + 1}.</span>
                  <span>{c.name}</span>
                  {showFeedback && <span>({c.year})</span>}
                </motion.div>
              ))}
              {timelineOrder.length === 0 && <span style={{ color: '#64748b' }}>Click cases below to add them...</span>}
            </div>
          </div>

          {/* Available cases */}
          {!showFeedback && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {shuffledCases.map(c => (
                <motion.div
                  key={c.name}
                  className="card"
                  whileHover={{ scale: timelineOrder.find(t => t.name === c.name) ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTimelineAdd(c)}
                  style={{
                    cursor: timelineOrder.find(t => t.name === c.name) ? 'default' : 'pointer',
                    opacity: timelineOrder.find(t => t.name === c.name) ? 0.4 : 1,
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ fontSize: '16px' }}>{c.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{c.doctrine}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
              style={{
                background: isCorrect ? 'rgba(34, 211, 238, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: isCorrect ? 'rgba(34, 211, 238, 0.3)' : 'rgba(239, 68, 68, 0.3)'
              }}
            >
              <h3 style={{ color: isCorrect ? '#22d3ee' : '#fca5a5' }}>
                {isCorrect ? 'Perfect Order!' : 'Not Quite Right'}
              </h3>
              {!isCorrect && (
                <div>
                  <p>Correct order:</p>
                  {[...shuffledCases].sort((a, b) => a.year - b.year).map((c, i) => (
                    <p key={c.name}>{i + 1}. {c.name} ({c.year})</p>
                  ))}
                </div>
              )}
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next Challenge</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Boss Battle Mode */}
      {gameMode === GAME_MODES.BOSS_BATTLE && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Boss Battle: Complex Synthesis</h2>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
              {BOSS_QUESTIONS[currentQuestion % BOSS_QUESTIONS.length].points} points possible
            </div>
            <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '15px' }}>
              {BOSS_QUESTIONS[currentQuestion % BOSS_QUESTIONS.length].question}
            </p>
          </div>

          {!bossGrade ? (
            <div>
              <textarea
                value={bossAnswer}
                onChange={(e) => setBossAnswer(e.target.value)}
                placeholder="Write your analysis here. Be thorough - address each argument systematically..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#e2e8f0',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  resize: 'vertical'
                }}
              />
              <div className="action-bar" style={{ marginTop: '15px' }}>
                <button className="button" onClick={handleBossSubmit} disabled={bossAnswer.length < 100}>
                  Submit Answer
                </button>
                <span style={{ color: '#64748b' }}>{bossAnswer.length} characters</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3>Your Score: {bossGrade.score} / {bossGrade.total}</h3>
                <div style={{ marginTop: '15px' }}>
                  {bossGrade.feedback.map(f => (
                    <div key={f.key} style={{ marginBottom: '10px' }}>
                      <span className="lesson-chip" style={{
                        background: f.status === 'good' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: f.status === 'good' ? '#22d3ee' : '#fca5a5'
                      }}>
                        {f.key}: {f.status === 'good' ? 'Good' : 'Needs Work'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Model Answer</h3>
                {Object.entries(bossGrade.model).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#7c3aed' }}>{key}:</strong>
                    <p style={{ color: '#cbd5e1', marginTop: '5px' }}>{value}</p>
                  </div>
                ))}
              </div>

              <button className="button" onClick={nextQuestion} style={{ marginTop: '20px' }}>
                Next Boss Battle
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default PropertyLawGame;
