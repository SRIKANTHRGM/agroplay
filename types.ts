
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
  soilSuitability: string[];
  workflow?: CultivationStep[];
  waterInstruction?: string;
  spacing?: string;
  careTips?: string[];
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
  category: 'Seeds' | 'Tools' | 'Machinery' | 'Specials' | 'Livestock' | 'Bio-Inputs';
  image: string;
  requiredPoints?: number;
  requiredBadges?: number;
}

export const CULTIVATION_LIBRARY: Crop[] = [
  {
    id: 'c1',
    name: 'Wheat (Grade A)',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    funFact: 'Wheat is the global staple that defined modern agriculture.',
    subsidies: ['PM-Kisan', 'MSP Support', 'NFSM Wheat Subsidy'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    soilSuitability: ['Alluvial', 'Black'],
    waterInstruction: 'Irrigate at CRI stage (21 DAS), tillering, flowering, and dough stage.',
    spacing: '22.5cm row-to-row x 5cm plant-to-plant',
    careTips: ['Ensure seed treatment with Trichoderma viride', 'Maintain soil moisture at CRI stage', 'Scout for yellow rust in cold humid mornings'],
    workflow: [
      { id: 's1', title: 'Soil Sampling & pH Testing', description: 'Collect core soil samples across 5 diagonal points for NPK and pH testing.', icon: 'Search', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 3, tools: ['Auger', 'Sample Bags'] },
      { id: 's2', title: 'Deep Summer Ploughing', description: 'Plough field to 25cm depth to expose soil-borne pathogens and weeds to sun.', icon: 'Tractor', category: 'Preparation', points: 120, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5, tools: ['Disc Plough'] },
      { id: 's3', title: 'FYM & Compost Application', description: 'Spread 10 tonnes/ha of well-decomposed FYM evenly before secondary tillage.', icon: 'Layers', category: 'Preparation', points: 110, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2, tools: ['Manure Spreader'] },
      { id: 's4', title: 'Secondary Tillage & Harrowing', description: 'Pass rotavator twice to break clods and create fine seedbed tilth.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 40, verificationType: 'camera', estimatedDays: 2, tools: ['Rotavator'] },
      { id: 's5', title: 'Certified Seed Quality Audit', description: 'Inspect seed purity tag, germination percentage (>85%), and moisture (<12%).', icon: 'ShieldCheck', category: 'Sowing', points: 90, ecoPoints: 40, verificationType: 'checklist', estimatedDays: 1 },
      { id: 's6', title: 'Bio-Fungicide Seed Treatment', description: 'Treat seeds with Trichoderma viride @ 4g/kg to prevent root rot.', icon: 'ShieldCheck', category: 'Sowing', points: 140, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1, tools: ['Mixing Drum'] },
      { id: 's7', title: 'Seed Drill Calibration', description: 'Calibrate seed drill for exact 100 kg/ha seeding rate.', icon: 'Zap', category: 'Sowing', points: 100, ecoPoints: 50, verificationType: 'checklist', estimatedDays: 1 },
      { id: 's8', title: 'Line Sowing at 5cm Depth', description: 'Sow treated seeds in rows 22.5cm apart at 5cm uniform depth.', icon: 'Sprout', category: 'Sowing', points: 200, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2, tools: ['Seed Drill'] },
      { id: 's9', title: 'Germination & Stand Count Audit', description: 'Inspect field at 7-10 DAS to verify >90% uniform seedling emergence.', icon: 'Sprout', category: 'Maintenance', points: 110, ecoPoints: 60, verificationType: 'camera', estimatedDays: 10 },
      { id: 's10', title: 'Crown Root Initiation (CRI) Water', description: 'Apply 1st critical irrigation at 21 days after sowing (CRI stage).', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1 },
      { id: 's11', title: 'First Weed Management', description: 'Apply Clodinafop-propargyl for broadleaf & grassy weeds at 30 DAS.', icon: 'Recycle', category: 'Protection', points: 140, ecoPoints: 70, verificationType: 'checklist', estimatedDays: 2 },
      { id: 's12', title: 'Basal Nitrogen Top Dressing', description: 'Broadcast 1st split Urea (60 kg N/ha) after 1st irrigation.', icon: 'Layers', category: 'Maintenance', points: 130, ecoPoints: 50, verificationType: 'camera', estimatedDays: 1 },
      { id: 's13', title: 'Aphid & Termite Pest Scouting', description: 'Inspect 20 random tillers per acre for aphid clusters or termite damage.', icon: 'Search', category: 'Protection', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 's14', title: 'Organic Neem Oil Spraying', description: 'Foliar spray 1500ppm Neem Oil @ 3ml/L for eco-friendly pest control.', icon: 'Leaf', category: 'Protection', points: 160, ecoPoints: 150, verificationType: 'camera', estimatedDays: 1 },
      { id: 's15', title: 'Jointing Stage Irrigation', description: 'Apply 2nd critical irrigation during stem elongation / jointing stage.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 's16', title: 'Booting Stage Micronutrient Spray', description: 'Spray 0.5% Zinc Sulfate + 0.2% Boron during boot leaf stage.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 's17', title: 'Flowering & Anthesis Care', description: 'Apply 3rd irrigation at flowering; check for loose smut symptoms.', icon: 'Droplets', category: 'Protection', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 5 },
      { id: 's18', title: 'Milk to Dough Maturity Test', description: 'Audit grain firmness by pressing kernels between fingers.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 7 },
      { id: 's19', title: 'Combine Harvesting at 14% MC', description: 'Harvest crop when straw turns golden yellow and grain MC is 14%.', icon: 'Tractor', category: 'Harvest', points: 250, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 's20', title: 'Threshing, Drying & Grain Storage', description: 'Sun dry grains to 12% moisture, grade, and store in hermetic bags.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 4 }
    ]
  },
  {
    id: 'c2',
    name: 'Basmati Rice',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    funFact: 'The long grains and unique aroma are global exports.',
    subsidies: ['Export Incentive', 'PM Krishi Sinchayee', 'APEDA Basmati Grant'],
    season: 'Kharif',
    waterRequirement: 'High',
    soilSuitability: ['Alluvial', 'Clayey'],
    waterInstruction: 'Maintain 3-5cm standing water from transplanting till 10 days before harvest.',
    spacing: '20cm row-to-row x 15cm hill-to-hill',
    careTips: ['Use certified Pusa Basmati 1121 seeds', 'Dip seedling roots in Pseudomonas bio-culture', 'Drain field completely 10 days before harvesting'],
    workflow: [
      { id: 'b1', title: 'Soil Puddling Readiness Audit', description: 'Check field bunding and water availability for puddling.', icon: 'Search', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'b2', title: 'Nursery Raised Bed Prep', description: 'Prepare 1000m² nursery bed per hectare with rich compost.', icon: 'Layers', category: 'Preparation', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'b3', title: 'Seed Soaking & Sprouting', description: 'Soak seeds in 1% salt water, discard floaters, incubate for 24h.', icon: 'ShieldCheck', category: 'Sowing', points: 130, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'b4', title: 'Nursery Seed Sowing', description: 'Sow sprouted seeds uniformly on wet nursery bed.', icon: 'Sprout', category: 'Sowing', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b5', title: 'Nursery Water Management', description: 'Maintain shallow water layer and protect seedlings from birds.', icon: 'Droplets', category: 'Maintenance', points: 110, ecoPoints: 50, verificationType: 'checklist', estimatedDays: 20 },
      { id: 'b6', title: 'Main Field Deep Puddling', description: 'Puddle main field 3 times with tractor rotavator in standing water.', icon: 'Tractor', category: 'Preparation', points: 160, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'b7', title: 'FYM & Bio-Fertilizer Dosing', description: 'Incorporate 10t FYM + 25kg Zinc Sulfate in puddled soil.', icon: 'Layers', category: 'Preparation', points: 130, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b8', title: 'Seedling Uprooting & Root Dip', description: 'Uproot 25-day seedlings and dip roots in Pseudomonas fluorescens.', icon: 'Leaf', category: 'Sowing', points: 150, ecoPoints: 110, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b9', title: 'Line Transplanting', description: 'Transplant 2-3 seedlings per hill at 20cm x 15cm grid.', icon: 'Sprout', category: 'Sowing', points: 220, ecoPoints: 70, verificationType: 'camera', estimatedDays: 3 },
      { id: 'b10', title: 'Standing Water Maintenance', description: 'Maintain 5cm standing water layer during early establishment.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 15 },
      { id: 'b11', title: 'Cono-Weeder Weed Control', description: 'Run cono-weeder at 15 & 30 DAT to aerate soil and bury weeds.', icon: 'Recycle', category: 'Maintenance', points: 160, ecoPoints: 140, verificationType: 'camera', estimatedDays: 2 },
      { id: 'b12', title: 'Tillering Top Dressing', description: 'Apply 1st split Neem-Coated Urea at maximum tillering.', icon: 'Zap', category: 'Maintenance', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b13', title: 'Stem Borer & Leaf Folder Audit', description: 'Scout field for dead hearts or leaf folder webbed leaves.', icon: 'Search', category: 'Protection', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 3 },
      { id: 'b14', title: 'Biocontrol Parasitoid Release', description: 'Release Trichogramma japonicum egg parasitoid cards @ 5/ha.', icon: 'ShieldCheck', category: 'Protection', points: 170, ecoPoints: 180, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b15', title: 'Panicle Initiation Fertigation', description: 'Apply Potash & 2nd split Nitrogen at panicle initiation.', icon: 'Layers', category: 'Maintenance', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b16', title: 'Flowering Stage Moisture Check', description: 'Ensure no water stress during grain filling stage.', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'checklist', estimatedDays: 10 },
      { id: 'b17', title: 'Pre-Harvest Terminal Drainage', description: 'Drain standing water completely 10 days before harvest.', icon: 'Droplets', category: 'Harvest', points: 130, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1 },
      { id: 'b18', title: 'Grain Golden Maturity Audit', description: 'Inspect panicles to ensure 80% grains turned straw golden.', icon: 'Check', category: 'Harvest', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'b19', title: 'Manual / Combine Harvesting', description: 'Harvest paddy close to ground to minimize grain shattering.', icon: 'Tractor', category: 'Harvest', points: 250, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'b20', title: 'Threshing, Drying & Paddy Storage', description: 'Thresh, sun dry to 13% moisture, remove chaff and bag paddy.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 4 }
    ]
  },
  {
    id: 'c3',
    name: 'Cotton (Bt Hybrid)',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800',
    funFact: 'Known as White Gold, cotton supports over 250 million livelihoods globally.',
    subsidies: ['CCI MSP Guarantee', 'Subsidized Seed Packets', 'Technology Mission on Cotton'],
    season: 'Kharif',
    waterRequirement: 'Medium',
    soilSuitability: ['Black', 'Alluvial'],
    waterInstruction: 'Drip irrigate at 4-5 day intervals; avoid flooding during boll opening.',
    spacing: '90cm row-to-row x 60cm plant-to-plant',
    careTips: ['Install pheromone traps for pink bollworm early', 'Avoid excessive nitrogen to prevent vegetative rank growth', 'Pick cotton clean without dry leaf debris'],
    workflow: [
      { id: 'ct1', title: 'Deep Summer Tillage & Solarization', description: 'Deep plough black soil to expose pink bollworm pupae.', icon: 'Tractor', category: 'Preparation', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 5 },
      { id: 'ct2', title: 'Compost & Bio-Zinc Dosing', description: 'Apply 12t FYM + 25kg Zinc Sulfate per hectare.', icon: 'Layers', category: 'Preparation', points: 110, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ct3', title: 'Raised Bed & Ridge Formation', description: 'Form raised broad beds spaced 90cm apart.', icon: 'Tractor', category: 'Preparation', points: 130, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ct4', title: 'Certified Bt Seed Packet Audit', description: 'Verify government hologram tag on Bt Cotton seed packet.', icon: 'ShieldCheck', category: 'Sowing', points: 90, ecoPoints: 40, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'ct5', title: 'Bio-Stimulant Seed Coating', description: 'Treat seeds with Azotobacter + PSB culture @ 25g/kg.', icon: 'Leaf', category: 'Sowing', points: 140, ecoPoints: 110, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct6', title: 'Precision Dibbling', description: 'Dibble 2 seeds per hill at 90cm x 60cm spacing at 4cm depth.', icon: 'Sprout', category: 'Sowing', points: 200, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ct7', title: 'Initial Drip Fertigation Cycle', description: 'Run drip irrigation for 3 hours after dibbling.', icon: 'Droplets', category: 'Sowing', points: 120, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct8', title: 'Emergence & Gap Filling', description: 'Audit seedling stand at 10 DAS; gap fill with pre-soaked seed.', icon: 'Sprout', category: 'Maintenance', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'ct9', title: 'Thinning to Single Healthy Stalk', description: 'Retain 1 vigorous plant per hill at 15 DAS.', icon: 'Recycle', category: 'Maintenance', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct10', title: 'Inter-Row Hoeing & Weeding', description: 'Perform 1st hoeing to break crust and eliminate weeds.', icon: 'Tractor', category: 'Maintenance', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ct11', title: 'Square Formation Fertigation', description: 'Apply Split 1 NPK via drip at squarring (35 DAS).', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct12', title: 'Pheromone Trap Installation', description: 'Deploy 5 Pectinophora pheromone traps/acre.', icon: 'Search', category: 'Protection', points: 160, ecoPoints: 160, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct13', title: 'Sucking Pest Scouting (Jassids)', description: 'Inspect 20 leaves across field for jassid hopper burn.', icon: 'Search', category: 'Protection', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'ct14', title: 'Neem Oil 10,000 ppm Spray', description: 'Foliar spray Neem EC @ 2ml/L for sucking pest management.', icon: 'Leaf', category: 'Protection', points: 170, ecoPoints: 170, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct15', title: 'Earthing Up Soil Support', description: 'Mound soil around plant stems at 60 DAS to prevent lodging.', icon: 'Tractor', category: 'Maintenance', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ct16', title: 'Flowering & Boll Care Spray', description: 'Spray 1% MgSO4 + 0.5% Boron during peak flowering.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct17', title: 'Apical Top Pruning (Topping)', description: 'Nip terminal shoot at 4.5 feet height to enhance boll size.', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ct18', title: 'Boll Bursting Maturity Audit', description: 'Check for 50% boll opening across crop canopy.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'ct19', title: 'First Flush Seed-Cotton Picking', description: 'Hand pick clean opened cotton bolls into cotton bags.', icon: 'Check', category: 'Harvest', points: 250, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'ct20', title: 'Drying, Grading & Ginning Storage', description: 'Sun dry seed-cotton to <8% moisture, grade staple and store.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 4 }
    ]
  },
  {
    id: 'c4',
    name: 'Organic Maize (Corn)',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',
    funFact: 'Maize utilizes solar energy rapidly due to its efficient C4 photosynthetic path.',
    subsidies: ['NFSM Maize Scheme', 'Micro-Irrigation Subsidy', 'Organic Certification Support'],
    season: 'Kharif',
    waterRequirement: 'Medium',
    soilSuitability: ['Red', 'Loamy'],
    waterInstruction: 'Critical irrigation needed at knee-high, tasseling, and cob filling stages.',
    spacing: '60cm row-to-row x 20cm plant-to-plant',
    careTips: ['Apply Metarhizium anisopliae for Fall Armyworm control', 'Ensure good drainage; maize cannot tolerate waterlogging', 'Harvest when kernel moisture drops below 20%'],
    workflow: [
      { id: 'm1', title: 'Land Preparation & Disking', description: 'Plough field 2 times followed by planking for medium tilth.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 4 },
      { id: 'm2', title: 'Vermicompost Basal Incorporation', description: 'Apply 5t vermicompost + 500kg Neem cake per hectare.', icon: 'Layers', category: 'Preparation', points: 120, ecoPoints: 110, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm3', title: 'Ridge & Furrow Layout', description: 'Make ridges 60cm apart for furrow sowing and irrigation.', icon: 'Tractor', category: 'Preparation', points: 110, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm4', title: 'Hybrid Seed Quality Audit', description: 'Check hybrid seed vigor tag (>90% germination rate).', icon: 'ShieldCheck', category: 'Sowing', points: 90, ecoPoints: 40, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'm5', title: 'Azospirillum Bio-Inoculation', description: 'Treat seeds with Azospirillum & PSB bio-fertilizer slurry.', icon: 'Leaf', category: 'Sowing', points: 140, ecoPoints: 120, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm6', title: 'Line Sowing on Ridges', description: 'Sow 1 seed per hill at 20cm spacing along ridges at 4cm depth.', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm7', title: 'First Furrow Irrigation', description: 'Provide light furrow irrigation immediately after sowing.', icon: 'Droplets', category: 'Sowing', points: 120, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm8', title: 'Germination & Sprout Audit', description: 'Verify uniform sprouting across rows at 6-8 DAS.', icon: 'Sprout', category: 'Maintenance', points: 110, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'm9', title: 'Thinning & Gap Filling', description: 'Thin extra seedlings leaving 1 vigorous plant per hill.', icon: 'Recycle', category: 'Maintenance', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm10', title: 'Knee-High Stage Interculture', description: 'Perform inter-cultivation weeding at 20 DAS.', icon: 'Tractor', category: 'Maintenance', points: 140, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm11', title: 'Jeevamrut Bio-Fertigation', description: 'Apply 500L/ha Liquid Jeevamrut via irrigation water.', icon: 'Droplets', category: 'Maintenance', points: 160, ecoPoints: 160, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm12', title: 'Fall Armyworm (FAW) Scouting', description: 'Inspect plant whorls for FAW pinholes or frass.', icon: 'Search', category: 'Protection', points: 130, ecoPoints: 90, verificationType: 'camera', estimatedDays: 3 },
      { id: 'm13', title: 'Biopesticide Whorl Dosing', description: 'Apply Metarhizium anisopliae formulation into plant whorls.', icon: 'Leaf', category: 'Protection', points: 170, ecoPoints: 180, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm14', title: 'Earthing Up Stalk Support', description: 'Mound soil against ridges to reinforce roots before tasseling.', icon: 'Tractor', category: 'Maintenance', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm15', title: 'Tasseling Stage Irrigation', description: 'Provide critical irrigation during tassel emergence.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm16', title: 'Silking & Cob Filling Care', description: 'Foliar spray Panchagavya 3% during silk emergence.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 130, verificationType: 'camera', estimatedDays: 1 },
      { id: 'm17', title: 'Black Layer Kernel Maturity Audit', description: 'Check for black layer formation at base of maize kernels.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'm18', title: 'Manual Cob Harvesting', description: 'Harvest mature cobs when husk turns straw brown.', icon: 'Check', category: 'Harvest', points: 220, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm19', title: 'Cob De-husking & Shelling', description: 'Remove husks and pass cobs through mechanical sheller.', icon: 'Tractor', category: 'Harvest', points: 180, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'm20', title: 'Sun Drying & Hermetic Storage', description: 'Dry grain to 12% moisture and pack in air-tight silos.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 3 }
    ]
  },
  {
    id: 'c5',
    name: 'Sugarcane (High Yield)',
    category: 'Cash Crop',
    image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&q=80&w=800',
    funFact: 'Sugarcane converts sunlight into biomass with extraordinary photosynthetic conversion efficiency.',
    subsidies: ['FRP Price Support', 'Drip System Subsidy', 'Sugar Mill Transportation Rebate'],
    season: 'Kharif',
    waterRequirement: 'High',
    soilSuitability: ['Loamy', 'Alluvial'],
    waterInstruction: 'Drip irrigate 25-30 times across growth cycle; stop water 15 days before harvest.',
    spacing: '150cm row-to-row (Single Bud Wide Row)',
    careTips: ['Use heat-treated disease-free seed setts', 'Tear off lower dry leaves (trashing) at 5th month', 'Tie opposite cane clumps (propping) to prevent lodging in monsoon'],
    workflow: [
      { id: 'sg1', title: 'Sub-Soiling & Deep Ploughing', description: 'Cross plough soil to 45cm depth for unrestricted root penetration.', icon: 'Tractor', category: 'Preparation', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'sg2', title: 'Pressmud & FYM Basal Dosing', description: 'Apply 15t FYM + 5t Bio-Pressmud compost per hectare.', icon: 'Layers', category: 'Preparation', points: 120, ecoPoints: 100, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sg3', title: 'Wide Row Trench Digging', description: 'Open trenches 150cm apart using tractor ridger.', icon: 'Tractor', category: 'Preparation', points: 140, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sg4', title: 'Healthy 3-Bud Sett Selection', description: 'Select top 1/3 portion of 9-month healthy seed cane.', icon: 'ShieldCheck', category: 'Sowing', points: 100, ecoPoints: 50, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'sg5', title: 'Sett Fungicidal Treatment', description: 'Soak setts for 15 min in Carbendazim 0.1% + Carbofuran slurry.', icon: 'ShieldCheck', category: 'Sowing', points: 140, ecoPoints: 70, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sg6', title: 'Trench Sett Placement', description: 'Place 3-bud setts end-to-end in furrows @ 75,000 buds/ha.', icon: 'Sprout', category: 'Sowing', points: 200, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sg7', title: 'Light Soil Covering & Drip Setup', description: 'Cover setts with 5cm soil layer and lay drip lateral lines.', icon: 'Droplets', category: 'Sowing', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sg8', title: 'Germination & Shoot Count Audit', description: 'Audit germination percentage at 30 DAS (>60% target).', icon: 'Sprout', category: 'Maintenance', points: 120, ecoPoints: 60, verificationType: 'camera', estimatedDays: 10 },
      { id: 'sg9', title: 'Gap Filling with Polybag Setts', description: 'Fill blank gaps using 30-day pre-sprouted polybag setts.', icon: 'Sprout', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sg10', title: 'Early Tillering Fertigation', description: 'Inject NPK 19:19:19 via drip system at 45 DAS.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sg11', title: 'Early Shoot Borer Scouting', description: 'Check for dead heart symptoms in young shoots.', icon: 'Search', category: 'Protection', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sg12', title: 'Partial Earthing Up (1st Stage)', description: 'Move soil into trenches to cover shoot bases at 90 DAS.', icon: 'Tractor', category: 'Maintenance', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sg13', title: 'Grand Growth Nitrogen Dosing', description: 'Fertigate Urea split 3 (100 kg N/ha) during rapid elongation.', icon: 'Zap', category: 'Maintenance', points: 160, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sg14', title: 'Trash Mulching in Inter-rows', description: 'Remove dry lower leaves and mulch inter-row furrows.', icon: 'Leaf', category: 'Maintenance', points: 170, ecoPoints: 170, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sg15', title: 'Final Heavy Earthing Up', description: 'Build high ridges around cane hills at 150 DAS.', icon: 'Tractor', category: 'Maintenance', points: 160, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sg16', title: 'Cane Propping & Tying', description: 'Tie adjacent cane stalks together to withstand high winds.', icon: 'ShieldCheck', category: 'Protection', points: 180, ecoPoints: 110, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sg17', title: 'Brix Sugar Maturity Testing', description: 'Measure juice Brix using hand refractometer (>18° target).', icon: 'Check', category: 'Harvest', points: 140, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sg18', title: 'Terminal Water Withholding', description: 'Stop drip irrigation completely 15 days before harvest.', icon: 'Droplets', category: 'Harvest', points: 120, ecoPoints: 90, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'sg19', title: 'Ground Level Cane Cutting', description: 'Cut mature canes at ground level to maximize sugar yield.', icon: 'Check', category: 'Harvest', points: 300, ecoPoints: 70, verificationType: 'camera', estimatedDays: 5 },
      { id: 'sg20', title: 'Trash Stripping & Mill Dispatch', description: 'Strip top leaves, bundle canes, weigh and dispatch to mill.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 }
    ]
  },
  {
    id: 'c6',
    name: 'Hybrid Tomato',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    funFact: 'Rich in Lycopene, tomatoes are among the top high-value crops in precision greenhouses.',
    subsidies: ['MIDH Horticulture Mission', 'Mulching Sheet Grant', 'Drip & Polyhouse Subsidy'],
    season: 'Zaid',
    waterRequirement: 'Medium',
    soilSuitability: ['Loamy', 'Sandy'],
    waterInstruction: 'Daily light drip fertigation; keep root zone evenly moist without water stagnation.',
    spacing: '60cm row-to-row x 45cm plant-to-plant',
    careTips: ['Use 25-micron silver-black plastic mulch', 'Stake plants firmly with bamboo poles at 20 DAT', 'Prune lower yellow leaves (desuckering) to enhance fruit size'],
    workflow: [
      { id: 'tm1', title: 'Pro-Tray Coco-Peat Prep', description: 'Fill 98-hole seedling pro-trays with sterilized coco-peat.', icon: 'Layers', category: 'Preparation', points: 100, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'tm2', title: 'Hybrid Seed Sowing in Trays', description: 'Sow 1 F1 hybrid seed per cell and cover with vermiculite.', icon: 'Sprout', category: 'Preparation', points: 120, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm3', title: 'Nursery Damping-Off Guard', description: 'Spray Trichoderma harzianum to prevent damping-off disease.', icon: 'ShieldCheck', category: 'Preparation', points: 130, ecoPoints: 120, verificationType: 'camera', estimatedDays: 20 },
      { id: 'tm4', title: 'Raised Bed & Drip Laying', description: 'Form 90cm wide raised beds and lay 16mm drip lateral lines.', icon: 'Tractor', category: 'Preparation', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'tm5', title: 'Silver-Black Mulch Laying', description: 'Cover beds with 25-micron UV-stabilized plastic mulch film.', icon: 'Layers', category: 'Preparation', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm6', title: 'Mulch Hole Punching', description: 'Punch 5cm holes at 45cm staggered spacing along drip emitters.', icon: 'Zap', category: 'Preparation', points: 110, ecoPoints: 50, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm7', title: 'Seedling Hardening & Root Dip', description: 'Expose 25-day seedlings to sun & dip roots in Bio-NPK.', icon: 'Leaf', category: 'Sowing', points: 130, ecoPoints: 100, verificationType: 'camera', estimatedDays: 2 },
      { id: 'tm8', title: 'Evening Transplants', description: 'Transplant seedlings into mulch holes in late afternoon.', icon: 'Sprout', category: 'Sowing', points: 190, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'tm9', title: 'Starter Drip Fertigation', description: 'Fertigate 19:19:19 @ 3kg/acre for rapid root establishment.', icon: 'Droplets', category: 'Sowing', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm10', title: 'Seedling Survival Audit', description: 'Audit 98% plant survival at 7 DAT; replace wilted plants.', icon: 'Sprout', category: 'Maintenance', points: 110, ecoPoints: 50, verificationType: 'camera', estimatedDays: 5 },
      { id: 'tm11', title: 'Bamboo Staking Installation', description: 'Erect 6-foot bamboo stakes every 10 feet along rows.', icon: 'Tractor', category: 'Maintenance', points: 160, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'tm12', title: 'Trellising & Wire Stringing', description: 'String GI wire & twine to tie growing tomato stems upright.', icon: 'Zap', category: 'Maintenance', points: 160, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'tm13', title: 'Desuckering & Side Pruning', description: 'Prune side suckers below 1st flower cluster to concentrate vigor.', icon: 'Leaf', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 3 },
      { id: 'tm14', title: 'Yellow Sticky Trap Deployment', description: 'Hang 20 yellow & blue sticky cards/acre for whiteflies & thrips.', icon: 'Search', category: 'Protection', points: 140, ecoPoints: 150, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm15', title: 'Calcium & Boron Foliar Spray', description: 'Spray 0.2% Calcium Nitrate + Boron to prevent Blossom End Rot.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm16', title: 'Early Blight Fungicide Guard', description: 'Spray Bacillus subtilis @ 5g/L during humid canopy phase.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 140, verificationType: 'camera', estimatedDays: 1 },
      { id: 'tm17', title: 'Fruit Set Fertigation', description: 'Inject High-Potassium 13:0:45 @ 5kg/acre during fruit swell.', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'tm18', title: 'Breaker Stage Ripening Audit', description: 'Check for pink breaker color stage at fruit blossom end.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'tm19', title: 'Selective Hand Harvesting', description: 'Harvest firm pink-red tomatoes with calyx intact into crates.', icon: 'Check', category: 'Harvest', points: 240, ecoPoints: 80, verificationType: 'camera', estimatedDays: 10 },
      { id: 'tm20', title: 'Sorting, Grading & Plastic Crate Packing', description: 'Grade by size/color, pack in ventilated crates for Mandi dispatch.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2 }
    ]
  },
  {
    id: 'c7',
    name: 'Organic Soybean',
    category: 'Oilseeds',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&q=80&w=800',
    funFact: 'Soybeans fix their own atmospheric nitrogen through natural root nodule bacteria.',
    subsidies: ['National Oilseeds Mission', 'Bio-Input Subsidy', 'MP Soybean Board Grant'],
    season: 'Kharif',
    waterRequirement: 'Low',
    soilSuitability: ['Black', 'Loamy'],
    waterInstruction: 'Rainfed crop; provide protective irrigation only during pod initiation if dry.',
    spacing: '45cm row-to-row x 5cm plant-to-plant',
    careTips: ['Inoculate with Bradyrhizobium japonicum culture', 'Ensure seed depth does not exceed 3-4cm', 'Harvest immediately when pods turn brown to avoid pod shattering'],
    workflow: [
      { id: 'sb1', title: 'Black Soil Tillage', description: 'Plough field 2 times to achieve pulverized moist seedbed.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sb2', title: 'Bio-Char & FYM Dosing', description: 'Incorporate 8t FYM + 1t Biochar per hectare.', icon: 'Layers', category: 'Preparation', points: 120, ecoPoints: 120, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb3', title: 'Seed Germination & Viability Audit', description: 'Test 100 seeds in damp cloth to verify >80% sprout rate.', icon: 'ShieldCheck', category: 'Sowing', points: 90, ecoPoints: 50, verificationType: 'checklist', estimatedDays: 3 },
      { id: 'sb4', title: 'Bradyrhizobium Inoculation', description: 'Treat seeds with Bradyrhizobium japonicum @ 10g/kg seed.', icon: 'ShieldCheck', category: 'Sowing', points: 140, ecoPoints: 150, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sb5', title: 'PSB Bio-Fertilizer Coating', description: 'Add Phosphate Solubilizing Bacteria (PSB) slurry to seeds.', icon: 'Leaf', category: 'Sowing', points: 130, ecoPoints: 130, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sb6', title: 'Line Sowing with Seed Drill', description: 'Sow treated seeds at 45cm row distance at 3.5cm depth.', icon: 'Sprout', category: 'Sowing', points: 170, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb7', title: 'Planking for Moisture Retention', description: 'Run light wooden plank over sown rows to firm soil.', icon: 'Tractor', category: 'Sowing', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sb8', title: 'Emergence & Plant Stand Count', description: 'Audit seedling emergence at 5-7 DAS for 40 plants/m².', icon: 'Sprout', category: 'Maintenance', points: 110, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'sb9', title: 'Gap Filling with Pre-Soaked Seed', description: 'Fill any row gaps within 8 DAS using pre-sprouted seed.', icon: 'Sprout', category: 'Maintenance', points: 120, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb10', title: 'First Mechanical Hoeing', description: 'Run wheel hoe between rows at 20 DAS to kill early weeds.', icon: 'Recycle', category: 'Maintenance', points: 140, ecoPoints: 110, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb11', title: 'Root Nodulation Inspection', description: 'Uproot 5 sample plants at 30 DAS to count pink nitrogen nodules.', icon: 'Search', category: 'Maintenance', points: 150, ecoPoints: 140, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sb12', title: 'Girdle Beetle & Tobacco Caterpillar Guard', description: 'Scout leaves for cut margins or ringed petioles.', icon: 'Search', category: 'Protection', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sb13', title: 'Beauveria bassiana Bio-Spray', description: 'Foliar spray entomopathogenic fungus @ 5g/L for caterpillars.', icon: 'Leaf', category: 'Protection', points: 170, ecoPoints: 170, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sb14', title: 'Flowering Stage Moisture Check', description: 'Provide supplementary furrow irrigation if dry spell hits at flowering.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb15', title: '0:52:34 Foliar Spray', description: 'Spray 1% Monopotassium Phosphate during pod initiation.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'sb16', title: 'Pod Filling Audit', description: 'Inspect 20 pods per plant to ensure 3 plump seeds per pod.', icon: 'Check', category: 'Maintenance', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'sb17', title: 'Leaf Senescence Maturity Audit', description: 'Check for yellowing leaves and pod golden brown color.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'sb18', title: 'Sickle Cutting / Harvesting', description: 'Cut plants near ground level when leaves shed completely.', icon: 'Check', category: 'Harvest', points: 210, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb19', title: 'Threshing & Pod Separation', description: 'Pass dried plants through thresher at low drum speed (400 rpm).', icon: 'Tractor', category: 'Harvest', points: 190, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'sb20', title: 'Winnowing, Drying & Grain Storage', description: 'Sun dry seed to 10% moisture, winnow chaff, and store in jute bags.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 3 }
    ]
  },
  {
    id: 'c8',
    name: 'Yellow Mustard',
    category: 'Oilseeds',
    image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&q=80&w=800',
    funFact: 'Bright yellow mustard blooms attract honeybees, driving natural ecosystem pollination.',
    subsidies: ['Oilseed Development Scheme', 'PMFBY Coverage', 'National Mission on Edible Oils'],
    season: 'Rabi',
    waterRequirement: 'Low',
    soilSuitability: ['Loamy', 'Sandy'],
    waterInstruction: 'Requires 2 irrigations: 1st at rosette stage (28 DAS), 2nd at pod filling (55 DAS).',
    spacing: '30cm row-to-row x 10cm plant-to-plant',
    careTips: ['Sow in October for optimum oil content', 'Thin plants early to prevent crowding and stem rot', 'Monitor for aphids during cloudy warm spells in January'],
    workflow: [
      { id: 'ms1', title: 'Fine Tilth Seedbed Preparation', description: 'Perform 3 shallow ploughings followed by planking to conserve moisture.', icon: 'Tractor', category: 'Preparation', points: 90, ecoPoints: 50, verificationType: 'camera', estimatedDays: 3 },
      { id: 'ms2', title: 'FYM & Sulfur Basal Dosing', description: 'Broadcasting 6t FYM + 40kg Elemental Sulfur per hectare.', icon: 'Layers', category: 'Preparation', points: 110, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms3', title: 'Certified Seed Purity Audit', description: 'Verify Pusa Mustard 30 seed purity tag & germination (>85%).', icon: 'ShieldCheck', category: 'Sowing', points: 90, ecoPoints: 40, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'ms4', title: 'Trichoderma Seed Treatment', description: 'Treat seeds with Trichoderma harzianum @ 6g/kg seed.', icon: 'ShieldCheck', category: 'Sowing', points: 130, ecoPoints: 110, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms5', title: 'Line Sowing with Pora/Rabi Drill', description: 'Sow seeds 30cm apart at shallow 2-3cm depth.', icon: 'Sprout', category: 'Sowing', points: 150, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ms6', title: 'Planking for Soil Moisture Lock', description: 'Run light wooden roller over rows to seal soil moisture.', icon: 'Tractor', category: 'Sowing', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms7', title: 'Sprout Emergence Audit', description: 'Inspect rows at 5 DAS for uniform seedling emergence.', icon: 'Sprout', category: 'Maintenance', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 5 },
      { id: 'ms8', title: 'First Thinning at 15 DAS', description: 'Thin crowded plants to maintain 10cm plant distance.', icon: 'Recycle', category: 'Maintenance', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms9', title: 'Second Thinning & Weeding', description: 'Final thinning at 25 DAS to achieve optimum 30 plants/m².', icon: 'Recycle', category: 'Maintenance', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms10', title: 'Rosette Stage 1st Irrigation', description: 'Apply 1st light irrigation at 28 DAS before flowering.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms11', title: 'Urea Top Dressing', description: 'Broadcast Nitrogen (40 kg/ha) immediately after 1st irrigation.', icon: 'Zap', category: 'Maintenance', points: 130, ecoPoints: 50, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms12', title: 'Mustard Aphid Scouting', description: 'Inspect central shoots for green aphid colonies in Jan.', icon: 'Search', category: 'Protection', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'ms13', title: 'Verticillium / Neem Bio-Spray', description: 'Spray Neem oil 10,000 ppm @ 2ml/L to suppress aphids.', icon: 'Leaf', category: 'Protection', points: 160, ecoPoints: 160, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms14', title: 'Alternaria Blight Guard', description: 'Spray Copper Oxychloride 0.2% if dark spots appear on lower leaves.', icon: 'ShieldCheck', category: 'Protection', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms15', title: 'Pod Formation 2nd Irrigation', description: 'Apply 2nd irrigation at 55 DAS during siliqua pod expansion.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms16', title: 'Foliar Sulfur & Boron Spray', description: 'Spray 0.2% Solubor to enhance seed oil percentage.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'ms17', title: 'Pod Yellowing Maturity Audit', description: 'Audit field when 75% of siliquae turn golden yellow.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'ms18', title: 'Morning Harvesting & Swathing', description: 'Harvest crop in early morning hours to prevent pod shattering.', icon: 'Check', category: 'Harvest', points: 200, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'ms19', title: 'Sun Drying on Tarpaulin Sheets', description: 'Stack harvested plants on canvas sheets for 4 days of sun drying.', icon: 'Layers', category: 'Harvest', points: 150, ecoPoints: 70, verificationType: 'camera', estimatedDays: 4 },
      { id: 'ms20', title: 'Threshing, Cleaning & Seed Storage', description: 'Beat dried pods, winnow seeds, dry to 8% moisture & bag.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 2 }
    ]
  },
  {
    id: 'c9',
    name: 'Potato (Kufri Jyoti)',
    category: 'Tubers',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
    funFact: 'Potatoes yield more food energy per liter of water than almost any other major staple crop.',
    subsidies: ['Cold Storage Grant', 'Seed Potato Subsidy', 'Horticulture Mechanization Scheme'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    soilSuitability: ['Alluvial', 'Loamy'],
    waterInstruction: 'Light frequent furrow irrigations every 7-10 days; stop water 12 days before harvest.',
    spacing: '60cm ridge-to-ridge x 20cm tuber-to-tuber',
    careTips: ['Use well-sprouted, disease-free seed tubers with 2-3 eyes', 'Earthing up at 30 DAS is mandatory to prevent tuber greening', 'Dehaulm (cut top vines) 10 days before digging to harden potato skin'],
    workflow: [
      { id: 'pt1', title: 'Deep Summer Ploughing', description: 'Plough field to 30cm depth and expose soil to sunlight.', icon: 'Tractor', category: 'Preparation', points: 110, ecoPoints: 50, verificationType: 'camera', estimatedDays: 4 },
      { id: 'pt2', title: 'FYM & Well-Rotated Compost Dosing', description: 'Apply 25t FYM + 100kg Neem cake per hectare.', icon: 'Layers', category: 'Preparation', points: 130, ecoPoints: 100, verificationType: 'camera', estimatedDays: 2 },
      { id: 'pt3', title: 'Rotavator Fine Seedbed Preparation', description: 'Create loose, friable clod-free soil tilth using rotavator.', icon: 'Tractor', category: 'Preparation', points: 110, ecoPoints: 40, verificationType: 'camera', estimatedDays: 2 },
      { id: 'pt4', title: 'Seed Tuber Inspection & Sprouting', description: 'Inspect cold-stored seed tubers for 2-3 sturdy sprouts.', icon: 'ShieldCheck', category: 'Sowing', points: 100, ecoPoints: 50, verificationType: 'checklist', estimatedDays: 5 },
      { id: 'pt5', title: 'Tuber Cut Fungicide Treatment', description: 'Cut large tubers and dip cut surfaces in Mancozeb 0.2% slurry.', icon: 'ShieldCheck', category: 'Sowing', points: 140, ecoPoints: 70, verificationType: 'camera', estimatedDays: 1 },
      { id: 'pt6', title: 'Ridge Formation (60cm Spacing)', description: 'Open ridges 60cm apart using tractor-drawn ridger.', icon: 'Tractor', category: 'Sowing', points: 130, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'pt7', title: 'Tuber Planting on Ridges', description: 'Plant seed tubers 5cm deep at 20cm intervals on ridges.', icon: 'Sprout', category: 'Sowing', points: 180, ecoPoints: 50, verificationType: 'camera', estimatedDays: 2 },
      { id: 'pt8', title: 'Initial Light Furrow Irrigation', description: 'Provide light furrow water filling 2/3 of ridge height.', icon: 'Droplets', category: 'Sowing', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'pt9', title: 'Sprout Emergence Audit', description: 'Inspect ridges at 12-15 DAS for uniform shoot emergence.', icon: 'Sprout', category: 'Maintenance', points: 110, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'pt10', title: 'First Weeding & Hoeing', description: 'Loosen soil on ridges and destroy weed growth at 20 DAS.', icon: 'Recycle', category: 'Maintenance', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2 },
      { id: 'pt11', title: 'Earthing Up Ridge Building', description: 'Mound soil to build high 25cm ridges around shoots at 30 DAS.', icon: 'Tractor', category: 'Maintenance', points: 160, ecoPoints: 90, verificationType: 'camera', estimatedDays: 2 },
      { id: 'pt12', title: 'Tuber Initiation Fertigation', description: 'Broadcast Nitrogen top dressing & irrigate at stolon formation.', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 60, verificationType: 'camera', estimatedDays: 1 },
      { id: 'pt13', title: 'Late Blight Disease Scouting', description: 'Inspect lower leaves for water-soaked dark lesions.', icon: 'Search', category: 'Protection', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'pt14', title: 'Bio-Fungicide Protective Spray', description: 'Spray Trichoderma / Mancozeb @ 2g/L as preventive shield.', icon: 'ShieldCheck', category: 'Protection', points: 160, ecoPoints: 120, verificationType: 'camera', estimatedDays: 1 },
      { id: 'pt15', title: 'Potassium Nitrate Foliar Dosing', description: 'Spray 1% KNO3 during rapid tuber bulking phase.', icon: 'Zap', category: 'Maintenance', points: 150, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'pt16', title: 'Terminal Irrigation Stop', description: 'Cease furrow irrigation completely 12 days before harvest.', icon: 'Droplets', category: 'Harvest', points: 120, ecoPoints: 90, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'pt17', title: 'Dehaulming (Haulm Cutting)', description: 'Cut green foliage vines at ground level 10 days before digging.', icon: 'Zap', category: 'Harvest', points: 170, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1 },
      { id: 'pt18', title: 'Tuber Skin Hardening Audit', description: 'Inspect tuber skin to ensure firmly set epidermal layer.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'pt19', title: 'Tractor Digging & Harvesting', description: 'Dig tubers using potato digger and pick manually.', icon: 'Tractor', category: 'Harvest', points: 260, ecoPoints: 70, verificationType: 'camera', estimatedDays: 3 },
      { id: 'pt20', title: 'Sorting, Curing & Cold Storage Packing', description: 'Curate in shade 10 days, grade by size and bag for cold store.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 5 }
    ]
  },
  {
    id: 'c10',
    name: 'Chickpea (Chana)',
    category: 'Pulses',
    image: 'https://images.unsplash.com/photo-1515543904379-3d757abe9962?auto=format&fit=crop&q=80&w=800',
    funFact: 'Chickpea roots release natural organic acids that unlock trapped soil phosphorus.',
    subsidies: ['NFSM Pulses Grant', 'MSP Support', 'Pulses Seed Village Scheme'],
    season: 'Rabi',
    waterRequirement: 'Low',
    soilSuitability: ['Black', 'Sandy'],
    waterInstruction: 'Requires minimal water; 1 light irrigation at branching and 1 at pod filling.',
    spacing: '30cm row-to-row x 10cm plant-to-plant',
    careTips: ['Perform apical nipping at 30 DAS to encourage lateral branching', 'Avoid excessive nitrogen which causes heavy vegetative growth without pods', 'Harvest when plants turn reddish-brown and seeds rattle inside pods'],
    workflow: [
      { id: 'cp1', title: 'Conservation Tillage & Moisture Lock', description: 'Cross plough black soil shallowly to conserve residual moisture.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 80, verificationType: 'camera', estimatedDays: 3 },
      { id: 'cp2', title: 'FYM & Rock Phosphate Dosing', description: 'Incorporate 5t FYM + 250kg Rock Phosphate per hectare.', icon: 'Layers', category: 'Preparation', points: 110, ecoPoints: 100, verificationType: 'camera', estimatedDays: 2 },
      { id: 'cp3', title: 'Pulses Seed Certified Quality Audit', description: 'Inspect JG-11 / RVG-202 certified seed purity tag & vigor.', icon: 'ShieldCheck', category: 'Sowing', points: 90, ecoPoints: 40, verificationType: 'checklist', estimatedDays: 1 },
      { id: 'cp4', title: 'Rhizobium Legume Inoculation', description: 'Treat seeds with Rhizobium ciceri culture @ 20g/kg seed.', icon: 'ShieldCheck', category: 'Sowing', points: 140, ecoPoints: 140, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp5', title: 'PSB & Trichoderma Double Coating', description: 'Add PSB bio-fertilizer + Trichoderma viride slurry to seeds.', icon: 'Leaf', category: 'Sowing', points: 140, ecoPoints: 130, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp6', title: 'Line Sowing with Seed Drill', description: 'Sow treated seeds at 30cm row spacing at 8cm deep moist soil layer.', icon: 'Sprout', category: 'Sowing', points: 170, ecoPoints: 60, verificationType: 'camera', estimatedDays: 2 },
      { id: 'cp7', title: 'Planking & Soil Sealing', description: 'Pass light wooden plank to press moist soil around seeds.', icon: 'Tractor', category: 'Sowing', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp8', title: 'Emergence & Stand Count Audit', description: 'Audit field at 8-10 DAS for 33 plants/m² target stand.', icon: 'Sprout', category: 'Maintenance', points: 110, ecoPoints: 60, verificationType: 'camera', estimatedDays: 5 },
      { id: 'cp9', title: 'Thinning Extra Seedlings', description: 'Thin plants at 15 DAS leaving 10cm plant-to-plant spacing.', icon: 'Recycle', category: 'Maintenance', points: 120, ecoPoints: 70, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp10', title: 'First Interculture Weeding', description: 'Perform hoeing at 25 DAS to control early weed competition.', icon: 'Tractor', category: 'Maintenance', points: 130, ecoPoints: 80, verificationType: 'camera', estimatedDays: 2 },
      { id: 'cp11', title: 'Apical Nipping (Top Plucking)', description: 'Nip top branch tips at 30 DAS to induce profuse bushy branching.', icon: 'Zap', category: 'Maintenance', points: 160, ecoPoints: 120, verificationType: 'camera', estimatedDays: 2 },
      { id: 'cp12', title: 'Branching Stage Light Irrigation', description: 'Provide 1st light irrigation (5cm) at pre-flowering branching stage.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp13', title: 'Pod Borer (Helicoverpa) Trap Audit', description: 'Install 5 Helicoverpa pheromone traps per acre.', icon: 'Search', category: 'Protection', points: 150, ecoPoints: 150, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp14', title: 'HaNPV Bio-Insecticide Spray', description: 'Spray Helicoverpa NPV @ 250 LE/ha during early podding.', icon: 'Leaf', category: 'Protection', points: 170, ecoPoints: 180, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp15', title: 'Pod Development 2nd Irrigation', description: 'Apply 2nd light irrigation at pod filling stage.', icon: 'Droplets', category: 'Maintenance', points: 140, ecoPoints: 80, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp16', title: 'Foliar Ammonium Molybdate Dosing', description: 'Spray 0.05% Sodium Molybdate to enhance nitrogen fixation.', icon: 'Zap', category: 'Maintenance', points: 140, ecoPoints: 90, verificationType: 'camera', estimatedDays: 1 },
      { id: 'cp17', title: 'Pod Maturity Sound Test', description: 'Shake plants; audit when dry seeds rattle loudly inside pods.', icon: 'Check', category: 'Harvest', points: 130, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'cp18', title: 'Crop Cutting & Swathing', description: 'Cut plants with sickle when leaves turn straw yellow and drop.', icon: 'Check', category: 'Harvest', points: 210, ecoPoints: 70, verificationType: 'camera', estimatedDays: 2 },
      { id: 'cp19', title: 'Field Sun Drying & Threshing', description: 'Sun dry cut plants on floor for 3 days and thresh with tractor roller.', icon: 'Tractor', category: 'Harvest', points: 190, ecoPoints: 60, verificationType: 'camera', estimatedDays: 3 },
      { id: 'cp20', title: 'Winnowing, Cleaning & Grain Storage', description: 'Winnow seeds, sun dry to 9% moisture and store with neem leaves.', icon: 'ShieldCheck', category: 'Post-Harvest', points: 200, ecoPoints: 100, verificationType: 'camera', estimatedDays: 3 }
    ]
  }
];

export const AVAILABLE_CROPS = CULTIVATION_LIBRARY;

export const MOCK_SURPLUS: SurplusCrop[] = [
  { id: 's1', name: 'Tomato', quantity: 50, unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
  { id: 's2', name: 'Coconut', quantity: 200, unit: 'units', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=400' },
  { id: 's3', name: 'Wheat (Grade A)', quantity: 150, unit: 'kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400' },
  { id: 's4', name: 'Basmati Rice', quantity: 120, unit: 'kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400' },
  { id: 's5', name: 'Cotton (Bt Hybrid)', quantity: 80, unit: 'kg', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=400' },
  { id: 's6', name: 'Organic Maize', quantity: 300, unit: 'kg', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400' },
  { id: 's7', name: 'Sugarcane', quantity: 500, unit: 'kg', image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&q=80&w=400' },
  { id: 's8', name: 'Organic Soybean', quantity: 100, unit: 'kg', image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&q=80&w=400' },
  { id: 's9', name: 'Yellow Mustard', quantity: 90, unit: 'kg', image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&q=80&w=400' },
  { id: 's10', name: 'Potato', quantity: 250, unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400' }
];

export const CONVERSION_RECIPES: Record<string, ConversionRecipe[]> = {
  'Tomato': [
    { id: 'r1', productName: 'Tomato Puree', rewardPoints: 150, description: 'Concentrated tomato pulp for long-term culinary storage.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'r2', productName: 'Sun-dried Tomatoes', rewardPoints: 200, description: 'Traditional solar dehydration for gourmet culinary exports.' }
  ],
  'Coconut': [
    { id: 'r3', productName: 'Cold-Pressed Coconut Oil', rewardPoints: 300, description: 'Virgin extractions rich in lauric acid.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'r4', productName: 'Desiccated Coconut Powder', rewardPoints: 180, description: 'Dehydrated grated coconut for bakery & confectionery.' }
  ],
  'Wheat (Grade A)': [
    { id: 'r5', productName: 'Stone-Ground Whole Wheat Atta', rewardPoints: 220, description: 'Traditional chakki fresh high-fiber organic flour.' },
    { id: 'r6', productName: 'Malted Wheat Porridge Mix', rewardPoints: 250, description: 'Sprouted and roasted health drink mix.' }
  ],
  'Basmati Rice': [
    { id: 'r7', productName: 'Organic Rice Bran Oil', rewardPoints: 350, description: 'Heart-healthy cholesterol-lowering cooking oil.' },
    { id: 'r8', productName: 'Artisanal Puffed Basmati Flakes', rewardPoints: 160, description: 'Traditional toasted snack flakes.' }
  ],
  'Cotton (Bt Hybrid)': [
    { id: 'r9', productName: 'Refined Cottonseed Cooking Oil', rewardPoints: 280, description: 'High-smoke point cooking oil extracted from seed cake.' },
    { id: 'r10', productName: 'Absorbent Surgical Cotton Rolls', rewardPoints: 320, description: 'Purified lint-free medical grade cotton.' }
  ],
  'Organic Maize': [
    { id: 'r11', productName: 'Non-GMO Corn Starch Flour', rewardPoints: 200, description: 'Fine culinary binder and gluten-free baking flour.' },
    { id: 'r12', productName: 'Roasted Corn Flake Snacks', rewardPoints: 180, description: 'Crispy seasoned organic corn snacks.' }
  ],
  'Sugarcane': [
    { id: 'r13', productName: 'Organic Gur (Jaggery Powder)', rewardPoints: 290, description: 'Unrefined iron-rich mineral sweetener.' },
    { id: 'r14', productName: 'Sugarcane Bagasse Bio-Plates', rewardPoints: 340, description: 'Eco-friendly biodegradable dinnerware.' }
  ],
  'Organic Soybean': [
    { id: 'r15', productName: 'Artisanal Organic Tofu (Soy Cheese)', rewardPoints: 310, description: 'High-protein fresh soy curd blocks.' },
    { id: 'r16', productName: 'Fortified Soy Milk Beverage', rewardPoints: 240, description: 'Dairy-free lactose-free plant protein milk.' }
  ],
  'Yellow Mustard': [
    { id: 'r17', productName: 'Kachi Ghani Mustard Oil', rewardPoints: 330, description: 'Pungent cold-pressed raw mustard oil.' },
    { id: 'r18', productName: 'Coarse Mustard Paste Dressing', rewardPoints: 190, description: 'Spiced culinary mustard condiment.' }
  ],
  'Potato': [
    { id: 'r19', productName: 'Dehydrated Potato Flakes', rewardPoints: 210, description: 'Instant mashed potato flakes for snack manufacturing.' },
    { id: 'r20', productName: 'Organic Potato Starch Powder', rewardPoints: 260, description: 'High-purity gluten-free food binder.' }
  ]
};

export const MOCK_SUBSIDIES: Subsidy[] = [
  {
    id: 'sb1',
    name: 'PM-Kisan Samman Nidhi',
    state: 'Central',
    category: 'Crops',
    description: 'Direct income support of ₹6,000 per year to all landholding farmer families across 3 equal installments.',
    eligibility: 'All landholding farmer families with cultivable land in their names.',
    benefits: 'Direct bank transfer of ₹2,000 every 4 months (₹6,000 annually).',
    process: 'Online registration via PM-Kisan portal or nearest CSC center.',
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 'sb2',
    name: 'PM Krishi Sinchayee Yojana (PMKSY)',
    state: 'Central',
    category: 'Water',
    description: 'Financial assistance of up to 55% for small farmers installing micro-irrigation (Drip & Sprinkler) systems.',
    eligibility: 'Farmers owning cultivable land with accessible water source.',
    benefits: '55% subsidy for small/marginal farmers, 45% for general farmers.',
    process: 'Apply through State Horticulture / Agriculture Portal with land records.',
    link: 'https://pmksy.gov.in/'
  },
  {
    id: 'sb3',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    state: 'Central',
    category: 'Machinery',
    description: 'Subsidies up to 50%-80% for purchasing tractors, power tillers, rotavators, and setting up Custom Hiring Centers.',
    eligibility: 'Individual farmers, SHGs, FPOs, and registered cooperatives.',
    benefits: '40%-50% for individual machinery, up to 80% for Custom Hiring Hubs.',
    process: 'Submit application on Agrimachinery portal with Aadhaar & land proof.',
    link: 'https://agrimachinery.nic.in/'
  },
  {
    id: 'sb4',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    state: 'Central',
    category: 'Crops',
    description: 'Financial support of ₹50,000 per hectare over 3 years for organic farming cluster adoption and certification.',
    eligibility: 'Farmers forming clusters of 50 or more acres.',
    benefits: '₹31,000 directly for organic inputs (seeds, bio-fertilizers, bio-pesticides).',
    process: 'Form a local organic cluster and register through District Agriculture Officer.',
    link: 'https://pgsindia-ncof.dac.gov.in/'
  },
  {
    id: 'sb5',
    name: 'National Food Security Mission (NFSM)',
    state: 'Central',
    category: 'Crops',
    description: 'Assistance for high-yielding seed minikits, soil ameliorants, and bio-fertilizer demonstrations for rice, wheat & pulses.',
    eligibility: 'Farmers growing pulses, rice, wheat, coarse cereals, and commercial crops.',
    benefits: 'Free seed minikits and ₹5,000/ha subsidy for field demonstrations.',
    process: 'Contact local Krishi Vigyan Kendra (KVK) or Block Agriculture Officer.',
    link: 'https://nfsm.gov.in/'
  },
  {
    id: 'sb6',
    name: 'Mission for Integrated Development of Horticulture (MIDH)',
    state: 'Central',
    category: 'Crops',
    description: 'Financial assistance for polyhouses, shade nets, high-density orchards, drip setups, and post-harvest infrastructure.',
    eligibility: 'Individual horticulture farmers, FPOs, and nursery owners.',
    benefits: 'Up to 50% capital grant for polyhouse and shade-net installation.',
    process: 'Apply through State Horticulture Mission office.',
    link: 'https://midh.gov.in/'
  },
  {
    id: 'sb7',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    state: 'Central',
    category: 'Machinery',
    description: 'Credit-linked capital subsidy of 35% (up to ₹10 Lakhs) for establishing micro-food processing units.',
    eligibility: 'Individual entrepreneurs, SHGs, Cooperatives, and FPOs.',
    benefits: '35% capital subsidy max ₹10 Lakhs + seed capital of ₹40,000 for SHG members.',
    process: 'Apply online through PMFME portal with project DPR.',
    link: 'https://pmfme.mofpi.gov.in/'
  },
  {
    id: 'sb8',
    name: 'Soil Health Card Scheme',
    state: 'Central',
    category: 'Crops',
    description: 'Free soil testing and customized NPK micro-nutrient recommendation cards issued every 2 years.',
    eligibility: 'All agricultural landholders across India.',
    benefits: 'Free lab soil testing report detailing 12 nutrient parameters.',
    process: 'Soil samples collected directly from field by Village Agriculture Assistant.',
    link: 'https://soilhealth.dac.gov.in/'
  },
  {
    id: 'sb9',
    name: 'National Mission on Edible Oils - Oil Palm (NMEO-OP)',
    state: 'Central',
    category: 'Crops',
    description: 'Subsidy of ₹29,000/ha for planting material, maintenance, and intercropping support for oilseed crops.',
    eligibility: 'Farmers in designated oilseed and oil palm expansion districts.',
    benefits: 'Financial assistance for planting inputs + price viability guarantee.',
    process: 'Register with District Oilseeds Development Officer.',
    link: 'https://nmeo.dac.gov.in/'
  },
  {
    id: 'sb10',
    name: 'Agriculture Infrastructure Fund (AIF)',
    state: 'Central',
    category: 'Machinery',
    description: 'Medium-long term debt financing facility with 3% interest subvention for post-harvest management infrastructure.',
    eligibility: 'Farmers, FPOs, Agri-entrepreneurs, Startups, and SHGs.',
    benefits: '3% interest subvention per annum up to ₹2 Crores loan for 7 years.',
    process: 'Apply directly on AIF online portal with project proposal.',
    link: 'https://agriinfra.dac.gov.in/'
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
    name: 'PM Fasal Bima Yojana (PMFBY)',
    type: 'Government',
    coverage: 'Comprehensive risk coverage from pre-sowing to post-harvest against unpreventable natural risks.',
    premium: '2.0% for Kharif, 1.5% for Rabi, 5.0% for Commercial Crops',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.',
    claimProcess: 'Immediate notification within 72 hours of crop loss to crop insurance app, bank, or toll-free helpline.',
    link: 'https://pmfby.gov.in/',
    eligibleCrops: ['Wheat', 'Rice', 'Cotton', 'Maize', 'Soybean', 'Mustard', 'Potato', 'Chickpea'],
    eligibleSteps: ['Sowing', 'Maintenance', 'Harvest', 'Post-Harvest'],
    agency: 'Ministry of Agriculture / Agricultural Insurance Company of India'
  },
  {
    id: 'i2',
    name: 'Restructured Weather Based Crop Insurance Scheme (WBCIS)',
    type: 'Government',
    coverage: 'Parametric index insurance protecting against adverse weather conditions (rainfall deficit, frost, heatwaves, humidity).',
    premium: '1.5% - 2.0% capped maximum premium for farmers.',
    eligibility: 'Farmers in weather station-linked automatic recording zones.',
    claimProcess: 'Automatic claim settlement based on weather telemetry data without individual field loss assessment.',
    link: 'https://pmfby.gov.in/',
    eligibleCrops: ['Tomato', 'Sugarcane', 'Cotton', 'Mustard'],
    eligibleSteps: ['Sowing', 'Maintenance', 'Harvest'],
    agency: 'AIC of India & Authorized Insurers'
  },
  {
    id: 'i3',
    name: 'Coconut Palm Insurance Scheme (CPIS)',
    type: 'Government',
    coverage: 'Insurance protection against natural perils, storm damage, pest outbreak, and palm mortality.',
    premium: '₹9 - ₹14 per palm tree per year (75% subsidized by Coconut Development Board).',
    eligibility: 'Growers having 5 or more healthy bearing coconut palms in a compact block.',
    claimProcess: 'Submit loss report along with photographs to CDB Officer within 15 days of tree destruction.',
    link: 'https://coconutboard.in/',
    eligibleCrops: ['Coconut'],
    eligibleSteps: ['Maintenance', 'Harvest'],
    agency: 'Coconut Development Board & AIC'
  },
  {
    id: 'i4',
    name: 'Unified Package Insurance Scheme (UPIS)',
    type: 'Government',
    coverage: 'Single umbrella policy covering crop loss, tractor damage, pump set breakdown, personal accident, and farm building.',
    premium: 'Flexible actuarial package pricing based on assets covered.',
    eligibility: 'All landholding farmers registered with nationalized banks.',
    claimProcess: 'Single-window digital claim filing via PMFBY portal.',
    link: 'https://pmfby.gov.in/',
    eligibleCrops: ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane'],
    eligibleSteps: ['Preparation', 'Sowing', 'Maintenance', 'Harvest'],
    agency: 'National Insurance & GIC Re'
  },
  {
    id: 'i5',
    name: 'Livestock & Cattle Comprehensive Shield',
    type: 'App-Based',
    coverage: 'Indemnity protection against accidental death, disease outbreak, and permanent disability of farm cattle & livestock.',
    premium: '3% per annum of total sum insured.',
    eligibility: 'Farmers owning indigenous or hybrid dairy cattle, buffaloes, and draught animals.',
    claimProcess: 'Submit RFID ear-tag photo proof and veterinary certificate on AgroPlay Insurance tab.',
    link: 'https://dahd.nic.in/',
    eligibleCrops: ['Livestock'],
    eligibleSteps: ['Maintenance'],
    agency: 'AgroPlay Pro-Shield AI & ICICI Lombard'
  },
  {
    id: 'i6',
    name: 'Post-Harvest Storage & Transit Loss Shield',
    type: 'App-Based',
    coverage: 'Coverage against crop damage during farm-to-mandi transit, warehouse fires, flooding, and bag burst.',
    premium: '0.8% of produce invoice valuation.',
    eligibility: 'Farmers transporting produce to registered AGMARKNET mandis or warehouses.',
    claimProcess: 'Upload consignment receipt and photo proof of damaged bags within 24 hours.',
    link: 'https://wdra.gov.in/',
    eligibleCrops: ['Wheat', 'Rice', 'Soybean', 'Mustard', 'Chickpea'],
    eligibleSteps: ['Post-Harvest'],
    agency: 'AgroPlay Logistics Protection'
  },
  {
    id: 'i7',
    name: 'Aquaculture & Fish Farm Risk Cover',
    type: 'App-Based',
    coverage: 'Protection against fish/prawn mass mortality, water toxicity spikes, pond inundation, and disease outbreaks.',
    premium: '2.5% of total seed stocking cost.',
    eligibility: 'Registered inland fish farmers and prawn pond operators.',
    claimProcess: 'Submit water parameter test log and photo proof to field inspector.',
    link: 'https://dof.gov.in/',
    eligibleCrops: ['Fish', 'Shrimp'],
    eligibleSteps: ['Maintenance', 'Harvest'],
    agency: 'National Fisheries Development Board'
  },
  {
    id: 'i8',
    name: 'Micro-Irrigation & Drip Equipment Insurance',
    type: 'App-Based',
    coverage: 'Cover for drip line theft, rodent chewing damage, lateral pipe burst, and fertigation pump electrical burnout.',
    premium: '1.2% per year of total equipment invoice value.',
    eligibility: 'Farmers with installed drip/sprinkler systems under 5 years old.',
    claimProcess: 'Instant claim validation by uploading geo-tagged photo of broken component.',
    link: 'https://pmksy.gov.in/',
    eligibleCrops: ['Sugarcane', 'Tomato', 'Cotton', 'Maize'],
    eligibleSteps: ['Preparation', 'Maintenance'],
    agency: 'AgroPlay Hardware Shield'
  },
  {
    id: 'i9',
    name: 'Organic Yield Loss Indemnity Scheme',
    type: 'Government',
    coverage: 'Specialized yield loss protection tailored for certified organic farms suffering pest transition shock.',
    premium: '2.0% subsidized premium under NMSA organic guidelines.',
    eligibility: 'Certified organic growers with PGS-India or NPOP accreditation.',
    claimProcess: 'Organic audit verification by district PGS committee.',
    link: 'https://pgsindia-ncof.dac.gov.in/',
    eligibleCrops: ['Soybean', 'Maize', 'Wheat', 'Tomato'],
    eligibleSteps: ['Sowing', 'Maintenance', 'Harvest'],
    agency: 'NCOR Organic Board & AIC'
  },
  {
    id: '10',
    name: 'Greenhouse & Polyhouse Storm Protection Cover',
    type: 'App-Based',
    coverage: 'Insurance for polyhouse plastic film tear, GI frame collapse, and high-value crop destruction due to hailstorms or gales.',
    premium: '3.5% of polyhouse structural replacement cost.',
    eligibility: 'Protected cultivation farmers with polyhouses or shade-net structures.',
    claimProcess: 'Upload drone or camera video of storm damage via app for 48h settlement.',
    link: 'https://midh.gov.in/',
    eligibleCrops: ['Tomato', 'Flowers', 'Vegetables'],
    eligibleSteps: ['Preparation', 'Sowing', 'Maintenance', 'Harvest'],
    agency: 'AgroPlay Climate Tech Shield'
  }
];
