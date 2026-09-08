import React, { useEffect, useState, Component } from 'react';
import {
  ChevronLeft,
  Save,
  Send,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  Building2,
  Globe,
  Shield,
  Briefcase } from
'lucide-react';
// --- Types ---
export interface MissionData {
  name: string;
  description: string;
  buildType: string;
  structureCategory: string;
  primaryMaterials: string[];
  terrainType: string;
  location: string;
  region: string;
  budget: string;
  timeLimit: string;
  timeUnit: string;
  priority: string;
  environmentalConstraints: string;
  regulatoryRequirements: string;
  specialConditions: string;
}
interface AdminCreateMissionProps {
  onBack: () => void;
  onComplete: (data: MissionData) => void;
}
// --- Components ---
const SectionHeader = ({ icon: Icon, title }: {icon: any;title: string;}) =>
<div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-6">
    <div className="p-2 bg-[#D4A800]/10 rounded border border-[#D4A800]/20 text-[#D4A800]">
      <Icon className="w-4 h-4" />
    </div>
    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
      {title}
    </h3>
  </div>;

const InputLabel = ({ label }: {label: string;}) =>
<label className="block text-[10px] uppercase tracking-widest text-[#D4A800]/60 font-bold mb-2">
    {label}
  </label>;

export function AdminCreateMission({
  onBack,
  onComplete
}: AdminCreateMissionProps) {
  const [formData, setFormData] = useState<MissionData>({
    name: '',
    description: '',
    buildType: 'Warehouse',
    structureCategory: 'Single-Story',
    primaryMaterials: [],
    terrainType: 'Urban',
    location: '',
    region: 'North America',
    budget: '',
    timeLimit: '',
    timeUnit: 'Months',
    priority: 'Standard',
    environmentalConstraints: '',
    regulatoryRequirements: '',
    specialConditions: ''
  });
  // Auto-calculate budget whenever relevant fields change
  useEffect(() => {
    const calculateBudget = () => {
      const BASE_COSTS: Record<string, number> = {
        Warehouse: 1200000,
        'Commercial Tower': 45000000,
        'Residential Complex': 12000000,
        'Bridge/Infrastructure': 4500000,
        'Industrial Plant': 8000000,
        'Military Outpost': 15000000,
        Custom: 5000000
      };
      const STRUCTURE_MULTIPLIERS: Record<string, number> = {
        'Single-Story': 1,
        'Multi-Story': 1.5,
        'High-Rise': 3,
        Underground: 2,
        'Mixed-Use': 1.8
      };
      const TERRAIN_MULTIPLIERS: Record<string, number> = {
        Urban: 1.2,
        Desert: 1.1,
        Coastal: 1.3,
        Mountain: 1.5,
        Plains: 1,
        Forest: 1.1,
        Arctic: 1.8,
        Swamp: 1.4
      };
      const PRIORITY_MULTIPLIERS: Record<string, number> = {
        Standard: 1,
        High: 1.1,
        Critical: 1.3,
        Emergency: 1.5
      };
      let cost = BASE_COSTS[formData.buildType] || 1000000;
      cost *= STRUCTURE_MULTIPLIERS[formData.structureCategory] || 1;
      cost *= TERRAIN_MULTIPLIERS[formData.terrainType] || 1;
      cost *= PRIORITY_MULTIPLIERS[formData.priority] || 1;
      // Add material costs (dummy flat rate per material)
      cost += formData.primaryMaterials.length * 500000;
      // Format as currency string
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(Math.round(cost));
      setFormData((prev) => ({
        ...prev,
        budget: formatted
      }));
    };
    calculateBudget();
  }, [
  formData.buildType,
  formData.structureCategory,
  formData.terrainType,
  formData.priority,
  formData.primaryMaterials]
  );
  const handleChange = (field: keyof MissionData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleMaterialToggle = (material: string) => {
    setFormData((prev) => {
      const current = prev.primaryMaterials;
      if (current.includes(material)) {
        return {
          ...prev,
          primaryMaterials: current.filter((m) => m !== material)
        };
      } else {
        return {
          ...prev,
          primaryMaterials: [...current, material]
        };
      }
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
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
              <PlusIcon className="w-5 h-5 text-[#D4A800]" />
              Deploy New Mission
            </h1>
            <div className="text-[10px] text-zinc-500 font-mono mt-1 tracking-wider">
              MISSION CONFIGURATION TERMINAL // ADMIN_DEPLOY_V1.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D4A800]/10 border border-[#D4A800]/30 rounded text-[10px] text-[#D4A800] font-bold tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A800] animate-pulse" />
          SECURE CHANNEL ACTIVE
        </div>
      </header>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
        <div className="absolute inset-0 bg-[#0A0A0A]/95 pointer-events-none" />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 max-w-5xl mx-auto space-y-8 pb-24">
          
          {/* 1. MISSION IDENTITY */}
          <section className="bg-[#0F1115] border border-white/5 rounded-lg p-6 shadow-lg">
            <SectionHeader icon={Briefcase} title="Mission Identity" />
            <div className="grid grid-cols-1 gap-6">
              <div>
                <InputLabel label="Operation Codename" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="ENTER MISSION NAME..."
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider" />
                
              </div>
              <div>
                <InputLabel label="Mission Objectives" />
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="DESCRIBE MISSION GOALS AND SCOPE..."
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider min-h-[100px] resize-none" />
                
              </div>
            </div>
          </section>

          {/* 2. BUILD SPECIFICATIONS */}
          <section className="bg-[#0F1115] border border-white/5 rounded-lg p-6 shadow-lg">
            <SectionHeader icon={Building2} title="Build Specifications" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <InputLabel label="Build Type" />
                <div className="relative">
                  <select
                    value={formData.buildType}
                    onChange={(e) => handleChange('buildType', e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider appearance-none cursor-pointer">
                    
                    <option>Warehouse</option>
                    <option>Commercial Tower</option>
                    <option>Residential Complex</option>
                    <option>Bridge/Infrastructure</option>
                    <option>Industrial Plant</option>
                    <option>Military Outpost</option>
                    <option>Custom</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    ▼
                  </div>
                </div>
              </div>
              <div>
                <InputLabel label="Structure Category" />
                <div className="relative">
                  <select
                    value={formData.structureCategory}
                    onChange={(e) =>
                    handleChange('structureCategory', e.target.value)
                    }
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider appearance-none cursor-pointer">
                    
                    <option>Single-Story</option>
                    <option>Multi-Story</option>
                    <option>High-Rise</option>
                    <option>Underground</option>
                    <option>Mixed-Use</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div>
              <InputLabel label="Primary Materials Required" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                'Reinforced Concrete',
                'Structural Steel',
                'Timber Frame',
                'Composite Materials',
                'Pre-Fabricated Modules',
                'Glass & Curtain Wall'].
                map((mat) =>
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleMaterialToggle(mat)}
                  className={`
                      px-3 py-2 text-xs font-bold uppercase tracking-wider border rounded text-left transition-all
                      ${formData.primaryMaterials.includes(mat) ? 'bg-[#D4A800]/20 border-[#D4A800] text-[#D4A800]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300'}
                    `}>
                  
                    {formData.primaryMaterials.includes(mat) ? '[x]' : '[ ]'}{' '}
                    {mat}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* 3. TERRAIN & LOCATION */}
          <section className="bg-[#0F1115] border border-white/5 rounded-lg p-6 shadow-lg">
            <SectionHeader icon={MapPin} title="Terrain & Location" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <InputLabel label="Terrain Type" />
                <div className="relative">
                  <select
                    value={formData.terrainType}
                    onChange={(e) =>
                    handleChange('terrainType', e.target.value)
                    }
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider appearance-none cursor-pointer">
                    
                    <option>Urban</option>
                    <option>Desert</option>
                    <option>Coastal</option>
                    <option>Mountain</option>
                    <option>Plains</option>
                    <option>Forest</option>
                    <option>Arctic</option>
                    <option>Swamp</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    ▼
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <InputLabel label="Location Coordinates" />
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="LAT/LONG OR ADDRESS..."
                    className="w-full bg-black border border-white/10 rounded pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider" />
                  
                </div>
              </div>
              <div className="md:col-span-3">
                <InputLabel label="Region" />
                <div className="relative">
                  <select
                    value={formData.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider appearance-none cursor-pointer">
                    
                    <option>North America</option>
                    <option>South America</option>
                    <option>Europe</option>
                    <option>Asia</option>
                    <option>Africa</option>
                    <option>Middle East</option>
                    <option>Oceania</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. BUDGET & TIMELINE */}
          <section className="bg-[#0F1115] border border-white/5 rounded-lg p-6 shadow-lg">
            <SectionHeader icon={DollarSign} title="Budget & Timeline" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <InputLabel label="Estimated Budget (Auto-Calc)" />
                <div className="w-full bg-[#0A0A0A] border border-[#D4A800]/30 rounded px-4 py-3 text-sm text-[#D4A800] font-mono font-bold uppercase tracking-wider opacity-80 cursor-not-allowed">
                  {formData.budget || '$0'}
                </div>
              </div>

              <div>
                <InputLabel label="Time Limit" />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => handleChange('timeLimit', e.target.value)}
                    placeholder="00"
                    className="w-20 bg-black border border-white/10 rounded px-3 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors text-center" />
                  
                  <div className="relative flex-1">
                    <select
                      value={formData.timeUnit}
                      onChange={(e) => handleChange('timeUnit', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider appearance-none cursor-pointer">
                      
                      <option>Weeks</option>
                      <option>Months</option>
                      <option>Years</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <InputLabel label="Priority Level" />
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className={`
                      w-full bg-black border border-white/10 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider appearance-none cursor-pointer font-bold
                      ${formData.priority === 'Critical' || formData.priority === 'Emergency' ? 'text-red-500' : formData.priority === 'High' ? 'text-orange-500' : 'text-white'}
                    `}>
                    
                    <option>Standard</option>
                    <option>High</option>
                    <option>Critical</option>
                    <option>Emergency</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. CONSTRAINTS & REQUIREMENTS */}
          <section className="bg-[#0F1115] border border-white/5 rounded-lg p-6 shadow-lg">
            <SectionHeader
              icon={AlertTriangle}
              title="Constraints & Requirements" />
            
            <div className="space-y-6">
              <div>
                <InputLabel label="Environmental Constraints" />
                <textarea
                  value={formData.environmentalConstraints}
                  onChange={(e) =>
                  handleChange('environmentalConstraints', e.target.value)
                  }
                  placeholder="ENVIRONMENTAL REGULATIONS, PROTECTED ZONES..."
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider min-h-[80px] resize-none" />
                
              </div>
              <div>
                <InputLabel label="Regulatory Requirements" />
                <textarea
                  value={formData.regulatoryRequirements}
                  onChange={(e) =>
                  handleChange('regulatoryRequirements', e.target.value)
                  }
                  placeholder="BUILDING CODES, PERMITS, ZONING..."
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider min-h-[80px] resize-none" />
                
              </div>
              <div>
                <InputLabel label="Special Conditions" />
                <textarea
                  value={formData.specialConditions}
                  onChange={(e) =>
                  handleChange('specialConditions', e.target.value)
                  }
                  placeholder="WEATHER, ACCESS RESTRICTIONS, SECURITY..."
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#D4A800]/50 transition-colors uppercase tracking-wider min-h-[80px] resize-none" />
                
              </div>
            </div>
          </section>
        </form>
      </div>

      {/* --- Footer --- */}
      <footer className="h-24 bg-[#0F1115] border-t border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-4 border border-white/10 text-zinc-400 font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white hover:border-white/20 transition-all text-sm rounded">
          
          Cancel Operation
        </button>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Status
            </div>
            <div className="text-xs text-[#D4A800] font-bold uppercase tracking-wider animate-pulse">
              Ready to Review
            </div>
          </div>
          <button
            onClick={() => onComplete(formData)}
            className="px-10 py-4 bg-[#D4A800] text-black font-bold uppercase tracking-widest hover:bg-[#E5B800] hover:shadow-[0_0_20px_rgba(212,168,0,0.4)] transition-all text-sm rounded flex items-center gap-3">
            
            <Send className="w-4 h-4" />
            Review Budget
          </button>
        </div>
      </footer>
    </main>);

}
// Icon helper
const PlusIcon = ({ className }: {className?: string;}) =>
<svg
  className={className}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor">
  
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M12 4v16m8-12H4" />
  
  </svg>;