
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
    soilSuitability: ['Alluvial', 'Black'],
    workflow: [
      { id: 's1', title: 'Soil Preparation', description: 'Deep ploughing and leveling for optimal root depth.', icon: 'Tractor', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 7, tools: ['Plough', 'Leveler'] },
      { id: 's2', title: 'Seed Treatment', description: 'Applying bio-fungicides to protect from soil-borne pathogens.', icon: 'ShieldCheck', category: 'Sowing', points: 150, ecoPoints: 100, verificationType: 'camera', estimatedDays: 1, tools: ['Bio-fungicide', 'Mixing Tray'] },
      { id: 's3', title: 'Sowing', description: 'Precise seed distribution at 5cm depth.', icon: 'Sprout', category: 'Sowing', points: 200, ecoPoints: 50, verificationType: 'camera', estimatedDays: 3, tools: ['Seed Drill'] },
      { id: 's4', title: 'Irrigation Setup', description: 'Configuring drip or precision sprinkler systems.', icon: 'Droplets', category: 'Maintenance', points: 150, ecoPoints: 200, verificationType: 'checklist', estimatedDays: 2 }
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
    soilSuitability: ['Alluvial', 'Clayey'],
    workflow: [
      { id: 'b1', title: 'Nursery Prep', description: 'Preparing seedbeds for seedling growth.', icon: 'Layers', category: 'Preparation', points: 100, ecoPoints: 50, verificationType: 'camera', estimatedDays: 15 },
      { id: 'b2', title: 'Transplantation', description: 'Moving seedlings to puddled main field.', icon: 'Sprout', category: 'Sowing', points: 300, ecoPoints: 100, verificationType: 'camera', estimatedDays: 5 }
    ]
  }
];

export const AVAILABLE_CROPS = CULTIVATION_LIBRARY;

// Missing mock data exports added below
export const MOCK_SURPLUS: SurplusCrop[] = [
  { id: 's1', name: 'Tomato', quantity: 50, unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
  { id: 's2', name: 'Coconut', quantity: 200, unit: 'units', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=400' }
];

export const CONVERSION_RECIPES: Record<string, ConversionRecipe[]> = {
  'Tomato': [
    { id: 'r1', productName: 'Tomato Puree', rewardPoints: 150, description: 'Concentrated tomato pulp for long-term storage.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'r2', productName: 'Sun-dried Tomatoes', rewardPoints: 200, description: 'Traditional dehydration for gourmet use.' }
  ],
  'Coconut': [
    { id: 'r3', productName: 'Coconut Oil', rewardPoints: 300, description: 'Cold-pressed extra virgin oil extraction.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
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
  }
];
