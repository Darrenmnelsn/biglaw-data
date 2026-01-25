import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// Constitutional Law Master Case Library
const CONLAW_CASES = {
  judicialPower: [
    {
      name: "Marbury v. Madison",
      year: 1803,
      cite: "5 U.S. 137 (1803)",
      doctrine: "Judicial review of federal acts",
      holding: "Courts can declare laws unconstitutional; Constitution is supreme law",
      keyRule: "It is emphatically the province and duty of the judicial department to say what the law is."
    },
    {
      name: "Martin v. Hunter's Lessee",
      year: 1816,
      cite: "14 U.S. 304 (1816)",
      doctrine: "Supreme Court review of state courts",
      holding: "SCOTUS can review state court decisions on federal questions",
      keyRule: "Uniformity in interpretation of federal law requires Supreme Court appellate jurisdiction over state courts."
    },
    {
      name: "Cooper v. Aaron",
      year: 1958,
      cite: "358 U.S. 1 (1958)",
      doctrine: "Judicial supremacy",
      holding: "States cannot nullify federal court orders; Brown applies everywhere",
      keyRule: "The federal judiciary is supreme in exposition of constitutional law."
    },
    {
      name: "Ex parte McCardle",
      year: 1869,
      cite: "74 U.S. 506 (1869)",
      doctrine: "Congressional control of jurisdiction",
      holding: "Congress can strip SCOTUS appellate jurisdiction",
      keyRule: "Appellate jurisdiction is granted 'with such exceptions as Congress shall make.'"
    }
  ],
  standing: [
    {
      name: "Lujan v. Defenders of Wildlife",
      year: 1992,
      cite: "504 U.S. 555 (1992)",
      doctrine: "Article III standing requirements",
      holding: "Standing requires injury-in-fact, causation, and redressability",
      keyRule: "Plaintiff must show concrete, particularized, actual or imminent injury fairly traceable to defendant and likely redressable by court."
    },
    {
      name: "Massachusetts v. EPA",
      year: 2007,
      cite: "549 U.S. 497 (2007)",
      doctrine: "State standing / procedural rights",
      holding: "States have special solicitude in standing analysis; procedural injury sufficient",
      keyRule: "States as quasi-sovereigns warrant special consideration when challenging federal agency action."
    },
    {
      name: "Clapper v. Amnesty International",
      year: 2013,
      cite: "568 U.S. 398 (2013)",
      doctrine: "Speculative injury insufficient",
      holding: "Self-inflicted costs to avoid speculative future harm don't create standing",
      keyRule: "Threatened injury must be certainly impending; allegations of possible future injury are not sufficient."
    },
    {
      name: "TransUnion v. Ramirez",
      year: 2021,
      cite: "594 U.S. ___ (2021)",
      doctrine: "Concrete harm requirement",
      holding: "Statutory violation alone insufficient; must show concrete harm",
      keyRule: "Article III standing requires concrete harm—not just statutory violation—resembling traditional causes of action."
    }
  ],
  federalism: [
    {
      name: "McCulloch v. Maryland",
      year: 1819,
      cite: "17 U.S. 316 (1819)",
      doctrine: "Implied powers / Necessary and Proper",
      holding: "Congress has implied powers; states cannot tax federal instrumentalities",
      keyRule: "Let the end be legitimate, let it be within the scope of the constitution, and all means which are appropriate are constitutional."
    },
    {
      name: "Gibbons v. Ogden",
      year: 1824,
      cite: "22 U.S. 1 (1824)",
      doctrine: "Commerce Clause scope",
      holding: "Commerce includes navigation; federal commerce power is broad",
      keyRule: "Commerce among the states cannot stop at state lines but includes intercourse affecting more states than one."
    },
    {
      name: "United States v. Lopez",
      year: 1995,
      cite: "514 U.S. 549 (1995)",
      doctrine: "Commerce Clause limits",
      holding: "Gun-free school zones not economic activity; Commerce power has limits",
      keyRule: "Commerce power reaches: (1) channels, (2) instrumentalities, (3) activities substantially affecting interstate commerce."
    },
    {
      name: "NFIB v. Sebelius",
      year: 2012,
      cite: "567 U.S. 519 (2012)",
      doctrine: "Commerce Clause cannot compel activity",
      holding: "Individual mandate not valid under Commerce Clause but valid as tax",
      keyRule: "Commerce power regulates existing activity, not inactivity; cannot compel commerce to regulate it."
    },
    {
      name: "Printz v. United States",
      year: 1997,
      cite: "521 U.S. 898 (1997)",
      doctrine: "Anti-commandeering",
      holding: "Congress cannot commandeer state executive officers",
      keyRule: "Federal government cannot compel states to enact or administer federal regulatory programs."
    },
    {
      name: "Murphy v. NCAA",
      year: 2018,
      cite: "584 U.S. ___ (2018)",
      doctrine: "Anti-commandeering applies to legislatures",
      holding: "Congress cannot command states to maintain laws; PASPA unconstitutional",
      keyRule: "Anti-commandeering prohibits Congress from issuing orders to state legislatures as well as executives."
    }
  ],
  separationOfPowers: [
    {
      name: "Youngstown v. Sawyer",
      year: 1952,
      cite: "343 U.S. 579 (1952)",
      doctrine: "Executive power limits / Jackson framework",
      holding: "President cannot seize steel mills without congressional authorization",
      keyRule: "Jackson's three zones: (1) Congress authorizes—maximum power; (2) Congress silent—zone of twilight; (3) Congress prohibits—lowest ebb."
    },
    {
      name: "INS v. Chadha",
      year: 1983,
      cite: "462 U.S. 919 (1983)",
      doctrine: "Legislative veto unconstitutional",
      holding: "One-house veto violates bicameralism and presentment",
      keyRule: "Legislative action requires passage by both houses and presentment to President."
    },
    {
      name: "Morrison v. Olson",
      year: 1988,
      cite: "487 U.S. 654 (1988)",
      doctrine: "Independent counsel / removal restrictions",
      holding: "Good-cause removal restriction valid for inferior officers",
      keyRule: "Congress can limit removal of inferior officers if restrictions don't impede President's constitutional duties."
    },
    {
      name: "Seila Law v. CFPB",
      year: 2020,
      cite: "591 U.S. ___ (2020)",
      doctrine: "Single-director agency removal",
      holding: "For-cause removal of single agency head violates separation of powers",
      keyRule: "President must have at-will removal power over single heads of executive agencies exercising significant authority."
    }
  ],
  equalProtection: [
    {
      name: "Korematsu v. United States",
      year: 1944,
      cite: "323 U.S. 214 (1944)",
      doctrine: "Strict scrutiny origin (race)",
      holding: "Japanese internment upheld (now discredited); strict scrutiny for race",
      keyRule: "All legal restrictions curtailing civil rights of a single racial group are immediately suspect—strict scrutiny."
    },
    {
      name: "Brown v. Board of Education",
      year: 1954,
      cite: "347 U.S. 483 (1954)",
      doctrine: "Separate but equal rejected",
      holding: "Segregation in public schools inherently unequal",
      keyRule: "Separate educational facilities are inherently unequal; segregation violates equal protection."
    },
    {
      name: "Craig v. Boren",
      year: 1976,
      cite: "429 U.S. 190 (1976)",
      doctrine: "Intermediate scrutiny for sex",
      holding: "Gender classifications must be substantially related to important government interest",
      keyRule: "Sex-based classifications must serve important governmental objectives and be substantially related to those objectives."
    },
    {
      name: "United States v. Virginia",
      year: 1996,
      cite: "518 U.S. 515 (1996)",
      doctrine: "Exceedingly persuasive justification",
      holding: "VMI's male-only policy unconstitutional",
      keyRule: "State must show 'exceedingly persuasive justification' for sex classification; cannot rely on overbroad generalizations."
    },
    {
      name: "Grutter v. Bollinger",
      year: 2003,
      cite: "539 U.S. 306 (2003)",
      doctrine: "Affirmative action / diversity",
      holding: "Race-conscious admissions can serve compelling diversity interest",
      keyRule: "Diversity in higher education can be compelling interest; narrow tailoring requires individualized, holistic review."
    },
    {
      name: "Students for Fair Admissions v. Harvard",
      year: 2023,
      cite: "600 U.S. ___ (2023)",
      doctrine: "Race-conscious admissions rejected",
      holding: "Harvard and UNC admissions programs violate Equal Protection",
      keyRule: "Race-based admissions programs lack sufficiently focused and measurable objectives; cannot use race directly."
    }
  ],
  substantiveDueProcess: [
    {
      name: "Lochner v. New York",
      year: 1905,
      cite: "198 U.S. 45 (1905)",
      doctrine: "Economic substantive due process (discredited)",
      holding: "Maximum hours law unconstitutional under liberty of contract",
      keyRule: "Liberty includes freedom to contract (now rejected for economic regulation)."
    },
    {
      name: "Griswold v. Connecticut",
      year: 1965,
      cite: "381 U.S. 479 (1965)",
      doctrine: "Right to privacy / penumbras",
      holding: "Contraception ban unconstitutional; privacy in Bill of Rights penumbras",
      keyRule: "Specific guarantees create zones of privacy; marital bedroom protected from governmental intrusion."
    },
    {
      name: "Roe v. Wade",
      year: 1973,
      cite: "410 U.S. 113 (1973)",
      doctrine: "Abortion right (overruled)",
      holding: "Right to abortion before viability; trimester framework",
      keyRule: "Privacy encompasses abortion decision (overruled by Dobbs 2022)."
    },
    {
      name: "Lawrence v. Texas",
      year: 2003,
      cite: "539 U.S. 558 (2003)",
      doctrine: "Liberty includes intimate conduct",
      holding: "Sodomy laws unconstitutional; adults have liberty in private intimate conduct",
      keyRule: "Liberty presumes autonomy of self including intimate conduct; moral disapproval insufficient basis for criminalization."
    },
    {
      name: "Dobbs v. Jackson",
      year: 2022,
      cite: "597 U.S. ___ (2022)",
      doctrine: "Abortion not in Constitution",
      holding: "Roe and Casey overruled; no constitutional right to abortion",
      keyRule: "Unenumerated rights must be deeply rooted in history and tradition; abortion right not deeply rooted."
    },
    {
      name: "Washington v. Glucksberg",
      year: 1997,
      cite: "521 U.S. 702 (1997)",
      doctrine: "Assisted suicide not fundamental",
      holding: "No fundamental right to assisted suicide",
      keyRule: "Fundamental rights must be deeply rooted in Nation's history and tradition, and implicit in ordered liberty."
    }
  ],
  firstAmendment: [
    {
      name: "Brandenburg v. Ohio",
      year: 1969,
      cite: "395 U.S. 444 (1969)",
      doctrine: "Incitement test",
      holding: "Speech can be punished only if directed to inciting imminent lawless action and likely to produce it",
      keyRule: "Advocacy of illegal action protected unless directed to inciting imminent lawless action and likely to produce such action."
    },
    {
      name: "New York Times v. Sullivan",
      year: 1964,
      cite: "376 U.S. 254 (1964)",
      doctrine: "Actual malice for public figures",
      holding: "Public officials must prove actual malice in defamation",
      keyRule: "Public official cannot recover for defamatory falsehood unless made with actual malice—knowledge of falsity or reckless disregard."
    },
    {
      name: "Texas v. Johnson",
      year: 1989,
      cite: "491 U.S. 397 (1989)",
      doctrine: "Symbolic speech / flag burning",
      holding: "Flag burning is protected expressive conduct",
      keyRule: "Government cannot prohibit expression of an idea simply because society finds it offensive or disagreeable."
    },
    {
      name: "R.A.V. v. City of St. Paul",
      year: 1992,
      cite: "505 U.S. 377 (1992)",
      doctrine: "Content-based restrictions on unprotected speech",
      holding: "Cross-burning ordinance unconstitutional because content-based",
      keyRule: "Even within unprotected categories, government cannot regulate based on hostility to particular ideas or viewpoints."
    },
    {
      name: "Reed v. Town of Gilbert",
      year: 2015,
      cite: "576 U.S. 155 (2015)",
      doctrine: "Content-based = strict scrutiny",
      holding: "Sign code treating signs differently by content is content-based",
      keyRule: "Government regulation is content-based if law applies to particular speech because of topic discussed or idea expressed."
    }
  ]
};

