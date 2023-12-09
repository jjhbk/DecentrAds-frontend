import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import UserPage from './UserPage';
import Upload from './Upload';
import IndPage from './IndPage';
import Advertise from './Advertise';
import StartAdv from './StartAdv';




const App: React.FC = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<UserPage />} />
          <Route path="/create" element={<Upload />} />
          <Route path="/blog/:id" element={<IndPage />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/createAdvertisement" element={<StartAdv />} />
        </Routes>
      </Router>

  );
}

export default App;
