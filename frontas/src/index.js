import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';  // Assuming you have global styles in CSS
import App from './App';  // This will correctly import App.tsx

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
