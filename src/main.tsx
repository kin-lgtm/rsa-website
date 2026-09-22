import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import Home from './pages/home.tsx';
import About from './pages/about.tsx';
import Projects from './pages/projects.tsx';
import Contact from './pages/contact.tsx';
import Donate from './pages/donate.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<App />}>
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<Donate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
