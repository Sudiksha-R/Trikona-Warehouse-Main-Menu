import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Activity,
  Terminal,
  Hammer } from
'lucide-react';
import { ConstructionView3D } from './ConstructionView3D';
// --- Types ---
interface SimulationPlaybackProps {
  scenarioId: string | null;
  onBack: () => void;
  onComplete: () => void;
}
interface LogEntry {
  id: string;
  day: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
// --- Construction Timeline ---
// Each step maps a progress threshold to a subtask ID, log message, and phase label
interface TimelineStep {
  progress: number; // 0-100 threshold when this step completes
  subtaskId: string;
  phase: string;
  log: {
    type: LogEntry['type'];
    message: string;
  };
}
const TIMELINE: TimelineStep[] = [
// Phase 1: Site Preparation (0-10%)
{
  progress: 1,
  subtaskId: 'sub-1-1',
  phase: 'Site Preparation',
  log: {
    type: 'info',
    message: 'Simulation initialized. Weather: Clear, 72°F.'
  }
},
{
  progress: 3,
  subtaskId: 'sub-1-1',
  phase: 'Site Preparation',
  log: {
    type: 'success',
    message: 'Land survey & grading complete.'
  }
},
{
  progress: 5,
  subtaskId: 'sub-1-2',
  phase: 'Site Preparation',
  log: {
    type: 'success',
    message: 'Soil testing passed — bearing capacity: 3,000 PSF.'
  }
},
{
  progress: 7,
  subtaskId: 'sub-1-3',
  phase: 'Site Preparation',
  log: {
    type: 'info',
    message: 'Temporary fencing installed around perimeter.'
  }
},
{
  progress: 10,
  subtaskId: 'sub-1-4',
  phase: 'Site Preparation',
  log: {
    type: 'success',
    message: 'Utility connections established (water, electric, sewer).'
  }
},
// Phase 2: Foundation (10-35%)
{
  progress: 14,
  subtaskId: 'sub-2-1',
  phase: 'Foundation',
  log: {
    type: 'success',
    message: 'Excavation complete — 8ft depth achieved.'
  }
},
{
  progress: 16,
  subtaskId: 'sub-2-1',
  phase: 'Foundation',
  log: {
    type: 'warning',
    message:
    'Minor delay: Unexpected rock layer required additional equipment.'
  }
},
{
  progress: 19,
  subtaskId: 'sub-2-2',
  phase: 'Foundation',
  log: {
    type: 'success',
    message: 'Gravel base layer compacted — 6 inch crushed limestone.'
  }
},
{
  progress: 22,
  subtaskId: 'sub-2-3',
  phase: 'Foundation',
  log: {
    type: 'success',
    message: 'Rebar grid installed — #5 bars @ 12in O.C.'
  }
},
{
  progress: 25,
  subtaskId: 'sub-2-4',
  phase: 'Foundation',
  log: {
    type: 'success',
    message: 'Formwork setup complete — plywood forms secured.'
  }
},
{
  progress: 28,
  subtaskId: 'sub-2-5',
  phase: 'Foundation',
  log: {
    type: 'success',
    message: 'Concrete pour complete — 4,000 PSI mix, 6in slab.'
  }
},
{
  progress: 29,
  subtaskId: 'sub-2-5',
  phase: 'Foundation',
  log: {
    type: 'info',
    message: '12 trucks dispatched. Pour rate: 45 yd³/hr.'
  }
},
{
  progress: 32,
  subtaskId: 'sub-2-6',
  phase: 'Foundation',
  log: {
    type: 'info',
    message: 'Curing period initiated — wet cure method, 5 day minimum.'
  }
},
{
  progress: 35,
  subtaskId: 'sub-2-7',
  phase: 'Foundation',
  log: {
    type: 'success',
    message: 'Foundation inspection PASSED ✓ — Inspector: J. Morrison.'
  }
},
// Phase 3: Structural Framing (35-55%)
{
  progress: 38,
  subtaskId: 'sub-3-1',
  phase: 'Structural Framing',
  log: {
    type: 'success',
    message:
    'Steel columns erected — 6x W12x26 columns bolted to base plates.'
  }
},
{
  progress: 39,
  subtaskId: 'sub-3-1',
  phase: 'Structural Framing',
  log: {
    type: 'info',
    message:
    'Crane operating at 85% capacity. Wind speed: 12 mph (within limits).'
  }
},
{
  progress: 43,
  subtaskId: 'sub-3-2',
  phase: 'Structural Framing',
  log: {
    type: 'success',
    message: 'Steel beams installed — W16x40 beams connected to columns.'
  }
},
{
  progress: 47,
  subtaskId: 'sub-3-3',
  phase: 'Structural Framing',
  log: {
    type: 'success',
    message: 'Cross-bracing installed on south and east faces.'
  }
},
{
  progress: 50,
  subtaskId: 'sub-3-4',
  phase: 'Structural Framing',
  log: {
    type: 'success',
    message: 'High-strength A325 bolts torqued to spec.'
  }
},
{
  progress: 51,
  subtaskId: 'sub-3-4',
  phase: 'Structural Framing',
  log: {
    type: 'error',
    message: 'Safety Alert: Loose bolt detected on column C3. Re-torqued.'
  }
},
{
  progress: 55,
  subtaskId: 'sub-3-5',
  phase: 'Structural Framing',
  log: {
    type: 'success',
    message: 'Welding complete. NDT inspection passed — no defects found.'
  }
},
// Phase 4: Roofing & Envelope (55-72%)
{
  progress: 58,
  subtaskId: 'sub-4-1',
  phase: 'Roofing & Envelope',
  log: {
    type: 'success',
    message: 'Roof deck installed — 22ga metal deck secured.'
  }
},
{
  progress: 60,
  subtaskId: 'sub-4-2',
  phase: 'Roofing & Envelope',
  log: {
    type: 'success',
    message: 'Waterproof TPO membrane applied.'
  }
},
{
  progress: 62,
  subtaskId: 'sub-4-3',
  phase: 'Roofing & Envelope',
  log: {
    type: 'success',
    message: 'R-30 rigid insulation board installed on roof.'
  }
},
{
  progress: 65,
  subtaskId: 'sub-4-4',
  phase: 'Roofing & Envelope',
  log: {
    type: 'success',
    message: 'Metal wall panels installed — 26ga insulated panels.'
  }
},
{
  progress: 66,
  subtaskId: 'sub-4-4',
  phase: 'Roofing & Envelope',
  log: {
    type: 'warning',
    message: 'Weather delay: Rain expected tomorrow. Covering exposed areas.'
  }
},
{
  progress: 69,
  subtaskId: 'sub-4-5',
  phase: 'Roofing & Envelope',
  log: {
    type: 'success',
    message: 'Loading dock doors installed — 3x 8x10ft overhead doors.'
  }
},
{
  progress: 72,
  subtaskId: 'sub-4-6',
  phase: 'Roofing & Envelope',
  log: {
    type: 'success',
    message: 'Windows & glazing installed — double-pane low-E glass.'
  }
},
// Phase 5: MEP Systems (72-88%)
{
  progress: 74,
  subtaskId: 'sub-5-1',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'Plumbing rough-in complete.'
  }
},
{
  progress: 76,
  subtaskId: 'sub-5-2',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'Drainage pipes installed — 4in PVC main lines.'
  }
},
{
  progress: 78,
  subtaskId: 'sub-5-3',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'Electrical conduit run — EMT & rigid conduit.'
  }
},
{
  progress: 80,
  subtaskId: 'sub-5-4',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'Main electrical panel wired — 800A service connected.'
  }
},
{
  progress: 82,
  subtaskId: 'sub-5-5',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'HVAC ductwork installed and sealed.'
  }
},
{
  progress: 84,
  subtaskId: 'sub-5-6',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'Fire suppression main line installed — NFPA 13 compliant.'
  }
},
{
  progress: 86,
  subtaskId: 'sub-5-7',
  phase: 'MEP Systems',
  log: {
    type: 'success',
    message: 'Sprinkler heads installed and pressure tested.'
  }
},
{
  progress: 87,
  subtaskId: 'sub-5-7',
  phase: 'MEP Systems',
  log: {
    type: 'info',
    message: 'MEP systems pressure test: All systems nominal.'
  }
},
// Phase 6: Finishing (88-100%)
{
  progress: 89,
  subtaskId: 'sub-6-1',
  phase: 'Finishing',
  log: {
    type: 'success',
    message: 'Concrete floor sealed.'
  }
},
{
  progress: 91,
  subtaskId: 'sub-6-2',
  phase: 'Finishing',
  log: {
    type: 'success',
    message: 'Epoxy floor coating applied — 2-part industrial blue.'
  }
},
{
  progress: 93,
  subtaskId: 'sub-6-3',
  phase: 'Finishing',
  log: {
    type: 'success',
    message: 'Interior paint applied — fire-rated latex, 2 coats.'
  }
},
{
  progress: 95,
  subtaskId: 'sub-6-4',
  phase: 'Finishing',
  log: {
    type: 'success',
    message: 'Exterior paint complete — elastomeric coating.'
  }
},
{
  progress: 96,
  subtaskId: 'sub-6-5',
  phase: 'Finishing',
  log: {
    type: 'success',
    message: 'Safety signage & floor markings installed.'
  }
},
{
  progress: 98,
  subtaskId: 'sub-6-6',
  phase: 'Finishing',
  log: {
    type: 'success',
    message: 'Final inspection PASSED ✓ — Certificate of Occupancy issued.'
  }
},
{
  progress: 100,
  subtaskId: 'sub-6-7',
  phase: 'Finishing',
  log: {
    type: 'success',
    message:
    'Building commissioned. All systems operational. PROJECT COMPLETE.'
  }
}];

