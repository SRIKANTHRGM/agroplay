import React, { useState, useEffect } from 'react';
import { UserProfile, CultivatedCropItem } from '../types';
import { INDIA_STATES_DATA, getDistrictData, getSubLocationsForDistrict } from '../data/indiaLocations';
import { fetchRealWeather, RealWeatherData } from '../services/weatherService';
import { 
  Sprout, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  ShieldAlert, 
  Camera, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ChevronRight, 
  Edit3, 
  BarChart3, 
  Activity, 
  X, 
  Upload, 
  Navigation,
  Volume2,
  TrendingUp,
  Search,
  CloudRain,
  Languages,
  Zap,
  ArrowRight,
  Calculator,
  IndianRupee,
  Phone,
  MessageSquare,
  Bell,
  Check,
  Smartphone,
  ShoppingBag,
  FlaskConical,
  Globe,
  Package,
  Filter,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const PRESET_FARM_PHOTOS = [
  { id: 'p1', title: 'Lush Green Rice Paddy', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { id: 'p2', title: 'High Density Mango Orchard', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80' },
  { id: 'p3', title: 'Modern Drip Tomato Farm', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=1200&q=80' },
  { id: 'p4', title: 'Golden Wheat Fields', url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80' },
  { id: 'p5', title: 'Sugarcane Plantation', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80' },
  { id: 'p6', title: 'Polyhouse Precision Farm', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80' }
];

const INITIAL_PERSONAL_CROPS: CultivatedCropItem[] = [
  {
    id: 'pc1',
    name: 'Hybrid Tomato',
    icon: '🍅',
    acreage: '2.5 Acres',
    sowingDate: '2026-08-01',
    stage: 'Flowering & Fruit Set',
    stageProgress: 65,
    healthScore: 94,
    expectedHarvest: '22 Days',
    diseaseRisk: 'Medium',
    notes: '25-micron silver-black plastic mulch installed with drip lines.'
  },
  {
    id: 'pc2',
    name: 'Wheat (Grade A)',
    icon: '🌾',
    acreage: '4.0 Acres',
    sowingDate: '2026-07-15',
    stage: 'Grain Filling (Dough Stage)',
    stageProgress: 85,
    healthScore: 98,
    expectedHarvest: '10 Days',
    diseaseRisk: 'Low',
    notes: 'Crown Root Initiation (CRI) and jointing stage waterings complete.'
  },
  {
    id: 'pc3',
    name: 'Basmati Rice',
    icon: '🍚',
    acreage: '3.0 Acres',
    sowingDate: '2026-07-01',
    stage: 'Panicle Initiation',
    stageProgress: 55,
    healthScore: 91,
    expectedHarvest: '35 Days',
    diseaseRisk: 'Low',
    notes: '3-5cm standing water layer maintained. Bio-Pseudomonas root dip done.'
  },
  {
    id: 'pc4',
    name: 'Cotton (Bt Hybrid)',
    icon: '☁️',
    acreage: '5.0 Acres',
    sowingDate: '2026-06-20',
    stage: 'Boll Bursting',
    stageProgress: 90,
    healthScore: 96,
    expectedHarvest: '5 Days',
    diseaseRisk: 'Low',
    notes: 'Pheromone traps deployed @ 5 traps/acre. Ready for 1st flush picking.'
  },
  {
    id: 'pc5',
    name: 'Chili Pepper (Guntur)',
    icon: '🌶️',
    acreage: '1.5 Acres',
    sowingDate: '2026-08-10',
    stage: 'Vegetative Branching',
    stageProgress: 40,
    healthScore: 88,
    expectedHarvest: '45 Days',
    diseaseRisk: 'Medium',
    notes: 'Yellow sticky traps installed to scout for thrips and mites.'
  },
  {
    id: 'pc6',
    name: 'Potato (Kufri Jyoti)',
    icon: '🥔',
    acreage: '2.0 Acres',
    sowingDate: '2026-08-18',
    stage: 'Tuber Bulking',
    stageProgress: 50,
    healthScore: 92,
    expectedHarvest: '30 Days',
    diseaseRisk: 'Low',
    notes: 'Earthing up completed at 30 days. Potassium fertigation active.'
  },
  {
    id: 'pc7',
    name: 'Red Onion (Nasik)',
    icon: '🧅',
    acreage: '1.8 Acres',
    sowingDate: '2026-07-25',
    stage: 'Bulb Formation',
    stageProgress: 60,
    healthScore: 90,
    expectedHarvest: '25 Days',
    diseaseRisk: 'Low',
    notes: 'Micro-sprinklers active. Sulfur micronutrient applied.'
  },
  {
    id: 'pc8',
    name: 'Organic Maize (Corn)',
    icon: '🌽',
    acreage: '3.5 Acres',
    sowingDate: '2026-07-10',
    stage: 'Silking & Cob Filling',
    stageProgress: 75,
    healthScore: 95,
    expectedHarvest: '18 Days',
    diseaseRisk: 'Low',
    notes: 'Metarhizium biopesticide applied for Fall Armyworm protection.'
  },
  {
    id: 'pc9',
    name: 'Sugarcane (High Yield)',
    icon: '🎋',
    acreage: '6.0 Acres',
    sowingDate: '2026-01-15',
    stage: 'Grand Growth Elongation',
    stageProgress: 80,
    healthScore: 97,
    expectedHarvest: '60 Days',
    diseaseRisk: 'Low',
    notes: 'Cane propping and tying complete to prevent monsoon lodging.'
  },
  {
    id: 'pc10',
    name: 'High Density Mango Orchard',
    icon: '🥭',
    acreage: '4.5 Acres',
    sowingDate: '2023-03-10',
    stage: 'Fruit Development',
    stageProgress: 70,
    healthScore: 99,
    expectedHarvest: '40 Days',
    diseaseRisk: 'Low',
    notes: 'High density orchard. Paclobutrazol fertigation complete.'
  }
];

const PEST_DOSAGE_DATABASE: Record<string, {
  productName: string;
  chemicalCategory: string;
  dosagePerAcreLitersOrKg: number;
  unit: string;
  dilutionWaterLitersPerAcre: number;
  dilutionRatio: string;
  schedule: string;
  safetyPPE: string[];
  description: string;
}> = {
  'Aphids, Thrips & Whiteflies (Sucking Pests)': {
    productName: 'Organic Neem Oil 1500 PPM + Imidacloprid 17.8% SL',
    chemicalCategory: 'Systemic Bio-Insecticide',
    dosagePerAcreLitersOrKg: 0.5,
    unit: 'Liters',
    dilutionWaterLitersPerAcre: 150,
    dilutionRatio: '3.3 ml per Liter of clean water',
    schedule: 'Spray early morning (6:00 AM - 8:30 AM) when temperature is low. Repeat spray after 7-10 days.',
    safetyPPE: ['N95 Mask', 'Nitrile Gloves', 'Eye Safety Goggles', 'Long Sleeve Suit'],
    description: 'Effectively controls sucking pests by disrupting insect nervous system and feeding action without harming beneficial pollinators.'
  },
  'Stem Borer & Leaf Folder (Caterpillars)': {
    productName: 'Chlorantraniliprole 18.5% SC (Coragen)',
    chemicalCategory: 'Ovicidal Caterpillar Guard',
    dosagePerAcreLitersOrKg: 0.06,
    unit: 'Liters',
    dilutionWaterLitersPerAcre: 200,
    dilutionRatio: '0.3 ml per Liter of water',
    schedule: 'Apply at early larva emergence or egg hatching phase. Provides 14-21 days long-lasting residual control.',
    safetyPPE: ['Respirator Mask', 'Chemical Gloves', 'Full Body Suit', 'Rubber Boots'],
    description: 'Targeted action against paddy stem borer, maize fall armyworm, and sugarcane top borer with high rainfastness.'
  },
  'Pink Bollworm & Pod Borer': {
    productName: 'Emamectin Benzoate 5% SG + Bacillus thuringiensis (Bt)',
    chemicalCategory: 'Bio-Chemical Larvicide',
    dosagePerAcreLitersOrKg: 0.22,
    unit: 'Grams',
    dilutionWaterLitersPerAcre: 200,
    dilutionRatio: '1.1 gram per Liter of water',
    schedule: 'Spray at square formation or pod filling stage. Use pheromone traps to time application.',
    safetyPPE: ['Dust Mask', 'Gloves', 'Safety Glasses', 'Coveralls'],
    description: 'Dual bio-action stomach poison against pink bollworm in cotton and pod borer in chickpeas and legumes.'
  },
  'Early & Late Blight (Fungal Infection)': {
    productName: 'Mancozeb 75% WP + Metalaxyl 8% WP',
    chemicalCategory: 'Contact & Systemic Fungicide',
    dosagePerAcreLitersOrKg: 0.6,
    unit: 'Grams',
    dilutionWaterLitersPerAcre: 200,
    dilutionRatio: '3.0 grams per Liter of water',
    schedule: 'Apply at first sign of brown leaf spots or cloudy humid weather. Repeat at 7-day intervals.',
    safetyPPE: ['N95 Respirator', 'Heavy Duty Gloves', 'Safety Goggles'],
    description: 'Protects potato, tomato, and chili foliage from fungal spore germination and blight lesion expansion.'
  },
  'Powdery Mildew & Leaf Rust': {
    productName: 'Hexaconazole 5% EC / Azoxystrobin 23% SC',
    chemicalCategory: 'Triazole Broad-Spectrum Fungicide',
    dosagePerAcreLitersOrKg: 0.2,
    unit: 'Liters',
    dilutionWaterLitersPerAcre: 200,
    dilutionRatio: '1.0 ml per Liter of water',
    schedule: 'Foliar spray during high humidity or morning dew build-up.',
    safetyPPE: ['Mask', 'Nitrile Gloves', 'Boots'],
    description: 'Eradicates powdery white mildew coating on leaves and prevents yellow rust in wheat and cereals.'
  },
  'Root Rot & Wilt (Soil Fungus)': {
    productName: 'Trichoderma Viride Bio-Fungicide (1x10^8 CFU/g)',
    chemicalCategory: 'Eco Bio-Control Agent',
    dosagePerAcreLitersOrKg: 1.0,
    unit: 'kg',
    dilutionWaterLitersPerAcre: 300,
    dilutionRatio: '3.3 grams per Liter of water / Soil drenching',
    schedule: 'Drench root zone thoroughly or apply through drip fertigation system in evening hours.',
    safetyPPE: ['Dust Mask', 'Cotton Gloves'],
    description: '100% organic bio-fungicide that colonizes root zone and consumes pathogenic Fusarium, Rhizoctonia, and Pythium.'
  },
  'NPK Nitrogen Deficiency (Yellow Leaves)': {
    productName: 'Water Soluble NPK 19:19:19 + Neem Coated Urea',
    chemicalCategory: 'Balanced Macro Nutrient',
    dosagePerAcreLitersOrKg: 1.5,
    unit: 'kg',
    dilutionWaterLitersPerAcre: 200,
    dilutionRatio: '7.5 grams per Liter of water',
    schedule: 'Foliar spray during vegetative tillering / branching stage to restore lush green chlorophyll.',
    safetyPPE: ['Light Gloves', 'Eye Protection'],
    description: 'Rapidly absorbs through foliage to correct yellowing leaves and boost vegetative biomass growth.'
  },
  'Micronutrient Zinc & Boron Booster': {
    productName: 'Chelated Zinc EDTA 12% + Solubor Boron 20%',
    chemicalCategory: 'Micronutrient Foliar Spray',
    dosagePerAcreLitersOrKg: 0.25,
    unit: 'Grams',
    dilutionWaterLitersPerAcre: 150,
    dilutionRatio: '1.6 grams per Liter of water',
    schedule: 'Spray before flowering and fruit set stage to prevent flower drop and fruit cracking.',
    safetyPPE: ['Mask', 'Gloves'],
    description: 'Essential micronutrients to maximize pollination efficiency, fruit size, and grain filling.'
  }
};

const GLOBAL_MARKET_TOOLS = [
  {
    id: 'gt1',
    name: 'Smart Micro-Drip Irrigation Kit (1-Acre Pack)',
    category: 'Irrigation',
    priceInr: 18500,
    priceUsd: 220,
    rating: 4.9,
    reviews: 142,
    supplier: 'Netafim Global Agritech (Israel / India)',
    badge: 'TOP SELLER',
    icon: '💧',
    image: '/market/drip_kit.jpg',
    specs: '16mm UV-resistant drip lateral, pressure compensating emitters (2 LPH), venturi fertilizer injector, disc filter.',
    recommendedCrops: 'Tomato, Cotton, Sugarcane, Chili, Vegetables',
    inStock: true
  },
  {
    id: 'gt2',
    name: 'Solar-Powered 365nm UV Pest & Insect Trap',
    category: 'Sprayers & Protection',
    priceInr: 4200,
    priceUsd: 50,
    rating: 4.8,
    reviews: 98,
    supplier: 'AgriTech Solar Systems (Germany / India)',
    badge: 'ECO CHOICE',
    icon: '☀️',
    image: '/market/solar_trap.jpg',
    specs: 'Automatic dusk-to-dawn sensor, high voltage electric grid + pheromone collector, 1-acre coverage radius, IP65 waterproof.',
    recommendedCrops: 'All crops (Paddy, Cotton, Maize, Vegetables)',
    inStock: true
  },
  {
    id: 'gt3',
    name: 'Dual-Motor Lithium Battery Knapsack Sprayer (16L)',
    category: 'Sprayers & Protection',
    priceInr: 3800,
    priceUsd: 45,
    rating: 4.7,
    reviews: 215,
    supplier: 'FarmPower Global Machinery',
    badge: 'POPULAR',
    icon: '🔋',
    image: '/market/sprayer.jpg',
    specs: '12V 12Ah long-life lithium battery, dual high-pressure pump (110 PSI), stainless steel telescopic lance, 4 brass nozzles.',
    recommendedCrops: 'Wheat, Paddy, Cotton, Soybean, Horticulture',
    inStock: true
  },
  {
    id: 'gt4',
    name: '7-in-1 Smart Soil NPK, pH & Moisture Sensor Probe',
    category: 'Sensors & Soil Tech',
    priceInr: 6500,
    priceUsd: 78,
    rating: 4.9,
    reviews: 76,
    supplier: 'PrecisionAg Sensors Inc. (USA)',
    badge: 'AI READY',
    icon: '🧪',
    image: '/market/npk_meter.svg',
    specs: 'Bluetooth 5.0 wireless sync to app, stainless 316 dual probe, measures NPK (mg/kg), EC conductivity, moisture %, pH 3-9.',
    recommendedCrops: 'Precision Farming, Greenhouses, Orchards, All crops',
    inStock: true
  },
  {
    id: 'gt5',
    name: 'Heavy-Duty 7HP Petrol Mini Power Tiller & Rotavator',
    category: 'Machinery & Power',
    priceInr: 42000,
    priceUsd: 500,
    rating: 4.8,
    reviews: 64,
    supplier: 'VST Shakti Machinery Ltd',
    badge: 'HEAVY DUTY',
    icon: '🚜',
    image: '/market/power_tiller.svg',
    specs: '212cc 4-stroke petrol engine, 3-speed transmission (2 FWD + 1 REV), 32 manganese rotavator blades, 90cm tilling width.',
    recommendedCrops: 'Sugarcane, Vegetables, Orchards, Inter-cultivation',
    inStock: true
  },
  {
    id: 'gt6',
    name: 'Solar Submersible Water Pump Set (3 HP MPPT)',
    category: 'Irrigation',
    priceInr: 125000,
    priceUsd: 1500,
    rating: 4.9,
    reviews: 110,
    supplier: 'Shakti Solar Pumps Global',
    badge: 'SUBSIDY ELIGIBLE',
    icon: '⚡',
    image: '/market/solar_pump.svg',
    specs: '3 HP DC brushless stainless pump, MPPT intelligent solar controller, 90m total dynamic head, zero fuel or grid electricity required.',
    recommendedCrops: 'Deep tubewell irrigation, Off-grid remote farms',
    inStock: true
  },
  {
    id: 'gt7',
    name: 'Precision Agricultural Drone Sprayer (10L Payload)',
    category: 'Machinery & Power',
    priceInr: 360000,
    priceUsd: 4300,
    rating: 5.0,
    reviews: 32,
    supplier: 'AeroFarm Drones Global',
    badge: 'NEXT-GEN TECH',
    icon: '🛸',
    image: '/market/drone.svg',
    specs: 'Obstacle avoidance millimeter-wave radar, RTK centimeter GPS positioning, 4 centrifugal atomizing nozzles, 15 min flight duration.',
    recommendedCrops: 'Large acreage Paddy, Wheat, Cotton, Sugarcane',
    inStock: true
  },
  {
    id: 'gt8',
    name: 'Handheld Digital Multi-Grain Moisture Meter',
    category: 'Post-Harvest Tools',
    priceInr: 5400,
    priceUsd: 65,
    rating: 4.7,
    reviews: 88,
    supplier: 'GrainMaster Precision Instruments',
    badge: 'POST-HARVEST',
    icon: '📊',
    image: '/market/combine_harvester.svg',
    specs: 'Calibrated for 24 grains & oilseeds (Wheat, Paddy, Corn, Soybean, Mustard), backlit LCD display, accuracy within ±0.5%.',
    recommendedCrops: 'Grain silos, Mandi trade, Storage warehouses',
    inStock: true
  }
];

type FeatureTab = 'hub' | 'crops' | 'weather' | 'mandi' | 'disease' | 'precautions' | 'tools' | 'pesticides';

const PersonalizedDashboard: React.FC<Props> = ({ user, setUser }) => {
  // Active Feature Tab State
  const [activeTab, setActiveTab] = useState<FeatureTab>('hub');

  // Modals for Exclusive Personal Features
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isPesticideModalOpen, setIsPesticideModalOpen] = useState(false);

  // Global Tools Market State
  const [selectedToolsCategory, setSelectedToolsCategory] = useState<string>('All');
  const [toolsSearchQuery, setToolsSearchQuery] = useState<string>('');
  const [orderedToolToast, setOrderedToolToast] = useState<string | null>(null);

  // Pesticide & Fertilizer Dosage Calculator State
  const [pestCrop, setPestCrop] = useState<string>('Tomato');
  const [pestAcreage, setPestAcreage] = useState<number>(2.5);
  const [pestTarget, setPestTarget] = useState<string>('Aphids, Thrips & Whiteflies (Sucking Pests)');
  const [pestMethod, setPestMethod] = useState<string>('Foliar Spray');
  const [isSpeakingDosage, setIsSpeakingDosage] = useState(false);

  // Water & Phone SMS Alert Configurator State
  const [waterCropConfig, setWaterCropConfig] = useState(user.waterScheduleConfig?.cropName || 'Tomato');
  const [waterAcreageConfig, setWaterAcreageConfig] = useState(user.waterScheduleConfig?.acreage || 2.5);
  const [waterFrequencyConfig, setWaterFrequencyConfig] = useState(user.waterScheduleConfig?.waterFrequency || 'Every 2 Days (Morning 6:00 AM)');
  const [farmerPhoneConfig, setFarmerPhoneConfig] = useState(user.waterScheduleConfig?.phoneNumber || user.phone || '+91 98765 43210');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(user.waterScheduleConfig?.smsNotificationsEnabled ?? true);
  const [whatsappAlertsEnabled, setWhatsappAlertsEnabled] = useState(user.waterScheduleConfig?.whatsappNotificationsEnabled ?? true);
  const [sentSmsNotification, setSentSmsNotification] = useState<string | null>(null);

  // Yield Predictor State
  const [yieldCrop, setYieldCrop] = useState('Tomato');
  const [yieldAcreage, setYieldAcreage] = useState(2.5);
  const [yieldResult, setYieldResult] = useState<{ tons: number; quintals: number; revenueInr: number } | null>({
    tons: 32.5,
    quintals: 325,
    revenueInr: 926250
  });

  // Farm Photo State
  const [farmPhoto, setFarmPhoto] = useState<string>(
    user.farmPhoto || PRESET_FARM_PHOTOS[0].url
  );
  const [farmName, setFarmName] = useState<string>(
    user.farmName || `${user.name.split(' ')[0]}'s Smart Farm`
  );

  // Location State
  const [selectedState, setSelectedState] = useState<string>(() => {
    if (user.location && user.location.includes(',')) {
      const parts = user.location.split(',');
      const st = parts[parts.length - 1].trim();
      if (INDIA_STATES_DATA[st]) return st;
    }
    return "Telangana";
  });

  const availableDistricts = Object.keys(INDIA_STATES_DATA[selectedState]?.districts || { "Central District": true });

  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    if (user.location && user.location.includes(',')) {
      const parts = user.location.split(',');
      const dist = parts[parts.length - 2]?.trim();
      if (dist && availableDistricts.includes(dist)) return dist;
      if (availableDistricts.includes(parts[0].trim())) return parts[0].trim();
    }
    return availableDistricts[0] || "Warangal";
  });

  const availableSubLocations = getSubLocationsForDistrict(selectedState, selectedDistrict);

  // Sub-Location / Mandal / Village State
  const [selectedSubLocation, setSelectedSubLocation] = useState<string>(() => {
    if (user.location && user.location.split(',').length >= 3) {
      return user.location.split(',')[0].trim();
    }
    return availableSubLocations[0] || "Hanamkonda";
  });
  const [isCustomSubLocation, setIsCustomSubLocation] = useState(false);
  const [customSubLocationInput, setCustomSubLocationInput] = useState('');

  const [searchDistrictQuery, setSearchDistrictQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const districtData = getDistrictData(selectedState, selectedDistrict);
  const currentStateObj = INDIA_STATES_DATA[selectedState] || INDIA_STATES_DATA["Telangana"];

  // Real Live Weather State from Open-Meteo API & District Geolocation
  const [realWeather, setRealWeather] = useState<RealWeatherData | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchRealWeather(selectedDistrict, selectedState).then(data => {
      if (isMounted) setRealWeather(data);
    });
    return () => { isMounted = false; };
  }, [selectedDistrict, selectedState]);

  const tempC = realWeather ? realWeather.tempC : (selectedState === 'Punjab' ? 31 : selectedState === 'Maharashtra' ? 28 : selectedState === 'Uttar Pradesh' ? 29 : selectedState === 'Rajasthan' ? 33 : selectedState === 'Tamil Nadu' ? 32 : 30);
  const humidity = realWeather ? realWeather.humidity : (selectedState === 'Punjab' ? 84 : selectedState === 'Maharashtra' ? 78 : selectedState === 'West Bengal' ? 82 : 72);
  const windKm = realWeather ? realWeather.windSpeedKm : 14;
  const soilMoisture = realWeather ? realWeather.soilMoisturePercent : 68;
  const uvIndex = realWeather ? realWeather.uvIndex : 7;

  // Mandi Category Filter
  const [selectedMandiCategory, setSelectedMandiCategory] = useState<string>('All');

  const filteredMandiPrices = districtData.mandiPrices.filter(m => {
    if (selectedMandiCategory === 'All') return true;
    return m.category === selectedMandiCategory;
  });

  const [crops, setCrops] = useState<CultivatedCropItem[]>(() => {
    if (user.cultivatedCrops && user.cultivatedCrops.length > 0) return user.cultivatedCrops;
    return INITIAL_PERSONAL_CROPS;
  });

  // Photo & Add Crop Modals
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  const [newCropName, setNewCropName] = useState('Cotton (Gossypium hirsutum)');
  const [newCropIcon, setNewCropIcon] = useState('☁️');
  const [newCropAcreage, setNewCropAcreage] = useState('2.0 Acres');
  const [newCropSowingDate, setNewCropSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCropNotes, setNewCropNotes] = useState('');

  const saveFarmProfile = (updatedPhoto?: string, updatedName?: string, updatedCrops?: CultivatedCropItem[], updatedState?: string, updatedDist?: string, updatedSub?: string) => {
    const sub = updatedSub !== undefined ? updatedSub : selectedSubLocation;
    const dist = updatedDist !== undefined ? updatedDist : selectedDistrict;
    const st = updatedState !== undefined ? updatedState : selectedState;
    const locString = `${sub}, ${dist}, ${st}`;
    const updated: UserProfile = {
      ...user,
      farmPhoto: updatedPhoto !== undefined ? updatedPhoto : farmPhoto,
      farmName: updatedName !== undefined ? updatedName : farmName,
      cultivatedCrops: updatedCrops !== undefined ? updatedCrops : crops,
      location: locString,
      soilType: districtData.soilType
    };
    setUser(updated);
    localStorage.setItem('km_user_profile', JSON.stringify(updated));
  };

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const dists = Object.keys(INDIA_STATES_DATA[st]?.districts || {});
    const firstDist = dists[0] || `${st} District`;
    setSelectedDistrict(firstDist);
    const subs = getSubLocationsForDistrict(st, firstDist);
    const firstSub = subs[0] || `${firstDist} Central`;
    setSelectedSubLocation(firstSub);
    setIsCustomSubLocation(false);
    saveFarmProfile(undefined, undefined, undefined, st, firstDist, firstSub);
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const subs = getSubLocationsForDistrict(selectedState, dist);
    const firstSub = subs[0] || `${dist} Central`;
    setSelectedSubLocation(firstSub);
    setIsCustomSubLocation(false);
    saveFarmProfile(undefined, undefined, undefined, selectedState, dist, firstSub);
  };

  const handleSubLocationChange = (sub: string) => {
    if (sub === 'CUSTOM') {
      setIsCustomSubLocation(true);
      return;
    }
    setIsCustomSubLocation(false);
    setSelectedSubLocation(sub);
    saveFarmProfile(undefined, undefined, undefined, selectedState, selectedDistrict, sub);
  };

  const handleCustomSubLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubLocationInput.trim()) {
      setSelectedSubLocation(customSubLocationInput.trim());
      setIsCustomSubLocation(false);
      saveFarmProfile(undefined, undefined, undefined, selectedState, selectedDistrict, customSubLocationInput.trim());
    }
  };

  const handleSelectPresetPhoto = (url: string) => {
    setFarmPhoto(url);
    saveFarmProfile(url);
    setIsPhotoModalOpen(false);
  };

  const handleCustomPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPhotoInput.trim()) {
      setFarmPhoto(customPhotoInput.trim());
      saveFarmProfile(customPhotoInput.trim());
      setCustomPhotoInput('');
      setIsPhotoModalOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFarmPhoto(base64);
        saveFarmProfile(base64);
        setIsPhotoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCropItem: CultivatedCropItem = {
      id: `crop-${Date.now()}`,
      name: newCropName,
      icon: newCropIcon,
      acreage: newCropAcreage,
      sowingDate: newCropSowingDate,
      stage: 'Early Vegetative',
      stageProgress: 25,
      healthScore: 95,
      expectedHarvest: '60 Days',
      diseaseRisk: 'Low',
      notes: newCropNotes || 'Newly seeded field plot.'
    };
    const updated = [newCropItem, ...crops];
    setCrops(updated);
    saveFarmProfile(undefined, undefined, updated);
    setIsAddCropModalOpen(false);
    setNewCropNotes('');
  };

  const handleDeleteCrop = (id: string) => {
    const updated = crops.filter(c => c.id !== id);
    setCrops(updated);
    saveFarmProfile(undefined, undefined, updated);
  };

  // Save Water & Send SMS Alert Simulator
  const handleSaveWaterAndDispatchSms = (e: React.FormEvent) => {
    e.preventDefault();
    const liters = Math.round(waterAcreageConfig * 3.2 * 1000);
    const updatedUser: UserProfile = {
      ...user,
      phone: farmerPhoneConfig,
      waterScheduleConfig: {
        cropName: waterCropConfig,
        acreage: waterAcreageConfig,
        waterFrequency: waterFrequencyConfig,
        litersPerPlant: 3.2,
        phoneNumber: farmerPhoneConfig,
        smsNotificationsEnabled: smsAlertsEnabled,
        whatsappNotificationsEnabled: whatsappAlertsEnabled
      }
    };
    setUser(updatedUser);
    localStorage.setItem('km_user_profile', JSON.stringify(updatedUser));

    const alertMsg = `🌾 AgroPlay SMS Alert: Hi ${user.name}, your ${waterAcreageConfig} Acre ${waterCropConfig} plot in ${selectedDistrict} requires ${liters.toLocaleString()} Liters irrigation today (${waterFrequencyConfig}). Dispatched to ${farmerPhoneConfig}.`;
    setSentSmsNotification(alertMsg);

    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(`Water schedule configured for ${waterAcreageConfig} acres of ${waterCropConfig}. SMS alert sent to ${farmerPhoneConfig}.`);
      window.speechSynthesis.speak(speech);
    }
  };

  // Speak precautions
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakPrecautions = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = `Precautions for ${selectedDistrict}, ${selectedState}: ${districtData.precautions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const totalAcreage = crops.reduce((acc, c) => acc + (parseFloat(c.acreage) || 0), 0) || parseFloat(user.farmSize) || 5;
  const avgHealth = crops.length > 0 ? Math.round(crops.reduce((acc, c) => acc + c.healthScore, 0) / crops.length) : 95;
  const highRiskCount = districtData.commonDiseases.filter(d => d.risk === 'High').length;

  const handleCalculateYield = () => {
    const tons = Math.round(yieldAcreage * 13 * 10) / 10;
    const quintals = tons * 10;
    const pricePerQtl = yieldCrop === 'Tomato' ? 2850 : yieldCrop === 'Wheat' ? 2280 : 7450;
    const revenueInr = quintals * pricePerQtl;
    setYieldResult({ tons, quintals, revenueInr });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      
      {/* Top Banner Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 text-white p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/30 flex-shrink-0">
            <Sprout size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm outfit text-green-400">My Personal Farm Hub</span>
              <span className="bg-green-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">EXCLUSIVE PLOT</span>
            </div>
            <p className="text-xs text-slate-300">Personalized telemetry for {user.name}&apos;s farm in {selectedDistrict}, {selectedState}.</p>
          </div>
        </div>
        <Link 
          to="/network-dashboard" 
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-white/10 shadow-lg whitespace-nowrap"
        >
          <BarChart3 size={16} className="text-green-400" />
          <span>Switch to Network Overview</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* SMS Alert Banner (if sent) */}
      {sentSmsNotification && (
        <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <Smartphone size={24} className="text-emerald-200 animate-bounce" />
            <p className="text-xs font-bold leading-relaxed">{sentSmsNotification}</p>
          </div>
          <button onClick={() => setSentSmsNotification(null)} className="p-1 hover:bg-white/20 rounded-lg">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Hero Real Farm Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
        <div className="h-48 sm:h-56 w-full relative overflow-hidden bg-slate-900">
          <img 
            src={farmPhoto} 
            alt="My Real Farm" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <button 
          onClick={() => setIsPhotoModalOpen(true)}
          className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-bold border border-white/20 shadow-xl flex items-center gap-2 transition-all hover:scale-105"
        >
          <Camera size={16} className="text-green-400" />
          <span>Change Real Farm Photo</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-white">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-green-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                Personal Plot
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <MapPin size={12} className="text-amber-400" />
                {selectedDistrict}, {selectedState} ({currentStateObj.code})
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                <Phone size={12} className="text-emerald-300" />
                {farmerPhoneConfig}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black outfit tracking-tight flex items-center gap-3">
              {farmName}
              <button 
                onClick={() => {
                  const newName = prompt('Enter your Farm Name:', farmName);
                  if (newName && newName.trim()) {
                    setFarmName(newName.trim());
                    saveFarmProfile(undefined, newName.trim());
                  }
                }}
                className="text-slate-300 hover:text-white transition-colors"
                title="Edit Farm Name"
              >
                <Edit3 size={18} />
              </button>
            </h1>

            <p className="text-xs text-slate-200">
              Farmer: <span className="font-bold text-white">{user.name}</span> • Plot: <span className="font-bold text-green-400">{totalAcreage.toFixed(1)} Acres</span> • SMS Alerts: <span className="font-bold text-emerald-300">{farmerPhoneConfig}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <Activity size={16} className="text-green-400" />
              <div>
                <p className="text-[9px] text-slate-300 font-bold uppercase">Health</p>
                <p className="text-sm font-black text-white outfit">{avgHealth}%</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <Sprout size={16} className="text-amber-400" />
              <div>
                <p className="text-[9px] text-slate-300 font-bold uppercase">Crops</p>
                <p className="text-sm font-black text-white outfit">{crops.length}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400" />
              <div>
                <p className="text-[9px] text-slate-300 font-bold uppercase">Threats</p>
                <p className="text-sm font-black text-white outfit">{highRiskCount} High</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE MODULE TABS BAR */}
      <div className="bg-white p-2 rounded-3xl border border-slate-200/80 shadow-lg flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'hub', label: 'Feature Cards Hub', icon: Zap },
          { id: 'crops', label: `My Crops (${crops.length})`, icon: Sprout },
          { id: 'weather', label: 'Weather & Location', icon: Thermometer },
          { id: 'mandi', label: `APMC Mandi Rates (${districtData.mandiPrices.length})`, icon: TrendingUp },
          { id: 'disease', label: 'Disease Radar', icon: AlertTriangle },
          { id: 'precautions', label: 'Precautions Advisory', icon: ShieldAlert },
          { id: 'tools', label: 'Global Tools Market', icon: ShoppingBag },
          { id: 'pesticides', label: 'Pesticide Dosage', icon: FlaskConical }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FeatureTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-green-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FEATURE TAB 1: FEATURE CARDS HUB (EXCLUSIVELY PERSONAL FARM FEATURES MATCHING USER'S SCREENSHOT & REQUEST!) */}
      {activeTab === 'hub' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Water & Phone SMS Alert Configurator (NEW FEATURE REQUESTED BY USER!) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-blue-100/70 text-blue-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone size={30} />
                </div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  PHONE SMS ALERTS
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Irrigation & Phone SMS Alerts</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Configure plant type, acreage, watering frequency, and receive automated SMS/WhatsApp alerts on your phone.
              </p>
            </div>
            <button 
              onClick={() => setIsWaterModalOpen(true)}
              className="mt-8 flex items-center gap-2 font-black text-xs text-blue-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>CONFIGURE WATER & SMS ALERTS</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: My Cultivated Crops Inventory */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-emerald-100/70 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sprout size={30} />
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  PERSONAL ACREAGE
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">My Cultivated Crops</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Track growth stages, health index %, and harvest countdowns for your 10 active crops in {farmName}.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('crops')}
              className="mt-8 flex items-center gap-2 font-black text-xs text-emerald-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>MANAGE MY CROPS ({crops.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: District Microclimate & Location */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-sky-100/70 text-sky-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin size={30} />
                </div>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  GPS TELEMETRY
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">District Microclimate</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                All-India State/District selector, GPS auto-detect, soil profile, and 3-day weather forecast for {selectedDistrict}.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('weather')}
              className="mt-8 flex items-center gap-2 font-black text-xs text-sky-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>VIEW DISTRICT WEATHER</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 4: District APMC Mandi Rates */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-teal-100/70 text-teal-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp size={30} />
                </div>
                <span className="bg-teal-100 text-teal-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  LOCAL AUCTION
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">APMC Mandi Rates</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Live auction prices for 14 commodities in {selectedDistrict} district APMC market with category filters.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('mandi')}
              className="mt-8 flex items-center gap-2 font-black text-xs text-teal-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>CHECK MANDI RATES</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 5: District Disease Outbreak Radar */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-rose-100/70 text-rose-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle size={30} />
                </div>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  20KM INFECTION RADAR
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Disease Threat Radar</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                District infection map monitoring active pathogen spreads within 2-20 km of your farm in {selectedDistrict}.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('disease')}
              className="mt-8 flex items-center gap-2 font-black text-xs text-rose-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>VIEW THREAT RADAR</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 6: My Plot Harvest Yield & Revenue Forecast */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-amber-100/70 text-amber-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calculator size={30} />
                </div>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  PLOT REVENUE AI
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Harvest Yield Forecast</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Calculate expected harvest tonnage & estimated market valuation in ₹ INR for your farm plot.
              </p>
            </div>
            <button 
              onClick={() => setIsYieldModalOpen(true)}
              className="mt-8 flex items-center gap-2 font-black text-xs text-amber-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>CALCULATE YIELD & REVENUE</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 7: Localized Daily Agricultural Precautions */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-orange-100/70 text-orange-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldAlert size={30} />
                </div>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  LOCALIZED ADVISORY
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Precautions & Audio Advisory</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Daily agricultural precautions for {selectedDistrict} with regional speech synthesis audio playback.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('precautions')}
              className="mt-8 flex items-center gap-2 font-black text-xs text-orange-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>READ & LISTEN ADVISORY</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 8: My Real Farm Identity & Photo */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-purple-100/70 text-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={30} />
                </div>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  PLOT IDENTITY
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Real Farm Customizer</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Upload custom photo of your actual farm plot, set farm name, soil preferences, and total acreage.
              </p>
            </div>
            <button 
              onClick={() => setIsPhotoModalOpen(true)}
              className="mt-8 flex items-center gap-2 font-black text-xs text-purple-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>CUSTOMIZE FARM PHOTO</span>
              <ArrowRight size={16} />
            </button>
          </div>
          {/* Card 9: Global Farm Machinery & Tools Market (NEW FEATURE REQUESTED BY USER!) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-indigo-100/70 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag size={30} />
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  GLOBAL MARKETPLACE
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Global Equipment Market</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Discover smart drip irrigation kits, solar insect traps, drone sprayers, NPK probes, and mini power tillers in global markets.
              </p>
            </div>
            <button 
              onClick={() => setIsToolsModalOpen(true)}
              className="mt-8 flex items-center gap-2 font-black text-xs text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>EXPLORE GLOBAL TOOLS & MACHINERY</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 10: Pesticide & Fertilizer Dosage Calculator (NEW FEATURE REQUESTED BY USER!) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-violet-100/70 text-violet-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FlaskConical size={30} />
                </div>
                <span className="bg-violet-100 text-violet-700 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest">
                  CHEMICAL & BIO DOSAGE
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight mt-6">Pesticide & Fertilizer Dosage</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3">
                Calculate exact chemical volume (L/g), diluent water tank volume, spray schedule, and PPE safety protocol based on crop and plot size.
              </p>
            </div>
            <button 
              onClick={() => setIsPesticideModalOpen(true)}
              className="mt-8 flex items-center gap-2 font-black text-xs text-violet-600 uppercase tracking-widest hover:gap-3 transition-all cursor-pointer text-left"
            >
              <span>CALCULATE PESTICIDE DOSAGE</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      )}

      {/* FEATURE TAB 2: MY CROPS INVENTORY */}
      {activeTab === 'crops' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-xl flex items-center justify-center">
                  <Sprout size={18} />
                </div>
                <h2 className="font-black text-2xl text-slate-900 outfit">My Cultivated Crops ({crops.length})</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Crops actively grown in {farmName} ({selectedDistrict}, {selectedState}) across {totalAcreage.toFixed(1)} acres</p>
            </div>

            <button 
              onClick={() => setIsAddCropModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus size={18} />
              <span>Add Crop to My Farm</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div 
                key={crop.id}
                className="bg-slate-50 rounded-3xl border border-slate-200/90 shadow-md p-5 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {crop.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 outfit text-base leading-tight">{crop.name}</h3>
                        <span className="text-xs font-bold text-slate-400">{crop.acreage} Plot</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteCrop(crop.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-xl transition-colors"
                      title="Remove Crop"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Current Stage</span>
                      <span className="font-black text-green-700">{crop.stage} ({crop.stageProgress}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-600 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${crop.stageProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-emerald-800 uppercase">Health Score</p>
                        <p className="font-black text-emerald-900 outfit text-sm">{crop.healthScore}%</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2">
                      <Calendar size={16} className="text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-amber-800 uppercase">Est. Harvest</p>
                        <p className="font-black text-amber-900 outfit text-sm">{crop.expectedHarvest}</p>
                      </div>
                    </div>
                  </div>

                  {crop.notes && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                      &ldquo;{crop.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                  <Link 
                    to="/diagnosis"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-2xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Activity size={14} className="text-green-400" />
                    <span>Scan Health</span>
                  </Link>
                  <Link 
                    to="/planner"
                    className="bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-green-200"
                  >
                    <span>Action Plan</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE TAB 3: WEATHER & LOCATION */}
      {activeTab === 'weather' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <h2 className="font-bold text-slate-800 outfit text-base">All-India Location Selector</h2>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                LIVE
              </span>
            </div>

            {/* Level 1: State */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Indian State / UT (28 States & 8 UTs)</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {Object.keys(INDIA_STATES_DATA).map((st) => (
                  <option key={st} value={st}>
                    🇮🇳 {st} ({INDIA_STATES_DATA[st].language})
                  </option>
                ))}
              </select>
            </div>

            {/* Level 2: District */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. District / City in {selectedState}</label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    📍 {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Level 3: Particular Location Inside District (Mandal / Tehsil / Village) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Mandal / Village in {selectedDistrict}</label>
                <button 
                  onClick={() => setIsCustomSubLocation(!isCustomSubLocation)} 
                  className="text-[9px] font-bold text-green-600 hover:underline cursor-pointer"
                >
                  {isCustomSubLocation ? 'Select from List' : '+ Enter Custom Village'}
                </button>
              </div>

              {!isCustomSubLocation ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSubLocation}
                    onChange={(e) => handleSubLocationChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {availableSubLocations.map((sub) => (
                      <option key={sub} value={sub}>
                        🏡 {sub} Mandal / Area
                      </option>
                    ))}
                    <option value="CUSTOM">✏️ + Enter Custom Village / Mandal Name...</option>
                  </select>

                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const detectedSub = `${selectedDistrict} Mandal`;
                            setSelectedSubLocation(detectedSub);
                            saveFarmProfile(undefined, undefined, undefined, selectedState, selectedDistrict, detectedSub);
                            alert(`GPS Pinpointed: Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}. Sub-Location: ${detectedSub}, ${selectedDistrict}, ${selectedState}.`);
                          },
                          () => alert('GPS access limited. Using selected location telemetry.')
                        );
                      }
                    }}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all flex-shrink-0 cursor-pointer"
                    title="Pinpoint GPS Hyper-Local Sub-Location"
                  >
                    <Navigation size={18} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSubLocationSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSubLocationInput}
                    onChange={(e) => setCustomSubLocationInput(e.target.value)}
                    placeholder="Enter Village / Mandal / Tehsil name..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <button type="submit" className="bg-green-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-green-700 cursor-pointer">
                    Save
                  </button>
                </form>
              )}
            </div>

            <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-sky-100 uppercase tracking-widest">{selectedSubLocation}, {selectedDistrict} Telemetry</p>
                <div className="flex items-baseline gap-2 my-1">
                  <span className="text-4xl font-black outfit">{tempC}°C</span>
                  <span className="text-xs font-semibold text-sky-200">/ {Math.round(tempC * 1.8 + 32)}°F</span>
                </div>
                <p className="text-xs text-sky-100">Soil Profile: <span className="font-bold text-white">{districtData.soilType}</span></p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50/60 via-white to-sky-50/50 p-6 rounded-3xl border border-emerald-200/70 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <CloudRain size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-slate-900 outfit text-lg">Real Live Microclimate Forecast</h2>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Open-Meteo Verified</span>
                  </div>
                  <p className="text-xs text-slate-500">Exact live weather telemetry for {selectedSubLocation}, {selectedDistrict}, {selectedState}</p>
                </div>
              </div>
              {realWeather && (
                <span className="text-[10px] font-bold text-slate-400">Updated {realWeather.lastUpdatedTime}</span>
              )}
            </div>

            {/* Condition Banner */}
            {realWeather && (
              <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{realWeather.conditionIcon}</span>
                  <div>
                    <p className="text-xs font-bold text-emerald-100">Current Condition</p>
                    <p className="text-base font-black outfit">{realWeather.conditionText}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black outfit">{realWeather.tempC}°C / {realWeather.tempF}°F</p>
                  <p className="text-[10px] text-emerald-200 font-semibold">Feels like {realWeather.feelsLikeC}°C</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(realWeather?.forecast || []).map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl border border-emerald-100 text-center space-y-1 shadow-sm hover:border-emerald-300 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{item.dayName}</p>
                  <div className="text-2xl my-0.5">{item.conditionIcon}</div>
                  <p className="text-sm font-black text-slate-900 outfit">{item.maxTempC}°C <span className="text-[10px] text-slate-400 font-semibold">/ {item.minTempC}°</span></p>
                  <p className="text-[9px] text-emerald-700 font-bold truncate">{item.conditionText}</p>
                  <p className="text-[9px] text-sky-600 font-extrabold">🌧️ {item.popPercent}%</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3 rounded-2xl border border-amber-100 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Humidity</p>
                <p className="text-sm font-black text-slate-800 outfit">{humidity}%</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Wind</p>
                <p className="text-sm font-black text-slate-800 outfit">{windKm} km/h</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Soil Moisture</p>
                <p className="text-sm font-black text-slate-800 outfit">{soilMoisture}%</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Solar Index</p>
                <p className="text-sm font-black text-slate-800 outfit">UV {uvIndex}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* FEATURE TAB 4: APMC MANDI RATES */}
      {activeTab === 'mandi' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 outfit text-lg">{selectedDistrict} APMC Mandi Rates ({filteredMandiPrices.length} Commodities)</h2>
                <p className="text-xs text-slate-500">Live auction market rates in {selectedDistrict}, {selectedState}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Cereals', 'Vegetables', 'Cash Crops', 'Spices', 'Oilseeds', 'Fruits'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMandiCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedMandiCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto custom-scrollbar p-1">
            {filteredMandiPrices.map((mandi, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{mandi.category}</span>
                  <span className={`text-[10px] font-bold ${mandi.trend === 'up' ? 'text-emerald-600' : mandi.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                    {mandi.change}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">{mandi.crop}</p>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-black text-slate-900 outfit">{mandi.price}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{mandi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE TAB 5: DISEASE RADAR */}
      {activeTab === 'disease' && (
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/30">
                <AlertTriangle size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-xl outfit text-white">{selectedDistrict} Disease Outbreak Radar</h2>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    DISTRICT SHIELD
                  </span>
                </div>
                <p className="text-xs text-slate-400">Live infection map monitoring pest spreads in {selectedDistrict}, {selectedState}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districtData.commonDiseases.map((outbreak, idx) => {
              const isHigh = outbreak.risk === 'High';
              const isMed = outbreak.risk === 'Medium';
              return (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                    isHigh 
                      ? 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-500/40 shadow-lg shadow-rose-950/40' 
                      : isMed 
                      ? 'bg-gradient-to-b from-amber-950/50 to-slate-900 border-amber-500/40' 
                      : 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Target: {outbreak.crop}</span>
                      <h3 className="font-bold text-base text-white outfit mt-0.5">{outbreak.name}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      isHigh 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                        : isMed 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {outbreak.risk} Risk
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <MapPin size={14} className={isHigh ? 'text-rose-400' : 'text-amber-400'} />
                    <span>Detected <span className="font-bold text-white">{outbreak.distanceKm} km</span> from your farm plot</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {outbreak.advisory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FEATURE TAB 6: PRECAUTIONS ADVISORY */}
      {activeTab === 'precautions' && (
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 outfit text-lg">Localized Precautions & Advisory</h2>
                <p className="text-xs text-slate-500">Daily guidelines tailored for {selectedDistrict}, {selectedState} ({currentStateObj.language})</p>
              </div>
            </div>

            <button 
              onClick={speakPrecautions}
              className={`p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                isSpeaking ? 'bg-amber-600 text-white animate-pulse' : 'bg-white text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Volume2 size={16} />
              <span>{isSpeaking ? 'Speaking...' : 'Listen Advisory'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {districtData.precautions.map((precaution, idx) => (
              <div 
                key={idx} 
                className="bg-white p-4 rounded-2xl border border-amber-200/80 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{precaution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXCLUSIVE PERSONAL FEATURE MODAL 1: WATER & PHONE SMS ALERTS CONFIGURATOR */}
      {isWaterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 outfit">Smart Irrigation & Phone SMS Alerts</h3>
                  <p className="text-xs text-slate-500">Configure plot acreage, plant frequency & SMS phone alerts</p>
                </div>
              </div>
              <button onClick={() => setIsWaterModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveWaterAndDispatchSms} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Crop / Plant Type</label>
                  <select 
                    value={waterCropConfig} 
                    onChange={(e) => setWaterCropConfig(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold"
                  >
                    <option value="Tomato">🍅 Tomato</option>
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Cotton">☁️ Cotton</option>
                    <option value="Chili">🌶️ Chili Pepper</option>
                    <option value="Paddy">🍚 Paddy / Rice</option>
                    <option value="Potato">🥔 Potato</option>
                    <option value="Red Onion">🧅 Red Onion</option>
                    <option value="Maize">🌽 Organic Maize</option>
                    <option value="Turmeric">🌿 Turmeric</option>
                    <option value="Mango">🥭 Mango Orchard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Plot Acreage (Acres)</label>
                  <input 
                    type="number"
                    value={waterAcreageConfig}
                    onChange={(e) => setWaterAcreageConfig(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Watering Frequency & Timing</label>
                <select 
                  value={waterFrequencyConfig}
                  onChange={(e) => setWaterFrequencyConfig(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold"
                >
                  <option value="Daily Drip (Morning 6:00 AM)">Daily Drip Irrigation (Morning 6:00 AM)</option>
                  <option value="Every 2 Days (Morning 6:00 AM)">Every 2 Days Drip (Morning 6:00 AM)</option>
                  <option value="Every 3 Days (Evening 5:00 PM)">Every 3 Days Sprinkler (Evening 5:00 PM)</option>
                  <option value="Weekly Heavy Irrigation">Weekly Heavy Canal Irrigation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Farmer Mobile Phone Number (For SMS Alerts)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel"
                    value={farmerPhoneConfig}
                    onChange={(e) => setFarmerPhoneConfig(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Send Daily SMS Alerts to Phone</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={smsAlertsEnabled}
                    onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-slate-800">Send WhatsApp Irrigation Digest</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={whatsappAlertsEnabled}
                    onChange={(e) => setWhatsappAlertsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <Bell size={16} />
                <span>Save Schedule & Send Instant Test SMS Alert</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EXCLUSIVE PERSONAL FEATURE MODAL 2: YIELD PREDICTOR */}
      {isYieldModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 outfit">Plot Harvest Yield & Revenue</h3>
                  <p className="text-xs text-slate-500">Predict total harvest tonnage & revenue for {selectedDistrict}</p>
                </div>
              </div>
              <button onClick={() => setIsYieldModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Crop Type</label>
                  <select 
                    value={yieldCrop} 
                    onChange={(e) => setYieldCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold"
                  >
                    <option value="Tomato">🍅 Tomato</option>
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Cotton">☁️ Cotton</option>
                    <option value="Chili">🌶️ Chili</option>
                    <option value="Paddy">🍚 Paddy / Rice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Plot Acreage (Acres)</label>
                  <input 
                    type="number"
                    value={yieldAcreage}
                    onChange={(e) => setYieldAcreage(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <button 
                onClick={handleCalculateYield}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-lg shadow-emerald-200"
              >
                Calculate Yield & Market Revenue
              </button>

              {yieldResult && (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-bold text-emerald-800">Forecasted Harvest Tonnage</span>
                    <span className="text-xl font-black text-emerald-950 outfit">{yieldResult.tons} Tons ({yieldResult.quintals} Qtl)</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-800">Estimated Valuation</span>
                    <span className="text-xl font-black text-emerald-900 outfit">₹{yieldResult.revenueInr.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Change Real Farm Photo & Details */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 outfit">Customize Real Farm Photo</h3>
                  <p className="text-xs text-slate-500">Upload your actual farm photo or choose a high-res preset</p>
                </div>
              </div>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select High-Res Preset Photo</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_FARM_PHOTOS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPresetPhoto(preset.url)}
                    className={`relative rounded-2xl overflow-hidden h-24 border-2 transition-all text-left group ${
                      farmPhoto === preset.url ? 'border-green-600 ring-2 ring-green-500' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 flex items-end">
                      <span className="text-[10px] font-bold text-white leading-tight">{preset.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Custom Photo from Device</label>
              <label className="border-2 border-dashed border-slate-300 hover:border-green-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
                <Upload size={28} className="text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to choose image file</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <form onSubmit={handleCustomPhotoSubmit} className="space-y-3 pt-2 border-t">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Or Enter Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={customPhotoInput} 
                  onChange={(e) => setCustomPhotoInput(e.target.value)}
                  placeholder="https://example.com/my-farm-photo.jpg" 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-green-700 transition-colors">
                  Apply URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Cultivated Crop */}
      {isAddCropModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
                  <Sprout size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 outfit">Add Crop to My Farm</h3>
                  <p className="text-xs text-slate-500">Track a new crop cultivated on your plot</p>
                </div>
              </div>
              <button onClick={() => setIsAddCropModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCropSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Crop Type</label>
                <select 
                  value={newCropName}
                  onChange={(e) => {
                    setNewCropName(e.target.value);
                    if (e.target.value.includes('Tomato')) setNewCropIcon('🍅');
                    else if (e.target.value.includes('Wheat')) setNewCropIcon('🌾');
                    else if (e.target.value.includes('Rice') || e.target.value.includes('Paddy')) setNewCropIcon('🍚');
                    else if (e.target.value.includes('Chili')) setNewCropIcon('🌶️');
                    else if (e.target.value.includes('Cotton')) setNewCropIcon('☁️');
                    else if (e.target.value.includes('Mango')) setNewCropIcon('🥭');
                    else if (e.target.value.includes('Potato')) setNewCropIcon('🥔');
                    else if (e.target.value.includes('Onion')) setNewCropIcon('🧅');
                    else if (e.target.value.includes('Maize') || e.target.value.includes('Corn')) setNewCropIcon('🌽');
                    else if (e.target.value.includes('Turmeric')) setNewCropIcon('🌿');
                    else if (e.target.value.includes('Groundnut') || e.target.value.includes('Peanut')) setNewCropIcon('🥜');
                    else if (e.target.value.includes('Mustard')) setNewCropIcon('🌻');
                    else if (e.target.value.includes('Garlic')) setNewCropIcon('🧄');
                    else if (e.target.value.includes('Sugarcane')) setNewCropIcon('🎋');
                    else if (e.target.value.includes('Banana')) setNewCropIcon('🍌');
                    else if (e.target.value.includes('Coffee') || e.target.value.includes('Pepper')) setNewCropIcon('☕');
                    else setNewCropIcon('🌱');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-green-500"
                >
                  <option value="Tomato (Solanum lycopersicum)">🍅 Tomato</option>
                  <option value="Wheat (Triticum aestivum)">🌾 Wheat</option>
                  <option value="Paddy / Rice (Oryza sativa)">🍚 Paddy / Rice</option>
                  <option value="Cotton (Gossypium hirsutum)">☁️ Cotton</option>
                  <option value="Chili Pepper (Capsicum annuum)">🌶️ Chili Pepper</option>
                  <option value="Potato (Solanum tuberosum)">🥔 Potato</option>
                  <option value="Red Onion (Allium cepa)">🧅 Red Onion</option>
                  <option value="Organic Maize (Zea mays)">🌽 Organic Maize / Corn</option>
                  <option value="Turmeric (Curcuma longa)">🌿 Turmeric</option>
                  <option value="Mango Orchard (Mangifera indica)">🥭 Mango Orchard</option>
                  <option value="Groundnut / Peanut (Arachis hypogaea)">🥜 Groundnut / Peanut</option>
                  <option value="Mustard / Raya (Brassica juncea)">🌻 Mustard / Raya</option>
                  <option value="Garlic (Allium sativum)">🧄 Garlic</option>
                  <option value="Sugarcane (Saccharum officinarum)">🎋 Sugarcane</option>
                  <option value="Banana Plantation (Musa acuminata)">🍌 Banana Plantation</option>
                  <option value="Coffee & Black Pepper Plantation">☕ Coffee & Black Pepper</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Plot Acreage</label>
                  <input 
                    type="text"
                    value={newCropAcreage}
                    onChange={(e) => setNewCropAcreage(e.target.value)}
                    placeholder="e.g. 2.5 Acres"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Sowing Date</label>
                  <input 
                    type="date"
                    value={newCropSowingDate}
                    onChange={(e) => setNewCropSowingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Field Notes / Observations</label>
                <textarea 
                  value={newCropNotes}
                  onChange={(e) => setNewCropNotes(e.target.value)}
                  placeholder="e.g. Drip fertigation lines installed. Sown on raised beds."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-lg shadow-green-200"
              >
                Add Crop to My Farm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FEATURE TAB 7: GLOBAL FARM MARKET TOOLS & MACHINERY */}
      {(activeTab === 'tools' || isToolsModalOpen) && (
        <div className={isToolsModalOpen ? "fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" : "space-y-6"}>
          <div className={isToolsModalOpen ? "bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto relative" : "space-y-6"}>
            
            {isToolsModalOpen && (
              <button onClick={() => setIsToolsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100 z-10">
                <X size={20} />
              </button>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="space-y-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-indigo-400/30">
                    GLOBAL MACHINERY & AG-TECH HUB
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-emerald-400/30">
                    DIRECT SUPPLIER SHIP
                  </span>
                </div>
                <h2 className="text-3xl font-black outfit tracking-tight">Global Agriculture Market Equipment</h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Source smart drip irrigation systems, solar insect traps, drone sprayers, handheld soil NPK probes, and mini power tillers with global specs & pricing.
                </p>
              </div>

              {orderedToolToast && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce z-20">
                  <CheckCircle size={18} />
                  <span>{orderedToolToast}</span>
                </div>
              )}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input 
                    type="text"
                    value={toolsSearchQuery}
                    onChange={(e) => setToolsSearchQuery(e.target.value)}
                    placeholder="Search global tools, sprayers, probes..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto">
                  {['All', 'Irrigation', 'Sprayers & Protection', 'Sensors & Soil Tech', 'Machinery & Power', 'Post-Harvest Tools'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedToolsCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedToolsCategory === cat
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GLOBAL_MARKET_TOOLS
                .filter(tool => selectedToolsCategory === 'All' || tool.category === selectedToolsCategory)
                .filter(tool => !toolsSearchQuery || tool.name.toLowerCase().includes(toolsSearchQuery.toLowerCase()) || tool.specs.toLowerCase().includes(toolsSearchQuery.toLowerCase()))
                .map((tool) => (
                  <div key={tool.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                            {tool.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{tool.category}</span>
                            <h3 className="font-black text-lg text-slate-900 outfit leading-snug">{tool.name}</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Supplier: {tool.supplier}</p>
                          </div>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap">
                          {tool.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {tool.specs}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-t pt-3">
                        <span className="text-slate-400">Target Crops:</span>
                        <span className="text-slate-800">{tool.recommendedCrops}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-slate-900 outfit flex items-center">
                          <IndianRupee size={18} />
                          <span>{tool.priceInr.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">≈ ${tool.priceUsd} USD</span>
                      </div>

                      <button
                        onClick={() => {
                          setOrderedToolToast(`Order inquiry submitted for ${tool.name}! Global supplier will contact ${farmerPhoneConfig}.`);
                          setTimeout(() => setOrderedToolToast(null), 5000);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-200 cursor-pointer flex items-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        <span>Order from Global Market</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* FEATURE TAB 8: PESTICIDE & FERTILIZER DOSAGE CALCULATOR */}
      {(activeTab === 'pesticides' || isPesticideModalOpen) && (
        <div className={isPesticideModalOpen ? "fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" : "space-y-6"}>
          <div className={isPesticideModalOpen ? "bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto relative" : "space-y-6"}>
            
            {isPesticideModalOpen && (
              <button onClick={() => setIsPesticideModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100 z-10">
                <X size={20} />
              </button>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-900 via-purple-950 to-indigo-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="bg-violet-500/20 text-violet-300 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-violet-400/30">
                    DOSAGE & SPRAYING ALGORITHM
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-emerald-400/30">
                    BIO & CHEMICAL SAFETY
                  </span>
                </div>
                <h2 className="text-3xl font-black outfit tracking-tight">Smart Pesticide & Fertilizer Dosage Calculator</h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Calculate exact chemical volume (L/g), diluent water tank volume, spraying schedule, and safety protocols based on crop and plot acreage.
                </p>
              </div>

              <div className="w-16 h-16 bg-violet-500/20 text-violet-300 rounded-3xl flex items-center justify-center border border-violet-400/30 shrink-0">
                <FlaskConical size={32} />
              </div>
            </div>

            {/* Calculator Controls */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Crop Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Crop / Plant</label>
                  <select 
                    value={pestCrop}
                    onChange={(e) => setPestCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-violet-500"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                    <option value="Tomato">🍅 Tomato</option>
                    <option value="Cotton">☁️ Cotton</option>
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Rice / Paddy">🍚 Rice / Paddy</option>
                    <option value="Maize / Corn">🌽 Maize / Corn</option>
                    <option value="Sugarcane">🎋 Sugarcane</option>
                    <option value="Chili Pepper">🌶️ Chili Pepper</option>
                  </select>
                </div>

                {/* Plot Size (Acres) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Plot Acreage (Acres)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="500"
                    value={pestAcreage}
                    onChange={(e) => setPestAcreage(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Application Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Application Method</label>
                  <select 
                    value={pestMethod}
                    onChange={(e) => setPestMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="Foliar Spray">🔫 Knapsack / Boom Foliar Spray</option>
                    <option value="Drip Fertigation">💧 Drip System Fertigation</option>
                    <option value="Soil Drenching">🌱 Root Zone Soil Drenching</option>
                  </select>
                </div>
              </div>

              {/* Pest & Disease Target Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Pest Infestation or Disease Target</label>
                <select 
                  value={pestTarget}
                  onChange={(e) => setPestTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-violet-500"
                >
                  {Object.keys(PEST_DOSAGE_DATABASE).map((targetKey) => (
                    <option key={targetKey} value={targetKey}>{targetKey}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Dosage Results Card */}
            {(() => {
              const data = PEST_DOSAGE_DATABASE[pestTarget] || PEST_DOSAGE_DATABASE['Aphids, Thrips & Whiteflies (Sucking Pests)'];
              const totalChemicalAmount = (data.dosagePerAcreLitersOrKg * pestAcreage).toFixed(2);
              const totalWaterLiters = Math.round(data.dilutionWaterLitersPerAcre * pestAcreage);
              const totalSprayerTanks = Math.ceil(totalWaterLiters / 16);

              const handleListenDosage = () => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  if (isSpeakingDosage) {
                    setIsSpeakingDosage(false);
                    return;
                  }
                  const text = `Dosage recommendation for ${pestAcreage} acres of ${pestCrop}. Use ${totalChemicalAmount} ${data.unit} of ${data.productName}, mixed into ${totalWaterLiters} liters of clean water, equivalent to ${totalSprayerTanks} knapsack sprayer tanks. ${data.schedule}`;
                  const utterance = new SpeechSynthesisUtterance(text);
                  utterance.rate = 0.95;
                  utterance.onend = () => setIsSpeakingDosage(false);
                  setIsSpeakingDosage(true);
                  window.speechSynthesis.speak(utterance);
                }
              };

              return (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-6 border border-violet-200/80 shadow-lg space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-violet-200 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">{data.chemicalCategory}</span>
                      <h3 className="text-xl font-black text-slate-900 outfit">{data.productName}</h3>
                      <p className="text-xs text-slate-600 font-medium mt-1">{data.description}</p>
                    </div>

                    <button
                      onClick={handleListenDosage}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                        isSpeakingDosage ? 'bg-rose-600 text-white animate-pulse' : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200'
                      }`}
                    >
                      <Volume2 size={16} />
                      <span>{isSpeakingDosage ? 'Stop Audio' : 'Listen Dosage Audio'}</span>
                    </button>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="bg-white p-4 rounded-2xl border border-violet-100 shadow-sm space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Product Volume</span>
                      <div className="text-2xl font-black text-violet-950 outfit">
                        {totalChemicalAmount} <span className="text-sm font-bold text-violet-600">{data.unit}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">Rate: {data.dosagePerAcreLitersOrKg} {data.unit} / acre</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-violet-100 shadow-sm space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diluent Water Tank</span>
                      <div className="text-2xl font-black text-blue-950 outfit">
                        {totalWaterLiters} <span className="text-sm font-bold text-blue-600">Liters</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">Ratio: {data.dilutionRatio}</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-violet-100 shadow-sm space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sprayer Tanks (16L)</span>
                      <div className="text-2xl font-black text-emerald-950 outfit">
                        {totalSprayerTanks} <span className="text-sm font-bold text-emerald-600">Tanks</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">16 Liters per standard tank</p>
                    </div>

                  </div>

                  {/* Schedule & Safety */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2 text-violet-800 font-bold text-xs">
                        <Calendar size={16} />
                        <span>Recommended Spraying Schedule</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {data.schedule}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                        <ShieldAlert size={16} />
                        <span>PPE Personal Safety Protocol</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {data.safetyPPE.map((ppe, i) => (
                          <span key={i} className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-rose-100">
                            ✓ {ppe}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};

export default PersonalizedDashboard;
