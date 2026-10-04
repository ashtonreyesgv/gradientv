// Terms of Service (English).
// the text of the old terms.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: 'Terms of Service - GradientV',
    description: 'The terms that govern your use of the GradientV website and the services described on it.',
    label: 'Legal',
    heading: 'Terms of Service',
    updated: 'Last updated: September 1, 2026'
};

export default function TermsEn() {
    return (
        <>
            <p>These terms apply to your use of the website operated by GradientV LLC, doing business as GradientV ("GradientV", "we", or "us"). By visiting and using this site, you agree to them. If you do not agree, please do not use the site.</p>
            <h2>Acceptable use</h2>
            <p>You agree to use this site lawfully and respectfully. You agree not to:</p>
            <ul>
                <li>Attempt to disrupt, overload, or gain unauthorized access to the site or its systems.</li>
                <li>Copy, scrape, or republish site content in a way that is not permitted below.</li>
                <li>Use the site to send unlawful, harmful, or misleading content.</li>
            </ul>
            <h2>Intellectual property</h2>
            <p>The content on this site, including text, design, graphics, the GradientV name, and logo, belongs to GradientV LLC unless otherwise noted. You may view and share links to our pages, but you may not reuse our content for commercial purposes without our written permission.</p>
            <h2>Client engagements</h2>
            <p>These terms cover the website only. Any paid work between GradientV LLC and a client is governed by a separate signed Client Service Agreement. Where that agreement and these site terms differ, the signed agreement controls for that engagement.</p>
            <h2>Disclaimer of warranties</h2>
            <p>This website is provided on an "as is" and "as available" basis. We work to keep it accurate and available, but we do not guarantee that it will be error free, uninterrupted, or current. Your use of the site is at your own risk.</p>
            <h2>Limitation of liability</h2>
            <p>To the fullest extent permitted by law, GradientV LLC is not liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, this website. This section concerns the website itself and does not limit any obligations set out in a signed Client Service Agreement.</p>
            <h2>Governing law</h2>
            <p>These terms are governed by the laws of the State of New York, without regard to its conflict of laws rules.</p>
            <h2>Changes to these terms</h2>
            <p>We may update these terms from time to time. When we do, we will revise the "Last updated" date above. Continued use of the site after a change means you accept the updated terms.</p>
            <h2>Contact us</h2>
            <p>If you have questions about these terms, email us at <a href="mailto:contact@gradientv.com">contact@gradientv.com</a> or reach us through our <Link to="/contact">contact page</Link>.</p>
        </>
    );
}
