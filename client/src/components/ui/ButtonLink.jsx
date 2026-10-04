// a link that looks like a button. two looks, so a button can't be almost right:
//   solid   = the main thing to do on the page
//   outline = everything else
import { Link } from 'react-router';

export const BUTTON_STYLES = {
    base: 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
    solid: 'bg-ink text-paper hover:bg-accent',
    outline: 'border border-ink/70 text-ink hover:bg-ink hover:text-paper'
};

export default function ButtonLink({ to, variant = 'outline', className = '', children, ...rest }) {
    return (
        <Link to={to} className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${className}`} {...rest}>
            {children}
        </Link>
    );
}
