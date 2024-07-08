import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Signup  from './pages/user/Signup';

const App: React.FC = () => {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        {/* Define other routes using <Route path="/" element={<Component />} /> */}
      </Routes>
    </div>
  </Router>
  );
};

export default App;
