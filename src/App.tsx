import type { TravelData } from '@danmat/waypoints-core';
import { FunFacts, PlaceList, StatTiles, WorldMap } from '@danmat/waypoints-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkerResponse } from './aggregate.worker.js';
import { Logo } from './Logo.js';
import { ShareCard } from './ShareCard.js';

type Status = 'idle' | 'working' | 'done' | 'error';

export function App() {
	const [status, setStatus] = useState<Status>('idle');
	const [data, setData] = useState<TravelData | null>(null);
	const [error, setError] = useState<string>('');
	const [dragging, setDragging] = useState(false);
	const workerRef = useRef<Worker | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const [sharing, setSharing] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		if (typeof Worker === 'undefined') return; // e.g. jsdom in tests
		const worker = new Worker(new URL('./aggregate.worker.ts', import.meta.url), {
			type: 'module',
		});
		worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
			if (e.data.ok) {
				setData(e.data.data);
				setStatus('done');
			} else {
				setError(e.data.error);
				setStatus('error');
			}
		};
		workerRef.current = worker;
		return () => worker.terminate();
	}, []);

	const handleFile = useCallback(async (file: File) => {
		setStatus('working');
		setError('');
		try {
			const rawText = await file.text();
			workerRef.current?.postMessage({ rawText });
		} catch {
			setError('Could not read that file.');
			setStatus('error');
		}
	}, []);

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const reset = () => {
		setData(null);
		setStatus('idle');
		setError('');
	};

	const share = useCallback(async () => {
		if (!cardRef.current) return;
		setSharing(true);
		try {
			const { domToBlob } = await import('modern-screenshot');
			const blob = await domToBlob(cardRef.current, { scale: 2 });
			if (!blob) throw new Error('Could not render the image.');
			const file = new File([blob], 'my-travels.png', { type: 'image/png' });
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], title: 'My travel log', text: 'Made with droppin' });
			} else {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'my-travels.png';
				a.click();
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			// User cancelled the share sheet, or rendering failed — ignore silently.
			if (err instanceof Error && err.name === 'AbortError') return;
		} finally {
			setSharing(false);
		}
	}, []);

	return (
		<div className="app">
			<header className="topbar">
				<a className="brand" href="/">
					<Logo className="brand-mark" />
					<span className="brand-name">droppin</span>
				</a>
				<a
					className="example-link"
					href="https://waypoints.danmat.workers.dev"
					target="_blank"
					rel="noreferrer"
				>
					see a live example ↗
				</a>
			</header>

			{status === 'done' && data ? (
				<main className="results">
					<div className="results-head">
						<div>
							<h1>Your travel log</h1>
							<p className="muted">
								Everything below was computed in your browser. Nothing was uploaded.
							</p>
						</div>
						<div className="results-actions">
							<button type="button" className="btn" onClick={share} disabled={sharing}>
								{sharing ? 'Generating…' : 'Share my map'}
							</button>
							<button type="button" className="btn btn-ghost" onClick={reset}>
								Start over
							</button>
						</div>
					</div>
					<input
						className="name-input"
						type="text"
						value={name}
						maxLength={24}
						placeholder="Your name — for the share image (optional)"
						onChange={(e) => setName(e.target.value)}
					/>
					<StatTiles stats={data.stats} />
					<WorldMap places={data.places} />
					<FunFacts stats={data.stats} />
					<PlaceList places={data.places} />
					<div className="sharecard-holder" aria-hidden="true">
						<ShareCard ref={cardRef} data={data} name={name} />
					</div>
				</main>
			) : (
				<main className="landing">
					<h1 className="headline">
						Drop your Timeline.
						<br />
						Get your <span className="accent">map</span>.
					</h1>
					<p className="sub">
						Turn your Google&nbsp;Timeline export into a world map + travel stats — continents,
						countries, cities, distance. <strong>100% in your browser</strong>; your location data
						never leaves your device.
					</p>

					{/** biome-ignore lint/a11y/noStaticElementInteractions: drop-zone also has a real button inside */}
					<div
						className={dragging ? 'dropzone dragging' : 'dropzone'}
						onDragOver={(e) => {
							e.preventDefault();
							setDragging(true);
						}}
						onDragLeave={() => setDragging(false)}
						onDrop={onDrop}
					>
						<Logo className="drop-mark" />
						{status === 'working' ? (
							<p className="drop-title">Dropping your pins…</p>
						) : (
							<>
								<p className="drop-title">Drop your location-history.json here</p>
								<p className="muted">or</p>
								<button type="button" className="btn" onClick={() => inputRef.current?.click()}>
									Choose file
								</button>
							</>
						)}
						<input
							ref={inputRef}
							type="file"
							accept="application/json,.json"
							hidden
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) handleFile(file);
							}}
						/>
					</div>

					{status === 'error' && <p className="error">Couldn’t process that file: {error}</p>}

					<details className="how">
						<summary>How to get your export &amp; how this keeps it private</summary>
						<div className="how-body">
							<p>
								On your phone:{' '}
								<strong>
									Google Maps → your profile → Your Timeline → ⋯ → Export Timeline data
								</strong>
								. You’ll get a <code>location-history.json</code> (or <code>Timeline.json</code>).
								Drop it above.
							</p>
							<p>
								Home &amp; work are dropped automatically (from Google’s own labels), airport
								layovers don’t count, and only <strong>city-level</strong> data is ever shown —
								never your exact coordinates. It all runs in a Web Worker on your machine; nothing
								is sent anywhere.
							</p>
						</div>
					</details>
				</main>
			)}

			<footer className="site-foot">
				Built with{' '}
				<a
					href="https://www.npmjs.com/package/@danmat/waypoints-core"
					target="_blank"
					rel="noreferrer"
				>
					@danmat/waypoints-core
				</a>{' '}
				·{' '}
				<a href="https://github.com/DanMat/droppin" target="_blank" rel="noreferrer">
					source
				</a>
			</footer>
		</div>
	);
}
