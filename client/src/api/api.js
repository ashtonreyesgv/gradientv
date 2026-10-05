// where the client talks with the server.
// the components never touch fetch, URLs or status codes. they call
// api.signIn(email, password) and get data back, or an ApiError with a readable message.
//
// every address starts with /api. on my laptop Vite passes those along to Express
// (vite.config.js), on Vercel the rewrite in vercel.json does. either way the browser
// only ever talks to the site it's on, so the session cookie rides along by itself

// just a custom error type. the extra field status holds the server's response code
export class ApiError extends Error {
    constructor(message, status = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

/** the status the server uses for "the portal can't be reached", so LoginView can tell it apart from a wrong password */
export const PORTAL_CLOSED = 503;

// not exported so only this file uses this.
// every request goes through this function
async function send(method, url, body) {
    let response;
    try {
        response = await fetch(url, {
            method,
            headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        // fetch only rejects when nothing answered at all
        throw new ApiError('The GradientV server could not be reached.');
    }

    if (response.status === 204) return null;

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(data?.error ?? `The server answered ${response.status}.`, response.status);
    }
    return data;
}

// ---------- signing in and out ----------

/** @return {Promise<Object>} the account that just signed in */
export function signIn(email, password) {
    return send('POST', '/api/auth/login', { email, password });
}

export function signOut() {
    return send('POST', '/api/auth/logout');
}

/** @return {Promise<Object>} whoever is signed in. throws a 401 ApiError when nobody is */
export function getMe() {
    return send('GET', '/api/auth/me');
}

// ---------- the invite link ----------

/** @return {Promise<Object>} { businessName, email } for a link that still works */
export function getInvite(token) {
    return send('POST', '/api/auth/invite', { token });
}

/** saves the password, uses up the link, and signs in. @return {Promise<Object>} the account */
export function setPassword(token, password) {
    return send('POST', '/api/auth/set-password', { token, password });
}
