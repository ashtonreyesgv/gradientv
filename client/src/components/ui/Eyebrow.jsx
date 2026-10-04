// the small uppercase label that sits above a heading.
// the little triangle is the V from the logo, pointing down. it's pinned beside
// the first line, so a label long enough to wrap still looks right.
// onNight = it's inside a dark band, so it switches to the light color
export default function Eyebrow({ children, onNight = false, className = '' }) {
    return (
        <p className={`eyebrow flex items-start gap-2.5 text-[0.78rem] font-medium uppercase tracking-[0.2em] ${onNight ? 'text-chalk/65' : 'text-ink-soft'} ${className}`}>
            <span
                aria-hidden="true"
                className={`mt-[0.42em] h-0 w-0 shrink-0 border-x-[5px] border-t-[8px] border-x-transparent ${onNight ? 'border-t-chalk/65' : 'border-t-ink'}`}
            />
            {children}
        </p>
    );
}
