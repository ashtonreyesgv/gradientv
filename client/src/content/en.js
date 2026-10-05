// every English word on the site, one object.
// es.js and zh.js have the exact same shape, so a view just reads t.home.lead
// and never needs to know which language it's showing.
// the long legal documents are separate, in src/content/legal

export default {
    code: 'en',
    htmlLang: 'en',       // <html lang>
    hreflang: 'en',       // what search engines call this language
    ogLocale: 'en_US',    // what link previews call it
    languageName: 'English',

    nav: {
        label: 'Main',
        home: 'GradientV home',
        skip: 'Skip to content',
        clients: 'Clients',
        story: 'Story',
        team: 'Team',
        contact: 'Contact',
        login: 'Client login',
        openMenu: 'Open menu',
        closeMenu: 'Close menu'
    },

    footer: {
        site: 'Site',
        legal: 'Legal',
        language: 'Language',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        accessibility: 'Accessibility',
        copyright: '© 2026 GradientV LLC. All rights reserved.'
    },

    // the little link buttons under a person
    links: {
        website: 'Website',
        linkedin: 'LinkedIn',
        github: 'GitHub'
    },

    home: {
        seo: {
            title: 'GradientV',
            description: 'GradientV builds custom software, websites, AI-powered dashboards, and workflow automation for growing small businesses. Practical AI implementation without unnecessary complexity.'
        },
        eyebrow: 'Custom software and AI for growing businesses',
        // two lines, the second one is drawn quieter
        headline: ['Modernize your business.', 'Build competitive advantage.'],
        lead: 'GradientV builds custom software that reduces repetitive work, improves decision-making, and helps you operate smarter than your competition.',
        primaryCta: 'Start a conversation',
        secondaryCta: 'Read our story',
        buildLabel: 'What we build',
        builds: ['Websites', 'Internal tools', 'AI-powered dashboards', 'Workflow automation'],
        clientsLabel: 'Selected clients',
        visit: 'Visit site'
    },

    contact: {
        seo: {
            title: 'Contact - GradientV',
            description: 'Get in touch with GradientV about custom software, websites, AI dashboards, and workflow automation for your business. Call (917) 907-1034 or email contact@gradientv.com.'
        },
        label: 'Contact',
        heading: "Let's build a smarter operating system for your business.",
        text: 'GradientV is focused on practical AI implementation for companies that want modern systems without unnecessary complexity.',
        phone: 'Phone',
        email: 'Email',
        linkedin: 'LinkedIn'
    },

    story: {
        seo: {
            title: 'Story - GradientV',
            description: 'Why GradientV exists: small businesses are offered either a six-figure engineering hire or software they cannot control. We build the third option, and help them adopt AI along the way.'
        },
        label: 'Story',
        heading: "Software shouldn't be a luxury.",
        lead: "Most small businesses are handed two options: hire a software engineer at a salary they can't justify, or rent software they don't control. GradientV exists to offer a third.",
        gap: {
            heading: 'The gap.',
            body: [
                'Custom software has never been more capable, and for most small businesses it has never felt further out of reach. The companies that would benefit most from software built around how they actually work are the ones least able to get it.',
                "That isn't because the technology is hard to come by. It's because of how it's sold."
            ],
            // the two choices a small business is normally left with
            options: [
                {
                    title: 'Hire an engineer',
                    cost: 'Six figures, before line one',
                    text: 'A full-time salary, benefits, and a hiring process most owners have no time to run, all committed to before anyone knows whether the role is even a full year of work. For a company of fifteen people, that is not a hire. That is a bet on the whole budget.'
                },
                {
                    title: 'Rent a SaaS product',
                    cost: 'Fast to start, fixed forever',
                    text: "Cheap to begin and genuinely useful, right up to the point where you need it to do something its makers didn't plan for. You end up adapting your business to the tool, and the parts you most want to change are exactly the parts you aren't allowed to touch."
                }
            ]
        },
        middle: {
            label: 'What we do',
            heading: "We're the middle path, and the middle man.",
            body: [
                "GradientV builds and runs the software so you don't have to hire for it, and builds it around how you already work so you aren't bending to someone else's product roadmap. You get systems that fit, without taking on an engineering department to keep them running.",
                "We're also the face of the technical work. One person to call, who explains what's happening in plain language rather than in jargon, and who is accountable when something needs to change. You should never have to become technical to get software that works for you. That translation is our job, not yours."
            ]
        },
        ai: {
            heading: 'Adapting with AI.',
            body: [
                'AI is where this gap is widest right now. The tools are real and genuinely useful, and most small businesses still have no practical way in. The guidance available is either marketing copy or a research paper, and neither tells an owner what to actually do on Monday.',
                "We approach it the way we approach everything else. Start with the bottleneck that's actually costing you time, apply the smallest thing that solves it, and make sure you understand what it does and where it stops. No rebuilding how you operate around a trend, and no dependence on something nobody at your company can explain.",
                "Adopting AI well is mostly a matter of judgment about which problems are worth pointing it at. That judgment is the part we're here to supply."
            ]
        },
        founder: {
            heading: "Who you're working with.",
            role: 'Founder & aspiring Software Engineer',
            body: [
                "I started GradientV because I kept running into the same gap from both sides. I'm a Computer Science and Applied Mathematics student at Stony Brook University, focused on data science, machine learning, and applied AI systems, and I kept meeting small business owners who needed exactly that kind of work and had nowhere sensible to get it.",
                'My background includes coursework in data science, data mining, machine learning, and analytics. I will be joining CRIZM, an AI-powered platform built to support grading workflows, feedback systems, and academic outcomes reporting as an Undergraduate Researcher and hope to gain experience that I can further implement in my work at GradientV.',
                "I call myself an aspiring software engineer on purpose. I'm early in my career, I'm still learning, and I would rather say that plainly than oversell it. What I can promise is that I'll be direct about what I can build, honest about what I can't, and that you'll always be talking to the person actually doing the work."
            ],
            teamLink: 'Meet the rest of the team'
        }
    },

    team: {
        seo: {
            title: 'Team - GradientV',
            description: 'Meet the team behind GradientV, an AI consulting studio based in New York City and Stony Brook, New York.'
        },
        label: 'Team',
        heading: 'Meet the team.',
        portraitAlt: (name) => `Portrait of ${name}`,
        storyLink: 'Read the full story',
        // keyed by the person's id in src/data/team.js
        members: {
            ashton: {
                role: 'Founder',
                bio: "I'm Ashton Reyes, founder of GradientV, with a background in Computer Science and Applied Mathematics and a focus on data science, machine learning, and applied AI systems."
            },
            jorel: {
                role: 'Head of Strategy & Growth',
                bio: 'Jorel Chan leads strategy and growth at GradientV, shaping how the company identifies opportunities and builds lasting relationships with clients and partners.'
            },
            bryce: {
                role: 'Head of Engineering',
                bio: "Bryce Whiteside leads engineering at GradientV, overseeing the technical architecture and execution behind the team's products and client work."
            },
            emily: {
                role: 'Head of Marketing & Finance',
                bio: "Emily Fisherman leads marketing and finance at GradientV, connecting the company's technical work to clear messaging and sound financial decisions."
            }
        }
    },

    login: {
        seo: {
            title: 'Client login - GradientV',
            description: 'Sign in to the GradientV client portal.'
        },
        label: 'Client portal',
        heading: 'Sign in',
        intro: 'For GradientV clients.',
        email: 'Email',
        password: 'Password',
        submit: 'Sign in',
        sending: 'Signing in…',
        // shown after pressing Sign in, until the server exists
        notOpen: 'The client portal is not open yet, so there is nothing to sign in to today. For anything about your project, reach us directly.',
        contact: 'Contact us',
        status: 'Opening soon',
        pitchHeading: 'One place for everything we build for you.',
        pitchText: 'The portal is where clients will check their site stats and project updates. It is being built now.'
    },

    // the two pages behind the login are English only for now, like videos

    // where an invite link lands
    setPassword: {
        seo: {
            title: 'Choose your password - GradientV',
            description: 'Choose a password for the GradientV client portal.'
        },
        label: 'Client portal',
        heading: 'Choose your password',
        checking: 'Checking your link…',
        introFor: 'This sets up the login for',
        email: 'Email',
        password: 'New password',
        confirm: 'Type it again',
        hint: 'At least 10 characters.',
        submit: 'Save and sign in',
        sending: 'Saving…',
        mismatch: 'Those two passwords are not the same.',
        badLink: 'This link does not work anymore. It was already used, or it is more than 7 days old. Ask us for a new one.',
        contact: 'Contact us'
    },

    portal: {
        seo: {
            title: 'Client portal - GradientV',
            description: 'The GradientV client portal.'
        },
        label: 'Client portal',
        checking: 'Checking who is signed in…',
        signedInAs: 'Signed in as',
        signOut: 'Sign out',
        signingOut: 'Signing out…',
        requests: {
            heading: 'Requests',
            intro: 'Tell us what you would like changed on your site.',
            label: 'What would you like changed?',
            placeholder: 'For example: we close at 9pm on Fridays now.',
            submit: 'Send request',
            sending: 'Sending…',
            sent: 'Sent. We will take a look.',
            loading: 'Loading requests…',
            listHeading: 'What you have sent',
            empty: 'Nothing sent yet.',
            // the keys are the statuses the server uses (server/src/models/ChangeRequest.js)
            status: {
                'new': 'New',
                'in progress': 'In progress',
                'done': 'Done'
            },
            // what the admin login sees instead of the box
            inboxHeading: 'Requests from clients',
            inboxEmpty: 'No requests yet.',
            statusLabel: 'Status'
        },
        stats: {
            heading: 'Site stats',
            soon: 'Visitors and page views for your site. This is being built next.'
        }
    },

    notFound: {
        seo: {
            title: 'Page Not Found - GradientV',
            description: 'This page moved, or never existed.'
        },
        label: 'Error 404',
        heading: 'This page moved, or never existed.',
        body: 'The link you followed points somewhere we do not have a page. Nothing is broken on your end. Head back to the homepage, or tell us what you were looking for and we will point you to it.',
        home: 'Back to home',
        contact: 'Contact us',
        work: 'See our work'
    },

    // English only. the page is not in the nav
    videos: {
        seo: {
            title: 'Videos - GradientV',
            description: 'A short introduction to GradientV, an AI consulting studio helping growing businesses adopt AI through modern websites, workflow automation, and AI-powered dashboards.'
        },
        heading: 'Videos',
        title: 'GradientV Introduction',
        text: 'Meet the team behind GradientV and learn about our mission to help businesses adopt AI in practical, measurable ways.',
        captions: 'English',
        unsupported: "Your browser doesn't support HTML5 video. Please update your browser.",
        summaryHeading: 'Video summary',
        summary: [
            'In this short introduction, the GradientV team shares who they are and how the studio helps growing businesses adopt AI in practical, measurable ways, from modern websites and workflow automation to AI-powered dashboards and internal assistants.',
            'This video has no narration. Its only audio is an instrumental music track, so nothing spoken is missed by watching it without sound. Captions identifying the music are available through the player.'
        ]
    }
};
