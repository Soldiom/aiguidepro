import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import App from './App';
import { installGlobalDiagnostics } from './diagnostics';
import { safeRegisterSW, safeUnregisterAllSW } from './sw.ts';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Install global error handlers to catch and log unhandled errors and promise rejections.
installGlobalDiagnostics();

// Vite provides environment variables via `import.meta.env`.
// VITE_PREVIEW is a custom flag to detect if the app is running in a preview environment.
// We use a type assertion and optional chaining to safely access this property
// without relying on global type declarations that can cause build or runtime issues.
// Fix: Cast `import.meta` to `any` to resolve TypeScript error on 'env' property access.
const IS_PREVIEW = ((import.meta as any).env)?.VITE_PREVIEW === '1';

if (IS_PREVIEW) {
  // In embedded/sandboxed previews (like AI Studio), service workers can cause errors.
  // We safely unregister any existing service workers to ensure a clean environment.
  safeUnregisterAllSW();
} else {
  // In production or local development, we register the service worker.
  // The safeRegisterSW function includes checks for secure, top-level contexts.
  safeRegisterSW();
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);