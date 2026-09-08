import React, { useEffect, useState, useRef, Fragment, Component } from 'react';
interface ConstructionView3DProps {
  completedSubtasks: string[];
}
// ─── Building Dimensions ───
const W = 260;
const D = 180;
const SLAB = 18;
const COLH = 120;
const BEAM = 8;
// Z-Levels
const Z_GROUND = 0;
const Z_SLAB_BOT = -10;
const Z_SLAB_TOP = Z_SLAB_BOT + SLAB;
const Z_COL_BOT = Z_SLAB_TOP;
const Z_COL_TOP = Z_COL_BOT + COLH;
const Z_BEAM_BOT = Z_COL_TOP;
const Z_BEAM_TOP = Z_BEAM_BOT + BEAM;
const Z_ROOF = Z_BEAM_TOP;
// ─── 3D Primitives ───
const Box = ({
  w,
  d,
  h,
  x = 0,
  y = 0,
  z = 0,
  top,
  front,
  side,
  opacity = 1,
  className = '',
  children













}: {w: number;d: number;h: number;x?: number;y?: number;z?: number;top: string;front: string;side: string;opacity?: number;className?: string;children?: React.ReactNode;}) =>
<div
  className={`absolute left-1/2 top-1/2 ${className}`}
  style={{
    width: w,
    height: d,
    marginLeft: x - w / 2,
    marginTop: y - d / 2,
    transformStyle: 'preserve-3d',
    opacity,
    transition: 'opacity 0.8s ease'
  }}>
  
    <div
    style={{
      position: 'absolute',
      width: w,
      height: d,
      left: 0,
      top: 0,
      background: top,
      transform: `translateZ(${z + h}px)`
    }} />
  
    <div
    style={{
      position: 'absolute',
      width: w,
      height: h,
      left: 0,
      bottom: -h,
      background: front,
      transformOrigin: 'top',
      transform: `translateZ(${z}px) rotateX(-90deg)`
    }} />
  
    <div
    style={{
      position: 'absolute',
      width: h,
      height: d,
      left: w,
      top: 0,
      background: side,
      transformOrigin: 'left top',
      transform: `translateZ(${z}px) rotateY(90deg)`
    }} />
  
    {children}
  </div>;

const FlatPanel = ({
  w,
  h,
  x = 0,
  y = 0,
  z = 0,
  bg,
  opacity = 1,
  className = '',
  children










}: {w: number;h: number;x?: number;y?: number;z?: number;bg: string;opacity?: number;className?: string;children?: React.ReactNode;}) =>
<div
  className={`absolute left-1/2 top-1/2 ${className}`}
  style={{
    width: w,
    height: h,
    marginLeft: x - w / 2,
    marginTop: y - h / 2,
    background: bg,
    transform: `translateZ(${z}px)`,
    opacity,
    transition: 'opacity 0.8s ease, background 1.2s ease'
  }}>
  
    {children}
  </div>;

