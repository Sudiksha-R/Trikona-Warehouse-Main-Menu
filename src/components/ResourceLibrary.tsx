import React, { useState, Component } from 'react';
import {
  X,
  Search,
  Filter,
  Truck,
  Hammer,
  Users,
  Zap,
  CheckCircle2,
  Info } from
'lucide-react';
// --- Types ---
interface ResourceItem {
  id: string;
  name: string;
  category: 'machinery' | 'labor' | 'materials';
  cost: number;
  productivity: number;
  description: string;
  icon: React.ReactNode;
}
interface ResourceLibraryProps {
  onClose: () => void;
  onAssign: (resource: ResourceItem) => void;
}
// --- Mock Data ---
const RESOURCES: ResourceItem[] = [
{
  id: 'excavator-01',
  name: 'Heavy Excavator',
  category: 'machinery',
  cost: 1200,
  productivity: 85,
  description: 'High-capacity earthmover for rapid site preparation.',
  icon: <Truck className="w-8 h-8" />
},
{
  id: 'crane-01',
  name: 'Tower Crane',
  category: 'machinery',
  cost: 1800,
  productivity: 95,
  description: 'Essential for vertical construction and heavy lifting.',
  icon: <div className="w-8 h-8" />
},
{
  id: 'mixer-01',
  name: 'Concrete Mixer',
  category: 'machinery',
  cost: 950,
  productivity: 70,
  description: 'Continuous pour capability for large foundations.',
  icon: <Truck className="w-8 h-8" />
},
{
  id: 'crew-gen',
  name: 'General Labor Crew',
  category: 'labor',
  cost: 2400,
  productivity: 60,
  description: 'Standard 12-person crew for general construction tasks.',
  icon: <Users className="w-8 h-8" />
},
{
  id: 'crew-spec',
  name: 'Specialist Framers',
  category: 'labor',
  cost: 3200,
  productivity: 90,
  description: 'Expert team for structural steel and detailed framing.',
  icon: <Hammer className="w-8 h-8" />
},
{
  id: 'mat-steel',
  name: 'Steel Beams (1 Ton)',
  category: 'materials',
  cost: 800,
  productivity: 0,
  description: 'High-grade structural steel for framing phase.',
  icon: <div className="w-8 h-8" />
},
{
  id: 'mat-concrete',
  name: 'Concrete (10 yds)',
  category: 'materials',
  cost: 1200,
  productivity: 0,
  description: 'Quick-set concrete mix for foundations.',
  icon: <div className="w-8 h-8" />
}];

// --- Components ---
const ProductivityBar = ({ value }: {value: number;}) =>
<div className="w-full space-y-1">
    <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider">
      <span>Productivity</span>
      <span>{value}/100</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div
      className="h-full bg-cyan-500 rounded-full"
      style={{
        width: `${value}%`
      }} />
    
    </div>
  </div>;

export function ResourceLibrary({ onClose, onAssign }: ResourceLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'machinery' | 'labor' | 'materials'>(
    'all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredResources = RESOURCES.filter((item) => {
    const matchesCategory =
    activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const selectedItem = RESOURCES.find((r) => r.id === selectedId);
  const handleAssign = () => {
    if (selectedItem) {
      onAssign(selectedItem);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose} />
      

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[80vh] bg-[#0F1115] border border-white/10 rounded-xl shadow-2xl flex overflow-hidden animate-fade-in-up">
        {/* Left Sidebar: Filters */}
        <aside className="w-64 bg-black/20 border-r border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              Library
            </h2>
          </div>

          <div className="p-4 space-y-2">
            {[
            {
              id: 'all',
              label: 'All Items'
            },
            {
              id: 'machinery',
              label: 'Heavy Machinery'
            },
            {
              id: 'labor',
              label: 'Labor Crews'
            },
            {
              id: 'materials',
              label: 'Materials'
            }].
            map((cat) =>
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`
                  w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeCategory === cat.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}
                `}>
              
                {cat.label}
              </button>
            )}
          </div>

          <div className="mt-auto p-6 border-t border-white/5">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Tip: Higher productivity items reduce task duration but
                  increase daily burn rate.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content: Grid */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header & Search */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors" />
              
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-colors">
              
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`
                      relative group cursor-pointer rounded-xl border p-4 transition-all duration-200
                      ${isSelected ? 'bg-cyan-500/5 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'}
                    `}>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-zinc-500 group-hover:text-zinc-300'}
                      `}>
                        
                        {item.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-500 font-mono font-bold">
                          ${item.cost}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase">
                          Per Day
                        </div>
                      </div>
                    </div>

                    <h3
                      className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4 line-clamp-2 h-8">
                      {item.description}
                    </p>

                    {item.category !== 'materials' &&
                    <ProductivityBar value={item.productivity} />
                    }

                    {isSelected &&
                    <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 fill-cyan-500/20" />
                      </div>
                    }
                  </div>);

              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="h-20 border-t border-white/5 bg-black/20 px-6 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              {selectedItem ?
              <span>
                  Selected:{' '}
                  <span className="text-white font-bold">
                    {selectedItem.name}
                  </span>
                </span> :

              <span>Select an item to view details</span>
              }
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedItem}
              className={`
                px-8 py-3 font-bold text-sm tracking-widest uppercase rounded transition-all
                ${selectedItem ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
              `}>
              
              Assign to Task
            </button>
          </div>
        </main>
      </div>
    </div>);

}