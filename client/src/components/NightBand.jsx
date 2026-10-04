// a full-width dark band with the blue ribs texture coming in from the right.
// it starts on a slant instead of a straight edge (.slope-top in gradientv.css).
// the contact section and the "what we do" part of the Story page both sit in one
export default function NightBand({ id, children }) {
    return (
        <section id={id} className="on-night slope-top relative overflow-hidden bg-night text-chalk">
            <div className="tx tx-oculus" aria-hidden="true" />
            {/* the extra padding on top makes room for the slant */}
            <div className="wrap relative pt-28 pb-20 md:pt-40 md:pb-28">
                {children}
            </div>
        </section>
    );
}
