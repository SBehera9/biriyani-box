import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Phone, MapPin, Clock, ChevronRight, 
  Plus, Minus, X, ChefHat, Utensils, Settings, 
  Instagram, Facebook, ArrowRight, Star, Zap
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category_id: number;
  category_name: string;
  available: number;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const WHATSAPP_NUMBER = "918249576720";

export default function App() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminTab, setAdminTab] = useState<'items' | 'categories'>('items');
  
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    fetchMenu(); 
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) { console.error(err); }
  };

  const addToCart = (item: MenuItem) => {
    if (item.available === 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    const text = cart.map(i => `${i.name} x ${i.quantity}`).join('\n');
    const msg = encodeURIComponent(`*New Order*\n\n${text}\n\n*Total: ₹${cartTotal}*`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F9F7F2]"><div className="w-12 h-12 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans overflow-x-hidden">
      {/* Marquee Header */}
      <div className="bg-[#1A1A1A] text-white py-2 overflow-hidden border-b-2 border-[#1A1A1A]">
        <div className="animate-marquee flex gap-10 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
              <Star className="w-3 h-3 text-[#FF4D00]" /> 
              <span>Authentic Dum Biriyani</span>
              <Star className="w-3 h-3 text-[#FF4D00]" />
              <span>Freshly Cooked Daily</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b-2 border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="bg-[#FF4D00] p-2 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display text-[#1A1A1A] uppercase leading-none">Biriyani Box</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Menu', 'Contact'].map(item => (
              <button key={item} onClick={() => item === 'Menu' ? menuRef.current?.scrollIntoView({behavior:'smooth'}) : contactRef.current?.scrollIntoView({behavior:'smooth'})} className="text-sm font-black uppercase tracking-widest hover:text-[#FF4D00] transition-colors">{item}</button>
            ))}
            <button onClick={() => setIsAdminOpen(true)} className="bg-[#1A1A1A] text-white px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all">Admin</button>
          </div>

          <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#FF4D00] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center border-2 border-[#1A1A1A] rounded-full">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <h1 className="text-7xl md:text-9xl font-display leading-[0.85] uppercase text-[#1A1A1A]">
              Taste the <br /> <span className="text-[#FF4D00] italic">Ultimate</span> <br /> Dum Magic.
            </h1>
            <p className="text-xl font-medium text-stone-600 max-w-md">
              No fancy talk, just the best damn Biriyani in town. Slow cooked, spice-heavy, and soul-satisfying.
            </p>
            <div className="flex flex-wrap gap-6">
              <button onClick={() => menuRef.current?.scrollIntoView({behavior:'smooth'})} className="bg-[#FF4D00] text-white px-10 py-6 text-xl font-black uppercase border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-4">
                Explore Menu <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="aspect-square bg-[#FF4D00] border-4 border-[#1A1A1A] shadow-[20px_20px_0px_#1A1A1A] overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="https://picsum.photos/seed/biriyani-funky/1000/1000" alt="Biriyani" className="w-full h-full object-cover mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -top-10 -right-10 bg-white border-4 border-[#1A1A1A] p-6 shadow-[10px_10px_0px_#1A1A1A] rotate-6 hidden md:block">
              <Zap className="w-10 h-10 text-[#FF4D00] mb-2" />
              <p className="text-2xl font-display uppercase leading-none">Hot & Fresh</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section ref={menuRef} className="py-32 bg-[#1A1A1A] text-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-[#FF4D00] text-xl font-black uppercase tracking-[0.3em]">The Lineup</h2>
              <h3 className="text-6xl md:text-8xl font-display uppercase leading-none">Pick Your <br /> Poison.</h3>
            </div>
            <div className="bg-[#FF4D00] text-white p-6 border-2 border-white shadow-[8px_8px_0px_white] rotate-2">
              <p className="text-sm font-black uppercase tracking-widest">Limited Stock Daily</p>
            </div>
          </div>

          <div className="space-y-32">
            {categories.map(cat => (
              <div key={cat.id} className="space-y-12">
                <h4 className="text-4xl font-display uppercase text-[#FF4D00] tracking-widest flex items-center gap-6">
                  {cat.name} <div className="h-1 flex-grow bg-[#FF4D00]/20" />
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                  {menu.filter(i => i.category_id === cat.id).map(item => (
                    <motion.div key={item.id} whileHover={item.available ? { y: -10, scale: 1.02 } : {}} transition={{ type: 'spring', stiffness: 300 }} className={`bg-white text-[#1A1A1A] border-2 md:border-4 border-[#1A1A1A] shadow-[4px_4px_0px_#FF4D00] md:shadow-[8px_8px_0px_#FF4D00] p-3 md:p-6 flex flex-col ${!item.available ? 'opacity-75 grayscale' : ''}`}>
                      <div className="aspect-[4/3] bg-stone-100 border-2 border-[#1A1A1A] mb-3 md:mb-6 overflow-hidden relative">
                        <img src={item.image_url || `https://picsum.photos/seed/${item.id}/600/450`} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-[#FF4D00] text-white px-4 py-2 font-display uppercase text-xl rotate-[-10deg] border-2 border-white shadow-[4px_4px_0px_#1A1A1A]">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow space-y-2 md:space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-1">
                          <h5 className="text-lg md:text-2xl font-display uppercase leading-none">{item.name}</h5>
                          <span className="bg-[#1A1A1A] text-white px-2 py-0.5 md:px-3 md:py-1 text-sm md:text-lg font-black">₹{item.price}</span>
                        </div>
                        <p className="text-[10px] md:text-sm font-medium text-stone-500 leading-tight md:leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                      <div className="pt-4 md:pt-8">
                        {item.available ? (
                          cart.find(i => i.id === item.id) ? (
                            <div className="flex items-center justify-between bg-[#F9F7F2] border-2 border-[#1A1A1A] p-1 md:p-2">
                              <button onClick={() => removeFromCart(item.id)} className="p-1 md:p-2 hover:bg-[#FF4D00] hover:text-white transition-colors"><Minus className="w-3 h-3 md:w-5 md:h-5" /></button>
                              <span className="text-sm md:text-xl font-black">{cart.find(i => i.id === item.id)?.quantity}</span>
                              <button onClick={() => addToCart(item)} className="p-1 md:p-2 hover:bg-[#FF4D00] hover:text-white transition-colors"><Plus className="w-3 h-3 md:w-5 md:h-5" /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item)} className="w-full bg-[#1A1A1A] text-white py-2 md:py-4 text-[10px] md:text-sm font-black uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-[#FF4D00] transition-all">Add</button>
                          )
                        ) : (
                          <button disabled className="w-full bg-stone-300 text-stone-500 py-2 md:py-4 text-[10px] md:text-sm font-black uppercase tracking-widest border-2 border-stone-300 cursor-not-allowed">Unavailable</button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section ref={contactRef} className="py-32 px-4 md:px-8 border-t-4 border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <h3 className="text-6xl md:text-8xl font-display uppercase leading-none">Find the <br /> Box.</h3>
            <div className="space-y-8">
              {[
                { icon: MapPin, label: 'Where', val: 'Plot 123, Office Square, Bhubaneswar' },
                { icon: Clock, label: 'When', val: '11:00 AM - 10:00 PM (Daily)' },
                { icon: Phone, label: 'Holla', val: '+91 98765 43210' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="bg-[#1A1A1A] text-white p-4 border-2 border-[#1A1A1A] group-hover:bg-[#FF4D00] transition-colors"><item.icon className="w-8 h-8" /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold leading-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-4 border-[#1A1A1A] shadow-[20px_20px_0px_#1A1A1A] h-[500px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.123456789!2d85.8245!3d20.2961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDE3JzQ2LjAiTiA4NcKwNDknMjguMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#1A1A1A] text-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF4D00] p-2 border-2 border-white"><ChefHat className="w-6 h-6" /></div>
            <span className="text-3xl font-display uppercase">Biriyani Box</span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-stone-500">© 2026 Biriyani Box. No Regrets.</p>
          <div className="flex gap-6">
            <button onClick={() => setIsAdminOpen(true)} className="text-xs font-black uppercase tracking-widest text-stone-500 hover:text-[#FF4D00]">Admin</button>
            <Instagram className="w-5 h-5 cursor-pointer hover:text-[#FF4D00]" />
            <Facebook className="w-5 h-5 cursor-pointer hover:text-[#FF4D00]" />
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-[#1A1A1A]/90 z-[100] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F9F7F2] z-[101] border-l-4 border-[#1A1A1A] flex flex-col">
              <div className="p-8 flex justify-between items-center border-b-4 border-[#1A1A1A] bg-white">
                <h3 className="text-4xl font-display uppercase">Your Box</h3>
                <button onClick={() => setIsCartOpen(false)} className="bg-[#1A1A1A] text-white p-2 border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all"><X /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-6">
                    <ShoppingBag className="w-20 h-20 mx-auto text-stone-200" />
                    <p className="font-black uppercase tracking-widest text-stone-400">Box is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <div className="w-20 h-20 border-2 border-[#1A1A1A] flex-shrink-0"><img src={`https://picsum.photos/seed/${item.id}/200/200`} alt={item.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" /></div>
                      <div className="flex-grow">
                        <p className="text-xl font-display uppercase leading-none mb-1">{item.name}</p>
                        <p className="text-sm font-black text-[#FF4D00]">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white border-2 border-[#1A1A1A] p-1">
                        <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-[#FF4D00] hover:text-white"><Minus className="w-4 h-4" /></button>
                        <span className="font-black text-sm">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:bg-[#FF4D00] hover:text-white"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-8 bg-white border-t-4 border-[#1A1A1A] space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-4xl font-display uppercase">Total</span>
                    <span className="text-4xl font-display uppercase text-[#FF4D00]">₹{cartTotal}</span>
                  </div>
                  <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-6 text-xl font-black uppercase border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-4">
                    Order on WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 bg-[#1A1A1A]/95 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white border-4 border-[#1A1A1A] p-6 md:p-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-[20px_20px_0px_#FF4D00]">
              <button onClick={() => setIsAdminOpen(false)} className="absolute top-6 right-6 bg-[#1A1A1A] text-white p-2 border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all z-10"><X /></button>
              {!isAdmin ? (
                <div className="space-y-10 text-center py-10">
                  <h2 className="text-5xl font-display uppercase">Admin Access</h2>
                  <form onSubmit={(e) => { e.preventDefault(); if(adminPassword === 'admin123') setIsAdmin(true); else alert('Wrong'); }} className="space-y-6 max-w-md mx-auto">
                    <input type="password" placeholder="Password" className="w-full p-6 border-4 border-[#1A1A1A] text-2xl font-black outline-none focus:bg-[#F9F7F2]" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                    <button className="w-full bg-[#1A1A1A] text-white py-6 text-xl font-black uppercase border-4 border-[#1A1A1A] hover:bg-[#FF4D00] transition-all">Enter Dashboard</button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-[#1A1A1A] pb-8">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-display uppercase">Dashboard</h2>
                      <div className="flex gap-4 mt-2">
                        <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] px-3 py-1 text-[10px] font-black uppercase">Items: {menu.length}</div>
                        <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] px-3 py-1 text-[10px] font-black uppercase">Categories: {categories.length}</div>
                        <div className="bg-[#FF4D00]/10 border-2 border-[#FF4D00] px-3 py-1 text-[10px] font-black uppercase text-[#FF4D00]">Out of Stock: {menu.filter(i => !i.available).length}</div>
                      </div>
                    </div>
                    <div className="flex bg-[#F9F7F2] border-2 border-[#1A1A1A] p-1">
                      <button onClick={() => setAdminTab('items')} className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'items' ? 'bg-[#1A1A1A] text-white' : 'hover:bg-[#FF4D00]/10'}`}>Items</button>
                      <button onClick={() => setAdminTab('categories')} className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'categories' ? 'bg-[#1A1A1A] text-white' : 'hover:bg-[#FF4D00]/10'}`}>Categories</button>
                    </div>
                  </div>

                  {adminTab === 'items' ? (
                    <div className="space-y-12">
                      <div className="flex justify-between items-center bg-[#1A1A1A] text-white p-6 border-2 border-[#1A1A1A]">
                        <div>
                          <h3 className="text-3xl font-display uppercase">Menu Items</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00]">Total Items: {menu.length}</p>
                        </div>
                        <button onClick={() => setEditingItem({ name:'', price:0, description:'', category_id: categories[0]?.id || 0, available:1, image_url: '' })} className="bg-[#FF4D00] text-white px-6 py-3 border-2 border-white font-black uppercase text-xs shadow-[4px_4px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Add New Item</button>
                      </div>
                      
                      <div className="space-y-16">
                        {categories.map(cat => (
                          <div key={cat.id} className="space-y-6">
                            <div className="flex items-center gap-4">
                              <h4 className="text-2xl font-display uppercase text-[#FF4D00]">{cat.name}</h4>
                              <div className="h-0.5 flex-grow bg-[#1A1A1A]/10" />
                            </div>
                            <div className="grid gap-4">
                              {menu.filter(item => item.category_id === cat.id).map(item => (
                                <div key={item.id} className={`bg-[#F9F7F2] p-4 md:p-6 border-2 border-[#1A1A1A] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${!item.available ? 'border-dashed opacity-75 bg-stone-100' : 'shadow-[4px_4px_0px_#1A1A1A]'}`}>
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 border-2 border-[#1A1A1A] bg-stone-200 overflow-hidden flex-shrink-0">
                                      <img src={item.image_url || `https://picsum.photos/seed/${item.id}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <div>
                                      <p className="text-xl font-display uppercase leading-none mb-1">{item.name}</p>
                                      <p className="text-xs font-black text-stone-400 uppercase">₹{item.price} • {item.available ? <span className="text-green-600">In Stock</span> : <span className="text-red-600">Out of Stock</span>}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 w-full md:w-auto">
                                    <button 
                                      onClick={async () => {
                                        const updated = { ...item, available: item.available === 1 ? 0 : 1 };
                                        await fetch(`/api/menu/${item.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify(updated)
                                        });
                                        fetchMenu();
                                      }}
                                      className={`flex-1 md:flex-none px-4 py-3 border-2 border-[#1A1A1A] font-black uppercase text-[10px] transition-all ${item.available ? 'bg-white hover:bg-red-50' : 'bg-[#FF4D00] text-white hover:bg-[#1A1A1A]'}`}
                                    >
                                      {item.available ? 'Mark Out of Stock' : 'Mark In Stock'}
                                    </button>
                                    <button onClick={() => setEditingItem(item)} className="p-3 bg-white border-2 border-[#1A1A1A] hover:bg-[#FF4D00] hover:text-white transition-all"><Settings className="w-5 h-5 mx-auto" /></button>
                                    <button onClick={async () => { if(confirm(`Delete "${item.name}"?`)) { await fetch(`/api/menu/${item.id}`, {method:'DELETE'}); fetchMenu(); } }} className="p-3 bg-white border-2 border-[#1A1A1A] hover:bg-red-500 hover:text-white transition-all"><X className="w-5 h-5 mx-auto" /></button>
                                  </div>
                                </div>
                              ))}
                              {menu.filter(item => item.category_id === cat.id).length === 0 && (
                                <p className="text-xs font-black uppercase tracking-widest text-stone-400 py-4 text-center border-2 border-dashed border-stone-200">No items in this category</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-display uppercase">Manage Categories</h3>
                        <button onClick={() => setEditingCategory({ name: '' })} className="bg-[#FF4D00] text-white px-6 py-3 border-2 border-[#1A1A1A] font-black uppercase text-xs shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Add New Category</button>
                      </div>
                      <div className="grid gap-4">
                        {categories.map(cat => (
                          <div key={cat.id} className="bg-[#F9F7F2] p-6 border-2 border-[#1A1A1A] flex justify-between items-center">
                            <p className="text-xl font-display uppercase leading-none">{cat.name}</p>
                            <button onClick={async () => { if(confirm('Deleting category will affect items. Sure?')) { await fetch(`/api/categories/${cat.id}`, {method:'DELETE'}); fetchCategories(); fetchMenu(); } }} className="p-3 bg-white border-2 border-[#1A1A1A] hover:bg-red-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 bg-[#1A1A1A]/95 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white border-4 border-[#1A1A1A] p-6 md:p-10 w-full max-w-4xl space-y-8 shadow-[20px_20px_0px_#FF4D00]">
              <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-6">
                <h3 className="text-4xl font-display uppercase">{editingItem.id ? 'Edit' : 'New'} Item</h3>
                <button onClick={() => setEditingItem(null)} className="bg-[#1A1A1A] text-white p-2 border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all"><X /></button>
              </div>
              
              <form onSubmit={async (e) => { e.preventDefault(); const method = editingItem.id ? 'PUT' : 'POST'; const url = editingItem.id ? `/api/menu/${editingItem.id}` : '/api/menu'; await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(editingItem) }); setEditingItem(null); fetchMenu(); }} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Item Name</label>
                      <input placeholder="Name" className="w-full p-4 border-2 border-[#1A1A1A] font-bold outline-none focus:bg-[#F9F7F2]" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Price (₹)</label>
                        <input type="number" placeholder="Price" className="w-full p-4 border-2 border-[#1A1A1A] font-bold outline-none focus:bg-[#F9F7F2]" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Category</label>
                        <select className="w-full p-4 border-2 border-[#1A1A1A] font-bold outline-none focus:bg-[#F9F7F2]" value={editingItem.category_id} onChange={e => setEditingItem({...editingItem, category_id: parseInt(e.target.value)})}>
                          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Image URL</label>
                      <input placeholder="https://..." className="w-full p-4 border-2 border-[#1A1A1A] font-bold outline-none focus:bg-[#F9F7F2]" value={editingItem.image_url} onChange={e => setEditingItem({...editingItem, image_url: e.target.value})} />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Description</label>
                      <textarea placeholder="Description" className="w-full p-4 border-2 border-[#1A1A1A] font-bold outline-none h-32 focus:bg-[#F9F7F2]" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                    </div>

                    <div className="flex items-center gap-4 bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A]">
                      <input type="checkbox" id="available" className="w-6 h-6 accent-[#FF4D00]" checked={editingItem.available === 1} onChange={e => setEditingItem({...editingItem, available: e.target.checked ? 1 : 0})} />
                      <label htmlFor="available" className="text-sm font-black uppercase tracking-widest cursor-pointer">In Stock / Available</label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 border-2 border-[#1A1A1A] font-black uppercase text-xs hover:bg-stone-100 transition-all">Cancel</button>
                      <button type="submit" className="flex-1 py-4 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] font-black uppercase text-xs hover:bg-[#FF4D00] transition-all">Save Item</button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 bg-[#1A1A1A]/95 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white border-4 border-[#1A1A1A] p-6 md:p-10 w-full max-w-2xl space-y-8 shadow-[20px_20px_0px_#FF4D00]">
              <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-6">
                <h3 className="text-4xl font-display uppercase">New Category</h3>
                <button onClick={() => setEditingCategory(null)} className="bg-[#1A1A1A] text-white p-2 border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all"><X /></button>
              </div>
              
              <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/categories', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(editingCategory) }); setEditingCategory(null); fetchCategories(); }} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Category Name</label>
                    <input placeholder="Category Name" className="w-full p-5 border-2 border-[#1A1A1A] font-bold outline-none focus:bg-[#F9F7F2]" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} required />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 py-5 border-2 border-[#1A1A1A] font-black uppercase text-xs hover:bg-stone-100 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-5 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] font-black uppercase text-xs hover:bg-[#FF4D00] transition-all">Save Category</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
