import React, { useEffect, useState, Component } from 'react';
import {
  Crosshair,
  Play,
  Settings,
  LogOut,
  Triangle,
  Wifi,
  Target,
  Shield,
  Lock } from
'lucide-react';
import { ExitConfirmation } from './ExitConfirmation';
import { AdminAccessModal } from './AdminAccessModal';
// --- Types ---
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  index: string;
}
interface MainMenuProps {
  onStart?: () => void;
  onSettings?: () => void;
  onContinue?: () => void;
  onAdminAccess?: () => void;
}
// --- Components ---
// Animated Corner Bracket
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
      className={`absolute w-16 h-16 border-[#D4A800] opacity-80 ${styles[position]} pointer-events-none z-50`}>
      
      <div className="absolute inset-0 bg-[#D4A800]/10 blur-sm" />
    </div>);

};
// Targeting Reticle
const Reticle = ({ className }: {className?: string;}) =>
<div
  className={`absolute pointer-events-none opacity-40 animate-reticle-pulse ${className}`}>
  
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

// Menu Item Bar
const MenuBar = ({
  item,
  isSelected,
  onClick,
  onMouseEnter





}: {item: MenuItem;isSelected: boolean;onClick: () => void;onMouseEnter: () => void;}) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        relative w-full max-w-3xl h-16 flex items-center justify-between px-6 
        border-l-4 transition-all duration-300 group overflow-hidden
        ${isSelected ? 'bg-[#D4A800]/10 border-[#D4A800] text-[#D4A800]' : 'bg-[#0A0A0A]/80 border-[#D4A800]/30 text-[#D4A800]/60 hover:bg-[#D4A800]/5 hover:border-[#D4A800]/60 hover:text-[#D4A800]/80'}
      `}>
      
      {/* Scan Highlight Effect */}
      {isSelected &&
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4A800]/20 to-transparent animate-scan-highlight pointer-events-none" />
      }

      <div className="flex items-center gap-6 z-10">
        <span className="font-mono text-sm opacity-50 tracking-widest">
          [{item.index}]
        </span>
        <div className="flex items-center gap-4">
          <span
            className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'scale-100'}`}>
            
            {item.icon}
          </span>
          <span className="font-mono text-xl font-bold tracking-[0.2em] uppercase">
            {item.label}
          </span>
        </div>
      </div>

      {/* Right-side status indicator */}
      <div className="flex items-center gap-2 z-10">
        <div
          className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#D4A800] animate-pulse' : 'bg-[#D4A800]/30'}`} />
        
        <div
          className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#D4A800] animate-pulse delay-75' : 'bg-[#D4A800]/30'}`} />
        
        <div
          className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#D4A800] animate-pulse delay-150' : 'bg-[#D4A800]/30'}`} />
        
      </div>
    </button>);

};
// --- Main Component ---
export function MainMenu({
  onStart,
  onSettings,
  onContinue,
  onAdminAccess
}: MainMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().replace('T', ' // ').split('.')[0] + ' UTC'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleAdminAuthorize = (key: string) => {
    console.log('Admin Access Granted:', key);
    setShowAdminModal(false);
    if (onAdminAccess) {
      onAdminAccess();
    } else {
      // Fallback if prop not provided
      alert('ACCESS GRANTED: ADMIN PRIVILEGES UNLOCKED');
    }
  };
  const menuItems: MenuItem[] = [
  {
    id: 'new',
    label: 'New Mission',
    icon: <Crosshair className="w-6 h-6" />,
    action: () => {
      console.log('New Mission');
      if (onStart) onStart();
    },
    index: '01'
  },
  {
    id: 'continue',
    label: 'Continue Ops',
    icon: <Play className="w-6 h-6" />,
    action: () => {
      console.log('Continue Ops');
      if (onContinue) onContinue();
    },
    index: '02'
  },
  {
    id: 'settings',
    label: 'System Config',
    icon: <Settings className="w-6 h-6" />,
    action: () => {
      console.log('Settings');
      if (onSettings) onSettings();
    },
    index: '03'
  },
  {
    id: 'exit',
    label: 'Abort / Exit',
    icon: <LogOut className="w-6 h-6" />,
    action: () => setShowExitConfirm(true),
    index: '04'
  }];

  return (
    <main className="relative w-full h-screen bg-[#0A0A0A] text-[#D4A800] font-mono overflow-hidden selection:bg-[#D4A800]/30 selection:text-[#D4A800]">
      {/* --- Background Layers --- */}

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#D4A800_1px,transparent_1px),linear-gradient(to_bottom,#D4A800_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

      {/* Full Screen Scanline */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10">
        <div className="w-full h-[2px] bg-[#D4A800] animate-scanline shadow-[0_0_10px_#D4A800]" />
      </div>

      {/* Rotating Radar (Bottom Right) */}
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] opacity-10 pointer-events-none animate-radar-sweep z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="#D4A800"
            strokeWidth="0.5"
            fill="none" />
          
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#D4A800"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="4 4" />
          
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#D4A800"
            strokeWidth="0.5"
            fill="none" />
          
          <line x1="50" y1="50" x2="50" y2="2" stroke="#D4A800" strokeWidth="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="4s"
              repeatCount="indefinite" />
            
          </line>
          <path
            d="M50 50 L50 2 A48 48 0 0 1 98 50 Z"
            fill="#D4A800"
            opacity="0.2">
            
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="4s"
              repeatCount="indefinite" />
            
          </path>
        </svg>
      </div>

      {/* Blueprint Background (Center) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none z-0">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-4xl"
          stroke="#D4A800"
          fill="none"
          strokeWidth="1">
          
          {/* Outer Walls */}
          <rect x="50" y="50" width="700" height="500" strokeWidth="2" />
          {/* Grid Sections */}
          <path d="M250 50 L250 550" strokeDasharray="5 5" />
          <path d="M550 50 L550 550" strokeDasharray="5 5" />
          <path d="M50 300 L750 300" strokeDasharray="5 5" />
          {/* Loading Docks */}
          <rect x="40" y="100" width="10" height="80" fill="#D4A800" />
          <rect x="40" y="200" width="10" height="80" fill="#D4A800" />
          <rect x="40" y="300" width="10" height="80" fill="#D4A800" />
          {/* Labels */}
          <text
            x="150"
            y="150"
            fill="#D4A800"
            fontSize="14"
            fontFamily="monospace">
            
            ZONE-A
          </text>
          <text
            x="400"
            y="150"
            fill="#D4A800"
            fontSize="14"
            fontFamily="monospace">
            
            ZONE-B
          </text>
          <text
            x="650"
            y="150"
            fill="#D4A800"
            fontSize="14"
            fontFamily="monospace">
            
            ZONE-C
          </text>
          <text
            x="10"
            y="145"
            fill="#D4A800"
            fontSize="10"
            fontFamily="monospace"
            transform="rotate(-90 10,145)">
            
            DOCK-01
          </text>
          {/* Target Markers */}
          <circle cx="400" cy="300" r="5" fill="#D4A800" opacity="0.5" />
          <circle
            cx="400"
            cy="300"
            r="15"
            stroke="#D4A800"
            strokeDasharray="2 2" />
          
        </svg>
      </div>

      {/* --- HUD Overlay --- */}

      {/* Perimeter Pulse Border */}
      <div className="absolute inset-4 border border-[#D4A800]/30 animate-perimeter-pulse pointer-events-none z-40 rounded-lg" />

      {/* Corner Brackets */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Reticles */}
      <Reticle className="top-12 left-12" />
      <Reticle className="top-12 right-12" />
      <Reticle className="bottom-12 left-12" />
      <Reticle className="bottom-12 right-12" />

      {/* --- Header Status --- */}
      <div className="absolute top-8 left-24 flex items-center gap-4 z-50">
        <div className="w-2 h-2 bg-[#D4A800] animate-blink" />
        <span className="text-xs tracking-widest opacity-80">
          TRIKONA COMMAND v0.1.0
        </span>
      </div>

      <div className="absolute top-8 right-24 flex items-center gap-4 z-50">
        <span className="text-xs tracking-widest opacity-80 animate-data-flicker">
          LAT: 28.6139°N LON: 77.2090°E
        </span>
        <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" />
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-50 flex flex-col items-center justify-center h-full w-full">
        {/* Title Block */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-[#D4A800]/50" />
            <span className="text-xs tracking-[0.5em] text-[#D4A800]/70">
              TACTICAL OPERATIONS CENTER
            </span>
            <div className="h-[1px] w-12 bg-[#D4A800]/50" />
          </div>

          <div className="flex items-center gap-6">
            <Triangle
              className="w-12 h-12 text-[#D4A800] fill-[#D4A800]/20 animate-pulse"
              strokeWidth={1.5} />
            
            <h1 className="text-6xl font-black tracking-[0.15em] text-[#D4A800] drop-shadow-[0_0_15px_rgba(212,168,0,0.5)]">
              TRIKONA
            </h1>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4 w-full items-center animate-fade-in-up delay-100">
          {menuItems.map((item, idx) =>
          <MenuBar
            key={item.id}
            item={item}
            isSelected={hoveredIndex === idx}
            onClick={item.action}
            onMouseEnter={() => setHoveredIndex(idx)} />

          )}
        </div>
      </div>

      {/* --- Footer Status --- */}
      <div className="absolute bottom-8 left-24 z-50">
        <div className="grid grid-cols-3 gap-8 text-[10px] tracking-widest">
          <div className="flex flex-col gap-1">
            <span className="opacity-50">COMMS</span>
            <span className="flex items-center gap-2 text-[#4ADE80]">
              <Wifi className="w-3 h-3" /> ONLINE
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="opacity-50">NAV</span>
            <span className="flex items-center gap-2 text-[#D4A800]">
              <Target className="w-3 h-3" /> LOCKED
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="opacity-50">THREAT</span>
            <span className="flex items-center gap-2 text-[#4ADE80]">
              <Shield className="w-3 h-3" /> LOW
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-24 z-50 text-right">
        <div className="flex flex-col gap-1 text-[10px] tracking-widest">
          <span className="text-[#D4A800] animate-data-flicker">
            {currentTime}
          </span>
          <span className="text-[#EF4444] font-bold">CLEARANCE: ALPHA</span>
        </div>
      </div>

      {/* Admin Access Button (New) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowAdminModal(true)}
          className="
            group flex items-center gap-2 px-4 py-2 
            bg-[#D4A800]/5 border border-[#D4A800]/20 rounded 
            text-[10px] font-bold tracking-[0.2em] text-[#D4A800]/60
            hover:bg-[#D4A800]/10 hover:text-[#D4A800] hover:border-[#D4A800]/50 hover:shadow-[0_0_10px_rgba(212,168,0,0.2)]
            transition-all duration-300
          ">






          
          <Lock className="w-3 h-3 group-hover:animate-pulse" />
          ADMIN ACCESS
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm &&
      <ExitConfirmation
        onCancel={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setShowExitConfirm(false);
          console.log('Session terminated.');
        }} />

      }

      {/* Admin Access Modal */}
      {showAdminModal &&
      <AdminAccessModal
        onCancel={() => setShowAdminModal(false)}
        onAuthorize={handleAdminAuthorize} />

      }
    </main>);

}