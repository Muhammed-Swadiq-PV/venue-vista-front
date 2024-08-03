import React, { createContext, useContext, useState } from 'react';

interface RedirectContextType {
  redirectPath: string;
  setRedirectPath: (path: string) => void;
}

const RedirectContext = createContext<RedirectContextType | undefined>(undefined);

export const RedirectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [redirectPath, setRedirectPath] = useState<string>('');

  return (
    <RedirectContext.Provider value={{ redirectPath, setRedirectPath }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = () => {
  const context = useContext(RedirectContext);
  if (context === undefined) {
    throw new Error('useRedirect must be used within a RedirectProvider');
  }
  return context;
};
