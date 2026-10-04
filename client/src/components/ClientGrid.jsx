// the client logos, one tile each. the whole tile is the link to their site.
// to add a client: put the logo in public/images/clients and add it to CLIENTS in src/data/site.js
import { useLocale } from '../context/LocaleContext.jsx';
import { CLIENTS } from '../data/site.js';
import { ArrowOutIcon } from './ui/Icons.jsx';

export default function ClientGrid() {
    const { t } = useLocale();

    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENTS.map((client) => (
                <li key={client.name}>
                    <a
                        href={client.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full flex-col rounded-3xl border border-line bg-paper-bright/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-ink/40 hover:shadow-[0_18px_40px_rgba(31,26,23,0.10)]"
                    >
                        <div className="flex h-44 items-center justify-center sm:h-52">
                            <img
                                src={client.logo}
                                alt=""
                                width={client.width}
                                height={client.height}
                                loading="lazy"
                                className="max-h-full w-auto max-w-[78%] object-contain"
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                            <span className="font-display font-medium">{client.name}</span>
                            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                                {t.home.visit}
                                <ArrowOutIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
}
