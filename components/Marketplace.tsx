import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, ShoppingBag, Star, Zap, Search, ChevronRight, X, AlertCircle, CheckCircle2, Package, Tag, CreditCard, Bird, Waves, Egg, Loader2, Scan } from 'lucide-react';
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
    id: 'm3',
    name: 'Hybrid Rice Seeds (IR-64)',
    description: 'Short duration, high yielding basmati variety. 110-120 days maturity.',
    price: 850,
    pointsPrice: 350,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm4',
    name: 'Organic Fertilizer (50kg)',
    description: 'Enriched vermicompost for organic farming. NPK balanced.',
    price: 600,
    pointsPrice: 200,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm5',
    name: 'Cotton Seeds (Bt)',
    description: 'Bollgard II certified, pest-resistant hybrid cotton seeds.',
    price: 950,
    pointsPrice: 400,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm6',
    name: 'Solar Water Pump (2HP)',
    description: 'Zero electricity cost, 5-year warranty. Ideal for 2-3 acres.',
    price: 85000,
    pointsPrice: 7500,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm7',
    name: 'Knapsack Sprayer (16L)',
    description: 'Battery-operated, adjustable nozzle for pesticide application.',
    price: 2500,
    pointsPrice: 600,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm8',
    name: 'Vegetable Seeds Combo',
    description: 'Tomato, Brinjal, Chilli, Okra - 4 packets for kitchen garden.',
    price: 450,
    pointsPrice: 150,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm9',
    name: 'Poultry Feed (50kg)',
    description: 'Balanced nutrition for layer chickens. Increases egg production.',
    price: 1800,
    pointsPrice: 450,
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm10',
    name: 'Mini Power Tiller',
    description: '6.5HP petrol engine, perfect for small farms up to 2 acres.',
    price: 65000,
    pointsPrice: 5500,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1591808216268-ce0b82787efe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm11',
    name: 'Goat Mineral Mix (5kg)',
    description: 'Essential minerals and vitamins for goat health and milk production.',
    price: 550,
    pointsPrice: 180,
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm12',
    name: 'Mulch Film Roll (400m)',
    description: 'Black plastic mulch for weed control and moisture retention.',
    price: 3200,
    pointsPrice: 800,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm13',
    name: 'Sugarcane Planter',
    description: 'Tractor-mounted, plants 2 rows simultaneously. High efficiency.',
    price: 125000,
    pointsPrice: 9000,
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800'
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
    id: 'm14',
    name: 'Mustard Seeds (5kg)',
    description: 'Pusa Bold variety, high oil content 40%. Rabi season crop.',
    price: 400,
    pointsPrice: 120,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800'
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
  const { t } = useTranslation();
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
      setShowToast({ message: t('marketplace.insufficient_xp', { amount: totalPrice }), type: 'error' });
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
    setShowToast({ message: t('marketplace.success_added', { item: item.name }), type: 'success' });
    setSelectedItem(null);
  };

  const [paymentModal, setPaymentModal] = useState<{ item: MarketItem, method: string, status: 'scan' | 'processing' | 'success' } | null>(null);

  const handleCashPurchase = (item: MarketItem, paymentMethod: 'gpay' | 'paytm' | 'phonepe') => {
    setPaymentModal({ item, method: paymentMethod, status: 'scan' });

    // Simulate payment flow
    setTimeout(() => {
      setPaymentModal(prev => prev ? { ...prev, status: 'processing' } : null);

      setTimeout(() => {
        setPaymentModal(prev => prev ? { ...prev, status: 'success' } : null);

        // Add to orders
        const newOrder: Order = {
          id: `ord-${Math.random().toString(36).substr(2, 9)}`,
          itemName: item.name,
          date: new Date().toLocaleDateString(),
          price: `₹${item.price.toLocaleString()}`,
          status: 'In Transit'
        };
        setOrders(prev => [newOrder, ...prev]);

        setTimeout(() => {
          setPaymentModal(null);
          setSelectedItem(null);
          setShowToast({ message: t('marketplace.payment_success', { method: paymentMethod.toUpperCase() }), type: 'success' });
        }, 2000);
      }, 3000);
    }, 2000);
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
        <div className={`fixed top-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 ${showToast.type === 'success' ? 'bg-green-600 text-white' : 'bg-rose-600 text-white'
          }`}>
          {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold outfit">{showToast.message}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 outfit tracking-tight italic uppercase">{t('marketplace.title')}</h2>
          <p className="text-slate-500 text-lg mt-1 uppercase tracking-wide font-medium">{t('marketplace.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowOrders(true)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 shadow-xl"><Package size={20} /> {t('marketplace.my_orders')}</button>
          <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200 flex items-center gap-3 shadow-xl">
            <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-black">XP</div>
            <div><p className="text-[10px] text-amber-700 font-black uppercase tracking-widest leading-none">{t('marketplace.available_xp')}</p><p className="text-xl font-black text-amber-600">{user.points}</p></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar relative z-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap uppercase tracking-widest ${activeCategory === cat ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-green-600'}`}>{t(`marketplace.categories.${cat.toLowerCase()}`) || cat}</button>
          ))}
        </div>
        <div className="relative flex-1 w-full z-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder={t('marketplace.search_placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all font-black outfit text-lg shadow-inner text-slate-900 placeholder:text-slate-400 uppercase italic" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col relative hover:-translate-y-2 duration-500">
            <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
            <div className="h-56 relative cursor-pointer overflow-hidden" onClick={() => setSelectedItem(item)}>
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
              <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-700 uppercase tracking-widest border border-slate-200 shadow-sm">{item.category}</span></div>
            </div>
            <div className="p-6 flex-1 flex flex-col space-y-4 relative z-10">
              <div onClick={() => setSelectedItem(item)} className="cursor-pointer space-y-2">
                <h4 className="text-xl font-black text-slate-900 outfit group-hover:text-green-600 transition-colors uppercase italic leading-tight">{item.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium uppercase tracking-wide mb-2">{item.description}</p>
              </div>
              <div className="pt-4 flex flex-col gap-3 mt-auto">
                <div className="flex items-center justify-between"><p className="text-slate-400 font-black text-sm uppercase italic">₹{item.price.toLocaleString()}</p><p className="text-amber-500 font-black text-lg outfit italic">{item.pointsPrice} XP</p></div>
                <button onClick={() => handlePointPurchase(item)} className="w-full py-3 bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center gap-2 italic"><Zap size={14} fill="currentColor" /> {t('marketplace.buy_xp')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative"><img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} /></div>
            <div className="flex-1 p-8 flex flex-col overflow-y-auto bg-slate-900 relative">
              <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div><span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">{selectedItem.category}</span><h3 className="text-3xl font-black text-white outfit mt-2 uppercase italic leading-tight">{selectedItem.name}</h3></div>
                <button onClick={() => setSelectedItem(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all text-slate-400 hover:text-white border border-white/5"><X size={24} /></button>
              </div>
              <div className="flex-1 space-y-4 relative z-10">
                <p className="text-slate-300 leading-relaxed font-medium uppercase tracking-wide mb-2">"{selectedItem.description}"</p>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Zap size={20} fill="currentColor" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('marketplace.points_price')}</p>
                      <p className="text-xl font-black outfit text-amber-400 italic">{selectedItem.pointsPrice} XP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('marketplace.cash_value')}</p>
                    <p className="text-xl font-black outfit text-green-400 italic">₹{selectedItem.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 mt-4 space-y-3 relative z-10">
                <button onClick={() => handlePointPurchase(selectedItem)} className="w-full py-4 bg-amber-500 text-slate-950 rounded-xl font-black text-sm hover:bg-amber-400 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest italic">
                  <Zap size={18} fill="currentColor" /> {t('marketplace.buy_with_xp_btn', { amount: selectedItem.pointsPrice })}
                </button>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleCashPurchase(selectedItem, 'gpay')} className="py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] hover:bg-blue-500 transition-all flex items-center justify-center gap-1 uppercase tracking-widest">
                    <span className="text-lg">G</span> GPay
                  </button>
                  <button onClick={() => handleCashPurchase(selectedItem, 'paytm')} className="py-3 bg-sky-600 text-white rounded-xl font-black text-[10px] hover:bg-sky-500 transition-all flex items-center justify-center gap-1 uppercase tracking-widest">
                    <span className="text-lg">P</span> Paytm
                  </button>
                  <button onClick={() => handleCashPurchase(selectedItem, 'phonepe')} className="py-3 bg-purple-600 text-white rounded-xl font-black text-[10px] hover:bg-purple-500 transition-all flex items-center justify-center gap-1 uppercase tracking-widest">
                    <span className="text-lg">₱</span> PhonePe
                  </button>
                </div>
                <p className="text-[9px] text-center text-slate-500 font-black uppercase tracking-widest">{t('marketplace.secure_upi')} • ₹{selectedItem.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MY ORDERS MODAL */}
      {showOrders && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col border border-white/5 relative">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/20 shadow-inner">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white outfit uppercase italic">{t('marketplace.my_orders')}</h3>
                  <p className="text-[10px] text-green-500/40 font-black uppercase tracking-[0.2em] italic leading-tight">{t('marketplace.order_history')}</p>
                </div>
              </div>
              <button onClick={() => setShowOrders(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all text-slate-400 hover:text-white border border-white/5">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
              {/* Payment Options */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 shadow-inner">
                <h4 className="text-[10px] font-black text-green-500/60 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                  <CreditCard size={16} /> {t('marketplace.secure_upi')}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-lg">G</div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-green-400 uppercase tracking-widest">GPay</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center text-white font-black text-xs shadow-lg">P</div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-green-400 uppercase tracking-widest">Paytm</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-lg">Ph</div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-green-400 uppercase tracking-widest">PhonePe</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center text-white border border-white/10 shadow-lg">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-green-400 uppercase tracking-widest">Card</span>
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 text-center mt-4 italic font-black uppercase tracking-widest">{t('marketplace.select_payment')}</p>
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <Package size={16} /> {t('marketplace.order_history')}
                </h4>
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">{t('marketplace.no_orders')}</p>
                    <p className="text-sm text-slate-400">{t('marketplace.no_orders_desc')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{order.itemName}</p>
                            <p className="text-xs text-slate-400">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-amber-600">{order.price}</p>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] font-bold uppercase">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PAYMENT SIMULATION MODAL */}
      {paymentModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center space-y-8 animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${paymentModal.status === 'success' ? 'bg-green-100 text-green-600' :
                paymentModal.status === 'processing' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-800'
                }`}>
                {paymentModal.status === 'success' ? <CheckCircle2 size={40} /> :
                  paymentModal.status === 'processing' ? <Loader2 size={40} className="animate-spin" /> : <Scan size={40} />}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black outfit text-slate-800 tracking-tight">
                {paymentModal.status === 'scan' ? t('marketplace.scan_pay') :
                  paymentModal.status === 'processing' ? t('marketplace.processing') : t('marketplace.payment_success_title')}
              </h3>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                {t('marketplace.secure_gateway', { method: paymentModal.method.toUpperCase() })}
              </p>
            </div>

            {paymentModal.status === 'scan' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center p-8">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-green-500/10 rounded-full animate-ping opacity-20" />
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AgroPlayPayment"
                      className="w-48 h-48 rounded-2xl shadow-lg relative z-10"
                      alt="Payment QR"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t('marketplace.payable_amount')}</p>
                  <p className="text-3xl font-black text-slate-800 outfit">₹{paymentModal.item.price.toLocaleString()}</p>
                </div>
                <p className="text-xs text-slate-400 italic">{t('marketplace.scan_instruction', { method: paymentModal.method })}</p>
              </div>
            )}

            {paymentModal.status === 'processing' && (
              <div className="py-12 space-y-6 animate-in slide-in-from-bottom-4">
                <p className="text-slate-600 font-medium">{t('marketplace.verifying')}</p>
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {paymentModal.status === 'success' && (
              <div className="py-12 space-y-6 animate-in zoom-in-95">
                <p className="text-green-600 font-black outfit text-xl">{t('marketplace.transaction_verified')}</p>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest mb-1">{t('marketplace.item_secured')}</p>
                  <p className="text-sm font-bold text-slate-800">{paymentModal.item.name}</p>
                </div>
              </div>
            )}

            {paymentModal.status === 'scan' && (
              <button
                onClick={() => setPaymentModal(null)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                {t('marketplace.cancel_payment')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;