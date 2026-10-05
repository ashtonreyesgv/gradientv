// one log line per request
// like "GET /api/health 200 12ms". the status isn't known yet when a request
// arrives, so i wait for the response's 'finish' event (Observer pattern!)
export function requestLogger(req, res, next) {
    const start = performance.now();
    res.on('finish', () => {
        const ms = Math.round(performance.now() - start);
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    });
    next();
}
