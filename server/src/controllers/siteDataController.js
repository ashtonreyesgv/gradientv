// the controllers for the two cards that show a client what their own site collected
// both run behind requireAuth, so they answer for req.account and nobody else
import { toAssessmentJSON, toSubscriberJSON } from '../dto/siteDataDTO.js';
import { listSubscribers, summarizeAssessments } from '../services/siteData.js';

/** GET /api/site-data/assessments -> { total, last30, byType, recent } */
export async function getAssessments(req, res) {
    const summary = await summarizeAssessments(req.account);
    res.json({ ...summary, recent: summary.recent.map(toAssessmentJSON) });
}

/** GET /api/site-data/subscribers -> { total, subscribers } newest first */
export async function getSubscribers(req, res) {
    const { total, subscribers } = await listSubscribers(req.account);
    res.json({ total, subscribers: subscribers.map(toSubscriberJSON) });
}
