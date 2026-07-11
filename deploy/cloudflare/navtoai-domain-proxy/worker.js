const UPSTREAM_ORIGIN = 'https://api.navtoai.com';

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const upstreamUrl = new URL(incomingUrl.pathname + incomingUrl.search, UPSTREAM_ORIGIN);

    const upstreamRequest = new Request(upstreamUrl, request);
    upstreamRequest.headers.set('X-Forwarded-Host', incomingUrl.host);
    upstreamRequest.headers.set('X-Forwarded-Proto', incomingUrl.protocol.replace(':', ''));

    const response = await fetch(upstreamRequest);
    const headers = new Headers(response.headers);

    const location = headers.get('Location');
    if (location) {
      headers.set('Location', location.replace(UPSTREAM_ORIGIN, incomingUrl.origin));
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
