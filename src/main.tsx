import '@danmat/waypoints-ui/styles.css';
import './droppin.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
