import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Droplets, 
  Leaf, 
  Recycle, 
  Search, 
  Sprout, 
  Wind, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  Trophy, 
  Clock, 
  GraduationCap, 
  Plus, 
  X, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Sun,
  HelpCircle
} from 'lucide-react';
import { Practice } from '../types';

export const PRACTICES: Practice[] = [
  {
    slug: 'soil-health',
    title: 'Soil Health & Living Organic Fertility',
    category: 'Regenerative',
    icon: 'Leaf',
    description: 'Build living, carbon-rich soil structure using compost, bio-char, and minimal tillage.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600',
    readTime: '5 min read',
    difficulty: 'Beginner',
    content: `
# Soil Health & Living Organic Fertility

Healthy soil is the fundamental foundation of sustainable, high-yield agriculture. Soil is not inanimate dirt; it is a vibrant subterranean ecosystem teeming with billions of beneficial mycorrhizal fungi, nitrogen-fixing bacteria, and earthworms.

## Core Soil Health Principles
1. **Minimize Soil Disturbance:** Deep tilling shatters delicate fungal networks and exposes organic carbon to oxidative atmospheric loss.
2. **Permanent Organic Cover:** Keep soil covered year-round using crop residues, dry leaf mulch, or living cover crops to protect against moisture loss and solar heating.
3. **Diverse Root Systems:** Rotate deep-root tap legumes with shallow-root cereals to continuously cycle nutrients from subsoil depths.

## On-Farm Soil Amendments
- **Vermicompost:** Rich earthworm castings packed with plant-available humic acids and plant growth hormones.
- **Biochar Soil Addition:** Pyrolyzed agricultural biomass that creates permanent porous habitats for soil microbes.
- **Green Manuring:** Sowing Dhaincha (Sesbania) or Sunn Hemp at 25 kg/ha and plowing into soil at 45 days adds up to 80 kg N/ha naturally.
    `
  },
  {
    slug: 'water-management',
    title: 'Precision Micro-Drip & Water Harvesting',
    category: 'Conservation',
    icon: 'Droplets',
    description: 'Master 80% water savings using pressure-compensating drip lines and rainwater farm ponds.',
    image: 'https://images.unsplash.com/photo-1563514220741-03080103b7a3?auto=format&fit=crop&q=80&w=600',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    content: `
# Precision Micro-Drip & Water Harvesting

Water scarcity poses one of the greatest challenges to modern farming. Precision irrigation delivers water and nutrients directly to crop root zones without wasting drop through runoff or surface evaporation.

## Smart Water Management System
1. **Pressure-Compensating Drip Tubing:** Ensures uniform water emission (2 to 4 LPH) across long row runs even on sloped fields.
2. **Sub-Surface Drip Irrigation (SDI):** Burying drip lines 15-20cm below soil surface eliminates weed seed germination on the dry topsoil layer.
3. **Plastic Film Mulching:** Laying 25-micron silver-black plastic mulch cuts evaporation loss by up to 75% and suppresses weed competition.

## Rainwater Harvesting Ponds
- Excavate lined farm ponds sized to capture peak monsoon runoff (e.g., 30m x 30m x 3m).
- Install 500-micron HDPE pond liners to prevent seepage loss.
- Integrates with solar pump systems for zero-cost supplemental irrigation during dry dry spells.
    `
  },
  {
    slug: 'organic-pest-control',
    title: 'Integrated Organic Pest Management (IPM)',
    category: 'Protection',
    icon: 'Wind',
    description: 'Eliminate harmful crop pests using botanical neem sprays, pheromone traps, and bio-agents.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987cb9723?auto=format&fit=crop&q=80&w=600',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    content: `
# Integrated Organic Pest Management (IPM)

Chemical pesticides often create resistant pest resurgence while destroying beneficial predators like ladybugs and lacewings. IPM relies on ecological balance and natural bio-formulations.

## Key IPM Components
1. **Pheromone Traps:** Install 5 traps per acre to monitor and mass-catch adult male moths before bollworms and caterpillars lay eggs.
2. **Yellow & Blue Sticky Cards:** Hang 20 sticky traps per acre at canopy height to capture sucking insects like whiteflies, thrips, and aphids.
3. **Botanical Bio-Sprays:** Neem oil (1500 PPM) @ 5ml/L disrupts insect moulting cycles and acts as a strong feeding deterrent.

## Homemade Agniastra & Brahmastra Formulations
- **Agniastra:** Boil 10kg neem leaves + 500g green chili + 500g garlic + 250g crushed tobacco in 20L cow urine. Dilute 2L per 100L water to treat severe caterpillar infestations.
    `
  },
  {
    slug: 'crop-rotation',
    title: 'Synergistic Crop Rotation & Intercropping',
    category: 'Regenerative',
    icon: 'Recycle',
    description: 'Break pest cycles and double land productivity with companion intercropping patterns.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    readTime: '4 min read',
    difficulty: 'Beginner',
    content: `
# Synergistic Crop Rotation & Intercropping

Planting the same crop continuously depletes specific soil nutrients and allows host-specific soil pathogens to multiply exponentially. Strategic rotation restores ecological balance.

## High-Yield Intercropping Combinations
1. **Sugarcane + Potato / Onion:** Sowing winter vegetables between wide sugarcane rows (150cm spacing) generates early cash flow before cane canopy closes.
2. **Cotton + Red Gram (Pigeonpea):** 4:1 intercropping ratio provides biological trap crop buffering against cotton pink bollworms.
3. **Maize + Cowpea / Soybean:** Cereal stalk provides vertical support while legume roots fix atmospheric nitrogen directly into cereal root zone.
    `
  },
  {
    slug: 'vermicompost-prep',
    title: 'On-Farm Vermicompost & Panchagavya',
    category: 'Bio-Inputs',
    icon: 'Sprout',
    description: 'Prepare liquid bio-stimulants and rich vermicompost using farm livestock bi-products.',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600',
    readTime: '5 min read',
    difficulty: 'Beginner',
    content: `
# On-Farm Vermicompost & Panchagavya

Self-producing bio-inputs drastically lowers fertilizer expenditure while enriching farm soil with active beneficial microbes.

## Vermicompost Production Steps
1. **Bed Preparation:** Construct raised brick beds (10ft x 3ft x 2ft) under shaded trees.
2. **Layering:** Fill bottom 6 inches with coconut coir / dry leaves, followed by partially decomposed cow dung and crop residue.
3. **Earthworm Release:** Introduce *Eisenia fetida* earthworms @ 1,000 worms per cubic meter. Keep moist at 30% moisture.
4. **Harvesting:** Granular black compost is ready in 45-60 days.

## Panchagavya Bio-Stimulant Recipe
- Mix 5kg fresh cow dung + 500g ghee. Store for 3 days.
- Add 3L cow urine + 2L cow milk + 2L curd + 3L tender coconut water + 3kg jaggery + 12 ripe bananas.
- Ferment for 15 days, stirring twice daily. Spray at 3% concentration (30ml/L) to trigger massive flowering and fruit set.
    `
  },
  {
    slug: 'polyhouse-farming',
    title: 'Protected Polyhouse & High-Density Farming',
    category: 'Machinery & Tech',
    icon: 'Sun',
    description: 'Cultivate high-value exotic vegetables year-round inside climate-controlled greenhouses.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    readTime: '8 min read',
    difficulty: 'Advanced',
    content: `
# Protected Polyhouse & High-Density Farming

Polyhouse cultivation shields crops from torrential rains, scorching summer temperatures, and insect pest invasions, delivering up to 4x higher yields per square meter.

## Key Structure Features
1. **UV-Stabilized Polyethylene Film:** 200-micron clear poly sheet with anti-fog and anti-dust coatings.
2. **Insect Proof Shade Nets:** 40-mesh side ventilation nets prevent entry of thrips, aphids, and leaf miners.
3. **Trellising Support Wire System:** Vertical GI wires support indeterminate tomato, Dutch cucumber, and color capsicum vines up to 12 feet high.
    `
  },
  {
    slug: 'post-harvest-storage',
    title: 'Hermetic Post-Harvest Storage & Drying',
    category: 'Post-Harvest',
    icon: 'ShieldCheck',
    description: 'Prevent grain moisture spoilage and insect damage without chemical fumigation.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
    readTime: '5 min read',
    difficulty: 'Intermediate',
    content: `
# Hermetic Post-Harvest Storage & Drying

Up to 20% of harvested grains are lost post-harvest due to improper drying and insect infestation in conventional jute bags. Hermetic technology eliminates storage losses completely.

## Safe Moisture Thresholds
- **Wheat & Paddy:** Sun-dry grains until moisture content drops to 12-13%.
- **Oilseeds (Soybean/Mustard):** Dry to 8-9% moisture before bagging.

## Hermetic Storage Bag Bags
- Multi-layer oxygen-barrier inner liner cuts off oxygen inside the bag.
- Any trapped insects exhaust oxygen within 48 hours and suffocate naturally without needing chemical aluminum phosphide tablets.
    `
  },
  {
    slug: 'solar-machinery',
    title: 'Solar Pumping & Mini Power Tillers',
    category: 'Machinery & Tech',
    icon: 'Zap',
    description: 'Transition from expensive diesel engines to clean solar power and ergonomic power weeders.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    content: `
# Solar Pumping & Mini Power Tillers

Mechanizing labor-intensive farming tasks reduces cultivation costs by over 40% while accelerating field preparation turnarounds.

## Solar Submersible Pumps (PM-KUSUM)
- 3 HP to 7.5 HP MPPT solar pumps operate directly off solar PV arrays without battery banks.
- Government subsidies under PM-KUSUM cover up to 60-80% of installation cost.

## Ergonomic Petrol Power Tillers
- Compact 7 HP power weeders maneuver easily between narrow vegetable rows for inter-cultivation weeding and soil earthing up.
    `
  }
];

const Practices: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>(['soil-health']);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>(['water-management']);
  const [isSpeakingSlug, setIsSpeakingSlug] = useState<string | null>(null);

  // Personalized AI Learning Assistant Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [customGeneratedGuide, setCustomGeneratedGuide] = useState<{
    title: string;
    category: string;
    summary: string;
    steps: string[];
    proTip: string;
  } | null>(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  const categories = ['All', 'Regenerative', 'Conservation', 'Protection', 'Bio-Inputs', 'Machinery & Tech', 'Post-Harvest'];

  const filteredPractices = PRACTICES.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedSlugs(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleComplete = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompletedSlugs(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleListenAudio = (practice: Practice, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeakingSlug === practice.slug) {
        setIsSpeakingSlug(null);
        return;
      }
      const textToSpeak = `${practice.title}. Category: ${practice.category}. ${practice.description}. Key guidance: ${practice.content.substring(0, 350)}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingSlug(null);
      setIsSpeakingSlug(practice.slug);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateCustomGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopicInput.trim()) return;

    setIsGeneratingGuide(true);
    setTimeout(() => {
      setCustomGeneratedGuide({
        title: `Personalized Guide: ${aiTopicInput}`,
        category: 'Custom AI Curriculum',
        summary: `Tailored agricultural instructions generated specifically for your farm query: "${aiTopicInput}".`,
        steps: [
          `Step 1: Inspect field soil moisture and test pH level (ideal 6.5 - 7.5).`,
          `Step 2: Prepare organic bio-inputs (Neem cake + Vermicompost slurry @ 200kg/acre).`,
          `Step 3: Implement precision spacing and line sowing for optimal sunlight aeration.`,
          `Step 4: Scout twice weekly using yellow sticky cards for early pest identification.`
        ],
        proTip: `Pro Tip: Apply Panchagavya 3% foliar spray during early morning hours to boost microbial node development.`
      });
      setIsGeneratingGuide(false);
    }, 1500);
  };

  const progressPercentage = Math.round((completedSlugs.length / PRACTICES.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-green-950 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-3 max-w-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest border border-emerald-400/30">
              PERSONALIZED LEARNING PLATFORM
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest border border-amber-400/30">
              AUDIO & LESSON XP
            </span>
          </div>
          <h2 className="text-4xl font-black outfit tracking-tight">Agricultural Practice Library</h2>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Comprehensive step-by-step guides, bio-input recipes, water conservation techniques, and interactive AI learning assistant tailored for your farm.
          </p>
        </div>

        {/* Personalized Learning Stats */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex items-center gap-5 z-10 shrink-0">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap size={30} />
          </div>
          <div>
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Learning Track</span>
            <div className="text-2xl font-black text-white outfit">{completedSlugs.length} / {PRACTICES.length} <span className="text-xs font-normal text-slate-300">Done ({progressPercentage}%)</span></div>
            <div className="w-36 bg-white/20 h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Custom Learning Assistant Button Banner */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-violet-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-500/30 rounded-2xl flex items-center justify-center border border-violet-400/30 shrink-0">
            <Sparkles size={24} className="text-violet-300" />
          </div>
          <div>
            <h3 className="font-black text-lg outfit">Need a Specific Farming Guide or Solution?</h3>
            <p className="text-xs text-violet-200">Ask our AI Learning Platform to generate a custom step-by-step guide for any crop or problem.</p>
          </div>
        </div>
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="bg-white text-violet-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider hover:bg-violet-100 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-black/20 flex items-center gap-2 shrink-0"
        >
          <Sparkles size={16} className="text-violet-600" />
          <span>Generate AI Learning Guide</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search practices (e.g., Soil, Water, Pest, Vermicompost)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Practices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPractices.map((practice) => {
          const isBookmarked = bookmarkedSlugs.includes(practice.slug);
          const isCompleted = completedSlugs.includes(practice.slug);
          const isSpeaking = isSpeakingSlug === practice.slug;

          return (
            <div 
              key={practice.slug}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                {/* Image Header with Badge */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={practice.image} 
                    alt={practice.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-emerald-600/90 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest backdrop-blur-md shadow-md">
                      {practice.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={(e) => handleListenAudio(practice, e)}
                      title="Listen Audio Guide"
                      className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-white/80 text-slate-800 hover:bg-white'
                      }`}
                    >
                      <Volume2 size={16} />
                    </button>

                    <button
                      onClick={(e) => toggleBookmark(practice.slug, e)}
                      title="Bookmark Practice"
                      className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/80 text-slate-800 hover:bg-white'
                      }`}
                    >
                      <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {practice.readTime || '5 min read'}</span>
                    {practice.difficulty && (
                      <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">{practice.difficulty}</span>
                    )}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-slate-900 outfit leading-snug group-hover:text-emerald-700 transition-colors">
                    {practice.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {practice.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <button
                  onClick={(e) => toggleComplete(practice.slug, e)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isCompleted ? 'text-emerald-600 font-black' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <CheckCircle2 size={16} className={isCompleted ? 'text-emerald-600' : 'text-slate-300'} />
                  <span>{isCompleted ? 'Completed (+50 XP)' : 'Mark Completed'}</span>
                </button>

                <Link
                  to={`/practices/${practice.slug}`}
                  className="bg-slate-900 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: AI Personalized Guide Generator */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsAiModalOpen(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b pb-4">
              <div className="w-12 h-12 bg-violet-100 text-violet-700 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-black text-2xl text-slate-900 outfit">Personalized AI Guide Generator</h3>
                <p className="text-xs text-slate-500">Get custom step-by-step agricultural instructions for any specific crop or farm query</p>
              </div>
            </div>

            <form onSubmit={handleGenerateCustomGuide} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">What do you want to learn today?</label>
                <input 
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder="e.g. How to prepare Panchagavya, dragon fruit drip spacing, or whitefly control in chili"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingGuide}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-violet-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingGuide ? (
                  <>
                    <Sparkles size={18} className="animate-spin" />
                    <span>Synthesizing Custom Guide...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Generate Step-by-Step Curriculum</span>
                  </>
                )}
              </button>
            </form>

            {customGeneratedGuide && (
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-3xl border border-violet-200 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-violet-200 pb-3">
                  <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">{customGeneratedGuide.category}</span>
                  <h4 className="text-lg font-black text-slate-900 outfit">{customGeneratedGuide.title}</h4>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">{customGeneratedGuide.summary}</p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Action Steps:</span>
                  <ul className="space-y-1.5">
                    {customGeneratedGuide.steps.map((step, idx) => (
                      <li key={idx} className="text-xs text-slate-700 font-semibold bg-white p-3 rounded-2xl border border-violet-100 flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-violet-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-100/70 border border-amber-300 p-3.5 rounded-2xl text-xs text-amber-900 font-bold flex items-center gap-2">
                  <Zap size={16} className="text-amber-600 shrink-0" />
                  <span>{customGeneratedGuide.proTip}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Practices;
