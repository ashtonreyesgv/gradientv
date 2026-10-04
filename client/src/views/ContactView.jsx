// the Contact page. it's the same band the home page ends with,
// just with the heading promoted to the page's main heading
import ContactBand from '../components/ContactBand.jsx';
import Seo from '../components/Seo.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { pageUrl } from '../data/pages.js';
import { contactSchema } from '../data/schema.js';

export default function ContactView() {
    const { locale, t } = useLocale();

    return (
        <>
            <Seo
                pageId="contact"
                title={t.contact.seo.title}
                description={t.contact.seo.description}
                schema={contactSchema(t, pageUrl('contact', locale))}
            />
            {/* a strip of paper above the band so its slant has something to cut into */}
            <div className="relative h-10 md:h-16">
                <div className="tx tx-waves" aria-hidden="true" />
            </div>
            <ContactBand as="h1" />
        </>
    );
}