// Constitutional Framework Tests
const FRAMEWORK_TESTS = [
  {
    name: "Strict Scrutiny",
    applies: ["Race", "National origin", "Alienage (state)", "Fundamental rights"],
    elements: ["Compelling government interest", "Narrowly tailored", "Least restrictive means"],
    example: "Racial classifications in Korematsu, Brown, Grutter"
  },
  {
    name: "Intermediate Scrutiny",
    applies: ["Sex/Gender", "Legitimacy"],
    elements: ["Important government interest", "Substantially related"],
    example: "Gender classifications in Craig v. Boren, VMI"
  },
  {
    name: "Rational Basis",
    applies: ["Economic regulation", "Social/welfare legislation", "Age", "Disability"],
    elements: ["Legitimate government interest", "Rationally related"],
    example: "Most economic regulations; Railway Express v. New York"
  },
  {
    name: "Undue Burden (Casey)",
    applies: ["Pre-viability abortion regulations (pre-Dobbs)"],
    elements: ["Purpose or effect of placing substantial obstacle", "Before viability"],
    example: "Casey (1992) framework, now superseded by Dobbs"
  },
  {
    name: "Brandenburg Incitement",
    applies: ["Advocacy of illegal action"],
    elements: ["Directed to inciting", "Imminent lawless action", "Likely to produce"],
    example: "Brandenburg v. Ohio"
  },
  {
    name: "Youngstown Framework",
    applies: ["Executive power questions"],
    elements: ["Zone 1: Congress authorizes", "Zone 2: Congress silent", "Zone 3: Congress prohibits"],
    example: "Steel Seizure Case (Youngstown v. Sawyer)"
  }
];

