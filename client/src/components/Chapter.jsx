// one numbered section of the Story page.
// on a wide screen the heading stays put on the left while its text scrolls
// past on the right. on a phone it's just a heading with the text under it
export default function Chapter({ id, number, heading, children }) {
    return (
        <section id={id} className="border-t border-line">
            <div className="wrap grid gap-8 py-16 md:grid-cols-12 md:gap-10 md:py-24">
                <header className="md:col-span-4">
                    <div className="md:sticky md:top-28">
                        {/* the number is decoration, a screen reader only needs the heading */}
                        <p aria-hidden="true" className="font-display text-sm font-medium text-ink-mute">{number}</p>
                        <h2 className="display-lg mt-2">{heading}</h2>
                    </div>
                </header>
                <div className="md:col-span-8">{children}</div>
            </div>
        </section>
    );
}
