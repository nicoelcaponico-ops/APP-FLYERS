/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Instagram, Download, Sparkles, Send, Loader2, RotateCcw, Layout, Layers, CheckCircle, Image as ImageIcon, Maximize2 } from "lucide-react";
import { toPng } from "html-to-image";
import { generateFlyerVariants, FlyerState } from "./services/geminiService";

const LOGO_URL = "https://storage.googleapis.com/h-applet-user-media/n_8f2976_7693244837330554-logo_blanco.png";

const INITIAL_VARIANTS: FlyerState[] = [
  {
    versionName: "Sleek Industrial",
    productCategory: "Cables & Conexiones",
    title: "POTENCIA",
    subtitle: "Stock Garantizado",
    accentTitle: "CERTIFICADA",
    marketingBadge: "NUEVO INGRESO",
    description: "Cables unipolares de alta resistencia para entornos industriales exigentes.",
    heroImageUrl: "https://storage.googleapis.com/h-applet-user-media/n_8f2976_7693244837330554-cables_unipolares.png",
    items: [
      { id: "1", name: "Cable Unipolar", specs: [{ label: "Corte", value: "A medida" }, { label: "Material", value: "Cobre" }], iconType: "product" },
      { id: "2", name: "Cable Taller", specs: [{ label: "Uso", value: "Exterior" }, { label: "Norma", value: "IRAM" }], iconType: "product" },
    ],
    theme: {
      primaryColor: "#1473f7",
      secondaryColor: "#0a0a0a",
      accentColor: "#facc15",
      isDarkTheme: true,
      layoutStyle: "slanted",
      fontPairing: "tech"
    },
    logoConfig: { size: "md", position: "top-left", showLogo: true },
    stats: [{ label: "Calidad", value: "ISO 9001" }, { label: "Envío", value: "Interior" }, { label: "Garantía", value: "12 Meses" }]
  },
  {
    versionName: "Minimal Tech",
    productCategory: "Iluminación LED",
    title: "VISIÓN",
    subtitle: "Iluminación Industrial",
    accentTitle: "EXTREMA",
    marketingBadge: "OFERTA B2B",
    description: "Reflectores de alta potencia para depósitos y predios industriales.",
    heroImageUrl: "https://picsum.photos/seed/lighting/800/800",
    items: [
      { id: "1", name: "Reflector 200W", specs: [{ label: "IP", value: "66" }, { label: "Lúmenes", value: "22000" }], iconType: "product" },
    ],
    theme: {
      primaryColor: "#00d2ff",
      secondaryColor: "#ffffff",
      accentColor: "#333333",
      isDarkTheme: false,
      layoutStyle: "minimal",
      fontPairing: "classic"
    },
    logoConfig: { size: "md", position: "top-left", showLogo: true },
    stats: [{ label: "Ahorro", value: "90%" }, { label: "Vida Útil", value: "50k h" }, { label: "Stock", value: "Inmediato" }]
  },
  {
    versionName: "Dark Bold",
    productCategory: "Motores & Bombas",
    title: "TRACCIÓN",
    subtitle: "Rendimiento Superior",
    accentTitle: "MAXIMA",
    marketingBadge: "ELITE B2B",
    description: "Bombas centrífugas para sistemas de riego y presión constante.",
    heroImageUrl: "https://picsum.photos/seed/acc-engine/800/800",
    items: [
      { id: "1", name: "Bomba 1HP", specs: [{ label: "Voltaje", value: "220V" }], iconType: "product" },
      { id: "2", name: "Bomba 2HP", specs: [{ label: "Voltaje", value: "380V" }], iconType: "product" },
    ],
    theme: {
      primaryColor: "#ff4b2b",
      secondaryColor: "#111111",
      accentColor: "#ffffff",
      isDarkTheme: true,
      layoutStyle: "bold",
      fontPairing: "brutalist"
    },
    logoConfig: { size: "lg", position: "top-left", showLogo: true },
    stats: [{ label: "Potencia", value: "Real" }, { label: "Envíos", value: "País" }, { label: "B2B", value: "Elite" }]
  },
  {
    versionName: "Technical Grid",
    productCategory: "Ferretería Industrial",
    title: "SOPORTE",
    subtitle: "Herramientas de Precisión",
    accentTitle: "TOTAL",
    marketingBadge: "EXCLUSIVO",
    description: "Kits de herramientas eléctricas para mantenimiento de flota.",
    items: [
      { id: "1", name: "Llave Impacto", specs: [{ label: "Torque", value: "1350Nm" }], iconType: "product" },
      { id: "2", name: "Rotomartillo", specs: [{ label: "Impacto", value: "5J" }], iconType: "product" },
      { id: "3", name: "Atornillador", specs: [{ label: "Batería", value: "20V" }], iconType: "product" },
      { id: "4", name: "Amoladora", specs: [{ label: "Disco", value: "4.5\"" }], iconType: "product" },
    ],
    theme: {
      primaryColor: "#facc15",
      secondaryColor: "#000000",
      accentColor: "#ffffff",
      isDarkTheme: true,
      layoutStyle: "grid",
      fontPairing: "tech"
    },
    logoConfig: { size: "md", position: "top-right", showLogo: true },
    stats: [{ label: "Resistencia", value: "V" }, { label: "Servicio", value: "24h" }, { label: "Precios", value: "Directo" }]
  }
];

