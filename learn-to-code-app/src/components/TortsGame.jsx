import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';

// Torts Case Library
const TORTS_CASES = {
  intentionalTorts: [
    {
      name: "Vosburg v. Putney",
      year: 1891,
      cite: "Wis. 1891",
      doctrine: "Battery; eggshell plaintiff",
      holding: "Intent to contact suffices; defendant takes plaintiff as found",
      keyRule: "Intent to make contact, not intent to harm, establishes battery. Thin skull rule applies."
    },
    {
      name: "Garratt v. Dailey",
      year: 1955,
      cite: "Wash. 1955",
      doctrine: "Intent via substantial certainty",
      holding: "Knowledge that contact is substantially certain equals intent",
      keyRule: "Intent satisfied when actor knows with substantial certainty that harmful contact will occur."
    },
    {
      name: "Katko v. Briney",
      year: 1971,
      cite: "Iowa 1971",
      doctrine: "Defense of property limits",
      holding: "Cannot use deadly force to protect unoccupied property",
      keyRule: "Human life outweighs property interests; spring guns are excessive force."
    }
  ],
  negligenceStandard: [
    {
      name: "Brown v. Kendall",
      year: 1850,
      cite: "Mass. 1850",
      doctrine: "Negligence standard origin",
      holding: "Liability requires failure to exercise ordinary care",
      keyRule: "Plaintiff must prove defendant failed to use ordinary care under the circumstances."
    },
    {
      name: "Vaughan v. Menlove",
      year: 1837,
      cite: "C.P. 1837",
      doctrine: "Objective reasonable person",
      holding: "Standard is reasonable person, not defendant's subjective prudence",
      keyRule: "The law requires the prudence of a reasonable person, not the defendant's best judgment."
    },
    {
      name: "U.S. v. Carroll Towing",
      year: 1947,
      cite: "2d Cir. 1947",
      doctrine: "Hand Formula (B < PL)",
      holding: "Negligence when burden of precaution is less than probability times loss",
      keyRule: "B < P × L: If cost of precaution is less than expected harm, failure to take it is negligent."
    },
    {
      name: "The T.J. Hooper",
      year: 1932,
      cite: "2d Cir. 1932",
      doctrine: "Custom not conclusive",
      holding: "Industry custom is evidence but not dispositive of due care",
      keyRule: "A whole industry may be negligent; reasonable prudence may exceed customary practice."
    }
  ],
  duty: [
    {
      name: "Palsgraf v. Long Island R.R.",
      year: 1928,
      cite: "N.Y. 1928",
      doctrine: "Duty limited to foreseeable plaintiffs",
      holding: "No duty to unforeseeable plaintiffs outside zone of danger",
      keyRule: "Cardozo: Duty runs only to those foreseeably endangered by the negligent conduct."
    },
    {
      name: "Tarasoff v. Regents",
      year: 1976,
      cite: "Cal. 1976",
      doctrine: "Duty to warn identifiable victims",
      holding: "Therapists must warn when patient poses serious threat to identifiable third party",
      keyRule: "Special relationship creates duty to protect foreseeable victims from patient's threats."
    },
    {
      name: "Yania v. Bigan",
      year: 1959,
      cite: "Pa. 1959",
      doctrine: "No duty to rescue",
      holding: "No general duty to rescue absent special relationship",
      keyRule: "Nonfeasance creates no liability; duty arises from special relationship or creating peril."
    },
    {
      name: "Kline v. 1500 Mass. Ave.",
      year: 1970,
      cite: "D.C. Cir. 1970",
      doctrine: "Landlord duty for common areas",
      holding: "Landlord owes duty to protect tenants from foreseeable criminal acts in common areas",
      keyRule: "Control over premises plus foreseeability creates duty to provide security."
    }
  ],
  causation: [
    {
      name: "Summers v. Tice",
      year: 1948,
      cite: "Cal. 1948",
      doctrine: "Alternative liability",
      holding: "Burden shifts to negligent defendants when causation uncertain",
      keyRule: "When two negligent actors and one caused harm, burden shifts to each to prove they didn't cause it."
    },
    {
      name: "Sindell v. Abbott Labs",
      year: 1980,
      cite: "Cal. 1980",
      doctrine: "Market share liability",
      holding: "Liability apportioned by market share for fungible products",
      keyRule: "When specific causation impossible due to fungible product, apportion by market share."
    },
    {
      name: "Herskovits v. Group Health",
      year: 1983,
      cite: "Wash. 1983",
      doctrine: "Loss of chance",
      holding: "Reduction in survival probability is compensable injury",
      keyRule: "Lost chance of better outcome is cognizable harm even without >50% causation."
    }
  ],
  proximateCause: [
    {
      name: "Wagon Mound No. 1",
      year: 1961,
      cite: "P.C. 1961",
      doctrine: "Foreseeability of type of harm",
      holding: "Liability limited to foreseeable types of harm",
      keyRule: "Defendant liable only for kinds of harm that were reasonably foreseeable."
    },
    {
      name: "Palsgraf v. Long Island R.R.",
      year: 1928,
      cite: "N.Y. 1928",
      doctrine: "Andrews dissent: proximate cause",
      holding: "Andrews: proximate cause is policy question, not foreseeability",
      keyRule: "Andrews dissent: Duty to world; cut off liability by practical politics and rough sense of justice."
    }
  ],
  strictLiability: [
    {
      name: "Rylands v. Fletcher",
      year: 1868,
      cite: "H.L. 1868",
      doctrine: "Strict liability for non-natural use",
      holding: "Strictly liable for escape of dangerous things from land",
      keyRule: "One who brings dangerous thing on land is strictly liable if it escapes and causes damage."
    },
    {
      name: "Indiana Harbor Belt R.R. v. American Cyanamid",
      year: 1990,
      cite: "7th Cir. 1990",
      doctrine: "Strict liability limits",
      holding: "Strict liability inappropriate where negligence can manage risk",
      keyRule: "Posner: Prefer negligence when precautions can reduce risk; strict liability for irreducible risks."
    }
  ],
  productsLiability: [
    {
      name: "MacPherson v. Buick",
      year: 1916,
      cite: "N.Y. 1916",
      doctrine: "Manufacturer duty to consumers",
      holding: "Privity not required; duty extends to foreseeable users",
      keyRule: "Cardozo: Manufacturer owes duty of care to all persons foreseeably endangered by product."
    },
    {
      name: "Escola v. Coca-Cola",
      year: 1944,
      cite: "Cal. 1944",
      doctrine: "Res ipsa / strict products liability preview",
      holding: "Exploding bottle permits inference of negligence",
      keyRule: "Traynor concurrence: Manufacturers should be strictly liable for defective products."
    },
    {
      name: "Greenman v. Yuba Power",
      year: 1963,
      cite: "Cal. 1963",
      doctrine: "Strict products liability",
      holding: "Manufacturer strictly liable for defective products causing injury",
      keyRule: "Strict liability in tort for products placed on market knowing they will be used without inspection."
    }
  ],
  defenses: [
    {
      name: "Butterfield v. Forrester",
      year: 1809,
      cite: "K.B. 1809",
      doctrine: "Contributory negligence origin",
      holding: "Plaintiff's own negligence bars recovery",
      keyRule: "One who fails to use ordinary care for own safety cannot recover for resulting injury."
    },
    {
      name: "Li v. Yellow Cab",
      year: 1975,
      cite: "Cal. 1975",
      doctrine: "Comparative negligence adoption",
      holding: "Pure comparative negligence replaces contributory negligence bar",
      keyRule: "Plaintiff's damages reduced by percentage of own fault; no complete bar."
    },
    {
      name: "Murphy v. Steeplechase",
      year: 1929,
      cite: "N.Y. 1929",
      doctrine: "Assumption of risk",
      holding: "Voluntary encounter with known risk bars recovery",
      keyRule: "Cardozo: 'The timorous may stay at home.' Volenti non fit injuria."
    }
  ],
  resIpsa: [
    {
      name: "Byrne v. Boadle",
      year: 1863,
      cite: "Ex. 1863",
      doctrine: "Res ipsa loquitur origin",
      holding: "Falling barrel from warehouse permits inference of negligence",
      keyRule: "The thing speaks for itself: accident of this type doesn't normally occur without negligence."
    },
    {
      name: "Ybarra v. Spangard",
      year: 1944,
      cite: "Cal. 1944",
      doctrine: "Res ipsa with multiple defendants",
      holding: "Unconscious patient can invoke res ipsa against all operating room staff",
      keyRule: "When all defendants had control and plaintiff can't identify tortfeasor, all must explain."
    }
  ]
};

