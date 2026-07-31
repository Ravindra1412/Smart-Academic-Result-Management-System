import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Root />);

// Hide the boot loader once React has mounted
setTimeout(() => {
  const loader = document.getElementById('root-loader');
  if (loader) loader.classList.add('done');
}, 1200);
