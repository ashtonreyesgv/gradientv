// what shows for an address the site doesn't have.
// Vercel serves the prerendered copy of this (404.html) with a real 404 status
import Seo from '../components/Seo.jsx';
import ButtonLink from '../components/ui/ButtonLink.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { useLocale } from '../context/LocaleContext.jsx';

export default function NotFoundView() {
    const { t, to } = useLocale();
    const words = t.notFound;

    return (
        <>
            <Seo title={words.seo.title} description={words.seo.description} />

            <section className="relative">
                <div className="tx tx-waves" aria-hidden="true" />
                <div className="wrap relative pt-14 pb-24 md:pt-24 md:pb-32">
                    <Eyebrow>{words.label}</Eyebrow>
                    <p aria-hidden="true" className="mt-4 font-display text-[clamp(5rem,18vw,11rem)] leading-none font-bold tracking-[-0.05em] text-ink/15">
                        404
                    </p>
                    <h1 className="display-lg mt-2 max-w-[18ch]">{words.heading}</h1>
                    <p className="mt-5 max-w-[52ch] text-lg text-ink-soft">{words.body}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <ButtonLink to={to('home')} variant="solid">{words.home}</ButtonLink>
                        <ButtonLink to={to('contact')}>{words.contact}</ButtonLink>
                        <ButtonLink to={`${to('home')}#clients`}>{words.work}</ButtonLink>
                    </div>
                </div>
            </section>
        </>
    );
}
