// the people, in the order they show on the Team page.
// names, photos and links are the same in every language, so they live here.
// each person's role and bio are words, so those live in src/content under team.members[id]
//
// size decides the layout:
//   'feature' = big photo beside the bio (the founder)
//   'card'    = photo card
//   'small'   = one slim row with initials, for someone without a photo yet.
//               to upgrade a person: drop a photo in public/images/team, set photo, change size to 'card'

export const TEAM = [
    {
        id: 'ashton',
        name: 'Ashton Reyes',
        initials: 'AR',
        size: 'feature',
        photo: { src: '/images/team/founder.jpg', width: 1179, height: 1457 },
        links: [
            { kind: 'website', href: 'https://ashtonreyes.com/' },
            { kind: 'linkedin', href: 'https://www.linkedin.com/in/ashton-reyes/' },
            { kind: 'github', href: 'https://github.com/ashton-reyes' }
        ]
    },
    {
        id: 'jorel',
        name: 'Jorel Chan',
        initials: 'JC',
        size: 'card',
        photo: { src: '/images/team/jorel-chan.jpg', width: 400, height: 400 },
        links: [
            { kind: 'linkedin', href: 'https://www.linkedin.com/in/jorel-chan-755ba4350/' }
        ]
    },
    {
        id: 'bryce',
        name: 'Bryce Whiteside',
        initials: 'BW',
        size: 'card',
        photo: { src: '/images/team/bryce-whiteside.jpg', width: 400, height: 400 },
        links: [
            { kind: 'linkedin', href: 'https://www.linkedin.com/in/brycewhiteside/' },
            { kind: 'github', href: 'https://github.com/Brycewhi' }
        ]
    },
    {
        id: 'emily',
        name: 'Emily Fisherman',
        initials: 'EF',
        size: 'small',
        photo: null,
        links: [
            { kind: 'linkedin', href: 'https://www.linkedin.com/in/emilyfisherman/' }
        ]
    }
];

export const FOUNDER = TEAM.find((person) => person.id === 'ashton');