// Legacy WallPanel for backward compatibility if needed, but we'll try to use WallBox
const WallPanel = ({
  length,
  height,
  x = 0,
  y = 0,
  zBottom = 0,
  axis,
  bg,
  opacity = 1,
  className = '',
  children











}: {length: number;height: number;x?: number;y?: number;zBottom?: number;axis: 'x' | 'y';bg: string;opacity?: number;className?: string;children?: React.ReactNode;}) => {
  const style: React.CSSProperties =
  axis === 'x' ?
  {
    width: length,
    height: height,
    marginLeft: x - length / 2,
    marginTop: y,
    background: bg,
    transformOrigin: 'top left',
    transform: `translateZ(${zBottom}px) rotateX(-90deg)`
  } :
  {
    width: height,
    height: length,
    marginLeft: x,
    marginTop: y - length / 2,
    background: bg,
    transformOrigin: 'top left',
    transform: `translateZ(${zBottom}px) rotateY(90deg)`
  };
  return (
    <div
      className={`absolute left-1/2 top-1/2 ${className}`}
      style={{
        ...style,
        opacity,
        transition: 'opacity 0.8s ease, background 1.2s ease'
      }}>
      
      {children}
    </div>);

};
// New 3D WallBox Primitive
const WallBox = ({
  length,
  height,
  thickness = 4,
  x = 0,
  y = 0,
  zBottom = 0,
  axis,
  top,
  front,
  side,
  opacity = 1,
  className = '',
  children














}: {length: number;height: number;thickness?: number;x?: number;y?: number;zBottom?: number;axis: 'x' | 'y';top: string;front: string;side: string;opacity?: number;className?: string;children?: React.ReactNode;}) => {
  // If axis is x, wall runs along x (width=length, depth=thickness)
  // If axis is y, wall runs along y (width=thickness, depth=length)
  const w = axis === 'x' ? length : thickness;
  const d = axis === 'x' ? thickness : length;
  return (
    <Box
      w={w}
      d={d}
      h={height}
      x={x}
      y={y}
      z={zBottom}
      top={top}
      front={front}
      side={side}
      opacity={opacity}
      className={className}>
      
      {children}
    </Box>);

};
// ─── Phase Layer Components (Cumulative) ───
const GroundLayer = () =>
<FlatPanel w={600} h={600} z={Z_GROUND - 15} bg="#1c1917">
    <div
    className="w-full h-full opacity-20"
    style={{
      backgroundImage:
      'linear-gradient(#44403c 1px, transparent 1px), linear-gradient(90deg, #44403c 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }} />
  
  </FlatPanel>;

// Phase 1: Site Prep - survey stakes and boundary
const SitePrepLayer = ({ visible }: {visible: boolean;}) =>
<div
  style={{
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.8s ease'
  }}>
  
    {[
  [-W / 2 - 15, -D / 2 - 15],
  [W / 2 + 15, -D / 2 - 15],
  [-W / 2 - 15, D / 2 + 15],
  [W / 2 + 15, D / 2 + 15]].
  map(([sx, sy], i) =>
  <FlatPanel
    key={i}
    w={6}
    h={6}
    x={sx}
    y={sy}
    z={1}
    bg="#f59e0b"
    className="rounded-full" />

  )}
    <FlatPanel
    w={W + 40}
    h={D + 40}
    z={0}
    bg="transparent"
    className="border border-dashed border-yellow-600/40" />
  
  </div>;

// Phase 2: Foundation - concrete slab with footings
const FoundationLayer = ({
  visible,
  progress



}: {visible: boolean;progress: number;}) => {
  // progress: 0=excavation, 1=gravel, 2=rebar, 3=formwork, 4=concrete, 5=curing, 6=inspection
  const hasExcavation = progress >= 0;
  const hasGravel = progress >= 1;
  const hasRebar = progress >= 2;
  const hasFormwork = progress >= 3;
  const hasConcrete = progress >= 4;
  const hasCuring = progress >= 5;
  const hasInspection = progress >= 6;
  const slabColor = hasCuring ? '#d4d4d8' : '#9ca3af';
  const slabFront = hasCuring ? '#a1a1aa' : '#6b7280';
  const slabSide = hasCuring ? '#71717a' : '#4b5563';
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease'
      }}>
      
      {/* Excavation pit */}
      {hasExcavation &&
      <>
          <FlatPanel w={W} h={D} z={Z_SLAB_BOT - 10} bg="#1c1917" />
          <Box
          w={W}
          d={3}
          h={20}
          x={0}
          y={D / 2}
          z={Z_SLAB_BOT - 10}
          top="#292524"
          front="#44403c"
          side="#292524" />
        
          <Box
          w={3}
          d={D}
          h={20}
          x={W / 2}
          y={0}
          z={Z_SLAB_BOT - 10}
          top="#292524"
          front="#292524"
          side="#3f3f46" />
        
          {/* Dirt piles */}
          <Box
          w={35}
          d={20}
          h={7}
          x={-W / 2 - 35}
          y={-25}
          z={Z_GROUND}
          top="#44403c"
          front="#292524"
          side="#1c1917" />
        
        </>
      }

      {/* Gravel */}
      {hasGravel &&
      <Box
        w={W - 6}
        d={D - 6}
        h={5}
        x={0}
        y={0}
        z={Z_SLAB_BOT - 10}
        top="#78716c"
        front="#57534e"
        side="#44403c" />

      }

      {/* Rebar grid */}
      {hasRebar &&
      <FlatPanel w={W - 14} h={D - 14} z={Z_SLAB_BOT - 3} bg="transparent">
          <div
          className="w-full h-full"
          style={{
            backgroundImage:
            'linear-gradient(#c2410c 2px, transparent 2px), linear-gradient(90deg, #c2410c 2px, transparent 2px)',
            backgroundSize: '22px 22px',
            opacity: 0.5
          }} />
        
        </FlatPanel>
      }

      {/* Formwork */}
      {hasFormwork &&
      <>
          <Box
          w={W + 14}
          d={6}
          h={SLAB + 2}
          x={0}
          y={D / 2 + 5}
          z={Z_SLAB_BOT}
          top="#92400e"
          front="#78350f"
          side="#713f12" />
        
          <Box
          w={W + 14}
          d={6}
          h={SLAB + 2}
          x={0}
          y={-D / 2 - 5}
          z={Z_SLAB_BOT}
          top="#92400e"
          front="#78350f"
          side="#713f12" />
        
          <Box
          w={6}
          d={D + 14}
          h={SLAB + 2}
          x={W / 2 + 5}
          y={0}
          z={Z_SLAB_BOT}
          top="#92400e"
          front="#713f12"
          side="#78350f" />
        
          <Box
          w={6}
          d={D + 14}
          h={SLAB + 2}
          x={-W / 2 - 5}
          y={0}
          z={Z_SLAB_BOT}
          top="#92400e"
          front="#713f12"
          side="#78350f" />
        
        </>
      }

      {/* Concrete slab */}
      {hasConcrete &&
      <>
          <Box
          w={W}
          d={D}
          h={SLAB}
          x={0}
          y={0}
          z={Z_SLAB_BOT}
          top={slabColor}
          front={slabFront}
          side={slabSide} />
        
          {/* Wet sheen before curing */}
          {!hasCuring &&
        <FlatPanel
          w={W - 4}
          h={D - 4}
          z={Z_SLAB_TOP + 0.5}
          bg="linear-gradient(135deg, rgba(100,116,139,0.3) 0%, rgba(148,163,184,0.15) 50%, rgba(100,116,139,0.3) 100%)" />

        }
        </>
      }

      {/* Curing blanket */}
      {hasCuring && !hasInspection &&
      <FlatPanel
        w={W - 4}
        h={D - 4}
        z={Z_SLAB_TOP + 1}
        bg="linear-gradient(135deg, rgba(147,197,253,0.2) 0%, rgba(255,255,255,0.08) 50%, rgba(147,197,253,0.2) 100%)"
        className="animate-pulse" />

      }

      {/* Inspection markers */}
      {hasInspection &&
      <>
          {[
        [-60, -40],
        [0, 0],
        [60, 40],
        [-40, 30],
        [50, -30]].
        map(([ix, iy], i) =>
        <FlatPanel
          key={i}
          w={6}
          h={6}
          x={ix}
          y={iy}
          z={Z_SLAB_TOP + 2}
          bg="#22c55e"
          className="rounded-full" />

        )}
          <FlatPanel
          w={40}
          h={20}
          x={0}
          y={0}
          z={Z_SLAB_TOP + 2.5}
          bg="rgba(34,197,94,0.15)"
          className="border border-green-500/40 rounded" />
        
        </>
      }

      {/* Footings (always show once foundation starts) */}
      {[
      [-W / 2 - 5, -D / 2 - 5],
      [W / 2 + 5, -D / 2 - 5],
      [-W / 2 - 5, D / 2 + 5],
      [W / 2 + 5, D / 2 + 5]].
      map(([fx, fy], i) =>
      <Box
        key={i}
        w={10}
        d={10}
        h={SLAB - 2}
        x={fx}
        y={fy}
        z={Z_SLAB_BOT}
        top="#4b5563"
        front="#374151"
        side="#1f2937" />

      )}
    </div>);

};
// Phase 3: Steel Frame
const SteelFrameLayer = ({
  visible,
  progress



}: {visible: boolean;progress: number;}) => {
  const cx = W / 2 - 5;
  const cy = D / 2 - 5;
  const colPositions = [
  {
    x: -cx,
    y: -cy
  },
  {
    x: cx,
    y: -cy
  },
  {
    x: -cx,
    y: cy
  },
  {
    x: cx,
    y: cy
  },
  {
    x: 0,
    y: -cy
  },
  {
    x: 0,
    y: cy
  }];

  // progress: 0=columns, 1=beams, 2=bracing, 3=bolting, 4=welding
  const hasColumns = progress >= 0;
  const hasBeams = progress >= 1;
  const hasBracing = progress >= 2;
  const hasBolting = progress >= 3;
  const hasWelding = progress >= 4;
  const steelT = hasWelding ? '#94a3b8' : hasBolting ? '#64748b' : '#475569';
  const steelF = hasWelding ? '#64748b' : hasBolting ? '#475569' : '#334155';
  const steelS = hasWelding ? '#475569' : hasBolting ? '#334155' : '#1e293b';
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease'
      }}>
      
      {/* Columns */}
      {hasColumns &&
      colPositions.map((c, i) =>
      <Fragment key={`col-${i}`}>
            <Box
          w={10}
          d={10}
          h={COLH}
          x={c.x}
          y={c.y}
          z={Z_COL_BOT}
          top={steelT}
          front={steelF}
          side={steelS} />
        
            <FlatPanel
          w={16}
          h={16}
          x={c.x}
          y={c.y}
          z={Z_COL_BOT}
          bg="#71717a" />
        
          </Fragment>
      )}

      {/* Beams */}
      {hasBeams &&
      <>
          <Box
          w={W - 10}
          d={BEAM}
          h={BEAM}
          x={0}
          y={-cy}
          z={Z_BEAM_BOT}
          top={steelT}
          front={steelF}
          side={steelS} />
        
          <Box
          w={W - 10}
          d={BEAM}
          h={BEAM}
          x={0}
          y={cy}
          z={Z_BEAM_BOT}
          top={steelT}
          front={steelF}
          side={steelS} />
        
          <Box
          w={BEAM}
          d={D - 10}
          h={BEAM}
          x={-cx}
          y={0}
          z={Z_BEAM_BOT}
          top={steelT}
          front={steelF}
          side={steelS} />
        
          <Box
          w={BEAM}
          d={D - 10}
          h={BEAM}
          x={0}
          y={0}
          z={Z_BEAM_BOT}
          top={steelT}
          front={steelF}
          side={steelS} />
        
          <Box
          w={BEAM}
          d={D - 10}
          h={BEAM}
          x={cx}
          y={0}
          z={Z_BEAM_BOT}
          top={steelT}
          front={steelF}
          side={steelS} />
        
        </>
      }

      {/* Cross-bracing - 3D Boxes */}
      {hasBracing &&
      <div
        style={{
          transformStyle: 'preserve-3d'
        }}>
        
          {/* Bracing 1 */}
          <Box
          w={W * 0.45}
          d={3}
          h={3}
          x={-W / 4}
          y={cy}
          z={Z_COL_BOT + 20}
          top="#ea580c"
          front="#c2410c"
          side="#9a3412"
          opacity={0.9}
          className="origin-top-left rotate-[30deg]" />
        
          {/* Bracing 2 */}
          <Box
          w={W * 0.45}
          d={3}
          h={3}
          x={W / 4}
          y={cy}
          z={Z_COL_BOT + COLH - 20}
          top="#ea580c"
          front="#c2410c"
          side="#9a3412"
          opacity={0.9}
          className="origin-top-left -rotate-[30deg]" />
        
          {/* Bracing 3 */}
          <Box
          w={3}
          d={D * 0.5}
          h={3}
          x={cx}
          y={-D / 4}
          z={Z_COL_BOT + 20}
          top="#ea580c"
          front="#c2410c"
          side="#9a3412"
          opacity={0.9}
          className="origin-top-left rotate-[30deg]" />
        
        </div>
      }

      {/* Bolting dots - 3D Cubes */}
      {hasBolting &&
      colPositions.map((c, i) =>
      <Box
        key={`bolt-${i}`}
        w={6}
        d={6}
        h={4}
        x={c.x}
        y={c.y}
        z={Z_BEAM_BOT + BEAM + 1}
        top="#fbbf24"
        front="#d97706"
        side="#b45309" />

      )}

      {/* Welding glow + 3D Bead */}
      {hasWelding &&
      colPositions.slice(0, 4).map((c, i) =>
      <Fragment key={`weld-${i}`}>
            <Box
          w={8}
          d={8}
          h={3}
          x={c.x}
          y={c.y}
          z={Z_BEAM_BOT + BEAM + 1}
          top="#ef4444"
          front="#dc2626"
          side="#b91c1c" />
        
            <FlatPanel
          w={14}
          h={14}
          x={c.x}
          y={c.y}
          z={Z_BEAM_BOT + BEAM + 2}
          bg="radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)"
          className="rounded-full" />
        
          </Fragment>
      )}
    </div>);

};
// Phase 4: Roofing & Envelope
const RoofEnvelopeLayer = ({
  visible,
  progress



}: {visible: boolean;progress: number;}) => {
  const cx = W / 2 - 5;
  const cy = D / 2 - 5;
  // progress: 0=roof deck, 1=membrane, 2=insulation, 3=wall panels, 4=dock doors, 5=windows
  const hasRoofDeck = progress >= 0;
  const hasMembrane = progress >= 1;
  const hasInsulation = progress >= 2;
  const hasWallPanels = progress >= 3;
  const hasDockDoors = progress >= 4;
  const hasWindows = progress >= 5;
  const roofT = hasInsulation ? '#fbbf24' : hasMembrane ? '#f5f5f4' : '#52525b';
  const roofF = hasInsulation ? '#d97706' : hasMembrane ? '#d6d3d1' : '#3f3f46';
  const roofS = hasInsulation ? '#b45309' : hasMembrane ? '#a8a29e' : '#27272a';
  // Wall colors
  const wallTop = '#94a3b8';
  const wallFront = '#64748b';
  const wallSide = '#475569';
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease'
      }}>
      
      {/* Roof */}
      {hasRoofDeck &&
      <Box
        w={W + 16}
        d={D + 16}
        h={5}
        x={0}
        y={0}
        z={Z_ROOF}
        top={roofT}
        front={roofF}
        side={roofS} />

      }

      {/* Wall Panels - 3D */}
      {hasWallPanels &&
      <>
          <WallBox
          length={W}
          height={COLH}
          thickness={6}
          x={0}
          y={cy + 5}
          zBottom={Z_COL_BOT}
          axis="x"
          top={wallTop}
          front={wallFront}
          side={wallSide}
          opacity={0.95} />
        
          <WallBox
          length={D}
          height={COLH}
          thickness={6}
          x={cx + 5}
          y={0}
          zBottom={Z_COL_BOT}
          axis="y"
          top="#cbd5e1"
          front="#94a3b8"
          side="#64748b"
          opacity={0.95} />
        
        </>
      }

      {/* Dock Doors - 3D Recessed */}
      {hasDockDoors &&
      [-70, 0, 70].map((dx, i) =>
      <WallBox
        key={`door-${i}`}
        length={36}
        height={45}
        thickness={4}
        x={dx}
        y={cy + 6 - 2} // Slightly recessed
        zBottom={Z_COL_BOT}
        axis="x"
        top="#0f172a"
        front="#1e293b"
        side="#0c1222"
        className="border-2 border-slate-600" />

      )}

      {/* Windows - 3D Frames */}
      {hasWindows &&
      [-45, 0, 45].map((dy, i) =>
      <WallBox
        key={`win-${i}`}
        length={28}
        height={28}
        thickness={3}
        x={cx + 6}
        y={dy}
        zBottom={Z_COL_BOT + COLH - 50}
        axis="y"
        top="#7dd3fc"
        front="#38bdf8"
        side="#0284c7"
        opacity={0.9}
        className="border-2 border-sky-500 rounded-sm" />

      )}
    </div>);

};
// Phase 5: MEP Systems
const MEPLayer = ({
  visible,
  progress



}: {visible: boolean;progress: number;}) => {
  const cx = W / 2 - 5;
  // progress: 0=plumbing, 1=drainage, 2=conduit, 3=electrical, 4=hvac, 5=fire, 6=sprinklers
  const hasPlumbing = progress >= 0;
  const hasDrainage = progress >= 1;
  const hasConduit = progress >= 2;
  const hasElectrical = progress >= 3;
  const hasHVAC = progress >= 4;
  const hasFireSupp = progress >= 5;
  const hasSprinklers = progress >= 6;
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease'
      }}>
      
      {/* Plumbing - Blue Pipe 3D */}
      {hasPlumbing &&
      <Box
        w={W - 30}
        d={5}
        h={5}
        x={-10}
        y={25}
        z={Z_COL_BOT + 15}
        top="#3b82f6"
        front="#2563eb"
        side="#1d4ed8"
        opacity={0.9} />

      }

      {/* Drainage - Green Pipe 3D */}
      {hasDrainage &&
      <Box
        w={W - 30}
        d={5}
        h={5}
        x={10}
        y={-25}
        z={Z_COL_BOT + 8}
        top="#22c55e"
        front="#16a34a"
        side="#15803d"
        opacity={0.9} />

      }

      {/* Conduit - Yellow Vertical 3D */}
      {hasConduit &&
      <Box
        w={5}
        d={D - 30}
        h={5}
        x={50}
        y={0}
        z={Z_COL_TOP - 15}
        top="#eab308"
        front="#ca8a04"
        side="#a16207"
        opacity={0.9} />

      }

      {/* Electrical Panel - Already 3D */}
      {hasElectrical &&
      <Box
        w={14}
        d={5}
        h={18}
        x={cx - 8}
        y={-35}
        z={Z_COL_BOT + COLH / 2 - 9}
        top="#fbbf24"
        front="#f59e0b"
        side="#d97706" />

      }

      {/* HVAC - Already 3D */}
      {hasHVAC &&
      <Box
        w={W - 50}
        d={20}
        h={14}
        x={0}
        y={0}
        z={Z_COL_TOP - 20}
        top="#71717a"
        front="#52525b"
        side="#3f3f46"
        opacity={0.9} />

      }

      {/* Fire Suppression - Red Pipe 3D */}
      {hasFireSupp &&
      <Box
        w={W - 30}
        d={4}
        h={4}
        x={0}
        y={-50}
        z={Z_COL_TOP - 5}
        top="#ef4444"
        front="#dc2626"
        side="#b91c1c"
        opacity={0.9} />

      }

      {/* Sprinklers - 3D Hanging Boxes */}
      {hasSprinklers &&
      [-70, -20, 30, 80].map((dx, i) =>
      <Box
        key={i}
        w={5}
        d={5}
        h={6}
        x={dx}
        y={-50}
        z={Z_COL_TOP - 11} // Hanging down
        top="#ef4444"
        front="#dc2626"
        side="#b91c1c" />

      )}
    </div>);

};
// Phase 6: Finishing
const FinishingLayer = ({
  visible,
  progress



}: {visible: boolean;progress: number;}) => {
  const cx = W / 2 - 5;
  const cy = D / 2 - 5;
  // progress: 0=sealing, 1=epoxy, 2=int paint, 3=ext paint, 4=signage, 5=final insp, 6=commission
  const hasSealing = progress >= 0;
  const hasEpoxy = progress >= 1;
  const hasSignage = progress >= 4;
  const hasFinalInsp = progress >= 5;
  const hasCommission = progress >= 6;
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease'
      }}>
      
      {/* Epoxy floor overlay - 3D Layer */}
      {hasEpoxy &&
      <Box
        w={W - 4}
        d={D - 4}
        h={2}
        x={0}
        y={0}
        z={Z_SLAB_TOP + 1}
        top="rgba(96,165,250,0.3)"
        front="rgba(59,130,246,0.3)"
        side="rgba(37,99,235,0.3)" />

      }

      {/* Signage - 3D WallBox */}
      {hasSignage &&
      <>
          <WallBox
          length={20}
          height={14}
          thickness={3}
          x={0}
          y={cy + 6}
          zBottom={Z_COL_TOP - 25}
          axis="x"
          top="#16a34a"
          front="#15803d"
          side="#14532d"
          className="border border-green-400" />
        
          {/* Floor marking line - 3D */}
          <Box
          w={W - 20}
          d={4}
          h={2}
          x={0}
          y={0}
          z={Z_SLAB_TOP + 2}
          top="#eab308"
          front="#ca8a04"
          side="#a16207"
          opacity={0.7} />
        
        </>
      }

      {/* Final inspection markers - 3D Boxes */}
      {hasFinalInsp &&
      [
      [-80, -50],
      [80, -50],
      [-80, 50],
      [80, 50]].
      map(([ix, iy], i) =>
      <Box
        key={i}
        w={8}
        d={8}
        h={4}
        x={ix}
        y={iy}
        z={Z_SLAB_TOP + 2}
        top="#22c55e"
        front="#16a34a"
        side="#15803d" />

      )}

      {/* Commissioning glow - Keep as light effect */}
      {hasCommission &&
      <>
          <FlatPanel
          w={W - 8}
          h={D - 8}
          z={Z_SLAB_TOP + 2}
          bg="radial-gradient(ellipse, rgba(251,191,36,0.15) 0%, transparent 70%)"
          className="animate-pulse" />
        
          {[-45, 0, 45].map((dy, i) =>
        <WallPanel
          key={`glow-${i}`}
          length={32}
          height={32}
          x={cx + 8}
          y={dy}
          zBottom={Z_COL_BOT + COLH - 50}
          axis="y"
          bg="radial-gradient(circle, rgba(251,191,36,0.4), transparent)" />

        )}
        </>
      }
    </div>);

};
// ─── Main Component ───
export function ConstructionView3D({
  completedSubtasks
}: ConstructionView3DProps) {
  const has = (id: string) => completedSubtasks.includes(id);
  // Map subtask completion to phase visibility and progress
  // Phase 1: Site Prep (sub-1-1 through sub-1-4)
  const siteComplete = has('sub-1-4');
  // Phase 2: Foundation (sub-2-1 through sub-2-7)
  const foundationVisible = has('sub-2-1');
  const foundationProgress = has('sub-2-7') ?
  6 :
  has('sub-2-6') ?
  5 :
  has('sub-2-5') ?
  4 :
  has('sub-2-4') ?
  3 :
  has('sub-2-3') ?
  2 :
  has('sub-2-2') ?
  1 :
  0;
  // Phase 3: Structural Framing (sub-3-1 through sub-3-5)
  const frameVisible = has('sub-3-1');
  const frameProgress = has('sub-3-5') ?
  4 :
  has('sub-3-4') ?
  3 :
  has('sub-3-3') ?
  2 :
  has('sub-3-2') ?
  1 :
  0;
  // Phase 4: Roofing & Envelope (sub-4-1 through sub-4-6)
  const roofVisible = has('sub-4-1');
  const roofProgress = has('sub-4-6') ?
  5 :
  has('sub-4-5') ?
  4 :
  has('sub-4-4') ?
  3 :
  has('sub-4-3') ?
  2 :
  has('sub-4-2') ?
  1 :
  0;
  // Phase 5: MEP (sub-5-1 through sub-5-7)
  const mepVisible = has('sub-5-1');
  const mepProgress = has('sub-5-7') ?
  6 :
  has('sub-5-6') ?
  5 :
  has('sub-5-5') ?
  4 :
  has('sub-5-4') ?
  3 :
  has('sub-5-3') ?
  2 :
  has('sub-5-2') ?
  1 :
  0;
  // Phase 6: Finishing (sub-6-1 through sub-6-7)
  const finishVisible = has('sub-6-1');
  const finishProgress = has('sub-6-7') ?
  6 :
  has('sub-6-6') ?
  5 :
  has('sub-6-5') ?
  4 :
  has('sub-6-4') ?
  3 :
  has('sub-6-3') ?
  2 :
  has('sub-6-2') ?
  1 :
  0;
  // Flash effect on new completion
  const [flashActive, setFlashActive] = useState(false);
  const prevCountRef = useRef(completedSubtasks.length);
  useEffect(() => {
    if (completedSubtasks.length > prevCountRef.current) {
      setFlashActive(true);
      const t = setTimeout(() => setFlashActive(false), 600);
      prevCountRef.current = completedSubtasks.length;
      return () => clearTimeout(t);
    }
    prevCountRef.current = completedSubtasks.length;
  }, [completedSubtasks.length]);
  return (
    <div
      className="relative w-full h-full bg-[#080A0E] overflow-hidden flex items-center justify-center"
      style={{
        perspective: 1200
      }}>
      
      {/* Flash overlay */}
      {flashActive &&
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          background:
          'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
          animation: 'flash-fade 0.6s ease-out forwards'
        }} />

      }

      <div
        className="relative"
        style={{
          width: 500,
          height: 400,
          transformStyle: 'preserve-3d',
          transform: 'rotateX(58deg) rotateZ(-45deg) scale(0.8)'
        }}>
        
        {/* Ground (always visible) */}
        <GroundLayer />

        {/* Site Prep */}
        <SitePrepLayer visible={siteComplete} />

        {/* Foundation (cumulative - stays visible once started) */}
        <FoundationLayer
          visible={foundationVisible}
          progress={foundationProgress} />
        

        {/* Steel Frame (cumulative) */}
        <SteelFrameLayer visible={frameVisible} progress={frameProgress} />

        {/* Roof & Envelope (cumulative) */}
        <RoofEnvelopeLayer visible={roofVisible} progress={roofProgress} />

        {/* MEP Systems (cumulative) */}
        <MEPLayer visible={mepVisible} progress={mepProgress} />

        {/* Finishing (cumulative) */}
        <FinishingLayer visible={finishVisible} progress={finishProgress} />
      </div>

      <style>{`
        @keyframes flash-fade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>);

}