// Torts scenarios for issue spotting
const TORTS_SCENARIOS = [
  {
    facts: "A landowner builds a reservoir on his property. The water escapes through old mine shafts and floods a neighbor's coal mine.",
    issues: ["Strict liability", "Non-natural use of land", "Escape of dangerous thing"],
    relevantCase: "Rylands v. Fletcher",
    difficulty: 2
  },
  {
    facts: "A therapist's patient confides he plans to kill his ex-girlfriend. The therapist does nothing. The patient kills the woman.",
    issues: ["Duty to warn", "Special relationship", "Foreseeable victim", "Third-party liability"],
    relevantCase: "Tarasoff v. Regents",
    difficulty: 3
  },
  {
    facts: "Two hunters simultaneously fire at the same bird. One pellet hits the plaintiff, but it's impossible to determine whose gun it came from.",
    issues: ["Alternative liability", "Burden shifting", "Joint tortfeasors", "Causation uncertainty"],
    relevantCase: "Summers v. Tice",
    difficulty: 3
  },
  {
    facts: "A man sets a spring gun in his unoccupied farmhouse. A trespasser entering to steal is shot and seriously injured.",
    issues: ["Defense of property", "Deadly force limits", "Proportionality", "Trespass defense"],
    relevantCase: "Katko v. Briney",
    difficulty: 2
  },
  {
    facts: "A child, 5 years old, pulls a chair out from under an elderly woman who is about to sit. The woman falls and breaks her hip.",
    issues: ["Intent via substantial certainty", "Battery", "Child standard of care", "Age and capacity"],
    relevantCase: "Garratt v. Dailey",
    difficulty: 2
  },
  {
    facts: "Railroad employees push a man onto a departing train, dislodging his package. The package contains fireworks that explode, causing a scale to fall on a woman at the other end of the platform.",
    issues: ["Duty to foreseeable plaintiffs", "Zone of danger", "Proximate cause", "Unforeseeable plaintiff"],
    relevantCase: "Palsgraf v. Long Island R.R.",
    difficulty: 4
  },
  {
    facts: "A tugboat company doesn't equip its boats with radios, which is common in the industry. A storm warning goes out by radio, and the unwarned tug loses its cargo.",
    issues: ["Custom as evidence", "Reasonable care", "Industry practice not conclusive"],
    relevantCase: "The T.J. Hooper",
    difficulty: 3
  },
  {
    facts: "A woman takes DES during pregnancy. Twenty years later, her daughter develops cancer. She can't identify which of 200 manufacturers made the specific pills her mother took.",
    issues: ["Market share liability", "Fungible products", "Causation impossibility", "Enterprise liability"],
    relevantCase: "Sindell v. Abbott Labs",
    difficulty: 4
  }
];

