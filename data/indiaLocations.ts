export interface MandiItem {
  crop: string;
  category: 'Cereals' | 'Vegetables' | 'Cash Crops' | 'Spices' | 'Oilseeds' | 'Fruits';
  price: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  mandiName: string;
}

export interface DistrictInfo {
  name: string;
  agroZone: string;
  soilType: string;
  typicalCrops: string[];
  mandiPrices: MandiItem[];
  commonDiseases: {
    name: string;
    crop: string;
    risk: 'High' | 'Medium' | 'Low';
    distanceKm: number;
    advisory: string;
  }[];
  precautions: string[];
}

export interface StateInfo {
  stateName: string;
  code: string;
  language: string;
  districts: Record<string, DistrictInfo>;
}

// Sub-District / Mandal / Tehsil / Village Database
export const DISTRICT_SUB_LOCATIONS: Record<string, string[]> = {
  "Warangal": ["Hanamkonda", "Kazipet", "Warangal Fort", "Narsampet", "Parkal", "Wardhannapet", "Geesugonda", "Atmakur", "Rayaparthy", "Sangem", "Parvathagiri", "Khanapur", "Inavolu", "Duggondi"],
  "Nizamabad": ["Armoor", "Bodhan", "Balkonda", "Banswada", "Kamareddy", "Varni", "Dichpally", "Jakranpally", "Makloor", "Yeda Pally"],
  "Karimnagar": ["Huzurabad", "Choppadandi", "Manakondur", "Jammikunta", "Veenavanka", "Gangadhara", "Ramadugu", "Timmapur", "Shankarapatnam"],
  "Hyderabad / Rangareddy": ["Secunderabad", "Cyberabad", "Gachibowli", "Shamshabad", "Medchal", "Ibrahimpatnam", "Keesara", "Rajendranagar", "Chevella", "Shadnagar"],
  "Guntur": ["Tenali", "Narasaraopet", "Mangalagiri", "Bapatla", "Repalle", "Ponnur", "Amaravati", "Sattenapalle", "Pedakakani", "Chebrole"],
  "Krishna (Vijayawada)": ["Vijayawada Urban", "Gannavaram", "Gudivada", "Machilipatnam", "Nuzvid", "Kanchikacherla", "Penamaluru", "Jaggayyapeta"],
  "Kurnool": ["Adoni", "Nandyal", "Yemmiganur", "Dhone", "Allagadda", "Nandikotkur", "Kodumur", "Pattikonda"],
  "Visakhapatnam": ["Anakapalle", "Bheemunipatnam", "Gajuwaka", "Pendurthi", "Chodavaram", "Narsipatnam", "Araku Valley", "Paderu"],
  "Ludhiana": ["Jagraon", "Khanna", "Samrala", "Payal", "Raikot", "Doraha", "Mullanpur", "Machhiwara", "Dehlon"],
  "Amritsar": ["Ajnala", "Baba Bakala", "Majitha", "Jandiala Guru", "Attari", "Chogawan", "Tarn Taran Road"],
  "Bhatinda": ["Talwandi Sabo", "Rampur Phul", "Maur", "Gonuana", "Bhai Rupa", "Sangat", "Phul"],
  "Jalandhar": ["Phillaur", "Nakodar", "Shahkot", "Adampur", "Kartarpur", "Goraya", "Bhogpur"],
  "Nashik": ["Pimpalgaon", "Lasalgaon", "Malegaon", "Sinnar", "Niphad", "Igatpuri", "Kalwan", "Yeola", "Dindori", "Trimbakeshwar", "Satana"],
  "Pune": ["Baramati", "Shirur", "Haveli", "Junnar", "Khed", "Maval", "Mulshi", "Purandar", "Indapur", "Daund"],
  "Nagpur": ["Kamptee", "Hingna", "Katol", "Savner", "Ramtek", "Umred", "Narkhed", "Kalameshwar"],
  "Ahmednagar": ["Sangamner", "Shrirampur", "Rahuri", "Kopargaon", "Akole", "Nevasa", "Pathardi", "Parner"],
  "Shimoga (Shivamogga)": ["Sagar", "Thirthahalli", "Shikaripura", "Bhadravathi", "Soraba", "Hosanagara", "Anavatti"],
  "Bengaluru Rural": ["Devanahalli", "Doddaballapura", "Hosakote", "Nelamangala"],
  "Mysuru": ["Nanjangud", "Hunsur", "T. Narsipur", "KR Nagar", "Piriyapatna", "HD Kote"],
  "Belagavi": ["Chikodi", "Gokak", "Bailhongal", "Athani", "Ramdurg", "Raybag", "Hukkeri"],
  "Indore": ["Mhow (Dr. Ambedkar Nagar)", "Sanwer", "Depalpur", "Hatod", "Rau", "Kanadia", "Bicholi Hapsi"],
  "Bhopal": ["Huzur Tehsil", "Berasia", "Kolar", "Mandideep", "Phanda"],
  "Ujjain": ["Nagda", "Khachrod", "Mahidpur", "Tarana", "Badnagar", "Ghatia"],
  "Wayanad": ["Kalpetta", "Sulthan Bathery", "Mananthavady", "Meppadi", "Vythiri", "Ambalavayal", "Pulpally"],
  "Palakkad": ["Ottapalam", "Chittur", "Alathur", "Mannarkkad", "Pattambi", "Kollengode"],
  "Coimbatore": ["Pollachi", "Mettupalayam", "Sulur", "Valparai", "Annur", "Kinathukadavu", "Perur"],
  "Madurai": ["Melur", "Thirumangalam", "Usilampatti", "Vadipatti", "Peraiyur"],
  "Lakhimpur Kheri": ["Nighasan", "Palia Kalan", "Gola Gokarannath", "Mohammadi", "Kasta", "Dhaurahra"],
  "Varanasi": ["Pindra", "Rohaniya", "Sewapuri", "Araziline", "Cholapur", "Chiraigaon"],
  "Patna": ["Danapur", "Phulwari Sharif", "Masaurhi", "Barh", "Bikram", "Paliganj", "Fatwah"],
  "Jaipur": ["Sanger", "Amer", "Chomu", "Kotputli", "Shahpura", "Phulera", "Chaksu"],
  "Ahmedabad": ["Sanand", "Dholka", "Bavla", "Daskroi", "Viramgam", "Dhandhuka"],
  "Kolkata / North 24 Parganas": ["Barasat", "Basirhat", "Bongaon", "Barrackpore", "Haroa", "Hasnabad"]
};

