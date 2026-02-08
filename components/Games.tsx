
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Play, Star, RotateCcw, X, Info, HelpCircle, CheckCircle2, Zap } from 'lucide-react';
import { UserProfile, Game } from '../types';

const GAMES: Game[] = [
  { id: 'quiz', title: 'Sustainable Farming Quiz', description: 'Test your knowledge on organic methods and earn XP.', icon: 'HelpCircle', pointsAwarded: 50 },
  { id: 'harvest', title: 'Harvest Rush', description: 'Fast-paced arcade action. Catch falling crops and avoid pests.', icon: 'Zap', pointsAwarded: 100 },
  { id: 'spin', title: 'Daily Spin Wheel', description: 'Try your luck! Spin once a day for surprise farming rewards.', icon: 'RotateCcw', pointsAwarded: 250 }
];

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Games: React.FC<Props> = ({ user, setUser }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const completeGame = (points: number) => {
    setUser(prev => ({ ...prev, points: prev.points + points }));
    setActiveGame(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-white outfit tracking-tight uppercase italic leading-tight">Farmer's Arcade</h2>
          <p className="text-slate-300 text-lg font-medium uppercase tracking-wide italic">Play interactive mini-games to boost your agricultural skills and earn bonus XP.</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
          <Trophy className="text-amber-400 relative z-10" size={32} />
          <div className="relative z-10">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Total Mastery XP</p>
            <p className="text-2xl font-black text-white outfit uppercase italic">{user.points.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GAMES.map(game => (
          <div key={game.id} className="group bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl hover:shadow-green-500/5 transition-all flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform relative z-10 ${game.id === 'quiz' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : game.id === 'harvest' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              {game.id === 'quiz' ? <HelpCircle size={40} /> : game.id === 'harvest' ? <Zap size={40} /> : <RotateCcw size={40} />}
            </div>
            <div className="flex-1 space-y-4 relative z-10">
              <h3 className="text-2xl font-black text-white outfit uppercase italic leading-tight">{game.title}</h3>
              <p className="text-slate-300 leading-relaxed font-medium uppercase tracking-wide text-sm">{game.description}</p>
            </div>
            <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Star className="text-amber-400" size={16} fill="currentColor" />
                <span className="text-xs font-black text-amber-500/80 uppercase tracking-widest italic">Up to {game.pointsAwarded} XP</span>
              </div>
              <button
                onClick={() => setActiveGame(game.id)}
                className="px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-xs hover:bg-slate-700 transition-all flex items-center gap-2 uppercase tracking-widest italic border border-white/5 shadow-xl"
              >
                <Play size={16} fill="currentColor" /> Play Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeGame === 'quiz' && <QuizGame onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'harvest' && <HarvestRush onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'spin' && <SpinWheel user={user} onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
    </div>
  );
};

const QuizGame = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { q: "Which irrigation method saves the most water?", a: ["Drip Irrigation", "Flood Irrigation", "Sprinkler", "Manual Watering"], correct: 0 },
    { q: "What is 'Green Manure'?", a: ["Artificial fertilizer", "Crops plowed back into soil", "Painted seeds", "Rotten leaves"], correct: 1 },
    { q: "Which nutrient is primarily responsible for leaf growth?", a: ["Phosphorus", "Potassium", "Nitrogen", "Calcium"], correct: 2 },
    { q: "What is 'Alley Cropping'?", a: ["Planting in narrow alleys", "Growing crops between rows of trees", "Planting inside tunnels", "Vertical farming"], correct: 1 },
    { q: "Which insect is known as a friend to farmers?", a: ["Aphid", "Locust", "Ladybug", "Termite"], correct: 2 },
    { q: "What is the ideal pH for most vegetables?", a: ["pH 4.0 - 5.0", "pH 6.0 - 7.0", "pH 8.0 - 9.0", "pH 7.0 - 8.5"], correct: 1 },
    { q: "Which crop is known as a 'Nitrogen Fixer'?", a: ["Wheat", "Rice", "Mung Bean", "Potato"], correct: 2 },
    { q: "What does 'Vermicompost' involve?", a: ["Chemicals", "Earthworms", "Fungi", "Solar energy"], correct: 1 },
    { q: "What is 'Mulching' primarily used for?", a: ["Moisture retention", "Seed coloring", "Pest attraction", "Air cooling"], correct: 0 },
    { q: "Which tool is best for checking soil moisture deep down?", a: ["Digital hygrometer", "Tensiometer", "Thermometer", "PH paper"], correct: 1 }
  ];

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    const correct = idx === questions[step].correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 5);

    setTimeout(() => {
      setSelectedIdx(null);
      setIsCorrect(null);
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/5 relative">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
        {!showResult ? (
          <div className="p-12 space-y-8 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-white outfit tracking-tight uppercase italic leading-tight">Agri-Genius Quiz</h3>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest text-left italic">Level: Advanced Sustainable Farming</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest italic">Question {step + 1}/{questions.length}</p>
                <p className="text-blue-400 font-black text-sm outfit uppercase italic">Current Reward: {score} XP</p>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="py-6">
              <p className="text-2xl font-black text-white leading-tight uppercase italic">{questions[step].q}</p>
            </div>

            <div className="grid gap-4">
              {questions[step].a.map((opt, i) => (
                <button
                  key={i}
                  disabled={selectedIdx !== null}
                  onClick={() => handleAnswer(i)}
                  className={`group relative p-6 rounded-3xl font-black text-left transition-all border-2 overflow-hidden uppercase italic tracking-widest text-xs ${selectedIdx === i
                    ? isCorrect
                      ? 'bg-green-500/10 border-green-500 text-green-400'
                      : 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : selectedIdx !== null && i === questions[step].correct
                      ? 'bg-green-500/10 border-green-500 text-green-400 animate-pulse'
                      : 'bg-slate-800 border-white/5 text-slate-400 hover:border-blue-500/50 hover:bg-slate-750'
                    }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span>{opt}</span>
                    {selectedIdx === i && (
                      isCorrect ? <CheckCircle2 size={24} className="text-green-600" /> : <X size={24} className="text-rose-600" />
                    )}
                  </div>
                  {selectedIdx === i && (
                    <div className={`absolute inset-0 opacity-10 ${isCorrect ? 'bg-green-500' : 'bg-rose-500'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500 relative z-10">
            <div className="w-32 h-32 bg-amber-500/10 text-amber-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-amber-500/20">
              <Trophy size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-white outfit tracking-tight uppercase italic">Quiz Finished!</h3>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] italic">Knowledge is the greatest harvest</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Score</p>
                <p className="text-3xl font-black text-white outfit uppercase italic">{score / 5}/{questions.length}</p>
              </div>
              <div className="bg-green-500/10 p-6 rounded-[2rem] border border-green-500/20 shadow-inner">
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mb-1 italic">XP Earned</p>
                <p className="text-3xl font-black text-green-400 outfit uppercase italic">+{score}</p>
              </div>
            </div>

            <button
              onClick={() => onComplete(score)}
              className="w-full py-6 bg-green-500 text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-green-400 hover:scale-[1.02] active:scale-95 transition-all italic"
            >
              CLAIM MASTERY XP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HarvestRush = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationFrame: number;

    let basketX = canvas.width / 2;
    const items: { x: number, y: number, type: 'crop' | 'pest' }[] = [];

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      basketX = e.clientX - rect.left - 40;
    };
    canvas.addEventListener('mousemove', handleMouse);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Basket
      ctx.fillStyle = '#166534';
      ctx.fillRect(basketX, canvas.height - 30, 80, 20);

      // Spawn items
      if (Math.random() < 0.05) {
        items.push({ x: Math.random() * (canvas.length > 20 ? (canvas.width - 20) : 480), y: -20, type: Math.random() > 0.8 ? 'pest' : 'crop' });
      }

      // Update and Draw items
      items.forEach((item, i) => {
        item.y += 4;
        ctx.fillStyle = item.type === 'crop' ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Collision
        if (item.y > canvas.height - 40 && item.x > basketX && item.x < basketX + 80) {
          if (item.type === 'crop') setScore(s => s + 5);
          else setScore(s => Math.max(0, s - 10));
          items.splice(i, 1);
        } else if (item.y > canvas.height) {
          items.splice(i, 1);
        }
      });

      animationFrame = requestAnimationFrame(loop);
    };
    loop();

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(timer);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [gameOver]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 flex flex-col items-center space-y-6 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
        <div className="flex justify-between w-full relative z-10">
          <div className="font-black text-white outfit text-2xl uppercase italic">Score: {score}</div>
          <div className="font-black text-rose-500 outfit text-2xl uppercase italic">{timeLeft}s</div>
        </div>
        <canvas ref={canvasRef} width={500} height={400} className="bg-slate-950 rounded-2xl border border-white/5 cursor-none relative z-10" />
        {gameOver ? (
          <div className="text-center space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-white outfit uppercase italic">Harvest Complete!</h3>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">You earned {score} XP points.</p>
            <button onClick={() => onComplete(score)} className="bg-green-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest italic shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all">Claim XP</button>
          </div>
        ) : (
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic relative z-10">Move your mouse to catch falling crops</p>
        )}
        <button onClick={onClose} className="text-slate-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-400 transition-colors relative z-10 italic">Exit Mission</button>
      </div>
    </div>
  );
};

const SpinWheel = ({ user, onComplete, onClose }: { user: UserProfile, onComplete: (pts: number) => void, onClose: () => void }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  useEffect(() => {
    const lastSpin = localStorage.getItem(`km_last_spin_${user.uid}`);
    if (lastSpin) {
      const today = new Date().toDateString();
      if (lastSpin === today) {
        setHasSpunToday(true);
      }
    }
  }, [user.uid]);

  const OPTIONS = [
    { pts: 50, color: '#f8fafc', textColor: '#64748b' },
    { pts: 100, color: '#ecfdf5', textColor: '#059669' },
    { pts: 250, color: '#f0f9ff', textColor: '#0284c7' },
    { pts: 50, color: '#f8fafc', textColor: '#64748b' },
    { pts: 500, color: '#fdf4ff', textColor: '#c026d3' },
    { pts: 100, color: '#ecfdf5', textColor: '#059669' },
    { pts: 150, color: '#fff7ed', textColor: '#d97706' },
    { pts: 1000, color: '#fffbeb', textColor: '#b45309', label: 'JACKPOT' }
  ];

  const spin = () => {
    if (spinning || hasSpunToday) return;

    setSpinning(true);
    setResult(null);

    const targetIdx = Math.floor(Math.random() * OPTIONS.length);
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const segmentDeg = 360 / OPTIONS.length;
    // Align the center of the segment with the top pointer (rotation 0)
    const targetRotation = (extraSpins * 360) + (OPTIONS.length - targetIdx) * segmentDeg - (segmentDeg / 2);

    setRotation(prev => prev + targetRotation);

    setTimeout(() => {
      setResult(OPTIONS[targetIdx].pts);
      setSpinning(false);
      // Save spin date
      localStorage.setItem(`km_last_spin_${user.uid}`, new Date().toDateString());
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-lg rounded-[4rem] shadow-2xl p-12 text-center space-y-10 animate-in zoom-in-95 duration-500 relative overflow-hidden border border-white/5">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-50 to-transparent -z-10" />

        <div className="space-y-2 relative z-10">
          <h3 className="text-4xl font-black text-white outfit tracking-tight uppercase italic leading-tight">Daily Lucky Harvest</h3>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] italic">
            {hasSpunToday ? 'Come back tomorrow for another spin!' : 'Spin once a day for surprise XP'}
          </p>
        </div>

        <div className="relative w-80 h-80 mx-auto z-10">
          {/* The Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            <div className={`w-8 h-12 rounded-full border-4 border-slate-900 relative ${hasSpunToday ? 'bg-slate-600' : 'bg-rose-500'}`}>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] ${hasSpunToday ? 'border-t-slate-600' : 'border-t-rose-500'}`} />
            </div>
          </div>

          {/* The Wheel */}
          <div
            className={`w-full h-full rounded-full border-[12px] border-slate-900 shadow-2xl relative transition-transform duration-[4500ms] cubic-bezier(0.15, 0, 0.15, 1) overflow-hidden ${hasSpunToday ? 'opacity-50 grayscale' : ''}`}
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${OPTIONS.map((opt, i) => `${opt.color} ${i * (360 / OPTIONS.length)}deg ${(i + 1) * (360 / OPTIONS.length)}deg`).join(', ')})`
            }}
          >
            {OPTIONS.map((opt, i) => {
              const angle = (i * (360 / OPTIONS.length)) + (360 / OPTIONS.length / 2);
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className="mt-6 text-center font-black outfit leading-none"
                    style={{ color: opt.textColor }}
                  >
                    <p className="text-[10px] opacity-40 uppercase tracking-tighter">{opt.label || 'Reward'}</p>
                    <p className="text-xl mt-1">{opt.pts}</p>
                    <p className="text-[8px] opacity-60">XP</p>
                  </div>
                </div>
              );
            })}

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-inner z-10">
              <RotateCcw className={`text-white ${spinning ? 'animate-spin' : ''}`} size={24} />
            </div>
          </div>
        </div>

        <div className="pt-4 relative z-10">
          {result ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-500 text-slate-950 rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] mb-6 scale-animation">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-3xl font-black text-white outfit tracking-tight uppercase italic leading-tight">Congratulations!</h4>
                <p className="text-lg font-black text-green-400 mt-2 uppercase italic">You harvested {result} Mastery XP!</p>
              </div>
              <button
                onClick={() => onComplete(result)}
                className="w-full py-6 bg-green-500 text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-green-400 hover:scale-[1.02] active:scale-95 transition-all italic"
              >
                CLAIM REWARD
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {hasSpunToday ? (
                <div className="p-8 bg-slate-950/50 border-2 border-dashed border-white/10 rounded-[2.5rem] space-y-2 shadow-inner">
                  <p className="text-white font-black outfit text-xl uppercase italic">Daily Limit Reached</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic leading-relaxed">You have already harvested your daily reward. Come back tomorrow for another chance to win big!</p>
                </div>
              ) : (
                <button
                  disabled={spinning}
                  onClick={spin}
                  className={`w-full py-7 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all relative overflow-hidden group ${spinning ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:scale-[1.02] active:scale-95 italic'}`}
                >
                  {spinning ? 'Wheel is Turning...' : 'Spin for Prizes'}
                  {!spinning && (
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}
                </button>
              )}
              <button onClick={onClose} className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-300 transition-colors italic">{hasSpunToday ? 'Close Arcade' : 'Maybe later'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
