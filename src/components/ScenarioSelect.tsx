import React, { useState, Component } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Building,
  Building2,
  Activity,
  DollarSign,
  BarChart,
  ArrowRight,
  Cpu,
  Wifi,
  Target,
  Shield,
  Triangle } from
'lucide-react';
// --- Types ---
interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  budget: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  status: 'Available' | 'Locked' | 'Completed';
  icon: React.ReactNode;
}
interface ScenarioSelectProps {
  onBack: () => void;
  onProceed: (scenarioId: string) => void;
}
// --- Components ---
// Reused HUD Elements
const CornerBracket = ({
  position


}: {position: 'tl' | 'tr' | 'bl' | 'br';}) => {
  const styles = {
    tl: 'top-8 left-8 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-8 right-8 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-8 left-8 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-8 right-8 border-b-2 border-r-2 rounded-br-lg'
  };
  return (
    <div
      className={`absolute w-16 h-16 border-[#D4A800] opacity-60 ${styles[position]} pointer-events-none z-40`}>
      
      <div className="absolute inset-0 bg-[#D4A800]/10 blur-sm" />
    </div>);

};
const Reticle = ({ className }: {className?: string;}) =>
<div
  className={`absolute pointer-events-none opacity-30 animate-reticle-pulse ${className}`}>
  
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle
      cx="20"
      cy="20"
      r="18"
      stroke="#D4A800"
      strokeWidth="1"
      strokeDasharray="4 2" />
    
      <line x1="20" y1="0" x2="20" y2="40" stroke="#D4A800" strokeWidth="1" />
      <line x1="0" y1="20" x2="40" y2="20" stroke="#D4A800" strokeWidth="1" />
    </svg>
  </div>;

// Wireframe Illustrations
const WireframeWarehouse = ({ active }: {active: boolean;}) =>
<svg
  viewBox="0 0 200 150"
  className={`w-full h-full ${active ? 'text-cyan-400' : 'text-zinc-600'}`}
  fill="none"
  stroke="currentColor"
  strokeWidth={active ? 1.5 : 1}>
  
    {/* Base */}
    <path d="M20 120 L180 120 L160 40 L40 40 Z" opacity="0.8" />
    <path d="M20 120 L20 80 L40 40" />
    <path d="M180 120 L180 80 L160 40" />
    {/* Roof details */}
    <path d="M40 40 L160 40" strokeDasharray="4 4" />
    <path d="M50 40 L50 120" opacity="0.3" />
    <path d="M80 40 L80 120" opacity="0.3" />
    <path d="M120 40 L120 120" opacity="0.3" />
    <path d="M150 40 L150 120" opacity="0.3" />
    {/* Active elements */}
    {active &&
  <g className="animate-pulse">
        <circle
      cx="100"
      cy="80"
      r="20"
      stroke="currentColor"
      strokeDasharray="2 2" />
    
        <rect
      x="90"
      y="70"
      width="20"
      height="20"
      fill="currentColor"
      fillOpacity="0.2" />
    
      </g>
  }
  </svg>;

const WireframeSkyscraper = ({ active }: {active: boolean;}) =>
<svg
  viewBox="0 0 200 150"
  className={`w-full h-full ${active ? 'text-cyan-400' : 'text-zinc-600'}`}
  fill="none"
  stroke="currentColor"
  strokeWidth={active ? 1.5 : 1}>
  
    <path d="M70 120 L70 20 L130 20 L130 120 Z" />
    <line x1="70" y1="40" x2="130" y2="40" opacity="0.5" />
    <line x1="70" y1="60" x2="130" y2="60" opacity="0.5" />
    <line x1="70" y1="80" x2="130" y2="80" opacity="0.5" />
    <line x1="70" y1="100" x2="130" y2="100" opacity="0.5" />
    <line x1="90" y1="20" x2="90" y2="120" opacity="0.5" />
    <line x1="110" y1="20" x2="110" y2="120" opacity="0.5" />
    {active &&
  <circle
    cx="100"
    cy="30"
    r="5"
    fill="currentColor"
    className="animate-ping" />

  }
  </svg>;

