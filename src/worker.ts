// Tiny Worker in front of the static assets: handles a couple of vanity
// redirects + canonical www→apex, and serves everything else from /dist.

interface Env {
	ASSETS: { fetch(request: Request): Promise<Response> };
}

const REDIRECTS: Record<string, string> = {
	'/gh': 'https://github.com/DanMat/droppin',
	'/example': 'https://waypoints.danmat.workers.dev',
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Canonical host: www → apex, keeping the path/query.
		if (url.hostname === 'www.droppinmap.com') {
			return Response.redirect(`https://droppinmap.com${url.pathname}${url.search}`, 301);
		}

		// Vanity shortlinks (tolerate a trailing slash).
		const path = url.pathname.replace(/\/$/, '') || '/';
		const target = REDIRECTS[path];
		if (target) return Response.redirect(target, 302);

		// Everything else: the static app (and the branded 404 for unknown paths).
		return env.ASSETS.fetch(request);
	},
};
