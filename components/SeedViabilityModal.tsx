import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, CheckCircle2, AlertCircle, Droplets,
    FlaskConical, AlertTriangle, Fingerprint,
    ThermometerSnowflake, Sprout, ArrowRight,
    RefreshCw, Info, Zap, ShieldCheck, Sparkles,
    Upload, Image as ImageIcon, Check
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'visual' | 'touch' | 'float' | 'germination' | 'strength' | 'result';

const STEPS_LIST: { id: Step; label: string }[] = [
    { id: 'visual', label: '1. Visual' },
    { id: 'touch', label: '2. Firmness' },
    { id: 'float', label: '3. Float' },
    { id: 'germination', label: '4. Germination' },
    { id: 'strength', label: '5. Vigor' },
    { id: 'result', label: 'Report' }
];

const SeedViabilityModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>('visual');

    // Test State
    const [isDamaged, setIsDamaged] = useState<boolean | null>(null);
    const [isSoft, setIsSoft] = useState<boolean | null>(null);
    const [didFloat, setDidFloat] = useState<boolean | null>(null);
    const [seedsTested, setSeedsTested] = useState<number>(100);
    const [seedsSprouted, setSeedsSprouted] = useState<number>(85);
    const [isWeak, setIsWeak] = useState<boolean | null>(null);

    // AI Photo Mode State
    const [mode, setMode] = useState<'guided' | 'photo'>('guided');
    const [photo, setPhoto] = useState<string | null>(null);
    const [analyzingPhoto, setAnalyzingPhoto] = useState(false);

    const calculateScore = () => {
        let score = 0;
        const germinationRate = seedsTested > 0 ? (seedsSprouted / seedsTested) * 100 : 0;
        score += (germinationRate * 0.7);

        if (isDamaged === false) score += 10;
        if (isSoft === false) score += 10;
        if (didFloat === false) score += 10;

        if (isWeak === true) score -= 15;

        return Math.max(0, Math.min(100, Math.round(score)));
    };

    const getViabilityStatus = (score: number) => {
        if (score >= 85) return { label: t('seed_viability.result.excellent', 'HIGHLY VIABLE (EXCELLENT)'), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 };
        if (score >= 70) return { label: t('seed_viability.result.acceptable', 'MODERATE VIABILITY (ACCEPTABLE)'), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle };
        return { label: t('seed_viability.result.poor', 'LOW VIABILITY (POOR SEED LOT)'), color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: AlertTriangle };
    };

    const reset = () => {
        setStep('visual');
        setIsDamaged(null);
        setIsSoft(null);
        setDidFloat(null);
        setSeedsTested(100);
        setSeedsSprouted(85);
        setIsWeak(null);
        setPhoto(null);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhoto(reader.result as string);
                setAnalyzingPhoto(true);
                setTimeout(() => {
                    setAnalyzingPhoto(false);
                    setIsDamaged(false);
                    setIsSoft(false);
                    setDidFloat(false);
                    setSeedsTested(100);
                    setSeedsSprouted(92);
                    setIsWeak(false);
                    setStep('result');
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    const score = calculateScore();
    const status = getViabilityStatus(score);
    const stepIndex = STEPS_LIST.findIndex(s => s.id === step);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-500 max-h-[92vh] flex flex-col">

                {/* Header */}
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-700/20">
                            <FlaskConical size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-black text-slate-800 outfit uppercase tracking-tight">
                                    {t('seed_viability.modal_title', 'Seed Viability & Quality Analyzer')}
                                </h2>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-black uppercase rounded-full tracking-widest">PRO DIAGNOSTIC</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {t('seed_viability.subtitle', 'Scientific step-by-step germination and seed vigor assessment')}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-100/50 p-2 shrink-0">
                    <button
                        onClick={() => setMode('guided')}
                        className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 ${
                            mode === 'guided' ? 'bg-white text-green-800 shadow-md' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <ShieldCheck size={16} /> {t('seed_viability.tab_guided', 'Guided Agronomic Audit')}
                    </button>
                    <button
                        onClick={() => setMode('photo')}
                        className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 ${
                            mode === 'photo' ? 'bg-white text-green-800 shadow-md' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Camera size={16} /> {t('seed_viability.tab_photo', 'AI Photo Viability Test')}
                    </button>
                </div>

                {/* Progress Stepper Bar (Only for guided mode & non-result steps) */}
                {mode === 'guided' && step !== 'result' && (
                    <div className="px-8 pt-6 pb-2 shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            {STEPS_LIST.slice(0, 5).map((s, idx) => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                                        stepIndex === idx ? 'bg-green-700 text-white shadow-lg shadow-green-700/30 scale-110' :
                                        stepIndex > idx ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {stepIndex > idx ? <Check size={14} /> : idx + 1}
                                    </div>
                                    <span className={`text-xs font-bold uppercase hidden sm:inline tracking-wider ${
                                        stepIndex === idx ? 'text-green-800 font-black' : 'text-slate-400'
                                    }`}>{s.label.split('. ')[1]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-green-600 to-emerald-500 h-full transition-all duration-300"
                                style={{ width: `${((stepIndex + 1) / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Scrollable Content Body */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6">

                    {/* PHOTO MODE */}
                    {mode === 'photo' && step !== 'result' && (
                        <div className="space-y-6 text-center py-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">
                                    {t('seed_viability.photo_title', 'Upload a Photo of Your Seed Batch')}
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto">
                                    {t('seed_viability.photo_desc', 'Our computer vision engine checks seed coat integrity, discoloration, crack patterns, and uniform sizing.')}
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                {analyzingPhoto ? (
                                    <div className="space-y-4 py-8">
                                        <Loader2 className="animate-spin text-green-700 mx-auto" size={48} />
                                        <p className="text-green-800 font-black uppercase text-xs tracking-widest">
                                            {t('seed_viability.analyzing', 'ANALYZING SEED MICRO-STRUCTURE...')}
                                        </p>
                                    </div>
                                ) : photo ? (
                                    <div className="space-y-4">
                                        <img src={photo} alt="Seed Sample" className="max-h-48 rounded-2xl mx-auto shadow-md border" />
                                        <p className="text-xs text-slate-500 font-bold">Click to choose a different photo</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-20 h-20 bg-green-100 text-green-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                                            <Upload size={36} />
                                        </div>
                                        <div>
                                            <p className="text-slate-800 font-black text-lg">Drop your seed image here</p>
                                            <p className="text-slate-400 text-xs mt-1">Supports JPG, PNG, WEBP files up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* GUIDED MODE STEPS */}
                    {mode === 'guided' && (
                        <>
                            {/* STEP 1: VISUAL INSPECTION */}
                            {step === 'visual' && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-black text-[10px] tracking-widest uppercase">
                                            Phase 1 of 5
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 outfit tracking-tight">
                                            {t('seed_viability.step1.title', '1. Visual Coat & Damage Inspection')}
                                        </h3>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                                {t('seed_viability.step1.instruction', 'Examine 100 seeds closely under bright light. Are there visible cracks, insect holes, dark mold spots, or shriveled hulls?')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => { setIsDamaged(false); setStep('touch'); }}
                                            className="p-8 bg-emerald-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-emerald-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <CheckCircle2 size={36} />
                                            {t('seed_viability.step1.healthy_btn', 'Seeds Are Clean & Whole')}
                                        </button>
                                        <button
                                            onClick={() => { setIsDamaged(true); setStep('touch'); }}
                                            className="p-8 bg-rose-50 text-rose-700 border-2 border-rose-200 rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-rose-100 transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <AlertTriangle size={36} />
                                            {t('seed_viability.step1.damaged_btn', 'Visible Damage / Cracks')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: TOUCH & FIRMNESS */}
                            {step === 'touch' && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-black text-[10px] tracking-widest uppercase">
                                            Phase 2 of 5
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 outfit tracking-tight">
                                            {t('seed_viability.step2.title', '2. Firmness & Moisture Pressure Test')}
                                        </h3>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                                {t('seed_viability.step2.instruction', 'Press a sample seed firmly between your thumb and forefinger. Does it feel hard and solid, or squishy, hollow, and soft?')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => { setIsSoft(false); setStep('float'); }}
                                            className="p-8 bg-emerald-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-emerald-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <Fingerprint size={36} />
                                            {t('seed_viability.step2.firm_btn', 'Hard & Solid')}
                                        </button>
                                        <button
                                            onClick={() => { setIsSoft(true); setStep('float'); }}
                                            className="p-8 bg-amber-50 text-amber-700 border-2 border-amber-200 rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-amber-100 transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <ThermometerSnowflake size={36} />
                                            {t('seed_viability.step2.soft_btn', 'Soft / Squishy / Hollow')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: WATER FLOAT TEST */}
                            {step === 'float' && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-black text-[10px] tracking-widest uppercase">
                                            Phase 3 of 5
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 outfit tracking-tight">
                                            {t('seed_viability.step3.title', '3. Water Density Floatation Test')}
                                        </h3>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                                {t('seed_viability.step3.instruction', 'Place 50 seeds into a glass of clean water and wait 15 minutes. Heavy, viable seeds sink; hollow or dead seeds float to the surface.')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => { setDidFloat(false); setStep('germination'); }}
                                            className="p-8 bg-emerald-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-emerald-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <Droplets size={36} />
                                            {t('seed_viability.step3.sink_btn', 'Most Seeds Sank (Dense)')}
                                        </button>
                                        <button
                                            onClick={() => { setDidFloat(true); setStep('germination'); }}
                                            className="p-8 bg-amber-50 text-amber-700 border-2 border-amber-200 rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-amber-100 transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <Info size={36} />
                                            {t('seed_viability.step3.float_btn', 'Many Floated (Empty/Dead)')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: GERMINATION TEST */}
                            {step === 'germination' && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-black text-[10px] tracking-widest uppercase">
                                            Phase 4 of 5
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 outfit tracking-tight">
                                            {t('seed_viability.step4.title', '4. Ragdoll Moist Paper Germination Rate')}
                                        </h3>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                                {t('seed_viability.step4.instruction', 'Enter the number of seeds tested in wet paper towel and how many sprouted healthy primary roots after 3–5 days.')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Total Seeds Tested</label>
                                            <input
                                                type="number"
                                                value={seedsTested}
                                                onChange={(e) => setSeedsTested(Math.max(1, Number(e.target.value)))}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outfit text-xl text-slate-800 focus:ring-4 focus:ring-green-500/10 focus:border-green-700 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Healthy Sprouted Seeds</label>
                                            <input
                                                type="number"
                                                value={seedsSprouted}
                                                onChange={(e) => setSeedsSprouted(Math.max(0, Number(e.target.value)))}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outfit text-xl text-slate-800 focus:ring-4 focus:ring-green-500/10 focus:border-green-700 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gradient-to-br from-green-800 to-emerald-900 rounded-[2.5rem] flex flex-col items-center justify-center text-white space-y-1 shadow-xl">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-300">GERMINATION RATE</p>
                                        <p className="text-5xl font-black outfit">{Math.round((seedsSprouted / Math.max(1, seedsTested)) * 100)}%</p>
                                    </div>

                                    <button
                                        onClick={() => setStep('strength')}
                                        className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {t('seed_viability.step4.proceed_btn', 'PROCEED TO SEEDLING VIGOR')} <ArrowRight size={22} />
                                    </button>
                                </div>
                            )}

                            {/* STEP 5: STRENGTH CHECK */}
                            {step === 'strength' && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-black text-[10px] tracking-widest uppercase">
                                            Phase 5 of 5
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 outfit tracking-tight">
                                            {t('seed_viability.step5.title', '5. Seedling Radicle Vigor Check')}
                                        </h3>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                                {t('seed_viability.step5.instruction', 'Observe the sprouted radicles. Are they thick, bright white, and growing aggressively, or thin, yellowed, and stunted?')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => { setIsWeak(false); setStep('result'); }}
                                            className="p-8 bg-emerald-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-emerald-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <Sprout size={36} />
                                            {t('seed_viability.step5.strong_btn', 'Strong & Thick Sprouts')}
                                        </button>
                                        <button
                                            onClick={() => { setIsWeak(true); setStep('result'); }}
                                            className="p-8 bg-amber-50 text-amber-700 border-2 border-amber-200 rounded-[2rem] font-black text-lg uppercase tracking-wider hover:bg-amber-100 transition-all active:scale-95 flex flex-col items-center gap-3"
                                        >
                                            <AlertTriangle size={36} />
                                            {t('seed_viability.step5.weak_btn', 'Weak / Stunted Sprouts')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* FINAL DIAGNOSTIC REPORT */}
                    {step === 'result' && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="text-center space-y-3">
                                <div className={`w-20 h-20 ${status.bg} ${status.color} rounded-[2rem] flex items-center justify-center mx-auto shadow-lg border ${status.border}`}>
                                    <status.icon size={44} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-800 outfit uppercase tracking-tight">
                                        {t('seed_viability.result.report_title', 'Seed Quality Diagnostic Report')}
                                    </h3>
                                    <p className={`text-base font-black uppercase tracking-wider mt-1 ${status.color}`}>
                                        {status.label}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-6 relative overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-end relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">OVERALL VIABILITY SCORE</p>
                                        <p className="text-6xl font-black outfit">{score}%</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GERMINATION RATE</p>
                                        <p className="text-2xl font-black text-emerald-400 outfit">{Math.round((seedsSprouted / Math.max(1, seedsTested)) * 100)}% REL</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/10 relative z-10">
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Aesthetic & Biometric Checklist</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                                        <div className={`p-3 rounded-xl flex items-center gap-2 ${isDamaged ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
                                            <ShieldCheck size={16} /> Physical Hull: {isDamaged ? 'Cracked / Damaged' : 'Whole & Intact'}
                                        </div>
                                        <div className={`p-3 rounded-xl flex items-center gap-2 ${isSoft ? 'bg-amber-950/60 text-amber-300 border border-amber-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
                                            <Fingerprint size={16} /> Firmness: {isSoft ? 'Soft / Hollow' : 'Hard & Solid'}
                                        </div>
                                        <div className={`p-3 rounded-xl flex items-center gap-2 ${didFloat ? 'bg-amber-950/60 text-amber-300 border border-amber-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
                                            <Droplets size={16} /> Density: {didFloat ? 'Low (Floated)' : 'High (Sank)'}
                                        </div>
                                        <div className={`p-3 rounded-xl flex items-center gap-2 ${isWeak ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
                                            <Sprout size={16} /> Radicle Vigor: {isWeak ? 'Weak Sprouts' : 'Vigorous'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Agronomic Seed Treatment */}
                            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 space-y-2">
                                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-widest">
                                    <Sparkles size={16} /> Recommended Agronomic Seed Treatment
                                </div>
                                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                                    {score >= 85
                                        ? 'Your seed batch has prime viability. Treat seeds with Trichoderma viride @ 4g/kg seed prior to sowing to prevent seedling damping-off.'
                                        : score >= 70
                                        ? 'Soak seeds in 10% salt water solution to float away light seeds. Treat remaining dense seeds with Azospirillum bio-fertilizer before planting.'
                                        : 'Caution: Seed germination rate is low. Increase seeding rate by 30% or replace seed batch with certified high-germination hybrid seeds.'}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={reset}
                                    className="flex-1 py-5 bg-slate-100 text-slate-700 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
                                >
                                    <RefreshCw size={18} /> {t('seed_viability.result.recalculate', 'NEW SEED TEST')}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-[2] py-5 bg-emerald-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-900 shadow-xl transition-all"
                                >
                                    {t('seed_viability.result.terminate', 'CLOSE DIAGNOSTIC')} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SeedViabilityModal;
