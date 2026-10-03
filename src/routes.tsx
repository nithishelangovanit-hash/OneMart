import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { OfflineBanner } from './components/layout/OfflineBanner.tsx';

// Pages
import { IntroPage } from './pages/intro/IntroPage.tsx';
import { ProofHubPage } from './pages/proof/ProofHubPage.tsx';
import { ShopPage } from './pages/shop/ShopPage.tsx';
import { ProductDetailPage } from './pages/shop/ProductDetailPage.tsx';
import { ComparePage } from './pages/shop/ComparePage.tsx';
import { CartPage } from './pages/cart/CartPage.tsx';
import { AddressPage } from './pages/checkout/AddressPage.tsx';
import { ReviewPage } from './pages/checkout/ReviewPage.tsx';
import { PaymentPage } from './pages/checkout/PaymentPage.tsx';
import { ConfirmationPage } from './pages/checkout/ConfirmationPage.tsx';
import { OrdersPage } from './pages/account/OrdersPage.tsx';
import { OrderDetailPage } from './pages/account/OrderDetailPage.tsx';
import { SavingsPage } from './pages/account/SavingsPage.tsx';
import { TrackOrderPage } from './pages/track/TrackOrderPage.tsx';
import { AdminPage } from './pages/admin/AdminPage.tsx';

export const MainRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [activeOrderId, setActiveOrderId] = useState<string>('ord_1001');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    // If navigating to /proof#pXX or similar
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (route !== currentPath) {
        window.history.pushState({}, '', path);
        setCurrentPath(route || '/');
      }
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matcher
  const renderRoute = () => {
    if (currentPath === '/') {
      return <IntroPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/proof')) {
      return <ProofHubPage />;
    }

    if (currentPath.startsWith('/shop')) {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category') || '';
      const search = urlParams.get('search') || '';
      return (
        <ShopPage
          onNavigate={navigate}
          initialCategory={cat}
          initialSearch={search}
        />
      );
    }

    if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '').split('?')[0];
      return <ProductDetailPage productId={productId} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/compare')) {
      return <ComparePage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/cart')) {
      return <CartPage onNavigate={navigate} />;
    }

    if (currentPath === '/checkout/address') {
      return <AddressPage onNavigate={navigate} />;
    }

    if (currentPath === '/checkout/review') {
      return <ReviewPage onNavigate={navigate} onOrderCreated={id => setActiveOrderId(id)} />;
    }

    if (currentPath.startsWith('/checkout/payment')) {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId') || activeOrderId || 'ord_1001';
      return <PaymentPage orderId={orderId} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/checkout/confirmation')) {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId') || activeOrderId || 'ord_1001';
      return <ConfirmationPage orderId={orderId} onNavigate={navigate} />;
    }

    if (currentPath === '/account/orders') {
      return <OrdersPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/account/orders/')) {
      const orderId = currentPath.replace('/account/orders/', '').split('?')[0];
      return <OrderDetailPage orderId={orderId} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/account/savings')) {
      return <SavingsPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/track')) {
      return <TrackOrderPage />;
    }

    if (currentPath.startsWith('/admin')) {
      return <AdminPage />;
    }

    // Default fallback
    return <IntroPage onNavigate={navigate} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <OfflineBanner />
      <Header currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
};
