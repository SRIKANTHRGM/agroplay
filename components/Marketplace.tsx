import React, { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBag, Star, Zap, Search, ChevronRight, X, AlertCircle, CheckCircle2, Package, Tag, CreditCard, Bird, Waves, Egg } from 'lucide-react';
import { UserProfile, MarketItem, Order } from '../types';

const MARKET_ITEMS: MarketItem[] = [
  // SEEDS
  {
    id: 'm-seed-1',
    name: 'Certified Hybrid Wheat Seeds (HD 2967)',
    description: 'High-yield, yellow-rust resistant certified wheat seeds for Rabi sowing.',
    price: 1450,
    pointsPrice: 500,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-seed-2',
    name: 'Organic Pusa Basmati Paddy Seeds (1121)',
    description: 'Extra-long grain aromatic basmati seeds with high disease resistance.',
    price: 2800,
    pointsPrice: 850,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-seed-3',
    name: 'Bt Hybrid Cotton Seeds (Bollgard II)',
    description: 'Bollworm-resistant cotton seed packet with superior lint length.',
    price: 950,
    pointsPrice: 400,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-seed-4',
    name: 'Hybrid Yellow Mustard Seeds (Pusa Jai Kisan)',
    description: 'High oil content (42%) mustard seeds suitable for dryland farming.',
    price: 750,
    pointsPrice: 350,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-seed-5',
    name: 'F1 Hybrid Tomato Seeds (Arka Rakshak)',
    description: 'Triple disease resistant tomato seeds for year-round greenhouse/field crop.',
    price: 1800,
    pointsPrice: 600,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-seed-6',
    name: 'High-Protein Soybean Seeds (JS 335)',
    description: 'Early maturing, pod-shattering resistant soybean seeds for Kharif.',
    price: 2100,
    pointsPrice: 700,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800'
  },

  // TOOLS & EQUIPMENT
  {
    id: 'm-tool-1',
    name: 'Drip Fertigation Micro-Irrigation Kit (1 Acre)',
    description: 'Complete drip line network with venturi fertilizer injector & inline emitters.',
    price: 18500,
    pointsPrice: 2200,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1563514220741-03080103b7a3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-tool-2',
    name: 'Solar Insect & Pest Trap (Auto Sensor)',
    description: 'Dual UV light wavelength trap with automatic night operation for organic pest control.',
    price: 3200,
    pointsPrice: 900,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-tool-3',
    name: 'Dual-Battery Knapsack Boom Sprayer (20L)',
    description: 'High-pressure 12V battery sprayer with multi-nozzle telescopic lance.',
    price: 4500,
    pointsPrice: 1200,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-tool-4',
    name: 'Digital Soil NPK & pH Probe Monitor',
    description: 'Real-time soil moisture, temperature, pH, and electro-conductivity tester.',
    price: 6800,
    pointsPrice: 1500,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
  },

  // MACHINERY
  {
    id: 'm-mach-1',
    name: 'Heavy-Duty Multi-Crop Power Tiller (12 HP)',
    description: 'Diesel powered rotavator and tiller for wetland and dryland cultivation.',
    price: 95000,
    pointsPrice: 6500,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-mach-2',
    name: 'Hydraulic Coconut De-Husker & Copra Press',
    description: 'Industrial-grade hydraulic de-husker with 800 coconut/hr capacity.',
    price: 75000,
    pointsPrice: 5000,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-mach-3',
    name: 'Solar Powered Cold Storage Chamber (2 Tonne)',
    description: 'Walk-in thermal energy storage unit for perishable fruits and vegetables.',
    price: 180000,
    pointsPrice: 9500,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-mach-4',
    name: '5 HP Solar Submersible Water Pump Set',
    description: 'Direct-drive brushless solar pump controller with high head discharge.',
    price: 135000,
    pointsPrice: 8000,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'
  },

  // BIO-INPUTS
  {
    id: 'm-bio-1',
    name: 'Bio-Fungicide Trichoderma Viride (10kg Pack)',
    description: 'Pure spore culture for soil inoculation and seed treatment against root rot.',
    price: 1200,
    pointsPrice: 450,
    category: 'Bio-Inputs',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-bio-2',
    name: 'Cold-Pressed Neem Oil Bio-Pesticide (5L)',
    description: '10,000 PPM Azadirachtin organic bio-insecticide for sucking pests.',
    price: 2400,
    pointsPrice: 750,
    category: 'Bio-Inputs',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-bio-3',
    name: 'VAM Mycorrhizal Bio-Fertilizer Granules (20kg)',
    description: 'Root endophyte inoculant that enhances phosphorus absorption by 40%.',
    price: 1850,
    pointsPrice: 600,
    category: 'Bio-Inputs',
    image: 'https://images.unsplash.com/photo-1585314062637-251f28b7fa4a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-bio-4',
    name: 'Organic Earthworm Vermicompost (50kg Bag)',
    description: 'Nutrient-rich organic compost enriched with beneficial soil microflora.',
    price: 850,
    pointsPrice: 300,
    category: 'Bio-Inputs',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800'
  },

  // LIVESTOCK & POULTRY
  {
    id: 'm-live-1',
    name: 'Automatic Egg Incubator Pro (500 Eggs)',
    description: 'Fully automated temperature & humidity controller with auto egg turning.',
    price: 45000,
    pointsPrice: 3500,
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-live-2',
    name: 'High-Density Aquaculture Aerator System',
    description: '2 HP paddle wheel aerator for fish and shrimp farming oxygenation.',
    price: 32000,
    pointsPrice: 2800,
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
  },

  // SPECIALS
  {
    id: 's1',
    name: 'Master Combine Harvester 3000',
    description: 'Exclusive multi-crop combine harvester reward for top tier master farmers.',
    price: 0,
    pointsPrice: 5000,
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    requiredPoints: 1000,
    requiredBadges: 2
  },
  {
    id: 's2',
    name: 'Autonomous Multispectral Crop Scanner Drone',
    description: 'AI-guided drone for high-resolution thermal imaging and NDVI crop health mapping.',
    price: 0,
    pointsPrice: 7500,
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    requiredPoints: 1500,
    requiredBadges: 3
  }
];

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Marketplace: React.FC<Props> = ({ user, setUser }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Seeds' | 'Tools' | 'Machinery' | 'Bio-Inputs' | 'Livestock'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);

  const categories: ('All' | 'Seeds' | 'Tools' | 'Machinery' | 'Bio-Inputs' | 'Livestock')[] = ['All', 'Seeds', 'Tools', 'Machinery', 'Bio-Inputs', 'Livestock'];

  const filteredItems = MARKET_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isSpecial = item.category === 'Specials';
    return matchesCategory && matchesSearch && !isSpecial;
  });

  const specialOffers = MARKET_ITEMS.filter(item => item.category === 'Specials');

  const handlePointPurchase = (item: MarketItem, qty: number = 1) => {
    const totalPrice = item.pointsPrice * qty;
    if (user.points < totalPrice) {
      setShowToast({ message: `Insufficient XP! You need ${totalPrice} XP.`, type: 'error' });
      return;
    }
    setUser(prev => ({ ...prev, points: prev.points - totalPrice }));
    const newOrder: Order = {
      id: `ord-${Math.random().toString(36).substr(2, 9)}`,
      itemName: `${qty}x ${item.name}`,
      date: new Date().toLocaleDateString(),
      price: `${totalPrice} XP`,
      status: 'Delivered'
    };
    setOrders(prev => [newOrder, ...prev]);
    setShowToast({ message: `Success! ${item.name} acquired and added to your inventory.`, type: 'success' });
    setSelectedItem(null);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 relative">
      {showToast && (
        <div className={`fixed top-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 ${
          showToast.type === 'success' ? 'bg-green-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold outfit">{showToast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 outfit tracking-tight">Global Market</h2>
          <p className="text-slate-500 text-lg mt-1">Direct access to certified seeds, micro-irrigation tools, bio-inputs, and heavy farm machinery.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowOrders(true)} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95 text-slate-700">
            <Package size={20} className="text-green-600" /> My Orders ({orders.length})
          </button>
          <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-black outfit text-sm shadow-md">XP</div>
            <div>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-none">Available XP</p>
              <p className="text-2xl font-black text-amber-700 outfit">{user.points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full lg:w-auto overflow-x-auto custom-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-white text-green-700 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search 20+ certified seeds, tools, bio-inputs, and machinery..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium outfit text-base shadow-inner" 
          />
        </div>
      </div>

      {/* Special Reward Equipment Banner */}
      {specialOffers.length > 0 && activeCategory === 'All' && !searchQuery && (
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Star className="text-amber-500" size={24} fill="currentColor" />
              <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">Master Rank Special Machinery</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {specialOffers.map(item => (
                <div key={item.id} className="bg-slate-900 text-white rounded-[3rem] p-8 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group">
                   <div className="w-full sm:w-48 h-44 rounded-[2rem] overflow-hidden flex-shrink-0 relative">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                      <div className="absolute top-3 left-3 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Special Reward</div>
                   </div>
                   <div className="space-y-4 flex-1">
                      <div>
                         <h4 className="text-2xl font-black outfit text-white leading-tight">{item.name}</h4>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                         <div className="flex items-center gap-2 text-amber-400 font-black text-xl outfit">
                            <Zap size={20} fill="currentColor" /> {item.pointsPrice} XP
                         </div>
                         <button 
                           onClick={() => handlePointPurchase(item)} 
                           className="px-6 py-3 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-xl active:scale-95"
                         >
                            Claim Reward
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Main Product Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">
              {activeCategory === 'All' ? 'All Agricultural Products' : `${activeCategory} Catalog`} ({filteredItems.length})
           </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
              <div className="h-56 relative cursor-pointer overflow-hidden bg-slate-100" onClick={() => setSelectedItem(item)}>
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-800 uppercase tracking-widest border border-slate-200 shadow-sm">
                      {item.category}
                   </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div onClick={() => setSelectedItem(item)} className="cursor-pointer space-y-2">
                  <h4 className="text-xl font-bold text-slate-800 outfit group-hover:text-green-600 transition-colors leading-snug">{item.name}</h4>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Value</p>
                       <p className="text-sm font-bold text-slate-700">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">XP Unlock</p>
                       <p className="text-xl font-black text-amber-600 outfit">{item.pointsPrice} XP</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePointPurchase(item)} 
                    className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-green-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-green-100"
                  >
                    <Zap size={14} fill="currentColor" className="text-amber-400" /> Buy with {item.pointsPrice} XP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border border-white/20 max-h-[90vh]">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-900">
               <img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} />
               <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                     {selectedItem.category}
                  </span>
               </div>
            </div>
            
            <div className="flex-1 p-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 outfit">{selectedItem.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified AGMARK Quality Standard</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-800">
                     <X size={24} />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Details</h4>
                  <p className="text-slate-600 text-base leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                     "{selectedItem.description}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Market Price</p>
                      <p className="text-2xl font-black text-slate-800 outfit mt-1">₹{selectedItem.price.toLocaleString()}</p>
                   </div>
                   <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Redemption XP</p>
                      <p className="text-2xl font-black text-amber-700 outfit mt-1">{selectedItem.pointsPrice} XP</p>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-6">
                <button 
                  onClick={() => handlePointPurchase(selectedItem)} 
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <Zap size={22} fill="currentColor" className="text-amber-400" /> REDEEM FOR {selectedItem.pointsPrice} XP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Drawer Modal */}
      {showOrders && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <Package size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 outfit">Purchased Orders</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Digital Dispatch Receipt</p>
                 </div>
              </div>
              <button onClick={() => setShowOrders(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"><X size={24} /></button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {orders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                   <Package size={48} className="mx-auto text-slate-200" />
                   <p className="font-bold text-slate-600">No Orders Placed Yet</p>
                   <p className="text-xs">Browse the catalog above and use your XP to redeem agricultural supplies.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                     <div>
                        <p className="font-bold text-slate-800">{order.itemName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Order ID: {order.id} • Date: {order.date}</p>
                     </div>
                     <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">{order.status}</span>
                        <p className="text-sm font-black text-amber-600 outfit mt-1">{order.price}</p>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;