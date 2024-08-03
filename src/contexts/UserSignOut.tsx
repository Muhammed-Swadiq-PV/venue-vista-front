import React, { createContext, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface SignOutContextProps {
  signOut: () => void;
}

const UserSignOutContext = createContext<SignOutContextProps | undefined>(undefined);

export const UserSignOutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
  
    const signOut = () => {
      try {
          console.log('trying to remove token')
        Cookies.remove('userAccessToken', { path: '/user' });
        Cookies.remove('userRefreshToken', { path: '/user' });
        toast.success('Signed out successfully');
        navigate('/user/signin');
      } catch (error) {
        console.error('Error during sign out:', error);
        toast.error('An error occurred while signing out');
      }
    };
  
    return (
      <UserSignOutContext.Provider value={{ signOut }}>
        {children}
      </UserSignOutContext.Provider>
    );
  };
  
  export const useSignOut = () => {
    const context = useContext(UserSignOutContext);
    if (context === undefined) {
      throw new Error('useSignOut must be used within a SignOutProvider');
    }
    return context.signOut;
  };
  