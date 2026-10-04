// privacy, terms and accessibility all use this one view.
// doc says which document, the language comes from the URL, and the text
// itself is in src/content/legal. its paragraphs are styled by .legal in gradientv.css
import Seo from '../components/Seo.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { LEGAL } from '../content/legal/index.js';

/** @param {'privacy'|'terms'|'accessibility'} doc */
export default function LegalView({ doc }) {
    const { locale } = useLocale();
    const { default: Text, meta } = LEGAL[doc][locale];

    return (
        <>
            <Seo pageId={doc} title={meta.title} description={meta.description} />

            <section className="relative">
                <div className="tx tx-waves" aria-hidden="true" />
                <div className="wrap relative pt-14 pb-24 md:pt-20 md:pb-32">
                    <div className="max-w-[46rem]">
                        <Eyebrow>{meta.label}</Eyebrow>
                        <h1 className="display-lg mt-5">{meta.heading}</h1>
                        <p className="mt-3 text-sm text-ink-soft">{meta.updated}</p>
                        <div className="legal mt-10">
                            <Text />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
