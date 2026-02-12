
export interface UserProfile {
  uid: string;
  name: string;
  points: number;
  ecoPoints: number;
  badges: Badge[];
  location: string;
  soilType: string;
  email: string;
  phone: string;
  role: 'Farmer' | 'Learner' | 'Expert';
  farmSize: string;
  cropPreferences: string[];
  sustainabilityGoals: string[];
  irrigationPreference: string;
  languagePreference: string;
  onboardingComplete: boolean;
  avatar?: string;
  createdAt?: string;
}

export interface CultivationStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Preparation' | 'Sowing' | 'Maintenance' | 'Protection' | 'Harvest' | 'Post-Harvest';
  points: number;
  ecoPoints: number;
  verificationType: 'camera' | 'checklist' | 'sensor';
  estimatedDays: number;
  warnings?: string[];
  tools?: string[];
  tutorialVideo?: string;
}

export interface UserCultivationJourney {
  id: string;
  cropId: string;
  cropName: string;
  startDate: string;
  status: 'active' | 'completed' | 'failed';
  currentStepIndex: number;
  steps: {
    stepId: string;
    verified: boolean;
    verifiedAt?: string;
    proofImageUrl?: string;
    aiFeedback?: string;
  }[];
  healthScore: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ForumPost {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  comments: number;
  isAiGenerated?: boolean;
}

export interface GroupMember {
  name: string;
  role: 'Admin' | 'Member';
  points: number;
}

export interface GroupMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  type?: 'chat' | 'system' | 'accomplishment';
  mediaUrl?: string;
}

export interface GroupAccomplishment {
  id: string;
  author: string;
  type: 'photo' | 'tutorial' | 'result';
  mediaUrl: string;
  caption: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: 'Crop' | 'Region' | 'Technique' | 'Livestock';
  image: string;
  members: GroupMember[];
  messages: GroupMessage[];
  challenges: Challenge[];
  accomplishments: GroupAccomplishment[];
  totalPoints: number;
  consistencyDays: number;
  perksUnlocked: string[];
  stabilityFund: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  points: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  type: 'water' | 'compost' | 'pest' | 'other';
  deadline: string;
  status: 'active' | 'completed';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  role: string;
  points: number;
  isCurrentUser?: boolean;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsAwarded: number;
}

export interface Order {
  id: string;
  itemName: string;
  date: string;
  price: number | string;
  status: 'Delivered' | 'In Transit';
}

export interface SurplusCrop {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  image: string;
}

export interface ConversionRecipe {
  id: string;
  productName: string;
  rewardPoints: number;
  description: string;
  videoUrl?: string;
}

export interface Subsidy {
  id: string;
  name: string;
  state: string;
  category: 'Crops' | 'Machinery' | 'Water' | 'Livestock';
  description: string;
  eligibility: string;
  benefits: string;
  process: string;
  link: string;
}

export interface InsuranceScheme {
  id: string;
  name: string;
  type: 'Government' | 'App-Based';
  coverage: string;
  premium: string;
  eligibility: string;
  claimProcess: string;
  link: string;
  eligibleCrops: string[];
  eligibleSteps: string[];
  agency?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsPrice: number;
  image: string;
  category?: 'Inventory' | 'Virtual' | 'Experience' | 'Tech';
}

export interface HumanSafetyProtocol {
  ppeRequired: string[];
  waitPeriod: string;
  humanDetectionWarning: string;
  riskToBystanders: 'Low' | 'Moderate' | 'Severe';
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  photoUrl: string;
  result: DiagnosisResult;
}

export interface DiseaseAlert {
  id: string;
  crop: string;
  disease: string;
  severity: 'Low' | 'Medium' | 'High';
  location: string;
  reportedAt: string;
  distanceKm: number;
}

export interface DiagnosisResult {
  isPlant: boolean;
  plantName: string;
  isHealthy: boolean;
  diagnosis: string;
  severity: 'Low' | 'Medium' | 'High';
  affectedStage: string;
  causeAnalysis: string;
  spreadRisk: 'Minimal' | 'Moderate' | 'Severe';
  organicRemedy: string;
  chemicalRemedy: string;
  preventiveMeasures: string;
  healthScoreImpact: number;
  safetyProtocol: HumanSafetyProtocol;
}

export interface Crop {
  id: string;
  name: string;
  category: string;
  image: string;
  funFact: string;
  subsidies: string[];
  season: 'Kharif' | 'Rabi' | 'Zaid';
  waterRequirement: 'Low' | 'Medium' | 'High';
  waterInstruction: string;
  soilSuitability: string[];
  spacing: string;
  careTips: string[];
  workflow?: CultivationStep[];
}

export interface CropPlot {
  id: number;
  crop: Crop | null;
  progress: number;
  imageUrl: string | null;
  isGeneratingImage?: boolean;
}

export interface Practice {
  slug: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  image: string;
  content: string;
}

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  pointsPrice: number;
  category: 'Seeds' | 'Tools' | 'Machinery' | 'Specials' | 'Livestock';
  image: string;
  requiredPoints?: number;
  requiredBadges?: number;
}

