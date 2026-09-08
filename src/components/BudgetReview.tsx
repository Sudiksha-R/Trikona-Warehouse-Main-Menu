import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  DollarSign,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Building2,
  MapPin,
  Clock } from
'lucide-react';
import { MissionData } from './AdminCreateMission';
interface BudgetReviewProps {
  missionData: MissionData;
  onBack: () => void;
  onConfirm: (finalBudget: string) => void;
}
export function BudgetReview({
  missionData,
  onBack,
  onConfirm
}: BudgetReviewProps) {
  // Parse the initial budget string to a number for calculations
  const initialBudget = parseInt(missionData.budget.replace(/[^0-9]/g, '')) || 0;
  const [adjustedBudget, setAdjustedBudget] = useState(initialBudget);
  const [isEditing, setIsEditing] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  // Mock breakdown calculation based on the total
  const breakdown = {
    baseConstruction: Math.round(adjustedBudget * 0.45),
    materials: Math.round(adjustedBudget * 0.25),
    labor: Math.round(adjustedBudget * 0.15),
    permits: Math.round(adjustedBudget * 0.05),
    contingency: Math.round(adjustedBudget * 0.1)
  };
  return (
    <main className="flex flex-col w-full h-screen bg-[#0A0A0A] text-zinc-200 font-mono overflow-hidden selection:bg-[#D4A800]/30 selection:text-[#D4A800]">
      {/* --- Header --- */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F1115] shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
            
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase flex items-center gap-3">
              <Calculator className="w-5 h-5 text-[#D4A800]" />
              Budget Review
            </h1>
            <div className="text-[10px] text-zinc-500 font-mono mt-1 tracking-wider">
              FINANCIAL ANALYSIS // {missionData.name || 'UNNAMED MISSION'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D4A800]/10 border border-[#D4A800]/30 rounded text-[10px] text-[#D4A800] font-bold tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A800] animate-pulse" />
          ESTIMATION COMPLETE
        </div>
      </header>

      {/* --- Content --- */}
      <div className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
        <div className="absolute inset-0 bg-[#0A0A0A]/95 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Mission Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0F1115] border border-white/5 rounded-lg p-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                Mission Parameters
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Build Type
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Building2 className="w-3 h-3 text-[#D4A800]" />
                    {missionData.buildType}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Location
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <MapPin className="w-3 h-3 text-[#D4A800]" />
                    {missionData.region}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Timeline
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Clock className="w-3 h-3 text-[#D4A800]" />
                    {missionData.timeLimit} {missionData.timeUnit}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Priority
                  </div>
                  <div
                    className={`text-sm font-bold ${missionData.priority === 'Critical' ? 'text-red-500' : 'text-white'}`}>
                    
                    {missionData.priority}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#D4A800]/5 border border-[#D4A800]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#D4A800] shrink-0" />
                <div className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-[#D4A800] block mb-1">
                    BUDGET ADVISORY
                  </strong>
                  Estimated costs are based on current market rates for{' '}
                  {missionData.region}. Actual bids may vary by ±15%.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Budget Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Total Card */}
            <div className="bg-[#0F1115] border border-white/5 rounded-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A800]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Total Estimated Budget
                </div>

                {isEditing ?
                <div className="flex items-center gap-4 mb-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A800] font-bold text-2xl">
                        $
                      </span>
                      <input
                      type="number"
                      value={adjustedBudget}
                      onChange={(e) =>
                      setAdjustedBudget(parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-black border border-[#D4A800] rounded pl-10 pr-4 py-3 text-3xl font-bold text-white font-mono focus:outline-none focus:shadow-[0_0_20px_rgba(212,168,0,0.2)]"
                      autoFocus />
                    
                    </div>
                    <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-4 bg-[#D4A800] text-black font-bold uppercase tracking-widest hover:bg-[#E5B800] rounded">
                    
                      Set
                    </button>
                  </div> :

                <div
                  className="flex items-end gap-4 mb-2 group cursor-pointer"
                  onClick={() => setIsEditing(true)}>
                  
                    <div className="text-5xl font-bold text-white tracking-tight font-mono group-hover:text-[#D4A800] transition-colors">
                      {formatCurrency(adjustedBudget)}
                    </div>
                    <div className="pb-2 text-xs text-zinc-500 uppercase tracking-wider flex items-center gap-1 group-hover:text-white transition-colors">
                      <TrendingUp className="w-3 h-3" />
                      Click to Adjust
                    </div>
                  </div>
                }

                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-[#D4A800] w-3/4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0F1115] border border-white/5 rounded-lg p-4 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Construction
                  </div>
                  <Building2 className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {formatCurrency(breakdown.baseConstruction)}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  Base structural costs
                </div>
              </div>

              <div className="bg-[#0F1115] border border-white/5 rounded-lg p-4 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Materials
                  </div>
                  <div className="w-4 h-4 rounded-sm border border-zinc-600" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {formatCurrency(breakdown.materials)}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  Resource procurement
                </div>
              </div>

              <div className="bg-[#0F1115] border border-white/5 rounded-lg p-4 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Labor & Ops
                  </div>
                  <UsersIcon className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {formatCurrency(breakdown.labor)}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  Workforce allocation
                </div>
              </div>

              <div className="bg-[#0F1115] border border-white/5 rounded-lg p-4 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Contingency
                  </div>
                  <ShieldIcon className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {formatCurrency(breakdown.contingency)}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  Risk mitigation reserve
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer className="h-24 bg-[#0F1115] border-t border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
        <button
          onClick={onBack}
          className="px-8 py-4 border border-white/10 text-zinc-400 font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white hover:border-white/20 transition-all text-sm rounded">
          
          Back to Config
        </button>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Final Authorization
            </div>
            <div className="text-xs text-[#D4A800] font-bold uppercase tracking-wider">
              Awaiting Confirmation
            </div>
          </div>
          <button
            onClick={() => onConfirm(formatCurrency(adjustedBudget))}
            className="px-10 py-4 bg-[#D4A800] text-black font-bold uppercase tracking-widest hover:bg-[#E5B800] hover:shadow-[0_0_20px_rgba(212,168,0,0.4)] transition-all text-sm rounded flex items-center gap-3">
            
            <CheckCircle2 className="w-4 h-4" />
            Confirm & Deploy
          </button>
        </div>
      </footer>
    </main>);

}
// Simple icons
const UsersIcon = ({ className }: {className?: string;}) =>
<svg
  className={className}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor">
  
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  
  </svg>;

const ShieldIcon = ({ className }: {className?: string;}) =>
<svg
  className={className}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor">
  
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  
  </svg>;