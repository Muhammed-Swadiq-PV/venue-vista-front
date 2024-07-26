import React from 'react';
import Header from '../../components/organizer/Header';
import Footer from '../../components/organizer/Footer';
import { useHandleSignOut } from '../../components/organizer/SignOut';
import ErrorBoundary from '../../components/ErrorBoundary';

const UHome: React.FC = () => {
  const handleSignOut = useHandleSignOut();

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSignOut={handleSignOut} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {/* <ErrorBoundary>
           {/* Your main content here */}
        {/* </ErrorBoundary> */}
      </main>
      <Footer />
    </div>
  );
};

export default UHome;
    