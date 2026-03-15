import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-zinc-900 dark:text-white border dark:border-zinc-800',
        duration: 4000,
      }} />
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
