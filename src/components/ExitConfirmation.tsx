import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
interface ExitConfirmationProps {
  onCancel: () => void;
  onConfirm: () => void;
}
export function ExitConfirmation({
  onCancel,
  onConfirm
}: ExitConfirmationProps) {
  const [stamped, setStamped] = useState(false);
  useEffect(() => {
    // Trigger stamp animation on mount
    requestAnimationFrame(() => setStamped(true));
  }, []);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-mono">
      {/* Backdrop — 80% black */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${stamped ? 'opacity-80' : 'opacity-0'}`}
        onClick={onCancel} />
      

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-lg mx-4 bg-[#0C0C0C] border border-zinc-700 shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,168,0,0.1)]
          transition-all duration-150 ease-out
          ${stamped ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0'}
        `}>
        
        {/* ═══ Hazard Stripe Top Border ═══ */}
        <div
          className="h-3 w-full overflow-hidden"
          style={{
            background:
            'repeating-linear-gradient(-45deg, #D4A800 0px, #D4A800 10px, #0A0A0A 10px, #0A0A0A 20px)',
            backgroundSize: '200% 100%',
            animation: 'hazard-scroll 8s linear infinite'
          }} />
        

        {/* ═══ Header ═══ */}
        <div className="px-8 pt-8 pb-4 flex items-start gap-5">
          {/* Warning Icon */}
          <div className="shrink-0 w-14 h-14 bg-[#D4A800]/10 border border-[#D4A800]/30 rounded flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-[#D4A800]" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-black tracking-[0.15em] text-white uppercase mb-2">
              Terminate Session?
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed tracking-wide">
              Any unsaved progress on the current timeline will be permanently
              lost. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* ═══ Warning Details ═══ */}
        <div className="mx-8 p-4 bg-red-950/30 border border-red-900/30 rounded mb-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <div>
              <div className="text-[10px] text-red-400 uppercase tracking-widest font-bold mb-0.5">
                Data Loss Warning
              </div>
              <div className="text-[11px] text-zinc-500">
                Active simulation state, resource allocations, and task
                configurations will be discarded.
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Buttons ═══ */}
        <div className="px-8 pb-8 flex gap-4">
          <button
            onClick={onCancel}
            className="
              flex-1 h-14 border border-zinc-600 text-zinc-300 text-sm font-bold uppercase tracking-[0.2em]
              hover:bg-white/5 hover:border-zinc-400 hover:text-white
              active:scale-[0.98]
              transition-all duration-150
            ">





            
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="
              flex-1 h-14 bg-[#D4A800] text-black text-sm font-bold uppercase tracking-[0.2em]
              hover:bg-[#E5B800] 
              active:scale-[0.98]
              shadow-[0_0_20px_rgba(212,168,0,0.3)]
              hover:shadow-[0_0_30px_rgba(212,168,0,0.5)]
              transition-all duration-150
            ">







            
            Confirm Exit
          </button>
        </div>

        {/* ═══ Hazard Stripe Bottom Border ═══ */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
            'repeating-linear-gradient(-45deg, #D4A800 0px, #D4A800 10px, #0A0A0A 10px, #0A0A0A 20px)',
            backgroundSize: '200% 100%',
            animation: 'hazard-scroll 8s linear infinite'
          }} />
        

        {/* ═══ Corner Code ═══ */}
        <div className="absolute bottom-5 right-4 text-[8px] text-zinc-700 tracking-widest">
          EXIT_CONFIRM_V.1.0
        </div>
      </div>

      {/* Inline keyframes for hazard scroll */}
      <style>{`
        @keyframes hazard-scroll {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>);

}