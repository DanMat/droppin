import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App.js';

describe('App', () => {
	it('renders the drop-zone landing', () => {
		render(<App />);
		expect(screen.getByText(/Drop your location-history/i)).toBeDefined();
		expect(screen.getByRole('button', { name: /choose file/i })).toBeDefined();
	});
});
