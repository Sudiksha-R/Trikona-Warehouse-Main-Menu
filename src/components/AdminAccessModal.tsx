import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, Terminal, AlertTriangle, X } from 'lucide-react';
interface AdminAccessModalProps {
  onCancel: () => void;
  onAuthorize: (key: string) => void;
}
export function AdminAccessModal({
  onCancel,
  onAuthorize
}: AdminAccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setError(false);
    // Simulate processing delay
    setTimeout(() => {
      if (accessKey === '1234' || accessKey === 'ADMIN') {
        // Simple mock validation
        onAuthorize(accessKey);
      } else {
        setError(true);
        setIsAuthorizing(false);
        setAccessKey('');
      }
    }, 800);
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-mono">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onCancel} />
      

      {/* Modal Container */}
      <div
        className={`
          relative w-full max-w-md mx-4 bg-[#0C0C0C] border border-[#D4A800]/30 
          shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,168,0,0.15)]
          transition-all duration-300 ease-out transform
          ${mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        `}>
        
        {/* ═══ Hazard Stripe Top ═══ */}
        <div
          className="h-2 w-full overflow-hidden border-b border-[#D4A800]/20"
          style={{
            background:
            'repeating-linear-gradient(-45deg, #D4A800 0px, #D4A800 10px, #0A0A0A 10px, #0A0A0A 20px)',
            backgroundSize: '200% 100%',
            animation: 'hazard-scroll 20s linear infinite',
            opacity: 0.5
          }} />
        

        {/* ═══ Header ═══ */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#D4A800]/10 border border-[#D4A800]/30 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#D4A800]/5 animate-pulse" />
              <Lock className="w-6 h-6 text-[#D4A800]" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-[0.15em] text-white uppercase flex items-center gap-2">
                Admin Access
                <span className="text-[10px] bg-red-900/50 text-red-500 px-1.5 py-0.5 rounded border border-red-500/30 animate-pulse">
                  RESTRICTED
                </span>
              </h2>
              <p className="text-[10px] text-[#D4A800]/60 tracking-widest mt-1">
                SECURE TERMINAL // AUTH_REQ
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-[#D4A800]/40 hover:text-[#D4A800] transition-colors">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ═══ Content ═══ */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Warning Box */}
          <div className="bg-[#D4A800]/5 border border-[#D4A800]/10 p-3 rounded flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#D4A800] shrink-0 mt-0.5" />
            <div className="text-[10px] text-[#D4A800]/80 leading-relaxed">
              WARNING: Unauthorized access attempts are logged and reported to
              central command. Enter security clearance key to proceed.
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#D4A800]/60 font-bold flex justify-between">
              <span>Security Key</span>
              {error &&
              <span className="text-red-500 animate-pulse">INVALID KEY</span>
              }
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal
                  className={`w-4 h-4 ${error ? 'text-red-500' : 'text-[#D4A800]/50'}`} />
                
              </div>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                  setError(false);
                }}
                className={`
                  w-full bg-black border rounded px-10 py-3 text-[#D4A800] text-sm tracking-[0.2em] font-bold placeholder-[#D4A800]/20 outline-none transition-all
                  ${error ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-[#D4A800]/30 focus:border-[#D4A800] focus:shadow-[0_0_15px_rgba(212,168,0,0.2)]'}
                `}
                placeholder="ENTER KEY..."
                autoFocus />
              
              {/* Corner accents for input */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4A800]/50 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4A800]/50 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="
                flex-1 py-3 border border-[#D4A800]/20 text-[#D4A800]/60 text-xs font-bold uppercase tracking-[0.15em]
                hover:bg-[#D4A800]/5 hover:text-[#D4A800] hover:border-[#D4A800]/40
                transition-all duration-200
              ">




              
              Abort
            </button>
            <button
              type="submit"
              disabled={!accessKey || isAuthorizing}
              className={`
                flex-[2] py-3 bg-[#D4A800] text-black text-xs font-bold uppercase tracking-[0.15em]
                hover:bg-[#E5B800] hover:shadow-[0_0_20px_rgba(212,168,0,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-200 flex items-center justify-center gap-2
              `}>
              
              {isAuthorizing ?
              <>
                  <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verifying...
                </> :

              <>
                  Authorize Access
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                </>
              }
            </button>
          </div>
        </form>

        {/* ═══ Hazard Stripe Bottom ═══ */}
        <div
          className="h-1.5 w-full overflow-hidden border-t border-[#D4A800]/20"
          style={{
            background:
            'repeating-linear-gradient(-45deg, #D4A800 0px, #D4A800 10px, #0A0A0A 10px, #0A0A0A 20px)',
            backgroundSize: '200% 100%',
            animation: 'hazard-scroll 20s linear infinite reverse',
            opacity: 0.5
          }} />
        

        {/* ═══ Footer Code ═══ */}
        <div className="absolute -bottom-6 right-0 text-[8px] text-[#D4A800]/40 tracking-widest font-mono">
          ADM_AUTH_V.1.0 // SECURE_LAYER_4
        </div>
      </div>

      <style>{`
        @keyframes hazard-scroll {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>);

}