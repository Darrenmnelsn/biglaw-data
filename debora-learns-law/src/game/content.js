import partnerEmails from "../../../questions.json";
import examBank from "../../../exam_questions.json";
import civExam from "../../../civexam_questions.json";
import caseLib from "../../../caselib.json";

const PARTNERS = ["Partner Cope", "Partner Bamzai", "Partner Kordana", "Partner Coughlin"];
export const SUBJECTS = ["Torts", "Contracts", "Criminal Law", "Civil Procedure"];

function subjectFromEmail(subject) {
  const head = subject.split("—")[0].trim();
  return SUBJECTS.includes(head) ? head : "Bar Review";
}

// Unified shape: { id, subject, from, prompt, options, answer, rule }
function normalize() {
  const all = [];

  partnerEmails.forEach((q, i) => {
    all.push({
      id: `pe-${i}`,
      subject: subjectFromEmail(q.subject),
      from: q.from,
      prompt: q.body,
      options: q.options,
      answer: q.answer,
      rule: null,
    });
  });

  examBank.questions.forEach((q, i) => {
    all.push({
      id: `ex-${q.id ?? i}`,
      subject: "Bar Review",
      from: PARTNERS[i % PARTNERS.length],
      prompt: q.fact,
      options: q.options,
      answer: q.answer,
      rule: q.rule || null,
    });
  });

  civExam.CivExamSim.forEach((q, i) => {
    all.push({
      id: `cv-${q.id ?? i}`,
      subject: "Civil Procedure",
      from: PARTNERS[(i + 1) % PARTNERS.length],
      prompt: q.fact,
      options: q.options,
      answer: q.answer,
      rule: q.rule || null,
    });
  });

  // Case library becomes doctrine-match questions: given facts, name the case.
  const subjectsInLib = Object.keys(caseLib);
  subjectsInLib.forEach((subject) => {
    const cases = caseLib[subject];
    cases.forEach((c, i) => {
      const wrong = cases
        .filter((o) => o.cite !== c.cite)
        .slice(0, 8)
        .map((o) => o.cite);
      if (wrong.length < 3) return;
      // deterministic pick of 3 distractors so ids stay stable
      const opts = [c.cite, wrong[i % wrong.length], wrong[(i + 1) % wrong.length], wrong[(i + 2) % wrong.length]];
      const answer = 0;
      all.push({
        id: `cl-${subject}-${i}`,
        subject,
        from: PARTNERS[i % PARTNERS.length],
        prompt: `Which case established: ${c.doctrine}? Key facts: ${c.keyFacts.join("; ")}.`,
        options: opts,
        answer,
        rule: `${c.cite} — ${c.doctrine}`,
        shuffleOptions: true,
      });
    });
  });

  return all;
}

export const QUESTION_POOL = normalize();

export function weeklyTheme(date = new Date()) {
  // ISO-ish week number, stable across the week
  const start = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const week = Math.floor((date - start) / (7 * 24 * 3600 * 1000));
  return SUBJECTS[week % SUBJECTS.length];
}
