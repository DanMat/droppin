/** The Droppin mark — a gradient teardrop pin with a landing shadow. The hole
 * is a mask cut-out, so it works on any background. */
export function Logo({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 96 128" role="img" aria-label="Droppin">
			<defs>
				<linearGradient id="droppin-grad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="var(--accent-hi)" />
					<stop offset="1" stopColor="var(--accent-lo)" />
				</linearGradient>
				<mask id="droppin-hole">
					<rect x="0" y="0" width="96" height="128" fill="white" />
					<circle cx="48" cy="43" r="14" fill="black" />
				</mask>
			</defs>
			<ellipse cx="48" cy="120" rx="15" ry="4" fill="var(--accent)" opacity="0.22" />
			<path
				d="M48 6 C26 6 10 23 10 44 C10 72 48 104 48 104 C48 104 86 72 86 44 C86 23 70 6 48 6 Z"
				fill="url(#droppin-grad)"
				mask="url(#droppin-hole)"
			/>
		</svg>
	);
}
