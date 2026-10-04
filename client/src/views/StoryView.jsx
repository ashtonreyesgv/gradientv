// the Story page: why GradientV exists, in three numbered chapters
// with the dark "what we do" band in the middle
import { Link } from 'react-router';
import Chapter from '../components/Chapter.jsx';
import NightBand from '../components/NightBand.jsx';
import PageHero from '../components/PageHero.jsx';
import { PersonLinks } from '../components/Person.jsx';
import Seo from '../components/Seo.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { ArrowRightIcon } from '../components/ui/Icons.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { pageUrl } from '../data/pages.js';
import { storySchema } from '../data/schema.js';
import { FOUNDER } from '../data/team.js';

const PROSE_CLASS = 'max-w-[62ch] space-y-5 text-[1.05rem] leading-relaxed';

export default function StoryView() {
    const { locale, t, to } = useLocale();
    const { gap, middle, ai, founder } = t.story;

    return (
        <>
            <Seo
                pageId="story"
                title={t.story.seo.title}
                description={t.story.seo.description}
                schema={storySchema(t, pageUrl('story', locale))}
            />

            <PageHero label={t.story.label} heading={t.story.heading} lead={t.story.lead} texture="ribs" />

            {/* ---------- 01: the gap, and the two options a small business gets ---------- */}
            <Chapter number="01" heading={gap.heading}>
                <div className={PROSE_CLASS}>
                    {gap.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {gap.options.map((option, index) => (
                        <article key={option.title} className="relative overflow-hidden rounded-3xl border border-line bg-paper-bright p-6 sm:p-7">
                            {/* the second card flips its texture so the two don't look like copies */}
                            <div className={`tx tx-card ${index === 1 ? 'tx-card-flip' : ''}`} aria-hidden="true" />
                            <div className="relative">
                                <h3 className="display-md">{option.title}</h3>
                                <p className="eyebrow mt-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">{option.cost}</p>
                                <p className="mt-5 text-[0.95rem] text-ink-soft">{option.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </Chapter>

            {/* ---------- the turn in the argument: what GradientV does about it ---------- */}
            <NightBand>
                <div className="max-w-[44rem]">
                    <Eyebrow onNight>{middle.label}</Eyebrow>
                    <h2 className="display-lg mt-5">{middle.heading}</h2>
                    <div className="mt-7 space-y-5 text-[1.05rem] leading-relaxed text-chalk/80">
                        {middle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </div>
            </NightBand>

            {/* ---------- 02: AI ---------- */}
            <Chapter number="02" heading={ai.heading}>
                <div className={PROSE_CLASS}>
                    {ai.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
            </Chapter>

            {/* ---------- 03: the founder ---------- */}
            <Chapter id="founder" number="03" heading={founder.heading}>
                <div className="grid gap-8 sm:grid-cols-[minmax(0,15rem)_1fr]">
                    <img
                        src={FOUNDER.photo.src}
                        alt={t.team.portraitAlt(FOUNDER.name)}
                        width={FOUNDER.photo.width}
                        height={FOUNDER.photo.height}
                        loading="lazy"
                        className="aspect-[4/5] w-full max-w-xs rounded-3xl object-cover"
                    />
                    <div>
                        <Eyebrow>{founder.role}</Eyebrow>
                        <h3 className="display-md mt-3">{FOUNDER.name}</h3>
                        <div className="mt-5 space-y-4 text-ink-soft">
                            {founder.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                        <PersonLinks person={FOUNDER} className="mt-6" />
                        <Link
                            to={to('team')}
                            className="group mt-7 inline-flex items-center gap-2 font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                        >
                            {founder.teamLink}
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </Chapter>
        </>
    );
}
