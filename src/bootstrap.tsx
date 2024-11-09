import { createRoot } from 'react-dom/client';
import Entry from './Entry';
import DevEntry from './Entry.dev';


const isDevelopment = (process.env.NODE_ENV !== 'production');

const root = createRoot(document.getElementById('root')!);
root.render(isDevelopment
    ? <DevEntry />
    : <Entry />
);
