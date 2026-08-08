import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { BrandingConfig, defaultBrandingConfig } from '../types';

// Branding is used by many public-layout components. Keep one real-time
// Firestore subscription for the application instead of one per component.
let sharedConfig: BrandingConfig = defaultBrandingConfig;
let sharedLoading = true;
let started = false;
const subscribers = new Set<(config: BrandingConfig, loading: boolean) => void>();
const notify = () => subscribers.forEach(listener => listener(sharedConfig, sharedLoading));

function ensureSubscription() {
  if (started) return;
  if (!db) {
    sharedLoading = false;
    notify();
    return;
  }
  started = true;
  const docRef = doc(db, 'config', 'branding');
  onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      sharedConfig = docSnap.data() as BrandingConfig;
    } else {
      sharedConfig = defaultBrandingConfig;
      // This preserves the existing initial-config behaviour while ensuring it
      // only happens once for all mounted consumers.
      try { await setDoc(docRef, defaultBrandingConfig); } catch (error) { console.error('Error creating default branding config:', error); }
    }
    sharedLoading = false;
    notify();
  }, (error) => {
    console.error('Error fetching branding config:', error);
    sharedConfig = defaultBrandingConfig;
    sharedLoading = false;
    notify();
  });
}

export function useBrandingConfig() {
  const [config, setConfig] = useState<BrandingConfig>(sharedConfig);
  const [loading, setLoading] = useState(sharedLoading);

  useEffect(() => {
    const listener = (nextConfig: BrandingConfig, nextLoading: boolean) => { setConfig(nextConfig); setLoading(nextLoading); };
    subscribers.add(listener);
    ensureSubscription();
    listener(sharedConfig, sharedLoading);
    return () => { subscribers.delete(listener); };
  }, []);

  useEffect(() => {
    if (config.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = config.faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = config.faviconUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [config.faviconUrl]);

  return { config, loading };
}
