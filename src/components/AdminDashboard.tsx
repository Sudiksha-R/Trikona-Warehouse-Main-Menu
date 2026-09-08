import React, { useState, Component } from 'react';
import {
  LayoutDashboard,
  Map,
  Users,
  Activity,
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  Briefcase } from
'lucide-react';
// --- Types ---
interface AdminDashboardProps {
  onBack: () => void;
  onCreateMission?: () => void;
}
type Tab = 'overview' | 'missions' | 'personnel' | 'intel';
interface Mission {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Locked' | 'Archived';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  budget: string;
  lastUpdated: string;
}
// --- Mock Data ---
const MOCK_MISSIONS: Mission[] = [
{
  id: 'm-001',
  name: 'WAREHOUSE PROTOTYPE',
  status: 'Active',
  difficulty: 'Easy',
  budget: '$1.2M',
  lastUpdated: '2h ago'
},
{
  id: 'm-002',
  name: 'MUNICIPAL BRIDGE',
  status: 'Locked',
  difficulty: 'Medium',
  budget: '$4.5M',
  lastUpdated: '1d ago'
},
{
  id: 'm-003',
  name: 'SKYLINE TOWER',
  status: 'Locked',
  difficulty: 'Hard',
  budget: '$85.0M',
  lastUpdated: '3d ago'
},
{
  id: 'm-004',
  name: 'DESERT OUTPOST',
  status: 'Archived',
  difficulty: 'Medium',
  budget: '$2.8M',
  lastUpdated: '1w ago'
}];

const ACTIVITY_LOG = [
{
  id: 1,
  action: 'USER_LOGIN',
  user: 'COMMANDER_X',
  time: '14:02:45',
  status: 'success'
},
{
  id: 2,
  action: 'MISSION_DEPLOY',
  user: 'ADMIN_SYS',
  time: '13:45:12',
  status: 'success'
},
{
  id: 3,
  action: 'DB_BACKUP',
  user: 'SYSTEM',
  time: '12:00:00',
  status: 'warning'
},
{
  id: 4,
  action: 'AUTH_FAIL',
  user: 'UNKNOWN',
  time: '11:23:08',
  status: 'error'
}];

// --- Components ---
const StatCard = ({
  label,
  value,
  trend,
  icon: Icon,
  color = 'text-[#D4A800]'
}: any) =>
<div className="bg-[#0F1115] border border-white/5 p-6 rounded-lg relative overflow-hidden group hover:border-[#D4A800]/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend &&
    <div className="flex items-center gap-1 text-xs font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
    }
    </div>
    <div className="text-3xl font-bold text-white mb-1 tracking-wider">
      {value}
    </div>
    <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
      {label}
    </div>

    {/* Decorative corner */}
    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-lg" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-lg" />
  </div>;

