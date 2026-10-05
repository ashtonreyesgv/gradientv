// where the client will talk with the server.
// the components never touch fetch, URLs or status codes. they call
// api.signIn(email, password) and get data back, or an ApiError with a readable message.
//
// the server exists now (server/), but it can't log anyone in yet.
// so signIn() answers "not open yet" by itself and nothing leaves the browser.
// when login is built, flip SERVER_IS_LIVE and this is
// the only file in the client that has to change

// just a custom error type. the extra field status holds the server's response code
export class ApiError extends Error {
    constructor(message, status = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

/** the day the server can log people in, this becomes true */
const SERVER_IS_LIVE = false;

/** the status the server will use for "the portal isn't open", so LoginView can tell it apart from a wrong password */
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

/** @return {Promise<Object>} the signed-in client, once there is a server to ask */
export async function signIn(email, password) {
    if (!SERVER_IS_LIVE) throw new ApiError('The client portal is not open yet.', PORTAL_CLOSED);
    return send('POST', '/api/auth/login', { email, password });
}
