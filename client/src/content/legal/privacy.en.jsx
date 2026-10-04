// Privacy Policy (English).
// the text of the old privacy.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: 'Privacy Policy - GradientV',
    description: 'How GradientV collects, uses, and protects information gathered through this website, explained in plain language.',
    label: 'Legal',
    heading: 'Privacy Policy',
    updated: 'Last updated: September 1, 2026'
};

export default function PrivacyEn() {
    return (
        <>
            <p>GradientV LLC, doing business as GradientV, is a technology agency based in New York City and Stony Brook, New York. This policy explains what information we collect through this website, how we use it, and the choices you have. We keep it short and plain on purpose.</p>
            <h2>Information we collect</h2>
            <p>We collect only what we need to respond to you and keep the site running:</p>
            <ul>
                <li><strong>Contact details you provide.</strong> If you send us a message through a contact form or by email, we collect your name, email address, and the contents of your message.</li>
                <li><strong>Basic usage data.</strong> Like most websites, our hosting and analytics record aggregated information such as the pages visited, referring site, browser type, device type, and general location by country.</li>
                <li><strong>Cookies.</strong> This site sets no cookies. See the cookies section below.</li>
            </ul>
            <h2>How we use your information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Respond to your inquiries and follow up about a possible engagement.</li>
                <li>Understand how the site is used so we can improve it.</li>
                <li>Keep the site secure and working as intended.</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
            <h2>Cookies and analytics</h2>
            <p>This site uses Vercel Web Analytics to measure general traffic, such as how many people visit a page. It is cookieless: it sets no cookies, does not use browser fingerprinting, and does not track you across other websites. It does not collect data that identifies you personally, and we do not use it to build advertising profiles.</p>
            <p>Because no cookies are involved, there is nothing here for you to accept or decline, and the site works exactly the same either way.</p>
            <h2>Third-party services</h2>
            <p>We rely on a small number of third-party providers to operate the site. The site is hosted by Vercel, which also provides the analytics described above, and we use Google Workspace for email. These providers process data on our behalf and only for the purposes described here. We encourage you to review the privacy practices of any service you interact with.</p>
            <h2>Data retention</h2>
            <p>We keep contact messages only as long as needed to respond to you and to maintain a record of our correspondence, then delete them when they are no longer needed. Aggregated analytics data may be kept longer because it does not identify you personally.</p>
            <h2>Your rights</h2>
            <p>You can ask us to show you the personal information we hold about you, to correct it, or to delete it. To make a request, contact us using the details below and we will respond within a reasonable time.</p>
            <h2>Contact us</h2>
            <p>If you have questions about this policy or your data, email us at <a href="mailto:contact@gradientv.com">contact@gradientv.com</a> or reach us through our <Link to="/contact">contact page</Link>.</p>
        </>
    );
}
