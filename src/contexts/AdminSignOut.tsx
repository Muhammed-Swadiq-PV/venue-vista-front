
import React, { createContext, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface SignOutContextProps {
  signOut: () => void;
}

const SignOutContext = createContext<SignOutContextProps | undefined>(undefined);

export const SignOutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const signOut = () => {
    try {
        console.log('trying to remove token')
      Cookies.remove('adminAccessToken', { path: '/admin' });
      Cookies.remove('adminRefreshToken', { path: '/admin' });
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error('An error occurred while signing out');
    }
  };

  return (
    <SignOutContext.Provider value={{ signOut }}>
      {children}
    </SignOutContext.Provider>
  );
};

export const useSignOut = () => {
  const context = useContext(SignOutContext);
  if (context === undefined) {
    throw new Error('useSignOut must be used within a SignOutProvider');
  }
  return context.signOut;
};
