import type { TravelData } from '@danmat/waypoints-core';
import { WorldMap } from '@danmat/waypoints-ui';
import { forwardRef } from 'react';
import { Logo } from './Logo.js';

function Stat({ n, sub, k, hl }: { n: string; sub?: string; k: string; hl?: boolean }) {
	return (
		<div className="sc-stat">
			<div className={hl ? 'sc-n hl' : 'sc-n'}>
				{n}
				{sub ? <small> {sub}</small> : null}
			</div>
			<div className="sc-k">{k}</div>
		</div>
	);
}

/** Year range across all visits, e.g. "2011 – 2026" (or a single year). */
function yearRange(data: TravelData): string {
	const months = data.places
		.flatMap((p) => [p.firstVisit, p.lastVisit])
		.filter(Boolean)
		.sort();
	const first = months[0]?.slice(0, 4);
	const last = months[months.length - 1]?.slice(0, 4);
	if (!first || !last) return '';
	return first === last ? first : `${first} – ${last}`;
}

/** A fixed-size, always-dark, branded summary card — rasterised to a PNG for sharing. */
export const ShareCard = forwardRef<HTMLDivElement, { data: TravelData; name?: string }>(
	function ShareCard({ data, name }, ref) {
		const t = data.stats.totals;
		const km = t.distanceKm.toLocaleString();
		const world = (t.distanceKm / 40075).toFixed(1);
		const who = name?.trim() ? `${name.trim()}’s` : 'my';
		const range = yearRange(data);

		return (
			<div className="sharecard" ref={ref}>
				<div className="sc-head">
					<Logo className="sc-logo" />
					<span className="sc-brand">droppin</span>
				</div>
				<div className="sc-subtitle">
					{who} travel log{range ? ` · ${range}` : ''}
				</div>

				<div className="sc-stats">
					<Stat n={String(t.continents)} sub="/ 7" k="continents" hl />
					<Stat n={String(t.countries)} k="countries" />
					<Stat n={String(t.cities)} k="cities" />
					<Stat n={String(t.usStates)} sub="/ 50" k="US states" />
				</div>

				<div className="sc-map">
					<WorldMap places={data.places} />
				</div>

				<div className="sc-foot">
					<span className="sc-dist">
						✈️ {km} km · 🌍 {world}× around the world
					</span>
					<span className="sc-url">droppinmap.com</span>
				</div>
			</div>
		);
	},
);
