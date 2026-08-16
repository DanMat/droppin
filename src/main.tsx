import '@danmat/waypoints-ui/styles.css';
import './droppin.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';

// Easter egg for anyone who opens the console 👀
console.log(
	"%c📍 droppin%c  drop a pin, see where you've been.",
	'font-size:22px;font-weight:800;color:#57a0ff',
	'font-size:13px;color:#9aa7b6',
);
console.log(
	'%cyour location data never left this browser 💙  ·  built by DanMat  ·  github.com/DanMat/droppin',
	'color:#9aa7b6',
);

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
