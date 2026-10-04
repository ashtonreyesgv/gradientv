// the legal documents: three documents, each in three languages.
// every file exports the text as a component (default) and a meta object
// { title, description, label, heading, updated }, so LEGAL.privacy.es has both
import * as privacyEn from './privacy.en.jsx';
import * as privacyEs from './privacy.es.jsx';
import * as privacyZh from './privacy.zh.jsx';
import * as termsEn from './terms.en.jsx';
import * as termsEs from './terms.es.jsx';
import * as termsZh from './terms.zh.jsx';
import * as accessibilityEn from './accessibility.en.jsx';
import * as accessibilityEs from './accessibility.es.jsx';
import * as accessibilityZh from './accessibility.zh.jsx';

export const LEGAL = {
    privacy: { en: privacyEn, es: privacyEs, zh: privacyZh },
    terms: { en: termsEn, es: termsEs, zh: termsZh },
    accessibility: { en: accessibilityEn, es: accessibilityEs, zh: accessibilityZh }
};
