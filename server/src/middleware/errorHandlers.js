// where every error turns into a response
// routes just throw. Express 5 catches it (even from async functions) and
// skips straight to errorHandler, the one place an error becomes JSON

/** an error that already knows its status code */
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

/** only reached when no route matched */
export function notFound(req, res, next) {
    next(new HttpError(404, `There is no ${req.method} ${req.originalUrl}`));
}

// Express spots an error handler by its four parameters, so next has to stay
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
    let status = error.status ?? 500;
    let message = error.message;

    if (error.type === 'entity.parse.failed') {
        // express.json() couldn't read the body
        message = 'That request body is not valid JSON.';
    }

    if (status >= 500) {
        // details go in the server log, never to the browser
        console.error(error);
        message = 'Something went wrong on the server.';
    }

    // { error } is the shape the client's api.js looks for
    res.status(status).json({ error: message });
}
