// the home page: the hero, the client tiles, and the contact band
import ClientGrid from '../components/ClientGrid.jsx';
import ContactBand from '../components/ContactBand.jsx';
import Seo from '../components/Seo.jsx';
import ButtonLink from '../components/ui/ButtonLink.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { ArrowRightIcon } from '../components/ui/Icons.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { homeSchema } from '../data/schema.js';

export default function HomeView() {
    const { t, to } = useLocale();
    const [firstLine, secondLine] = t.home.headline;

    return (
        <>
            <Seo pageId="home" title={t.home.seo.title} description={t.home.seo.description} schema={homeSchema(t)} />

            {/* ---------- hero ---------- */}
            <section className="relative">
                <div className="tx tx-waves" aria-hidden="true" />
                {/* the logo mark, huge and faint, running off the right edge. it gets its own box
                    so the part that runs off is cut cleanly. wide screens only: on a phone all
                    that fits is its flat top edge, which just looks like a stray band */}
                <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden="true">
                    <img
                        src="/images/brand/mark_black_t.png"
                        alt=""
                        width="847"
                        height="689"
                        loading="lazy"
                        className="absolute top-10 -right-20 w-[48rem] max-w-none opacity-[0.07]"
                    />
                </div>

                <div className="wrap relative pt-14 pb-20 md:pt-24 md:pb-28">
                    <Eyebrow>{t.home.eyebrow}</Eyebrow>

                    <h1 className="display-xl mt-6">
                        <span className="block">{firstLine}</span>
                        <span className="block text-ink-mute">{secondLine}</span>
                    </h1>

                    <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
                        <div className="md:col-span-6">
                            <p className="max-w-[34rem] text-lg leading-relaxed text-ink-soft">{t.home.lead}</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <ButtonLink to={to('contact')} variant="solid">
                                    {t.home.primaryCta}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </ButtonLink>
                                <ButtonLink to={to('story')}>{t.home.secondaryCta}</ButtonLink>
                            </div>
                        </div>

                        {/* the four things the lead used to list in one long sentence */}
                        <div className="md:col-span-5 md:col-start-8">
                            <Eyebrow>{t.home.buildLabel}</Eyebrow>
                            <ol className="mt-4 border-t border-ink/25">
                                {t.home.builds.map((build, index) => (
                                    <li key={build} className="flex items-baseline justify-between gap-4 border-b border-ink/25 py-3.5">
                                        <span className="font-display text-xl font-medium">{build}</span>
                                        <span aria-hidden="true" className="tabular-nums text-sm text-ink-mute">0{index + 1}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- clients ---------- */}
            <section id="clients" className="wrap pt-4 pb-24 md:pb-32">
                <Eyebrow>{t.home.clientsLabel}</Eyebrow>
                <div className="mt-6">
                    <ClientGrid />
                </div>
            </section>

            <ContactBand />
        </>
    );
}