// Log Item
const LogItem = ({ entry }: {entry: LogEntry;}) => {
  const colors = {
    info: 'text-zinc-400',
    success: 'text-green-400',
    warning: 'text-orange-400',
    error: 'text-red-400'
  };
  const icons = {
    info: <Terminal className="w-3 h-3" />,
    success: <CheckCircle2 className="w-3 h-3" />,
    warning: <AlertTriangle className="w-3 h-3" />,
    error: <XCircle className="w-3 h-3" />
  };
  return (
    <div className="flex gap-3 text-xs font-mono mb-2 animate-fade-in-up">
      <span className="text-zinc-600 shrink-0">
        Day {entry.day.toString().padStart(2, '0')}
      </span>
      <div className={`flex items-start gap-2 ${colors[entry.type]}`}>
        <span className="mt-0.5 shrink-0">{icons[entry.type]}</span>
        <span>{entry.message}</span>
      </div>
    </div>);

};
export function SimulationPlayback({
  scenarioId,
  onBack,
  onComplete
}: SimulationPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [firedMilestones, setFiredMilestones] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalDays = 180;
  const day = Math.floor(progress / 100 * totalDays) + 1;
  // Derive completed subtasks from progress
  const completedSubtasks = useMemo(() => {
    const ids = new Set<string>();
    for (const step of TIMELINE) {
      if (progress >= step.progress) {
        ids.add(step.subtaskId);
      }
    }
    return Array.from(ids);
  }, [progress]);
  // Current phase label
  const currentPhase = useMemo(() => {
    let phase = 'Initializing';
    for (const step of TIMELINE) {
      if (progress >= step.progress) {
        phase = step.phase;
      }
    }
    return phase;
  }, [progress]);
  // Completed phases count
  const completedPhases = useMemo(() => {
    const phases = [
    'Site Preparation',
    'Foundation',
    'Structural Framing',
    'Roofing & Envelope',
    'MEP Systems',
    'Finishing'];

    let count = 0;
    const lastStepPerPhase: Record<string, number> = {};
    for (const step of TIMELINE) {
      lastStepPerPhase[step.phase] = Math.max(
        lastStepPerPhase[step.phase] || 0,
        step.progress
      );
    }
    for (const phase of phases) {
      if (progress >= (lastStepPerPhase[phase] || Infinity)) count++;
    }
    return count;
  }, [progress]);
  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  // Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + 0.15 * speed);
          // Fire log entries for milestones we just passed
          for (const step of TIMELINE) {
            if (next >= step.progress && p < step.progress) {
              const logDay = Math.floor(step.progress / 100 * totalDays) + 1;
              setLogs((prev) => [
              ...prev,
              {
                id: `${step.progress}-${Math.random()}`,
                day: logDay,
                type: step.log.type,
                message: step.log.message
              }]
              );
            }
          }
          if (next >= 100) {
            setIsPlaying(false);
            setTimeout(() => onComplete(), 500);
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, onComplete]);
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setLogs([]);
    setFiredMilestones(new Set());
  };
  // Scrubber click — also regenerate logs up to that point
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, x / rect.width * 100));
    setProgress(newProgress);
    // Regenerate logs for all milestones up to this point
    const newLogs: LogEntry[] = [];
    for (const step of TIMELINE) {
      if (newProgress >= step.progress) {
        const logDay = Math.floor(step.progress / 100 * totalDays) + 1;
        newLogs.push({
          id: `${step.progress}-scrub`,
          day: logDay,
          type: step.log.type,
          message: step.log.message
        });
      }
    }
    setLogs(newLogs);
  };
  return (
    <main className="flex flex-col w-full h-screen bg-[#0A0A0A] text-zinc-200 overflow-hidden font-sans">
      {/* --- Top HUD --- */}
      <header className="h-14 bg-[#0F1115] border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
            
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {isPlaying ?
            <Activity className="w-4 h-4 text-green-400 animate-pulse" /> :
            progress >= 100 ?
            <CheckCircle2 className="w-4 h-4 text-green-400" /> :

            <Hammer className="w-4 h-4 text-zinc-400" />
            }
            <span
              className={`text-sm font-bold tracking-widest ${isPlaying ? 'text-green-400' : progress >= 100 ? 'text-green-400' : 'text-zinc-400'}`}>
              
              {progress >= 100 ?
              'SIMULATION COMPLETE' :
              isPlaying ?
              'SIMULATION ACTIVE' :
              'SIMULATION PAUSED'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase">Day</span>
            <span className="text-lg font-bold text-white">
              {day} <span className="text-zinc-600 text-xs">/ {totalDays}</span>
            </span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase">Phase</span>
            <span className="text-xs font-bold text-cyan-400 max-w-[120px] truncate">
              {currentPhase}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase">
              Complete
            </span>
            <span className="text-lg font-bold text-cyan-400">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>

        <div className="w-32" />
      </header>

      {/* --- Main Content --- */}
      <div className="flex-1 flex min-h-0">
        {/* Center: 3D Construction View */}
        <section className="flex-1 relative flex flex-col">
          <div className="flex-1 relative">
            <ConstructionView3D completedSubtasks={completedSubtasks} />

            {/* Phase Overlay */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur border border-white/10 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-zinc-300 mb-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span className="font-medium">{currentPhase}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="w-3 h-3" />
                <span>
                  Day {day} of {totalDays}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>{completedPhases}/6 phases complete</span>
              </div>
            </div>

            {/* Active step label */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-black/70 backdrop-blur px-3 py-2 rounded border border-white/10 text-xs text-cyan-400 font-mono flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : progress >= 100 ? 'bg-green-400' : 'bg-zinc-500'}`} />
                
                {completedSubtasks.length} / 36 STEPS
              </div>
            </div>

            {/* Completion overlay */}
            {progress >= 100 &&
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl px-8 py-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <div className="text-lg font-bold text-white tracking-wide">
                    CONSTRUCTION COMPLETE
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {totalDays} days • 6 phases • 36 steps
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Bottom Timeline Controls */}
          <div className="h-24 bg-[#0F1115] border-t border-white/5 p-4 flex flex-col gap-2">
            {/* Scrubber */}
            <div
              className="relative h-6 w-full bg-zinc-900 rounded cursor-pointer group"
              onClick={handleScrub}>
              
              {/* Phase markers */}
              <div className="absolute inset-0 pointer-events-none">
                {[10, 35, 55, 72, 88].map((p, i) =>
                <div
                  key={i}
                  className="absolute top-0 h-full w-[2px] bg-white/10"
                  style={{
                    left: `${p}%`
                  }} />

                )}
              </div>

              {/* Ticks */}
              <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                {[...Array(20)].map((_, i) =>
                <div key={i} className="w-[1px] h-full bg-white/5" />
                )}
              </div>

              {/* Progress Bar */}
              <div
                className="absolute top-0 left-0 h-full bg-cyan-900/50 border-r-2 border-cyan-400 transition-all duration-75 rounded-l"
                style={{
                  width: `${progress}%`
                }}>
                
                <div className="absolute top-0 right-[-6px] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] translate-y-1.5" />
              </div>

              {/* Phase labels */}
              <div className="absolute -bottom-3 inset-x-0 flex pointer-events-none">
                {[
                {
                  left: '0%',
                  label: 'SITE'
                },
                {
                  left: '10%',
                  label: 'FND'
                },
                {
                  left: '35%',
                  label: 'FRAME'
                },
                {
                  left: '55%',
                  label: 'ROOF'
                },
                {
                  left: '72%',
                  label: 'MEP'
                },
                {
                  left: '88%',
                  label: 'FINISH'
                }].
                map((p, i) =>
                <span
                  key={i}
                  className="absolute text-[8px] text-zinc-600 font-mono"
                  style={{
                    left: p.left
                  }}>
                  
                    {p.label}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={handleReset}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                disabled={progress >= 100}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
                
                {isPlaying ?
                <Pause className="w-4 h-4 fill-current" /> :

                <Play className="w-4 h-4 fill-current ml-0.5" />
                }
              </button>

              <div className="flex bg-zinc-800 rounded-lg p-0.5">
                {[1, 2, 4, 8].map((s) =>
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${speed === s ? 'bg-zinc-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  
                    {s}x
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Simulation Log */}
        <aside className="w-80 bg-[#0A0A0A] border-l border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0F1115]">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Construction Log
            </h2>
            <div className="flex gap-1">
              <div
                className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
              
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 scroll-smooth">
            
            {logs.length === 0 &&
            <div className="text-zinc-600 italic text-center mt-10">
                Press play to begin construction timelapse...
              </div>
            }
            {logs.map((log) =>
            <LogItem key={log.id} entry={log} />
            )}
            {isPlaying &&
            <div className="h-4 w-2 bg-cyan-500 animate-pulse mt-2" />
            }
          </div>

          {/* Log stats footer */}
          <div className="p-3 border-t border-white/5 bg-[#0F1115]">
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>
                {logs.filter((l) => l.type === 'success').length} completed
              </span>
              <span>
                {logs.filter((l) => l.type === 'warning').length} warnings
              </span>
              <span>
                {logs.filter((l) => l.type === 'error').length} alerts
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>);

}