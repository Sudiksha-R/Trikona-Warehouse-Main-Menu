import React, { useEffect, useState } from 'react';
import { Cpu, Wifi, Database, Server, Shield } from 'lucide-react';
interface DeployLoadingProps {
  onComplete: () => void;
}
export function DeployLoading({ onComplete }: DeployLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    'INITIALIZING DEPLOYMENT SEQUENCE...'
  );
  useEffect(() => {
    const duration = 5000; // 5 seconds total
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, currentStep / steps * 100);
      setProgress(newProgress);
      // Update status text based on progress
      if (newProgress < 20) setStatusText('ALLOCATING RESOURCES...');else
      if (newProgress < 40) setStatusText('ESTABLISHING SECURE UPLINK...');else
      if (newProgress < 60) setStatusText('GENERATING BLUEPRINTS...');else
      if (newProgress < 80)
      setStatusText('PROVISIONING CONSTRUCTION DRONES...');else
      if (newProgress < 95)
      setStatusText('FINALIZING CONTRACT PARAMETERS...');else
      setStatusText('DEPLOYMENT COMPLETE.');
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);
  return (
    <main className="relative w-full h-screen bg-[#0A0A0A] text-[#D4A800] font-mono overflow-hidden flex flex-col items-center justify-center">
      {/* --- Background Grid --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#D4A800_1px,transparent_1px),linear-gradient(to_bottom,#D4A800_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

      {/* --- Central Animation --- */}
      <div className="relative w-96 h-96 mb-12">
        {/* Rotating Rings */}
        <div className="absolute inset-0 border-2 border-[#D4A800]/20 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-8 border border-[#D4A800]/40 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute inset-16 border-2 border-[#D4A800]/10 rounded-full animate-[spin_8s_linear_infinite]" />

        {/* Center Hologram (Windmill / Structure) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48 text-[#D4A800] animate-pulse">
            
            <path d="M100 180 L100 100" stroke="currentColor" strokeWidth="2" />
            <path d="M100 100 L100 20" stroke="currentColor" strokeWidth="2" />
            <g className="animate-[spin_4s_linear_infinite] origin-[100px_100px]">
              <path
                d="M100 100 L100 40"
                stroke="currentColor"
                strokeWidth="2" />
              
              <path
                d="M100 100 L152 130"
                stroke="currentColor"
                strokeWidth="2" />
              
              <path
                d="M100 100 L48 130"
                stroke="currentColor"
                strokeWidth="2" />
              
              <circle cx="100" cy="100" r="5" fill="currentColor" />
            </g>
            <path d="M60 180 L140 180" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Scanning Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A800]/10 to-transparent animate-scan-highlight pointer-events-none" />
      </div>

      {/* --- Progress Bar --- */}
      <div className="w-full max-w-2xl px-8 mb-4">
        <div className="flex justify-between text-xs font-bold tracking-widest mb-2">
          <span>SYSTEM DEPLOYMENT</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[#0F1115] border border-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4A800] transition-all duration-100 ease-out relative"
            style={{
              width: `${progress}%`
            }}>
            
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* --- Status Text --- */}
      <div className="h-8 flex items-center justify-center">
        <span className="text-sm font-bold tracking-[0.2em] animate-pulse text-[#D4A800]">
          {statusText}
        </span>
      </div>

      {/* --- System Metrics (Decorative) --- */}
      <div className="absolute bottom-12 w-full max-w-4xl grid grid-cols-4 gap-8 px-8 opacity-50">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4" />
          <div className="text-[10px] tracking-widest">
            <div>CPU LOAD</div>
            <div className="text-white">42%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="w-4 h-4" />
          <div className="text-[10px] tracking-widest">
            <div>UPLINK</div>
            <div className="text-white">STABLE</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Database className="w-4 h-4" />
          <div className="text-[10px] tracking-widest">
            <div>MEMORY</div>
            <div className="text-white">12.4 GB</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4" />
          <div className="text-[10px] tracking-widest">
            <div>SECURITY</div>
            <div className="text-white">ENCRYPTED</div>
          </div>
        </div>
      </div>
    </main>);

}