import React, { useState, useEffect } from 'react';
import './App.css';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { StudyGuide } from './components/StudyGuide/StudyGuide';
import { NetworkLab } from './components/NetworkLab/NetworkLab';
import { PacketTracer } from './components/PacketTracer/PacketTracer';
import { ErrorBoundary, ErrorFallback } from './components/ErrorBoundary';
import { examQuestions } from './data/examQuestions';
import { studyGuides } from './data/studyGuides';
import type { TabId, QuizQuestion, ExamResult, Progress } from './types';
import {
  getProgress,
  setProgress,
  getTopicAnswers,
  setTopicAnswers,
  getTopicShown,
  setTopicShown
} from './utils/storage';

// Simplified Quiz/Practice component (keeping original logic for now)
const PracticeQuiz: React.FC = () => {
  const [cat, setCat] = useState('network-fundamentals');
  const [tpIdx, setTpIdx] = useState(0);
  const [tpAns, setTpAns] = useState<Record<number, number>>(() => getTopicAnswers());
  const [tpShow, setTpShow] = useState<Record<number, boolean>>(() => getTopicShown());
  const [examMode, setExamMode] = useState(false);
  const [examQs, setExamQs] = useState<QuizQuestion[]>([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examDone, setExamDone] = useState(false);
  const [exIdx, setExIdx] = useState(0);
  const [exAns, setExAns] = useState<Record<number, number>>({});
  const [exScore, setExScore] = useState(0);
  const [progress, setProgressState] = useState<Progress>(() => getProgress());

  // Save progress to localStorage when it changes
  useEffect(() => {
    setProgress(progress);
  }, [progress]);

  // Save topic answers when they change
  useEffect(() => {
    setTopicAnswers(tpAns);
  }, [tpAns]);

  // Save topic shown state when it changes
  useEffect(() => {
    setTopicShown(tpShow);
  }, [tpShow]);

  const filteredQs = examQuestions.filter(q => q.category === cat);

  const startExam = () => {
    setExamQs([...examQuestions].sort(()=>Math.random()-.5).slice(0,12));
    setExamStarted(true); setExamDone(false); setExIdx(0); setExAns({});
  };

  const submitExam = () => {
    let c=0; examQs.forEach((q,i)=>{ if(exAns[i]===q.correctAnswer) c++; });
    setExScore(c); setExamDone(true);
    const p={...progress}; if(!p.exams) p.exams=[];
    p.exams.push({ date:new Date().toISOString(), score:c, total:examQs.length, percentage:Math.round(c/examQs.length*100) });
    setProgressState(p);
  };

  const renderOpt = (option: string, idx: number, { isExam, revealed, answerIdx, correctIdx, onPick }: {
    isExam: boolean;
    revealed?: boolean;
    answerIdx?: number;
    correctIdx?: number;
    onPick: (idx: number) => void;
  }) => {
    let cls = 'opt';
    if (isExam) { if (answerIdx===idx) cls+=' sel'; }
    else { if (revealed) { if (idx===correctIdx) cls+=' correct'; else if (idx===answerIdx) cls+=' wrong'; } else if (answerIdx===idx) cls+=' sel'; }
    const showCheck = (revealed && idx===correctIdx) || (!revealed && answerIdx===idx);
    const showX = revealed && idx===answerIdx && idx!==correctIdx;
    return (
      <button
        key={idx}
        className={cls}
        disabled={!isExam && !!revealed}
        onClick={()=>onPick(idx)}
        aria-label={`Option ${idx + 1}: ${option}`}
        aria-pressed={answerIdx === idx}
      >
        <div className="opt-radio" aria-hidden="true">
          {showCheck && !showX && <svg viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          {showX && <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>}
        </div>
        {option}
      </button>
    );
  };

  if (examMode) {
    if (!examStarted) return (
      <>
        <div className="section-hdr"><h2>Practice Exam</h2></div>
        <div className="card"><div className="centered" role="region" aria-label="Exam start screen">
          <div className="c-icon" aria-hidden="true"><svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke="#f2c434" strokeWidth="2.5"/><path d="M28 14v14l9 5" stroke="#f2c434" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <h2>Ready for a Practice Exam?</h2>
          <p>12 shuffled questions drawn from all CCNA domains. Answers are locked until you submit.</p>
          <div className="btn-group">
            <button className="btn btn-gold" onClick={startExam} aria-label="Start practice exam">Begin Exam</button>
            <button className="btn btn-outline" onClick={()=>setExamMode(false)} aria-label="Cancel and return to quiz">Cancel</button>
          </div>
        </div></div>
      </>
    );

    if (examDone) return (
      <>
        <div className="section-hdr"><h2>Exam Results</h2></div>
        <div className="card"><div className="centered exam-result" role="region" aria-label="Exam results">
          <div className="c-icon" aria-hidden="true"><svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke={exScore>=10?'#1ea86a':'#e8a012'} strokeWidth="2.5"/><path d="M16 28l8 8 16-16" stroke={exScore>=10?'#1ea86a':'#e8a012'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <h2>Exam Complete</h2>
          <div className="big" aria-label={`Score: ${exScore} out of ${examQs.length}`}>{exScore} / {examQs.length}</div>
          <div className="pct">{Math.round(exScore/examQs.length*100)}% — {exScore>=10?'Excellent Work':'Keep Studying'}</div>
          <div className="btn-group">
            <button className="btn btn-gold" onClick={()=>{setExamMode(false);setExamStarted(false);setExamDone(false);}} aria-label="Return to quiz mode">Back to Quiz</button>
            <button className="btn btn-outline" onClick={()=>{setExamDone(false);startExam();}} aria-label="Retake the practice exam">Retake</button>
          </div>
        </div></div>
      </>
    );

    const q = examQs[exIdx];
    return (
      <>
        <div className="section-hdr"><h2>Practice Exam</h2></div>
        <div className="card">
          <div className="card-head"><h3>Question {exIdx+1} of {examQs.length}</h3><button className="btn btn-green" onClick={submitExam} aria-label="Submit exam for grading">Submit Exam</button></div>
          <div className="card-body">
            <div className="progress-track" role="progressbar" aria-valuenow={exIdx+1} aria-valuemin={1} aria-valuemax={examQs.length} aria-label={`Question ${exIdx+1} of ${examQs.length}`}><div className="progress-fill" style={{width:`${(exIdx+1)/examQs.length*100}%`}}/></div>
            <div className="q-text" role="heading" aria-level={3}>{q.question}</div>
            <div className="options" role="radiogroup" aria-label="Answer options">{q.options.map((o,i) => renderOpt(o,i,{ isExam:true, answerIdx:exAns[exIdx], onPick:i=>setExAns({...exAns,[exIdx]:i}) }))}</div>
            <div className="btn-row">
              <button className="btn btn-ghost" disabled={exIdx===0} onClick={()=>setExIdx(exIdx-1)} aria-label="Go to previous question">← Previous</button>
              <button className="btn btn-ghost" disabled={exIdx===examQs.length-1} onClick={()=>setExIdx(exIdx+1)} aria-label="Go to next question">Next →</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const q = filteredQs[tpIdx];
  return (
    <>
      <div className="section-hdr"><h2>Practice</h2></div>
      <div className="mode-grid">
        <div className="mode-card" onClick={()=>setExamMode(false)} role="button" tabIndex={0} aria-label="Practice topic by topic with instant feedback">
          <div className="mc-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#f2c434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-1H2z"/><path d="M22 3h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-1h6z"/></svg></div>
          <h3>Topic by Topic</h3><p>Instant feedback after each answer</p>
        </div>
        <div className="mode-card" onClick={()=>{setExamMode(true);setExamStarted(false);setExamDone(false);}} role="button" tabIndex={0} aria-label="Take a timed practice exam">
          <div className="mc-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#f2c434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
          <h3>Timed Exam</h3><p>Simulate the real CCNA exam</p>
        </div>
      </div>
      {filteredQs.length > 0 && (
        <div className="card">
          <div className="card-head"><h3>Topic Practice</h3></div>
          <div className="card-body">
            <div className="sel-wrap">
              <label htmlFor="category-select" className="sr-only">Select study category</label>
              <select id="category-select" value={cat} onChange={e=>{setCat(e.target.value);setTpIdx(0);setTpAns({});setTpShow({});}}>
                {Object.entries(studyGuides).map(([k,v])=><option key={k} value={k}>{v.title}</option>)}
              </select>
            </div>
            <div className="q-meta"><span className="q-counter" aria-label={`Question ${tpIdx+1} of ${filteredQs.length}`}>{tpIdx+1} / {filteredQs.length}</span><span className={`q-badge ${q.difficulty}`} aria-label={`Difficulty: ${q.difficulty}`}>{q.difficulty}</span></div>
            <div className="progress-track" role="progressbar" aria-valuenow={tpIdx+1} aria-valuemin={1} aria-valuemax={filteredQs.length}><div className="progress-fill" style={{width:`${(tpIdx+1)/filteredQs.length*100}%`}}/></div>
            <div className="q-text" role="heading" aria-level={3}>{q.question}</div>
            <div className="options" role="radiogroup" aria-label="Answer options">{q.options.map((o,i) => renderOpt(o,i,{ isExam:false, revealed:!!tpShow[tpIdx], answerIdx:tpAns[tpIdx], correctIdx:q.correctAnswer, onPick:i=>{ if(!tpShow[tpIdx]) setTpAns({...tpAns,[tpIdx]:i}); } }))}</div>
            {tpAns[tpIdx]!==undefined && !tpShow[tpIdx] && <button className="btn btn-gold btn-full" onClick={()=>setTpShow({...tpShow,[tpIdx]:true})} aria-label="Check your answer">Check Answer</button>}
            {tpShow[tpIdx] && (
              <div className={`feedback ${tpAns[tpIdx]===q.correctAnswer?'correct':'wrong'}`} role="alert" aria-live="polite">
                <div className="feedback-head"><strong>{tpAns[tpIdx]===q.correctAnswer?'Correct':'Incorrect'}</strong></div>
                <p>{q.explanation}</p>
              </div>
            )}
            <div className="btn-row">
              <button className="btn btn-ghost" disabled={tpIdx===0} onClick={()=>setTpIdx(tpIdx-1)} aria-label="Go to previous question">← Previous</button>
              <button className="btn btn-ghost" disabled={tpIdx===filteredQs.length-1} onClick={()=>setTpIdx(tpIdx+1)} aria-label="Go to next question">Next →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Simplified Progress component
const ProgressView: React.FC = () => {
  const [tpAns] = useState<Record<number, number>>(() => getTopicAnswers());
  const [progress] = useState<Progress>(() => getProgress());

  const totalAns = Object.keys(tpAns).length;
  const totalRight = Object.keys(tpAns).filter(i => {
    const q = examQuestions[parseInt(i)];
    return q && tpAns[parseInt(i)] === q.correctAnswer;
  }).length;

  return (
    <>
      <div className="section-hdr"><h2>Progress & Stats</h2></div>
      <div className="stats-grid" role="region" aria-label="Statistics">
        <div className="stat-card blue"><div className="stat-card-top blue"/><div className="stat-card-inner"><div className="stat-card-label">Questions Answered</div><div className="s-val" aria-label={`${totalAns} questions answered`}>{totalAns}</div><div className="s-sub">Total attempts</div></div></div>
        <div className="stat-card green"><div className="stat-card-top green"/><div className="stat-card-inner"><div className="stat-card-label">Correct Answers</div><div className="s-val" aria-label={`${totalRight} correct answers`}>{totalRight}</div><div className="s-sub">Right answers</div></div></div>
        <div className="stat-card amber"><div className="stat-card-top amber"/><div className="stat-card-inner"><div className="stat-card-label">Exams Taken</div><div className="s-val" aria-label={`${progress.exams?.length||0} exams completed`}>{progress.exams?.length||0}</div><div className="s-sub">Completed</div></div></div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Exam History</h3></div>
        {progress.exams && progress.exams.length>0 ? progress.exams.slice().reverse().map((e,i) => (
          <div key={i} className="history-row" role="article" aria-label={`Mock exam ${progress.exams!.length-i}, score ${e.percentage}%`}>
            <div><div className="hr-title">Mock Exam #{progress.exams!.length-i}</div><div className="hr-date">{new Date(e.date).toLocaleDateString()}</div></div>
            <div style={{textAlign:'right'}}><div className={`hr-score ${e.percentage>=80?'pass':e.percentage>=60?'mid':'fail'}`}>{e.percentage}%</div><div className="hr-sub">{e.score} / {e.total}</div></div>
          </div>
        )) : (
          <div className="centered">
            <div className="c-icon" aria-hidden="true"><svg viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke="#7a95b0" strokeWidth="2"/><path d="M22 28h12M28 22v12" stroke="#7a95b0" strokeWidth="2.5" strokeLinecap="round"/></svg></div>
            <h2>No Exams Yet</h2>
            <p>Take a practice exam to start tracking your performance over time.</p>
          </div>
        )}
      </div>
    </>
  );
};

/* ═══ MAIN APP ═══ */
export default function CCNATrainer() {
  const [tab, setTab] = useState<TabId>('study');

  return (
    <ErrorBoundary friendlyMessage="The CCNA Trainer application encountered an unexpected error. Please refresh the page to continue.">
      <div>
        <ErrorBoundary
          fallback={
            <div style={{ background: 'var(--navy-dark)', padding: '20px' }}>
              <ErrorFallback
                title="Navigation Error"
                message="Unable to load the navigation. Please refresh the page."
              />
            </div>
          }
        >
          <TopBar activeTab={tab} onTabChange={setTab} />
        </ErrorBoundary>

        <ErrorBoundary
          fallback={
            <div style={{ background: 'var(--navy-dark)', padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)' }}>Unable to load hero section</p>
            </div>
          }
        >
          <Hero />
        </ErrorBoundary>

        {/* Main content */}
        <main className="shell" role="main">
          <div role="tabpanel" id="study-panel" aria-labelledby="study-tab" hidden={tab !== 'study'}>
            {tab === 'study' && (
              <ErrorBoundary
                fallback={
                  <ErrorFallback
                    title="Study Guide Error"
                    message="Unable to load study guides. Please try refreshing the page."
                    onReset={() => window.location.reload()}
                  />
                }
              >
                <StudyGuide />
              </ErrorBoundary>
            )}
          </div>
          <div role="tabpanel" id="practice-panel" aria-labelledby="practice-tab" hidden={tab !== 'practice'}>
            {tab === 'practice' && (
              <ErrorBoundary
                fallback={
                  <ErrorFallback
                    title="Quiz Error"
                    message="Unable to load quiz questions. Please try again."
                    onReset={() => window.location.reload()}
                  />
                }
              >
                <PracticeQuiz />
              </ErrorBoundary>
            )}
          </div>
          <div role="tabpanel" id="lab-panel" aria-labelledby="lab-tab" hidden={tab !== 'lab'}>
            {tab === 'lab' && (
              <ErrorBoundary
                fallback={
                  <ErrorFallback
                    title="Network Lab Error"
                    message="Unable to load the network topology simulator."
                    onReset={() => window.location.reload()}
                  />
                }
              >
                <NetworkLab />
              </ErrorBoundary>
            )}
          </div>
          <div role="tabpanel" id="simulator-panel" aria-labelledby="simulator-tab" hidden={tab !== 'simulator'}>
            {tab === 'simulator' && (
              <ErrorBoundary
                fallback={
                  <ErrorFallback
                    title="Packet Tracer Error"
                    message="Unable to load the Packet Tracer simulator."
                    onReset={() => window.location.reload()}
                  />
                }
              >
                <PacketTracer />
              </ErrorBoundary>
            )}
          </div>
          <div role="tabpanel" id="progress-panel" aria-labelledby="progress-tab" hidden={tab !== 'progress'}>
            {tab === 'progress' && (
              <ErrorBoundary
                fallback={
                  <ErrorFallback
                    title="Progress Tracking Error"
                    message="Unable to load your progress data."
                    onReset={() => window.location.reload()}
                  />
                }
              >
                <ProgressView />
              </ErrorBoundary>
            )}
          </div>
        </main>

        <div className="footer-stripe" role="presentation" aria-hidden="true"/>
      </div>
    </ErrorBoundary>
  );
}