const WireframeBridge = ({ active }: {active: boolean;}) =>
<svg
  viewBox="0 0 200 150"
  className={`w-full h-full ${active ? 'text-cyan-400' : 'text-zinc-600'}`}
  fill="none"
  stroke="currentColor"
  strokeWidth={active ? 1.5 : 1}>
  
    <path d="M20 100 Q100 40 180 100" fill="none" />
    <line x1="20" y1="100" x2="180" y2="100" />
    <line x1="60" y1="100" x2="60" y2="65" />
    <line x1="100" y1="100" x2="100" y2="55" />
    <line x1="140" y1="100" x2="140" y2="65" />
    {active &&
  <rect
    x="90"
    y="90"
    width="20"
    height="10"
    fill="currentColor"
    className="animate-pulse" />

  }
  </svg>;

export function ScenarioSelect({ onBack, onProceed }: ScenarioSelectProps) {
  const [selectedIndex, setSelectedIndex] = useState(1); // Start with middle card
  const scenarios: Scenario[] = [
  {
    id: 'bridge-01',
    title: 'MUNICIPAL BRIDGE',
    subtitle: 'Infrastructure Repair',
    budget: '$4.5M',
    difficulty: 'Medium',
    description:
    'Reinforce structural integrity of aging city bridge infrastructure.',
    status: 'Locked',
    icon: <WireframeBridge active={false} />
  },
  {
    id: 'warehouse-01',
    title: 'WAREHOUSE PROTOTYPE',
    subtitle: 'Logistics Center Alpha',
    budget: '$1.2M',
    difficulty: 'Easy',
    description:
    'Construct a standard 50,000 sqft logistics facility with automated bays.',
    status: 'Available',
    icon: <WireframeWarehouse active={true} />
  },
  {
    id: 'sky-01',
    title: 'SKYLINE TOWER',
    subtitle: 'Commercial High-rise',
    budget: '$85.0M',
    difficulty: 'Hard',
    description:
    'Multi-phase vertical construction in dense urban environment.',
    status: 'Locked',
    icon: <WireframeSkyscraper active={false} />
  }];

  const handlePrev = () => {
    setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
  };
  const handleNext = () => {
    setSelectedIndex((prev) => prev < scenarios.length - 1 ? prev + 1 : prev);
  };
  return (
    <main className="relative w-full h-screen bg-[#0A0A0A] text-[#D4A800] font-mono overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-400">
      {/* --- Background Layers --- */}
      {/* Isometric Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(30deg, #D4A800 1px, transparent 1px), linear-gradient(150deg, #D4A800 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      

      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,20,30,0)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />

      {/* --- HUD Elements --- */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      <Reticle className="top-12 left-12" />
      <Reticle className="bottom-12 right-12" />

      {/* --- Header --- */}
      <header className="absolute top-0 left-0 w-full p-8 z-50 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#D4A800]" />
          <h1 className="text-xl font-bold tracking-[0.3em] text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Select Simulation Scenario
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#D4A800]" />
        </div>
        <p className="text-xs text-[#D4A800]/60 tracking-widest uppercase">
          Choose mission parameters // Authorization Required
        </p>
      </header>

      {/* --- Back Button --- */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-[#D4A800]/60 hover:text-[#D4A800] transition-colors group">
        
        <div className="p-2 border border-[#D4A800]/30 rounded group-hover:bg-[#D4A800]/10">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          RETURN
        </span>
      </button>

      {/* --- Main Carousel --- */}
      <div className="relative z-30 w-full h-full flex items-center justify-center perspective-[1000px]">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          className="absolute left-12 top-1/2 -translate-y-1/2 p-4 text-[#D4A800] disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 transition-transform z-50">
          
          <ChevronLeft className="w-12 h-12" />
        </button>

        <button
          onClick={handleNext}
          disabled={selectedIndex === scenarios.length - 1}
          className="absolute right-12 top-1/2 -translate-y-1/2 p-4 text-[#D4A800] disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 transition-transform z-50">
          
          <ChevronRight className="w-12 h-12" />
        </button>

        {/* Cards Container */}
        <div
          className="flex items-center gap-8 md:gap-16 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${(1 - selectedIndex) * 350}px)`
          }}>
          
          {' '}
          {/* Adjust offset based on card width */}
          {scenarios.map((scenario, index) => {
            const isSelected = index === selectedIndex;
            const isLocked = scenario.status === 'Locked';
            return (
              <div
                key={scenario.id}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative shrink-0 transition-all duration-500 ease-out cursor-pointer group
                  ${isSelected ? 'w-[450px] h-[550px] scale-100 opacity-100 z-20' : 'w-[350px] h-[450px] scale-90 opacity-40 hover:opacity-60 z-10 blur-[1px] hover:blur-0'}
                `}>
                
                {/* Card Background */}
                <div
                  className={`
                  absolute inset-0 backdrop-blur-xl rounded-xl border transition-colors duration-500
                  ${isSelected ? 'bg-[#0A1520]/90 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.15)]' : 'bg-[#0A0A0A]/80 border-white/10'}
                `}>
                  
                  {/* Selected Glow Effects */}
                  {isSelected &&
                  <>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
                      <div className="absolute -inset-[1px] rounded-xl border border-cyan-500/30 animate-pulse pointer-events-none" />
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />
                    </>
                  }

                  {/* Content */}
                  <div className="relative h-full flex flex-col p-8">
                    {/* Top Status Bar */}
                    <div className="flex justify-between items-center mb-8">
                      <div
                        className={`
                        px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm border
                        ${isSelected ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}
                      `}>
                        
                        {scenario.status}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) =>
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-cyan-500' : 'bg-zinc-700'}`} />

                        )}
                      </div>
                    </div>

                    {/* Visual / Wireframe Area */}
                    <div
                      className={`
                      flex-1 w-full mb-8 rounded-lg border flex items-center justify-center overflow-hidden relative
                      ${isSelected ? 'bg-cyan-950/20 border-cyan-500/20' : 'bg-black/20 border-white/5'}
                    `}>
                      
                      {/* Grid Background in visual area */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />

                      <div
                        className={`w-3/4 h-3/4 transition-all duration-700 ${isSelected ? 'scale-110' : 'scale-100 grayscale opacity-50'}`}>
                        
                        {index === 0 && <WireframeBridge active={isSelected} />}
                        {index === 1 &&
                        <WireframeWarehouse active={isSelected} />
                        }
                        {index === 2 &&
                        <WireframeSkyscraper active={isSelected} />
                        }
                      </div>
                    </div>

                    {/* Info Block */}
                    <div className="space-y-4">
                      <div>
                        <h2
                          className={`text-2xl font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                          
                          {scenario.title}
                        </h2>
                        <p className="text-xs text-zinc-500 tracking-widest uppercase">
                          {scenario.subtitle}
                        </p>
                      </div>

                      {/* Stats Grid - Only show details if selected */}
                      <div
                        className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
                        
                        <div className="p-3 bg-white/5 rounded border border-white/5">
                          <div className="flex items-center gap-2 text-zinc-400 mb-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-wider">
                              Budget
                            </span>
                          </div>
                          <span
                            className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`}>
                            
                            {scenario.budget}
                          </span>
                        </div>
                        <div className="p-3 bg-white/5 rounded border border-white/5">
                          <div className="flex items-center gap-2 text-zinc-400 mb-1">
                            <Activity className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-wider">
                              Difficulty
                            </span>
                          </div>
                          <span
                            className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`}>
                            
                            {scenario.difficulty}
                          </span>
                        </div>
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-600 line-clamp-2'}`}>
                        
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>

      {/* --- Footer / Action Bar --- */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-50 flex justify-between items-end">
        {/* Left Status */}
        <div className="flex flex-col gap-2 text-[10px] font-mono tracking-widest text-[#D4A800]/60">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>SIMULATION ENGINE: READY</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            <span>SERVER: US-EAST-1</span>
          </div>
        </div>

        {/* Center Action Button */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12">
          <button
            onClick={() => onProceed(scenarios[selectedIndex].id)}
            disabled={scenarios[selectedIndex].status === 'Locked'}
            className={`
              group relative px-12 py-4 bg-[#FFB400] text-black font-bold text-lg tracking-widest uppercase
              clip-path-polygon hover:bg-[#FFC840] transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500
            `}
            style={{
              clipPath:
              'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)'
            }}>
            
            <span className="relative z-10 flex items-center gap-3">
              {scenarios[selectedIndex].status === 'Locked' ?
              'LOCKED' :
              'PROCEED'}
              <ArrowRight
                className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${scenarios[selectedIndex].status === 'Locked' ? 'hidden' : 'block'}`} />
              
            </span>

            {/* Button Glow */}
            {!scenarios[selectedIndex].status.includes('Locked') &&
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            }
          </button>
        </div>

        {/* Right Status */}
        <div className="flex flex-col gap-2 text-[10px] font-mono tracking-widest text-right text-[#D4A800]/60">
          <div className="flex items-center justify-end gap-2">
            <span>SECURITY LEVEL 4</span>
            <Shield className="w-3 h-3" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>DATA ENCRYPTION ON</span>
            <Target className="w-3 h-3" />
          </div>
        </div>
      </div>
    </main>);

}