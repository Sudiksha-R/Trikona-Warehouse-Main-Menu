import React, { useEffect, useState, Component } from 'react';
import {
  ChevronLeft,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Target,
  Cpu,
  Wifi,
  Activity } from
'lucide-react';
// --- Types ---
interface MissionBriefingProps {
  scenarioId: string | null;
  onBack: () => void;
  onStart: () => void;
}
// --- Helper Components ---
// Typewriter Effect Component
const TypewriterText = ({
  text,
  speed = 30,
  onComplete




}: {text: string;speed?: number;onComplete?: () => void;}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);
  return (
    <div className="font-mono text-sm md:text-base leading-relaxed text-zinc-300 whitespace-pre-wrap">
      {displayedText}
      {!isComplete &&
      <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-blink align-middle" />
      }
    </div>);

};
// Objective Gauge Component
const ObjectiveGauge = ({
  label,
  value,
  target,
  unit,
  icon,
  color = 'cyan',
  delay = 0








}: {label: string;value: number;target: number;unit: string;icon: React.ReactNode;color?: 'cyan' | 'green' | 'orange' | 'red';delay?: number;}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value / target * 100);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, target, delay]);
  const colorClasses = {
    cyan: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    green: 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]',
    orange: 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]',
    red: 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]'
  };
  const textColors = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400'
  };
  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
          {icon}
          <span className="text-xs font-bold tracking-widest uppercase">
            {label}
          </span>
        </div>
        <div className="font-mono text-sm">
          <span className={`${textColors[color]} font-bold`}>{value}</span>
          <span className="text-zinc-600 mx-1">/</span>
          <span className="text-zinc-500">
            {target} {unit}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5 relative">
        {/* Grid lines on bar */}
        <div className="absolute inset-0 w-full h-full flex justify-between px-1 z-10 pointer-events-none">
          {[...Array(10)].map((_, i) =>
          <div key={i} className="w-[1px] h-full bg-black/20" />
          )}
        </div>

        {/* Fill Animation */}
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClasses[color]}`}
          style={{
            width: `${progress}%`
          }} />
        
      </div>
    </div>);

};
// Reused HUD Elements
const CornerBracket = ({
  position


}: {position: 'tl' | 'tr' | 'bl' | 'br';}) => {
  const styles = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
  };
  return (
    <div
      className={`absolute w-8 h-8 border-cyan-500/30 ${styles[position]} pointer-events-none`} />);


};
export function MissionBriefing({
  scenarioId,
  onBack,
  onStart
}: MissionBriefingProps) {
  const [isReady, setIsReady] = useState(false);
  // Mock Data based on scenarioId (In a real app, fetch this)
  const missionData = {
    title: 'WAREHOUSE PROTOTYPE',
    code: 'OP-WH-01',
    briefing: `COMMAND: Initiate construction sequence for Logistics Center Alpha.\n\nLOCATION: Sector 7 Industrial Zone.\n\nOBJECTIVE: Construct a high-efficiency warehouse facility capable of handling automated drone logistics. The client requires a strict adherence to safety protocols due to volatile materials storage requirements.\n\nENVIRONMENTAL: Night operations only. Low visibility expected.`,
    constraints: [
    'Zero safety incidents allowed',
    'Complete foundation within 48 hours',
    'Budget cap strict at $1.2M'],

    objectives: [
    {
      label: 'Budget Cap',
      value: 1.1,
      target: 1.2,
      unit: 'M',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'green' as const
    },
    {
      label: 'Timeline',
      value: 12,
      target: 14,
      unit: 'WKS',
      icon: <Clock className="w-4 h-4" />,
      color: 'cyan' as const
    },
    {
      label: 'Safety Rating',
      value: 98,
      target: 95,
      unit: '%',
      icon: <Shield className="w-4 h-4" />,
      color: 'orange' as const
    }]

  };
  return (
    <main className="relative w-full h-screen bg-[#0A0A0A] text-zinc-200 font-mono overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-400 flex items-center justify-center p-4 md:p-12">
      {/* --- Background Layers --- */}
      {/* Blurred Blueprint Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none blur-sm">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover"
          stroke="#06b6d4"
          fill="none"
          strokeWidth="1">
          
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse">
            
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.2" />
            
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Abstract shapes */}
          <circle
            cx="20%"
            cy="30%"
            r="150"
            strokeOpacity="0.3"
            strokeDasharray="10 5" />
          
          <path d="M 500 100 L 700 300 L 500 500" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{
          backgroundSize: '100% 2px, 3px 100%'
        }} />
      

      {/* --- Main Container --- */}
      <div className="relative w-full max-w-7xl h-full max-h-[800px] flex flex-col md:flex-row gap-6 z-10">
        {/* LEFT PANEL: Context & Story */}
        <section className="flex-1 relative bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col animate-fade-in-up">
          <CornerBracket position="tl" />
          <CornerBracket position="bl" />

          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold tracking-[0.2em] text-cyan-400">
                MISSION BRIEFING
              </h2>
            </div>
            <span className="text-xs text-zinc-500 tracking-widest">
              {missionData.code}
            </span>
          </div>

          {/* Content */}
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-wide uppercase">
                {missionData.title}
              </h1>
              <div className="h-1 w-24 bg-cyan-500 mb-6" />

              <TypewriterText
                text={missionData.briefing}
                speed={20}
                onComplete={() => setIsReady(true)} />
              
            </div>

            {/* Constraints List */}
            <div
              className={`transition-opacity duration-1000 delay-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
              
              <h3 className="text-sm font-bold text-orange-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                Critical Constraints
              </h3>
              <ul className="space-y-3">
                {missionData.constraints.map((constraint, idx) =>
                <li
                  key={idx}
                  className="flex items-start gap-3 text-zinc-400 text-sm">
                  
                    <span className="text-orange-500 mt-1">›</span>
                    {constraint}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="p-4 border-t border-white/5 text-[10px] text-zinc-600 flex justify-between tracking-widest">
            <span>ENCRYPTION: AES-256</span>
            <span>SOURCE: HQ_COMMAND</span>
          </div>
        </section>

        {/* RIGHT PANEL: Objectives & Actions */}
        <section className="w-full md:w-[400px] flex flex-col gap-6">
          {/* Objectives Card */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 relative animate-fade-in-up"
            style={{
              animationDelay: '0.2s'
            }}>
            
            <CornerBracket position="tr" />

            <div className="flex items-center gap-3 mb-8">
              <Target className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-bold tracking-[0.2em] text-green-400">
                OBJECTIVES
              </h2>
            </div>

            <div className="space-y-2">
              {missionData.objectives.map((obj, idx) =>
              <ObjectiveGauge key={idx} {...obj} delay={500 + idx * 200} />
              )}
            </div>

            {/* Decorative Data Viz */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between text-xs text-zinc-500 mb-2">
                <span>RESOURCE ALLOCATION</span>
                <span>OPTIMAL</span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                {[40, 60, 30, 80, 50, 90, 40, 70].map((h, i) =>
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors"
                  style={{
                    height: `${h}%`
                  }} />

                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col gap-4 animate-fade-in-up"
            style={{
              animationDelay: '0.4s'
            }}>
            
            <button
              onClick={onStart}
              className="group relative w-full h-16 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden clip-path-button"
              style={{
                clipPath:
                'polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)'
              }}>
              
              <span className="relative z-10 flex items-center gap-2">
                Enter Planning Workspace
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>

              {/* Pulse Effect */}
              <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40" />
            </button>

            <button
              onClick={onBack}
              className="w-full py-4 border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-sm">
              
              <ChevronLeft className="w-4 h-4" />
              Abort / Return to Selection
            </button>
          </div>
        </section>
      </div>

      {/* --- Footer Status Bar --- */}
      <div className="absolute bottom-4 left-0 w-full px-8 flex justify-between items-center text-[10px] text-zinc-600 tracking-widest z-20">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <Activity className="w-3 h-3" /> SYSTEM_READY
          </span>
          <span className="flex items-center gap-2">
            <Wifi className="w-3 h-3" /> LINK_ESTABLISHED
          </span>
        </div>
        <div className="flex gap-2">
          <span>ID: {scenarioId || 'UNKNOWN'}</span>
          <span> //</span>
          <span className="animate-blink">AWAITING_INPUT</span>
        </div>
      </div>
    </main>);

}