export const CULTIVATION_LIBRARY: Crop[] = [
  {
    id: 'c1',
    name: 'Wheat (Grade A)',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=800',
    funFact: 'Wheat is the global staple that defined modern agriculture.',
    subsidies: ['PM-Kisan', 'MSP Support'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    waterInstruction: 'First irrigation at 20-25 DAS (CRI stage). Total 4-6 irrigations.',
    soilSuitability: ['Alluvial', 'Black'],
    spacing: '22.5 cm × 10 cm',
    careTips: [
      'Maintain 21 days for CRI (Crown Root Initiation) stage',
      'Monitor for Yellow Rust disease during cold spells',
      'Apply nitrogen in three split doses for better grain filling'
    ],
    workflow: [
      { id: 's1', title: 'Land Preparation & Soil Testing', description: 'Deep ploughing (15-20cm), leveling, and collecting soil samples for pH and nutrient analysis. Remove weeds and previous crop residue. Test soil for nitrogen, phosphorus, potassium levels.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 5, tools: ['Plough', 'Leveler', 'Soil Testing Kit'], warnings: ['Ensure proper drainage to prevent waterlogging'], tutorialVideo: 'https://www.youtube.com/embed/Lp5vfJ9N7MQ' },
      { id: 's2', title: 'Seed Selection & Treatment', description: 'Select certified seeds (HD-2967, PBW-343) at 100kg/ha rate. Treat seeds with bio-fungicides like Trichoderma viride @ 4g/kg to protect from soil-borne diseases. Sun-dry treated seeds for 2 hours.', icon: 'Sprout', category: 'Sowing', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2, tools: ['Bio-fungicide', 'Mixing Tray', 'Weighing Scale'], tutorialVideo: 'https://www.youtube.com/embed/qKyqK_rE_eI' },
      { id: 's3', title: 'Sowing & Spacing', description: 'Sow seeds at 5cm depth using seed drill with row spacing of 20-22.5cm. Optimal sowing time: mid-October to mid-November. Ensure uniform seed distribution at 100kg/hectare.', icon: 'Sprout', category: 'Sowing', points: 200, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3, tools: ['Seed Drill', 'Rope Line'], warnings: ['Late sowing reduces yield by 25-30 kg/day'], tutorialVideo: 'https://www.youtube.com/embed/4X_oJlQTPIk' },
      { id: 's4', title: 'Initial Irrigation Setup', description: 'First irrigation (Crown Root Initiation) at 20-25 days after sowing when 2-3 leaves appear. Use drip or flood irrigation. Apply 60mm water to establish deep root system.', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 200, verificationType: 'camera', estimatedDays: 2, tools: ['Drip System', 'Water Pump'], tutorialVideo: 'https://www.youtube.com/embed/8d1nX3nvr_s' },
      { id: 's5', title: 'First Fertilizer Application', description: 'Apply basal dose: 50% nitrogen (60kg Urea/ha), full phosphorus (50kg DAP/ha), full potash (40kg MOP/ha). Mix with soil before sowing or apply in furrows.', icon: 'Zap', category: 'Maintenance', points: 180, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1, tools: ['Fertilizer Spreader', 'Urea', 'DAP', 'MOP'], warnings: ['Avoid direct contact with seeds'], tutorialVideo: 'https://www.youtube.com/embed/vGqh6z_CXTw' },
      { id: 's6', title: 'Pest Monitoring & Weed Control', description: 'Scout for aphids, termites, and armyworms weekly. Apply 2,4-D @ 500ml/ha for broadleaf weeds at 30-35 DAS. Use pheromone traps for early pest detection.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 120, verificationType: 'camera', estimatedDays: 10, tools: ['Sprayer', 'Herbicide', 'Pheromone Traps'], warnings: ['Wear protective gear during spraying'], tutorialVideo: 'https://www.youtube.com/embed/MjEHd6kz8HU' },
      { id: 's7', title: 'Mid-Season Care & Tillering', description: 'Apply second irrigation at tillering stage (40-45 DAS). Top dress with 25% nitrogen (30kg Urea) at this stage. Ensure 4-5 tillers per plant for optimal yield.', icon: 'Wheat', category: 'Maintenance', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 5, tools: ['Water Channel', 'Urea'], tutorialVideo: 'https://www.youtube.com/embed/CvHa5z9OPT4' },
      { id: 's8', title: 'Flowering & Grain Filling Support', description: 'Critical irrigation at flowering (60-65 DAS) and milky stage (80-85 DAS). Apply remaining 25% nitrogen. Monitor for rust diseases and apply fungicide if detected.', icon: 'Zap', category: 'Maintenance', points: 170, ecoPoints: 90, verificationType: 'camera', estimatedDays: 25, tools: ['Irrigation System', 'Fungicide'], warnings: ['Water stress at flowering reduces yield significantly'], tutorialVideo: 'https://www.youtube.com/embed/Y9LkH_sL1Xo' },
      { id: 's9', title: 'Pre-Harvest Assessment', description: 'Check grain moisture (14-16%), golden color of stems, and hardness of grains by nail test. Stop irrigation 15 days before harvest. Plan harvesting logistics and machinery.', icon: 'Check', category: 'Harvest', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 7, tools: ['Moisture Meter', 'Grain Sample Bags'], tutorialVideo: 'https://www.youtube.com/embed/wDjhOjP3HXg' },
      { id: 's10', title: 'Harvesting & Post-Harvest', description: 'Harvest when grain moisture is 12-14% using combine harvester. Thresh within 24 hours. Dry grains to 10-12% moisture for storage. Store in moisture-proof containers.', icon: 'Wheat', category: 'Harvest', points: 250, ecoPoints: 150, verificationType: 'camera', estimatedDays: 5, tools: ['Combine Harvester', 'Thresher', 'Storage Bins'], warnings: ['Delayed harvest causes grain shattering losses'], tutorialVideo: 'https://www.youtube.com/embed/6U2wL7L9a_c' }
    ]
  },
  {
    id: 'c2',
    name: 'Basmati Rice',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    funFact: 'The long grains and unique aroma are global exports.',
    subsidies: ['Export Incentive'],
    season: 'Kharif',
    waterRequirement: 'High',
    waterInstruction: 'Keep field moist/flooded (2-5 cm water level) until maturity.',
    soilSuitability: ['Alluvial', 'Clayey'],
    spacing: '20 cm × 20 cm',
    careTips: [
      'Keep field flooded (2-5 cm) to suppress weed growth',
      'Monitor for stem borer and leaf folder pests',
      'Use organic manure during puddling for aroma enhancement'
    ],
    workflow: [
      { id: 'b1', title: 'Nursery Bed Preparation', description: 'Prepare raised nursery beds 1.25m wide with fine tilth. Apply 20kg FYM and 50g each of N, P, K per 100m². Ensure proper drainage. Ideal nursery area: 1/20th of main field.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 3, tools: ['Rake', 'FYM', 'Leveling Board'], warnings: ['Avoid low-lying waterlogged areas for nursery'], tutorialVideo: 'https://www.youtube.com/embed/kJpRwK4SXqY' },
      { id: 'b2', title: 'Seed Selection & Treatment', description: 'Use certified Basmati seeds (Pusa 1121, 1509) at 30kg/ha. Soak in salt water (1.08 specific gravity) to remove unfilled grains. Treat with Carbendazim @ 2g/kg or Trichoderma @ 5g/kg.', icon: 'Sprout', category: 'Sowing', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2, tools: ['Seed Container', 'Fungicide', 'Salt'], tutorialVideo: 'https://www.youtube.com/embed/8HAneKHNIXg' },
      { id: 'b3', title: 'Nursery Sowing & Care', description: 'Broadcast pre-germinated seeds uniformly at 100g/m². Keep beds moist initially, then maintain thin water layer. Seedlings ready for transplanting in 25-30 days when 3-4 leaves appear.', icon: 'Droplets', category: 'Sowing', points: 150, ecoPoints: 60, verificationType: 'camera', estimatedDays: 25, tools: ['Watering Can', 'Shade Net'], tutorialVideo: 'https://www.youtube.com/embed/ZjGl3KnQMsk' },
      { id: 'b4', title: 'Main Field Puddling', description: 'Flood field with 5cm water, plough and cross-plough to create puddle. Level field precisely for uniform water depth. Add basal fertilizer: 50kg DAP, 30kg MOP per hectare before final puddling.', icon: 'Tractor', category: 'Preparation', points: 180, ecoPoints: 100, verificationType: 'camera', estimatedDays: 4, tools: ['Puddler', 'Leveler', 'DAP', 'MOP'], tutorialVideo: 'https://www.youtube.com/embed/N8gVLxR8XhU' },
      { id: 'b5', title: 'Transplantation', description: 'Transplant 25-30 day old seedlings at 2-3 seedlings per hill with 20x15cm spacing. Plant at 3-4cm depth in rows. Complete within 2-3 days of uprooting. Optimal time: June-July.', icon: 'Sprout', category: 'Sowing', points: 250, ecoPoints: 120, verificationType: 'camera', estimatedDays: 5, tools: ['Transplanter', 'Rope Line'], warnings: ['Delayed transplanting reduces yield by 50kg/ha per day'], tutorialVideo: 'https://www.youtube.com/embed/kfvLI4qXfxI' },
      { id: 'b6', title: 'Water Management & Initial Care', description: 'Maintain 5cm standing water for first 2 weeks, then alternate wetting-drying. First weeding at 20 DAT. Apply 50kg Urea/ha as first top dressing at 3 weeks after transplanting.', icon: 'Droplets', category: 'Maintenance', points: 160, ecoPoints: 200, verificationType: 'camera', estimatedDays: 20, tools: ['Weeder', 'Urea', 'Water Channel'], tutorialVideo: 'https://www.youtube.com/embed/5QGCo9Nb9ao' },
      { id: 'b7', title: 'Pest & Disease Monitoring', description: 'Scout for stem borer, leaf folder, BPH weekly. Install pheromone traps at 5/ha. Check for blast, sheath blight. Apply Tricyclazole for blast, Hexaconazole for sheath rot if detected.', icon: 'ShieldCheck', category: 'Protection', points: 140, ecoPoints: 100, verificationType: 'camera', estimatedDays: 30, tools: ['Pheromone Traps', 'Sprayer', 'Fungicide'], warnings: ['Avoid pesticide application during flowering'], tutorialVideo: 'https://www.youtube.com/embed/pR4XcRz5A1A' },
      { id: 'b8', title: 'Panicle Initiation & Flowering Care', description: 'Second top dressing of 30kg Urea at panicle initiation (45 DAT). Maintain continuous flooding during flowering. Apply 2% Urea spray + micronutrients for grain filling enhancement.', icon: 'Zap', category: 'Maintenance', points: 180, ecoPoints: 90, verificationType: 'camera', estimatedDays: 25, tools: ['Urea', 'Micronutrient Mix', 'Sprayer'], warnings: ['Water stress during flowering causes unfilled grains'], tutorialVideo: 'https://www.youtube.com/embed/9YJLj4rWr0U' },
      { id: 'b9', title: 'Pre-Harvest Preparation', description: 'Drain field 15 days before harvest. Check grain moisture (20-22%) and 80% straw turn golden. Arrange combine harvester or labor. Check grain filling by pressing - should be hard and dent-free.', icon: 'Check', category: 'Harvest', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 10, tools: ['Moisture Meter', 'Sample Bags'], tutorialVideo: 'https://www.youtube.com/embed/qK2pM6xPLGE' },
      { id: 'b10', title: 'Harvesting & Post-Harvest', description: 'Harvest at 20-22% grain moisture. Thresh immediately to prevent discoloration. Sun-dry to 14% moisture in thin layers. Store in gunny bags in cool, dry place. Avoid mixing with other varieties.', icon: 'Wheat', category: 'Harvest', points: 300, ecoPoints: 150, verificationType: 'camera', estimatedDays: 5, tools: ['Combine Harvester', 'Tarpaulin', 'Gunny Bags'], warnings: ['Over-drying causes grain cracking and quality loss'], tutorialVideo: 'https://www.youtube.com/embed/3PkRLz8a0xk' }
    ]
  },
  {
    id: 'c3',
    name: 'Cotton (Bt)',
    category: 'Cash Crops',
    image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?auto=format&fit=crop&q=80&w=800',
    funFact: 'India is the largest producer of cotton in the world.',
    subsidies: ['Cotton Corporation Support', 'MSP'],
    season: 'Kharif',
    waterRequirement: 'Medium',
    waterInstruction: '4-6 irrigations depending on rainfall. Critical at flowering.',
    soilSuitability: ['Black', 'Alluvial', 'Red'],
    spacing: '90 cm × 60 cm',
    careTips: [
      'Deep ploughing to control soil-borne pests',
      'Square formation stage is critical for irrigation',
      'Control whitefly and jassids for fiber quality'
    ],
    workflow: [
      { id: 'ct1', title: 'Field Preparation', description: 'Deep summer ploughing (30cm) to expose soil to sun. Apply 10 tons FYM/ha. Form beds or ridges at 90-120cm spacing depending on variety.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5, tools: ['Plough', 'Ridger', 'FYM'], tutorialVideo: 'https://www.youtube.com/embed/0fH_V9QJ_Mw' },
      { id: 'ct2', title: 'Seed Selection & Treatment', description: 'Use certified Bt cotton seeds (Bollgard II). Treat with Imidacloprid @ 5ml/kg for sucking pest protection. Maintain 2.5kg seeds per hectare.', icon: 'Sprout', category: 'Sowing', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1, tools: ['Seed Treating Drum', 'Imidacloprid'], tutorialVideo: 'https://www.youtube.com/embed/XnJKZq9J1bs' },
      { id: 'ct3', title: 'Sowing', description: 'Sow on ridges at 90x60cm spacing with 3-4cm depth. Optimal time: June-July after pre-monsoon showers. Use dibbling method for precise placement.', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 70, verificationType: 'camera', estimatedDays: 3, tools: ['Dibbler', 'Planting Rope'], warnings: ['Avoid waterlogged conditions'], tutorialVideo: 'https://www.youtube.com/embed/rLQGp0vKnhI' },
      { id: 'ct4', title: 'Gap Filling & Thinning', description: 'Fill gaps within 10 days of sowing. Thin to one healthy plant per hill at 15-20 DAS. Ensure uniform plant population of 11,000-12,000/ha.', icon: 'Sprout', category: 'Maintenance', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 5, tools: ['Hand Trowel'], tutorialVideo: 'https://www.youtube.com/embed/dxJzgGqXcxY' },
      { id: 'ct5', title: 'First Irrigation & Fertilizer', description: 'First irrigation at 3 weeks. Apply 60kg N, 30kg P, 30kg K per hectare as basal + 30kg N at square formation. Use drip for water efficiency.', icon: 'Droplets', category: 'Maintenance', points: 160, ecoPoints: 180, verificationType: 'camera', estimatedDays: 2, tools: ['Drip System', 'Urea', 'DAP'], tutorialVideo: 'https://www.youtube.com/embed/wFN9FQxjE6Y' },
      { id: 'ct6', title: 'Pest Scouting & IPM', description: 'Weekly scouting for bollworms, whitefly, jassids. Install yellow sticky traps. Spray neem oil @ 5ml/L for minor infestations. Maintain refuge crop (20% non-Bt).', icon: 'ShieldCheck', category: 'Protection', points: 150, ecoPoints: 120, verificationType: 'camera', estimatedDays: 60, tools: ['Sticky Traps', 'Neem Oil', 'Sprayer'], warnings: ['Early pest detection is critical'], tutorialVideo: 'https://www.youtube.com/embed/b7N2I2RKPMU' },
      { id: 'ct7', title: 'Flowering & Boll Formation', description: 'Apply second N dose (30kg) at flowering (60 DAS). Maintain soil moisture during boll development. Apply 2% DAP spray for enhanced boll weight.', icon: 'Zap', category: 'Maintenance', points: 170, ecoPoints: 90, verificationType: 'camera', estimatedDays: 30, tools: ['Foliar Sprayer', 'DAP'], tutorialVideo: 'https://www.youtube.com/embed/K3hJQz5qYnY' },
      { id: 'ct8', title: 'Boll Opening Management', description: 'Stop irrigation 3 weeks before expected harvest. Apply defoliant if needed for mechanical picking. Monitor for pink bollworm with pheromone traps.', icon: 'Check', category: 'Maintenance', points: 140, ecoPoints: 70, verificationType: 'camera', estimatedDays: 20, tools: ['Pheromone Traps'], tutorialVideo: 'https://www.youtube.com/embed/uJmLN1qLSEg' },
      { id: 'ct9', title: 'First Picking', description: 'Start picking when 40-50% bolls open. Pick only fully opened, fluffy bolls. Avoid mixing with yellow/stained cotton. Use clean cloth bags.', icon: 'Wheat', category: 'Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 5, tools: ['Picking Bags', 'Weighing Scale'], tutorialVideo: 'https://www.youtube.com/embed/L3TZjz5rHlQ' },
      { id: 'ct10', title: 'Second Picking & Storage', description: 'Second picking at 2-week interval. Total 3-4 pickings needed. Dry kapas to 8-10% moisture. Store in moisture-proof godowns away from fertilizers.', icon: 'Wheat', category: 'Harvest', points: 250, ecoPoints: 130, verificationType: 'camera', estimatedDays: 10, tools: ['Storage Bags', 'Moisture Meter'], warnings: ['Wet cotton causes quality deterioration'], tutorialVideo: 'https://www.youtube.com/embed/RnKcL9Q3EZE' }
    ]
  },
  {
    id: 'c4',
    name: 'Sugarcane',
    category: 'Cash Crops',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
    funFact: 'India is the second largest producer of sugarcane globally.',
    subsidies: ['Sugar Development Fund', 'State Cane Price'],
    season: 'Kharif',
    waterRequirement: 'High',
    waterInstruction: 'Req 1500-2500 mm. Frequent during germination and tillering.',
    soilSuitability: ['Alluvial', 'Black', 'Loamy'],
    spacing: '90 cm (Row Spacing)',
    careTips: [
      'Earthing up at 3 and 5 months prevents lodging',
      'Propping should be done to support heavy canes',
      'Monitor for red rot and smut diseases'
    ],
    workflow: [
      { id: 'sg1', title: 'Deep Ploughing & Furrowing', description: 'Deep ploughing (45cm) followed by harrowing. Make furrows 75-90cm apart and 20-25cm deep. Apply 25 tons FYM per hectare in furrows.', icon: 'Tractor', category: 'Preparation', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 5, tools: ['Subsoiler', 'Furrower', 'FYM'], tutorialVideo: 'https://www.youtube.com/embed/Q7ZxHw9TnQg' },
      { id: 'sg2', title: 'Sett Selection & Treatment', description: 'Select 9-10 month old cane for setts. Cut into 3-bud setts. Treat with Carbendazim (0.1%) for 15 min. Use 40,000 setts per hectare.', icon: 'Sprout', category: 'Sowing', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2, tools: ['Sett Cutter', 'Fungicide Solution'], tutorialVideo: 'https://www.youtube.com/embed/j8xnXJa9M_s' },
      { id: 'sg3', title: 'Planting', description: 'Place setts horizontally in furrows with buds facing up. Cover with 5-7cm soil. Optimal planting: Feb-March (spring) or Oct (autumn). Trench method for better yields.', icon: 'Sprout', category: 'Sowing', points: 200, ecoPoints: 80, verificationType: 'camera', estimatedDays: 4, tools: ['Planting Basket'], warnings: ['Avoid planting in waterlogged soil'], tutorialVideo: 'https://www.youtube.com/embed/fLxN0GnPKQw' },
      { id: 'sg4', title: 'Gap Filling', description: 'Fill gaps within 30 days using sprouted setts from nursery. Maintain 85-90% germination. Critical for achieving target yield of 100 tons/ha.', icon: 'Sprout', category: 'Maintenance', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 5, tools: ['Sprouted Setts'], tutorialVideo: 'https://www.youtube.com/embed/wRqJvBqVZpA' },
      { id: 'sg5', title: 'First Earthing Up & Fertilizer', description: 'First earthing at 45 days. Apply 75kg N + 40kg P + 40kg K per hectare. Split N in 3 doses. Use trash mulching for moisture conservation.', icon: 'Zap', category: 'Maintenance', points: 180, ecoPoints: 150, verificationType: 'camera', estimatedDays: 3, tools: ['Ridger', 'Urea', 'Mulch'], tutorialVideo: 'https://www.youtube.com/embed/kxPmn3N5BEU' },
      { id: 'sg6', title: 'Irrigation Management', description: 'Irrigate every 7-10 days in summer, 15-20 days in winter. Critical stages: tillering and grand growth. Adopt drip/furrow irrigation for efficiency.', icon: 'Droplets', category: 'Maintenance', points: 160, ecoPoints: 200, verificationType: 'camera', estimatedDays: 90, tools: ['Drip System', 'Furrow Irrigation'], tutorialVideo: 'https://www.youtube.com/embed/5xLvPmJ9xHc' },
      { id: 'sg7', title: 'Pest & Disease Control', description: 'Monitor for early shoot borer, top borer, scale insects. Release Trichogramma parasites @ 50,000/ha. Check for red rot, smut diseases regularly.', icon: 'ShieldCheck', category: 'Protection', points: 150, ecoPoints: 110, verificationType: 'camera', estimatedDays: 60, tools: ['Trichogramma Cards', 'Light Traps'], warnings: ['Destroy affected canes immediately'], tutorialVideo: 'https://www.youtube.com/embed/Y7tpQqHNf8g' },
      { id: 'sg8', title: 'Second Earthing & Propping', description: 'Second earthing at 90 days with remaining N dose. Tie canes in bundles to prevent lodging. Remove water suckers and dried leaves.', icon: 'Tractor', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 5, tools: ['Rope', 'Sickle'], tutorialVideo: 'https://www.youtube.com/embed/u9N7R3aqMJc' },
      { id: 'sg9', title: 'Maturity Assessment', description: 'Check brix reading (18-20%) using refractometer. Cane should be 10-12 months old. Stop irrigation 15 days before harvest. Inform sugar mill.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 7, tools: ['Refractometer', 'Brix Meter'], tutorialVideo: 'https://www.youtube.com/embed/pgK8R0vE1Pc' },
      { id: 'sg10', title: 'Harvesting', description: 'Harvest at ground level using sharp cane knife. Remove tops and trash. Transport within 24 hours to mill. Ratoon management for next crop.', icon: 'Wheat', category: 'Harvest', points: 300, ecoPoints: 150, verificationType: 'camera', estimatedDays: 10, tools: ['Cane Harvester', 'Transport Cart'], warnings: ['Delayed crushing reduces sugar recovery'], tutorialVideo: 'https://www.youtube.com/embed/3CRwXfdhJ0Q' }
    ]
  },
  {
    id: 'c5',
    name: 'Tomato',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    funFact: 'India produces 20 million tonnes of tomatoes annually.',
    subsidies: ['Horticulture Mission', 'MIDH'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    waterInstruction: 'Weekly irrigation during summer. Avoid water on leaves.',
    soilSuitability: ['Sandy Loam', 'Red', 'Black'],
    spacing: '60 cm × 45 cm',
    careTips: [
      'Provide staking for indeterminate varieties',
      'Regular pruning of side shoots enhances fruit size',
      'Apply calcium nitrate to prevent blossom end rot'
    ],
    workflow: [
      { id: 'tm1', title: 'Nursery Preparation', description: 'Prepare raised beds 1m wide with well-decomposed FYM. Treat soil with Trichoderma. Sow seeds in lines 5cm apart at 0.5cm depth.', icon: 'Sprout', category: 'Preparation', points: 100, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5, tools: ['Raised Bed', 'Trichoderma', 'Shade Net'], tutorialVideo: 'https://www.youtube.com/embed/RmcFdZPvqDw' },
      { id: 'tm2', title: 'Seedling Care', description: 'Maintain nursery moisture, apply light irrigation daily. Harden seedlings 7 days before transplant. Ready in 25-30 days when 4-5 leaves appear.', icon: 'Droplets', category: 'Preparation', points: 80, ecoPoints: 50, verificationType: 'camera', estimatedDays: 25, tools: ['Watering Can', 'Nursery Bags'], tutorialVideo: 'https://www.youtube.com/embed/vP6ZcNkqUYw' },
      { id: 'tm3', title: 'Main Field Preparation', description: 'Deep ploughing, apply 25 tons FYM/ha. Make beds or ridges at 60cm spacing. Install drip irrigation with mulch sheet for better yields.', icon: 'Tractor', category: 'Preparation', points: 120, ecoPoints: 100, verificationType: 'camera', estimatedDays: 4, tools: ['Plough', 'Mulch Film', 'Drip Lines'], tutorialVideo: 'https://www.youtube.com/embed/6X9b7NLp3nA' },
      { id: 'tm4', title: 'Transplanting', description: 'Transplant in evening at 60x45cm spacing. Plant at same depth as nursery. Water immediately after transplanting. Stake support if indeterminate variety.', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3, tools: ['Transplanter', 'Stakes', 'Twine'], warnings: ['Avoid mid-day transplanting'], tutorialVideo: 'https://www.youtube.com/embed/z7e2f3xJ4K8' },
      { id: 'tm5', title: 'Fertilizer Application', description: 'Apply basal: 50kg N, 50kg P, 50kg K per hectare. Fertigation through drip: 25kg N every 2 weeks. Add micronutrients (Boron, Calcium) for quality fruits.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2, tools: ['Fertigation Tank', 'NPK', 'Micronutrients'], tutorialVideo: 'https://www.youtube.com/embed/mK9P5v2gRHI' },
      { id: 'tm6', title: 'Staking & Pruning', description: 'Stake plants when 30cm tall. Prune side shoots below first flower cluster for determinate varieties. Train main stem on string for greenhouse cultivation.', icon: 'Sprout', category: 'Maintenance', points: 130, ecoPoints: 70, verificationType: 'camera', estimatedDays: 7, tools: ['Stakes', 'Pruning Scissors', 'Twine'], tutorialVideo: 'https://www.youtube.com/embed/9bQcV8LXNR4' },
      { id: 'tm7', title: 'Pest & Disease Management', description: 'Scout for whitefly, fruit borer, leaf miner weekly. Check for early/late blight, bacterial wilt. Apply Triazophos for borers, Mancozeb for blights.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 100, verificationType: 'camera', estimatedDays: 45, tools: ['Yellow Traps', 'Sprayer', 'Fungicide'], warnings: ['Remove and destroy infected plants'], tutorialVideo: 'https://www.youtube.com/embed/c8WpHQvZ9hU' },
      { id: 'tm8', title: 'Flowering & Fruit Set', description: 'Apply calcium nitrate spray during flowering for preventing blossom end rot. Ensure adequate pollination. Maintain 60-70% humidity for better fruit set.', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 20, tools: ['Calcium Nitrate', 'Sprayer'], tutorialVideo: 'https://www.youtube.com/embed/FpR5NdVqJXc' },
      { id: 'tm9', title: 'First Harvest', description: 'Start harvest at breaker/turning stage (45-50 DAT) for distant markets. For local sale, harvest at pink/light red stage. Pick every 3-4 days.', icon: 'Wheat', category: 'Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 5, tools: ['Harvesting Crate', 'Gloves'], tutorialVideo: 'https://www.youtube.com/embed/W8HvPk3LmKo' },
      { id: 'tm10', title: 'Continued Harvest & Storage', description: 'Total harvest period: 8-10 weeks with 10-12 pickings. Grade by size and color. Store at 12-15°C for ripe, 20°C for green tomatoes. Avoid refrigeration below 10°C.', icon: 'Check', category: 'Post-Harvest', points: 180, ecoPoints: 120, verificationType: 'camera', estimatedDays: 60, tools: ['Grading Table', 'Crates'], warnings: ['Cold injury occurs below 10°C'], tutorialVideo: 'https://www.youtube.com/embed/nL2eRqS1r1Y' }
    ]
  },
  {
    id: 'c6',
    name: 'Potato',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber639?auto=format&fit=crop&q=80&w=800',
    funFact: 'India is the second largest potato producer after China.',
    subsidies: ['Potato Development Scheme'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    waterInstruction: '7-10 day intervals. Critical during stolonization and bulking.',
    soilSuitability: ['Sandy Loam', 'Alluvial'],
    spacing: '60 cm × 20 cm',
    careTips: [
      'Earthing up is crucial to cover expanding tubers',
      'Monitor for Late Blight in cloudy/humid weather',
      'Stop irrigation 15 days before harvest for skin hardening'
    ],
    workflow: [
      { id: 'pt1', title: 'Field Preparation', description: 'Deep ploughing (25-30cm) in summer. Apply 20-25 tons FYM/ha. Make ridges 60cm apart and 15-20cm high. Ensure good drainage.', icon: 'Tractor', category: 'Preparation', points: 110, ecoPoints: 70, verificationType: 'camera', estimatedDays: 4, tools: ['Plough', 'Ridger', 'FYM'], tutorialVideo: 'https://www.youtube.com/embed/8HqKnRLG0IY' },
      { id: 'pt2', title: 'Seed Selection & Treatment', description: 'Use certified seed tubers (30-40g). Cold store at 2-4°C before planting. Treat with Mancozeb + Streptocycline solution. Require 20-25 quintals/ha.', icon: 'Sprout', category: 'Sowing', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2, tools: ['Seed Tubers', 'Treatment Solution'], warnings: ['Avoid diseased or sprouted tubers'], tutorialVideo: 'https://www.youtube.com/embed/LpQvXNY6J8U' },
      { id: 'pt3', title: 'Planting', description: 'Plant on ridges at 20cm spacing within rows. Place tubers 5-7cm deep with eyes facing up. Optimal time: Oct-Nov (plains), Feb-Mar (hills).', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3, tools: ['Dibbler', 'Planter'], tutorialVideo: 'https://www.youtube.com/embed/QxMV3rFgT8s' },
      { id: 'pt4', title: 'First Irrigation', description: 'Light irrigation immediately after planting. Repeat every 7-10 days. Critical moisture needed at stolon formation (30-40 DAP). Avoid waterlogging.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 180, verificationType: 'camera', estimatedDays: 5, tools: ['Sprinkler', 'Furrow Channel'], tutorialVideo: 'https://www.youtube.com/embed/K5vP7mWzN3A' },
      { id: 'pt5', title: 'Earthing Up & Fertilizer', description: 'First earthing at 25-30 DAP. Apply 120kg N, 80kg P, 100kg K per hectare in splits. Second earthing at 45 DAP to cover developing tubers.', icon: 'Tractor', category: 'Maintenance', points: 170, ecoPoints: 100, verificationType: 'camera', estimatedDays: 3, tools: ['Ridger', 'NPK Fertilizers'], tutorialVideo: 'https://www.youtube.com/embed/4H2nQxVpL0c' },
      { id: 'pt6', title: 'Pest Surveillance', description: 'Monitor for aphids, cutworms, potato tuber moth. Check for late blight (Phytophthora) especially in foggy weather. Install pheromone traps.', icon: 'ShieldCheck', category: 'Protection', points: 150, ecoPoints: 110, verificationType: 'camera', estimatedDays: 30, tools: ['Traps', 'Mancozeb', 'Sprayer'], warnings: ['Late blight spreads rapidly in humid conditions'], tutorialVideo: 'https://www.youtube.com/embed/u9eJLn9Qp8E' },
      { id: 'pt7', title: 'Late Blight Management', description: 'Prophylactic spray of Mancozeb @ 2g/L every 7 days in susceptible period. Use systemic fungicides if infection starts. Remove infected plants.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 90, verificationType: 'camera', estimatedDays: 20, tools: ['Systemic Fungicide', 'Knapsack Sprayer'], tutorialVideo: 'https://www.youtube.com/embed/rG3XdHvM7eA' },
      { id: 'pt8', title: 'Tuber Bulking', description: 'Critical irrigation during 50-80 DAP for size development. Apply potassium nitrate foliar spray for quality. Reduce nitrogen after 60 DAP.', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 30, tools: ['Potassium Nitrate', 'Irrigation System'], tutorialVideo: 'https://www.youtube.com/embed/hL5sNwF2A6k' },
      { id: 'pt9', title: 'Dehaulming', description: 'Cut or destroy foliage 10-15 days before harvest for skin hardening. Reduces tuber moth damage. Stop irrigation after dehaulming.', icon: 'Check', category: 'Harvest', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 3, tools: ['Sickle', 'Dehaulmer'], tutorialVideo: 'https://www.youtube.com/embed/VQ8nJ4r1Wqc' },
      { id: 'pt10', title: 'Harvesting & Storage', description: 'Harvest when soil is dry using potato digger. Cure tubers in shade for 10-14 days. Store in cold storage at 2-4°C or country store with ventilation.', icon: 'Wheat', category: 'Harvest', points: 250, ecoPoints: 140, verificationType: 'camera', estimatedDays: 7, tools: ['Potato Digger', 'Curing Shed', 'Storage Bags'], warnings: ['Avoid harvesting in wet conditions'], tutorialVideo: 'https://www.youtube.com/embed/WM3t1Lbn4SE' }
    ]
  },
  {
    id: 'c7',
    name: 'Maize (Corn)',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1601494839498-9f09e8e3d9f7?auto=format&fit=crop&q=80&w=800',
    funFact: 'Maize has the highest production potential among cereals.',
    subsidies: ['Maize Development Programme'],
    season: 'Kharif',
    waterRequirement: 'Medium',
    waterInstruction: 'Tasseling and silking stages are critical for moisture.',
    soilSuitability: ['Loamy', 'Sandy Loam', 'Alluvial'],
    spacing: '60 cm × 20 cm',
    careTips: [
      'Maintain weed-free environment for first 45 days',
      'Tasseling and silking are critical water stages',
      'Monitor for Fall Armyworm (FAW) regularly'
    ],
    workflow: [
      { id: 'mz1', title: 'Land Preparation', description: 'Plough 2-3 times to achieve fine tilth. Apply 10 tons FYM/ha. Level field for uniform irrigation. Make furrows at 60-75cm spacing.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 60, verificationType: 'camera', estimatedDays: 4, tools: ['Plough', 'Harrow', 'Leveler'], tutorialVideo: 'https://www.youtube.com/embed/wH5L7P1KJvI' },
      { id: 'mz2', title: 'Seed Treatment & Selection', description: 'Use certified hybrid seeds (PEHM-5, DHM-117). Treat with Thiram @ 3g/kg. Seed rate: 18-20kg/ha for hybrids. Dry treated seeds before sowing.', icon: 'Sprout', category: 'Sowing', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1, tools: ['Thiram', 'Seed Drum'], tutorialVideo: 'https://www.youtube.com/embed/6xNQP4dL2hE' },
      { id: 'mz3', title: 'Sowing', description: 'Sow at 5-7cm depth with 60x20cm spacing using seed drill. Optimal time: June-July (Kharif), Oct-Nov (Rabi). Ensure 75,000-80,000 plants/ha.', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2, tools: ['Seed Drill', 'Planter'], warnings: ['Delays reduce yield significantly'], tutorialVideo: 'https://www.youtube.com/embed/R9vJq8F3Uc4' },
      { id: 'mz4', title: 'Thinning & Gap Filling', description: 'Thin to one plant per hill at 10-15 DAS. Fill gaps immediately using transplants from thick areas. Target: 65-70 thousand plants/ha.', icon: 'Sprout', category: 'Maintenance', points: 90, ecoPoints: 50, verificationType: 'camera', estimatedDays: 3, tools: ['Hand Hoe'], tutorialVideo: 'https://www.youtube.com/embed/5Mn3LqQpVKE' },
      { id: 'mz5', title: 'First Fertilizer & Irrigation', description: 'Apply full P&K and 1/3 N as basal. First irrigation at 3 weeks. Use drip for 40% water savings. Critical stage: knee-high (V6).', icon: 'Droplets', category: 'Maintenance', points: 160, ecoPoints: 180, verificationType: 'camera', estimatedDays: 5, tools: ['Drip System', 'NPK', 'Urea'], tutorialVideo: 'https://www.youtube.com/embed/KH3nM8xP1Ro' },
      { id: 'mz6', title: 'Weed Management', description: 'Pre-emergence: Atrazine @ 1.5kg/ha within 3 DAS. Mechanical weeding at 20-25 DAS. Critical weed-free period: first 45 days.', icon: 'Tractor', category: 'Protection', points: 140, ecoPoints: 100, verificationType: 'camera', estimatedDays: 7, tools: ['Herbicide', 'Weeder'], warnings: ['Late weeding reduces yield by 30%'], tutorialVideo: 'https://www.youtube.com/embed/L9VKl8PqR4c' },
      { id: 'mz7', title: 'Top Dressing & Earthing', description: 'Apply second 1/3 nitrogen at knee-high stage (25-30 DAS). Final 1/3 at tasseling. Earthing up to provide root support and reduce lodging.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3, tools: ['Urea', 'Earthing Blade'], tutorialVideo: 'https://www.youtube.com/embed/8XwJN5vQnPY' },
      { id: 'mz8', title: 'Pest & Disease Monitoring', description: 'Scout for stem borer and Fall armyworm (FAW). Check for leaf blight, downy mildew. Apply Spinosad for FAW, Mancozeb for blights.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 110, verificationType: 'camera', estimatedDays: 40, tools: ['Light Traps', 'Pesticide', 'Sprayer'], tutorialVideo: 'https://www.youtube.com/embed/dP5nRxQJ7Wg' },
      { id: 'mz9', title: 'Silking & Grain Fill', description: 'Critical irrigation at silking and grain filling (60-80 DAS). Water stress reduces grain weight. Apply zinc sulfate spray if deficiency seen.', icon: 'Droplets', category: 'Maintenance', points: 170, ecoPoints: 90, verificationType: 'camera', estimatedDays: 20, tools: ['Irrigation', 'Zinc Sulfate'], warnings: ['Water stress at silking causes barren cobs'], tutorialVideo: 'https://www.youtube.com/embed/fG9vLR6oP2A' },
      { id: 'mz10', title: 'Harvesting & Storage', description: 'Harvest when husks turn brown and grain moisture is 20-25%. Dry to 12-14% for storage. Shell and store in airtight containers with fumigation if needed.', icon: 'Wheat', category: 'Harvest', points: 250, ecoPoints: 140, verificationType: 'camera', estimatedDays: 5, tools: ['Maize Harvester', 'Sheller', 'Storage Bins'], warnings: ['High moisture causes aflatoxin growth'], tutorialVideo: 'https://www.youtube.com/embed/3TjKvS9qH6U' }
    ]
  },
  {
    id: 'c8',
    name: 'Mustard',
    category: 'Oilseeds',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
    funFact: 'India is the third largest mustard producer in the world.',
    subsidies: ['National Mission on Oilseeds', 'MSP'],
    season: 'Rabi',
    waterRequirement: 'Low',
    waterInstruction: '3-4 irrigations. Critical at rosette and pod filling.',
    soilSuitability: ['Loamy', 'Sandy Loam', 'Alluvial'],
    spacing: '30 cm × 15 cm',
    careTips: [
      'Thinning at 20 days is essential for uniform growth',
      'Sulfur application increases oil content significantly',
      'Scout for mustard aphids during January-February'
    ],
    workflow: [
      { id: 'ms1', title: 'Field Preparation', description: 'One deep ploughing followed by 2-3 harrowing. Apply 5-6 tons FYM/ha. Fine tilth essential for seed germination. Level field for uniform irrigation.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 70, verificationType: 'camera', estimatedDays: 4, tools: ['Plough', 'Harrow', 'Leveler'], tutorialVideo: 'https://www.youtube.com/embed/xQ7v1Lp3JnM' },
      { id: 'ms2', title: 'Seed Treatment', description: 'Use certified seeds of Pusa Bold, RH-30. Seed rate: 4-5kg/ha. Treat with Thiram @ 2g/kg + Imidacloprid for pest protection.', icon: 'Sprout', category: 'Sowing', points: 110, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1, tools: ['Seed Treatment Drum', 'Thiram'], tutorialVideo: 'https://www.youtube.com/embed/n9A8Km3D4Hs' },
      { id: 'ms3', title: 'Sowing', description: 'Sow at 3-4cm depth in rows 30-45cm apart. Optimal time: Oct 15 - Nov 5. Use seed drill for uniform sowing at 75,000 plants/ha.', icon: 'Sprout', category: 'Sowing', points: 160, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2, tools: ['Seed Drill'], warnings: ['Late sowing causes aphid damage and low yield'], tutorialVideo: 'https://www.youtube.com/embed/Wk8N5qR6cV4' },
      { id: 'ms4', title: 'Thinning', description: 'Thin plants at 15-20 DAS to maintain 10-12cm between plants. Remove weak, diseased, or overcrowded plants. Optimal population: 200,000/ha.', icon: 'Sprout', category: 'Maintenance', points: 80, ecoPoints: 40, verificationType: 'camera', estimatedDays: 3, tools: ['Hand Hoe'], tutorialVideo: 'https://www.youtube.com/embed/7Lv2P8eJqXo' },
      { id: 'ms5', title: 'Fertilizer Application', description: 'Apply 40kg N, 20kg P, 20kg S per hectare. Full P, K, S as basal. Half N as basal, half at 30 DAS. Sulfur is critical for oil content.', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2, tools: ['Urea', 'DAP', 'Sulfur'], tutorialVideo: 'https://www.youtube.com/embed/h4X9Lv5nQKw' },
      { id: 'ms6', title: 'Irrigation Management', description: 'First irrigation at 25-30 DAS (pre-flowering). Second at pod filling (50-55 DAS). Avoid water stress during flowering. Total 2-3 irrigations needed.', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 160, verificationType: 'camera', estimatedDays: 10, tools: ['Sprinkler', 'Flood Irrigation'], warnings: ['Excess water causes white rust disease'], tutorialVideo: 'https://www.youtube.com/embed/P9wL3K8mC2Y' },
      { id: 'ms7', title: 'Pest & Disease Control', description: 'Monitor for mustard aphid especially in Jan-Feb. Check for white rust, Alternaria blight. Spray Imidacloprid for aphids, Mancozeb for diseases.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 100, verificationType: 'camera', estimatedDays: 30, tools: ['Sprayer', 'Insecticide', 'Fungicide'], tutorialVideo: 'https://www.youtube.com/embed/dM5nQv7rpWE' },
      { id: 'ms8', title: 'Flowering Support', description: 'Bee activity essential for cross-pollination. Place 5 bee colonies/ha near field. Apply borax spray for better seed set. Peak flowering at 45-50 DAS.', icon: 'Zap', category: 'Maintenance', points: 130, ecoPoints: 120, verificationType: 'camera', estimatedDays: 15, tools: ['Bee Colonies', 'Borax Solution'], tutorialVideo: 'https://www.youtube.com/embed/gK6nX2qL9cR' },
      { id: 'ms9', title: 'Pod Formation & Maturity', description: 'Pods develop 60-80 DAS. Plants mature when 75% pods turn yellow-brown. Avoid irrigation after pod filling to prevent shattering.', icon: 'Check', category: 'Harvest', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 25, tools: ['Visual Inspection'], tutorialVideo: 'https://www.youtube.com/embed/vR3J8K5mN6U' },
      { id: 'ms10', title: 'Harvesting & Threshing', description: 'Harvest early morning when pods slightly moist to reduce shattering. Cut at ground level. Stack for 4-5 days, then thresh. Dry seeds to 8% moisture.', icon: 'Wheat', category: 'Harvest', points: 220, ecoPoints: 130, verificationType: 'camera', estimatedDays: 7, tools: ['Sickle', 'Thresher', 'Drying Yard'], warnings: ['Delayed harvest causes 25-30% shattering loss'], tutorialVideo: 'https://www.youtube.com/embed/2Tn9P8cQ4sI' }
    ]
  },
  {
    id: 'c9',
    name: 'Turmeric',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    funFact: 'India satisfies over 75% of the total global demand for Turmeric.',
    subsidies: ['Spice Board Support', 'Export Incentive'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    waterInstruction: 'Maintain consistent moisture. Avoid waterlogging at all costs.',
    soilSuitability: ['Sandy Loam', 'Clayey Loam', 'Well-drained Alluvial'],
    spacing: '30 cm × 15 cm',
    careTips: [
      'Deep mulching with green leaves protects rhizomes',
      'Perform earthing up twice at 60 and 90 days',
      'Control shoot borer for healthy rhizome development'
    ],
    workflow: [
      { id: 'tu1', title: 'Land Preparation', description: 'Prepare raised beds or ridges to ensure excellent drainage. Mix 20-25 tonnes of FYM per hectare. Ensure soil is free of clods.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5, tools: ['Plough', 'Ridger'], tutorialVideo: 'https://www.youtube.com/embed/qKyqK_rE_eI' },
      { id: 'tu2', title: 'Rhizome Selection', description: 'Select healthy, disease-free mother or finger rhizomes weighing 30-40g. Treat with Carbendazim (0.3%) for 30 mins to prevent rot.', icon: 'Sprout', category: 'Sowing', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2, tools: ['Rhizomes', 'Fungicide'], tutorialVideo: 'https://www.youtube.com/embed/LpQvXNY6J8U' },
      { id: 'tu3', title: 'Planting', description: 'Plant rhizomes 5-7cm deep with 30x15cm spacing. Ensure terminal buds face upwards. Optimal planting time: May to June.', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 70, verificationType: 'camera', estimatedDays: 3, tools: ['Hand Hoe'], warnings: ['Poor drainage causes rhizome rot'], tutorialVideo: 'https://www.youtube.com/embed/ZjGl3KnQMsk' },
      { id: 'tu4', title: 'Mulching', description: 'Apply green leaf mulch (12-15 tonnes/ha) immediately after planting to conserve moisture and suppress weeds.', icon: 'Leaf', category: 'Maintenance', points: 100, ecoPoints: 150, verificationType: 'camera', estimatedDays: 2, tools: ['Leaf Mulch'], tutorialVideo: 'https://www.youtube.com/embed/wFN9FQxjE6Y' },
      { id: 'tu5', title: 'First Irrigation & Fertilizer', description: 'Provide light irrigation after planting. Apply 60kg N, 50kg P, 120kg K per hectare in split doses. N is applied at 30, 60, and 90 DAS.', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 5, tools: ['Drip/Sprinkler', 'NPK'], tutorialVideo: 'https://www.youtube.com/embed/kxPmn3N5BEU' },
      { id: 'tu6', title: 'Weeding & Earthing Up', description: 'Keep the field weed-free for the first 120 days. Perform earthing up twice (60 and 90 DAS) to cover developing rhizomes.', icon: 'Tractor', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 10, tools: ['Weeder'], tutorialVideo: 'https://www.youtube.com/embed/u9N7R3aqMJc' },
      { id: 'tu7', title: 'Pest Monitoring', description: 'Watch for shoot borers and rhizome scales. Use neem-based sprays for early intervention. Monitor for leaf spot and rhizome rot.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 120, verificationType: 'camera', estimatedDays: 120, tools: ['Neem Oil', 'Sprayer'], tutorialVideo: 'https://www.youtube.com/embed/pR4XcRz5A1A' },
      { id: 'tu8', title: 'Second Fertilizer Boost', description: 'Final N top-dressing at 90 days. Foliar spray of micronutrients (Zinc, Iron) improves rhizome quality and curcumin content.', icon: 'Zap', category: 'Maintenance', points: 170, ecoPoints: 100, verificationType: 'camera', estimatedDays: 30, tools: ['Micronutrient Spray'], tutorialVideo: 'https://www.youtube.com/embed/FpR5NdVqJXc' },
      { id: 'tu9', title: 'Harvest Preparation', description: 'Harvest when leaves turn yellow and start drying (7-9 months after planting). Stop irrigation 15-20 days before harvest.', icon: 'Check', category: 'Harvest', points: 140, ecoPoints: 70, verificationType: 'camera', estimatedDays: 15, tools: ['Sickle'], tutorialVideo: 'https://www.youtube.com/embed/wDjhOjP3HXg' },
      { id: 'tu10', title: 'Harvesting & Curing', description: 'Lift rhizomes carefully with a spade or power lifter. Clean soil, separate mother rhizomes. Boil in water for 45-60 mins, then sun-dry.', icon: 'Wheat', category: 'Harvest', points: 300, ecoPoints: 200, verificationType: 'camera', estimatedDays: 15, tools: ['Spade', 'Boiling Tank', 'Drying Yard'], warnings: ['Over-boiling reduces quality and color'], tutorialVideo: 'https://www.youtube.com/embed/3PkRLz8a0xk' }
    ]
  }
];

export const AVAILABLE_CROPS = CULTIVATION_LIBRARY;

// Missing mock data exports added below
export const MOCK_SURPLUS: SurplusCrop[] = [
  { id: 's1', name: 'Tomato', quantity: 50, unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
  { id: 's2', name: 'Coconut', quantity: 200, unit: 'units', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=400' },
  { id: 's3', name: 'Mango', quantity: 80, unit: 'kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400' },
  { id: 's4', name: 'Milk', quantity: 100, unit: 'liters', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400' },
  { id: 's5', name: 'Wheat', quantity: 200, unit: 'kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?auto=format&fit=crop&q=80&w=400' },
  { id: 's6', name: 'Rice', quantity: 150, unit: 'kg', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=400' },
  { id: 's7', name: 'Sugarcane', quantity: 500, unit: 'kg', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=400' },
  { id: 's8', name: 'Groundnut', quantity: 100, unit: 'kg', image: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?auto=format&fit=crop&q=80&w=400' }
];

export const CONVERSION_RECIPES: Record<string, ConversionRecipe[]> = {
  'Tomato': [
    { id: 'r1', productName: 'Tomato Puree', rewardPoints: 150, description: 'Concentrated tomato pulp for long-term storage.', videoUrl: 'https://www.youtube.com/embed/h_D0Mex6zhQ' },
    { id: 'r2', productName: 'Sun-dried Tomatoes', rewardPoints: 200, description: 'Traditional dehydration for gourmet use.', videoUrl: 'https://www.youtube.com/embed/2_lYxBnYqBQ' },
    { id: 'r3', productName: 'Tomato Ketchup', rewardPoints: 180, description: 'Homemade ketchup with spices, shelf life 6 months.', videoUrl: 'https://www.youtube.com/embed/XrEVbja2aP8' }
  ],
  'Coconut': [
    { id: 'r4', productName: 'Coconut Oil', rewardPoints: 300, description: 'Cold-pressed extra virgin oil extraction.', videoUrl: 'https://www.youtube.com/embed/2CXDgxLyh9k' },
    { id: 'r5', productName: 'Coconut Milk', rewardPoints: 180, description: 'Fresh coconut milk for cooking and beverages.', videoUrl: 'https://www.youtube.com/embed/yK7YT4FNyHw' },
    { id: 'r6', productName: 'Desiccated Coconut', rewardPoints: 220, description: 'Dried coconut flakes for baking and sweets.', videoUrl: 'https://www.youtube.com/embed/3Kj0wS2LQVE' }
  ],
  'Mango': [
    { id: 'r7', productName: 'Mango Pickle', rewardPoints: 250, description: 'Traditional Indian aam ka achar with mustard oil.', videoUrl: 'https://www.youtube.com/embed/8FzBJYoNMAQ' },
    { id: 'r8', productName: 'Mango Pulp', rewardPoints: 180, description: 'Alphonso quality pulp for export and desserts.', videoUrl: 'https://www.youtube.com/embed/rABr7EiGz_Q' },
    { id: 'r9', productName: 'Aam Papad', rewardPoints: 200, description: 'Dried mango leather, popular snack.', videoUrl: 'https://www.youtube.com/embed/Zz2kLvW8KZw' }
  ],
  'Milk': [
    { id: 'r10', productName: 'Paneer', rewardPoints: 220, description: 'Fresh cottage cheese, high protein value.', videoUrl: 'https://www.youtube.com/embed/yqLREdPzKT4' },
    { id: 'r11', productName: 'Desi Ghee', rewardPoints: 350, description: 'Clarified butter, premium A2 quality.', videoUrl: 'https://www.youtube.com/embed/3FHaYE-XbNE' },
    { id: 'r12', productName: 'Curd/Dahi', rewardPoints: 120, description: 'Probiotic-rich yogurt, daily consumption.', videoUrl: 'https://www.youtube.com/embed/48o5QlrpU_k' }
  ],
  'Wheat': [
    { id: 'r13', productName: 'Whole Wheat Flour', rewardPoints: 150, description: 'Stone-ground atta for chapatis.', videoUrl: 'https://www.youtube.com/embed/6Z7MTTFlvJ8' },
    { id: 'r14', productName: 'Dalia/Broken Wheat', rewardPoints: 130, description: 'Nutritious broken wheat for porridge.', videoUrl: 'https://www.youtube.com/embed/wmQVu0mXMR4' }
  ],
  'Rice': [
    { id: 'r15', productName: 'Rice Flour', rewardPoints: 140, description: 'Fine powder for dosas and sweets.', videoUrl: 'https://www.youtube.com/embed/3aKq9Jj9aHY' },
    { id: 'r16', productName: 'Poha/Flattened Rice', rewardPoints: 180, description: 'Traditional flattened rice flakes.', videoUrl: 'https://www.youtube.com/embed/gqH6K5k6AyI' }
  ],
  'Sugarcane': [
    { id: 'r17', productName: 'Jaggery/Gur', rewardPoints: 280, description: 'Organic unrefined sugar, medicinal value.', videoUrl: 'https://www.youtube.com/embed/s0ib_K8Z6Ws' },
    { id: 'r18', productName: 'Sugarcane Juice', rewardPoints: 100, description: 'Fresh pressed juice for immediate sale.', videoUrl: 'https://www.youtube.com/embed/Xb5H2BJxj8Q' }
  ],
  'Groundnut': [
    { id: 'r19', productName: 'Groundnut Oil', rewardPoints: 280, description: 'Cold-pressed peanut oil, heart healthy.', videoUrl: 'https://www.youtube.com/embed/3TQ7b5A0wE8' },
    { id: 'r20', productName: 'Peanut Butter', rewardPoints: 200, description: 'Creamy or crunchy artisan peanut butter.', videoUrl: 'https://www.youtube.com/embed/dNJdJIwCF_Y' }
  ]
};

export const MOCK_SUBSIDIES: Subsidy[] = [
  {
    id: 'sb1',
    name: 'PM-Kisan Samman Nidhi',
    state: 'Central',
    category: 'Crops',
    description: 'Direct income support of ₹6,000 per year to all landholding farmer families.',
    eligibility: 'All landholding farmers families who have cultivable landholding in their names.',
    benefits: '₹6,000 per year in three equal installments of ₹2,000 each.',
    process: 'Online registration via PM-Kisan portal or CSC centers.',
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 'sb2',
    name: 'Kisan Credit Card (KCC)',
    state: 'Central',
    category: 'Crops',
    description: 'Credit facility for farmers to meet short-term and long-term agricultural needs including crop cultivation, post-harvest expenses, and asset maintenance.',
    eligibility: 'All farmers — individual/joint borrowers who are owner cultivators, tenant farmers, oral lessees & sharecroppers.',
    benefits: 'Credit up to ₹3 lakh at 4% interest rate. Flexi KCC allows withdrawal and repayment.',
    process: 'Apply through nationalized banks, cooperative banks, or RRBs with land documents and Aadhaar.',
    link: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc'
  },
  {
    id: 'sb3',
    name: 'Pradhan Mantri Krishi Sinchai Yojana',
    state: 'Central',
    category: 'Water',
    description: 'Per Drop More Crop (PDMC) component provides financial assistance for micro-irrigation (drip and sprinkler systems) to improve water use efficiency.',
    eligibility: 'All categories of farmers including small and marginal farmers, SCs/STs, women, and group of farmers.',
    benefits: '55% subsidy for small & marginal farmers, 45% for others. Additional 10% for SC/ST farmers.',
    process: 'Apply through state agriculture department or district horticulture office with land records.',
    link: 'https://pmksy.gov.in/'
  },
  {
    id: 'sb4',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    state: 'Central',
    category: 'Machinery',
    description: 'Financial Assistance for purchase of agricultural machinery and equipment to increase efficiency and reduce drudgery.',
    eligibility: 'Individual farmers, SC/ST/Women/Small & Marginal Farmers, and CHCs (Custom Hiring Centers).',
    benefits: '40-50% subsidy on farm machinery. Up to 80% for Custom Hiring Centers run by cooperatives.',
    process: 'Online application through Direct Benefit Transfer (DBT) Agriculture portal with bank account details.',
    link: 'https://agrimachinery.nic.in/'
  },
  {
    id: 'sb5',
    name: 'National Mission for Sustainable Agriculture (NMSA)',
    state: 'Central',
    category: 'Crops',
    description: 'Promotes location specific Integrated Farming Systems (IFS), soil health management, and water conservation practices.',
    eligibility: 'Farmers practicing rainfed agriculture, integrated farming systems, and soil/water conservation.',
    benefits: 'Financial and technical support for organic farming, vermicomposting units, and rainwater harvesting.',
    process: 'Contact state agriculture department or Krishi Vigyan Kendras (KVK) for registration.',
    link: 'https://nmsa.dac.gov.in/'
  },
  {
    id: 'sb6',
    name: 'National Livestock Mission',
    state: 'Central',
    category: 'Livestock',
    description: 'Sustainable development of livestock sector focusing on entrepreneurship development, breed improvement, and fodder development.',
    eligibility: 'Dairy farmers, backyard poultry keepers, goat/sheep rearers, and livestock entrepreneurs.',
    benefits: 'Subsidy on breed improvement programs, feed & fodder development, insurance premium, and infrastructure development.',
    process: 'Apply through state animal husbandry department with proof of existing livestock ownership.',
    link: 'https://dahd.nic.in/related-links/national-livestock-mission'
  },
  {
    id: 'sb7',
    name: 'Namo Shetkari Maha Sanman Nidhi (Maharashtra)',
    state: 'Maharashtra',
    category: 'Crops',
    description: 'Additional ₹6,000 annual income support to farmers in Maharashtra, supplementing PM-Kisan.',
    eligibility: 'All farmers in Maharashtra who are eligible for PM-Kisan.',
    benefits: '₹6,000 per year in addition to PM-Kisan, totaling ₹12,000 annual support.',
    process: 'Automatic enrollment for existing PM-Kisan beneficiaries. New registrations through Aaple Sarkar portal.',
    link: 'https://www.maharashtra.gov.in/'
  },
  {
    id: 'sb8',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    state: 'Central',
    category: 'Crops',
    description: 'Promotes organic farming through cluster approach and provides assistance of ₹50,000 per hectare over 3 years.',
    eligibility: 'Groups of farmers practicing or willing to adopt organic farming. Minimum 50 farmers/50 hectares per cluster.',
    benefits: '₹50,000/hectare over 3 years for organic inputs, certification, and capacity building.',
    process: 'Form farmer producer organization (FPO) and apply through state agriculture department.',
    link: 'https://pgsindia-ncof.gov.in/'
  },
  {
    id: 'sb9',
    name: 'Modified Interest Subvention Scheme',
    state: 'Central',
    category: 'Crops',
    description: 'Interest subvention of 2% per annum to farmers on short term crop loans up to ₹3 lakh.',
    eligibility: 'All farmers availing short term crop loans from banks.',
    benefits: 'Effective interest rate of 4% per annum. Additional 3% on prompt repayment.',
    process: 'Available automatically on sanctioned crop loans. Ensure timely repayment for additional benefit.',
    link: 'https://www.nabard.org/'
  },
  {
    id: 'sb10',
    name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    state: 'Central',
    category: 'Crops',
    description: 'State Plan Scheme providing flexibility to states to plan and execute agriculture schemes based on agro-climatic conditions.',
    eligibility: 'Projects implemented through state governments benefitting farmer groups, cooperatives, and agri-entrepreneurs.',
    benefits: 'Funding for infrastructure, technology adoption, value addition, and marketing initiatives.',
    process: 'State governments submit project proposals. Farmers benefit through state-level implementation.',
    link: 'https://rkvy.nic.in/'
  }
];

export const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'rw1',
    name: 'Soil Health Card kit',
    description: 'Digital NPK sensor and pH meter for real-time soil mapping.',
    pointsPrice: 1500,
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=400',
    category: 'Tech'
  }
];

export const MOCK_INSURANCE: InsuranceScheme[] = [
  {
    id: 'i1',
    name: 'PM Fasal Bima Yojana',
    type: 'Government',
    coverage: 'Yield-based insurance for Kharif and Rabi crops against non-preventable risks.',
    premium: '2.0% for Kharif, 1.5% for Rabi',
    eligibility: 'All farmers including sharecroppers and tenant farmers.',
    claimProcess: 'Immediate notification within 72 hours of loss to bank or insurance company.',
    link: 'https://pmfby.gov.in/',
    eligibleCrops: ['Wheat', 'Rice', 'Cotton', 'Turmeric'],
    eligibleSteps: ['Sowing', 'Maintenance', 'Harvest'],
    agency: 'Ministry of Agriculture'
  },
  {
    id: 'i2',
    name: 'Weather Based Crop Insurance Scheme (WBCIS)',
    type: 'Government',
    coverage: 'Weather index-based insurance for adverse weather conditions (rainfall, temperature, humidity, wind speed).',
    premium: '2-5% of sum insured based on risk',
    eligibility: 'All farmers growing notified crops in notified areas.',
    claimProcess: 'Automatic claim settlement based on weather station data. No crop loss intimation required.',
    link: 'https://www.aicofindia.com/',
    eligibleCrops: ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton'],
    eligibleSteps: ['Sowing', 'Maintenance', 'Flowering', 'Harvest'],
    agency: 'Agriculture Insurance Company of India'
  },
  {
    id: 'i3',
    name: 'Coconut Palm Insurance Scheme',
    type: 'Government',
    coverage: 'Insurance coverage for coconut palms against fire, lightning, flood, cyclone, and pest/disease attacks.',
    premium: '₹9 per palm per annum (50% subsidy for small farmers)',
    eligibility: 'Coconut farmers with palms aged 4-60 years.',
    claimProcess: 'Report damage to nearest agriculture office within 7 days. Assessment by joint inspection.',
    link: 'https://coconutboard.gov.in/',
    eligibleCrops: ['Coconut'],
    eligibleSteps: ['Maintenance', 'Harvest'],
    agency: 'Coconut Development Board'
  },
  {
    id: 'i4',
    name: 'Pradhan Mantri Fasal Bima Yojana - Horticulture',
    type: 'Government',
    coverage: 'Coverage for horticultural crops including fruits, vegetables, and spices against yield losses.',
    premium: '5% of sum insured',
    eligibility: 'Farmers growing notified horticultural crops.',
    claimProcess: 'Report loss within 48 hours. Individual farm assessment for localized risks.',
    link: 'https://pmfby.gov.in/',
    eligibleCrops: ['Tomato', 'Potato', 'Onion', 'Banana', 'Mango'],
    eligibleSteps: ['Sowing', 'Maintenance', 'Harvest'],
    agency: 'Ministry of Agriculture'
  },
  {
    id: 'i5',
    name: 'Livestock Insurance Scheme',
    type: 'Government',
    coverage: 'Insurance for cattle, buffalo, sheep, goat, pig, and poultry against death due to accident, disease, natural calamities.',
    premium: '3-4% of sum insured (50% subsidy for SC/ST)',
    eligibility: 'Livestock owners with healthy animals aged 2 months to 10 years.',
    claimProcess: 'Immediate intimation to insurance company. Post-mortem mandatory within 24 hours of death.',
    link: 'https://dahd.nic.in/',
    eligibleCrops: [],
    eligibleSteps: [],
    agency: 'Department of Animal Husbandry'
  },
  {
    id: 'i6',
    name: 'Unified Package Insurance Scheme (UPIS)',
    type: 'Government',
    coverage: 'Comprehensive package covering dwelling, contents, farm equipment, and crop against fire, lightning, flood, storm.',
    premium: '₹180 per annum for ₹50,000 coverage',
    eligibility: 'Farmers with Kisan Credit Card.',
    claimProcess: 'Notify bank within 7 days. Survey by insurance company within 15 days.',
    link: 'https://www.nabard.org/',
    eligibleCrops: ['All notified crops'],
    eligibleSteps: ['All stages'],
    agency: 'NABARD'
  },
  {
    id: 'i7',
    name: 'AgroStar Crop Protection Plan',
    type: 'App-Based',
    coverage: 'App-based insurance for specific crop stages with instant claim processing via photo verification.',
    premium: '₹99-499 per crop cycle',
    eligibility: 'Farmers registered on AgroPlay app growing eligible crops.',
    claimProcess: 'Upload photos of damaged crop via app. AI assessment within 48 hours. Digital payout to bank.',
    link: 'https://www.agrostar.in/',
    eligibleCrops: ['Wheat', 'Rice', 'Cotton', 'Tomato', 'Maize'],
    eligibleSteps: ['Sowing', 'Flowering', 'Harvest'],
    agency: 'AgroStar Agri-Tech'
  }
];
