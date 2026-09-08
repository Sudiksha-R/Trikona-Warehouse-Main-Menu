import React, { useEffect, useState, Component } from 'react';
import {
  ChevronLeft,
  Hammer,
  Truck,
  Users,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Settings,
  Menu,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Calendar,
  BarChart3,
  Plus,
  TrendingUp,
  AlertTriangle,
  Play,
  Lock,
  Circle,
  Wrench,
  Loader2 } from
'lucide-react';
import { ResourceLibrary } from './ResourceLibrary';
import { ConstructionView3D } from './ConstructionView3D';
// --- Types ---
interface PlanningWorkspaceProps {
  scenarioId: string | null;
  onBack: () => void;
  onRunSimulation: () => void;
}
type Tab = 'resources' | 'schedule' | 'cost';
interface TaskChoice {
  id: string;
  label: string;
  cost: number | string; // Allow string for "$18/ton" format or number for flat cost
  duration?: string;
}
interface TaskOption {
  id: string;
  label: string;
  choices: TaskChoice[];
}
interface SubTask {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending' | 'locked';
  detail?: string;
  options?: TaskOption[];
}
interface Phase {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending' | 'locked';
  phaseName: string; // for isometric view mapping
  subtasks: SubTask[];
}
// --- Helper Components ---
// Top HUD Progress Bar
const HUDProgressBar = ({
  label,
  value,
  max,
  color,
  icon






}: {label: string;value: number;max: number;color: string;icon: React.ReactNode;}) => {
  const percentage = Math.min(100, Math.max(0, value / max * 100));
  return (
    <div className="flex flex-col gap-1 w-48">
      <div className="flex justify-between text-[10px] font-mono tracking-wider text-zinc-400">
        <span className="flex items-center gap-1">
          {icon} {label}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${color}`}
          style={{
            width: `${percentage}%`
          }} />
        
      </div>
      <div className="text-[10px] font-mono text-right text-zinc-500">
        {value} / {max}
      </div>
    </div>);

};
// Resource Counter Row
const ResourceCounter = ({
  label,
  count,
  cost,
  onUpdate





}: {label: string;count: number;cost: number;onUpdate: (val: number) => void;}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:border-white/10 transition-colors">
      <div>
        <div className="text-sm font-bold text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-500 font-mono">${cost}/hr</div>
      </div>
      <div className="flex items-center gap-3 bg-black/40 rounded p-1">
        <button
          onClick={() => onUpdate(Math.max(0, count - 1))}
          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors">
          
          -
        </button>
        <span className="w-4 text-center font-mono text-cyan-400 font-bold">
          {count}
        </span>
        <button
          onClick={() => onUpdate(count + 1)}
          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors">
          
          +
        </button>
      </div>
    </div>);

};
// Task Tree Item
const TaskItem = ({
  task,
  isActive,
  onClick




}: {task: Task;isActive: boolean;onClick: () => void;}) => {
  const statusColors = {
    completed: 'text-green-400',
    'in-progress': 'text-cyan-400',
    pending: 'text-zinc-500',
    locked: 'text-zinc-700'
  };
  const statusIcons = {
    completed: <CheckCircle2 className="w-3 h-3" />,
    'in-progress':
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />,

    pending: <div className="w-2 h-2 border border-zinc-500 rounded-full" />,
    locked: <div className="w-2 h-2 bg-zinc-800 rounded-full" />
  };
  return (
    <button
      onClick={onClick}
      disabled={task.status === 'locked'}
      className={`
        w-full flex items-center gap-3 p-2 pl-4 text-left border-l-2 transition-all duration-200
        ${isActive ? 'bg-cyan-500/10 border-cyan-400 text-cyan-100' : 'border-transparent hover:bg-white/5 text-zinc-400'}
        ${task.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}>
      
      <span className={statusColors[task.status]}>
        {statusIcons[task.status]}
      </span>
      <span className="text-sm font-medium tracking-wide">{task.label}</span>
    </button>);

};
// Schedule Item Component
const ScheduleItem = ({
  label,
  startWeek,
  duration,
  status





}: {label: string;startWeek: number;duration: number;status: 'completed' | 'in-progress' | 'pending';}) => {
  const totalWeeks = 12;
  const widthPercent = duration / totalWeeks * 100;
  const leftPercent = (startWeek - 1) / totalWeeks * 100;
  const colors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-cyan-500',
    pending: 'bg-zinc-700'
  };
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
        <span>{label}</span>
        <span>
          W{startWeek} - W{startWeek + duration}
        </span>
      </div>
      <div className="h-6 w-full bg-white/5 rounded relative overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex justify-between px-1">
          {[...Array(totalWeeks)].map((_, i) =>
          <div key={i} className="w-[1px] h-full bg-white/5" />
          )}
        </div>

        {/* Timeline Bar */}
        <div
          className={`absolute top-1 bottom-1 rounded-sm ${colors[status]} opacity-80`}
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`
          }} />
        
      </div>
    </div>);

};
// Cost Category Component
const CostCategory = ({
  label,
  spent,
  budget,
  color





}: {label: string;spent: number;budget: number;color: string;}) => {
  const percent = Math.min(100, spent / budget * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs text-zinc-400">{label}</span>
        <div className="text-right">
          <span className="text-xs font-bold text-zinc-200">
            ${spent.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 ml-1">
            / ${budget.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${percent}%`
          }} />
        
      </div>
    </div>);

};
// Phase Header Component
const PhaseHeader = ({
  phase,
  isExpanded,
  onToggle




}: {phase: Phase;isExpanded: boolean;onToggle: () => void;}) => {
  const completedCount = phase.subtasks.filter(
    (t) => t.status === 'completed'
  ).length;
  const totalCount = phase.subtasks.length;
  const statusColors = {
    completed: 'text-green-400',
    'in-progress': 'text-cyan-400',
    pending: 'text-zinc-500',
    locked: 'text-zinc-700'
  };
  const statusIcons = {
    completed: <CheckCircle2 className="w-3 h-3" />,
    'in-progress':
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />,

    pending: <Circle className="w-3 h-3" />,
    locked: <Lock className="w-3 h-3" />
  };
  return (
    <button
      onClick={onToggle}
      disabled={phase.status === 'locked'}
      className={`
        w-full flex items-center justify-between p-3 border-b border-white/5 transition-colors
        ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}
        ${phase.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}>
      
      <div className="flex items-center gap-3">
        <div
          className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} text-zinc-500`}>
          
          {phase.status !== 'locked' && <ChevronRight className="w-4 h-4" />}
        </div>

        <div className="text-left">
          <div
            className={`text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${statusColors[phase.status]}`}>
            
            {statusIcons[phase.status]}
            {phase.label}
          </div>
          {phase.status !== 'locked' &&
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5 ml-5">
              {completedCount}/{totalCount} TASKS COMPLETE
            </div>
          }
        </div>
      </div>
    </button>);

};
// SubTask Item Component
const SubTaskItem = ({
  task,
  isActive,
  onClick




}: {task: SubTask;isActive: boolean;onClick: () => void;}) => {
  const statusStyles = {
    completed: 'text-green-400/70 line-through decoration-green-400/30',
    'in-progress': 'text-white font-medium',
    pending: 'text-zinc-500',
    locked: 'text-zinc-700'
  };
  const dotStyles = {
    completed: 'bg-green-500/50',
    'in-progress':
    'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    pending: 'border border-zinc-600',
    locked: 'bg-zinc-800'
  };
  return (
    <button
      onClick={onClick}
      disabled={task.status === 'locked'}
      className={`
        w-full flex items-start gap-3 py-2 pl-10 pr-4 text-left border-l-2 transition-all duration-200 group relative
        ${isActive ? 'bg-cyan-500/10 border-cyan-400' : 'border-transparent hover:bg-white/[0.02]'}
        ${task.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}>
      
      <div
        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotStyles[task.status]}`} />
      

      <div>
        <div
          className={`text-xs tracking-wide transition-colors ${statusStyles[task.status]}`}>
          
          {task.label}
        </div>
        {task.detail && task.status !== 'locked' &&
        <div
          className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-cyan-400/70' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
          
            {task.detail}
          </div>
        }
      </div>
    </button>);

};
// Task Configuration Panel Component
const TaskConfigPanel = ({
  task,
  selections,
  onSelect




}: {task: SubTask;selections: Record<string, number>;onSelect: (optionId: string, choiceIndex: number) => void;}) => {
  if (!task.options || task.options.length === 0) return null;
  return (
    <div className="bg-[#1A1D24] border-b border-white/10 p-4 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4 text-cyan-400">
        <Wrench className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">
          Task Configuration
        </h3>
      </div>

      <div className="space-y-4">
        {task.options.map((option) => {
          const selectedIndex = selections[option.id] || 0;
          return (
            <div key={option.id} className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                {option.label}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {option.choices.map((choice, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => onSelect(option.id, idx)}
                      className={`
                        text-left px-3 py-2 rounded border text-xs transition-all flex justify-between items-center
                        ${isSelected ? 'bg-cyan-500/10 border-cyan-500/50 text-white' : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-white/5 hover:border-white/10'}
                      `}>
                      
                      <span>{choice.label}</span>
                      <div className="text-right">
                        <div
                          className={`font-mono ${isSelected ? 'text-cyan-400' : 'text-zinc-600'}`}>
                          
                          {typeof choice.cost === 'number' && choice.cost > 0 ?
                          `+$${choice.cost.toLocaleString()}` :
                          choice.cost === 0 ?
                          'Included' :
                          choice.cost}
                        </div>
                        {choice.duration &&
                        <div className="text-[9px] text-zinc-600">
                            {choice.duration}
                          </div>
                        }
                      </div>
                    </button>);

                })}
              </div>
            </div>);

        })}
      </div>
    </div>);

};
export function PlanningWorkspace({
  scenarioId,
  onBack,
  onRunSimulation
}: PlanningWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<Tab>('resources');
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);
  // New State for Phases
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['phase-2']);
  const [activeSubTaskId, setActiveSubTaskId] = useState<string>('sub-2-1');
  // Task Selections State: { subTaskId: { optionId: choiceIndex } }
  const [taskSelections, setTaskSelections] = useState<
    Record<string, Record<string, number>>>(
    {});
  // Helper to update selections
  const handleTaskSelection = (
  subTaskId: string,
  optionId: string,
  choiceIndex: number) =>
  {
    setTaskSelections((prev) => ({
      ...prev,
      [subTaskId]: {
        ...(prev[subTaskId] || {}),
        [optionId]: choiceIndex
      }
    }));
  };
  // Resource State
  const [resources, setResources] = useState({
    labor: 4,
    crane: 1,
    trucks: 2
  });
  // Initial Phase Data (Moved inside component)
  const initialPhases: Phase[] = [
  {
    id: 'phase-1',
    label: 'Site Preparation',
    status: 'completed',
    phaseName: 'Site Prep',
    subtasks: [
    {
      id: 'sub-1-1',
      label: 'Land Survey & Grading',
      status: 'completed'
    },
    {
      id: 'sub-1-2',
      label: 'Soil Testing',
      status: 'completed',
      detail: 'Bearing capacity: 3,000 PSF'
    },
    {
      id: 'sub-1-3',
      label: 'Temporary Fencing',
      status: 'completed'
    },
    {
      id: 'sub-1-4',
      label: 'Utility Connections',
      status: 'completed',
      detail: 'Water, Electric, Sewer'
    }]

  },
  {
    id: 'phase-2',
    label: 'Foundation',
    status: 'in-progress',
    phaseName: 'Foundation',
    subtasks: [
    {
      id: 'sub-2-1',
      label: 'Excavation',
      status: 'in-progress',
      detail: '8ft depth',
      options: [
      {
        id: 'opt-exc-method',
        label: 'Excavation Method',
        choices: [
        {
          id: 'backhoe',
          label: 'Backhoe',
          cost: 800,
          duration: '+3 days'
        },
        {
          id: 'excavator',
          label: 'Excavator CAT 320',
          cost: 1200,
          duration: '+1 day'
        },
        {
          id: 'manual',
          label: 'Manual Dig',
          cost: 400,
          duration: '+7 days'
        }]

      },
      {
        id: 'opt-exc-depth',
        label: 'Depth',
        choices: [
        {
          id: '6ft',
          label: '6ft Standard',
          cost: 0
        },
        {
          id: '8ft',
          label: '8ft Deep',
          cost: 2400
        },
        {
          id: '10ft',
          label: '10ft Extra Deep',
          cost: 5000
        }]

      }]

    },
    {
      id: 'sub-2-2',
      label: 'Gravel Base Layer',
      status: 'pending',
      detail: '6 inch compacted',
      options: [
      {
        id: 'opt-gravel-mat',
        label: 'Material',
        choices: [
        {
          id: 'limestone',
          label: 'Crushed Limestone',
          cost: '$18/ton'
        },
        {
          id: 'pea',
          label: 'Pea Gravel',
          cost: '$22/ton'
        },
        {
          id: 'recycled',
          label: 'Recycled Aggregate',
          cost: '$12/ton'
        }]

      },
      {
        id: 'opt-gravel-thick',
        label: 'Thickness',
        choices: [
        {
          id: '4in',
          label: '4 inch',
          cost: 0
        },
        {
          id: '6in',
          label: '6 inch',
          cost: 1200
        },
        {
          id: '8in',
          label: '8 inch',
          cost: 2800
        }]

      }]

    },
    {
      id: 'sub-2-3',
      label: 'Rebar Grid Installation',
      status: 'pending',
      detail: '#5 bars @ 12in O.C.',
      options: [
      {
        id: 'opt-rebar-size',
        label: 'Bar Size',
        choices: [
        {
          id: '4bar',
          label: '#4 Bars (Light)',
          cost: '$0.45/ft'
        },
        {
          id: '5bar',
          label: '#5 Bars (Standard)',
          cost: '$0.65/ft'
        },
        {
          id: '6bar',
          label: '#6 Bars (Heavy)',
          cost: '$0.90/ft'
        }]

      },
      {
        id: 'opt-rebar-space',
        label: 'Spacing',
        choices: [
        {
          id: '16oc',
          label: '16in O.C. (Economy)',
          cost: 0
        },
        {
          id: '12oc',
          label: '12in O.C. (Standard)',
          cost: 3200
        },
        {
          id: '8oc',
          label: '8in O.C. (Premium)',
          cost: 7500
        }]

      }]

    },
    {
      id: 'sub-2-4',
      label: 'Formwork Setup',
      status: 'pending'
    },
    {
      id: 'sub-2-5',
      label: 'Concrete Pour',
      status: 'pending',
      detail: '4,000 PSI mix, 6in slab',
      options: [
      {
        id: 'opt-conc-mix',
        label: 'Mix Grade',
        choices: [
        {
          id: '3000psi',
          label: '3,000 PSI (Basic)',
          cost: '$95/yd³'
        },
        {
          id: '4000psi',
          label: '4,000 PSI (Standard)',
          cost: '$115/yd³'
        },
        {
          id: '5000psi',
          label: '5,000 PSI (High-Strength)',
          cost: '$140/yd³'
        }]

      },
      {
        id: 'opt-conc-thick',
        label: 'Slab Thickness',
        choices: [
        {
          id: '4in',
          label: '4 inch',
          cost: 0
        },
        {
          id: '6in',
          label: '6 inch',
          cost: 4500
        },
        {
          id: '8in',
          label: '8 inch',
          cost: 9200
        }]

      },
      {
        id: 'opt-conc-finish',
        label: 'Finish',
        choices: [
        {
          id: 'broom',
          label: 'Broom Finish',
          cost: 0
        },
        {
          id: 'smooth',
          label: 'Smooth Trowel',
          cost: 1800
        },
        {
          id: 'polished',
          label: 'Polished',
          cost: 4200
        }]

      }]

    },
    {
      id: 'sub-2-6',
      label: 'Curing Period',
      status: 'pending',
      detail: '7 day minimum',
      options: [
      {
        id: 'opt-cure',
        label: 'Method',
        choices: [
        {
          id: 'air',
          label: 'Air Cure (7 days)',
          cost: 0
        },
        {
          id: 'wet',
          label: 'Wet Cure (5 days)',
          cost: 800
        },
        {
          id: 'chem',
          label: 'Chemical Cure (3 days)',
          cost: 2200
        }]

      }]

    },
    {
      id: 'sub-2-7',
      label: 'Foundation Inspection',
      status: 'pending'
    }]

  },
  {
    id: 'phase-3',
    label: 'Structural Framing',
    status: 'locked',
    phaseName: 'Framing',
    subtasks: [
    {
      id: 'sub-3-1',
      label: 'Steel Column Erection',
      status: 'locked',
      detail: 'W12x26 columns',
      options: [
      {
        id: 'opt-col-type',
        label: 'Column Type',
        choices: [
        {
          id: 'w10',
          label: 'W10x22 (Light)',
          cost: 0
        },
        {
          id: 'w12',
          label: 'W12x26 (Standard)',
          cost: 4800
        },
        {
          id: 'w14',
          label: 'W14x34 (Heavy)',
          cost: 11200
        }]

      }]

    },
    {
      id: 'sub-3-2',
      label: 'Steel Beam Installation',
      status: 'locked',
      detail: 'W16x40 beams',
      options: [
      {
        id: 'opt-beam-type',
        label: 'Beam Type',
        choices: [
        {
          id: 'w14',
          label: 'W14x30 (Light)',
          cost: 0
        },
        {
          id: 'w16',
          label: 'W16x40 (Standard)',
          cost: 6200
        },
        {
          id: 'w18',
          label: 'W18x50 (Heavy)',
          cost: 14000
        }]

      }]

    },
    {
      id: 'sub-3-3',
      label: 'Cross-Bracing',
      status: 'locked'
    },
    {
      id: 'sub-3-4',
      label: 'Connection Bolting',
      status: 'locked',
      detail: 'A325 high-strength'
    },
    {
      id: 'sub-3-5',
      label: 'Welding & Inspection',
      status: 'locked'
    }]

  },
  {
    id: 'phase-4',
    label: 'Roofing & Envelope',
    status: 'locked',
    phaseName: 'Roofing',
    subtasks: [
    {
      id: 'sub-4-1',
      label: 'Roof Deck Installation',
      status: 'locked',
      detail: '22ga metal deck'
    },
    {
      id: 'sub-4-2',
      label: 'Waterproof Membrane',
      status: 'locked',
      detail: 'TPO single-ply',
      options: [
      {
        id: 'opt-roof-mem',
        label: 'Type',
        choices: [
        {
          id: 'tpo',
          label: 'TPO Single-Ply',
          cost: '$3.50/sqft'
        },
        {
          id: 'epdm',
          label: 'EPDM Rubber',
          cost: '$4.20/sqft'
        },
        {
          id: 'pvc',
          label: 'PVC Membrane',
          cost: '$5.00/sqft'
        }]

      }]

    },
    {
      id: 'sub-4-3',
      label: 'Insulation Layer',
      status: 'locked',
      detail: 'R-30 rigid board',
      options: [
      {
        id: 'opt-roof-ins',
        label: 'R-Value',
        choices: [
        {
          id: 'r19',
          label: 'R-19 (Minimum)',
          cost: 0
        },
        {
          id: 'r30',
          label: 'R-30 (Standard)',
          cost: 3800
        },
        {
          id: 'r38',
          label: 'R-38 (Premium)',
          cost: 7200
        }]

      }]

    },
    {
      id: 'sub-4-4',
      label: 'Metal Wall Panels',
      status: 'locked',
      detail: '26ga insulated'
    },
    {
      id: 'sub-4-5',
      label: 'Loading Dock Doors',
      status: 'locked',
      detail: '8x10ft, qty: 8'
    },
    {
      id: 'sub-4-6',
      label: 'Windows & Glazing',
      status: 'locked'
    }]

  },
  {
    id: 'phase-5',
    label: 'MEP Systems',
    status: 'locked',
    phaseName: 'Interior',
    subtasks: [
    {
      id: 'sub-5-1',
      label: 'Plumbing Rough-In',
      status: 'locked'
    },
    {
      id: 'sub-5-2',
      label: 'Drainage Pipes',
      status: 'locked',
      detail: '4in PVC main',
      options: [
      {
        id: 'opt-pipe-mat',
        label: 'Material',
        choices: [
        {
          id: 'pvc',
          label: 'PVC Schedule 40',
          cost: 0
        },
        {
          id: 'cast',
          label: 'Cast Iron',
          cost: 4500
        },
        {
          id: 'hdpe',
          label: 'HDPE',
          cost: 2800
        }]

      },
      {
        id: 'opt-pipe-size',
        label: 'Size',
        choices: [
        {
          id: '3in',
          label: '3 inch',
          cost: 0
        },
        {
          id: '4in',
          label: '4 inch',
          cost: 1200
        },
        {
          id: '6in',
          label: '6 inch',
          cost: 3400
        }]

      }]

    },
    {
      id: 'sub-5-3',
      label: 'Electrical Conduit',
      status: 'locked',
      detail: 'EMT & rigid'
    },
    {
      id: 'sub-5-4',
      label: 'Main Panel & Wiring',
      status: 'locked',
      detail: '800A service',
      options: [
      {
        id: 'opt-elec-serv',
        label: 'Service',
        choices: [
        {
          id: '400a',
          label: '400A (Basic)',
          cost: 0
        },
        {
          id: '800a',
          label: '800A (Standard)',
          cost: 8500
        },
        {
          id: '1200a',
          label: '1200A (Heavy)',
          cost: 16000
        }]

      }]

    },
    {
      id: 'sub-5-5',
      label: 'HVAC Ductwork',
      status: 'locked'
    },
    {
      id: 'sub-5-6',
      label: 'Fire Suppression',
      status: 'locked',
      detail: 'NFPA 13 wet system'
    },
    {
      id: 'sub-5-7',
      label: 'Sprinkler Installation',
      status: 'locked'
    }]

  },
  {
    id: 'phase-6',
    label: 'Finishing',
    status: 'locked',
    phaseName: 'Interior',
    subtasks: [
    {
      id: 'sub-6-1',
      label: 'Concrete Sealing',
      status: 'locked'
    },
    {
      id: 'sub-6-2',
      label: 'Epoxy Floor Coating',
      status: 'locked',
      detail: '2-part industrial',
      options: [
      {
        id: 'opt-floor-type',
        label: 'Type',
        choices: [
        {
          id: 'water',
          label: '1-Part Water-Based',
          cost: '$2.50/sqft'
        },
        {
          id: 'solvent',
          label: '2-Part Solvent',
          cost: '$4.00/sqft'
        },
        {
          id: 'metallic',
          label: '3-Part Metallic',
          cost: '$7.50/sqft'
        }]

      }]

    },
    {
      id: 'sub-6-3',
      label: 'Interior Paint',
      status: 'locked',
      detail: 'Fire-rated latex',
      options: [
      {
        id: 'opt-paint-type',
        label: 'Type',
        choices: [
        {
          id: 'latex',
          label: 'Standard Latex',
          cost: 0
        },
        {
          id: 'fire',
          label: 'Fire-Rated Latex',
          cost: 2400
        },
        {
          id: 'epoxy',
          label: 'Epoxy Wall Coat',
          cost: 5800
        }]

      },
      {
        id: 'opt-paint-coats',
        label: 'Coats',
        choices: [
        {
          id: '1coat',
          label: '1 Coat',
          cost: 0
        },
        {
          id: '2coat',
          label: '2 Coats',
          cost: 1600
        },
        {
          id: '3coat',
          label: '3 Coats',
          cost: 3200
        }]

      }]

    },
    {
      id: 'sub-6-4',
      label: 'Exterior Paint',
      status: 'locked',
      detail: 'Elastomeric coating',
      options: [
      {
        id: 'opt-ext-paint',
        label: 'Type',
        choices: [
        {
          id: 'acrylic',
          label: 'Acrylic Latex',
          cost: 0
        },
        {
          id: 'elast',
          label: 'Elastomeric',
          cost: 3200
        },
        {
          id: 'silicone',
          label: 'Silicone-Based',
          cost: 6400
        }]

      }]

    },
    {
      id: 'sub-6-5',
      label: 'Signage & Markings',
      status: 'locked',
      detail: 'Safety & wayfinding'
    },
    {
      id: 'sub-6-6',
      label: 'Final Inspection',
      status: 'locked'
    },
    {
      id: 'sub-6-7',
      label: 'Commissioning',
      status: 'locked'
    }]

  }];

  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [isSimulatingStep, setIsSimulatingStep] = useState(false);
  // Derive completed subtasks for visualization
  const completedSubtasks = phases.
  flatMap((p) => p.subtasks).
  filter((t) => t.status === 'completed').
  map((t) => t.id);
  // Handle Step Completion
  const handleCompleteStep = () => {
    setIsSimulatingStep(true);
    // Simulate brief delay for "building"
    setTimeout(() => {
      setPhases((prevPhases) => {
        // Deep clone to avoid mutating state
        const newPhases = prevPhases.map((p) => ({
          ...p,
          subtasks: p.subtasks.map((t) => ({
            ...t
          }))
        }));
        // Find current task indices
        let phaseIdx = -1;
        let taskIdx = -1;
        newPhases.forEach((p, pIdx) => {
          p.subtasks.forEach((t, tIdx) => {
            if (t.id === activeSubTaskId) {
              phaseIdx = pIdx;
              taskIdx = tIdx;
            }
          });
        });
        if (phaseIdx === -1 || taskIdx === -1) return prevPhases;
        // Mark current as completed
        newPhases[phaseIdx].subtasks[taskIdx].status = 'completed';
        // Unlock next task
        if (taskIdx < newPhases[phaseIdx].subtasks.length - 1) {
          // Next task in same phase
          newPhases[phaseIdx].subtasks[taskIdx + 1].status = 'in-progress';
          setActiveSubTaskId(newPhases[phaseIdx].subtasks[taskIdx + 1].id);
        } else if (phaseIdx < newPhases.length - 1) {
          // First task of next phase
          newPhases[phaseIdx].status = 'completed';
          newPhases[phaseIdx + 1].status = 'in-progress';
          newPhases[phaseIdx + 1].subtasks[0].status = 'in-progress';
          // Unlock all subtasks in the new phase from 'locked' to 'pending'
          newPhases[phaseIdx + 1].subtasks.forEach((t, i) => {
            if (i === 0) {
              t.status = 'in-progress';
            } else if (t.status === 'locked') {
              t.status = 'pending';
            }
          });
          setActiveSubTaskId(newPhases[phaseIdx + 1].subtasks[0].id);
          setExpandedPhases((prev) => [...prev, newPhases[phaseIdx + 1].id]);
        }
        return newPhases;
      });
      setIsSimulatingStep(false);
    }, 1500);
  };
  // Helper to toggle phases
  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
    prev.includes(phaseId) ?
    prev.filter((id) => id !== phaseId) :
    [...prev, phaseId]
    );
  };
  // Derive current phase and active subtask label
  const activePhaseObj = phases.find((p) =>
  p.subtasks.some((s) => s.id === activeSubTaskId)
  );
  const activeSubTaskObj = activePhaseObj?.subtasks.find(
    (s) => s.id === activeSubTaskId
  );
  const currentPhaseName = activePhaseObj?.phaseName || 'Site Prep';
  const activeLabel = activeSubTaskObj?.label.toUpperCase() || 'UNKNOWN TASK';
  const handleAssignResource = (resource: any) => {
    console.log('Assigned resource:', resource);
    // In a real app, this would update the resources state
  };
  return (
    <main className="flex flex-col w-full h-screen bg-[#0A0A0A] text-zinc-200 overflow-hidden font-sans">
      {showResourceLibrary &&
      <ResourceLibrary
        onClose={() => setShowResourceLibrary(false)}
        onAssign={handleAssignResource} />

      }
      {/* --- Top HUD Bar --- */}
      <header className="h-14 bg-[#0F1115] border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
            
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-zinc-100 tracking-wide">
              WAREHOUSE PROTOTYPE
            </h1>
            <span className="text-[10px] text-zinc-500 font-mono">
              OP-WH-01 // PHASE 2
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <HUDProgressBar
            label="BUDGET"
            value={850000}
            max={1200000}
            color="bg-green-500"
            icon={<DollarSign className="w-3 h-3" />} />
          
          <HUDProgressBar
            label="TIME"
            value={4}
            max={12}
            color="bg-orange-500"
            icon={<Clock className="w-3 h-3" />} />
          
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
            JS
          </div>
        </div>
      </header>

      {/* --- Main Workspace Area --- */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT PANE: Task Tree */}
        <aside className="w-64 bg-[#0F1115] border-r border-white/5 flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4" /> Phases
            </h2>
            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
              1/{phases.length} PHASES
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {phases.map((phase) =>
            <div key={phase.id} className="border-b border-white/[0.02]">
                <PhaseHeader
                phase={phase}
                isExpanded={expandedPhases.includes(phase.id)}
                onToggle={() => togglePhase(phase.id)} />
              

                {expandedPhases.includes(phase.id) &&
              <div className="bg-black/20 pb-2">
                    {phase.subtasks.map((subtask) =>
                <SubTaskItem
                  key={subtask.id}
                  task={subtask}
                  isActive={activeSubTaskId === subtask.id}
                  onClick={() => setActiveSubTaskId(subtask.id)} />

                )}
                  </div>
              }
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="text-[10px] text-zinc-500 font-mono mb-2">
              NEXT MILESTONE
            </div>
            <div className="text-xs text-zinc-300 font-medium">
              Concrete Pour Inspection
            </div>
            <div className="text-[10px] text-orange-400 mt-1">
              Due in 2 days
            </div>
          </div>
        </aside>

        {/* CENTER PANE: Isometric View */}
        <section className="flex-1 relative bg-[#050505] overflow-hidden">
          <ConstructionView3D completedSubtasks={completedSubtasks} />

          {/* Simulating Overlay */}
          {isSimulatingStep &&
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <div className="text-xl font-bold text-white tracking-widest">
                CONSTRUCTING...
              </div>
              <div className="text-sm text-cyan-400 font-mono mt-2">
                Applying {activeLabel}
              </div>
            </div>
          }

          {/* View Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur rounded-full p-1 border border-white/10">
            <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Active Task Label Overlay */}
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-black/60 backdrop-blur px-3 py-2 rounded border border-white/10 text-xs text-cyan-400 font-mono flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              ZONE A-1: {activeLabel}
            </div>
          </div>
        </section>

        {/* RIGHT PANE: Inspector Panel */}
        <aside className="w-80 bg-[#0F1115] border-l border-white/5 flex flex-col shrink-0 z-10">
          {/* Task Configuration Panel (New) */}
          {activeSubTaskObj &&
          <div className="flex flex-col">
              <TaskConfigPanel
              task={activeSubTaskObj}
              selections={taskSelections[activeSubTaskId] || {}}
              onSelect={(optionId, choiceIndex) =>
              handleTaskSelection(activeSubTaskId, optionId, choiceIndex)
              } />
            

              {/* Complete Step Button */}
              {activeSubTaskObj.status === 'in-progress' &&
            <div className="p-4 bg-[#1A1D24] border-b border-white/10">
                  <button
                onClick={handleCompleteStep}
                disabled={isSimulatingStep}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)]">
                
                    {isSimulatingStep ? 'Building...' : 'Complete Step'}
                    {!isSimulatingStep && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>
            }
            </div>
          }

          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[
            {
              id: 'resources',
              icon: <Users className="w-4 h-4" />,
              label: 'Resources'
            },
            {
              id: 'schedule',
              icon: <Calendar className="w-4 h-4" />,
              label: 'Schedule'
            },
            {
              id: 'cost',
              icon: <BarChart3 className="w-4 h-4" />,
              label: 'Cost'
            }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                  flex-1 py-3 flex items-center justify-center gap-2 text-xs font-medium transition-colors border-b-2
                  ${activeTab === tab.id ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                `}>
              
                {tab.icon}
                {tab.label}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'resources' &&
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Active Crew
                  </h3>
                  <button
                  onClick={() => setShowResourceLibrary(true)}
                  className="text-[10px] flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors uppercase font-bold tracking-wider">
                  
                    <Plus className="w-3 h-3" /> Add Resource
                  </button>
                </div>

                <div className="space-y-3">
                  <ResourceCounter
                  label="Labor Crew"
                  count={resources.labor}
                  cost={150}
                  onUpdate={(val) =>
                  setResources({
                    ...resources,
                    labor: val
                  })
                  } />
                
                  <ResourceCounter
                  label="Foremen"
                  count={1}
                  cost={45}
                  onUpdate={() => {}} />
                
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Heavy Machinery
                  </h3>
                  <ResourceCounter
                  label="Mobile Crane"
                  count={resources.crane}
                  cost={450}
                  onUpdate={(val) =>
                  setResources({
                    ...resources,
                    crane: val
                  })
                  } />
                
                  <ResourceCounter
                  label="Dump Trucks"
                  count={resources.trucks}
                  cost={120}
                  onUpdate={(val) =>
                  setResources({
                    ...resources,
                    trucks: val
                  })
                  } />
                
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-yellow-500 mb-1">
                        Efficiency Warning
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Current crane allocation is insufficient for the active
                        labor crew size. Consider adding +1 Crane to optimize
                        throughput.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'schedule' &&
            <div className="space-y-6 animate-fade-in-up">
                {/* Timeline Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Project Timeline
                  </h3>
                  <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                    Week 4 of 12
                  </span>
                </div>

                {/* Gantt Chart Area */}
                <div className="space-y-1">
                  <ScheduleItem
                  label="Site Preparation"
                  startWeek={1}
                  duration={2}
                  status="completed" />
                
                  <ScheduleItem
                  label="Foundation"
                  startWeek={3}
                  duration={3}
                  status="in-progress" />
                
                  <ScheduleItem
                  label="Structural Framing"
                  startWeek={5}
                  duration={4}
                  status="pending" />
                
                  <ScheduleItem
                  label="Roofing & Envelope"
                  startWeek={8}
                  duration={3}
                  status="pending" />
                
                  <ScheduleItem
                  label="MEP Systems"
                  startWeek={9}
                  duration={3}
                  status="pending" />
                
                  <ScheduleItem
                  label="Interior Finishing"
                  startWeek={10}
                  duration={2}
                  status="pending" />
                
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-zinc-500">Done</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-[10px] text-zinc-500">Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <span className="text-[10px] text-zinc-500">Pending</span>
                  </div>
                </div>

                {/* Critical Path Note */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-orange-500 mb-1">
                        Schedule Risk
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        Foundation phase is 2 days behind schedule. Increase
                        labor allocation to recover time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'cost' &&
            <div className="space-y-6 animate-fade-in-up">
                {/* Total Budget Card */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Total Spend
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    $842,500
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500">Budget: $1,200,000</span>
                    <span className="text-green-400">70% Used</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                    Cost Breakdown
                  </h3>
                  <CostCategory
                  label="Labor"
                  spent={320000}
                  budget={450000}
                  color="bg-blue-500" />
                
                  <CostCategory
                  label="Materials"
                  spent={280000}
                  budget={400000}
                  color="bg-purple-500" />
                
                  <CostCategory
                  label="Equipment"
                  spent={185000}
                  budget={250000}
                  color="bg-orange-500" />
                
                  <CostCategory
                  label="Overhead"
                  spent={57500}
                  budget={100000}
                  color="bg-zinc-500" />
                
                </div>

                {/* Burn Rate */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-zinc-300">
                        Daily Burn Rate
                      </span>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">
                      $12,450
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Projected to finish{' '}
                    <span className="text-green-400 font-bold">
                      $45k under budget
                    </span>{' '}
                    at current rate.
                  </p>
                </div>
              </div>
            }
          </div>

          {/* Inspector Footer */}
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-400">Total Hourly Rate</span>
              <span className="text-sm font-mono font-bold text-white">
                $
                {resources.labor * 150 +
                resources.crane * 450 +
                resources.trucks * 120 +
                45}
              </span>
            </div>
            <button
              onClick={onRunSimulation}
              className="w-full py-3 bg-[#FFB400] hover:bg-[#FFC840] text-black text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,180,0,0.3)] hover:shadow-[0_0_25px_rgba(255,180,0,0.5)] flex items-center justify-center gap-2">
              
              <Play className="w-4 h-4 fill-black" />
              Run Simulation
            </button>
          </div>
        </aside>
      </div>
    </main>);

}