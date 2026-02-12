import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, CheckCircle2, AlertCircle, Droplets,
    FlaskConical, ChevronRight, AlertTriangle,
    Fingerprint, ThermometerSnowflake, Sprout,
    ArrowRight, RefreshCw, Info, Zap
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'visual' | 'touch' | 'float' | 'germination' | 'strength' | 'result';

const SeedViabilityModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>('visual');

    // Test Answers
    const [isDamaged, setIsDamaged] = useState<boolean | null>(null);
    const [isSoft, setIsSoft] = useState<boolean | null>(null);
    const [didFloat, setDidFloat] = useState<boolean | null>(null);
    const [seedsTested, setSeedsTested] = useState<number>(100);
    const [seedsSprouted, setSeedsSprouted] = useState<number>(0);
    const [isWeak, setIsWeak] = useState<boolean | null>(null);

    const calculateScore = () => {
        let score = 0;

        // Germination accounts for 70% of the score
        const germinationRate = seedsTested > 0 ? (seedsSprouted / seedsTested) * 100 : 0;
        score += (germinationRate * 0.7);

        // Other factors account for 30%
        if (isDamaged === false) score += 10;
        if (isSoft === false) score += 10;
        if (didFloat === false) score += 10;

        // Penalty for weak sprouts
        if (isWeak === true) score -= 15;

        return Math.max(0, Math.min(100, Math.round(score)));
    };

    const getViabilityStatus = (score: number) => {
        if (score >= 85) return { label: t('seed_viability.result.excellent'), color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: CheckCircle2 };
        if (score >= 70) return { label: t('seed_viability.result.acceptable'), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertCircle };
        return { label: t('seed_viability.result.poor'), color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: AlertTriangle };
    };

    const reset = () => {
        setStep('visual');
        setIsDamaged(null);
        setIsSoft(null);
        setDidFloat(null);
        setSeedsTested(100);
        setSeedsSprouted(0);
        setIsWeak(null);
    };

    if (!isOpen) return null;

    const score = calculateScore();
    const status = getViabilityStatus(score);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-500">
                <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

                {/* Header - Modern HUD Style */}
                <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center relative z-10 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-green-900 text-white rounded-2xl flex items-center justify-center shadow-lg animate-float">
                            <FlaskConical size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 outfit uppercase italic tracking-tighter">{t('seed_viability.modal_title')}</h2>
                            <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.4em]">
                                {step === 'result' ? t('seed_viability.diagnostic_finalized') : t('seed_viability.phase', { step: step.toUpperCase() })}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 relative z-10">

                    {/* STEP 1: VISUAL INSPECTION */}
                    {step === 'visual' && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 outfit italic uppercase tracking-tight">{t('seed_viability.step1.title')}</h3>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <p className="text-slate-600 font-medium leading-relaxed italic uppercase tracking-tight">
                                        "{t('seed_viability.step1.instruction')}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={() => { setIsDamaged(false); setStep('touch'); }}
                                    className="flex-1 py-10 bg-green-900 text-white rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-green-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <CheckCircle2 size={32} />
                                    {t('seed_viability.step1.healthy_btn')}
                                </button>
                                <button
                                    onClick={() => { setIsDamaged(true); setStep('touch'); }}
                                    className="flex-1 py-10 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-rose-100 shadow-sm transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <AlertTriangle size={32} />
                                    {t('seed_viability.step1.damaged_btn')}
                                </button>
                            </div>

                            {isDamaged && (
                                <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4 animate-in zoom-in-95">
                                    <AlertCircle className="text-rose-500 shrink-0" size={24} />
                                    <p className="text-rose-700 font-black text-xs uppercase tracking-widest italic">{t('seed_viability.step1.warning')}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: TOUCH & FIRMNESS */}
                    {step === 'touch' && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 outfit italic uppercase tracking-tight">{t('seed_viability.step2.title')}</h3>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <p className="text-slate-600 font-medium leading-relaxed italic uppercase tracking-tight">
                                        "{t('seed_viability.step2.instruction')}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={() => { setIsSoft(false); setStep('float'); }}
                                    className="flex-1 py-10 bg-green-900 text-white rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-green-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <Fingerprint size={32} />
                                    {t('seed_viability.step2.firm_btn')}
                                </button>
                                <button
                                    onClick={() => { setIsSoft(true); setStep('float'); }}
                                    className="flex-1 py-10 bg-amber-50 text-amber-600 border-2 border-amber-100 rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-amber-100 shadow-sm transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <ThermometerSnowflake size={32} />
                                    {t('seed_viability.step2.soft_btn')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: WATER FLOAT TEST */}
                    {step === 'float' && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 outfit italic uppercase tracking-tight">{t('seed_viability.step3.title')}</h3>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <p className="text-slate-600 font-medium leading-relaxed italic uppercase tracking-tight">
                                        "{t('seed_viability.step3.instruction')}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={() => { setDidFloat(false); setStep('germination'); }}
                                    className="flex-1 py-10 bg-green-900 text-white rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-green-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <Droplets size={32} />
                                    {t('seed_viability.step3.sink_btn')}
                                </button>
                                <button
                                    onClick={() => { setDidFloat(true); setStep('germination'); }}
                                    className="flex-1 py-10 bg-amber-50 text-amber-600 border-2 border-amber-100 rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-amber-100 shadow-sm transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <Info size={32} />
                                    {t('seed_viability.step3.float_btn')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: GERMINATION TEST */}
                    {step === 'germination' && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 outfit italic uppercase tracking-tight">{t('seed_viability.step4.title')}</h3>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <p className="text-slate-600 font-medium leading-relaxed italic uppercase tracking-tight">
                                        "{t('seed_viability.step4.instruction')}"
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{t('seed_viability.step4.seeds_tested')}</label>
                                    <input
                                        type="number"
                                        value={seedsTested}
                                        onChange={(e) => setSeedsTested(Number(e.target.value))}
                                        className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-2xl font-black outfit text-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-800/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{t('seed_viability.step4.seeds_sprouted')}</label>
                                    <input
                                        type="number"
                                        value={seedsSprouted}
                                        onChange={(e) => setSeedsSprouted(Number(e.target.value))}
                                        className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-2xl font-black outfit text-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-800/30 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="p-8 bg-green-900 rounded-[2.5rem] flex flex-col items-center justify-center text-white space-y-2 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-10" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{t('seed_viability.step4.calculated_viability')}</p>
                                <p className="text-6xl font-black outfit italic">{Math.round((seedsSprouted / Math.max(1, seedsTested)) * 100)}%</p>
                            </div>

                            <button
                                onClick={() => setStep('strength')}
                                className="w-full py-8 bg-slate-900 text-white rounded-[2rem] font-black text-xl uppercase italic tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
                            >
                                {t('seed_viability.step4.proceed_btn')} <ArrowRight size={24} />
                            </button>
                        </div>
                    )}

                    {/* STEP 5: STRENGTH CHECK */}
                    {step === 'strength' && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 outfit italic uppercase tracking-tight">{t('seed_viability.step5.title')}</h3>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <p className="text-slate-600 font-medium leading-relaxed italic uppercase tracking-tight">
                                        "{t('seed_viability.step5.instruction')}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={() => { setIsWeak(false); setStep('result'); }}
                                    className="flex-1 py-10 bg-green-900 text-white rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-green-800 shadow-xl transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <Sprout size={32} />
                                    {t('seed_viability.step5.strong_btn')}
                                </button>
                                <button
                                    onClick={() => { setIsWeak(true); setStep('result'); }}
                                    className="flex-1 py-10 bg-amber-50 text-amber-600 border-2 border-amber-100 rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-amber-100 shadow-sm transition-all active:scale-95 flex flex-col items-center gap-3"
                                >
                                    <AlertTriangle size={32} />
                                    {t('seed_viability.step5.weak_btn')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: FINAL RESULT */}
                    {step === 'result' && (
                        <div className="space-y-10 animate-in zoom-in-95 duration-500">
                            <div className="text-center space-y-4">
                                <div className={`w-24 h-24 ${status.bg} ${status.color} rounded-[2rem] flex items-center justify-center mx-auto shadow-xl border ${status.border} animate-float`}>
                                    <status.icon size={48} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-5xl font-black text-slate-900 outfit uppercase italic tracking-tighter">{t('seed_viability.result.report_title')}</h3>
                                    <p className={`text-xl font-black uppercase tracking-[0.3em] ${status.color}`}>{t('seed_viability.result.viability_status', { status: status.label })}</p>
                                </div>
                            </div>

                            <div className="p-10 bg-slate-950 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                                <div className="flex justify-between items-end relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em]">{t('seed_viability.result.score_index')}</p>
                                        <p className="text-7xl font-black outfit italic">{score}%</p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('seed_viability.result.germination_matrix')}</p>
                                        <p className="text-2xl font-black text-slate-300 outfit italic">{Math.round((seedsSprouted / Math.max(1, seedsTested)) * 100)}% REL</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/10 relative z-10">
                                    {isDamaged && (
                                        <div className="flex items-center gap-3 text-rose-400 text-xs font-black uppercase tracking-widest italic">
                                            <AlertCircle size={14} /> {t('seed_viability.result.physical_damage')}
                                        </div>
                                    )}
                                    {didFloat && (
                                        <div className="flex items-center gap-3 text-amber-400 text-xs font-black uppercase tracking-widest italic">
                                            <Droplets size={14} /> {t('seed_viability.result.low_density')}
                                        </div>
                                    )}
                                    {isWeak && (
                                        <div className="flex items-center gap-3 text-rose-400 text-xs font-black uppercase tracking-widest italic">
                                            <Zap size={14} /> {t('seed_viability.result.low_vigor')}
                                        </div>
                                    )}
                                    {!isDamaged && !didFloat && !isWeak && score > 90 && (
                                        <div className="flex items-center gap-3 text-green-400 text-xs font-black uppercase tracking-widest italic">
                                            <CheckCircle2 size={14} /> {t('seed_viability.result.perfect_integrity')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={reset}
                                    className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-200 transition-all italic active:scale-95 border border-slate-200"
                                >
                                    <RefreshCw size={20} /> {t('seed_viability.result.recalculate')}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-[2] py-6 bg-green-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-green-800 shadow-xl transition-all italic active:scale-95"
                                >
                                    {t('seed_viability.result.terminate')} <ArrowRight size={20} />
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
