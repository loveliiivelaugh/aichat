import React from 'react';
import { createRoot } from 'react-dom/client';
import Entry from './Entry';

const root = createRoot(document.getElementById('root')!);
root.render(<Entry />);
