// what the client actually gets sent
// an Account document also holds the password hash, the invite and the lock.
// none of that should ever leave the server, so only these fields get picked out

/** whoever is signed in, for the portal */
export function toAccountJSON(account) {
    return {
        id: String(account._id),
        businessName: account.businessName,
        email: account.email,
        role: account.role,
        // true when their own website sends things here (it has a site key).
        // the portal shows those clients two more cards. the key itself never leaves the server
        siteSendsData: Boolean(account.siteKeyHash)
    };
}

/** one row of my list of clients: the same as above, plus what tells two logins of one business apart */
export function toClientJSON(account) {
    return {
        ...toAccountJSON(account),
        // false until they open their invite link and pick a password
        hasSignedUp: Boolean(account.passwordHash)
    };
}

/** just enough for the set-password page to say whose login this is */
export function toInviteJSON(account) {
    return {
        businessName: account.businessName,
        email: account.email
    };
}
