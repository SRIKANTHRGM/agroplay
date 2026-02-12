import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Droplets,
    Maximize,
    Sprout,
    CheckCircle2,
    Info,
    ClipboardList,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { CULTIVATION_LIBRARY, Crop } from '../types';

const CropGrowthGuide: React.FC = () => {
    const { t } = useTranslation();
    const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
    const selectedCrop = selectedCropId ? CULTIVATION_LIBRARY.find(c => c.id === selectedCropId) : null;

    const getWaterIcon = (level: string) => {
        switch (level) {
            case 'High': return <Droplets className="text-blue-500" />;
            case 'Medium': return <Droplets className="text-blue-400 opacity-70" />;
            case 'Low': return <Droplets className="text-blue-300 opacity-50" />;
            default: return <Droplets className="text-blue-400" />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-full flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sprout className="w-6 h-6" />
                    {t('virtual_farm.guide.title')}
                </h2>
                <p className="text-emerald-50 opacity-90 text-sm mt-1">
                    {t('virtual_farm.guide.subtitle')}
                </p>
            </div>

            {/* Crop Selector */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {CULTIVATION_LIBRARY.map((crop) => (
                        <button
                            key={crop.id}
                            onClick={() => setSelectedCropId(prev => prev === crop.id ? null : crop.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCropId === crop.id
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
                                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
                                }`}
                        >
                            {t(`crops.${crop.id}.title`, { defaultValue: crop.name })}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content - Only shown if a crop is selected */}
            {selectedCrop && (
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                        <span className="text-xl">{t(`crops.${selectedCrop.id}.title`, { defaultValue: selectedCrop.name })}</span>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                    {t('virtual_farm.guide.water_needed')}
                                </p>
                                <p className="text-lg font-bold text-slate-800">
                                    {selectedCrop.waterRequirement}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {t(`crops.${selectedCrop.id}.waterInstruction`, { defaultValue: selectedCrop.waterInstruction })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Maximize className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                                    {t('virtual_farm.guide.plant_spacing')}
                                </p>
                                <p className="text-base font-bold text-slate-800 leading-tight">
                                    {t(`crops.${selectedCrop.id}.spacing`, { defaultValue: selectedCrop.spacing })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Farming Steps */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-emerald-500" />
                            {t('virtual_farm.guide.steps')}
                        </h3>
                        <div className="space-y-3">
                            {selectedCrop.workflow?.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="group relative flex gap-4 pl-4"
                                >
                                    {/* Timeline Line */}
                                    {index !== (selectedCrop.workflow?.length || 0) - 1 && (
                                        <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-slate-100 group-hover:bg-emerald-100 transition-colors" />
                                    )}

                                    {/* Step Number */}
                                    <div className="z-10 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 border-2 border-white text-[10px] font-bold text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-100 transition-all duration-300">
                                        {index + 1}
                                    </div>

                                    <div className="pb-4">
                                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                            {t(`crops.${selectedCrop.id}.steps.${step.id}.title`, { defaultValue: step.title })}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {t(`crops.${selectedCrop.id}.steps.${step.id}.description`, { defaultValue: step.description }).split('.')[0]}.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expert Care Tips */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
                            <Info className="w-32 h-32" />
                        </div>

                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 relative z-10">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            {t('virtual_farm.guide.care_tips')}
                        </h3>

                        <ul className="space-y-3 relative z-10">
                            {(t(`crops.${selectedCrop.id}.careTips`, {
                                returnObjects: true,
                                defaultValue: selectedCrop.careTips
                            }) as string[]).map((tip, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                    <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {!selectedCrop && (
                <div className="p-10 flex flex-col items-center justify-center text-center opacity-50 space-y-4 h-64">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                        <Sprout className="w-8 h-8 text-emerald-300" />
                    </div>
                    <p className="text-slate-400 font-medium text-sm max-w-xs">{t('virtual_farm.guide.select_crop')}</p>
                </div>
            )}
        </div>
    );
};

export default CropGrowthGuide;