export default function App() {
  const flyerRef = React.useRef<HTMLDivElement>(null);
  const [variants, setVariants] = React.useState<FlyerState[]>(INITIAL_VARIANTS);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [logoSize, setLogoSize] = React.useState<'sm'|'md'|'lg'>('md');

  const state = variants[currentIndex];

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const newVariants = await generateFlyerVariants(prompt);
      setVariants(newVariants);
      setCurrentIndex(0);
      setPrompt("");
    } catch (err) {
      console.error(err);
      alert("Error generando los flyers. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const exportAsPng = async () => {
    if (flyerRef.current === null) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(flyerRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `accion-parts-${state.accentTitle.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  // Dynamic layout helpers
  const logoSizeClass = { sm: "w-24", md: "w-32", lg: "w-44" };
  const getLayoutPadding = (style: string) => style === 'minimal' ? 'px-16 py-16' : 'px-10 py-10';
  
  // Dynamic header padding based on logo size to prevent cramping
  const getHeaderPadding = (size: 'sm' | 'md' | 'lg') => {
    if (size === 'lg') return 'py-12';
    if (size === 'md') return 'py-10';
    return 'py-8';
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Texture Overlay (Grain) */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* Control Panel */}
      <div className="w-full lg:w-[440px] bg-[#0c0c0c] border-r border-cyan-500/10 p-6 flex flex-col gap-8 overflow-y-auto max-h-screen lg:max-h-none scrollbar-hide relative z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#1473f7] p-2.5 rounded-2xl shadow-[0_0_30px_rgba(20,115,247,0.4)]">
              <Layers className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-black italic tracking-tighter text-2xl uppercase leading-none">ACCION<span className="text-[#1473f7]">GEN</span></h2>
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]">v2.0 Premium Tool</span>
            </div>
          </div>

          <div className="space-y-6">
             <div className="p-5 bg-white/[0.03] rounded-[24px] border border-white/5 space-y-4 backdrop-blur-md">
                <div className="flex justify-between items-center">
                   <label className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Maximize2 size={12} className="text-[#1473f7]" /> Escala Corporativa
                   </label>
                   <span className="text-[9px] font-black bg-[#1473f7]/20 text-[#1473f7] px-2 py-0.5 rounded italic">Dynamic Scaling</span>
                </div>
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                   {(['sm', 'md', 'lg'] as const).map((size) => (
                     <button 
                       key={size}
                       onClick={() => setLogoSize(size)}
                       className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300 ${logoSize === size ? 'bg-[#1473f7] text-white shadow-xl shadow-[#1473f7]/20 scale-105' : 'text-white/40 hover:text-white/60'}`}
                     >
                       {size}
                     </button>
                   ))}
                </div>
             </div>

            <div className="space-y-3">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1">
                 <ImageIcon size={12} className="text-[#1473f7]" /> Prompter de Campaña
              </label>
              <form onSubmit={handleGenerate} className="space-y-4">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Nuevos cables para motor, estilo deportivo azul, destaca el origen nacional..."
                  className="w-full bg-black/50 border border-white/10 rounded-[24px] p-6 text-white text-sm focus:outline-none focus:border-[#1473f7] transition-all h-36 resize-none shadow-inner placeholder:text-white/10"
                />
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#1473f7] text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-[#1473f7]/30 group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={20} className="group-hover:rotate-12 transition-transform" /> GENERAR CATALOGO 4K</>}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1">
               <Layout size={12} className="text-[#1473f7]" /> Variantes Curadas
            </label>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {variants.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-5 rounded-[24px] border transition-all duration-300 text-left relative overflow-hidden group ${currentIndex === idx ? 'border-[#1473f7] bg-[#1473f7]/10 ring-1 ring-[#1473f7]/50' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-tighter mb-1.5 ${currentIndex === idx ? 'text-[#1473f7]' : 'text-white/30'}`}>Variant {idx + 1}</div>
                  <div className="text-white text-[11px] font-black truncate leading-tight uppercase italic group-hover:text-[#1473f7] transition-colors">{v.versionName}</div>
                  {currentIndex === idx && (
                    <motion.div layoutId="active-pill" className="absolute bottom-0 left-0 w-full h-1 bg-[#1473f7]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-8 border-t border-white/5 mt-auto">
          <button 
            disabled={exporting}
            onClick={() => { setVariants(INITIAL_VARIANTS); setCurrentIndex(0); }}
            className="flex-1 text-white/20 hover:text-[#ff4444] transition-all text-[10px] font-black uppercase tracking-widest py-4 border border-white/5 rounded-2xl flex items-center justify-center"
          >
            Reset
          </button>
          <button 
            disabled={exporting}
            onClick={exportAsPng}
            className="flex-[4] bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#1473f7] hover:text-white active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50"
          >
            {exporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} 
            {exporting ? 'PROCESANDO...' : 'DESCARGAR 4K'}
          </button>
        </div>
      </div>

      {/* Preview Stage - FIXED & CLIPPED CONTAINER */}
      <div className="flex-1 bg-[#050505] flex items-center justify-center p-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${currentIndex}-${variants[currentIndex].accentTitle}`}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            ref={flyerRef}
            className="w-[600px] aspect-[4/5] relative overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,1)] flex flex-col bg-white"
            style={{ backgroundColor: state.theme.secondaryColor }}
          >
            {/* Texture Overlay (Internal Grain) */}
            <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.1] mix-blend-overlay"
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />

            {/* AI Generated Background Layers (STRICTLY BACKGROUND) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />
               {state.theme.layoutStyle === 'slanted' && (
                 <div className="absolute top-0 right-0 w-full h-full -skew-x-[25deg] translate-x-1/2 opacity-[0.05]" style={{ backgroundColor: state.theme.primaryColor }} />
               )}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50" />
            </div>

            {/* MARKETING BADGE (FLOATING) */}
            {state.marketingBadge && (
               <div className="absolute top-8 right-8 z-[70] rotate-3">
                  <div className="bg-white px-4 py-1.5 rounded-full shadow-2xl flex items-center justify-center gap-2 border border-black/5 grow-on-hover transition-transform duration-500">
                     <Sparkles size={12} className="text-[#1473f7]" />
                     <span className="text-[10px] font-black italic tracking-tighter text-black uppercase">{state.marketingBadge}</span>
                  </div>
               </div>
            )}

            {/* HEADER - FIXED HEIGHT & DYNAMIC PADDING */}
            <header className={`z-10 flex-none flex items-center justify-between px-10 relative ${getHeaderPadding(logoSize)} transition-all duration-500`}>
               {state.logoConfig?.showLogo && (
                 <div className={`flex flex-col gap-1 ${state.logoConfig.position === 'top-right' ? 'order-last' : state.logoConfig.position === 'centered' ? 'mx-auto' : ''}`}>
                    <img 
                      src={LOGO_URL} 
                      alt="Accion Parts" 
                      className={`${logoSizeClass[logoSize]} object-contain brightness-200 drop-shadow-md transition-all duration-500`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="h-0.5 w-[40%] bg-white/20 rounded-full" />
                 </div>
               )}
               <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-none mb-1" style={{ color: state.theme.isDarkTheme ? 'white' : '#111' }}>
                    {state.productCategory}
                  </span>
                  <div className="text-[8px] font-mono opacity-20" style={{ color: state.theme.isDarkTheme ? 'white' : '#111' }}>
                     BATCH #{Math.floor(Math.random()*10000)}
                  </div>
               </div>
            </header>

            {/* MAIN BODY - SCALABLE & ORGANIZED */}
            <main className={`z-10 flex-1 flex flex-col ${getLayoutPadding(state.theme.layoutStyle)} pt-0 overflow-hidden`}>
                
                {/* Hero / Title Section - GRID BASED FOR STABILITY */}
                <div className="grid grid-cols-1 gap-8 mb-8">
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-[4px] w-10 rounded-full" style={{ backgroundColor: state.theme.primaryColor }} />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] italic" style={{ color: state.theme.primaryColor }}>{state.subtitle}</span>
                      </div>
                      
                      <h1 
                        className="font-black italic tracking-tighter uppercase transform -skew-x-2 leading-[0.8] break-words" 
                        style={{ 
                          color: state.theme.isDarkTheme ? 'white' : '#111',
                          fontSize: state.heroImageUrl ? '72px' : '84px' 
                        }}
                      >
                        {state.title}<br/>
                        <span style={{ color: state.theme.primaryColor }}>{state.accentTitle}</span>
                      </h1>
                      
                      <p className="text-[14px] font-medium leading-tight max-w-[400px] opacity-60 italic border-l-2 pl-4" style={{ borderColor: state.theme.accentColor, color: state.theme.isDarkTheme ? 'white' : '#333' }}>
                        {state.description}
                      </p>
                   </div>
                </div>

                {/* Items & Stats Area - DYNAMIC GRIDS */}
                <div className="flex-1 flex flex-col gap-6 justify-center">
                   {state.heroImageUrl ? (
                     <div className="grid grid-cols-12 gap-6 items-center">
                        <div className="col-span-8 grid grid-cols-1 gap-2">
                           {state.items.slice(0, 2).map((item, idx) => (
                             <div key={item.id} className="p-4 backdrop-blur-sm bg-white/5 border border-white/5 rounded-xl flex justify-between items-center group transition-all hover:bg-white/10">
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black uppercase opacity-20 text-white italic">Premium Component</span>
                                   <div className="text-xl font-black italic uppercase text-white leading-none">{item.name}</div>
                                   <div className="flex gap-2 mt-2">
                                      {item.specs.slice(0, 2).map((s, si) => (
                                        <div key={si} className="flex flex-col">
                                           <span className="text-[7px] font-bold text-white/30 uppercase leading-none">{s.label}</span>
                                           <span className="text-[9px] font-black leading-none" style={{ color: state.theme.primaryColor }}>{s.value}</span>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                                {item.imageUrl && <img src={item.imageUrl} className="w-10 h-10 object-contain brightness-110 drop-shadow-lg" referrerPolicy="no-referrer" />}
                             </div>
                           ))}
                        </div>
                        <div className="col-span-4 flex items-center justify-center p-4">
                           <div className="relative w-full aspect-square">
                              <div className="absolute inset-0 bg-white/5 blur-3xl opacity-20 rounded-full" />
                              <img 
                                src={state.heroImageUrl} 
                                className="w-full h-full object-contain filter drop-shadow-2xl relative z-10 scale-125 transition-transform duration-700 hover:scale-[1.3]" 
                                referrerPolicy="no-referrer" 
                              />
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 gap-4">
                        {state.items.slice(0, 4).map((item) => (
                           <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-3 relative overflow-hidden group transition-all hover:border-[#1473f7]/30">
                              <div className="flex justify-between items-start">
                                 <div className="text-lg font-black italic uppercase text-white leading-none tracking-tighter">{item.name}</div>
                                 {item.imageUrl && <img src={item.imageUrl} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {item.specs.slice(0, 2).map((s, si) => (
                                    <div key={si} className="flex flex-col">
                                       <span className="text-[7px] font-black text-white/40 uppercase">{s.label}</span>
                                       <span className="text-[10px] font-black" style={{ color: state.theme.primaryColor }}>{s.value}</span>
                                    </div>
                                 ))}
                              </div>
                              <div className="absolute top-0 right-0 w-8 h-8 opacity-[0.02] rotate-45 translate-x-4 -translate-y-4" style={{ backgroundColor: state.theme.primaryColor }} />
                           </div>
                        ))}
                     </div>
                   )}
                </div>

                {/* Stats Summary - FIXED AT BOTTOM OF BODY */}
                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-6">
                   {state.stats.slice(0, 3).map((s, i) => (
                     <div key={i} className="flex flex-col">
                        <div className="text-[10px] font-black uppercase opacity-30 tracking-widest leading-none mb-1 text-white">{s.label}</div>
                        <div className="text-2xl font-black italic tracking-tighter leading-none" style={{ color: state.theme.primaryColor }}>{s.value}</div>
                     </div>
                   ))}
                </div>
            </main>

            {/* FOOTER - FIXED AT BOTTOM */}
            <footer className="z-20 flex-none w-full shadow-2xl relative overflow-hidden">
               <div className="flex items-center justify-between px-10 py-5" style={{ backgroundColor: state.theme.primaryColor }}>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic mb-0.5">Contactanos Accion B2B</span>
                     <span className="text-3xl font-black italic tracking-tighter text-white">3755 598210</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="bg-black/20 text-white font-black text-[11px] px-5 py-2 italic transform -skew-x-12 border-r-4 border-white tracking-widest">
                        ACCION.GEMOVIL.COM
                     </div>
                  </div>
               </div>
               <div className="px-10 py-5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] italic bg-black/80 text-white/40 border-t border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 hover:text-[#1473f7] transition-colors"><Globe size={14} className="opacity-30" /> accionparts.com.ar</div>
                  <div className="flex items-center gap-2 hover:text-[#1473f7] transition-colors"><Instagram size={14} className="opacity-30" /> @accionparts</div>
               </div>
            </footer>

            {/* Design Finishers */}
            <div className="absolute top-0 left-0 w-full h-1 z-50 opacity-20" style={{ backgroundColor: state.theme.primaryColor }} />
            <div className="absolute top-0 left-0 w-1 h-full z-50 opacity-10" style={{ backgroundColor: state.theme.primaryColor }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
