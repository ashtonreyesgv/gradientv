// Accessibility Statement (English).
// the text of the old accessibility.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: 'Accessibility - GradientV',
    description: "GradientV's accessibility statement: the WCAG 2.1 AA standard we build to, our ongoing testing, and how to report a barrier.",
    label: 'Legal',
    heading: 'Accessibility Statement',
    updated: 'Last updated: September 1, 2026'
};

export default function AccessibilityEn() {
    return (
        <>
            <p>GradientV LLC, doing business as GradientV, is committed to digital accessibility. We want this site to be usable by as many people as possible, including people who rely on assistive technology.</p>
            <h2>The standard we build to</h2>
            <p>We build this site to the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. That means we aim for sufficient color contrast, clear heading structure, descriptive text alternatives for images, and content that works with a keyboard and a screen reader.</p>
            <h2>An ongoing effort</h2>
            <p>Accessibility is ongoing work, not a one-time task. We test the site with automated tools and make fixes as we find issues. We know automated tools do not catch everything, so we keep reviewing as the site changes. We do not claim formal certification or full conformance.</p>
            <h2>Tell us about a barrier</h2>
            <p>If you run into anything on this site that is hard to use or read, we want to hear about it. Email us at <a href="mailto:contact@gradientv.com">contact@gradientv.com</a> or reach us through our <Link to="/contact">contact page</Link>, and please tell us the page and what happened. We will do our best to fix it and to help you get the information you need in the meantime.</p>
        </>
    );
}
