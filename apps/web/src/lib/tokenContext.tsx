'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type TokenContextType = {
   token: string | null;
   setToken: (token: string | null) => void;
};

// Create the context with a default value to prevent "Expected 1 argument" errors
const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
   const [token, setToken] = useState<string | null>(null);

   return (
      <TokenContext.Provider value={{ token, setToken }}>
         {children}
      </TokenContext.Provider>
   );
};

// Custom hook for using the context
export const useToken = () => {
   const context = useContext(TokenContext);

   // Add a safety check
   if (!context) {
      throw new Error('useToken must be used within a TokenProvider');
   }

   return context;
};
