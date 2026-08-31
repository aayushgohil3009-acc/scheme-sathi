import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Performance optimization: measure load time
if (typeof window !== 'undefined' && window.performance) {
  window.performance.mark('app-start');
}

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Mark app render complete
if (typeof window !== 'undefined' && window.performance) {
  window.performance.mark('app-loaded');
  window.performance.measure('app-load-time', 'app-start', 'app-loaded');
  const measure = window.performance.getEntriesByName('app-load-time')[0];
  console.log(`⚡ App loaded in ${measure.duration.toFixed(2)}ms`);
}

// Register service worker for caching and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('⚠️ Service Worker registration failed:', error);
      });
  });
}