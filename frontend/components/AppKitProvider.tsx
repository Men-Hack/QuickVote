'use client';

import { ReactNode, useEffect } from 'react';
import '../lib/appkit-config';

interface AppKitProviderProps {
  children: ReactNode;
}

export default function AppKitProvider({ children }: AppKitProviderProps) {
  useEffect(() => {
    // AppKit is initialized in appkit-config.ts
    // This component just ensures the config is loaded
  }, []);

  return <>{children}</>;
}


