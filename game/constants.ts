export const COLORS = {
    BACKGROUND: '#000000',
    WHITE_BEAM: '#FFFFFF',
    RED: '#FF3366',
    GREEN: '#33FF99',
    BLUE: '#33CCFF',
    TARGET_GLOW: '#rgba(255, 255, 255, 0.4)',
    MENU_AMBIENT: ['#FF3366', '#33FF99', '#33CCFF', '#FFFFFF']
};

export const PHYSICS = {
    MAX_PRISMS: 6,
    PRISM_RADIUS: 35,
    TARGET_RADIUS: 50,
    BEAM_WIDTH: 5,
    PARTICLE_LIFETIME: 25,
    OBSTACLE_SIZE: 50,
};

export const LEVELS = [
    {
        id: 1,
        name: 'FIRST LIGHT',
        source: { x: 200, y: 120 },
        targets: [
            { x: 100, y: 600, color: COLORS.RED },
            { x: 300, y: 600, color: COLORS.BLUE },
        ],
        obstacles: []
    },
    {
        id: 2,
        name: 'SPECTRUM',
        source: { x: 200, y: 120 },
        targets: [
            { x: 50, y: 700, color: COLORS.RED },
            { x: 200, y: 700, color: COLORS.GREEN },
            { x: 350, y: 700, color: COLORS.BLUE },
        ],
        obstacles: []
    },
    {
        id: 3,
        name: 'MIRROR BOUNCE',
        source: { x: 100, y: 120 },
        targets: [
            { x: 50, y: 750, color: COLORS.RED },
            { x: 350, y: 750, color: COLORS.BLUE },
        ],
        obstacles: [
            { id: 'm1', position: { x: 200, y: 450 }, width: 120, height: 15, isMirror: true }
        ]
    },
    {
        id: 4,
        name: 'LIGHT LAB',
        source: { x: 200, y: 120 },
        targets: [
            { x: 50, y: 400, color: COLORS.GREEN },
            { x: 350, y: 400, color: COLORS.BLUE },
            { x: 200, y: 750, color: COLORS.RED },
        ],
        obstacles: [
            { id: 'b1', position: { x: 200, y: 350 }, width: 100, height: 100, isMirror: false }
        ]
    },
    {
        id: 5,
        name: 'CHAMBER',
        source: { x: 50, y: 120 },
        targets: [
            { x: 100, y: 750, color: COLORS.RED },
            { x: 200, y: 250, color: COLORS.GREEN },
            { x: 350, y: 700, color: COLORS.BLUE },
        ],
        obstacles: [
            { id: 'm2', position: { x: 250, y: 200 }, width: 150, height: 15, isMirror: true },
            { id: 'm3', position: { x: 150, y: 550 }, width: 15, height: 120, isMirror: true },
        ]
    }
];