const StatusIndicator = ({ label, status, icon: Icon }: any) => {
  const colors = {
    online: 'text-green-400 bg-green-900/20 border-green-500/30',
    warning: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    offline: 'text-red-400 bg-red-900/20 border-red-500/30'
  };
  const activeColor = colors[status as keyof typeof colors] || colors.offline;
  return (
    <div
      className={`flex items-center justify-between p-3 border rounded ${activeColor}`}>
      
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-400 animate-pulse' : status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`} />
        
        <span className="text-[10px] font-mono uppercase">{status}</span>
      </div>
    </div>);

};
export function AdminDashboard({
  onBack,
  onCreateMission
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const navItems = [
  {
    id: 'overview',
    label: 'Command Center',
    icon: LayoutDashboard
  },
  {
    id: 'missions',
    label: 'Mission Control',
    icon: Map
  },
  {
    id: 'personnel',
    label: 'Personnel',
    icon: Users
  },
  {
    id: 'intel',
    label: 'System Intel',
    icon: Activity
  }];

  return (
    <main className="flex w-full h-screen bg-[#0A0A0A] text-zinc-200 font-mono overflow-hidden selection:bg-[#D4A800]/30 selection:text-[#D4A800]">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-[#0F1115] border-r border-white/5 flex flex-col shrink-0 z-20">
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4A800]/10 border border-[#D4A800]/30 rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#D4A800]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-widest uppercase">
                ADMIN
              </div>
              <div className="text-[10px] text-[#D4A800] tracking-wider">
                LEVEL 5 CLEARANCE
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all
                  ${isActive ? 'bg-[#D4A800]/10 text-[#D4A800] border border-[#D4A800]/30 shadow-[0_0_15px_rgba(212,168,0,0.1)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'}
                `}>
                
                <Icon className="w-4 h-4" />
                {item.label}
              </button>);

          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/10 text-red-400 border border-red-900/30 rounded hover:bg-red-900/20 transition-all text-xs font-bold uppercase tracking-wider">
            
            <LogOut className="w-4 h-4" />
            Exit Console
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
        <div className="absolute inset-0 bg-[#0A0A0A]/95 pointer-events-none" />

        {/* Top Bar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 relative z-10 bg-[#0A0A0A]/50 backdrop-blur">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-[0.2em] uppercase">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <div className="text-[10px] text-zinc-500 font-mono mt-1">
              SYS_ID: ADMIN_NODE_01 // ENCRYPTED CONNECTION
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-500/30 rounded text-[10px] text-green-400 font-bold tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              SYSTEM ONLINE
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">COMMANDER</div>
              <div className="text-[10px] text-zinc-500">ID: 8842-ALPHA</div>
            </div>
            <div className="w-10 h-10 bg-zinc-800 rounded-full border border-white/10 flex items-center justify-center text-zinc-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' &&
          <div className="space-y-8 animate-fade-in-up">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                label="Total Missions"
                value="12"
                trend="+2 this week"
                icon={Map} />
              
                <StatCard
                label="Active Ops"
                value="3"
                trend="Stable"
                icon={Activity}
                color="text-cyan-400" />
              
                <StatCard
                label="Completion Rate"
                value="94%"
                trend="+1.5%"
                icon={CheckCircle2}
                color="text-green-400" />
              
                <StatCard
                label="Total Budget"
                value="$142M"
                trend="Under cap"
                icon={DollarSign}
                color="text-purple-400" />
              
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Log */}
                <div className="lg:col-span-2 bg-[#0F1115] border border-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4A800]" />
                      Recent Activity Log
                    </h3>
                    <button className="text-[10px] text-[#D4A800] hover:text-white transition-colors uppercase tracking-wider">
                      View All
                    </button>
                  </div>

                  <div className="space-y-1">
                    {ACTIVITY_LOG.map((log) =>
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors border-b border-white/[0.02]">
                    
                        <div className="flex items-center gap-4">
                          <div
                        className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-green-500' : log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      
                          <span className="text-xs font-bold text-zinc-300 w-32">
                            {log.action}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">
                            {log.user}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {log.time}
                        </span>
                      </div>
                  )}
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-[#0F1115] border border-white/5 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    System Status
                  </h3>
                  <StatusIndicator
                  label="Main Server"
                  status="online"
                  icon={Server} />
                
                  <StatusIndicator
                  label="Mission DB"
                  status="online"
                  icon={Database} />
                
                  <StatusIndicator
                  label="Sim Engine"
                  status="warning"
                  icon={Cpu} />
                
                  <StatusIndicator
                  label="Auth Node"
                  status="online"
                  icon={Shield} />
                
                </div>
              </div>
            </div>
          }

          {/* MISSION CONTROL TAB */}
          {activeTab === 'missions' &&
          <div className="space-y-6 animate-fade-in-up">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                  type="text"
                  placeholder="SEARCH MISSION DATABASE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0F1115] border border-white/10 rounded pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider" />
                
                </div>
                <button
                onClick={onCreateMission}
                className="flex items-center gap-2 px-6 py-2 bg-[#D4A800] text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-[#E5B800] hover:shadow-[0_0_15px_rgba(212,168,0,0.4)] transition-all">
                
                  <Plus className="w-4 h-4" />
                  Deploy New Mission
                </button>
              </div>

              {/* Missions Table */}
              <div className="bg-[#0F1115] border border-white/5 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black/40 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Mission Name
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Difficulty
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Budget
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Last Update
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {MOCK_MISSIONS.filter((m) =>
                  m.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((mission) =>
                  <tr
                    key={mission.id}
                    className="hover:bg-white/[0.02] transition-colors group">
                    
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-zinc-500">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-white tracking-wide">
                              {mission.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                        className={`
                            px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border
                            ${mission.status === 'Active' ? 'bg-green-900/20 text-green-400 border-green-500/30' : mission.status === 'Locked' ? 'bg-red-900/20 text-red-400 border-red-500/30' : mission.status === 'Completed' ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-600'}
                          `}>
                        
                            {mission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                        className={`text-xs font-mono ${mission.difficulty === 'Hard' ? 'text-red-400' : mission.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        
                            {mission.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                          {mission.budget}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-mono text-zinc-500">
                          {mission.lastUpdated}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-900/20 rounded text-zinc-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {/* Placeholder Tabs */}
          {(activeTab === 'personnel' || activeTab === 'intel') &&
          <div className="flex flex-col items-center justify-center h-96 text-zinc-600 animate-fade-in-up">
              <div className="w-16 h-16 border-2 border-dashed border-zinc-700 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">
                Module Offline
              </h3>
              <p className="text-xs font-mono">
                This system component is currently under maintenance.
              </p>
            </div>
          }
        </div>
      </div>
    </main>);

}