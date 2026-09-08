import React, { useEffect, useState, Component } from 'react';
import {
  ChevronLeft,
  Users,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  Shield,
  TrendingUp,
  Award,
  Building2,
  AlertTriangle } from
'lucide-react';
import { MissionData } from './AdminCreateMission';
// --- Types ---
interface BiddersDashboardProps {
  missionData: MissionData;
  onAcceptBid: (bid: Bid) => void;
  onBack: () => void;
}
interface Bid {
  id: string;
  company: string;
  rating: number;
  amount: number;
  time: number;
  experience: string;
  specialization: string;
  status: 'pending' | 'reviewing' | 'recommended';
  completionRate: number;
}
// --- Mock Bidders ---
const generateBids = (budget: string): Bid[] => {
  const budgetNum = parseFloat(budget.replace(/[^0-9.]/g, '')) || 5000000;
  return [
  {
    id: 'bid-001',
    company: 'TITAN CONSTRUCTION GROUP',
    rating: 4.8,
    amount: Math.round(budgetNum * 0.92),
    time: 14,
    experience: '25+ YEARS',
    specialization: 'Heavy Industrial',
    status: 'recommended',
    completionRate: 97
  },
  {
    id: 'bid-002',
    company: 'APEX BUILD SYSTEMS',
    rating: 4.5,
    amount: Math.round(budgetNum * 0.85),
    time: 18,
    experience: '15 YEARS',
    specialization: 'Commercial',
    status: 'reviewing',
    completionRate: 94
  },
  {
    id: 'bid-003',
    company: 'IRONCLAD ENGINEERING',
    rating: 4.9,
    amount: Math.round(budgetNum * 1.05),
    time: 11,
    experience: '30+ YEARS',
    specialization: 'Military & Defense',
    status: 'pending',
    completionRate: 99
  },
  {
    id: 'bid-004',
    company: 'NOVA INFRASTRUCTURE',
    rating: 4.2,
    amount: Math.round(budgetNum * 0.78),
    time: 22,
    experience: '8 YEARS',
    specialization: 'Residential',
    status: 'pending',
    completionRate: 88
  },
  {
    id: 'bid-005',
    company: 'VANGUARD CONTRACTORS',
    rating: 4.6,
    amount: Math.round(budgetNum * 0.95),
    time: 15,
    experience: '20 YEARS',
    specialization: 'Infrastructure',
    status: 'reviewing',
    completionRate: 95
  }];

};
// --- Components ---
const StarRating = ({ rating }: {rating: number;}) =>
<div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) =>
  <Star
    key={i}
    className={`w-3 h-3 ${i <= Math.floor(rating) ? 'text-[#D4A800] fill-[#D4A800]' : 'text-zinc-700'}`} />

  )}
    <span className="text-xs font-mono text-zinc-400 ml-1">{rating}</span>
  </div>;