// Oral argument hypotheticals
const ORAL_ARGUMENTS = [
  {
    context: "You are arguing for the government defending a federal law that prohibits possession of firearms within 1000 feet of any school.",
    question: "Justice asks: 'Counsel, how is this different from Lopez? What makes gun possession near schools an economic activity?'",
    strongAnswer: "Your Honor, unlike Lopez, this revised statute includes a jurisdictional hook requiring the firearm to have traveled in interstate commerce. Additionally, we have substantial congressional findings demonstrating the cumulative effect of gun violence on educational outcomes and workforce productivity—an economic impact the Lopez Court found lacking. The aggregate effects doctrine from Wickard applies when we consider all such incidents nationwide.",
    weakAnswer: "Schools are important and guns are dangerous, so Congress should be able to regulate this.",
    keyPoints: ["Jurisdictional hook", "Congressional findings", "Aggregate effects", "Economic impact on education"]
  },
  {
    context: "You are arguing for a plaintiff challenging a state law that bars all demonstrations within 100 feet of any healthcare facility.",
    question: "Justice asks: 'Isn't this just a reasonable time, place, manner restriction? The government isn't targeting any particular viewpoint.'",
    strongAnswer: "Your Honor, while facially neutral, this law is content-based under Reed v. Gilbert because it applies specifically to healthcare facilities—a topic-based distinction. Even if treated as content-neutral, it fails Ward's narrow tailoring requirement. A 100-foot buffer is not narrowly tailored when alternatives like noise restrictions could address congestion without eliminating speech entirely. Hill v. Colorado involved a floating 8-foot buffer, not a categorical 100-foot ban.",
    weakAnswer: "People have a right to protest wherever they want under the First Amendment.",
    keyPoints: ["Content-based analysis under Reed", "Ward narrow tailoring", "Hill v. Colorado distinction", "Alternative channels"]
  },
  {
    context: "You are defending a state university's consideration of race in admissions after Students for Fair Admissions.",
    question: "Justice asks: 'After SFFA, how can any race-conscious program survive? Didn't we just hold race cannot be a factor?'",
    strongAnswer: "Your Honor, SFFA prohibited using race as a direct factor in admissions decisions but expressly stated that universities may consider how race affected an applicant's life through essays and personal statements. We are not checking a race box—we are considering each applicant's full experience, including how overcoming racial discrimination shaped their character and perspective. This individualized, character-based assessment is what the majority opinion preserved.",
    weakAnswer: "Diversity is compelling and we need to have diverse students.",
    keyPoints: ["SFFA's express exception for personal essays", "Individualized consideration", "Character-based assessment", "Race as life experience vs. race as category"]
  },
  {
    context: "You represent a state challenging a federal mandate that states must implement a new environmental reporting system or lose all highway funding.",
    question: "Justice asks: 'South Dakota v. Dole allows conditions on federal funds. Why isn't this just a valid exercise of spending power?'",
    strongAnswer: "Your Honor, this mandate fails Dole's requirements on multiple grounds. First, the condition is not germane—environmental reporting has no nexus to highway construction. Second, the coercion is unconstitutional under NFIB v. Sebelius: threatening 100% of highway funding for non-compliance is 'a gun to the head,' not a condition. The Medicaid expansion in NFIB was struck down for threatening to withhold 10% of state budgets; highway funding represents even more. Third, this effectively commandeers state agencies to administer a federal program, violating Printz.",
    weakAnswer: "States have rights under the Tenth Amendment and this violates federalism.",
    keyPoints: ["Dole germaneness requirement", "NFIB coercion principle", "Printz anti-commandeering", "Percentage of budget analysis"]
  }
];

