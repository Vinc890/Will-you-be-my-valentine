import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProposalPage from './pages/ProposalPage';
import GeneratorPage from './pages/GeneratorPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* The main proposal page handles the base path */}
        <Route path="/" element={<ProposalPage />} />
        {/* The generator page handles creating links */}
        <Route path="/generate" element={<GeneratorPage />} />
      </Routes>
    </Router>
  );
}

export default App;