const BidCard = ({
  bid,
  isSelected,
  onSelect




}: {bid: Bid;isSelected: boolean;onSelect: () => void;}) => {
  const statusColors = {
    recommended: 'bg-green-900/20 text-green-400 border-green-500/30',
    reviewing: 'bg-[#D4A800]/10 text-[#D4A800] border-[#D4A800]/30',
    pending: 'bg-zinc-800 text-zinc-400 border-zinc-600'
  };
  return (
    <div
      onClick={onSelect}
      className={`
        relative p-6 rounded-lg border cursor-pointer transition-all duration-300 group
        ${isSelected ? 'bg-[#D4A800]/5 border-[#D4A800] shadow-[0_0_30px_rgba(212,168,0,0.15)]' : 'bg-[#0F1115] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}
      `}>
      
      {/* Recommended Badge */}
      {bid.status === 'recommended' &&
      <div className="absolute -top-2 right-4 bg-green-500 text-black text-[9px] font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
          <Award className="w-3 h-3" />
          RECOMMENDED
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`text-sm font-bold tracking-wider ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
            
            {bid.company}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={bid.rating} />
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${statusColors[bid.status]}`}>
              
              {bid.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-bold font-mono ${isSelected ? 'text-[#D4A800]' : 'text-zinc-300'}`}>
            
            ${bid.amount.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Bid Amount
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
            Timeline
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-zinc-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            {bid.time} months
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
            Experience
          </div>
          <div className="text-xs font-bold text-zinc-300">
            {bid.experience}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
            Specialty
          </div>
          <div className="text-xs font-bold text-zinc-300">
            {bid.specialization}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
            Success Rate
          </div>

          <div className="flex items-center gap-1">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${bid.completionRate >= 95 ? 'bg-green-500' : bid.completionRate >= 90 ? 'bg-[#D4A800]' : 'bg-orange-500'}`}
                style={{
                  width: `${bid.completionRate}%`
                }} />
              
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {bid.completionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected &&
      <div className="absolute top-4 left-4">
          <CheckCircle2 className="w-5 h-5 text-[#D4A800]" />
        </div>
      }
    </div>);

};
export function BiddersDashboard({
  missionData,
  onAcceptBid,
  onBack
}: BiddersDashboardProps) {
  const [bids] = useState<Bid[]>(() => generateBids(missionData.budget));
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('rating');
  const selectedBid = bids.find((b) => b.id === selectedBidId);
  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'price') return a.amount - b.amount;
    if (sortBy === 'time') return a.time - b.time;
    return b.rating - a.rating;
  });
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
              <Users className="w-5 h-5 text-[#D4A800]" />
              Bidders Dashboard
            </h1>
            <div className="text-[10px] text-zinc-500 font-mono mt-1 tracking-wider">
              CONTRACTOR SELECTION // {bids.length} BIDS RECEIVED
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-white tracking-wider uppercase">
              {missionData.name || 'UNNAMED MISSION'}
            </div>
            <div className="text-[10px] text-zinc-500">
              {missionData.buildType} // {missionData.terrainType}
            </div>
            // {missionData.terrainType}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-bold tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          BIDS OPEN
        </div>
      </header>

      {/* --- Content --- */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Mission Summary */}
        <aside className="w-80 bg-[#0F1115] border-r border-white/5 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D4A800]" />
              Mission Brief
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Operation
                </div>
                <div className="text-sm font-bold text-white">
                  {missionData.name || 'UNNAMED'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Build Type
                </div>
                <div className="text-xs text-zinc-300">
                  {missionData.buildType}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Structure
                </div>
                <div className="text-xs text-zinc-300">
                  {missionData.structureCategory}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Terrain
                </div>
                <div className="text-xs text-zinc-300">
                  {missionData.terrainType}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Location
                </div>
                <div className="text-xs text-zinc-300">
                  {missionData.location || 'TBD'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Budget Cap
                </div>
                <div className="text-sm font-bold text-[#D4A800]">
                  ${missionData.budget || '0'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Time Limit
                </div>
                <div className="text-xs text-zinc-300">
                  {missionData.timeLimit} {missionData.timeUnit}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  Priority
                </div>
                <div
                  className={`text-xs font-bold ${missionData.priority === 'Critical' || missionData.priority === 'Emergency' ? 'text-red-400' : missionData.priority === 'High' ? 'text-orange-400' : 'text-green-400'}`}>
                  
                  {missionData.priority}
                </div>
              </div>
              {missionData.primaryMaterials.length > 0 &&
              <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Materials
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {missionData.primaryMaterials.map((mat) =>
                  <span
                    key={mat}
                    className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400">
                    
                        {mat}
                      </span>
                  )}
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Warning */}
          <div className="p-6">
            <div className="bg-[#D4A800]/5 border border-[#D4A800]/20 rounded p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D4A800] shrink-0 mt-0.5" />
                <div className="text-[10px] text-zinc-400 leading-relaxed">
                  Review all bids carefully. Accepting a bid will lock the
                  contractor and initiate the project planning phase.
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Bids List */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sort Bar */}
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0A]/50 shrink-0">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">
              {bids.length} Contractors Bidding
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider mr-2">
                Sort:
              </span>
              {(['rating', 'price', 'time'] as const).map((s) =>
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${sortBy === s ? 'bg-[#D4A800]/10 text-[#D4A800] border border-[#D4A800]/30' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}>
                
                  {s}
                </button>
              )}
            </div>
          </div>

          {/* Bids */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {sortedBids.map((bid) =>
            <BidCard
              key={bid.id}
              bid={bid}
              isSelected={selectedBidId === bid.id}
              onSelect={() => setSelectedBidId(bid.id)} />

            )}
          </div>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer className="h-20 bg-[#0F1115] border-t border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-white/10 text-zinc-400 font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all text-xs rounded">
          
          Back to Mission Config
        </button>

        <div className="flex items-center gap-6">
          {selectedBid &&
          <div className="text-right hidden md:block">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">
                Selected Contractor
              </div>
              <div className="text-xs font-bold text-white">
                {selectedBid.company}
              </div>
            </div>
          }
          <button
            onClick={() => selectedBid && onAcceptBid(selectedBid)}
            disabled={!selectedBid}
            className="px-10 py-3 bg-[#D4A800] text-black font-bold uppercase tracking-widest hover:bg-[#E5B800] hover:shadow-[0_0_20px_rgba(212,168,0,0.4)] transition-all text-sm rounded flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
            
            <CheckCircle2 className="w-4 h-4" />
            Accept Bid
          </button>
        </div>
      </footer>
    </main>);

}