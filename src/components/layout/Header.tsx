import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Layers,
  Sparkles,
  Shield,
  Search,
  Menu,
  X,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useCompare } from '../../context/CompareContext.tsx';
import { useDemo } from '../../context/DemoContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { itemCount, cartBounced } = useCart();
  const { selectedProducts } = useCompare();
  const { isDemoMode, setIsDemoMode, resetAllDemoState } = useDemo();
  const { isAdmin, loginAsAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Proof Hub (12 Demos)', path: '/proof', highlight: true },
    { label: 'Shop Catalog', path: '/shop' },
    { label: 'Compare Lens', path: '/compare', badge: selectedProducts.length > 0 ? selectedProducts.length : undefined },
    { label: 'SuperSave', path: '/account/savings' },
    { label: 'Track Order', path: '/track' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8]">
      {/* Top 3-Zone Contract Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#1A1A1A] font-display hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>OneMart</span>
            <span className="w-2 h-2 rounded-full bg-[#C8102E] shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Zone 2: 4-6 nav links (Single-line, clean text with subtle hover effect) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5C5C5C]">
          {navLinks.map(link => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#C8102E] font-semibold'
                    : 'hover:text-[#1A1A1A]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#FDECEE] text-[#C8102E] text-[11px] font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary actions + Utilities */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Toggle Badge */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer border ${
              isDemoMode
                ? 'bg-[#FDECEE] text-[#C8102E] border-[#FDECEE]'
                : 'bg-[#FAFAFA] text-[#8E8E8E] border-[#E8E8E8]'
            }`}
            title="Toggle Demo verification features and Chaos simulators"
          >
            <Sparkles className="w-3 h-3" />
            <span>Demo {isDemoMode ? 'Active' : 'Off'}</span>
          </button>

          {/* Role Toggle: Admin / Shopper */}
          <button
            onClick={() => {
              if (isAdmin) {
                logout();
              } else {
                loginAsAdmin();
                onNavigate('/admin');
              }
            }}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'text-[#5C5C5C] hover:text-[#1A1A1A] border-[#E8E8E8]'
            }`}
            title="Switch between Customer and Warehouse Dispatch Admin"
          >
            <Shield className="w-3 h-3" />
            <span>{isAdmin ? 'Admin View' : 'Admin'}</span>
          </button>

          {/* Cart Icon with Bouncing Count Badge */}
          <button
            onClick={() => onNavigate('/cart')}
            aria-label="View Shopping Cart"
            className="relative p-2 text-[#1A1A1A] hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <motion.span
                animate={cartBounced ? { scale: [1, 1.35, 1], y: [0, -3, 0] } : {}}
                transition={{ duration: 0.35 }}
                className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#C8102E] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums"
              >
                {itemCount}
              </motion.span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E8E8E8] bg-white px-4 py-4 space-y-3"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, specs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
              />
              <Search className="w-4 h-4 text-[#8E8E8E] absolute left-3 top-2.5" />
            </form>

            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => {
                    onNavigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPath === link.path
                      ? 'bg-[#FDECEE] text-[#C8102E] font-semibold'
                      : 'text-[#1A1A1A] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="px-2 py-0.5 bg-[#C8102E] text-white text-xs font-bold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-[#5C5C5C]">
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className="flex items-center gap-1.5 text-[#C8102E] font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Mode: {isDemoMode ? 'Active' : 'Off'}</span>
              </button>
              <button
                onClick={() => {
                  if (isAdmin) logout();
                  else loginAsAdmin();
                  setMobileMenuOpen(false);
                  if (!isAdmin) onNavigate('/admin');
                }}
                className="font-medium text-[#1A1A1A]"
              >
                {isAdmin ? 'Logout Admin' : 'Switch to Admin View'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
