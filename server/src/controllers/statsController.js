// the controller for the stats page
import { HttpError } from '../middleware/errorHandlers.js';
import { getSiteStats } from '../services/vercelAnalytics.js';

const PERIODS = [7, 30];

/**
 * GET /api/stats?days=7 -> the signed-in client's visitors and page views
 * which site comes from their account, never from the request. there's nothing
 * a browser could send here to get another client's numbers
 */
export async function getStats(req, res) {
    const project = req.account.vercelProject;
    if (!project) throw new HttpError(404, 'No site is connected to this login yet.');

    const asked = Number(req.query.days);
    const days = PERIODS.includes(asked) ? asked : PERIODS[0];

    res.json(await getSiteStats(project, days));
}