// Boss battle questions
const BOSS_QUESTIONS = [
  {
    question: "A doctor misdiagnoses cancer, reducing a patient's survival chances from 40% to 25%. The patient dies. The estate sues for wrongful death. Analyze the causation issues and available theories of recovery.",
    model_answer: {
      traditionalCausation: "Traditional but-for causation fails because patient likely would have died anyway (only 40% survival). Cannot prove death 'more likely than not' caused by negligence.",
      lossOfChance: "Under Herskovits loss-of-chance theory, the 15% reduction in survival probability is itself compensable. Damages proportional to lost chance, not full wrongful death damages.",
      policyArguments: "Policy favors recovery: otherwise doctors could negligently treat terminal patients with impunity. But risk of speculative damages and insurance costs.",
      damageCalculation: "If adopted, damages = 15% of full wrongful death value (the lost chance), not 100%."
    },
    points: 30,
    difficulty: 5
  },
  {
    question: "A landlord knows crime is increasing in the building's parking garage but does nothing. A tenant is assaulted. Analyze duty, breach, and any defenses.",
    model_answer: {
      duty: "Under Kline v. 1500 Mass Ave, landlord has duty to protect tenants from foreseeable criminal acts in common areas they control. Foreseeability established by prior incidents and rising crime.",
      breach: "Breach if reasonable landlord would have taken precautions (lighting, security, locks) and these were cost-justified under Hand formula. B < PL analysis.",
      causation: "Must show precautions would have prevented this specific assault. Criminal's intervening act typically doesn't break chain if foreseeable.",
      defenses: "Possible comparative fault if tenant ignored warnings or took unreasonable risks. Assumption of risk unlikely unless tenant specifically knew and voluntarily encountered danger."
    },
    points: 30,
    difficulty: 4
  }
];

