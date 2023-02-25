import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

const root =
  document.getElementById('root') ||
  document.body.appendChild(document.createElement('div'));
root.id = 'root';

createRoot(root).render(<App />);
