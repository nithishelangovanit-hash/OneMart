/**
 * OneMart — Shopping with Proof
 * Master Application Shell
 */

import React from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { DemoProvider } from './context/DemoContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { CompareProvider } from './context/CompareContext.tsx';
import { MainRouter } from './routes.tsx';

export default function App() {
  return (
    <ToastProvider>
      <DemoProvider>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <MainRouter />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </DemoProvider>
    </ToastProvider>
  );
}
