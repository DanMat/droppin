import {
	type AggregateConfig,
	type Airport,
	AirportLayoverDetector,
	aggregateTimeline,
	type City,
	NearestCityGeocoder,
	resolveConfig,
	type TravelData,
} from '@danmat/waypoints-core';

export type WorkerRequest = { rawText: string; config?: AggregateConfig };
export type WorkerResponse = { ok: true; data: TravelData } | { ok: false; error: string };

let cache: { cities: City[]; airports: Airport[] } | null = null;

async function loadDatasets() {
	if (cache) return cache;
	const [cities, airports] = await Promise.all([
		fetch('/data/cities.json').then((r) => r.json() as Promise<City[]>),
		fetch('/data/airports.json').then((r) => r.json() as Promise<Airport[]>),
	]);
	cache = { cities, airports };
	return cache;
}

self.onmessage = async (event: MessageEvent) => {
	try {
		const { rawText, config = {} } = event.data as WorkerRequest;
		const raw = JSON.parse(rawText);
		const { cities, airports } = await loadDatasets();
		const cfg = resolveConfig(config);
		const geocoder = new NearestCityGeocoder(cities);
		const layoverDetector = new AirportLayoverDetector(airports, cfg);
		const data = aggregateTimeline(raw, { geocoder, layoverDetector }, config);
		self.postMessage({ ok: true, data } satisfies WorkerResponse);
	} catch (err) {
		const error = err instanceof Error ? err.message : String(err);
		self.postMessage({ ok: false, error } satisfies WorkerResponse);
	}
};
