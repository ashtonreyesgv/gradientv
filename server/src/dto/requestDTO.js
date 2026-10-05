// what the client actually gets sent for a change request

/** what a client sees: their own request and where it stands */
export function toRequestJSON(request) {
    return {
        id: String(request._id),
        message: request.message,
        status: request.status,
        createdAt: request.createdAt
    };
}

/** what i see: the same, plus whose it is. expects request.account to be filled in (populate) */
export function toInboxJSON(request) {
    return {
        ...toRequestJSON(request),
        businessName: request.account?.businessName ?? 'A deleted login',
        email: request.account?.email ?? ''
    };
}
