// what the client actually gets sent
// an Account document also holds the password hash, the invite and the lock.
// none of that should ever leave the server, so only these fields get picked out

/** whoever is signed in, for the portal */
export function toAccountJSON(account) {
    return {
        id: String(account._id),
        businessName: account.businessName,
        email: account.email,
        role: account.role
    };
}

/** just enough for the set-password page to say whose login this is */
export function toInviteJSON(account) {
    return {
        businessName: account.businessName,
        email: account.email
    };
}
