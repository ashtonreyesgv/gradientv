// the contact section: the pitch on the left, and phone / email / LinkedIn
// as three big rows on the right. each row is one link.
//
// the home page ends with it and the Contact page is nothing but it.
// as = which heading tag to use: the Contact page passes 'h1' because there
// it's the main heading of the page, on the home page it stays an h2
import { useLocale } from '../context/LocaleContext.jsx';
import { COMPANY } from '../data/site.js';
import NightBand from './NightBand.jsx';
import Eyebrow from './ui/Eyebrow.jsx';
import { ArrowOutIcon, ArrowRightIcon } from './ui/Icons.jsx';

export default function ContactBand({ as: Heading = 'h2' }) {
    const { t } = useLocale();

    const rows = [
        { label: t.contact.phone, value: COMPANY.phone.label, href: COMPANY.phone.href },
        { label: t.contact.email, value: COMPANY.email, href: `mailto:${COMPANY.email}` },
        { label: t.contact.linkedin, value: COMPANY.linkedin.label, href: COMPANY.linkedin.href, external: true }
    ];

    return (
        <NightBand id="contact">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                    <Eyebrow onNight>{t.contact.label}</Eyebrow>
                    <Heading className="display-lg mt-5 max-w-[19ch]">{t.contact.heading}</Heading>
                    <p className="mt-5 max-w-[36rem] text-chalk/75">{t.contact.text}</p>
                </div>

                <ul className="self-end rounded-2xl border border-white/12 bg-night/70 px-5 backdrop-blur-sm sm:px-6 lg:col-span-5">
                    {rows.map((row) => {
                        const Arrow = row.external ? ArrowOutIcon : ArrowRightIcon;
                        return (
                            <li key={row.href} className="border-b border-white/12 last:border-b-0">
                                <a
                                    href={row.href}
                                    className="group flex items-center justify-between gap-4 py-5"
                                    {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                >
                                    <span className="min-w-0">
                                        <span className="eyebrow block text-xs uppercase tracking-[0.2em] text-chalk/60">{row.label}</span>
                                        <span className="mt-1 block font-display text-lg font-medium [overflow-wrap:anywhere] sm:text-xl">{row.value}</span>
                                    </span>
                                    <Arrow className="h-5 w-5 shrink-0 text-chalk/50 transition group-hover:translate-x-1 group-hover:text-chalk" />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </NightBand>
    );
}
