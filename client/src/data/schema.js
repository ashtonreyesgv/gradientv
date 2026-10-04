// the structured data that search engines and AI answer engines read (JSON-LD).
// it says, in a format a machine can't misread, who GradientV is and what each page is.
// every function returns a plain object, and Seo.jsx turns it into the <script> tag

import { COMPANY, SHARE_IMAGE, SITE_URL } from './site.js';
import { TEAM } from './team.js';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const FOUNDER = {
    '@type': 'Person',
    name: 'Ashton Reyes',
    jobTitle: 'Founder',
    url: 'https://ashtonreyes.com/',
    sameAs: ['https://www.linkedin.com/in/ashton-reyes/', 'https://github.com/ashton-reyes']
};

/** the company. every page points back to the same @id, so they all describe one thing */
function organization(extra = {}) {
    return {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: `${SITE_URL}/`,
        ...extra
    };
}

export function homeSchema(t) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            organization({
                description: t.home.seo.description,
                email: COMPANY.email,
                telephone: COMPANY.phone.schema,
                logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/images/brand/stacked_black_t.png`,
                    width: 1174,
                    height: 1106
                },
                image: SHARE_IMAGE.url,
                areaServed: [
                    { '@type': 'Place', name: 'New York City, New York' },
                    { '@type': 'Place', name: 'Stony Brook, New York' }
                ],
                sameAs: [COMPANY.linkedin.href],
                founder: FOUNDER
            }),
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: COMPANY.name,
                description: t.home.seo.description,
                inLanguage: t.htmlLang,
                publisher: { '@id': ORGANIZATION_ID }
            }
        ]
    };
}

export function storySchema(t, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url,
        name: t.story.seo.title,
        inLanguage: t.htmlLang,
        mainEntity: organization({
            founder: {
                ...FOUNDER,
                alumniOf: { '@type': 'CollegeOrUniversity', name: 'Stony Brook University' }
            }
        })
    };
}

export function teamSchema(t, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url,
        name: t.team.seo.title,
        inLanguage: t.htmlLang,
        mainEntity: organization({
            employee: TEAM.map((person) => {
                const website = person.links.find((link) => link.kind === 'website');
                return {
                    '@type': 'Person',
                    name: person.name,
                    jobTitle: t.team.members[person.id].role,
                    sameAs: person.links.filter((link) => link.kind !== 'website').map((link) => link.href),
                    ...(website ? { url: website.href } : {})
                };
            })
        })
    };
}

export function contactSchema(t, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url,
        name: t.contact.seo.title,
        inLanguage: t.htmlLang,
        mainEntity: organization({
            email: COMPANY.email,
            telephone: COMPANY.phone.schema,
            sameAs: [COMPANY.linkedin.href]
        })
    };
}

export function videoSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'GradientV Introduction',
        description: 'A short brand introduction to GradientV. The video has no narration; its content is conveyed visually and its only audio is instrumental music.',
        contentUrl: `${SITE_URL}/videos/introduction.mp4`,
        encodingFormat: 'video/mp4',
        duration: 'PT11S',
        width: 3840,
        height: 2160,
        uploadDate: '2026-06-10',
        inLanguage: 'en',
        publisher: { '@id': ORGANIZATION_ID }
    };
}
