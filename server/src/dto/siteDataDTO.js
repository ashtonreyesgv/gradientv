// what the client actually gets sent about the things their site collected

/** one finished assessment. there is nothing on it about who took it, here or in the database */
export function toAssessmentJSON(result) {
    return {
        id: String(result._id),
        type: result.assessmentType,
        score: result.score,
        riskLevel: result.riskLevel,
        createdAt: result.createdAt
    };
}

/** one newsletter signup */
export function toSubscriberJSON(subscriber) {
    return {
        id: String(subscriber._id),
        email: subscriber.email,
        sourcePage: subscriber.sourcePage,
        createdAt: subscriber.createdAt
    };
}
