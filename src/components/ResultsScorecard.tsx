import React, { useEffect, useState, Component } from 'react';
import {
  Trophy,
  Clock,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Home,
  ChevronRight,
  Star,
  Activity,
  CheckCircle2,
  AlertTriangle } from
'lucide-react';
interface ResultsScorecardProps {
  scenarioId: string | null;
  onRetry: () => void;
  onMainMenu: () => void;
}
// --- Helper Components ---
const MetricCard = ({
  label,
  value,
  subtext,
  icon,
  color,
  delay







}: {label: string;value: string;subtext: string;icon: React.ReactNode;color: string;delay: number;}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      className={`
        relative overflow-hidden bg-white/5 border border-white/10 rounded-xl p-6
        transition-all duration-700 transform
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
      
      <div className={`absolute top-0 right-0 p-4 opacity-20 ${color}`}>
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
          {label}
        </div>
        <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
        <div className="text-xs text-zinc-400">{subtext}</div>
      </div>

      {/* Progress Bar Background */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <div
          className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
          style={{
            width: show ? '100%' : '0%'
          }} />
        
      </div>
    </div>);

};
const DecisionItem = ({
  text,
  impact,
  type,
  delay





}: {text: string;impact: string;type: 'positive' | 'neutral' | 'negative';delay: number;}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  const colors = {
    positive: 'text-green-400 border-green-500/20 bg-green-500/5',
    neutral: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    negative: 'text-orange-400 border-orange-500/20 bg-orange-500/5'
  };
  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded border transition-all duration-500
        ${colors[type]}
        ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
      `}>
      
      <div className="flex items-center gap-3">
        {type === 'positive' && <CheckCircle2 className="w-4 h-4" />}
        {type === 'neutral' && <Activity className="w-4 h-4" />}
        {type === 'negative' && <AlertTriangle className="w-4 h-4" />}
        <span className="text-sm font-medium">{text}</span>
      </div>
      <span className="text-xs font-mono opacity-80">{impact}</span>
    </div>);

};
export function ResultsScorecard({
  scenarioId,
  onRetry,
  onMainMenu
}: ResultsScorecardProps) {
  const [showGrade, setShowGrade] = useState(false);
  const [score, setScore] = useState(0);
  // Animation sequence
  useEffect(() => {
    // 1. Show Grade Badge
    setTimeout(() => setShowGrade(true), 500);
    // 2. Count up score
    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev >= 94) {
          clearInterval(interval);
          return 94;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="relative w-full h-screen bg-[#050505] text-white overflow-hidden font-sans flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

      {/* Header */}
      <header className="relative z-10 h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded flex items-center justify-center border border-yellow-500/50">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">
              Mission Debrief
            </h1>
            <div className="text-xs text-zinc-500 font-mono">
              SCENARIO: WAREHOUSE OPS ALPHA
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span>SIMULATION COMPLETED</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Column: Grade & Metrics */}
        <div className="flex-1 p-12 flex flex-col justify-center max-w-4xl mx-auto w-full">
          {/* Grade Badge Section */}
          <div className="flex items-center justify-center mb-16 relative">
            {/* Rotating Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-dashed border-white/10 rounded-full animate-spin-slow" />
              <div className="absolute w-56 h-56 border border-white/5 rounded-full animate-reverse-spin" />
            </div>

            {/* The Grade */}
            <div
              className={`
                relative w-48 h-48 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full 
                flex items-center justify-center shadow-[0_0_100px_rgba(234,179,8,0.3)]
                transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)
                ${showGrade ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'}
              `}>
              
              <div className="absolute inset-2 border-4 border-white/20 rounded-full" />
              <div className="text-center">
                <div className="text-8xl font-black text-white drop-shadow-lg">
                  A
                </div>
                <div className="text-sm font-bold text-white/80 tracking-widest mt-[-5px]">
                  EXCELLENT
                </div>
              </div>

              {/* Stars */}
              <div className="absolute -bottom-6 flex gap-2">
                {[1, 2, 3].map((i) =>
                <div
                  key={i}
                  className={`
                      w-8 h-8 bg-[#0A0A0A] border-2 border-yellow-500 rounded-full flex items-center justify-center
                      transition-all duration-500 delay-${i * 200 + 1000}
                      ${showGrade ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}>
                  
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-6">
            <MetricCard
              label="Final Cost"
              value="$842,500"
              subtext="$357,500 Under Budget"
              icon={<DollarSign className="w-8 h-8" />}
              color="text-green-400"
              delay={1000} />
            
            <MetricCard
              label="Schedule"
              value="On Time"
              subtext="0 Days Deviation"
              icon={<Clock className="w-8 h-8" />}
              color="text-yellow-400"
              delay={1200} />
            
            <MetricCard
              label="Safety Score"
              value={`${score}/100`}
              subtext="Zero Incidents"
              icon={<ShieldCheck className="w-8 h-8" />}
              color="text-blue-400"
              delay={1400} />
            
          </div>
        </div>

        {/* Right Column: Key Decisions */}
        <div className="w-96 border-l border-white/5 bg-[#0A0A0A]/50 backdrop-blur p-8 flex flex-col">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Performance Log
          </h3>

          <div className="space-y-3 flex-1">
            <DecisionItem
              text="Optimized Excavation Method"
              impact="+2 Days Saved"
              type="positive"
              delay={1600} />
            
            <DecisionItem
              text="High-Strength Concrete Mix"
              impact="+Durability"
              type="positive"
              delay={1800} />
            
            <DecisionItem
              text="Standard Rebar Spacing"
              impact="Cost Efficient"
              type="neutral"
              delay={2000} />
            
            <DecisionItem
              text="Added Extra Crane"
              impact="-$450/hr Cost"
              type="negative"
              delay={2200} />
            
            <DecisionItem
              text="Night Shift Operations"
              impact="+Speed / -Safety"
              type="neutral"
              delay={2400} />
            
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={onRetry}
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 rounded">
              
              <RotateCcw className="w-4 h-4" /> Retry Scenario
            </button>
            <button
              onClick={onMainMenu}
              className="w-full py-4 bg-transparent border border-white/20 text-zinc-400 font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2 rounded">
              
              <Home className="w-4 h-4" /> Main Menu
            </button>
          </div>
        </div>
      </div>
    </main>);

}