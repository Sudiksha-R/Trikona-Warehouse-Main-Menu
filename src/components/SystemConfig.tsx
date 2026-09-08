import React, { useState, Component } from 'react';
import {
  X,
  Monitor,
  Volume2,
  Gamepad2,
  Cpu,
  Check,
  ChevronDown,
  Power } from
'lucide-react';
interface SystemConfigProps {
  onBack: () => void;
}
type Tab = 'graphics' | 'audio' | 'controls' | 'system';
// --- Reusable Tech Components ---
const TechToggle = ({
  label,
  active,
  onToggle




}: {label: string;active: boolean;onToggle: () => void;}) =>
<div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded hover:bg-white/5 transition-colors group">
    <span className="font-mono text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-wider">
      {label}
    </span>
    <button
    onClick={onToggle}
    className={`
        relative w-12 h-6 rounded-sm border transition-all duration-300
        ${active ? 'bg-green-900/50 border-green-500/50' : 'bg-zinc-900 border-zinc-700'}
      `}>
    
      <div
      className={`
          absolute top-0.5 bottom-0.5 w-5 bg-current rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center
          ${active ? 'left-[22px] text-green-400 bg-green-500' : 'left-0.5 text-zinc-500 bg-zinc-700'}
        `}>
      
        <div
        className={`w-1 h-3 rounded-full ${active ? 'bg-green-900' : 'bg-zinc-900'}`} />
      
      </div>
      {/* LED Indicator */}
      <div
      className={`
          absolute -right-3 top-1.5 w-1 h-1 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-300
          ${active ? 'bg-green-500 text-green-500' : 'bg-red-900 text-red-900'}
        `} />
    
    </button>
  </div>;

const TechSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100






}: {label: string;value: number;onChange: (val: number) => void;min?: number;max?: number;}) => {
  const percentage = (value - min) / (max - min) * 100;
  return (
    <div className="p-4 bg-black/20 border border-white/5 rounded hover:bg-white/5 transition-colors group">
      <div className="flex justify-between mb-3">
        <span className="font-mono text-sm text-zinc-400 group-hover:text-zinc-200 uppercase tracking-wider">
          {label}
        </span>
        <span className="font-mono text-xs text-cyan-400 font-bold">
          {value}%
        </span>
      </div>

      <div className="relative h-6 w-full flex items-center">
        {/* Track */}
        <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
          {/* Fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-900/50 to-cyan-500/50 border-r border-cyan-400 transition-all duration-100"
            style={{
              width: `${percentage}%`
            }}>
            
            {/* Scanline effect on fill */}
            <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.5)_3px)] opacity-50" />
          </div>
        </div>

        {/* Ticks */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[...Array(11)].map((_, i) =>
          <div
            key={i}
            className={`w-[1px] h-2 bg-white/20 ${i % 5 === 0 ? 'h-3 bg-white/40' : ''} mt-auto mb-auto`} />

          )}
        </div>

        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        
      </div>
    </div>);

};
const TechDropdown = ({
  label,
  value,
  options




}: {label: string;value: string;options: string[];}) =>
<div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded hover:bg-white/5 transition-colors group">
    <span className="font-mono text-sm text-zinc-400 group-hover:text-zinc-200 uppercase tracking-wider">
      {label}
    </span>
    <div className="relative">
      <select
      className="appearance-none bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-1.5 pr-8 rounded text-xs font-mono uppercase tracking-wide focus:outline-none focus:border-cyan-500 focus:text-cyan-400 transition-colors cursor-pointer min-w-[140px]"
      value={value}
      onChange={() => {}}>
      
        {options.map((opt) =>
      <option key={opt} value={opt}>
            {opt}
          </option>
      )}
      </select>
      <ChevronDown className="absolute right-2 top-1.5 w-4 h-4 text-zinc-500 pointer-events-none" />
    </div>
  </div>;

