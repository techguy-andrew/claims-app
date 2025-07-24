"use client"

import React, { createContext, useContext } from 'react';

const CustomSidebarContext = createContext<{}>({});

export const CustomSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CustomSidebarContext.Provider value={{}}>
      {children}
    </CustomSidebarContext.Provider>
  );
};

export const useCustomSidebar = () => {
  return useContext(CustomSidebarContext);
};