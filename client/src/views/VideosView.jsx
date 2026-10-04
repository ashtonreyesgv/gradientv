// the Videos page. English only and not in the nav, but the link still works.
// to bring it back: add it to `links` in Header.jsx and take noindex off it in src/data/pages.js
import PageHero from '../components/PageHero.jsx';
import Seo from '../components/Seo.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { videoSchema } from '../data/schema.js';
import { COMPANY } from '../data/site.js';

export default function VideosView() {
    const { t } = useLocale();
    const { videos } = t;

    return (
        <>
            <Seo pageId="videos" title={videos.seo.title} description={videos.seo.description} schema={videoSchema()} />

            <PageHero label={COMPANY.name} heading={videos.heading} />

            <section className="wrap pb-24 md:pb-32">
                {/* the video has no narration, its only audio is instrumental music. so introduction.vtt
                    has one cue naming the music instead of a transcript, and there's no "default" on the
                    track: captions stay off until the viewer turns them on */}
                <video controls preload="metadata" className="aspect-video w-full rounded-3xl bg-night">
                    <source src="/videos/introduction.mp4" type="video/mp4" />
                    <track kind="captions" srcLang="en" label={videos.captions} src="/videos/introduction.vtt" />
                    {videos.unsupported}
                </video>

                <div className="mt-10 grid gap-8 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <h2 className="display-md">{videos.title}</h2>
                        <p className="mt-4 text-lg text-ink-soft">{videos.text}</p>
                    </div>
                    <div className="md:col-span-6 md:col-start-7">
                        <h3 className="font-display text-lg font-semibold">{videos.summaryHeading}</h3>
                        <div className="mt-3 space-y-4 text-ink-soft">
                            {videos.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
