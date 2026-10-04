// the top of an inner page: the label, the big heading, and an optional intro.
// texture = which wash sits behind it, 'waves' or 'ribs' (see gradientv.css)
import Eyebrow from './ui/Eyebrow.jsx';

export default function PageHero({ label, heading, lead, texture = 'waves' }) {
    return (
        <section className="relative">
            <div className={`tx tx-${texture}`} aria-hidden="true" />
            <div className="wrap relative pt-14 pb-12 md:pt-24 md:pb-20">
                <Eyebrow>{label}</Eyebrow>
                <h1 className="display-xl mt-6 max-w-[15ch]">{heading}</h1>
                {/* pushed to the right on wide screens so it doesn't just stack under the heading */}
                {lead && (
                    <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-ink-soft md:mr-[6%] md:ml-auto md:text-xl">
                        {lead}
                    </p>
                )}
            </div>
        </section>
    );
}
