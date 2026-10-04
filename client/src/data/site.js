// facts about the company that are the same in every language.
// the words around them (labels, headings) live in src/content

export const SITE_URL = 'https://gradientv.com';

export const COMPANY = {
    name: 'GradientV',
    legalName: 'GradientV LLC',
    phone: { label: '(917) 907-1034', href: 'tel:9179071034', schema: '+1-917-907-1034' },
    email: 'contact@gradientv.com',
    linkedin: { label: 'linkedin.com/company/gradientv', href: 'https://www.linkedin.com/company/gradientv' }
};

/** the picture that shows up when a link to the site is shared */
export const SHARE_IMAGE = {
    url: `${SITE_URL}/images/brand/og-cover.png`,
    width: 1200,
    height: 630
};

/** logo is the image file, width + height stop the page jumping while it loads */
export const CLIENTS = [
    {
        name: 'InfoReporting Solutions',
        href: 'https://inforeportingsolutions.vercel.app/',
        logo: '/images/clients/inforeportingsolutionsnew.png',
        width: 657,
        height: 561
    },
    {
        name: 'Bukas Cafe',
        href: 'https://bukascafe.vercel.app/',
        logo: '/images/clients/bukascafe.png',
        width: 825,
        height: 829
    },
    {
        name: 'Swabe Food Truck',
        href: 'https://swabefoodtruck.com/',
        logo: '/images/clients/swabefoodtruck.png',
        width: 1400,
        height: 1185
    }
];
