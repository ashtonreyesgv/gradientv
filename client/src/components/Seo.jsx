// the <head> tags for one page: title, description, the "this is the real address"
// link, the other languages it exists in, and what a shared link looks like.
//
// every view renders one <Seo /> at its top. React 19 moves <title>, <meta> and
// <link> into <head> by itself no matter where they are rendered, and swaps them
// when you move to another page. at build time scripts/prerender.js bakes the
// same tags into each HTML file, so crawlers that don't run JavaScript see them too
import { useLocale } from '../context/LocaleContext.jsx';
import { CONTENT } from '../content/index.js';
import { PAGES, pageUrl } from '../data/pages.js';
import { COMPANY, SHARE_IMAGE } from '../data/site.js';

/**
 * @param {string} [pageId] the page's id in src/data/pages.js. leave it out for the 404 page
 * @param {Object} [schema] structured data from src/data/schema.js
 */
export default function Seo({ pageId, title, description, schema }) {
    const { locale, t } = useLocale();
    const page = PAGES.find((candidate) => candidate.id === pageId);

    // the 404 page has no address of its own, so it only gets a title and "don't index this"
    if (!page) {
        return (
            <>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="robots" content="noindex, follow" />
            </>
        );
    }

    const url = pageUrl(page.id, locale);
    const isTranslated = page.locales.length > 1;

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            {page.noindex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={url} />

            {/* the same page in the other languages, so Google shows each reader the right one */}
            {isTranslated && page.locales.map((code) => (
                <link key={code} rel="alternate" hrefLang={CONTENT[code].hreflang} href={pageUrl(page.id, code)} />
            ))}
            {isTranslated && <link rel="alternate" hrefLang="x-default" href={pageUrl(page.id, 'en')} />}

            {/* what the link looks like when it's pasted into iMessage, LinkedIn, Slack... */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={COMPANY.name} />
            <meta property="og:locale" content={t.ogLocale} />
            {page.locales.filter((code) => code !== locale).map((code) => (
                <meta key={code} property="og:locale:alternate" content={CONTENT[code].ogLocale} />
            ))}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={SHARE_IMAGE.url} />
            <meta property="og:image:width" content={String(SHARE_IMAGE.width)} />
            <meta property="og:image:height" content={String(SHARE_IMAGE.height)} />
            <meta property="og:image:alt" content={COMPANY.name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={SHARE_IMAGE.url} />
            <meta name="twitter:image:alt" content={COMPANY.name} />

            {/* "<" is escaped so nothing inside the data can close the script tag early */}
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
                />
            )}
        </>
    );
}
