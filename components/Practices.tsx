
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Droplets, Leaf, Recycle, Search, Sprout, Wind, ArrowRight } from 'lucide-react';
import { Practice } from '../types';

export const PRACTICES: Practice[] = [
  {
    slug: 'soil-health',
    title: 'Soil Health & Fertility',
    category: 'Regenerative',
    icon: 'Leaf',
    description: 'Learn how to build living soil that nourishes crops naturally.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600',
    content: `
# Soil Health and Fertility

Healthy soil is the foundation of sustainable farming. It is not just "dirt," but a living ecosystem full of beneficial bacteria, fungi, and insects.

## Key Principles
1. **Minimize Disturbance:** Avoid heavy tilling which destroys soil structure.
2. **Keep it Covered:** Use mulch or cover crops to protect soil from erosion.
3. **Diverse Roots:** Planting different types of crops ensures a variety of nutrients are returned to the soil.

## Organic Amendments
- **Compost:** High in organic matter and beneficial microbes.
- **Green Manure:** Crops like legumes that are grown to be plowed back into the soil to add nitrogen.
- **Vermicompost:** Earthworm castings that provide immediate nutrients to plants.
    `
  },
  {
    slug: 'water-management',
    title: 'Precision Water Management',
    category: 'Conservation',
    icon: 'Droplets',
    description: 'Master the art of saving water while maximizing crop yields.',
    image: 'https://images.unsplash.com/photo-1563514220741-03080103b7a3?auto=format&fit=crop&q=80&w=600',
    content: `
# Precision Water Management

Water is our most precious resource. In Indian agriculture, efficient water use is critical for sustainability.

## Smart Irrigation Techniques
1. **Drip Irrigation:** Delivers water directly to the plant's root zone, reducing evaporation by up to 80%.
2. **Mulching:** A layer of organic material on the soil surface holds moisture and prevents weed growth.
3. **Rainwater Harvesting:** Capturing monsoon rains to recharge groundwater or store in farm ponds.

## Benefits of Precision Watering
- Reduced water bills and pumping costs.
- Prevents soil salinization.
- Healthier plants through consistent moisture levels.
    `
  },
  {
    slug: 'organic-pest-control',
    title: 'Organic Pest Control',
    category: 'Protection',
    icon: 'Wind',
    description: 'Protect your farm using natural enemies and botanical sprays.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987cb9723?auto=format&fit=crop&q=80&w=600',
    content: `
# Organic Pest Control

Pest management doesn't always require chemicals. Integrated Pest Management (IPM) focuses on prevention and natural solutions.

## Natural Strategies
1. **Biological Control:** Attract beneficial insects like ladybugs that eat aphids.
2. **Crop Rotation:** Prevents pest populations from establishing by changing their food source every season.
3. **Botanical Sprays:** Using Neem oil or Garlic-Chili sprays as natural repellents.

## Trap Cropping
Planting a crop that pests prefer more than your main crop on the perimeter of your field. This draws pests away from your high-value produce.
    `
  }
];

const Practices: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredPractices = PRACTICES.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-800 outfit">Practices Library</h2>
        <p className="text-slate-500 max-w-xl mx-auto">Deep dive into sustainable techniques that improve your farm's health and profitability.</p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search practices (e.g., Soil, Water, Organic)..."
          className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 transition-all outfit text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPractices.map(practice => (
          <Link 
            to={`/practices/${practice.slug}`} 
            key={practice.slug}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={practice.image} alt={practice.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-widest border border-green-100">
                {practice.category}
              </div>
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-slate-800 outfit group-hover:text-green-600 transition-colors leading-tight">
                  {practice.title}
                </h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">
                {practice.description}
              </p>
              <div className="pt-4 flex items-center gap-2 text-green-600 font-bold text-sm">
                Learn More <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Practices;
