import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Home from './pages/Home';
import  Signup  from './pages/user/Signup';
import  Signin from './pages/user/Signin';
import ForgotPassword from './pages/user/ForgotPassword';
import OTP from './pages/user/Otp';
// import OTPVerification from './pages/user/OtpVerification';


const App: React.FC = () => {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/otp-verification' element={<OTP />} />
        {/* <Route path='/otp-approve' element={<OTPVerification />} /> */}
      </Routes>
    </div>
  </Router>
  );
};

export default App;