export function SystemConfig({ onBack }: SystemConfigProps) {
  const [activeTab, setActiveTab] = useState<Tab>('graphics');
  // Mock State
  const [settings, setSettings] = useState({
    vsync: true,
    bloom: true,
    motionBlur: false,
    masterVol: 80,
    sfxVol: 65,
    musicVol: 40,
    subtitles: true,
    haptics: true,
    streamerMode: false,
    fpsCounter: true
  });
  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const tabs: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
  }[] = [
  {
    id: 'graphics',
    label: 'Graphics',
    icon: <Monitor className="w-4 h-4" />
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: <Volume2 className="w-4 h-4" />
  },
  {
    id: 'controls',
    label: 'Controls',
    icon: <Gamepad2 className="w-4 h-4" />
  },
  {
    id: 'system',
    label: 'System',
    icon: <Cpu className="w-4 h-4" />
  }];

  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blurred wireframe background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center filter blur-xl scale-110" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_2px,rgba(0,0,0,0.5)_2px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
      </div>

      {/* Main Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0A0A0A]/90 border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-fade-in-up backdrop-blur-xl">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
            <h2 className="text-lg font-bold tracking-[0.2em] text-white uppercase">
              System Configuration
            </h2>
          </div>
          <div className="font-mono text-[10px] text-zinc-600 tracking-widest">
            SYS_CONFIG_V.1.0 // BUILD 8942
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar Tabs */}
          <aside className="w-64 border-r border-white/10 bg-black/20 flex flex-col">
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                  h-14 px-6 flex items-center gap-3 text-sm font-bold tracking-wider uppercase transition-all duration-200 border-l-2
                  ${activeTab === tab.id ? 'bg-white/5 border-cyan-500 text-cyan-400 shadow-[inset_10px_0_20px_-10px_rgba(34,211,238,0.1)]' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                `}>
              
                {tab.icon}
                {tab.label}
              </button>
            )}

            <div className="mt-auto p-6 border-t border-white/10">
              <button
                onClick={onBack}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2">
                
                <Power className="w-3 h-3" /> Save & Exit
              </button>
            </div>
          </aside>

          {/* Settings Panel */}
          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-transparent to-black/40">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Tab Content */}
              {activeTab === 'graphics' &&
              <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                    <Monitor className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Display Settings
                    </h3>
                  </div>

                  <TechDropdown
                  label="Resolution"
                  value="3840 x 2160 (4K)"
                  options={['1920 x 1080', '2560 x 1440', '3840 x 2160 (4K)']} />
                

                  <TechDropdown
                  label="Display Mode"
                  value="Borderless Window"
                  options={['Fullscreen', 'Windowed', 'Borderless Window']} />
                

                  <div className="h-px bg-white/5 my-4" />

                  <TechToggle
                  label="V-Sync"
                  active={settings.vsync}
                  onToggle={() => toggle('vsync')} />
                

                  <TechToggle
                  label="Bloom Effects"
                  active={settings.bloom}
                  onToggle={() => toggle('bloom')} />
                

                  <TechToggle
                  label="Motion Blur"
                  active={settings.motionBlur}
                  onToggle={() => toggle('motionBlur')} />
                

                  <div className="h-px bg-white/5 my-4" />

                  <TechSlider
                  label="Render Scale"
                  value={100}
                  onChange={() => {}} />
                

                  <TechSlider
                  label="Shadow Quality"
                  value={80}
                  onChange={() => {}} />
                
                </div>
              }

              {activeTab === 'audio' &&
              <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                    <Volume2 className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Audio Mixer
                    </h3>
                  </div>

                  <TechSlider
                  label="Master Volume"
                  value={settings.masterVol}
                  onChange={(v) =>
                  setSettings((p) => ({
                    ...p,
                    masterVol: v
                  }))
                  } />
                

                  <TechSlider
                  label="SFX Volume"
                  value={settings.sfxVol}
                  onChange={(v) =>
                  setSettings((p) => ({
                    ...p,
                    sfxVol: v
                  }))
                  } />
                

                  <TechSlider
                  label="Music Volume"
                  value={settings.musicVol}
                  onChange={(v) =>
                  setSettings((p) => ({
                    ...p,
                    musicVol: v
                  }))
                  } />
                

                  <div className="h-px bg-white/5 my-4" />

                  <TechToggle
                  label="Subtitles"
                  active={settings.subtitles}
                  onToggle={() => toggle('subtitles')} />
                
                </div>
              }

              {activeTab === 'controls' &&
              <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                    <Gamepad2 className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Input Configuration
                    </h3>
                  </div>

                  <TechDropdown
                  label="Input Method"
                  value="Mouse & Keyboard"
                  options={[
                  'Mouse & Keyboard',
                  'Controller (Xbox)',
                  'Controller (PS5)']
                  } />
                

                  <TechSlider
                  label="Mouse Sensitivity"
                  value={45}
                  onChange={() => {}} />
                

                  <div className="h-px bg-white/5 my-4" />

                  <TechToggle
                  label="Haptic Feedback"
                  active={settings.haptics}
                  onToggle={() => toggle('haptics')} />
                

                  <TechToggle
                  label="Invert Y-Axis"
                  active={false}
                  onToggle={() => {}} />
                
                </div>
              }

              {activeTab === 'system' &&
              <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                    <Cpu className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      System Diagnostics
                    </h3>
                  </div>

                  <TechToggle
                  label="Show FPS Counter"
                  active={settings.fpsCounter}
                  onToggle={() => toggle('fpsCounter')} />
                

                  <TechToggle
                  label="Streamer Mode"
                  active={settings.streamerMode}
                  onToggle={() => toggle('streamerMode')} />
                

                  <div className="h-px bg-white/5 my-4" />

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <div className="text-xs font-bold text-yellow-500 mb-1">
                      SYSTEM STATUS
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      MEMORY: 16GB / 32GB
                      <br />
                      GPU: NVIDIA RTX 4080 (32ms)
                      <br />
                      NETWORK: ONLINE (24ms)
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </main>);

}