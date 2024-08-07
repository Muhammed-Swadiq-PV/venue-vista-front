import React, { createContext, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface SignOutContextProps {
  signOut: () => void;
}

const OrganizerSignOutContext = createContext<SignOutContextProps | undefined>(undefined);

export const OrganizerSignOutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
  
    const signOut = () => {
      try {
          console.log('trying to remove token')
        Cookies.remove('OrganizerAccessToken', { path: '/organizer' });
        Cookies.remove('OrganizerRefreshToken', { path: '/organizer' });
        Cookies.remove('OrganizerId', { path:'/organizer' });
        toast.success('Signed out successfully');
        navigate('/organizer/signin');
      } catch (error) {
        console.error('Error during sign out:', error);
        toast.error('An error occurred while signing out');
      }
    };
  
    return (
      <OrganizerSignOutContext.Provider value={{ signOut }}>
        {children}
      </OrganizerSignOutContext.Provider>
    );
  };
  
  export const useSignOut = () => {
    const context = useContext(OrganizerSignOutContext);
    if (context === undefined) {
      throw new Error('useSignOut must be used within a SignOutProvider');
    }
    return context.signOut;
  };
  