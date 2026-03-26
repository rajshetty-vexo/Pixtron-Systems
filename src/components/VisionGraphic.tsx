import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const inspectionModes = [
  {
    id: 'geometry',
    label: 'GEOMETRY & COLOR',
    status: 'PASS',
    object: 'shape', // 3D Cube/Shape
    fps: '2500 FPS',
    details: 'OPUS SERIES'
  },
  {
    id: 'ocr',
    label: 'DOT PRINT / OCR',
    status: 'VERIFIED',
    object: 'code', // 2D Matrix/Code
    fps: '1800 FPS',
    details: 'CODEX SERIES'
  },
  {
    id: 'cable',
    label: 'CABLE & WIRE',
    status: 'SCANNING',
    object: 'wire', // Continuous line
    fps: '3200 FPS',
    details: 'RAPID SERIES'
  },
  {
    id: 'packaging',
    label: 'TETRA BRIK',
    status: 'SEAL OK',
    object: 'brik', // Box
    fps: '2200 FPS',
    details: 'INSPECTRA SERIES'
  }
];

export const VisionGraphic: React.FC = () => {
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setModeIndex((prev) => (prev + 1) % inspectionModes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentMode = inspectionModes[modeIndex];

  return (
    <div className="relative w-full max-w-xl aspect-square flex items-center justify-center perspective-1000">
      {/* 3D Container Box (Wireframe) */}
      <motion.div 
        className="relative w-72 h-80 border-2 border-primary/20 rounded-2xl flex items-center justify-center bg-slate-50/50"
        initial={{ rotateY: -15 }}
        animate={{ rotateY: 15 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        {/* Inspection Object Container */}
        <div className="relative w-48 h-64 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentMode.object === 'brik' && (
              <motion.div
                key="brik"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-32 h-56 bg-slate-200 border-2 border-slate-300 rounded-sm shadow-xl relative"
              >
                <div className="absolute top-4 left-2 right-2 h-8 bg-primary/10 rounded-sm" />
                <div className="absolute bottom-4 left-2 right-2 h-20 bg-slate-300/50 rounded-sm" />
              </motion.div>
            )}

            {currentMode.object === 'shape' && (
              <motion.div
                key="shape"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                className="w-32 h-32 bg-primary/10 border-2 border-primary/30 rounded-xl shadow-2xl flex items-center justify-center"
              >
                <div className="w-16 h-16 border-2 border-primary/40 rounded-lg rotate-45" />
              </motion.div>
            )}

            {currentMode.object === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-40 h-40 bg-white border-2 border-slate-200 rounded-lg shadow-xl p-4 grid grid-cols-4 gap-1"
              >
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`h-full rounded-sm ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-slate-100'}`} />
                ))}
              </motion.div>
            )}

            {currentMode.object === 'wire' && (
              <motion.div
                key="wire"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                className="h-8 w-full bg-slate-800 rounded-full relative overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanning Beam */}
          <motion.div
            className="absolute w-full h-1 bg-secondary shadow-[0_0_20px_rgba(251,187,13,1)] z-30"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 bg-secondary/5 z-20"
            animate={{ height: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Dynamic HUD Overlays */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentMode.id + 'hud1'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute -right-16 top-10 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-2xl w-48 z-40"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Analysis</div>
            <div className="text-sm font-black text-primary mb-2">{currentMode.label}</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">{currentMode.details}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${currentMode.status === 'PASS' || currentMode.status === 'VERIFIED' || currentMode.status === 'SEAL OK' ? 'bg-green-100 text-green-600' : 'bg-secondary/20 text-primary'}`}>
                {currentMode.status}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          className="absolute -left-16 bottom-10 bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-2xl w-48 z-40"
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sensor Telemetry</div>
          <div className="flex items-end gap-1 h-8 mb-3">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i} 
                className="flex-1 bg-primary/40 rounded-t-sm"
                animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-bold text-secondary">{currentMode.fps}</div>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Technical Elements */}
      <div className="absolute inset-0 border border-slate-100 rounded-full -z-10 scale-125 opacity-50" />
      <div className="absolute inset-0 border border-dashed border-slate-200 rounded-full -z-10 scale-110 opacity-30" />
    </div>
  );
};
