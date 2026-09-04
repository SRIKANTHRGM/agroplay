import React, { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBag, Star, Zap, Search, ChevronRight, X, AlertCircle, CheckCircle2, Package, Tag, CreditCard, Bird, Waves, Egg } from 'lucide-react';
import { UserProfile, MarketItem, Order } from '../types';

const MARKET_ITEMS: MarketItem[] = [
  {
    id: 'm1',
    name: 'Premium Wheat Seeds',
    description: 'High-yield, disease-resistant wheat seeds for the Kharif season.',
    price: 1200,
    pointsPrice: 500,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm2',
    name: 'Drip Irrigation Kit',
    description: 'Complete setup for 1 acre, saves up to 60% water.',
    price: 15000,
    pointsPrice: 2000,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1563514220741-03080103b7a3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-egg-1',
    name: 'Auto-Incubator Pro',
    description: 'Advanced temperature controlled incubator for up to 500 eggs.',
    price: 45000,
    pointsPrice: 3500,
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1518567114517-3b24672f1f81?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-coc-1',
    name: 'Hydraulic Coconut De-husker',
    description: 'Industrial grade tool for high-efficiency copra processing.',
    price: 75000,
    pointsPrice: 5000,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's1',
    name: 'Master Harvester 3000',
    description: 'Exclusive high-efficiency harvester for our top performing farmers.',
    price: 0,
    pointsPrice: 5000,
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    requiredPoints: 1000,
    requiredBadges: 2
  }
];

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Marketplace: React.FC<Props> = ({ user, setUser }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Seeds' | 'Tools' | 'Machinery' | 'Livestock'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);

  const categories: ('All' | 'Seeds' | 'Tools' | 'Machinery' | 'Livestock')[] = ['All', 'Seeds', 'Tools', 'Machinery', 'Livestock'];

  const filteredItems = MARKET_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isSpecial = item.category === 'Specials';
    return matchesCategory && matchesSearch && !isSpecial;
  });

  const specialOffers = MARKET_ITEMS.filter(item => {
    if (item.category !== 'Specials') return false;
    const meetsPoints = !item.requiredPoints || user.points >= item.requiredPoints;
    const meetsBadges = !item.requiredBadges || user.badges.length >= item.requiredBadges;
    return meetsPoints && meetsBadges;
  });

  const handlePointPurchase = (item: MarketItem, qty: number = 1) => {
    const totalPrice = item.pointsPrice * qty;
    if (user.points < totalPrice) {
      setShowToast({ message: `Insufficient points! You need ${totalPrice} XP.`, type: 'error' });
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
    setShowToast({ message: `Success! ${item.name} added.`, type: 'success' });
    setSelectedItem(null);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      {showToast && (
        <div className={`fixed top-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 ${
          showToast.type === 'success' ? 'bg-green-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold outfit">{showToast.message}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 outfit tracking-tight">Farm Marketplace</h2>
          <p className="text-slate-500 text-lg mt-1">Acquire elite tools for plantation, grains, and livestock.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowOrders(true)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 shadow-sm"><Package size={20} /> My Orders</button>
          <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold">XP</div>
            <div><p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest leading-none">Available XP</p><p className="text-xl font-black text-amber-700">{user.points}</p></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{cat}</button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search catalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium outfit text-lg shadow-inner" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col">
            <div className="h-56 relative cursor-pointer overflow-hidden" onClick={() => setSelectedItem(item)}>
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
              <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-widest border border-slate-200">{item.category}</span></div>
            </div>
            <div className="p-6 flex-1 flex flex-col space-y-4">
              <div onClick={() => setSelectedItem(item)} className="cursor-pointer space-y-2">
                <h4 className="text-xl font-bold text-slate-800 outfit group-hover:text-green-600 transition-colors">{item.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-4 flex flex-col gap-3 mt-auto">
                <div className="flex items-center justify-between"><p className="text-slate-400 font-bold text-sm">₹{item.price.toLocaleString()}</p><p className="text-amber-600 font-black text-lg outfit">{item.pointsPrice} XP</p></div>
                <button onClick={() => handlePointPurchase(item)} className="w-full py-3 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2"><Zap size={14} /> Buy with XP</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative"><img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} /></div>
            <div className="flex-1 p-12 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div><span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedItem.category}</span><h3 className="text-4xl font-bold text-slate-800 outfit mt-3">{selectedItem.name}</h3></div>
                <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex-1 space-y-6"><h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Description</h4><p className="text-slate-600 text-lg leading-relaxed italic">"{selectedItem.description}"</p><div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 border-dashed flex items-center justify-between"><div className="flex items-center gap-4 text-amber-500"><Zap size={24} fill="currentColor" /><div><p className="text-xs font-bold uppercase">Points Price</p><p className="text-2xl font-black outfit text-amber-600">{selectedItem.pointsPrice} XP</p></div></div></div></div>
              <div className="pt-8 border-t mt-6"><button onClick={() => handlePointPurchase(selectedItem)} className="w-full py-5 bg-amber-500 text-white rounded-2xl font-black text-lg hover:bg-amber-600 transition-all shadow-xl shadow-amber-100 flex items-center justify-center gap-2"><Zap size={20} fill="currentColor" /> DEPLOY {selectedItem.pointsPrice} XP</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;