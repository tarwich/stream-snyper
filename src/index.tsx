import React from 'react';
import { createRoot } from 'react-dom/client';
import { Wrapper } from './wrapper';

const root =
  document.getElementById('root') ||
  document.body.appendChild(document.createElement('div'));
root.id = 'root';

createRoot(root).render(<Wrapper />);
