// who is signed in, shared with the pages that care (login, set-password, the portal).
// the browser can't read the session cookie, that's the point of it. so the only
// way to know who is signed in is to ask the server, which this does once when it loads
//
// any component inside <AuthProvider> calls useAuth() and gets:
//   status        'checking' | 'signedIn' | 'signedOut'
//   account       { businessName, email, role } or null
//   signIn(email, password)
//   setPassword(token, password)    for the invite link. it signs them in too
//   signOut()
import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/api.js';

const AuthContext = createContext(null);

export function useAuth() {
    const value = useContext(AuthContext);
    if (value === null) throw new Error('useAuth must be used inside an <AuthProvider>');
    return value;
}

export function AuthProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [status, setStatus] = useState('checking');

    // at startup, ask the server who this is
    // btw StrictMode runs effects twice in dev, the ignore flag makes the extra run harmless
    useEffect(() => {
        let ignore = false;
        api.getMe()
            .then((found) => {
                if (!ignore) welcome(found);
            })
            .catch(() => {
                // only if it's still an open question. someone quick could have signed in before this answer came back
                if (!ignore) setStatus((current) => (current === 'checking' ? 'signedOut' : current));
            });
        return () => { ignore = true; };
    }, []);

    function welcome(found) {
        setAccount(found);
        setStatus('signedIn');
    }

    const value = {
        account,
        status,
        async signIn(email, password) {
            welcome(await api.signIn(email, password));
        },
        async setPassword(token, password) {
            welcome(await api.setPassword(token, password));
        },
        async signOut() {
            await api.signOut();
            setAccount(null);
            setStatus('signedOut');
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
