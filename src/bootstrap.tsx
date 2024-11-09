import { createRoot } from 'react-dom/client';
// import Entry from './Entry';
// import DevEntry from './Entry.dev';
import TestEntry from './TestEntry';

// const isDevelopment = (process.env.NODE_ENV !== 'production');

const root = createRoot(document.getElementById('root')!);
root.render(<TestEntry />
    // isDevelopment
    // ? <DevEntry />
    // : <Entry />
);