export function getSubLocationsForDistrict(stateName: string, districtName: string): string[] {
  const key = Object.keys(DISTRICT_SUB_LOCATIONS).find(k => 
    k.toLowerCase() === districtName.toLowerCase() || 
    districtName.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(districtName.toLowerCase())
  );
  
  if (key && DISTRICT_SUB_LOCATIONS[key]) {
    return DISTRICT_SUB_LOCATIONS[key];
  }

  // Realistic fallback mandal list for any district
  return [
    `${districtName} Central Mandal`,
    `${districtName} North Sub-District`,
    `${districtName} South Tehsil`,
    `${districtName} East Agricultural Block`,
    `${districtName} West Rural Circle`,
    `${districtName} APMC Market Yard Area`
  ];
}

export function generateComprehensiveMandiPrices(districtName: string, stateName: string): MandiItem[] {
  return [
    { crop: "Tomato (Hybrid Red)", category: "Vegetables", price: "₹2,850", unit: "per qtl", trend: "up", change: "+4.2%", mandiName: `${districtName} APMC` },
    { crop: "Wheat (Sharbati Grade)", category: "Cereals", price: "₹2,280", unit: "per qtl", trend: "stable", change: "+0.5%", mandiName: `${districtName} APMC` },
    { crop: "Paddy / Rice (Sona Masoori)", category: "Cereals", price: "₹2,420", unit: "per qtl", trend: "up", change: "+2.1%", mandiName: `${districtName} APMC` },
    { crop: "Cotton (Long Staple)", category: "Cash Crops", price: "₹7,450", unit: "per qtl", trend: "up", change: "+3.4%", mandiName: `${districtName} Main Yard` },
    { crop: "Chili Pepper (Red Teja)", category: "Spices", price: "₹18,900", unit: "per qtl", trend: "up", change: "+5.0%", mandiName: `${districtName} Spice Yard` },
    { crop: "Red Onion (Nashik Quality)", category: "Vegetables", price: "₹2,350", unit: "per qtl", trend: "up", change: "+6.2%", mandiName: `${districtName} APMC` },
    { crop: "Potato (Kufri Pukhraj)", category: "Vegetables", price: "₹1,320", unit: "per qtl", trend: "up", change: "+3.1%", mandiName: `${districtName} APMC` },
    { crop: "Maize (Yellow Hybrid)", category: "Cereals", price: "₹2,180", unit: "per qtl", trend: "stable", change: "0.0%", mandiName: `${districtName} APMC` },
    { crop: "Turmeric (Finger Grade)", category: "Spices", price: "₹14,600", unit: "per qtl", trend: "up", change: "+2.8%", mandiName: `${districtName} Spice Yard` },
    { crop: "Groundnut (Peanut Pods)", category: "Oilseeds", price: "₹6,850", unit: "per qtl", trend: "up", change: "+1.8%", mandiName: `${districtName} APMC` },
    { crop: "Mustard Seed (Yellow)", category: "Oilseeds", price: "₹5,480", unit: "per qtl", trend: "up", change: "+1.2%", mandiName: `${districtName} APMC` },
    { crop: "Garlic (Premium White)", category: "Spices", price: "₹12,800", unit: "per qtl", trend: "up", change: "+6.5%", mandiName: `${districtName} APMC` },
    { crop: "Sugarcane (Factory Gate)", category: "Cash Crops", price: "₹3,450", unit: "per ton", trend: "stable", change: "0.0%", mandiName: `${districtName} Sugar Mill` },
    { crop: "Mango (Totapuri / Kesar)", category: "Fruits", price: "₹32,000", unit: "per ton", trend: "up", change: "+4.0%", mandiName: `${districtName} Fruit Yard` }
  ];
}

