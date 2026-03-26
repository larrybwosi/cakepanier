"use client";

import { createContext, useContext, ReactNode } from "react";

interface BrandConfig {
  name: string;
  logo?: React.ReactNode;
  phone?: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  aboutTitleLine1: string;
  aboutTitleLine2: string;
  aboutDescription1: string;
  aboutDescription2: string;
  founderName: string;
  founderTitle: string;
}

const BrandContext = createContext<BrandConfig | undefined>(undefined);

export const BrandProvider = ({ config, children }: { config: BrandConfig; children: ReactNode }) => {
  return <BrandContext.Provider value={config}>{children}</BrandContext.Provider>;
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};