const GAME_MODES = {
  DOCTRINE_MATCH: 'doctrine_match',
  ISSUE_SPOT: 'issue_spot',
  TIMELINE: 'timeline',
  ELEMENTS_BUILD: 'elements_build',
  BOSS_BATTLE: 'boss_battle'
};

// Elements for building torts
const TORT_ELEMENTS = {
  negligence: ["Duty", "Breach", "Causation (Actual)", "Causation (Proximate)", "Damages"],
  battery: ["Intent", "Harmful or Offensive Contact", "With Plaintiff's Person"],
  assault: ["Intent", "Apprehension", "Of Imminent", "Harmful or Offensive Contact"],
  resIpsa: ["Accident doesn't normally occur without negligence", "Instrumentality under defendant's control", "Plaintiff didn't contribute"],
  strictLiability: ["Abnormally dangerous activity", "Activity not common in area", "Risk cannot be eliminated with reasonable care", "Causation", "Damages"]
};

function TortsGame() {
  const [gameMode, setGameMode] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Doctrine match state
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [matched, setMatched] = useState([]);

  // Issue spotting state
  const [issueInput, setIssueInput] = useState('');
  const [foundIssues, setFoundIssues] = useState([]);
  const [showHint, setShowHint] = useState(false);

  // Timeline state
  const [timelineCases, setTimelineCases] = useState([]);
  const [timelineOrder, setTimelineOrder] = useState([]);

  // Elements builder state
  const [targetTort, setTargetTort] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [availableElements, setAvailableElements] = useState([]);

  // Boss battle state
  const [bossAnswer, setBossAnswer] = useState('');
  const [bossGrade, setBossGrade] = useState(null);

  const getAllCases = useCallback(() => {
    return Object.values(TORTS_CASES).flat();
  }, []);

  const initializeGame = useCallback((mode) => {
    setGameMode(mode);
    setScore(0);
    setLevel(1);
    setCurrentQuestion(0);
    setLives(3);
    setStreak(0);
    setGameOver(false);
    setShowFeedback(false);
    setMatched([]);
    setSelectedFirst(null);
    setFoundIssues([]);
    setIssueInput('');
    setTimelineOrder([]);
    setSelectedElements([]);
    setBossAnswer('');
    setBossGrade(null);
    setShowHint(false);

    const allCases = getAllCases();

    if (mode === GAME_MODES.DOCTRINE_MATCH) {
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 6);
      const cases = selected.map((c, i) => ({ id: `case-${i}`, type: 'case', text: c.name, pair: i }));
      const doctrines = selected.map((c, i) => ({ id: `doc-${i}`, type: 'doctrine', text: c.doctrine, pair: i }));
      setMatchPairs([...cases, ...doctrines].sort(() => Math.random() - 0.5));
    } else if (mode === GAME_MODES.TIMELINE) {
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 5);
      setTimelineCases(selected.sort(() => Math.random() - 0.5));
    } else if (mode === GAME_MODES.ELEMENTS_BUILD) {
      const torts = Object.keys(TORT_ELEMENTS);
      const tort = torts[Math.floor(Math.random() * torts.length)];
      setTargetTort(tort);
      const allElements = Object.values(TORT_ELEMENTS).flat();
      const shuffled = [...new Set(allElements)].sort(() => Math.random() - 0.5).slice(0, 10);
      setAvailableElements(shuffled);
    }
  }, [getAllCases]);

  // Match handler
  const handleMatchClick = (item) => {
    if (matched.includes(item.pair)) return;
    if (!selectedFirst) {
      setSelectedFirst(item);
    } else {
      if (selectedFirst.pair === item.pair && selectedFirst.type !== item.type) {
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
        setStreak(0);
        setLives(l => l - 1);
        if (lives <= 1) setGameOver(true);
      }
      setSelectedFirst(null);
    }
  };

  // Issue spotting handler
  const handleIssueSubmit = () => {
    const currentPattern = TORTS_SCENARIOS[currentQuestion % TORTS_SCENARIOS.length];
    const input = issueInput.toLowerCase();
    let newFound = [...foundIssues];

    currentPattern.issues.forEach(issue => {
      const keywords = issue.toLowerCase().split(' ');
      const matches = keywords.filter(k => k.length > 3 && input.includes(k));
      if (matches.length >= 1 && !newFound.includes(issue)) {
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

  // Timeline handler
  const handleTimelineAdd = (caseItem) => {
    if (timelineOrder.find(c => c.name === caseItem.name)) return;
    const newOrder = [...timelineOrder, caseItem];
    setTimelineOrder(newOrder);

    if (newOrder.length === timelineCases.length) {
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

  // Elements builder handler
  const handleElementSelect = (element) => {
    if (selectedElements.includes(element)) {
      setSelectedElements(selectedElements.filter(e => e !== element));
    } else {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const checkElements = () => {
    const correct = TORT_ELEMENTS[targetTort].every(e => selectedElements.includes(e)) &&
                    selectedElements.every(e => TORT_ELEMENTS[targetTort].includes(e));
    if (correct) {
      setScore(s => s + 20);
      setStreak(s => s + 1);
      setIsCorrect(true);
    } else {
      setLives(l => l - 1);
      setIsCorrect(false);
      if (lives <= 1) setGameOver(true);
    }
    setShowFeedback(true);
  };

  // Boss battle handler
  const handleBossSubmit = () => {
    const currentBoss = BOSS_QUESTIONS[currentQuestion % BOSS_QUESTIONS.length];
    const response = bossAnswer.toLowerCase();
    let points = 0;
    const feedback = [];

    Object.entries(currentBoss.model_answer).forEach(([key, value]) => {
      const keywords = value.toLowerCase().split(' ').filter(w => w.length > 5);
      const matchCount = keywords.filter(k => response.includes(k)).length;
      if (matchCount >= keywords.length * 0.3) {
        points += currentBoss.points / Object.keys(currentBoss.model_answer).length;
        feedback.push({ key, status: 'hit' });
      } else {
        feedback.push({ key, status: 'miss' });
      }
    });

    setScore(s => s + Math.round(points));
    setBossGrade({ points: Math.round(points), total: currentBoss.points, feedback, model: currentBoss.model_answer });
  };

  // Next question
  const nextQuestion = () => {
    setCurrentQuestion(q => q + 1);
    setShowFeedback(false);
    setFoundIssues([]);
    setTimelineOrder([]);
    setSelectedElements([]);
    setBossAnswer('');
    setBossGrade(null);
    setShowHint(false);

    if (gameMode === GAME_MODES.TIMELINE) {
      const allCases = getAllCases();
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 5);
      setTimelineCases(selected.sort(() => Math.random() - 0.5));
    } else if (gameMode === GAME_MODES.ELEMENTS_BUILD) {
      const torts = Object.keys(TORT_ELEMENTS);
      const tort = torts[Math.floor(Math.random() * torts.length)];
      setTargetTort(tort);
      const allElements = Object.values(TORT_ELEMENTS).flat();
      const shuffled = [...new Set(allElements)].sort(() => Math.random() - 0.5).slice(0, 10);
      setAvailableElements(shuffled);
    }
  };

  // Mode selector
  if (!gameMode) {
    return (
      <div className="container">
        <header className="hero" style={{ gridTemplateColumns: '1fr' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="badge">Torts Mastery</div>
            <h1>Choose Your <span className="highlight">Challenge</span></h1>
            <p>From Palsgraf to products liability. Master negligence, causation, and defenses.</p>
          </div>
        </header>

        <h2 className="section-title">Game Modes</h2>
        <div className="grid">
          <motion.div className="card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => initializeGame(GAME_MODES.DOCTRINE_MATCH)} style={{ cursor: 'pointer' }}>
            <div className="pill">Level 1-2</div>
            <h3>Doctrine Match</h3>
            <p>Match landmark tort cases to their doctrines.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Memory</span>
              <span className="lesson-chip">Recognition</span>
            </div>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => initializeGame(GAME_MODES.ELEMENTS_BUILD)} style={{ cursor: 'pointer' }}>
            <div className="pill">Level 2</div>
            <h3>Elements Builder</h3>
            <p>Construct the elements of each tort from scratch.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Negligence</span>
              <span className="lesson-chip">Battery</span>
              <span className="lesson-chip">Res Ipsa</span>
            </div>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => initializeGame(GAME_MODES.ISSUE_SPOT)} style={{ cursor: 'pointer' }}>
            <div className="pill">Level 2-3</div>
            <h3>Issue Spotting</h3>
            <p>Read fact patterns and identify all tort issues.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Analysis</span>
              <span className="lesson-chip">Application</span>
            </div>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => initializeGame(GAME_MODES.TIMELINE)} style={{ cursor: 'pointer' }}>
            <div className="pill">Level 2-3</div>
            <h3>Timeline Challenge</h3>
            <p>Arrange cases chronologically. Understand tort evolution.</p>
            <div className="lesson-list">
              <span className="lesson-chip">History</span>
              <span className="lesson-chip">Evolution</span>
            </div>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => initializeGame(GAME_MODES.BOSS_BATTLE)} style={{ cursor: 'pointer' }}>
            <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>Master Level</div>
            <h3>Boss Battle</h3>
            <p>Complex hypos requiring full analysis. Essay format.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Synthesis</span>
              <span className="lesson-chip">Exam Prep</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Game over
  if (gameOver) {
    return (
      <div className="container">
        <motion.div className="hero" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div>
            <h1>Game Over</h1>
            <p style={{ fontSize: '48px', margin: '20px 0' }}>{score} points</p>
            <p>Level: {level} | Streak: {streak}</p>
            <div className="action-bar" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <button className="button" onClick={() => initializeGame(gameMode)}>Try Again</button>
              <button className="secondary-button" onClick={() => setGameMode(null)}>Choose Mode</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="badge">Score: {score}</div>
        <div className="badge">Level: {level}</div>
        <div className="badge">Streak: {streak}</div>
        <div className="badge" style={{ background: lives <= 1 ? 'rgba(239, 68, 68, 0.2)' : undefined }}>Lives: {'❤️'.repeat(lives)}</div>
        <button className="secondary-button" onClick={() => setGameMode(null)} style={{ padding: '6px 12px' }}>Exit</button>
      </div>

      {/* Doctrine Match */}
      {gameMode === GAME_MODES.DOCTRINE_MATCH && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Match Cases to Doctrines</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {matchPairs.map(item => (
              <motion.div key={item.id} className="card" whileHover={{ scale: matched.includes(item.pair) ? 1 : 1.05 }} onClick={() => handleMatchClick(item)}
                style={{ cursor: matched.includes(item.pair) ? 'default' : 'pointer', opacity: matched.includes(item.pair) ? 0.5 : 1, minHeight: '100px', borderColor: selectedFirst?.id === item.id ? '#7c3aed' : undefined }}>
                <div className="pill" style={{ fontSize: '10px' }}>{item.type}</div>
                <p style={{ textAlign: 'center', fontWeight: item.type === 'case' ? 600 : 400 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Elements Builder */}
      {gameMode === GAME_MODES.ELEMENTS_BUILD && targetTort && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Build: {targetTort.charAt(0).toUpperCase() + targetTort.slice(1)}</h2>
          <div className="card" style={{ marginBottom: '20px' }}>
            <p>Your Elements:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '50px', marginTop: '10px' }}>
              {selectedElements.map(e => (
                <motion.span key={e} className="lesson-chip" style={{ background: 'rgba(34, 211, 238, 0.2)', cursor: 'pointer' }} onClick={() => handleElementSelect(e)}>{e} ✕</motion.span>
              ))}
            </div>
          </div>
          {!showFeedback ? (
            <>
              <div className="grid" style={{ marginBottom: '20px' }}>
                {availableElements.map(element => (
                  <motion.div key={element} className="card" whileHover={{ scale: selectedElements.includes(element) ? 1 : 1.03 }} onClick={() => handleElementSelect(element)}
                    style={{ cursor: 'pointer', opacity: selectedElements.includes(element) ? 0.4 : 1, minHeight: 'auto', padding: '12px' }}>
                    <p style={{ margin: 0 }}>{element}</p>
                  </motion.div>
                ))}
              </div>
              <button className="button" onClick={checkElements}>Check Elements</button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card"
              style={{ background: isCorrect ? 'rgba(34, 211, 238, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
              <h3 style={{ color: isCorrect ? '#22d3ee' : '#fca5a5' }}>{isCorrect ? 'Correct!' : 'Not Quite'}</h3>
              <p><strong>Elements of {targetTort}:</strong></p>
              <ul>{TORT_ELEMENTS[targetTort].map(e => <li key={e}>{e}</li>)}</ul>
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Issue Spotting */}
      {gameMode === GAME_MODES.ISSUE_SPOT && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Spot the Issues</h2>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="pill">Fact Pattern #{currentQuestion + 1}</div>
            <p style={{ fontSize: '18px', lineHeight: 1.7, marginTop: '15px' }}>{TORTS_SCENARIOS[currentQuestion % TORTS_SCENARIOS.length].facts}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#cbd5e1' }}>Found: {foundIssues.length} / {TORTS_SCENARIOS[currentQuestion % TORTS_SCENARIOS.length].issues.length}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {foundIssues.map((issue, i) => (<span key={i} className="lesson-chip" style={{ background: 'rgba(34, 211, 238, 0.2)' }}>{issue}</span>))}
            </div>
          </div>
          {!showFeedback ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={issueInput} onChange={(e) => setIssueInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleIssueSubmit()} placeholder="Type a tort issue..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: '16px' }} />
              <button className="button" onClick={handleIssueSubmit}>Submit</button>
              <button className="secondary-button" onClick={() => setShowHint(!showHint)}>{showHint ? 'Hide' : 'Hint'}</button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ background: 'rgba(34, 211, 238, 0.1)' }}>
              <h3 style={{ color: '#22d3ee' }}>All Issues Found!</h3>
              <p><strong>Key Case:</strong> {TORTS_SCENARIOS[currentQuestion % TORTS_SCENARIOS.length].relevantCase}</p>
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next</button>
            </motion.div>
          )}
          {showHint && !showFeedback && (
            <div className="card" style={{ marginTop: '15px', background: 'rgba(124, 58, 237, 0.1)' }}>
              <p><strong>Hint:</strong> Think about {TORTS_SCENARIOS[currentQuestion % TORTS_SCENARIOS.length].relevantCase}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Timeline */}
      {gameMode === GAME_MODES.TIMELINE && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Arrange Chronologically (Oldest First)</h2>
          <div className="card" style={{ marginBottom: '20px', minHeight: '100px' }}>
            <p style={{ color: '#94a3b8' }}>Your Timeline:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timelineOrder.map((c, i) => (
                <motion.div key={c.name} className="lesson-chip">{i + 1}. {c.name} {showFeedback && `(${c.year})`}</motion.div>
              ))}
            </div>
          </div>
          {!showFeedback && (
            <div className="grid">
              {timelineCases.map(c => (
                <motion.div key={c.name} className="card" whileHover={{ scale: timelineOrder.find(t => t.name === c.name) ? 1 : 1.03 }} onClick={() => handleTimelineAdd(c)}
                  style={{ cursor: timelineOrder.find(t => t.name === c.name) ? 'default' : 'pointer', opacity: timelineOrder.find(t => t.name === c.name) ? 0.4 : 1 }}>
                  <h3 style={{ fontSize: '14px' }}>{c.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{c.doctrine}</p>
                </motion.div>
              ))}
            </div>
          )}
          {showFeedback && (
            <motion.div className="card" style={{ background: isCorrect ? 'rgba(34, 211, 238, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
              <h3 style={{ color: isCorrect ? '#22d3ee' : '#fca5a5' }}>{isCorrect ? 'Perfect!' : 'Not Quite'}</h3>
              {!isCorrect && <div><p>Correct order:</p>{[...timelineCases].sort((a, b) => a.year - b.year).map((c, i) => <p key={c.name}>{i + 1}. {c.name} ({c.year})</p>)}</div>}
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Boss Battle */}
      {gameMode === GAME_MODES.BOSS_BATTLE && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Boss Battle</h2>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>{BOSS_QUESTIONS[currentQuestion % BOSS_QUESTIONS.length].points} points</div>
            <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '15px' }}>{BOSS_QUESTIONS[currentQuestion % BOSS_QUESTIONS.length].question}</p>
          </div>
          {!bossGrade ? (
            <div>
              <textarea value={bossAnswer} onChange={(e) => setBossAnswer(e.target.value)} placeholder="Write your full analysis..."
                style={{ width: '100%', minHeight: '200px', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: '16px', lineHeight: 1.7 }} />
              <div className="action-bar" style={{ marginTop: '15px' }}>
                <button className="button" onClick={handleBossSubmit} disabled={bossAnswer.length < 100}>Submit</button>
                <span style={{ color: '#64748b' }}>{bossAnswer.length} chars</span>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3>Score: {bossGrade.points} / {bossGrade.total}</h3>
                {bossGrade.feedback.map(f => (
                  <div key={f.key} className="lesson-chip" style={{ display: 'block', marginBottom: '8px', background: f.status === 'hit' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: f.status === 'hit' ? '#22d3ee' : '#fca5a5' }}>
                    {f.status === 'hit' ? '✓' : '✗'} {f.key}
                  </div>
                ))}
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
              <button className="button" onClick={nextQuestion} style={{ marginTop: '20px' }}>Next</button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default TortsGame;