// Game modes
const GAME_MODES = {
  FRAMEWORK_BUILD: 'framework_build',
  POWER_MAP: 'power_map',
  TIMELINE: 'timeline',
  CIRCUIT_BREAKER: 'circuit_breaker',
  ORAL_ARGUMENT: 'oral_argument'
};

function ConLawGame() {
  const [gameMode, setGameMode] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Framework builder state
  const [selectedElements, setSelectedElements] = useState([]);
  const [availableElements, setAvailableElements] = useState([]);
  const [targetFramework, setTargetFramework] = useState(null);

  // Power mapping state
  const [powerQuestion, setPowerQuestion] = useState(null);
  const [powerOptions, setPowerOptions] = useState([]);

  // Timeline state
  const [timelineCases, setTimelineCases] = useState([]);
  const [timelineOrder, setTimelineOrder] = useState([]);

  // Circuit breaker state
  const [circuitTimer, setCircuitTimer] = useState(15);
  const [circuitQuestion, setCircuitQuestion] = useState(null);
  const [circuitRunning, setCircuitRunning] = useState(false);

  // Oral argument state
  const [oralResponse, setOralResponse] = useState('');
  const [oralGrade, setOralGrade] = useState(null);

  // Get all cases
  const getAllCases = useCallback(() => {
    return Object.values(CONLAW_CASES).flat();
  }, []);

  // Power mapping questions
  const POWER_QUESTIONS = [
    {
      scenario: "Congress passes a law requiring all states to implement a federal gun registry system.",
      correctAnswer: "Anti-commandeering violation",
      options: ["Valid Commerce Clause", "Anti-commandeering violation", "Valid Spending Power", "Necessary and Proper"],
      explanation: "Under Printz and Murphy v. NCAA, Congress cannot commandeer state officials to implement federal programs."
    },
    {
      scenario: "The President, without congressional authorization, orders the military to seize private factories during a labor dispute.",
      correctAnswer: "Youngstown Zone 3",
      options: ["Valid Commander-in-Chief", "Youngstown Zone 1", "Youngstown Zone 2", "Youngstown Zone 3"],
      explanation: "Congress has legislated in this area. When Congress prohibits executive action, presidential power is at its 'lowest ebb.'"
    },
    {
      scenario: "A state law treats men and women differently for alimony purposes, requiring only men to pay.",
      correctAnswer: "Intermediate scrutiny applies",
      options: ["Strict scrutiny applies", "Intermediate scrutiny applies", "Rational basis applies", "No constitutional issue"],
      explanation: "Under Craig v. Boren, sex-based classifications receive intermediate scrutiny: important interest, substantially related."
    },
    {
      scenario: "A federal law regulates the homegrown wheat consumption of farmers who never sell across state lines.",
      correctAnswer: "Valid under Wickard aggregate effects",
      options: ["Invalid - no interstate commerce", "Valid under Wickard aggregate effects", "Valid as police power", "Invalid under Lopez"],
      explanation: "Wickard v. Filburn: homegrown consumption, in aggregate, substantially affects interstate commerce."
    },
    {
      scenario: "A speaker at a rally says 'We should march to the Capitol and fight like hell for our country.' The crowd later becomes violent.",
      correctAnswer: "Likely protected - Brandenburg",
      options: ["Unprotected incitement", "Likely protected - Brandenburg", "Fighting words exception", "True threat"],
      explanation: "Brandenburg requires speech directed to inciting imminent lawless action AND likely to produce it. Abstract advocacy protected."
    },
    {
      scenario: "An environmental group sues the EPA for failing to regulate greenhouse gases, alleging general environmental harm to all citizens.",
      correctAnswer: "Likely no standing - generalized grievance",
      options: ["Clear standing - injury to environment", "Likely no standing - generalized grievance", "Taxpayer standing", "Citizen suit standing"],
      explanation: "Under Lujan, injury must be concrete and particularized. Generalized harm shared by all citizens usually fails."
    }
  ];

  // Initialize game mode
  const initializeGame = useCallback((mode) => {
    setGameMode(mode);
    setScore(0);
    setLevel(1);
    setCurrentQuestion(0);
    setLives(3);
    setStreak(0);
    setGameOver(false);
    setShowFeedback(false);
    setSelectedElements([]);
    setTimelineOrder([]);
    setOralResponse('');
    setOralGrade(null);
    setCircuitTimer(15);
    setCircuitRunning(false);

    if (mode === GAME_MODES.FRAMEWORK_BUILD) {
      const framework = FRAMEWORK_TESTS[Math.floor(Math.random() * FRAMEWORK_TESTS.length)];
      setTargetFramework(framework);
      const allElements = FRAMEWORK_TESTS.flatMap(f => f.elements);
      const shuffled = [...new Set(allElements)].sort(() => Math.random() - 0.5).slice(0, 8);
      setAvailableElements(shuffled);
    } else if (mode === GAME_MODES.POWER_MAP) {
      setPowerQuestion(POWER_QUESTIONS[0]);
      setPowerOptions(POWER_QUESTIONS[0].options.sort(() => Math.random() - 0.5));
    } else if (mode === GAME_MODES.TIMELINE) {
      const allCases = getAllCases();
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 5);
      setTimelineCases(selected.sort(() => Math.random() - 0.5));
    } else if (mode === GAME_MODES.CIRCUIT_BREAKER) {
      setCircuitQuestion(generateCircuitQuestion());
    }
  }, [getAllCases]);

  // Generate circuit breaker question
  const generateCircuitQuestion = () => {
    const allCases = Object.values(CONLAW_CASES).flat();
    const caseItem = allCases[Math.floor(Math.random() * allCases.length)];
    const questionTypes = [
      { q: `What doctrine did ${caseItem.name} establish?`, a: caseItem.doctrine },
      { q: `In what year was ${caseItem.name} decided?`, a: caseItem.year.toString() },
      { q: `Complete the quote: "${caseItem.keyRule.slice(0, 30)}..."`, a: caseItem.keyRule }
    ];
    return questionTypes[Math.floor(Math.random() * questionTypes.length)];
  };

  // Handle framework element selection
  const handleElementSelect = (element) => {
    if (selectedElements.includes(element)) {
      setSelectedElements(selectedElements.filter(e => e !== element));
    } else {
      setSelectedElements([...selectedElements, element]);
    }
  };

  // Check framework answer
  const checkFramework = () => {
    const correct = targetFramework.elements.every(e => selectedElements.includes(e)) &&
                    selectedElements.every(e => targetFramework.elements.includes(e));

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

  // Handle power mapping answer
  const handlePowerAnswer = (answer) => {
    const question = POWER_QUESTIONS[currentQuestion % POWER_QUESTIONS.length];
    const correct = answer === question.correctAnswer;

    if (correct) {
      setScore(s => s + 15);
      setStreak(s => s + 1);
      setIsCorrect(true);
    } else {
      setLives(l => l - 1);
      setStreak(0);
      setIsCorrect(false);
      if (lives <= 1) setGameOver(true);
    }
    setShowFeedback(true);
  };

  // Handle timeline
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

  // Handle circuit breaker timer
  useEffect(() => {
    if (gameMode === GAME_MODES.CIRCUIT_BREAKER && circuitRunning && circuitTimer > 0) {
      const timer = setTimeout(() => setCircuitTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (circuitTimer === 0 && circuitRunning) {
      setLives(l => l - 1);
      setCircuitRunning(false);
      if (lives <= 1) setGameOver(true);
      else {
        setCircuitTimer(15);
        setCircuitQuestion(generateCircuitQuestion());
      }
    }
  }, [circuitTimer, circuitRunning, gameMode, lives]);

  // Handle oral argument grading
  const handleOralSubmit = () => {
    const currentOral = ORAL_ARGUMENTS[currentQuestion % ORAL_ARGUMENTS.length];
    const response = oralResponse.toLowerCase();

    let points = 0;
    const feedback = [];

    currentOral.keyPoints.forEach(point => {
      const keywords = point.toLowerCase().split(/[\s-]+/).filter(w => w.length > 3);
      const matches = keywords.filter(k => response.includes(k)).length;
      if (matches >= keywords.length * 0.4) {
        points += 10;
        feedback.push({ point, status: 'hit' });
      } else {
        feedback.push({ point, status: 'miss' });
      }
    });

    setScore(s => s + points);
    setOralGrade({
      points,
      total: currentOral.keyPoints.length * 10,
      feedback,
      strongAnswer: currentOral.strongAnswer
    });
  };

  // Next question
  const nextQuestion = () => {
    setCurrentQuestion(q => q + 1);
    setShowFeedback(false);
    setSelectedElements([]);
    setTimelineOrder([]);
    setOralResponse('');
    setOralGrade(null);

    if (gameMode === GAME_MODES.FRAMEWORK_BUILD) {
      const framework = FRAMEWORK_TESTS[currentQuestion % FRAMEWORK_TESTS.length];
      setTargetFramework(framework);
      const allElements = FRAMEWORK_TESTS.flatMap(f => f.elements);
      const shuffled = [...new Set(allElements)].sort(() => Math.random() - 0.5).slice(0, 8);
      setAvailableElements(shuffled);
    } else if (gameMode === GAME_MODES.POWER_MAP) {
      const nextQ = POWER_QUESTIONS[(currentQuestion + 1) % POWER_QUESTIONS.length];
      setPowerQuestion(nextQ);
      setPowerOptions(nextQ.options.sort(() => Math.random() - 0.5));
    } else if (gameMode === GAME_MODES.TIMELINE) {
      const allCases = getAllCases();
      const selected = allCases.sort(() => Math.random() - 0.5).slice(0, 5);
      setTimelineCases(selected.sort(() => Math.random() - 0.5));
    }
  };

  // Mode selector
  if (!gameMode) {
    return (
      <div className="container">
        <header className="hero" style={{ gridTemplateColumns: '1fr' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="badge">Constitutional Law Mastery</div>
            <h1>Choose Your <span className="highlight">Challenge</span></h1>
            <p>Master ConLaw through argument and analysis - not passive reading.</p>
          </div>
        </header>

        <h2 className="section-title">Game Modes</h2>
        <div className="grid">
          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.FRAMEWORK_BUILD)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pill">Level 1-2</div>
            <h3>Framework Builder</h3>
            <p>Construct the correct constitutional test from its elements. Know your standards of review.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Scrutiny Levels</span>
              <span className="lesson-chip">Tests</span>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.POWER_MAP)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pill">Level 2-3</div>
            <h3>Power Mapping</h3>
            <p>Identify which constitutional doctrine applies to complex scenarios.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Federalism</span>
              <span className="lesson-chip">Sep. Powers</span>
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
            <h3>Constitutional Timeline</h3>
            <p>Arrange landmark cases chronologically. Understand doctrinal evolution.</p>
            <div className="lesson-list">
              <span className="lesson-chip">History</span>
              <span className="lesson-chip">Precedent</span>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.CIRCUIT_BREAKER)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pill">Level 3</div>
            <h3>Circuit Breaker</h3>
            <p>Rapid-fire ConLaw trivia. 15 seconds per question. How long can you last?</p>
            <div className="lesson-list">
              <span className="lesson-chip">Speed</span>
              <span className="lesson-chip">Recall</span>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => initializeGame(GAME_MODES.ORAL_ARGUMENT)}
            style={{ cursor: 'pointer' }}
          >
            <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Master Level</div>
            <h3>Oral Argument</h3>
            <p>Respond to Justice hypotheticals. Argue like you're at SCOTUS.</p>
            <div className="lesson-list">
              <span className="lesson-chip">Advocacy</span>
              <span className="lesson-chip">Synthesis</span>
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
        <motion.div
          className="hero"
          style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div>
            <h1>Game Over</h1>
            <p style={{ fontSize: '48px', margin: '20px 0' }}>{score} points</p>
            <p>Level: {level} | Best streak: {streak}</p>
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
      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="badge">Score: {score}</div>
        <div className="badge">Level: {level}</div>
        <div className="badge">Streak: {streak}</div>
        <div className="badge" style={{ background: lives <= 1 ? 'rgba(239, 68, 68, 0.2)' : undefined }}>
          Lives: {'❤️'.repeat(lives)}
        </div>
        {gameMode === GAME_MODES.CIRCUIT_BREAKER && circuitRunning && (
          <div className="badge" style={{ background: circuitTimer <= 5 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 211, 238, 0.2)' }}>
            Timer: {circuitTimer}s
          </div>
        )}
        <button className="secondary-button" onClick={() => setGameMode(null)} style={{ padding: '6px 12px' }}>Exit</button>
      </div>

      {/* Framework Builder */}
      {gameMode === GAME_MODES.FRAMEWORK_BUILD && targetFramework && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Build: {targetFramework.name}</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
            Applies to: {targetFramework.applies.join(', ')}
          </p>

          <div className="card" style={{ marginBottom: '20px' }}>
            <p>Your Framework Elements:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '50px', marginTop: '10px' }}>
              {selectedElements.map(e => (
                <motion.span
                  key={e}
                  className="lesson-chip"
                  style={{ background: 'rgba(34, 211, 238, 0.2)', cursor: 'pointer' }}
                  onClick={() => handleElementSelect(e)}
                  whileHover={{ scale: 1.05 }}
                >
                  {e} ✕
                </motion.span>
              ))}
              {selectedElements.length === 0 && <span style={{ color: '#64748b' }}>Click elements below to add...</span>}
            </div>
          </div>

          {!showFeedback ? (
            <>
              <div className="grid" style={{ marginBottom: '20px' }}>
                {availableElements.map(element => (
                  <motion.div
                    key={element}
                    className="card"
                    whileHover={{ scale: selectedElements.includes(element) ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleElementSelect(element)}
                    style={{
                      cursor: 'pointer',
                      opacity: selectedElements.includes(element) ? 0.4 : 1,
                      minHeight: 'auto',
                      padding: '12px'
                    }}
                  >
                    <p style={{ margin: 0 }}>{element}</p>
                  </motion.div>
                ))}
              </div>
              <button className="button" onClick={checkFramework} disabled={selectedElements.length === 0}>
                Check Framework
              </button>
            </>
          ) : (
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
                {isCorrect ? 'Correct!' : 'Not Quite'}
              </h3>
              <p><strong>Correct elements for {targetFramework.name}:</strong></p>
              <ul>
                {targetFramework.elements.map(e => <li key={e}>{e}</li>)}
              </ul>
              <p style={{ color: '#94a3b8', marginTop: '10px' }}>Example: {targetFramework.example}</p>
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next Framework</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Power Mapping */}
      {gameMode === GAME_MODES.POWER_MAP && powerQuestion && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Power Mapping</h2>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="pill">Scenario</div>
            <p style={{ fontSize: '18px', lineHeight: 1.7, marginTop: '15px' }}>{powerQuestion.scenario}</p>
          </div>

          {!showFeedback ? (
            <div className="grid">
              {powerOptions.map(option => (
                <motion.div
                  key={option}
                  className="card"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePowerAnswer(option)}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <p style={{ margin: 0, fontWeight: 600 }}>{option}</p>
                </motion.div>
              ))}
            </div>
          ) : (
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
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              <p><strong>Answer:</strong> {powerQuestion.correctAnswer}</p>
              <p style={{ marginTop: '10px' }}>{powerQuestion.explanation}</p>
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next Question</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Timeline */}
      {gameMode === GAME_MODES.TIMELINE && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Constitutional Timeline (Oldest First)</h2>

          <div className="card" style={{ marginBottom: '20px', minHeight: '100px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '10px' }}>Your Timeline:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timelineOrder.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lesson-chip"
                >
                  {i + 1}. {c.name} {showFeedback && `(${c.year})`}
                </motion.div>
              ))}
            </div>
          </div>

          {!showFeedback && (
            <div className="grid">
              {timelineCases.map(c => (
                <motion.div
                  key={c.name}
                  className="card"
                  whileHover={{ scale: timelineOrder.find(t => t.name === c.name) ? 1 : 1.03 }}
                  onClick={() => handleTimelineAdd(c)}
                  style={{
                    cursor: timelineOrder.find(t => t.name === c.name) ? 'default' : 'pointer',
                    opacity: timelineOrder.find(t => t.name === c.name) ? 0.4 : 1
                  }}
                >
                  <h3 style={{ fontSize: '14px' }}>{c.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{c.doctrine}</p>
                </motion.div>
              ))}
            </div>
          )}

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
                {isCorrect ? 'Perfect!' : 'Not Quite'}
              </h3>
              {!isCorrect && (
                <div>
                  <p>Correct order:</p>
                  {[...timelineCases].sort((a, b) => a.year - b.year).map((c, i) => (
                    <p key={c.name}>{i + 1}. {c.name} ({c.year})</p>
                  ))}
                </div>
              )}
              <button className="button" onClick={nextQuestion} style={{ marginTop: '15px' }}>Next</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Circuit Breaker */}
      {gameMode === GAME_MODES.CIRCUIT_BREAKER && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Circuit Breaker</h2>

          {!circuitRunning ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <h3>Ready for rapid-fire ConLaw?</h3>
              <p>You have 15 seconds per question. Type your answer and hit enter.</p>
              <button
                className="button"
                onClick={() => {
                  setCircuitRunning(true);
                  setCircuitQuestion(generateCircuitQuestion());
                }}
                style={{ marginTop: '20px' }}
              >
                Start Circuit
              </button>
            </div>
          ) : (
            <div className="card">
              <p style={{ fontSize: '20px', marginBottom: '20px' }}>{circuitQuestion?.q}</p>
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const correct = e.target.value.toLowerCase().includes(
                      circuitQuestion?.a?.toString().toLowerCase().slice(0, 10)
                    );
                    if (correct) {
                      setScore(s => s + 10);
                      setStreak(s => s + 1);
                    } else {
                      setLives(l => l - 1);
                      setStreak(0);
                      if (lives <= 1) setGameOver(true);
                    }
                    e.target.value = '';
                    setCircuitTimer(15);
                    setCircuitQuestion(generateCircuitQuestion());
                  }
                }}
                placeholder="Type answer and press Enter..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#e2e8f0',
                  fontSize: '18px'
                }}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Oral Argument */}
      {gameMode === GAME_MODES.ORAL_ARGUMENT && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="section-title">Oral Argument</h2>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="badge">Context</div>
            <p style={{ marginTop: '10px', color: '#cbd5e1' }}>
              {ORAL_ARGUMENTS[currentQuestion % ORAL_ARGUMENTS.length].context}
            </p>
          </div>

          <div className="card" style={{ marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)' }}>
            <div className="badge">Justice's Question</div>
            <p style={{ fontSize: '18px', lineHeight: 1.7, marginTop: '10px', fontStyle: 'italic' }}>
              "{ORAL_ARGUMENTS[currentQuestion % ORAL_ARGUMENTS.length].question}"
            </p>
          </div>

          {!oralGrade ? (
            <div>
              <textarea
                value={oralResponse}
                onChange={(e) => setOralResponse(e.target.value)}
                placeholder="Your Honor, [respond to the hypothetical with specific case law and doctrine]..."
                style={{
                  width: '100%',
                  minHeight: '180px',
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
                <button className="button" onClick={handleOralSubmit} disabled={oralResponse.length < 50}>
                  Submit Argument
                </button>
                <span style={{ color: '#64748b' }}>{oralResponse.length} characters</span>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3>Score: {oralGrade.points} / {oralGrade.total}</h3>
                <div style={{ marginTop: '15px' }}>
                  <p style={{ marginBottom: '10px' }}>Key Points:</p>
                  {oralGrade.feedback.map(f => (
                    <div key={f.point} className="lesson-chip" style={{
                      display: 'block',
                      marginBottom: '8px',
                      background: f.status === 'hit' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: f.status === 'hit' ? '#22d3ee' : '#fca5a5'
                    }}>
                      {f.status === 'hit' ? '✓' : '✗'} {f.point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Strong Answer</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>{oralGrade.strongAnswer}</p>
              </div>

              <button className="button" onClick={nextQuestion} style={{ marginTop: '20px' }}>
                Next Argument
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ConLawGame;