// ALL 28 STATES & 8 UNION TERRITORIES OF INDIA
export const INDIA_STATES_DATA: Record<string, StateInfo> = {
  "Andhra Pradesh": {
    stateName: "Andhra Pradesh", code: "AP", language: "Telugu",
    districts: {
      "Guntur": { name: "Guntur", agroZone: "Krishna-Godavari Coastal Delta", soilType: "Deep Black Cotton & Alluvial", typicalCrops: ["Chili Pepper", "Cotton", "Paddy / Rice", "Tobacco", "Tomato", "Maize"], mandiPrices: generateComprehensiveMandiPrices("Guntur", "Andhra Pradesh"), commonDiseases: [{ name: "Chili Black Thrips", crop: "Chili", risk: "High", distanceKm: 3.2, advisory: "Heavy thrips infestation. Spray Spinetoram @ 0.9ml/L." }], precautions: ["High humidity. Maintain drip fertigation during early mornings."] },
      "Krishna (Vijayawada)": { name: "Krishna (Vijayawada)", agroZone: "Coastal Alluvial Delta", soilType: "Clay Loam & Alluvial", typicalCrops: ["Paddy / Rice", "Mango", "Black Gram", "Sugarcane"], mandiPrices: generateComprehensiveMandiPrices("Vijayawada", "Andhra Pradesh"), commonDiseases: [{ name: "Bacterial Leaf Blight", crop: "Paddy", risk: "High", distanceKm: 4.1, advisory: "Drain excess standing water." }], precautions: ["High moisture in coastal delta."] },
      "Kurnool": { name: "Kurnool", agroZone: "Scarce Rainfall Rayalaseema", soilType: "Red Sandy Loam & Black Soil", typicalCrops: ["Groundnut", "Onion", "Cotton", "Maize"], mandiPrices: generateComprehensiveMandiPrices("Kurnool", "Andhra Pradesh"), commonDiseases: [{ name: "Tikka Leaf Spot", crop: "Groundnut", risk: "Medium", distanceKm: 6.8, advisory: "Apply Mancozeb @ 2g/L." }], precautions: ["Dry wind conditions."] },
      "Visakhapatnam": { name: "Visakhapatnam", agroZone: "North Coastal Zone", soilType: "Red Laterite & Coastal Alluvial", typicalCrops: ["Sugarcane", "Paddy", "Cashew", "Coffee"], mandiPrices: generateComprehensiveMandiPrices("Visakhapatnam", "Andhra Pradesh"), commonDiseases: [{ name: "Cashew Stem Borer", crop: "Cashew", risk: "Low", distanceKm: 9.0, advisory: "Apply Carbaryl paste on trunk base." }], precautions: ["Coastal breezes active."] }
    }
  },
  "Telangana": {
    stateName: "Telangana", code: "TS", language: "Telugu",
    districts: {
      "Warangal": { name: "Warangal", agroZone: "Central Telangana Zone", soilType: "Deep Red Sandy & Chalky Black Soil", typicalCrops: ["Cotton", "Chili Pepper", "Paddy / Rice", "Turmeric", "Maize", "Groundnut"], mandiPrices: generateComprehensiveMandiPrices("Warangal", "Telangana"), commonDiseases: [{ name: "Chili Murda Disease", crop: "Chili", risk: "High", distanceKm: 2.5, advisory: "Apply Fipronil 5% SC @ 2ml/L." }], precautions: ["Temp 32°C. Perform early morning weed removal."] },
      "Nizamabad": { name: "Nizamabad", agroZone: "North Telangana Zone", soilType: "Black Cotton & Medium Red Soil", typicalCrops: ["Turmeric", "Paddy / Rice", "Maize", "Sugarcane"], mandiPrices: generateComprehensiveMandiPrices("Nizamabad", "Telangana"), commonDiseases: [{ name: "Rhizome Rot", crop: "Turmeric", risk: "High", distanceKm: 3.9, advisory: "Drench soil with Metalaxyl." }], precautions: ["High moisture retention in black soil."] },
      "Karimnagar": { name: "Karimnagar", agroZone: "Godavari Basin Agriculture", soilType: "Red Sandy Loam & Clay", typicalCrops: ["Paddy", "Cotton", "Maize", "Mango"], mandiPrices: generateComprehensiveMandiPrices("Karimnagar", "Telangana"), commonDiseases: [{ name: "Fall Armyworm", crop: "Maize", risk: "Medium", distanceKm: 5.5, advisory: "Apply Metarhizium anisopliae." }], precautions: ["Monitor corn whorls for caterpillars."] },
      "Hyderabad / Rangareddy": { name: "Hyderabad / Rangareddy", agroZone: "Peri-Urban Horticulture Zone", soilType: "Red Chalky Loam & Black Soil", typicalCrops: ["Vegetables", "Flowers", "Grape", "Poultry"], mandiPrices: generateComprehensiveMandiPrices("Hyderabad", "Telangana"), commonDiseases: [{ name: "Tomato Blight", crop: "Tomato", risk: "Low", distanceKm: 7.2, advisory: "Spray Copper Oxychloride." }], precautions: ["Polyhouse micro-drip active."] }
    }
  },
  "Punjab": {
    stateName: "Punjab", code: "PB", language: "Punjabi",
    districts: {
      "Ludhiana": { name: "Ludhiana", agroZone: "Central Plain Agricultural Zone", soilType: "Deep Alluvial Loam & Silt", typicalCrops: ["Wheat", "Paddy / Rice", "Potato", "Maize", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Ludhiana", "Punjab"), commonDiseases: [{ name: "Yellow Leaf Rust", crop: "Wheat", risk: "High", distanceKm: 3.4, advisory: "Spray Propiconazole 25% EC." }], precautions: ["Morning humidity 84%. Delay morning spray till 10 AM."] },
      "Amritsar": { name: "Amritsar", agroZone: "Sub-Mountainous & Plain Zone", soilType: "Rich Alluvial & Loam", typicalCrops: ["Basmati Rice", "Wheat", "Vegetables"], mandiPrices: generateComprehensiveMandiPrices("Amritsar", "Punjab"), commonDiseases: [{ name: "Foot Rot", crop: "Basmati", risk: "Medium", distanceKm: 7.1, advisory: "Soak seeds with Trichoderma." }], precautions: ["Cool night breezes."] },
      "Bhatinda": { name: "Bhatinda", agroZone: "South-Western Dry Zone", soilType: "Sandy Loam & Calcareous", typicalCrops: ["Cotton", "Wheat", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Bhatinda", "Punjab"), commonDiseases: [{ name: "White Rust", crop: "Mustard", risk: "High", distanceKm: 4.8, advisory: "Spray Metalaxyl + Mancozeb." }], precautions: ["Dry afternoon winds."] },
      "Jalandhar": { name: "Jalandhar", agroZone: "Doaba Plain Belt", soilType: "Fertile Alluvial", typicalCrops: ["Potato", "Paddy", "Wheat", "Sugarcane"], mandiPrices: generateComprehensiveMandiPrices("Jalandhar", "Punjab"), commonDiseases: [{ name: "Potato Late Blight", crop: "Potato", risk: "High", distanceKm: 3.0, advisory: "Spray Mancozeb @ 2g/L." }], precautions: ["Maintain soil moisture for potato seed tubers."] }
    }
  },
  "Maharashtra": {
    stateName: "Maharashtra", code: "MH", language: "Marathi",
    districts: {
      "Nashik": { name: "Nashik", agroZone: "Grape & Onion Belt", soilType: "Rich Volcanic Black Soil", typicalCrops: ["Onion", "Tomato", "Grapes", "Pomegranate"], mandiPrices: generateComprehensiveMandiPrices("Nashik", "Maharashtra"), commonDiseases: [{ name: "Grape Downy Mildew", crop: "Grapes", risk: "High", distanceKm: 2.8, advisory: "Spray Dimethomorph @ 1g/L." }], precautions: ["Scattered rain showers. Prune lower canopy."] },
      "Pune": { name: "Pune", agroZone: "Western Maharashtra Plateau", soilType: "Medium Black Cotton Soil", typicalCrops: ["Sugarcane", "Pomegranate", "Floriculture"], mandiPrices: generateComprehensiveMandiPrices("Pune", "Maharashtra"), commonDiseases: [{ name: "Bacterial Oily Spot", crop: "Pomegranate", risk: "High", distanceKm: 5.1, advisory: "Spray Streptocycline." }], precautions: ["Breezy conditions."] },
      "Nagpur": { name: "Nagpur", agroZone: "Vidarbha Orange & Cotton", soilType: "Deep Black Basaltic", typicalCrops: ["Mandarin Orange", "Cotton", "Soybean"], mandiPrices: generateComprehensiveMandiPrices("Nagpur", "Maharashtra"), commonDiseases: [{ name: "Citrus Gummosis", crop: "Orange", risk: "Medium", distanceKm: 8.4, advisory: "Paint trunk base with Bordeaux paste." }], precautions: ["Ensure deep root zone hydration."] },
      "Ahmednagar": { name: "Ahmednagar", agroZone: "Sugarcane & Milk Belt", soilType: "Black Loam & Clay", typicalCrops: ["Sugarcane", "Onion", "Pomegranate", "Maize"], mandiPrices: generateComprehensiveMandiPrices("Ahmednagar", "Maharashtra"), commonDiseases: [{ name: "Sugarcane Top Borer", crop: "Sugarcane", risk: "Low", distanceKm: 6.0, advisory: "Release Trichogramma parasites." }], precautions: ["Maintain drip fertigation."] }
    }
  },
  "Karnataka": {
    stateName: "Karnataka", code: "KA", language: "Kannada",
    districts: {
      "Shimoga (Shivamogga)": { name: "Shimoga (Shivamogga)", agroZone: "Malnad & Transitional Zone", soilType: "Red Sandy Loam & Laterite", typicalCrops: ["Arecanut", "Paddy / Rice", "Maize", "Ginger"], mandiPrices: generateComprehensiveMandiPrices("Shimoga", "Karnataka"), commonDiseases: [{ name: "Arecanut Koleroga", crop: "Arecanut", risk: "High", distanceKm: 2.1, advisory: "Spray 1% Bordeaux mixture on bunches." }], precautions: ["Monsoon showers active."] },
      "Bengaluru Rural": { name: "Bengaluru Rural", agroZone: "Eastern Dry Zone", soilType: "Red Loamy Soil", typicalCrops: ["Ragi (Finger Millet)", "Grape", "Mulberry", "Vegetables"], mandiPrices: generateComprehensiveMandiPrices("Bengaluru", "Karnataka"), commonDiseases: [{ name: "Ragi Blast", crop: "Ragi", risk: "Medium", distanceKm: 4.5, advisory: "Spray Mancozeb @ 2g/L." }], precautions: ["Mild climate."] },
      "Mysuru": { name: "Mysuru", agroZone: "Southern Dry Zone", soilType: "Red Sandy Loam", typicalCrops: ["Paddy", "Sugarcane", "Tobacco", "Banana"], mandiPrices: generateComprehensiveMandiPrices("Mysuru", "Karnataka"), commonDiseases: [{ name: "Tobacco Black Shank", crop: "Tobacco", risk: "Low", distanceKm: 8.0, advisory: "Drench soil with Copper Oxychloride." }], precautions: ["Provide light canal irrigation."] },
      "Belagavi": { name: "Belagavi", agroZone: "Northern Transition Zone", soilType: "Deep Black Cotton Soil", typicalCrops: ["Sugarcane", "Soybean", "Maize", "Cotton"], mandiPrices: generateComprehensiveMandiPrices("Belagavi", "Karnataka"), commonDiseases: [{ name: "Soybean Rust", crop: "Soybean", risk: "Medium", distanceKm: 5.5, advisory: "Spray Hexaconazole." }], precautions: ["Ensure good field drainage."] }
    }
  },
  "Madhya Pradesh": {
    stateName: "Madhya Pradesh", code: "MP", language: "Hindi",
    districts: {
      "Indore": { name: "Indore", agroZone: "Malwa Plateau Zone", soilType: "Medium to Deep Black Cotton Soil", typicalCrops: ["Soybean", "Wheat (Sharbati)", "Gram (Chana)", "Garlic"], mandiPrices: generateComprehensiveMandiPrices("Indore", "Madhya Pradesh"), commonDiseases: [{ name: "Soybean Girdle Beetle", crop: "Soybean", risk: "High", distanceKm: 3.6, advisory: "Spray Chlorantraniliprole SC." }], precautions: ["Malwa plateau breeze. Apply sulfur."] },
      "Bhopal": { name: "Bhopal", agroZone: "Vindhyan Plateau Zone", soilType: "Black Clayey Soil", typicalCrops: ["Wheat", "Soybean", "Paddy", "Pulses"], mandiPrices: generateComprehensiveMandiPrices("Bhopal", "Madhya Pradesh"), commonDiseases: [{ name: "Gram Pod Borer", crop: "Chana", risk: "Medium", distanceKm: 6.0, advisory: "Deploy 5 pheromone traps/acre." }], precautions: ["Maintain soil moisture for wheat."] },
      "Ujjain": { name: "Ujjain", agroZone: "Malwa Agricultural Belt", soilType: "Black Cotton Soil", typicalCrops: ["Soybean", "Wheat", "Garlic", "Onion"], mandiPrices: generateComprehensiveMandiPrices("Ujjain", "Madhya Pradesh"), commonDiseases: [{ name: "Garlic Purple Blotch", crop: "Garlic", risk: "High", distanceKm: 4.2, advisory: "Spray Tebuconazole @ 1ml/L." }], precautions: ["Stop irrigation 15 days prior to harvest."] }
    }
  },
  "Kerala": {
    stateName: "Kerala", code: "KL", language: "Malayalam",
    districts: {
      "Wayanad": { name: "Wayanad", agroZone: "High Range Hill Zone", soilType: "Red Laterite & Forest Loam", typicalCrops: ["Black Pepper", "Coffee", "Cardamom", "Tea"], mandiPrices: generateComprehensiveMandiPrices("Wayanad", "Kerala"), commonDiseases: [{ name: "Pepper Quick Wilt", crop: "Black Pepper", risk: "High", distanceKm: 2.3, advisory: "Drench vine base with Bordeaux mixture." }], precautions: ["High rainfall slopes."] },
      "Palakkad": { name: "Palakkad", agroZone: "Palghat Gap Paddy Rice Bowl", soilType: "Alluvial & Clay Loam", typicalCrops: ["Paddy / Rice", "Coconut", "Groundnut", "Banana"], mandiPrices: generateComprehensiveMandiPrices("Palakkad", "Kerala"), commonDiseases: [{ name: "Rice Gall Midge", crop: "Paddy", risk: "Medium", distanceKm: 5.0, advisory: "Apply Chlorpyrifos granules." }], precautions: ["Warm tropical breeze."] }
    }
  },
  "Tamil Nadu": {
    stateName: "Tamil Nadu", code: "TN", language: "Tamil",
    districts: {
      "Coimbatore": { name: "Coimbatore", agroZone: "Western Agricultural Zone", soilType: "Red Loam & Black Soil", typicalCrops: ["Cotton", "Sugarcane", "Maize", "Coconut", "Vegetables"], mandiPrices: generateComprehensiveMandiPrices("Coimbatore", "Tamil Nadu"), commonDiseases: [{ name: "Cotton Wilt", crop: "Cotton", risk: "Medium", distanceKm: 4.0, advisory: "Drench Trichoderma viride." }], precautions: ["Maintain drip fertigation."] },
      "Madurai": { name: "Madurai", agroZone: "Southern Agricultural Zone", soilType: "Red Sandy Loam", typicalCrops: ["Paddy", "Jasmine", "Cotton", "Sugarcane"], mandiPrices: generateComprehensiveMandiPrices("Madurai", "Tamil Nadu"), commonDiseases: [{ name: "Jasmine Bud Worm", crop: "Flowers", risk: "Low", distanceKm: 6.5, advisory: "Spray Neem EC 1500 ppm." }], precautions: ["Warm sunny climate."] }
    }
  },
  "Uttar Pradesh": {
    stateName: "Uttar Pradesh", code: "UP", language: "Hindi",
    districts: {
      "Lakhimpur Kheri": { name: "Lakhimpur Kheri", agroZone: "Tarai Belt Sugarcane Zone", soilType: "Rich Alluvial Silt Loam", typicalCrops: ["Sugarcane", "Wheat", "Paddy / Rice", "Mustard", "Mentha"], mandiPrices: generateComprehensiveMandiPrices("Lakhimpur Kheri", "Uttar Pradesh"), commonDiseases: [{ name: "Sugarcane Red Rot", crop: "Sugarcane", risk: "High", distanceKm: 2.7, advisory: "Use carbendazim treated seed setts." }], precautions: ["Tarai humid conditions."] },
      "Varanasi": { name: "Varanasi", agroZone: "Eastern Gangetic Plain", soilType: "Deep Gangetic Alluvium", typicalCrops: ["Wheat", "Paddy", "Vegetables", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Varanasi", "Uttar Pradesh"), commonDiseases: [{ name: "Mustard Aphids", crop: "Mustard", risk: "Medium", distanceKm: 5.1, advisory: "Spray Imidacloprid." }], precautions: ["Morning fog active."] }
    }
  },
  "Bihar": {
    stateName: "Bihar", code: "BR", language: "Hindi",
    districts: {
      "Patna": { name: "Patna", agroZone: "Central Gangetic Alluvial Plain", soilType: "Clay Loam & Gangetic Alluvium", typicalCrops: ["Paddy / Rice", "Wheat", "Maize", "Potato", "Pulses"], mandiPrices: generateComprehensiveMandiPrices("Patna", "Bihar"), commonDiseases: [{ name: "Rice Brown Plant Hopper", crop: "Paddy", risk: "High", distanceKm: 3.5, advisory: "Spray Pymetrozine." }], precautions: ["Gangetic moisture."] }
    }
  },
  "Rajasthan": {
    stateName: "Rajasthan", code: "RJ", language: "Hindi",
    districts: {
      "Jaipur": { name: "Jaipur", agroZone: "Semi-Arid Eastern Plain", soilType: "Sandy Loam & Alluvial", typicalCrops: ["Mustard", "Wheat", "Pearl Millet (Bajra)", "Guar", "Barley"], mandiPrices: generateComprehensiveMandiPrices("Jaipur", "Rajasthan"), commonDiseases: [{ name: "Bajra Ergot", crop: "Bajra", risk: "Medium", distanceKm: 6.0, advisory: "Soak seed in 10% salt water." }], precautions: ["Semi-arid heat. Use drip lines."] }
    }
  },
  "Gujarat": {
    stateName: "Gujarat", code: "GJ", language: "Gujarati",
    districts: {
      "Ahmedabad": { name: "Ahmedabad", agroZone: "North-West Zone", soilType: "Sandy Loam to Medium Black", typicalCrops: ["Cotton", "Castor", "Wheat", "Paddy"], mandiPrices: generateComprehensiveMandiPrices("Ahmedabad", "Gujarat"), commonDiseases: [{ name: "Castor Semi-Looper", crop: "Castor", risk: "Low", distanceKm: 8.0, advisory: "Spray Bacillus thuringiensis." }], precautions: ["Warm breezes."] }
    }
  },
  "West Bengal": {
    stateName: "West Bengal", code: "WB", language: "Bengali",
    districts: {
      "Kolkata / North 24 Parganas": { name: "Kolkata / North 24 Parganas", agroZone: "Lower Gangetic Delta", soilType: "Alluvial & Clayey Silt", typicalCrops: ["Paddy (Aman / Boro)", "Jute", "Mustard", "Potato", "Vegetables"], mandiPrices: generateComprehensiveMandiPrices("Kolkata", "West Bengal"), commonDiseases: [{ name: "Jute Stem Rot", crop: "Jute", risk: "Medium", distanceKm: 4.5, advisory: "Spray Mancozeb @ 2g/L." }], precautions: ["Delta humidity 82%."] }
    }
  },
  "Arunachal Pradesh": { stateName: "Arunachal Pradesh", code: "AR", language: "English", districts: { "Itanagar": { name: "Itanagar", agroZone: "Eastern Himalayan Sub-Tropical", soilType: "Mountain Forest Soil", typicalCrops: ["Rice", "Maize", "Ginger", "Orange", "Cardamom"], mandiPrices: generateComprehensiveMandiPrices("Itanagar", "Arunachal Pradesh"), commonDiseases: [{ name: "Ginger Soft Rot", crop: "Ginger", risk: "Medium", distanceKm: 5.0, advisory: "Drench soil with Trichoderma." }], precautions: ["Hill slope terrace farming."] } } },
  "Assam": { stateName: "Assam", code: "AS", language: "Assamese", districts: { "Guwahati / Kamrup": { name: "Guwahati / Kamrup", agroZone: "Brahmaputra Valley Alluvial Belt", soilType: "Alluvial & Acidic Clay", typicalCrops: ["Tea", "Rice (Sali / Boro)", "Jute", "Mustard", "Arecanut"], mandiPrices: generateComprehensiveMandiPrices("Guwahati", "Assam"), commonDiseases: [{ name: "Tea Red Spider Mite", crop: "Tea", risk: "High", distanceKm: 3.0, advisory: "Spray Sulphur 80% WP." }], precautions: ["High humidity valley."] } } },
  "Chhattisgarh": { stateName: "Chhattisgarh", code: "CG", language: "Chhattisgarhi", districts: { "Raipur": { name: "Raipur", agroZone: "Chhattisgarh Rice Bowl Plain", soilType: "Red & Yellow Clay Soil (Kanhar)", typicalCrops: ["Paddy / Rice", "Maize", "Kodo Millet", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Raipur", "Chhattisgarh"), commonDiseases: [{ name: "Paddy Blast", crop: "Paddy", risk: "High", distanceKm: 4.2, advisory: "Spray Tricyclazole." }], precautions: ["Maintain standing water in paddy."] } } },
  "Goa": { stateName: "Goa", code: "GA", language: "Konkani", districts: { "North Goa (Panaji)": { name: "North Goa (Panaji)", agroZone: "Coastal Humid Zone", soilType: "Coastal Alluvial & Red Laterite", typicalCrops: ["Cashew", "Coconut", "Paddy", "Arecanut", "Spices"], mandiPrices: generateComprehensiveMandiPrices("Panaji", "Goa"), commonDiseases: [{ name: "Cashew Tea Mosquito Bug", crop: "Cashew", risk: "Low", distanceKm: 7.0, advisory: "Spray Neem oil 5ml/L." }], precautions: ["Coastal humid climate."] } } },
  "Haryana": { stateName: "Haryana", code: "HR", language: "Haryanvi", districts: { "Karnal": { name: "Karnal", agroZone: "Trans-Gangetic Plain Rice-Wheat Belt", soilType: "Deep Alluvial Loam", typicalCrops: ["Wheat", "Basmati Rice", "Sugarcane", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Karnal", "Haryana"), commonDiseases: [{ name: "Karnal Bunt", crop: "Wheat", risk: "High", distanceKm: 3.1, advisory: "Spray Tilt 25% EC." }], precautions: ["Maintain alternate wetting in Basmati."] } } },
  "Himachal Pradesh": { stateName: "Himachal Pradesh", code: "HP", language: "Pahari", districts: { "Shimla": { name: "Shimla", agroZone: "High Hill Temperate Apple Belt", soilType: "Brown Hill & Forest Soil", typicalCrops: ["Apple", "Plum", "Peach", "Potato", "Off-Season Vegetables"], mandiPrices: generateComprehensiveMandiPrices("Shimla", "Himachal Pradesh"), commonDiseases: [{ name: "Apple Scab", crop: "Apple", risk: "High", distanceKm: 2.9, advisory: "Spray Dodine @ 1g/L." }], precautions: ["Cold hill climate."] } } },
  "Jharkhand": { stateName: "Jharkhand", code: "JH", language: "Hindi", districts: { "Ranchi": { name: "Ranchi", agroZone: "Chota Nagpur Plateau Zone", soilType: "Red Acidic Laterite Soil", typicalCrops: ["Paddy", "Vegetables", "Pulses", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Ranchi", "Jharkhand"), commonDiseases: [{ name: "Tomato Bacterial Wilt", crop: "Tomato", risk: "Medium", distanceKm: 4.8, advisory: "Use resistant lines & lime application." }], precautions: ["Plateau well irrigation."] } } },
  "Manipur": { stateName: "Manipur", code: "MN", language: "Meitei", districts: { "Imphal": { name: "Imphal", agroZone: "Sub-Tropical Manipur Valley", soilType: "Valley Alluvial Soil", typicalCrops: ["Black Rice (Chak-Hao)", "Paddy", "Maize", "Pineapple"], mandiPrices: generateComprehensiveMandiPrices("Imphal", "Manipur"), commonDiseases: [{ name: "Paddy Blast", crop: "Rice", risk: "Medium", distanceKm: 5.0, advisory: "Apply Tricyclazole." }], precautions: ["Valley terrace farming."] } } },
  "Meghalaya": { stateName: "Meghalaya", code: "ML", language: "Khasi", districts: { "Shillong": { name: "Shillong", agroZone: "High Altitude Khasi Hills", soilType: "Red Acidic Loam", typicalCrops: ["Lakadong Turmeric", "Ginger", "Potato", "Orange"], mandiPrices: generateComprehensiveMandiPrices("Shillong", "Meghalaya"), commonDiseases: [{ name: "Turmeric Leaf Spot", crop: "Turmeric", risk: "Low", distanceKm: 6.2, advisory: "Spray Copper Oxychloride." }], precautions: ["High organic matter soils."] } } },
  "Mizoram": { stateName: "Mizoram", code: "MZ", language: "Mizo", districts: { "Aizawl": { name: "Aizawl", agroZone: "Hilly Sub-Tropical Zone", soilType: "Red Clay Loam", typicalCrops: ["Mizo Chili (Bird Eye)", "Ginger", "Paddy", "Passion Fruit"], mandiPrices: generateComprehensiveMandiPrices("Aizawl", "Mizoram"), commonDiseases: [{ name: "Chili Anthracnose", crop: "Chili", risk: "Low", distanceKm: 7.5, advisory: "Spray Azoxystrobin." }], precautions: ["Jhum conversion to terrace."] } } },
  "Nagaland": { stateName: "Nagaland", code: "NL", language: "Ao", districts: { "Kohima": { name: "Kohima", agroZone: "Hilly Naga Range Belt", soilType: "Forest Acidic Soil", typicalCrops: ["Naga King Chili (Bhut Jolokia)", "Maize", "Sticky Rice"], mandiPrices: generateComprehensiveMandiPrices("Kohima", "Nagaland"), commonDiseases: [{ name: "Chili Wilt", crop: "Chili", risk: "Low", distanceKm: 8.0, advisory: "Apply Trichoderma." }], precautions: ["Organic hill farming."] } } },
  "Odisha": { stateName: "Odisha", code: "OD", language: "Odia", districts: { "Cuttack": { name: "Cuttack", agroZone: "Mahanadi Deltaic Zone", soilType: "Deltaic Alluvial & Coastal Clay", typicalCrops: ["Paddy / Rice", "Pulses", "Oilseeds", "Vegetables"], mandiPrices: generateComprehensiveMandiPrices("Cuttack", "Odisha"), commonDiseases: [{ name: "Paddy Yellow Stem Borer", crop: "Paddy", risk: "High", distanceKm: 3.4, advisory: "Apply Cartap Hydrochloride." }], precautions: ["Coastal delta humid conditions."] } } },
  "Sikkim": { stateName: "Sikkim", code: "SK", language: "Nepali", districts: { "Gangtok": { name: "Gangtok", agroZone: "High Himalayan Organic Belt", soilType: "Rich Organic Forest Soil", typicalCrops: ["Large Cardamom", "Ginger", "Organic Maize", "Orange"], mandiPrices: generateComprehensiveMandiPrices("Gangtok", "Sikkim"), commonDiseases: [{ name: "Cardamom Chirke Virus", crop: "Cardamom", risk: "Low", distanceKm: 8.5, advisory: "Remove infected plants." }], precautions: ["100% certified organic state."] } } },
  "Tripura": { stateName: "Tripura", code: "TR", language: "Kokborok", districts: { "Agartala": { name: "Agartala", agroZone: "Humid Sub-Tropical Plain", soilType: "Red Sandy Loam", typicalCrops: ["Paddy", "Rubber", "Pineapple", "Jackfruit"], mandiPrices: generateComprehensiveMandiPrices("Agartala", "Tripura"), commonDiseases: [{ name: "Pineapple Heart Rot", crop: "Pineapple", risk: "Low", distanceKm: 7.0, advisory: "Drain standing water." }], precautions: ["High rainfall zone."] } } },
  "Uttarakhand": { stateName: "Uttarakhand", code: "UK", language: "Garhwali", districts: { "Dehradun": { name: "Dehradun", agroZone: "Doon Valley Agriculture", soilType: "Alluvial Silt & Gravelly Loam", typicalCrops: ["Basmati Rice", "Wheat", "Litchi", "Sugarcane"], mandiPrices: generateComprehensiveMandiPrices("Dehradun", "Uttarakhand"), commonDiseases: [{ name: "Litchi Fruit Borer", crop: "Litchi", risk: "Medium", distanceKm: 5.5, advisory: "Spray Neem EC." }], precautions: ["Doon valley climate."] } } },

  // 8 UNION TERRITORIES OF INDIA
  "Andaman & Nicobar Islands": { stateName: "Andaman & Nicobar Islands", code: "AN", language: "English", districts: { "Port Blair": { name: "Port Blair", agroZone: "Tropical Island Zone", soilType: "Coastal Sandy & Laterite", typicalCrops: ["Coconut", "Arecanut", "Spices", "Bananas"], mandiPrices: generateComprehensiveMandiPrices("Port Blair", "Andaman"), commonDiseases: [{ name: "Coconut Bud Rot", crop: "Coconut", risk: "Low", distanceKm: 9.0, advisory: "Spray Bordeaux mixture." }], precautions: ["Tropical sea breezes."] } } },
  "Chandigarh": { stateName: "Chandigarh", code: "CH", language: "Punjabi", districts: { "Chandigarh UT": { name: "Chandigarh UT", agroZone: "Sub-Mountainous Plain", soilType: "Alluvial Silt", typicalCrops: ["Wheat", "Vegetables", "Flowers"], mandiPrices: generateComprehensiveMandiPrices("Chandigarh", "Chandigarh"), commonDiseases: [{ name: "Fungal Leaf Spot", crop: "Vegetables", risk: "Low", distanceKm: 6.0, advisory: "Spray Copper Oxychloride." }], precautions: ["Urban peri-farming."] } } },
  "Dadra & Nagar Haveli and Daman & Diu": { stateName: "Dadra & Nagar Haveli and Daman & Diu", code: "DD", language: "Gujarati", districts: { "Silvassa / Daman": { name: "Silvassa / Daman", agroZone: "Coastal Plain Zone", soilType: "Coastal Alluvial", typicalCrops: ["Paddy", "Ragi", "Pulses", "Coconut"], mandiPrices: generateComprehensiveMandiPrices("Daman", "Daman Diu"), commonDiseases: [{ name: "Paddy Blast", crop: "Paddy", risk: "Low", distanceKm: 8.0, advisory: "Spray Tricyclazole." }], precautions: ["Coastal humidity."] } } },
  "Delhi (NCT)": { stateName: "Delhi (NCT)", code: "DL", language: "Hindi", districts: { "Delhi NCR Region": { name: "Delhi NCR Region", agroZone: "Yamuna Floodplain Zone", soilType: "Yamuna Alluvial Silt", typicalCrops: ["Vegetables", "Floriculture", "Wheat", "Mustard"], mandiPrices: generateComprehensiveMandiPrices("Delhi Azadpur", "Delhi"), commonDiseases: [{ name: "Damping Off", crop: "Vegetables", risk: "Low", distanceKm: 5.0, advisory: "Use Trichoderma treated seed." }], precautions: ["Azadpur mandi pricing Hub."] } } },
  "Jammu & Kashmir": { stateName: "Jammu & Kashmir", code: "JK", language: "Dogri", districts: { "Srinagar / Baramulla": { name: "Srinagar / Baramulla", agroZone: "Kashmir Valley Temperate Zone", soilType: "Rich Karewa & Alluvial Soil", typicalCrops: ["Apple", "Saffron", "Walnut", "Paddy", "Cherry"], mandiPrices: generateComprehensiveMandiPrices("Srinagar", "J&K"), commonDiseases: [{ name: "Apple Scab", crop: "Apple", risk: "High", distanceKm: 3.2, advisory: "Spray Mancozeb @ 2g/L." }], precautions: ["Karewa saffron soil."] } } },
  "Ladakh": { stateName: "Ladakh", code: "LA", language: "Ladakhi", districts: { "Leh / Kargil": { name: "Leh / Kargil", agroZone: "Cold High-Altitude Desert Zone", soilType: "Glacial Sandy Loam", typicalCrops: ["Sea Buckthorn", "Apricot", "Grim Barley", "Alfalfa"], mandiPrices: generateComprehensiveMandiPrices("Leh", "Ladakh"), commonDiseases: [{ name: "Barley Smut", crop: "Barley", risk: "Low", distanceKm: 10.0, advisory: "Treat seed with Trichoderma." }], precautions: ["Cold desert greenhouse microclimate."] } } },
  "Lakshadweep": { stateName: "Lakshadweep", code: "LD", language: "Malayalam", districts: { "Kavaratti": { name: "Kavaratti", agroZone: "Coral Atoll Island Zone", soilType: "Coral Sandy Soil", typicalCrops: ["Coconut", "Tuna Fishery", "Breadfruit"], mandiPrices: generateComprehensiveMandiPrices("Kavaratti", "Lakshadweep"), commonDiseases: [{ name: "Coconut Mite", crop: "Coconut", risk: "Low", distanceKm: 12.0, advisory: "Apply Neem oil." }], precautions: ["Island copra processing."] } } },
  "Puducherry": { stateName: "Puducherry", code: "PY", language: "Tamil", districts: { "Puducherry / Karaikal": { name: "Puducherry / Karaikal", agroZone: "Coromandel Coastal Zone", soilType: "Coastal Alluvial & Red Soil", typicalCrops: ["Paddy", "Sugarcane", "Groundnut", "Coconut"], mandiPrices: generateComprehensiveMandiPrices("Puducherry", "Puducherry"), commonDiseases: [{ name: "Paddy Stem Borer", crop: "Paddy", risk: "Low", distanceKm: 7.0, advisory: "Release Trichogramma cards." }], precautions: ["Coastal monsoon."] } } }
};

export function getDistrictData(stateName: string, districtName: string): DistrictInfo {
  const stateObj = INDIA_STATES_DATA[stateName];
  if (stateObj && stateObj.districts[districtName]) {
    return stateObj.districts[districtName];
  }

  return {
    name: districtName || "District Center",
    agroZone: `${stateName} Agro-Climatic Belt`,
    soilType: "Alluvial & Medium Loam Soil",
    typicalCrops: ["Wheat", "Paddy / Rice", "Tomato", "Cotton", "Chili", "Potato", "Onion", "Soybean", "Maize", "Groundnut"],
    mandiPrices: generateComprehensiveMandiPrices(districtName || "Central", stateName),
    commonDiseases: [
      { name: "Fungal Leaf Blight", crop: "Tomato / Crops", risk: "Medium", distanceKm: 5.2, advisory: "Maintain lower leaf clearance and spray Copper Oxychloride." },
      { name: "Sucking Vector Pest Alert", crop: "Vegetables", risk: "Low", distanceKm: 11.0, advisory: "Deploy yellow sticky traps @ 10 cards/acre." }
    ],
    precautions: [
      `Local microclimate in ${districtName}, ${stateName} is favorable for seasonal cropping.`,
      "Monitor morning relative humidity to adjust drip irrigation schedules."
    ]
  };
}
