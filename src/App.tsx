import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Phone, MapPin, Clock, 
  Plus, Minus, X, ChefHat,
  Instagram, Facebook, ArrowRight, Star, Zap
} from 'lucide-react';
import { menuItems as initialMenu, categories as initialCategories } from './data/menuData';

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
  const [menu] = useState<MenuItem[]>(initialMenu);
  const [categories] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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
    const msg = encodeURIComponent(`*New Order from Biriyani Box*\n\n${text}\n\n*Total: ₹${cartTotal}*\n\nThank you for ordering!`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="w-12 h-12 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
              <button 
                key={item} 
                onClick={() => item === 'Menu' ? menuRef.current?.scrollIntoView({behavior:'smooth'}) : contactRef.current?.scrollIntoView({behavior:'smooth'})} 
                className="text-sm font-black uppercase tracking-widest hover:text-[#FF4D00] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-3 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF4D00] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center border-2 border-[#1A1A1A] rounded-full">
                {cartCount}
              </span>
            )}
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
              <button 
                onClick={() => menuRef.current?.scrollIntoView({behavior:'smooth'})} 
                className="bg-[#FF4D00] text-white px-10 py-6 text-xl font-black uppercase border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-4"
              >
                Explore Menu <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="aspect-square bg-[#FF4D00] border-4 border-[#1A1A1A] shadow-[20px_20px_0px_#1A1A1A] overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Biriyani" 
                className="w-full h-full object-cover hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer" 
              />
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
                    <motion.div 
                      key={item.id} 
                      whileHover={item.available ? { y: -10, scale: 1.02 } : {}} 
                      transition={{ type: 'spring', stiffness: 300 }} 
                      className={`bg-white text-[#1A1A1A] border-2 md:border-4 border-[#1A1A1A] shadow-[4px_4px_0px_#FF4D00] md:shadow-[8px_8px_0px_#FF4D00] p-3 md:p-6 flex flex-col ${!item.available ? 'opacity-75 grayscale' : ''}`}
                    >
                      <div className="aspect-[4/3] bg-stone-100 border-2 border-[#1A1A1A] mb-3 md:mb-6 overflow-hidden relative">
                        <img 
                          src={item.image_url || `https://picsum.photos/seed/${item.id}/600/450`} 
                          alt={item.name} 
                          className="w-full h-full object-cover hover:scale-110 transition-all duration-500" 
                          referrerPolicy="no-referrer" 
                        />
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-[#FF4D00] text-white px-4 py-2 font-display uppercase text-xl rotate-[-10deg] border-2 border-white shadow-[4px_4px_0px_#1A1A1A]">
                              Out of Stock
                            </span>
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
                              <button 
                                onClick={() => removeFromCart(item.id)} 
                                className="p-1 md:p-2 hover:bg-[#FF4D00] hover:text-white transition-colors"
                              >
                                <Minus className="w-3 h-3 md:w-5 md:h-5" />
                              </button>
                              <span className="text-sm md:text-xl font-black">{cart.find(i => i.id === item.id)?.quantity}</span>
                              <button 
                                onClick={() => addToCart(item)} 
                                className="p-1 md:p-2 hover:bg-[#FF4D00] hover:text-white transition-colors"
                              >
                                <Plus className="w-3 h-3 md:w-5 md:h-5" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => addToCart(item)} 
                              className="w-full bg-[#1A1A1A] text-white py-2 md:py-4 text-[10px] md:text-sm font-black uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-[#FF4D00] transition-all"
                            >
                              Add to Box
                            </button>
                          )
                        ) : (
                          <button disabled className="w-full bg-stone-300 text-stone-500 py-2 md:py-4 text-[10px] md:text-sm font-black uppercase tracking-widest border-2 border-stone-300 cursor-not-allowed">
                            Unavailable
                          </button>
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
                  <div className="bg-[#1A1A1A] text-white p-4 border-2 border-[#1A1A1A] group-hover:bg-[#FF4D00] transition-colors">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold leading-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-4 border-[#1A1A1A] shadow-[20px_20px_0px_#1A1A1A] h-[500px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.123456789!2d85.8245!3d20.2961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDE3JzQ2LjAiTiA4NcKwNDknMjguMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              title="Location Map"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#1A1A1A] text-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF4D00] p-2 border-2 border-white">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="text-3xl font-display uppercase">Biriyani Box</span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-stone-500">© 2026 Biriyani Box. No Regrets.</p>
          <div className="flex gap-6">
            <Instagram className="w-5 h-5 cursor-pointer hover:text-[#FF4D00]" />
            <Facebook className="w-5 h-5 cursor-pointer hover:text-[#FF4D00]" />
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} 
              className="fixed inset-0 bg-[#1A1A1A]/90 z-[100] backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 30 }} 
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F9F7F2] z-[101] border-l-4 border-[#1A1A1A] flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b-4 border-[#1A1A1A] bg-white">
                <h3 className="text-4xl font-display uppercase">Your Box</h3>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="bg-[#1A1A1A] text-white p-2 border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all"
                >
                  <X />
                </button>
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
                      <div className="w-20 h-20 border-2 border-[#1A1A1A] flex-shrink-0">
                        <img 
                          src={item.image_url || `https://picsum.photos/seed/${item.id}/200/200`} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xl font-display uppercase leading-none mb-1">{item.name}</p>
                        <p className="text-sm font-black text-[#FF4D00]">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white border-2 border-[#1A1A1A] p-1">
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="p-1 hover:bg-[#FF4D00] hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-black text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)} 
                          className="p-1 hover:bg-[#FF4D00] hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
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
                  <button 
                    onClick={handleWhatsAppOrder} 
                    className="w-full bg-[#25D366] text-white py-6 text-xl font-black uppercase border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-4"
                  >
                    Order on WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}