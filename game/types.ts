export type Point = { x: number; y: number };

export type Beam = {
    start: Point;
    end: Point;
    color: string;
    width: number;
};

export type Prism = {
    id: string;
    position: Point;
    angle: number;
};

export type Target = {
    id: string;
    position: Point;
    color: string;
    hit: boolean;
};

export type Obstacle = {
    id: string;
    position: Point;
    width: number;
    height: number;
    isMirror: boolean;
};

export type Particle = {
    id: string;
    position: Point;
    velocity: Point;
    color: string;
    life: number;
    size: number;
};

export type LevelState = {
    levelId: number;
    source: Point;
    targets: Target[];
    obstacles: Obstacle[];
    prisms: Prism[];
    beams: Beam[];
    particles: Particle[];
    combo: number;
    cleared: boolean;
};
