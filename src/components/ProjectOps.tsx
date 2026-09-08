import React, { useState } from 'react';
import {
  ChevronLeft,
  Calendar,
  Clock,
  HardDrive,
  Activity,
  Play,
  FileText,
  AlertCircle,
  CheckCircle2 } from
'lucide-react';
interface ProjectOpsProps {
  onBack: () => void;
  onLoad: (projectId: string) => void;
}
interface SaveSlot {
  id: string;
  name: string;
  phase: string;
  progress: number;
  lastPlayed: string;
  status: 'on-schedule' | 'delayed' | 'critical';
  fileSize: string;
  thumbnail: string;
  isLatest?: boolean;
}
const SAVES: SaveSlot[] = [
{
  id: 'save-001',
  name: 'WAREHOUSE OPS ALPHA',
  phase: 'Structural Steel',
  progress: 45,
  lastPlayed: 'TODAY 14:02',
  status: 'on-schedule',
  fileSize: '24.5 MB',
  thumbnail:
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
  isLatest: true
},
{
  id: 'save-002',
  name: 'LOGISTICS HUB BETA',
  phase: 'Foundation Pour',
  progress: 12,
  lastPlayed: 'YESTERDAY 09:15',
  status: 'delayed',
  fileSize: '18.2 MB',
  thumbnail:
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'
},
{
  id: 'save-003',
  name: 'DISTRIBUTION CENTER X',
  phase: 'Site Preparation',
  progress: 5,
  lastPlayed: '2 DAYS AGO',
  status: 'on-schedule',
  fileSize: '12.8 MB',
  thumbnail:
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop'
}];

const SaveCard = ({
  save,
  onLoad



}: {save: SaveSlot;onLoad: (id: string) => void;}) => {
  const isLatest = save.isLatest;
  return (
    <div
      className={`
        relative group overflow-hidden transition-all duration-300
        ${isLatest ? 'bg-[#0F1115] border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-400' : 'bg-black/40 border border-white/10 hover:bg-white/5 hover:border-white/20'}
        rounded-lg p-1
      `}>
      
      {/* Latest Badge */}
      {isLatest &&
      <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl font-mono z-20">
          LATEST SNAPSHOT
        </div>
      }

      <div className="flex h-32">
        {/* Thumbnail */}
        <div className="relative w-48 shrink-0 overflow-hidden rounded-l bg-black">
          <img
            src={save.thumbnail}
            alt={save.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F1115]/80" />

          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between relative">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`font-bold tracking-wider ${isLatest ? 'text-white text-lg' : 'text-zinc-300 text-base'}`}>
                
                {save.name}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono mt-1">
                <span className={isLatest ? 'text-cyan-400' : 'text-zinc-500'}>
                  PHASE: {save.phase.toUpperCase()}
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500">{save.fileSize}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-xs font-mono text-zinc-400">
                <Clock className="w-3 h-3" />
                {save.lastPlayed}
              </div>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                {save.status === 'on-schedule' &&
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-green-500 font-bold tracking-wider">
                      ON TRACK
                    </span>
                  </>
                }
                {save.status === 'delayed' &&
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-[10px] text-red-500 font-bold tracking-wider">
                      DELAYED
                    </span>
                  </>
                }
              </div>
            </div>
          </div>

          {/* Footer / Progress */}
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                <span>COMPLETION</span>
                <span>{save.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full ${isLatest ? 'bg-cyan-500' : 'bg-zinc-500'} transition-all duration-1000`}
                  style={{
                    width: `${save.progress}%`
                  }} />
                
              </div>
            </div>

            <button
              onClick={() => onLoad(save.id)}
              className={`
                px-6 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all
                ${isLatest ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10'}
              `}>
              
              <Play className="w-3 h-3 fill-current" />
              Load
            </button>
          </div>
        </div>
      </div>
    </div>);

};
export function ProjectOps({ onBack, onLoad }: ProjectOpsProps) {
  return (
    <main className="relative w-full h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />

      {/* Header */}
      <header className="h-20 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
            
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-cyan-500" />
              Active Projects Log
            </h1>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest mt-1">
              SECURE SERVER // NODE_04 // {SAVES.length} FILES FOUND
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            CLOUD SYNC ACTIVE
          </div>
          <div>STORAGE: 45% USED</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 z-10">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-8 bg-cyan-500/50" />
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">
              Recent Activity
            </span>
            <div className="h-px flex-1 bg-cyan-500/20" />
          </div>

          {/* Save List */}
          <div className="space-y-4">
            {SAVES.map((save) =>
            <SaveCard key={save.id} save={save} onLoad={onLoad} />
            )}
          </div>

          {/* Empty Slot Placeholder */}
          <button className="w-full h-24 border border-dashed border-white/10 rounded-lg flex items-center justify-center gap-3 text-zinc-600 hover:text-zinc-400 hover:border-white/20 hover:bg-white/5 transition-all group">
            <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-zinc-500">
              <span className="text-xl leading-none mb-0.5">+</span>
            </div>
            <span className="font-mono text-sm uppercase tracking-widest">
              Initialize New Project Slot
            </span>
          </button>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-12 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur flex items-center justify-between px-8 text-[10px] font-mono text-zinc-600 z-10">
        <div>LAST BACKUP: 14 MIN AGO</div>
        <div className="flex gap-4">
          <span>VERSION: 0.9.4.2</span>
          <span>USER: COMMANDER</span>
        </div>
      </footer>
    </main>);

}